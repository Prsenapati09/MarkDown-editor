import 'dotenv/config';
import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import morgan from 'morgan';
import mongoSanitize from 'express-mongo-sanitize';

import connectDB from './config/db.js';
import authRoutes from './routes/authRoutes.js';
import documentRoutes from './routes/documentRoutes.js';
import { errorHandler, notFound } from './middleware/errorHandler.js';
import { apiLimiter } from './middleware/rateLimiter.js';

connectDB();

const app = express();

// Trust the first proxy hop — required on Render/Railway so req.ip and
// rate-limiting see the real client IP instead of the platform's proxy IP.
app.set('trust proxy', 1);

// --- Security middleware ---
app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'"],
        styleSrc: ["'self'", "'unsafe-inline'"],
        imgSrc: ["'self'", 'data:', 'https:'],
        objectSrc: ["'none'"],
        upgradeInsecureRequests: [],
      },
    },
  })
);

app.use(
  cors({
    origin: process.env.CLIENT_URL, 
    credentials: true, 
  })
);

app.use(express.json({ limit: '1mb' })); 
app.use(cookieParser());
app.use(mongoSanitize()); 

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}else{
  app.use(morgan('combined'))
}


app.use('/api', apiLimiter);

// --- Routes ---
app.get('/api/health', (req, res) => res.json({ status: 'ok', timestamp: new Date() }));
app.use('/api/auth', authRoutes);
app.use('/api/documents', documentRoutes);

// --- Error handling (must be last) ---
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () =>
  console.log(`Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`)
);

// Graceful shutdown — important on PaaS platforms which send SIGTERM
// before restarting/redeploying an instance
process.on('SIGTERM', () => {
  console.log('SIGTERM received. Shutting down gracefully...');
  server.close(() => {
    console.log('Process terminated');
    process.exit(0);
  });
});
