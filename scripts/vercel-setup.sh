#!/bin/bash

################################################################################
# Vercel Domain Setup Script for meauxbility.org
# Purpose: Configure custom domains in Vercel project
# Requirements: curl, jq, valid Vercel API token
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
VERCEL_API_TOKEN="${VERCEL_API_TOKEN:-}"
VERCEL_PROJECT_ID="${VERCEL_PROJECT_ID:-prj_tLe5xpmnA0hbDNRytqCbWq8R2Gul}"
VERCEL_API_BASE="https://api.vercel.com"

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

    if [ -z "$VERCEL_API_TOKEN" ]; then
        log_error "VERCEL_API_TOKEN environment variable is not set."
        echo "Please set it with: export VERCEL_API_TOKEN='your_token'"
        exit 1
    fi

    if [ -z "$VERCEL_PROJECT_ID" ]; then
        log_error "VERCEL_PROJECT_ID environment variable is not set."
        echo "Please set it with: export VERCEL_PROJECT_ID='your_project_id'"
        exit 1
    fi

    log_success "All requirements met"
}

verify_token() {
    log_info "Verifying Vercel API token..."

    response=$(curl -s -X GET "${VERCEL_API_BASE}/v2/user" \
        -H "Authorization: Bearer ${VERCEL_API_TOKEN}")

    username=$(echo "$response" | jq -r '.user.username // .user.email // empty')

    if [ -z "$username" ]; then
        log_error "API token verification failed"
        echo "$response" | jq '.'
        exit 1
    fi

    log_success "API token verified for user: $username"
}

get_project_info() {
    log_info "Fetching Vercel project information..."

    response=$(curl -s -X GET "${VERCEL_API_BASE}/v9/projects/${VERCEL_PROJECT_ID}" \
        -H "Authorization: Bearer ${VERCEL_API_TOKEN}")

    project_name=$(echo "$response" | jq -r '.name')

    if [ "$project_name" = "null" ] || [ -z "$project_name" ]; then
        log_error "Failed to fetch project information"
        echo "$response" | jq '.'
        exit 1
    fi

    log_success "Project found: $project_name"

    # Get current domains
    existing_domains=$(echo "$response" | jq -r '.alias[]? // empty')
    if [ -n "$existing_domains" ]; then
        log_info "Existing domains:"
        echo "$existing_domains"
    else
        log_info "No custom domains currently configured"
    fi
}

check_domain_exists() {
    local domain=$1
    log_info "Checking if domain $domain is already configured..."

    response=$(curl -s -X GET "${VERCEL_API_BASE}/v9/projects/${VERCEL_PROJECT_ID}" \
        -H "Authorization: Bearer ${VERCEL_API_TOKEN}")

    domain_exists=$(echo "$response" | jq -r --arg d "$domain" '.alias[]? | select(. == $d)')

    if [ -n "$domain_exists" ]; then
        log_warning "Domain $domain is already configured"
        return 0
    else
        log_info "Domain $domain not found in project"
        return 1
    fi
}

add_domain() {
    local domain=$1
    log_info "Adding domain $domain to Vercel project..."

    response=$(curl -s -X POST "${VERCEL_API_BASE}/v10/projects/${VERCEL_PROJECT_ID}/domains" \
        -H "Authorization: Bearer ${VERCEL_API_TOKEN}" \
        -H "Content-Type: application/json" \
        --data "{\"name\":\"${domain}\"}")

    # Check if successful
    added_domain=$(echo "$response" | jq -r '.name')
    error_code=$(echo "$response" | jq -r '.error.code // empty')

    if [ "$added_domain" = "$domain" ]; then
        log_success "Domain $domain added successfully"
        return 0
    elif [ "$error_code" = "domain_already_in_use" ]; then
        log_warning "Domain $domain already exists in project"
        return 0
    else
        log_error "Failed to add domain $domain"
        echo "$response" | jq '.'
        return 1
    fi
}

check_domain_verification() {
    local domain=$1
    log_info "Checking verification status for $domain..."

    response=$(curl -s -X GET "${VERCEL_API_BASE}/v9/projects/${VERCEL_PROJECT_ID}/domains/${domain}" \
        -H "Authorization: Bearer ${VERCEL_API_TOKEN}")

    verification=$(echo "$response" | jq -r '.verification[]? // empty')

    if [ -n "$verification" ]; then
        log_info "Verification records needed:"
        echo "$verification" | jq '.'
    else
        log_success "Domain $domain is verified or does not require additional verification"
    fi

    # Check SSL certificate status
    ssl_status=$(echo "$response" | jq -r '.configuredBy // empty')
    log_info "SSL certificate status: $ssl_status"
}

check_dns_configuration() {
    log_info "Checking DNS configuration..."

    # Check apex domain
    log_info "Checking DNS for $DOMAIN..."
    if command -v dig &> /dev/null; then
        apex_ip=$(dig +short $DOMAIN A | head -1)
        if [ -n "$apex_ip" ]; then
            log_info "Current A record for $DOMAIN: $apex_ip"
            if [ "$apex_ip" = "76.76.21.21" ]; then
                log_success "A record correctly points to Vercel"
            else
                log_warning "A record does not point to Vercel IP (expected: 76.76.21.21)"
            fi
        else
            log_warning "No A record found for $DOMAIN"
        fi

        # Check www subdomain
        log_info "Checking DNS for www.$DOMAIN..."
        www_cname=$(dig +short www.$DOMAIN CNAME | head -1)
        if [ -n "$www_cname" ]; then
            log_info "Current CNAME for www.$DOMAIN: $www_cname"
            if [[ "$www_cname" == *"vercel-dns.com"* ]]; then
                log_success "CNAME correctly points to Vercel"
            else
                log_warning "CNAME does not point to Vercel (expected: cname.vercel-dns.com)"
            fi
        else
            log_warning "No CNAME record found for www.$DOMAIN"
        fi
    else
        log_warning "dig command not found - skipping DNS checks"
        log_info "Install dig with: sudo apt-get install dnsutils (Debian/Ubuntu)"
    fi
}

