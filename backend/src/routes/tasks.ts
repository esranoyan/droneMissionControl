import express from 'express';
import pool from '../config/database';

const router = express.Router();

// GET /api/tasks - Tüm görevleri getir
router.get('/', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT 
        id, drone_id, drone_name,
        start_position_lat, start_position_lng, start_position_alt,
        target_position_lat, target_position_lng, target_position_alt,
        duration, description, status, actual_duration, color,
        created_at, started_at, completed_at
      FROM tasks 
      ORDER BY created_at DESC
    `);
    
    const tasks = result.rows.map((row: any) => ({
      id: row.id,
      droneId: row.drone_id,
      droneName: row.drone_name,
      startPosition: [row.start_position_lat, row.start_position_lng, row.start_position_alt],
      targetPosition: [row.target_position_lat, row.target_position_lng, row.target_position_alt],
      duration: row.duration,
      description: row.description,
      status: row.status,
      actualDuration: row.actual_duration,
      color: row.color,
      createdAt: row.created_at,
      startedAt: row.started_at,
      completedAt: row.completed_at
    }));

    res.json(tasks);
  } catch (error) {
    console.error('Görevler getirilirken hata:', error);
    res.status(500).json({ error: 'Görevler getirilemedi' });
  }
});

// POST /api/tasks - Yeni görev ekle
router.post('/', async (req, res) => {
  try {
    const { droneId, droneName, startPosition, targetPosition, duration, description, color } = req.body;
    
    if (!droneId || !startPosition || !targetPosition || !duration) {
      return res.status(400).json({ error: 'Gerekli alanlar eksik' });
    }

    let startLat, startLng, startAlt, targetLat, targetLng, targetAlt;
    
    if (Array.isArray(startPosition)) {
      [startLat, startLng, startAlt] = startPosition;
    } else {
      startLat = startPosition.lat;
      startLng = startPosition.lng;
      startAlt = startPosition.alt;
    }
    
    if (Array.isArray(targetPosition)) {
      [targetLat, targetLng, targetAlt] = targetPosition;
    } else {
      targetLat = targetPosition.lat;
      targetLng = targetPosition.lng;
      targetAlt = targetPosition.alt;
    }

    const result = await pool.query(`
      INSERT INTO tasks (
        drone_id, drone_name,
        start_position_lat, start_position_lng, start_position_alt,
        target_position_lat, target_position_lng, target_position_alt,
        duration, description, color, status
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
      RETURNING *
    `, [
      droneId, droneName || `İHA-${droneId}`,
      startLat, startLng, startAlt,
      targetLat, targetLng, targetAlt,
      duration, description || 'Yeni görev',
      color || '#ff0000', 'pending'
    ]);
    
    const row = result.rows[0];
    const task = {
      id: row.id,
      droneId: row.drone_id,
      droneName: row.drone_name,
      startPosition: [row.start_position_lat, row.start_position_lng, row.start_position_alt],
      targetPosition: [row.target_position_lat, row.target_position_lng, row.target_position_alt],
      duration: row.duration,
      description: row.description,
      status: row.status,
      actualDuration: row.actual_duration,
      color: row.color
    };

    res.status(201).json(task);
  } catch (error) {
    console.error('Görev eklenirken hata:', error);
    res.status(500).json({ error: 'Görev eklenemedi' });
  }
});

// PATCH /api/tasks/:id/status - Görev durumunu güncelle
router.patch('/:id/status', async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    
    if (!status || !['pending', 'active', 'completed', 'failed'].includes(status)) {
      return res.status(400).json({ error: 'Geçerli status gerekli (pending, active, completed, failed)' });
    }

    let updateFields = 'status = $1, updated_at = NOW()';
    let values = [status, id];
    
    if (status === 'active') {
      updateFields = 'status = $1, started_at = NOW(), updated_at = NOW()';
    } else if (status === 'completed') {
      updateFields = 'status = $1, completed_at = NOW(), updated_at = NOW()';
    }

    const result = await pool.query(`
      UPDATE tasks 
      SET ${updateFields}
      WHERE id = $2
      RETURNING *
    `, values);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Görev bulunamadı' });
    }

    const row = result.rows[0];
    const task = {
      id: row.id,
      droneId: row.drone_id,
      droneName: row.drone_name,
      startPosition: [row.start_position_lat, row.start_position_lng, row.start_position_alt],
      targetPosition: [row.target_position_lat, row.target_position_lng, row.target_position_alt],
      duration: row.duration,
      description: row.description,
      status: row.status,
      actualDuration: row.actual_duration,
      color: row.color
    };

    res.json(task);
  } catch (error) {
    console.error('Görev durumu güncellenirken hata:', error);
    res.status(500).json({ error: 'Görev durumu güncellenemedi' });
  }
});

// POST /api/tasks/:id/progress - Görev ilerlemesi kaydet
router.post('/:id/progress', async (req, res) => {
  try {
    const { id } = req.params;
    const { currentPosition, elapsedMs, progressPercentage } = req.body;
    
    if (!currentPosition || elapsedMs === undefined || progressPercentage === undefined) {
      return res.status(400).json({ error: 'Gerekli alanlar eksik' });
    }

    let lat, lng, alt;
    if (Array.isArray(currentPosition)) {
      [lat, lng, alt] = currentPosition;
    } else {
      lat = currentPosition.lat;
      lng = currentPosition.lng;
      alt = currentPosition.alt;
    }

    const result = await pool.query(`
      INSERT INTO task_progress (
        task_id, current_position_lat, current_position_lng, current_position_alt,
        elapsed_ms, progress_percentage, recorded_at
      ) VALUES ($1, $2, $3, $4, $5, $6, NOW())
      RETURNING id
    `, [id, lat, lng, alt, elapsedMs, progressPercentage]);

    res.json({ 
      progressId: result.rows[0].id,
      success: true
    });
  } catch (error) {
    console.error('Görev ilerlemesi kaydedilirken hata:', error);
    res.status(500).json({ error: 'Görev ilerlemesi kaydedilemedi' });
  }
});

export default router;