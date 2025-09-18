
require('dotenv').config();
const express = require('express');
const app = express();
const PORT = process.env.PORT || 3001;

const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = process.env.MONGODB_URI;
const dbName = process.env.MONGODB_DB;

app.use(express.json());

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

app.get('/', async (req, res) => {
  try {
    await client.connect();
    await client.db(dbName).command({ ping: 1 });
    res.send('Backend is running and connected to MongoDB!');
  } catch (err) {
    res.status(500).send('Error connecting to MongoDB');
  }
});

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
