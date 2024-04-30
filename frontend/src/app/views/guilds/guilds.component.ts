import { Component } from '@angular/core';
import { ClrDatagridSortOrder, ClrDatagridStateInterface } from '@clr/angular';

@Component({
  selector: 'dl-guilds',
  templateUrl: './guilds.component.html',
  styleUrl: './guilds.component.scss'
})
export class GuildsComponent {
  public guilds: any[] = [];
  public total: number = 0;
  public loading: boolean = true;

  refresh(state: ClrDatagridStateInterface) {
    console.log(state);

    const a = ClrDatagridSortOrder.DESC

    this.loading = true;

    const params: {
      pageSize: number
      page: number
      sortBy: string | null
      sortReverse: 1 | -1
    } = {
      pageSize: state.page?.size || 20,
      page: state.page?.current || 1,
      sortBy: String(state.sort?.by) || null,
      sortReverse: state.sort?.reverse ? 1 : -1
    };

    const paramsAsString = Object.keys(params).reduce<string[]>((p, k) => { return [...p, `${k}=${(<any>params)[k] || ''}`] }, []).join('&');

    fetch(`http://localhost:7001/api/guilds?${paramsAsString}`, {}).then(res => res.json()).then((data: any) => {
      this.guilds = data.guilds;
      this.total = data.total;
      this.loading = false;
    });
  }
}
