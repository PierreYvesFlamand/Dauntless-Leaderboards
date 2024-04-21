import { Injectable } from '@angular/core';
import { ALL_SLAYERS, SLAYER_DETAIL } from '../../../../server/src/types'

export enum BEHEMOTH {
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

@Injectable({
  providedIn: 'root'
})
export class TrialsService {
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

  public weapons = ['all', 'sword', 'axe', 'hammer', 'chainblades', 'pike', 'repeaters', 'strikers'];

  public getOrderedBehemoth(): Array<string> {
    return (<Array<string>>JSON.parse(JSON.stringify(this.behemoth))).sort((a, b) => a.toLowerCase().localeCompare(b.toLowerCase()));
  }

  public oldRotationHistory = [
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
    BEHEMOTH.Riftstalker,
    BEHEMOTH.Drask,
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

  public getBehemothIdFromWeek(week: number): number {
    if (week < this.oldRotationHistory.length) return this.oldRotationHistory[week - 1];
    let index = (week - this.oldRotationHistory.length) % this.currentBehemothRotation.length - 1;
    if (index === -1) { index = this.currentBehemothRotation.length - 1; }
    return this.currentBehemothRotation[index];
  }

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

  public getBehemothName(behemothId: number): string {
    return this.behemoth[behemothId]
  }

  public getBehemothImgUrl(behemothId: number): string {
    return 'assets/img/behemoths_icons/' + this.getBehemothName(behemothId) + '.png'
  }

  public weaponIds: any = {
    "1": "Hammer_Icon_002.png",
    "2": "Axe_Icon_002.png",
    "3": "Sword_Icon_002.png",
    "4": "Chain_Blades_Icon_002.png",
    "5": "War_Pike_Icon_002.png",
    "6": "Ostian_Repeaters_Icon_002.png",
    "7": "Aether_Strikers_Icon_002.png",
  }

  public getWeaponImgUrl(weaponId: number | string): string {
    return 'assets/img/weapons/' + this.weaponIds[String(weaponId)];
  }

  public omniIds: any = {
    "PR_TEMPEST": "icon_omnicell_tempest.png",
    "PR_DARKNESS": "icon_omnicell_darkness.png",
    "PR_DISCIPLINE": "icon_omnicell_discipline.png",
    "PR_BASTION": "icon_omnicell_bastion.png",
    "PR_FRANK": "icon_omnicell_frank.png",
    "PR_ICEBORNE": "icon_omnicell_iceborne.png",
  }

  public getOmniImgUrl(omniId: string): string {
    return 'assets/img/omnicells/' + this.omniIds[omniId];
  }

  public platformIds: any = {
    "WIN": "ico_platform_pc_default.png",
    "PSN": "ico_platform_ps_default.png",
    "XBL": "ico_platform_xbox_default.png",
    "SWT": "ico_platform_switch_default.png",
  }

  public getPlatformImgUrl(platformId: string): string {
    return 'assets/img/platforms/' + this.platformIds[platformId];
  }


  public convertTrialTime(time?: number, decimals: true | 1 | 2 | 3 = 1): string {
    if (!time) return '';

    const m = Math.floor(Math.abs(time) / 60000);
    const s = Math.floor((Math.abs(time) - m * 60000) / 1000);
    const ms = Math.abs(time) % 1000;

    if (decimals === true) {
      if (time >= 60000) return `${m} min ${s}.${ms} sec`;
      if (time > 0) return `${s}.${ms} sec`;
      if (time === 0) return `0.000 sec`;
      if (time < 0) return `-${s}.${ms} sec`;
    } else {
      if (time >= 60000) return `${m} min ${s} sec`;
      if (time > 0) return `${s}.${Math.floor(ms / (10 ** (3 - decimals)))} sec`;
      if (time === 0) return `0 sec`;
      if (time < 0) return `-${s}.${Math.floor(ms / (10 ** (3 - decimals)))} sec`;
    }

    return '';
  }

  public getFirstPlayerName(slayer: SLAYER_DETAIL): string {
    if (slayer.WIN_Name) return slayer.WIN_Name;
    else if (slayer.PSN_Name) return slayer.PSN_Name;
    else if (slayer.XBL_Name) return slayer.XBL_Name;
    else if (slayer.SWT_Name) return slayer.SWT_Name;
    else { return '????'; }
  }

  public getFirstPlayerIdByName(allSlayers: ALL_SLAYERS, name: string): string {
    let playerId = null;

    for (const id in allSlayers) {
      if (playerId) continue;
      if (allSlayers[id].WIN_Name === name) { playerId = id; }
      else if (allSlayers[id].PSN_Name === name) { playerId = id; }
      else if (allSlayers[id].XBL_Name === name) { playerId = id; }
      else if (allSlayers[id].SWT_Name === name) { playerId = id; }
    }

    return playerId ?? '';
  }
}
