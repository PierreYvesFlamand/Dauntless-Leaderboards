import { Component } from '@angular/core';
import { ClrDatagridStateInterface } from '@clr/angular';

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
    this.loading = true;

    console.log(state);

    fetch(`http://localhost:7001/api/guilds?pageSize=${state.page?.size}&page=${state.page?.current}`).then(res => res.json()).then((data: any) => {
      this.guilds = data.guilds;
      this.total = data.total;
      this.loading = false;
    });

    // this.inventory
    //   .filter(filters)
    //   .sort(<{ by: string; reverse: boolean }>state.sort)
    //   .fetch(state.page.size * (state.page.current - 1), state.page.size)
    //   .then((result: FetchResult) => {
    //     this.users = result.users;
    //     this.total = result.length;
    //     this.loading = false;
    //   });
  }
}
