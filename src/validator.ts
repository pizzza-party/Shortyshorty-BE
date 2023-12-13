import {
  IsNotEmpty,
  IsString,
  Length,
  registerDecorator,
  ValidationOptions,
} from 'class-validator';

function IsWithHttpProtocol(validationOptions?: ValidationOptions) {
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
}

class OriginalUrlValidator {
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

export { OriginalUrlValidator, ShortUrlValidator };
