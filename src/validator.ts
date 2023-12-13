import {
  IsNotEmpty,
  IsString,
  Length,
  registerDecorator,
  ValidationOptions,
  validate,
} from 'class-validator';
import { StatusCodes } from 'http-status-codes';
import { QueryParameter } from './@types/event';
import { CustomError } from './error';

const IsWithHttpProtocol = function (validationOptions?: ValidationOptions) {
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

class ShortUrlValidator {
  @IsString()
  @IsNotEmpty()
  @Length(6, 6)
  shortUrl!: string | undefined;
}

const urlValidator = async function (query: QueryParameter): Promise<string> {
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

export { urlValidator, ShortUrlValidator };
