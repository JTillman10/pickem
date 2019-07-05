import { Injectable, BadRequestException } from '@nestjs/common';
import { Pick } from './pick.entity';
import { LineWinner } from '../game/models/line-winner.enum';
import { OverunderWinner } from '../game/models/overunder-winner.enum';
import { User } from '../user/user.entity';
import { Game } from '../game/game.entity';

@Injectable()
export class PickValidatorService {
  async validatePicks(
    picks: Pick[],
    currentPicks: Pick[],
    user: User,
    game: Game,
  ) {
    this.validatePicksAreConsistent(picks, user, game);
    this.validateNumberOfPicksPerWeekOfSeason(picks, currentPicks);
    this.validateDuplicatePicks(picks, currentPicks);
    this.validatePickGameDates(picks);
  }

  private validatePicksAreConsistent(picks: Pick[], user: User, game: Game) {
    if (!picks.every((pick: Pick) => pick.user.id === user.id)) {
      throw new BadRequestException('All picks must have the same user');
    }

    if (!picks.every((pick: Pick) => pick.game.season === game.season)) {
      throw new BadRequestException('All picks must have the same season');
    }

    if (!picks.every((pick: Pick) => pick.game.week === game.week)) {
      throw new BadRequestException('All picks must have the same week');
    }
  }

  private validateNumberOfPicksPerWeekOfSeason(
    picks: Pick[],
    currentPicks: Pick[],
  ) {
    if (currentPicks.length + picks.length > 4) {
      throw new BadRequestException(
        `Maximum of 4 picks allowed per week/season. Already have ${currentPicks.length} picks saved`,
      );
    }
  }

  private validateDuplicatePicks(picks: Pick[], currentPicks: Pick[]) {
    const allPicks = currentPicks.concat(picks);
    if (this.hasDuplicatePicks(allPicks)) {
      throw new BadRequestException('Cannot create a duplicate pick');
    }
  }

  private validatePickGameDates(picks: Pick[]) {
    if (this.hasPicksInPast(picks)) {
      throw new BadRequestException('Cannot pick a game that is in the past');
    }
  }

  private hasDuplicatePicks(picks: Pick[]): boolean {
    return picks.reduce((value: boolean, currentPick: Pick) => {
      return (
        value ||
        !!picks.find(
          (pick: Pick) =>
            pick.game.id === currentPick.game.id &&
            this.areSelectionsEqual(pick.selection, currentPick.selection) &&
            (pick.id !== currentPick.id || (!pick.id && !currentPick.id)),
        )
      );
    }, false);
  }

  private areSelectionsEqual(selection1: string, selection2: string): boolean {
    const lineWinnerValues = Object.values(LineWinner);
    const overunderWinnerValues = Object.values(OverunderWinner);

    return (
      (lineWinnerValues.includes(selection1) &&
        lineWinnerValues.includes(selection2)) ||
      (overunderWinnerValues.includes(selection1) &&
        overunderWinnerValues.includes(selection2))
    );
  }

  private hasPicksInPast(picks: Pick[]): boolean {
    const now = new Date();
    return picks.reduce((value: boolean, currentPick: Pick) => {
      return value || currentPick.game.date < now;
    }, false);
  }
}
