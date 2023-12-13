const base62Char =
  'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

const indexToBase62 = (index: number) => {
  let shortUrl = '';

  while (index > 0) {
    shortUrl = base62Char[index % 62] + shortUrl;
    index = Math.floor(index / 62);
  }

  if (shortUrl.length < 6) {
    shortUrl = '='.repeat(6 - shortUrl.length) + shortUrl;
  }

  return shortUrl;
};

const base62ToIndex = (shortUrl: string) => {
  let index = 0;
  let shortUrlIndex = shortUrl.length - 1;

  for (let exponent = 0; exponent < shortUrl.length; exponent++) {
    if (shortUrl[shortUrlIndex] === '=') {
      break;
    }
    index +=
      Math.pow(62, exponent) * base62Char.indexOf(shortUrl[shortUrlIndex--]);
  }

  return index;
};

export { indexToBase62, base62ToIndex };
