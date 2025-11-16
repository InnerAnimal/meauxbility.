#!/bin/bash

################################################################################
# Cloudflare Setup Script for meauxbility.org
# Purpose: Automated Cloudflare DNS, SSL, Security, and Performance Configuration
# Requirements: curl, jq, valid Cloudflare API token
################################################################################

set -e  # Exit on error
set -u  # Exit on undefined variable

# Color codes for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
DOMAIN="${DOMAIN:-meauxbility.org}"
CLOUDFLARE_API_TOKEN="${CLOUDFLARE_API_TOKEN:-}"
CF_API_BASE="https://api.cloudflare.com/v4"

# Vercel IPs for DNS configuration
VERCEL_IP="76.76.21.21"
VERCEL_CNAME="cname.vercel-dns.com"

################################################################################
# Helper Functions
################################################################################

log_info() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

log_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

log_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

check_requirements() {
    log_info "Checking requirements..."

    if ! command -v curl &> /dev/null; then
        log_error "curl is not installed. Please install curl first."
        exit 1
    fi

    if ! command -v jq &> /dev/null; then
        log_error "jq is not installed. Please install jq first."
        exit 1
    fi

    if [ -z "$CLOUDFLARE_API_TOKEN" ]; then
        log_error "CLOUDFLARE_API_TOKEN environment variable is not set."
        echo "Please set it with: export CLOUDFLARE_API_TOKEN='your_token'"
        exit 1
    fi

    log_success "All requirements met"
}

verify_token() {
    log_info "Verifying Cloudflare API token..."

    response=$(curl -s -X GET "${CF_API_BASE}/user/tokens/verify" \
        -H "Authorization: Bearer ${CLOUDFLARE_API_TOKEN}" \
        -H "Content-Type: application/json")

    success=$(echo "$response" | jq -r '.success')

    if [ "$success" != "true" ]; then
        log_error "API token verification failed"
        echo "$response" | jq '.'
        exit 1
    fi

    log_success "API token verified"
}

get_account_id() {
    log_info "Fetching Cloudflare account ID..."

    response=$(curl -s -X GET "${CF_API_BASE}/accounts" \
        -H "Authorization: Bearer ${CLOUDFLARE_API_TOKEN}" \
        -H "Content-Type: application/json")

    ACCOUNT_ID=$(echo "$response" | jq -r '.result[0].id')

    if [ "$ACCOUNT_ID" = "null" ] || [ -z "$ACCOUNT_ID" ]; then
        log_error "Failed to fetch account ID"
        echo "$response" | jq '.'
        exit 1
    fi

    log_success "Account ID: $ACCOUNT_ID"
}

check_zone_exists() {
    log_info "Checking if zone exists for $DOMAIN..."

    response=$(curl -s -X GET "${CF_API_BASE}/zones?name=${DOMAIN}" \
        -H "Authorization: Bearer ${CLOUDFLARE_API_TOKEN}" \
        -H "Content-Type: application/json")

    ZONE_ID=$(echo "$response" | jq -r '.result[0].id')

    if [ "$ZONE_ID" = "null" ] || [ -z "$ZONE_ID" ]; then
        log_warning "Zone does not exist. Will create new zone."
        return 1
    else
        log_success "Zone exists with ID: $ZONE_ID"
        return 0
    fi
}

create_zone() {
    log_info "Creating zone for $DOMAIN..."

    response=$(curl -s -X POST "${CF_API_BASE}/zones" \
        -H "Authorization: Bearer ${CLOUDFLARE_API_TOKEN}" \
        -H "Content-Type: application/json" \
        --data "{\"name\":\"${DOMAIN}\",\"account\":{\"id\":\"${ACCOUNT_ID}\"},\"jump_start\":true}")

    ZONE_ID=$(echo "$response" | jq -r '.result.id')

    if [ "$ZONE_ID" = "null" ] || [ -z "$ZONE_ID" ]; then
        log_error "Failed to create zone"
        echo "$response" | jq '.'
        exit 1
    fi

    # Get nameservers
    NAMESERVERS=$(echo "$response" | jq -r '.result.name_servers[]')

    log_success "Zone created with ID: $ZONE_ID"
    log_info "Nameservers assigned:"
    echo "$NAMESERVERS"

    # Save nameservers to file
    echo "$NAMESERVERS" > cloudflare-nameservers.txt
    log_info "Nameservers saved to cloudflare-nameservers.txt"
}

