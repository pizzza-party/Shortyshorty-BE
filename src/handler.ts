import { StatusCodes } from 'http-status-codes';
import { ValidationError, validate } from 'class-validator';
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
    let url;
    if (!event.queryStringParameters) {
      url = undefined;
    } else {
      url = event.queryStringParameters.url;
    }
    const validator = new OriginalUrlValidator();
    validator.originalUrl = url;
    const validationError: ValidationError[] = await validate(validator);
    if (validationError.length) {
      throw new CustomError(
        StatusCodes.BAD_REQUEST,
        'Validation Error',
        validationError
      );
    }

    // Create DB
    const db = await connectDatabase();

    // const insertQuery = ;
    const result = await db.query(
      `
        INSERT INTO url (origin_url)
        VALUES ($1)
        ON CONFLICT (origin_url)
        DO UPDATE
        SET
          updated_at = NOW()
        RETURNING id;`,
      [url]
    );
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
        'Access-Control-Allow-Origin': 'https://www.shortyshorty.site',
        'Access-Control-Allow-Methods': 'OPTIONS,POST',
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
        body: error.body,
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
    let shortUrl;
    if (!event.pathParameters) {
      shortUrl = undefined;
    } else {
      shortUrl = event.pathParameters.shortUrl;
    }
    const validator = new ShortUrlValidator();
    validator.shortUrl = shortUrl;
    const validationError = await validate(validator);
    if (validationError.length) {
      throw new CustomError(
        StatusCodes.BAD_REQUEST,
        'Validation Fail',
        validationError
      );
    }

    // Read DB
    const db = await connectDatabase();

    const id = base62ToIndex(shortUrl!);

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
        body: error.body,
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
    response = {
      statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
      headers: {
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'OPTIONS,POST',
      },
      body: JSON.stringify({
        message: 'Wrong HTTP Method',
      }),
    };
  }

  return response;
};

export { handler };
