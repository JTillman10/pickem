import { Controller, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { apiPrefix } from '../../config';

@Controller(`${apiPrefix}/picks`)
@UseGuards(AuthGuard('jwt'))
export class PickController {}
