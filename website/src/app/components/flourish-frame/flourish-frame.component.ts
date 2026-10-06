import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Input } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { TranslationService } from '../../services/translation.service';

@Component({
  selector: 'dl-flourish-frame',
  templateUrl: './flourish-frame.component.html',
  styleUrl: './flourish-frame.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FlourishFrameComponent {
  // Sanitized once per url: a new value on every check would reload the iframe
  public safeUrl?: SafeResourceUrl;
  @Input() public set url(value: string) {
    this.safeUrl = this.domSanitizer.bypassSecurityTrustResourceUrl(value);
  }

  constructor(
    private domSanitizer: DomSanitizer,
    changeDetectorRef: ChangeDetectorRef,
    translationService: TranslationService
  ) {
    // OnPush: refresh the translated title when the language changes
    translationService.language$.pipe(takeUntilDestroyed()).subscribe(() => changeDetectorRef.markForCheck());
  }
}
