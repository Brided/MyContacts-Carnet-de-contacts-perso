require('dotenv').config();
const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

const { client, connectDB, dbName } = require('./db');
const authRoutes = require('./auth');
const { swaggerUi, swaggerSpec } = require('./swagger');

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.use('/auth', authRoutes);

app.get('/', async (req, res) => {
  try {
    const db = await connectDB();
    await db.command({ ping: 1 });
    res.send('Backend is running and connected to MongoDB!');
  } catch (err) {
    res.status(500).send('Error connecting to MongoDB');
  }
});

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
