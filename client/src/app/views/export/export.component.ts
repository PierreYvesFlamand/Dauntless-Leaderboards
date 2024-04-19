import { Component } from '@angular/core';
import { EventService } from '../../services/event.service';
import { environment } from '../../../environments/environment';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { ALL_SEASONS } from '../../../../../server/src/types';

/**
 * Accessible with /export
 * Hidden to not have too many users using it as it's niche
 */

@Component({
  selector: 'app-export',
  templateUrl: './export.component.html',
  styleUrls: ['./export.component.scss']
})
export class ExportComponent {
  public seasonId?: number;

  constructor(
    private eventService: EventService,
    private ngxUiLoaderService: NgxUiLoaderService
  ) {
    this.eventService.updateTitle('Export');
    this.eventService.updateActiveMenu('');
  }

  public async export(type: 'csv' | 'flourish') {
    this.ngxUiLoaderService.start();

    let data: ALL_SEASONS = {};
    try {
      const res = await fetch(`${environment.backendUrl}/data/season-${String(this.seasonId).padStart(2, '0')}-all-raw.json`);
      data = await res.json();
    } catch (error) {
      this.ngxUiLoaderService.stop();
      return;
    }

    const headers: Array<string> = ['Full date'];
    let lines: any = [];

    for (const key of Object.keys(data)) {
      const line = [];
      const seasonAtDate = data[key];
      const date = new Date(Date.UTC(
        Number(key.split('--')[0].split('-')[0]),
        Number(key.split('--')[0].split('-')[1]) - 1,
        Number(key.split('--')[0].split('-')[2]),
        Number(key.split('--')[1].split('-')[0]),
        Number(key.split('--')[1].split('-')[1])
      ));

      line.push(`${date.getUTCFullYear()}/${String(date.getUTCMonth() + 1).padStart(2, '0')}/${String(date.getUTCDate()).padStart(2, '0')} ${date.getUTCHours()}:${String(date.getUTCMinutes()).padStart(2, '0')}`);


      for (const l of seasonAtDate.leaderboard) {
        if (!headers.includes(`${l.guildName} [${l.guildNameplate}]`)) {
          headers.push(`${l.guildName} [${l.guildNameplate}]`);
        }

        if (type === 'flourish') {
          const guildsToOrder = seasonAtDate.leaderboard.filter(g => g.level === l.level);
          if (guildsToOrder.length < 2) continue;
          guildsToOrder.forEach((guildToOrder, index) => {
            guildToOrder.level += (0.001 * (guildsToOrder.length - index));
          });
        }
      }

      for (const header of headers.slice(1)) {
        const l = seasonAtDate.leaderboard.find(l => `${l.guildName} [${l.guildNameplate}]` === header);

        line.push(l ? l.level : '');
      }
      lines.push(line);
    }

    lines.unshift(headers);

    if (type === 'flourish') {
      lines = lines[0].map((_: any, colIndex: any) => lines.map((row: any) => row[colIndex]));
    }

    const linesToText = [];
    for (const line of lines) {
      linesToText.push(line.join(','));
    }

    const link = document.createElement('a');
    const file = new Blob([linesToText.join('\n')], { type: 'text/plain' });
    link.href = URL.createObjectURL(file);
    link.download = 'export.csv';
    link.click();
    URL.revokeObjectURL(link.href);

    this.ngxUiLoaderService.stop();
  }
}