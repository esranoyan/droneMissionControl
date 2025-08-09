import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import dotenv from 'dotenv';

// Routes import
import droneRoutes from './routes/drones';
import taskRoutes from './routes/tasks'; 
import serverRoutes from './routes/server';

// Test route imports
console.log('Loading routes...');
console.log('Drone routes loaded:', !!droneRoutes);
console.log('Task routes loaded:', !!taskRoutes);
console.log('Server routes loaded:', !!serverRoutes);

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Security middleware
app.use(helmet());
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 dakikalık bir zaman dilimi
  max: 1000,                 // Bu süre içinde aynı IP adresinden en fazla 1000 istek kabul et
  message: 'Too many requests from this IP' // Limit aşılırsa bu mesajı göster
});
app.use('/api', limiter);

// Logging
app.use(morgan('combined'));

// Body parsing
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Health check and root route
app.get('/', (req, res) => {
  res.json({ 
    message: 'Drone Management API', 
    version: '1.0.0',
    endpoints: {
      health: '/health',
      drones: '/api/drones',
      tasks: '/api/tasks',
      server: '/api/server'
    }
  });
});

app.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

// API base route
app.get('/api', (req, res) => {
  res.json({
    message: 'Drone Management API v1.0.0',
    endpoints: {
      drones: '/api/drones',
      tasks: '/api/tasks',
      server: '/api/server'
    }
  });
});

// API Routes with debugging
try {
  app.use('/api/drones', droneRoutes);
  console.log('Drone routes registered');
} catch (error) {
  console.error('Error loading drone routes:', error);
}

try {
  app.use('/api/tasks', taskRoutes);
  console.log('Task routes registered');
} catch (error) {
  console.error('Error loading task routes:', error);
}

try {
  app.use('/api/server', serverRoutes);
  console.log('Server routes registered');
} catch (error) {
  console.error('Error loading server routes:', error);
}

// Error handling middleware
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('Error:', err);
  res.status(err.status || 500).json({
    error: {
      message: err.message || 'Internal Server Error',
      status: err.status || 500
    }
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    error: {
      message: `Route ${req.originalUrl} not found`,
      status: 404
    }
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
  console.log(`Health check: http://localhost:${PORT}/health`);
  console.log(`API Base URL: http://localhost:${PORT}/api`);
});

export default app;