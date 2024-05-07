import { Component } from '@angular/core';
import { environment } from '../../../environments/environment';
import { GAUNTLET_EXPORT } from '../../../../../backend/src/types/types';

@Component({
  selector: 'dl-export',
  templateUrl: './export.component.html',
  styleUrls: ['./export.component.scss']
})
export class ExportComponent {
  public seasonId: string = '';

  public async export(type: 'csv' | 'flourish') {
    const id = this.seasonId.split('-')[0];
    const pwd = this.seasonId.split('-')[1];
    this.seasonId = '';
    
    try {
      const res = await fetch(`${environment.backendUrl}/api/season/full/${id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ pwd })
      });
      const data: GAUNTLET_EXPORT[] = await res.json();

      const headers: Array<string> = ['Full date'];
      let lines: any = [];

      for (const row of data) {
        const line = [];
        const date = new Date(row.last_updated);

        line.push(`${date.getUTCFullYear()}/${String(date.getUTCMonth() + 1).padStart(2, '0')}/${String(date.getUTCDate()).padStart(2, '0')} ${date.getUTCHours()}:${String(date.getUTCMinutes()).padStart(2, '0')}`);


        for (const l of row.leaderboard) {
          if (!headers.includes(`${l.guild_name} [${l.guild_tag}]`)) {
            headers.push(`${l.guild_name} [${l.guild_tag}]`);
          }

          if (type === 'flourish') {
            const guildsToOrder = row.leaderboard.filter(g => g.level === l.level);
            if (guildsToOrder.length < 2) continue;
            guildsToOrder.forEach((guildToOrder, index) => {
              guildToOrder.level += (0.001 * (guildsToOrder.length - index));
            });
          }
        }

        for (const header of headers.slice(1)) {
          const l = row.leaderboard.find(l => `${l.guild_name} [${l.guild_tag}]` === header);

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
    } catch (error) {
      console.error(error);
    }
  }
}