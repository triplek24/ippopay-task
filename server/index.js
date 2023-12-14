const express = require('express');
const bodyParser = require('body-parser');
const { MongoClient } = require('mongodb');
const cors = require('cors'); 

const app = express();
const port = 5000;

app.use(cors());
app.use(bodyParser.json());

const uri = 'mongodb://localhost:27017';
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

app.post('/saveResult', async (req, res) => {
  try {
    const result = req.body.result;

    await client.connect();
    const database = client.db('passwordResults');
    const collection = database.collection('results');

    await collection.insertOne({ result });

    res.status(200).json({ success: true });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: 'Internal Server Error' });
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
