import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'dl-pagination',
  templateUrl: './pagination.component.html',
  styleUrl: './pagination.component.scss',
  standalone: false
})
export class PaginationComponent {
  @Input() public page: number = 1;
  @Input() public total: number = 0;
  @Input() public pageSize: number = 20;
  @Input() public label: string = '';
  @Output() public pageChange = new EventEmitter<number>();

  public get numberOfPages(): number {
    return Math.max(1, Math.ceil(this.total / this.pageSize));
  }

  public get rangeStart(): number {
    return (this.page - 1) * this.pageSize + 1;
  }

  public get rangeEnd(): number {
    return Math.min(this.page * this.pageSize, this.total);
  }

  public goTo(page: number) {
    page = Math.min(Math.max(1, Math.floor(Number(page) || 1)), this.numberOfPages);
    if (page === this.page) return;
    this.pageChange.emit(page);
  }
}
