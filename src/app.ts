import express from 'express';
import dotenv from 'dotenv/config';
import { StatusCodes } from 'http-status-codes';
import swaggerUi from 'swagger-ui-express';
import fs from 'fs';
import YAML from 'yaml';
import cors from 'cors';
import Url from './db';
import { indexToBase62, base62ToIndex } from './converter';

const app = express();
const port = process.env.PORT;

app.use(cors());
app.use(express.json());

// Swagger
const file = fs.readFileSync('./src/swagger.yaml', 'utf8');
const swaggerDocument = YAML.parse(file);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.post('/api', async (req, res) => {
  try {
    const { url } = req.body;

    const { dataValues } = await Url.create({
      originUrl: 'https://www.naver.com',
    });
    console.log(dataValues);

    const shortUrlToBase62 = indexToBase62(dataValues.id);

    return res.status(StatusCodes.OK).json({
      message: '🔁 Convert Success!',
      data: shortUrlToBase62,
    });
  } catch (error) {
    console.error(error);
  }
});

app.get('/api/:shortUrl', async (req, res) => {
  try {
    const { shortUrl } = req.params;

    // insert DB
    const id = base62ToIndex(shortUrl);

    const [{ dataValues }, ...rest] = await Url.findAll({
      where: {
        id,
      },
    });
    console.log(dataValues);

    // res.header();
    // res.;

    return res.redirect(dataValues.originUrl);

    /* return res.status(StatusCodes.OK).json({
      message: '🔁 Redirection Success!',
      data: dataValues.originUrl,
    }); */
  } catch (error) {
    console.error(error);
  }
});

app.listen(port, () => {
  console.log(`Hello, ${port}`);
});
