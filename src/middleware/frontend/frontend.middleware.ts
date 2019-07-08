import { Injectable, NestMiddleware } from '@nestjs/common';
import { apiPrefix } from '../../config';
import { Request, Response } from 'express';
import { resolve } from 'path';
import { existsSync } from 'fs';

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
      res.sendFile(resolve(`dist/client/${baseUrl}`));
    } else {
      res.sendFile(resolve('dist/client/index.html'));
    }
  }
}
