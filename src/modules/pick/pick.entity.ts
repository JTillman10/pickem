import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { User } from '../user/user.entity';
import { Game } from '../game/game.entity';
import { LineWinner } from '../game/models/line-winner.enum';
import { OverunderWinner } from '../game/models/overunder-winner.enum';

@Entity('pick')
export class Pick {
  @PrimaryGeneratedColumn()
  id?: number;

  @ManyToOne(type => User, user => user.id) user?: User;
  @ManyToOne(type => Game, game => game.id) game: Game;
  @Column() selection: LineWinner | OverunderWinner;
  @Column({ nullable: true }) win?: boolean;
}
