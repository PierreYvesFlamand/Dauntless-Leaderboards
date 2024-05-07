import { AfterViewInit, ChangeDetectionStrategy, Component, ElementRef, Input, ViewChild } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

@Component({
  selector: 'dl-flourish-frame',
  templateUrl: './flourish-frame.component.html',
  styleUrl: './flourish-frame.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FlourishFrameComponent {
  @Input() public url: string = '';

  constructor(
    public domSanitizer: DomSanitizer
  ) { }
}
