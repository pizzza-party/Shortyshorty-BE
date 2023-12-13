import { APIGatewayProxyEvent } from 'aws-lambda';

interface Event extends APIGatewayProxyEvent {
  queryStringParameters: {
    url: string;
  };
  pathParameters: {
    shortUrl: string;
  };
}

export { Event };