configure_dns_records() {
    log_info "Configuring DNS records..."

    # Get existing DNS records
    existing_records=$(curl -s -X GET "${CF_API_BASE}/zones/${ZONE_ID}/dns_records" \
        -H "Authorization: Bearer ${CLOUDFLARE_API_TOKEN}" \
        -H "Content-Type: application/json")

    # Function to create or update DNS record
    create_or_update_record() {
        local record_type=$1
        local record_name=$2
        local record_content=$3
        local proxied=$4

        # Check if record exists
        existing_id=$(echo "$existing_records" | jq -r ".result[] | select(.type==\"${record_type}\" and .name==\"${record_name}\") | .id")

        if [ -n "$existing_id" ] && [ "$existing_id" != "null" ]; then
            log_info "Updating existing ${record_type} record for ${record_name}..."
            response=$(curl -s -X PUT "${CF_API_BASE}/zones/${ZONE_ID}/dns_records/${existing_id}" \
                -H "Authorization: Bearer ${CLOUDFLARE_API_TOKEN}" \
                -H "Content-Type: application/json" \
                --data "{\"type\":\"${record_type}\",\"name\":\"${record_name}\",\"content\":\"${record_content}\",\"proxied\":${proxied},\"ttl\":1}")
        else
            log_info "Creating new ${record_type} record for ${record_name}..."
            response=$(curl -s -X POST "${CF_API_BASE}/zones/${ZONE_ID}/dns_records" \
                -H "Authorization: Bearer ${CLOUDFLARE_API_TOKEN}" \
                -H "Content-Type: application/json" \
                --data "{\"type\":\"${record_type}\",\"name\":\"${record_name}\",\"content\":\"${record_content}\",\"proxied\":${proxied},\"ttl\":1}")
        fi

        success=$(echo "$response" | jq -r '.success')
        if [ "$success" = "true" ]; then
            log_success "${record_type} record configured for ${record_name}"
        else
            log_error "Failed to configure ${record_type} record for ${record_name}"
            echo "$response" | jq '.'
        fi
    }

    # Create A record for apex domain
    create_or_update_record "A" "${DOMAIN}" "${VERCEL_IP}" "true"

    # Create CNAME record for www subdomain
    create_or_update_record "CNAME" "www.${DOMAIN}" "${VERCEL_CNAME}" "true"

    log_success "DNS records configured"
}

configure_ssl_tls() {
    log_info "Configuring SSL/TLS settings..."

    # Set SSL mode to Full (Strict)
    response=$(curl -s -X PATCH "${CF_API_BASE}/zones/${ZONE_ID}/settings/ssl" \
        -H "Authorization: Bearer ${CLOUDFLARE_API_TOKEN}" \
        -H "Content-Type: application/json" \
        --data '{"value":"strict"}')

    if [ "$(echo "$response" | jq -r '.success')" = "true" ]; then
        log_success "SSL mode set to Full (Strict)"
    else
        log_error "Failed to set SSL mode"
    fi

    # Enable Always Use HTTPS
    response=$(curl -s -X PATCH "${CF_API_BASE}/zones/${ZONE_ID}/settings/always_use_https" \
        -H "Authorization: Bearer ${CLOUDFLARE_API_TOKEN}" \
        -H "Content-Type: application/json" \
        --data '{"value":"on"}')

    if [ "$(echo "$response" | jq -r '.success')" = "true" ]; then
        log_success "Always Use HTTPS enabled"
    else
        log_error "Failed to enable Always Use HTTPS"
    fi

    # Enable Automatic HTTPS Rewrites
    response=$(curl -s -X PATCH "${CF_API_BASE}/zones/${ZONE_ID}/settings/automatic_https_rewrites" \
        -H "Authorization: Bearer ${CLOUDFLARE_API_TOKEN}" \
        -H "Content-Type: application/json" \
        --data '{"value":"on"}')

    if [ "$(echo "$response" | jq -r '.success')" = "true" ]; then
        log_success "Automatic HTTPS Rewrites enabled"
    else
        log_error "Failed to enable Automatic HTTPS Rewrites"
    fi

    # Set Minimum TLS Version to 1.2
    response=$(curl -s -X PATCH "${CF_API_BASE}/zones/${ZONE_ID}/settings/min_tls_version" \
        -H "Authorization: Bearer ${CLOUDFLARE_API_TOKEN}" \
        -H "Content-Type: application/json" \
        --data '{"value":"1.2"}')

    if [ "$(echo "$response" | jq -r '.success')" = "true" ]; then
        log_success "Minimum TLS version set to 1.2"
    else
        log_error "Failed to set minimum TLS version"
    fi

    # Enable TLS 1.3
    response=$(curl -s -X PATCH "${CF_API_BASE}/zones/${ZONE_ID}/settings/tls_1_3" \
        -H "Authorization: Bearer ${CLOUDFLARE_API_TOKEN}" \
        -H "Content-Type: application/json" \
        --data '{"value":"on"}')

    if [ "$(echo "$response" | jq -r '.success')" = "true" ]; then
        log_success "TLS 1.3 enabled"
    else
        log_error "Failed to enable TLS 1.3"
    fi

    log_success "SSL/TLS configuration completed"
}

