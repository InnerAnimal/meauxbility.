const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const rateLimit = require('express-rate-limit');
const path = require('path');
const crypto = require('crypto');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Security middleware
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
      fontSrc: ["'self'", "https://fonts.gstatic.com"],
      imgSrc: ["'self'", "data:", "https:"],
      scriptSrc: ["'self'", "'unsafe-inline'"],
      connectSrc: ["'self'", "https://api.stripe.com", "https://*.supabase.co"]
    }
  }
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.'
});

app.use(limiter);

// Middleware
app.use(cors());
app.use(compression());

// Raw body parser for webhook signature verification
app.use('/api/webhooks', express.raw({ type: 'application/json' }));

// Regular JSON parser for other routes
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Serve static files
app.use(express.static(path.join(__dirname, 'public')));

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// Render health check endpoint
app.get('/healthz', (req, res) => {
  res.json({ ok: true });
});

// Serve main pages
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.get('/about', (req, res) => {
  res.sendFile(path.join(__dirname, 'about.html'));
});

app.get('/donate', (req, res) => {
  res.sendFile(path.join(__dirname, 'donate.html'));
});

app.get('/apply', (req, res) => {
  res.sendFile(path.join(__dirname, 'apply.html'));
});

app.get('/stories', (req, res) => {
  res.sendFile(path.join(__dirname, 'stories.html'));
});

app.get('/contact', (req, res) => {
  res.sendFile(path.join(__dirname, 'contact.html'));
});

app.get('/admin', (req, res) => {
  res.sendFile(path.join(__dirname, 'admin', 'index.html'));
});

// API routes
app.get('/api/status', (req, res) => {
  res.json({
    message: 'Meauxbility API is running',
    version: '1.0.0',
    timestamp: new Date().toISOString()
  });
});

// Webhook signature verification middleware
const verifyWebhookSignature = (req, res, next) => {
  const signature = req.headers['x-signature'] || req.headers['x-hub-signature-256'] || req.headers['x-webhook-signature'];
  const webhookSecret = process.env.WEBHOOK_SIGNING_SECRET;
  
  if (!signature || !webhookSecret) {
    console.log('Webhook verification failed: Missing signature or secret');
    return res.status(400).json({ error: 'Missing signature or secret' });
  }
  
  try {
    const payload = req.body;
    const expectedSignature = crypto
      .createHmac('sha256', webhookSecret)
      .update(payload)
      .digest('hex');
    
    // Handle different signature formats
    const providedSignature = signature.startsWith('sha256=') 
      ? signature.substring(7) 
      : signature;
    
    const isValid = crypto.timingSafeEqual(
      Buffer.from(expectedSignature, 'hex'),
      Buffer.from(providedSignature, 'hex')
    );
    
    if (isValid) {
      console.log('Webhook signature verified: true');
      req.webhookVerified = true;
      next();
    } else {
      console.log('Webhook signature verification failed: Invalid signature');
      return res.status(400).json({ error: 'Invalid signature' });
    }
  } catch (error) {
    console.error('Webhook verification error:', error.message);
    return res.status(400).json({ error: 'Signature verification failed' });
  }
};

// Webhook endpoint
app.post('/api/webhooks/meauxbilityorg', verifyWebhookSignature, (req, res) => {
  try {
    const payload = JSON.parse(req.body.toString());
    
    console.log('Webhook received:', {
      verified: req.webhookVerified,
      timestamp: new Date().toISOString(),
      payloadType: payload.type || 'unknown',
      eventId: payload.id || 'no-id'
    });
    
    // Process webhook payload here
    // Add your webhook processing logic
    
    res.status(200).json({ 
      success: true, 
      message: 'Webhook processed successfully',
      verified: true,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Webhook processing error:', error.message);
    res.status(500).json({ 
      error: 'Webhook processing failed',
      message: error.message 
    });
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    error: 'Something went wrong!',
    message: process.env.NODE_ENV === 'development' ? err.message : 'Internal server error'
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    error: 'Not Found',
    message: 'The requested resource was not found'
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Meauxbility server running on port ${PORT}`);
  console.log(`📱 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🌐 Health check: http://localhost:${PORT}/api/health`);
  console.log(`🔗 Render health check: http://localhost:${PORT}/healthz`);
  console.log(`🎣 Webhook endpoint: http://localhost:${PORT}/api/webhooks/meauxbilityorg`);
  console.log(`🔐 Webhook secret configured: ${process.env.WEBHOOK_SIGNING_SECRET ? 'Yes' : 'No'}`);
});

module.exports = app;