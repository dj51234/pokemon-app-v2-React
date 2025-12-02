const express = require('express');
const cors = require('cors');
const axios = require('axios');

const app = express();
app.use(cors());

const API_KEY = '1d9fae19-4bf6-4422-bdf4-6128f7cda936';
const BASE_URL = 'https://api.pokemontcg.io/v2';

app.use('/api', async (req, res) => {
  try {
    const path = req.url.substring(1); // Remove leading slash
    const url = `${BASE_URL}/${path}`;
    
    console.log('Fetching:', url);
    
    const response = await axios.get(url, {
      headers: { 'X-Api-Key': API_KEY }
    });
    
    console.log('Success! Status:', response.status);
    res.json(response.data);
  } catch (error) {
    console.error('Error:', error.message);
    res.status(500).json({ error: error.message });
  }
});

app.listen(3001, () => {
  console.log('Proxy server running on http://localhost:3001');
});