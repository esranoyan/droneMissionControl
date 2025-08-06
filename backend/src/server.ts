import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';

import droneRoutes from './routes/drones';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.send('Sunucu çalışıyor');
});

app.use('/api/drones', droneRoutes);

app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});

//http://localhost:3000/api/drones json dosyalarını görmek için

