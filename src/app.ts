import express, { Request, Response, NextFunction } from 'express';
import dotenv from 'dotenv/config';
import { StatusCodes } from 'http-status-codes';
import swaggerUi from 'swagger-ui-express';
import fs from 'fs';
import YAML from 'yaml';
import cors from 'cors';
import Url from './db';
import { indexToBase62, base62ToIndex } from './converter';
import customError from './customError';

const app = express();
const port = process.env.PORT;

app.use(
  cors({
    origin: true,
    credentials: true,
  })
);
app.use(express.json());

// Swagger
const file = fs.readFileSync('./src/swagger.yaml', 'utf8');
const swaggerDocument = YAML.parse(file);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.post('/api', async (req, res, next) => {
  try {
    const { url } = req.body;

    const isExist = await Url.findOne({
      where: {
        originUrl: url,
      },
    });

    let id;
    if (!isExist) {
      const newUrl = await Url.create({
        originUrl: url,
      });

      id = newUrl.dataValues.id;
    } else {
      id = isExist.dataValues.id;
    }

    const shortUrlToBase62 = indexToBase62(id);

    return res.status(StatusCodes.OK).json({
      message: '🔁 Convert Success!',
      data: shortUrlToBase62,
    });
  } catch (error) {
    next(error);
  }
});

app.get('/:shortUrl', async (req, res, next) => {
  try {
    const { shortUrl } = req.params;
    const id = base62ToIndex(shortUrl);
    const url = await Url.findOne({
      where: {
        id,
      },
    });
    if (!url) throw new customError(StatusCodes.BAD_REQUEST, 'DB가 없음');
    const { originUrl } = url.dataValues;
    return res
      .status(StatusCodes.MOVED_PERMANENTLY)
      .header('Access-Control-Allow-Origin: *')
      .redirect(originUrl);
  } catch (error) {
    next(error);
  }
});

app.use(
  (error: customError, req: Request, res: Response, next: NextFunction) => {
    console.log(error);
    return res.status(error.statusCode).json({ message: error.message });
  }
);

app.listen(port, () => {
  console.log(`Hello, ${port}`);
});
