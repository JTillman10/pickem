import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';
import { IsString, IsEmail, IsOptional, IsEnum } from 'class-validator';
import { Role } from './models/role.enum';

@Entity('user')
export class User {
  @PrimaryGeneratedColumn()
  id?: number;

  @IsEmail()
  @Column()
  email: string;

  @IsString()
  @Column()
  password: string;

  @IsString()
  @Column()
  firstName: string;

  @IsString()
  @Column()
  lastName: string;

  @IsOptional()
  @IsEnum(Role)
  @Column()
  role?: Role;
}
