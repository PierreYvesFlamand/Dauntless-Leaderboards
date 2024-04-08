import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TitleService {
  private _titleObservable = new BehaviorSubject<string>('');
  public titleObservable = this._titleObservable.asObservable();

  public updateTitle(string: string): void {
    this._titleObservable.next(string);
  }
}