configure_security() {
    log_info "Configuring security settings..."

    # Enable Bot Fight Mode (Free tier)
    response=$(curl -s -X PATCH "${CF_API_BASE}/zones/${ZONE_ID}/settings/bot_fight_mode" \
        -H "Authorization: Bearer ${CLOUDFLARE_API_TOKEN}" \
        -H "Content-Type: application/json" \
        --data '{"value":"on"}')

    if [ "$(echo "$response" | jq -r '.success')" = "true" ]; then
        log_success "Bot Fight Mode enabled"
    else
        log_warning "Failed to enable Bot Fight Mode (may require paid plan)"
    fi

    # Enable Browser Integrity Check
    response=$(curl -s -X PATCH "${CF_API_BASE}/zones/${ZONE_ID}/settings/browser_check" \
        -H "Authorization: Bearer ${CLOUDFLARE_API_TOKEN}" \
        -H "Content-Type: application/json" \
        --data '{"value":"on"}')

    if [ "$(echo "$response" | jq -r '.success')" = "true" ]; then
        log_success "Browser Integrity Check enabled"
    else
        log_error "Failed to enable Browser Integrity Check"
    fi

    # Set Security Level to Medium
    response=$(curl -s -X PATCH "${CF_API_BASE}/zones/${ZONE_ID}/settings/security_level" \
        -H "Authorization: Bearer ${CLOUDFLARE_API_TOKEN}" \
        -H "Content-Type: application/json" \
        --data '{"value":"medium"}')

    if [ "$(echo "$response" | jq -r '.success')" = "true" ]; then
        log_success "Security Level set to Medium"
    else
        log_error "Failed to set Security Level"
    fi

    # Enable Challenge Passage (1 hour)
    response=$(curl -s -X PATCH "${CF_API_BASE}/zones/${ZONE_ID}/settings/challenge_ttl" \
        -H "Authorization: Bearer ${CLOUDFLARE_API_TOKEN}" \
        -H "Content-Type: application/json" \
        --data '{"value":3600}')

    if [ "$(echo "$response" | jq -r '.success')" = "true" ]; then
        log_success "Challenge Passage set to 1 hour"
    else
        log_error "Failed to set Challenge Passage"
    fi

    log_success "Security configuration completed"
}

