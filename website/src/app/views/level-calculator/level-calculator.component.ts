import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'dl-level-calculator',
  templateUrl: './level-calculator.component.html',
  styleUrls: ['./level-calculator.component.scss'],
  standalone: false
})
export class LevelCalculatorComponent implements OnInit {
  ngOnInit(): void {
    this.onValueChange()
  }

  public requiredXpTable: Array<number> = [
    0,
    50,
    100,
    150,
    210,
    300,
    400,
    510,
    650,
    790,
    938,
    1106,
    1288,
    1483,
    1691,
    1911,
    2144,
    2390,
    2649,
    2920,
    3204,
    3500,
    3808,
    4129,
    4462,
    4807,
    5165,
    5534,
    5916,
    6310,
    6715,
    7133,
    7562,
    8003,
    8457,
    8922,
    9398,
    9887,
    10387,
    10899,
    11422,
    11958,
    12504,
    13063,
    13632,
    14214,
    14807,
    15411,
    16027,
    16654,
    17292,
    17942,
    18603,
    19276,
    19960,
    20655,
    21362,
    22079,
    22808,
    23548
  ];

  public getPowerAtLevel(level: number): number {
    if (level < 1) return 0;
    if (level <= 6) return 10 + (20 * (level - 1));
    if (level <= 50) return 110 + (10 * (level - 6));
    if (level <= 60) return 550 + (5 * (level - 50));
    return 0;
  }

  public getTotalXPAtLevel(level: number): number {
    if (level < 1) return 0;
    return this.requiredXpTable.slice(0, level).reduce((sum, val) => sum + val, 0);
  }

  public currentLevel: number = 10;
  public currentXP: number = 100;
  public targetLevel: number = 15;
  public requiredXP: number | undefined = 0;

  public onValueChange() {
    this.requiredXP = undefined;
    if (
      this.currentLevel < 1 ||
      this.currentLevel > 60 ||
      this.targetLevel < 1 ||
      this.targetLevel > 60 ||
      this.currentXP < 0 ||
      this.currentLevel >= this.targetLevel
    ) return;

    const XPToGetNextLevel = this.requiredXpTable[this.currentLevel + 1];
    if (XPToGetNextLevel < this.currentXP) return;

    const currentTotalXP = this.getTotalXPAtLevel(this.currentLevel);
    const targetTotalXP = this.getTotalXPAtLevel(this.targetLevel);

    this.requiredXP = targetTotalXP - currentTotalXP - this.currentXP;
  }

  public dullAetherite: number = 0;
  public shiningAetherite: number = 0;
  public peerlessAetherite: number = 0;
  public AetheriteXP: number = 0;

  public onAetheriteValueChange() {
    if (this.dullAetherite < 0) this.dullAetherite = 0;
    if (this.shiningAetherite < 0) this.shiningAetherite = 0;
    if (this.peerlessAetherite < 0) this.peerlessAetherite = 0;

    this.AetheriteXP = this.dullAetherite * 100 + this.shiningAetherite * 1000 + this.peerlessAetherite * 5000;
  }
}