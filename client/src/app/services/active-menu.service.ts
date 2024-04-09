import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ActiveMenuService {
  private _activeMenuObservable = new BehaviorSubject<string>('');
  public activeMenuObservable = this._activeMenuObservable.asObservable();

  public updateActiveMenu(string: string): void {
    this._activeMenuObservable.next(string);
  }
}
