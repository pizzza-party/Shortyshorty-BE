import { APIGatewayProxyEvent } from 'aws-lambda';

interface Event extends APIGatewayProxyEvent {
  queryStringParameters: null | {
    url: string;
  };
  pathParameters: null | {
    shortUrl: string;
  };
}

export { Event };