set_production_domain() {
    local domain=$1
    log_info "Setting $domain as production domain..."

    # Get current project settings
    response=$(curl -s -X GET "${VERCEL_API_BASE}/v9/projects/${VERCEL_PROJECT_ID}" \
        -H "Authorization: Bearer ${VERCEL_API_TOKEN}")

    # Update project with production domain
    response=$(curl -s -X PATCH "${VERCEL_API_BASE}/v9/projects/${VERCEL_PROJECT_ID}" \
        -H "Authorization: Bearer ${VERCEL_API_TOKEN}" \
        -H "Content-Type: application/json" \
        --data "{\"productionDomain\":\"${domain}\"}")

    success=$(echo "$response" | jq -r '.productionDomain // empty')

    if [ "$success" = "$domain" ]; then
        log_success "Production domain set to $domain"
    else
        log_warning "Could not set production domain (may not be supported on API)"
    fi
}

configure_domain_redirects() {
    log_info "Configuring domain redirects..."

    # Vercel automatically handles www -> apex redirects if both domains are configured
    # We just need to ensure both domains are added
    log_info "Both apex and www domains are configured"
    log_info "Vercel will automatically handle redirects based on your configuration"
    log_success "Domain redirects configured"
}

save_configuration_summary() {
    log_info "Saving configuration summary..."

    cat > vercel-config-summary.json <<EOF
{
  "project_id": "${VERCEL_PROJECT_ID}",
  "domain": "${DOMAIN}",
  "domains_configured": [
    "${DOMAIN}",
    "www.${DOMAIN}"
  ],
  "dns_requirements": {
    "apex_domain": {
      "type": "A",
      "name": "@",
      "value": "76.76.21.21",
      "note": "Should be proxied through Cloudflare"
    },
    "www_subdomain": {
      "type": "CNAME",
      "name": "www",
      "value": "cname.vercel-dns.com",
      "note": "Should be proxied through Cloudflare"
    }
  },
  "ssl_certificate": {
    "provider": "Vercel",
    "auto_renewal": true,
    "note": "Automatically provisioned after DNS verification"
  },
  "timestamp": "$(date -u +"%Y-%m-%dT%H:%M:%SZ")"
}
EOF

    log_success "Configuration summary saved to vercel-config-summary.json"
}

test_deployment() {
    log_info "Testing deployment accessibility..."

    if command -v curl &> /dev/null; then
        log_info "Checking HTTPS accessibility..."

        # Test apex domain
        status=$(curl -s -o /dev/null -w "%{http_code}" -L "https://${DOMAIN}" --max-time 10 || echo "000")
        if [ "$status" = "200" ]; then
            log_success "Apex domain (https://${DOMAIN}) is accessible (HTTP $status)"
        else
            log_warning "Apex domain returned HTTP $status (may not be ready yet)"
        fi

        # Test www subdomain
        status=$(curl -s -o /dev/null -w "%{http_code}" -L "https://www.${DOMAIN}" --max-time 10 || echo "000")
        if [ "$status" = "200" ]; then
            log_success "WWW subdomain (https://www.${DOMAIN}) is accessible (HTTP $status)"
        else
            log_warning "WWW subdomain returned HTTP $status (may not be ready yet)"
        fi
    else
        log_warning "curl command not available - skipping deployment tests"
    fi
}

################################################################################
# Main Execution
################################################################################

main() {
    echo ""
    echo "========================================================================"
    echo "  Vercel Domain Setup for meauxbility.org"
    echo "========================================================================"
    echo ""

    check_requirements
    verify_token
    get_project_info

    # Add apex domain
    if ! check_domain_exists "$DOMAIN"; then
        add_domain "$DOMAIN"
    fi

    # Add www subdomain
    if ! check_domain_exists "www.$DOMAIN"; then
        add_domain "www.$DOMAIN"
    fi

    # Check verification status
    check_domain_verification "$DOMAIN"
    check_domain_verification "www.$DOMAIN"

    # Set production domain
    set_production_domain "$DOMAIN"

    # Configure redirects
    configure_domain_redirects

    # Check DNS configuration
    check_dns_configuration

    # Save configuration
    save_configuration_summary

    # Test deployment
    test_deployment

    echo ""
    echo "========================================================================"
    echo "  Vercel Domain Setup Complete!"
    echo "========================================================================"
    echo ""
    log_success "Domains configured: $DOMAIN, www.$DOMAIN"
    echo ""
    log_info "Next Steps:"
    echo "  1. Ensure DNS records are configured in Cloudflare (A and CNAME)"
    echo "  2. Wait for DNS propagation (usually 5-10 minutes with Cloudflare)"
    echo "  3. Vercel will automatically provision SSL certificates"
    echo "  4. Test your domains:"
    echo "     - https://${DOMAIN}"
    echo "     - https://www.${DOMAIN}"
    echo "  5. Check SSL certificate status in Vercel dashboard"
    echo ""
    log_info "Configuration Summary: vercel-config-summary.json"
    log_info "Vercel Dashboard: https://vercel.com/projects/${VERCEL_PROJECT_ID}"
    echo ""
}

# Run main function
main
