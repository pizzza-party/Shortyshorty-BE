import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { StatusCodes } from 'http-status-codes';
import { indexToBase62, base62ToIndex } from './converter';

const shortUrlConverter = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  try {
    /* const { url } = req.query;

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
    } */

    const shortUrlToBase62 = indexToBase62(2000);

    return {
      statusCode: StatusCodes.CREATED,
      body: JSON.stringify({
        message: '🔁 Convert Success!',
        data: shortUrlToBase62,
      }),
    };
  } catch (error) {
    console.error(error);
    return {
      statusCode: StatusCodes.BAD_REQUEST,
      body: JSON.stringify({
        message: 'Failed',
        error,
      }),
    };
  }
};

type sample = Pick<APIGatewayProxyResult, 'statusCode' | 'headers'>;

const redirectionToOrigin = async (
  event: APIGatewayProxyEvent
): Promise<sample | APIGatewayProxyResult> => {
  try {
    /* const { shortUrl } = req.params;
    const id = base62ToIndex(shortUrl);
    const url = await Url.findOne({
      where: {
        id,
      },
    });
    if (!url) throw new customError(StatusCodes.BAD_REQUEST, 'DB가 없음');
    */

    const originUrl = 'https://www.google.com';

    return {
      statusCode: StatusCodes.MOVED_PERMANENTLY,
      headers: {
        Location: originUrl,
      },
    };
  } catch (error) {
    return {
      statusCode: StatusCodes.BAD_REQUEST,
      body: JSON.stringify({
        message: 'Failed',
        error,
      }),
    };
  }
};

export { shortUrlConverter, redirectionToOrigin };
