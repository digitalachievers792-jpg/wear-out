const rateLimit = require('express-rate-limit');

// Order submission: max 20 per 15 min per IP
const orderLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: 'Too many orders submitted, please try again later.' },
});

// Review submission: max 10 per 15 min per IP
const reviewLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: 'Too many reviews submitted, please try again later.' },
});

// Auth (login): max 10 per 15 min per IP
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: 'Too many login attempts, please try again later.' },
});

module.exports = { orderLimiter, reviewLimiter, authLimiter };
