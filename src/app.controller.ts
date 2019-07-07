import { Controller, Get, Res } from '@nestjs/common';
import * as path from 'path';
import { Response } from 'express';

@Controller()
export class AppController {
  @Get()
  root(@Res() response: Response) {
    response.sendFile(path.resolve('dist/client/index.html'));
  }
}
