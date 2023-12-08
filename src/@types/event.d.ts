import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';

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

interface Error {
  statusCode: number;
  error: unknown;
}

type Response = Pick<APIGatewayProxyResult, 'statusCode' | 'headers'>;

export { QueryEvent, ParamEvent, Response, Error };
