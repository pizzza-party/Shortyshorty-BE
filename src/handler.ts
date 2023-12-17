import { StatusCodes } from 'http-status-codes';
import { APIGatewayProxyResult } from 'aws-lambda';
import { Event } from './@types/event';
import { indexToBase62, base62ToIndex } from './converter';
import { CustomError, errorHandler } from './error';
import { connectDatabase } from './db';
import { urlValidator, shortUrlValidator } from './validator';

const corsHeaders = {
  'Access-Control-Allow-Headers': 'Content-Type',
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST,GET',
};

const shortUrlConverter = async (
  event: Event
): Promise<APIGatewayProxyResult> => {
  try {
    const url = await urlValidator(event.queryStringParameters);
    const db = await connectDatabase();

    let result = await db.query(`SELECT id FROM url WHERE origin_url = $1;`, [
      url,
    ]);
    if (!result.rows.length) {
      result = await db.query(
        `INSERT INTO url (origin_url) VALUES ($1) RETURNING id;`,
        [url]
      );
    }
    const id = result.rows[0].id;
    const shortUrlToBase62 = indexToBase62(id);

    return {
      statusCode: StatusCodes.CREATED,
      headers: corsHeaders,
      body: JSON.stringify({
        message: '🔁 Convert Success!',
        data: shortUrlToBase62,
      }),
    };
  } catch (error) {
    return errorHandler(error);
  }
};

const redirectionToOrigin = async (
  event: Event
): Promise<APIGatewayProxyResult> => {
  try {
    const shortUrl = await shortUrlValidator(event.pathParameters);
    const db = await connectDatabase();
    const id = base62ToIndex(shortUrl);

    const result = await db.query(`SELECT origin_url FROM url WHERE id = $1;`, [
      id,
    ]);
    if (!result.rows.length) {
      throw new CustomError(StatusCodes.NOT_FOUND, 'Url Not Found');
    }
    const originUrl = result.rows[0].origin_url;

    return {
      statusCode: StatusCodes.OK,
      headers: {
        ...corsHeaders,
      },
      body: JSON.stringify({ data: originUrl }),
    };
  } catch (error) {
    return errorHandler(error);
  }
};

const handler = async (event: Event): Promise<APIGatewayProxyResult> => {
  let response: APIGatewayProxyResult;

  if (event.httpMethod === 'POST') {
    response = await shortUrlConverter(event);
  } else if (event.httpMethod === 'GET') {
    response = await redirectionToOrigin(event);
  } else {
    response = errorHandler(
      new CustomError(
        StatusCodes.INTERNAL_SERVER_ERROR,
        JSON.stringify({
          message: 'Wrong HTTP Method',
        })
      )
    );
  }

  return response;
};

export { handler };
