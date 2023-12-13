import { StatusCodes } from 'http-status-codes';
import { validate } from 'class-validator';
import { APIGatewayProxyResult } from 'aws-lambda';
import { Event } from './@types/event';
import { indexToBase62, base62ToIndex } from './converter';
import { CustomError } from './error';
import { connectDatabase } from './db';
import { OriginalUrlValidator, ShortUrlValidator } from './validator';

const shortUrlConverter = async (
  event: Event
): Promise<APIGatewayProxyResult> => {
  try {
    // Validation
    const { url } = event.queryStringParameters;
    const validator = new OriginalUrlValidator();
    validator.originalUrl = url;
    const validationError = await validate(validator);
    if (validationError.length) {
      throw new CustomError(StatusCodes.BAD_REQUEST, 'Need HTTP Protocol.');
    }

    // Create DB
    const db = await connectDatabase();
    if (!db) {
      throw new CustomError(
        StatusCodes.INTERNAL_SERVER_ERROR,
        'DB Connection Failed'
      );
    }

    const insertQuery = `
      INSERT INTO url (origin_url)
      VALUES ($1)
      ON CONFLICT (origin_url)
      DO UPDATE
      SET
        updated_at = NOW()
      RETURNING id;`;
    const result = await db.query(insertQuery, [url]);
    if (!result.rows.length) {
      throw new CustomError(
        StatusCodes.INTERNAL_SERVER_ERROR,
        'DB Insert Fail'
      );
    }
    const id = result.rows[0].id;
    const shortUrlToBase62 = indexToBase62(id);

    return {
      statusCode: StatusCodes.CREATED,
      headers: {
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'OPTIONS,POST,GET',
      },
      body: JSON.stringify({
        message: '🔁 Convert Success!',
        data: shortUrlToBase62,
      }),
    };
  } catch (error) {
    if (error instanceof CustomError) {
      return {
        statusCode: error.statusCode,
        body: JSON.stringify({
          message: error.message,
        }),
      };
    }

    return {
      statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
      body: JSON.stringify({
        error,
      }),
    };
  }
};

const redirectionToOrigin = async (
  event: Event
): Promise<APIGatewayProxyResult> => {
  try {
    // Validation
    const { shortUrl } = event.pathParameters;
    const validator = new ShortUrlValidator();
    validator.shortUrl = shortUrl;
    const validationError = await validate(validator);
    if (validationError.length) {
      throw new CustomError(StatusCodes.BAD_REQUEST, 'Invalid shortUrl Type');
    }

    // Read DB
    const db = await connectDatabase();
    if (!db) {
      throw Error('DB Failed');
    }

    const id = base62ToIndex(shortUrl);

    const query = `
      SELECT origin_url
      FROM url
      WHERE id = $1;`;
    const result = await db.query(query, [id]);
    if (!result.rows.length)
      throw new CustomError(StatusCodes.NOT_FOUND, 'Url Not Found');
    const originUrl = result.rows[0].origin_url;

    return {
      statusCode: StatusCodes.MOVED_PERMANENTLY,
      headers: {
        Location: originUrl, // Redirection Location
      },
      body: '',
    };
  } catch (error) {
    if (error instanceof CustomError) {
      return {
        statusCode: error.statusCode,
        body: JSON.stringify({
          message: error.message,
        }),
      };
    }

    return {
      statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
      body: JSON.stringify({
        error,
      }),
    };
  }
};

const handler = async (event: Event): Promise<APIGatewayProxyResult> => {
  let response: APIGatewayProxyResult;

  if (event.httpMethod === 'POST') {
    response = await shortUrlConverter(event);
  } else if (event.httpMethod === 'GET') {
    response = await redirectionToOrigin(event);
  } else {
    return {
      statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
      body: JSON.stringify({
        message: 'Wrong HTTP Method',
      }),
    };
  }

  return response;
};

export { handler };
