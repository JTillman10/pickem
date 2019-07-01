import { IsString } from 'class-validator';
import { Role } from '../user.entity';

export class NewUser {
  @IsString() email: string;
  @IsString() password: string;
  @IsString() firstName: string;
  @IsString() lastName: string;
  role?: Role;
}
