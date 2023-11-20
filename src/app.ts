import express from 'express';
import dotenv from 'dotenv';
import { StatusCodes } from 'http-status-codes';
import { indexToBase62, base62ToIndex } from './converter';

dotenv.config({ path: '../.env.dev' });

const app = express();
const port = process.env.PORT;

app.use(express.json());

app.post('/api', (req, res) => {
  try {
    const { url } = req.body;

    // insert DB
    const shortUrl = indexToBase62(2147483647);
    return res.status(StatusCodes.OK).json({
      message: '🔁 Convert Success!',
      data: shortUrl,
    });
  } catch (error) {
    console.error(error);
  }
});

app.get('/api/:shortUrl', (req, res) => {
  try {
    const { shortUrl } = req.params;

    // insert DB
    const index = base62ToIndex(shortUrl);
    return res.status(StatusCodes.OK).json({
      message: '🔁 Redirection Success!',
      data: index,
    });
  } catch (error) {
    console.error(error);
  }
});

app.listen(port, () => {
  console.log(`Hello, ${port}`);
});
