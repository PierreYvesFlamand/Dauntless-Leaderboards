import { Component, Input } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-flourish',
  templateUrl: './flourish.component.html',
  styleUrls: ['./flourish.component.scss']
})
export class FlourishComponent {
  @Input() url: string = '';

  constructor(
    public domSanitizer: DomSanitizer,
  ) { }
}