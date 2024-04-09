import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { ALL_SEASONS } from '../types';

@Injectable({
  providedIn: 'root'
})
export class AllSeasonsService {
  private _allSeasonsObservable = new BehaviorSubject<ALL_SEASONS>({});
  public allSeasonsObservable = this._allSeasonsObservable.asObservable();

  public async fetch(): Promise<void> {
    const res = await fetch('http://localhost/data/all-seasons.json');
    const data: ALL_SEASONS = await res.json();
    this._allSeasonsObservable.next(data);
  }
}
