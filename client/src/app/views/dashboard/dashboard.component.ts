import { Component, OnDestroy } from '@angular/core';
import { EventService } from '../../services/event.service';
import { Subscription } from 'rxjs';
import { ALL_SEASONS, ALL_SLAYERS, TRIAL_DETAIL } from '../../imports';
import { environment } from '../../../environments/environment';

enum BEHEMOTH {
  'Shrike',
  'Thunderdeep_Drask',
  'Blaze_Quillshot',
  'Shadowtouched_Koshai',
  'Skarn',
  'Koshai',
  'Shrowd',
  'Gnasher',
  'Skraev',
  'Charrogg',
  'Phaelanx',
  'Stormclaw',
  'Malkarion',
  'Rezakiri',
  'Riftstalker',
  'Drask',
  'Embermane',
  'Shadowtouched_Nayzaga',
  'Quillshot',
  'Pangar',
  'Kharabak',
  'Shadowtouched_Drask',
  'Nayzaga',
  'Boreus',
  'Bloodshot_Shrowd',
}

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnDestroy {
  private allSeasonsSubscription: Subscription;
  public currentSeasonId: string = '';
  public allSeasonData: ALL_SEASONS = {};

  private allSlayersSubscription: Subscription;
  public allSlayers: ALL_SLAYERS = {};

  public currentTrail?: TRIAL_DETAIL;

  constructor(
    private eventService: EventService
  ) {
    this.eventService.updateTitle('Dashboard');
    this.eventService.updateActiveMenu('dashboard');

    this.allSeasonsSubscription = this.eventService.allSeasonsObservable.subscribe(this.onAllSeasonsDataUpdate.bind(this));
    this.allSlayersSubscription = this.eventService.allSlayersObservable.subscribe(data => this.allSlayers = data);
    fetch(`${environment.backendUrl}/data/trials/week_${String(this.getCurrentWeek()).padStart(4, '0')}/current-leaderboard.json`).then(res => res.json()).then(data => {
      this.currentTrail = data;
    });
  }

  ngOnDestroy(): void {
    this.allSeasonsSubscription.unsubscribe();
    this.allSlayersSubscription.unsubscribe();
  }

  private onAllSeasonsDataUpdate(allSeasonData: ALL_SEASONS): void {
    this.allSeasonData = allSeasonData;
    this.currentSeasonId = Object.keys(allSeasonData)[Object.keys(allSeasonData).length - 1];
  }

  public convertRemainingSec(sec: number): string {
    return `${String(Math.floor(sec / 60)).padStart(2, '0')}:${String(sec % 60).padStart(2, '0')}`;
  }

  public getSeasonNumber(seasonId: string): number {
    return Number(seasonId.slice(15));
  }

  public openGuildDetail(guildNameplate: string) {
    window.open(`/guilds/${guildNameplate}`, '_blank');
  }

  public behemoth = [
    'Shrike',
    'Thunderdeep Drask',
    'Blaze Quillshot',
    'Shadowtouched Koshai',
    'Skarn',
    'Koshai',
    'Shrowd',
    'Gnasher',
    'Skraev',
    'Charrogg',
    'Phaelanx',
    'Stormclaw',
    'Malkarion',
    'Rezakiri',
    'Riftstalker',
    'Drask',
    'Embermane',
    'Shadowtouched Nayzaga',
    'Quillshot',
    'Pangar',
    'Kharabak',
    'Shadowtouched Drask',
    'Nayzaga',
    'Boreus',
    'Bloodshot Shrowd',
  ]

  public oldRatationHistory = [
    BEHEMOTH.Nayzaga,
    BEHEMOTH.Shrowd,
    BEHEMOTH.Quillshot,
    BEHEMOTH.Embermane,
    BEHEMOTH.Skraev,
    BEHEMOTH.Kharabak,
    BEHEMOTH.Koshai,
    BEHEMOTH.Rezakiri,
    BEHEMOTH.Charrogg,
    BEHEMOTH.Shrike,
    BEHEMOTH.Skarn,
    BEHEMOTH.Pangar,
    BEHEMOTH.Gnasher,
    BEHEMOTH.Nayzaga,
    BEHEMOTH.Shrowd,
    BEHEMOTH.Quillshot,
    BEHEMOTH.Embermane,
    BEHEMOTH.Skraev,
    BEHEMOTH.Kharabak,
    BEHEMOTH.Koshai,
    BEHEMOTH.Rezakiri,
    BEHEMOTH.Charrogg,
    BEHEMOTH.Shrike,
    BEHEMOTH.Skarn,
    BEHEMOTH.Pangar,
    BEHEMOTH.Gnasher,
    BEHEMOTH.Nayzaga,
    BEHEMOTH.Shrowd,
    BEHEMOTH.Quillshot,
    BEHEMOTH.Embermane,
    BEHEMOTH.Skraev,
    BEHEMOTH.Kharabak,
    BEHEMOTH.Koshai,
    BEHEMOTH.Rezakiri,
    BEHEMOTH.Charrogg,
    BEHEMOTH.Shrike,
    BEHEMOTH.Skarn,
    BEHEMOTH.Pangar,
    BEHEMOTH.Gnasher,
    BEHEMOTH.Nayzaga,
    BEHEMOTH.Shrowd,
    BEHEMOTH.Quillshot,
    BEHEMOTH.Malkarion,
    BEHEMOTH.Stormclaw,
    BEHEMOTH.Boreus,
    BEHEMOTH.Drask,
    BEHEMOTH.Embermane,
    BEHEMOTH.Skraev,
    BEHEMOTH.Malkarion,
    BEHEMOTH.Kharabak,
    BEHEMOTH.Koshai,
    BEHEMOTH.Stormclaw,
    BEHEMOTH.Rezakiri,
    BEHEMOTH.Charrogg,
    BEHEMOTH.Boreus,
    BEHEMOTH.Shrike,
    BEHEMOTH.Skarn,
    BEHEMOTH.Shadowtouched_Koshai,
    BEHEMOTH.Drask,
    BEHEMOTH.Gnasher,
    BEHEMOTH.Shadowtouched_Nayzaga,
    BEHEMOTH.Quillshot,
    BEHEMOTH.Shadowtouched_Drask,
    BEHEMOTH.Embermane,
    BEHEMOTH.Skraev,
    BEHEMOTH.Malkarion,
    BEHEMOTH.Kharabak,
    BEHEMOTH.Koshai,
    BEHEMOTH.Stormclaw,
    BEHEMOTH.Rezakiri,
    BEHEMOTH.Boreus,
    BEHEMOTH.Charrogg,
    BEHEMOTH.Shrike,
    BEHEMOTH.Skarn,
    BEHEMOTH.Pangar,
    BEHEMOTH.Drask,
    BEHEMOTH.Gnasher,
    BEHEMOTH.Shadowtouched_Nayzaga,
    BEHEMOTH.Stormclaw,
    BEHEMOTH.Skraev,
    BEHEMOTH.Kharabak,
    BEHEMOTH.Shrowd,
    BEHEMOTH.Koshai,
    BEHEMOTH.Shadowtouched_Drask,
    BEHEMOTH.Malkarion,
    BEHEMOTH.Shadowtouched_Koshai,
    BEHEMOTH.Quillshot,
    BEHEMOTH.Embermane,
    BEHEMOTH.Skraev,
    BEHEMOTH.Malkarion,
    BEHEMOTH.Kharabak,
    BEHEMOTH.Koshai,
    BEHEMOTH.Stormclaw,
    BEHEMOTH.Rezakiri,
    BEHEMOTH.Boreus,
    BEHEMOTH.Charrogg,
    BEHEMOTH.Shrike,
    BEHEMOTH.Skarn,
    BEHEMOTH.Pangar,
    BEHEMOTH.Drask,
    BEHEMOTH.Gnasher,
    BEHEMOTH.Shadowtouched_Nayzaga,
    BEHEMOTH.Koshai,
    BEHEMOTH.Shrowd,
    BEHEMOTH.Shadowtouched_Drask,
    BEHEMOTH.Malkarion,
    BEHEMOTH.Shadowtouched_Koshai,
    BEHEMOTH.Quillshot,
    BEHEMOTH.Embermane,
    BEHEMOTH.Skraev,
    BEHEMOTH.Kharabak,
    BEHEMOTH.Stormclaw,
    BEHEMOTH.Rezakiri,
    BEHEMOTH.Boreus,
    BEHEMOTH.Charrogg,
    BEHEMOTH.Shrike,
    BEHEMOTH.Skarn,
    BEHEMOTH.Pangar,
    BEHEMOTH.Drask,
    BEHEMOTH.Shrowd,
    BEHEMOTH.Gnasher,
    BEHEMOTH.Embermane,
    BEHEMOTH.Shrike,
    BEHEMOTH.Shadowtouched_Nayzaga,
    BEHEMOTH.Koshai,
    BEHEMOTH.Malkarion,
    BEHEMOTH.Quillshot,
    BEHEMOTH.Skraev,
    BEHEMOTH.Pangar,
    BEHEMOTH.Kharabak,
    BEHEMOTH.Stormclaw,
    BEHEMOTH.Shadowtouched_Drask,
    BEHEMOTH.Rezakiri,
    BEHEMOTH.Drask,
    BEHEMOTH.Charrogg,
    BEHEMOTH.Shadowtouched_Koshai,
    BEHEMOTH.Skarn,
    BEHEMOTH.Boreus,
    BEHEMOTH.Koshai,
    BEHEMOTH.Shrike,
    BEHEMOTH.Shrowd,
    BEHEMOTH.Gnasher,
    BEHEMOTH.Skraev,
    BEHEMOTH.Stormclaw,
    BEHEMOTH.Malkarion,
    BEHEMOTH.Rezakiri,
    BEHEMOTH.Embermane,
    BEHEMOTH.Shadowtouched_Nayzaga,
    BEHEMOTH.Quillshot,
    BEHEMOTH.Pangar,
    BEHEMOTH.Kharabak,
    BEHEMOTH.Shadowtouched_Drask,
    BEHEMOTH.Shrike,
    BEHEMOTH.Drask,
    BEHEMOTH.Charrogg,
    BEHEMOTH.Shadowtouched_Koshai,
    BEHEMOTH.Skarn,
    BEHEMOTH.Koshai,
    BEHEMOTH.Shrowd,
    BEHEMOTH.Gnasher,
    BEHEMOTH.Skraev,
    BEHEMOTH.Phaelanx,
    BEHEMOTH.Stormclaw,
    BEHEMOTH.Malkarion,
    BEHEMOTH.Rezakiri,
    BEHEMOTH.Embermane,
    BEHEMOTH.Shadowtouched_Nayzaga,
    BEHEMOTH.Quillshot,
    BEHEMOTH.Pangar,
    BEHEMOTH.Kharabak,
    BEHEMOTH.Shadowtouched_Drask,
    BEHEMOTH.Shrike,
    BEHEMOTH.Thunderdeep_Drask,
    BEHEMOTH.Blaze_Quillshot,
    BEHEMOTH.Shadowtouched_Koshai,
    BEHEMOTH.Skarn,
    BEHEMOTH.Koshai,
    BEHEMOTH.Bloodshot_Shrowd,
    BEHEMOTH.Gnasher,
    BEHEMOTH.Skraev,
    BEHEMOTH.Charrogg,
    BEHEMOTH.Phaelanx,
    BEHEMOTH.Stormclaw,
    BEHEMOTH.Malkarion,
    BEHEMOTH.Rezakiri,
    BEHEMOTH.Embermane,
    BEHEMOTH.Shadowtouched_Nayzaga,
    BEHEMOTH.Quillshot,
    BEHEMOTH.Pangar,
    BEHEMOTH.Kharabak,
    BEHEMOTH.Shadowtouched_Drask
  ];

  public currentBehemothRotation = [
    BEHEMOTH.Shrike,
    BEHEMOTH.Thunderdeep_Drask,
    BEHEMOTH.Blaze_Quillshot,
    BEHEMOTH.Shadowtouched_Koshai,
    BEHEMOTH.Skarn,
    BEHEMOTH.Koshai,
    BEHEMOTH.Shrowd,
    BEHEMOTH.Gnasher,
    BEHEMOTH.Skraev,
    BEHEMOTH.Charrogg,
    BEHEMOTH.Phaelanx,
    BEHEMOTH.Stormclaw,
    BEHEMOTH.Malkarion,
    BEHEMOTH.Rezakiri,
    BEHEMOTH.Riftstalker,
    BEHEMOTH.Drask,
    BEHEMOTH.Embermane,
    BEHEMOTH.Shadowtouched_Nayzaga,
    BEHEMOTH.Quillshot,
    BEHEMOTH.Pangar,
    BEHEMOTH.Kharabak,
    BEHEMOTH.Shadowtouched_Drask
  ];

  public getCurrentWeek(): number {
    const week1StartDate = new Date(Date.UTC(2019, 7 - 1, 18, 17));
    const weekInMs = 1 * 7 * 24 * 60 * 60 * 1000;
    return Math.floor((new Date().getTime() - week1StartDate.getTime()) / weekInMs) + 1
  }

  public getWeekStartAndEnd(week: number): Array<Date> {
    const week1StartDate = new Date(Date.UTC(2019, 7 - 1, 18, 17));
    const weekInMs = 1 * 7 * 24 * 60 * 60 * 1000;
    return [
      new Date(week1StartDate.getTime() + weekInMs * (week - 1)),
      new Date(week1StartDate.getTime() + weekInMs * week)
    ];
  }

  public getBehemothIdFromWeek(week: number): number {
    if (week < this.oldRatationHistory.length) return this.oldRatationHistory[week - 1];
    return this.currentBehemothRotation[(week - this.oldRatationHistory.length) % this.currentBehemothRotation.length - 1];
  }

  public getBehemothImgUrl(): string {
    return 'assets/img/Trials_behemoth_icon/' + this.behemoth[this.getBehemothIdFromWeek(this.getCurrentWeek())] + '.png'
  }

  public weapon_id: any = {
    "1": "Hammer_Icon_002.png",
    "2": "Axe_Icon_002.png",
    "3": "Sword_Icon_002.png",
    "4": "Chain_Blades_Icon_002.png",
    "5": "War_Pike_Icon_002.png",
    "6": "Ostian_Repeaters_Icon_002.png",
    "7": "Aether_Strikers_Icon_002.png",
  }

  public getWeaponImgUrl(weaponId: number | string): string {
    return 'assets/img/weapon/' + this.weapon_id[String(weaponId)];
  }

  public role_id: any = {
    "PR_TEMPEST": "icon_omnicell_tempest.png",
    "PR_DARKNESS": "icon_omnicell_darkness.png",
    "PR_DISCIPLINE": "icon_omnicell_discipline.png",
    "PR_BASTION": "icon_omnicell_bastion.png",
    "PR_FRANK": "icon_omnicell_frank.png",
    "PR_ICEBORNE": "icon_omnicell_iceborne.png",
  }

  public getOmniImgUrl(omniId: string): string {
    return 'assets/img/omni/' + this.role_id[omniId];
  }

  public platform: any = {
    "WIN": "ico_platform_pc_default.png",
    "PSN": "ico_platform_ps_default.png",
    "XBL": "ico_platform_xbox_default.png",
    "SWT": "ico_platform_switch_default.png",
  }

  public getPlatformImgUrl(platform: string): string {
    return 'assets/img/platform/' + this.platform[platform];
  }

  public getPlayerName(id: string, platform: string): string {
    const platformNames = this.allSlayers[id].filter(i => i.platform === platform);
    if (!platformNames.length) return '';
    return platformNames[platformNames.length - 1].platformName;
  }
}