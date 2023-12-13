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

type Response = APIGatewayProxyResult | CustomError | unknown;

export { QueryEvent, ParamEvent, Response };
