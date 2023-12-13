import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { CustomError } from '../error';

interface Event extends APIGatewayProxyEvent {
  queryStringParameters: {
    url: string;
  };
  pathParameters: {
    shortUrl: string;
  };
}

type RedirectionResponse = Pick<APIGatewayProxyEvent, 'statusCode' | 'headers'>;
type Response = APIGatewayProxyResult | RedirectionResponse | CustomError;

export { Event, Response };