configure_performance() {
    log_info "Configuring performance settings..."

    # Enable Brotli compression
    response=$(curl -s -X PATCH "${CF_API_BASE}/zones/${ZONE_ID}/settings/brotli" \
        -H "Authorization: Bearer ${CLOUDFLARE_API_TOKEN}" \
        -H "Content-Type: application/json" \
        --data '{"value":"on"}')

    if [ "$(echo "$response" | jq -r '.success')" = "true" ]; then
        log_success "Brotli compression enabled"
    else
        log_error "Failed to enable Brotli compression"
    fi

    # Enable HTTP/2
    response=$(curl -s -X PATCH "${CF_API_BASE}/zones/${ZONE_ID}/settings/http2" \
        -H "Authorization: Bearer ${CLOUDFLARE_API_TOKEN}" \
        -H "Content-Type: application/json" \
        --data '{"value":"on"}')

    if [ "$(echo "$response" | jq -r '.success')" = "true" ]; then
        log_success "HTTP/2 enabled"
    else
        log_error "Failed to enable HTTP/2"
    fi

    # Enable HTTP/3 (QUIC)
    response=$(curl -s -X PATCH "${CF_API_BASE}/zones/${ZONE_ID}/settings/http3" \
        -H "Authorization: Bearer ${CLOUDFLARE_API_TOKEN}" \
        -H "Content-Type: application/json" \
        --data '{"value":"on"}')

    if [ "$(echo "$response" | jq -r '.success')" = "true" ]; then
        log_success "HTTP/3 (QUIC) enabled"
    else
        log_warning "Failed to enable HTTP/3 (may require paid plan)"
    fi

    # Enable Auto Minify (HTML, CSS, JS)
    response=$(curl -s -X PATCH "${CF_API_BASE}/zones/${ZONE_ID}/settings/minify" \
        -H "Authorization: Bearer ${CLOUDFLARE_API_TOKEN}" \
        -H "Content-Type: application/json" \
        --data '{"value":{"css":"on","html":"on","js":"on"}}')

    if [ "$(echo "$response" | jq -r '.success')" = "true" ]; then
        log_success "Auto Minify enabled for HTML, CSS, and JS"
    else
        log_error "Failed to enable Auto Minify"
    fi

    # Set Browser Cache TTL to respect existing headers
    response=$(curl -s -X PATCH "${CF_API_BASE}/zones/${ZONE_ID}/settings/browser_cache_ttl" \
        -H "Authorization: Bearer ${CLOUDFLARE_API_TOKEN}" \
        -H "Content-Type: application/json" \
        --data '{"value":0}')

    if [ "$(echo "$response" | jq -r '.success')" = "true" ]; then
        log_success "Browser Cache TTL set to respect existing headers"
    else
        log_error "Failed to set Browser Cache TTL"
    fi

    # Enable Early Hints
    response=$(curl -s -X PATCH "${CF_API_BASE}/zones/${ZONE_ID}/settings/early_hints" \
        -H "Authorization: Bearer ${CLOUDFLARE_API_TOKEN}" \
        -H "Content-Type: application/json" \
        --data '{"value":"on"}')

    if [ "$(echo "$response" | jq -r '.success')" = "true" ]; then
        log_success "Early Hints enabled"
    else
        log_warning "Failed to enable Early Hints (may require paid plan)"
    fi

    log_success "Performance configuration completed"
}

