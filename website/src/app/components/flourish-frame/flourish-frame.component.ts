import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';

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
