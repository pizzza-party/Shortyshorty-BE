import { APIGatewayProxyEvent } from 'aws-lambda';

interface Event extends APIGatewayProxyEvent {
  queryStringParameters: QueryParameter;
  pathParameters: PathParameter;
}

type QueryParameter = null | { url: string };
type PathParameter = null | { shortUrl: string };

export { Event, QueryParameter, PathParameter };