create_page_rules() {
    log_info "Creating Page Rules..."

    # Rule 1: Redirect www to apex (301)
    log_info "Creating Page Rule: www redirect to apex..."
    response=$(curl -s -X POST "${CF_API_BASE}/zones/${ZONE_ID}/pagerules" \
        -H "Authorization: Bearer ${CLOUDFLARE_API_TOKEN}" \
        -H "Content-Type: application/json" \
        --data "{
            \"targets\": [{\"target\": \"url\", \"constraint\": {\"operator\": \"matches\", \"value\": \"www.${DOMAIN}/*\"}}],
            \"actions\": [{\"id\": \"forwarding_url\", \"value\": {\"url\": \"https://${DOMAIN}/\$1\", \"status_code\": 301}}],
            \"priority\": 1,
            \"status\": \"active\"
        }")

    if [ "$(echo "$response" | jq -r '.success')" = "true" ]; then
        log_success "Page Rule created: www redirect"
    else
        log_warning "Failed to create www redirect Page Rule (may have reached limit)"
    fi

    # Rule 2: Bypass cache for API routes
    log_info "Creating Page Rule: Bypass cache for /api/*..."
    response=$(curl -s -X POST "${CF_API_BASE}/zones/${ZONE_ID}/pagerules" \
        -H "Authorization: Bearer ${CLOUDFLARE_API_TOKEN}" \
        -H "Content-Type: application/json" \
        --data "{
            \"targets\": [{\"target\": \"url\", \"constraint\": {\"operator\": \"matches\", \"value\": \"${DOMAIN}/api/*\"}}],
            \"actions\": [{\"id\": \"cache_level\", \"value\": \"bypass\"}],
            \"priority\": 2,
            \"status\": \"active\"
        }")

    if [ "$(echo "$response" | jq -r '.success')" = "true" ]; then
        log_success "Page Rule created: API cache bypass"
    else
        log_warning "Failed to create API cache bypass Page Rule (may have reached limit)"
    fi

    # Rule 3: Cache everything for static assets
    log_info "Creating Page Rule: Cache static assets..."
    response=$(curl -s -X POST "${CF_API_BASE}/zones/${ZONE_ID}/pagerules" \
        -H "Authorization: Bearer ${CLOUDFLARE_API_TOKEN}" \
        -H "Content-Type: application/json" \
        --data "{
            \"targets\": [{\"target\": \"url\", \"constraint\": {\"operator\": \"matches\", \"value\": \"${DOMAIN}/_next/static/*\"}}],
            \"actions\": [
                {\"id\": \"cache_level\", \"value\": \"cache_everything\"},
                {\"id\": \"edge_cache_ttl\", \"value\": 2592000}
            ],
            \"priority\": 3,
            \"status\": \"active\"
        }")

    if [ "$(echo "$response" | jq -r '.success')" = "true" ]; then
        log_success "Page Rule created: Static asset caching"
    else
        log_warning "Failed to create static asset Page Rule (may have reached limit)"
    fi

    log_success "Page Rules configuration completed"
}

enable_web_analytics() {
    log_info "Enabling Web Analytics..."

    # Web Analytics is typically enabled through the dashboard
    # We'll note this in the output
    log_warning "Web Analytics must be enabled manually through the Cloudflare dashboard"
    log_info "Visit: https://dash.cloudflare.com/${ACCOUNT_ID}/analytics-and-logs/web-analytics"

    log_success "Web Analytics configuration noted"
}

save_configuration_summary() {
    log_info "Saving configuration summary..."

    cat > cloudflare-config-summary.json <<EOF
{
  "domain": "${DOMAIN}",
  "zone_id": "${ZONE_ID}",
  "account_id": "${ACCOUNT_ID}",
  "dns_records": [
    {
      "type": "A",
      "name": "${DOMAIN}",
      "content": "${VERCEL_IP}",
      "proxied": true
    },
    {
      "type": "CNAME",
      "name": "www.${DOMAIN}",
      "content": "${VERCEL_CNAME}",
      "proxied": true
    }
  ],
  "ssl_tls": {
    "mode": "strict",
    "always_use_https": true,
    "automatic_https_rewrites": true,
    "min_tls_version": "1.2",
    "tls_1_3": true
  },
  "security": {
    "bot_fight_mode": true,
    "browser_integrity_check": true,
    "security_level": "medium",
    "challenge_ttl": 3600
  },
  "performance": {
    "brotli": true,
    "http2": true,
    "http3": true,
    "auto_minify": {
      "html": true,
      "css": true,
      "js": true
    },
    "browser_cache_ttl": 0,
    "early_hints": true
  },
  "page_rules": [
    {
      "priority": 1,
      "url": "www.${DOMAIN}/*",
      "action": "301 redirect to https://${DOMAIN}/\$1"
    },
    {
      "priority": 2,
      "url": "${DOMAIN}/api/*",
      "action": "bypass cache"
    },
    {
      "priority": 3,
      "url": "${DOMAIN}/_next/static/*",
      "action": "cache everything, edge TTL 30 days"
    }
  ],
  "timestamp": "$(date -u +"%Y-%m-%dT%H:%M:%SZ")"
}
EOF

    log_success "Configuration summary saved to cloudflare-config-summary.json"
}

################################################################################
# Main Execution
################################################################################

main() {
    echo ""
    echo "========================================================================"
    echo "  Cloudflare Setup for meauxbility.org"
    echo "========================================================================"
    echo ""

    check_requirements
    verify_token
    get_account_id

    if check_zone_exists; then
        log_info "Using existing zone: $ZONE_ID"
    else
        create_zone
    fi

    configure_dns_records
    configure_ssl_tls
    configure_security
    configure_performance
    create_page_rules
    enable_web_analytics
    save_configuration_summary

    echo ""
    echo "========================================================================"
    echo "  Cloudflare Setup Complete!"
    echo "========================================================================"
    echo ""
    log_success "Zone ID: $ZONE_ID"
    log_success "Account ID: $ACCOUNT_ID"
    echo ""
    log_info "Next Steps:"
    echo "  1. Update your domain registrar's nameservers (see cloudflare-nameservers.txt)"
    echo "  2. Wait for DNS propagation (24-48 hours)"
    echo "  3. Configure Vercel domains (run vercel-setup.sh)"
    echo "  4. Enable Web Analytics in Cloudflare dashboard"
    echo "  5. Review configuration in cloudflare-config-summary.json"
    echo ""
    log_info "Configuration Summary: cloudflare-config-summary.json"
    log_info "Nameservers: cloudflare-nameservers.txt"
    echo ""
}

# Run main function
main
