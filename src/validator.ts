import {
  IsNotEmpty,
  IsString,
  Length,
  registerDecorator,
  ValidationOptions,
  validate,
} from 'class-validator';
import { StatusCodes } from 'http-status-codes';
import { PathParameter, QueryParameter } from './@types/event';
import { CustomError } from './error';

const IsWithHttpProtocol = (validationOptions?: ValidationOptions) => {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      constraints: [],
      options: validationOptions,
      validator: {
        validate(url: string): boolean {
          return /^https?:\/\//.test(url);
        },
      },
    });
  };
};

class OriginalUrl {
  @IsString()
  @IsNotEmpty()
  @IsWithHttpProtocol()
  originalUrl: string | undefined;
}

class ShortUrl {
  @IsString()
  @IsNotEmpty()
  @Length(6, 6)
  shortUrl!: string | undefined;
}

const urlValidator = async (query: QueryParameter): Promise<string> => {
  let url;

  if (!query) {
    url = undefined;
  } else {
    url = query.url;
  }

  const validator = new OriginalUrl();
  validator.originalUrl = url;
  const validationError = await validate(validator);
  if (validationError.length) {
    throw new CustomError(
      StatusCodes.BAD_REQUEST,
      'Validation Error',
      validationError
    );
  }

  return url as string;
};

const shortUrlValidator = async (path: PathParameter): Promise<string> => {
  let shortUrl;

  if (!path) {
    shortUrl = undefined;
  } else {
    shortUrl = path.shortUrl;
  }

  const validator = new ShortUrl();
  validator.shortUrl = shortUrl;
  const validationError = await validate(validator);
  if (validationError.length) {
    throw new CustomError(
      StatusCodes.BAD_REQUEST,
      'Validation Fail',
      validationError
    );
  }

  return shortUrl as string;
};

export { urlValidator, shortUrlValidator };
