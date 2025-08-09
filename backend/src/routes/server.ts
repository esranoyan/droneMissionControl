import express from 'express';
import pool from '../config/database';

const router = express.Router();

// GET - Server durumu
router.get('/status', async (req, res) => {
  try {
    
    const dbResult = await pool.query('SELECT NOW() as current_time');
    
    res.json({
      status: 'OK',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      database: {
        connected: true,
        currentTime: dbResult.rows[0].current_time
      },
      memory: process.memoryUsage(),
      version: process.version
    });
  } catch (error) {
    console.error('Server status check error:', error);
    res.status(500).json({
      status: 'ERROR',
      timestamp: new Date().toISOString(),
      database: {
        connected: false,
        error: 'Database connection failed'
      }
    });
  }
});

// GET - İstatistikler
router.get('/stats', async (req, res) => {
  try {
    const [dronesResult, tasksResult, progressResult] = await Promise.all([
      pool.query('SELECT COUNT(*) as total FROM drones'),
      pool.query(`
        SELECT 
          status,
          COUNT(*) as count
        FROM tasks 
        GROUP BY status
      `),
      pool.query('SELECT COUNT(*) as total FROM task_progress')
    ]);

    const taskStats = tasksResult.rows.reduce((acc: any, row: any) => {
      acc[row.status] = parseInt(row.count);
      return acc;
    }, {});

    res.json({
      drones: {
        total: parseInt(dronesResult.rows[0].total)
      },
      tasks: {
        total: Object.values(taskStats).reduce((a: any, b: any) => a + b, 0),
        byStatus: taskStats
      },
      taskProgress: {
        total: parseInt(progressResult.rows[0].total)
      }
    });
  } catch (error) {
    console.error('Server stats error:', error);
    res.status(500).json({ error: 'İstatistikler alınamadı' });
  }
});

export default router;