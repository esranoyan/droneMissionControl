import pool from '../config/database';

const initDatabase = async () => {
  try {
    console.log('Database initialization started...');

    // Create drones table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS drones (
        id SERIAL PRIMARY KEY,
        name VARCHAR(100) NOT NULL UNIQUE,
        position_lat DECIMAL(10, 8) NOT NULL,
        position_lng DECIMAL(11, 8) NOT NULL,
        position_alt DECIMAL(8, 2) DEFAULT 0,
        is_moving BOOLEAN DEFAULT FALSE,
        battery_level INTEGER DEFAULT 100,
        status VARCHAR(20) DEFAULT 'idle',
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      )
    `);
    console.log('Drones table created/verified');

    // Create tasks table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS tasks (
        id SERIAL PRIMARY KEY,
        drone_id INTEGER REFERENCES drones(id) ON DELETE CASCADE,
        drone_name VARCHAR(100),
        start_position_lat DECIMAL(10, 8) NOT NULL,
        start_position_lng DECIMAL(11, 8) NOT NULL,
        start_position_alt DECIMAL(8, 2) DEFAULT 0,
        target_position_lat DECIMAL(10, 8) NOT NULL,
        target_position_lng DECIMAL(11, 8) NOT NULL,
        target_position_alt DECIMAL(8, 2) DEFAULT 0,
        duration INTEGER NOT NULL,
        description TEXT,
        status VARCHAR(20) DEFAULT 'pending',
        actual_duration INTEGER,
        color VARCHAR(7) DEFAULT '#ff0000',
        created_at TIMESTAMP DEFAULT NOW(),
        started_at TIMESTAMP,
        completed_at TIMESTAMP,
        updated_at TIMESTAMP DEFAULT NOW()
      )
    `);
    console.log('Tasks table created/verified');

    // Create task_progress table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS task_progress (
        id SERIAL PRIMARY KEY,
        task_id INTEGER REFERENCES tasks(id) ON DELETE CASCADE,
        current_position_lat DECIMAL(10, 8) NOT NULL,
        current_position_lng DECIMAL(11, 8) NOT NULL,
        current_position_alt DECIMAL(8, 2) DEFAULT 0,
        elapsed_ms INTEGER NOT NULL,
        progress_percentage DECIMAL(5, 2) NOT NULL,
        recorded_at TIMESTAMP DEFAULT NOW()
      )
    `);
    console.log('Task progress table created/verified');

    // Create indexes for better performance
    await pool.query(`
      CREATE INDEX IF NOT EXISTS idx_tasks_drone_id ON tasks(drone_id);
      CREATE INDEX IF NOT EXISTS idx_tasks_status ON tasks(status);
      CREATE INDEX IF NOT EXISTS idx_task_progress_task_id ON task_progress(task_id);
    `);
    console.log('Database indexes created/verified');

    // Insert sample data
    const dronesResult = await pool.query('SELECT COUNT(*) FROM drones');
    if (parseInt(dronesResult.rows[0].count) === 0) {
      await pool.query(`
        INSERT INTO drones (name, position_lat, position_lng, position_alt, battery_level, status)
        VALUES 
          ('İHA-001', 39.92077, 32.85411, 850, 85, 'idle'),
          ('İHA-002', 39.91077, 32.86411, 850, 92, 'idle')
      `);
      console.log('Sample drones inserted');
    } else {
      console.log('Drones already exist, skipping sample data');
    }

    console.log('Database initialization completed successfully!');
    
  } catch (error) {
    console.error('Database initialization failed:', error);
    throw error;
  } finally {
    await pool.end();
    process.exit(0);
  }
};

// Run initialization
initDatabase().catch(console.error);