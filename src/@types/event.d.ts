import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { CustomError } from '../error';

interface QueryEvent extends APIGatewayProxyEvent {
  queryStringParameters: {
    url: string;
  };
}

interface ParamEvent extends APIGatewayProxyEvent {
  pathParameters: {
    shortUrl: string;
  };
}

type RedirectionResponse = Pick<APIGatewayProxyEvent, 'statusCode' | 'headers'>;
type Response = APIGatewayProxyResult | RedirectionResponse | CustomError;

export { QueryEvent, ParamEvent, Response };
