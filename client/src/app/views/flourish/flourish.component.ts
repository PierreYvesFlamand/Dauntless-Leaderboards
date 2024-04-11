import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-flourish',
  templateUrl: './flourish.component.html',
  styleUrls: ['./flourish.component.scss']
})
export class FlourishComponent {
  @Input() src: string = '';
}