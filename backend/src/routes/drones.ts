import express from 'express';
import pool from '../config/database';

const router = express.Router();

type DronePosition = [number, number, number] | { lat: number; lng: number; alt: number };

interface DroneRow {
  id: number;
  name: string;
  position_lat: number;
  position_lng: number;
  position_alt: number;
  is_moving: boolean;
  battery_level: number;
  status: string;
}

function formatDrone(row: DroneRow) {
  return {
    id: row.id,
    name: row.name,
    position: [row.position_lat, row.position_lng, row.position_alt],
    isMoving: row.is_moving,
    batteryLevel: row.battery_level,
    status: row.status,
  };
}

// GET /api/drones - Tüm drone'ları getir
router.get('/', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT id, name, position_lat, position_lng, position_alt, is_moving, battery_level, status
      FROM drones 
      ORDER BY id
    `);

    const drones = result.rows.map(formatDrone);
    res.json(drones);
  } catch (error) {
    console.error('Dronelar getirilirken hata:', error);
    res.status(500).json({ error: 'Dronelar getirilemedi' });
  }
});

// POST /api/drones - Yeni drone ekle
router.post('/', async (req, res) => {
  try {
    const { name, position }: { name?: string; position?: DronePosition } = req.body;

    if (!name || !position) {
      return res.status(400).json({ error: 'Name ve position gerekli' });
    }

    let lat: number, lng: number, alt: number;

    if (Array.isArray(position)) {
      if (position.length !== 3) {
        return res.status(400).json({ error: 'Pozisyon dizisi 3 elemanlı olmalı (lat, lng, alt)' });
      }
      [lat, lng, alt] = position;
    } else if (
      typeof position === 'object' &&
      position !== null &&
      'lat' in position &&
      'lng' in position &&
      'alt' in position
    ) {
      lat = position.lat;
      lng = position.lng;
      alt = position.alt;
    } else {
      return res.status(400).json({ error: 'Geçersiz pozisyon formatı' });
    }

    const result = await pool.query(
      `
      INSERT INTO drones (name, position_lat, position_lng, position_alt, battery_level, status)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING *
    `,
      [name, lat, lng, alt, 100, 'idle']
    );

    const drone = formatDrone(result.rows[0]);
    res.status(201).json(drone);
  } catch (error) {
    console.error('Drone eklenirken hata:', error);
    res.status(500).json({ error: 'Drone eklenemedi' });
  }
});

// PATCH /api/drones/:id/position - Drone pozisyonunu güncelle
router.patch('/:id/position', async (req, res) => {
  try {
    const { id } = req.params;
    const { position, isMoving }: { position?: DronePosition; isMoving?: boolean } = req.body;

    if (!position) {
      return res.status(400).json({ error: 'Position gerekli' });
    }

    let lat: number, lng: number, alt: number;

    if (Array.isArray(position)) {
      if (position.length !== 3) {
        return res.status(400).json({ error: 'Pozisyon dizisi 3 elemanlı olmalı (lat, lng, alt)' });
      }
      [lat, lng, alt] = position;
    } else if (
      typeof position === 'object' &&
      position !== null &&
      'lat' in position &&
      'lng' in position &&
      'alt' in position
    ) {
      lat = position.lat;
      lng = position.lng;
      alt = position.alt;
    } else {
      return res.status(400).json({ error: 'Geçersiz pozisyon formatı' });
    }

    const result = await pool.query(
      `
      UPDATE drones 
      SET position_lat = $1, position_lng = $2, position_alt = $3, is_moving = $4, updated_at = NOW()
      WHERE id = $5
      RETURNING *
    `,
      [lat, lng, alt, isMoving || false, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Drone bulunamadı' });
    }

    const drone = formatDrone(result.rows[0]);
    res.json(drone);
  } catch (error) {
    console.error('Drone pozisyonu güncellenirken hata:', error);
    res.status(500).json({ error: 'Drone pozisyonu güncellenemedi' });
  }
});

// DELETE /api/drones/:id - Drone sil
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query('DELETE FROM drones WHERE id = $1', [id]);

    if (result.rowCount === 0) {
      return res.status(404).json({ error: 'Drone bulunamadı' });
    }

    res.json({ message: 'Drone silindi', success: true });
  } catch (error) {
    console.error('Drone silinirken hata:', error);
    res.status(500).json({ error: 'Drone silinemedi' });
  }
});

export default router;
