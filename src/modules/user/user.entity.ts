import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { IsString, IsEmail, IsOptional, IsEnum } from 'class-validator';
import { Role } from './models/role.enum';
import { Pick } from '../pick/pick.entity';

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

  @OneToMany(type => Pick, pick => pick.user) picks?: Pick[];
}
