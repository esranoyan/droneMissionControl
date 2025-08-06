import express from 'express';
import pool from '../db';

const router = express.Router();

// Tüm drone'ları getir
router.get('/', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM drones ORDER BY id');
    res.json(result.rows);
  } catch (err) {
    console.error('Veri çekme hatası:', err);
    res.status(500).json({ error: 'Drone verileri alınamadı' });
  }
});

// Belirli bir drone'u getir
router.get('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query('SELECT * FROM drones WHERE id = $1', [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Drone bulunamadı' });
    }
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Drone alınamadı' });
  }
});

// Yeni drone ekle
router.post('/', async (req, res) => {
  const { name, position_lat, position_lng, position_alt } = req.body;
  try {
    const result = await pool.query(
      `INSERT INTO drones (name, position_lat, position_lng, position_alt)
       VALUES ($1, $2, $3, $4) RETURNING *`,
      [name, position_lat, position_lng, position_alt]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Drone eklenemedi' });
  }
});

// Drone güncelle
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { name, position_lat, position_lng, position_alt } = req.body;
  try {
    const result = await pool.query(
      `UPDATE drones
       SET name = $1, position_lat = $2, position_lng = $3, position_alt = $4
       WHERE id = $5 RETURNING *`,
      [name, position_lat, position_lng, position_alt, id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Drone bulunamadı' });
    }
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Drone güncellenemedi' });
  }
});

// Drone sil
router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query('DELETE FROM drones WHERE id = $1 RETURNING *', [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Drone bulunamadı' });
    }
    res.json({ message: 'Drone silindi', drone: result.rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Drone silinemedi' });
  }
});

export default router;

