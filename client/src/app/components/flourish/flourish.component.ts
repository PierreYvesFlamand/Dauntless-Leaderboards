import { AfterViewInit, Component, ElementRef, Input, ViewChild } from '@angular/core';

@Component({
  selector: 'app-flourish',
  templateUrl: './flourish.component.html',
  styleUrls: ['./flourish.component.scss']
})
export class FlourishComponent implements AfterViewInit {
  @Input() url: string = '';
  @ViewChild("iframe") iframe?: ElementRef;

  ngAfterViewInit(): void {
    this.iframe?.nativeElement.contentWindow.location.replace(this.url);
  }
}