import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';

@Component({
  selector: 'dl-builder',
  templateUrl: './builder.component.html',
  styleUrls: ['./builder.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class BuilderComponent implements OnInit {
  public cells: any = {
    'berserker': {
      key: 'berserker',
      name: 'Berserker',
      quantityNeeded: 8,
      type: '',
      description: 'Description TBA'
    },
    'evasive_fury': {
      key: 'evasive_fury',
      name: 'Evasive Fury',
      quantityNeeded: 8,
      type: '',
      description: 'Description TBA'
    },
    'predator': {
      key: 'predator',
      name: 'Predator',
      quantityNeeded: 8,
      type: '',
      description: 'Description TBA'
    },
    'adrenaline': {
      key: 'adrenaline',
      name: 'Adrenaline',
      quantityNeeded: 7,
      type: '',
      description: 'Description TBA'
    },
    'inertia': {
      key: 'inertia',
      name: 'Inertia',
      quantityNeeded: 7,
      type: '',
      description: 'Description TBA'
    },
    'ragehunter': {
      key: 'ragehunter',
      name: 'Ragehunter',
      quantityNeeded: 7,
      type: '',
      description: 'Description TBA'
    },
    'recycle': {
      key: 'recycle',
      name: 'Recycle',
      quantityNeeded: 7,
      type: '',
      description: 'Description TBA'
    },
    'rushdown': {
      key: 'rushdown',
      name: 'Rushdown',
      quantityNeeded: 7,
      type: '',
      description: 'Description TBA'
    },
    'water': {
      key: 'water',
      name: 'Water',
      quantityNeeded: 7,
      type: '',
      description: 'Description TBA'
    },
    'aether_syphon': {
      key: 'aether_syphon',
      name: 'Aether Syphon',
      quantityNeeded: 6,
      type: '',
      description: 'Description TBA'
    },
    'aetherhunter': {
      key: 'aetherhunter',
      name: 'Aetherhunter',
      quantityNeeded: 6,
      type: '',
      description: 'Description TBA'
    },
    'assassin\'s_edge': {
      key: 'assassin\'s_edge',
      name: 'Assassin\'s Edge',
      quantityNeeded: 6,
      type: '',
      description: 'Description TBA'
    },
    'assassin\'s_frenzy': {
      key: 'assassin\'s_frenzy',
      name: 'Assassin\'s Frenzy',
      quantityNeeded: 6,
      type: '',
      description: 'Description TBA'
    },
    'carve': {
      key: 'carve',
      name: 'Carve',
      quantityNeeded: 6,
      type: '',
      description: 'Description TBA'
    },
    'cascade': {
      key: 'cascade',
      name: 'Cascade',
      quantityNeeded: 6,
      type: '',
      description: 'Description TBA'
    },
    'conduit': {
      key: 'conduit',
      name: 'Conduit',
      quantityNeeded: 6,
      type: '',
      description: 'Description TBA'
    },
    'earth': {
      key: 'earth',
      name: 'Earth',
      quantityNeeded: 6,
      type: '',
      description: 'Description TBA'
    },
    'fire': {
      key: 'fire',
      name: 'Fire',
      quantityNeeded: 6,
      type: '',
      description: 'Description TBA'
    },
    'galvanized': {
      key: 'galvanized',
      name: 'Galvanized',
      quantityNeeded: 6,
      type: '',
      description: 'Description TBA'
    },
    'nine_lives': {
      key: 'nine_lives',
      name: 'Nine Lives',
      quantityNeeded: 6,
      type: '',
      description: 'Description TBA'
    },
    'overpower': {
      key: 'overpower',
      name: 'Overpower',
      quantityNeeded: 6,
      type: '',
      description: 'Description TBA'
    },
    'pack_caller': {
      key: 'pack_caller',
      name: 'Pack Caller',
      quantityNeeded: 6,
      type: '',
      description: 'Description TBA'
    },
    'pack_hunter': {
      key: 'pack_hunter',
      name: 'Pack Hunter',
      quantityNeeded: 6,
      type: '',
      description: 'Description TBA'
    },
    'parasitic': {
      key: 'parasitic',
      name: 'Parasitic',
      quantityNeeded: 6,
      type: '',
      description: 'Description TBA'
    },
    'pulse': {
      key: 'pulse',
      name: 'Pulse',
      quantityNeeded: 6,
      type: '',
      description: 'Description TBA'
    },
    'sharpened': {
      key: 'sharpened',
      name: 'Sharpened',
      quantityNeeded: 6,
      type: '',
      description: 'Description TBA'
    },
    'aegis': {
      key: 'aegis',
      name: 'Aegis',
      quantityNeeded: 5,
      type: '',
      description: 'Description TBA'
    },
    'catalyst': {
      key: 'catalyst',
      name: 'Catalyst',
      quantityNeeded: 5,
      type: '',
      description: 'Description TBA'
    },
    'cunning': {
      key: 'cunning',
      name: 'Cunning',
      quantityNeeded: 5,
      type: '',
      description: 'Description TBA'
    },
    'generator': {
      key: 'generator',
      name: 'Generator',
      quantityNeeded: 5,
      type: '',
      description: 'Description TBA'
    },
    'reuse': {
      key: 'reuse',
      name: 'Reuse',
      quantityNeeded: 5,
      type: '',
      description: 'Description TBA'
    },
    'weighted_strikes': {
      key: 'weighted_strikes',
      name: 'Weighted Strikes',
      quantityNeeded: 5,
      type: '',
      description: 'Description TBA'
    },
    'acidic': {
      key: 'acidic',
      name: 'Acidic',
      quantityNeeded: 4,
      type: '',
      description: 'Description TBA'
    },
    'armoured': {
      key: 'armoured',
      name: 'Armoured',
      quantityNeeded: 4,
      type: '',
      description: 'Description TBA'
    },
    'assassin\'s_vigour': {
      key: 'assassin\'s_vigour',
      name: 'Assassin\'s Vigour',
      quantityNeeded: 4,
      type: '',
      description: 'Description TBA'
    },
    'barbed': {
      key: 'barbed',
      name: 'Barbed',
      quantityNeeded: 4,
      type: '',
      description: 'Description TBA'
    },
    'drop': {
      key: 'drop',
      name: 'Drop',
      quantityNeeded: 4,
      type: '',
      description: 'Description TBA'
    },
    'endurance': {
      key: 'endurance',
      name: 'Endurance',
      quantityNeeded: 4,
      type: '',
      description: 'Description TBA'
    },
    'energized': {
      key: 'energized',
      name: 'Energized',
      quantityNeeded: 4,
      type: '',
      description: 'Description TBA'
    },
    'evasion': {
      key: 'evasion',
      name: 'Evasion',
      quantityNeeded: 4,
      type: '',
      description: 'Description TBA'
    },
    'fireproof': {
      key: 'fireproof',
      name: 'Fireproof',
      quantityNeeded: 4,
      type: '',
      description: 'Description TBA'
    },
    'fortress': {
      key: 'fortress',
      name: 'Fortress',
      quantityNeeded: 4,
      type: '',
      description: 'Description TBA'
    },
    'grace': {
      key: 'grace',
      name: 'Grace',
      quantityNeeded: 4,
      type: '',
      description: 'Description TBA'
    },
    'guardian': {
      key: 'guardian',
      name: 'Guardian',
      quantityNeeded: 4,
      type: '',
      description: 'Description TBA'
    },
    'insulated': {
      key: 'insulated',
      name: 'Insulated',
      quantityNeeded: 4,
      type: '',
      description: 'Description TBA'
    },
    'knockout_king': {
      key: 'knockout_king',
      name: 'Knockout king',
      quantityNeeded: 4,
      type: '',
      description: 'Description TBA'
    },
    'merciless': {
      key: 'merciless',
      name: 'Merciless',
      quantityNeeded: 4,
      type: '',
      description: 'Description TBA'
    },
    'molten': {
      key: 'molten',
      name: 'Molten',
      quantityNeeded: 4,
      type: '',
      description: 'Description TBA'
    },
    'omnisurge': {
      key: 'omnisurge',
      name: 'Omnisurge',
      quantityNeeded: 4,
      type: '',
      description: 'Description TBA'
    },
    'pacifier': {
      key: 'pacifier',
      name: 'Pacifier',
      quantityNeeded: 4,
      type: '',
      description: 'Description TBA'
    },
    'pack_walker': {
      key: 'pack_walker',
      name: 'Pack Walker',
      quantityNeeded: 4,
      type: '',
      description: 'Description TBA'
    },
    'reduce': {
      key: 'reduce',
      name: 'Reduce',
      quantityNeeded: 4,
      type: '',
      description: 'Description TBA'
    },
    'relentless': {
      key: 'relentless',
      name: 'Relentless',
      quantityNeeded: 4,
      type: '',
      description: 'Description TBA'
    },
    'savagery': {
      key: 'savagery',
      name: 'Savagery',
      quantityNeeded: 4,
      type: '',
      description: 'Description TBA'
    },
    'sprinter': {
      key: 'sprinter',
      name: 'Sprinter',
      quantityNeeded: 4,
      type: '',
      description: 'Description TBA'
    },
    'stop': {
      key: 'stop',
      name: 'Stop',
      quantityNeeded: 4,
      type: '',
      description: 'Description TBA'
    },
    'strategist': {
      key: 'strategist',
      name: 'Strategist',
      quantityNeeded: 4,
      type: '',
      description: 'Description TBA'
    },
    'swift': {
      key: 'swift',
      name: 'Swift',
      quantityNeeded: 4,
      type: '',
      description: 'Description TBA'
    },
    'tactician': {
      key: 'tactician',
      name: 'Tactician',
      quantityNeeded: 4,
      type: '',
      description: 'Description TBA'
    },
    'tenacious': {
      key: 'tenacious',
      name: 'Tenacious',
      quantityNeeded: 4,
      type: '',
      description: 'Description TBA'
    },
    'warmth': {
      key: 'warmth',
      name: 'Warmth',
      quantityNeeded: 4,
      type: '',
      description: 'Description TBA'
    },
    'aetheric_armour': {
      key: 'aetheric_armour',
      name: 'Aetheric Armour',
      quantityNeeded: 3,
      type: '',
      description: 'Description TBA'
    },
    'assassin\'s_bulwark': {
      key: 'assassin\'s_bulwark',
      name: 'Assassin\'s Bulwark',
      quantityNeeded: 3,
      type: '',
      description: 'Description TBA'
    },
    'assassin\'s_momentum': {
      key: 'assassin\'s_momentum',
      name: 'Assassin\'s Momentum',
      quantityNeeded: 3,
      type: '',
      description: 'Description TBA'
    },
    'conservation': {
      key: 'conservation',
      name: 'Conservation',
      quantityNeeded: 3,
      type: '',
      description: 'Description TBA'
    },
    'defiance': {
      key: 'defiance',
      name: 'Defiance',
      quantityNeeded: 3,
      type: '',
      description: 'Description TBA'
    },
    'iron_stomach': {
      key: 'iron_stomach',
      name: 'Iron Stomach',
      quantityNeeded: 3,
      type: '',
      description: 'Description TBA'
    },
    'roll': {
      key: 'roll',
      name: 'Roll',
      quantityNeeded: 4,
      type: '',
      description: 'Description TBA'
    },
    'sturdy': {
      key: 'sturdy',
      name: 'Sturdy',
      quantityNeeded: 3,
      type: '',
      description: 'Description TBA'
    },
    'tough': {
      key: 'tough',
      name: 'Tough',
      quantityNeeded: 3,
      type: '',
      description: 'Description TBA'
    },
    'aetherborne': {
      key: 'aetherborne',
      name: 'Aetherborne',
      quantityNeeded: 2,
      type: '',
      description: 'Description TBA'
    },
    'agility': {
      key: 'agility',
      name: 'Agility',
      quantityNeeded: 2,
      type: '',
      description: 'Description TBA'
    },
    'bladestorm': {
      key: 'bladestorm',
      name: 'Bladestorm',
      quantityNeeded: 2,
      type: '',
      description: 'Description TBA'
    },
    'deconstruction': {
      key: 'deconstruction',
      name: 'Deconstruction',
      quantityNeeded: 2,
      type: '',
      description: 'Description TBA'
    },
    'engineer': {
      key: 'engineer',
      name: 'Engineer',
      quantityNeeded: 2,
      type: '',
      description: 'Description TBA'
    },
    'lucent': {
      key: 'lucent',
      name: 'Lucent',
      quantityNeeded: 2,
      type: '',
      description: 'Description TBA'
    },
    'medic': {
      key: 'medic',
      name: 'Medic',
      quantityNeeded: 2,
      type: '',
      description: 'Description TBA'
    },
    'nimble': {
      key: 'nimble',
      name: 'Nimble',
      quantityNeeded: 2,
      type: '',
      description: 'Description TBA'
    },
    'stunning_vigour': {
      key: 'stunning_vigour',
      name: 'Stunning Vigour',
      quantityNeeded: 2,
      type: '',
      description: 'Description TBA'
    },
    'vampiric': {
      key: 'vampiric',
      name: 'Vampiric',
      quantityNeeded: 2,
      type: '',
      description: 'Description TBA'
    }

  }

  public armors: any = {
    'urska\'s helm': {
      slot: 'helm',
      perks: [{ cellKey: 'strategist', quantity: 3 }, { cellKey: 'inertia', quantity: 2 }, { cellKey: 'warmth', quantity: 2 }]
    },
    'urska\'s chest': {
      slot: 'chest',
      perks: [{ cellKey: 'inertia', quantity: 3 }, { cellKey: 'strategist', quantity: 2 }]
    },
    'urska\'s arms': {
      slot: 'arms',
      perks: [{ cellKey: 'inertia', quantity: 2 }, { cellKey: 'strategist', quantity: 2 }, { cellKey: 'warmth', quantity: 2 }]
    },
    'urska\'s legs': {
      slot: 'legs',
      perks: [{ cellKey: 'inertia', quantity: 3 }, { cellKey: 'grace', quantity: 2 }]
    },
    'agarus\'s helm': {
      slot: 'helm',
      perks: [{ cellKey: 'fortress', quantity: 3 }, { cellKey: 'earth', quantity: 2 }, { cellKey: 'endurance', quantity: 2 }]
    },
    'agarus\'s chest': {
      slot: 'chest',
      perks: [{ cellKey: 'earth', quantity: 3 }, { cellKey: 'fortress', quantity: 2 }]
    },
    'agarus\'s arms': {
      slot: 'arms',
      perks: [{ cellKey: 'earth', quantity: 2 }, { cellKey: 'endurance', quantity: 2 }, { cellKey: 'fortress', quantity: 2 }]
    },
    'agarus\'s legs': {
      slot: 'legs',
      perks: [{ cellKey: 'earth', quantity: 3 }, { cellKey: 'tough', quantity: 2 }]
    },
    'sahvyt\'s helm': {
      slot: 'helm',
      perks: [{ cellKey: 'tactician', quantity: 3 }, { cellKey: 'aether_syphon', quantity: 2 }, { cellKey: 'relentless', quantity: 2 }]
    },
    'sahvyt\'s chest': {
      slot: 'chest',
      perks: [{ cellKey: 'aether_syphon', quantity: 3 }, { cellKey: 'tactician', quantity: 2 }]
    },
    'sahvyt\'s arms': {
      slot: 'arms',
      perks: [{ cellKey: 'aether_syphon', quantity: 2 }, { cellKey: 'relentless', quantity: 2 }, { cellKey: 'tactician', quantity: 2 }]
    },
    'sahvyt\'s legs': {
      slot: 'legs',
      perks: [{ cellKey: 'aether_syphon', quantity: 3 }, { cellKey: 'bladestorm', quantity: 2 }]
    },
    'boreus\'s helm': {
      slot: 'helm',
      perks: [{ cellKey: 'pack_caller', quantity: 3 }, { cellKey: 'berserker', quantity: 2 }, { cellKey: 'tenacious', quantity: 2 }]
    },
    'boreus\'s chest': {
      slot: 'chest',
      perks: [{ cellKey: 'berserker', quantity: 3 }, { cellKey: 'pack_caller', quantity: 2 }]
    },
    'boreus\'s arms': {
      slot: 'arms',
      perks: [{ cellKey: 'berserker', quantity: 2 }, { cellKey: 'pack_caller', quantity: 2 }, { cellKey: 'tenacious', quantity: 2 }]
    },
    'boreus\'s legs': {
      slot: 'legs',
      perks: [{ cellKey: 'berserker', quantity: 3 }, { cellKey: 'tough', quantity: 2 }]
    },
    'pangar\'s helm': {
      slot: 'helm',
      perks: [{ cellKey: 'overpower', quantity: 3 }, { cellKey: 'assassin\'s_bulwark', quantity: 2 }, { cellKey: 'knockout_king', quantity: 2 }]
    },
    'pangar\'s chest': {
      slot: 'chest',
      perks: [{ cellKey: 'assassin\'s_bulwark', quantity: 3 }, { cellKey: 'overpower', quantity: 2 }]
    },
    'pangar\'s arms': {
      slot: 'arms',
      perks: [{ cellKey: 'assassin\'s_bulwark', quantity: 2 }, { cellKey: 'knockout_king', quantity: 2 }, { cellKey: 'overpower', quantity: 2 }]
    },
    'pangar\'s legs': {
      slot: 'legs',
      perks: [{ cellKey: 'assassin\'s_bulwark', quantity: 3 }, { cellKey: 'evasion', quantity: 2 }]
    },
    'chrono\'s helm': {
      slot: 'helm',
      perks: [{ cellKey: 'stop', quantity: 3 }, { cellKey: 'assassin\'s_vigour', quantity: 2 }, { cellKey: 'pulse', quantity: 2 }]
    },
    'chrono\'s chest': {
      slot: 'chest',
      perks: [{ cellKey: 'pulse', quantity: 3 }, { cellKey: 'stop', quantity: 2 }]
    },
    'chrono\'s arms': {
      slot: 'arms',
      perks: [{ cellKey: 'assassin\'s_vigour', quantity: 2 }, { cellKey: 'pulse', quantity: 2 }, { cellKey: 'stop', quantity: 2 }]
    },
    'chrono\'s legs': {
      slot: 'legs',
      perks: [{ cellKey: 'pulse', quantity: 3 }, { cellKey: 'tactician', quantity: 2 }]
    },
    'valomyr \'s helm': {
      slot: 'helm',
      perks: [{ cellKey: 'nine_lives', quantity: 3 }, { cellKey: 'lucent', quantity: 2 }, { cellKey: 'pulse', quantity: 2 }]
    },
    'valomyr \'s chest': {
      slot: 'chest',
      perks: [{ cellKey: 'pulse', quantity: 3 }, { cellKey: 'nine_lives', quantity: 2 }]
    },
    'valomyr \'s arms': {
      slot: 'arms',
      perks: [{ cellKey: 'lucent', quantity: 2 }, { cellKey: 'nine_lives', quantity: 2 }, { cellKey: 'pulse', quantity: 2 }]
    },
    'valomyr \'s legs': {
      slot: 'legs',
      perks: [{ cellKey: 'pulse', quantity: 3 }, { cellKey: 'weighted_strikes', quantity: 2 }]
    },
    'fenroar\'s helm': {
      slot: 'helm',
      perks: [{ cellKey: 'earth', quantity: 3 }, { cellKey: 'engineer', quantity: 2 }, { cellKey: 'rushdown', quantity: 2 }]
    },
    'fenroar\'s chest': {
      slot: 'chest',
      perks: [{ cellKey: 'rushdown', quantity: 3 }, { cellKey: 'earth', quantity: 2 }]
    },
    'fenroar\'s arms': {
      slot: 'arms',
      perks: [{ cellKey: 'earth', quantity: 2 }, { cellKey: 'engineer', quantity: 2 }, { cellKey: 'rushdown', quantity: 2 }]
    },
    'fenroar\'s legs': {
      slot: 'legs',
      perks: [{ cellKey: 'rushdown', quantity: 3 }, { cellKey: 'stunning_vigour', quantity: 2 }]
    },
    'drask\'s helm': {
      slot: 'helm',
      perks: [{ cellKey: 'sharpened', quantity: 3 }, { cellKey: 'agility', quantity: 2 }, { cellKey: 'evasive_fury', quantity: 2 }]
    },
    'drask\'s chest': {
      slot: 'chest',
      perks: [{ cellKey: 'evasive_fury', quantity: 3 }, { cellKey: 'sharpened', quantity: 2 }]
    },
    'drask\'s arms': {
      slot: 'arms',
      perks: [{ cellKey: 'agility', quantity: 2 }, { cellKey: 'evasive_fury', quantity: 2 }, { cellKey: 'sharpened', quantity: 2 }]
    },
    'drask\'s legs': {
      slot: 'legs',
      perks: [{ cellKey: 'evasive_fury', quantity: 3 }, { cellKey: 'insulated', quantity: 2 }]
    },
    'kharabak\'s helm': {
      slot: 'helm',
      perks: [{ cellKey: 'parasitic', quantity: 3 }, { cellKey: 'assassin\'s_frenzy', quantity: 2 }, { cellKey: 'bladestorm', quantity: 2 }]
    },
    'kharabak\'s chest': {
      slot: 'chest',
      perks: [{ cellKey: 'assassin\'s_frenzy', quantity: 3 }, { cellKey: 'parasitic', quantity: 2 }]
    },
    'kharabak\'s arms': {
      slot: 'arms',
      perks: [{ cellKey: 'assassin\'s_frenzy', quantity: 2 }, { cellKey: 'bladestorm', quantity: 2 }, { cellKey: 'parasitic', quantity: 2 }]
    },
    'kharabak\'s legs': {
      slot: 'legs',
      perks: [{ cellKey: 'assassin\'s_frenzy', quantity: 3 }, { cellKey: 'savagery', quantity: 2 }]
    },
    'ember\'s helm': {
      slot: 'helm',
      perks: [{ cellKey: 'evasion', quantity: 3 }, { cellKey: 'pack_hunter', quantity: 2 }, { cellKey: 'tough', quantity: 2 }]
    },
    'ember\'s chest': {
      slot: 'chest',
      perks: [{ cellKey: 'pack_hunter', quantity: 3 }, { cellKey: 'evasion', quantity: 2 }]
    },
    'ember\'s arms': {
      slot: 'arms',
      perks: [{ cellKey: 'evasion', quantity: 2 }, { cellKey: 'pack_hunter', quantity: 2 }, { cellKey: 'tough', quantity: 2 }]
    },
    'ember\'s legs': {
      slot: 'legs',
      perks: [{ cellKey: 'pack_hunter', quantity: 3 }, { cellKey: 'sprinter', quantity: 2 }]
    },
    'gnasher\'s helm': {
      slot: 'helm',
      perks: [{ cellKey: 'water', quantity: 3 }, { cellKey: 'aetheric_armour', quantity: 2 }, { cellKey: 'ragehunter', quantity: 2 }]
    },
    'gnasher\'s chest': {
      slot: 'chest',
      perks: [{ cellKey: 'ragehunter', quantity: 3 }, { cellKey: 'water', quantity: 2 }]
    },
    'gnasher\'s arms': {
      slot: 'arms',
      perks: [{ cellKey: 'aetheric_armour', quantity: 2 }, { cellKey: 'ragehunter', quantity: 2 }, { cellKey: 'water', quantity: 2 }]
    },
    'gnasher\'s legs': {
      slot: 'legs',
      perks: [{ cellKey: 'ragehunter', quantity: 3 }, { cellKey: 'reuse', quantity: 2 }]
    },
    'rift\'s helm': {
      slot: 'helm',
      perks: [{ cellKey: 'cunning', quantity: 3 }, { cellKey: 'recycle', quantity: 2 }, { cellKey: 'vampiric', quantity: 2 }]
    },
    'rift\'s chest': {
      slot: 'chest',
      perks: [{ cellKey: 'recycle', quantity: 3 }, { cellKey: 'cunning', quantity: 2 }]
    },
    'rift\'s arms': {
      slot: 'arms',
      perks: [{ cellKey: 'cunning', quantity: 2 }, { cellKey: 'recycle', quantity: 2 }, { cellKey: 'vampiric', quantity: 2 }]
    },
    'rift\'s legs': {
      slot: 'legs',
      perks: [{ cellKey: 'recycle', quantity: 3 }, { cellKey: 'aetherborne', quantity: 2 }]
    },
    'hellion\'s helm': {
      slot: 'helm',
      perks: [{ cellKey: 'molten', quantity: 3 }, { cellKey: 'defiance', quantity: 2 }, { cellKey: 'fire', quantity: 2 }]
    },
    'hellion\'s chest': {
      slot: 'chest',
      perks: [{ cellKey: 'fire', quantity: 3 }, { cellKey: 'molten', quantity: 2 }]
    },
    'hellion\'s arms': {
      slot: 'arms',
      perks: [{ cellKey: 'defiance', quantity: 2 }, { cellKey: 'fire', quantity: 2 }, { cellKey: 'molten', quantity: 2 }]
    },
    'hellion\'s legs': {
      slot: 'legs',
      perks: [{ cellKey: 'fire', quantity: 3 }, { cellKey: 'knockout_king', quantity: 2 }]
    },
    'reza\'s helm': {
      slot: 'helm',
      perks: [{ cellKey: 'roll', quantity: 3 }, { cellKey: 'conservation', quantity: 2 }, { cellKey: 'rushdown', quantity: 2 }]
    },
    'reza\'s chest': {
      slot: 'chest',
      perks: [{ cellKey: 'rushdown', quantity: 3 }, { cellKey: 'roll', quantity: 2 }]
    },
    'reza\'s arms': {
      slot: 'arms',
      perks: [{ cellKey: 'conservation', quantity: 2 }, { cellKey: 'roll', quantity: 2 }, { cellKey: 'rushdown', quantity: 2 }]
    },
    'reza\'s legs': {
      slot: 'legs',
      perks: [{ cellKey: 'rushdown', quantity: 3 }, { cellKey: 'swift', quantity: 2 }]
    },
    'storm\'s helm': {
      slot: 'helm',
      perks: [{ cellKey: 'pack_walker', quantity: 3 }, { cellKey: 'evasive_fury', quantity: 2 }, { cellKey: 'insulated', quantity: 2 }]
    },
    'storm\'s chest': {
      slot: 'chest',
      perks: [{ cellKey: 'evasive_fury', quantity: 3 }, { cellKey: 'pack_walker', quantity: 2 }]
    },
    'storm\'s arms': {
      slot: 'arms',
      perks: [{ cellKey: 'evasive_fury', quantity: 2 }, { cellKey: 'insulated', quantity: 2 }, { cellKey: 'pack_walker', quantity: 2 }]
    },
    'storm\'s legs': {
      slot: 'legs',
      perks: [{ cellKey: 'evasive_fury', quantity: 3 }, { cellKey: 'defiance', quantity: 2 }]
    },
    'malkarion \'s helm': {
      slot: 'helm',
      perks: [{ cellKey: 'merciless', quantity: 3 }, { cellKey: 'insulated', quantity: 2 }, { cellKey: 'predator', quantity: 2 }]
    },
    'malkarion \'s chest': {
      slot: 'chest',
      perks: [{ cellKey: 'predator', quantity: 3 }, { cellKey: 'merciless', quantity: 2 }]
    },
    'malkarion \'s arms': {
      slot: 'arms',
      perks: [{ cellKey: 'insulated', quantity: 2 }, { cellKey: 'merciless', quantity: 2 }, { cellKey: 'predator', quantity: 2 }]
    },
    'malkarion \'s legs': {
      slot: 'legs',
      perks: [{ cellKey: 'predator', quantity: 3 }, { cellKey: 'reduce', quantity: 2 }]
    },
    'phaelanx\'s helm': {
      slot: 'helm',
      perks: [{ cellKey: 'catalyst', quantity: 3 }, { cellKey: 'evasive_fury', quantity: 2 }, { cellKey: 'omnisurge', quantity: 2 }]
    },
    'phaelanx\'s chest': {
      slot: 'chest',
      perks: [{ cellKey: 'evasive_fury', quantity: 3 }, { cellKey: 'catalyst', quantity: 2 }]
    },
    'phaelanx\'s arms': {
      slot: 'arms',
      perks: [{ cellKey: 'catalyst', quantity: 2 }, { cellKey: 'evasive_fury', quantity: 2 }, { cellKey: 'omnisurge', quantity: 2 }]
    },
    'phaelanx\'s legs': {
      slot: 'legs',
      perks: [{ cellKey: 'evasive_fury', quantity: 3 }, { cellKey: 'nimble', quantity: 2 }]
    },
    'quillshot \'s helm': {
      slot: 'helm',
      perks: [{ cellKey: 'savagery', quantity: 3 }, { cellKey: 'barbed', quantity: 2 }, { cellKey: 'conduit', quantity: 2 }]
    },
    'quillshot \'s chest': {
      slot: 'chest',
      perks: [{ cellKey: 'conduit', quantity: 3 }, { cellKey: 'savagery', quantity: 2 }]
    },
    'quillshot \'s arms': {
      slot: 'arms',
      perks: [{ cellKey: 'barbed', quantity: 2 }, { cellKey: 'conduit', quantity: 2 }, { cellKey: 'savagery', quantity: 2 }]
    },
    'quillshot \'s legs': {
      slot: 'legs',
      perks: [{ cellKey: 'conduit', quantity: 3 }, { cellKey: 'vampiric', quantity: 2 }]
    },
    'nayzaga\'s helm': {
      slot: 'helm',
      perks: [{ cellKey: 'energized', quantity: 3 }, { cellKey: 'assassin\'s_edge', quantity: 2 }, { cellKey: 'medic', quantity: 2 }]
    },
    'nayzaga\'s chest': {
      slot: 'chest',
      perks: [{ cellKey: 'assassin\'s_edge', quantity: 3 }, { cellKey: 'energized', quantity: 2 }]
    },
    'nayzaga\'s arms': {
      slot: 'arms',
      perks: [{ cellKey: 'assassin\'s_edge', quantity: 2 }, { cellKey: 'energized', quantity: 2 }, { cellKey: 'medic', quantity: 2 }]
    },
    'nayzaga\'s legs': {
      slot: 'legs',
      perks: [{ cellKey: 'assassin\'s_edge', quantity: 3 }, { cellKey: 'deconstruction', quantity: 2 }]
    },
    'shrike\'s helm': {
      slot: 'helm',
      perks: [{ cellKey: 'grace', quantity: 3 }, { cellKey: 'predator', quantity: 2 }, { cellKey: 'weighted_strikes', quantity: 2 }]
    },
    'shrike\'s chest': {
      slot: 'chest',
      perks: [{ cellKey: 'predator', quantity: 3 }, { cellKey: 'grace', quantity: 2 }]
    },
    'shrike\'s arms': {
      slot: 'arms',
      perks: [{ cellKey: 'grace', quantity: 2 }, { cellKey: 'predator', quantity: 2 }, { cellKey: 'weighted_strikes', quantity: 2 }]
    },
    'shrike\'s legs': {
      slot: 'legs',
      perks: [{ cellKey: 'predator', quantity: 3 }, { cellKey: 'agility', quantity: 2 }]
    },
    'skarn\'s helm': {
      slot: 'helm',
      perks: [{ cellKey: 'guardian', quantity: 3 }, { cellKey: 'fortress', quantity: 2 }, { cellKey: 'galvanized', quantity: 2 }]
    },
    'skarn\'s chest': {
      slot: 'chest',
      perks: [{ cellKey: 'galvanized', quantity: 3 }, { cellKey: 'guardian', quantity: 2 }]
    },
    'skarn\'s arms': {
      slot: 'arms',
      perks: [{ cellKey: 'fortress', quantity: 2 }, { cellKey: 'galvanized', quantity: 2 }, { cellKey: 'guardian', quantity: 2 }]
    },
    'skarn\'s legs': {
      slot: 'legs',
      perks: [{ cellKey: 'galvanized', quantity: 3 }, { cellKey: 'defiance', quantity: 2 }]
    },
    'skraev\'s helm': {
      slot: 'helm',
      perks: [{ cellKey: 'adrenaline', quantity: 3 }, { cellKey: 'assassin\'s_momentum', quantity: 2 }, { cellKey: 'inertia', quantity: 2 }]
    },
    'skraev\'s chest': {
      slot: 'chest',
      perks: [{ cellKey: 'inertia', quantity: 3 }, { cellKey: 'adrenaline', quantity: 2 }]
    },
    'skraev\'s arms': {
      slot: 'arms',
      perks: [{ cellKey: 'adrenaline', quantity: 2 }, { cellKey: 'assassin\'s_momentum', quantity: 2 }, { cellKey: 'inertia', quantity: 2 }]
    },
    'skraev\'s legs': {
      slot: 'legs',
      perks: [{ cellKey: 'inertia', quantity: 3 }, { cellKey: 'warmth', quantity: 2 }]
    },
    'alyra\'s helm': {
      slot: 'helm',
      perks: [{ cellKey: 'swift', quantity: 3 }, { cellKey: 'carve', quantity: 2 }, { cellKey: 'deconstruction', quantity: 2 }]
    },
    'alyra\'s chest': {
      slot: 'chest',
      perks: [{ cellKey: 'carve', quantity: 3 }, { cellKey: 'swift', quantity: 2 }]
    },
    'alyra\'s arms': {
      slot: 'arms',
      perks: [{ cellKey: 'carve', quantity: 2 }, { cellKey: 'deconstruction', quantity: 2 }, { cellKey: 'swift', quantity: 2 }]
    },
    'alyra\'s legs': {
      slot: 'legs',
      perks: [{ cellKey: 'carve', quantity: 3 }, { cellKey: 'stunning_vigour', quantity: 2 }]
    },
    'thrax\'s helm': {
      slot: 'helm',
      perks: [{ cellKey: 'generator', quantity: 3 }, { cellKey: 'nimble', quantity: 2 }, { cellKey: 'ragehunter', quantity: 2 }]
    },
    'thrax\'s chest': {
      slot: 'chest',
      perks: [{ cellKey: 'ragehunter', quantity: 3 }, { cellKey: 'generator', quantity: 2 }]
    },
    'thrax\'s arms': {
      slot: 'arms',
      perks: [{ cellKey: 'generator', quantity: 2 }, { cellKey: 'nimble', quantity: 2 }, { cellKey: 'ragehunter', quantity: 2 }]
    },
    'thrax\'s legs': {
      slot: 'legs',
      perks: [{ cellKey: 'ragehunter', quantity: 3 }, { cellKey: 'savagery', quantity: 2 }]
    },
    'TDD\'s helm': {
      slot: 'helm',
      perks: [{ cellKey: 'reuse', quantity: 3 }, { cellKey: 'acidic', quantity: 2 }, { cellKey: 'berserker', quantity: 2 }]
    },
    'TDD\'s chest': {
      slot: 'chest',
      perks: [{ cellKey: 'berserker', quantity: 3 }, { cellKey: 'reuse', quantity: 2 }]
    },
    'TDD\'s arms': {
      slot: 'arms',
      perks: [{ cellKey: 'acidic', quantity: 2 }, { cellKey: 'berserker', quantity: 2 }, { cellKey: 'reuse', quantity: 2 }]
    },
    'TDD\'s legs': {
      slot: 'legs',
      perks: [{ cellKey: 'berserker', quantity: 3 }, { cellKey: 'conservation', quantity: 2 }]
    },
    'timeweave\'s helm': {
      slot: 'helm',
      perks: [{ cellKey: 'overpower', quantity: 3 }, { cellKey: 'iron_stomach', quantity: 2 }, { cellKey: 'predator', quantity: 2 }]
    },
    'timeweave\'s chest': {
      slot: 'chest',
      perks: [{ cellKey: 'predator', quantity: 3 }, { cellKey: 'overpower', quantity: 2 }]
    },
    'timeweave\'s arms': {
      slot: 'arms',
      perks: [{ cellKey: 'iron_stomach', quantity: 2 }, { cellKey: 'overpower', quantity: 2 }, { cellKey: 'predator', quantity: 2 }]
    },
    'timeweave\'s legs': {
      slot: 'legs',
      perks: [{ cellKey: 'predator', quantity: 3 }, { cellKey: 'sturdy', quantity: 2 }]
    },
    'torgadoro\'s helm': {
      slot: 'helm',
      perks: [{ cellKey: 'armoured', quantity: 3 }, { cellKey: 'berserker', quantity: 2 }, { cellKey: 'fireproof', quantity: 2 }]
    },
    'torgadoro\'s chest': {
      slot: 'chest',
      perks: [{ cellKey: 'berserker', quantity: 3 }, { cellKey: 'armoured', quantity: 2 }]
    },
    'torgadoro\'s arms': {
      slot: 'arms',
      perks: [{ cellKey: 'armoured', quantity: 2 }, { cellKey: 'berserker', quantity: 2 }, { cellKey: 'fireproof', quantity: 2 }]
    },
    'torgadoro\'s legs': {
      slot: 'legs',
      perks: [{ cellKey: 'berserker', quantity: 3 }, { cellKey: 'fortress', quantity: 2 }]
    },
    'koshai\'s helm': {
      slot: 'helm',
      perks: [{ cellKey: 'drop', quantity: 3 }, { cellKey: 'agility', quantity: 2 }, { cellKey: 'predator', quantity: 2 }]
    },
    'koshai\'s chest': {
      slot: 'chest',
      perks: [{ cellKey: 'predator', quantity: 3 }, { cellKey: 'drop', quantity: 2 }]
    },
    'koshai\'s arms': {
      slot: 'arms',
      perks: [{ cellKey: 'agility', quantity: 2 }, { cellKey: 'drop', quantity: 2 }, { cellKey: 'predator', quantity: 2 }]
    },
    'koshai\'s legs': {
      slot: 'legs',
      perks: [{ cellKey: 'predator', quantity: 3 }, { cellKey: 'assassin\'s_momentum', quantity: 2 }]
    },
    'charrogg \'s helm': {
      slot: 'helm',
      perks: [{ cellKey: 'fireproof', quantity: 3 }, { cellKey: 'aetherhunter', quantity: 2 }, { cellKey: 'sturdy', quantity: 2 }]
    },
    'charrogg \'s chest': {
      slot: 'chest',
      perks: [{ cellKey: 'aetherhunter', quantity: 3 }, { cellKey: 'fireproof', quantity: 2 }]
    },
    'charrogg \'s arms': {
      slot: 'arms',
      perks: [{ cellKey: 'aetherhunter', quantity: 2 }, { cellKey: 'fireproof', quantity: 2 }, { cellKey: 'sturdy', quantity: 2 }]
    },
    'charrogg \'s legs': {
      slot: 'legs',
      perks: [{ cellKey: 'aetherhunter', quantity: 3 }, { cellKey: 'reuse', quantity: 2 }]
    },
    'wulf\'s helm': {
      slot: 'helm',
      perks: [{ cellKey: 'galvanized', quantity: 3 }, { cellKey: 'aegis', quantity: 2 }, { cellKey: 'cascade', quantity: 2 }]
    },
    'wulf\'s chest': {
      slot: 'chest',
      perks: [{ cellKey: 'cascade', quantity: 3 }, { cellKey: 'galvanized', quantity: 2 }]
    },
    'wulf\'s arms': {
      slot: 'arms',
      perks: [{ cellKey: 'aegis', quantity: 2 }, { cellKey: 'cascade', quantity: 2 }, { cellKey: 'galvanized', quantity: 2 }]
    },
    'wulf\'s legs': {
      slot: 'legs',
      perks: [{ cellKey: 'cascade', quantity: 3 }, { cellKey: 'pack_walker', quantity: 2 }]
    }
  }

  public possibleSets: any = [];
  public possibleBuilds: any = [];

  public numberOfCellsNeeded = 0;
  public selectedPerks: any = [];

  public possibleCells: any = [];

  public perkSearchInput: string = '';

  ngOnInit(): void {
    // I know this is horrible but hey it\'s BETA
    this.possibleSets = this.generateArmorCombinations(this.armors);
    this.updatePossibleBuilds();
  }

  public generateArmorCombinations(armors: any) {
    const armorSlots = ['helm', 'chest', 'arms', 'legs'];
    const armorGroups = armorSlots.map(slot => {
      return Object.keys(armors).filter(armorName => armors[armorName].slot === slot);
    });

    const combinations: any[] = [];
    const [helmArmors, chestArmors, armsArmors, legsArmors] = armorGroups;

    // Utilisation de boucles classiques pour de meilleures performances
    for (const helm of helmArmors) {
      for (const chest of chestArmors) {
        for (const arms of armsArmors) {
          for (const legs of legsArmors) {
            const pieces = [helm, chest, arms, legs];
            const perksMap = this.combinePerksMap(pieces);
            combinations.push({
              pieces: pieces,
              perksMap: perksMap
            });
          }
        }
      }
    }

    return combinations;
  }

  public combinePerksMap(armorList: any[]) {
    const perksMap: { [key: string]: number } = {};

    armorList.forEach(armorName => {
      this.armors[armorName].perks.forEach((perk: any) => {
        if (perksMap[perk.cellKey]) {
          perksMap[perk.cellKey] += perk.quantity;
        } else {
          perksMap[perk.cellKey] = perk.quantity;
        }
      });
    });

    return perksMap;
  }

  public onPerkSelected(cellKey: string) {
    this.selectedPerks.push(this.cells[cellKey]);
    this.numberOfCellsNeeded += this.cells[cellKey].quantityNeeded;

    this.updatePossibleBuilds();
  }

  public onRemovePerk(cellKey: string) {
    this.numberOfCellsNeeded -= this.selectedPerks.filter((p: any) => p.key === cellKey)[0]?.quantityNeeded || 0;
    this.selectedPerks = this.selectedPerks.filter((p: any) => p.key != cellKey);

    this.updatePossibleBuilds();
  }

  public updatePossibleBuilds() {
    const canBeAdded: Set<string> = new Set();
    const selectedPerkKeys = new Set(this.selectedPerks.map((p: any) => p.key));

    // Création d'une map pour un accès rapide aux quantités nécessaires
    const selectedPerkMap: { [key: string]: number } = {};
    this.selectedPerks.forEach((perk: any) => {
      selectedPerkMap[perk.key] = perk.quantityNeeded;
    });

    this.possibleBuilds = [];
    canBeAdded.clear();

    for (const set of this.possibleSets) {
      let isOk = true;
      const cellsToAdd: any[] = [];
      const activatedPerks: any[] = [];
      let cellsToAddSum = 0;

      // Vérification des perks sélectionnés
      for (const perkKey in selectedPerkMap) {
        const requiredQuantity = selectedPerkMap[perkKey];
        const availableQuantity = set.perksMap[perkKey] || 0;

        if (availableQuantity < requiredQuantity) {
          const needed = requiredQuantity - availableQuantity;
          cellsToAdd.push({
            name: this.cells[perkKey].name,
            quantityNeeded: needed
          });
          cellsToAddSum += needed;

          if (cellsToAddSum > 6) {
            isOk = false;
            break; // Pas besoin de continuer si la limite est dépassée
          }
        }

        if (availableQuantity >= requiredQuantity) {
          activatedPerks.push({
            name: this.cells[perkKey].name,
            description: this.cells[perkKey].description
          });
        }
      }

      if (!isOk) continue; // Passer à la combinaison suivante

      const freeSlots = 6 - cellsToAddSum;

      // Identification des perks supplémentaires pouvant être ajoutés
      for (const perkKey in set.perksMap) {
        if (selectedPerkKeys.has(perkKey)) continue; // Déjà traité

        const cell = this.cells[perkKey];
        if (cell.quantityNeeded <= set.perksMap[perkKey] + freeSlots) {
          canBeAdded.add(perkKey);
          if (set.perksMap[perkKey] >= cell.quantityNeeded) {
            activatedPerks.push({
              name: cell.name,
              description: cell.description
            });
          }
        }
      }

      // Vérification des perks pouvant être ajoutés sans les perks du set
      for (const key in this.cells) {
        if (!canBeAdded.has(key) && this.cells[key].quantityNeeded <= freeSlots) {
          canBeAdded.add(key);
        }
      }

      // Ajout de la combinaison valide aux builds possibles
      this.possibleBuilds.push({
        pieces: set.pieces,
        cellsToAdd: cellsToAdd,
        activatedPerks: activatedPerks
      });
    }

    // Mise à jour des cellules possibles avec visibilité et sélection
    const canBeAddedArray = Array.from(canBeAdded);
    this.possibleCells = Object.keys(this.cells).map(key => ({
      ...this.cells[key],
      visible: canBeAddedArray.includes(key),
      selected: selectedPerkKeys.has(key)
    }));

    // Tri des builds possibles par somme des cellsToAdd
    this.possibleBuilds.sort((a: any, b: any) => {
      const sumA = a.cellsToAddSum || a.cellsToAdd.reduce((sum: number, c: any) => sum + c.quantityNeeded, 0);
      const sumB = b.cellsToAddSum || b.cellsToAdd.reduce((sum: number, c: any) => sum + c.quantityNeeded, 0);
      return sumA - sumB;
    });

    this.possibleBuilds.forEach((build: any) => {
      build.piecesDisplay = build.pieces.map((piece: any) => this.removeType(piece));
    });
  }

  public removeType(str: string): string {
    return str.replace(/\'s (helm|chest|arms|legs)/i, '').toUpperCase();
  }

  public trackByCell(index: number, cell: any): string {
    return cell.key;
  }

  public trackByBuild(index: number, build: any): string {
    return build.pieces.join('-'); // Assure que chaque build a une clé unique
  }
}