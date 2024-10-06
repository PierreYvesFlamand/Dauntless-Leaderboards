import { Component } from '@angular/core';
import { SharedService } from './services/shared.service';

@Component({
  selector: 'dl-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  constructor(
    private sharedService: SharedService
  ) {
    console.info(
      `\n%c👋 Welcome in the Console 👋%c \nDo whatever you want in here 🤷‍♂️\nIf you feel it or find an issue, please join our Discord: https://discord.gg/JGTVcqMDfm\nEnjoy your stay !\n\n%c`,
      "color:#ceb73f; background: #ceb73f33; font-size:1.5rem; padding:0.15rem; margin: 1rem auto; font-family: Rockwell, Tahoma, 'Trebuchet MS', Helvetica; border: 2px solid #ceb73f; border-radius: 4px; font-weight: bold; text-shadow: 1px 1px 1px #000000bf;",
      'font-weight: bold; font-size: 1rem;color: #ceb73f;',
      "color: #ceb73f; font-size: 0.75rem; font-family: Tahoma, 'Trebuchet MS', Helvetica;",
    );

    this.sharedService.theme$.subscribe(value => {
      document.querySelector('body')?.classList.add(`${value === 'dark' ? 'dark' : 'light'}-mode`);
      document.querySelector('body')?.classList.remove(`${value === 'dark' ? 'light' : 'dark'}-mode`);
    });
    this.sharedService.init();

    ///////////////////////////////
    //     const data = `urska,3 strategist 2 inertia 2 warmth,3 inertia 2 strategist,2 inertia 2 strategist 2 warmth ,3 inertia 2 grace
    // agarus,3 fortress 2 earth 2 endurance,3 earth 2 fortress,2 earth 2 endurance 2 fortress,3 earth 2 tough
    // sahvyt,3 tactician 2 Aether_Syphon 2 relentless,3 Aether_Syphon 2 tactician,2 Aether_Syphon 2 relentless 2 tactician,3 Aether_Syphon 2 bladestorm
    // boreus,3 Pack_Caller 2 berserker 2 tenacious,3 berserker 2 Pack_Caller,2 berserker 2 Pack_Caller 2 tenacious ,3 berserker 2 tough
    // pangar,3 overpower 2 Assassin's_Bulwark 2 Knockout_King,3 Assassin's_Bulwark 2 overpower,2 Assassin's_Bulwark 2 Knockout_King 2 overpower,3 Assassin's_Bulwark 2 evasion
    // chrono,3 stop 2 Assassin's_Vigour 2 pulse,3 pulse 2 stop,2 Assassin's_Vigour 2 pulse 2 stop,3 pulse 2 tactician
    // valomyr ,3 ninelives 2 lucent 2 pulse,3 pulse 2 Nine_Lives,2 lucent 2 nine 2 pulse ,3 pulse 2 Weighted_Strikes
    // fenroar,3 pacifier 2 aetherborne 2 overpower,3 overpower 2 pacifier,2 aetherborne 2 overpower 2 pacifier ,3 overpower 2 Iron_Stomach
    // drask,3 sharpened 2 agility 2 Evasive_Fury,3 EF 2 sharpened,2 agility 2 Evasive_Fury 2 sharpened,3 Evasive_Fury 2 insulated
    // kharabak,3 parasitic 2 Assassin's_Frenzy 2 bladestorm,3 Assassin's_Frenzy 2 parasitic,2 Assassin's_Frenzy 2 bladestorm 2 parasitic ,3 assasins frnezy 2 savagery
    // ember,3 evasion 2 Pack_Hunter 2 tough,3 Pack_Hunter 2 evasion,2 evasion 2 Pack_Hunter 2 tough,3 Pack_Hunter 2 sprinter
    // gnasher,3 water 2 aetheric armor 2 ragehunter,3 ragehunter 2 water,2 Aetheric_Armour 2 ragehunter 2 water,3 ragehunter 2 reuse
    // rift,3 cunning 2 recycle 2 vampiric,3 recycle 2 cunning,2 cunning 2 recycle 2 vampiric,3 recycle 2 aetherborne
    // hellion,3 molten 2 defiance 2 fire,3 fire 2 molten,2 defiance 2 fire 2 molten,3 fire 2 Knockout_King
    // reza,3 roll 2 conservation 2 rushdown,3 rushdown 2 roll,2 conservation 2 roll 2 rushdown ,3 rushdown 2 swift
    // storm,3 Pack_Walker 2 Evasive_Fury 2 insulated,3 Evasive_Fury 2 Pack_Walker,2 Evasive_Fury 2 insulated 2 Pack_Walker,3 Evasive_Fury 2 defiance
    // malkarion ,3 merciless 2 insulated 2 predator,3 predator 2 merciless,2 insulated 2 merciless 2 predator,3 predator 2 reduce 
    // phaelanx,3 catalyst 2 Evasive_Fury 2 omnisurge,3 Evasive_Fury 2 catalyst,2 catalyst 2 Evasive_Fury 2 omnisurge,3 Evasive_Fury 2 nimble
    // quillshot ,3 savagery 2 barbed 2 conduit,3 conduit 2 savagery,2 barbed 2 conduit 2 savagery,3 conduit 2 vampiric
    // nayzaga,3 energized 2 Assassin's_Edge 2 medic,3 Assassin's_Edge 2 energized,2 Assassin's_Edge 2 energized 2 medic ,3 Assassin's_Edge 2 deconstruction
    // shrike,3 grace 2 predator 2 Weighted_Strikes,3 predator 2 grace,2 grace 2 predator 2 weighed strikes,3 predator 2 agility 
    // skarn,3 guardian 2 fortress 2 galvanized,3 galvanized 2 guardian,2 fortress 2 galvanized 2 guardian,3 galvanized 2 defiance
    // skraev,3 adrenaline 2 Assassin's_Momentum 2 inertia,3 inertia 2 adrenaline,2 adrenaline 2 Assassin's_Momentum 2 inertia,3 inertia 2 warmth
    // alyra,3 swift 2 carve 2 deconstruction,3 carve 2 swift,2 carve 2 deconstruction 2 swift ,3 carve 2 Stunning_Vigour 
    // fenroar,3 earth 2 engineer 2 rushdown,3 rushdown 2 earth ,2 earth 2 engineer 2 rushdown,3 rushdown 2 Stunning_Vigour 
    // thrax,3 generator 2 nimble 2 ragehunter,3 ragehunter 2 generator,2 generator 2 nimble 2 ragehunter,3 ragehunter 2 savagery
    // TDD,3 reuse 2 acidic 2 berserker,3 berserker 2 reuse,2 acidic 2 berseker 2 reuse,3 berserker 2 conservation
    // timeweave,3 overpower 2 Iron_Stomach 2 predator,3 predator 2 overpower,2 Iron_Stomach 2 overpower 2 predator,3 predator 2 sturdy
    // torgadoro,3 armoured 2 berserker 2 fireproof,3 berserker 2 armoured ,2 armoured 2 berserker 2 fireproof,3 berserker 2 fortress
    // koshai,3 drop 2 agility 2 predator,3 predator 2 drop,2 agility 2 drop 2 predator,3 predator 2 Assassin's_Momentum
    // charrogg ,3 fireproof 2 aetherhunter 2 sturdy,3 aetherhunter 2 fireproof,2 aetherhunter 2 fireproof 2 sturdy,3 aetherhunter 2 reuse
    // wulf,3 galvanized 2 aegis 2 cascade,3 cascade 2 galvanized,2 aegis 2 cascade 2 galvanized,3 cascade 2 Pack_Walker`;

    //     const armors: any = {};

    //     data.split('\n').forEach(line => {
    //       const behemothName = this.capitalize(line.split(',')[0]);
    //       console.log(`Doing ${behemothName}`);

    //       armors[`${behemothName}'s helm`] = {
    //         slot: "helm",
    //         perks: [
    //           { cell: this.capitalize(line.split(',')[1].split(' ')[1]), quantity: line.split(',')[1].split(' ')[0] },
    //           { cell: this.capitalize(line.split(',')[1].split(' ')[3]), quantity: line.split(',')[1].split(' ')[2] },
    //           { cell: this.capitalize(line.split(',')[1].split(' ')[5]), quantity: line.split(',')[1].split(' ')[4] }
    //         ]
    //       };
    //       armors[`${behemothName}'s chest`] = {
    //         slot: "chest",
    //         perks: [
    //           { cell: this.capitalize(line.split(',')[2].split(' ')[1]), quantity: line.split(',')[2].split(' ')[0] },
    //           { cell: this.capitalize(line.split(',')[2].split(' ')[3]), quantity: line.split(',')[2].split(' ')[2] }
    //         ]
    //       };
    //       armors[`${behemothName}'s arms`] = {
    //         slot: "arms",
    //         perks: [
    //           { cell: this.capitalize(line.split(',')[3].split(' ')[1]), quantity: line.split(',')[3].split(' ')[0] },
    //           { cell: this.capitalize(line.split(',')[3].split(' ')[3]), quantity: line.split(',')[3].split(' ')[2] },
    //           { cell: this.capitalize(line.split(',')[3].split(' ')[5]), quantity: line.split(',')[3].split(' ')[4] }
    //         ]
    //       };
    //       armors[`${behemothName}'s legs`] = {
    //         slot: "legs",
    //         perks: [
    //           { cell: this.capitalize(line.split(',')[4].split(' ')[1]), quantity: line.split(',')[4].split(' ')[0] },
    //           { cell: this.capitalize(line.split(',')[4].split(' ')[3]), quantity: line.split(',')[4].split(' ')[2] }
    //         ]
    //       };
    //     });

    //     console.log(JSON.stringify(armors));

    //     ///////////////////////////////
    //   }

    //   public capitalize(str: string): string {
    //     if (str.indexOf('_')) return str;
    //     return `${str.slice(0, 1).toUpperCase()}${str.slice(1).toLowerCase()}`;
    //   }
  }
}