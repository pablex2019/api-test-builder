const express = require('express');
const cors = require('cors');
const axios = require('axios');
const { generatePostmanTests } = require('./services/testGenerator');

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.json({ message: 'API Test Builder backend funcionando' });
});

app.post('/send-request', async (req, res) => {
  try {
    const { method, url, body, headers } = req.body;

    const response = await axios({
      method,
      url,
      data: body,
      headers: headers || {},
    });

    res.json({
      status: response.status,
      headers: response.headers,
      data: response.data,
    });
  } catch (error) {
    res.status(500).json({
      error: error.message,
      details: error.response?.data || null,
    });
  }
});

app.post('/generate-tests', (req, res) => {
  const { responseBody, status } = req.body;

  const tests = generatePostmanTests(responseBody, status);

  res.json({ tests });
});

app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});