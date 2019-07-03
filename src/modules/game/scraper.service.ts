import { Injectable } from '@nestjs/common';

import * as $ from 'cheerio';
import { launch, Browser, Page } from 'puppeteer';
import { Game } from './game.entity';

@Injectable()
export class ScraperService {
  async scrape(): Promise<Game[]> {
    const browser: Browser = await launch({
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
    });
    const page: Page = await browser.newPage();
    await page.goto('https://www.sportsbetting.ag/sportsbook/football/ncaa');
    const html: string = await page.content();

    const games: Game[] = [];
    let date: Date;
    $(html)
      .find('table.league tbody')
      .each((tableIndex, table) => {
        const tableClass: string = $(table).attr('class');
        if (tableClass.includes('date')) {
          const text = $(table)
            .find('td')
            .text()
            .trim();
          date = new Date(text.split(' -')[0]);
        }

        if (tableClass.includes('event')) {
          let home: string;
          let away: string;
          let line: number;
          const gameDate = new Date(date);

          // const game: Game = { date: new Date(date) };
          $(table)
            .find('tr')
            .each((rowIndex, row) => {
              const rowClass = $(row).attr('class');
              if (rowClass.includes('firstline')) {
                $(row)
                  .find('td')
                  .each((columnIndex, column) => {
                    const columnClass: string = $(column).attr('class');
                    const columnText: string = $(column)
                      .text()
                      .trim();
                    if (columnClass.includes('col_time')) {
                      const hours: number = parseInt(
                        columnText.split(':')[0].trim(),
                        10,
                      );
                      const minutes: number = parseInt(
                        columnText
                          .split(' ')[0]
                          .split(':')[1]
                          .trim(),
                        10,
                      );
                      const pm: boolean =
                        columnText.split(' ')[1].trim() === 'PM';

                      gameDate.setHours(pm ? hours + 12 : hours);
                      gameDate.setMinutes(minutes);
                    }

                    if (columnClass.includes('col_teamname')) {
                      away = columnText;
                    }
                  });
              }

              if (rowClass.includes('otherline')) {
                $(row)
                  .find('td')
                  .each((columnIndex, column) => {
                    const columnClass: string = $(column).attr('class');
                    const columnText: string = $(column)
                      .text()
                      .trim();
                    if (columnClass.includes('col_teamname')) {
                      home = columnText;
                    }
                    if (columnClass.includes('hdcp') && !line) {
                      const half: boolean =
                        columnText[columnText.length - 1] &&
                        columnText.charCodeAt(columnText.length - 1) === 189;
                      const digit: string = parseFloat(columnText).toString();
                      line = parseFloat(`${digit}${half ? '.5' : ''}`);
                    }
                  });
              }
            });
          if (home && away) {
            const game: Game = {
              home,
              away,
              line,
              date: gameDate,
            };
            games.push(game);
          }
        }
      });

    browser.close();

    return games;
  }
}
