/**
 * Cloudflare Worker: Security Headers & Accessibility Optimization
 * Project: meauxbility.org
 * Purpose: Add security headers, optimize for accessibility, and enhance performance
 */

// Security Policy Configuration
const SECURITY_HEADERS = {
  // Content Security Policy - Strict but allows Vercel's inline scripts
  'Content-Security-Policy': [
    "default-src 'self'",
    "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://vercel.live https://*.vercel-insights.com",
    "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
    "font-src 'self' https://fonts.gstatic.com data:",
    "img-src 'self' data: https: blob:",
    "connect-src 'self' https://*.vercel-insights.com https://vitals.vercel-insights.com",
    "frame-ancestors 'none'",
    "base-uri 'self'",
    "form-action 'self'",
    "upgrade-insecure-requests"
  ].join('; '),

  // Strict Transport Security - Force HTTPS for 1 year
  'Strict-Transport-Security': 'max-age=31536000; includeSubDomains; preload',

  // Prevent MIME type sniffing
  'X-Content-Type-Options': 'nosniff',

  // Prevent clickjacking
  'X-Frame-Options': 'DENY',

  // XSS Protection (legacy browsers)
  'X-XSS-Protection': '1; mode=block',

  // Referrer Policy - Privacy-focused
  'Referrer-Policy': 'strict-origin-when-cross-origin',

  // Permissions Policy - Disable unnecessary features
  'Permissions-Policy': [
    'accelerometer=()',
    'camera=()',
    'geolocation=()',
    'gyroscope=()',
    'magnetometer=()',
    'microphone=()',
    'payment=()',
    'usb=()'
  ].join(', '),

  // Cross-Origin Policies
  'Cross-Origin-Embedder-Policy': 'require-corp',
  'Cross-Origin-Opener-Policy': 'same-origin',
  'Cross-Origin-Resource-Policy': 'same-origin'
};

// Accessibility-specific headers
const ACCESSIBILITY_HEADERS = {
  // Ensure UTF-8 encoding for screen readers
  'X-UA-Compatible': 'IE=edge',

  // Cache control for accessibility tools
  'Cache-Control': 'public, max-age=0, must-revalidate',
};

// Routes that should bypass cache (API routes, dynamic content)
const BYPASS_CACHE_ROUTES = [
  '/api/',
  '/auth/',
  '/admin/',
  '/_next/data/'
];

// Routes that should be heavily cached (static assets)
const CACHE_EVERYTHING_ROUTES = [
  '/_next/static/',
  '/static/',
  '/images/',
  '/fonts/',
  '/favicon.ico',
  '/robots.txt',
  '/sitemap.xml'
];

/**
 * Main request handler
 */
addEventListener('fetch', event => {
  event.respondWith(handleRequest(event.request));
});

/**
 * Handle incoming request
 * @param {Request} request - The incoming request
 * @returns {Promise<Response>} - The modified response
 */
async function handleRequest(request) {
  const url = new URL(request.url);
  const pathname = url.pathname;

  // Clone the request for modification
  const modifiedRequest = new Request(request);

  // Fetch the response from origin (Vercel)
  let response = await fetch(modifiedRequest);

  // Clone response so we can modify headers
  response = new Response(response.body, response);

  // Add security headers
  addSecurityHeaders(response);

  // Add accessibility headers
  addAccessibilityHeaders(response);

  // Configure caching based on route
  configureCaching(response, pathname);

  // Add custom analytics headers
  addAnalyticsHeaders(response, request);

  // Add CORS headers if needed
  if (shouldEnableCORS(pathname)) {
    addCORSHeaders(response);
  }

  return response;
}

/**
 * Add security headers to response
 * @param {Response} response - The response to modify
 */
function addSecurityHeaders(response) {
  for (const [header, value] of Object.entries(SECURITY_HEADERS)) {
    response.headers.set(header, value);
  }
}

/**
 * Add accessibility-focused headers
 * @param {Response} response - The response to modify
 */
function addAccessibilityHeaders(response) {
  for (const [header, value] of Object.entries(ACCESSIBILITY_HEADERS)) {
    response.headers.set(header, value);
  }

  // Ensure proper content type for HTML
  const contentType = response.headers.get('Content-Type');
  if (contentType && contentType.includes('text/html')) {
    response.headers.set('Content-Type', 'text/html; charset=utf-8');
  }
}

/**
 * Configure caching based on route
 * @param {Response} response - The response to modify
 * @param {string} pathname - The request pathname
 */
function configureCaching(response, pathname) {
  // Check if route should bypass cache
  if (BYPASS_CACHE_ROUTES.some(route => pathname.startsWith(route))) {
    response.headers.set('Cache-Control', 'private, no-cache, no-store, must-revalidate');
    response.headers.set('Pragma', 'no-cache');
    response.headers.set('Expires', '0');
    return;
  }

  // Check if route should be heavily cached
  if (CACHE_EVERYTHING_ROUTES.some(route => pathname.startsWith(route))) {
    response.headers.set('Cache-Control', 'public, max-age=31536000, immutable');
    return;
  }

  // Default caching for HTML pages
  const contentType = response.headers.get('Content-Type');
  if (contentType && contentType.includes('text/html')) {
    response.headers.set('Cache-Control', 'public, max-age=0, must-revalidate');
  }
}

/**
 * Add analytics and performance headers
 * @param {Response} response - The response to modify
 * @param {Request} request - The original request
 */
function addAnalyticsHeaders(response, request) {
  // Add server timing header for performance monitoring
  const serverTiming = [];

  // Add cache status
  const cfCacheStatus = response.headers.get('CF-Cache-Status');
  if (cfCacheStatus) {
    serverTiming.push(`cache;desc="${cfCacheStatus}"`);
  }

  // Add Cloudflare ray ID for debugging
  const cfRay = response.headers.get('CF-RAY');
  if (cfRay) {
    response.headers.set('X-CF-Ray', cfRay);
  }

  if (serverTiming.length > 0) {
    response.headers.set('Server-Timing', serverTiming.join(', '));
  }

  // Add custom headers for accessibility metrics
  response.headers.set('X-Accessibility-Optimized', 'true');
  response.headers.set('X-Powered-By', 'Cloudflare Workers + Vercel');
}

/**
 * Check if CORS should be enabled for this route
 * @param {string} pathname - The request pathname
 * @returns {boolean} - Whether to enable CORS
 */
function shouldEnableCORS(pathname) {
  // Enable CORS for API routes and public assets
  return pathname.startsWith('/api/') ||
         pathname.startsWith('/fonts/') ||
         pathname.startsWith('/images/');
}

/**
 * Add CORS headers
 * @param {Response} response - The response to modify
 */
function addCORSHeaders(response) {
  response.headers.set('Access-Control-Allow-Origin', '*');
  response.headers.set('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  response.headers.set('Access-Control-Max-Age', '86400');
}

/**
 * Handle OPTIONS requests for CORS preflight
 */
addEventListener('fetch', event => {
  if (event.request.method === 'OPTIONS') {
    event.respondWith(handleOptions(event.request));
  }
});

/**
 * Handle CORS preflight OPTIONS requests
 * @param {Request} request - The OPTIONS request
 * @returns {Response} - CORS preflight response
 */
function handleOptions(request) {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': request.headers.get('Access-Control-Request-Headers') || 'Content-Type, Authorization',
    'Access-Control-Max-Age': '86400',
  };

  return new Response(null, { headers });
}
