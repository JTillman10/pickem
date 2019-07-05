import { Controller, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Controller('picks')
@UseGuards(AuthGuard('jwt'))
export class PickController {}
