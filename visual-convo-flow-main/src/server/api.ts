import express from 'express';
import cors from 'cors';
import axios from 'axios';

const app = express();
app.use(cors());
app.use(express.json());

interface WppConfig {
  baseUrl: string;
  token: string;
  session: string;
}

const wppConfig: WppConfig = {
  baseUrl: process.env.WPP_BASE_URL || 'http://localhost:21465',
  token: process.env.WPP_TOKEN || '',
  session: process.env.WPP_SESSION || 'default',
};

app.post('/api/execute-node', async (req, res) => {
  const { nodeType, data, phone } = req.body;

  try {
    switch (nodeType) {
      case 'message':
        const messageResponse = await axios.post(
          `${wppConfig.baseUrl}/api/${wppConfig.session}/send-message`,
          {
            phone,
            message: data.message,
          },
          {
            headers: {
              Authorization: `Bearer ${wppConfig.token}`,
              'Content-Type': 'application/json',
            },
          }
        );
        return res.json(messageResponse.data);

      case 'list':
        const listResponse = await axios.post(
          `${wppConfig.baseUrl}/api/${wppConfig.session}/send-list-message`,
          {
            phone,
            description: data.description,
            buttonText: "Selecione uma opção",
            sections: data.sections,
          },
          {
            headers: {
              Authorization: `Bearer ${wppConfig.token}`,
              'Content-Type': 'application/json',
            },
          }
        );
        return res.json(listResponse.data);

      default:
        return res.status(400).json({ error: 'Node type not supported' });
    }
  } catch (error) {
    console.error('Error executing node:', error);
    return res.status(500).json({ error: 'Failed to execute node' });
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});