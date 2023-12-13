import {
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
  @IsWithHttpProtocol({
    message: 'Need HTTP Protocol.',
  })
  originalUrl!: string;
}

class ShortUrlValidator {
  @IsString()
  @Length(6, 6)
  shortUrl!: string;
}

export { OriginalUrlValidator, ShortUrlValidator };
