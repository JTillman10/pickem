import { Injectable, NestMiddleware } from '@nestjs/common';
import { apiPrefix } from '../../config';
import { Request, Response } from 'express';
import { join, resolve } from 'path';

const allowedExtentions = [
  '.js',
  '.ico',
  '.css',
  '.png',
  '.jpg',
  '.woff2',
  '.woff',
  '.ttf',
  '.svg',
];

const prefix = apiPrefix;

// const resolvePath = (file: string) => resolve(`./dist/client/${file}`);

@Injectable()
export class FrontendMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: () => void) {
    // const { url } = req; use Request object from nestjs
    const { baseUrl } = req;
    if (baseUrl.indexOf(prefix) === 0) {
      next();
    } else if (
      allowedExtentions.filter(extention => baseUrl.indexOf(extention) > 0)
        .length > 0
    ) {
      // res.sendFile(resolvePath(baseUrl));
      res.sendFile(join(__dirname, '..', '..', '..', 'client', baseUrl));
    } else {
      // res.sendFile(resolvePath('index.html'));
      res.sendFile(join(__dirname, '..', '..', '..', 'client', 'index.html'));
    }
  }
}
