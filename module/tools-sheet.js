/**
 * Conan GM Tools Sheet
 * A centralized configuration panel for system-wide tools
 * - Flex Celebration System (placeholder - to be implemented)
 * - Chat Styler
 * - Future tools...
 */

// Enemy category color themes
// Natural enemies: muted/earthy tones
// Supernatural enemies: brighter, more vibrant
const CATEGORY_THEMES = {
  human: {
    name: 'Human',
    primary: '#8B7355',      // Muted bronze/tan
    secondary: '#5C4A3D',    // Darker brown
    accent: '#C4A574',       // Light bronze
    border: '#6B5344',       // Brown border
    glow: 'rgba(139, 115, 85, 0.4)',
    isSuper: false
  },
  beasts: {
    name: 'Beasts',
    primary: '#5A7247',      // Muted forest green
    secondary: '#3D4D30',    // Dark green
    accent: '#8BA572',       // Light sage
    border: '#4A5D3A',       // Green border
    glow: 'rgba(90, 114, 71, 0.4)',
    isSuper: false
  },
  undead: {
    name: 'Undead',
    primary: '#7B4B9E',      // Vibrant purple
    secondary: '#4A2D5E',    // Deep violet
    accent: '#B87FD9',       // Bright lavender
    border: '#9B5BBE',       // Purple border
    glow: 'rgba(155, 91, 190, 0.6)',
    isSuper: true
  },
  demons: {
    name: 'Demons',
    primary: '#C43C3C',      // Bright crimson
    secondary: '#7A2525',    // Deep blood red
    accent: '#FF6B4A',       // Fiery orange
    border: '#E04545',       // Red border
    glow: 'rgba(224, 69, 69, 0.6)',
    isSuper: true
  },
  monstrosity: {
    name: 'Monstrosity',
    primary: '#2E8B8B',      // Vibrant teal
    secondary: '#1A5252',    // Deep teal
    accent: '#4ECDC4',       // Bright cyan
    border: '#3AA3A3',       // Teal border
    glow: 'rgba(78, 205, 196, 0.6)',
    isSuper: true
  },
  inanimate: {
    name: 'Inanimate',
    primary: '#6B6B6B',      // Stone grey
    secondary: '#454545',    // Dark grey
    accent: '#9A9A9A',       // Light grey
    border: '#5A5A5A',       // Grey border
    glow: 'rgba(107, 107, 107, 0.4)',
    isSuper: false
  },
  originBeast: {
    name: 'Origin Beast',
    primary: '#8B6914',      // Dark gold
    secondary: '#5C4400',    // Deep amber
    accent: '#D4A017',       // Bright gold
    border: '#A07B1A',       // Gold border
    glow: 'rgba(212, 160, 23, 0.6)',
    isSuper: true
  },
  unknown: {
    name: 'Unknown',
    primary: '#6B4E9E',      // Mysterious purple
    secondary: '#3D2D5E',    // Deep purple
    accent: '#9B7FD9',       // Light purple
    border: '#7B5EAE',       // Purple border
    glow: 'rgba(123, 94, 174, 0.5)',
    isSuper: true
  }
};

// Poison/Venom rules lookup by enemy ID
// Static table — no regex parsing of natural language descriptions
const POISON_RULES = {
  'giant-scorpion': {
    ruleName: 'Poison Sting',
    weaponName: 'Stinger',
    damageThreshold: 2,
    gritDC: 8,
    dcType: 'fixed',
    outcome: 'poisoned'
  },
  'giant-scorpion-brood-guard': {
    ruleName: 'Poison Sting',
    weaponName: 'Stinger',
    damageThreshold: 2,
    gritDC: 10,
    dcType: 'fixed',
    outcome: 'poisoned'
  },
  'giant-scorpion-brood-mother': {
    ruleName: 'Potent Venom',
    weaponName: 'Barbed Stinger',
    damageThreshold: 2,
    gritDC: null,
    dcType: 'dynamic',
    outcome: 'poisoned',
    bonusDamage: '1d10',
    bonusDamageIgnoresAR: true
  },
  'scourge-of-set': {
    ruleName: 'Venomous Bite',
    weaponName: null,
    damageThreshold: 3,
    gritDC: 11,
    dcType: 'fixed',
    outcome: 'poisoned'
  },
  'giant-spider-queen': {
    ruleName: 'Paralyzing Venom',
    weaponName: null,
    damageThreshold: 3,
    gritDC: 10,
    dcType: 'fixed',
    outcome: 'immobilized'
  },
  'giant-serpent': {
    ruleName: 'Venomous Bite',
    weaponName: null,
    damageThreshold: 5,
    gritDC: null,
    dcType: 'none',
    outcome: 'poisoned'
  }
};

// Condition definitions with colors and icons
const CONDITIONS = [
  { key: 'mounted', name: 'Mounted', icon: 'systems/conan/images/icons/mounted_icon.png', color: '#D2691E' },
  { key: 'poisoned', name: 'Poisoned', icon: 'systems/conan/images/icons/poisoned_icon.png', color: '#32CD32' },
  { key: 'unconscious', name: 'Unconscious', icon: 'systems/conan/images/icons/unconscious_icon.png', color: '#9370DB' },
  { key: 'stunned', name: 'Stunned', icon: 'systems/conan/images/icons/stunned_icon.png', color: '#FFD700' },
  { key: 'bound', name: 'Bound', icon: 'systems/conan/images/icons/bound_icon.png', color: '#A0A0A0' },
  { key: 'frightened', name: 'Frightened', icon: 'systems/conan/images/icons/frightened_icon.png', color: '#87CEEB' },
  { key: 'blinded', name: 'Blinded', icon: 'systems/conan/images/icons/blinded_icon.png', color: '#708090' },
  { key: 'prone', name: 'Prone', icon: 'systems/conan/images/icons/prone_icon.png', color: '#CD853F' },
  { key: 'grappled', name: 'Grappled', icon: 'systems/conan/images/icons/grappled_icon.png', color: '#FF6600' },
  { key: 'bleeding', name: 'Bleeding', icon: 'systems/conan/images/icons/bleeding_icon.png', color: '#DC143C' },
  { key: 'encumbered', name: 'Encumbered', icon: 'systems/conan/images/icons/encumbered_icon.png', color: '#8B4513', displayOnly: true }
];

// Chat messages for condition changes
const CONDITION_MESSAGES = {
  mounted: { on: 'mounts up', off: 'dismounts' },
  poisoned: { on: 'has been poisoned', off: 'recovers from poison' },
  unconscious: { on: 'falls unconscious', off: 'regains consciousness' },
  stunned: { on: 'is stunned', off: 'shakes off the stun' },
  bound: { on: 'is bound', off: 'breaks free' },
  frightened: { on: 'is frightened', off: 'overcomes their fear' },
  blinded: { on: 'is blinded', off: 'regains sight' },
  prone: { on: 'is knocked prone', off: 'gets back up' },
  grappled: { on: 'is grappled', off: 'escapes the grapple' },
  bleeding: { on: 'starts bleeding', off: 'stops the bleeding' }
};

// Buff/Debuff definitions - sorcery and skill effects
const BUFFS_DEBUFFS = [
  // === DEBUFFS (Red/Orange tones) ===
  { key: 'initReduced', name: 'Init Reduced', icon: 'systems/conan/images/icons/init_reduced_icon.png', color: '#FF4500', type: 'debuff', source: 'Lotus Flash' },
  { key: 'physDefDown', name: '-1 Phys Def', icon: 'systems/conan/images/icons/phys_def_down_icon.png', color: '#CD5C5C', type: 'debuff', source: 'Tide of Stone' },
  { key: 'attackDown', name: '-2 Attack', icon: 'systems/conan/images/icons/attack_down_icon.png', color: '#B22222', type: 'debuff', source: 'Fearsome Ward' },
  { key: 'cannotMove', name: 'Cannot Move', icon: 'systems/conan/images/icons/cannot_move_icon.png', color: '#4B0082', type: 'debuff', source: 'Wave of Darkness' },
  { key: 'witsGritDown', name: '-2 Wits/Grit', icon: 'systems/conan/images/icons/wits_grit_down_icon.png', color: '#8B0000', type: 'debuff', source: 'Frightful Aura' },
  { key: 'defDown', name: 'Def Down', icon: 'systems/conan/images/icons/chilling_touch_icon.png', color: '#87CEEB', type: 'debuff', source: 'Chilling Touch' },
  { key: 'checksDown', name: '-1 Checks', icon: 'systems/conan/images/icons/checks_down_icon.png', color: '#DC143C', type: 'debuff', source: 'Hellfire' },
  { key: 'controlled', name: 'Controlled', icon: 'systems/conan/images/icons/controlled_icon.png', color: '#9400D3', type: 'debuff', source: 'Mesmerism' },

  // === BUFFS (Green/Blue tones) ===
  { key: 'armorUp', name: '+3 AR', icon: 'systems/conan/images/icons/armor_up_icon.png', color: '#4682B4', type: 'buff', source: 'Body of Living Iron' },
  { key: 'baneWeapon', name: 'Bane Weapon', icon: 'systems/conan/images/icons/bane_weapon_icon.png', color: '#9932CC', type: 'buff', source: 'Create Bane Weapon' },
  { key: 'beastForm', name: 'Beast Form', icon: 'systems/conan/images/icons/beast_form_icon.png', color: '#228B22', type: 'buff', source: 'Beast Form' },
  { key: 'edgeUp', name: '+2 Edge', icon: 'systems/conan/images/icons/edge_up_icon.png', color: '#20B2AA', type: 'buff', source: 'Eyes of the Raven' },
  { key: 'demonicSteed', name: 'Demonic Steed', icon: 'systems/conan/images/icons/demonic_steed_icon.png', color: '#FF6347', type: 'buff', source: 'Demonic Steed' },
  { key: 'inspired', name: 'Inspired', icon: 'systems/conan/images/icons/inspired_icon.png', color: '#FFD700', type: 'buff', source: 'Inspire' },
  { key: 'demonicWard', name: 'Demonic Ward', icon: 'systems/conan/images/icons/demonic_ward_icon.png', color: '#8A2BE2', type: 'buff', source: 'Demonic Ward' },
  { key: 'uncannyReach', name: 'Uncanny Reach', icon: 'systems/conan/images/icons/uncanny_reach_icon.png', color: '#DA70D6', type: 'buff', source: 'Uncanny Reach' }
];

// Chat messages for buff/debuff changes
const BUFF_DEBUFF_MESSAGES = {
  // Debuffs
  initReduced: { on: 'has their initiative reduced to 1', off: 'recovers their initiative' },
  physDefDown: { on: 'suffers -1 Physical Defense', off: 'recovers their Physical Defense' },
  attackDown: { on: 'suffers -2 to Attacks', off: 'recovers their attack ability' },
  cannotMove: { on: 'cannot move', off: 'can move again' },
  witsGritDown: { on: 'suffers -2 to Wits/Grit Checks', off: 'recovers their Wits/Grit' },
  defDown: { on: 'suffers -1 Phys / -2 Sorc Defense', off: 'recovers their defenses' },
  checksDown: { on: 'suffers -1 to Checks/Attacks', off: 'recovers from the penalty' },
  controlled: { on: 'is under enemy control', off: 'breaks free from control' },
  // Buffs
  armorUp: { on: 'gains +3 Armor Rating', off: 'loses the armor bonus' },
  baneWeapon: { on: 'wields a Bane Weapon', off: 'loses the Bane Weapon enchantment' },
  beastForm: { on: 'transforms into Beast Form', off: 'reverts from Beast Form' },
  edgeUp: { on: 'gains +2 Edge for perception', off: 'loses the Edge bonus' },
  demonicSteed: { on: 'summons a Demonic Steed', off: 'dismisses the Demonic Steed' },
  inspired: { on: 'is Inspired (+1 SP, +2 Checks)', off: 'loses their inspiration' },
  demonicWard: { on: 'is protected by a Demonic Ward', off: 'loses the Demonic Ward' },
  uncannyReach: { on: 'extends their reach unnaturally', off: 'loses the extended reach' }
};

// ==========================================
// THREAT ENGINE — Procedural enemy difficulty
// ==========================================
// Per-group trait pools — each enemy group draws from its own pool, never mixed
const THREAT_TRAITS_GUARDS = [
  { id: 'tough',      name: 'Tough',      description: 'Damage ≤ 2 is ignored (after AR).' },
  { id: 'aggressive', name: 'Aggressive', description: '+1 attack rolls, +1 damage.' },
  { id: 'tactical',   name: 'Tactical',   description: 'Protect gives +2 def. Inspire gives +2 attack.' },
  { id: 'armored',    name: 'Armored',    description: 'Antagonist: +2 AR. Minion: survives 1 extra hit.' },
  { id: 'defensive',  name: 'Defensive',  description: '+1 Physical Defense, +1 Sorcery Defense.' }
];

const THREAT_TRAITS_BANDITS = [
  { id: 'hard',         name: 'Hard',         description: 'Antagonist: +1 AR. Minion: survives 1 extra hit.' },
  { id: 'bloodthirsty', name: 'Bloodthirsty', description: '+1d3 bonus damage on attacks.' },
  { id: 'doublestrike', name: 'Doublestrike', description: 'When damage is applied, automatically rolls a second attack.' }
];

const THREAT_TRAITS_PICTS = [
  { id: 'warchant', name: 'War Chant', description: '+2 bonus damage when under War Cry.' },
  { id: 'wildman',  name: 'Wildman',   description: 'Death strike — rolls melee attack on death.' },
  { id: 'horde',    name: 'Horde',     description: '2 Pict Hunters spawn adjacent on death.' },
  { id: 'thunderstrike', name: 'Thunderstrike', description: 'Stuns target — locks token, 1 SP to dismiss or clears end of next turn.' }
];

const THREAT_TRAITS_CULTISTS = [
  { id: 'dedicated',  name: 'Dedicated Servant', description: 'Minion death: summons Winged Nightmare. Antagonist: enhances Summon Fiend.' },
  { id: 'zealot',     name: 'Zealot',            description: '+1d4 bonus damage on attacks.' },
  { id: 'faithful',   name: 'Faithful',          description: '+2 Sorcery Defense.' },
  { id: 'martyr',     name: 'Martyr',            description: 'On death: all cultists gain +1 damage. Max 3 stacks.' },
  { id: 'fromgrave',  name: 'From the Grave',    description: 'On death: deals 1d4 damage to killer.' },
];

const THREAT_TRAITS_PIRATES = [
  { id: 'riposte',   name: 'Riposte',       description: 'Counter-attack — auto-rolls melee attack when surviving damage.' },
  { id: 'nimble',    name: 'Nimble',         description: '+2 Physical Defense.' },
  { id: 'cutthroat', name: 'Cutthroat',      description: '+2 bonus damage on attacks.' },
  { id: 'dirty',     name: 'Dirty Fighter',  description: 'Attacks reduce target AR by 1. Stacks to 3, lasts until combat ends.' },
];

const THREAT_TRAITS_BARBARIANS = [
  { id: 'berserker',  name: 'Berserker',   description: '+1 damage per dead barbarian. Stacking, combat-long.' },
  { id: 'roar',       name: 'Roar',        description: 'Enhances Barbaric Resilience (permanent survive) and Bellow for Blood (heals).' },
  { id: 'bloodyaxe',  name: 'Bloody Axe',  description: '+2 bonus damage on attacks.' },
  { id: 'ironwill',   name: 'Iron Will',   description: '+2 Sorcery Defense.' },
];

const THREAT_TRAITS_STEPPE = [
  { id: 'swift',    name: 'Swift',     description: 'Once per round: first non-spell damage is negated, attacker must reroll. Refreshes on rider\'s turn.' },
  { id: 'eagleeye', name: 'Eagle Eye', description: 'Ranged attacks deal +1 damage and ignore 2 AR.' },
  { id: 'trample',  name: 'Trample',   description: '+2 bonus damage on melee attacks.' },
  { id: 'untamed',  name: 'Untamed',   description: 'After melee damage, horse auto-attacks (1d6+3 attack, 1d4+2 damage).' },
];

const THREAT_TRAITS_NECRO = [
  { id: 'eternalservant', name: 'Eternal Servant', description: 'On necromancer\'s turn: all killed skeletons are resurrected.' },
  { id: 'deathless',      name: 'Deathless',       description: 'A killing blow is redirected to a living skeleton instead. The skeleton dies but may return via Eternal Servant.' },
  { id: 'soulharvest',    name: 'Soul Harvest',    description: 'Whenever a skeleton dies, the necromancer heals 1D6 LP.' },
  { id: 'bonearmor',      name: 'Bone Armor',      description: 'When struck, bone shards reflect 1 damage back to the attacker.' },
];

const THREAT_TRAITS_SUMMONER = [
  { id: 'inferno',    name: 'Inferno',    description: 'Hellfire sets targets ablaze. Burns for 1d4 damage each round (max 3). Random chance to extinguish each round.' },
  { id: 'damnation',  name: 'Damnation',  description: 'Hellfire deals 15 damage instead of 10.' },
  { id: 'volatile',   name: 'Volatile',   description: 'On death: explodes for 1d8 fire damage to the killer.' },
  { id: 'backdraft',  name: 'Backdraft',  description: 'Melee attackers take 1d4 fire damage when they strike.' },
];

// Eruption — NOT in the random pool, only enters via Volatile→Eruption swap on tier 3 Volcanist
const THREAT_TRAIT_ERUPTION = { id: 'eruption', name: 'Eruption', description: 'Ticking time bomb. Each round: chance to erupt scaling with wounds (5% full → 50% half → 90% critical). Eruption deals 2d10 fire damage to everyone in the area and kills the Volcanist.' };

// Summoner tier images — override portrait + token per skull tier
const SUMMONER_TIER_IMAGES = {
  1: { portrait: 'systems/conan/images/enemies/summoner/pyre_portrait.png',        token: 'systems/conan/images/enemies/summoner/pyre_token.png' },
  2: { portrait: 'systems/conan/images/enemies/summoner/burning_one_portrait.png',  token: 'systems/conan/images/enemies/summoner/burning_one_token.png' },
  3: { portrait: 'systems/conan/images/enemies/summoner/volcanist_portrait.png',    token: 'systems/conan/images/enemies/summoner/volcanist_token.png' },
};

const THREAT_TRAITS_SILKVIPERS = [
  { id: 'lotusdust',  name: 'Lotus Dust',  description: 'On physical hit, target gets -1 to attack rolls. Stacks up to 3.' },
  { id: 'garrote',    name: 'Garrote',      description: 'Whip attack applies Bound status. Target cannot move and takes 1d4 damage each turn. 1 SP to break free.' },
  { id: 'firstwife',  name: 'First Wife',   description: 'When the Enchantress dies, summon a replacement at 40-60% HP.' },
  { id: 'harmless',   name: 'Harmless',     description: 'First killing blow misses — "you cannot bring yourself to hurt this harmless woman." Once per fight.' },
  { id: 'madwoman',   name: 'Madwoman',     description: 'Surviving a hit grants +2 defense and +2 damage. Stacks up to 2 times.' },
];

const THREAT_TRAITS_WITCH = [
  { id: 'glamour',    name: 'Glamour',     description: 'Sorcery (1 LP): Blinds a player until end of their turn. Attacks auto-miss unless Flex triggers. 1 SP to overcome.' },
  { id: 'beastmaster', name: 'Beastmaster', description: 'Call Beast summons 2 beasts instead of 1.' },
  { id: 'feralbond',  name: 'Feral Bond',  description: 'Summoned beasts gain +2 attack and +2 damage.' },
  { id: 'hex',        name: 'Hex',         description: 'Sorcery (1 LP): Curses a player with -1 attack. Stacks up to 3. Removed when witch dies.' },
];

// Master lookup: enemy ID → trait pool
const THREAT_POOLS = {
  'guard':              THREAT_TRAITS_GUARDS,
  'veteran-guard':      THREAT_TRAITS_GUARDS,
  'guard-captain':      THREAT_TRAITS_GUARDS,
  'bandit':             THREAT_TRAITS_BANDITS,
  'veteran-bandit':     THREAT_TRAITS_BANDITS,
  'bandit-leader':      THREAT_TRAITS_BANDITS,
  'pict-hunter':        THREAT_TRAITS_PICTS,
  'pict-warrior':       THREAT_TRAITS_PICTS,
  'pict-champion':      THREAT_TRAITS_PICTS,
  'cultist-initiate':   THREAT_TRAITS_CULTISTS,
  'cultist':            THREAT_TRAITS_CULTISTS,
  'cultist-high-priest': THREAT_TRAITS_CULTISTS,
  'pirate':             THREAT_TRAITS_PIRATES,
  'pirate-mate':        THREAT_TRAITS_PIRATES,
  'pirate-captain':     THREAT_TRAITS_PIRATES,
  'barbarian-youth':    THREAT_TRAITS_BARBARIANS,
  'barbarian':          THREAT_TRAITS_BARBARIANS,
  'barbarian-chieftain': THREAT_TRAITS_BARBARIANS,
  'steppe-rider-youth': THREAT_TRAITS_STEPPE,
  'steppe-rider':       THREAT_TRAITS_STEPPE,
  'steppe-rider-khan':  THREAT_TRAITS_STEPPE,
  'witch':              THREAT_TRAITS_WITCH,
  'necromancer':        THREAT_TRAITS_NECRO,
  'summoner':           THREAT_TRAITS_SUMMONER,
  'handmaiden':         THREAT_TRAITS_SILKVIPERS,
  'bride':              THREAT_TRAITS_SILKVIPERS,
  'enchantress':        THREAT_TRAITS_SILKVIPERS,
};

// Flat union for trait badge lookups (resolves any trait ID regardless of pool)
const ALL_THREAT_TRAITS = [...THREAT_TRAITS_GUARDS, ...THREAT_TRAITS_BANDITS, ...THREAT_TRAITS_PICTS, ...THREAT_TRAITS_CULTISTS, ...THREAT_TRAITS_PIRATES, ...THREAT_TRAITS_BARBARIANS, ...THREAT_TRAITS_STEPPE, ...THREAT_TRAITS_WITCH, ...THREAT_TRAITS_NECRO, ...THREAT_TRAITS_SUMMONER, THREAT_TRAIT_ERUPTION, ...THREAT_TRAITS_SILKVIPERS];

// Hyborian name pool — gendered for flavor text pronouns
const HYBORIAN_NAMES_M = [
  'Aldric','Artos','Balthus','Brennus','Cassian','Corvus','Demetros','Drago','Falco','Gaius',
  'Hector','Justus','Kaeso','Lucan','Magnus','Nereus','Otho','Pallus','Quintus','Regulus',
  'Servius','Titus','Varro','Volanus','Xanthus',
  'Arik','Bjarn','Cael','Darik','Egil','Fenrik','Garm','Hagen','Ivar','Jorik',
  'Kael','Lothar','Mordag','Njal','Oric','Ragnar','Sigurd','Thrain','Ulf','Wulfgar',
  'Ardavan','Bahram','Cyaxes','Dariush','Farzad','Ghasem','Hormuz','Iskander','Javad','Kaveh',
  'Mehran','Navid','Omid','Pahlav','Rostam','Shapur','Tahir','Vahraz','Xerxes',
  'Amunhotep','Bakari','Chasef','Djoser','Heshir','Imhotep','Kephren','Menkhet','Ptahmos',
  'Rakhmet','Sekhros','Thothmek','Userkaf',
  'Arkon','Borso','Darios','Evander','Gavros','Hektor','Ithikos','Krato','Lysander','Myron',
  'Nikos','Pelias','Remos','Strabo','Theron','Zenon',
  'Amadi','Bakr','Chaka','Dembe','Ekon','Fenuku','Gamba','Hasani','Jabari','Kofi',
  'Mansa','Ndaru','Osei','Rafiki','Sekani','Tau','Zuberi',
  'Bayan','Chian','Dorje','Feng','Gantai','Huro','Jin','Khai','Liang','Mengdu',
  'Noyan','Qara','Rengdu','Shen','Taishan','Wulin','Xuan','Yongan','Zhen',
  'Brak','Crom','Dusk','Flint','Grym','Hawk','Iron','Jak','Kord','Mace',
  'Pike','Rusk','Slade','Thorn','Vex','Grim','Dirk','Wolf',
];
const HYBORIAN_NAMES_F = [
  'Aldara','Brenna','Cassia','Drusilla','Elara','Fausta','Galena','Helena','Isara','Junia',
  'Kalista','Livia','Marcella','Neria','Oriana','Priscilla','Rhea','Severa','Tullia','Valeria','Vesta',
  'Aesa','Brynhild','Dagny','Eira','Freya','Gisla','Halla','Ingrid','Kari',
  'Lifa','Moira','Nessa','Runa','Sigrid','Thora','Ylva',
  'Anahita','Darya','Farida','Gulara','Homa','Jaleh','Katira','Laleh','Nasrin','Parisa',
  'Roxana','Shirin','Tahira','Yasmin','Zuleika',
  'Ankhesef','Bakethor','Henutsen','Itet','Khentra','Meritat','Nefris','Sitamon','Tahemet',
  'Althaia','Danae','Elektra','Hypatia','Ione','Kleia','Melantha','Phaedra','Thais','Xanthe',
  'Abeni','Dalila','Eshe','Fayola','Imara','Kamili','Nia','Sade','Zuri',
  'Ai','Chima','Hana','Jia','Lien','Mei','Qian','Suyin','Yue',
];

// Pict names — guttural, savage grunting sounds
const PICT_NAMES = [
  'Grok','Thuk','Brak','Krag','Grung','Thak','Vug','Drak','Skur','Ghar',
  'Murk','Trog','Hurk','Gnash','Skrag','Brug','Krul','Gorsh','Thrug','Vruk',
  'Grall','Druk','Skarn','Ghul','Bruk','Tharg','Krog','Gurk','Snarl','Hruk',
  'Gharr','Thukk','Brakk','Vrug','Krull','Grogg','Dragh','Skarr','Gnarr','Thagg',
];

function pickHyborianName() {
  const isFemale = Math.random() < 0.4;
  const pool = isFemale ? HYBORIAN_NAMES_F : HYBORIAN_NAMES_M;
  return { name: pool[Math.floor(Math.random() * pool.length)], gender: isFemale ? 'f' : 'm' };
}

function pickPictName() {
  return { name: PICT_NAMES[Math.floor(Math.random() * PICT_NAMES.length)], gender: 'm' };
}

// Cultist names — dark cult names from varied Hyborian cultures
const CULTIST_NAMES_M = [
  'Nephren','Vorath','Silas','Kael','Draven','Mordecai','Thalric','Zephon',
  'Ashur','Belthar','Corvane','Dagon','Ezran','Grimald','Hastur','Ithran',
  'Jareth','Korvas','Lazarus','Malachar','Nyxus','Obsidian','Phelan','Ravek',
  'Sethis','Theron','Uriel','Vargoth','Xander','Zarek',
];
const CULTIST_NAMES_F = [
  'Vashti','Naamah','Lilura','Serket','Zara','Morwenna','Thessaly','Ysabel',
  'Astrid','Beleth','Circe','Dahlia','Elspeth','Fenella','Gethane','Hecuba',
  'Isolde','Jezara','Kalindra','Lamia','Morvith','Nyx','Ophira','Perdita',
  'Ravenna','Selune','Tamsyn','Ursula','Vesper','Wren',
];

function pickCultistName() {
  const isFemale = Math.random() < 0.5;
  const pool = isFemale ? CULTIST_NAMES_F : CULTIST_NAMES_M;
  return { name: pool[Math.floor(Math.random() * pool.length)], gender: isFemale ? 'f' : 'm' };
}

// Barbarian names — Norse-flavored, readable at the table
const BARBARIAN_NAMES_M = [
  'Ulfr','Bjorn','Ragnar','Thorvald','Hrafn','Sigurd','Gunnar','Fenrir','Ivar','Kjartan',
  'Leif','Magnus','Styrbjorn','Vidar','Hagen','Torvald','Njord','Rolf','Skjoldr','Erik',
  'Grimr','Bjarni','Haraldr','Thorkel','Asmund','Bragi','Dag','Eystein','Frey','Gorm',
];
const BARBARIAN_NAMES_F = [
  'Brynhild','Freya','Gudrun','Helga','Sigrid','Thora','Yrsa','Astrid','Ingrid','Brunhild',
  'Aud','Svala','Ragna','Hrefna','Solveig','Vigdis','Thyra','Alva','Sif','Dalla',
  'Gerd','Hild','Jorunn','Lagertha','Nanna','Oddny','Saga','Tove','Unn','Ylva',
];

function pickBarbarianName() {
  const isFemale = Math.random() < 0.4;
  const pool = isFemale ? BARBARIAN_NAMES_F : BARBARIAN_NAMES_M;
  return { name: pool[Math.floor(Math.random() * pool.length)], gender: isFemale ? 'f' : 'm' };
}

// Summoner names — fire-themed, male only, ancient Middle Eastern / Stygian feel
const SUMMONER_NAMES = [
  'Azhar','Balaar','Cindar','Dashar','Embrus','Fahren','Ghazir','Hadrak','Ignaar','Jahal',
  'Kashar','Lazik','Moltar','Nazir','Obsidar','Pyreth','Qasim','Rashaan','Sultar','Tephran',
  'Urzak','Vulkaan','Waheed','Xandrak','Yazeed','Zahhak',
  'Ashran','Brimaar','Charral','Dharak','Elazar','Furnaal','Gorshan','Hazrak','Immolar','Jalaar',
];
function pickSummonerName() {
  return { name: SUMMONER_NAMES[Math.floor(Math.random() * SUMMONER_NAMES.length)], gender: 'm' };
}

// Silk Viper names — harem-appropriate, female only, Persian/Arabic/Ottoman
const SILKVIPER_NAMES = [
  'Zahra','Yasmin','Nadira','Farah','Soraya','Layla','Amira','Safiya',
  'Rashida','Zuleika','Nahla','Dalila','Jamila','Samira','Halima','Nasreen',
  'Aziza','Kalila','Nadia','Sabira','Tahira','Rania','Inara','Kamilah',
  'Leila','Miriam','Parisa','Shahla','Yara','Zarina',
];
function pickSilkViperName() {
  return { name: SILKVIPER_NAMES[Math.floor(Math.random() * SILKVIPER_NAMES.length)], gender: 'f' };
}

const THREAT_TIERS = [
  { tier: 0, weight: 40, prefix: '' },         // Normal — 40%
  { tier: 1, weight: 30, prefix: 'Seasoned' }, // 30%
  { tier: 2, weight: 20, prefix: 'Veteran' },  // 20%
  { tier: 3, weight: 10, prefix: 'Elite' }     // 10%
];


const THREAT_NAME_MAP = {
  'guard':         { 0: 'Guard',          1: 'Seasoned Guard',     2: 'Veteran Guard',     3: 'Elite Guard' },
  'veteran-guard': { 0: 'Sergeant',       1: 'Seasoned Sergeant',  2: 'Veteran Sergeant',  3: 'Elite Sergeant' },
  'guard-captain': { 0: 'Guard Captain',  1: 'Seasoned Captain',   2: 'Veteran Captain',   3: 'Elite Captain' },
  'bandit':         { 0: 'Bandit',         1: 'Cunning Bandit',     2: 'Notorious Bandit',  3: 'Dreaded Bandit' },
  'veteran-bandit': { 0: 'Veteran Bandit', 1: 'Cunning Veteran',    2: 'Notorious Veteran', 3: 'Dreaded Veteran' },
  'bandit-leader':  { 0: 'Bandit Leader',  1: 'Cunning Leader',     2: 'Notorious Leader',  3: 'Dreaded Leader' },
  'pict-hunter':    { 0: 'Pict Hunter',    1: 'Blooded Hunter',     2: 'Savage Hunter',     3: 'Dread Hunter' },
  'pict-warrior':   { 0: 'Pict Warrior',   1: 'Blooded Warrior',    2: 'Savage Warrior',    3: 'Dread Warrior' },
  'pict-champion':  { 0: 'Pict Champion',  1: 'Blooded Champion',   2: 'Savage Champion',   3: 'Dread Champion' },
  'cultist-initiate':    { 0: 'Cultist Initiate', 1: 'Devoted Initiate',  2: 'Fanatic Initiate',  3: 'Exalted Initiate' },
  'cultist':             { 0: 'Cultist',          1: 'Devoted Cultist',   2: 'Fanatic Cultist',   3: 'Exalted Cultist' },
  'cultist-high-priest': { 0: 'High Priest',      1: 'Devoted Priest',    2: 'Fanatic Priest',    3: 'Exalted Priest' },
  'pirate':              { 0: 'Pirate',           1: 'Corsair',            2: 'Buccaneer',         3: 'Scourge' },
  'pirate-mate':         { 0: 'Pirate Mate',      1: 'Corsair Mate',       2: 'Buccaneer Mate',    3: 'Scourge Mate' },
  'pirate-captain':      { 0: 'Pirate Captain',   1: 'Corsair Captain',    2: 'Buccaneer Captain',  3: 'Dread Captain' },
  'barbarian-youth':     { 0: 'Barbarian Youth',  1: 'Járn Youth',         2: 'Grimmr Youth',      3: 'Fenris Youth' },
  'barbarian':           { 0: 'Barbarian',        1: 'Járn Barbarian',     2: 'Grimmr Barbarian',   3: 'Fenris Barbarian' },
  'barbarian-chieftain': { 0: 'Barbarian Chieftain', 1: 'Járn Chieftain', 2: 'Grimmr Chieftain',   3: 'Fenris Chieftain' },
  'steppe-rider-youth': { 0: 'Steppe Rider Youth',  1: 'Wind Youth',       2: 'Storm Youth',       3: 'Tempest Youth' },
  'steppe-rider':       { 0: 'Steppe Rider',        1: 'Wind Rider',       2: 'Storm Rider',       3: 'Tempest Rider' },
  'steppe-rider-khan':  { 0: 'Steppe Rider Khan',   1: 'Wind Khan',        2: 'Storm Khan',        3: 'Tempest Khan' },
  'witch':              { 0: 'Witch',               1: 'Hedge Witch',      2: 'Crone',             3: 'Hag' },
  'necromancer':        { 0: 'Necromancer',         1: 'Bone Caller',      2: 'Death Speaker',    3: 'Lich' },
  'summoner':           { 0: 'Torch',               1: 'Pyre',             2: 'Burning One',      3: 'Volcanist' },
  'handmaiden':         { 0: 'Handmaiden',          1: 'Cariye Handmaiden', 2: 'Ikbal Handmaiden', 3: 'Haseki Handmaiden' },
  'bride':              { 0: 'Bride',               1: 'Cariye Bride',     2: 'Ikbal Bride',      3: 'Haseki Bride' },
  'enchantress':        { 0: 'Enchantress',         1: 'Cariye Enchantress', 2: 'Ikbal Enchantress', 3: 'Haseki Enchantress' },
};

function rollThreatTier() {
  const total = THREAT_TIERS.reduce((sum, t) => sum + t.weight, 0);
  let roll = Math.floor(Math.random() * total);
  for (const t of THREAT_TIERS) {
    roll -= t.weight;
    if (roll < 0) return t.tier;
  }
  return 0;
}

function selectTraits(count, pool) {
  if (count <= 0 || !pool?.length) return [];
  const shuffled = [...pool].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count).map(t => t.id);
}

// ============================================================================
// TRAVEL MASTER CONSTANTS
// ============================================================================

const TRAVEL_MODES = {
  foot:  { label: "Foot",         milesPerDay: 18, img: "systems/conan/images/travel_foot.png" },
  mount: { label: "Mount",        milesPerDay: 30, img: "systems/conan/images/travel_mount.png" },
  wagon: { label: "Wagon",        milesPerDay: 15, img: "systems/conan/images/travel_wagon.png" },
  river: { label: "Ship (River)", milesPerDay: 40, img: "systems/conan/images/travel_river.png" },
  sea:   { label: "Ship (Sea)",   milesPerDay: 90, img: "systems/conan/images/travel_sea.png" }
};

const TERRAIN_TYPES = {
  road:      { label: "Road/Flat",    mult: 1.00, img: "systems/conan/images/terrain_road.png" },
  plains:    { label: "Plains",       mult: 0.90, img: "systems/conan/images/terrain_road.png" },
  hills:     { label: "Hills",        mult: 0.75, img: "systems/conan/images/terrain_hills.png" },
  mountains: { label: "Mountains",    mult: 0.55, img: "systems/conan/images/terrain_mountains.png" },
  forest:    { label: "Forest",       mult: 0.70, img: "systems/conan/images/terrain_forest.png" },
  swamp:     { label: "Jungle/Swamp", mult: 0.50, img: "systems/conan/images/terrain_swamp.png" },
  desert:    { label: "Desert",       mult: 0.65, img: "systems/conan/images/terrain_desert.png" }
};

const WEATHER_TYPES = {
  clear: { label: "Clear",      mult: 1.00, img: "systems/conan/images/weather_clear.png" },
  hot:   { label: "Hot",        mult: 0.85, img: "systems/conan/images/weather_hot.png" },
  cold:  { label: "Cold",       mult: 0.85, img: "systems/conan/images/weather_cold.png" },
  rain:  { label: "Heavy Rain", mult: 0.70, img: "systems/conan/images/weather_rain.png" },
  storm: { label: "Storm",      mult: 0.50, img: "systems/conan/images/weather_storm.png" },
  fog:   { label: "Fog",        mult: 0.80, img: "systems/conan/images/weather_fog.png" }
};

const TIMES_OF_DAY = ["Morning", "Day", "Afternoon", "Night"];

const TRAVEL_LOCATIONS = [
  { key: "generic",            label: "Generic Wilderness",  flavor: "untamed lands beyond the reach of kings" },
  { key: "Aquilonia",          label: "Aquilonia",           flavor: "the proud western empire of knights and intrigue" },
  { key: "Nemedia",            label: "Nemedia",             flavor: "a rival realm of scholars, priests, and hard politics" },
  { key: "Brythunia",          label: "Brythunia",           flavor: "a patchwork kingdom of borders, raids, and bitter feuds" },
  { key: "Corinthia",          label: "Corinthia",           flavor: "a hill-kingdom of quarrelsome princes and hidden passes" },
  { key: "Koth",               label: "Koth",                flavor: "a wealthy crossroads of caravans, mercenaries, and courtly knives" },
  { key: "Ophir",              label: "Ophir",               flavor: "a gilded land where coin buys crowns and betrayal" },
  { key: "Argos",              label: "Argos",               flavor: "a sea-power of traders, pirates, and coastal blood-feuds" },
  { key: "Zingara",            label: "Zingara",             flavor: "a romantic coast of duels, intrigue, and swift blades" },
  { key: "Zamora",             label: "Zamora",              flavor: "a city-land of thieves, towers, and midnight silk" },
  { key: "Turan",              label: "Turan",               flavor: "an eastern empire of horsemen, spies, and steel discipline" },
  { key: "Hyrkania",           label: "Hyrkania",            flavor: "endless steppes of hard riders and harder laws" },
  { key: "Hyperborea",         label: "Hyperborea",          flavor: "a grim northern realm of cold cruelty and ancient towers" },
  { key: "Cimmeria",           label: "Cimmeria",            flavor: "misty hills and brooding clans under iron-gray skies" },
  { key: "Nordheim (Asgard)",  label: "Nordheim (Asgard)",   flavor: "wolfish raiders and mead-halls hungry for glory" },
  { key: "Nordheim (Vanaheim)",label: "Nordheim (Vanaheim)", flavor: "ice-bright feuds and axe-law among hard folk" },
  { key: "Shem",               label: "Shem",                flavor: "sunburnt city-states, bowmen, and faiths that demand blood" },
  { key: "Stygia",             label: "Stygia",              flavor: "black temples, old sorcery, and a serpent\u2019s patience" },
  { key: "Kush",               label: "Kush",                flavor: "hot kingdoms of river, spear, and ruthless kings" },
  { key: "Darfar",             label: "Darfar",              flavor: "dark jungles where drums speak and men vanish" },
  { key: "Pictland",           label: "Pictland",            flavor: "shadowed wilderness where arrows come without warning" },
  { key: "Border Kingdom",     label: "Border Kingdom",      flavor: "muddy strongholds and mercenary justice" },
  { key: "Gunderland",         label: "Gunderland",          flavor: "stubborn free folk and longbows that end arguments" },
  { key: "Khitai",             label: "Khitai",              flavor: "far eastern splendor masking cruel secrets" },
  { key: "Vendhya",            label: "Vendhya",             flavor: "elephants, jeweled war, and courts that smile as they poison" },
  { key: "Iranistan",          label: "Iranistan",           flavor: "rugged highlands where blades and vendettas are heirlooms" },
  { key: "Vilayet Sea",        label: "Vilayet Sea",         flavor: "brackish waters of pirates, reed-choked shores, and sudden death" },
  { key: "Black Coast",        label: "Black Coast",         flavor: "pirate shores, jungle rot, and desperate bargains" },
  { key: "Road of Kings",      label: "Road of Kings",       flavor: "packed stone where armies march and bandits dream" },
  { key: "Southern Desert",    label: "Southern Desert",     flavor: "sand, thirst, and merciless horizons" }
];

const ENCOUNTER_TABLES = {
  Threat: [
    { text: "You are being watched. You never catch the watcher\u2014only the feeling of eyes on your back.", stat: "Edge", diff: "D2" },
    { text: "The road ahead tightens into a place where steel would decide everything quickly.", stat: "Grit", diff: "D2" },
    { text: "A distant sign\u2014smoke, movement, a glint\u2014suggests trouble converging on your route.", stat: "Wits", diff: "D1" },
    { text: "You find proof you are not alone: fresh tracks that mirror your pace and choices.", stat: "Wits", diff: "D2" },
    { text: "A message is delivered without words: a shadowed figure, a thrown stone, a warning mark.", stat: "Edge", diff: "D1" },
    { text: "The land itself feels like a trap: too quiet, too open, too perfect for someone waiting.", stat: "Grit", diff: "D2" },
    { text: "A threat tests you\u2014small, cautious, probing\u2014measuring whether you\u2019re prey.", stat: "Edge", diff: "D2" },
    { text: "You arrive at the aftermath of violence still warm. Whoever did it may return\u2026 or is nearby.", stat: "Wits", diff: "D1" },
    { text: "A boundary has been crossed. Whether human, beast, or worse\u2014something claims this ground.", stat: "Grit", diff: "D3" },
    { text: "You realize you\u2019ve been guided: signs and choices funnel you toward an unwanted meeting.", stat: "Wits", diff: "D2" }
  ],
  Hardship: [
    { text: "A river crossing swells and rages. The ford is gone.", stat: "Grit", diff: "D2" },
    { text: "A wagon axle cracks or vital gear fails at the worst moment.", stat: "Wits", diff: "D1" },
    { text: "The trail collapses into mud and bramble. Every mile becomes two.", stat: "Grit", diff: "D1" },
    { text: "Heat or cold presses hard. Water and endurance become precious.", stat: "Grit", diff: "D2" },
    { text: "Sickness spreads\u2014fever, cough, or tainted food.", stat: "Grit", diff: "D2" },
    { text: "Night travel becomes necessary, and the dark presses close.", stat: "Grit", diff: "D2" },
    { text: "A storm forces a choice: shelter and delay, or suffering and speed.", stat: "Grit", diff: "D1" },
    { text: "You lose the trail. Landmarks betray memory.", stat: "Wits", diff: "D2" },
    { text: "Supplies dwindle faster than planned.", stat: "Wits", diff: "D1" },
    { text: "An old wound flares or a fresh injury slows the march.", stat: "Grit", diff: "D1" }
  ],
  Opportunity: [
    { text: "Half-buried ruins break the earth like old bones.", stat: "Wits", diff: "D2" },
    { text: "An abandoned camp lies intact, fire cold and gear scattered.", stat: "Wits", diff: "D1" },
    { text: "A stone shrine stands at a crossroads, offerings still fresh.", stat: "Wits", diff: "D1" },
    { text: "A hidden cache lies wrapped in oilcloth beneath loose stones.", stat: "Wits", diff: "D2" },
    { text: "A high ridge reveals the land ahead with rare clarity.", stat: "Wits", diff: "D1" },
    { text: "A riderless mount wanders with gear intact.", stat: "Edge", diff: "D1" },
    { text: "Clean water and game offer safe rest\u2014if time allows.", stat: "Grit", diff: "D1" },
    { text: "A marker hints at a smuggler\u2019s shortcut.", stat: "Wits", diff: "D2" },
    { text: "A burial cairn shows signs of recent disturbance.", stat: "Wits", diff: "D2" },
    { text: "A strange landmark demands investigation.", stat: "Wits", diff: "D1" }
  ],
  Strangeness: [
    { text: "Fog rolls in thick and wrong, muffling sound and sense.", stat: "Grit", diff: "D2" },
    { text: "Footprints begin in the road\u2014and end abruptly.", stat: "Wits", diff: "D2" },
    { text: "A carved idol hangs from a tree branch where none stood before.", stat: "Wits", diff: "D1" },
    { text: "Voices on the wind speak names they should not know.", stat: "Grit", diff: "D3" },
    { text: "Two travelers wake from the same dream, shaken.", stat: "Grit", diff: "D2" },
    { text: "A dead patch of land swallows sound and warmth.", stat: "Grit", diff: "D2" },
    { text: "A black star burns briefly in daylight.", stat: "Wits", diff: "D2" },
    { text: "Fresh blood stains a weapon no one used.", stat: "Grit", diff: "D2" },
    { text: "A circle of stones holds ash still warm.", stat: "Wits", diff: "D1" },
    { text: "A corpse lies unrotted, eyes open.", stat: "Grit", diff: "D2" }
  ],
  Social: [
    { text: "A wary caravan approaches, guards tense but merchants hopeful.", stat: "Edge", diff: "D1" },
    { text: "A small village appears ahead. Doors close as you near.", stat: "Edge", diff: "D2" },
    { text: "A lone wanderer staggers along the road, muttering warnings.", stat: "Wits", diff: "D1" },
    { text: "Pilgrims beg protection for a sacred bundle.", stat: "Edge", diff: "D2" },
    { text: "A patrol stops you and demands answers.", stat: "Edge", diff: "D2" },
    { text: "A trader offers a deal that smells wrong.", stat: "Wits", diff: "D2" },
    { text: "A loud roadside camp invites you too eagerly.", stat: "Edge", diff: "D2" },
    { text: "Refugees flee something behind you.", stat: "Wits", diff: "D1" },
    { text: "Drunk mercenaries boast and block the road.", stat: "Edge", diff: "D1" },
    { text: "A courier begs escort\u2014lives depend on speed.", stat: "Grit", diff: "D2" }
  ]
};

const ENCOUNTER_COLORS = {
  Threat: "#8B0000",
  Hardship: "#1a1a1a",
  Opportunity: "#166510",
  Strangeness: "#8B008B",
  Social: "#4169E1"
};

const ENCOUNTER_ICONS = {
  Threat: "\uD83D\uDDE1\uFE0F",
  Hardship: "\uD83E\uDDF1",
  Opportunity: "\uD83C\uDFFA",
  Strangeness: "\uD83D\uDD6E",
  Social: "\uD83E\uDDCD"
};

const FORCED_MARCH_MESSAGES = [
  "{{name}} staggers under the relentless pace, legs burning like Stygian fire.",
  "{{name}} falls behind, gasping for breath in the dust of the march.",
  "{{name}} stumbles and clutches their side \u2014 the pace is too cruel.",
  "{{name}}'s strength fails. Even Cimmerian iron has its limits.",
  "{{name}} drops to a knee. The road demands more than they can give."
];

export default class ConanToolsSheet extends ActorSheet {

  // ========== SHEET CONFIG ==========
  static get defaultOptions() {
    return mergeObject(super.defaultOptions, {
      classes: ["conan", "sheet", "actor", "tools"],
      template: "systems/conan/templates/tools-sheet.html",
      width: 700,
      height: 850,
      resizable: true,
      tabs: [],
      dragDrop: [{ dragSelector: ".enemy-token, .area-letter", dropSelector: null }]
    });
  }

  // ========== STATE PRESERVATION ==========
  _scrollTop = 0;
  _activeTab = 'enemies';

  // Enemy data cache
  _enemyData = null;

  // Conditions tab state (session-only, not persisted)
  _selectedTokenId = null;
  _conditionFilter = 'all'; // 'all', 'pc', 'npc'
  _conditionSubtab = 'status'; // 'status', 'buffs', or 'debuffs'

  // Life Points tab state (session-only, not persisted)
  _lpFilter = 'all'; // 'all', 'pc', 'npc'

  // Collapsible sections state - tracks which sections are collapsed
  // Default: flex tab sections collapsed on initial open
  _collapsedSections = new Set(['flex-master', 'flex-players', 'flex-celebrations']);

  // Flex players selection state
  _selectedFlexPlayerId = null;

  // Enemy category expand state - tracks which are OPEN (default is collapsed)
  _enemyCategoryExpanded = new Set();

  // Travel tab state (session-only)
  _travelWaypoints = [];
  _travelLineSpeed = 50;
  _travelZoom = 50;  // Zoom level during travel (10-100, where 100 = closer)
  _travelJourneyStarted = false;
  _travelProgress = 0;
  _travelDrawingId = null;
  _travelAnimating = false;

  // Travel context
  _travelMode = 'foot';
  _travelTerrain = 'road';
  _travelWeather = 'clear';
  _travelTimeOfDay = 'Day';
  _travelLocation = 'generic';
  _travelJourneyName = '';

  // Encounter distance
  _travelDieType = 'd100';
  _travelBonusMiles = false;
  _travelForcedMarch = false;
  _travelEncounterMilesLeft = null;
  _travelEncounterPending = false;

  // Position tracking (miles-based)
  _travelMilesTraveled = 0;
  _travelCurrentLegIndex = 0;
  _travelMilesIntoLeg = 0;
  _travelStopPoint = null;

  // Areas tab state (session-only)
  _areaDefaultSize = 200;  // Default bounding box size in pixels

  // Chat capture state (session-only)
  _chatCaptureListening = false;
  _chatCapturedRolls = [];
  _chatCaptureSelectedIndex = null;
  _chatCaptureHookId = null;

  /** @override */
  async _render(force = false, options = {}) {
    // Save scroll position before render
    const content = this.element.find('.tools-content');
    if (content.length) {
      this._scrollTop = content[0].scrollTop;
    }

    await super._render(force, options);

    // Restore scroll position after render
    const newContent = this.element.find('.tools-content');
    if (newContent.length && this._scrollTop) {
      newContent[0].scrollTop = this._scrollTop;
    }
  }

  // ========== DATA PREPARATION ==========
  async getData() {
    const context = super.getData();
    const actorData = this.actor.toObject(false);
    context.system = actorData.system;

    // Ensure enemy data is loaded before preparing context
    if (!this._enemyData) {
      await this._loadEnemyData();
    }

    // Pass active tab to template so it renders correctly from the start
    context.activeTab = this._activeTab;

    // Pass collapsed sections state to template
    context.isCollapsed = {
      flexMaster: this._collapsedSections.has('flex-master'),
      flexPlayers: this._collapsedSections.has('flex-players'),
      flexCelebrations: this._collapsedSections.has('flex-celebrations')
    };

    // ========== FLEX CELEBRATION PLAYERS DATA ==========
    // Read from world settings (more reliable than actor flags)
    const flexCelebData = game.settings.get('conan', 'flexCelebrations') || {};
    const storedActorIds = Array.isArray(flexCelebData.players) ? flexCelebData.players : [];

    // Also expose the enabled state for the template
    context.flexCelebrationEnabled = flexCelebData.enabled !== false;

    context.flexPlayers = storedActorIds.map(actorId => {
      const actor = game.actors.get(actorId);
      if (!actor || actor.type !== 'character2') return null;
      return {
        id: actorId,
        name: actor.name,
        img: actor.prototypeToken?.texture?.src || actor.img || 'icons/svg/mystery-man.svg',
        selected: actorId === this._selectedFlexPlayerId
      };
    }).filter(Boolean);

    // Selected player's celebrations
    context.selectedFlexPlayer = null;
    context.selectedFlexCelebrations = [];
    if (this._selectedFlexPlayerId) {
      const selectedActor = game.actors.get(this._selectedFlexPlayerId);
      if (selectedActor) {
        context.selectedFlexPlayer = {
          id: this._selectedFlexPlayerId,
          name: selectedActor.name,
          img: selectedActor.prototypeToken?.texture?.src || selectedActor.img || 'icons/svg/mystery-man.svg'
        };

        // Get celebrations for this player from settings
        const celebrations = flexCelebData.celebrations || {};
        const playerCelebs = celebrations[this._selectedFlexPlayerId] || [];

        // Flex type labels for display
        const flexTypeLabels = {
          attack: { label: 'Attack Roll', icon: 'fa-swords' },
          damage: { label: 'Damage Roll', icon: 'fa-burst' },
          skill: { label: 'Skill Check', icon: 'fa-dice-d20' },
          spell: { label: 'Spell Roll', icon: 'fa-wand-sparkles' },
          spellDamage: { label: 'Spell Damage', icon: 'fa-fire' },
          deathSave: { label: 'Death Save', icon: 'fa-skull' }
        };

        context.selectedFlexCelebrations = (Array.isArray(playerCelebs) ? playerCelebs : []).map(celeb => {
          // Check for images in both old format (image1-4) and new format (images array)
          const hasOldImages = !!(celeb.image1 || celeb.image2 || celeb.image3 || celeb.image4);
          const hasNewImages = celeb.images?.some(img => img.path);
          return {
            ...celeb,
            enabled: celeb.enabled !== false, // Default to true if not set
            typeLabel: flexTypeLabels[celeb.type]?.label || celeb.type,
            typeIcon: flexTypeLabels[celeb.type]?.icon || 'fa-star',
            hasImages: hasOldImages || hasNewImages
          };
        });
      }
    }

    // Font family options for chat styler
    context.fontOptions = [
      { value: 'Montserrat', label: 'Montserrat' },
      { value: 'Arial', label: 'Arial' },
      { value: 'Georgia', label: 'Georgia' },
      { value: 'Verdana', label: 'Verdana' },
      { value: 'Times New Roman', label: 'Times New Roman' }
    ];

    // ========== CONDITIONS TAB DATA ==========
    context.conditionFilter = this._conditionFilter;

    // Get tokens from the ACTIVE scene (not necessarily the viewed scene)
    const activeScene = game.scenes.active;
    let sceneTokens = [];

    if (activeScene) {
      const allTokens = activeScene.tokens.contents;

      // Sort: PCs first, then NPCs, alphabetically within each group
      const sortedTokens = allTokens.sort((a, b) => {
        const aIsPC = a.actor?.type === 'character2';
        const bIsPC = b.actor?.type === 'character2';
        if (aIsPC && !bIsPC) return -1;
        if (!aIsPC && bIsPC) return 1;
        return (a.name || '').localeCompare(b.name || '');
      });

      // Filter based on selection
      const filteredTokens = sortedTokens.filter(token => {
        if (!token.actor) return false;
        const actorType = token.actor.type;
        const isPC = actorType === 'character2';
        const isNPC = actorType === 'npc' || actorType === 'npc2';

        if (this._conditionFilter === 'pc') return isPC;
        if (this._conditionFilter === 'npc') return isNPC;
        return isPC || isNPC; // 'all' shows both PCs and NPCs
      });

      // Build token data for display
      sceneTokens = filteredTokens.map(token => {
        const actor = token.actor;
        const canToggle = actor?.type === 'character2' || actor?.type === 'npc2';
        const conditions = actor?.system?.conditions || {};
        const buffsDebuffs = actor?.system?.buffsDebuffs || {};

        // Get active conditions for quick view
        const activeConditions = CONDITIONS.filter(c =>
          conditions[c.key] === true
        ).map(c => ({
          key: c.key,
          name: c.name,
          icon: c.icon,
          type: 'condition'
        }));

        // Get active buffs/debuffs for quick view
        const activeBuffsDebuffs = BUFFS_DEBUFFS.filter(bd =>
          buffsDebuffs[bd.key] === true
        ).map(bd => ({
          key: bd.key,
          name: bd.name,
          icon: bd.icon,
          type: bd.type // 'buff' or 'debuff'
        }));

        // Combine conditions and buffs/debuffs for the token overlay
        const allActiveStatuses = [...activeConditions, ...activeBuffsDebuffs];

        return {
          tokenId: token.id,
          actorId: actor?.id,
          name: token.name,
          img: token.texture?.src || actor?.img || 'icons/svg/mystery-man.svg',
          selected: token.id === this._selectedTokenId,
          canToggle: canToggle,
          activeConditionCount: allActiveStatuses.length,
          activeConditions: allActiveStatuses.slice(0, 10) // Show max 10 in clock layout
        };
      });
    }

    context.sceneTokens = sceneTokens;

    // Get selected token's data
    context.selectedTokenId = this._selectedTokenId;
    context.selectedTokenName = null;
    context.conditions = [];
    context.buffs = [];
    context.debuffs = [];
    context.conditionSubtab = this._conditionSubtab;

    if (this._selectedTokenId && activeScene) {
      const selectedToken = activeScene.tokens.get(this._selectedTokenId);
      if (selectedToken?.actor) {
        const actor = selectedToken.actor;
        context.selectedTokenName = selectedToken.name;

        // Build conditions list with current state
        const actorConditions = actor.system?.conditions || {};
        context.conditions = CONDITIONS.map(cond => ({
          key: cond.key,
          name: cond.name,
          icon: cond.icon,
          color: cond.color,
          active: actorConditions[cond.key] === true,
          displayOnly: cond.displayOnly || false
        }));

        // Build buffs/debuffs lists with current state (separate arrays)
        const actorBuffsDebuffs = actor.system?.buffsDebuffs || {};
        const allBuffsDebuffs = BUFFS_DEBUFFS.map(bd => ({
          key: bd.key,
          name: bd.name,
          icon: bd.icon,
          color: bd.color,
          type: bd.type,
          source: bd.source,
          active: actorBuffsDebuffs[bd.key] === true
        }));
        context.buffs = allBuffsDebuffs.filter(bd => bd.type === 'buff');
        context.debuffs = allBuffsDebuffs.filter(bd => bd.type === 'debuff');
      }
    }

    // ========== LIFE POINTS TAB DATA ==========
    context.lpFilter = this._lpFilter;

    // Get tokens for LP management from the ACTIVE scene
    let lpTokens = [];

    if (activeScene) {
      const allTokens = activeScene.tokens.contents;

      // Sort: PCs first, then NPCs, alphabetically within each group
      const sortedTokens = allTokens.sort((a, b) => {
        const aIsPC = a.actor?.type === 'character2';
        const bIsPC = b.actor?.type === 'character2';
        if (aIsPC && !bIsPC) return -1;
        if (!aIsPC && bIsPC) return 1;
        return (a.name || '').localeCompare(b.name || '');
      });

      // Filter based on selection
      const filteredTokens = sortedTokens.filter(token => {
        if (!token.actor) return false;
        const actorType = token.actor.type;
        const isPC = actorType === 'character2';
        const isNPC = actorType === 'npc' || actorType === 'npc2';

        // Only include actors that have lifePoints
        const hasLP = token.actor.system?.lifePoints !== undefined;
        if (!hasLP) return false;

        if (this._lpFilter === 'pc') return isPC;
        if (this._lpFilter === 'npc') return isNPC;
        return isPC || isNPC; // 'all' shows both PCs and NPCs
      });

      // Build token data for display
      lpTokens = filteredTokens.map(token => {
        const actor = token.actor;
        const lp = actor.system?.lifePoints || { value: 0, max: 0 };
        const lpPercent = lp.max > 0 ? Math.max(0, Math.min(100, (lp.value / lp.max) * 100)) : 0;

        return {
          tokenId: token.id,
          actorId: actor?.id,
          name: token.name,
          img: token.texture?.src || actor?.img || 'icons/svg/mystery-man.svg',
          lp: lp,
          lpPercent: lpPercent
        };
      });
    }

    context.lpTokens = lpTokens;

    // ========== ENEMIES TAB DATA ==========
    context.enemyCategories = this._prepareEnemyData();

    // ========== TRAVEL TAB DATA ==========
    // Get scene grid settings for distance calculations
    const scene = canvas?.scene;
    const gridSize = scene?.grid?.size || 100;  // pixels per grid
    const gridDistance = scene?.grid?.distance || 5;  // units per grid
    const gridUnits = scene?.grid?.units || "ft";  // unit label
    const pixelsPerUnit = gridSize / gridDistance;  // pixels per 1 unit

    // Add 1-indexed number and distance calculations to each waypoint
    let totalDistance = 0;
    const rawWaypoints = this._travelWaypoints || [];
    const currentProgress = this._travelProgress || 0;
    const waypointCount = rawWaypoints.length;

    // First pass: calculate distances
    const distanceAtWaypoint = [0];  // Distance at each waypoint
    for (let i = 1; i < waypointCount; i++) {
      const prev = rawWaypoints[i - 1];
      const curr = rawWaypoints[i];
      const dx = curr.x - prev.x;
      const dy = curr.y - prev.y;
      const pixelDist = Math.sqrt(dx * dx + dy * dy);
      const legDist = pixelDist / pixelsPerUnit;
      totalDistance += legDist;
      distanceAtWaypoint.push(totalDistance);
    }

    // Calculate traveled distance based on miles tracking (not just waypoint index)
    const milesTraveled = Math.round(this._travelMilesTraveled || 0);
    const totalDistanceRounded = Math.round(totalDistance);
    const progressPercent = totalDistanceRounded > 0 ? Math.round((milesTraveled / totalDistanceRounded) * 100) : 0;

    // Second pass: build waypoint objects
    const currentLegIdx = this._travelCurrentLegIndex || 0;
    const waypoints = rawWaypoints.map((wp, idx) => {
      const legDistance = idx > 0 ? Math.round(distanceAtWaypoint[idx] - distanceAtWaypoint[idx - 1]) : 0;
      return {
        ...wp,
        number: idx + 1,
        index: idx,
        legDistance: legDistance,
        totalAtPoint: Math.round(distanceAtWaypoint[idx]),
        isFirst: idx === 0,
        isLast: idx === waypointCount - 1,
        visited: idx <= currentLegIdx
      };
    });

    // Build constant arrays with keys for Handlebars iteration
    const modesArray = Object.entries(TRAVEL_MODES).map(([key, v]) => ({ key, ...v }));
    const terrainsArray = Object.entries(TERRAIN_TYPES).map(([key, v]) => ({ key, ...v }));
    const weathersArray = Object.entries(WEATHER_TYPES).map(([key, v]) => ({ key, ...v }));

    // Build saved journeys list
    let savedJourneysList = [];
    try {
      const saved = game.settings.get('conan', 'savedJourneys') || {};
      savedJourneysList = Object.entries(saved).map(([slug, data]) => ({ slug, name: data.name || slug }));
    } catch(e) { /* settings not registered yet */ }

    context.travel = {
      waypoints: waypoints,
      lineSpeed: this._travelLineSpeed || 50,
      travelZoom: this._travelZoom || 50,
      journeyStarted: this._travelJourneyStarted || false,
      progress: currentProgress,
      canStart: waypoints.length >= 2,
      totalDistance: totalDistanceRounded,
      traveledDistance: milesTraveled,
      progressPercent: progressPercent,
      units: gridUnits,
      // Travel context
      mode: this._travelMode || 'foot',
      terrain: this._travelTerrain || 'road',
      weather: this._travelWeather || 'clear',
      timeOfDay: this._travelTimeOfDay || 'Day',
      location: this._travelLocation || 'generic',
      journeyName: this._travelJourneyName || '',
      // Encounter settings
      dieType: this._travelDieType || 'd100',
      bonusMiles: this._travelBonusMiles || false,
      forcedMarch: this._travelForcedMarch || false,
      encounterMilesLeft: this._travelEncounterMilesLeft,
      encounterPending: this._travelEncounterPending || false,
      milesTraveled: milesTraveled,
      effectiveMPD: this._getEffectiveMilesPerDay(),
      currentDay: this._getCurrentDay(),
      // Constants for template iteration
      modes: modesArray,
      terrains: terrainsArray,
      weathers: weathersArray,
      times: TIMES_OF_DAY,
      locations: TRAVEL_LOCATIONS,
      savedJourneys: savedJourneysList,
      // Leg distances for encounter calculations
      _distanceAtWaypoint: distanceAtWaypoint,
      _pixelsPerUnit: pixelsPerUnit
    };

    // ===== CHAT CAPTURE DATA =====
    context.chatCapture = {
      listening: this._chatCaptureListening,
      rolls: this._chatCapturedRolls.map((roll, index) => ({
        ...roll,
        selected: index === this._chatCaptureSelectedIndex
      })),
      selectedRoll: this._chatCaptureSelectedIndex !== null
        ? this._chatCapturedRolls[this._chatCaptureSelectedIndex]
        : null
    };

    return context;
  }

  // ========== ENEMY DATA PREPARATION ==========
  _prepareEnemyData() {
    // Data should already be loaded by getData()
    if (!this._enemyData || !this._enemyData.categories) {
      return [];
    }

    // Load group background settings
    const groupBackgrounds = game.settings.get('conan', 'enemyGroupBackgrounds') || {};

    // Transform categories into array for template
    const categories = [];
    for (const [categoryKey, categoryData] of Object.entries(this._enemyData.categories)) {
      const groups = [];
      let enemyCount = 0;

      // Get theme for this category
      const theme = CATEGORY_THEMES[categoryKey] || CATEGORY_THEMES.unknown;

      for (const [groupKey, groupData] of Object.entries(categoryData.groups || {})) {
        // Get background image for this group
        const bgKey = `${categoryKey}.${groupKey}`;
        const groupBackground = groupBackgrounds[bgKey] || '';

        const enemies = (groupData.enemies || []).map(enemy => ({
          ...enemy,
          category: categoryKey, // Include category for theming
          theme: theme, // Include theme colors for template
          groupBackground: groupBackground // Include group background for card styling
        }));
        enemyCount += enemies.length;

        groups.push({
          key: groupKey,
          name: groupData.name,
          description: groupData.description,
          enemies: enemies
        });
      }

      categories.push({
        key: categoryKey,
        name: categoryData.name,
        icon: categoryData.icon || 'fa-skull',
        description: categoryData.description,
        collapsed: !this._enemyCategoryExpanded.has(`enemy-${categoryKey}`),
        enemyCount: enemyCount,
        groups: groups,
        theme: theme // Include theme for category header styling
      });
    }

    return categories;
  }

  async _loadEnemyData() {
    try {
      const response = await fetch('systems/conan/data/enemies.json');
      if (response.ok) {
        this._enemyData = await response.json();
        console.log('Conan | Loaded enemy data:', Object.keys(this._enemyData.categories || {}).length, 'categories');

        // Integrate custom enemies from settings (must run BEFORE applying images,
        // so custom enemies are in the data structure when images are applied)
        this._integrateCustomEnemies();

        // Apply custom images from settings (covers both base and custom enemies)
        this._applyCustomEnemyImages();
      } else {
        console.warn('Conan | Failed to load enemies.json:', response.status);
        this._enemyData = { categories: {} };
        // Still try to load custom enemies even if base data fails
        this._integrateCustomEnemies();
      }
    } catch (error) {
      console.error('Conan | Error loading enemies.json:', error);
      this._enemyData = { categories: {} };
      // Still try to load custom enemies even if base data fails
      this._integrateCustomEnemies();
    }
  }

  /**
   * Integrate custom enemies from world settings into the enemy data
   * Adds them directly to the first group in their category (no separate "Custom" section)
   */
  _integrateCustomEnemies() {
    const customEnemies = game.settings.get('conan', 'customEnemies') || [];
    if (customEnemies.length === 0) return;

    // Ensure categories object exists
    if (!this._enemyData) this._enemyData = {};
    if (!this._enemyData.categories) this._enemyData.categories = {};

    // Category defaults - keys match enemies.json category keys
    const categoryDefaults = {
      human: { name: "Human", icon: "fa-user", description: "Human enemies" },
      beasts: { name: "Beasts", icon: "fa-paw", description: "Beast enemies" },
      undead: { name: "Undead", icon: "fa-skull", description: "Undead enemies" },
      demons: { name: "Demons", icon: "fa-fire", description: "Demonic enemies" },
      monstrosity: { name: "Monstrosity", icon: "fa-dragon", description: "Monstrous enemies" },
      inanimate: { name: "Inanimate", icon: "fa-cube", description: "Inanimate threats" },
      originBeast: { name: "Origin Beasts", icon: "fa-paw", description: "Origin beast forms" },
      unknown: { name: "Unknown", icon: "fa-question", description: "Unknown entities" }
    };

    // Add each custom enemy to its category
    for (const enemy of customEnemies) {
      const categoryKey = enemy.category || 'unknown';

      // Ensure category exists
      if (!this._enemyData.categories[categoryKey]) {
        const defaults = categoryDefaults[categoryKey] || categoryDefaults.unknown;
        this._enemyData.categories[categoryKey] = {
          name: defaults.name,
          icon: defaults.icon,
          description: defaults.description,
          groups: {}
        };
      }

      const category = this._enemyData.categories[categoryKey];
      const groupKeys = Object.keys(category.groups || {});
      let targetGroupKey = null;

      // Try to match subtype to an existing group
      if (enemy.subtype && groupKeys.length > 0) {
        const subtypeLower = enemy.subtype.toLowerCase();

        // Try to find a matching group by key or name
        for (const groupKey of groupKeys) {
          const group = category.groups[groupKey];
          const groupKeyLower = groupKey.toLowerCase();
          const groupNameLower = (group.name || '').toLowerCase();

          // Match: "Guard" -> "guards", "Bandit" -> "bandits", etc.
          if (groupKeyLower === subtypeLower ||
              groupKeyLower === subtypeLower + 's' ||
              groupKeyLower.startsWith(subtypeLower) ||
              groupNameLower === subtypeLower ||
              groupNameLower === subtypeLower + 's' ||
              groupNameLower.startsWith(subtypeLower)) {
            targetGroupKey = groupKey;
            break;
          }
        }
      }

      // Fall back to first group if no match found
      if (!targetGroupKey) {
        if (groupKeys.length > 0) {
          targetGroupKey = groupKeys[0];
        } else {
          // Create a default group if none exist
          targetGroupKey = 'default';
          category.groups[targetGroupKey] = {
            name: category.name,
            description: `${category.name} enemies`,
            enemies: []
          };
        }
      }

      // Add the custom enemy to the group
      if (!category.groups[targetGroupKey].enemies) {
        category.groups[targetGroupKey].enemies = [];
      }
      category.groups[targetGroupKey].enemies.push({
        ...enemy,
        isCustom: true // Flag for edit/delete buttons
      });
    }

    console.log('Conan | Integrated', customEnemies.length, 'custom enemies');
  }

  _applyCustomEnemyImages() {
    const customImages = game.settings.get('conan', 'enemyCustomImages') || {};

    // Apply custom images to enemy data
    for (const [categoryKey, categoryData] of Object.entries(this._enemyData.categories || {})) {
      for (const [groupKey, groupData] of Object.entries(categoryData.groups || {})) {
        for (const enemy of (groupData.enemies || [])) {
          const key = `${categoryKey}.${groupKey}.${enemy.id}`;
          if (customImages[key]) {
            if (customImages[key].portraitImg) {
              enemy.portraitImg = customImages[key].portraitImg;
            }
            if (customImages[key].tokenImg) {
              enemy.tokenImg = customImages[key].tokenImg;
            }
          }
        }
      }
    }
  }

  async _saveEnemyCustomImage(categoryKey, groupKey, enemyId, portraitImg, tokenImg) {
    const customImages = game.settings.get('conan', 'enemyCustomImages') || {};
    const key = `${categoryKey}.${groupKey}.${enemyId}`;

    customImages[key] = {
      portraitImg: portraitImg,
      tokenImg: tokenImg
    };

    await game.settings.set('conan', 'enemyCustomImages', customImages);
    console.log('Conan | Saved custom images for', key);
  }

  // ========== LISTENERS ==========
  activateListeners(html) {
    super.activateListeners(html);

    // Tab navigation
    html.find('.tools-tab').click(this._onTabClick.bind(this));

    // Toggle switches
    html.find('.tools-toggle').click(this._onToggleClick.bind(this));

    // Form inputs
    html.find('.tools-input, .tools-select').change(this._onInputChange.bind(this));

    // Winds of Fate button
    html.find('.winds-of-fate-btn').click(this._onWindsOfFateClick.bind(this));

    // Collapsible sections
    html.find('.tools-section[data-collapsible] .tools-section-title').click(this._onSectionToggle.bind(this));

    // ========== CONDITIONS TAB LISTENERS ==========
    // Token selection
    html.find('.cond-token-btn').click(this._onSelectToken.bind(this));

    // Condition filter
    html.find('input[name="tokenFilter"]').change(this._onFilterChange.bind(this));

    // Condition subtab switching
    html.find('.cond-subtab').click(this._onConditionSubtabChange.bind(this));

    // Condition toggle (status conditions only)
    html.find('.cond-btn:not(.display-only):not(.buff-btn)').click(this._onToggleCondition.bind(this));

    // Buff/Debuff toggle
    html.find('.buff-btn').click(this._onToggleBuffDebuff.bind(this));

    // Refresh tokens button
    html.find('.refresh-tokens-btn').click(this._onRefreshTokens.bind(this));

    // Colorize NPCs button
    html.find('.colorize-npcs-btn').click(this._onColorizeNPCs.bind(this));

    // ========== LIFE POINTS TAB LISTENERS ==========
    // LP filter
    html.find('input[name="lpTokenFilter"]').change(this._onLPFilterChange.bind(this));

    // LP control buttons
    html.find('.lp-btn[data-delta]').click(this._onLPDelta.bind(this));
    html.find('.lp-input').change(this._onLPInputChange.bind(this));

    // Refresh LP tokens button
    html.find('.refresh-lp-btn').click(this._onRefreshLPTokens.bind(this));

    // ========== ENEMIES TAB LISTENERS ==========
    // Note: Drag is handled by Foundry's DragDrop via _onDragStart override
    html.find('.enemy-token').on('dragend', this._onEnemyDragEnd.bind(this));
    // Click on token opens roll dialog (single click, not drag)
    html.find('.enemy-token').on('click', this._onEnemyTokenClick.bind(this));

    // Expand/collapse stats panel
    html.find('.enemy-expand-btn').click(this._onEnemyExpandClick.bind(this));

    // View full details button (inside the stats panel)
    html.find('.enemy-details-btn').click(this._onEnemyDetailsClick.bind(this));

    // Settings button (portrait + token images)
    html.find('.enemy-settings-btn').click(this._onEnemySettingsClick.bind(this));

    // Group settings button (background image)
    html.find('.enemy-group-settings-btn').click(this._onGroupSettingsClick.bind(this));

    // Edit custom enemy button
    html.find('.enemy-edit-btn').click(this._onEnemyEditClick.bind(this));

    // Delete custom enemy button
    html.find('.enemy-delete-btn').click(this._onEnemyDeleteClick.bind(this));

    // Add enemy button
    html.find('.add-enemy-btn').click(this._onAddEnemy.bind(this));

    // Enemy category collapse (using the same section toggle)
    html.find('.enemy-category-section .tools-section-title').click(this._onEnemyCategoryToggle.bind(this));

    // ========== FLEX CELEBRATION TAB LISTENERS ==========
    // Player badge selection
    html.find('.flex-player-badge').click(this._onFlexPlayerSelect.bind(this));

    // Add/remove player buttons
    html.find('.add-player-btn').click(this._onAddFlexPlayer.bind(this));
    html.find('.remove-player-btn').click(this._onRemoveFlexPlayer.bind(this));
    html.find('.edit-celebration-btn').click(this._onEditCelebration.bind(this));

    // Celebration badge toggle - enable/disable
    html.find('.flex-celeb-badge-toggle').click(this._onCelebrationToggle.bind(this));

    // Celebration badge play button - quick play
    html.find('.flex-celeb-badge-play').click(this._onCelebrationPlay.bind(this));

    // Celebration badge click - opens programming window
    html.find('.flex-celeb-badge').click(this._onCelebrationBadgeClick.bind(this));

    // ========== CHAT CAPTURE TAB LISTENERS ==========
    html.find('.chat-capture-toggle').click(this._onChatCaptureToggle.bind(this));
    html.find('.chat-capture-clear').click(this._onChatCaptureClear.bind(this));
    html.find('.chat-capture-item').click(this._onChatCaptureSelect.bind(this));
    html.find('.chat-capture-export').click(this._onChatCaptureExport.bind(this));

    // ========== TRAVEL TAB LISTENERS ==========
    // Add waypoint button - enters placement mode
    html.find('.travel-add-waypoint-btn').click(this._onTravelAddWaypoint.bind(this));

    // Clear all waypoints
    html.find('.travel-clear-waypoints-btn').click(this._onTravelClearWaypoints.bind(this));

    // Remove individual waypoint
    html.find('.travel-remove-waypoint-btn').click(this._onTravelRemoveWaypoint.bind(this));

    // Reposition waypoint on map
    html.find('.travel-reposition-btn').click(this._onTravelRepositionWaypoint.bind(this));

    // Waypoint name change
    html.find('.travel-waypoint-name').on('change', this._onTravelWaypointNameChange.bind(this));

    // Speed slider
    html.find('.travel-speed-slider').on('input', this._onTravelSpeedChange.bind(this));

    // Zoom slider
    html.find('.travel-zoom-slider').on('input', this._onTravelZoomChange.bind(this));

    // Journey controls
    html.find('.travel-start-btn').click(this._onTravelStart.bind(this));
    html.find('.travel-btn').click(this._onTravelAdvance.bind(this));
    html.find('.travel-reset-btn').click(this._onTravelReset.bind(this));

    // Travel context selectors
    html.find('.travel-mode-tile').click(this._onTravelModeSelect.bind(this));
    html.find('.travel-terrain-tile').click(this._onTravelTerrainSelect.bind(this));
    html.find('.travel-weather-tile').click(this._onTravelWeatherSelect.bind(this));
    html.find('.travel-time-btn').click(this._onTravelTimeSelect.bind(this));
    html.find('.travel-location-select').on('change', this._onTravelLocationChange.bind(this));
    html.find('.travel-journey-name-input').on('change', (e) => { this._travelJourneyName = e.currentTarget.value.trim(); });

    // Encounter settings
    html.find('.travel-die-toggle').click(this._onTravelDieToggle.bind(this));
    html.find('.travel-bonus-toggle').click(this._onTravelBonusToggle.bind(this));
    html.find('.travel-forced-march-toggle').click(this._onForcedMarchToggle.bind(this));

    // Encounter picker
    html.find('.travel-enc-btn').click(this._onEncounterCategoryPick.bind(this));

    // Persistence
    html.find('.travel-save-btn').click(this._onTravelSave.bind(this));
    html.find('.travel-load-btn').click(this._onTravelLoad.bind(this));
    html.find('.travel-delete-btn').click(this._onTravelDelete.bind(this));

    // ========== AREAS TAB LISTENERS ==========
    this._renderAreaPalette(html);
    this._renderAreaMatrix(html);
    this._renderAreaSettings(html);
    // Bind dragstart manually — elements are created after Foundry's DragDrop init
    html.find('.area-letter').on('dragstart', this._onDragStart.bind(this));
    html.find('.area-torch-btn').click(this._onTorchDialogOpen.bind(this));
    html.find('.area-connect-btn').click(this._onAreaConnect.bind(this));
    html.find('.area-clear-lines-btn').click(this._onAreaClearLines.bind(this));
    html.find('.area-reset-btn').click(this._onAreaReset.bind(this));
    html.find('.area-lock-btn').click(this._onAreaLockToggle.bind(this));
    // Update lock button state from scene flag
    this._updateAreaLockButton(html);
  }

  // ========== TAB HANDLING ==========
  _onTabClick(event) {
    event.preventDefault();
    const tabId = event.currentTarget.dataset.tab;
    this._activeTab = tabId;  // Update state immediately so it persists through re-renders
    this._activateTab(this.element, tabId);
  }

  _activateTab(html, tabId) {
    html.find('.tools-tab').removeClass('active');
    html.find(`.tools-tab[data-tab="${tabId}"]`).addClass('active');
    html.find('.tools-panel').removeClass('active');
    html.find(`.tools-panel[data-panel="${tabId}"]`).addClass('active');
  }

  // ========== WINDS OF FATE ==========
  _onWindsOfFateClick(event) {
    event.preventDefault();
    // Open the Winds of Fate floating dialog
    WindsOfFateDialog.show();
  }

  // ========== COLLAPSIBLE SECTION HANDLING ==========
  _onSectionToggle(event) {
    event.preventDefault();
    event.stopPropagation();
    const section = $(event.currentTarget).closest('.tools-section');
    const sectionId = section.data('sectionId');

    // Track collapsed state by section ID
    if (sectionId) {
      if (this._collapsedSections.has(sectionId)) {
        this._collapsedSections.delete(sectionId);
      } else {
        this._collapsedSections.add(sectionId);
      }
    }

    // Toggle visual state immediately (no re-render needed for collapse)
    section.toggleClass('collapsed');
  }

  // ========== TOGGLE HANDLING ==========
  async _onToggleClick(event) {
    event.preventDefault();
    event.stopPropagation();
    const toggle = event.currentTarget;
    const field = toggle.dataset.field;
    if (!field) return;

    // Check if this toggle uses world settings instead of system data
    const useFlag = toggle.dataset.useFlag === 'true';

    if (useFlag && field === 'flexCelebration.enabled') {
      // Handle flexCelebration.enabled toggle using world settings
      const flexCeleb = game.settings.get('conan', 'flexCelebrations') || {};
      const newEnabled = !flexCeleb.enabled;

      await game.settings.set('conan', 'flexCelebrations', {
        ...flexCeleb,
        enabled: newEnabled
      });

      console.log('Conan | Toggled flex celebrations:', newEnabled ? 'enabled' : 'disabled');
      this.render(false); // Re-render to update UI
    } else {
      // Default behavior for system data
      const currentValue = foundry.utils.getProperty(this.actor.system, field);
      await this.actor.update({
        [`system.${field}`]: !currentValue
      });
    }
  }

  // ========== INPUT HANDLING ==========
  async _onInputChange(event) {
    const input = event.currentTarget;
    const field = input.dataset.field;
    let value = input.value;

    if (input.type === 'number') {
      value = parseFloat(value) || 0;
    }

    await this.actor.update({
      [`system.${field}`]: value
    });
  }

  // ========== CONDITIONS TAB HANDLERS ==========
  _onSelectToken(event) {
    event.preventDefault();
    const tokenId = event.currentTarget.dataset.tokenId;
    this._selectedTokenId = tokenId;
    this.render(false); // Re-render without full refresh
  }

  _onFilterChange(event) {
    this._conditionFilter = event.currentTarget.value;
    this.render(false);
  }

  _onRefreshTokens(event) {
    event.preventDefault();
    this.render(false);
  }

  /**
   * Assign colored emoji markers to all NPC tokens in the scene
   */
  async _onColorizeNPCs(event) {
    event.preventDefault();

    const activeScene = game.scenes.active;
    if (!activeScene) {
      ui.notifications.warn("No active scene.");
      return;
    }

    // Color emoji markers (matching the user's macro)
    const colorMarkers = ['🔴', '🔵', '🟢', '🟡', '🟣', '🟠', '🟤', '⚫', '⚪', '🩷'];

    // Regex to strip existing markers from names
    const markerRegex = / [🔴🔵🟢🟡🟣🟠🟤⚫⚪🩷🟥🟦🟩🟨🟪🟧🟫⬛⬜]+$/;

    // Get only enemy tokens placed from GM Tools (they have the enemyData flag)
    const enemyTokens = activeScene.tokens.filter(t => {
      return t.getFlag('conan', 'enemyData');
    });

    if (enemyTokens.length === 0) {
      ui.notifications.info("No enemy tokens found in the scene.");
      return;
    }

    // Sort by name (strip existing markers first for proper sorting)
    enemyTokens.sort((a, b) => {
      const nameA = a.name.replace(markerRegex, '').trim();
      const nameB = b.name.replace(markerRegex, '').trim();
      return nameA.localeCompare(nameB);
    });

    // Assign colors in order
    let colorIndex = 0;
    for (const token of enemyTokens) {
      // Strip any existing marker from the name
      const baseName = token.name.replace(markerRegex, '').trim();
      const newName = `${baseName} ${colorMarkers[colorIndex]}`;

      await token.update({ name: newName });

      // Cycle to next color
      colorIndex = (colorIndex + 1) % colorMarkers.length;
    }

    this.render(false);
  }

  async _onToggleCondition(event) {
    event.preventDefault();
    const conditionKey = event.currentTarget.dataset.condition;
    if (!conditionKey || !this._selectedTokenId) return;

    const activeScene = game.scenes.active;
    if (!activeScene) return;

    const token = activeScene.tokens.get(this._selectedTokenId);
    if (!token?.actor) return;

    const actor = token.actor;

    // Check if actor supports conditions
    if (actor.type !== 'character2' && actor.type !== 'npc2') {
      ui.notifications.warn("This token's actor type doesn't support conditions.");
      return;
    }

    // Get current state and toggle
    const currentState = actor.system.conditions?.[conditionKey] || false;
    const newState = !currentState;

    // Update the actor
    await actor.update({ [`system.conditions.${conditionKey}`]: newState });

    // Get condition info for chat message
    const conditionInfo = CONDITIONS.find(c => c.key === conditionKey);
    const message = CONDITION_MESSAGES[conditionKey];

    if (conditionInfo && message) {
      const action = newState ? message.on : message.off;

      // Send chat message
      ChatMessage.create({
        content: `<div style="display: flex; align-items: center; gap: 10px;">
          <img src="${conditionInfo.icon}" style="width: 32px; height: 32px; border: none;"/>
          <span><strong>${actor.name}</strong> ${action}!</span>
        </div>`,
        speaker: { alias: "Condition" }
      });
    }

    // Show notification
    ui.notifications.info(`${conditionInfo?.name || conditionKey} ${newState ? 'applied to' : 'removed from'} ${actor.name}`);

    // Re-render to update display
    this.render(false);
  }

  _onConditionSubtabChange(event) {
    event.preventDefault();
    const subtab = event.currentTarget.dataset.subtab;
    if (subtab && subtab !== this._conditionSubtab) {
      this._conditionSubtab = subtab;
      this.render(false);
    }
  }

  async _onToggleBuffDebuff(event) {
    event.preventDefault();
    const buffDebuffKey = event.currentTarget.dataset.buffDebuff;
    if (!buffDebuffKey || !this._selectedTokenId) return;

    const activeScene = game.scenes.active;
    if (!activeScene) return;

    const token = activeScene.tokens.get(this._selectedTokenId);
    if (!token?.actor) return;

    const actor = token.actor;

    // Check if actor supports buffs/debuffs
    if (actor.type !== 'character2' && actor.type !== 'npc2') {
      ui.notifications.warn("This token's actor type doesn't support buffs/debuffs.");
      return;
    }

    // Get current state and toggle
    const currentState = actor.system.buffsDebuffs?.[buffDebuffKey] || false;
    const newState = !currentState;

    // Update the actor
    await actor.update({ [`system.buffsDebuffs.${buffDebuffKey}`]: newState });

    // Get buff/debuff info for chat message
    const bdInfo = BUFFS_DEBUFFS.find(bd => bd.key === buffDebuffKey);
    const message = BUFF_DEBUFF_MESSAGES[buffDebuffKey];

    if (bdInfo && message) {
      const action = newState ? message.on : message.off;
      const bgColor = bdInfo.type === 'buff' ? 'rgba(34, 139, 34, 0.2)' : 'rgba(139, 0, 0, 0.2)';
      const borderColor = bdInfo.type === 'buff' ? '#228B22' : '#8B0000';

      // Send chat message
      ChatMessage.create({
        content: `<div style="display: flex; align-items: center; gap: 10px; padding: 6px; background: ${bgColor}; border-left: 3px solid ${borderColor}; border-radius: 4px;">
          <img src="${bdInfo.icon}" style="width: 32px; height: 32px; border: none;" onerror="this.src='systems/conan/images/icons/placeholder_icon.png'"/>
          <span><strong>${actor.name}</strong> ${action}!</span>
        </div>`,
        speaker: { alias: bdInfo.type === 'buff' ? "Buff" : "Debuff" }
      });
    }

    // Show notification
    const typeLabel = bdInfo?.type === 'buff' ? 'Buff' : 'Debuff';
    ui.notifications.info(`${typeLabel}: ${bdInfo?.name || buffDebuffKey} ${newState ? 'applied to' : 'removed from'} ${actor.name}`);

    // Re-render to update display
    this.render(false);
  }

  // ========== LIFE POINTS TAB HANDLERS ==========
  _onLPFilterChange(event) {
    this._lpFilter = event.currentTarget.value;
    this.render(false);
  }

  _onRefreshLPTokens(event) {
    event.preventDefault();
    this.render(false);
  }

  async _onLPDelta(event) {
    event.preventDefault();
    const button = event.currentTarget;
    const delta = parseInt(button.dataset.delta) || 0;
    const badge = button.closest('.lp-token-badge');
    const tokenId = badge?.dataset.tokenId;

    if (!tokenId || delta === 0) return;

    const activeScene = game.scenes.active;
    if (!activeScene) return;

    const token = activeScene.tokens.get(tokenId);
    if (!token?.actor) return;

    const actor = token.actor;
    const currentLP = actor.system?.lifePoints?.value ?? 0;
    const maxLP = actor.system?.lifePoints?.max ?? 0;
    const newLP = Math.max(0, Math.min(maxLP, currentLP + delta));

    // Update via the actor (works for both linked and unlinked tokens)
    // For unlinked tokens, token.actor is a synthetic actor that updates the token
    await actor.update({ 'system.lifePoints.value': newLP });

    // Show notification
    const changeText = delta > 0 ? `+${delta}` : `${delta}`;
    ui.notifications.info(`${actor.name}: LP ${changeText} (${newLP}/${maxLP})`);

    this.render(false);
  }

  async _onLPInputChange(event) {
    const input = event.currentTarget;
    const badge = input.closest('.lp-token-badge');
    const tokenId = badge?.dataset.tokenId;

    if (!tokenId) return;

    const activeScene = game.scenes.active;
    if (!activeScene) return;

    const token = activeScene.tokens.get(tokenId);
    if (!token?.actor) return;

    const actor = token.actor;
    const maxLP = actor.system?.lifePoints?.max ?? 0;
    const newLP = Math.max(0, Math.min(maxLP, parseInt(input.value) || 0));

    // Update via the actor (works for both linked and unlinked tokens)
    await actor.update({ 'system.lifePoints.value': newLP });
    ui.notifications.info(`${actor.name}: LP set to ${newLP}/${maxLP}`);
  }

  // ========== ENEMIES TAB HANDLERS ==========
  _onEnemyCategoryToggle(event) {
    event.preventDefault();
    event.stopPropagation();
    const section = $(event.currentTarget).closest('.enemy-category-section');
    const sectionId = section.data('sectionId');

    if (sectionId) {
      // Toggle expanded state (if in set = expanded, remove to collapse; if not in set = collapsed, add to expand)
      if (this._enemyCategoryExpanded.has(sectionId)) {
        this._enemyCategoryExpanded.delete(sectionId);
      } else {
        this._enemyCategoryExpanded.add(sectionId);
      }
    }

    // Toggle visual state immediately
    section.toggleClass('collapsed');
  }

  /** @override - Foundry DragDrop handler */
  _onDragStart(event) {
    console.log('Conan | _onDragStart called');

    const token = event.currentTarget;

    // Check if this is an area letter drag
    if (token.classList.contains('area-letter')) {
      const label = token.dataset.label;
      console.log('Conan | Drag started on area letter:', label);
      const dragData = {
        type: 'ConanAreaMarker',
        label: label,
        size: this._areaDefaultSize
      };
      // jQuery wraps events — get native event for dataTransfer
      const dt = (event.originalEvent || event).dataTransfer;
      dt.setData('text/plain', JSON.stringify(dragData));
      // Use generated image as drag preview
      const dragImg = this._generateAreaLetterImage(label, 60);
      dt.setDragImage(dragImg, 30, 30);
      return;
    }

    // Check if this is an enemy token drag
    if (!token.classList.contains('enemy-token')) {
      return super._onDragStart(event);
    }

    console.log('Conan | Drag started on enemy token');

    // Get the parent .enemy-card to find the enemy data
    const card = token.closest('.enemy-card');
    if (!card) {
      console.warn('Conan | Could not find enemy card for drag');
      return;
    }

    const enemyId = card.dataset.enemyId;
    const category = card.dataset.category;
    const group = card.dataset.group;

    // Find the enemy data
    const enemyData = this._findEnemyData(category, group, enemyId);
    if (!enemyData) {
      console.warn('Conan | Could not find enemy data for:', enemyId);
      return;
    }

    // Get the token image (custom or default) - use relative paths for Foundry compatibility
    // Prefer stored enemyData path over DOM src (which returns absolute URLs)
    const imgElement = token.querySelector('img');
    const tokenImg = enemyData.tokenImg || imgElement?.getAttribute('src') || 'icons/svg/mystery-man.svg';
    // Get the portrait image (custom or fallback to token)
    const portraitImg = enemyData.portraitImg || tokenImg;

    // Randomize defenses for this placement
    const physDef = enemyData.defenses.physical ? this._randomInRange(enemyData.defenses.physical.min, enemyData.defenses.physical.max) : null;
    const sorcDef = enemyData.defenses.sorcery ? this._randomInRange(enemyData.defenses.sorcery.min, enemyData.defenses.sorcery.max) : null;
    const ar = enemyData.ar ? this._randomInRange(enemyData.ar.min, enemyData.ar.max) : null;

    // Get the group background image from settings
    const groupBackgrounds = game.settings.get('conan', 'enemyGroupBackgrounds') || {};
    const bgKey = `${category}.${group}`;
    const groupBackground = groupBackgrounds[bgKey] || '';

    // Create drag data for Foundry
    const dragData = {
      type: 'ConanEnemy',
      enemy: {
        ...enemyData,
        tokenImg: tokenImg,
        portraitImg: portraitImg,
        groupBackground: groupBackground, // Store background URL directly
        // Randomized values
        physicalDefense: physDef,
        sorceryDefense: sorcDef,
        armorRating: ar
      }
    };

    // Set drag data using Foundry's expected format
    event.dataTransfer.setData('text/plain', JSON.stringify(dragData));

    // Set drag image to the token
    const img = token.querySelector('img');
    if (img) {
      event.dataTransfer.setDragImage(img, 50, 50);
    }

    token.classList.add('dragging');
    console.log('Conan | Dragging enemy:', enemyData.name);
  }

  _onEnemyDragEnd(event) {
    event.currentTarget.classList.remove('dragging');
  }

  _onEnemyTokenClick(event) {
    // Don't trigger if this was a drag
    if (event.currentTarget.classList.contains('dragging')) return;

    const token = event.currentTarget;
    const card = token.closest('.enemy-card');
    if (!card) return;

    const enemyId = card.dataset.enemyId;
    const category = card.dataset.category;
    const group = card.dataset.group;

    const enemyData = this._findEnemyData(category, group, enemyId);
    if (!enemyData) return;

    // Open the roll dialog (preview mode)
    showEnemyRollDialog(enemyData, null);
  }

  _onEnemyExpandClick(event) {
    event.preventDefault();
    event.stopPropagation();
    const btn = event.currentTarget;
    const card = $(btn).closest('.enemy-card');
    card.toggleClass('expanded');
  }

  _onEnemyDetailsClick(event) {
    event.preventDefault();
    event.stopPropagation();
    const btn = event.currentTarget;
    const card = $(btn).closest('.enemy-card')[0];
    if (!card) return;

    const enemyId = card.dataset.enemyId;
    const category = card.dataset.category;
    const group = card.dataset.group;

    const enemyData = this._findEnemyData(category, group, enemyId);
    if (!enemyData) return;

    // Use the new roll dialog (preview mode - no token)
    showEnemyRollDialog(enemyData, null);
  }

  _onEnemySettingsClick(event) {
    event.preventDefault();
    event.stopPropagation();
    console.log('Conan | Settings button clicked');

    const btn = event.currentTarget;
    const card = $(btn).closest('.enemy-card');
    const cardEl = card[0];
    if (!cardEl) {
      console.warn('Conan | Could not find enemy card element');
      return;
    }

    const enemyId = cardEl.dataset.enemyId;
    const category = cardEl.dataset.category;
    const group = cardEl.dataset.group;
    console.log('Conan | Settings for enemy:', enemyId, 'category:', category, 'group:', group);

    const enemyData = this._findEnemyData(category, group, enemyId);
    if (!enemyData) {
      console.warn('Conan | Could not find enemy data');
      ui.notifications.warn('Could not find enemy data');
      return;
    }
    console.log('Conan | Found enemy data:', enemyData.name);

    // Current images
    const currentPortrait = enemyData.portraitImg || 'icons/svg/mystery-man.svg';
    const currentToken = enemyData.tokenImg || 'icons/svg/mystery-man.svg';

    const content = `
      <div class="enemy-settings-dialog">
        <div class="enemy-settings-row">
          <div class="enemy-settings-col">
            <label>Portrait Image</label>
            <div class="enemy-settings-preview portrait-preview">
              <img src="${currentPortrait}" alt="Portrait">
            </div>
            <button type="button" class="tools-btn small set-portrait-btn">
              <i class="fas fa-image"></i> Set Portrait
            </button>
          </div>
          <div class="enemy-settings-col">
            <label>Token Image</label>
            <div class="enemy-settings-preview token-preview">
              <img src="${currentToken}" alt="Token">
            </div>
            <button type="button" class="tools-btn small set-token-btn">
              <i class="fas fa-image"></i> Set Token
            </button>
          </div>
        </div>
      </div>
    `;

    const sheet = this;
    const imgDialogKey = `images-${enemyId}`;
    const existingImgDialog = _openEnemyDialogs.get(imgDialogKey);
    if (existingImgDialog) {
      existingImgDialog.bringToTop();
      return;
    }

    const imgDialog = new Dialog({
      title: `${enemyData.name} - Images`,
      content: content,
      buttons: {
        save: {
          icon: '<i class="fas fa-save"></i>',
          label: "Save",
          callback: async (html) => {
            // Get the current image paths from the previews
            const portrait = html.find('.portrait-preview img').attr('src');
            const token = html.find('.token-preview img').attr('src');

            // Store in enemy data (in-memory)
            enemyData.portraitImg = portrait;
            enemyData.tokenImg = token;

            // Persist to settings
            await sheet._saveEnemyCustomImage(category, group, enemyId, portrait, token);

            // Update the card display
            card.find('.enemy-token img').attr('src', token);

            ui.notifications.info(`Images updated for ${enemyData.name}`);
          }
        },
        cancel: {
          icon: '<i class="fas fa-times"></i>',
          label: "Cancel"
        }
      },
      default: "save",
      render: (html) => {
        // Portrait picker
        html.find('.set-portrait-btn').click(() => {
          new FilePicker({
            type: "image",
            callback: (path) => {
              html.find('.portrait-preview img').attr('src', path);
            }
          }).render(true);
        });

        // Token picker
        html.find('.set-token-btn').click(() => {
          new FilePicker({
            type: "image",
            callback: (path) => {
              html.find('.token-preview img').attr('src', path);
            }
          }).render(true);
        });
      },
      close: () => { _openEnemyDialogs.delete(imgDialogKey); }
    }, {
      classes: ["dialog", "bpm-dialog-window", "enemy-settings-window"],
      width: 350
    });
    _openEnemyDialogs.set(imgDialogKey, imgDialog);
    imgDialog.render(true);
  }

  _onGroupSettingsClick(event) {
    event.preventDefault();
    event.stopPropagation();

    const btn = event.currentTarget;
    const category = btn.dataset.category;
    const group = btn.dataset.group;

    // Get current background from settings
    const groupBackgrounds = game.settings.get('conan', 'enemyGroupBackgrounds') || {};
    const key = `${category}.${group}`;
    const currentBg = groupBackgrounds[key] || '';

    // Get category and group names for display
    const categoryData = this._enemyData?.categories?.[category];
    const groupData = categoryData?.groups?.[group];
    const categoryName = categoryData?.name || category;
    const groupName = groupData?.name || group;

    const content = `
      <div class="group-settings-dialog">
        <p style="margin-bottom: 10px;">Set a background image for all <strong>${groupName}</strong> cards in the <strong>${categoryName}</strong> category.</p>
        <div class="form-group">
          <label>Background Image</label>
          <div class="background-preview" style="width: 100%; height: 120px; border: 2px solid #444; border-radius: 6px; margin-bottom: 8px; overflow: hidden; background: #1a1a1a;">
            ${currentBg ? `<img src="${currentBg}" style="width: 100%; height: 100%; object-fit: cover;">` : '<div style="display: flex; align-items: center; justify-content: center; height: 100%; color: #666;">No background set</div>'}
          </div>
          <div style="display: flex; gap: 8px;">
            <button type="button" class="set-background-btn" style="flex: 1;"><i class="fas fa-image"></i> Choose Image</button>
            <button type="button" class="clear-background-btn" style="flex: 0;"><i class="fas fa-trash"></i></button>
          </div>
        </div>
      </div>
    `;

    const sheet = this;
    const bgDialogKey = `background-${key}`;
    const existingBgDialog = _openEnemyDialogs.get(bgDialogKey);
    if (existingBgDialog) {
      existingBgDialog.bringToTop();
      return;
    }

    const bgDialog = new Dialog({
      title: `${groupName} - Background`,
      content: content,
      buttons: {
        save: {
          icon: '<i class="fas fa-save"></i>',
          label: "Save",
          callback: async (html) => {
            const imgEl = html.find('.background-preview img');
            const newBg = imgEl.length > 0 ? imgEl.attr('src') : '';

            // Update settings
            const settings = game.settings.get('conan', 'enemyGroupBackgrounds') || {};
            if (newBg) {
              settings[key] = newBg;
            } else {
              delete settings[key];
            }
            await game.settings.set('conan', 'enemyGroupBackgrounds', settings);

            // Re-render the sheet to apply the background
            sheet.render();

            ui.notifications.info(`Background updated for ${groupName}`);
          }
        },
        cancel: {
          icon: '<i class="fas fa-times"></i>',
          label: "Cancel"
        }
      },
      default: "save",
      render: (html) => {
        // Background picker
        html.find('.set-background-btn').click(() => {
          new FilePicker({
            type: "image",
            callback: (path) => {
              html.find('.background-preview').html(`<img src="${path}" style="width: 100%; height: 100%; object-fit: cover;">`);
            }
          }).render(true);
        });

        // Clear background
        html.find('.clear-background-btn').click(() => {
          html.find('.background-preview').html('<div style="display: flex; align-items: center; justify-content: center; height: 100%; color: #666;">No background set</div>');
        });
      },
      close: () => { _openEnemyDialogs.delete(bgDialogKey); }
    }, {
      classes: ["dialog", "bpm-dialog-window", "group-settings-window"],
      width: 350
    });
    _openEnemyDialogs.set(bgDialogKey, bgDialog);
    bgDialog.render(true);
  }

  _findEnemyData(categoryKey, groupKey, enemyId) {
    if (!this._enemyData?.categories?.[categoryKey]?.groups?.[groupKey]?.enemies) {
      return null;
    }
    const enemy = this._enemyData.categories[categoryKey].groups[groupKey].enemies.find(e => e.id === enemyId);
    if (enemy) {
      // Include category and group for theming and backgrounds
      enemy.category = categoryKey;
      enemy.group = groupKey;
    }
    return enemy;
  }

  _randomInRange(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  _showEnemyDetails(enemy) {
    // Build attacks HTML - handle both single weapons and arrays
    let attacksHtml = '';
    if (enemy.attacks) {
      if (enemy.attacks.melee) {
        const meleeWeapons = Array.isArray(enemy.attacks.melee) ? enemy.attacks.melee : [enemy.attacks.melee];
        meleeWeapons.forEach((melee, index) => {
          attacksHtml += `<div class="enemy-detail-attack">
            <strong>Melee${meleeWeapons.length > 1 ? ` ${index + 1}` : ''}:</strong> ${melee.name} (${melee.range}) - ${melee.damage}
            ${melee.special ? `<br><em>${melee.special}</em>` : ''}
          </div>`;
        });
      }
      if (enemy.attacks.ranged) {
        const rangedWeapons = Array.isArray(enemy.attacks.ranged) ? enemy.attacks.ranged : [enemy.attacks.ranged];
        rangedWeapons.forEach((ranged, index) => {
          attacksHtml += `<div class="enemy-detail-attack">
            <strong>Ranged${rangedWeapons.length > 1 ? ` ${index + 1}` : ''}:</strong> ${ranged.name} (${ranged.range}) - ${ranged.damage}
            ${ranged.special ? `<br><em>${ranged.special}</em>` : ''}
          </div>`;
        });
      }
    }

    // Build rules HTML
    let rulesHtml = '';
    if (enemy.rules && enemy.rules.length > 0) {
      rulesHtml = enemy.rules.map(rule => `
        <div class="enemy-detail-rule">
          <strong>${rule.name}:</strong> ${rule.description}
        </div>
      `).join('');
    }

    const content = `
      <div class="enemy-detail-dialog">
        <div class="enemy-detail-header">
          <h2>${enemy.name}</h2>
          <span class="enemy-detail-type ${enemy.type === 'Minion' ? 'minion' : 'antagonist'}">${enemy.type}</span>
        </div>

        <div class="enemy-detail-section">
          <h3>Stats</h3>
          <div class="enemy-detail-stats">
            <div class="enemy-detail-stat">
              <span class="label">Might</span>
              <span class="value">${enemy.stats.might.value} | ${enemy.stats.might.die}</span>
            </div>
            <div class="enemy-detail-stat">
              <span class="label">Edge</span>
              <span class="value">${enemy.stats.edge.value} | ${enemy.stats.edge.die}</span>
            </div>
            <div class="enemy-detail-stat">
              <span class="label">Grit</span>
              <span class="value">${enemy.stats.grit.value} | ${enemy.stats.grit.die}</span>
            </div>
            <div class="enemy-detail-stat">
              <span class="label">Wits</span>
              <span class="value">${enemy.stats.wits.value} | ${enemy.stats.wits.die}</span>
            </div>
          </div>
        </div>

        <div class="enemy-detail-section">
          <h3>Defenses</h3>
          <div class="enemy-detail-defenses">
            <div class="enemy-detail-defense">
              <span class="label">Physical</span>
              <span class="value">${enemy.defenses.physical.min}-${enemy.defenses.physical.max}</span>
            </div>
            <div class="enemy-detail-defense">
              <span class="label">Sorcery</span>
              <span class="value">${enemy.defenses.sorcery.min}-${enemy.defenses.sorcery.max}</span>
            </div>
            ${enemy.threshold ? `
              <div class="enemy-detail-defense threshold">
                <span class="label">Threshold</span>
                <span class="value">${enemy.threshold}</span>
              </div>
            ` : ''}
            ${enemy.lifePoints ? `
              <div class="enemy-detail-defense lifepoints">
                <span class="label">Life Points</span>
                <span class="value">${enemy.lifePoints}</span>
              </div>
            ` : ''}
            ${enemy.ar ? `
              <div class="enemy-detail-defense">
                <span class="label">AR</span>
                <span class="value">${enemy.ar.min}-${enemy.ar.max}</span>
              </div>
            ` : ''}
          </div>
        </div>

        <div class="enemy-detail-section">
          <h3>Actions</h3>
          <p>${enemy.actions.perTurn} Actions per Turn${enemy.actions.attackLimit ? `, max ${enemy.actions.attackLimit} Attack` : ''}</p>
        </div>

        ${attacksHtml ? `
          <div class="enemy-detail-section">
            <h3>Attacks</h3>
            ${attacksHtml}
          </div>
        ` : ''}

        ${rulesHtml ? `
          <div class="enemy-detail-section">
            <h3>Special Rules</h3>
            ${rulesHtml}
          </div>
        ` : ''}
      </div>
    `;

    new Dialog({
      title: enemy.name,
      content: content,
      buttons: {
        close: {
          icon: '<i class="fas fa-times"></i>',
          label: "Close"
        }
      },
      default: "close"
    }, {
      classes: ["dialog", "bpm-dialog-window", "enemy-detail-window"],
      width: 450,
      height: 'auto'
    }).render(true);
  }

  _onAddEnemy(event) {
    event.preventDefault();
    this._openEnemyCreatorDialog();
  }

  /**
   * Format a range value for display (e.g., {min: 7, max: 9} -> "7-9" or {min: 7, max: 7} -> "7")
   */
  _formatRangeValue(range) {
    if (!range) return '';
    if (range.min === range.max) return String(range.min);
    return `${range.min}-${range.max}`;
  }

  /**
   * Parse a range value from string input (e.g., "7" -> {min: 7, max: 7}, "7-9" -> {min: 7, max: 9})
   */
  _parseRangeValue(value, defaultMin = 1, defaultMax = 1) {
    if (!value || value.trim() === '') return { min: defaultMin, max: defaultMax };

    const str = String(value).trim();

    // Check if it's a range (contains dash)
    if (str.includes('-')) {
      const parts = str.split('-').map(p => parseInt(p.trim()));
      if (parts.length === 2 && !isNaN(parts[0]) && !isNaN(parts[1])) {
        return { min: Math.min(parts[0], parts[1]), max: Math.max(parts[0], parts[1]) };
      }
    }

    // Single number
    const num = parseInt(str);
    if (!isNaN(num)) {
      return { min: num, max: num };
    }

    return { min: defaultMin, max: defaultMax };
  }

  /**
   * Get category-to-type mapping for enemy creator
   * Keys match enemies.json category keys
   */
  _getEnemyTypesByCategory() {
    return {
      human: ["Soldier", "Bandit", "Guard", "Assassin", "Cultist", "Noble", "Mercenary", "Pirate", "Thief", "Warrior"],
      beasts: ["Predator", "Pack Hunter", "Giant", "Swarm", "Venomous", "Mount", "Aquatic", "Flying"],
      undead: ["Skeleton", "Zombie", "Ghost", "Mummy", "Vampire", "Wraith", "Revenant"],
      demons: ["Lesser Demon", "Greater Demon", "Elemental", "Summoned", "Possessed"],
      monstrosity: ["Aberration", "Construct", "Giant", "Shapeshifter", "Chimera", "Dragon"],
      inanimate: ["Trap", "Hazard", "Animated Object", "Swarm", "Environmental"],
      unknown: ["Eldritch", "Alien", "Ancient", "Otherworldly", "Cosmic Horror"]
    };
  }

  /**
   * Get the weapon catalog for enemy creator (simplified, no ammo)
   */
  _getEnemyWeaponCatalog() {
    return {
      melee: {
        unarmed: { name: "Unarmed", damage: "2", range: "Touch" },
        claws: { name: "Claws", damage: "1d6", range: "Touch" },
        bite: { name: "Bite", damage: "1d8", range: "Touch" },
        dagger: { name: "Dagger", damage: "1d4", range: "Touch" },
        sword: { name: "Sword", damage: "1d8", range: "Touch" },
        greatSword: { name: "Great Sword", damage: "1d12", range: "Touch" },
        axe: { name: "Axe", damage: "1d8", range: "Touch" },
        greatAxe: { name: "Great Axe", damage: "1d12", range: "Touch" },
        spear: { name: "Spear", damage: "1d10", range: "Close" },
        club: { name: "Club", damage: "1d4", range: "Touch" },
        mace: { name: "Mace", damage: "1d6", range: "Touch" },
        maul: { name: "Maul", damage: "1d12", range: "Touch" },
        staff: { name: "Staff", damage: "1d4", range: "Touch" },
        whip: { name: "Whip", damage: "1d4", range: "Close" },
        tentacle: { name: "Tentacle", damage: "1d6", range: "Close" },
        slam: { name: "Slam", damage: "1d10", range: "Touch" }
      },
      ranged: {
        bow: { name: "Bow", damage: "1d6+1", range: "Long" },
        crossbow: { name: "Crossbow", damage: "1d8+1", range: "Medium" },
        javelin: { name: "Javelin", damage: "1d6", range: "Medium" },
        throwing: { name: "Throwing Weapon", damage: "1d4", range: "Medium" },
        sling: { name: "Sling", damage: "1d4", range: "Medium" },
        spit: { name: "Spit/Venom", damage: "1d6", range: "Close" },
        breath: { name: "Breath Weapon", damage: "2d6", range: "Close" }
      }
    };
  }

  /**
   * Open the enemy creator dialog - Single large window with all options
   */
  _openEnemyCreatorDialog(existingEnemy = null) {
    const isEdit = !!existingEnemy;
    const enemy = existingEnemy || {
      id: `custom-${Date.now()}`,
      name: "New Enemy",
      category: "human",
      subtype: "",
      type: "Minion",
      stats: {
        might: { value: 2, die: "D6" },
        edge: { value: 2, die: "D6" },
        grit: { value: 2, die: "D6" },
        wits: { value: 2, die: "D6" }
      },
      defenses: {
        physical: { min: 7, max: 9 },
        sorcery: { min: 5, max: 7 }
      },
      threshold: 5,
      lifePoints: 20,
      ar: null,
      attacks: {
        melee: null,
        ranged: null
      },
      actions: { perTurn: 2, attackLimit: 1 },
      rules: []
    };

    const typesByCategory = this._getEnemyTypesByCategory();
    const categories = Object.keys(typesByCategory);
    const diceOptions = ['D6', 'D8', 'D10'];
    const weaponCatalog = this._getEnemyWeaponCatalog();

    // Build category options
    const categoryOptions = categories.map(cat =>
      `<option value="${cat}" ${enemy.category === cat ? 'selected' : ''}>${cat.charAt(0).toUpperCase() + cat.slice(1)}</option>`
    ).join('');

    // Build initial type options based on current/default category
    const currentCategory = enemy.category || 'human';
    const typeOptions = (typesByCategory[currentCategory] || []).map(t =>
      `<option value="${t}" ${enemy.subtype === t ? 'selected' : ''}>${t}</option>`
    ).join('');

    // Build weapon options
    const meleeOptions = Object.entries(weaponCatalog.melee).map(([key, w]) =>
      `<option value="${key}" data-damage="${w.damage}" data-range="${w.range}">${w.name}</option>`
    ).join('');
    const rangedOptions = Object.entries(weaponCatalog.ranged).map(([key, w]) =>
      `<option value="${key}" data-damage="${w.damage}" data-range="${w.range}">${w.name}</option>`
    ).join('');

    const content = `
      <form class="enemy-creator-form full-page">
        <div class="enemy-creator-columns">
          <!-- LEFT COLUMN -->
          <div class="enemy-creator-column">
            <fieldset class="enemy-creator-fieldset">
              <legend>Identity</legend>
              <div class="enemy-creator-field full">
                <label>Enemy Name</label>
                <input type="text" name="name" value="${enemy.name}" placeholder="Enter enemy name...">
              </div>
              <div class="enemy-creator-row">
                <div class="enemy-creator-field">
                  <label>Category</label>
                  <select name="category">
                    ${categoryOptions}
                  </select>
                </div>
                <div class="enemy-creator-field">
                  <label>Type</label>
                  <select name="subtype">
                    <option value="">-- Select --</option>
                    ${typeOptions}
                  </select>
                </div>
              </div>
            </fieldset>

            <fieldset class="enemy-creator-fieldset">
              <legend>Minion / Antagonist</legend>
              <div class="enemy-creator-toggle">
                <label class="toggle-option ${enemy.type === 'Minion' ? 'active' : ''}">
                  <input type="radio" name="type" value="Minion" ${enemy.type === 'Minion' ? 'checked' : ''}>
                  <span>Minion</span>
                  <small>Uses Threshold</small>
                </label>
                <label class="toggle-option ${enemy.type === 'Antagonist' ? 'active' : ''}">
                  <input type="radio" name="type" value="Antagonist" ${enemy.type === 'Antagonist' ? 'checked' : ''}>
                  <span>Antagonist</span>
                  <small>Uses Life Points + AR</small>
                </label>
              </div>
              <div class="enemy-creator-row type-fields">
                <div class="enemy-creator-field minion-field" ${enemy.type === 'Antagonist' ? 'style="display:none;"' : ''}>
                  <label>Threshold</label>
                  <input type="number" name="threshold" value="${enemy.threshold || 5}" min="1" max="20">
                </div>
                <div class="enemy-creator-field antagonist-field" ${enemy.type === 'Minion' ? 'style="display:none;"' : ''}>
                  <label>Life Points</label>
                  <input type="number" name="lifePoints" value="${enemy.lifePoints || 20}" min="1" max="100">
                </div>
                <div class="enemy-creator-field antagonist-field" ${enemy.type === 'Minion' ? 'style="display:none;"' : ''}>
                  <label>Armor Rating</label>
                  <input type="text" name="ar" value="${this._formatRangeValue(enemy.ar)}" placeholder="0 or 2-4">
                </div>
              </div>
            </fieldset>

            <fieldset class="enemy-creator-fieldset">
              <legend>Stats</legend>
              <div class="enemy-creator-stats-grid">
                ${['might', 'edge', 'grit', 'wits'].map(stat => `
                  <div class="enemy-creator-stat">
                    <label class="stat-name">${stat.charAt(0).toUpperCase() + stat.slice(1)}</label>
                    <input type="number" name="stats.${stat}.value" value="${enemy.stats[stat].value}" min="1" max="6" class="stat-value-input">
                    <div class="stat-dice-radios">
                      ${diceOptions.map(d => `
                        <label class="dice-radio ${enemy.stats[stat].die === d ? 'selected' : ''}">
                          <input type="radio" name="stats.${stat}.die" value="${d}" ${enemy.stats[stat].die === d ? 'checked' : ''}>
                          <span>${d}</span>
                        </label>
                      `).join('')}
                    </div>
                  </div>
                `).join('')}
              </div>
            </fieldset>

            <fieldset class="enemy-creator-fieldset">
              <legend>Defenses <small>(value or range like 7-9)</small></legend>
              <div class="enemy-creator-row">
                <div class="enemy-creator-field">
                  <label>Physical</label>
                  <input type="text" name="defenses.physical" value="${this._formatRangeValue(enemy.defenses.physical)}" placeholder="7 or 7-9">
                </div>
                <div class="enemy-creator-field">
                  <label>Sorcery</label>
                  <input type="text" name="defenses.sorcery" value="${this._formatRangeValue(enemy.defenses.sorcery)}" placeholder="5 or 5-7">
                </div>
              </div>
            </fieldset>
          </div>

          <!-- RIGHT COLUMN -->
          <div class="enemy-creator-column">
            <fieldset class="enemy-creator-fieldset">
              <legend>Melee Weapons</legend>
              <div class="enemy-creator-row">
                <div class="enemy-creator-field">
                  <label>Weapon 1</label>
                  <select name="melee.weapon.0" class="weapon-select" data-type="melee" data-index="0">
                    <option value="">-- None --</option>
                    ${meleeOptions}
                  </select>
                </div>
                <div class="enemy-creator-field">
                  <label>Weapon 2</label>
                  <select name="melee.weapon.1" class="weapon-select" data-type="melee" data-index="1">
                    <option value="">-- None --</option>
                    ${meleeOptions}
                  </select>
                </div>
              </div>
            </fieldset>

            <fieldset class="enemy-creator-fieldset">
              <legend>Ranged Weapons</legend>
              <div class="enemy-creator-row">
                <div class="enemy-creator-field">
                  <label>Weapon 1</label>
                  <select name="ranged.weapon.0" class="weapon-select" data-type="ranged" data-index="0">
                    <option value="">-- None --</option>
                    ${rangedOptions}
                  </select>
                </div>
                <div class="enemy-creator-field">
                  <label>Weapon 2</label>
                  <select name="ranged.weapon.1" class="weapon-select" data-type="ranged" data-index="1">
                    <option value="">-- None --</option>
                    ${rangedOptions}
                  </select>
                </div>
              </div>
            </fieldset>

            <button type="button" class="create-weapon-btn"><i class="fas fa-hammer"></i> Create Custom Weapon</button>

            <fieldset class="enemy-creator-fieldset">
              <legend>Actions</legend>
              <div class="enemy-creator-row">
                <div class="enemy-creator-field">
                  <label>Actions/Turn</label>
                  <input type="number" name="actions.perTurn" value="${enemy.actions.perTurn}" min="1" max="5">
                </div>
                <div class="enemy-creator-field">
                  <label>Attack Limit</label>
                  <input type="number" name="actions.attackLimit" value="${enemy.actions.attackLimit}" min="1" max="5">
                </div>
              </div>
            </fieldset>

            <fieldset class="enemy-creator-fieldset">
              <legend>Test Attacks</legend>
              <div class="enemy-creator-test-attacks">
                <div class="test-attack-row">
                  <button type="button" class="test-attack-btn" data-type="melee" data-index="0">
                    <i class="fas fa-fist-raised"></i> Melee 1
                  </button>
                  <button type="button" class="test-attack-btn" data-type="melee" data-index="1">
                    <i class="fas fa-fist-raised"></i> Melee 2
                  </button>
                </div>
                <div class="test-attack-row">
                  <button type="button" class="test-attack-btn" data-type="ranged" data-index="0">
                    <i class="fas fa-bullseye"></i> Ranged 1
                  </button>
                  <button type="button" class="test-attack-btn" data-type="ranged" data-index="1">
                    <i class="fas fa-bullseye"></i> Ranged 2
                  </button>
                </div>
              </div>
            </fieldset>

            <fieldset class="enemy-creator-fieldset">
              <legend>Special Rules</legend>
              <div class="enemy-creator-rules" data-rules='${JSON.stringify(enemy.rules || [])}'>
                <div class="enemy-creator-rules-list">
                  ${(enemy.rules || []).map((rule, i) => `
                    <div class="enemy-creator-rule" data-index="${i}">
                      <input type="text" class="rule-name" value="${rule.name}" placeholder="Rule name">
                      <input type="text" class="rule-desc" value="${rule.description}" placeholder="Description">
                      <button type="button" class="remove-rule-btn" data-index="${i}"><i class="fas fa-times"></i></button>
                    </div>
                  `).join('')}
                </div>
                <button type="button" class="add-rule-btn"><i class="fas fa-plus"></i> Add Rule</button>
              </div>
            </fieldset>
          </div>
        </div>
      </form>
    `;

    const weaponCatalogRef = weaponCatalog;
    const self = this;

    const dialog = new Dialog({
      title: isEdit ? `Edit Enemy: ${enemy.name}` : "Create Custom Enemy",
      content: content,
      buttons: {
        summon: {
          icon: '<i class="fas fa-skull"></i>',
          label: "Summon",
          callback: (html) => this._saveCustomEnemy(html, enemy.id, isEdit)
        },
        cancel: {
          icon: '<i class="fas fa-times"></i>',
          label: "Cancel"
        }
      },
      default: "summon",
      render: (html) => {
        // Category change handler - update type options
        html.find('select[name="category"]').change((ev) => {
          const category = ev.target.value;
          const types = typesByCategory[category] || [];
          const typeSelect = html.find('select[name="subtype"]');

          let options = '<option value="">-- Select --</option>';
          types.forEach(t => {
            options += `<option value="${t}">${t}</option>`;
          });
          typeSelect.html(options);
        });

        // Toggle styling for radio buttons + show/hide fields
        html.find('input[name="type"]').change((ev) => {
          html.find('.toggle-option').removeClass('active');
          $(ev.target).closest('.toggle-option').addClass('active');

          const isMinion = ev.target.value === 'Minion';
          html.find('.minion-field').toggle(isMinion);
          html.find('.antagonist-field').toggle(!isMinion);
        });

        // Dice radio button handler
        html.find('.dice-radio').click(function() {
          const radioGroup = $(this).closest('.stat-dice-radios');
          radioGroup.find('.dice-radio').removeClass('selected');
          $(this).addClass('selected');
          $(this).find('input[type="radio"]').prop('checked', true);
        });

        // Create Custom Weapon button handler
        html.find('.create-weapon-btn').click(() => {
          const cwContent = `
            <form class="create-weapon-form">
              <div style="display:flex; flex-direction:column; gap:8px;">
                <div style="display:flex; gap:8px;">
                  <div style="flex:1;">
                    <label style="font-size:11px; color:#aaa;">Name</label>
                    <input type="text" name="cw-name" placeholder="e.g. Flame Breath" style="width:100%;">
                  </div>
                </div>
                <div style="display:flex; gap:8px;">
                  <div style="flex:1;">
                    <label style="font-size:11px; color:#aaa;">Type</label>
                    <select name="cw-type" style="width:100%;">
                      <option value="melee">Melee</option>
                      <option value="ranged">Ranged</option>
                    </select>
                  </div>
                  <div style="flex:1;">
                    <label style="font-size:11px; color:#aaa;">Stat</label>
                    <select name="cw-stat" style="width:100%;">
                      <option value="might">Might</option>
                      <option value="edge">Edge</option>
                    </select>
                  </div>
                </div>
                <div style="display:flex; gap:8px;">
                  <div style="flex:1;">
                    <label style="font-size:11px; color:#aaa;">Range</label>
                    <select name="cw-range" style="width:100%;">
                      <option value="Touch">Touch</option>
                      <option value="Close">Close</option>
                      <option value="Medium">Medium</option>
                      <option value="Long">Long</option>
                      <option value="Distant">Distant</option>
                    </select>
                  </div>
                  <div style="flex:1;">
                    <label style="font-size:11px; color:#aaa;">Damage Dice</label>
                    <input type="text" name="cw-dice" placeholder="e.g. 1d8" style="width:100%;">
                  </div>
                  <div style="flex:1;">
                    <label style="font-size:11px; color:#aaa;">Bonus</label>
                    <input type="number" name="cw-bonus" value="0" min="0" max="20" style="width:100%;">
                  </div>
                </div>
              </div>
            </form>
          `;

          new Dialog({
            title: "Create Custom Weapon",
            content: cwContent,
            buttons: {
              create: {
                icon: '<i class="fas fa-hammer"></i>',
                label: "Create",
                callback: (cwHtml) => {
                  const name = cwHtml.find('[name="cw-name"]').val()?.trim();
                  if (!name) {
                    ui.notifications.warn("Weapon needs a name!");
                    return;
                  }
                  const type = cwHtml.find('[name="cw-type"]').val();
                  const range = cwHtml.find('[name="cw-range"]').val();
                  const dice = cwHtml.find('[name="cw-dice"]').val()?.trim() || "1d6";
                  const bonus = parseInt(cwHtml.find('[name="cw-bonus"]').val()) || 0;
                  const damage = bonus > 0 ? `${dice}+${bonus}` : dice;

                  // Find first empty slot for this weapon type
                  const slot0 = html.find(`select[name="${type}.weapon.0"]`);
                  const slot1 = html.find(`select[name="${type}.weapon.1"]`);
                  let targetSlot = null;

                  if (!slot0.val()) {
                    targetSlot = slot0;
                  } else if (!slot1.val()) {
                    targetSlot = slot1;
                  } else {
                    ui.notifications.warn(`Both ${type} weapon slots are full. Clear one first.`);
                    return;
                  }

                  // Add as a custom option and select it
                  const customKey = `custom_${Date.now()}`;
                  targetSlot.append(`<option value="${customKey}" data-damage="${damage}" data-range="${range}" data-custom="true">${name}</option>`);
                  targetSlot.val(customKey);

                  // Store custom weapon data on the select for the save handler
                  if (!targetSlot.data('customWeapons')) targetSlot.data('customWeapons', {});
                  targetSlot.data('customWeapons')[customKey] = { name, damage, range };

                  ui.notifications.info(`${name} added to ${type} slot.`);
                }
              },
              cancel: {
                icon: '<i class="fas fa-times"></i>',
                label: "Cancel"
              }
            },
            default: "create"
          }).render(true);
        });

        // Test attack button handler
        html.find('.test-attack-btn').click(async function() {
          const type = $(this).data('type'); // melee or ranged
          const index = $(this).data('index'); // 0 or 1
          const weaponKey = html.find(`select[name="${type}.weapon.${index}"]`).val();

          if (!weaponKey) {
            ui.notifications.warn(`No ${type} weapon ${index + 1} selected`);
            return;
          }

          const weapon = weaponCatalogRef[type][weaponKey];
          const statName = type === 'melee' ? 'might' : 'edge';
          const statValue = parseInt(html.find(`input[name="stats.${statName}.value"]`).val()) || 2;
          const statDie = html.find(`input[name="stats.${statName}.die"]:checked`).val() || 'D6';

          // Roll the attack
          const dieSize = parseInt(statDie.replace('D', ''));
          const roll = new Roll(`1d${dieSize} + ${statValue}`);
          await roll.evaluate();

          // Create chat message
          const content = `
            <div class="conan-attack-roll">
              <h3>${weapon.name} Attack</h3>
              <div class="roll-details">
                <span class="stat">${statName.toUpperCase()}: ${statValue} + ${statDie}</span>
                <span class="result">= ${roll.total}</span>
              </div>
              <div class="weapon-info">Damage: ${weapon.damage} | Range: ${weapon.range}</div>
            </div>
          `;

          ChatMessage.create({
            content: content,
            sound: CONFIG.sounds.dice
          });
        });

        // Add rule button
        html.find('.add-rule-btn').click(() => {
          const rulesList = html.find('.enemy-creator-rules-list');
          const index = rulesList.find('.enemy-creator-rule').length;
          rulesList.append(`
            <div class="enemy-creator-rule" data-index="${index}">
              <input type="text" class="rule-name" value="" placeholder="Rule name">
              <input type="text" class="rule-desc" value="" placeholder="Description">
              <button type="button" class="remove-rule-btn" data-index="${index}"><i class="fas fa-times"></i></button>
            </div>
          `);
        });

        // Remove rule button (delegated)
        html.find('.enemy-creator-rules').on('click', '.remove-rule-btn', (ev) => {
          $(ev.currentTarget).closest('.enemy-creator-rule').remove();
        });

        // If editing, pre-select weapons
        if (enemy.attacks.melee) {
          const meleeWeapons = Array.isArray(enemy.attacks.melee) ? enemy.attacks.melee : [enemy.attacks.melee];
          meleeWeapons.forEach((weapon, i) => {
            if (i < 2 && weapon) {
              const meleeKey = Object.entries(weaponCatalogRef.melee).find(([k, w]) =>
                w.name === weapon.name
              )?.[0];
              if (meleeKey) {
                html.find(`select[name="melee.weapon.${i}"]`).val(meleeKey);
              }
            }
          });
        }
        if (enemy.attacks.ranged) {
          const rangedWeapons = Array.isArray(enemy.attacks.ranged) ? enemy.attacks.ranged : [enemy.attacks.ranged];
          rangedWeapons.forEach((weapon, i) => {
            if (i < 2 && weapon) {
              const rangedKey = Object.entries(weaponCatalogRef.ranged).find(([k, w]) =>
                w.name === weapon.name
              )?.[0];
              if (rangedKey) {
                html.find(`select[name="ranged.weapon.${i}"]`).val(rangedKey);
              }
            }
          });
        }
      }
    }, {
      classes: ['conan', 'enemy-creator-dialog', 'enemy-creator-fullpage'],
      width: 950,
      height: 750,
      resizable: true,
      top: 50,
      left: 100
    });

    dialog.render(true);
  }

  /**
   * Save custom enemy from the creator dialog
   */
  async _saveCustomEnemy(html, existingId, isEdit) {
    const form = html.find('.enemy-creator-form');
    const weaponCatalog = this._getEnemyWeaponCatalog();

    // Read all values from the form
    const enemyType = form.find('input[name="type"]:checked').val() || 'Minion';

    // Build complete enemy object
    const enemy = {
      id: isEdit ? existingId : `custom-${Date.now()}`,
      name: form.find('input[name="name"]').val() || "Unnamed Enemy",
      category: form.find('select[name="category"]').val() || 'human',
      subtype: form.find('select[name="subtype"]').val() || '',
      type: enemyType,
      stats: {
        might: {
          value: parseInt(form.find('input[name="stats.might.value"]').val()) || 2,
          die: form.find('input[name="stats.might.die"]:checked').val() || "D6"
        },
        edge: {
          value: parseInt(form.find('input[name="stats.edge.value"]').val()) || 2,
          die: form.find('input[name="stats.edge.die"]:checked').val() || "D6"
        },
        grit: {
          value: parseInt(form.find('input[name="stats.grit.value"]').val()) || 2,
          die: form.find('input[name="stats.grit.die"]:checked').val() || "D6"
        },
        wits: {
          value: parseInt(form.find('input[name="stats.wits.value"]').val()) || 2,
          die: form.find('input[name="stats.wits.die"]:checked').val() || "D6"
        }
      },
      defenses: {
        physical: this._parseRangeValue(form.find('input[name="defenses.physical"]').val(), 7, 9),
        sorcery: this._parseRangeValue(form.find('input[name="defenses.sorcery"]').val(), 5, 7)
      },
      threshold: null,
      lifePoints: null,
      ar: null,
      attacks: {
        melee: null,
        ranged: null
      },
      actions: {
        perTurn: parseInt(form.find('input[name="actions.perTurn"]').val()) || 2,
        attackLimit: parseInt(form.find('input[name="actions.attackLimit"]').val()) || 1
      },
      rules: []
    };

    // Set threshold or LP (and AR for antagonists) based on type
    if (enemyType === 'Minion') {
      enemy.threshold = parseInt(form.find('input[name="threshold"]').val()) || 5;
      // Minions don't have AR
    } else {
      enemy.lifePoints = parseInt(form.find('input[name="lifePoints"]').val()) || 20;
      // Only antagonists have AR - parse as range
      const arInput = form.find('input[name="ar"]').val();
      if (arInput && arInput.trim() !== '' && arInput.trim() !== '0') {
        enemy.ar = this._parseRangeValue(arInput, 0, 0);
      }
    }

    // Melee weapons (up to 2) — supports both catalog and custom weapons
    const meleeWeapons = [];
    for (let i = 0; i < 2; i++) {
      const select = form.find(`select[name="melee.weapon.${i}"]`);
      const weaponKey = select.val();
      if (!weaponKey) continue;
      const customWeapons = select.data('customWeapons') || {};
      if (customWeapons[weaponKey]) {
        meleeWeapons.push(customWeapons[weaponKey]);
      } else if (weaponCatalog.melee[weaponKey]) {
        const weapon = weaponCatalog.melee[weaponKey];
        meleeWeapons.push({ name: weapon.name, damage: weapon.damage, range: weapon.range });
      }
    }
    if (meleeWeapons.length > 1) {
      enemy.attacks.melee = meleeWeapons;
    } else if (meleeWeapons.length === 1) {
      enemy.attacks.melee = meleeWeapons[0];
    }

    // Ranged weapons (up to 2) — supports both catalog and custom weapons
    const rangedWeapons = [];
    for (let i = 0; i < 2; i++) {
      const select = form.find(`select[name="ranged.weapon.${i}"]`);
      const weaponKey = select.val();
      if (!weaponKey) continue;
      const customWeapons = select.data('customWeapons') || {};
      if (customWeapons[weaponKey]) {
        rangedWeapons.push(customWeapons[weaponKey]);
      } else if (weaponCatalog.ranged[weaponKey]) {
        const weapon = weaponCatalog.ranged[weaponKey];
        rangedWeapons.push({ name: weapon.name, damage: weapon.damage, range: weapon.range });
      }
    }
    if (rangedWeapons.length > 1) {
      enemy.attacks.ranged = rangedWeapons;
    } else if (rangedWeapons.length === 1) {
      enemy.attacks.ranged = rangedWeapons[0];
    }

    // Collect rules
    form.find('.enemy-creator-rule').each((i, el) => {
      const name = $(el).find('.rule-name').val();
      const desc = $(el).find('.rule-desc').val();
      if (name) {
        enemy.rules.push({ name, description: desc || "" });
      }
    });

    // Get existing custom enemies from settings
    let customEnemies = game.settings.get('conan', 'customEnemies') || [];

    if (isEdit) {
      // Update existing
      const idx = customEnemies.findIndex(e => e.id === enemy.id);
      if (idx >= 0) {
        customEnemies[idx] = enemy;
      } else {
        customEnemies.push(enemy);
      }
    } else {
      // Add new
      customEnemies.push(enemy);
    }

    // Save to settings
    await game.settings.set('conan', 'customEnemies', customEnemies);

    // Refresh the sheet to show the new enemy
    this._enemyData = null; // Clear cache to force reload
    this.render(false);

    ui.notifications.info(`Enemy "${enemy.name}" ${isEdit ? 'updated' : 'summoned'}!`);
  }

  /**
   * Edit a custom enemy
   */
  _onEnemyEditClick(event) {
    event.preventDefault();
    event.stopPropagation();

    const btn = event.currentTarget;
    const card = $(btn).closest('.enemy-card')[0];
    if (!card) return;

    const enemyId = card.dataset.enemyId;

    // Find the custom enemy in settings
    const customEnemies = game.settings.get('conan', 'customEnemies') || [];
    const enemy = customEnemies.find(e => e.id === enemyId);

    if (!enemy) {
      ui.notifications.warn('Could not find custom enemy to edit');
      return;
    }

    // Open the creator dialog with the existing enemy data
    this._openEnemyCreatorDialog(enemy);
  }

  /**
   * Delete a custom enemy
   */
  async _onEnemyDeleteClick(event) {
    event.preventDefault();
    event.stopPropagation();

    const btn = event.currentTarget;
    const card = $(btn).closest('.enemy-card')[0];
    if (!card) return;

    const enemyId = card.dataset.enemyId;

    // Find the custom enemy to get its name
    const customEnemies = game.settings.get('conan', 'customEnemies') || [];
    const enemy = customEnemies.find(e => e.id === enemyId);

    if (!enemy) {
      ui.notifications.warn('Could not find custom enemy to delete');
      return;
    }

    // Confirm deletion
    const confirmed = await Dialog.confirm({
      title: "Delete Custom Enemy",
      content: `<p>Are you sure you want to delete <strong>${enemy.name}</strong>?</p><p>This action cannot be undone.</p>`,
      yes: () => true,
      no: () => false,
      defaultYes: false
    });

    if (!confirmed) return;

    // Remove the enemy from settings
    const updatedEnemies = customEnemies.filter(e => e.id !== enemyId);
    await game.settings.set('conan', 'customEnemies', updatedEnemies);

    // Refresh the sheet
    this._enemyData = null; // Clear cache to force reload
    this.render(false);

    ui.notifications.info(`Enemy "${enemy.name}" deleted.`);
  }

  // ========== FLEX CELEBRATION HANDLERS ==========
  _onFlexPlayerSelect(event) {
    event.preventDefault();
    const playerId = event.currentTarget.dataset.playerId;

    // Toggle selection (deselect if already selected)
    if (this._selectedFlexPlayerId === playerId) {
      this._selectedFlexPlayerId = null;
    } else {
      this._selectedFlexPlayerId = playerId;
    }
    this.render(false);
  }

  async _onCelebrationToggle(event) {
    event.preventDefault();
    event.stopPropagation();

    console.log('Conan | Celebration toggle clicked!', event.target);

    const toggle = event.currentTarget;
    const flexType = toggle.dataset.type;
    const playerId = toggle.dataset.playerId;

    console.log('Conan | Toggle data:', { flexType, playerId });

    if (!playerId || !flexType) {
      console.log('Conan | Missing playerId or flexType, aborting');
      return;
    }

    // Get current data from settings
    const flexCeleb = game.settings.get('conan', 'flexCelebrations') || {};
    const currentCelebrations = (typeof flexCeleb.celebrations === 'object' && flexCeleb.celebrations !== null)
      ? { ...flexCeleb.celebrations }
      : {};

    // Toggle the enabled state for this celebration
    const playerCelebs = currentCelebrations[playerId] || [];
    const updatedCelebs = playerCelebs.map(c => {
      if (c.type === flexType) {
        // Treat undefined/true as enabled, then toggle
        const wasEnabled = c.enabled !== false;
        console.log(`Conan | Toggling celebration ${c.type}: ${wasEnabled} -> ${!wasEnabled}`);
        return { ...c, enabled: !wasEnabled };
      }
      return c;
    });
    currentCelebrations[playerId] = updatedCelebs;

    // Save
    const currentPlayers = Array.isArray(flexCeleb.players) ? flexCeleb.players : [];
    await game.settings.set('conan', 'flexCelebrations', {
      enabled: flexCeleb.enabled !== false,
      players: currentPlayers,
      celebrations: currentCelebrations
    });

    this.render(false);
  }

  _onCelebrationPlay(event) {
    event.preventDefault();
    event.stopPropagation();

    const btn = event.currentTarget;
    const flexType = btn.dataset.type;
    const playerId = btn.dataset.playerId;

    if (!playerId || !flexType) return;

    // Get celebration data from settings
    const flexCeleb = game.settings.get('conan', 'flexCelebrations') || {};
    const celebrations = flexCeleb.celebrations || {};
    const playerCelebs = celebrations[playerId] || [];
    const celeb = playerCelebs.find(c => c.type === flexType);

    if (!celeb) {
      ui.notifications.warn("No celebration data found.");
      return;
    }

    // Build celebData for playFlexCelebration
    let celebData;
    if (celeb.images && Array.isArray(celeb.images)) {
      const validImages = celeb.images.filter(img => img.path);
      if (validImages.length > 0) {
        celebData = {
          duration: celeb.duration || 1.5,
          images: celeb.images,
          effects: celeb.effects || {},
          adjustments: celeb.adjustments || {},
          sounds: celeb.sounds || {}
        };
      }
    }

    if (!celebData) {
      ui.notifications.warn("No images configured for this celebration.");
      return;
    }

    // Play it!
    playFlexCelebration(celebData);
  }

  _onAddFlexPlayer(event) {
    event.preventDefault();
    event.stopPropagation();

    // Read from world settings
    const flexCeleb = game.settings.get('conan', 'flexCelebrations') || {};

    // Get current players (actor IDs) - ensure it's an array
    const currentPlayers = Array.isArray(flexCeleb.players) ? flexCeleb.players : [];

    // Get all character2 actors that aren't already added
    const availableActors = game.actors.filter(a =>
      a.type === 'character2' && !currentPlayers.includes(a.id)
    );

    if (availableActors.length === 0) {
      ui.notifications.warn("All characters have already been added.");
      return;
    }

    // Build options for dialog
    const options = availableActors.map(a => `<option value="${a.id}">${a.name}</option>`).join('');

    const content = `
      <form>
        <div class="form-group">
          <label>Select Character</label>
          <select name="actorId" style="width: 100%;">
            ${options}
          </select>
        </div>
      </form>
    `;

    const sheet = this;

    new Dialog({
      title: "Add Character",
      content: content,
      buttons: {
        add: {
          icon: '<i class="fas fa-plus"></i>',
          label: "Add",
          callback: async (html) => {
            const actorId = html.find('[name="actorId"]').val();
            if (actorId) {
              const newPlayers = [...currentPlayers, actorId];

              // Get current celebrations (ensure it's an object)
              const currentCelebrations = (typeof flexCeleb.celebrations === 'object' && flexCeleb.celebrations !== null)
                ? flexCeleb.celebrations
                : {};

              // Use world settings for reliable storage
              const settingsData = {
                enabled: flexCeleb.enabled !== false,
                players: newPlayers,
                celebrations: currentCelebrations
              };

              console.log('Conan | Saving to world settings:', JSON.stringify(settingsData));

              await game.settings.set('conan', 'flexCelebrations', settingsData);

              // Verify immediately
              const savedSettings = game.settings.get('conan', 'flexCelebrations');
              console.log('Conan | VERIFY saved settings:', JSON.stringify(savedSettings));

              if (savedSettings?.players?.includes(actorId)) {
                console.log('Conan | SUCCESS - player saved correctly');
                ui.notifications.info(`Added ${game.actors.get(actorId)?.name || 'character'} to flex celebrations.`);
              } else {
                console.error('Conan | FAILED - player NOT in saved settings!');
              }

              sheet.render(false);
            }
          }
        },
        cancel: {
          icon: '<i class="fas fa-times"></i>',
          label: "Cancel"
        }
      },
      default: "add"
    }, {
      classes: ["dialog", "bpm-dialog-window"],
      width: 300
    }).render(true);
  }

  async _onRemoveFlexPlayer(event) {
    event.preventDefault();
    event.stopPropagation();

    if (!this._selectedFlexPlayerId) {
      ui.notifications.warn("Select a player to remove.");
      return;
    }

    // Read from world settings
    const flexCeleb = game.settings.get('conan', 'flexCelebrations') || {};
    const currentPlayers = Array.isArray(flexCeleb.players) ? flexCeleb.players : [];
    const newPlayers = currentPlayers.filter(id => id !== this._selectedFlexPlayerId);

    // Get current celebrations, removing this player's celebrations too
    const currentCelebrations = (typeof flexCeleb.celebrations === 'object' && flexCeleb.celebrations !== null)
      ? { ...flexCeleb.celebrations }
      : {};
    delete currentCelebrations[this._selectedFlexPlayerId];

    // Clear selection
    this._selectedFlexPlayerId = null;

    // Save to world settings
    await game.settings.set('conan', 'flexCelebrations', {
      enabled: flexCeleb.enabled !== false,
      players: newPlayers,
      celebrations: currentCelebrations
    });

    console.log('Conan | Removed player from flex celebrations, new list:', newPlayers);
  }

  _onEditCelebration(event) {
    event.preventDefault();
    event.stopPropagation();

    if (!this._selectedFlexPlayerId) {
      ui.notifications.warn("Select a character first.");
      return;
    }

    // Get the selected actor
    const actor = game.actors.get(this._selectedFlexPlayerId);
    if (!actor) {
      ui.notifications.warn("Character not found.");
      return;
    }

    const tokenImg = actor.prototypeToken?.texture?.src || actor.img || 'icons/svg/mystery-man.svg';

    // Flex trigger types based on rules reference
    const flexTypes = [
      { id: 'attack', label: 'Attack Roll', icon: 'fa-swords', description: 'Melee, Ranged, Thrown attacks' },
      { id: 'damage', label: 'Damage Roll', icon: 'fa-burst', description: 'Weapon damage rolls' },
      { id: 'skill', label: 'Skill Check', icon: 'fa-dice-d20', description: 'Non-combat skill checks' },
      { id: 'spell', label: 'Spell Roll', icon: 'fa-wand-sparkles', description: 'Sorcery attack rolls' },
      { id: 'spellDamage', label: 'Spell Damage', icon: 'fa-fire', description: 'Sorcery damage rolls' },
      { id: 'deathSave', label: 'Death Save', icon: 'fa-skull', description: 'Grit check at 0 LP' }
    ];

    const typeButtons = flexTypes.map(t => `
      <button type="button" class="flex-type-btn" data-type="${t.id}">
        <i class="fas ${t.icon}"></i>
        <span class="flex-type-label">${t.label}</span>
        <span class="flex-type-desc">${t.description}</span>
      </button>
    `).join('');

    const content = `
      <div class="flex-celebration-editor">
        <div class="celeb-header">
          <div class="celeb-token">
            <img src="${tokenImg}" alt="${actor.name}">
          </div>
          <div class="celeb-name">${actor.name}</div>
        </div>

        <div class="celeb-type-label">Select Flex Trigger Type</div>
        <div class="flex-type-grid">
          ${typeButtons}
        </div>
      </div>
    `;

    const sheet = this;
    const playerId = this._selectedFlexPlayerId;

    const dialog = new Dialog({
      title: `${actor.name} - Add Celebration`,
      content: content,
      buttons: {
        cancel: {
          icon: '<i class="fas fa-times"></i>',
          label: "Close"
        }
      },
      default: "cancel",
      render: (html) => {
        // Flex type buttons - add celebration and close
        html.find('.flex-type-btn').click(async (ev) => {
          const flexType = ev.currentTarget.dataset.type;

          // Get current flexCelebration data from world settings
          const flexCeleb = game.settings.get('conan', 'flexCelebrations') || {};
          const currentCelebrations = (typeof flexCeleb.celebrations === 'object' && flexCeleb.celebrations !== null)
            ? { ...flexCeleb.celebrations }
            : {};
          const playerCelebs = currentCelebrations[playerId] || [];

          // Check if this type already exists
          if (Array.isArray(playerCelebs) && playerCelebs.some(c => c.type === flexType)) {
            ui.notifications.warn(`${actor.name} already has a celebration for this trigger type.`);
            return;
          }

          // Add new celebration with default values (4 layered images)
          const newCeleb = {
            type: flexType,
            image1: '',
            image2: '',
            image3: '',
            image4: ''
          };

          const updatedCelebs = Array.isArray(playerCelebs) ? [...playerCelebs, newCeleb] : [newCeleb];
          currentCelebrations[playerId] = updatedCelebs;

          // Save to world settings
          const currentPlayers = Array.isArray(flexCeleb.players) ? flexCeleb.players : [];
          await game.settings.set('conan', 'flexCelebrations', {
            enabled: flexCeleb.enabled !== false,
            players: currentPlayers,
            celebrations: currentCelebrations
          });

          const typeLabel = flexTypes.find(t => t.id === flexType)?.label || flexType;
          ui.notifications.info(`Added ${typeLabel} celebration for ${actor.name}`);
          console.log('Conan | Added celebration type:', flexType, 'for player:', playerId);

          // Close the dialog and refresh the sheet
          dialog.close();
          sheet.render(false);
        });
      }
    }, {
      classes: ["dialog", "bpm-dialog-window", "flex-celebration-dialog"],
      width: 360
    });

    dialog.render(true);
  }

  _onCelebrationBadgeClick(event) {
    event.preventDefault();
    event.stopPropagation();

    // Ignore clicks on the toggle or play button elements
    if ($(event.target).hasClass('flex-celeb-badge-toggle') ||
        $(event.target).hasClass('flex-celeb-badge-play') ||
        $(event.target).closest('.flex-celeb-badge-play').length) {
      return;
    }

    const flexType = event.currentTarget.dataset.type;
    const playerId = event.currentTarget.dataset.playerId;
    if (!playerId || !flexType) return;

    const actor = game.actors.get(playerId);
    if (!actor) return;

    // Get current celebration data from world settings
    const flexCelebData = game.settings.get('conan', 'flexCelebrations') || {};
    const celebrations = flexCelebData.celebrations || {};
    const playerCelebs = celebrations[playerId] || [];
    const celeb = playerCelebs.find(c => c.type === flexType) || {};

    const flexTypeLabels = {
      attack: 'Attack Roll',
      damage: 'Damage Roll',
      skill: 'Skill Check',
      spell: 'Spell Roll',
      spellDamage: 'Spell Damage',
      deathSave: 'Death Save'
    };

    // Default animation settings for each layer
    const defaultAnimations = {
      1: { enterDir: 'none', exitDir: 'none', startFrame: 1, centerFrame: 1, exitFrame: 30, endFrame: 30 },
      2: { enterDir: 'none', exitDir: 'none', startFrame: 16, centerFrame: 16, exitFrame: 25, endFrame: 25 },
      3: { enterDir: 'left', exitDir: 'none', startFrame: 3, centerFrame: 8, exitFrame: 15, endFrame: 15 },
      4: { enterDir: 'none', exitDir: 'right', startFrame: 16, centerFrame: 16, exitFrame: 20, endFrame: 28 }
    };

    // Direction options
    const directionOptions = ['none', 'left', 'right', 'top', 'bottom'];

    // Get current duration or default to 1.5
    const currentDuration = celeb.duration || 1.5;

    // Card labels
    const cardLabels = {
      1: 'Battlecry',
      2: 'Effect',
      3: 'Attack',
      4: 'Impact'
    };

    // Build image layer inputs with animation controls
    const imageInputs = [1, 2, 3, 4].map(num => {
      const imgData = celeb.images?.[num - 1] || {};
      const defaults = defaultAnimations[num];
      const enterDir = imgData.enterDirection || defaults.enterDir;
      const exitDir = imgData.exitDirection || defaults.exitDir;
      const startFrame = imgData.startFrame ?? defaults.startFrame;
      const centerFrame = imgData.centerFrame ?? defaults.centerFrame;
      const exitFrame = imgData.exitFrame ?? defaults.exitFrame;
      const endFrame = imgData.endFrame ?? defaults.endFrame;
      const imagePath = imgData.path || celeb['image' + num] || '';
      const layerOrder = imgData.layerOrder ?? num;

      return `
        <div class="celeb-layer-card" data-card="${num}">
          <div class="celeb-layer-header">
            <span class="celeb-layer-label">${cardLabels[num]}</span>
            <div class="celeb-layer-order">
              <button type="button" class="layer-visibility-btn active" data-card="${num}" title="Toggle Visibility">
                <i class="fas fa-eye"></i>
              </button>
              <span class="layer-order-label">Layer:</span>
              <div class="layer-order-btns" data-card="${num}">
                ${[1, 2, 3, 4].map(n => `<button type="button" class="layer-order-btn ${n === layerOrder ? 'selected' : ''}" data-order="${n}">${n}</button>`).join('')}
              </div>
              <input type="hidden" name="layerOrder${num}" value="${layerOrder}">
              <input type="hidden" name="layerVisible${num}" value="true">
            </div>
          </div>

          <div class="celeb-layer-image">
            <div class="celeb-layer-preview" data-preview="${num}">
              ${imagePath ? `<img src="${imagePath}">` : '<span class="no-image"><i class="fas fa-image"></i></span>'}
            </div>
            <div class="celeb-layer-picker">
              <input type="text" name="image${num}" value="${imagePath}" placeholder="...">
              <button type="button" class="celeb-browse-btn" data-target="image${num}"><i class="fas fa-folder-open"></i></button>
            </div>
          </div>

          <div class="celeb-anim-controls">
            <div class="celeb-anim-row">
              <div class="celeb-anim-field">
                <label>Enter</label>
                <select name="enterDir${num}">
                  ${directionOptions.map(d => `<option value="${d}" ${d === enterDir ? 'selected' : ''}>${d === 'none' ? 'Appear' : d.charAt(0).toUpperCase() + d.slice(1)}</option>`).join('')}
                </select>
              </div>
              <div class="celeb-anim-field">
                <label>Exit</label>
                <select name="exitDir${num}">
                  ${directionOptions.map(d => `<option value="${d}" ${d === exitDir ? 'selected' : ''}>${d === 'none' ? 'Disappear' : d.charAt(0).toUpperCase() + d.slice(1)}</option>`).join('')}
                </select>
              </div>
            </div>
            <div class="celeb-anim-row celeb-frame-row">
              <div class="celeb-frame-field">
                <label>Start</label>
                <input type="number" name="startFrame${num}" value="${startFrame}" min="1" max="30">
              </div>
              <div class="celeb-frame-field">
                <label>Center</label>
                <input type="number" name="centerFrame${num}" value="${centerFrame}" min="1" max="30">
              </div>
              <div class="celeb-frame-field">
                <label>Exit</label>
                <input type="number" name="exitFrame${num}" value="${exitFrame}" min="1" max="30">
              </div>
              <div class="celeb-frame-field">
                <label>End</label>
                <input type="number" name="endFrame${num}" value="${endFrame}" min="1" max="30">
              </div>
            </div>
          </div>
        </div>
      `;
    }).join('');

    const content = `
      <div class="flex-celebration-editor celeb-editor-v2">
        <!-- TOP: Layer Cards (Image Pickers) -->
        <div class="celeb-layers-section">
          <div class="celeb-layers-grid">
            ${imageInputs}
          </div>
        </div>

        <!-- MIDDLE: Duration + Actions -->
        <div class="celeb-middle-section">
          <div class="celeb-duration-control">
            <label>Animation Duration</label>
            <div class="celeb-duration-slider">
              <span class="duration-label">1s</span>
              <input type="range" name="duration" min="1" max="3" step="0.1" value="${currentDuration}">
              <span class="duration-label">3s</span>
            </div>
            <div class="duration-value"><span class="duration-display">${currentDuration}</span> seconds (30 frames)</div>
          </div>
          <div class="celeb-middle-actions">
            <button type="button" class="celeb-action-btn celeb-test-btn" title="Test Animation">
              <i class="fas fa-play"></i> <span>Play</span>
            </button>
            <button type="button" class="celeb-action-btn celeb-save-btn" title="Save Celebration">
              <i class="fas fa-save"></i> <span>Save</span>
            </button>
            <button type="button" class="celeb-action-btn celeb-delete-btn" title="Delete Celebration">
              <i class="fas fa-trash"></i> <span>Delete</span>
            </button>
            <button type="button" class="celeb-action-btn celeb-cancel-btn" title="Cancel">
              <i class="fas fa-times"></i> <span>Cancel</span>
            </button>
          </div>
        </div>

        <!-- BOTTOM: Placeholder + Preview + SFX Panel -->
        <div class="celeb-bottom-section">
          <div class="celeb-bottom-left">
            <div class="celeb-adjust-panel">
              <!-- Image Select -->
              <div class="adjust-row layer-select-row">
                <span class="adjust-label">Image</span>
                <div class="layer-radio-group">
                  <label class="layer-radio"><input type="radio" name="adjustLayer" value="1" checked><span>1</span></label>
                  <label class="layer-radio"><input type="radio" name="adjustLayer" value="2"><span>2</span></label>
                  <label class="layer-radio"><input type="radio" name="adjustLayer" value="3"><span>3</span></label>
                  <label class="layer-radio"><input type="radio" name="adjustLayer" value="4"><span>4</span></label>
                </div>
              </div>
              <!-- Position -->
              <div class="adjust-row">
                <span class="adjust-label">Pos X/Y</span>
                <input type="range" class="adjust-slider" name="adjustPosX" min="0" max="100" value="50">
                <input type="range" class="adjust-slider" name="adjustPosY" min="0" max="100" value="50">
              </div>
              <!-- Size -->
              <div class="adjust-row">
                <span class="adjust-label">Size W/H</span>
                <input type="range" class="adjust-slider" name="adjustWidth" min="10" max="200" value="100">
                <input type="range" class="adjust-slider" name="adjustHeight" min="10" max="200" value="100">
              </div>
              <!-- Angle + Flip -->
              <div class="adjust-row">
                <span class="adjust-label">Angle</span>
                <input type="number" class="adjust-input" name="adjustAngle" min="-360" max="360" value="0">
                <span class="adjust-label flip-label">Flip</span>
                <button type="button" class="adjust-flip-btn" name="adjustFlipH" title="Flip Horizontal">↔</button>
                <button type="button" class="adjust-flip-btn" name="adjustFlipV" title="Flip Vertical">↕</button>
              </div>

              <!-- Sound Controls -->
              <div class="sound-controls-section">
                <div class="sound-title">SOUNDS</div>
                <div class="sound-select-row">
                  <button type="button" class="sound-type-btn active" data-sound="activation"><i class="fas fa-music"></i> Activation</button>
                  <button type="button" class="sound-type-btn" data-sound="intro"><i class="fas fa-music"></i> Intro</button>
                  <button type="button" class="sound-type-btn" data-sound="effect"><i class="fas fa-music"></i> Effect</button>
                  <button type="button" class="sound-type-btn" data-sound="exit"><i class="fas fa-music"></i> Exit</button>
                </div>
                <div class="sound-options">
                  <div class="sound-opt-row">
                    <span class="sound-opt-label">Frames</span>
                    <input type="text" class="sound-opt-input" name="soundFrames" value="1/5" placeholder="1/30">
                    <span class="sound-opt-label">Vol</span>
                    <input type="number" class="sound-opt-input sound-vol" name="soundVol" min="0" max="3" step="0.1" value="1">
                  </div>
                  <div class="sound-opt-row">
                    <span class="sound-opt-label">In</span>
                    <input type="text" class="sound-opt-input" name="soundFadeIn" value="0/0" placeholder="0/5">
                    <span class="sound-opt-label">Out</span>
                    <input type="text" class="sound-opt-input" name="soundFadeOut" value="0/0" placeholder="25/30">
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div class="celeb-splitter" data-splitter="left"></div>

          <div class="celeb-bottom-center">
            <div class="celeb-preview-box" id="celeb-live-preview">
              <div class="celeb-preview-canvas">
                <div class="celeb-preview-layers"></div>
              </div>
              <span class="celeb-frame-indicator">Frame 15</span>
            </div>
          </div>

          <div class="celeb-splitter" data-splitter="right"></div>

          <div class="celeb-bottom-right">
            <div class="celeb-effects-panel">
              <div class="sfx-grid">
                <div class="sfx-header">
                  <span class="sfx-title">Special Effects</span>
                  <span class="sfx-layer-num">1</span>
                  <span class="sfx-layer-num">2</span>
                  <span class="sfx-layer-num">3</span>
                  <span class="sfx-layer-num">4</span>
                </div>
                <div class="sfx-subheader">
                  <span class="sfx-col-label"></span>
                  <span class="sfx-col-label">Magnitude</span>
                  <span class="sfx-col-label">Time</span>
                  <span class="sfx-col-label">START/END</span>
                  <span class="sfx-col-label">START/END</span>
                  <span class="sfx-col-label">START/END</span>
                  <span class="sfx-col-label">START/END</span>
                </div>
                <div class="sfx-row">
                  <span class="sfx-name">Shake</span>
                  <div class="sfx-slider-wrap" title="Amount: Distance of displacement. 0 = no movement"><input type="range" class="sfx-slider" name="shake_amount" min="0" max="100" value="50"></div>
                  <div class="sfx-slider-wrap" title="Speed: How fast it jitters. High + low amount = nervous buzz"><input type="range" class="sfx-slider" name="shake_speed" min="0" max="100" value="50"></div>
                  <input type="text" class="sfx-input" name="sfx_shake_1" placeholder="">
                  <input type="text" class="sfx-input" name="sfx_shake_2" placeholder="">
                  <input type="text" class="sfx-input" name="sfx_shake_3" placeholder="">
                  <input type="text" class="sfx-input" name="sfx_shake_4" placeholder="">
                </div>
                <div class="sfx-row">
                  <span class="sfx-name">Pulse</span>
                  <div class="sfx-slider-wrap" title="Strength: Scale range (1.0 to 1.15). 0 = locked scale"><input type="range" class="sfx-slider" name="pulse_strength" min="0" max="100" value="50"></div>
                  <div class="sfx-slider-wrap" title="Rate: Pulses per second. Low = breathing, high = heartbeat"><input type="range" class="sfx-slider" name="pulse_rate" min="0" max="100" value="50"></div>
                  <input type="text" class="sfx-input" name="sfx_pulse_1" placeholder="">
                  <input type="text" class="sfx-input" name="sfx_pulse_2" placeholder="">
                  <input type="text" class="sfx-input" name="sfx_pulse_3" placeholder="">
                  <input type="text" class="sfx-input" name="sfx_pulse_4" placeholder="">
                </div>
                <div class="sfx-row">
                  <span class="sfx-name">Glow</span>
                  <div class="sfx-slider-wrap" title="Intensity: Glow size + brightness. 0 = invisible glow"><input type="range" class="sfx-slider" name="glow_intensity" min="0" max="100" value="50"></div>
                  <div class="sfx-slider-wrap" title="Rate: Pulse speed. Low = ominous aura, high = magical charge"><input type="range" class="sfx-slider" name="glow_rate" min="0" max="100" value="50"></div>
                  <input type="text" class="sfx-input" name="sfx_glow_1" placeholder="">
                  <input type="text" class="sfx-input" name="sfx_glow_2" placeholder="">
                  <input type="text" class="sfx-input" name="sfx_glow_3" placeholder="">
                  <input type="text" class="sfx-input" name="sfx_glow_4" placeholder="">
                </div>
                <div class="sfx-row">
                  <span class="sfx-name">Spin</span>
                  <div class="sfx-slider-wrap" title="Turns: Total rotation (0-4 turns). 0 = no spin ever"><input type="range" class="sfx-slider" name="spin_turns" min="0" max="100" value="50"></div>
                  <div class="sfx-slider-wrap" title="Time: Duration of spin. Short = anime snap, long = ceremonial"><input type="range" class="sfx-slider" name="spin_time" min="0" max="100" value="50"></div>
                  <input type="text" class="sfx-input" name="sfx_spin_1" placeholder="">
                  <input type="text" class="sfx-input" name="sfx_spin_2" placeholder="">
                  <input type="text" class="sfx-input" name="sfx_spin_3" placeholder="">
                  <input type="text" class="sfx-input" name="sfx_spin_4" placeholder="">
                </div>
                <div class="sfx-row">
                  <span class="sfx-name">Bounce</span>
                  <div class="sfx-slider-wrap" title="Height: How far it bounces up/down"><input type="range" class="sfx-slider" name="bounce_height" min="0" max="100" value="50"></div>
                  <div class="sfx-slider-wrap" title="Elasticity: Low = dead thump, high = cartoony spring"><input type="range" class="sfx-slider" name="bounce_elasticity" min="0" max="100" value="50"></div>
                  <input type="text" class="sfx-input" name="sfx_bounce_1" placeholder="">
                  <input type="text" class="sfx-input" name="sfx_bounce_2" placeholder="">
                  <input type="text" class="sfx-input" name="sfx_bounce_3" placeholder="">
                  <input type="text" class="sfx-input" name="sfx_bounce_4" placeholder="">
                </div>
                <div class="sfx-row">
                  <span class="sfx-name">Blur</span>
                  <div class="sfx-slider-wrap" title="Strength: Max blur radius. 0 = razor sharp"><input type="range" class="sfx-slider" name="blur_strength" min="0" max="100" value="50"></div>
                  <div class="sfx-slider-wrap" title="Duration: Time to blur/unblur. Long = dreamlike, short = impact"><input type="range" class="sfx-slider" name="blur_duration" min="0" max="100" value="50"></div>
                  <input type="text" class="sfx-input" name="sfx_blur_1" placeholder="">
                  <input type="text" class="sfx-input" name="sfx_blur_2" placeholder="">
                  <input type="text" class="sfx-input" name="sfx_blur_3" placeholder="">
                  <input type="text" class="sfx-input" name="sfx_blur_4" placeholder="">
                </div>
                <div class="sfx-row">
                  <span class="sfx-name">Flash</span>
                  <div class="sfx-slider-wrap" title="Intensity: Brightness/whiteness of the flash"><input type="range" class="sfx-slider" name="flash_intensity" min="0" max="100" value="50"></div>
                  <div class="sfx-slider-wrap" title="Duration: Total flash time. Short = impact hit"><input type="range" class="sfx-slider" name="flash_duration" min="0" max="100" value="50"></div>
                  <input type="text" class="sfx-input" name="sfx_flash_1" placeholder="">
                  <input type="text" class="sfx-input" name="sfx_flash_2" placeholder="">
                  <input type="text" class="sfx-input" name="sfx_flash_3" placeholder="">
                  <input type="text" class="sfx-input" name="sfx_flash_4" placeholder="">
                </div>
                <div class="sfx-row">
                  <span class="sfx-name">Flicker</span>
                  <div class="sfx-slider-wrap" title="Range: Opacity variance. 0 = stable, high = unstable"><input type="range" class="sfx-slider" name="flicker_range" min="0" max="100" value="50"></div>
                  <div class="sfx-slider-wrap" title="Speed: How often it changes. Low = dying torch, high = broken CRT"><input type="range" class="sfx-slider" name="flicker_speed" min="0" max="100" value="50"></div>
                  <input type="text" class="sfx-input" name="sfx_flicker_1" placeholder="">
                  <input type="text" class="sfx-input" name="sfx_flicker_2" placeholder="">
                  <input type="text" class="sfx-input" name="sfx_flicker_3" placeholder="">
                  <input type="text" class="sfx-input" name="sfx_flicker_4" placeholder="">
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;

    const sheet = this;

    // Helper to collect form data
    const collectFormData = (html) => {
      const duration = parseFloat(html.find('[name="duration"]').val()) || 1.5;
      const images = [1, 2, 3, 4].map(num => ({
        path: html.find(`[name="image${num}"]`).val() || '',
        layerOrder: parseInt(html.find(`[name="layerOrder${num}"]`).val()) || num,
        enterDirection: html.find(`[name="enterDir${num}"]`).val() || 'none',
        exitDirection: html.find(`[name="exitDir${num}"]`).val() || 'none',
        startFrame: parseInt(html.find(`[name="startFrame${num}"]`).val()) || 1,
        centerFrame: parseInt(html.find(`[name="centerFrame${num}"]`).val()) || 1,
        exitFrame: parseInt(html.find(`[name="exitFrame${num}"]`).val()) || 30,
        endFrame: parseInt(html.find(`[name="endFrame${num}"]`).val()) || 30
      }));

      // Collect effect settings - slider values and per-layer timing
      const effectTypes = ['shake', 'pulse', 'glow', 'spin', 'bounce', 'blur', 'flash', 'flicker'];
      const effectSliderNames = {
        shake: ['amount', 'speed'],
        pulse: ['strength', 'rate'],
        glow: ['intensity', 'rate'],
        spin: ['turns', 'time'],
        bounce: ['height', 'elasticity'],
        blur: ['strength', 'duration'],
        flash: ['intensity', 'duration'],
        flicker: ['range', 'speed']
      };

      const effects = {};
      effectTypes.forEach(effect => {
        const [slider1Name, slider2Name] = effectSliderNames[effect];
        effects[effect] = {
          slider1: parseInt(html.find(`[name="${effect}_${slider1Name}"]`).val()) || 50,
          slider2: parseInt(html.find(`[name="${effect}_${slider2Name}"]`).val()) || 50,
          layers: {}
        };

        // Get start/end frames for each layer (format: "start/end" like "01/20")
        [1, 2, 3, 4].forEach(layerNum => {
          const inputVal = html.find(`[name="sfx_${effect}_${layerNum}"]`).val() || '';
          if (inputVal.trim()) {
            const parts = inputVal.split('/').map(s => parseInt(s.trim()));
            if (parts.length === 2 && !isNaN(parts[0]) && !isNaN(parts[1])) {
              effects[effect].layers[layerNum] = { start: parts[0], end: parts[1] };
            }
          }
        });
      });

      return { duration, images, effects };
    };

    // Helper to save celebration
    const saveCelebration = async (html, adjustments, sounds) => {
      const { duration, images, effects } = collectFormData(html);

      const flexCeleb = game.settings.get('conan', 'flexCelebrations') || {};
      const currentCelebrations = (typeof flexCeleb.celebrations === 'object' && flexCeleb.celebrations !== null)
        ? { ...flexCeleb.celebrations }
        : {};

      const updatedCelebs = (currentCelebrations[playerId] || []).map(c => {
        if (c.type === flexType) {
          return { type: flexType, enabled: c.enabled !== false, duration, images, effects, adjustments, sounds };
        }
        return c;
      });
      currentCelebrations[playerId] = updatedCelebs;

      const currentPlayers = Array.isArray(flexCeleb.players) ? flexCeleb.players : [];
      await game.settings.set('conan', 'flexCelebrations', {
        enabled: flexCeleb.enabled !== false,
        players: currentPlayers,
        celebrations: currentCelebrations
      });

      ui.notifications.info(`Celebration saved`);
      sheet.render(false);
    };

    const dialog = new Dialog({
      title: `${actor.name} - ${flexTypeLabels[flexType] || flexType}`,
      content: content,
      buttons: {
        close: {
          icon: '<i class="fas fa-times"></i>',
          label: "Close",
          callback: () => {}
        }
      },
      default: "close",
      render: (html) => {
        // Hide the default dialog buttons since we have our own in content
        html.closest('.dialog').find('.dialog-buttons').hide();

        // Prevent form submission on Enter key (which closes the dialog)
        html.on('keydown', 'input', (e) => {
          if (e.key === 'Enter') {
            e.preventDefault();
            e.stopPropagation();
          }
        });

        // Configure instant tooltips for SFX sliders
        const tooltipElements = html.find('.sfx-slider-wrap[title]');
        tooltipElements.each((_, el) => {
          const $el = $(el);
          const originalTitle = $el.attr('title');
          $el.removeAttr('title');

          const removeTooltip = () => {
            const tooltip = $el.data('celeb-tooltip');
            if (tooltip) {
              tooltip.remove();
              $el.off('mousemove.celebtooltip');
              $el.removeData('celeb-tooltip');
            }
          };

          $el.on('mouseenter', (event) => {
            const tooltip = $('<div>')
              .addClass('celeb-custom-tooltip')
              .text(originalTitle)
              .appendTo('body');

            const updatePosition = (e) => {
              tooltip.css({
                left: e.clientX + 15 + 'px',
                top: e.clientY + 15 + 'px'
              });
            };

            updatePosition(event);
            $el.on('mousemove.celebtooltip', updatePosition);
            $el.data('celeb-tooltip', tooltip);
          });

          $el.on('mouseleave', removeTooltip);
          $el.on('mousedown click', removeTooltip);
        });

        // Load saved effect values into the form
        const savedEffects = celeb.effects || {};
        const effectSliderNames = {
          shake: ['amount', 'speed'],
          pulse: ['strength', 'rate'],
          glow: ['intensity', 'rate'],
          spin: ['turns', 'time'],
          bounce: ['height', 'elasticity'],
          blur: ['strength', 'duration'],
          flash: ['intensity', 'duration'],
          flicker: ['range', 'speed']
        };

        Object.keys(effectSliderNames).forEach(effect => {
          const [slider1Name, slider2Name] = effectSliderNames[effect];
          const effectData = savedEffects[effect] || {};

          // Load slider values
          if (effectData.slider1 !== undefined) {
            html.find(`[name="${effect}_${slider1Name}"]`).val(effectData.slider1);
          }
          if (effectData.slider2 !== undefined) {
            html.find(`[name="${effect}_${slider2Name}"]`).val(effectData.slider2);
          }

          // Load layer timing (start/end format)
          if (effectData.layers) {
            [1, 2, 3, 4].forEach(layerNum => {
              const layerData = effectData.layers[layerNum];
              if (layerData && layerData.start !== undefined && layerData.end !== undefined) {
                const startStr = String(layerData.start).padStart(2, '0');
                const endStr = String(layerData.end).padStart(2, '0');
                html.find(`[name="sfx_${effect}_${layerNum}"]`).val(`${startStr}/${endStr}`);
              }
            });
          }
        });

        // Duration slider update
        html.find('[name="duration"]').on('input', (ev) => {
          html.find('.duration-display').text(ev.target.value);
        });

        // File browser buttons
        html.find('.celeb-browse-btn').click((ev) => {
          const target = ev.currentTarget.dataset.target;
          const layerNum = target.replace('image', '');

          new FilePicker({
            type: 'image',
            callback: (path) => {
              html.find(`[name="${target}"]`).val(path);
              const preview = html.find(`.celeb-layer-preview[data-preview="${layerNum}"]`);
              preview.html(`<img src="${path}">`);
            }
          }).render(true);
        });

        // Layer order button clicks
        html.find('.layer-order-btn').on('click', function(ev) {
          ev.preventDefault();
          ev.stopPropagation();

          const $btn = $(this);
          const newOrder = parseInt($btn.data('order'));
          const $btnGroup = $btn.closest('.layer-order-btns');
          const cardNum = $btnGroup.data('card');

          console.log('Conan | Layer order click - card:', cardNum, 'newOrder:', newOrder);

          // Check if this order is already used by another card
          const $currentHolder = html.find(`.layer-order-btns[data-card!="${cardNum}"] .layer-order-btn.selected[data-order="${newOrder}"]`);

          if ($currentHolder.length > 0) {
            // Swap: give the other card this card's current order
            const otherCard = $currentHolder.closest('.layer-order-btns').data('card');
            const myCurrentOrder = html.find(`[name="layerOrder${cardNum}"]`).val();

            console.log('Conan | Swapping with card:', otherCard, 'giving it order:', myCurrentOrder);

            // Update other card
            html.find(`.layer-order-btns[data-card="${otherCard}"] .layer-order-btn`).removeClass('selected');
            html.find(`.layer-order-btns[data-card="${otherCard}"] .layer-order-btn[data-order="${myCurrentOrder}"]`).addClass('selected');
            html.find(`[name="layerOrder${otherCard}"]`).val(myCurrentOrder);
          }

          // Update this card
          $btnGroup.find('.layer-order-btn').removeClass('selected');
          $btn.addClass('selected');
          html.find(`[name="layerOrder${cardNum}"]`).val(newOrder);

          console.log('Conan | Updated card', cardNum, 'to order', newOrder);
        });

        // Layer visibility toggle
        html.find('.layer-visibility-btn').on('click', function(ev) {
          ev.preventDefault();
          ev.stopPropagation();

          const $btn = $(this);
          const cardNum = $btn.data('card');
          const isVisible = $btn.hasClass('active');

          if (isVisible) {
            $btn.removeClass('active');
            $btn.find('i').removeClass('fa-eye').addClass('fa-eye-slash');
            html.find(`[name="layerVisible${cardNum}"]`).val('false');
          } else {
            $btn.addClass('active');
            $btn.find('i').removeClass('fa-eye-slash').addClass('fa-eye');
            html.find(`[name="layerVisible${cardNum}"]`).val('true');
          }

          // Update preview
          updatePreviewLayers();
        });

        // Test animation button
        html.find('.celeb-test-btn').click(() => {
          const { duration, images, effects } = collectFormData(html);
          const validImages = images.filter(img => img.path);

          if (validImages.length === 0) {
            ui.notifications.warn("Add at least one image to test.");
            return;
          }

          playFlexCelebration({ duration, images, effects, adjustments: layerAdjustments, sounds });
        });

        // Delete button
        html.find('.celeb-delete-btn').click(async () => {
          const confirmDelete = await Dialog.confirm({
            title: "Delete Celebration",
            content: `<p>Remove this celebration for ${actor.name}?</p>`
          });

          if (confirmDelete) {
            const flexCeleb = game.settings.get('conan', 'flexCelebrations') || {};
            const currentCelebrations = (typeof flexCeleb.celebrations === 'object' && flexCeleb.celebrations !== null)
              ? { ...flexCeleb.celebrations }
              : {};

            const updatedCelebs = (currentCelebrations[playerId] || []).filter(c => c.type !== flexType);
            currentCelebrations[playerId] = updatedCelebs;

            const currentPlayers = Array.isArray(flexCeleb.players) ? flexCeleb.players : [];
            await game.settings.set('conan', 'flexCelebrations', {
              enabled: flexCeleb.enabled !== false,
              players: currentPlayers,
              celebrations: currentCelebrations
            });

            ui.notifications.info(`Celebration removed`);
            dialog.close();
            sheet.render(false);
          }
        });

        // Save button (does not close the window)
        html.find('.celeb-save-btn').click(async () => {
          await saveCelebration(html, layerAdjustments, sounds);
        });

        // Cancel button
        html.find('.celeb-cancel-btn').click(() => {
          dialog.close();
        });

        // Frame-aware preview with scrubbing support
        const previewBox = html.find('#celeb-live-preview');
        const previewLayers = html.find('.celeb-preview-layers');
        const frameIndicator = html.find('.celeb-frame-indicator');
        let currentPreviewFrame = 15; // Default to middle frame
        let isScrubbing = false;

        // Layer adjustments (position, size, angle, flip)
        const layerAdjustments = celeb.adjustments || {
          1: { posX: 50, posY: 50, width: 100, height: 100, angle: 0, flipH: false, flipV: false },
          2: { posX: 50, posY: 50, width: 100, height: 100, angle: 0, flipH: false, flipV: false },
          3: { posX: 50, posY: 50, width: 100, height: 100, angle: 0, flipH: false, flipV: false },
          4: { posX: 50, posY: 50, width: 100, height: 100, angle: 0, flipH: false, flipV: false }
        };
        let currentAdjustLayer = 1;

        // Sound settings
        const sounds = celeb.sounds || {
          activation: { path: '', frames: '1/5', volume: 1, fadeIn: '0/0', fadeOut: '0/0' },
          intro: { path: '', frames: '1/10', volume: 1, fadeIn: '0/0', fadeOut: '0/0' },
          effect: { path: '', frames: '10/25', volume: 1, fadeIn: '0/0', fadeOut: '0/0' },
          exit: { path: '', frames: '25/30', volume: 1, fadeIn: '0/0', fadeOut: '0/0' }
        };

        // Helper: get position offset for enter/exit animations
        const getPositionOffset = (direction, progress) => {
          const offset = (1 - progress) * 120;
          switch (direction) {
            case 'left': return { x: -offset, y: 0 };
            case 'right': return { x: offset, y: 0 };
            case 'top': return { x: 0, y: -offset };
            case 'bottom': return { x: 0, y: offset };
            default: return { x: 0, y: 0 };
          }
        };

        // Helper: check if effect is active at frame
        const isEffectActive = (effects, effectName, layerNum, frame) => {
          const effect = effects[effectName];
          if (!effect || !effect.layers || !effect.layers[layerNum]) return false;
          const { start, end } = effect.layers[layerNum];
          return frame >= start && frame <= end;
        };

        // Helper: get effect progress
        const getEffectProgress = (effects, effectName, layerNum, frame) => {
          const effect = effects[effectName];
          if (!effect || !effect.layers || !effect.layers[layerNum]) return 0;
          const { start, end } = effect.layers[layerNum];
          if (frame < start || frame > end) return 0;
          return (frame - start) / Math.max(1, end - start);
        };

        // Calculate effects for a layer at a frame (simplified version for preview)
        const calculatePreviewEffects = (effects, layerNum, frame) => {
          const result = { translateX: 0, translateY: 0, scale: 1, rotate: 0, blur: 0, brightness: 1, opacity: 1, glow: 0 };

          if (isEffectActive(effects, 'shake', layerNum, frame)) {
            const shake = effects.shake;
            const amount = (shake.slider1 / 100) * 20;
            const speed = (shake.slider2 / 100) * 10 + 2;
            result.translateX = Math.sin(frame * speed) * amount;
            result.translateY = Math.cos(frame * speed * 0.7) * amount * 0.5;
          }
          if (isEffectActive(effects, 'pulse', layerNum, frame)) {
            const pulse = effects.pulse;
            const strength = (pulse.slider1 / 100) * 0.3;
            const rate = (pulse.slider2 / 100) * 8 + 1;
            const progress = getEffectProgress(effects, 'pulse', layerNum, frame);
            result.scale = 1 + Math.sin(progress * Math.PI * rate) * strength;
          }
          if (isEffectActive(effects, 'glow', layerNum, frame)) {
            const glow = effects.glow;
            const intensity = (glow.slider1 / 100) * 40;
            const rate = (glow.slider2 / 100) * 6 + 1;
            const progress = getEffectProgress(effects, 'glow', layerNum, frame);
            result.glow = intensity * (0.5 + 0.5 * Math.sin(progress * Math.PI * rate));
          }
          if (isEffectActive(effects, 'spin', layerNum, frame)) {
            const spin = effects.spin;
            const totalTurns = (spin.slider1 / 100) * 4;
            const progress = getEffectProgress(effects, 'spin', layerNum, frame);
            const easedProgress = progress < 0.5 ? 2 * progress * progress : 1 - Math.pow(-2 * progress + 2, 2) / 2;
            result.rotate = easedProgress * totalTurns * 360;
          }
          if (isEffectActive(effects, 'bounce', layerNum, frame)) {
            const bounce = effects.bounce;
            const height = (bounce.slider1 / 100) * 50;
            const elasticity = (bounce.slider2 / 100) * 0.8 + 0.2;
            const progress = getEffectProgress(effects, 'bounce', layerNum, frame);
            const decay = Math.exp(-progress * (1 - elasticity) * 3);
            result.translateY += Math.abs(Math.sin(progress * Math.PI * 4)) * height * decay * -1;
          }
          if (isEffectActive(effects, 'blur', layerNum, frame)) {
            const blur = effects.blur;
            const strength = (blur.slider1 / 100) * 15;
            const progress = getEffectProgress(effects, 'blur', layerNum, frame);
            result.blur = strength * Math.sin(progress * Math.PI);
          }
          if (isEffectActive(effects, 'flash', layerNum, frame)) {
            const flash = effects.flash;
            const intensity = (flash.slider1 / 100) * 3 + 1;
            const progress = getEffectProgress(effects, 'flash', layerNum, frame);
            result.brightness = 1 + (intensity - 1) * Math.pow(1 - progress, 2);
          }
          if (isEffectActive(effects, 'flicker', layerNum, frame)) {
            const flicker = effects.flicker;
            const range = (flicker.slider1 / 100) * 0.8;
            const speed = Math.floor((flicker.slider2 / 100) * 5) + 1;
            const seed = (frame * speed * layerNum) % 100;
            const noise = Math.sin(seed * 12.9898) * 43758.5453;
            result.opacity = 1 - ((noise - Math.floor(noise)) * range);
          }
          return result;
        };

        // Update preview at a specific frame
        const updatePreviewAtFrame = (frame) => {
          const { images, effects } = collectFormData(html);

          // Check visibility for each layer
          const visibleImages = images.map((img, idx) => {
            const layerNum = idx + 1;
            const isVisible = html.find(`[name="layerVisible${layerNum}"]`).val() !== 'false';
            return { ...img, layerNum, isVisible };
          }).filter(img => img.path && img.isVisible);

          if (visibleImages.length === 0) {
            previewLayers.html('');
            frameIndicator.text('No layers');
            return;
          }

          // Sort by layer order
          const sorted = [...visibleImages].sort((a, b) => a.layerOrder - b.layerOrder);

          previewLayers.html(sorted.map((img) => {
            const { startFrame, centerFrame, exitFrame, endFrame, enterDirection, exitDirection, layerNum } = img;

            // Check if layer is visible at this frame
            if (frame < startFrame || frame > endFrame) {
              return `<div class="preview-layer" style="z-index: ${100 - img.layerOrder}; opacity: 0;"></div>`;
            }

            // Calculate position from enter/exit
            let baseX = 0, baseY = 0;
            if (frame < centerFrame && enterDirection !== 'none') {
              const enterProgress = (frame - startFrame) / Math.max(1, centerFrame - startFrame);
              const offset = getPositionOffset(enterDirection, enterProgress);
              baseX = offset.x;
              baseY = offset.y;
            } else if (frame >= exitFrame && exitDirection !== 'none') {
              const exitProgress = 1 - ((frame - exitFrame) / Math.max(1, endFrame - exitFrame));
              const offset = getPositionOffset(exitDirection, exitProgress);
              baseX = offset.x;
              baseY = offset.y;
            }

            // Calculate effects
            const fx = calculatePreviewEffects(effects, layerNum, frame);
            // Get layer adjustments
            const adj = layerAdjustments[layerNum] || { posX: 50, posY: 50, width: 100, height: 100, angle: 0, flipH: false, flipV: false };

            // Position: 50 = center, 0 = -50%, 100 = +50%
            const adjX = (adj.posX - 50);
            const adjY = (adj.posY - 50);
            const totalX = baseX + (fx.translateX / 5) + adjX;
            const totalY = baseY + (fx.translateY / 5) + adjY;

            let transform = `translate(${totalX}%, ${totalY}%)`;
            if (fx.scale !== 1) transform += ` scale(${fx.scale})`;
            if (fx.rotate !== 0) transform += ` rotate(${fx.rotate}deg)`;
            if (adj.angle !== 0) transform += ` rotate(${adj.angle}deg)`;

            // Size and flip for the image
            const scaleX = (adj.width / 100) * (adj.flipH ? -1 : 1);
            const scaleY = (adj.height / 100) * (adj.flipV ? -1 : 1);
            const imgTransform = `scale(${scaleX}, ${scaleY})`;

            const filters = [];
            if (fx.blur > 0) filters.push(`blur(${fx.blur}px)`);
            if (fx.brightness !== 1) filters.push(`brightness(${fx.brightness})`);
            if (fx.glow > 0) filters.push(`drop-shadow(0 0 ${fx.glow}px rgba(255, 100, 100, 0.8))`);

            const filterStr = filters.length > 0 ? filters.join(' ') : 'none';

            return `
              <div class="preview-layer" style="z-index: ${100 - img.layerOrder}; opacity: ${fx.opacity}; transform: ${transform}; filter: ${filterStr};">
                <img src="${img.path}" style="transform: ${imgTransform};">
              </div>
            `;
          }).join(''));

          // Update frame indicator
          frameIndicator.text(`Frame ${frame}`);
        };

        // Wrapper for default view
        const updatePreviewLayers = () => {
          updatePreviewAtFrame(currentPreviewFrame);
        };

        // Scrubbing handlers
        previewBox.on('mousedown', (e) => {
          if (e.button !== 0) return; // Left click only
          isScrubbing = true;
          previewBox.addClass('scrubbing');
          const rect = previewBox[0].getBoundingClientRect();
          const x = e.clientX - rect.left;
          const frame = Math.round((x / rect.width) * 29) + 1; // 1-30
          currentPreviewFrame = Math.max(1, Math.min(30, frame));
          updatePreviewAtFrame(currentPreviewFrame);
        });

        $(document).on('mousemove.celebscrub', (e) => {
          if (!isScrubbing) return;
          const rect = previewBox[0].getBoundingClientRect();
          const x = e.clientX - rect.left;
          const frame = Math.round((x / rect.width) * 29) + 1;
          currentPreviewFrame = Math.max(1, Math.min(30, frame));
          updatePreviewAtFrame(currentPreviewFrame);
        });

        $(document).on('mouseup.celebscrub', () => {
          if (isScrubbing) {
            isScrubbing = false;
            previewBox.removeClass('scrubbing');
          }
        });

        // Layer Adjustment Panel - event handlers
        const updateAdjustPanel = () => {
          const adj = layerAdjustments[currentAdjustLayer];
          html.find('[name="adjustPosX"]').val(adj.posX);
          html.find('[name="adjustPosY"]').val(adj.posY);
          html.find('[name="adjustWidth"]').val(adj.width);
          html.find('[name="adjustHeight"]').val(adj.height);
          html.find('[name="adjustAngle"]').val(adj.angle);
          html.find('[name="adjustFlipH"]').toggleClass('active', adj.flipH);
          html.find('[name="adjustFlipV"]').toggleClass('active', adj.flipV);
        };

        // Layer radio change
        html.find('[name="adjustLayer"]').on('change', function() {
          currentAdjustLayer = parseInt($(this).val());
          updateAdjustPanel();
        });

        // Position/Size sliders
        html.find('[name="adjustPosX"], [name="adjustPosY"], [name="adjustWidth"], [name="adjustHeight"]').on('input', function() {
          const name = $(this).attr('name');
          const value = parseInt($(this).val());
          if (name === 'adjustPosX') layerAdjustments[currentAdjustLayer].posX = value;
          if (name === 'adjustPosY') layerAdjustments[currentAdjustLayer].posY = value;
          if (name === 'adjustWidth') layerAdjustments[currentAdjustLayer].width = value;
          if (name === 'adjustHeight') layerAdjustments[currentAdjustLayer].height = value;
          updatePreviewLayers();
        });

        // Angle input
        html.find('[name="adjustAngle"]').on('input', function() {
          layerAdjustments[currentAdjustLayer].angle = parseInt($(this).val()) || 0;
          updatePreviewLayers();
        });

        // Flip buttons
        html.find('[name="adjustFlipH"]').on('click', function() {
          layerAdjustments[currentAdjustLayer].flipH = !layerAdjustments[currentAdjustLayer].flipH;
          $(this).toggleClass('active', layerAdjustments[currentAdjustLayer].flipH);
          updatePreviewLayers();
        });
        html.find('[name="adjustFlipV"]').on('click', function() {
          layerAdjustments[currentAdjustLayer].flipV = !layerAdjustments[currentAdjustLayer].flipV;
          $(this).toggleClass('active', layerAdjustments[currentAdjustLayer].flipV);
          updatePreviewLayers();
        });

        // Sound Controls - event handlers
        let currentSoundType = 'activation';

        const updateSoundUI = () => {
          // Update button states
          html.find('.sound-type-btn').each(function() {
            const type = $(this).data('sound');
            $(this).toggleClass('active', type === currentSoundType);
            $(this).toggleClass('has-sound', !!sounds[type].path);
          });
          // Update inputs for selected sound
          const s = sounds[currentSoundType];
          html.find('[name="soundFrames"]').val(s.frames);
          html.find('[name="soundVol"]').val(s.volume);
          html.find('[name="soundFadeIn"]').val(s.fadeIn);
          html.find('[name="soundFadeOut"]').val(s.fadeOut);
        };

        // Sound type button click - select and open file picker
        html.find('.sound-type-btn').on('click', function() {
          const type = $(this).data('sound');
          currentSoundType = type;
          updateSoundUI();
          // Open file picker for the selected sound
          new FilePicker({
            type: "audio",
            current: sounds[type]?.path || '',
            callback: (path) => {
              sounds[type].path = path;
              updateSoundUI();
            }
          }).render(true);
        });

        // Sound option inputs
        html.find('[name="soundFrames"]').on('change', function() {
          sounds[currentSoundType].frames = $(this).val();
        });
        html.find('[name="soundVol"]').on('change', function() {
          sounds[currentSoundType].volume = parseFloat($(this).val()) || 1;
        });
        html.find('[name="soundFadeIn"]').on('change', function() {
          sounds[currentSoundType].fadeIn = $(this).val();
        });
        html.find('[name="soundFadeOut"]').on('change', function() {
          sounds[currentSoundType].fadeOut = $(this).val();
        });

        // Initialize sound UI
        updateSoundUI();

        // Initialize adjust panel
        updateAdjustPanel();

        // Splitter drag handlers
        const leftPanel = html.find('.celeb-bottom-left');
        const rightPanel = html.find('.celeb-bottom-right');
        let activeSplitter = null;
        let startX = 0;
        let startWidth = 0;

        html.find('.celeb-splitter').on('mousedown', function(e) {
          e.preventDefault();
          activeSplitter = $(this).data('splitter');
          startX = e.clientX;
          if (activeSplitter === 'left') {
            startWidth = leftPanel.width();
          } else {
            startWidth = rightPanel.width();
          }
          $(this).addClass('dragging');
          $(document).on('mousemove.splitter', onSplitterMove);
          $(document).on('mouseup.splitter', onSplitterUp);
        });

        function onSplitterMove(e) {
          if (!activeSplitter) return;
          const delta = e.clientX - startX;
          if (activeSplitter === 'left') {
            const newWidth = Math.max(150, Math.min(400, startWidth + delta));
            leftPanel.css('width', newWidth + 'px');
          } else {
            const newWidth = Math.max(250, Math.min(600, startWidth - delta));
            rightPanel.css('width', newWidth + 'px');
          }
        }

        function onSplitterUp() {
          html.find('.celeb-splitter').removeClass('dragging');
          activeSplitter = null;
          $(document).off('mousemove.splitter');
          $(document).off('mouseup.splitter');
        }

        // Initial preview setup
        updatePreviewLayers();

        // Update preview when images change
        html.find('.celeb-browse-btn').on('click', () => {
          setTimeout(updatePreviewLayers, 500);
        });

        // Update preview when any form value changes
        html.find('input, select').on('change', () => {
          setTimeout(updatePreviewLayers, 100);
        });
      }
    }, {
      classes: ["dialog", "bpm-dialog-window", "flex-celebration-dialog", "celeb-dialog-v2"],
      width: Math.floor(window.innerWidth * 0.85),
      height: Math.floor(window.innerHeight * 0.85),
      resizable: true
    });

    dialog.render(true);
  }

  /**
   * Play celebration animation - displays layered images for 2 seconds
   * @param {string[]} images - Array of image paths (1=front to 4=back)
   */
  _playCelebrationAnimation(images) {
    // Create fullscreen overlay
    const overlay = document.createElement('div');
    overlay.className = 'flex-celebration-overlay';
    overlay.innerHTML = `
      <div class="flex-celebration-anim">
        ${images.map((img, i) => `
          <div class="flex-anim-layer" style="z-index: ${100 - i}">
            <img src="${img}">
          </div>
        `).join('')}
      </div>
    `;

    document.body.appendChild(overlay);

    // Fade in
    requestAnimationFrame(() => {
      overlay.classList.add('visible');
    });

    // Remove after 2 seconds
    setTimeout(() => {
      overlay.classList.remove('visible');
      setTimeout(() => overlay.remove(), 300);
    }, 2000);
  }

  // ========== TRAVEL TAB METHODS ==========

  /**
   * Enter waypoint placement mode - user clicks on map to place waypoint
   */
  async _onTravelAddWaypoint(event) {
    event.preventDefault();

    if (!canvas.scene) {
      ui.notifications.warn("No active scene. Please open a scene first.");
      return;
    }

    ui.notifications.info("Click on the map to place a waypoint. Press Escape to cancel.");

    // Store reference to this sheet for the click handler
    const sheet = this;

    // Create a one-time click handler for the canvas
    const clickHandler = async (event) => {
      // Get canvas coordinates from the click
      const t = canvas.stage.worldTransform;
      const x = (event.data.global.x - t.tx) / canvas.stage.scale.x;
      const y = (event.data.global.y - t.ty) / canvas.stage.scale.y;

      // Add waypoint to our array
      const waypointNum = (sheet._travelWaypoints || []).length + 1;
      if (!sheet._travelWaypoints) sheet._travelWaypoints = [];

      sheet._travelWaypoints.push({
        x: Math.round(x),
        y: Math.round(y),
        name: ""  // Empty name - will show number as placeholder
      });

      console.log(`Conan | Added waypoint ${waypointNum} at (${Math.round(x)}, ${Math.round(y)})`);

      // Remove the click handler
      canvas.stage.off('pointerdown', clickHandler);

      // Place marker on map immediately
      await sheet._refreshWaypointMarkers();

      // Re-render to show the new waypoint
      sheet.render(false);
    };

    // Add the click handler
    canvas.stage.once('pointerdown', clickHandler);

    // Also listen for Escape to cancel
    const escHandler = (event) => {
      if (event.key === 'Escape') {
        canvas.stage.off('pointerdown', clickHandler);
        document.removeEventListener('keydown', escHandler);
        ui.notifications.info("Waypoint placement cancelled.");
      }
    };
    document.addEventListener('keydown', escHandler);
  }

  /**
   * Clear all waypoints
   */
  async _onTravelClearWaypoints(event) {
    event.preventDefault();

    // Clear the travel line drawing if it exists
    await this._clearTravelDrawings();

    this._travelWaypoints = [];
    this._travelJourneyStarted = false;
    this._travelProgress = 0;
    this._travelDrawingId = null;
    this._travelCurrentLegIndex = 0;
    this._travelMilesIntoLeg = 0;
    this._travelMilesTraveled = 0;
    this._travelEncounterMilesLeft = null;
    this._travelEncounterPending = false;
    this._travelStopPoint = null;
    this._travelForcedMarch = false;

    console.log("Conan | Cleared all waypoints");
    this.render(false);
  }

  /**
   * Remove a specific waypoint
   */
  async _onTravelRemoveWaypoint(event) {
    event.preventDefault();
    const index = parseInt(event.currentTarget.dataset.index);

    if (this._travelWaypoints && this._travelWaypoints[index]) {
      this._travelWaypoints.splice(index, 1);
      console.log(`Conan | Removed waypoint ${index + 1}`);
      await this._refreshWaypointMarkers();
      this.render(false);
    }
  }

  /**
   * Handle waypoint name change
   */
  _onTravelWaypointNameChange(event) {
    const index = parseInt(event.currentTarget.dataset.index);
    const newName = event.currentTarget.value.trim();

    if (this._travelWaypoints && this._travelWaypoints[index]) {
      this._travelWaypoints[index].name = newName;
      console.log(`Conan | Renamed waypoint ${index + 1} to "${newName || index + 1}"`);
    }
  }

  /**
   * Reposition a waypoint - click on map to move it
   */
  _onTravelRepositionWaypoint(event) {
    event.preventDefault();
    const index = parseInt(event.currentTarget.dataset.index);

    if (!this._travelWaypoints || !this._travelWaypoints[index]) return;

    if (!canvas.scene) {
      ui.notifications.warn("No active scene.");
      return;
    }

    const waypointNum = index + 1;
    ui.notifications.info(`Click on the map to reposition Waypoint ${waypointNum}. Press Escape to cancel.`);

    // Store reference to this sheet for the click handler
    const sheet = this;

    // Create a one-time click handler for the canvas
    const clickHandler = async (event) => {
      // Get canvas coordinates from the click
      const t = canvas.stage.worldTransform;
      const x = (event.data.global.x - t.tx) / canvas.stage.scale.x;
      const y = (event.data.global.y - t.ty) / canvas.stage.scale.y;

      // Update the waypoint position
      sheet._travelWaypoints[index].x = Math.round(x);
      sheet._travelWaypoints[index].y = Math.round(y);

      console.log(`Conan | Repositioned waypoint ${waypointNum} to (${Math.round(x)}, ${Math.round(y)})`);
      ui.notifications.info(`Waypoint ${waypointNum} repositioned.`);

      // Remove the click handler
      canvas.stage.off('pointerdown', clickHandler);
      document.removeEventListener('keydown', escHandler);

      // Update marker on map
      await sheet._refreshWaypointMarkers();

      // Re-render to show the updated distances
      sheet.render(false);
    };

    // Also listen for Escape to cancel
    const escHandler = (event) => {
      if (event.key === 'Escape') {
        canvas.stage.off('pointerdown', clickHandler);
        document.removeEventListener('keydown', escHandler);
        ui.notifications.info("Reposition cancelled.");
      }
    };

    // Add the handlers
    canvas.stage.once('pointerdown', clickHandler);
    document.addEventListener('keydown', escHandler);
  }

  /**
   * Handle speed slider change
   */
  _onTravelSpeedChange(event) {
    this._travelLineSpeed = parseInt(event.currentTarget.value) || 50;
    // Update the display value
    const display = this.element.find('.travel-speed-value');
    if (display.length) {
      display.text(this._travelLineSpeed + '%');
    }
  }

  /**
   * Handle zoom slider change
   */
  _onTravelZoomChange(event) {
    this._travelZoom = parseInt(event.currentTarget.value) || 50;
    // Update the display value
    const display = this.element.find('.travel-zoom-value');
    if (display.length) {
      display.text(this._travelZoom + '%');
    }
  }

  /**
   * Start the journey - creates the initial line and markers
   */
  async _onTravelStart(event) {
    event.preventDefault();

    if (!this._travelWaypoints || this._travelWaypoints.length < 2) {
      ui.notifications.warn("Need at least 2 waypoints to start a journey.");
      return;
    }

    if (!canvas.scene) {
      ui.notifications.warn("No active scene.");
      return;
    }

    // Clear any existing drawings
    await this._clearTravelDrawings();

    this._travelJourneyStarted = true;
    this._travelProgress = 0;
    this._travelCurrentLegIndex = 0;
    this._travelMilesIntoLeg = 0;
    this._travelMilesTraveled = 0;
    this._travelEncounterMilesLeft = null;
    this._travelEncounterPending = false;
    this._travelStopPoint = null;

    // Create waypoint markers using Foundry Drawings
    await this._createWaypointMarkers();

    // Create the travel line (initially just the first point)
    await this._createTravelLine();

    // Calculate bounds of all waypoints to determine zoom level
    const waypoints = this._travelWaypoints;
    const xs = waypoints.map(wp => wp.x);
    const ys = waypoints.map(wp => wp.y);
    const minX = Math.min(...xs);
    const maxX = Math.max(...xs);
    const minY = Math.min(...ys);
    const maxY = Math.max(...ys);
    const centerX = (minX + maxX) / 2;
    const centerY = (minY + maxY) / 2;

    // Calculate zoom to fit all waypoints with padding
    const padding = 200;
    const journeyWidth = (maxX - minX) + padding * 2;
    const journeyHeight = (maxY - minY) + padding * 2;
    const screenWidth = window.innerWidth;
    const screenHeight = window.innerHeight;
    const zoomX = screenWidth / journeyWidth;
    const zoomY = screenHeight / journeyHeight;
    const overviewZoom = Math.min(zoomX, zoomY, 1);  // Don't zoom in past 1

    // Zoom out to show entire journey (overview)
    await canvas.animatePan({
      x: centerX,
      y: centerY,
      scale: overviewZoom,
      duration: 1500
    });

    // Broadcast camera pan via chat message (syncs to all clients)
    await ChatMessage.create({
      content: `<div class="travel-camera-pan" style="display:none;"></div>`,
      speaker: ChatMessage.getSpeaker({ alias: "Travel Master" }),
      flags: {
        conan: {
          cameraPan: true,
          x: centerX,
          y: centerY,
          scale: overviewZoom,
          duration: 1500
        }
      }
    });

    // Show a journey quote in chat
    this._sendJourneyQuote();

    console.log("Conan | Journey started - showing overview");
    this.render(false);
  }

  /**
   * Advance the travel - roll encounter distance, animate line, handle encounters
   */
  async _onTravelAdvance(event) {
    event.preventDefault();

    if (!this._travelJourneyStarted) {
      ui.notifications.warn("Start the journey first.");
      return;
    }

    if (this._travelAnimating) {
      ui.notifications.info("Animation in progress...");
      return;
    }

    if (this._travelEncounterPending) {
      ui.notifications.warn("Resolve the encounter first — pick a category above.");
      return;
    }

    const waypoints = this._travelWaypoints || [];
    const legIdx = this._travelCurrentLegIndex || 0;

    // Check if journey is already complete
    if (legIdx >= waypoints.length - 1) {
      ui.notifications.info("Journey complete! You have arrived at your destination.");
      return;
    }

    // Roll encounter distance if we don't have one pending
    if (this._travelEncounterMilesLeft === null || this._travelEncounterMilesLeft === undefined) {
      this._travelEncounterMilesLeft = this._rollEncounterDistance();
    }

    // Calculate remaining miles in current leg
    const legStart = waypoints[legIdx];
    const legEnd = waypoints[legIdx + 1];
    const legTotalMiles = this._calcLegDistanceMiles(legStart, legEnd);
    const remainingInLeg = legTotalMiles - (this._travelMilesIntoLeg || 0);

    // Determine from-point (stop point if mid-leg, or leg start)
    const fromPoint = this._travelStopPoint || legStart;

    if (this._travelEncounterMilesLeft < remainingInLeg) {
      // ENCOUNTER fires before reaching next waypoint
      const advanceMiles = this._travelEncounterMilesLeft;
      const newMilesIntoLeg = (this._travelMilesIntoLeg || 0) + advanceMiles;
      const fraction = legTotalMiles > 0 ? newMilesIntoLeg / legTotalMiles : 1;
      const stopPoint = this._interpolateLegPoint(legStart, legEnd, Math.min(fraction, 1));

      // Animate to the encounter point
      await this._animateTravelToPoint(fromPoint, stopPoint);

      // Update state
      this._travelMilesIntoLeg = newMilesIntoLeg;
      this._travelMilesTraveled += advanceMiles;
      this._travelEncounterMilesLeft = null;  // Used up
      this._travelEncounterPending = true;
      this._travelStopPoint = stopPoint;

      console.log(`Conan | Encounter at mile ${Math.round(this._travelMilesTraveled)}`);
      this.render(false);

    } else {
      // No encounter before waypoint — complete this leg
      const advanceMiles = remainingInLeg;
      this._travelEncounterMilesLeft -= advanceMiles;

      // Animate to the waypoint (use existing method, modified for stop point)
      await this._animateTravelLine(legIdx + 1);

      // Update state
      this._travelMilesTraveled += advanceMiles;
      this._travelMilesIntoLeg = 0;
      this._travelCurrentLegIndex = legIdx + 1;
      this._travelProgress = legIdx + 1;
      this._travelStopPoint = null;

      // Check if journey complete
      if (legIdx + 1 >= waypoints.length - 1) {
        ChatMessage.create({
          content: `<div class="travel-quote"><em>The journey is complete. The company has arrived at its destination.</em></div>`,
          speaker: { alias: "Journey" }
        });
        ui.notifications.info("Journey complete! You have arrived at your destination.");
      }

      console.log(`Conan | Reached waypoint ${legIdx + 2}`);
      this.render(false);
    }
  }

  /**
   * Reset the journey (keeps waypoints, clears progress)
   */
  async _onTravelReset(event) {
    event.preventDefault();

    await this._clearTravelDrawings();

    this._travelJourneyStarted = false;
    this._travelProgress = 0;
    this._travelDrawingId = null;
    this._travelCurrentLegIndex = 0;
    this._travelMilesIntoLeg = 0;
    this._travelMilesTraveled = 0;
    this._travelEncounterMilesLeft = null;
    this._travelEncounterPending = false;
    this._travelStopPoint = null;
    this._travelForcedMarch = false;

    console.log("Conan | Journey reset");
    this.render(false);
  }

  /**
   * Clear all travel-related drawings from the scene
   */
  async _clearTravelDrawings() {
    if (!canvas.scene) return;

    // Find and delete drawings with our travel flags
    const travelDrawings = canvas.scene.drawings.filter(d =>
      d.flags?.conan?.travelLine || d.flags?.conan?.travelWaypoint
    );

    if (travelDrawings.length > 0) {
      const ids = travelDrawings.map(d => d.id);
      await canvas.scene.deleteEmbeddedDocuments("Drawing", ids);
      console.log(`Conan | Cleared ${ids.length} travel drawings`);
    }

    this._travelDrawingId = null;
  }

  /**
   * Refresh waypoint markers on the map — clears existing markers and recreates them.
   * Called whenever waypoints are added, removed, or repositioned.
   */
  async _refreshWaypointMarkers() {
    if (!canvas.scene) return;

    // Delete only waypoint markers (not the travel line)
    const waypointDrawings = canvas.scene.drawings.filter(d =>
      d.flags?.conan?.travelWaypoint
    );
    if (waypointDrawings.length > 0) {
      const ids = waypointDrawings.map(d => d.id);
      await canvas.scene.deleteEmbeddedDocuments("Drawing", ids);
    }

    // Recreate if we have waypoints
    if (this._travelWaypoints && this._travelWaypoints.length > 0) {
      await this._createWaypointMarkers();
    }
  }

  /**
   * Create waypoint markers as Foundry Drawings
   */
  async _createWaypointMarkers() {
    if (!canvas.scene || !this._travelWaypoints) return;

    const markerData = this._travelWaypoints.map((wp, index) => ({
      type: "e",  // Ellipse
      x: wp.x - 15,
      y: wp.y - 15,
      shape: {
        width: 30,
        height: 30,
        type: "e"
      },
      fillType: 1,  // Solid
      fillColor: "#FFD700",  // Gold
      fillAlpha: 0.8,
      strokeWidth: 2,
      strokeColor: "#000000",
      strokeAlpha: 1,
      text: `${index + 1}`,
      textColor: "#000000",
      fontSize: 16,
      z: 100,  // Above the line
      flags: {
        conan: { travelWaypoint: true, waypointIndex: index }
      }
    }));

    await canvas.scene.createEmbeddedDocuments("Drawing", markerData);
    console.log(`Conan | Created ${markerData.length} waypoint markers`);
  }

  /**
   * Create the travel line Drawing
   */
  async _createTravelLine() {
    if (!canvas.scene || !this._travelWaypoints || this._travelWaypoints.length < 1) return;

    const firstWp = this._travelWaypoints[0];

    // Create a polyline starting at the first waypoint
    const lineData = {
      type: "p",  // Polyline/Polygon
      x: 0,
      y: 0,
      shape: {
        type: "p",
        points: [firstWp.x, firstWp.y, firstWp.x, firstWp.y]  // Start with a point
      },
      strokeWidth: 8,
      strokeColor: "#8B0000",  // Dark red
      strokeAlpha: 1,
      fillType: 0,  // No fill
      z: 50,  // Below waypoint markers
      flags: {
        conan: { travelLine: true }
      }
    };

    const created = await canvas.scene.createEmbeddedDocuments("Drawing", [lineData]);
    if (created.length > 0) {
      this._travelDrawingId = created[0].id;
      console.log(`Conan | Created travel line with ID: ${this._travelDrawingId}`);
    }
  }

  /**
   * Animate the travel line to extend to the next waypoint
   * Uses PIXI for smooth visual animation, updates Drawing only at the end
   */
  /**
   * Animate the travel line to a waypoint.
   * If _travelStopPoint is set, animates FROM that stop point instead of the prev waypoint.
   */
  async _animateTravelLine(targetIndex) {
    const waypoints = this._travelWaypoints;
    const targetWp = waypoints[targetIndex];
    // Use stop point if we're resuming mid-leg, otherwise use the previous waypoint
    const fromWp = this._travelStopPoint || waypoints[targetIndex - 1];

    if (!targetWp || !fromWp) return;

    await this._animateTravelToPoint(fromWp, targetWp);
    console.log(`Conan | Animated to waypoint ${targetIndex + 1}`);
  }

  /**
   * Animate the travel line between two arbitrary points.
   * Uses PIXI for smooth visual animation, updates Drawing only at the end.
   */
  async _animateTravelToPoint(fromPoint, toPoint) {
    if (!canvas.scene || !this._travelDrawingId) return;

    const drawing = canvas.scene.drawings.get(this._travelDrawingId);
    if (!drawing) {
      console.warn("Conan | Travel line drawing not found");
      return;
    }

    this._travelAnimating = true;

    // Calculate duration based on speed slider (1-100)
    const speed = this._travelLineSpeed || 50;
    const duration = 5000 - (speed * 45);

    // Calculate zoom level based on zoom slider (10-100)
    const zoomSetting = this._travelZoom || 50;
    const travelScale = 0.1 + (zoomSetting / 100) * 0.9;

    // Get the current line points for the final update
    const currentPoints = [...drawing.shape.points];

    // Create a temporary PIXI graphics for smooth animation
    const animLine = new PIXI.Graphics();
    animLine.lineStyle(8, 0x8B0000, 1);
    canvas.drawings.addChild(animLine);

    // Start a single smooth camera pan to the destination with zoom
    const panDuration = duration + 500;
    canvas.animatePan({
      x: toPoint.x,
      y: toPoint.y,
      scale: travelScale,
      duration: panDuration
    });

    // Broadcast camera pan via chat message (syncs to all clients)
    ChatMessage.create({
      content: `<div class="travel-camera-pan" style="display:none;"></div>`,
      speaker: ChatMessage.getSpeaker({ alias: "Travel Master" }),
      flags: {
        conan: {
          cameraPan: true,
          x: toPoint.x,
          y: toPoint.y,
          scale: travelScale,
          duration: panDuration
        }
      }
    });

    // Animate the PIXI line using requestAnimationFrame for smoothness
    const startTime = performance.now();

    await new Promise((resolve) => {
      const animate = (currentTime) => {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);

        // Ease-out curve for smoother deceleration
        const easeProgress = 1 - Math.pow(1 - progress, 2);

        // Calculate current position
        const currentX = fromPoint.x + (toPoint.x - fromPoint.x) * easeProgress;
        const currentY = fromPoint.y + (toPoint.y - fromPoint.y) * easeProgress;

        // Redraw the animated line segment
        animLine.clear();
        animLine.lineStyle(8, 0x8B0000, 1);
        animLine.moveTo(fromPoint.x, fromPoint.y);
        animLine.lineTo(currentX, currentY);

        if (progress < 1) {
          requestAnimationFrame(animate);
        } else {
          resolve();
        }
      };

      requestAnimationFrame(animate);
    });

    // Remove the temporary PIXI graphics
    canvas.drawings.removeChild(animLine);
    animLine.destroy();

    // Update the actual Foundry Drawing with the final points
    const finalPoints = [...currentPoints.slice(0, -2), fromPoint.x, fromPoint.y, toPoint.x, toPoint.y];
    await drawing.update({ 'shape.points': finalPoints });

    this._travelAnimating = false;
  }

  /**
   * Send a random journey quote to chat
   */
  _sendJourneyQuote() {
    const quotes = [
      "Across the plains of Aquilonia, our heroes began their journey...",
      "From the frozen hills of Cimmeria, the adventurers set forth...",
      "Through the shadow of ancient Stygia, brave souls ventured into the unknown...",
      "With steel and courage, they departed into the wild lands of the Hyborian Age...",
      "Under the crimson sky, the company left civilization behind...",
      "By Crom's beard, a new quest begins in these savage lands...",
      "The road stretched before them, promising glory or doom...",
      "Through territories unmapped and dangerous, the party boldly traveled...",
      "With the gods as their witness, they embarked upon a perilous journey...",
      "Beyond the borders of the known world, adventure called to them...",
      "Steel sang at their sides as they ventured into the wilderness...",
      "From tavern tales to legend, their journey now begins..."
    ];

    const quote = quotes[Math.floor(Math.random() * quotes.length)];

    ChatMessage.create({
      content: `<div class="travel-quote"><em>${quote}</em></div>`,
      speaker: { alias: "Journey" }
    });
  }

  // ========== TRAVEL CONTEXT SELECTORS ==========

  _onTravelModeSelect(event) {
    event.preventDefault();
    const mode = event.currentTarget.dataset.mode;
    if (mode && TRAVEL_MODES[mode]) {
      this._travelMode = mode;
      this.render(false);
    }
  }

  _onTravelTerrainSelect(event) {
    event.preventDefault();
    const terrain = event.currentTarget.dataset.terrain;
    if (terrain && TERRAIN_TYPES[terrain]) {
      this._travelTerrain = terrain;
      this.render(false);
    }
  }

  _onTravelWeatherSelect(event) {
    event.preventDefault();
    const weather = event.currentTarget.dataset.weather;
    if (weather && WEATHER_TYPES[weather]) {
      this._travelWeather = weather;
      this.render(false);
    }
  }

  _onTravelTimeSelect(event) {
    event.preventDefault();
    const time = event.currentTarget.dataset.time;
    if (time && TIMES_OF_DAY.includes(time)) {
      this._travelTimeOfDay = time;
      this.render(false);
    }
  }

  _onTravelLocationChange(event) {
    this._travelLocation = event.currentTarget.value;
  }

  // ========== ENCOUNTER SETTINGS ==========

  _onTravelDieToggle(event) {
    event.preventDefault();
    const die = event.currentTarget.dataset.die;
    if (die === 'd100' || die === 'd200') {
      this._travelDieType = die;
      this.render(false);
    }
  }

  _onTravelBonusToggle(event) {
    event.preventDefault();
    this._travelBonusMiles = !this._travelBonusMiles;
    this.render(false);
  }

  // ========== FORCED MARCH ==========

  async _onForcedMarchToggle(event) {
    event.preventDefault();

    // Toggling OFF — just flip it
    if (this._travelForcedMarch) {
      this._travelForcedMarch = false;
      this.render(false);
      return;
    }

    // Toggling ON — check party SP
    const partyTokens = canvas.tokens?.placeables?.filter(t =>
      t.actor && (t.actor.type === 'character' || t.actor.type === 'character2')
    ) || [];

    if (partyTokens.length === 0) {
      ui.notifications.warn("No player characters on the scene.");
      return;
    }

    // Check if everyone can pay
    for (const token of partyTokens) {
      const sp = token.actor.system.stamina || 0;
      if (sp < 1) {
        const msg = FORCED_MARCH_MESSAGES[Math.floor(Math.random() * FORCED_MARCH_MESSAGES.length)];
        ChatMessage.create({
          content: `<div class="travel-quote"><em>${msg.replace('{{name}}', token.name)}</em></div>`,
          speaker: { alias: "Travel Master" }
        });
        ui.notifications.warn(`${token.name} doesn't have enough stamina for forced march.`);
        return;
      }
    }

    // All can pay — deduct 1 SP each
    for (const token of partyTokens) {
      await token.actor.update({ 'system.stamina': token.actor.system.stamina - 1 });
    }

    this._travelForcedMarch = true;
    const names = partyTokens.map(t => t.name).join(', ');
    ChatMessage.create({
      content: `<div class="travel-quote"><em>The company pushes hard, spending precious stamina to hasten the march. (${names}: -1 SP each)</em></div>`,
      speaker: { alias: "Travel Master" }
    });
    this.render(false);
  }

  // ========== ENCOUNTER RESOLUTION ==========

  /**
   * Calculate effective miles per day based on mode, terrain, weather, and forced march
   */
  _getEffectiveMilesPerDay() {
    const mode = TRAVEL_MODES[this._travelMode] || TRAVEL_MODES.foot;
    const terrain = TERRAIN_TYPES[this._travelTerrain] || TERRAIN_TYPES.road;
    const weather = WEATHER_TYPES[this._travelWeather] || WEATHER_TYPES.clear;
    let mpd = mode.milesPerDay * terrain.mult * weather.mult;
    if (this._travelForcedMarch) mpd *= 2;
    return Math.round(mpd * 10) / 10;  // Round to 1 decimal
  }

  /**
   * Calculate current journey day from miles traveled
   */
  _getCurrentDay() {
    const mpd = this._getEffectiveMilesPerDay();
    if (mpd <= 0) return 1;
    return Math.max(1, Math.ceil((this._travelMilesTraveled || 0) / mpd));
  }

  /**
   * Build the context line for encounter messages
   * @param {number} day - The journey day number
   * @param {string} timeOfDay - Random time of day for the encounter
   */
  _buildTravelContextLine(day, timeOfDay) {
    const loc = TRAVEL_LOCATIONS.find(l => l.key === this._travelLocation) || TRAVEL_LOCATIONS[0];
    const terrain = TERRAIN_TYPES[this._travelTerrain] || TERRAIN_TYPES.road;
    const weather = WEATHER_TYPES[this._travelWeather] || WEATHER_TYPES.clear;
    const mode = TRAVEL_MODES[this._travelMode] || TRAVEL_MODES.foot;
    const time = (timeOfDay || this._travelTimeOfDay || 'Day').toLowerCase();

    const terrainLabel = terrain.label.replace('/', ' and ').replace('-', ' ').toLowerCase();
    const weatherLabel = weather.label.toLowerCase();

    const weatherPhrase = weatherLabel === 'storm' ? 'amid a raging storm'
      : weatherLabel === 'heavy rain' ? 'amid hammering rain'
      : `under ${/^[aeiou]/.test(weatherLabel) ? 'an' : 'a'} ${weatherLabel} sky`;

    const dayStr = day ? `On day ${day} of your journey, traveling` : 'Traveling';

    return `${dayStr} by ${mode.label.toLowerCase()} across the ${terrainLabel} in ${loc.label} (${loc.flavor}) in the ${time}, ${weatherPhrase}...`;
  }

  /**
   * Roll encounter distance (d100 or d200 + bonus miles)
   */
  _rollEncounterDistance() {
    const dieMax = this._travelDieType === 'd200' ? 200 : 100;
    let roll = Math.floor(Math.random() * dieMax) + 1;
    const baseRoll = roll;

    if (this._travelBonusMiles) roll += 50;

    // Calculate day info for the GM whisper
    const mpd = this._getEffectiveMilesPerDay();
    const milesAfterRoll = (this._travelMilesTraveled || 0) + roll;
    const encounterDay = mpd > 0 ? Math.max(1, Math.ceil(milesAfterRoll / mpd)) : '?';

    // GM whisper with roll details
    const parts = [`${this._travelDieType}: ${baseRoll}`];
    if (this._travelBonusMiles) parts.push('+50 bonus');
    parts.push(`= ${roll} miles`);

    ChatMessage.create({
      content: `<div class="travel-gm-notes">
        <h4>Encounter Distance Roll</h4>
        <p>${parts.join(' ')}</p>
        <p><strong>Pace:</strong> ${mpd} mi/day${this._travelForcedMarch ? ' (forced march)' : ''} &mdash; encounter ~day ${encounterDay}</p>
      </div>`,
      whisper: ChatMessage.getWhisperRecipients("GM"),
      speaker: { alias: "Travel Master" }
    });

    return roll;
  }

  /**
   * Calculate pixel distance between two waypoints
   */
  _calcLegDistanceMiles(wpA, wpB) {
    const scene = canvas?.scene;
    const gridSize = scene?.grid?.size || 100;
    const gridDistance = scene?.grid?.distance || 5;
    const pixelsPerUnit = gridSize / gridDistance;
    const dx = wpB.x - wpA.x;
    const dy = wpB.y - wpA.y;
    return Math.sqrt(dx * dx + dy * dy) / pixelsPerUnit;
  }

  /**
   * Interpolate a point along a leg
   */
  _interpolateLegPoint(wpA, wpB, fraction) {
    return {
      x: wpA.x + (wpB.x - wpA.x) * fraction,
      y: wpA.y + (wpB.y - wpA.y) * fraction
    };
  }

  /**
   * Handle encounter category pick (or random)
   */
  _onEncounterCategoryPick(event) {
    event.preventDefault();
    let type = event.currentTarget.dataset.type;

    if (type === 'random') {
      const categories = Object.keys(ENCOUNTER_TABLES);
      type = categories[Math.floor(Math.random() * categories.length)];
    }

    const entries = ENCOUNTER_TABLES[type];
    if (!entries || entries.length === 0) return;

    const entry = entries[Math.floor(Math.random() * entries.length)];

    // Calculate encounter day and randomize time of day
    const encounterDay = this._getCurrentDay();
    const randomTime = TIMES_OF_DAY[Math.floor(Math.random() * TIMES_OF_DAY.length)];
    const contextLine = this._buildTravelContextLine(encounterDay, randomTime);
    const color = ENCOUNTER_COLORS[type] || '#8B0000';
    const icon = ENCOUNTER_ICONS[type] || '';

    // Public message
    ChatMessage.create({
      content: `<div class="travel-encounter-card">
        <h3 class="encounter-type" style="color: ${color}">${icon} ${type}</h3>
        <p class="encounter-context"><em>${contextLine}</em></p>
        <p class="encounter-text">${entry.text}</p>
      </div>`,
      speaker: { alias: "Travel Encounter" }
    });

    // GM-only whisper
    ChatMessage.create({
      content: `<div class="travel-gm-notes">
        <h4>GM Notes</h4>
        <p><strong>Suggested Test:</strong> ${entry.stat} ${entry.diff}</p>
        <p><strong>Day ${encounterDay}, ${randomTime}</strong> &mdash; ${Math.round(this._travelMilesTraveled)} miles from start</p>
        <p style="font-style:italic; opacity:0.85;">Guidance only. Adjust stakes, difficulty, or outcome as fiction demands.</p>
      </div>`,
      whisper: ChatMessage.getWhisperRecipients("GM"),
      speaker: { alias: "GM Notes" }
    });

    // Clear encounter pending state
    this._travelEncounterPending = false;
    this.render(false);
  }

  // ========== JOURNEY PERSISTENCE ==========

  async _onTravelSave(event) {
    event.preventDefault();
    const name = this._travelJourneyName?.trim();
    if (!name) {
      ui.notifications.warn("Enter a journey name first.");
      return;
    }

    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
    const saved = foundry.utils.deepClone(game.settings.get('conan', 'savedJourneys') || {});

    saved[slug] = {
      name: name,
      waypoints: this._travelWaypoints.map(wp => ({ x: wp.x, y: wp.y, name: wp.name })),
      mode: this._travelMode,
      terrain: this._travelTerrain,
      weather: this._travelWeather,
      timeOfDay: this._travelTimeOfDay,
      location: this._travelLocation,
      dieType: this._travelDieType,
      bonusMiles: this._travelBonusMiles,
      lineSpeed: this._travelLineSpeed,
      travelZoom: this._travelZoom,
      journeyStarted: this._travelJourneyStarted,
      currentLegIndex: this._travelCurrentLegIndex,
      milesIntoLeg: this._travelMilesIntoLeg,
      milesTraveled: this._travelMilesTraveled,
      encounterMilesLeft: this._travelEncounterMilesLeft,
      progress: this._travelProgress
    };

    await game.settings.set('conan', 'savedJourneys', saved);
    ui.notifications.info(`Journey "${name}" saved.`);
    this.render(false);
  }

  async _onTravelLoad(event) {
    event.preventDefault();
    const select = this.element.find('.travel-load-select');
    const slug = select.val();
    if (!slug) {
      ui.notifications.warn("Select a journey to load.");
      return;
    }

    const saved = game.settings.get('conan', 'savedJourneys') || {};
    const journey = saved[slug];
    if (!journey) {
      ui.notifications.warn("Journey not found.");
      return;
    }

    // Clear existing drawings
    await this._clearTravelDrawings();

    // Restore state
    this._travelJourneyName = journey.name || '';
    this._travelWaypoints = journey.waypoints || [];
    this._travelMode = journey.mode || 'foot';
    this._travelTerrain = journey.terrain || 'road';
    this._travelWeather = journey.weather || 'clear';
    this._travelTimeOfDay = journey.timeOfDay || 'Day';
    this._travelLocation = journey.location || 'generic';
    this._travelDieType = journey.dieType || 'd100';
    this._travelBonusMiles = journey.bonusMiles || false;
    this._travelLineSpeed = journey.lineSpeed || 50;
    this._travelZoom = journey.travelZoom || 50;
    this._travelJourneyStarted = false;  // Must click Start Journey to recreate drawings
    this._travelCurrentLegIndex = journey.currentLegIndex || 0;
    this._travelMilesIntoLeg = journey.milesIntoLeg || 0;
    this._travelMilesTraveled = journey.milesTraveled || 0;
    this._travelEncounterMilesLeft = journey.encounterMilesLeft ?? null;
    this._travelProgress = journey.progress || 0;
    this._travelEncounterPending = false;
    this._travelForcedMarch = false;
    this._travelStopPoint = null;

    ui.notifications.info(`Journey "${journey.name}" loaded. Click Start Journey to begin.`);
    this.render(false);
  }

  async _onTravelDelete(event) {
    event.preventDefault();
    const select = this.element.find('.travel-load-select');
    const slug = select.val();
    if (!slug) {
      ui.notifications.warn("Select a journey to delete.");
      return;
    }

    const saved = foundry.utils.deepClone(game.settings.get('conan', 'savedJourneys') || {});
    const name = saved[slug]?.name || slug;
    delete saved[slug];
    await game.settings.set('conan', 'savedJourneys', saved);
    ui.notifications.info(`Journey "${name}" deleted.`);
    this.render(false);
  }

  // ========== CHAT CAPTURE METHODS ==========

  /**
   * Toggle chat capture listening on/off
   */
  _onChatCaptureToggle(event) {
    event.preventDefault();

    if (this._chatCaptureListening) {
      // Stop listening
      this._stopChatCapture();
    } else {
      // Start listening
      this._startChatCapture();
    }

    this.render(false);
  }

  /**
   * Start listening for chat messages with conan rolls
   */
  _startChatCapture() {
    if (this._chatCaptureHookId) return; // Already listening

    this._chatCaptureListening = true;

    // Register hook to capture new chat messages
    this._chatCaptureHookId = Hooks.on('createChatMessage', (message, options, userId) => {
      this._captureMessage(message);
    });

    console.log('Conan | Chat capture started');
    ui.notifications.info('Chat capture started - make some rolls!');
  }

  /**
   * Stop listening for chat messages
   */
  _stopChatCapture() {
    if (this._chatCaptureHookId) {
      Hooks.off('createChatMessage', this._chatCaptureHookId);
      this._chatCaptureHookId = null;
    }

    this._chatCaptureListening = false;
    console.log('Conan | Chat capture stopped');
    ui.notifications.info('Chat capture stopped');
  }

  /**
   * Process an incoming chat message and capture if it's a conan roll
   */
  _captureMessage(message) {
    const content = message.content || '';

    // Check if this is a conan roll
    if (!content.includes('conan-roll')) return;

    // Determine roll type
    let rollType = 'unknown';
    let title = 'Unknown Roll';

    if (content.includes('spell-cast')) {
      rollType = 'spell';
      title = this._extractTitle(content) || 'Spell Cast';
    } else if (content.includes('flex-choice-card')) {
      rollType = 'flex';
      title = 'Flex Triggered';
    } else if (content.includes('attack-result-box')) {
      rollType = 'attack';
      title = this._extractTitle(content) || 'Attack Roll';
    } else if (content.includes('damage-result-box')) {
      rollType = 'damage';
      title = this._extractTitle(content) || 'Damage Roll';
    } else if (content.includes('skill-result-box')) {
      rollType = 'skill';
      title = this._extractTitle(content) || 'Skill Check';
    }

    // Get actor name from speaker
    const actorName = message.speaker?.alias || 'Unknown';

    // Get timestamp
    const time = new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });

    // Build capture object
    const capture = {
      version: '1.0',
      capturedAt: new Date().toISOString(),
      rollType: rollType,
      title: title,
      actorName: actorName,
      time: time,
      html: content,
      messageId: message.id
    };

    // Add to captured rolls (most recent first)
    this._chatCapturedRolls.unshift(capture);

    // Limit to 20 captured rolls
    if (this._chatCapturedRolls.length > 20) {
      this._chatCapturedRolls.pop();
    }

    // Auto-select the new roll
    this._chatCaptureSelectedIndex = 0;

    console.log(`Conan | Captured ${rollType} roll: ${title}`);
    this.render(false);
  }

  /**
   * Extract the title from roll content
   */
  _extractTitle(content) {
    const match = content.match(/roll-title[^>]*>([^<]+)</);
    return match ? match[1].trim() : null;
  }

  /**
   * Clear all captured rolls
   */
  _onChatCaptureClear(event) {
    event.preventDefault();

    this._chatCapturedRolls = [];
    this._chatCaptureSelectedIndex = null;

    console.log('Conan | Cleared captured rolls');
    this.render(false);
  }

  /**
   * Select a captured roll
   */
  _onChatCaptureSelect(event) {
    event.preventDefault();

    const item = event.currentTarget;
    const index = parseInt(item.dataset.captureIndex, 10);

    this._chatCaptureSelectedIndex = index;
    this.render(false);
  }

  /**
   * Export selected roll for the Layout Designer
   */
  async _onChatCaptureExport(event) {
    event.preventDefault();

    if (this._chatCaptureSelectedIndex === null) {
      ui.notifications.warn('Select a captured roll first');
      return;
    }

    const roll = this._chatCapturedRolls[this._chatCaptureSelectedIndex];
    if (!roll) return;

    // Get current CSS variables from document
    const cssVariables = this._getChatCSSVariables();

    // Build export object (same format as capture-roll.js)
    const exportData = {
      version: '1.0',
      capturedAt: roll.capturedAt,
      rollType: roll.rollType,
      actorName: roll.actorName,
      html: roll.html,
      outerHtml: roll.html, // For compatibility
      styles: {},
      cssVariables: cssVariables
    };

    const json = JSON.stringify(exportData, null, 2);

    try {
      await navigator.clipboard.writeText(json);

      // Show success feedback
      const btn = event.currentTarget;
      const originalHtml = btn.innerHTML;
      btn.innerHTML = '<i class="fas fa-check"></i> Copied!';
      btn.classList.add('copied');

      setTimeout(() => {
        btn.innerHTML = originalHtml;
        btn.classList.remove('copied');
      }, 2000);

      ui.notifications.info('Roll exported! Paste into Layout Designer.');
      console.log('Conan | Exported roll for designer:', roll.rollType);
    } catch (err) {
      console.error('Conan | Export failed:', err);
      ui.notifications.error('Failed to copy to clipboard');
    }
  }

  /**
   * Get current chat-related CSS variables
   */
  _getChatCSSVariables() {
    const vars = {};
    const rootStyles = getComputedStyle(document.documentElement);

    const varNames = [
      '--player-color', '--player-bar-width',
      '--msg-frame-border', '--msg-frame-radius', '--msg-frame-bg',
      '--card-bg', '--card-border-color', '--card-border-width', '--card-radius', '--card-padding',
      '--header-bg', '--header-text', '--header-font-size', '--header-padding', '--header-radius',
      '--token-size', '--token-radius', '--token-border',
      '--result-size', '--result-border-color', '--result-border-width', '--result-radius', '--result-font-size', '--result-text', '--result-bg',
      '--flex-bg', '--flex-border', '--flex-radius', '--flex-padding',
      '--btn-bg', '--btn-border', '--btn-text', '--btn-radius', '--btn-padding', '--btn-font-size',
      '--note-bg', '--note-radius', '--note-padding'
    ];

    varNames.forEach(name => {
      const value = rootStyles.getPropertyValue(name).trim();
      if (value) vars[name] = value;
    });

    return vars;
  }

  // ========== AREAS TAB METHODS ==========

  /** Cache for generated area letter images */
  static _areaImageCache = new Map();

  /**
   * Generate a circular area marker image with a letter using Canvas API
   * @param {string} letter - Single letter (A-Z)
   * @param {number} size - Image size in pixels
   * @returns {HTMLImageElement} Image element with data URL src
   */
  _generateAreaLetterImage(letter, size = 60) {
    const cacheKey = `${letter}-${size}`;
    if (ConanToolsSheet._areaImageCache.has(cacheKey)) {
      return ConanToolsSheet._areaImageCache.get(cacheKey);
    }

    const canvas = document.createElement('canvas');
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext('2d');

    // Dark circle background
    ctx.fillStyle = '#1B1B20';
    ctx.beginPath();
    ctx.arc(size / 2, size / 2, size / 2 - 2, 0, Math.PI * 2);
    ctx.fill();

    // Accent border
    ctx.strokeStyle = '#E10600';
    ctx.lineWidth = 3;
    ctx.stroke();

    // White letter
    ctx.fillStyle = '#FFFFFF';
    ctx.font = `bold ${Math.floor(size * 0.5)}px Montserrat, Arial, sans-serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(letter, size / 2, size / 2 + 1);

    const img = new Image();
    img.src = canvas.toDataURL();
    ConanToolsSheet._areaImageCache.set(cacheKey, img);
    return img;
  }

  /**
   * Render the A-Z letter palette into the .area-palette container
   */
  _renderAreaPalette(html) {
    const container = html.find('.area-palette');
    if (!container.length) return;

    // Get placed areas from scene flags
    const areaData = canvas?.scene?.getFlag('conan', 'areaData') || { areas: {}, connections: [] };
    const placedLabels = new Set(Object.keys(areaData.areas));
    const losBlockers = new Set(areaData.losBlockers || []);
    const losOpen = new Set(areaData.losOpen || []);

    const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
    let paletteHTML = '';

    for (const letter of letters) {
      const isPlaced = placedLabels.has(letter);
      const isBlocker = losBlockers.has(letter);
      const isOpen = losOpen.has(letter);
      let cls = '';
      if (isPlaced) cls += ' placed';
      if (isBlocker) cls += ' los-blocker';
      if (isOpen) cls += ' los-open';
      let title = isPlaced ? letter + ' (on scene)' : 'Drag ' + letter + ' to scene';
      if (isBlocker) title += ' — blocks LOS';
      if (isOpen) title += ' — open LOS';
      paletteHTML += `<div class="area-letter${cls}" data-label="${letter}" draggable="true" title="${title}">${letter}</div>`;
    }

    container.html(paletteHTML);
  }

  /**
   * Render the connection matrix into .area-matrix-container
   * Shows a grid of placed areas — click a cell to toggle connection
   */
  _renderAreaMatrix(html) {
    const container = html.find('.area-matrix-container');
    if (!container.length) return;

    const areaData = canvas?.scene?.getFlag('conan', 'areaData') || { areas: {}, connections: [] };
    const labels = Object.keys(areaData.areas).sort();
    const losBlockers = new Set(areaData.losBlockers || []);
    const losOpen = new Set(areaData.losOpen || []);

    if (labels.length < 2) {
      container.html('<p class="area-matrix-empty">Place at least 2 area markers to define connections.</p>');
      return;
    }

    // Build a Set of connection keys for fast lookup
    const connSet = new Set();
    for (const [a, b] of areaData.connections) {
      connSet.add(`${a}-${b}`);
      connSet.add(`${b}-${a}`);
    }

    // Build table HTML — header labels are right-clickable for LOS toggle
    let tableHTML = '<table class="area-matrix"><thead><tr><th></th>';
    for (const col of labels) {
      const losCls = losBlockers.has(col) ? ' los-blocker' : losOpen.has(col) ? ' los-open' : '';
      tableHTML += `<th class="area-matrix-header${losCls}" data-label="${col}">${col}</th>`;
    }
    tableHTML += '</tr></thead><tbody>';

    for (const row of labels) {
      const losCls = losBlockers.has(row) ? ' los-blocker' : losOpen.has(row) ? ' los-open' : '';
      tableHTML += `<tr><td class="area-matrix-label${losCls}" data-label="${row}">${row}</td>`;
      for (const col of labels) {
        if (row === col) {
          tableHTML += '<td class="area-matrix-cell self">\u2014</td>';
        } else {
          const isConnected = connSet.has(`${row}-${col}`);
          const cls = isConnected ? ' connected' : '';
          tableHTML += `<td class="area-matrix-cell clickable${cls}" data-from="${row}" data-to="${col}">${isConnected ? '\u25CF' : '\u00B7'}</td>`;
        }
      }
      tableHTML += '</tr>';
    }
    tableHTML += '</tbody></table>';
    tableHTML += '<p class="area-matrix-hint">Left-click: path · Right-click letter: cycle LOS (blocked / open)</p>';

    container.html(tableHTML);

    // Bind click handlers — left-click cells for connections, right-click labels for LOS
    container.find('.area-matrix-cell.clickable').on('click', this._onToggleConnection.bind(this));
    container.find('.area-matrix-header, .area-matrix-label').on('contextmenu', this._onToggleAreaLOS.bind(this));
  }

  /**
   * Toggle a connection between two areas
   */
  async _onToggleConnection(event) {
    event.preventDefault();
    const cell = event.currentTarget;
    const from = cell.dataset.from;
    const to = cell.dataset.to;
    if (!from || !to || from === to) return;

    const areaData = canvas.scene.getFlag('conan', 'areaData') || { areas: {}, connections: [] };

    // Normalize pair (alphabetical order)
    const pair = [from, to].sort();
    const pairKey = `${pair[0]}-${pair[1]}`;

    // Check if connection exists
    const idx = areaData.connections.findIndex(([a, b]) => {
      const sorted = [a, b].sort();
      return `${sorted[0]}-${sorted[1]}` === pairKey;
    });

    if (idx >= 0) {
      // Remove connection
      areaData.connections.splice(idx, 1);
      console.log('Conan | Removed connection:', pair[0], '<->', pair[1]);
    } else {
      // Add connection
      areaData.connections.push(pair);
      console.log('Conan | Added connection:', pair[0], '<->', pair[1]);
    }

    await canvas.scene.setFlag('conan', 'areaData', areaData);

    // Re-render just the matrix (not the whole sheet)
    this._renderAreaMatrix(this.element);
  }

  /**
   * Toggle LOS state on an area (right-click matrix header/label)
   * 3-state cycle: Normal → Blocked (no LOS) → Open (always LOS) → Normal
   */
  async _onToggleAreaLOS(event) {
    event.preventDefault();
    const label = event.currentTarget.dataset.label;
    if (!label || !canvas?.scene) return;

    const areaData = canvas.scene.getFlag('conan', 'areaData') || { areas: {}, connections: [] };
    if (!areaData.losBlockers) areaData.losBlockers = [];
    if (!areaData.losOpen) areaData.losOpen = [];

    const isBlocked = areaData.losBlockers.includes(label);
    const isOpen = areaData.losOpen.includes(label);

    if (!isBlocked && !isOpen) {
      // Normal → Blocked
      areaData.losBlockers.push(label);
    } else if (isBlocked) {
      // Blocked → Open
      areaData.losBlockers.splice(areaData.losBlockers.indexOf(label), 1);
      areaData.losOpen.push(label);
    } else {
      // Open → Normal
      areaData.losOpen.splice(areaData.losOpen.indexOf(label), 1);
    }

    await canvas.scene.setFlag('conan', 'areaData', areaData);
    this._renderAreaMatrix(this.element);
    this._renderAreaPalette(this.element);
  }

  /**
   * Render per-area size settings (grid W x H) into .area-settings-container
   */
  _renderAreaSettings(html) {
    const container = html.find('.area-settings-container');
    if (!container.length) return;

    const areaData = canvas?.scene?.getFlag('conan', 'areaData') || { areas: {}, connections: [] };
    const labels = Object.keys(areaData.areas).sort();

    if (labels.length === 0) {
      container.html('<p class="area-matrix-empty">No area markers placed.</p>');
      return;
    }

    let settingsHTML = '<div class="area-settings-grid">';
    for (const label of labels) {
      const area = areaData.areas[label];
      const gw = area.gridW || 3;
      const gh = area.gridH || 3;
      settingsHTML += `
        <div class="area-settings-row" data-label="${label}">
          <span class="area-settings-label">${label}</span>
          <label>W</label>
          <input type="number" class="area-grid-w" value="${gw}" min="1" max="20" step="1">
          <label>H</label>
          <input type="number" class="area-grid-h" value="${gh}" min="1" max="20" step="1">
        </div>`;
    }
    settingsHTML += '</div>';

    container.html(settingsHTML);

    // Bind change handlers
    container.find('.area-grid-w, .area-grid-h').on('change', this._onAreaSizeChange.bind(this));
  }

  /**
   * Handle area grid size change
   */
  async _onAreaSizeChange(event) {
    const input = event.currentTarget;
    const row = input.closest('.area-settings-row');
    const label = row.dataset.label;
    const gridW = parseInt(row.querySelector('.area-grid-w').value) || 3;
    const gridH = parseInt(row.querySelector('.area-grid-h').value) || 3;

    const areaData = canvas.scene.getFlag('conan', 'areaData');
    if (!areaData?.areas?.[label]) return;

    areaData.areas[label].gridW = gridW;
    areaData.areas[label].gridH = gridH;
    await canvas.scene.setFlag('conan', 'areaData', areaData);
    console.log(`Conan | Area ${label} size: ${gridW}x${gridH} grid`);
  }

  /**
   * Connect button — clear old drawings, draw area boxes + connection lines
   */
  async _onAreaConnect(event) {
    event.preventDefault();
    if (!canvas?.scene) return;

    const areaData = canvas.scene.getFlag('conan', 'areaData') || { areas: {}, connections: [] };
    const areas = areaData.areas;
    const connections = areaData.connections;

    if (Object.keys(areas).length === 0) {
      ui.notifications.warn('No area markers on this scene.');
      return;
    }

    // Clear existing area drawings first
    await this._clearAreaDrawings();

    const drawings = [];

    // 1. Draw bounding boxes for each area — black outline, light gray fill
    const gridSize = canvas.grid.size;
    for (const [label, areaInfo] of Object.entries(areas)) {
      const tok = canvas.tokens.get(areaInfo.tokenId);
      if (!tok) continue;
      const cx = tok.x + tok.w / 2;
      const cy = tok.y + tok.h / 2;
      const boxW = (areaInfo.gridW || 3) * gridSize;
      const boxH = (areaInfo.gridH || 3) * gridSize;

      // Draw box as a closed polygon (5 points — 4 corners + close)
      const x1 = cx - boxW / 2;
      const y1 = cy - boxH / 2;
      const x2 = cx + boxW / 2;
      const y2 = cy + boxH / 2;
      drawings.push({
        type: "p",
        x: 0,
        y: 0,
        shape: {
          type: "p",
          points: [x1, y1, x2, y1, x2, y2, x1, y2, x1, y1]
        },
        fillType: 1,
        fillColor: "#cccccc",
        fillAlpha: 0.15,
        strokeWidth: 3,
        strokeColor: "#000000",
        strokeAlpha: 0.8,
        z: 0,
        overhead: false,
        flags: { conan: { areaLine: true } }
      });
    }

    // 2. Draw connection lines between connected areas (clipped to box edges)
    for (const [a, b] of connections) {
      const tokA = canvas.tokens.get(areas[a]?.tokenId);
      const tokB = canvas.tokens.get(areas[b]?.tokenId);
      if (!tokA || !tokB) continue;

      const ax = tokA.x + tokA.w / 2;
      const ay = tokA.y + tokA.h / 2;
      const bx = tokB.x + tokB.w / 2;
      const by = tokB.y + tokB.h / 2;

      // Clip line start to edge of area A's bounding box
      const halfWA = ((areas[a].gridW || 3) * gridSize) / 2;
      const halfHA = ((areas[a].gridH || 3) * gridSize) / 2;
      const startPt = this._clipToBox(ax, ay, bx, by, halfWA, halfHA);

      // Clip line end to edge of area B's bounding box
      const halfWB = ((areas[b].gridW || 3) * gridSize) / 2;
      const halfHB = ((areas[b].gridH || 3) * gridSize) / 2;
      const endPt = this._clipToBox(bx, by, ax, ay, halfWB, halfHB);

      drawings.push({
        type: "p",
        x: 0,
        y: 0,
        shape: {
          type: "p",
          points: [startPt.x, startPt.y, endPt.x, endPt.y]
        },
        strokeWidth: 5,
        strokeColor: "#ffffff",
        strokeAlpha: 0.7,
        fillType: 0,
        z: 1,
        overhead: false,
        flags: { conan: { areaLine: true } }
      });
    }

    if (drawings.length > 0) {
      await canvas.scene.createEmbeddedDocuments("Drawing", drawings);
      console.log(`Conan | Drew ${drawings.length} area elements (boxes + lines)`);
    }

    ui.notifications.info(`Connected: ${Object.keys(areas).length} areas, ${connections.length} links.`);
  }

  /**
   * Clip a line from (cx,cy) toward (tx,ty) to the edge of a box centered on (cx,cy)
   * Returns the intersection point on the box boundary
   */
  _clipToBox(cx, cy, tx, ty, halfW, halfH) {
    const dx = tx - cx;
    const dy = ty - cy;
    if (dx === 0 && dy === 0) return { x: cx, y: cy };

    // Find smallest positive t where the ray hits a box edge
    let t = Infinity;
    if (dx !== 0) {
      const tX = (dx > 0 ? halfW : -halfW) / dx;
      if (tX > 0) t = Math.min(t, tX);
    }
    if (dy !== 0) {
      const tY = (dy > 0 ? halfH : -halfH) / dy;
      if (tY > 0) t = Math.min(t, tY);
    }
    return { x: cx + dx * t, y: cy + dy * t };
  }

  /**
   * Clear all area-related drawings from the scene
   */
  async _clearAreaDrawings() {
    if (!canvas?.scene) return;
    const areaDrawings = canvas.scene.drawings.filter(d => d.flags?.conan?.areaLine);
    if (areaDrawings.length > 0) {
      await canvas.scene.deleteEmbeddedDocuments('Drawing', areaDrawings.map(d => d.id));
      console.log(`Conan | Cleared ${areaDrawings.length} area drawings`);
    }
  }

  /**
   * Clear Lines button — remove drawn lines/boxes only
   */
  async _onAreaClearLines(event) {
    event.preventDefault();
    await this._clearAreaDrawings();
    ui.notifications.info('Area drawings cleared.');
  }

  /** Reset all area data for the current scene */
  async _onAreaReset(event) {
    event.preventDefault();
    if (!canvas?.scene) return;
    await canvas.scene.unsetFlag('conan', 'areaData');
    ui.notifications.info('Area data reset for this scene.');
    this.render(false);
  }

  /** Toggle lock/unlock on all area marker tokens */
  async _onAreaLockToggle(event) {
    event.preventDefault();
    if (!canvas?.scene) return;

    const areaData = canvas.scene.getFlag('conan', 'areaData') || { areas: {} };
    const tokenIds = Object.values(areaData.areas).map(a => a.tokenId).filter(Boolean);
    if (tokenIds.length === 0) {
      ui.notifications.warn('No area markers to lock.');
      return;
    }

    // Read current lock state from scene flag (default unlocked)
    const currentlyLocked = canvas.scene.getFlag('conan', 'areasLocked') || false;
    const newLocked = !currentlyLocked;

    // Update all area marker tokens
    const updates = tokenIds
      .filter(id => canvas.scene.tokens.get(id))
      .map(id => ({ _id: id, locked: newLocked }));

    if (updates.length > 0) {
      await canvas.scene.updateEmbeddedDocuments('Token', updates);
    }

    // Persist lock state in scene flag
    await canvas.scene.setFlag('conan', 'areasLocked', newLocked);

    // Update button appearance
    this._updateAreaLockButton(this.element);
    ui.notifications.info(`Area markers ${newLocked ? 'locked' : 'unlocked'}.`);
  }

  /** Update the lock button icon/text to match current state */
  _updateAreaLockButton(html) {
    if (!canvas?.scene) return;
    const locked = canvas.scene.getFlag('conan', 'areasLocked') || false;
    const btn = html.find('.area-lock-btn');
    if (!btn.length) return;
    const icon = btn.find('i');
    if (locked) {
      icon.removeClass('fa-lock-open').addClass('fa-lock');
      btn.contents().last().replaceWith(' Locked');
      btn.addClass('active');
    } else {
      icon.removeClass('fa-lock').addClass('fa-lock-open');
      btn.contents().last().replaceWith(' Unlocked');
      btn.removeClass('active');
    }
  }

  // ========== TORCH TIMER ==========

  _onTorchDialogOpen(event) {
    event?.preventDefault();

    // Torch system disabled — coming soon
    ui.notifications.info('Torch & Lights Out mode is coming soon.');
    return;

    // Singleton — bring existing dialog to front
    if (this._torchDialog?.rendered) {
      this._torchDialog.bringToTop();
      return;
    }

    const sheet = this;

    const refreshDialog = () => {
      if (!sheet._torchDialog?.rendered) return;
      const freshData = canvas.scene?.getFlag('conan', 'torchTimer') || { lightsOut: false, torches: {} };
      sheet._torchDialog.data.content = sheet._buildTorchDialogContent(freshData, sheet._getTorchPlayerTokens());
      sheet._torchDialog.render(true);
    };

    // Timer interval — ticks every 10s while dialog is open
    let torchInterval = setInterval(() => {
      if (!sheet._torchDialog?.rendered) return;
      // Check for expired torches
      sheet._checkTorchExpiry().then(() => refreshDialog());
    }, 10000);

    const initData = canvas.scene?.getFlag('conan', 'torchTimer') || { lightsOut: false, torches: {} };

    const d = new Dialog({
      title: 'Torch Timer',
      content: sheet._buildTorchDialogContent(initData, sheet._getTorchPlayerTokens()),
      buttons: {
        close: { icon: '<i class="fas fa-times"></i>', label: 'Close' }
      },
      default: 'close',
      render: (html) => {
        // Scene lighting toggle (GM only)
        if (game.user.isGM) {
          html.find('#torch-scene-toggle').on('click', async () => {
            await sheet._toggleSceneDarkness();
            refreshDialog();
          });
        }

        // Torch toggle per token
        html.find('.torch-toggle').on('click', async (ev) => {
          const tokenId = ev.currentTarget.dataset.tokenId;
          await sheet._togglePlayerTorch(tokenId);
          refreshDialog();
        });
      },
      close: () => {
        if (torchInterval) clearInterval(torchInterval);
        torchInterval = null;
        sheet._torchDialog = null;
      }
    }, {
      classes: ['dialog', 'bpm-dialog-window'],
      width: 340,
      height: 'auto',
      resizable: true
    });

    sheet._torchDialog = d;
    d.render(true);
  }

  // Toggle scene darkness on/off
  async _toggleSceneDarkness() {
    if (!game.user.isGM || !canvas?.scene) return;
    const data = canvas.scene.getFlag('conan', 'torchTimer') || { lightsOut: false, torches: {} };

    // Find all enemy tokens on the scene
    const enemyTokens = canvas.scene.tokens.filter(t => t.flags?.conan?.enemyData);

    if (!data.lightsOut) {
      // LIGHTS OUT — darken scene, hide enemies, light torch areas
      // Save current scene atmosphere so we can restore on Lights On
      data.savedDarkness = canvas.scene.environment?.darknessLevel ?? 0;
      data.savedGlobalLight = canvas.scene.environment?.globalLight?.enabled ?? true;
      data.lightsOut = true;
      await canvas.scene.setFlag('conan', 'torchTimer', data);

      // "Movie darkness" — dark enough to feel like night, light enough to see the map
      await canvas.scene.update({
        'environment.darknessLevel': 0.55,
        'environment.globalLight.enabled': true
      });

      const areaData = canvas.scene.getFlag('conan', 'areaData');

      // Build adjacency list
      const adj = {};
      for (const [a, b] of (areaData?.connections || [])) {
        (adj[a] ??= []).push(b);
        (adj[b] ??= []).push(a);
      }

      // Visible areas: all player areas + adjacent areas for torch bearers
      const visibleAreas = new Set();
      const torchAreas = new Set(); // areas with a torch bearer (bright light)
      const playerTokens = canvas.scene.tokens.filter(t => t.actor?.type === 'character2' && t.actorLink);
      for (const t of playerTokens) {
        const area = this._getTokenArea(t, areaData);
        if (!area) continue;
        visibleAreas.add(area);
        const torch = data.torches?.[t.id];
        if (torch?.active) {
          torchAreas.add(area);
          const losBlockers = areaData?.losBlockers || [];
          for (const neighbor of (adj[area] || [])) {
            if (game.conan?._hasAreaLOS?.(areaData.connections, area, neighbor, losBlockers)) {
              visibleAreas.add(neighbor);
            }
          }
        }
      }

      // Hide/show enemies
      const updates = enemyTokens.map(t => {
        const enemyArea = this._getTokenArea(t, areaData);
        const visible = enemyArea && visibleAreas.has(enemyArea);
        return { _id: t.id, hidden: !visible };
      });
      if (updates.length) await canvas.scene.updateEmbeddedDocuments('Token', updates);

      // Light up area markers (cosmetic glow)
      await this._updateAreaMarkerLights(areaData, torchAreas, visibleAreas);

      ui.notifications.info('Lights Out — the darkness closes in.');
    } else {
      // LIGHTS ON — restore scene, kill area lights, recalc visibility (LOS blockers stay hidden)

      // Restore scene atmosphere
      await canvas.scene.update({
        'environment.darknessLevel': data.savedDarkness ?? 0,
        'environment.globalLight.enabled': data.savedGlobalLight ?? true
      });

      // Kill all area marker lights
      const areaData = canvas.scene.getFlag('conan', 'areaData');
      await this._updateAreaMarkerLights(areaData, new Set(), new Set());

      data.lightsOut = false;
      data.savedDarkness = null;
      data.savedGlobalLight = null;
      await canvas.scene.setFlag('conan', 'torchTimer', data);
      game.conan?._clearPlayerAreaCache?.();

      // Recalc will unhide non-blocked enemies, keep LOS-blocked ones hidden
      if (game.conan?._recalcTorchVisibility) await game.conan._recalcTorchVisibility();
      ui.notifications.info('Lights On — vision restored.');
    }
  }

  /** Get the area label a token is in, or null */
  _getTokenArea(tokenDoc, areaData) {
    if (!areaData?.areas) return null;
    const gridSize = canvas.grid.size;
    const tw = tokenDoc.width || 1;
    const th = tokenDoc.height || 1;
    const tx = tokenDoc.x + (tw * gridSize / 2);
    const ty = tokenDoc.y + (th * gridSize / 2);
    for (const [label, areaInfo] of Object.entries(areaData.areas)) {
      const markerDoc = canvas.scene.tokens.get(areaInfo.tokenId);
      if (!markerDoc) continue;
      const halfW = ((areaInfo.gridW || 3) * gridSize) / 2;
      const halfH = ((areaInfo.gridH || 3) * gridSize) / 2;
      // Center area on marker token's center (matches how drawings are rendered)
      const cx = markerDoc.x + ((markerDoc.width || 1) * gridSize) / 2;
      const cy = markerDoc.y + ((markerDoc.height || 1) * gridSize) / 2;
      if (tx >= cx - halfW && tx <= cx + halfW && ty >= cy - halfH && ty <= cy + halfH) {
        return label;
      }
    }
    return null;
  }

  /** Get set of area labels occupied by player tokens */
  _getOccupiedPlayerAreas(areaData) {
    const playerAreas = new Set();
    if (!areaData?.areas) return playerAreas;
    const playerTokens = canvas.scene.tokens.filter(t => t.actor?.type === 'character2' && t.actorLink);
    for (const t of playerTokens) {
      const area = this._getTokenArea(t, areaData);
      if (area) playerAreas.add(area);
    }
    return playerAreas;
  }

  /** Update area marker token lights — bright for torch areas, dim for adjacent, off for rest */
  async _updateAreaMarkerLights(areaData, torchAreas, visibleAreas) {
    if (!areaData?.areas) return;
    const gridSize = canvas.grid.size;
    const markerUpdates = [];

    // Build adjacency to distinguish torch spillover from player-only areas
    const adj = {};
    for (const [a, b] of (areaData.connections || [])) {
      (adj[a] ??= []).push(b);
      (adj[b] ??= []).push(a);
    }

    for (const [label, areaInfo] of Object.entries(areaData.areas)) {
      const markerDoc = canvas.scene.tokens.get(areaInfo.tokenId);
      if (!markerDoc) continue;

      // Light radius in distance units (e.g. feet) — must fill the area box
      const gw = areaInfo.gridW || 3;
      const gh = areaInfo.gridH || 3;
      const gridDist = canvas.scene.grid.distance || 5;
      const fillRadius = (Math.max(gw, gh) / 2) * gridDist;

      // Is this area adjacent to a torch area? (spillover glow)
      const isNearTorch = !torchAreas.has(label) && (adj[label] || []).some(n => torchAreas.has(n));

      if (torchAreas.has(label)) {
        // Torch bearer here — strong warm glow
        markerUpdates.push({ _id: markerDoc.id, light: {
          bright: fillRadius * 0.7, dim: fillRadius, color: '#ff8800', alpha: 0.35,
          animation: { type: 'torch', speed: 3, intensity: 3 }
        }});
      } else if (isNearTorch) {
        // Torch spillover — warm flicker, noticeably dimmer
        markerUpdates.push({ _id: markerDoc.id, light: {
          bright: 0, dim: fillRadius, color: '#ff9933', alpha: 0.2,
          animation: { type: 'torch', speed: 2, intensity: 2 }
        }});
      } else if (visibleAreas.has(label)) {
        // Player present, no torch — faint cool moonlight
        markerUpdates.push({ _id: markerDoc.id, light: {
          bright: 0, dim: fillRadius * 0.7, color: '#8899bb', alpha: 0.15,
          animation: { type: null }
        }});
      } else {
        // Dark — no light
        markerUpdates.push({ _id: markerDoc.id, light: {
          bright: 0, dim: 0, color: null, alpha: 0.5,
          animation: { type: null }
        }});
      }
    }

    if (markerUpdates.length) {
      await canvas.scene.updateEmbeddedDocuments('Token', markerUpdates);
    }
  }

  // Toggle a player's torch on/off
  async _togglePlayerTorch(tokenId) {
    if (!canvas?.scene) return;
    const data = canvas.scene.getFlag('conan', 'torchTimer') || { lightsOut: false, torches: {} };
    if (!data.torches) data.torches = {};
    const tokenDoc = canvas.scene.tokens.get(tokenId);
    if (!tokenDoc) return;
    const actor = tokenDoc.actor;

    const torch = data.torches[tokenId];
    if (torch?.active) {
      // === EXTINGUISH === 50% time penalty
      const remaining = Math.max(0, torch.expiresAt - Date.now());
      torch.halvedRemaining = Math.floor(remaining / 2);
      torch.expiresAt = Date.now() + torch.halvedRemaining;
      torch.active = false;

      // Remove token light
      await tokenDoc.update({ light: { dim: 0, bright: 0, color: null, animation: { type: null } } });

      // Inventory: "Lit Torch (Xm)" → "Torch" (give it back)
      if (actor) {
        const inv = actor.system.inventory || {};
        const updates = {};
        // Remove the Lit Torch item
        if (torch.inventoryItemId && inv[torch.inventoryItemId]) {
          updates[`system.inventory.-=${torch.inventoryItemId}`] = null;
        }
        // Add or increment "Torch" (also match "Lit Torch" variants)
        const existingTorch = Object.entries(inv).find(
          ([id, item]) => id !== torch.inventoryItemId && item && /^(lit\s+)?torch(\s*\(.*\))?$/i.test((item.name || '').trim())
        );
        if (existingTorch) {
          const [eid, eitem] = existingTorch;
          updates[`system.inventory.${eid}.quantity`] = (eitem.quantity || 1) + 1;
        } else {
          const newId = `item${Date.now()}`;
          updates[`system.inventory.${newId}`] = { name: 'Torch', quantity: 1, description: '' };
        }
        if (Object.keys(updates).length) await actor.update(updates);
      }
      torch.inventoryItemId = null;
      ui.notifications.info(`${tokenDoc.name} extinguishes their torch. Half the fuel is wasted.`);

    } else {
      // === LIGHT TORCH ===
      if (!actor) return;
      const inv = actor.system.inventory || {};

      // Find "Torch" or "Lit Torch" (with optional timer suffix) in inventory
      const torchEntry = Object.entries(inv).find(
        ([, item]) => item && /^(lit\s+)?torch(\s*\(.*\))?$/i.test((item.name || '').trim())
      );
      if (!torchEntry) {
        ui.notifications.warn(`${tokenDoc.name} has no torches in inventory.`);
        return;
      }
      const [torchItemId, torchItem] = torchEntry;

      // Determine duration: fresh torch or relighting (has halved remaining)?
      const existing = data.torches[tokenId];
      let durationMs;
      if (existing?.halvedRemaining > 0) {
        // Relighting a previously extinguished torch
        durationMs = existing.halvedRemaining;
      } else {
        // Fresh torch — random 20-40 min
        const variation = Math.floor(Math.random() * 21) - 10;
        durationMs = (30 + variation) * 60 * 1000;
      }

      const now = Date.now();
      const litTorchId = `item${now}`;

      // Inventory: consume one Torch, create "Lit Torch (0m)"
      const updates = {};
      if ((torchItem.quantity || 1) > 1) {
        updates[`system.inventory.${torchItemId}.quantity`] = (torchItem.quantity || 1) - 1;
      } else {
        updates[`system.inventory.-=${torchItemId}`] = null;
      }
      updates[`system.inventory.${litTorchId}`] = { name: 'Lit Torch (0m)', quantity: 1, description: 'A burning torch.' };
      await actor.update(updates);

      // Scene flag data
      data.torches[tokenId] = {
        expiresAt: now + durationMs,
        duration: durationMs,
        litAt: now,
        active: true,
        inventoryItemId: litTorchId,
        halvedRemaining: 0
      };

      // No light on player token — area markers are the light sources
      // _recalcTorchVisibility() handles lighting area markers based on torch bearer position

      if (game.user.isGM) {
        const mins = Math.round(durationMs / 60000);
        ui.notifications.info(`${tokenDoc.name} lights a torch. (${mins} min)`);
      } else {
        ui.notifications.info(`${tokenDoc.name} lights a torch.`);
      }
    }

    await canvas.scene.setFlag('conan', 'torchTimer', data);
    // Recalculate area marker lights
    if (game.conan?._recalcTorchVisibility) await game.conan._recalcTorchVisibility();
  }

  // Check for expired torches and auto-extinguish
  async _checkTorchExpiry() {
    if (!game.user.isGM || !canvas?.scene) return;
    const data = canvas.scene.getFlag('conan', 'torchTimer');
    if (!data?.torches) return;

    const now = Date.now();
    let changed = false;
    const extinguished = [];

    for (const [tokenId, torch] of Object.entries(data.torches)) {
      if (!torch.active) continue;
      if (now >= torch.expiresAt) {
        torch.active = false;
        torch.halvedRemaining = 0;
        changed = true;
        const tokenDoc = canvas.scene.tokens.get(tokenId);
        if (tokenDoc) {
          await tokenDoc.update({ light: { dim: 0, bright: 0, color: null, animation: { type: null } } });
          extinguished.push(tokenDoc.name);
          // Remove "Lit Torch" from inventory (torch is consumed)
          if (torch.inventoryItemId && tokenDoc.actor) {
            const inv = tokenDoc.actor.system.inventory || {};
            if (inv[torch.inventoryItemId]) {
              await tokenDoc.actor.update({ [`system.inventory.-=${torch.inventoryItemId}`]: null });
            }
          }
        }
        torch.inventoryItemId = null;
      }
    }

    if (changed) {
      await canvas.scene.setFlag('conan', 'torchTimer', data);
      // Recalculate area lights (a torch went out)
      if (game.conan?._recalcTorchVisibility) await game.conan._recalcTorchVisibility();
    }

    // Update "Lit Torch (Xm)" item names for active torches (every tick)
    for (const [tokenId, torch] of Object.entries(data.torches)) {
      if (!torch.active || !torch.inventoryItemId || !torch.litAt) continue;
      const tokenDoc = canvas.scene.tokens.get(tokenId);
      if (!tokenDoc?.actor) continue;
      const inv = tokenDoc.actor.system.inventory || {};
      if (!inv[torch.inventoryItemId]) continue;
      const elapsed = Math.floor((now - torch.litAt) / 60000);
      const currentName = inv[torch.inventoryItemId].name || '';
      const newName = `Lit Torch (${elapsed}m)`;
      if (currentName !== newName) {
        await tokenDoc.actor.update({ [`system.inventory.${torch.inventoryItemId}.name`]: newName });
      }
    }

    if (extinguished.length > 0) {
      const names = extinguished.join(', ');
      ChatMessage.create({
        content: `<div class="conan-roll"><h3 style="color: #ff9329;"><i class="fas fa-fire-extinguisher"></i> Torch Expired</h3><div class="skill-effect" style="color: #ccc;"><em>The flames gutter and die...</em></div><div class="skill-effect"><strong>${names}</strong> ${extinguished.length === 1 ? 'is' : 'are'} plunged into darkness.</div></div>`,
        speaker: ChatMessage.getSpeaker({ alias: 'Torch Timer' })
      });
    }
  }

  _getTorchPlayerTokens() {
    if (!canvas?.scene) return [];
    return canvas.scene.tokens.filter(t =>
      t.actor && t.actor.type === 'character2' && t.actorLink
    );
  }

  _buildTorchDialogContent(data, playerTokens) {
    const isGM = game.user.isGM;
    const torches = data.torches || {};

    let tokenRows = '';
    for (const tokenDoc of playerTokens) {
      const tid = tokenDoc.id;
      const torch = torches[tid];
      const name = tokenDoc.name;
      const portrait = tokenDoc.texture?.src || tokenDoc.actor?.img || 'icons/svg/mystery-man.svg';
      const isLit = torch?.active || false;

      // Timer display
      let timerText = 'OFF';
      let pct = 0;
      let barColor = '#555';
      if (isLit && torch) {
        const now = Date.now();
        const remaining = Math.max(0, torch.expiresAt - now);
        const elapsed = torch.litAt ? (now - torch.litAt) : (torch.duration - remaining);
        pct = torch.duration > 0 ? Math.round((remaining / torch.duration) * 100) : 0;
        barColor = pct > 50 ? '#4CAF50' : pct > 25 ? '#ff9329' : '#E10600';

        if (isGM) {
          // GM sees remaining
          const mins = Math.floor(remaining / 60000);
          const secs = Math.floor((remaining % 60000) / 1000);
          timerText = `${mins}:${String(secs).padStart(2, '0')}`;
        } else {
          // Players see elapsed (since last light)
          const mins = Math.floor(elapsed / 60000);
          const secs = Math.floor((elapsed % 60000) / 1000);
          timerText = `${mins}:${String(secs).padStart(2, '0')}`;
        }
      } else if (!isLit && torch?.halvedRemaining > 0) {
        // Extinguished but has fuel left — show "SAVED" to hint it can be relit
        timerText = 'SAVED';
      }

      tokenRows += `
        <div class="torch-token-row" data-token-id="${tid}">
          <img src="${portrait}" class="torch-portrait">
          <span class="torch-name">${name}</span>
          <div class="torch-bar-container">
            <div class="torch-bar" style="width: ${isLit ? pct : 0}%; background: ${barColor};"></div>
            <span class="torch-bar-text">${timerText}</span>
          </div>
          <button class="torch-toggle" data-token-id="${tid}" title="${isLit ? 'Extinguish' : 'Light Torch'}">
            <i class="fas ${isLit ? 'fa-fire' : 'fa-circle'}" style="color: ${isLit ? '#ff9329' : '#555'};"></i>
          </button>
        </div>`;
    }

    if (playerTokens.length === 0) {
      tokenRows = '<div style="color: var(--tools-muted, #888); text-align: center; padding: 12px;">No player tokens on this scene.</div>';
    }

    const sceneToggle = isGM ? `
      <div class="torch-section">
        <div class="torch-section-label">Scene Lighting</div>
        <div class="torch-scene-toggle" id="torch-scene-toggle">
          <span>
            <i class="fas ${data.lightsOut ? 'fa-moon' : 'fa-sun'}"
               style="color: ${data.lightsOut ? '#6366f1' : '#FFD700'}; margin-right: 6px;"></i>
            ${data.lightsOut ? 'LIGHTS OUT' : 'LIGHTS ON'}
          </span>
          <span class="torch-status ${data.lightsOut ? 'dark' : 'lit'}">
            ${data.lightsOut ? 'Dark' : 'Lit'}
          </span>
        </div>
        <hr class="torch-divider">
      </div>` : '';

    return `
      <div class="torch-timer-dialog">
        ${sceneToggle}
        <div class="torch-section">
          <div class="torch-section-label">Player Torches</div>
          ${tokenRows}
        </div>
      </div>`;
  }

}

// ========== HOOKS FOR CONDITIONS TAB REAL-TIME UPDATES ==========
// Helper to find and refresh open tools sheets
function refreshToolsSheets() {
  // Find all open ConanToolsSheet instances and refresh them
  for (const app of Object.values(ui.windows)) {
    if (app instanceof ConanToolsSheet && app.rendered) {
      app.render(false);
    }
  }
}

// Refresh when tokens are added/removed/updated in the active scene
Hooks.on('createToken', (token, options, userId) => {
  if (token.parent?.active) refreshToolsSheets();
});

Hooks.on('deleteToken', async (token, options, userId) => {
  if (token.parent?.active) refreshToolsSheets();

  // Only GM should modify scene flags
  if (!game.user.isGM) return;

  // Clean up area marker from scene flags
  const areaFlag = token.getFlag('conan', 'areaMarker');
  if (areaFlag) {
    const scene = token.parent;
    const areaData = scene?.getFlag('conan', 'areaData');
    if (areaData) {
      delete areaData.areas[areaFlag.label];
      areaData.connections = areaData.connections.filter(
        ([a, b]) => a !== areaFlag.label && b !== areaFlag.label
      );
      if (areaData.losBlockers) {
        const idx = areaData.losBlockers.indexOf(areaFlag.label);
        if (idx >= 0) areaData.losBlockers.splice(idx, 1);
      }
      await scene.setFlag('conan', 'areaData', areaData);
      console.log('Conan | Area marker removed:', areaFlag.label);
    }
  }
});

Hooks.on('updateToken', (token, changes, options, userId) => {
  if (token.parent?.active) refreshToolsSheets();
});

// Refresh when actor conditions, buffs/debuffs, or life points change
Hooks.on('updateActor', (actor, changes, options, userId) => {
  // Refresh if conditions, buffsDebuffs, or lifePoints were changed
  if (changes.system?.conditions || changes.system?.buffsDebuffs || changes.system?.lifePoints) {
    refreshToolsSheets();
  }
});

// Refresh when active scene changes
Hooks.on('canvasReady', () => {
  refreshToolsSheets();
});

// ========== FLEX CELEBRATION TRIGGER HANDLER ==========
/**
 * Play flex celebration animation - standalone function for hook usage
 * @param {Object} celebData - Celebration data with duration, images, and effects
 * @param {number} celebData.duration - Animation duration in seconds (1-3)
 * @param {Array} celebData.images - Array of image objects with animation data
 * @param {Object} celebData.effects - Effect settings with slider values and layer timing
 */
function playFlexCelebration(celebData) {
  // Support legacy format (array of image paths)
  if (Array.isArray(celebData)) {
    celebData = {
      duration: 1.5,
      images: celebData.map((path, i) => ({
        path,
        enterDirection: 'none',
        exitDirection: 'none',
        startFrame: 1,
        centerFrame: 1,
        exitFrame: 30,
        endFrame: 30
      })),
      effects: {}
    };
  }

  const { duration = 1.5, images = [], effects = {}, adjustments = {}, sounds = {} } = celebData;
  if (!images || images.length === 0) return;

  // Default adjustments per layer
  const getLayerAdj = (layerNum) => adjustments[layerNum] || { posX: 50, posY: 50, width: 100, height: 100, angle: 0, flipH: false, flipV: false };

  const TOTAL_FRAMES = 30;
  const frameTime = (duration * 1000) / TOTAL_FRAMES; // ms per frame

  // Sound playback tracking
  const activeSounds = {};
  const playedSounds = new Set();

  // Parse frame range string "start/end" or "start-end" to { start, end }
  const parseFrameRange = (str) => {
    if (!str || typeof str !== 'string') return { start: 0, end: 0 };
    const delimiter = str.includes('/') ? '/' : '-';
    const parts = str.split(delimiter);
    return { start: parseInt(parts[0]) || 0, end: parseInt(parts[1]) || 0 };
  };

  // Play a sound
  const playSound = async (soundType, soundData) => {
    if (!soundData.path || playedSounds.has(soundType)) return;
    playedSounds.add(soundType);

    try {
      const vol = Math.min(1, Math.max(0, soundData.volume || 1));
      const sound = await AudioHelper.play({
        src: soundData.path,
        volume: vol,
        autoplay: true,
        loop: false
      }, true);

      if (sound) activeSounds[soundType] = sound;
    } catch (err) {
      console.warn(`Conan | Failed to play sound ${soundType}:`, err);
    }
  };

  // Check and trigger sounds based on current frame
  const checkSounds = (frame) => {
    ['activation', 'intro', 'effect', 'exit'].forEach(type => {
      const soundData = sounds[type];
      if (!soundData || !soundData.path) return;

      const { start, end } = parseFrameRange(soundData.frames);
      if (frame >= start && frame <= end && !playedSounds.has(type)) {
        playSound(type, soundData);
      }
    });
  };

  // Create fullscreen overlay
  const overlay = document.createElement('div');
  overlay.className = 'flex-celebration-overlay';

  // Create image layers (layer 1 = front/top, layer 4 = back/bottom)
  const layerElements = images.map((img, i) => {
    if (!img.path) return null;
    const layer = document.createElement('div');
    layer.className = 'flex-anim-layer';
    // layerOrder: 1 = front (z-index 104), 4 = back (z-index 101)
    const layerOrder = img.layerOrder || (i + 1);
    layer.style.zIndex = 105 - layerOrder;
    layer.style.opacity = '0';
    layer.dataset.layerIndex = i;
    layer.dataset.layerNum = i + 1; // 1-based layer number for effect lookup
    layer.innerHTML = `<img src="${img.path}">`;
    return layer;
  }).filter(Boolean);

  const animContainer = document.createElement('div');
  animContainer.className = 'flex-celebration-anim';
  layerElements.forEach(el => animContainer.appendChild(el));
  overlay.appendChild(animContainer);
  document.body.appendChild(overlay);

  // Show overlay
  requestAnimationFrame(() => {
    overlay.classList.add('visible');
  });

  // Animation loop
  let currentFrame = 0;

  function getPositionOffset(direction, progress) {
    // progress: 0 = fully off-screen, 1 = at center
    const offset = (1 - progress) * 120; // 120% off-screen
    switch (direction) {
      case 'left': return { x: -offset, y: 0 };
      case 'right': return { x: offset, y: 0 };
      case 'top': return { x: 0, y: -offset };
      case 'bottom': return { x: 0, y: offset };
      default: return { x: 0, y: 0 };
    }
  }

  // Check if an effect is active for a layer at current frame
  function isEffectActive(effectName, layerNum, frame) {
    const effect = effects[effectName];
    if (!effect || !effect.layers || !effect.layers[layerNum]) return false;
    const { start, end } = effect.layers[layerNum];
    return frame >= start && frame <= end;
  }

  // Get effect progress (0-1) within its active window
  function getEffectProgress(effectName, layerNum, frame) {
    const effect = effects[effectName];
    if (!effect || !effect.layers || !effect.layers[layerNum]) return 0;
    const { start, end } = effect.layers[layerNum];
    if (frame < start || frame > end) return 0;
    return (frame - start) / Math.max(1, end - start);
  }

  // Calculate effect values based on sliders and frame
  function calculateEffects(layerNum, frame) {
    const result = {
      translateX: 0,
      translateY: 0,
      scale: 1,
      rotate: 0,
      blur: 0,
      brightness: 1,
      opacity: 1,
      glow: 0
    };

    // SHAKE - rapid side-to-side vibration
    if (isEffectActive('shake', layerNum, frame)) {
      const shake = effects.shake;
      const amount = (shake.slider1 / 100) * 20; // Max 20px displacement
      const speed = (shake.slider2 / 100) * 10 + 2; // Frequency multiplier
      const progress = getEffectProgress('shake', layerNum, frame);
      // Oscillate with decreasing amplitude
      const decay = 1 - (progress * 0.3); // Slight decay over time
      result.translateX = Math.sin(frame * speed) * amount * decay;
      result.translateY = Math.cos(frame * speed * 0.7) * amount * 0.5 * decay;
    }

    // PULSE - scale up and down rhythmically
    if (isEffectActive('pulse', layerNum, frame)) {
      const pulse = effects.pulse;
      const strength = (pulse.slider1 / 100) * 0.3; // Max 30% scale change
      const rate = (pulse.slider2 / 100) * 8 + 1; // Pulses speed
      const progress = getEffectProgress('pulse', layerNum, frame);
      result.scale = 1 + Math.sin(progress * Math.PI * rate) * strength;
    }

    // GLOW - pulsing drop shadow
    if (isEffectActive('glow', layerNum, frame)) {
      const glow = effects.glow;
      const intensity = (glow.slider1 / 100) * 40; // Max 40px glow
      const rate = (glow.slider2 / 100) * 6 + 1;
      const progress = getEffectProgress('glow', layerNum, frame);
      result.glow = intensity * (0.5 + 0.5 * Math.sin(progress * Math.PI * rate));
    }

    // SPIN - rotation (turns-based, not perpetual)
    if (isEffectActive('spin', layerNum, frame)) {
      const spin = effects.spin;
      const totalTurns = (spin.slider1 / 100) * 4; // Max 4 full rotations
      const progress = getEffectProgress('spin', layerNum, frame);
      // Ease in-out for smoother spin
      const easedProgress = progress < 0.5
        ? 2 * progress * progress
        : 1 - Math.pow(-2 * progress + 2, 2) / 2;
      result.rotate = easedProgress * totalTurns * 360;
    }

    // BOUNCE - elastic up/down movement
    if (isEffectActive('bounce', layerNum, frame)) {
      const bounce = effects.bounce;
      const height = (bounce.slider1 / 100) * 50; // Max 50px bounce
      const elasticity = (bounce.slider2 / 100) * 0.8 + 0.2; // Damping factor
      const progress = getEffectProgress('bounce', layerNum, frame);
      // Damped sine wave for bounce
      const decay = Math.exp(-progress * (1 - elasticity) * 3);
      result.translateY += Math.abs(Math.sin(progress * Math.PI * 4)) * height * decay * -1;
    }

    // BLUR - gaussian blur in/out
    if (isEffectActive('blur', layerNum, frame)) {
      const blur = effects.blur;
      const strength = (blur.slider1 / 100) * 15; // Max 15px blur
      const progress = getEffectProgress('blur', layerNum, frame);
      // Blur in then out
      const blurProgress = Math.sin(progress * Math.PI);
      result.blur = strength * blurProgress;
    }

    // FLASH - rapid brightness spike
    if (isEffectActive('flash', layerNum, frame)) {
      const flash = effects.flash;
      const intensity = (flash.slider1 / 100) * 3 + 1; // Max 4x brightness
      const progress = getEffectProgress('flash', layerNum, frame);
      // Quick spike at start, fade out
      const flashCurve = Math.pow(1 - progress, 2);
      result.brightness = 1 + (intensity - 1) * flashCurve;
    }

    // FLICKER - random opacity stuttering
    if (isEffectActive('flicker', layerNum, frame)) {
      const flicker = effects.flicker;
      const range = (flicker.slider1 / 100) * 0.8; // Max 80% opacity variance
      const speed = Math.floor((flicker.slider2 / 100) * 5) + 1;
      // Pseudo-random based on frame (deterministic for replay)
      const seed = (frame * speed * layerNum) % 100;
      const noise = Math.sin(seed * 12.9898) * 43758.5453;
      const random = noise - Math.floor(noise);
      result.opacity = 1 - (random * range);
    }

    return result;
  }

  function animateFrame() {
    currentFrame++;
    if (currentFrame > TOTAL_FRAMES) {
      // Animation complete - fade out and remove
      overlay.classList.remove('visible');
      // Stop any playing sounds
      Object.values(activeSounds).forEach(s => {
        if (s && s.stop) s.stop();
      });
      setTimeout(() => overlay.remove(), 300);
      return;
    }

    // Check and play sounds for this frame
    checkSounds(currentFrame);

    // Update each layer
    images.forEach((img, i) => {
      if (!img.path) return;
      const layer = layerElements.find(el => el && el.dataset.layerIndex == i);
      if (!layer) return;

      const layerNum = i + 1;
      const { enterDirection, exitDirection, startFrame, centerFrame, exitFrame, endFrame } = img;

      // Determine layer state based on current frame
      if (currentFrame < startFrame || currentFrame > endFrame) {
        // Layer not visible
        layer.style.opacity = '0';
        layer.style.filter = '';
        return;
      }

      // Calculate base position from enter/exit animations
      let baseX = 0, baseY = 0;

      if (currentFrame < centerFrame && enterDirection !== 'none') {
        // Entering phase
        const enterProgress = (currentFrame - startFrame) / (centerFrame - startFrame);
        const offset = getPositionOffset(enterDirection, enterProgress);
        baseX = offset.x;
        baseY = offset.y;
      } else if (currentFrame >= exitFrame && currentFrame <= endFrame && exitDirection !== 'none') {
        // Exiting phase
        const exitProgress = 1 - ((currentFrame - exitFrame) / (endFrame - exitFrame));
        const offset = getPositionOffset(exitDirection, exitProgress);
        baseX = offset.x;
        baseY = offset.y;
      }

      // Calculate special effects
      const fx = calculateEffects(layerNum, currentFrame);

      // Get layer adjustments
      const adj = getLayerAdj(layerNum);

      // Combine transforms (adj position: 50 = center, 0 = -50%, 100 = +50%)
      const adjX = (adj.posX - 50);
      const adjY = (adj.posY - 50);
      const totalX = baseX + (fx.translateX / 5) + adjX;
      const totalY = baseY + (fx.translateY / 5) + adjY;

      let transform = `translate(calc(-50% + ${totalX}%), calc(-50% + ${totalY}%))`;
      if (fx.scale !== 1) transform += ` scale(${fx.scale})`;
      if (fx.rotate !== 0) transform += ` rotate(${fx.rotate}deg)`;
      if (adj.angle !== 0) transform += ` rotate(${adj.angle}deg)`;

      // Apply size/flip to the image element inside the layer
      const imgEl = layer.querySelector('img');
      if (imgEl) {
        const scaleX = (adj.width / 100) * (adj.flipH ? -1 : 1);
        const scaleY = (adj.height / 100) * (adj.flipV ? -1 : 1);
        imgEl.style.transform = `scale(${scaleX}, ${scaleY})`;
      }

      // Build filter string
      const filters = [];
      if (fx.blur > 0) filters.push(`blur(${fx.blur}px)`);
      if (fx.brightness !== 1) filters.push(`brightness(${fx.brightness})`);
      if (fx.glow > 0) filters.push(`drop-shadow(0 0 ${fx.glow}px rgba(255, 100, 100, 0.8))`);

      // Apply styles
      layer.style.opacity = fx.opacity;
      layer.style.transform = transform;
      layer.style.filter = filters.length > 0 ? filters.join(' ') : '';
    });

    // Schedule next frame
    setTimeout(animateFrame, frameTime);
  }

  // Start animation after a brief delay for overlay to appear
  setTimeout(animateFrame, 50);
}

// Listen for flex trigger events (from socket or local roll)
// celebData is now passed directly from the sender (who has settings access)
Hooks.on('conanFlexTriggered', (actorId, rollType, celeb) => {
  // If no celebration data was passed, nothing to do
  if (!celeb) return;

  // Build celebData for playFlexCelebration
  let celebData;
  if (celeb.images && Array.isArray(celeb.images)) {
    // New format with animation data and effects
    const validImages = celeb.images.filter(img => img.path);
    if (validImages.length > 0) {
      celebData = {
        duration: celeb.duration || 1.5,
        images: celeb.images,
        effects: celeb.effects || {},
        adjustments: celeb.adjustments || {},
        sounds: celeb.sounds || {}
      };
    }
  } else {
    // Legacy format - convert to new format
    const legacyImages = [celeb.image1, celeb.image2, celeb.image3, celeb.image4].filter(Boolean);
    if (legacyImages.length > 0) {
      celebData = {
        duration: 1.5,
        images: legacyImages.map(path => ({
          path,
          enterDirection: 'none',
          exitDirection: 'none',
          startFrame: 1,
          centerFrame: 1,
          exitFrame: 30,
          endFrame: 30
        })),
        effects: {}
      };
    }
  }

  if (celebData) {
    playFlexCelebration(celebData);
  }
});

// ========== CANVAS DROP HANDLER FOR AREA MARKERS ==========
Hooks.on('dropCanvasData', async (canvas, data) => {
  if (data.type !== 'ConanAreaMarker') return;

  console.log('Conan | Area marker drop:', data.label);

  // Prevent duplicate — check if this letter is already on the scene
  const existingAreaData = canvas.scene.getFlag('conan', 'areaData') || { areas: {}, connections: [] };
  if (existingAreaData.areas[data.label]) {
    ui.notifications.warn(`Area ${data.label} is already on this scene.`);
    return false;
  }

  // Find or create shared "Area Markers" actor
  let markerActor = game.actors.find(a => a.name === 'Area Markers' && a.type === 'npc2');
  if (!markerActor) {
    let folder = game.folders.find(f => f.name === 'Map Areas' && f.type === 'Actor');
    if (!folder) folder = await Folder.create({ name: 'Map Areas', type: 'Actor' });
    markerActor = await Actor.create({
      name: 'Area Markers',
      type: 'npc2',
      img: 'systems/conan/images/areas/transparent.png',
      folder: folder.id
    }, { conanEnemySpawn: true });
  }

  // Use custom letter icon image
  const tokenImgURL = `systems/conan/images/areas/${data.label.toLowerCase()}_icon.png`;

  // Update prototype token for this drop
  // Scale 0.8 = 80% of grid square, centered
  await markerActor.update({
    'prototypeToken.actorLink': false,
    'prototypeToken.texture.src': tokenImgURL,
    'prototypeToken.texture.scaleX': 0.8,
    'prototypeToken.texture.scaleY': 0.8,
    'prototypeToken.name': data.label,
    'prototypeToken.displayName': CONST.TOKEN_DISPLAY_MODES.NEVER,
    'prototypeToken.disposition': CONST.TOKEN_DISPOSITIONS.NEUTRAL,
    'prototypeToken.lockRotation': true,
    'prototypeToken.width': 1,
    'prototypeToken.height': 1
  });

  // Create token on scene at drop position — pass all properties directly
  const dropPos = canvas.grid.getSnappedPosition(data.x, data.y);
  const tokenDocs = await canvas.scene.createEmbeddedDocuments('Token', [{
    actorId: markerActor.id,
    name: data.label,
    x: dropPos.x,
    y: dropPos.y,
    actorLink: false,
    texture: {
      src: tokenImgURL,
      scaleX: 0.8,
      scaleY: 0.8
    },
    width: 1,
    height: 1,
    displayName: CONST.TOKEN_DISPLAY_MODES.NEVER,
    disposition: CONST.TOKEN_DISPOSITIONS.NEUTRAL,
    lockRotation: true,
    locked: true,
    sort: -9999
  }]);

  const createdToken = tokenDocs[0];

  // Set area marker flag on token
  await createdToken.setFlag('conan', 'areaMarker', {
    label: data.label,
    gridW: 3,
    gridH: 3
  });

  // Register in scene flags
  const areaData = canvas.scene.getFlag('conan', 'areaData') || { areas: {}, connections: [] };
  areaData.areas[data.label] = {
    tokenId: createdToken.id,
    label: data.label,
    gridW: 3,
    gridH: 3
  };
  await canvas.scene.setFlag('conan', 'areaData', areaData);

  console.log('Conan | Area marker created:', data.label, 'tokenId:', createdToken.id);

  // Re-render Albert to update palette (dim placed letter)
  for (const app of Object.values(ui.windows)) {
    if (app instanceof ConanToolsSheet && app.rendered) {
      app.render(false);
    }
  }

  return false; // Prevent default drop
});

// ========== CANVAS DROP HANDLER FOR ENEMIES ==========
Hooks.on('dropCanvasData', async (canvas, data) => {
  console.log('Conan | dropCanvasData hook fired');
  console.log('Conan | Drop data:', JSON.stringify(data).substring(0, 300));

  // Handle both ConanEnemy (GM Tools drag) and ConanSummon (spell chat drag)
  if (data.type !== 'ConanEnemy' && data.type !== 'ConanSummon') return;

  let enemy;
  let isSummon = false;

  if (data.type === 'ConanSummon') {
    // Resolve enemy data from enemies.json for summon spells
    const summon = data.summon;
    if (!summon?.enemyId) {
      console.warn('Conan | No summon data in drop');
      return;
    }
    try {
      const response = await fetch('systems/conan/data/enemies.json');
      const enemiesData = await response.json();
      const category = enemiesData.categories?.[summon.category];
      const group = category?.groups?.[summon.group];
      const enemyBase = group?.enemies?.find(e => e.id === summon.enemyId);
      if (!enemyBase) {
        console.warn('Conan | Could not find enemy:', summon.enemyId);
        return;
      }
      const randomInRange = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
      // Resolve images: use summon-specific overrides, or group defaults, or fallback
      let summonTokenImg = summon.tokenImg || enemyBase.tokenImg || group?.tokenImg || null;
      let summonPortraitImg = summon.portraitImg || enemyBase.portraitImg || group?.portraitImg || null;
      let summonBackground = summon.groupBackground || group?.background || null;

      // Legacy: Animate Living Statue has custom images
      if (summon.enemyId === 'living-statue-stone') {
        summonTokenImg = summonTokenImg || 'systems/conan/images/enemies/animate_living_statue_token.png';
        summonPortraitImg = summonPortraitImg || 'systems/conan/images/enemies/animate_living_statue_portrait.png';
        summonBackground = summonBackground || 'systems/conan/images/enemies/animate_living_statue_background.png';
      }
      // Summon Fiend images
      if (summon.enemyId === 'fiend') {
        summonTokenImg = summonTokenImg || 'systems/conan/images/enemies/fiend_token.png';
        summonPortraitImg = summonPortraitImg || 'systems/conan/images/enemies/fiend_portrait.png';
      }

      enemy = {
        ...enemyBase,
        category: summon.category,
        group: summon.group,
        tokenImg: summonTokenImg,
        portraitImg: summonPortraitImg,
        groupBackground: summonBackground,
        physicalDefense: enemyBase.defenses.physical ? randomInRange(enemyBase.defenses.physical.min, enemyBase.defenses.physical.max) : null,
        sorceryDefense: enemyBase.defenses.sorcery ? randomInRange(enemyBase.defenses.sorcery.min, enemyBase.defenses.sorcery.max) : null,
        armorRating: enemyBase.ar ? randomInRange(enemyBase.ar.min, enemyBase.ar.max) : null
      };
      isSummon = true;

      // Feral Bond trait: summoned beasts get +2 attack and +2 damage
      if (summon.feralBond) {
        enemy.stats.might.value = (enemy.stats.might.value || 0) + 2;
        enemy.stats.edge.value = (enemy.stats.edge.value || 0) + 2;
        // Boost damage formulas (+2 to the bonus in each weapon)
        const boostDmg = (atk) => {
          if (!atk) return atk;
          const arr = Array.isArray(atk) ? atk : [atk];
          arr.forEach(w => {
            if (/\+(\d+)/.test(w.damage)) {
              w.damage = w.damage.replace(/\+(\d+)/, (_, n) => `+${parseInt(n) + 2}`);
            } else {
              w.damage = w.damage + '+2';
            }
          });
          return arr.length === 1 ? arr[0] : arr;
        };
        enemy.attacks.melee = boostDmg(enemy.attacks.melee);
        enemy.attacks.ranged = boostDmg(enemy.attacks.ranged);
        enemy.feralBond = true;
        enemy.name = `Feral ${enemy.name}`;
        console.log('Conan | Feral Bond: +2 Might/Edge/Damage on', enemy.name);
      }

      // Command the Dead: summoned skeletons get +1 attack and +1 damage
      if (summon.commandDead) {
        enemy.stats.might.value = (enemy.stats.might.value || 0) + 1;
        const boostDmgCmd = (atk) => {
          if (!atk) return atk;
          const arr = Array.isArray(atk) ? atk : [atk];
          arr.forEach(w => {
            if (/\+(\d+)/.test(w.damage)) {
              w.damage = w.damage.replace(/\+(\d+)/, (_, n) => `+${parseInt(n) + 1}`);
            } else {
              w.damage = w.damage + '+1';
            }
          });
          return arr.length === 1 ? arr[0] : arr;
        };
        enemy.attacks.melee = boostDmgCmd(enemy.attacks.melee);
        enemy.attacks.ranged = boostDmgCmd(enemy.attacks.ranged);
        enemy.commandDead = true;
        console.log('Conan | Command the Dead: +1 Might/Damage on', enemy.name);
      }

      console.log('Conan | Summoning:', enemy.name, '(friendly) by', summon.casterName);

      // Summon limit check: if maxSummons is set, count existing tokens from this cast
      if (summon.maxSummons && summon.castId) {
        const scene = canvas.scene;
        if (scene) {
          const placed = scene.tokens.filter(t => t.getFlag('conan', 'summonCastId') === summon.castId).length;
          if (placed >= summon.maxSummons) {
            ui.notifications.warn(`All ${summon.maxSummons} summons from this cast have been placed.`);
            return;
          }
          console.log(`Conan | Summon ${placed + 1}/${summon.maxSummons} for cast ${summon.castId}`);
        }
      }
    } catch (err) {
      console.error('Conan | Error loading enemy data for summon:', err);
      return;
    }
  } else {
    enemy = data.enemy;
  }

  if (!enemy) {
    console.warn('Conan | No enemy data in drop');
    return;
  }

  console.log('Conan | Dropping enemy on canvas:', enemy.name);

  // ==========================================
  // THREAT ENGINE: Roll skull tier for guard-type enemies
  // ==========================================
  let threatTier = 0;
  let threatTraits = [];
  let threatArmoredLife = false;

  const traitPool = THREAT_POOLS[enemy.id];
  if (traitPool && !isSummon) {
    threatTier = rollThreatTier();
    threatTraits = selectTraits(threatTier, traitPool);

    // Volcanist (tier 3 summoner): swap Volatile → Eruption
    if (enemy.id === 'summoner' && threatTier === 3) {
      const volIdx = threatTraits.indexOf('volatile');
      if (volIdx !== -1) threatTraits[volIdx] = 'eruption';
    }

    // Apply name prefix from tier
    const nameMap = THREAT_NAME_MAP[enemy.id];
    if (nameMap && nameMap[threatTier]) {
      enemy = { ...enemy, name: nameMap[threatTier] };
    }

    // Spawn-time trait modifications
    if (threatTraits.includes('defensive')) {
      enemy.physicalDefense = (enemy.physicalDefense || 0) + 1;
      enemy.sorceryDefense = (enemy.sorceryDefense || 0) + 1;
    }
    if (threatTraits.includes('armored')) {
      if (enemy.type === 'Antagonist' && enemy.armorRating != null) {
        enemy.armorRating += 2;
      } else if (enemy.type === 'Minion') {
        threatArmoredLife = true;
      }
    }
    if (threatTraits.includes('hard')) {
      if (enemy.type === 'Antagonist' && enemy.armorRating != null) {
        enemy.armorRating += 1;
      } else if (enemy.type === 'Minion') {
        threatArmoredLife = true;
      }
    }
    if (threatTraits.includes('faithful')) {
      enemy.sorceryDefense = (enemy.sorceryDefense || 0) + 2;
    }
    if (threatTraits.includes('nimble')) {
      enemy.physicalDefense = (enemy.physicalDefense || 0) + 2;
    }
    if (threatTraits.includes('ironwill')) {
      enemy.sorceryDefense = (enemy.sorceryDefense || 0) + 2;
    }
    // Witch traits: inject ability rules at spawn
    if (threatTraits.includes('glamour')) {
      enemy.rules = [...(enemy.rules || []), { name: 'Glamour', description: 'Sorcery (1 LP): Blinds a player until end of their turn. Attacks auto-miss unless Flex triggers. 1 SP to overcome.' }];
    }
    if (threatTraits.includes('hex')) {
      enemy.rules = [...(enemy.rules || []), { name: 'Hex', description: 'Sorcery (1 LP): Curses a player with -1 attack. Stacks up to 3. Removed when witch dies.' }];
    }
    if (threatTier > 0) {
      console.log(`Conan | Threat Engine: ${enemy.name} — Tier ${threatTier} (${'💀'.repeat(threatTier)}), Traits: [${threatTraits.join(', ')}]`);
    }
  }

  // Get drop position
  const dropPosition = canvas.grid.getSnappedPosition(data.x, data.y);

  // Override images for tiered enemies (summoner gets unique art per skull tier)
  if (enemy.id === 'summoner' && threatTier > 0 && SUMMONER_TIER_IMAGES[threatTier]) {
    enemy.portraitImg = SUMMONER_TIER_IMAGES[threatTier].portrait;
    enemy.tokenImg = SUMMONER_TIER_IMAGES[threatTier].token;
  }

  // Use portrait for actor, token image for token texture
  const portraitImg = enemy.portraitImg || enemy.tokenImg || 'icons/svg/mystery-man.svg';
  const tokenImg = enemy.tokenImg || 'icons/svg/mystery-man.svg';

  // Assign a name for chat flavor
  const NAMED_ENEMY_IDS = ['guard', 'bandit'];
  const PICT_ENEMY_IDS = ['pict-hunter', 'pict-warrior', 'pict-champion'];
  const CULTIST_ENEMY_IDS = ['cultist-initiate', 'cultist', 'cultist-high-priest'];
  const PIRATE_ENEMY_IDS = ['pirate', 'pirate-mate', 'pirate-captain'];
  const BARBARIAN_ENEMY_IDS = ['barbarian-youth', 'barbarian', 'barbarian-chieftain'];
  const STEPPE_ENEMY_IDS = ['steppe-rider-youth', 'steppe-rider', 'steppe-rider-khan'];
  const WITCH_ENEMY_IDS = ['witch'];
  const NECRO_ENEMY_IDS = ['necromancer'];
  const SUMMONER_ENEMY_IDS = ['summoner'];
  const SILKVIPER_ENEMY_IDS = ['handmaiden', 'bride', 'enchantress'];
  const chatNameData = PICT_ENEMY_IDS.includes(enemy.id) ? pickPictName()
    : CULTIST_ENEMY_IDS.includes(enemy.id) ? pickCultistName()
    : BARBARIAN_ENEMY_IDS.includes(enemy.id) ? pickBarbarianName()
    : SUMMONER_ENEMY_IDS.includes(enemy.id) ? pickSummonerName()
    : SILKVIPER_ENEMY_IDS.includes(enemy.id) ? pickSilkViperName()
    : [...NAMED_ENEMY_IDS, ...PIRATE_ENEMY_IDS, ...STEPPE_ENEMY_IDS, ...WITCH_ENEMY_IDS, ...NECRO_ENEMY_IDS].includes(enemy.id) ? pickHyborianName() : null;
  const chatName = chatNameData?.name || null;
  const chatGender = chatNameData?.gender || null;

  // Create actor data for the enemy
  // Token nameplate gets skull emoji for threat tier (always visible to players)
  const tokenDisplayName = threatTier > 0 ? `${'💀'.repeat(threatTier)} ${enemy.name}` : enemy.name;
  const actorData = {
    name: tokenDisplayName,
    type: 'npc2',
    img: portraitImg,
    system: {
      enemyType: enemy.type,
      stats: {
        might: { value: enemy.stats.might.value, die: enemy.stats.might.die },
        edge: { value: enemy.stats.edge.value, die: enemy.stats.edge.die },
        grit: { value: enemy.stats.grit.value, die: enemy.stats.grit.die },
        wits: { value: enemy.stats.wits.value, die: enemy.stats.wits.die }
      },
      defenses: {
        physical: enemy.physicalDefense,
        sorcery: enemy.sorceryDefense
      },
      threshold: enemy.threshold || null,
      lifePoints: enemy.lifePoints ? { value: enemy.lifePoints, max: enemy.lifePoints } : null,
      ar: enemy.armorRating || null,
      attacks: enemy.attacks || {},
      actions: enemy.actions || { perTurn: 2, attackLimit: 1 },
      rules: enemy.rules || [],
      isDefaultEnemy: true,
      sourceEnemyId: enemy.id
    }
  };

  try {
    // Use the scene the GM is currently viewing (not necessarily the active scene)
    const scene = canvas.scene;
    if (!scene) {
      ui.notifications.warn("No scene to place enemy token.");
      return;
    }

    // Create a real actor (required for tokens to reference)
    const actor = await Actor.create(actorData, { conanEnemySpawn: true });

    // Check if enemy has life points (antagonists do, minions don't)
    const hasLifePoints = enemy.lifePoints && enemy.lifePoints > 0;

    // Configure the actor's prototype token for unlinked tokens
    await actor.update({
      'prototypeToken.actorLink': false,
      'prototypeToken.texture.src': tokenImg,
      'prototypeToken.disposition': isSummon ? CONST.TOKEN_DISPOSITIONS.FRIENDLY : CONST.TOKEN_DISPOSITIONS.HOSTILE,
      'prototypeToken.displayName': CONST.TOKEN_DISPLAY_MODES.ALWAYS,
      'prototypeToken.displayBars': hasLifePoints ? CONST.TOKEN_DISPLAY_MODES.ALWAYS : CONST.TOKEN_DISPLAY_MODES.NONE,
      'prototypeToken.bar1.attribute': hasLifePoints ? 'lifePoints' : null,
      'prototypeToken.lockRotation': true
    });

    // Create token data
    const tokenData = await actor.getTokenDocument({
      x: dropPosition.x,
      y: dropPosition.y,
      actorLink: false
    });

    // Create the token on the active scene
    const [createdToken] = await scene.createEmbeddedDocuments('Token', [tokenData]);

    // Store the full enemy data in token flags for our custom dialog
    // Also store the actor ID so we can delete it when the token is removed
    await createdToken.setFlag('conan', 'enemyData', {
      id: enemy.id,
      name: enemy.name,
      type: enemy.type,
      category: enemy.category, // For category theming
      group: enemy.group, // For group background images
      groupBackground: enemy.groupBackground, // Store background URL directly for persistence
      stats: enemy.stats,
      defenses: enemy.defenses,
      physicalDefense: enemy.physicalDefense,
      sorceryDefense: enemy.sorceryDefense,
      threshold: enemy.threshold,
      lifePoints: enemy.lifePoints,
      ar: enemy.ar,
      armorRating: enemy.armorRating,
      attacks: enemy.attacks,
      actions: enemy.actions,
      rules: enemy.rules,
      portraitImg: portraitImg,
      tokenImg: tokenImg,
      actorId: actor.id, // Store actor ID for cleanup
      isSummon: isSummon, // Friendly summoned creature (e.g. Animate Living Statue)
      chatName: chatName,             // Hyborian name for chat flavor
      chatGender: chatGender,         // 'm' or 'f' for pronoun flavor
      threatTier: threatTier,       // Threat Engine: skull tier (0-3)
      threatTraits: threatTraits    // Threat Engine: trait IDs
    });

    // Summon cast tracking: store castId for summon limit enforcement
    if (isSummon && data.summon?.castId) {
      await createdToken.setFlag('conan', 'summonCastId', data.summon.castId);
    }

    // Track which necromancer summoned this skeleton (for Bone Armor counting)
    if (isSummon && data.summon?.summonerTokenId) {
      await createdToken.setFlag('conan', 'summonedBy', data.summon.summonerTokenId);
    }

    // Threat Engine: set armoredLife flag for Armored minions
    if (threatArmoredLife) {
      await createdToken.setFlag('conan', 'armoredLife', true);
    }

    // Move actor to "Encounter Enemies" folder
    const folderName = 'Encounter Enemies';
    let folder = game.folders.find(f => f.name === folderName && f.type === 'Actor');
    if (!folder) {
      // Create the folder if it doesn't exist
      folder = await Folder.create({ name: folderName, type: 'Actor' });
      console.log('Conan | Created "Encounter Enemies" folder');
    }
    await actor.update({ folder: folder.id });

    // === DEBUG: Enemy Creation Summary ===
    console.log(`%c══════ ENEMY CREATED: ${enemy.name} ══════`, 'color: #FFD700; font-weight: bold; font-size: 13px;');
    console.log(`%c  Actor ID:    %c${actor.id}`, 'color: #aaa;', 'color: #fff;');
    console.log(`%c  Token ID:    %c${createdToken.id}`, 'color: #aaa;', 'color: #fff;');
    console.log(`%c  Type:        %c${enemy.type}`, 'color: #aaa;', 'color: #fff;');
    console.log(`%c  Category:    %c${enemy.category || 'none'}`, 'color: #aaa;', 'color: #fff;');
    console.log(`%c  Stats:       %cM${enemy.stats.might.value}(${enemy.stats.might.die}) E${enemy.stats.edge.value}(${enemy.stats.edge.die}) G${enemy.stats.grit.value}(${enemy.stats.grit.die}) W${enemy.stats.wits.value}(${enemy.stats.wits.die})`, 'color: #aaa;', 'color: #7fdbff;');
    console.log(`%c  Defense:     %cPhy ${enemy.physicalDefense} / Sor ${enemy.sorceryDefense}`, 'color: #aaa;', 'color: #7fdbff;');
    console.log(`%c  LP:          %c${enemy.lifePoints || 'N/A (Minion)'}  |  Threshold: ${enemy.threshold || 'N/A'}  |  AR: ${enemy.armorRating ?? enemy.ar ?? 'none'}`, 'color: #aaa;', 'color: #7fdbff;');
    if (threatTier > 0) {
      console.log(`%c  Threat:      %c${'💀'.repeat(threatTier)} Tier ${threatTier} — Traits: [${threatTraits.join(', ')}]`, 'color: #aaa;', 'color: #e0c070;');
    }
    console.log(`%c  Folder:      %c${folder.name} (${folder.id})`, 'color: #aaa;', 'color: #fff;');
    console.log(`%c  Actor LP:    %c${JSON.stringify(actor.system.lifePoints)}`, 'color: #aaa;', 'color: #90ee90;');
    console.log(`%c  Token Flag:  %cenmyData.lifePoints = ${enemy.lifePoints}`, 'color: #aaa;', 'color: #90ee90;');
    console.log(`%c══════════════════════════════════════`, 'color: #FFD700;');

  } catch (error) {
    console.error('Conan | Error creating enemy token:', error);
    ui.notifications.error(`Failed to create enemy token: ${error.message}`);
  }
});

// ========== TOKEN DELETION - Clean up associated actor & protect effects ==========
Hooks.on('deleteToken', async (tokenDoc, options, userId) => {
  // Only GM should run cleanup (setFlag/unsetFlag/actor.delete require ownership)
  if (!game.user.isGM) return;

  const deletedTokenId = tokenDoc.id;

  // --- Clean up Protect effects ---

  // Case 1: Deleted token was a PROTECTED TARGET - free all guards protecting it
  const protectData = tokenDoc.actor?.getFlag('conan', 'protectBonus');
  if (protectData?.sources?.length > 0) {
    for (const guardId of protectData.sources) {
      const guardTokenDoc = game.scenes.active?.tokens.get(guardId);
      if (guardTokenDoc) {
        await guardTokenDoc.setFlag('conan', 'protectUsed', false);
        await guardTokenDoc.unsetFlag('conan', 'protectTarget');
        console.log(`Conan | Freed guard "${guardTokenDoc.name}" from Protect (target deleted)`);
      }
    }
  }

  // Case 2: Deleted token was a GUARD protecting someone - remove its bonus from the target
  const protectTarget = tokenDoc.getFlag('conan', 'protectTarget');
  if (protectTarget) {
    const targetTokenDoc = game.scenes.active?.tokens.get(protectTarget);
    if (targetTokenDoc?.actor) {
      const targetProtect = targetTokenDoc.actor.getFlag('conan', 'protectBonus');
      if (targetProtect) {
        const idx = targetProtect.sources.indexOf(deletedTokenId);
        if (idx > -1) {
          const removedAmount = targetProtect.amounts?.[idx] || 1;
          targetProtect.sources.splice(idx, 1);
          if (targetProtect.amounts) targetProtect.amounts.splice(idx, 1);
          targetProtect.total = Math.max(0, targetProtect.total - removedAmount);
          if (targetProtect.total <= 0) {
            await targetTokenDoc.actor.unsetFlag('conan', 'protectBonus');
          } else {
            await targetTokenDoc.actor.setFlag('conan', 'protectBonus', targetProtect);
          }
          // Also revert the enemy data defense
          const targetEnemyFlag = targetTokenDoc.getFlag('conan', 'enemyData');
          if (targetEnemyFlag) {
            const curDef = parseInt(targetEnemyFlag.physicalDefense) || 0;
            await targetTokenDoc.setFlag('conan', 'enemyData', { ...targetEnemyFlag, physicalDefense: Math.max(0, curDef - removedAmount) });
          }
          console.log(`Conan | Removed Protect (-${removedAmount}) from "${targetTokenDoc.name}" (guard deleted)`);
        }
      }
    }
  }

  // --- Clean up Inspire effects ---

  // Case 1: Deleted token was a CAPTAIN with active Inspire - remove buff from all targets
  const inspireTargets = tokenDoc.getFlag('conan', 'inspireTargets');
  if (inspireTargets?.length > 0) {
    for (const targetId of inspireTargets) {
      const targetTokenDoc = game.scenes.active?.tokens.get(targetId);
      if (targetTokenDoc?.actor) {
        await targetTokenDoc.actor.unsetFlag('conan', 'inspireBuff');
        console.log(`Conan | Removed Inspire from "${targetTokenDoc.name}" (captain deleted)`);
      }
    }
  }

  // Case 2: Deleted token was an INSPIRED TARGET - remove from captain's target list
  const inspireBuff = tokenDoc.actor?.getFlag('conan', 'inspireBuff');
  if (inspireBuff?.source) {
    const captainTokenDoc = game.scenes.active?.tokens.get(inspireBuff.source);
    if (captainTokenDoc) {
      const targets = captainTokenDoc.getFlag('conan', 'inspireTargets') || [];
      const idx = targets.indexOf(deletedTokenId);
      if (idx > -1) {
        targets.splice(idx, 1);
        if (targets.length === 0) {
          await captainTokenDoc.setFlag('conan', 'inspireState', 'spent');
          await captainTokenDoc.unsetFlag('conan', 'inspireTargets');
        } else {
          await captainTokenDoc.setFlag('conan', 'inspireTargets', targets);
        }
        console.log(`Conan | Removed inspired target from captain (target deleted)`);
      }
    }
  }

  // --- Clean up War Cry effects ---
  // If deleted token was a Champion with active War Cry, remove buff from all picts
  const warCryState = tokenDoc.getFlag('conan', 'warCryState');
  if (warCryState === 'active') {
    const allTokens = game.scenes.active?.tokens?.contents || [];
    for (const t of allTokens) {
      if (t.actor?.getFlag('conan', 'warCryBuff')?.source === deletedTokenId) {
        await t.actor.unsetFlag('conan', 'warCryBuff');
        console.log(`Conan | Removed War Cry buff from "${t.name}" (champion deleted)`);
      }
    }
  }

  // --- Clean up Hex effects (witch death removes all hexes she cast) ---
  const deletedEnemy = tokenDoc.getFlag('conan', 'enemyData');
  if (deletedEnemy?.id === 'witch') {
    const allActors = game.actors.filter(a => a.type === 'character2');
    for (const playerActor of allActors) {
      const hexFlag = playerActor.getFlag('conan', 'hexDebuff');
      if (hexFlag?.sources?.includes(deletedTokenId)) {
        await playerActor.unsetFlag('conan', 'hexDebuff');
        console.log(`Conan | Removed Hex from "${playerActor.name}" (witch killed)`);
        ChatMessage.create({
          speaker: ChatMessage.getSpeaker({ actor: playerActor }),
          content: `<div class="conan-roll"><div class="roll-header"><div class="roll-title">${playerActor.name} — Hex Broken!</div></div><div style="text-align: center; padding: 8px; color: #2d6b2d; font-style: italic;">The witch falls and the curse shatters — ${playerActor.name}'s strength returns!</div></div>`
        });
      }
    }
  }

  // --- Clean up Fearsome Ward effects ---
  const fwDebuff = tokenDoc.actor?.getFlag('conan', 'fearsomeWardDebuff');
  if (fwDebuff?.casterId) {
    const fwCaster = game.actors.get(fwDebuff.casterId);
    if (fwCaster) {
      await fwCaster.update({ 'system.fearsomeWardState': 'spent', 'system.fearsomeWardTarget': null });
      console.log(`Conan | Reset Fearsome Ward on "${fwCaster.name}" (warded target deleted)`);
    }
  }

  // --- Clean up Mesmerism effects ---
  const mesmerControl = tokenDoc.actor?.getFlag('conan', 'mesmerismControl');
  if (mesmerControl?.active) {
    // Clear caster's flag so they can cast again
    if (mesmerControl.casterActorId) {
      const caster = game.actors.get(mesmerControl.casterActorId);
      if (caster) {
        await caster.unsetFlag('conan', 'mesmerismCaster');
        console.log(`Conan | Cleared Mesmerism on "${caster.name}" (controlled target deleted)`);
      }
    }
  }

  // --- Clean up associated actor ---
  const enemyData = tokenDoc.getFlag('conan', 'enemyData');
  if (enemyData?.actorId) {
    const actor = game.actors.get(enemyData.actorId);
    if (actor) {
      console.log(`%c══════ ENEMY REMOVED: ${tokenDoc.name} ══════`, 'color: #ff4444; font-weight: bold; font-size: 13px;');
      console.log(`%c  Actor ID:    %c${actor.id} (deleting from Encounter Enemies)`, 'color: #aaa;', 'color: #fff;');
      console.log(`%c  Token ID:    %c${deletedTokenId}`, 'color: #aaa;', 'color: #fff;');
      console.log(`%c  Protect:     %c${protectData ? 'Had ' + protectData.sources.length + ' guards — freed' : 'None'}`, 'color: #aaa;', 'color: #7fdbff;');
      console.log(`%c  Inspire:     %c${inspireBuff ? 'Was inspired — cleaned' : inspireTargets?.length ? 'Was captain — targets freed' : 'None'}`, 'color: #aaa;', 'color: #7fdbff;');
      console.log(`%c══════════════════════════════════════`, 'color: #ff4444;');
      await actor.delete();
    }
  }
});

// ========== COMBAT INITIATIVE - Auto-roll Edge for enemy tokens ==========
Hooks.on('createCombatant', async (combatant, options, userId) => {
  // Only process if we created this combatant
  if (userId !== game.user.id) return;

  // Get the token and check if it's an enemy
  const token = combatant.token;
  if (!token) return;

  const enemyData = token.getFlag('conan', 'enemyData');
  const actor = combatant.actor;

  // Check if this is one of our enemy tokens
  if (enemyData || actor?.system?.isDefaultEnemy || actor?.system?.sourceEnemyId) {
    console.log('Conan | Rolling Edge initiative for enemy:', combatant.name);

    // Get Edge stats from enemy data or actor
    let edgeValue, edgeDie;
    if (enemyData) {
      edgeValue = enemyData.stats?.edge?.value || 2;
      edgeDie = enemyData.stats?.edge?.die || 'D6';
    } else {
      edgeValue = actor?.system?.stats?.edge?.value || 2;
      edgeDie = actor?.system?.stats?.edge?.die || 'D6';
    }

    // Roll Edge check: die + value
    const dieFormula = `1${edgeDie.toLowerCase()}`;
    const roll = await new Roll(dieFormula).evaluate();
    const initiative = roll.total + edgeValue;

    // Update the combatant with the rolled initiative
    await combatant.update({ initiative: initiative });

    // Post to chat
    const messageContent = `
      <div class="conan-enemy-roll">
        <div class="roll-header">${combatant.name} - Initiative (Edge)</div>
        <div class="roll-details">
          <span class="roll-dice">${edgeDie}: ${roll.total}</span>
          <span class="roll-stat">+${edgeValue} (edge)</span>
        </div>
        <div class="roll-total">Initiative: ${initiative}</div>
      </div>
    `;

    ChatMessage.create({
      speaker: { alias: combatant.name },
      content: messageContent,
      rolls: [roll]
    });

    console.log(`Conan | ${combatant.name} initiative: ${initiative}`);
  }
});

// ========== ENEMY ROLL DIALOG ==========
/**
 * Show enemy roll dialog - works for both grid preview and placed tokens
 * @param {Object} enemyData - Enemy data object
 * @param {Token} token - Optional token document for placed enemies
 */
// Track open enemy dialogs by token ID to prevent duplicates
const _openEnemyDialogs = new Map();

function showEnemyRollDialog(enemyData, token = null) {
  const isPlaced = !!token;
  let _protectDismissing = false;

  // Prevent duplicate dialogs for the same token or preview
  const dialogKey = isPlaced ? token.id : `preview-${enemyData.id}`;
  const existingDialog = _openEnemyDialogs.get(dialogKey);
  if (existingDialog) {
    existingDialog.bringToTop();
    return;
  }

  // Get category theme - default to 'human' for older tokens without category stored
  const categoryKey = enemyData.category || 'human';
  const groupKey = enemyData.group || '';
  const theme = CATEGORY_THEMES[categoryKey] || CATEGORY_THEMES.human;

  // Get group background - prefer stored value, fallback to settings lookup
  let groupBackground = enemyData.groupBackground || '';
  if (!groupBackground && groupKey) {
    const groupBackgrounds = game.settings.get('conan', 'enemyGroupBackgrounds') || {};
    const bgKey = `${categoryKey}.${groupKey}`;
    groupBackground = groupBackgrounds[bgKey] || '';
  }

  // Helper to randomize from range
  const randomFromRange = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

  // Get current values - randomize from range for preview, use actual for placed
  const physDef = isPlaced ? enemyData.physicalDefense : randomFromRange(enemyData.defenses.physical.min, enemyData.defenses.physical.max);
  const sorcDef = isPlaced ? enemyData.sorceryDefense : randomFromRange(enemyData.defenses.sorcery.min, enemyData.defenses.sorcery.max);
  const ar = isPlaced ? (enemyData.armorRating || null) : (enemyData.ar ? randomFromRange(enemyData.ar.min, enemyData.ar.max) : null);

  // Check if this token has a Protect bonus (for green defense indicator)
  const tokenProtectData = (isPlaced && token?.actor) ? token.actor.getFlag('conan', 'protectBonus') : null;
  const hasProtectBonus = tokenProtectData?.total > 0;

  // Check if this token has a Tide of Stone debuff (for red defense indicator)
  const tokenTideData = (isPlaced && token?.actor) ? token.actor.getFlag('conan', 'tideOfStoneDebuff') : null;
  const hasTideDebuff = tokenTideData?.total > 0;

  // Check if this token has a Chilling Touch debuff (physical + sorcery defense)
  const tokenChillingData = (isPlaced && token?.actor) ? token.actor.getFlag('conan', 'chillingTouchDebuff') : null;

  // Physical defense color logic: green if net buff, red if net debuff, yellow if tied
  let defColorClass = '';
  const buffTotal = tokenProtectData?.total || 0;
  const physDebuffTotal = (tokenTideData?.total || 0) + (tokenChillingData?.physTotal || 0);
  if (buffTotal > 0 || physDebuffTotal > 0) {
    if (buffTotal > physDebuffTotal) defColorClass = 'protect-boosted';
    else if (physDebuffTotal > buffTotal) defColorClass = 'tide-debuffed';
    else defColorClass = 'defense-contested';
  }

  // Sorcery defense color logic: red if any debuff
  let sorcDefColorClass = '';
  const sorcDebuffTotal = tokenChillingData?.sorcTotal || 0;
  if (sorcDebuffTotal > 0) sorcDefColorClass = 'tide-debuffed';

  // HP/Threshold display
  // Threshold (minions): Just a static reference number - deal >= TH damage in one hit = dead
  // Life Points (antagonists): Track current/max, editable for placed tokens
  let hpDisplay = '';
  if (enemyData.type === 'Minion') {
    // Minions just show threshold as a static value
    const threshold = enemyData.threshold;
    hpDisplay = `<div class="defense-item"><span class="def-label">TH</span><span class="def-value">${threshold}</span></div>`;
  } else {
    // Antagonists have Life Points that need tracking
    const maxLP = enemyData.lifePoints;
    const currentLP = isPlaced
      ? (enemyData.isBeastForm && token?.actor
        ? (token.actor.system.lifePoints?.value ?? maxLP)
        : (token.getFlag('conan', 'currentHP') ?? maxLP))
      : maxLP;
    if (isPlaced) {
      hpDisplay = `<div class="defense-item hp-edit"><span class="def-label">LP</span><input type="number" class="hp-current" value="${currentLP}" min="0" max="${maxLP}" data-token-id="${token.id}"></div>`;
    } else {
      hpDisplay = `<div class="defense-item"><span class="def-label">LP</span><span class="def-value">${maxLP}</span></div>`;
    }
  }

  // Build weapon buttons - handle both single weapons and arrays (up to 4 total)
  const weapons = [];
  const mightVal = enemyData.stats.might.value;
  const mightDie = enemyData.stats.might.die;
  const edgeVal = enemyData.stats.edge.value;
  const edgeDie = enemyData.stats.edge.die;
  const hasFearsomeWard = isPlaced && token?.actor?.getFlag('conan', 'fearsomeWardDebuff')?.active;

  if (enemyData.attacks?.melee) {
    const meleeWeapons = Array.isArray(enemyData.attacks.melee) ? enemyData.attacks.melee : [enemyData.attacks.melee];
    meleeWeapons.forEach(m => {
      const normalBtn = `<button type="button" class="weapon-btn" data-attack="melee" data-damage="${m.damage}" data-name="${m.name}" data-stat="might" data-stat-value="${mightVal}" data-stat-die="${mightDie}" title="${m.special || ''}">
          <div class="weapon-icon"><i class="fas fa-fist-raised"></i></div>
          <div class="weapon-details">
            <span class="weapon-name">${m.name}</span>
            <span class="weapon-damage">${m.damage}</span>
            <span class="weapon-range">${m.range}</span>
          </div>
        </button>`;
      if (hasFearsomeWard) {
        const wardedBtn = `<button type="button" class="weapon-btn warded" data-attack="melee" data-damage="${m.damage}" data-name="${m.name}" data-stat="might" data-stat-value="${mightVal}" data-stat-die="${mightDie}" data-warded="true" title="Warded Attack — -2 to Hit">
            <div class="weapon-icon"><img src="systems/conan/images/icons/fearsome_ward_icon.png" class="ward-weapon-icon"/></div>
            <div class="weapon-details">
              <span class="weapon-name">${m.name}</span>
              <span class="weapon-damage">${m.damage}</span>
              <span class="weapon-range">Warded -2</span>
            </div>
          </button>`;
        weapons.push(`<div class="weapon-ward-pair">${normalBtn}${wardedBtn}</div>`);
      } else {
        weapons.push(normalBtn);
      }
    });
  }
  if (enemyData.attacks?.ranged) {
    const rangedWeapons = Array.isArray(enemyData.attacks.ranged) ? enemyData.attacks.ranged : [enemyData.attacks.ranged];
    rangedWeapons.forEach(r => {
      // garroteOnly weapons hidden unless enemy has garrote trait
      if (r.garroteOnly && !enemyData.threatTraits?.includes('garrote')) return;
      // Silk Whip uses Might, not Edge
      const rStat = r.name === 'Silk Whip' ? 'might' : 'edge';
      const rStatVal = r.name === 'Silk Whip' ? mightVal : edgeVal;
      const rStatDie = r.name === 'Silk Whip' ? mightDie : edgeDie;
      weapons.push(`
        <button type="button" class="weapon-btn" data-attack="ranged" data-damage="${r.damage}" data-name="${r.name}" data-stat="${rStat}" data-stat-value="${rStatVal}" data-stat-die="${rStatDie}" title="${r.special || ''}">
          <div class="weapon-icon"><i class="fas fa-crosshairs"></i></div>
          <div class="weapon-details">
            <span class="weapon-name">${r.name}</span>
            <span class="weapon-damage">${r.damage}</span>
            <span class="weapon-range">${r.range}</span>
          </div>
        </button>
      `);
    });
  }

  const weaponCount = weapons.length;
  const weaponsHtml = weapons.length > 0 ? weapons.join('') : '<div class="no-weapons">No weapons</div>';

  // Build rules section
  let rulesHtml = '';
  if (enemyData.rules?.length > 0) {
    rulesHtml = enemyData.rules.map(r => `<div class="rule"><span class="rule-name">${r.name}:</span> ${r.description}</div>`).join('');
  }

  // Build ability buttons for header (one small button per rule)
  // Check ability states from token flags
  const isProtectActive = isPlaced && token?.getFlag('conan', 'protectUsed');
  const inspireState = isPlaced ? token?.getFlag('conan', 'inspireState') : null; // null=ready, 'active', 'spent'
  const warCryState = isPlaced ? token?.getFlag('conan', 'warCryState') : null; // null=ready, 'active'
  let abilityButtonsHtml = '';
  if (enemyData.rules?.length > 0) {
    abilityButtonsHtml = enemyData.rules.map((r, i) => {
      let stateClass = '';
      let tooltip = '';
      if (r.name === 'Protect' && isProtectActive) {
        stateClass = 'ability-active';
      } else if (r.name === 'Inspire') {
        if (inspireState === 'active') stateClass = 'ability-active';
        else if (inspireState === 'spent') stateClass = 'ability-spent';
        tooltip = ' title="Click targets, then press Shift to activate"';
      } else if (r.name === 'War Cry') {
        if (warCryState === 'active') stateClass = 'ability-active';
        tooltip = ' title="Once per combat: +1 Attack to all Picts"';
      } else if (r.name === 'Blood Sacrifice') {
        stateClass = 'blood-sacrifice-btn';
        tooltip = ' title="Kill this cultist to heal ALL demons on scene for 1d6 LP"';
      } else if (r.name === 'Summon Fiend') {
        const hasDedicated = enemyData.threatTraits?.includes('dedicated');
        stateClass = hasDedicated ? 'summon-fiend-btn' : 'ability-disabled';
        tooltip = hasDedicated
          ? ' title="Summon a Fiend (2/3) or Horror (1/3) — requires a cultist sacrifice"'
          : ' title="Summon Fiend — requires Dedicated Servant trait to activate"';
      } else if (r.name === 'Bellow for Blood') {
        const bellowUsed = isPlaced && token?.getFlag('conan', 'bellowUsed');
        stateClass = bellowUsed ? 'ability-spent' : 'bellow-btn';
        tooltip = bellowUsed
          ? ' title="Bellow for Blood — already used this combat"'
          : ' title="Once per combat: +1 Damage to all Barbarians. Roar: heals 1 wound / 8 LP"';
      } else if (r.name === 'White Magic') {
        stateClass = 'call-beast-btn';
        tooltip = ' title="Call Beast — summon a beast ally onto the battlefield"';
      } else if (r.name === 'Master of the Dead') {
        stateClass = 'necro-btn';
        tooltip = ' title="Raise Dead or Death Scream — dark necromancy"';
      } else if (r.name === 'Demonic Darkness') {
        stateClass = 'summoner-btn';
        tooltip = ' title="Demonic Ward, Hellfire, or Summon Fiend — dark sorcery"';
      } else if (r.name === 'Glamour') {
        stateClass = 'glamour-btn';
        tooltip = ' title="Sorcery (1 LP): Blind a player — attacks auto-miss unless Flex saves them"';
      } else if (r.name === 'Hex') {
        stateClass = 'hex-btn';
        tooltip = ' title="Sorcery (1 LP): -1 attack on a player. Stacks up to 3. Removed on witch death."';
      } else if (r.name === 'Lust') {
        stateClass = 'lust-btn';
        tooltip = ' title="Sorcery (1 LP): Blind a player — they see nothing but the object of their desire"';
      } else if (r.name === 'Tender Mercy') {
        stateClass = 'tender-mercy-btn';
        tooltip = ' title="Sorcery (1 LP): Heal an ally for 2D4+2 LP"';
      }
      return `<button type="button" class="ability-btn ${stateClass}" data-rule-index="${i}" data-rule-name="${r.name}"${tooltip}><i class="fas fa-bolt"></i> ${r.name}</button>`;
    }).join('');
  }
  // Beast Form: add Dismiss button
  if (enemyData.isBeastForm) {
    abilityButtonsHtml += `<button type="button" class="ability-btn beast-dismiss-btn" title="Dismiss Beast Form and revert to human"><i class="fas fa-times-circle"></i> Dismiss</button>`;
  }

  // Build active effects for right side of portrait (effects applied TO this enemy by others)
  const activeEffects = [];
  if (isPlaced && token?.actor) {
    // Protect effect
    const pData = token.actor.getFlag('conan', 'protectBonus');
    if (pData?.total > 0) {
      const guardNames = pData.sources.map(id => {
        const gt = game.scenes.active?.tokens.get(id);
        return gt?.name || 'Guard';
      }).join(', ');
      activeEffects.push(`<button type="button" class="active-effect-btn" data-effect="protect" title="Protected by: ${guardNames} (+${pData.total} Phys Def) - Click to remove one"><i class="fas fa-shield-alt"></i><span class="effect-count">${pData.total}</span></button>`);
    }
    // Inspire effect
    const inspireData = token.actor.getFlag('conan', 'inspireBuff');
    if (inspireData?.source) {
      const captainToken = game.scenes.active?.tokens.get(inspireData.source);
      const captainName = captainToken?.name || 'Guard Captain';
      activeEffects.push(`<button type="button" class="active-effect-btn" data-effect="inspire" data-source-token="${inspireData.source}" title="Inspired by ${captainName} (+1 Attack)">Inspire</button>`);
    }
    // War Cry buff
    const warCryData = token.actor.getFlag('conan', 'warCryBuff');
    if (warCryData?.source) {
      const championToken = game.scenes.active?.tokens.get(warCryData.source);
      const championName = championToken?.name || 'Pict Champion';
      const hasWC = enemyData.threatTraits?.includes('warchant');
      const wcTip = hasWC ? `War Cry (+1 Atk) + War Chant (+2 Dmg) from ${championName}` : `War Cry (+1 Attack) from ${championName}`;
      activeEffects.push(`<button type="button" class="active-effect-btn war-cry-effect" data-effect="warcry" data-source-token="${warCryData.source}" title="${wcTip}">War Cry</button>`);
    }
    // Tide of Stone debuff
    const tideData = token.actor.getFlag('conan', 'tideOfStoneDebuff');
    if (tideData?.total > 0) {
      activeEffects.push(`<button type="button" class="active-effect-btn tide-of-stone-effect" data-effect="tide-of-stone" title="Tide of Stone (-${tideData.total} Phys Def) - Click to remove one"><img src="systems/conan/images/icons/tide_of_stone_icon.png" class="effect-icon"/><span class="effect-count">${tideData.total}</span></button>`);
    }
    // Bane Weapon buff
    const baneData = token.actor.system?.baneWeaponBuff;
    if (baneData?.damageDie) {
      activeEffects.push(`<button type="button" class="active-effect-btn bane-weapon-effect" data-effect="bane-weapon" title="Bane Weapon (+${baneData.damageDie} damage, Prone on hit) from ${baneData.casterName || 'Sorcerer'} - Click to dismiss"><img src="systems/conan/images/icons/create_bane_weapon_icon.png" class="effect-icon"/></button>`);
    }
    // Snake Venom debuff
    const venomData = token.actor.getFlag('conan', 'snakeVenom');
    if (venomData?.active) {
      activeEffects.push(`<button type="button" class="active-effect-btn snake-venom-effect" data-effect="snake-venom" title="Snake Venom (-2 Attacks, 1 dmg/round) - Click to dismiss"><img src="systems/conan/images/icons/poisoned_icon.png" class="effect-icon"/></button>`);
    }
    // Frightful Aura debuff
    const frightfulData = token.actor.getFlag('conan', 'frightfulAuraDebuff');
    if (frightfulData?.active) {
      activeEffects.push(`<button type="button" class="active-effect-btn frightful-aura-effect" data-effect="frightful-aura" title="Frightful Aura (-2 Wits & Grit Checks) - Click to dismiss"><img src="systems/conan/images/icons/frightful_aura_icon.png" class="effect-icon"/></button>`);
    }
    // Fearsome Ward debuff
    const wardData = token.actor.getFlag('conan', 'fearsomeWardDebuff');
    if (wardData?.active) {
      activeEffects.push(`<button type="button" class="active-effect-btn fearsome-ward-effect" data-effect="fearsome-ward" title="Fearsome Ward (-2 Melee Attacks vs caster) - Click to dismiss"><img src="systems/conan/images/icons/fearsome_ward_icon.png" class="effect-icon"/></button>`);
    }
    // Stunned debuff (Wave of Darkness)
    const stunnedData = token.actor.getFlag('conan', 'stunnedDebuff');
    if (stunnedData?.active) {
      activeEffects.push(`<button type="button" class="active-effect-btn stunned-effect" data-effect="stunned" title="Stunned — cannot make any move actions. Click to dismiss."><img src="systems/conan/images/icons/stunned_icon.png" class="effect-icon"/></button>`);
    }
    // Prone debuff (Bane Weapon)
    const proneData = token.actor.getFlag('conan', 'proneDebuff');
    if (proneData?.active) {
      activeEffects.push(`<button type="button" class="active-effect-btn prone-effect" data-effect="prone" title="Prone — Click to dismiss"><img src="systems/conan/images/icons/prone_icon.png" class="effect-icon"/></button>`);
    }
    // Mesmerism control
    const mesmerData = token.actor.getFlag('conan', 'mesmerismControl');
    if (mesmerData?.active) {
      const casterActor = game.actors.get(mesmerData.casterActorId);
      const casterName = casterActor?.name || 'Sorcerer';
      const permLabel = mesmerData.permanent ? ' (Permanent)' : ` (Round ${mesmerData.roundCount}/3)`;
      activeEffects.push(`<button type="button" class="active-effect-btn mesmerism-effect" data-effect="mesmerism" title="Mesmerised by ${casterName}${permLabel} — Click to dismiss"><img src="systems/conan/images/icons/mesmerism_icon.png" class="effect-icon"/></button>`);
    }
    // Hellfire debuff (stacking -1 Checks & Attacks)
    const hellfireData = token.actor.getFlag('conan', 'hellfireDebuff');
    if (hellfireData?.total > 0) {
      activeEffects.push(`<button type="button" class="active-effect-btn hellfire-effect" data-effect="hellfire" title="Hellfire (-${hellfireData.total} Checks & Attacks) - Click to remove one"><img src="systems/conan/images/icons/hellfire_icon.png" class="effect-icon"/><span class="effect-count">${hellfireData.total}</span></button>`);
    }
    // Martyr buff (Threat Engine — Cultists)
    const martyrBuffData = token.actor.getFlag('conan', 'martyrBuff');
    if (martyrBuffData?.stacks > 0) {
      activeEffects.push(`<button type="button" class="active-effect-btn martyr-effect" data-effect="martyr" title="Martyr's Fury (+${martyrBuffData.stacks} damage) — Click to dismiss"><i class="fas fa-skull"></i><span class="effect-count">${martyrBuffData.stacks}</span></button>`);
    }
    // Berserker buff (Threat Engine — Barbarians)
    const berserkerBuffData = token.actor.getFlag('conan', 'berserkerBuff');
    if (berserkerBuffData?.stacks > 0) {
      activeEffects.push(`<button type="button" class="active-effect-btn berserker-effect" data-effect="berserker" title="Berserker Fury (+${berserkerBuffData.stacks} damage) — Click to dismiss"><i class="fas fa-axe-battle"></i><span class="effect-count">${berserkerBuffData.stacks}</span></button>`);
    }
  }
  const activeEffectsHtml = activeEffects.join('');

  // Build theme-specific styles
  const themeStyles = `
    <style>
      .enemy-roll-dialog[data-category="${categoryKey}"] {
        --theme-primary: ${theme.primary};
        --theme-secondary: ${theme.secondary};
        --theme-accent: ${theme.accent};
        --theme-border: ${theme.border};
        --theme-glow: ${theme.glow};
      }
      .enemy-roll-dialog[data-category="${categoryKey}"] .stat-btn {
        background: linear-gradient(180deg, ${theme.primary} 0%, ${theme.secondary} 100%);
        border-color: ${theme.border};
      }
      .enemy-roll-dialog[data-category="${categoryKey}"] .stat-btn:hover {
        border-color: ${theme.accent};
        box-shadow: 0 0 8px ${theme.glow};
      }
      .enemy-roll-dialog[data-category="${categoryKey}"] .weapon-btn {
        background: linear-gradient(180deg, ${theme.primary} 0%, ${theme.secondary} 100%);
        border-color: ${theme.border};
      }
      .enemy-roll-dialog[data-category="${categoryKey}"] .weapon-btn:hover {
        border-color: ${theme.accent};
        box-shadow: 0 0 10px ${theme.glow};
      }
      .enemy-roll-dialog[data-category="${categoryKey}"] .defense-item {
        border-color: ${theme.border};
      }
      .enemy-roll-dialog[data-category="${categoryKey}"] .enemy-type-badge {
        background: linear-gradient(180deg, ${theme.primary} 0%, ${theme.secondary} 100%);
        border-color: ${theme.accent};
      }
      ${theme.isSuper ? `
      .enemy-roll-dialog[data-category="${categoryKey}"] .enemy-portrait-container {
        box-shadow: 0 0 15px ${theme.glow}, inset 0 0 20px rgba(0,0,0,0.5);
      }
      ` : ''}
    </style>
  `;

  // Build background style if set
  const bgStyle = groupBackground ? `background-image: url('${groupBackground}'); background-size: cover; background-position: center;` : '';

  // Helper function to build status grid HTML (used for initial render and updates)
  const buildStatusGridHtml = () => {
    if (!isPlaced || !token?.actor) return '';

    const actor = token.actor;
    const actorConditions = actor.system?.conditions || {};
    const actorBuffsDebuffs = actor.system?.buffsDebuffs || {};

    const activeStatuses = [];

    CONDITIONS.forEach(cond => {
      if (actorConditions[cond.key] === true && !cond.displayOnly) {
        activeStatuses.push({
          key: cond.key,
          name: cond.name,
          icon: cond.icon,
          color: cond.color,
          type: 'condition'
        });
      }
    });

    BUFFS_DEBUFFS.forEach(bd => {
      if (actorBuffsDebuffs[bd.key] === true) {
        activeStatuses.push({
          key: bd.key,
          name: bd.name,
          icon: bd.icon,
          color: bd.color,
          type: bd.type === 'buff' ? 'buff' : 'debuff',
          source: bd.source
        });
      }
    });

    if (activeStatuses.length === 0) return '';

    const statusIcons = activeStatuses.map(status => {
      const tooltip = status.source ? `${status.name} (${status.source}) - Click to remove` : `${status.name} - Click to remove`;
      // All status types (condition, buff, debuff) now use actual icons
      return `
        <div class="enemy-status-icon ${status.type}"
             data-status-key="${status.key}"
             data-status-type="${status.type}"
             style="--status-color: ${status.color};"
             title="${tooltip}">
          <img src="${status.icon}" alt="${status.name}">
        </div>
      `;
    }).join('');

    return `<div class="enemy-status-grid">${statusIcons}</div>`;
  };

  // Build initial status grid
  const statusGridHtml = buildStatusGridHtml();

  // Threat Engine: skull icons + trait tags for enemy card
  const threatSkullCount = enemyData.threatTier || 0;
  const threatSkullsHtml = threatSkullCount > 0
    ? ` <span class="threat-skulls">${'<i class="fas fa-skull"></i>'.repeat(threatSkullCount)}</span>`
    : '';
  const threatTraitsHtml = (enemyData.threatTraits?.length > 0)
    ? `<div class="threat-traits">${enemyData.threatTraits.map(tid => {
        const trait = ALL_THREAT_TRAITS.find(t => t.id === tid);
        return `<span class="threat-trait" title="${trait?.description || ''}">${trait?.name || tid}</span>`;
      }).join('')}</div>`
    : '';

  // ── New CCG card layout (guards) vs old horizontal layout ──
  const isNewCardLayout = enemyData.id in THREAT_POOLS;

  let content;
  if (isNewCardLayout) {
    // Build new card ability buttons with inline tooltips
    let newAbilityHtml = '';
    if (enemyData.rules?.length > 0) {
      newAbilityHtml = enemyData.rules.map((r, i) => {
        let stateClass = '';
        let extraAttrs = '';
        if (r.name === 'Protect' && isProtectActive) stateClass = 'ability-active';
        else if (r.name === 'Inspire') {
          if (inspireState === 'active') stateClass = 'ability-active';
          else if (inspireState === 'spent') stateClass = 'ability-spent';
          extraAttrs = ' title="Click targets, then press Shift to activate"';
        } else if (r.name === 'War Cry') {
          if (warCryState === 'active') stateClass = 'ability-active';
          extraAttrs = ' title="Once per combat: +1 Attack to all Picts"';
        } else if (r.name === 'Blood Sacrifice') {
          stateClass = 'blood-sacrifice-btn';
          extraAttrs = ' title="Kill this cultist to heal ALL demons on scene for 1d6 LP"';
        } else if (r.name === 'Summon Fiend') {
          const hasDedicated = enemyData.threatTraits?.includes('dedicated');
          stateClass = hasDedicated ? 'summon-fiend-btn' : 'ability-disabled';
          extraAttrs = hasDedicated
            ? ' title="Summon a Fiend (2/3) or Horror (1/3) — requires a cultist sacrifice"'
            : ' title="Summon Fiend — requires Dedicated Servant trait to activate"';
        } else if (r.name === 'Bellow for Blood') {
          const bellowUsed = isPlaced && token?.getFlag('conan', 'bellowUsed');
          stateClass = bellowUsed ? 'ability-spent' : 'bellow-btn';
          extraAttrs = bellowUsed
            ? ' title="Bellow for Blood — already used this combat"'
            : ' title="Once per combat: +1 Damage to all Barbarians. Roar: heals 1 wound / 8 LP"';
        } else if (r.name === 'Glamour') {
          stateClass = 'glamour-btn';
          extraAttrs = ' title="Sorcery (1 LP): Blind a player — attacks auto-miss unless Flex saves them"';
        } else if (r.name === 'Hex') {
          stateClass = 'hex-btn';
          extraAttrs = ' title="Sorcery (1 LP): -1 attack on a player. Stacks up to 3. Removed on witch death."';
        } else if (r.name === 'Lust') {
          stateClass = 'lust-btn';
          extraAttrs = ' title="Sorcery (1 LP): Blind a player — they see nothing but the object of their desire"';
        } else if (r.name === 'Tender Mercy') {
          stateClass = 'tender-mercy-btn';
          extraAttrs = ' title="Sorcery (1 LP): Heal an ally for 2D4+2 LP"';
        } else if (r.name === 'Master of the Dead') {
          stateClass = 'necro-btn';
          extraAttrs = ' title="Raise Dead or Death Scream — dark necromancy"';
        } else if (r.name === 'Demonic Darkness') {
          stateClass = 'summoner-btn';
          extraAttrs = ' title="Demonic Ward, Hellfire, or Summon Fiend — dark sorcery"';
        }
        const icon = r.name === 'Inspire' ? '✦' : r.name === 'War Cry' ? '🗣' : r.name === 'Blood Sacrifice' ? '🩸' : r.name === 'Summon Fiend' ? '👹' : r.name === 'Bellow for Blood' ? '🪓' : r.name === 'Glamour' ? '👁' : r.name === 'Hex' ? '🔮' : r.name === 'White Magic' ? '🌿' : r.name === 'Master of the Dead' ? '💀' : r.name === 'Demonic Darkness' ? '🔥' : r.name === 'Lust' ? '💋' : r.name === 'Tender Mercy' ? '💗' : '⚔';
        return `<button type="button" class="ability-btn ${stateClass}" data-rule-index="${i}" data-rule-name="${r.name}"${extraAttrs}>${icon} ${r.name}<div class="ability-tooltip"><strong>${r.name}:</strong> ${r.description}</div></button>`;
      }).join('');
    }

    // Build new card weapon pills with hover tooltips
    const newWeapons = [];
    if (enemyData.attacks?.melee) {
      const meleeArr = Array.isArray(enemyData.attacks.melee) ? enemyData.attacks.melee : [enemyData.attacks.melee];
      meleeArr.forEach(m => {
        newWeapons.push(`<button type="button" class="weapon-btn" data-attack="melee" data-damage="${m.damage}" data-name="${m.name}" data-stat="might" data-stat-value="${mightVal}" data-stat-die="${mightDie}"><span class="weapon-name">${m.name}</span><div class="weapon-tooltip"><span class="wp-dmg">${m.damage}</span> · <span class="wp-range">${m.range}</span></div></button>`);
      });
    }
    if (enemyData.attacks?.ranged) {
      const rangedArr = Array.isArray(enemyData.attacks.ranged) ? enemyData.attacks.ranged : [enemyData.attacks.ranged];
      rangedArr.forEach(r => {
        if (r.garroteOnly && !enemyData.threatTraits?.includes('garrote')) return;
        const rStat = r.name === 'Silk Whip' ? 'might' : 'edge';
        const rStatVal = r.name === 'Silk Whip' ? mightVal : edgeVal;
        const rStatDie = r.name === 'Silk Whip' ? mightDie : edgeDie;
        newWeapons.push(`<button type="button" class="weapon-btn" data-attack="ranged" data-damage="${r.damage}" data-name="${r.name}" data-stat="${rStat}" data-stat-value="${rStatVal}" data-stat-die="${rStatDie}"><span class="weapon-name">${r.name}</span><div class="weapon-tooltip"><span class="wp-dmg">${r.damage}</span> · <span class="wp-range">${r.range}</span></div></button>`);
      });
    }

    // Build new card trait badges with inline tooltips
    const newTraitsHtml = (enemyData.threatTraits?.length > 0)
      ? enemyData.threatTraits.map(tid => {
          const trait = ALL_THREAT_TRAITS.find(t => t.id === tid);
          return `<span class="trait-badge">${trait?.name || tid}<span class="trait-tooltip">${trait?.description || ''}</span></span>`;
        }).join('')
      : '';

    // Build HP/TH badge for new card (icon-based, no input)
    let hpBadgeHtml = '';
    if (enemyData.type === 'Minion') {
      hpBadgeHtml = `<div class="hp-badge"><i class="fas fa-heart hp-icon"></i><span class="hp-val">${enemyData.threshold}</span></div>`;
    } else {
      const maxLP = enemyData.lifePoints;
      const currentLP = isPlaced
        ? (enemyData.isBeastForm && token?.actor
          ? (token.actor.system.lifePoints?.value ?? maxLP)
          : (token.getFlag('conan', 'currentHP') ?? maxLP))
        : maxLP;
      hpBadgeHtml = `<div class="hp-badge"><i class="fas fa-heart hp-icon"></i><span class="hp-val">${currentLP}</span></div>`;
    }

    // Physical defense color for new card (use same class names as old card for hook compat)
    let physDefClass = '';
    if (buffTotal > physDebuffTotal) physDefClass = 'protect-boosted';
    else if (physDebuffTotal > buffTotal) physDefClass = 'tide-debuffed';
    else if (buffTotal > 0) physDefClass = 'defense-contested';

    let sorcDefClass = '';
    if (sorcDebuffTotal > 0) sorcDefClass = 'tide-debuffed';

    // Build status condition badges for effects column
    let statusEffectBadges = '';
    if (isPlaced && token?.actor) {
      const actor = token.actor;
      const actorConditions = actor.system?.conditions || {};
      const actorBuffsDebuffs = actor.system?.buffsDebuffs || {};
      CONDITIONS.forEach(cond => {
        if (actorConditions[cond.key] === true && !cond.displayOnly) {
          statusEffectBadges += `<button type="button" class="active-effect-btn status-condition-effect" data-effect="status-condition" data-status-key="${cond.key}" data-status-type="condition" title="${cond.name} - Click to remove"><img src="${cond.icon}" class="effect-icon"/></button>`;
        }
      });
      BUFFS_DEBUFFS.forEach(bd => {
        if (actorBuffsDebuffs[bd.key] === true) {
          statusEffectBadges += `<button type="button" class="active-effect-btn status-condition-effect" data-effect="status-condition" data-status-key="${bd.key}" data-status-type="${bd.type === 'buff' ? 'buff' : 'debuff'}" title="${bd.name}${bd.source ? ` (${bd.source})` : ''} - Click to remove"><img src="${bd.icon}" class="effect-icon"/></button>`;
        }
      });
    }

    const allEffectsHtml = activeEffectsHtml + statusEffectBadges;
    const portraitSrc = enemyData.portraitImg || enemyData.tokenImg || 'icons/svg/mystery-man.svg';

    content = `
      ${themeStyles}
      <div class="enemy-ccg-card enemy-roll-dialog" data-category="${categoryKey}">
        <div class="card-bg" style="${bgStyle}"></div>
        <div class="enemy-portrait-container">
          <img class="portrait-img" src="${portraitSrc}">
          <span class="type-badge ${enemyData.type === 'Minion' ? 'minion' : 'antagonist'}">${enemyData.type.toUpperCase()}</span>
          ${newAbilityHtml ? `<div class="enemy-ability-buttons">${newAbilityHtml}</div>` : ''}
          ${allEffectsHtml ? `<div class="enemy-active-effects">${allEffectsHtml}</div>` : ''}
        </div>
        <div class="stats-panel">
          <div class="card-traits">${newTraitsHtml}</div>
          <div class="card-defenses">
            ${hpBadgeHtml}
            <div class="def-badge"><i class="fas fa-shield-halved def-icon phys"></i><span class="def-val ${physDefClass}">${physDef}</span></div>
            <div class="def-badge"><i class="fas fa-hat-wizard def-icon sorc"></i><span class="def-val ${sorcDefClass}">${sorcDef}</span></div>
            ${ar !== null ? `<div class="def-badge"><i class="fas fa-helmet-safety def-icon ar"></i><span class="def-val">${ar}</span></div>` : ''}
          </div>
          <div class="stats-spacer"></div>
          <div class="stats-grid">
            <div class="stat-cell">
              <button type="button" class="stat-btn" data-stat="might" data-value="${enemyData.stats.might.value}" data-die="${enemyData.stats.might.die}"><span class="stat-val">${enemyData.stats.might.value}</span><span class="stat-name-tooltip">Might — melee, feats of strength</span></button>
              <span class="stat-die">${enemyData.stats.might.die}</span>
            </div>
            <div class="stat-cell">
              <button type="button" class="stat-btn" data-stat="edge" data-value="${enemyData.stats.edge.value}" data-die="${enemyData.stats.edge.die}"><span class="stat-val">${enemyData.stats.edge.value}</span><span class="stat-name-tooltip">Edge — ranged, agility, stealth</span></button>
              <span class="stat-die">${enemyData.stats.edge.die}</span>
            </div>
            <div class="stat-cell">
              <button type="button" class="stat-btn" data-stat="grit" data-value="${enemyData.stats.grit.value}" data-die="${enemyData.stats.grit.die}"><span class="stat-val">${enemyData.stats.grit.value}</span><span class="stat-name-tooltip">Grit — toughness, endurance</span></button>
              <span class="stat-die">${enemyData.stats.grit.die}</span>
            </div>
            <div class="stat-cell">
              <button type="button" class="stat-btn" data-stat="wits" data-value="${enemyData.stats.wits.value}" data-die="${enemyData.stats.wits.die}"><span class="stat-val">${enemyData.stats.wits.value}</span><span class="stat-name-tooltip">Wits — awareness, willpower</span></button>
              <span class="stat-die">${enemyData.stats.wits.die}</span>
            </div>
          </div>
          <div class="card-weapons">${newWeapons.join('')}</div>
        </div>
      </div>
    `;
  } else {
    content = `
      ${themeStyles}
      <div class="enemy-roll-dialog horizontal" data-category="${categoryKey}" style="${bgStyle}">
        <div class="enemy-portrait-container${enemyData.isSummon ? ' summon-portrait' : ''}">
          <img src="${enemyData.portraitImg || enemyData.tokenImg || 'icons/svg/mystery-man.svg'}" class="enemy-portrait">
          ${abilityButtonsHtml ? `<div class="enemy-ability-buttons">${abilityButtonsHtml}</div>` : ''}
          ${activeEffectsHtml ? `<div class="enemy-active-effects">${activeEffectsHtml}</div>` : ''}
        </div>
        <div class="enemy-content">
          <div class="enemy-header-row">
            <div class="enemy-identity">
              <span class="enemy-name">${enemyData.name}${threatSkullsHtml}</span>
              <span class="enemy-type-badge ${enemyData.type === 'Minion' ? 'minion' : 'antagonist'}">${enemyData.type.toUpperCase()}</span>
              ${threatTraitsHtml}
            </div>
            ${statusGridHtml}
            <div class="enemy-defenses">
              ${hpDisplay}
              <div class="defense-item"><span class="def-label"><i class="fas fa-shield-alt"></i></span><span class="def-value ${defColorClass}" title="${hasProtectBonus ? `Protect +${buffTotal}` : ''}${(hasProtectBonus && physDebuffTotal > 0) ? ' / ' : ''}${tokenTideData?.total > 0 ? `Tide of Stone -${tokenTideData.total}` : ''}${(tokenTideData?.total > 0 && tokenChillingData?.physTotal > 0) ? ' / ' : ''}${tokenChillingData?.physTotal > 0 ? `Chilling Touch -${tokenChillingData.physTotal}` : ''}">${physDef}</span></div>
              <div class="defense-item"><span class="def-label"><i class="fas fa-hat-wizard"></i></span><span class="def-value ${sorcDefColorClass}" title="${sorcDebuffTotal > 0 ? `Chilling Touch -${sorcDebuffTotal}` : ''}">${sorcDef}</span></div>
              ${ar ? `<div class="defense-item"><span class="def-label">AR</span><span class="def-value">${ar}</span></div>` : ''}
            </div>
          </div>

          <div class="enemy-stats-row">
            <button type="button" class="stat-btn" data-stat="might" data-value="${enemyData.stats.might.value}" data-die="${enemyData.stats.might.die}">
              <span class="stat-name">MIGHT</span>
              <span class="stat-val">${enemyData.stats.might.value}</span>
              <span class="stat-die">${enemyData.stats.might.die}</span>
            </button>
            <button type="button" class="stat-btn" data-stat="edge" data-value="${enemyData.stats.edge.value}" data-die="${enemyData.stats.edge.die}">
              <span class="stat-name">EDGE</span>
              <span class="stat-val">${enemyData.stats.edge.value}</span>
              <span class="stat-die">${enemyData.stats.edge.die}</span>
            </button>
            <button type="button" class="stat-btn" data-stat="grit" data-value="${enemyData.stats.grit.value}" data-die="${enemyData.stats.grit.die}">
              <span class="stat-name">GRIT</span>
              <span class="stat-val">${enemyData.stats.grit.value}</span>
              <span class="stat-die">${enemyData.stats.grit.die}</span>
            </button>
            <button type="button" class="stat-btn" data-stat="wits" data-value="${enemyData.stats.wits.value}" data-die="${enemyData.stats.wits.die}">
              <span class="stat-name">WITS</span>
              <span class="stat-val">${enemyData.stats.wits.value}</span>
              <span class="stat-die">${enemyData.stats.wits.die}</span>
            </button>
          </div>

          <div class="enemy-weapons-row weapons-${weaponCount}">
            ${weaponsHtml}
          </div>

          <div class="enemy-rules-row">
            ${rulesHtml || '<span class="no-rules">No special rules</span>'}
          </div>
        </div>
      </div>
    `;
  }

  // Track hooks for cleanup
  let updateHookId = null;
  let tokenUpdateHookId = null;

  const dialog = new Dialog({
    title: `${enemyData.name}${isPlaced ? '' : ' (Preview)'}`,
    content: content,
    buttons: {},
    render: (html) => {

      // Helper: find physical defense value element in either card layout
      const findPhysDefEl = () => {
        // New card layout: icon-based defense badge
        const newEl = html.find('.def-icon.phys').closest('.def-badge').find('.def-val');
        if (newEl.length) return newEl;
        // Old card layout: find the defense-item containing the shield icon
        const shieldItem = html.find('.fa-shield-alt').closest('.defense-item').find('.def-value');
        if (shieldItem.length) return shieldItem;
        // Final fallback
        return html.find('.defense-item .def-value').first();
      };

      // Set up actor update listener to refresh status grid AND protect effects
      if (isPlaced && token?.actor) {
        const actorId = token.actor.id;
        const tokenId = token.id;

        updateHookId = Hooks.on('updateActor', (updatedActor, changes) => {
          if (updatedActor.id !== actorId) return;

          // Handle conditions/buffsDebuffs changes - rebuild status display
          if (changes.system?.conditions || changes.system?.buffsDebuffs) {
            if (isNewCardLayout) {
              // New card: rebuild status condition badges in effects column
              const actor = token.actor;
              const actorConditions = actor.system?.conditions || {};
              const actorBuffsDebuffs = actor.system?.buffsDebuffs || {};
              // Remove existing status condition badges
              html.find('.status-condition-effect').remove();
              // Build new badges
              let newBadges = '';
              CONDITIONS.forEach(cond => {
                if (actorConditions[cond.key] === true && !cond.displayOnly) {
                  newBadges += `<button type="button" class="active-effect-btn status-condition-effect" data-effect="status-condition" data-status-key="${cond.key}" data-status-type="condition" title="${cond.name} - Click to remove"><img src="${cond.icon}" class="effect-icon"/></button>`;
                }
              });
              BUFFS_DEBUFFS.forEach(bd => {
                if (actorBuffsDebuffs[bd.key] === true) {
                  newBadges += `<button type="button" class="active-effect-btn status-condition-effect" data-effect="status-condition" data-status-key="${bd.key}" data-status-type="${bd.type === 'buff' ? 'buff' : 'debuff'}" title="${bd.name}${bd.source ? ` (${bd.source})` : ''} - Click to remove"><img src="${bd.icon}" class="effect-icon"/></button>`;
                }
              });
              if (newBadges) {
                let effectsContainer = html.find('.enemy-active-effects');
                if (effectsContainer.length) {
                  effectsContainer.append(newBadges);
                } else {
                  html.find('.enemy-portrait-container').append(`<div class="enemy-active-effects">${newBadges}</div>`);
                }
              }
              // Attach click handlers for status condition badges
              html.find('.status-condition-effect').off('click').click(async (ev) => {
                if (!isPlaced || !token?.actor) return;
                const btn = ev.currentTarget;
                const statusKey = btn.dataset.statusKey;
                const statusType = btn.dataset.statusType;
                const updatePath = statusType === 'condition' ? `system.conditions.${statusKey}` : `system.buffsDebuffs.${statusKey}`;
                await token.actor.update({ [updatePath]: false });
                const statusDef = statusType === 'condition' ? CONDITIONS.find(c => c.key === statusKey) : BUFFS_DEBUFFS.find(b => b.key === statusKey);
                const messages = statusType === 'condition' ? CONDITION_MESSAGES[statusKey] : BUFF_DEBUFF_MESSAGES[statusKey];
                if (statusDef && messages) {
                  ChatMessage.create({ content: `<strong>${enemyData.name}</strong> ${messages.off}`, speaker: { alias: 'GM' } });
                }
              });
            } else {
              // Old card: rebuild status grid in header
              const newGridHtml = buildStatusGridHtml();
              const headerRow = html.find('.enemy-header-row');
              const existingGrid = headerRow.find('.enemy-status-grid');
              const defensesDiv = headerRow.find('.enemy-defenses');

              if (existingGrid.length) {
                if (newGridHtml) {
                  existingGrid.replaceWith(newGridHtml);
                } else {
                  existingGrid.remove();
                }
              } else if (newGridHtml) {
                defensesDiv.before(newGridHtml);
              }
            }

            // Re-attach click handlers to status icons (old card layout)
            html.find('.enemy-status-icon').off('click').click(async (ev) => {
              if (!isPlaced || !token?.actor) return;

              const iconEl = ev.currentTarget;
              const statusKey = iconEl.dataset.statusKey;
              const statusType = iconEl.dataset.statusType;
              const actor = token.actor;

              let updatePath = statusType === 'condition'
                ? `system.conditions.${statusKey}`
                : `system.buffsDebuffs.${statusKey}`;

              await actor.update({ [updatePath]: false });

              const statusDef = statusType === 'condition'
                ? CONDITIONS.find(c => c.key === statusKey)
                : BUFFS_DEBUFFS.find(b => b.key === statusKey);
              const messages = statusType === 'condition'
                ? CONDITION_MESSAGES[statusKey]
                : BUFF_DEBUFF_MESSAGES[statusKey];

              if (statusDef && messages) {
                ChatMessage.create({
                  content: `<strong>${enemyData.name}</strong> ${messages.off}`,
                  speaker: { alias: 'GM' }
                });
              }
            });
          }

          // Handle protectBonus flag changes - update active effects display & defense
          if (changes.flags?.conan?.protectBonus !== undefined || changes.flags?.conan?.['-=protectBonus'] !== undefined) {
            const pData = updatedActor.getFlag('conan', 'protectBonus');
            const portraitContainer = html.find('.enemy-portrait-container');
            const existingEffects = portraitContainer.find('.enemy-active-effects');

            if (pData?.total > 0) {
              // Build guard names for tooltip
              const guardNames = pData.sources.map(id => {
                const gt = game.scenes.active?.tokens.get(id);
                return gt?.name || 'Guard';
              }).join(', ');
              const newBtnHtml = `<button type="button" class="active-effect-btn" data-effect="protect" title="Protected by: ${guardNames} (+${pData.total} Phys Def) - Click to remove one"><i class="fas fa-shield-alt"></i><span class="effect-count">${pData.total}</span></button>`;

              // Remove existing protect btn only, preserve other effect btns
              html.find('.active-effect-btn[data-effect="protect"]').remove();

              if (existingEffects.length) {
                // Prepend so Protect stays at bottom with column-reverse
                existingEffects.prepend(newBtnHtml);
              } else {
                portraitContainer.append(`<div class="enemy-active-effects">${newBtnHtml}</div>`);
              }

              // Re-attach dismiss handler for protect only
              html.find('.active-effect-btn[data-effect="protect"]').off('click').click(async (ev) => {
                const btn = ev.currentTarget;
                if (!isPlaced || !token?.actor || _protectDismissing) return;
                _protectDismissing = true;
                try {
                  const targetActor = token.actor;
                  const targetTokenDoc = token;
                  const currentData = targetActor.getFlag('conan', 'protectBonus') || { total: 0, sources: [] };
                  if (currentData.sources.length === 0) return;
                  const removedGuardId = currentData.sources.pop();
                  const removedAmount = currentData.amounts?.pop() || 1;
                  currentData.total = Math.max(0, currentData.total - removedAmount);
                  if (currentData.total <= 0) {
                    await targetActor.unsetFlag('conan', 'protectBonus');
                  } else {
                    await targetActor.setFlag('conan', 'protectBonus', currentData);
                  }
                  const targetEnemyFlag = targetTokenDoc.getFlag('conan', 'enemyData');
                  if (targetEnemyFlag) {
                    const curDef = parseInt(targetEnemyFlag.physicalDefense) || 0;
                    await targetTokenDoc.setFlag('conan', 'enemyData', { ...targetEnemyFlag, physicalDefense: Math.max(0, curDef - removedAmount) });
                  }
                  const guardTokenDoc = game.scenes.active?.tokens.get(removedGuardId);
                  if (guardTokenDoc) {
                    await guardTokenDoc.setFlag('conan', 'protectUsed', false);
                    await guardTokenDoc.unsetFlag('conan', 'protectTarget');
                  }
                  const guardName = guardTokenDoc?.name || 'Guard';
                  ChatMessage.create({
                    speaker: { alias: 'GM' },
                    content: `<div class="conan-enemy-roll ability-use"><div class="roll-header">Protect Dismissed</div><div class="roll-section ability-desc"><strong>${guardName}</strong> stops Protecting <strong>${targetActor.name}</strong>.<br>${targetActor.name} loses <strong>-${removedAmount} Physical Defense</strong>${currentData.total > 0 ? ` (Protect bonus: +${currentData.total}/3)` : ' (Protect bonus removed)'}.</div></div>`
                  });
                } finally {
                  _protectDismissing = false;
                }
              });

              // Update defense color based on net buff/debuff
              const tideCheck = updatedActor.getFlag('conan', 'tideOfStoneDebuff');
              const bTotal = pData.total;
              const dTotal = tideCheck?.total || 0;
              const defEl = findPhysDefEl();
              defEl.removeClass('protect-boosted tide-debuffed defense-contested');
              if (bTotal > dTotal) defEl.addClass('protect-boosted');
              else if (dTotal > bTotal) defEl.addClass('tide-debuffed');
              else if (bTotal > 0) defEl.addClass('defense-contested');
            } else {
              // No more protect - remove protect btn only
              html.find('.active-effect-btn[data-effect="protect"]').remove();
              // Update defense color - may still have debuff
              const tideCheck = updatedActor.getFlag('conan', 'tideOfStoneDebuff');
              const defEl = findPhysDefEl();
              defEl.removeClass('protect-boosted tide-debuffed defense-contested');
              if (tideCheck?.total > 0) defEl.addClass('tide-debuffed');
            }
          }

          // Handle inspireBuff flag changes - update active effects display
          if (changes.flags?.conan?.inspireBuff !== undefined || changes.flags?.conan?.['-=inspireBuff'] !== undefined) {
            const inspireData = updatedActor.getFlag('conan', 'inspireBuff');
            const portraitContainer = html.find('.enemy-portrait-container');
            let effectsContainer = portraitContainer.find('.enemy-active-effects');

            if (inspireData?.source) {
              const captainToken = game.scenes.active?.tokens.get(inspireData.source);
              const captainName = captainToken?.name || 'Guard Captain';
              const inspireBtnHtml = `<button type="button" class="active-effect-btn" data-effect="inspire" data-source-token="${inspireData.source}" title="Inspired by ${captainName} (+1 Attack)">Inspire</button>`;

              // Remove existing inspire btn if any
              html.find('.active-effect-btn[data-effect="inspire"]').remove();

              if (effectsContainer.length) {
                effectsContainer.append(inspireBtnHtml);
              } else {
                portraitContainer.append(`<div class="enemy-active-effects">${inspireBtnHtml}</div>`);
              }

              // Re-attach dismiss handlers for all active effects
              html.find('.active-effect-btn[data-effect="inspire"]').off('click').click(async (ev) => {
                const btn = ev.currentTarget;
                if (!isPlaced || !token?.actor) return;
                const srcTokenId = btn.dataset.sourceToken;
                await token.actor.unsetFlag('conan', 'inspireBuff');
                const captainDoc = game.scenes.active?.tokens.get(srcTokenId);
                if (captainDoc) {
                  const targets = captainDoc.getFlag('conan', 'inspireTargets') || [];
                  const idx = targets.indexOf(token.id);
                  if (idx > -1) {
                    targets.splice(idx, 1);
                    if (targets.length === 0) {
                      await captainDoc.setFlag('conan', 'inspireState', 'spent');
                      await captainDoc.unsetFlag('conan', 'inspireTargets');
                    } else {
                      await captainDoc.setFlag('conan', 'inspireTargets', targets);
                    }
                  }
                }
                ChatMessage.create({
                  speaker: { alias: 'GM' },
                  content: `<div class="conan-enemy-roll ability-use"><div class="roll-header">Inspire Removed</div><div class="roll-section ability-desc"><strong>${token.actor.name}</strong> is no longer Inspired. +1 Attack bonus removed.</div></div>`
                });
              });
            } else {
              // Inspire removed
              html.find('.active-effect-btn[data-effect="inspire"]').remove();
            }
          }

          // Handle warCryBuff flag changes - update active effects display
          if (changes.flags?.conan?.warCryBuff !== undefined || changes.flags?.conan?.['-=warCryBuff'] !== undefined) {
            const wcData = updatedActor.getFlag('conan', 'warCryBuff');
            const portraitContainer = html.find('.enemy-portrait-container');
            let effectsContainer = portraitContainer.find('.enemy-active-effects');

            if (wcData?.source) {
              const champToken = game.scenes.active?.tokens.get(wcData.source);
              const champName = champToken?.name || 'Pict Champion';
              const hasWC = enemyData.threatTraits?.includes('warchant');
              const wcTip = hasWC ? `War Cry (+1 Atk) + War Chant (+2 Dmg) from ${champName}` : `War Cry (+1 Attack) from ${champName}`;
              const wcBtnHtml = `<button type="button" class="active-effect-btn war-cry-effect" data-effect="warcry" data-source-token="${wcData.source}" title="${wcTip}">War Cry</button>`;

              html.find('.active-effect-btn[data-effect="warcry"]').remove();
              if (effectsContainer.length) {
                effectsContainer.append(wcBtnHtml);
              } else {
                portraitContainer.append(`<div class="enemy-active-effects">${wcBtnHtml}</div>`);
              }
            } else {
              html.find('.active-effect-btn[data-effect="warcry"]').remove();
            }
          }

          // Handle tideOfStoneDebuff flag changes - update active effects display & defense
          if (changes.flags?.conan?.tideOfStoneDebuff !== undefined || changes.flags?.conan?.['-=tideOfStoneDebuff'] !== undefined) {
            const tData = updatedActor.getFlag('conan', 'tideOfStoneDebuff');
            const portraitContainer = html.find('.enemy-portrait-container');
            let effectsContainer = portraitContainer.find('.enemy-active-effects');

            if (tData?.total > 0) {
              const tideBtnHtml = `<button type="button" class="active-effect-btn tide-of-stone-effect" data-effect="tide-of-stone" title="Tide of Stone (-${tData.total} Phys Def) - Click to remove one"><img src="systems/conan/images/icons/tide_of_stone_icon.png" class="effect-icon"/><span class="effect-count">${tData.total}</span></button>`;

              // Remove existing tide btn only, preserve other effect btns
              html.find('.active-effect-btn[data-effect="tide-of-stone"]').remove();

              if (effectsContainer.length) {
                effectsContainer.append(tideBtnHtml);
              } else {
                portraitContainer.append(`<div class="enemy-active-effects">${tideBtnHtml}</div>`);
              }

              // Re-attach dismiss handler for tide of stone only
              html.find('.active-effect-btn[data-effect="tide-of-stone"]').off('click').click(async (ev) => {
                if (!isPlaced || !token?.actor) return;
                const currentData = token.actor.getFlag('conan', 'tideOfStoneDebuff') || { total: 0 };
                if (currentData.total <= 0) return;
                currentData.total = Math.max(0, currentData.total - 1);
                // Restore defense by 1
                const enemyFlag = token.getFlag('conan', 'enemyData');
                if (enemyFlag) {
                  const curDef = parseInt(enemyFlag.physicalDefense) || 0;
                  await token.setFlag('conan', 'enemyData', { ...enemyFlag, physicalDefense: curDef + 1 });
                }
                if (currentData.total <= 0) {
                  await token.actor.unsetFlag('conan', 'tideOfStoneDebuff');
                } else {
                  await token.actor.setFlag('conan', 'tideOfStoneDebuff', currentData);
                }
                ChatMessage.create({
                  speaker: { alias: 'GM' },
                  content: `<div class="conan-enemy-roll ability-use"><div class="roll-header">Tide of Stone Dismissed</div><div class="roll-section ability-desc"><strong>${token.actor.name}</strong> recovers <strong>+1 Physical Defense</strong>${currentData.total > 0 ? ` (Tide of Stone remaining: -${currentData.total})` : ' (Tide of Stone removed)'}.</div></div>`
                });
              });

              // Update defense color based on net buff/debuff
              const pCheck = updatedActor.getFlag('conan', 'protectBonus');
              const bTotal = pCheck?.total || 0;
              const dTotal = tData.total;
              const defEl = findPhysDefEl();
              defEl.removeClass('protect-boosted tide-debuffed defense-contested');
              if (bTotal > dTotal) defEl.addClass('protect-boosted');
              else if (dTotal > bTotal) defEl.addClass('tide-debuffed');
              else if (dTotal > 0) defEl.addClass('defense-contested');
            } else {
              // No more tide of stone - remove tide btn only
              html.find('.active-effect-btn[data-effect="tide-of-stone"]').remove();
              // Update defense color - may still have protect buff
              const pCheck = updatedActor.getFlag('conan', 'protectBonus');
              const defEl = findPhysDefEl();
              defEl.removeClass('protect-boosted tide-debuffed defense-contested');
              if (pCheck?.total > 0) defEl.addClass('protect-boosted');
            }
          }

          // Handle baneWeaponBuff changes - update active effects display
          if (changes.system?.baneWeaponBuff !== undefined) {
            const bData = updatedActor.system?.baneWeaponBuff;
            const portraitContainer = html.find('.enemy-portrait-container');
            let effectsContainer = portraitContainer.find('.enemy-active-effects');

            if (bData?.damageDie) {
              const baneBtnHtml = `<button type="button" class="active-effect-btn bane-weapon-effect" data-effect="bane-weapon" title="Bane Weapon (+${bData.damageDie} damage, Prone on hit) from ${bData.casterName || 'Sorcerer'} - Click to dismiss"><img src="systems/conan/images/icons/create_bane_weapon_icon.png" class="effect-icon"/></button>`;

              html.find('.active-effect-btn[data-effect="bane-weapon"]').remove();

              if (effectsContainer.length) {
                effectsContainer.append(baneBtnHtml);
              } else {
                portraitContainer.append(`<div class="enemy-active-effects">${baneBtnHtml}</div>`);
              }

              // Re-attach dismiss handler
              html.find('.active-effect-btn[data-effect="bane-weapon"]').off('click').click(async (ev) => {
                if (!isPlaced || !token?.actor) return;
                const buffData = token.actor.system?.baneWeaponBuff;
                if (!buffData) return;
                const casterActor = buffData.casterId ? game.actors.get(buffData.casterId) : null;
                await token.actor.update({
                  'system.baneWeaponBuff': null,
                  'system.buffsDebuffs.baneWeapon': false
                });
                if (casterActor) {
                  await casterActor.update({ 'system.baneWeaponCaster': null });
                }
                ChatMessage.create({
                  speaker: { alias: 'GM' },
                  content: `<div class="conan-enemy-roll ability-use"><div class="roll-header">Bane Weapon Dismissed</div><div class="roll-section ability-desc"><strong>${token.actor.name}</strong>'s weapon enchantment fades.</div></div>`
                });
              });
            } else {
              // Bane removed
              html.find('.active-effect-btn[data-effect="bane-weapon"]').remove();
            }
          }

          // Handle snakeVenom flag changes - update active effects display
          if (changes.flags?.conan?.snakeVenom !== undefined || changes.flags?.conan?.['-=snakeVenom'] !== undefined) {
            const vData = updatedActor.getFlag('conan', 'snakeVenom');
            const portraitContainer = html.find('.enemy-portrait-container');
            let effectsContainer = portraitContainer.find('.enemy-active-effects');

            if (vData?.active) {
              const venomBtnHtml = `<button type="button" class="active-effect-btn snake-venom-effect" data-effect="snake-venom" title="Snake Venom (-2 Attacks, 1 dmg/round) - Click to dismiss"><img src="systems/conan/images/icons/poisoned_icon.png" class="effect-icon"/></button>`;

              html.find('.active-effect-btn[data-effect="snake-venom"]').remove();

              if (effectsContainer.length) {
                effectsContainer.append(venomBtnHtml);
              } else {
                portraitContainer.append(`<div class="enemy-active-effects">${venomBtnHtml}</div>`);
              }

              // Re-attach dismiss handler
              html.find('.active-effect-btn[data-effect="snake-venom"]').off('click').click(async (ev) => {
                if (!isPlaced || !token?.actor) return;
                await token.actor.unsetFlag('conan', 'snakeVenom');
                ChatMessage.create({
                  speaker: { alias: 'GM' },
                  content: `<div class="conan-enemy-roll ability-use"><div class="roll-header" style="color: #b060ff;">Snake Venom Cured</div><div class="roll-section ability-desc"><strong>${token.actor.name}</strong> is no longer poisoned.</div></div>`
                });
              });
            } else {
              // Venom removed
              html.find('.active-effect-btn[data-effect="snake-venom"]').remove();
            }
          }

          // Handle frightfulAuraDebuff flag changes - update active effects display
          if (changes.flags?.conan?.frightfulAuraDebuff !== undefined || changes.flags?.conan?.['-=frightfulAuraDebuff'] !== undefined) {
            const fData = updatedActor.getFlag('conan', 'frightfulAuraDebuff');
            const portraitContainer = html.find('.enemy-portrait-container');
            let effectsContainer = portraitContainer.find('.enemy-active-effects');

            if (fData?.active) {
              const frightBtnHtml = `<button type="button" class="active-effect-btn frightful-aura-effect" data-effect="frightful-aura" title="Frightful Aura (-2 Wits & Grit Checks) - Click to dismiss"><img src="systems/conan/images/icons/frightful_aura_icon.png" class="effect-icon"/></button>`;

              html.find('.active-effect-btn[data-effect="frightful-aura"]').remove();

              if (effectsContainer.length) {
                effectsContainer.append(frightBtnHtml);
              } else {
                portraitContainer.append(`<div class="enemy-active-effects">${frightBtnHtml}</div>`);
              }

              html.find('.active-effect-btn[data-effect="frightful-aura"]').off('click').click(async (ev) => {
                if (!isPlaced || !token?.actor) return;
                await token.actor.unsetFlag('conan', 'frightfulAuraDebuff');
                ChatMessage.create({
                  speaker: { alias: 'GM' },
                  content: `<div class="conan-enemy-roll ability-use"><div class="roll-header" style="color: #6a0dad;">Frightful Aura Lifted</div><div class="roll-section ability-desc"><strong>${token.actor.name}</strong> is no longer affected by Frightful Aura.</div></div>`
                });
              });
            } else {
              html.find('.active-effect-btn[data-effect="frightful-aura"]').remove();
            }
          }

          // Handle fearsomeWardDebuff flag changes - update active effects display
          if (changes.flags?.conan?.fearsomeWardDebuff !== undefined || changes.flags?.conan?.['-=fearsomeWardDebuff'] !== undefined) {
            const wData = updatedActor.getFlag('conan', 'fearsomeWardDebuff');
            const portraitContainer = html.find('.enemy-portrait-container');
            let effectsContainer = portraitContainer.find('.enemy-active-effects');

            if (wData?.active) {
              const wardBtnHtml = `<button type="button" class="active-effect-btn fearsome-ward-effect" data-effect="fearsome-ward" title="Fearsome Ward (-2 Melee Attacks vs caster) - Click to dismiss"><img src="systems/conan/images/icons/fearsome_ward_icon.png" class="effect-icon"/></button>`;

              html.find('.active-effect-btn[data-effect="fearsome-ward"]').remove();

              if (effectsContainer.length) {
                effectsContainer.append(wardBtnHtml);
              } else {
                portraitContainer.append(`<div class="enemy-active-effects">${wardBtnHtml}</div>`);
              }

              html.find('.active-effect-btn[data-effect="fearsome-ward"]').off('click').click(async (ev) => {
                if (!isPlaced || !token?.actor) return;
                const wdData = token.actor.getFlag('conan', 'fearsomeWardDebuff');
                const wdCasterId = wdData?.casterId;
                await token.actor.unsetFlag('conan', 'fearsomeWardDebuff');
                if (wdCasterId) {
                  const wdCaster = game.actors.get(wdCasterId);
                  if (wdCaster) await wdCaster.update({ 'system.fearsomeWardState': 'spent', 'system.fearsomeWardTarget': null });
                }
                ChatMessage.create({
                  speaker: { alias: 'GM' },
                  content: `<div class="conan-enemy-roll ability-use"><div class="roll-header" style="color: #b8860b;">Fearsome Ward Broken</div><div class="roll-section ability-desc"><strong>${token.actor.name}</strong> shakes free of the sorcerer's ward. The dread fades from their eyes.</div></div>`
                });
              });

              // Split melee weapon buttons into normal + warded pairs
              html.find('.weapon-btn[data-attack="melee"]').each(function() {
                const btn = $(this);
                if (btn.parent().hasClass('weapon-ward-pair')) return;
                const wardedBtn = btn.clone();
                wardedBtn.addClass('warded').attr('data-warded', 'true').attr('title', 'Warded Attack — -2 to Hit');
                wardedBtn.find('.weapon-icon').html('<img src="systems/conan/images/icons/fearsome_ward_icon.png" class="ward-weapon-icon"/>');
                wardedBtn.find('.weapon-range').text('Warded -2');
                const pair = $('<div class="weapon-ward-pair"></div>');
                btn.after(pair);
                pair.append(btn).append(wardedBtn);
              });
            } else {
              html.find('.active-effect-btn[data-effect="fearsome-ward"]').remove();
              // Unwrap melee weapon pairs back to single buttons
              html.find('.weapon-ward-pair').each(function() {
                const pair = $(this);
                const normalBtn = pair.find('.weapon-btn:not(.warded)');
                pair.after(normalBtn);
                pair.remove();
              });
            }
          }

          // Handle stunnedDebuff flag changes (Wave of Darkness)
          if (changes.flags?.conan?.stunnedDebuff !== undefined || changes.flags?.conan?.['-=stunnedDebuff'] !== undefined) {
            const sData = updatedActor.getFlag('conan', 'stunnedDebuff');
            const portraitContainer = html.find('.enemy-portrait-container');
            let effectsContainer = portraitContainer.find('.enemy-active-effects');

            if (sData?.active) {
              const stunBtnHtml = `<button type="button" class="active-effect-btn stunned-effect" data-effect="stunned" title="Stunned — cannot make any move actions. Click to dismiss."><img src="systems/conan/images/icons/stunned_icon.png" class="effect-icon"/></button>`;
              html.find('.active-effect-btn[data-effect="stunned"]').remove();
              if (effectsContainer.length) {
                effectsContainer.append(stunBtnHtml);
              } else {
                portraitContainer.append(`<div class="enemy-active-effects">${stunBtnHtml}</div>`);
              }
              html.find('.active-effect-btn[data-effect="stunned"]').off('click').click(async (ev) => {
                if (!isPlaced || !token?.actor) return;
                await token.actor.unsetFlag('conan', 'stunnedDebuff');
                ChatMessage.create({
                  speaker: { alias: 'GM' },
                  content: `<div class="conan-enemy-roll ability-use"><div class="roll-header" style="color: #4B0082;">Stun Cleared</div><div class="roll-section ability-desc"><strong>${token.actor.name}</strong> can move again.</div></div>`
                });
              });
            } else {
              html.find('.active-effect-btn[data-effect="stunned"]').remove();
            }
          }

          // Handle proneDebuff flag changes (Bane Weapon)
          if (changes.flags?.conan?.proneDebuff !== undefined || changes.flags?.conan?.['-=proneDebuff'] !== undefined) {
            const pData = updatedActor.getFlag('conan', 'proneDebuff');
            const portraitContainer = html.find('.enemy-portrait-container');
            let effectsContainer = portraitContainer.find('.enemy-active-effects');

            if (pData?.active) {
              const proneBtnHtml = `<button type="button" class="active-effect-btn prone-effect" data-effect="prone" title="Prone — Click to dismiss"><img src="systems/conan/images/icons/prone_icon.png" class="effect-icon"/></button>`;
              html.find('.active-effect-btn[data-effect="prone"]').remove();
              if (effectsContainer.length) {
                effectsContainer.append(proneBtnHtml);
              } else {
                portraitContainer.append(`<div class="enemy-active-effects">${proneBtnHtml}</div>`);
              }
              html.find('.active-effect-btn[data-effect="prone"]').off('click').click(async () => {
                if (!isPlaced || !token?.actor) return;
                await token.actor.unsetFlag('conan', 'proneDebuff');
                const proneIcon = 'systems/conan/images/icons/prone_icon.png';
                const effects = token.document?.effects || [];
                if (effects.includes(proneIcon)) {
                  await token.document.update({ effects: effects.filter(e => e !== proneIcon) });
                }
                ChatMessage.create({
                  speaker: { alias: 'GM' },
                  content: `<div class="conan-enemy-roll ability-use"><div class="roll-header" style="color: #CD853F;">Prone Cleared</div><div class="roll-section ability-desc"><strong>${token.actor.name}</strong> gets back up.</div></div>`
                });
              });
            } else {
              html.find('.active-effect-btn[data-effect="prone"]').remove();
            }
          }

          // Handle mesmerismControl flag changes
          if (changes.flags?.conan?.mesmerismControl !== undefined || changes.flags?.conan?.['-=mesmerismControl'] !== undefined) {
            const mData = updatedActor.getFlag('conan', 'mesmerismControl');
            const portraitContainer = html.find('.enemy-portrait-container');
            let effectsContainer = portraitContainer.find('.enemy-active-effects');

            if (mData?.active) {
              const cActor = game.actors.get(mData.casterActorId);
              const cName = cActor?.name || 'Sorcerer';
              const pLabel = mData.permanent ? ' (Permanent)' : ` (Round ${mData.roundCount}/3)`;
              const mBtnHtml = `<button type="button" class="active-effect-btn mesmerism-effect" data-effect="mesmerism" title="Mesmerised by ${cName}${pLabel} — Click to dismiss"><img src="systems/conan/images/icons/mesmerism_icon.png" class="effect-icon"/></button>`;
              html.find('.active-effect-btn[data-effect="mesmerism"]').remove();
              if (effectsContainer.length) {
                effectsContainer.append(mBtnHtml);
              } else {
                portraitContainer.append(`<div class="enemy-active-effects">${mBtnHtml}</div>`);
              }
              // Re-attach dismiss handler
              html.find('.active-effect-btn[data-effect="mesmerism"]').off('click').click(async () => {
                if (!isPlaced || !token?.actor) return;
                await token.actor.unsetFlag('conan', 'mesmerismControl');
                const mesmerIcon = 'systems/conan/images/icons/mesmerism_icon.png';
                const effects = token.document?.effects || [];
                if (effects.includes(mesmerIcon)) {
                  await token.document.update({ effects: effects.filter(e => e !== mesmerIcon) });
                }
                // Only revoke ownership if NOT permanent (permanent = player keeps the token)
                if (mData.casterUserId && token.actor && !mData.permanent) {
                  await token.actor.update({ [`ownership.-=${mData.casterUserId}`]: null });
                }
                if (mData.casterActorId) {
                  const ca = game.actors.get(mData.casterActorId);
                  if (ca) await ca.unsetFlag('conan', 'mesmerismCaster');
                }
                ChatMessage.create({
                  speaker: { alias: 'GM' },
                  content: `<div class="conan-enemy-roll ability-use"><div class="roll-header" style="color: #9400D3;">Mesmerism Broken</div><div class="roll-section ability-desc"><strong>${eName || token.name}</strong> breaks free of the sorcerer's control.</div></div>`
                });
              });
            } else {
              html.find('.active-effect-btn[data-effect="mesmerism"]').remove();
            }
          }

          // Handle hellfireDebuff flag changes - update active effects display
          if (changes.flags?.conan?.hellfireDebuff !== undefined || changes.flags?.conan?.['-=hellfireDebuff'] !== undefined) {
            const hfData = updatedActor.getFlag('conan', 'hellfireDebuff');
            const portraitContainer = html.find('.enemy-portrait-container');
            let effectsContainer = portraitContainer.find('.enemy-active-effects');

            if (hfData?.total > 0) {
              const hfBtnHtml = `<button type="button" class="active-effect-btn hellfire-effect" data-effect="hellfire" title="Hellfire (-${hfData.total} Checks & Attacks) - Click to remove one"><img src="systems/conan/images/icons/hellfire_icon.png" class="effect-icon"/><span class="effect-count">${hfData.total}</span></button>`;
              html.find('.active-effect-btn[data-effect="hellfire"]').remove();
              if (effectsContainer.length) {
                effectsContainer.append(hfBtnHtml);
              } else {
                portraitContainer.append(`<div class="enemy-active-effects">${hfBtnHtml}</div>`);
              }
              // Re-attach dismiss handler for hellfire
              html.find('.active-effect-btn[data-effect="hellfire"]').off('click').click(async (ev) => {
                if (!isPlaced || !token?.actor) return;
                const currentData = token.actor.getFlag('conan', 'hellfireDebuff') || { total: 0 };
                if (currentData.total <= 0) return;
                currentData.total = Math.max(0, currentData.total - 1);
                if (currentData.total <= 0) {
                  await token.actor.unsetFlag('conan', 'hellfireDebuff');
                } else {
                  await token.actor.setFlag('conan', 'hellfireDebuff', currentData);
                }
                ChatMessage.create({
                  speaker: { alias: 'GM' },
                  content: `<div class="conan-enemy-roll ability-use"><div class="roll-header" style="color: #ff4500;">Hellfire Dismissed</div><div class="roll-section ability-desc"><strong>${token.actor.name}</strong> shakes off the hellfire.${currentData.total > 0 ? ` (Hellfire remaining: -${currentData.total})` : ' (Hellfire removed)'}</div></div>`
                });
              });
            } else {
              html.find('.active-effect-btn[data-effect="hellfire"]').remove();
            }
          }

          // DUAL LP SYNC: Update card HP input when lifePoints.value changes externally
          // (e.g. token HUD edit, applyDamageToToken, healing spells)
          if (changes.system?.lifePoints) {
            const newLP = updatedActor.system.lifePoints?.value;
            if (newLP !== undefined) {
              const hpInput = html.find('.hp-current');
              if (hpInput.length) hpInput.val(newLP);
              // New card layout: update HP badge text
              const hpValSpan = html.find('.hp-badge .hp-val');
              if (hpValSpan.length) hpValSpan.text(newLP);
            }
          }
        });

        // Set up token update listener to refresh guard's ability button state
        tokenUpdateHookId = Hooks.on('updateToken', (updatedTokenDoc, changes) => {
          if (updatedTokenDoc.id !== tokenId) return;

          // Handle protectUsed flag changes - toggle ability button green state
          if (changes.flags?.conan?.protectUsed !== undefined || changes.flags?.conan?.['-=protectUsed'] !== undefined) {
            const protectUsed = updatedTokenDoc.getFlag('conan', 'protectUsed');
            const protectBtn = html.find('.ability-btn[data-rule-name="Protect"]');
            if (protectBtn.length) {
              if (protectUsed) {
                protectBtn.addClass('ability-active');
              } else {
                protectBtn.removeClass('ability-active');
              }
            }
          }

          // Handle enemyData flag changes - update defense display value
          if (changes.flags?.conan?.enemyData?.physicalDefense !== undefined) {
            const updatedEnemyData = updatedTokenDoc.getFlag('conan', 'enemyData');
            if (updatedEnemyData) {
              const defValueEl = findPhysDefEl();
              if (defValueEl.length) {
                defValueEl.text(updatedEnemyData.physicalDefense);
              }
            }
          }

          // Handle inspireState flag changes - toggle Inspire button state
          if (changes.flags?.conan?.inspireState !== undefined || changes.flags?.conan?.['-=inspireState'] !== undefined) {
            const state = updatedTokenDoc.getFlag('conan', 'inspireState');
            const inspireBtn = html.find('.ability-btn[data-rule-name="Inspire"]');
            if (inspireBtn.length) {
              inspireBtn.removeClass('ability-active ability-spent ability-targeting');
              if (state === 'active') inspireBtn.addClass('ability-active');
              else if (state === 'spent') inspireBtn.addClass('ability-spent');
            }
          }
        });

        // Attach initial dismiss handlers for existing active effects (protect, tide of stone)
        // These are needed when dialog opens with effects already present (hook hasn't fired yet)
        html.find('.active-effect-btn[data-effect="protect"]').off('click').click(async (ev) => {
          if (!isPlaced || !token?.actor || _protectDismissing) return;
          _protectDismissing = true;
          try {
            const targetActor = token.actor;
            const pData = targetActor.getFlag('conan', 'protectBonus');
            if (!pData?.sources?.length) return;
            const lastGuardId = pData.sources.pop();
            const removedAmount = pData.amounts?.pop() || 1;
            const newTotal = Math.max(0, (pData.total || 0) - removedAmount);
            // Remove defense bonus
            const eFlag = token.getFlag('conan', 'enemyData');
            if (eFlag) {
              const cDef = parseInt(eFlag.physicalDefense) || 0;
              await token.setFlag('conan', 'enemyData', { ...eFlag, physicalDefense: Math.max(0, cDef - removedAmount) });
            }
            // Clear guard's protectUsed/protectTarget
            const guardToken = game.scenes.active?.tokens.get(lastGuardId);
            if (guardToken) {
              await guardToken.unsetFlag('conan', 'protectUsed');
              await guardToken.unsetFlag('conan', 'protectTarget');
            }
            if (newTotal <= 0) {
              await targetActor.unsetFlag('conan', 'protectBonus');
            } else {
              await targetActor.setFlag('conan', 'protectBonus', { total: newTotal, sources: pData.sources, amounts: pData.amounts });
            }
            const guardName = guardToken?.name || 'Guard';
            ChatMessage.create({
              speaker: { alias: 'GM' },
              content: `<div class="conan-enemy-roll ability-use"><div class="roll-header">Protect Dismissed</div><div class="roll-section ability-desc"><strong>${guardName}</strong> is no longer protecting <strong>${targetActor.name}</strong>${newTotal > 0 ? ` (${newTotal} guard${newTotal > 1 ? 's' : ''} remaining)` : ''}.</div></div>`
            });
          } finally {
            _protectDismissing = false;
          }
        });

        html.find('.active-effect-btn[data-effect="tide-of-stone"]').off('click').click(async (ev) => {
          if (!isPlaced || !token?.actor) return;
          const currentData = token.actor.getFlag('conan', 'tideOfStoneDebuff') || { total: 0 };
          if (currentData.total <= 0) return;
          currentData.total = Math.max(0, currentData.total - 1);
          // Restore defense by 1
          const enemyFlag = token.getFlag('conan', 'enemyData');
          if (enemyFlag) {
            const curDef = parseInt(enemyFlag.physicalDefense) || 0;
            await token.setFlag('conan', 'enemyData', { ...enemyFlag, physicalDefense: curDef + 1 });
          }
          if (currentData.total <= 0) {
            await token.actor.unsetFlag('conan', 'tideOfStoneDebuff');
          } else {
            await token.actor.setFlag('conan', 'tideOfStoneDebuff', currentData);
          }
          ChatMessage.create({
            speaker: { alias: 'GM' },
            content: `<div class="conan-enemy-roll ability-use"><div class="roll-header">Tide of Stone Dismissed</div><div class="roll-section ability-desc"><strong>${token.actor.name}</strong> recovers <strong>+1 Physical Defense</strong>${currentData.total > 0 ? ` (Tide of Stone remaining: -${currentData.total})` : ' (Tide of Stone removed)'}.</div></div>`
          });
        });

        html.find('.active-effect-btn[data-effect="bane-weapon"]').off('click').click(async (ev) => {
          if (!isPlaced || !token?.actor) return;
          const bData = token.actor.system?.baneWeaponBuff;
          if (!bData) return;
          const casterActor = bData.casterId ? game.actors.get(bData.casterId) : null;
          // Clear buff from target
          await token.actor.update({
            'system.baneWeaponBuff': null,
            'system.buffsDebuffs.baneWeapon': false
          });
          // Clear caster's tracking
          if (casterActor) {
            await casterActor.update({ 'system.baneWeaponCaster': null });
          }
          ChatMessage.create({
            speaker: { alias: 'GM' },
            content: `<div class="conan-enemy-roll ability-use"><div class="roll-header">Bane Weapon Dismissed</div><div class="roll-section ability-desc"><strong>${token.actor.name}</strong>'s weapon enchantment fades.</div></div>`
          });
        });

        // Snake Venom dismiss handler
        html.find('.active-effect-btn[data-effect="snake-venom"]').off('click').click(async (ev) => {
          if (!isPlaced || !token?.actor) return;
          await token.actor.unsetFlag('conan', 'snakeVenom');
          ChatMessage.create({
            speaker: { alias: 'GM' },
            content: `<div class="conan-enemy-roll ability-use"><div class="roll-header" style="color: #b060ff;">Snake Venom Cured</div><div class="roll-section ability-desc"><strong>${token.actor.name}</strong> is no longer poisoned.</div></div>`
          });
        });
        // Frightful Aura dismiss
        html.find('.active-effect-btn[data-effect="frightful-aura"]').off('click').click(async (ev) => {
          if (!isPlaced || !token?.actor) return;
          await token.actor.unsetFlag('conan', 'frightfulAuraDebuff');
          ChatMessage.create({
            speaker: { alias: 'GM' },
            content: `<div class="conan-enemy-roll ability-use"><div class="roll-header" style="color: #6a0dad;">Frightful Aura Lifted</div><div class="roll-section ability-desc"><strong>${token.actor.name}</strong> is no longer affected by Frightful Aura.</div></div>`
          });
        });
        // Fearsome Ward dismiss — also set caster's icon to spent
        html.find('.active-effect-btn[data-effect="fearsome-ward"]').off('click').click(async (ev) => {
          if (!isPlaced || !token?.actor) return;
          const wardData = token.actor.getFlag('conan', 'fearsomeWardDebuff');
          const casterId = wardData?.casterId;
          await token.actor.unsetFlag('conan', 'fearsomeWardDebuff');
          if (casterId) {
            const caster = game.actors.get(casterId);
            if (caster) await caster.update({ 'system.fearsomeWardState': 'spent', 'system.fearsomeWardTarget': null });
          }
          ChatMessage.create({
            speaker: { alias: 'GM' },
            content: `<div class="conan-enemy-roll ability-use"><div class="roll-header" style="color: #b8860b;">Fearsome Ward Broken</div><div class="roll-section ability-desc"><strong>${token.actor.name}</strong> shakes free of the sorcerer's ward. The dread fades from their eyes.</div></div>`
          });
        });
        // Stunned dismiss (Wave of Darkness)
        html.find('.active-effect-btn[data-effect="stunned"]').off('click').click(async (ev) => {
          if (!isPlaced || !token?.actor) return;
          await token.actor.unsetFlag('conan', 'stunnedDebuff');
          ChatMessage.create({
            speaker: { alias: 'GM' },
            content: `<div class="conan-enemy-roll ability-use"><div class="roll-header" style="color: #4B0082;">Stun Cleared</div><div class="roll-section ability-desc"><strong>${token.actor.name}</strong> can move again.</div></div>`
          });
        });
        // Prone dismiss (Bane Weapon)
        html.find('.active-effect-btn[data-effect="prone"]').off('click').click(async (ev) => {
          if (!isPlaced || !token?.actor) return;
          await token.actor.unsetFlag('conan', 'proneDebuff');
          const proneIcon = 'systems/conan/images/icons/prone_icon.png';
          const effects = token.document?.effects || [];
          if (effects.includes(proneIcon)) {
            await token.document.update({ effects: effects.filter(e => e !== proneIcon) });
          }
          ChatMessage.create({
            speaker: { alias: 'GM' },
            content: `<div class="conan-enemy-roll ability-use"><div class="roll-header" style="color: #CD853F;">Prone Cleared</div><div class="roll-section ability-desc"><strong>${token.actor.name}</strong> gets back up.</div></div>`
          });
        });
        // Mesmerism dismiss
        html.find('.active-effect-btn[data-effect="mesmerism"]').off('click').click(async (ev) => {
          if (!isPlaced || !token?.actor) return;
          const mData = token.actor.getFlag('conan', 'mesmerismControl');

          // Clear target flag
          await token.actor.unsetFlag('conan', 'mesmerismControl');

          // Remove token overlay icon
          const mesmerIcon = 'systems/conan/images/icons/mesmerism_icon.png';
          const effects = token.document?.effects || [];
          if (effects.includes(mesmerIcon)) {
            await token.document.update({ effects: effects.filter(e => e !== mesmerIcon) });
          }

          // Only revoke ownership if NOT permanent (permanent = player keeps the token)
          if (mData?.casterUserId && token.actor && !mData?.permanent) {
            await token.actor.update({ [`ownership.-=${mData.casterUserId}`]: null });
          }

          // Clear caster-side flag
          if (mData?.casterActorId) {
            const casterActor = game.actors.get(mData.casterActorId);
            if (casterActor) await casterActor.unsetFlag('conan', 'mesmerismCaster');
          }

          ChatMessage.create({
            speaker: { alias: 'GM' },
            content: `<div class="conan-enemy-roll ability-use"><div class="roll-header" style="color: #9400D3;">Mesmerism Broken</div><div class="roll-section ability-desc"><strong>${eName || token.name}</strong> breaks free of the sorcerer's control.</div></div>`
          });
        });
        // Hellfire dismiss (stacking)
        html.find('.active-effect-btn[data-effect="hellfire"]').off('click').click(async (ev) => {
          if (!isPlaced || !token?.actor) return;
          const currentData = token.actor.getFlag('conan', 'hellfireDebuff') || { total: 0 };
          if (currentData.total <= 0) return;
          currentData.total = Math.max(0, currentData.total - 1);
          if (currentData.total <= 0) {
            await token.actor.unsetFlag('conan', 'hellfireDebuff');
          } else {
            await token.actor.setFlag('conan', 'hellfireDebuff', currentData);
          }
          ChatMessage.create({
            speaker: { alias: 'GM' },
            content: `<div class="conan-enemy-roll ability-use"><div class="roll-header" style="color: #ff4500;">Hellfire Dismissed</div><div class="roll-section ability-desc"><strong>${token.actor.name}</strong> shakes off the hellfire.${currentData.total > 0 ? ` (Hellfire remaining: -${currentData.total})` : ' (Hellfire removed)'}</div></div>`
          });
        });
        // Martyr buff dismiss
        html.find('.active-effect-btn[data-effect="martyr"]').off('click').click(async (ev) => {
          if (!isPlaced || !token?.actor) return;
          await token.actor.unsetFlag('conan', 'martyrBuff');
          ChatMessage.create({
            speaker: { alias: 'GM' },
            content: `<div class="conan-enemy-roll ability-use"><div class="roll-header" style="color: #ff4444;">Martyr's Fury Dismissed</div><div class="roll-section ability-desc"><strong>${token.actor.name}</strong>'s martyr fury fades.</div></div>`
          });
        });
        // Status condition badges (new card layout — conditions in effects column)
        html.find('.status-condition-effect').off('click').click(async (ev) => {
          if (!isPlaced || !token?.actor) return;
          const btn = ev.currentTarget;
          const statusKey = btn.dataset.statusKey;
          const statusType = btn.dataset.statusType;
          const updatePath = statusType === 'condition' ? `system.conditions.${statusKey}` : `system.buffsDebuffs.${statusKey}`;
          await token.actor.update({ [updatePath]: false });
          const statusDef = statusType === 'condition' ? CONDITIONS.find(c => c.key === statusKey) : BUFFS_DEBUFFS.find(b => b.key === statusKey);
          const messages = statusType === 'condition' ? CONDITION_MESSAGES[statusKey] : BUFF_DEBUFF_MESSAGES[statusKey];
          if (statusDef && messages) {
            ChatMessage.create({ content: `<strong>${enemyData.name}</strong> ${messages.off}`, speaker: { alias: 'GM' } });
          }
        });
      }

      // Chat name helpers
      // eName = full title for header: "Veteran Captain Rostam"
      // eShort = first name only for flavor text: "Rostam"
      // his/her/him/himself pronouns from stored gender
      const eName = enemyData.chatName ? `${enemyData.name} ${enemyData.chatName}` : enemyData.name;
      const eShort = enemyData.chatName || enemyData.name;
      const isFemale = enemyData.chatGender === 'f';
      const his = isFemale ? 'her' : 'his';
      const him = isFemale ? 'her' : 'him';
      const he = isFemale ? 'she' : 'he';
      const himself = isFemale ? 'herself' : 'himself';
      const pronouns = { his, him, he, himself };
      const skullsHtml = (enemyData.threatTier > 0) ? `<div class="msg-skulls">${'💀'.repeat(enemyData.threatTier)}</div>` : '';
      const themeClass = `theme-${categoryKey}`;
      // Target's short name (first name only) from their token flags
      const targetShortName = (tActor, tTokenDoc) => {
        const tData = tTokenDoc?.getFlag?.('conan', 'enemyData');
        return tData?.chatName || tData?.name || tActor?.name || 'Unknown';
      };
      // Target's full name for header context
      const targetChatName = (tActor, tTokenDoc) => {
        const tData = tTokenDoc?.getFlag?.('conan', 'enemyData');
        const tBase = tData?.name || tActor?.name || 'Unknown';
        return tData?.chatName ? `${tBase} ${tData.chatName}` : tBase;
      };
      // Helper to wrap content in the new card message structure
      const msgCard = (icon, abilityLabel, bodyHtml) => `
        <div class="enemy-msg ${themeClass}">
          <div class="enemy-msg-header">
            <div class="msg-icon"><i class="fas fa-${icon}"></i></div>
            <div class="msg-titles">
              <div class="msg-name">${eName}</div>
              <div class="msg-ability">${abilityLabel}</div>
            </div>
            ${skullsHtml}
          </div>
          <div class="enemy-msg-body">${bodyHtml}</div>
        </div>`;

      // Stat roll buttons
      html.find('.stat-btn').click(async (ev) => {
        const btn = ev.currentTarget;
        const stat = btn.dataset.stat;
        const value = parseInt(btn.dataset.value);
        const die = btn.dataset.die;

        // Roll stat die + value (e.g., 1d8 + 2)
        const dieFormula = `1${die.toLowerCase()}`;
        const statRoll = await new Roll(dieFormula).evaluate();
        let total = statRoll.total + value;

        // Frightful Aura: -2 to Wits and Grit checks
        let frightfulPenalty = 0;
        if ((stat === 'wits' || stat === 'grit') && isPlaced && token?.actor) {
          const faDebuff = token.actor.getFlag('conan', 'frightfulAuraDebuff');
          if (faDebuff?.active) {
            frightfulPenalty = -2;
            total += frightfulPenalty;
          }
        }

        // Hellfire: -N to all Checks
        let hellfirePenalty = 0;
        if (isPlaced && token?.actor) {
          const hfDebuff = token.actor.getFlag('conan', 'hellfireDebuff');
          if (hfDebuff?.total > 0) {
            hellfirePenalty = -hfDebuff.total;
            total += hellfirePenalty;
          }
        }

        // Create chat message
        const statLabel = stat.charAt(0).toUpperCase() + stat.slice(1);
        let modifiersHtml = '';
        if (frightfulPenalty) modifiersHtml += `<div class="msg-modifier">Frightful Aura: −2</div>`;
        if (hellfirePenalty) modifiersHtml += `<div class="msg-modifier">Hellfire: −${Math.abs(hellfirePenalty)}</div>`;

        // Build stat check bonus chain
        let statBonuses = '';
        if (frightfulPenalty) statBonuses += `<span class="roll-plus">−</span><span class="roll-value">2</span>`;
        if (hellfirePenalty) statBonuses += `<span class="roll-plus">−</span><span class="roll-value">${Math.abs(hellfirePenalty)}</span>`;

        const messageContent = msgCard('dice-d6', `${statLabel} Check`, `
            ${modifiersHtml}
            <div class="roll-row">
              <div class="roll-dice"><div class="die stat">${statRoll.total}</div></div>
              <span class="roll-plus">+</span>
              <span class="roll-value">${statLabel} ${value}</span>
              ${statBonuses}
              <div class="roll-total">${total}</div>
            </div>
        `);

        ChatMessage.create({
          speaker: { alias: enemyData.name },
          content: messageContent,
          rolls: [statRoll]
        });
      });

      // Status icon click handlers (dismiss condition/buff/debuff)
      html.find('.enemy-status-icon').click(async (ev) => {
        if (!isPlaced || !token?.actor) return;

        const iconEl = ev.currentTarget;
        const statusKey = iconEl.dataset.statusKey;
        const statusType = iconEl.dataset.statusType;
        const actor = token.actor;

        // Determine which data path to update
        let updatePath;
        if (statusType === 'condition') {
          updatePath = `system.conditions.${statusKey}`;
        } else {
          // buff or debuff
          updatePath = `system.buffsDebuffs.${statusKey}`;
        }

        // Toggle off (dismiss)
        await actor.update({ [updatePath]: false });

        // Remove the icon from the DOM immediately
        iconEl.remove();

        // Check if grid is now empty and remove it
        const grid = html.find('.enemy-status-grid');
        if (grid.find('.enemy-status-icon').length === 0) {
          grid.remove();
        }

        // Send chat notification
        const statusDef = statusType === 'condition'
          ? CONDITIONS.find(c => c.key === statusKey)
          : BUFFS_DEBUFFS.find(b => b.key === statusKey);
        const messages = statusType === 'condition'
          ? CONDITION_MESSAGES[statusKey]
          : BUFF_DEBUFF_MESSAGES[statusKey];

        if (statusDef && messages) {
          ChatMessage.create({
            content: `<strong>${enemyData.name}</strong> ${messages.off}`,
            speaker: { alias: 'GM' }
          });
        }
      });

      // Weapon roll buttons (roll skill + damage) — delegated for dynamic warded buttons
      html.on('click', '.weapon-btn', async (ev) => {
        const btn = ev.currentTarget;
        const attackName = btn.dataset.name;
        const attackType = btn.dataset.attack; // melee or ranged
        const damageFormula = btn.dataset.damage;
        const stat = btn.dataset.stat; // might or edge
        const statValue = parseInt(btn.dataset.statValue);
        const statDie = btn.dataset.statDie;

        // Check for Fearsome Ward warded button (split button approach)
        const isWardedAttack = btn.dataset.warded === 'true';
        const wardPenalty = isWardedAttack ? -2 : 0;

        // Check for Inspire buff (reads bonus from flag — Tactical captains give +2)
        const hasInspire = isPlaced && token?.actor?.getFlag('conan', 'inspireBuff');
        const inspireBonus = hasInspire ? (hasInspire.bonus || 1) : 0;

        // Check for War Cry buff (+1 attack) and War Chant trait (+2 damage when under War Cry)
        const hasWarCry = isPlaced && token?.actor?.getFlag('conan', 'warCryBuff');
        const warCryAttackBonus = hasWarCry ? 1 : 0;
        const hasWarChant = hasWarCry && enemyData.threatTraits?.includes('warchant');
        const warChantDamageBonus = hasWarChant ? 2 : 0;

        // Check for Martyr buff — stacking +1 damage per dead Martyr (max 3)
        const martyrBuff = isPlaced && token?.actor?.getFlag('conan', 'martyrBuff');
        const martyrDamageBonus = martyrBuff?.stacks || 0;

        // Check for Snake Venom debuff
        const hasVenom = isPlaced && token?.actor?.getFlag('conan', 'snakeVenom')?.active;
        const venomPenalty = hasVenom ? -2 : 0;

        // Check for Aggressive threat trait
        const hasAggressive = enemyData.threatTraits?.includes('aggressive');
        const aggressiveAttackBonus = hasAggressive ? 1 : 0;
        const aggressiveDamageBonus = hasAggressive ? 1 : 0;

        // Check for Bloodthirsty threat trait (+1d3 bonus damage)
        const hasBloodthirsty = enemyData.threatTraits?.includes('bloodthirsty');

        // Check for Zealot threat trait (+1d4 bonus damage)
        const hasZealot = enemyData.threatTraits?.includes('zealot');

        // Check for Cutthroat threat trait (+2 flat damage)
        const hasCutthroat = enemyData.threatTraits?.includes('cutthroat');
        const cutthroatDamage = hasCutthroat ? 2 : 0;

        // Check for Bloody Axe threat trait (+2 flat damage)
        const hasBloodyAxe = enemyData.threatTraits?.includes('bloodyaxe');
        const bloodyAxeDamage = hasBloodyAxe ? 2 : 0;

        // Check for Trample threat trait (+2 melee damage only)
        const hasTrample = enemyData.threatTraits?.includes('trample') && attackType === 'melee';
        const trampleDamage = hasTrample ? 2 : 0;

        // Check for Eagle Eye threat trait (+1 ranged damage, ignore 2 AR handled in conan.js)
        const hasEagleEye = enemyData.threatTraits?.includes('eagleeye') && attackType === 'ranged';
        const eagleEyeDamage = hasEagleEye ? 1 : 0;

        // Check for Bane Weapon buff
        const baneWeaponBuff = isPlaced && token?.actor?.system?.baneWeaponBuff;
        const hasBane = baneWeaponBuff?.damageDie && attackType === 'melee';

        // Hellfire: -N to Attacks
        const hellfireDebuff = isPlaced && token?.actor?.getFlag('conan', 'hellfireDebuff');
        const hellfirePenalty = hellfireDebuff?.total > 0 ? -hellfireDebuff.total : 0;

        // Roll the skill (stat die + value + inspire + warcry + venom + ward + aggressive + hellfire)
        const dieFormula = `1${statDie.toLowerCase()}`;
        const skillRoll = await new Roll(dieFormula).evaluate();
        const skillTotal = skillRoll.total + statValue + inspireBonus + warCryAttackBonus + venomPenalty + wardPenalty + aggressiveAttackBonus + hellfirePenalty;

        // Roll damage
        const dmgFormula = damageFormula.replace(/D/gi, 'd');
        const damageRoll = await new Roll(dmgFormula).evaluate();

        // Roll Bane Weapon bonus damage
        let baneRoll = null;
        let baneDamage = 0;
        if (hasBane) {
          baneRoll = await new Roll(baneWeaponBuff.damageDie).evaluate();
          baneDamage = baneRoll.total;
        }

        // Roll Bloodthirsty bonus damage
        let bloodthirstyRoll = null;
        let bloodthirstyDamage = 0;
        if (hasBloodthirsty) {
          bloodthirstyRoll = await new Roll('1d3').evaluate();
          bloodthirstyDamage = bloodthirstyRoll.total;
        }

        // Roll Zealot bonus damage
        let zealotRoll = null;
        let zealotDamage = 0;
        if (hasZealot) {
          zealotRoll = await new Roll('1d4').evaluate();
          zealotDamage = zealotRoll.total;
        }

        // Check for Berserker buff — stacking +1 damage per dead barbarian
        const berserkerBuff = isPlaced && token?.actor?.getFlag('conan', 'berserkerBuff');
        const berserkerDamageBonus = berserkerBuff?.stacks || 0;

        // Check for Bellow for Blood buff (+1 damage)
        const bellowBuff = isPlaced && token?.actor?.getFlag('conan', 'bellowBuff');
        const bellowDamageBonus = bellowBuff?.active ? 1 : 0;

        // Check for Madwoman buff (+2 damage per stack)
        const madwomanBuff = isPlaced && token?.actor?.getFlag('conan', 'madwomanBuff');
        const madwomanDamageBonus = (madwomanBuff?.stacks || 0) * 2;

        const totalDamage = damageRoll.total + baneDamage + aggressiveDamageBonus + bloodthirstyDamage + zealotDamage + cutthroatDamage + bloodyAxeDamage + warChantDamageBonus + martyrDamageBonus + berserkerDamageBonus + bellowDamageBonus + madwomanDamageBonus + trampleDamage + eagleEyeDamage;
        const statLabel = stat.charAt(0).toUpperCase() + stat.slice(1);

        // Build modifier lines (white text on black — no inline colors)
        let atkModifiers = '';
        if (isWardedAttack) {
          const wardFlavors = [
            "hesitates, dread clawing at their resolve...",
            "strikes with trembling hands, the sorcerer's ward burning in their mind...",
            "flinches as dark energy crackles around the caster...",
            "swings wide, unnerved by the eldritch ward...",
            "attacks through gritted teeth, fighting the supernatural fear..."
          ];
          atkModifiers += `<div class="enemy-msg-flavor" style="padding: 4px 0 2px;">${eShort} ${wardFlavors[Math.floor(Math.random() * wardFlavors.length)]}</div>`;
          atkModifiers += `<div class="msg-modifier">Fearsome Ward: −2 to Attack</div>`;
        }
        if (hasWarCry) atkModifiers += `<div class="msg-modifier">War Cry: +1 to Attack</div>`;
        if (hasWarChant) atkModifiers += `<div class="msg-modifier">War Chant: +2 bonus damage!</div>`;
        if (hasAggressive) atkModifiers += `<div class="msg-modifier">${eShort} attacks aggressively!</div>`;
        if (hasBloodthirsty) atkModifiers += `<div class="msg-modifier">${eShort} strikes with bloodthirsty fury!</div>`;
        if (hasZealot) atkModifiers += `<div class="msg-modifier">${eShort} channels dark fury!</div>`;
        if (hasCutthroat) atkModifiers += `<div class="msg-modifier">${eShort} strikes at a vital spot!</div>`;
        if (hasBloodyAxe) atkModifiers += `<div class="msg-modifier">${eShort} hews with savage force!</div>`;
        if (berserkerDamageBonus) atkModifiers += `<div class="msg-modifier">Berserker Fury: +${berserkerDamageBonus} damage</div>`;
        if (bellowDamageBonus) atkModifiers += `<div class="msg-modifier">Bellow for Blood: +1 damage</div>`;
        if (hasTrample) atkModifiers += `<div class="msg-modifier">${eShort}'s mount tramples the foe!</div>`;
        if (hasEagleEye) atkModifiers += `<div class="msg-modifier">${eShort}'s arrow flies true — pierces armor!</div>`;
        if (martyrDamageBonus) atkModifiers += `<div class="msg-modifier">Martyr's Fury: +${martyrDamageBonus} damage</div>`;
        if (madwomanDamageBonus) atkModifiers += `<div class="msg-modifier">Madwoman: +${madwomanDamageBonus} damage</div>`;
        if (hasVenom) atkModifiers += `<div class="msg-modifier">Snake Venom: −2 to Attack</div>`;
        if (hellfirePenalty) atkModifiers += `<div class="msg-modifier">Hellfire: ${hellfirePenalty} to Attack</div>`;

        // Damage dice HTML
        const dmgDice = damageRoll.dice?.[0]?.results?.map(r => `<div class="die dmg">${r.result}</div>`).join('') || `<div class="die dmg">${damageRoll.total}</div>`;

        // Parse weapon bonus from damage formula (e.g., "1D4+2" → weaponBonus = 2)
        const dmgMatch = dmgFormula.match(/\d+d\d+\+?(\d+)?/i);
        const weaponBonus = dmgMatch?.[1] ? parseInt(dmgMatch[1]) : 0;

        // Build attack bonus chain: each modifier as its own + N
        let atkBonuses = '';
        if (inspireBonus) atkBonuses += `<span class="roll-plus">+</span><span class="roll-value">${inspireBonus}</span>`;
        if (warCryAttackBonus) atkBonuses += `<span class="roll-plus">+</span><span class="roll-value">${warCryAttackBonus}</span>`;
        if (aggressiveAttackBonus) atkBonuses += `<span class="roll-plus">+</span><span class="roll-value">${aggressiveAttackBonus}</span>`;
        if (hasVenom) atkBonuses += `<span class="roll-plus">−</span><span class="roll-value">2</span>`;
        if (isWardedAttack) atkBonuses += `<span class="roll-plus">−</span><span class="roll-value">2</span>`;
        if (hellfirePenalty) atkBonuses += `<span class="roll-plus">−</span><span class="roll-value">${Math.abs(hellfirePenalty)}</span>`;

        // Build damage bonus chain: weapon bonus + aggressive + bloodthirsty + bane
        let dmgBonuses = '';
        if (weaponBonus) dmgBonuses += `<span class="roll-plus">+</span><span class="roll-value">${weaponBonus}</span>`;
        if (aggressiveDamageBonus) dmgBonuses += `<span class="roll-plus">+</span><span class="roll-value">${aggressiveDamageBonus}</span>`;
        if (bloodthirstyDamage) dmgBonuses += `<span class="roll-plus">+</span><span class="roll-value">${bloodthirstyDamage}</span>`;
        if (zealotDamage) dmgBonuses += `<span class="roll-plus">+</span><span class="roll-value">${zealotDamage}</span>`;
        if (cutthroatDamage) dmgBonuses += `<span class="roll-plus">+</span><span class="roll-value">${cutthroatDamage}</span>`;
        if (bloodyAxeDamage) dmgBonuses += `<span class="roll-plus">+</span><span class="roll-value">${bloodyAxeDamage}</span>`;
        if (baneDamage) dmgBonuses += `<span class="roll-plus">+</span><span class="roll-value">${baneDamage}</span>`;
        if (warChantDamageBonus) dmgBonuses += `<span class="roll-plus">+</span><span class="roll-value">${warChantDamageBonus}</span>`;
        if (martyrDamageBonus) dmgBonuses += `<span class="roll-plus">+</span><span class="roll-value">${martyrDamageBonus}</span>`;
        if (berserkerDamageBonus) dmgBonuses += `<span class="roll-plus">+</span><span class="roll-value">${berserkerDamageBonus}</span>`;
        if (bellowDamageBonus) dmgBonuses += `<span class="roll-plus">+</span><span class="roll-value">${bellowDamageBonus}</span>`;
        if (madwomanDamageBonus) dmgBonuses += `<span class="roll-plus">+</span><span class="roll-value">${madwomanDamageBonus}</span>`;
        if (trampleDamage) dmgBonuses += `<span class="roll-plus">+</span><span class="roll-value">${trampleDamage}</span>`;
        if (eagleEyeDamage) dmgBonuses += `<span class="roll-plus">+</span><span class="roll-value">${eagleEyeDamage}</span>`;
        let dmgExtras = '';
        if (hasBane) dmgExtras += `<div class="msg-modifier">Bane Weapon: +${baneDamage} (${baneWeaponBuff.damageDie}) — Target is knocked Prone</div>`;

        const messageContent = msgCard('sword', `${attackName} — ${attackType === 'melee' ? 'Melee' : 'Ranged'} Attack`, `
            ${atkModifiers}
            <div class="roll-row">
              <div class="roll-dice"><div class="die stat">${skillRoll.total}</div></div>
              <span class="roll-plus">+</span>
              <span class="roll-value">${statLabel} ${statValue}</span>
              ${atkBonuses}
              <div class="roll-total">${skillTotal}</div>
            </div>
            <div class="roll-row">
              <div class="roll-dice">${dmgDice}</div>
              ${dmgBonuses}
              <div class="roll-total">${totalDamage}</div>
            </div>${dmgExtras}
        `);

        const allRolls = [skillRoll, damageRoll];
        if (baneRoll) allRolls.push(baneRoll);
        if (bloodthirstyRoll) allRolls.push(bloodthirstyRoll);
        if (zealotRoll) allRolls.push(zealotRoll);

        // Store enemy attack metadata for poison system + doublestrike
        const hasDoublestrike = enemyData.threatTraits?.includes('doublestrike');
        game.conan = game.conan || {};
        game.conan.lastEnemyAttack = {
          enemyId: enemyData.id,
          enemyName: enemyData.name,
          enemyType: enemyData.type,
          weaponName: attackName,
          attackType: attackType,
          tokenImg: enemyData.portraitImg || enemyData.tokenImg || 'icons/svg/mystery-man.svg',
          threatTraits: enemyData.threatTraits || [],
          doublestrike: hasDoublestrike || false,
          doublestrikeData: hasDoublestrike ? {
            damage: damageFormula,
            name: attackName,
            stat: stat,
            statValue: statValue,
            statDie: statDie,
            attackType: attackType,
            eName: eName,
            eShort: eShort
          } : null
        };
        // Set damage directly — don't rely on renderChatMessage hook parsing HTML
        game.conan.lastDamageRoll = totalDamage;
        // Clear player source so public chat message shows enemy name, not stale player name
        game.conan.lastDamageActorId = null;
        console.log(`%c[TRACE 1/4] ATTACK ROLL — ${enemyData.name} (${enemyData.id}) attacks with ${attackName} (${attackType})`, 'color: #FF6B35; font-weight: bold;');
        console.log(`  Hit: ${statDie} rolled ${skillRoll.total} + ${statValue} = ${skillTotal}`);
        console.log(`  Damage: ${damageFormula} = ${damageRoll.total}${hasBane ? ` + ${baneDamage} bane = ${totalDamage}` : ''}`);
        console.log(`  lastEnemyAttack stored:`, game.conan.lastEnemyAttack);

        ChatMessage.create({
          speaker: { alias: enemyData.name },
          content: messageContent,
          rolls: allRolls
        });

        // Untamed: companion attack handled in conan.js applyDamageToToken — fires AFTER main damage is applied
      });

      // Flavor text pools for guard abilities
      const PROTECT_FLAVOR = [
        (n, t, p) => `${n} steps forward, shield raised, placing ${p.himself} between ${t} and danger.`,
        (n, t, p) => `${n} moves to cover ${t}, ${p.his} eyes scanning for threats.`,
        (n, t, p) => `<em>'Stay behind me!'</em> ${n} shoulders into position beside ${t}.`,
        (n, t, p) => `${n} shifts ${p.his} stance, interposing ${p.himself} before ${t} with practiced discipline.`,
        (n, t, p) => `With a grunt, ${n} locks shields and covers ${t}'s flank.`,
        (n, t, p) => `${n} takes up a warding position, daring any fool to strike at ${t}.`,
      ];
      const PROTECT_DISMISS_FLAVOR = [
        (n, t, p) => `${n} breaks formation, leaving ${t} exposed.`,
        (n, t, p) => `${n} steps back from ${t}, lowering ${p.his} guard.`,
        (n, t, p) => `${n} abandons ${p.his} protective stance over ${t}.`,
        (n, t, p) => `<em>'You're on your own.'</em> ${n} pulls away from ${t}.`,
      ];
      const INSPIRE_FLAVOR = [
        (n, t, p) => `<em>'Cut them down!'</em> ${n} roars, and ${t} surge forward with renewed fury.`,
        (n, t, p) => `${n} bellows a war cry that echoes across the battlefield. ${t} tighten their grips.`,
        (n, t, p) => `<em>'By Mitra, hold the line and STRIKE!'</em> ${n}'s command rings with iron authority as ${t} respond.`,
        (n, t, p) => `${n} raises ${p.his} blade high — a signal. ${t} respond with savage purpose.`,
        (n, t, p) => `<em>'No quarter! Make them bleed!'</em> ${n}'s voice carries the weight of command. ${t} obey.`,
        (n, t, p) => `${n} drives ${p.his} fist against ${p.his} shield. The rhythm is picked up by ${t} — the signal to attack.`,
      ];
      const INSPIRE_END_FLAVOR = [
        (n, t, p) => `${n}'s rallying cry fades. The fire in ${p.his} allies' eyes dims.`,
        (n, t, p) => `The surge of battle-fury passes. ${n}'s soldiers settle back into discipline.`,
        (n, t, p) => `${n}'s inspiration wanes — the moment of ferocity has passed.`,
        (n, t, p) => `The captain's words no longer echo. The troops fight on their own merits now.`,
      ];
      const pickFlavor = (pool, ...args) => pool[Math.floor(Math.random() * pool.length)](...args);

      // Speech bubble helper — centered overlay on the card window
      const showCardBubble = (text) => {
        html.find('.card-speech-bubble').remove();
        const bubble = $(`<div class="card-speech-bubble visible">${text}</div>`);
        html.closest('.window-content').append(bubble);
      };
      const hideCardBubble = () => {
        html.closest('.window-content').find('.card-speech-bubble').remove();
      };

      // Track active targeting state for toggle behavior
      let activeTargetingHookId = null;
      let activeEscHandler = null;

      // Ability buttons (special rules)
      html.find('.ability-btn').click(async (ev) => {
        const btn = ev.currentTarget;
        const ruleIndex = parseInt(btn.dataset.ruleIndex);
        const rule = enemyData.rules?.[ruleIndex];
        if (!rule) return;

        // === PROTECT ABILITY ===
        if (rule.name === 'Protect' && isPlaced && token) {
          const sourceTokenId = token.id;

          // TOGGLE OFF: If already targeting, cancel
          if (btn.classList.contains('ability-targeting')) {
            if (activeTargetingHookId) Hooks.off('controlToken', activeTargetingHookId);
            if (activeEscHandler) document.removeEventListener('keydown', activeEscHandler);
            activeTargetingHookId = null;
            activeEscHandler = null;
            btn.classList.remove('ability-targeting');
            hideCardBubble();
            return;
          }

          // If already active (green), dismiss the protect from the guard's side
          if (token.getFlag('conan', 'protectUsed')) {
            const targetTokenId = token.getFlag('conan', 'protectTarget');
            const targetTokenDoc = targetTokenId ? game.scenes.active?.tokens.get(targetTokenId) : null;

            // Remove this guard from target's protectBonus
            if (targetTokenDoc?.actor) {
              const protectData = targetTokenDoc.actor.getFlag('conan', 'protectBonus') || { total: 0, sources: [] };
              const idx = protectData.sources.indexOf(sourceTokenId);
              let removedAmount = 1;
              if (idx > -1) {
                removedAmount = protectData.amounts?.[idx] || 1;
                protectData.sources.splice(idx, 1);
                if (protectData.amounts) protectData.amounts.splice(idx, 1);
                protectData.total = Math.max(0, protectData.total - removedAmount);
              }
              if (protectData.total <= 0) {
                await targetTokenDoc.actor.unsetFlag('conan', 'protectBonus');
              } else {
                await targetTokenDoc.actor.setFlag('conan', 'protectBonus', protectData);
              }

              // Revert defense in target's enemy data
              const targetEnemyFlag = targetTokenDoc.getFlag('conan', 'enemyData');
              if (targetEnemyFlag) {
                const curDef = parseInt(targetEnemyFlag.physicalDefense) || 0;
                await targetTokenDoc.setFlag('conan', 'enemyData', { ...targetEnemyFlag, physicalDefense: Math.max(0, curDef - removedAmount) });
              }

              const dismissTarget = targetChatName(targetTokenDoc.actor, targetTokenDoc);
              const dismissShort = targetShortName(targetTokenDoc.actor, targetTokenDoc);
              ChatMessage.create({
                speaker: { alias: enemyData.name },
                content: msgCard('shield-halved', 'Protect Dismissed', `
                  <div class="enemy-msg-flavor">${pickFlavor(PROTECT_DISMISS_FLAVOR, eShort, dismissShort, pronouns)}</div>
                  <div class="enemy-msg-mechanic">
                    <span class="mech-tag debuff"><i class="fas fa-shield-halved"></i> -${removedAmount} Phys Def</span>
                    <span class="mech-tag target"><i class="fas fa-crosshairs"></i> ${dismissTarget}</span>
                  </div>
                `)
              });
            }

            // Free this guard
            await token.setFlag('conan', 'protectUsed', false);
            await token.unsetFlag('conan', 'protectTarget');
            btn.classList.remove('ability-active');
            return;
          }

          // Shared logic for applying Protect to a target token
          const applyProtectTo = async (controlledToken) => {
            // Clean up targeting state
            if (activeTargetingHookId) Hooks.off('controlToken', activeTargetingHookId);
            if (activeEscHandler) document.removeEventListener('keydown', activeEscHandler);
            activeTargetingHookId = null;
            activeEscHandler = null;
            btn.classList.remove('ability-targeting');
            hideCardBubble();

            const targetActor = controlledToken.actor;
            const targetTokenDoc = controlledToken.document ?? controlledToken;
            if (!targetActor) {
              ui.notifications.warn('No valid target.');
              return;
            }

            // Don't allow protecting yourself
            const tId = targetTokenDoc.id ?? targetTokenDoc._id;
            if (tId === sourceTokenId) {
              ui.notifications.warn('A Guard cannot Protect itself.');
              return;
            }

            // Get current protect data from target
            const protectData = targetActor.getFlag('conan', 'protectBonus') || { total: 0, sources: [] };

            // Check if this specific guard already protected this target
            if (protectData.sources.includes(sourceTokenId)) {
              ui.notifications.warn(`${enemyData.name} is already Protecting this target.`);
              return;
            }

            // Tactical trait: +2 protect instead of +1
            const isTactical = enemyData.threatTraits?.includes('tactical');
            const protectAmount = isTactical ? 2 : 1;
            const effectiveAdd = Math.min(protectAmount, 3 - protectData.total);

            // Check max +3 cap
            if (effectiveAdd <= 0) {
              ui.notifications.warn(`${targetActor.name} already has the maximum Protect bonus (+3).`);
              return;
            }

            // Apply the bonus with per-guard amount tracking
            protectData.total += effectiveAdd;
            protectData.sources.push(sourceTokenId);
            if (!protectData.amounts) protectData.amounts = protectData.sources.slice(0, -1).map(() => 1);
            protectData.amounts.push(effectiveAdd);
            await targetActor.setFlag('conan', 'protectBonus', protectData);

            // Mark this guard as having used Protect and store who they're protecting
            await token.setFlag('conan', 'protectUsed', true);
            await token.setFlag('conan', 'protectTarget', tId);

            // Update the enemy token's flag data so the dialog shows new defense
            const targetEnemyFlag = targetTokenDoc.getFlag('conan', 'enemyData');
            if (targetEnemyFlag) {
              const currentPhysDef = parseInt(targetEnemyFlag.physicalDefense) || 0;
              await targetTokenDoc.setFlag('conan', 'enemyData', {
                ...targetEnemyFlag,
                physicalDefense: currentPhysDef + effectiveAdd
              });
            }

            // Turn the button green
            btn.classList.add('ability-active');

            // Chat message
            const tName = targetChatName(targetActor, targetTokenDoc);
            const tShort = targetShortName(targetActor, targetTokenDoc);
            ChatMessage.create({
              speaker: { alias: enemyData.name },
              content: msgCard('shield-halved', 'Protect', `
                <div class="enemy-msg-flavor">${pickFlavor(PROTECT_FLAVOR, eShort, tShort, pronouns)}</div>
                <div class="enemy-msg-mechanic">
                  <span class="mech-tag buff"><i class="fas fa-shield-halved"></i> +${effectiveAdd} Phys Def</span>
                  <span class="mech-tag target"><i class="fas fa-crosshairs"></i> ${tName}</span>
                </div>
              `)
            });
          };

          // Deselect any currently highlighted tokens so the next click always fires controlToken
          canvas.tokens?.releaseAll();

          // TOGGLE ON: Enter targeting mode and wait for selection
          if (isNewCardLayout) showCardBubble('Left click target token to activate.');
          btn.classList.add('ability-targeting');

          activeTargetingHookId = Hooks.on('controlToken', async (controlledToken, isControlled) => {
            if (!isControlled) return;
            await applyProtectTo(controlledToken);
          });

          // Cancel targeting if Escape is pressed
          activeEscHandler = (e) => {
            if (e.key === 'Escape') {
              if (activeTargetingHookId) Hooks.off('controlToken', activeTargetingHookId);
              activeTargetingHookId = null;
              activeEscHandler = null;
              btn.classList.remove('ability-targeting');
              document.removeEventListener('keydown', activeEscHandler);
              hideCardBubble();
            }
          };
          document.addEventListener('keydown', activeEscHandler);
          return;
        }

        // === INSPIRE ABILITY ===
        if (rule.name === 'Inspire' && isPlaced && token) {
          const captainTokenId = token.id;
          const currentState = token.getFlag('conan', 'inspireState');

          // SPENT → READY: reset so GM can re-use
          if (currentState === 'spent') {
            await token.unsetFlag('conan', 'inspireState');
            btn.classList.remove('ability-spent');
            ui.notifications.info(`${enemyData.name}'s Inspire is ready again.`);
            return;
          }

          // ACTIVE → SPENT: deactivate and remove buff from all targets
          if (currentState === 'active') {
            const inspireTargets = token.getFlag('conan', 'inspireTargets') || [];
            for (const targetId of inspireTargets) {
              const targetTokenDoc = game.scenes.active?.tokens.get(targetId);
              if (targetTokenDoc?.actor) {
                await targetTokenDoc.actor.unsetFlag('conan', 'inspireBuff');
              }
            }
            await token.setFlag('conan', 'inspireState', 'spent');
            await token.unsetFlag('conan', 'inspireTargets');
            btn.classList.remove('ability-active');
            btn.classList.add('ability-spent');

            ChatMessage.create({
              speaker: { alias: enemyData.name },
              content: msgCard('bullhorn', 'Inspire Ended', `
                <div class="enemy-msg-flavor">${pickFlavor(INSPIRE_END_FLAVOR, eShort, null, pronouns)}</div>
              `)
            });
            return;
          }

          // READY → TARGETING: Shift+click multi-select
          // If already in targeting mode, cancel
          if (btn.classList.contains('ability-targeting')) {
            if (activeTargetingHookId) Hooks.off('controlToken', activeTargetingHookId);
            if (activeEscHandler) document.removeEventListener('keydown', activeEscHandler);
            activeTargetingHookId = null;
            activeEscHandler = null;
            btn.classList.remove('ability-targeting');
            hideCardBubble();
            return;
          }

          canvas.tokens?.releaseAll();
          if (isNewCardLayout) showCardBubble('Left click target tokens, then press Shift to activate.');
          btn.classList.add('ability-targeting');

          const inspireSelected = [];

          // Listen for Shift+click token selections
          activeTargetingHookId = Hooks.on('controlToken', (controlledToken, isControlled) => {
            if (!isControlled) return;
            const tDoc = controlledToken.document ?? controlledToken;
            const tId = tDoc.id ?? tDoc._id;
            if (tId === captainTokenId) return; // can't inspire yourself
            if (inspireSelected.includes(tId)) return; // already selected
            inspireSelected.push(tId);
          });

          // Listen for Shift release to activate
          const shiftUpHandler = async (e) => {
            if (e.key !== 'Shift') return;
            document.removeEventListener('keyup', shiftUpHandler);
            if (activeEscHandler) document.removeEventListener('keydown', activeEscHandler);
            if (activeTargetingHookId) Hooks.off('controlToken', activeTargetingHookId);
            activeTargetingHookId = null;
            activeEscHandler = null;
            btn.classList.remove('ability-targeting');
            hideCardBubble();

            if (inspireSelected.length === 0) {
              return;
            }

            // Apply Inspire buff to all selected targets
            // Tactical captains give +2 instead of +1
            const isTacticalCaptain = enemyData.threatTraits?.includes('tactical');
            const inspireAmount = isTacticalCaptain ? 2 : 1;
            const targetFullNames = [];
            const targetShortNames = [];
            for (const targetId of inspireSelected) {
              const tDoc = game.scenes.active?.tokens.get(targetId);
              if (tDoc?.actor) {
                await tDoc.actor.setFlag('conan', 'inspireBuff', { source: captainTokenId, bonus: inspireAmount });
                targetFullNames.push(targetChatName(tDoc.actor, tDoc));
                targetShortNames.push(targetShortName(tDoc.actor, tDoc));
              }
            }

            // Store targets on captain and set state
            await token.setFlag('conan', 'inspireTargets', inspireSelected);
            await token.setFlag('conan', 'inspireState', 'active');
            btn.classList.add('ability-active');

            ChatMessage.create({
              speaker: { alias: enemyData.name },
              content: msgCard('bullhorn', 'Inspire', `
                <div class="enemy-msg-flavor">${pickFlavor(INSPIRE_FLAVOR, eShort, targetShortNames.join(', '), pronouns)}</div>
                <div class="enemy-msg-mechanic">
                  <span class="mech-tag buff"><i class="fas fa-burst"></i> +${inspireAmount} Attack</span>
                  <span class="mech-tag target"><i class="fas fa-crosshairs"></i> ${targetFullNames.join(', ')}</span>
                </div>
              `)
            });
          };
          document.addEventListener('keyup', shiftUpHandler);

          // Cancel on Escape
          activeEscHandler = (e) => {
            if (e.key === 'Escape') {
              if (activeTargetingHookId) Hooks.off('controlToken', activeTargetingHookId);
              document.removeEventListener('keyup', shiftUpHandler);
              document.removeEventListener('keydown', activeEscHandler);
              activeTargetingHookId = null;
              activeEscHandler = null;
              btn.classList.remove('ability-targeting');
              hideCardBubble();
            }
          };
          document.addEventListener('keydown', activeEscHandler);
          return;
        }

        // === WAR CRY ABILITY ===
        if (rule.name === 'War Cry' && isPlaced && token) {
          const championTokenId = token.id;
          const currentWarCry = token.getFlag('conan', 'warCryState');

          // ACTIVE → DISMISS: remove buff from all picts
          if (currentWarCry === 'active') {
            const allTokens = game.scenes.active?.tokens?.contents || [];
            for (const t of allTokens) {
              if (t.actor?.getFlag('conan', 'warCryBuff')?.source === championTokenId) {
                await t.actor.unsetFlag('conan', 'warCryBuff');
              }
            }
            await token.setFlag('conan', 'warCryState', null);
            btn.classList.remove('ability-active');

            const WAR_CRY_END = [
              (n, p) => `${n}'s war cry fades into silence. The bloodlust ebbs.`,
              (n, p) => `The echoes of ${n}'s savage howl die away. The Picts fight on instinct alone.`,
              (n, p) => `${n} falls silent. The frenzy passes — but the killing doesn't stop.`,
            ];
            ChatMessage.create({
              speaker: { alias: enemyData.name },
              content: msgCard('volume-xmark', 'War Cry Ends', `
                <div class="enemy-msg-flavor">${WAR_CRY_END[Math.floor(Math.random() * WAR_CRY_END.length)](eShort, pronouns)}</div>
              `)
            });
            return;
          }

          // READY → ACTIVATE: buff all pict tokens on scene
          const allTokens = game.scenes.active?.tokens?.contents || [];
          const PICT_IDS = ['pict-hunter', 'pict-warrior', 'pict-champion'];
          const buffedNames = [];
          for (const t of allTokens) {
            const tEnemy = t.getFlag('conan', 'enemyData');
            if (tEnemy && PICT_IDS.includes(tEnemy.id) && t.id !== championTokenId) {
              await t.actor.setFlag('conan', 'warCryBuff', { source: championTokenId, bonus: 1 });
              buffedNames.push(tEnemy.chatName || tEnemy.name || t.name);
            }
          }
          // Champion also buffs themselves
          await token.actor.setFlag('conan', 'warCryBuff', { source: championTokenId, bonus: 1 });

          await token.setFlag('conan', 'warCryState', 'active');
          btn.classList.add('ability-active');

          const targetList = buffedNames.length > 0 ? buffedNames.join(', ') : 'no allies nearby';
          const WAR_CRY_FLAVOR = [
            (n, t, p) => `${n} throws back ${p.his} head and unleashes a savage, ululating war cry! ${t} howl in answer!`,
            (n, t, p) => `A blood-curdling shriek rips from ${n}'s throat — primal, inhuman. ${t} bare their teeth and snarl!`,
            (n, t, p) => `${n} beats ${p.his} chest and screams to the dark gods! The sound ignites madness in ${t}!`,
            (n, t, p) => `<em>'RAAAGHHH!'</em> ${n}'s war cry splits the air. ${t} surge forward, eyes wild!`,
          ];
          ChatMessage.create({
            speaker: { alias: enemyData.name },
            content: msgCard('volume-high', 'War Cry', `
              <div class="enemy-msg-flavor">${WAR_CRY_FLAVOR[Math.floor(Math.random() * WAR_CRY_FLAVOR.length)](eShort, targetList, pronouns)}</div>
              <div class="enemy-msg-mechanic">
                <span class="mech-tag buff"><i class="fas fa-burst"></i> +1 Attack (all Picts)</span>
              </div>
            `)
          });
          return;
        }

        // === SKULKERS ABILITY ===
        if (rule.name === 'Skulkers') {
          const edgeStat = enemyData.stats.edge.value;
          const edgeDieStr = enemyData.stats.edge.die;
          const skulkBonus = 1;
          const dieFormula = `1${edgeDieStr.toLowerCase()}`;
          const edgeRoll = await new Roll(dieFormula).evaluate();
          const total = edgeRoll.total + edgeStat + skulkBonus;

          const messageContent = `
            <div class="conan-enemy-roll">
              <div class="roll-header">${eName} — Skulkers (Stealth)</div>
              <div class="roll-section">
                <span class="roll-label" style="color: #ccc;">Edge Check:</span>
                <span class="roll-dice" style="color: #fff;">${edgeDieStr}: ${edgeRoll.total} +${edgeStat} <span style="color: #32CD32; font-weight: bold;">+${skulkBonus}</span></span>
                <span class="roll-result" style="color: #fff; font-weight: bold;">= ${total}</span>
              </div>
              <div style="font-style: italic; color: #aaa; margin-top: 4px;">
                "When you skulk for a living you're better at it than most."
              </div>
            </div>
          `;

          ChatMessage.create({
            speaker: { alias: enemyData.name },
            content: messageContent,
            rolls: [edgeRoll]
          });
          return;
        }

        // === GLAMOUR (Witch — Blind a player) ===
        if (rule.name === 'Glamour' && isPlaced && token) {
          const witchName = enemyData.chatName || enemyData.name;

          // LP cost check (1 LP sorcery)
          const maxLP = enemyData.lifePoints || 0;
          const sceneTokenG = game.scenes.active?.tokens.get(token.id);
          const currentLP = sceneTokenG?.actor?.system?.lifePoints?.value ?? (token.getFlag('conan', 'currentHP') ?? maxLP);
          if (currentLP <= 1) {
            ui.notifications.warn(`${enemyData.name} does not have enough LP to cast Glamour.`);
            return;
          }

          // Enter targeting mode — GM clicks a player token
          ui.notifications.info('GLAMOUR: Click a player token to blind them.');
          const btn = ev.currentTarget;
          btn.classList.add('ability-targeting');
          document.body.style.cursor = 'crosshair';

          const glamourClickHandler = async (controlledToken, controlled) => {
            if (!controlled) return;
            const targetActor = controlledToken.actor;
            if (!targetActor || targetActor.type !== 'character2') {
              ui.notifications.warn('Glamour can only target player characters.');
              return;
            }

            // Clean up targeting
            Hooks.off('controlToken', glamourClickHandler);
            btn.classList.remove('ability-targeting');
            document.body.style.cursor = '';

            // Pay 1 LP — DUAL LP WRITE
            const newLP = Math.max(0, currentLP - 1);
            if (sceneTokenG) {
              await sceneTokenG.setFlag('conan', 'currentHP', newLP);
              if (sceneTokenG.actor) await sceneTokenG.actor.update({ 'system.lifePoints.value': newLP });
            }

            // Apply blinded condition + glamour flag to target
            await targetActor.update({ 'system.conditions.blinded': true });
            await targetActor.setFlag('conan', 'glamourDebuff', { active: true, source: token.id, witchName: witchName });

            const targetName = targetActor.name;
            const GLAMOUR_FLAVOR = [
              `${witchName}'s eyes flash with eldritch light — ${targetName}'s vision dissolves into darkness!`,
              `A whispered incantation from ${witchName} and ${targetName}'s world goes black!`,
              `${witchName} weaves fingers through the air — shadows crawl across ${targetName}'s eyes!`,
              `${witchName} breathes a curse and ${targetName} is swallowed by impenetrable gloom!`,
            ];

            await ChatMessage.create({
              speaker: { alias: enemyData.name },
              content: `
                <div class="enemy-msg theme-human">
                  <div class="enemy-msg-header">
                    <div class="msg-icon"><i class="fas fa-eye-slash" style="font-size: 24px; color: #708090;"></i></div>
                    <div class="msg-titles">
                      <div class="msg-name">Glamour — ${targetName} Blinded!</div>
                    </div>
                  </div>
                  <div class="enemy-msg-body">
                    <div style="color: #ccc; text-align: center; font-style: italic;">${GLAMOUR_FLAVOR[Math.floor(Math.random() * GLAMOUR_FLAVOR.length)]}</div>
                    <div style="text-align: center; margin-top: 8px;">
                      <img src="systems/conan/images/icons/blinded_icon.png" alt="Blinded" style="width: 48px; height: 48px; filter: drop-shadow(0 0 6px rgba(112,128,144,0.8));"/>
                    </div>
                    <div class="roll-row" style="justify-content: center; margin-top: 6px;">
                      <span class="mech-tag debuff"><i class="fas fa-eye-slash"></i> Blinded</span>
                      <span class="mech-tag"><i class="fas fa-droplet"></i> 1 LP</span>
                    </div>
                    <div style="color: #708090; text-align: center; margin-top: 4px; font-size: 0.85em;">Attacks auto-miss unless Flex triggers. Spend 1 SP to overcome. Expires end of turn.</div>
                  </div>
                </div>`,
              flags: { conan: { enemySpellCast: {
                enemyName: enemyData.name,
                abilityName: 'Glamour',
                tokenId: token?.id || null,
                enemyWits: enemyData.stats?.wits?.value ?? 0,
                enemyWitsDie: enemyData.stats?.wits?.die || 'D6'
              }}}
            });

            console.log(`%c[GLAMOUR] ${witchName} blinds ${targetName}`, 'color: #708090; font-weight: bold;');
          };

          Hooks.on('controlToken', glamourClickHandler);

          // ESC to cancel
          const escHandler = (e) => {
            if (e.key === 'Escape') {
              Hooks.off('controlToken', glamourClickHandler);
              document.removeEventListener('keydown', escHandler);
              btn.classList.remove('ability-targeting');
              document.body.style.cursor = '';
              ui.notifications.info('Glamour cancelled.');
            }
          };
          document.addEventListener('keydown', escHandler);
          return;
        }

        // === HEX (Witch — -1 attack on a player, stacks to 3, removed on witch death) ===
        if (rule.name === 'Hex' && isPlaced && token) {
          const hexWitchName = enemyData.chatName || enemyData.name;

          // LP cost check (1 LP sorcery)
          const hexMaxLP = enemyData.lifePoints || 0;
          const sceneTokenH = game.scenes.active?.tokens.get(token.id);
          const hexCurrentLP = sceneTokenH?.actor?.system?.lifePoints?.value ?? (token.getFlag('conan', 'currentHP') ?? hexMaxLP);
          if (hexCurrentLP <= 1) {
            ui.notifications.warn(`${enemyData.name} does not have enough LP to cast Hex.`);
            return;
          }

          ui.notifications.info('HEX: Click a player token to curse them.');
          const hexBtn = ev.currentTarget;
          hexBtn.classList.add('ability-targeting');
          document.body.style.cursor = 'crosshair';

          const hexClickHandler = async (controlledToken, controlled) => {
            if (!controlled) return;
            const hexTargetActor = controlledToken.actor;
            if (!hexTargetActor || hexTargetActor.type !== 'character2') {
              ui.notifications.warn('Hex can only target player characters.');
              return;
            }

            Hooks.off('controlToken', hexClickHandler);
            document.removeEventListener('keydown', hexEscHandler);
            hexBtn.classList.remove('ability-targeting');
            document.body.style.cursor = '';

            // Pay 1 LP — DUAL LP WRITE
            const hexNewLP = Math.max(0, hexCurrentLP - 1);
            if (sceneTokenH) {
              await sceneTokenH.setFlag('conan', 'currentHP', hexNewLP);
              if (sceneTokenH.actor) await sceneTokenH.actor.update({ 'system.lifePoints.value': hexNewLP });
            }

            // Stack hex debuff (up to 3)
            const hexFlag = hexTargetActor.getFlag('conan', 'hexDebuff') || { stacks: 0, sources: [] };
            if (hexFlag.stacks >= 3) {
              ui.notifications.warn(`${hexTargetActor.name} already has maximum Hex stacks (3).`);
              return;
            }
            hexFlag.stacks += 1;
            if (!hexFlag.sources.includes(token.id)) hexFlag.sources.push(token.id);
            await hexTargetActor.setFlag('conan', 'hexDebuff', hexFlag);

            const hexTargetName = hexTargetActor.name;
            const HEX_FLAVOR = [
              `${hexWitchName} points a gnarled finger at ${hexTargetName} — dark energy coils around their arms!`,
              `${hexWitchName} hisses ancient words and ${hexTargetName} feels their strength drain away!`,
              `A sickly green light leaps from ${hexWitchName}'s hand — ${hexTargetName}'s strikes grow sluggish!`,
              `${hexWitchName}'s curse settles over ${hexTargetName} like a shroud of weakness!`,
            ];

            await ChatMessage.create({
              speaker: { alias: enemyData.name },
              content: `
                <div class="enemy-msg theme-human">
                  <div class="enemy-msg-header">
                    <div class="msg-icon"><i class="fas fa-hand-sparkles" style="font-size: 24px; color: #9400D3;"></i></div>
                    <div class="msg-titles">
                      <div class="msg-name">Hex — ${hexTargetName} Cursed!</div>
                    </div>
                  </div>
                  <div class="enemy-msg-body">
                    <div style="color: #ccc; text-align: center; font-style: italic;">${HEX_FLAVOR[Math.floor(Math.random() * HEX_FLAVOR.length)]}</div>
                    <div class="roll-row" style="justify-content: center; margin-top: 6px;">
                      <span class="mech-tag debuff"><i class="fas fa-hand-sparkles"></i> Hex -${hexFlag.stacks} Attack</span>
                      <span class="mech-tag"><i class="fas fa-droplet"></i> 1 LP</span>
                    </div>
                    <div style="color: #9400D3; text-align: center; margin-top: 4px; font-size: 0.85em;">-${hexFlag.stacks} to all attack rolls. Kill the witch to remove.</div>
                  </div>
                </div>`,
              flags: { conan: { enemySpellCast: {
                enemyName: enemyData.name,
                abilityName: 'Hex',
                tokenId: token?.id || null,
                enemyWits: enemyData.stats?.wits?.value ?? 0,
                enemyWitsDie: enemyData.stats?.wits?.die || 'D6'
              }}}
            });
            console.log(`%c[HEX] ${hexWitchName} hexes ${hexTargetName} (stack ${hexFlag.stacks})`, 'color: #9400D3; font-weight: bold;');
          };

          Hooks.on('controlToken', hexClickHandler);
          const hexEscHandler = (e) => {
            if (e.key === 'Escape') {
              Hooks.off('controlToken', hexClickHandler);
              document.removeEventListener('keydown', hexEscHandler);
              hexBtn.classList.remove('ability-targeting');
              document.body.style.cursor = '';
              ui.notifications.info('Hex cancelled.');
            }
          };
          document.addEventListener('keydown', hexEscHandler);
          return;
        }

        // === LUST (Enchantress — Blind a player, reskinned Glamour) ===
        if (rule.name === 'Lust' && isPlaced && token) {
          const lustName = enemyData.chatName || enemyData.name;

          // LP cost check (1 LP sorcery)
          const sceneTokenL = game.scenes.active?.tokens.get(token.id);
          const lustMaxLP = enemyData.lifePoints || 0;
          const lustCurrentLP = sceneTokenL?.actor?.system?.lifePoints?.value ?? (token.getFlag('conan', 'currentHP') ?? lustMaxLP);
          if (lustCurrentLP <= 1) {
            ui.notifications.warn(`${enemyData.name} does not have enough LP to cast Lust.`);
            return;
          }

          ui.notifications.info('LUST: Click a player token to blind them.');
          const lustBtn = ev.currentTarget;
          lustBtn.classList.add('ability-targeting');
          document.body.style.cursor = 'crosshair';

          const lustClickHandler = async (controlledToken, controlled) => {
            if (!controlled) return;
            const lustTarget = controlledToken.actor;
            if (!lustTarget || lustTarget.type !== 'character2') {
              ui.notifications.warn('Lust can only target player characters.');
              return;
            }

            Hooks.off('controlToken', lustClickHandler);
            document.removeEventListener('keydown', lustEscHandler);
            lustBtn.classList.remove('ability-targeting');
            document.body.style.cursor = '';

            // Pay 1 LP — DUAL LP WRITE
            const lustNewLP = Math.max(0, lustCurrentLP - 1);
            if (sceneTokenL) {
              await sceneTokenL.setFlag('conan', 'currentHP', lustNewLP);
              if (sceneTokenL.actor) await sceneTokenL.actor.update({ 'system.lifePoints.value': lustNewLP });
            }

            // Apply blinded condition
            await lustTarget.update({ 'system.conditions.blinded': true });
            await lustTarget.setFlag('conan', 'glamourDebuff', { active: true, source: token.id, witchName: lustName });

            const lustTargetName = lustTarget.name;
            const LUST_FLAVOR = [
              `${lustName} locks eyes with ${lustTargetName} — the world melts away, leaving only her.`,
              `${lustName} whispers something only ${lustTargetName} can hear. Everything else ceases to exist.`,
              `${lustName}'s perfume thickens the air and ${lustTargetName}'s vision blurs with longing.`,
              `${lustName} traces a finger along her collarbone — ${lustTargetName} forgets where they are.`,
              `${lustName} smiles, and ${lustTargetName}'s sword arm goes slack. Nothing else matters now.`,
              `A single glance from ${lustName} and ${lustTargetName} is lost in a dream of silk and warmth.`,
            ];

            await ChatMessage.create({
              speaker: { alias: enemyData.name },
              content: `
                <div class="enemy-msg theme-human">
                  <div class="enemy-msg-header">
                    <div class="msg-icon"><i class="fas fa-heart" style="font-size: 24px; color: #FF69B4;"></i></div>
                    <div class="msg-titles">
                      <div class="msg-name">Lust — ${lustTargetName} Blinded!</div>
                    </div>
                  </div>
                  <div class="enemy-msg-body">
                    <div style="color: #ccc; text-align: center; font-style: italic;">${LUST_FLAVOR[Math.floor(Math.random() * LUST_FLAVOR.length)]}</div>
                    <div class="roll-row" style="justify-content: center; margin-top: 6px;">
                      <span class="mech-tag debuff"><i class="fas fa-heart"></i> Blinded</span>
                      <span class="mech-tag"><i class="fas fa-droplet"></i> 1 LP</span>
                    </div>
                    <div style="color: #FF69B4; text-align: center; margin-top: 4px; font-size: 0.85em;">Attacks auto-miss unless Flex triggers. Spend 1 SP to overcome. Expires end of turn.</div>
                  </div>
                </div>`,
              flags: { conan: { enemySpellCast: {
                enemyName: enemyData.name,
                abilityName: 'Lust',
                tokenId: token?.id || null,
                enemyWits: enemyData.stats?.wits?.value ?? 0,
                enemyWitsDie: enemyData.stats?.wits?.die || 'D6'
              }}}
            });
            console.log(`%c[LUST] ${lustName} blinds ${lustTargetName}`, 'color: #FF69B4; font-weight: bold;');
          };

          Hooks.on('controlToken', lustClickHandler);
          const lustEscHandler = (e) => {
            if (e.key === 'Escape') {
              Hooks.off('controlToken', lustClickHandler);
              document.removeEventListener('keydown', lustEscHandler);
              lustBtn.classList.remove('ability-targeting');
              document.body.style.cursor = '';
              ui.notifications.info('Lust cancelled.');
            }
          };
          document.addEventListener('keydown', lustEscHandler);
          return;
        }

        // === TENDER MERCY (Enchantress — Heal an ally enemy for 2D4+2, repeatable) ===
        if (rule.name === 'Tender Mercy' && isPlaced && token) {
          const mercyName = enemyData.chatName || enemyData.name;
          const mercyBtn = ev.currentTarget;

          // Toggle off if already targeting
          if (mercyBtn.classList.contains('ability-targeting')) {
            mercyBtn.classList.remove('ability-targeting');
            document.body.style.cursor = '';
            ui.notifications.info('Tender Mercy ended.');
            return;
          }

          ui.notifications.info('TENDER MERCY: Click enemy tokens to heal. ESC or re-click to stop.');
          mercyBtn.classList.add('ability-targeting');
          document.body.style.cursor = 'crosshair';

          const MERCY_FLAVOR = [
            `${mercyName} presses her lips to TARGET's wounds — the flesh knits together.`,
            `${mercyName} whispers honeyed lies and TARGET's pain melts away.`,
            `Soft hands and softer words — ${mercyName} mends what steel has torn.`,
            `${mercyName} hums an ancient lullaby and TARGET's wounds close like sleeping eyes.`,
            `"Hush now," ${mercyName} murmurs, and TARGET's blood retreats back beneath the skin.`,
            `${mercyName} traces a sigil on TARGET's chest — warmth floods through them.`,
          ];

          const mercyClickHandler = async (controlledToken, controlled) => {
            if (!controlled) return;
            const tEd = controlledToken.document?.getFlag('conan', 'enemyData');
            if (!tEd) {
              ui.notifications.warn('Tender Mercy can only target enemies.');
              return;
            }
            if (controlledToken.document.getFlag('conan', 'dead')) {
              ui.notifications.warn('That enemy is already dead.');
              return;
            }

            // Check LP each time (re-read live)
            const sceneTokenM = game.scenes.active?.tokens.get(token.id);
            const mercyCurrentLP = sceneTokenM?.actor?.system?.lifePoints?.value ?? (token.getFlag('conan', 'currentHP') ?? 0);
            if (mercyCurrentLP <= 1) {
              ui.notifications.warn(`${enemyData.name} does not have enough LP to cast Tender Mercy.`);
              Hooks.off('controlToken', mercyClickHandler);
              document.removeEventListener('keydown', mercyEscHandler);
              mercyBtn.classList.remove('ability-targeting');
              document.body.style.cursor = '';
              return;
            }

            // Pay 1 LP — DUAL LP WRITE
            const mercyNewLP = Math.max(0, mercyCurrentLP - 1);
            if (sceneTokenM) {
              await sceneTokenM.setFlag('conan', 'currentHP', mercyNewLP);
              if (sceneTokenM.actor) await sceneTokenM.actor.update({ 'system.lifePoints.value': mercyNewLP });
            }

            const targetName = tEd.chatName || tEd.name;
            const flavor = MERCY_FLAVOR[Math.floor(Math.random() * MERCY_FLAVOR.length)].replace('TARGET', targetName);
            const isMinion = tEd.type === 'Minion';

            if (isMinion) {
              // Minion: clear wounded flag (remove a hit)
              const isWounded = controlledToken.document.getFlag('conan', 'wounded');
              if (!isWounded) {
                ui.notifications.warn(`${targetName} is not wounded.`);
                canvas.tokens.releaseAll();
                return;
              }
              await controlledToken.document.setFlag('conan', 'wounded', false);
              // Reset orange wounded tint back to normal
              await controlledToken.document.update({ 'texture.tint': null });

              // Floating green heal
              if (typeof window.broadcastFloatingDamage === 'function') window.broadcastFloatingDamage(controlledToken.id, 0, false, false, true);

              await ChatMessage.create({
                speaker: { alias: enemyData.name },
                content: `
                  <div class="enemy-msg theme-human">
                    <div class="enemy-msg-header">
                      <div class="msg-icon"><i class="fas fa-hand-holding-heart" style="font-size: 24px; color: #FF69B4;"></i></div>
                      <div class="msg-titles">
                        <div class="msg-name">Tender Mercy — ${targetName} Restored!</div>
                      </div>
                    </div>
                    <div class="enemy-msg-body">
                      <div style="color: #ccc; text-align: center; font-style: italic;">${flavor}</div>
                      <div class="roll-row" style="justify-content: center; margin-top: 6px;">
                        <span class="mech-tag heal"><i class="fas fa-heart"></i> Wound Removed</span>
                        <span class="mech-tag"><i class="fas fa-droplet"></i> 1 LP</span>
                      </div>
                    </div>
                  </div>`
              });
              console.log(`%c[TENDER MERCY] ${mercyName} removes wound from ${targetName}`, 'color: #FF69B4; font-weight: bold;');
            } else {
              // Antagonist: roll 2D4+2 LP heal
              const mercyRoll = await new Roll('2d4+2').evaluate();
              const healAmount = mercyRoll.total;

              // Heal target — DUAL LP WRITE
              const targetSceneToken = game.scenes.active?.tokens.get(controlledToken.document.id);
              const tMaxLP = tEd.lifePoints || 0;
              const tCurrentLP = targetSceneToken?.actor?.system?.lifePoints?.value ?? (controlledToken.document.getFlag('conan', 'currentHP') ?? tMaxLP);
              const tNewLP = Math.min(tMaxLP, tCurrentLP + healAmount);
              if (targetSceneToken?.actor) {
                await targetSceneToken.actor.update({ 'system.lifePoints.value': tNewLP });
              }
              await controlledToken.document.setFlag('conan', 'currentHP', tNewLP);

              // Floating green heal
              if (typeof window.broadcastFloatingDamage === 'function') window.broadcastFloatingDamage(controlledToken.id, healAmount, false, false, true);

              await ChatMessage.create({
                speaker: { alias: enemyData.name },
                content: `
                  <div class="enemy-msg theme-human">
                    <div class="enemy-msg-header">
                      <div class="msg-icon"><i class="fas fa-hand-holding-heart" style="font-size: 24px; color: #FF69B4;"></i></div>
                      <div class="msg-titles">
                        <div class="msg-name">Tender Mercy — ${targetName} Healed!</div>
                      </div>
                    </div>
                    <div class="enemy-msg-body">
                      <div style="color: #ccc; text-align: center; font-style: italic;">${flavor}</div>
                      <div class="roll-row" style="justify-content: center; margin-top: 6px;">
                        <div class="roll-dice"><div class="die heal">${mercyRoll.total}</div></div>
                        <span class="mech-tag heal"><i class="fas fa-heart"></i> +${healAmount} LP</span>
                        <span class="mech-tag"><i class="fas fa-droplet"></i> 1 LP</span>
                      </div>
                    </div>
                  </div>`
              });
              console.log(`%c[TENDER MERCY] ${mercyName} heals ${targetName} for ${healAmount} LP`, 'color: #FF69B4; font-weight: bold;');
            }

            // Release token so next click fires controlToken again
            canvas.tokens.releaseAll();
          };

          Hooks.on('controlToken', mercyClickHandler);
          const mercyEscHandler = (e) => {
            if (e.key === 'Escape') {
              Hooks.off('controlToken', mercyClickHandler);
              document.removeEventListener('keydown', mercyEscHandler);
              mercyBtn.classList.remove('ability-targeting');
              document.body.style.cursor = '';
              ui.notifications.info('Tender Mercy ended.');
            }
          };
          document.addEventListener('keydown', mercyEscHandler);
          return;
        }

        // === WHITE MAGIC (Witch) ===
        if (rule.name === 'White Magic') {
          const witchSpells = [
            { id: 'call-beast', name: 'Call Beast', icon: 'systems/conan/images/icons/call_beast_icon.png', cost: 'LP varies', desc: 'Summon a beast ally.' },
            { id: 'favor-four-winds', name: 'Favor of the Four Winds', icon: 'systems/conan/images/icons/favor_of_the_four_winds_icon.png', cost: '4 LP', desc: 'Target gains +3 bonus Move Actions.' }
          ];

          let pickerHtml = `<div style="font-family: 'Montserrat', system-ui, sans-serif; padding: 12px; background: linear-gradient(180deg, #1B1B20 0%, #0B0B0D 100%); color: #FFF;">`;
          pickerHtml += `<div style="font-size: 9px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.12em; color: rgba(255,255,255,0.5); margin-bottom: 10px;">${enemyData.name} — White Magic</div>`;
          pickerHtml += `<div style="display: flex; flex-direction: column; gap: 6px;">`;
          for (const sp of witchSpells) {
            pickerHtml += `<button type="button" class="witch-spell-pick" data-spell-id="${sp.id}" style="display: flex; align-items: center; gap: 10px; padding: 8px 10px; background: rgba(138,43,226,0.15); border: 1px solid rgba(138,43,226,0.4); border-radius: 4px; cursor: pointer; color: #FFF; text-align: left;">`;
            pickerHtml += `<img src="${sp.icon}" style="width: 36px; height: 36px; filter: drop-shadow(0 0 4px rgba(138,43,226,0.6));">`;
            pickerHtml += `<div><div style="font-weight: 700;">${sp.name}</div><div style="font-size: 11px; color: rgba(255,255,255,0.6);">${sp.desc} <span style="color: #ff8888;">(${sp.cost})</span></div></div>`;
            pickerHtml += `</button>`;
          }
          pickerHtml += `</div></div>`;

          const pickedSpell = await new Promise((resolve) => {
            const d = new Dialog({
              title: `${enemyData.name} — Choose Spell`,
              content: pickerHtml,
              buttons: { cancel: { label: 'Cancel', callback: () => resolve(null) } },
              default: 'cancel',
              render: (html) => {
                html.find('.witch-spell-pick').on('click', function() {
                  resolve(this.dataset.spellId);
                  d.close();
                });
              },
              close: () => resolve(null)
            }, { width: 340 });
            d.render(true);
          });

          if (!pickedSpell) return;

          // === CALL BEAST (enemy version — no LP cost, draggable summon badge) ===
          if (pickedSpell === 'call-beast') {
            const CALL_BEASTS = [
              { id: 'wild-dog', name: 'Wild Dog', category: 'beasts', group: 'wild-animals' },
              { id: 'hyena', name: 'Hyena', category: 'beasts', group: 'wild-animals' },
              { id: 'wolf', name: 'Wolf', category: 'beasts', group: 'wild-animals' },
              { id: 'giant-serpent', name: 'Giant Serpent', category: 'beasts', group: 'giant-serpents' },
              { id: 'crocodile', name: 'Crocodile', category: 'beasts', group: 'wild-animals' },
              { id: 'lion', name: 'Lion', category: 'beasts', group: 'wild-animals' },
              { id: 'bear', name: 'Bear', category: 'beasts', group: 'wild-animals' }
            ];

            let beastHtml = `<div style="font-family: 'Montserrat', system-ui, sans-serif; padding: 8px; background: linear-gradient(180deg, #1B1B20 0%, #0B0B0D 100%); color: #FFF;">`;
            for (const beast of CALL_BEASTS) {
              beastHtml += `<button type="button" class="enemy-beast-pick" data-beast-id="${beast.id}" style="display: flex; justify-content: space-between; width: 100%; padding: 8px 12px; margin-bottom: 4px; background: rgba(50,80,50,0.3); border: 1px solid #4a6a4a; border-radius: 4px; color: #ccc; cursor: pointer;">`;
              beastHtml += `<span>${beast.name}</span></button>`;
            }
            beastHtml += `</div>`;

            const selectedBeast = await new Promise((resolve) => {
              const d = new Dialog({
                title: `${enemyData.name} — Call Beast`,
                content: beastHtml,
                buttons: { cancel: { label: 'Cancel', callback: () => resolve(null) } },
                default: 'cancel',
                render: (html) => {
                  html.find('.enemy-beast-pick').on('click', function() {
                    resolve(CALL_BEASTS.find(b => b.id === this.dataset.beastId));
                    d.close();
                  });
                },
                close: () => resolve(null)
              }, { width: 300 });
              d.render(true);
            });

            if (!selectedBeast) return;

            // Trait checks
            const isBeastmaster = enemyData.threatTraits?.includes('beastmaster');
            const hasFeralBond = enemyData.threatTraits?.includes('feralbond');
            const summonCount = isBeastmaster ? 2 : 1;

            // Build draggable summon chat card
            const witchName = enemyData.chatName || enemyData.name;
            const portraitSrc = enemyData.portraitImg || enemyData.tokenImg || 'icons/svg/mystery-man.svg';
            const summonPayload = {
              enemyId: selectedBeast.id,
              category: selectedBeast.category,
              group: selectedBeast.group,
              casterName: witchName
            };
            if (hasFeralBond) summonPayload.feralBond = true;
            const summonData = JSON.stringify(summonPayload).replace(/"/g, '&quot;');

            const CALL_FLAVOR = [
              `${witchName} whispers words of binding — something stirs in the wilderness!`,
              `${witchName}'s eyes glow as an ancient pact is invoked!`,
              `A guttural chant rises from ${witchName}'s throat — nature answers the call!`,
            ];

            // Build summon badges (1 or 2 depending on Beastmaster)
            let badgeHtml = '';
            for (let i = 0; i < summonCount; i++) {
              badgeHtml += `<img src="systems/conan/images/icons/call_beast_icon.png" class="spell-summon-badge" alt="Call Beast" data-summon="${summonData}" title="Drag onto the map to place ${selectedBeast.name} #${i + 1}" style="width: 48px; height: 48px; cursor: grab; border: 2px solid #4a6a4a; border-radius: 8px; background: #1a2a1a; margin: 0 4px;"/>`;
            }

            let traitNotes = '';
            if (isBeastmaster) traitNotes += `<div style="color: #FFD700; text-align: center; font-size: 0.85em;">Beastmaster — two beasts answer the call!</div>`;
            if (hasFeralBond) traitNotes += `<div style="color: #ff6b6b; text-align: center; font-size: 0.85em;">Feral Bond — +2 Attack, +2 Damage!</div>`;

            await ChatMessage.create({
              speaker: { alias: enemyData.name },
              content: `
                <div class="enemy-msg theme-human">
                  <div class="enemy-msg-header">
                    <div class="msg-icon"><img src="${portraitSrc}" style="width:32px; height:32px; border-radius:50%; object-fit:cover;"/></div>
                    <div class="msg-titles">
                      <div class="msg-name">Call Beast — ${selectedBeast.name}${isBeastmaster ? ' ×2' : ''}!</div>
                    </div>
                  </div>
                  <div class="enemy-msg-body">
                    <div style="color: #ccc; text-align: center; font-style: italic;">${CALL_FLAVOR[Math.floor(Math.random() * CALL_FLAVOR.length)]}</div>
                    <div style="text-align: center; margin-top: 8px;">${badgeHtml}</div>
                    ${traitNotes}
                    <div style="color: #2d6b2d; text-align: center; margin-top: 4px; font-weight: bold;">Drag the icon${isBeastmaster ? 's' : ''} onto the map to summon.</div>
                  </div>
                </div>`,
              flags: { conan: { enemySpellCast: {
                enemyName: enemyData.name,
                abilityName: 'Call Beast',
                tokenId: token?.id || null,
                enemyWits: enemyData.stats?.wits?.value ?? 0,
                enemyWitsDie: enemyData.stats?.wits?.die || 'D6'
              }}}
            });

            console.log(`%c[CALL BEAST] ${witchName} summons ${summonCount}× ${selectedBeast.name}${hasFeralBond ? ' (Feral Bond)' : ''}`, 'color: #7fff7f; font-weight: bold;');
            return;
          }

          // === FAVOR OF THE FOUR WINDS (enemy version) ===
          if (pickedSpell === 'favor-four-winds') {
            const lpCost = 4;
            const maxLP = enemyData.lifePoints || 0;
            // DUAL LP: Read from synthetic actor first (token bar source), fall back to currentHP flag (card source)
            const sceneTokenFW = isPlaced ? game.scenes.active?.tokens.get(token.id) : null;
            const currentLP = sceneTokenFW?.actor?.system?.lifePoints?.value ?? (isPlaced ? (token.getFlag('conan', 'currentHP') ?? maxLP) : maxLP);
            if (currentLP <= lpCost) {
              ui.notifications.warn(`${enemyData.name} does not have enough LP to cast Favor of the Four Winds (${currentLP}/${maxLP}).`);
              return;
            }

            // DUAL LP WRITE: Must update BOTH places or token bar and enemy card get out of sync
            if (isPlaced && token) {
              const newLP = currentLP - lpCost;
              const sceneToken = game.scenes.active?.tokens.get(token.id);
              if (sceneToken) {
                await sceneToken.setFlag('conan', 'currentHP', newLP);
                if (sceneToken.actor) await sceneToken.actor.update({ 'system.lifePoints.value': newLP });
              }
            }

            // Post spell cast message with Counter Ward flag
            ChatMessage.create({
              speaker: { alias: enemyData.name },
              content: `
                <div class="conan-enemy-roll ability-use">
                  <div class="roll-header">${eName} — Favor of the Four Winds</div>
                  <div class="roll-section ability-desc">
                    ${enemyData.name} calls upon the Four Winds! Target gains <strong>+3 bonus Move Actions</strong> on their next Turn.
                    <div style="margin-top: 4px; color: #ff8888;">Cost: ${lpCost} LP</div>
                  </div>
                </div>`,
              flags: { conan: { enemySpellCast: {
                enemyName: enemyData.name,
                abilityName: 'Favor of the Four Winds',
                tokenId: token?.id || null,
                enemyWits: enemyData.stats?.wits?.value ?? 0,
                enemyWitsDie: enemyData.stats?.wits?.die || 'D6'
              }}}
            });
            return;
          }

          return; // spell picked but not handled (shouldn't happen)
        }

        // === MASTER OF THE DEAD (Necromancer — Raise Dead / Death Scream picker) ===
        if (rule.name === 'Master of the Dead') {
          const necroSpells = [
            { id: 'raise-dead', name: 'Raise Dead', icon: 'systems/conan/images/icons/raise_dead_icon.png', cost: 'No cost', desc: 'Raise 4 Skeleton Warriors to fight as your allies.' },
            { id: 'death-scream', name: 'Death Scream', icon: 'systems/conan/images/icons/death_scream_icon.png', cost: 'No cost', desc: 'Hits all who can hear — ignores AR.' }
          ];

          let pickerHtml = `<div style="font-family: 'Montserrat', system-ui, sans-serif; padding: 12px; background: linear-gradient(180deg, #1B1B20 0%, #0B0B0D 100%); color: #FFF;">`;
          pickerHtml += `<div style="font-size: 9px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.12em; color: rgba(255,255,255,0.5); margin-bottom: 10px;">${enemyData.name} — Master of the Dead</div>`;
          pickerHtml += `<div style="display: flex; flex-direction: column; gap: 6px;">`;
          for (const sp of necroSpells) {
            pickerHtml += `<button type="button" class="necro-spell-pick" data-spell-id="${sp.id}" style="display: flex; align-items: center; gap: 10px; padding: 8px 10px; background: rgba(100,200,100,0.1); border: 1px solid rgba(100,200,100,0.3); border-radius: 4px; cursor: pointer; color: #FFF; text-align: left;">`;
            pickerHtml += `<img src="${sp.icon}" style="width: 36px; height: 36px; filter: drop-shadow(0 0 4px rgba(100,200,100,0.6));">`;
            pickerHtml += `<div><div style="font-weight: 700;">${sp.name}</div><div style="font-size: 11px; color: rgba(255,255,255,0.6);">${sp.desc} <span style="color: #88cc88;">(${sp.cost})</span></div></div>`;
            pickerHtml += `</button>`;
          }
          pickerHtml += `</div></div>`;

          const pickedNecroSpell = await new Promise((resolve) => {
            const d = new Dialog({
              title: `${enemyData.name} — Choose Spell`,
              content: pickerHtml,
              buttons: { cancel: { label: 'Cancel', callback: () => resolve(null) } },
              default: 'cancel',
              render: (html) => {
                html.find('.necro-spell-pick').on('click', function() {
                  resolve(this.dataset.spellId);
                  d.close();
                });
              },
              close: () => resolve(null)
            }, { width: 340 });
            d.render(true);
          });

          if (!pickedNecroSpell) return;

          // === RAISE DEAD (enemy version — no LP cost, 4 draggable skeleton badges) ===
          if (pickedNecroSpell === 'raise-dead') {
            const necroName = enemyData.chatName || enemyData.name;
            const portraitSrc = enemyData.portraitImg || enemyData.tokenImg || 'icons/svg/mystery-man.svg';
            const castId = `raise-dead-${Date.now()}`;
            const summonPayload = {
              enemyId: 'skeleton-warrior',
              category: 'undead',
              group: 'skeletons',
              casterName: necroName,
              castId: castId,
              maxSummons: 4,
              commandDead: true,
              summonerTokenId: token?.id || null
            };
            const summonData = JSON.stringify(summonPayload).replace(/"/g, '&quot;');

            const RAISE_FLAVOR = [
              `${necroName} speaks words that should not be spoken — the ground splits and the dead claw upward!`,
              `${necroName}'s eyes burn with eldritch light as skeletal hands burst from the earth!`,
              `A terrible chant echoes across the battlefield — the dead answer ${necroName}'s call!`,
            ];

            const badgeHtml = `<img src="systems/conan/images/icons/raise_dead_icon.png" class="spell-summon-badge" alt="Raise Dead" data-summon="${summonData}" title="Drag onto the map to place Skeleton Warriors (×4)" style="width: 48px; height: 48px; cursor: grab; border: 2px solid #4a6a4a; border-radius: 8px; background: #1a2a1a;"/>`;

            await ChatMessage.create({
              speaker: { alias: enemyData.name },
              content: `
                <div class="enemy-msg theme-human">
                  <div class="enemy-msg-header">
                    <div class="msg-icon"><img src="${portraitSrc}" style="width:32px; height:32px; border-radius:50%; object-fit:cover;"/></div>
                    <div class="msg-titles">
                      <div class="msg-name">Raise Dead — 4 Skeleton Warriors!</div>
                    </div>
                  </div>
                  <div class="enemy-msg-body">
                    <div style="color: #ccc; text-align: center; font-style: italic;">${RAISE_FLAVOR[Math.floor(Math.random() * RAISE_FLAVOR.length)]}</div>
                    <div style="text-align: center; margin-top: 8px;">${badgeHtml}</div>
                    <div style="color: #2d6b2d; text-align: center; margin-top: 4px; font-weight: bold;">Drag onto the map to summon (×4).</div>
                  </div>
                </div>`,
              flags: { conan: { enemySpellCast: {
                enemyName: enemyData.name,
                abilityName: 'Raise Dead',
                tokenId: token?.id || null,
                enemyWits: enemyData.stats?.wits?.value ?? 0,
                enemyWitsDie: enemyData.stats?.wits?.die || 'D6'
              }}}
            });

            console.log(`%c[RAISE DEAD] ${necroName} summons 4× Skeleton Warrior`, 'color: #7fff7f; font-weight: bold;');
            return;
          }

          // === DEATH SCREAM (enemy version — single use, roll damage, ignores AR) ===
          if (pickedNecroSpell === 'death-scream') {
            const necroName = enemyData.chatName || enemyData.name;
            const witsDie = enemyData.stats?.wits?.die || 'D10';
            const dmgRoll = await new Roll(`1${witsDie}+2`).evaluate();
            const dmgTotal = dmgRoll.total;

            game.conan = game.conan || {};
            game.conan.lastDamageRoll = dmgTotal;
            game.conan.lastDamageEffect = { type: 'death-scream', ignoresAR: true };

            const portraitSrc = enemyData.portraitImg || enemyData.tokenImg || 'icons/svg/mystery-man.svg';
            await ChatMessage.create({
              speaker: { alias: enemyData.name },
              content: `
                <div class="enemy-msg theme-human">
                  <div class="enemy-msg-header">
                    <div class="msg-icon"><img src="${portraitSrc}" style="width:32px; height:32px; border-radius:50%; object-fit:cover;"/></div>
                    <div class="msg-titles">
                      <div class="msg-name">Death Scream!</div>
                    </div>
                  </div>
                  <div class="enemy-msg-body">
                    <div style="color: #ccc; text-align: center; font-style: italic;">${necroName} unleashes a soul-rending shriek that tears at the living!</div>
                    <div class="roll-section damage"><div class="roll-result">= ${dmgTotal}</div></div>
                    <div style="color: #ff6b6b; text-align: center; font-size: 0.85em;">Ignores AR — Shift+click targets to apply.</div>
                  </div>
                </div>`,
              flags: { conan: { enemySpellCast: {
                enemyName: enemyData.name,
                abilityName: 'Death Scream',
                tokenId: token?.id || null,
                enemyWits: enemyData.stats?.wits?.value ?? 0,
                enemyWitsDie: witsDie
              }}}
            });
            console.log(`%c[DEATH SCREAM] ${necroName} — ${dmgTotal} damage (1${witsDie}+2, ignores AR)`, 'color: #ff4444; font-weight: bold;');
            return;
          }

          return;
        }

        // === DEMONIC DARKNESS (Summoner — Demonic Ward / Hellfire / Summon Fiend picker) ===
        if (rule.name === 'Demonic Darkness') {
          const summonerSpells = [
            { id: 'demonic-ward', name: 'Demonic Ward', icon: 'systems/conan/images/icons/demonic_ward_icon.png', cost: 'No cost', desc: 'Halve all non-sorcery damage.' },
            { id: 'hellfire', name: 'Hellfire', icon: 'systems/conan/images/icons/hellfire_icon.png', cost: 'No cost', desc: 'Ranged sorcery attack.' },
            { id: 'summon-fiend', name: 'Summon Fiend', icon: 'systems/conan/images/icons/summon_fiend_icon.png', cost: 'No cost', desc: 'Summon a demon to the battlefield.' }
          ];

          let pickerHtml = `<div style="font-family: 'Montserrat', system-ui, sans-serif; padding: 12px; background: linear-gradient(180deg, #1B1B20 0%, #0B0B0D 100%); color: #FFF;">`;
          pickerHtml += `<div style="font-size: 9px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.12em; color: rgba(255,255,255,0.5); margin-bottom: 10px;">${enemyData.name} — Demonic Darkness</div>`;
          pickerHtml += `<div style="display: flex; flex-direction: column; gap: 6px;">`;
          for (const sp of summonerSpells) {
            pickerHtml += `<button type="button" class="summoner-spell-pick" data-spell-id="${sp.id}" style="display: flex; align-items: center; gap: 10px; padding: 8px 10px; background: rgba(200,60,60,0.15); border: 1px solid rgba(200,60,60,0.4); border-radius: 4px; cursor: pointer; color: #FFF; text-align: left;">`;
            pickerHtml += `<img src="${sp.icon}" style="width: 36px; height: 36px; filter: drop-shadow(0 0 4px rgba(200,60,60,0.6));">`;
            pickerHtml += `<div><div style="font-weight: 700;">${sp.name}</div><div style="font-size: 11px; color: rgba(255,255,255,0.6);">${sp.desc} <span style="color: #ff8888;">(${sp.cost})</span></div></div>`;
            pickerHtml += `</button>`;
          }
          pickerHtml += `</div></div>`;

          const pickedSummonerSpell = await new Promise((resolve) => {
            const d = new Dialog({
              title: `${enemyData.name} — Choose Spell`,
              content: pickerHtml,
              buttons: { cancel: { label: 'Cancel', callback: () => resolve(null) } },
              default: 'cancel',
              render: (html) => {
                html.find('.summoner-spell-pick').on('click', function() {
                  resolve(this.dataset.spellId);
                  d.close();
                });
              },
              close: () => resolve(null)
            }, { width: 340 });
            d.render(true);
          });

          if (!pickedSummonerSpell) return;

          // === DEMONIC WARD (enemy version — toggle 50% non-sorcery damage reduction) ===
          if (pickedSummonerSpell === 'demonic-ward') {
            if (!isPlaced || !token) return;
            const wardActive = token.actor?.getFlag('conan', 'demonicWard');
            const summonerName = enemyData.chatName || enemyData.name;

            if (wardActive) {
              // Dismiss ward
              await token.actor.setFlag('conan', 'demonicWard', false);
              ChatMessage.create({
                content: `<div class="enemy-msg theme-human"><div class="enemy-msg-header"><div class="msg-icon"><i class="fas fa-shield-alt"></i></div><div class="msg-titles"><div class="msg-name">Demonic Ward Dismissed</div></div></div><div class="enemy-msg-body"><div class="enemy-msg-flavor">${summonerName}'s ward sigils fade into nothing.</div></div></div>`,
                speaker: { alias: enemyData.name }
              });
            } else {
              // Activate ward
              await token.actor.setFlag('conan', 'demonicWard', true);
              ChatMessage.create({
                content: `<div class="enemy-msg theme-human"><div class="enemy-msg-header"><div class="msg-icon"><i class="fas fa-shield-alt"></i></div><div class="msg-titles"><div class="msg-name">Demonic Ward!</div></div></div><div class="enemy-msg-body"><div class="enemy-msg-flavor">Dark sigils burn across ${summonerName}'s skin — non-sorcery damage halved!</div></div></div>`,
                speaker: { alias: enemyData.name }
              });
            }
            return;
          }

          // === HELLFIRE (enemy version — sorcery attack roll, Wits die + Wits value) ===
          if (pickedSummonerSpell === 'hellfire') {
            const summonerName = enemyData.chatName || enemyData.name;
            const hasDamnation = enemyData.threatTraits?.includes('damnation');
            const hasInferno = enemyData.threatTraits?.includes('inferno');

            // Attack roll: WitsDie + Wits value
            const witsValue = enemyData.stats?.wits?.value ?? 0;
            const witsDie = enemyData.stats?.wits?.die || 'D10';
            const atkRoll = await new Roll(`1${witsDie.toLowerCase()}`).evaluate();
            const atkTotal = atkRoll.total + witsValue;

            // Damage: base 10 (or 15 with Damnation)
            const baseDmg = hasDamnation ? 15 : 10;
            const totalDmg = baseDmg;

            // Modifiers
            let atkModifiers = '';
            if (hasDamnation) atkModifiers += `<div class="msg-modifier">Damnation: Hellfire burns hotter — 15 damage!</div>`;
            if (hasInferno) atkModifiers += `<div class="msg-modifier">Inferno: Target catches fire on hit!</div>`;

            // Build damage display
            let dmgBonuses = '';
            if (hasDamnation) dmgBonuses += `<span class="roll-plus">+</span><span class="roll-value">5</span>`;

            const messageContent = msgCard('fire', 'Hellfire — Sorcery Attack', `
                ${atkModifiers}
                <div class="roll-row">
                  <div class="roll-dice"><div class="die stat">${atkRoll.total}</div></div>
                  <span class="roll-plus">+</span>
                  <span class="roll-value">Wits ${witsValue}</span>
                  <div class="roll-total">${atkTotal}</div>
                </div>
                <div class="roll-row">
                  <div class="roll-dice"><div class="die dmg">10</div></div>
                  ${dmgBonuses}
                  <div class="roll-total">${totalDmg}</div>
                </div>
            `);

            game.conan = game.conan || {};
            game.conan.lastDamageRoll = totalDmg;
            game.conan.lastDamageEffect = { type: 'inferno', inferno: hasInferno };

            await ChatMessage.create({
              speaker: { alias: enemyData.name },
              content: messageContent,
              rolls: [atkRoll],
              flags: { conan: { enemySpellCast: {
                enemyName: enemyData.name,
                abilityName: 'Hellfire',
                tokenId: token?.id || null,
                enemyWits: witsValue,
                enemyWitsDie: witsDie
              }}}
            });
            console.log(`%c[HELLFIRE] ${summonerName} — Atk ${atkTotal} (${atkRoll.total}+${witsValue}), Dmg ${totalDmg}${hasDamnation ? ' (Damnation)' : ''}${hasInferno ? ' (Inferno)' : ''}`, 'color: #ff4444; font-weight: bold;');
            return;
          }

          // === SUMMON FIEND (enemy version — drag-to-canvas fiend) ===
          if (pickedSummonerSpell === 'summon-fiend') {
            const summonerName = enemyData.chatName || enemyData.name;
            const portraitSrc = enemyData.portraitImg || enemyData.tokenImg || 'icons/svg/mystery-man.svg';
            const summonPayload = {
              enemyId: 'fiend',
              category: 'demons',
              group: 'lesser-demons',
              casterName: summonerName
            };
            const summonData = JSON.stringify(summonPayload).replace(/"/g, '&quot;');

            const FIEND_FLAVOR = [
              `${summonerName} tears a rift between worlds — a Fiend claws its way through!`,
              `Dark sigils burn in the air as ${summonerName} summons a servant from the pit!`,
              `The air splits with a howl — a Fiend answers ${summonerName}'s call!`,
            ];

            const badgeHtml = `<img src="systems/conan/images/icons/summon_fiend_icon.png" class="spell-summon-badge" alt="Summon Fiend" data-summon="${summonData}" title="Drag onto the map to place a Fiend" style="width: 48px; height: 48px; cursor: grab; border: 2px solid #8b2020; border-radius: 8px; background: #1a0a0a;"/>`;

            await ChatMessage.create({
              speaker: { alias: enemyData.name },
              content: `
                <div class="enemy-msg theme-human">
                  <div class="enemy-msg-header">
                    <div class="msg-icon"><img src="${portraitSrc}" style="width:32px; height:32px; border-radius:50%; object-fit:cover;"/></div>
                    <div class="msg-titles">
                      <div class="msg-name">Summon Fiend!</div>
                    </div>
                  </div>
                  <div class="enemy-msg-body">
                    <div style="color: #ccc; text-align: center; font-style: italic;">${FIEND_FLAVOR[Math.floor(Math.random() * FIEND_FLAVOR.length)]}</div>
                    <div style="text-align: center; margin-top: 8px;">${badgeHtml}</div>
                    <div style="color: #2d6b2d; text-align: center; margin-top: 4px; font-weight: bold;">Drag onto the map to summon.</div>
                  </div>
                </div>`,
              flags: { conan: { enemySpellCast: {
                enemyName: enemyData.name,
                abilityName: 'Summon Fiend',
                tokenId: token?.id || null,
                enemyWits: enemyData.stats?.wits?.value ?? 0,
                enemyWitsDie: enemyData.stats?.wits?.die || 'D10'
              }}}
            });
            console.log(`%c[SUMMON FIEND] ${summonerName} summons a Fiend`, 'color: #ff4444; font-weight: bold;');
            return;
          }

          return;
        }

        // === BLOOD SACRIFICE (Cultist Minions) ===
        if (rule.name === 'Blood Sacrifice' && isPlaced && token) {
          const sacName = enemyData.chatName || enemyData.name;
          const healRoll = await new Roll('1d6').evaluate();
          const healAmount = healRoll.total;

          // Find ALL demon tokens on scene
          const demonTokens = canvas.tokens.placeables.filter(t => {
            const tEnemy = t.document?.getFlag('conan', 'enemyData');
            return tEnemy && tEnemy.category === 'demons' && !t.document?.getFlag('conan', 'dead');
          });

          // Heal each demon
          const healedNames = [];
          for (const dt of demonTokens) {
            const dtEnemy = dt.document.getFlag('conan', 'enemyData');
            const maxLP = dtEnemy?.lifePoints || 0;
            if (maxLP <= 0) continue; // Minion demons don't have LP
            const sceneToken = game.scenes.active?.tokens.get(dt.document.id);
            const currentLP = sceneToken?.actor?.system?.lifePoints?.value ?? (dt.document.getFlag('conan', 'currentHP') ?? maxLP);
            const newLP = Math.min(maxLP, currentLP + healAmount);
            // DUAL LP WRITE
            if (sceneToken?.actor) {
              await sceneToken.actor.update({ 'system.lifePoints.value': newLP });
            }
            await dt.document.setFlag('conan', 'currentHP', newLP);
            if (typeof window.broadcastFloatingDamage === 'function') window.broadcastFloatingDamage(dt.id, healAmount, false, false, true);
            healedNames.push(dtEnemy.name);
          }

          // Kill the cultist (set HP to 0)
          const sceneTokenSac = game.scenes.active?.tokens.get(token.id);
          if (sceneTokenSac?.actor) {
            await sceneTokenSac.actor.update({ 'system.lifePoints.value': 0 });
          }
          await token.setFlag('conan', 'currentHP', 0);
          await token.setFlag('conan', 'dead', true);

          const SAC_FLAVOR = [
            `${sacName} plunges the ritual blade into their own heart — dark energy surges outward!`,
            `With a whispered prayer to forgotten gods, ${sacName} offers their life force to the darkness!`,
            `${sacName}'s eyes roll back as the blood sacrifice is complete — power flows to the demons!`,
          ];

          const demonNote = demonTokens.length > 0
            ? `<div style="color: #32CD32; text-align: center; margin-top: 4px; font-weight: bold;">All demons heal ${healAmount} LP! (${healedNames.join(', ')})</div>`
            : `<div style="color: #888; text-align: center; margin-top: 4px;">No demons on the field — the sacrifice is wasted.</div>`;

          ChatMessage.create({
            speaker: { alias: enemyData.name },
            content: `
              <div class="enemy-msg theme-human">
                <div class="enemy-msg-header">
                  <div class="msg-icon"><i class="fas fa-droplet"></i></div>
                  <div class="msg-titles">
                    <div class="msg-name">Blood Sacrifice!</div>
                  </div>
                </div>
                <div class="enemy-msg-body">
                  <div style="color: #ccc; text-align: center; font-style: italic;">${SAC_FLAVOR[Math.floor(Math.random() * SAC_FLAVOR.length)]}</div>
                  <div class="roll-row" style="justify-content: center; margin-top: 6px;">
                    <div class="roll-dice"><div class="die dmg">${healRoll.total}</div></div>
                    <div class="roll-total" style="color: #32CD32;">Heals ${healAmount} LP</div>
                  </div>
                  ${demonNote}
                </div>
              </div>`,
            rolls: [healRoll]
          });

          console.log(`%c[BLOOD SACRIFICE] ${sacName} sacrificed! ${demonTokens.length} demons healed for ${healAmount}`, 'color: #C43C3C; font-weight: bold;');
          return;
        }

        // === SUMMON FIEND (High Priest — requires Dedicated Servant trait) ===
        if (rule.name === 'Summon Fiend' && isPlaced && token && enemyData.threatTraits?.includes('dedicated')) {
          const priestName = enemyData.chatName || enemyData.name;

          // Roll demon type: 1-4 = Fiend, 5-6 = Horror
          const demonRoll = await new Roll('1d6').evaluate();
          const demonType = demonRoll.total <= 4 ? 'fiend' : 'horror';
          const demonName = demonType === 'fiend' ? 'Fiend' : 'Horror';

          const SUMMON_FLAVOR = [
            `${priestName} chants in a tongue older than civilization — the air tears open!`,
            `Dark syllables pour from ${priestName}'s lips as reality splits apart!`,
            `${priestName}'s eyes blaze with eldritch fire as they reach beyond the veil!`,
          ];

          ChatMessage.create({
            speaker: { alias: enemyData.name },
            content: `
              <div class="enemy-msg theme-demons">
                <div class="enemy-msg-header">
                  <div class="msg-icon"><i class="fas fa-circle-radiation"></i></div>
                  <div class="msg-titles">
                    <div class="msg-name">Summon ${demonName}!</div>
                  </div>
                </div>
                <div class="enemy-msg-body">
                  <div style="color: #ccc; text-align: center; font-style: italic;">${SUMMON_FLAVOR[Math.floor(Math.random() * SUMMON_FLAVOR.length)]}</div>
                  <div class="roll-row" style="justify-content: center; margin-top: 6px;">
                    <div class="roll-dice"><div class="die stat">${demonRoll.total}</div></div>
                    <div class="roll-total" style="color: #FF6B4A;">${demonName} (${demonRoll.total <= 4 ? '1-4' : '5-6'})</div>
                  </div>
                  <div style="color: #FF6B4A; text-align: center; margin-top: 4px; font-weight: bold;">Click the map to place the ${demonName}.</div>
                </div>
              </div>`,
            rolls: [demonRoll]
          });

          ui.notifications.info(`SUMMON FIEND: Click the map to place a ${demonName}.`);
          document.body.style.cursor = 'crosshair';

          const summonClickHandler = async (event) => {
            const local = event.getLocalPosition(canvas.stage);
            await window.spawnDemonAtPosition(local.x, local.y, demonType);
            document.body.style.cursor = '';
            canvas.stage.off('pointerdown', summonClickHandler);
            ui.notifications.info(`${demonName} placed! Assign 1 damage to a cultist as sacrifice.`);

            // Load 1 damage for GM to apply as sacrifice cost
            game.conan = game.conan || {};
            game.conan.lastDamageRoll = 1;
            game.conan.lastDamageEffect = null;
            game.conan.lastEnemyAttack = null;

            ChatMessage.create({
              speaker: { alias: enemyData.name },
              content: `
                <div class="enemy-msg theme-human">
                  <div class="enemy-msg-header">
                    <div class="msg-icon"><i class="fas fa-droplet"></i></div>
                    <div class="msg-titles">
                      <div class="msg-name">Ritual Sacrifice Required</div>
                    </div>
                  </div>
                  <div class="enemy-msg-body">
                    <div style="color: #ff8888; text-align: center;">The ritual demands blood — shift+click a cultist to wound them as sacrifice.</div>
                    <div class="roll-row" style="justify-content: center; margin-top: 6px;">
                      <div class="roll-total" style="color: #ff4444;">1 damage loaded</div>
                    </div>
                  </div>
                </div>`
            });
          };

          canvas.stage.on('pointerdown', summonClickHandler);
          return;
        }

        // === BELLOW FOR BLOOD (Barbarian Chieftain) ===
        if (rule.name === 'Bellow for Blood' && isPlaced && token) {
          const bellowUsed = token.getFlag('conan', 'bellowUsed');
          if (bellowUsed) {
            ui.notifications.warn('Bellow for Blood has already been used this combat!');
            return;
          }

          await token.setFlag('conan', 'bellowUsed', true);
          const bellowName = enemyData.chatName || enemyData.name;
          const BARB_IDS_BELLOW = ['barbarian-youth', 'barbarian', 'barbarian-chieftain'];

          // Find ALL living barbarian tokens on scene (including self)
          const barbTokens = canvas.tokens.placeables.filter(t => {
            const tEnemy = t.document?.getFlag('conan', 'enemyData');
            return tEnemy && BARB_IDS_BELLOW.includes(tEnemy.id) && !t.document?.getFlag('conan', 'dead');
          });

          // Apply +1 damage buff to all barbarians
          for (const bt of barbTokens) {
            await bt.actor?.setFlag('conan', 'bellowBuff', { active: true });
          }

          // Roar healing: chieftain has Roar → heal ALL barbarians
          const hasRoar = enemyData.threatTraits?.includes('roar');
          const roarHealed = [];
          if (hasRoar) {
            for (const bt of barbTokens) {
              const btEnemy = bt.document?.getFlag('conan', 'enemyData');
              if (!btEnemy) continue;

              if (btEnemy.type === 'Minion') {
                // Heal 1 wound: reset wounded state
                const isWounded = bt.document?.getFlag('conan', 'wounded');
                if (isWounded) {
                  await bt.document.setFlag('conan', 'wounded', false);
                  await bt.document.update({ 'texture.tint': null });
                  roarHealed.push(btEnemy.chatName || btEnemy.name);
                  if (typeof window.broadcastFloatingDamage === 'function') {
                    window.broadcastFloatingDamage(bt.id, 1, false, false, true);
                  }
                }
              } else if (btEnemy.type === 'Antagonist') {
                // Heal 8 LP — DUAL LP WRITE
                const currentHP = bt.actor?.system?.lifePoints?.value ?? 0;
                const maxHP = btEnemy.lifePoints || bt.actor?.system?.lifePoints?.max || 50;
                const newHP = Math.min(maxHP, currentHP + 8);
                if (newHP > currentHP) {
                  await bt.actor.update({ 'system.lifePoints.value': newHP });
                  const flagData = bt.document.getFlag('conan', 'enemyData');
                  if (flagData) {
                    await bt.document.setFlag('conan', 'currentHP', newHP);
                  }
                  roarHealed.push(`${btEnemy.chatName || btEnemy.name} (+${newHP - currentHP} LP)`);
                  if (typeof window.broadcastFloatingDamage === 'function') {
                    window.broadcastFloatingDamage(bt.id, newHP - currentHP, false, false, true);
                  }
                }
              }
            }
          }

          const roarLine = roarHealed.length > 0
            ? `<div style="color: #32CD32; text-align: center; margin-top: 4px;">Roar heals: ${roarHealed.join(', ')}</div>`
            : '';

          const BELLOW_FLAVOR = [
            `${bellowName} throws back their head and BELLOWS — the warband erupts in fury!`,
            `${bellowName}'s war cry shakes the very earth — every barbarian roars in answer!`,
            `Blood and rage — ${bellowName}'s bellow sends the warband into a killing frenzy!`,
          ];

          ChatMessage.create({
            speaker: { alias: enemyData.name },
            content: `
              <div class="enemy-msg theme-human">
                <div class="enemy-msg-header">
                  <div class="msg-icon"><i class="fas fa-bullhorn"></i></div>
                  <div class="msg-titles">
                    <div class="msg-name">Bellow for Blood!</div>
                  </div>
                </div>
                <div class="enemy-msg-body">
                  <div style="color: #ccc; text-align: center; font-style: italic;">${BELLOW_FLAVOR[Math.floor(Math.random() * BELLOW_FLAVOR.length)]}</div>
                  <div style="color: #FFD700; text-align: center; margin-top: 4px; font-weight: bold;">All barbarians gain +1 damage for the rest of combat!</div>
                  ${roarLine}
                </div>
              </div>`
          });

          // Update button state
          const btn = ev.currentTarget;
          btn.classList.remove('bellow-btn');
          btn.classList.add('ability-spent');

          console.log(`%c[BELLOW] ${bellowName} bellows — ${barbTokens.length} barbarians buffed`, 'color: #FFD700; font-weight: bold;');
          return;
        }

        // === DEFAULT: Generic ability - just send chat message ===
        const messageContent = `
          <div class="conan-enemy-roll ability-use">
            <div class="roll-header">${eName} — ${rule.name}</div>
            <div class="roll-section ability-desc">
              ${rule.description}
            </div>
          </div>
        `;

        ChatMessage.create({
          speaker: { alias: enemyData.name },
          content: messageContent,
          flags: { conan: { enemySpellCast: {
            enemyName: enemyData.name,
            abilityName: rule.name,
            tokenId: token?.id || null,
            enemyWits: enemyData.stats?.wits?.value ?? 0,
            enemyWitsDie: enemyData.stats?.wits?.die || 'D6'
          }}}
        });
      });

      // Active effect dismiss button (right side of portrait) - removes one Protect stack per click
      html.find('.active-effect-btn').click(async (ev) => {
        const btn = ev.currentTarget;
        const effectType = btn.dataset.effect;

        if (effectType === 'protect' && isPlaced && token?.actor) {
          if (_protectDismissing) return;
          _protectDismissing = true;
          try {
            const targetActor = token.actor;
            const targetTokenDoc = token;

            // Remove the most recent guard (last source)
            const protectData = targetActor.getFlag('conan', 'protectBonus') || { total: 0, sources: [] };
            if (protectData.sources.length === 0) return;

            const removedGuardId = protectData.sources.pop();
            const removedAmount = protectData.amounts?.pop() || 1;
            protectData.total = Math.max(0, protectData.total - removedAmount);

            // Update or clear the flag
            if (protectData.total <= 0) {
              await targetActor.unsetFlag('conan', 'protectBonus');
            } else {
              await targetActor.setFlag('conan', 'protectBonus', protectData);
            }

            // Revert defense in token enemy data
            const targetEnemyFlag = targetTokenDoc.getFlag('conan', 'enemyData');
            if (targetEnemyFlag) {
              const currentPhysDef = parseInt(targetEnemyFlag.physicalDefense) || 0;
              await targetTokenDoc.setFlag('conan', 'enemyData', {
                ...targetEnemyFlag,
                physicalDefense: Math.max(0, currentPhysDef - removedAmount)
              });
            }

            // Free the source guard to use Protect again
            const guardTokenDoc = game.scenes.active?.tokens.get(removedGuardId);
            if (guardTokenDoc) {
              await guardTokenDoc.setFlag('conan', 'protectUsed', false);
              await guardTokenDoc.unsetFlag('conan', 'protectTarget');
            }
            const guardName = guardTokenDoc?.name || 'Guard';

            // Update or remove the button from the DOM
            if (protectData.total <= 0) {
              btn.remove();
              // Remove green from defense
              findPhysDefEl().removeClass('protect-boosted tide-debuffed defense-contested');
            } else {
              // Decrement the count badge
              btn.querySelector('.effect-count').textContent = protectData.total;
              // Update tooltip
              const guardNames = protectData.sources.map(id => {
                const gt = game.scenes.active?.tokens.get(id);
                return gt?.name || 'Guard';
              }).join(', ');
              btn.title = `Protected by: ${guardNames} (+${protectData.total} Phys Def) - Click to remove one`;
            }

            // Chat message
            ChatMessage.create({
              speaker: { alias: 'GM' },
              content: `
                <div class="conan-enemy-roll ability-use">
                  <div class="roll-header">Protect Dismissed</div>
                  <div class="roll-section ability-desc">
                    <strong>${guardName}</strong> stops Protecting <strong>${targetActor.name}</strong>.<br>
                    ${targetActor.name} loses <strong>-${removedAmount} Physical Defense</strong>${protectData.total > 0 ? ` (Protect bonus: +${protectData.total}/3)` : ' (Protect bonus removed)'}.
                  </div>
                </div>
              `
            });
          } finally {
            _protectDismissing = false;
          }
        }

        // Inspire dismiss from target card
        if (effectType === 'inspire' && isPlaced && token?.actor) {
          const sourceTokenId = btn.dataset.sourceToken;
          const targetActor = token.actor;

          // Remove inspire buff from this target
          await targetActor.unsetFlag('conan', 'inspireBuff');

          // Remove this target from captain's inspireTargets
          const captainTokenDoc = game.scenes.active?.tokens.get(sourceTokenId);
          if (captainTokenDoc) {
            const targets = captainTokenDoc.getFlag('conan', 'inspireTargets') || [];
            const idx = targets.indexOf(token.id);
            if (idx > -1) {
              targets.splice(idx, 1);
              if (targets.length === 0) {
                // No more targets — set captain to spent
                await captainTokenDoc.setFlag('conan', 'inspireState', 'spent');
                await captainTokenDoc.unsetFlag('conan', 'inspireTargets');
              } else {
                await captainTokenDoc.setFlag('conan', 'inspireTargets', targets);
              }
            }
          }
          const captainName = captainTokenDoc?.name || 'Guard Captain';

          // Remove button from DOM
          btn.remove();

          ChatMessage.create({
            speaker: { alias: 'GM' },
            content: `<div class="conan-enemy-roll ability-use"><div class="roll-header">Inspire Removed</div><div class="roll-section ability-desc"><strong>${targetActor.name}</strong> is no longer Inspired by <strong>${captainName}</strong>. +1 Attack bonus removed.</div></div>`
          });
        }
      });

      // Beast Form dismiss button
      html.find('.beast-dismiss-btn').click(async (ev) => {
        if (!enemyData.isBeastForm || !isPlaced || !token) return;
        const ownerActor = game.actors.get(enemyData.ownerActorId);
        if (!ownerActor) return;

        const bfData = ownerActor.system.beastFormData;
        if (!bfData) return;

        const sceneToken = game.scenes.active?.tokens.get(token.id);
        if (!sceneToken) return;

        // Cap LP to original max if it exceeds it
        const originalMax = bfData.originalMaxLP || 0;
        const currentLP = ownerActor.system.lifePoints?.value || 0;
        const cappedLP = Math.min(currentLP, originalMax);

        // Restore actor state
        await ownerActor.update({
          'system.beastFormData': null,
          'system.lifePoints.maxOverride': null,
          'system.lifePoints.value': cappedLP,
          'system.buffsDebuffs.beastForm': false
        });

        // Restore token image + clear enemyData flag
        await sceneToken.update({
          'texture.src': bfData.originalTokenImg || ownerActor.img,
          'flags.conan.-=enemyData': null
        });

        // Post chat message
        ChatMessage.create({
          speaker: ChatMessage.getSpeaker({ actor: ownerActor }),
          content: `<div class="conan-enemy-roll ability-use"><div class="roll-header" style="color: #D4A017;">Beast Form Dismissed</div><div class="roll-section ability-desc"><strong>${ownerActor.name}</strong> reverts to human form.</div></div>`
        });

        ui.notifications.info(`${ownerActor.name} reverts to human form.`);

        // Close the dialog
        dialog.close();
      });

      // HP input change (for placed tokens)
      // DUAL LP WRITE: Enemy LP lives in TWO places that must stay in sync:
      //   1. token.flags.conan.currentHP — enemy card reads this for display
      //   2. actor.system.lifePoints.value — token bar reads this (bar1.attribute = 'lifePoints')
      // applyDamageToToken (conan.js) only writes to #2. This handler and spell cost handlers write to both.
      html.find('.hp-current').change(async (ev) => {
        const input = ev.currentTarget;
        const tokenId = input.dataset.tokenId;
        const newValue = parseInt(input.value) || 0;

        const sceneToken = game.scenes.active?.tokens.get(tokenId);
        if (sceneToken) {
          console.log(`%c[LP CARD INPUT] %c${enemyData.name}%c — Manual HP edit → ${newValue}`, 'color: #00bfff; font-weight: bold;', 'color: #fff; font-weight: bold;', 'color: #00bfff;');
          if (enemyData.isBeastForm) {
            // Beast form: linked token — only update actor LP (no currentHP flag)
            if (sceneToken.actor) await sceneToken.actor.update({ 'system.lifePoints.value': newValue });
            console.log(`%c  [LP WRITE] %cactor.lifePoints.value = ${newValue} (beast form, no currentHP flag)`, 'color: #ff9944;', 'color: #ffcc88;');
          } else {
            // DUAL LP WRITE: update both currentHP flag and actor LP
            await sceneToken.setFlag('conan', 'currentHP', newValue);
            if (sceneToken.actor) await sceneToken.actor.update({ 'system.lifePoints.value': newValue });
            console.log(`%c  [LP WRITE] %ccurrentHP flag = ${newValue} + actor.lifePoints.value = ${newValue}`, 'color: #ff9944;', 'color: #ffcc88;');
          }
          const hpType = enemyData.type === 'Minion' ? 'Threshold' : 'LP';
          ui.notifications.info(`${enemyData.name} ${hpType} updated to ${newValue}`);
        }
      });

      // Enter key on HP input triggers change (blur) instead of erroring
      html.find('.hp-current').keydown((ev) => {
        if (ev.key === 'Enter') {
          ev.preventDefault();
          ev.currentTarget.blur();
        }
      });
    },
    close: () => {
      // Clean up hooks when dialog closes
      if (updateHookId !== null) {
        Hooks.off('updateActor', updateHookId);
        updateHookId = null;
      }
      if (tokenUpdateHookId !== null) {
        Hooks.off('updateToken', tokenUpdateHookId);
        tokenUpdateHookId = null;
      }
      // Remove from open dialogs tracker
      _openEnemyDialogs.delete(dialogKey);
    }
  }, {
    classes: ["dialog", "conan-enemy-roll-dialog", ...(isNewCardLayout ? ["new-card-layout"] : [])],
    width: isNewCardLayout ? 323 : 550,
    height: isNewCardLayout ? 479 : 400,
    resizable: !isNewCardLayout
  });

  // Track this dialog to prevent duplicates
  _openEnemyDialogs.set(dialogKey, dialog);

  dialog.render(true);
}

// Make it globally accessible
window.showEnemyRollDialog = showEnemyRollDialog;

// ==========================================
// HORDE TRAIT — Spawn Pict Hunters on click
// ==========================================
// Called from conan.js when a Horde pict dies. Sets up click-to-place mode.
async function spawnHordePictAtPosition(x, y) {
  // Load pict-hunter base data from enemies.json
  const response = await fetch('systems/conan/data/enemies.json');
  if (!response.ok) return;
  const data = await response.json();
  const pictsGroup = data.categories?.human?.groups?.picts;
  const pictHunter = pictsGroup?.enemies?.find(e => e.id === 'pict-hunter');
  if (!pictHunter) {
    console.error('[HORDE] Could not find pict-hunter in enemies.json!');
    return;
  }

  // Deep clone and flatten (same as dropCanvasData does)
  let enemy = JSON.parse(JSON.stringify(pictHunter));
  enemy.category = 'human';
  enemy.group = 'picts';
  enemy.groupBackground = pictsGroup.backgroundImg || null;

  // Apply custom images from GM settings (same as _applyCustomEnemyImages does at drag time)
  const customImages = game.settings.get('conan', 'enemyCustomImages') || {};
  const imgKey = `human.picts.${enemy.id}`;
  if (customImages[imgKey]) {
    if (customImages[imgKey].portraitImg) enemy.portraitImg = customImages[imgKey].portraitImg;
    if (customImages[imgKey].tokenImg) enemy.tokenImg = customImages[imgKey].tokenImg;
  }

  // Flatten defenses (randomize)
  const pDef = enemy.defenses.physical;
  enemy.physicalDefense = pDef.min + Math.floor(Math.random() * (pDef.max - pDef.min + 1));
  const sDef = enemy.defenses.sorcery;
  enemy.sorceryDefense = sDef.min + Math.floor(Math.random() * (sDef.max - sDef.min + 1));

  // Threat pipeline — roll tier, select traits (EXCLUDE Horde)
  const traitPool = THREAT_TRAITS_PICTS.filter(t => t.id !== 'horde');
  let threatTier = rollThreatTier();
  let threatTraits = selectTraits(threatTier, traitPool);
  let threatArmoredLife = false;

  // Apply name from tier
  const nameMap = THREAT_NAME_MAP[enemy.id];
  if (nameMap && nameMap[threatTier]) {
    enemy = { ...enemy, name: nameMap[threatTier] };
  }

  // Spawn-time trait modifications (defensive — picts don't have armored/hard but future-proof)
  if (threatTraits.includes('defensive')) {
    enemy.physicalDefense = (enemy.physicalDefense || 0) + 1;
    enemy.sorceryDefense = (enemy.sorceryDefense || 0) + 1;
  }

  const portraitImg = enemy.portraitImg || enemy.tokenImg || 'icons/svg/mystery-man.svg';
  const tokenImg = enemy.tokenImg || 'icons/svg/mystery-man.svg';
  const chatNameData = pickPictName();
  const chatName = chatNameData?.name || null;
  const chatGender = chatNameData?.gender || null;

  const tokenDisplayName = threatTier > 0 ? `${'💀'.repeat(threatTier)} ${enemy.name}` : enemy.name;
  const actorData = {
    name: tokenDisplayName,
    type: 'npc2',
    img: portraitImg,
    system: {
      enemyType: enemy.type,
      stats: {
        might: { value: enemy.stats.might.value, die: enemy.stats.might.die },
        edge: { value: enemy.stats.edge.value, die: enemy.stats.edge.die },
        grit: { value: enemy.stats.grit.value, die: enemy.stats.grit.die },
        wits: { value: enemy.stats.wits.value, die: enemy.stats.wits.die }
      },
      defenses: { physical: enemy.physicalDefense, sorcery: enemy.sorceryDefense },
      threshold: enemy.threshold || null,
      lifePoints: null,
      ar: null,
      attacks: enemy.attacks || {},
      actions: enemy.actions || { perTurn: 2, attackLimit: 1 },
      rules: enemy.rules || [],
      isDefaultEnemy: true,
      sourceEnemyId: enemy.id
    }
  };

  const scene = canvas.scene;
  if (!scene) return;

  const actor = await Actor.create(actorData, { conanEnemySpawn: true });
  const dropPosition = canvas.grid.getSnappedPosition(x, y);

  await actor.update({
    'prototypeToken.actorLink': false,
    'prototypeToken.texture.src': tokenImg,
    'prototypeToken.disposition': CONST.TOKEN_DISPOSITIONS.HOSTILE,
    'prototypeToken.displayName': CONST.TOKEN_DISPLAY_MODES.ALWAYS,
    'prototypeToken.displayBars': CONST.TOKEN_DISPLAY_MODES.NONE,
    'prototypeToken.lockRotation': true
  });

  const tokenData = await actor.getTokenDocument({ x: dropPosition.x, y: dropPosition.y, actorLink: false });
  const [createdToken] = await scene.createEmbeddedDocuments('Token', [tokenData]);

  await createdToken.setFlag('conan', 'enemyData', {
    id: enemy.id, name: enemy.name, type: enemy.type,
    category: enemy.category, group: enemy.group, groupBackground: enemy.groupBackground,
    stats: enemy.stats, defenses: enemy.defenses,
    physicalDefense: enemy.physicalDefense, sorceryDefense: enemy.sorceryDefense,
    threshold: enemy.threshold, lifePoints: enemy.lifePoints,
    ar: enemy.ar, armorRating: enemy.armorRating,
    attacks: enemy.attacks, actions: enemy.actions, rules: enemy.rules,
    portraitImg: portraitImg, tokenImg: tokenImg, actorId: actor.id,
    chatName: chatName, chatGender: chatGender,
    threatTier: threatTier, threatTraits: threatTraits
  });

  // Move actor to Encounter Enemies folder
  let folder = game.folders.find(f => f.name === 'Encounter Enemies' && f.type === 'Actor');
  if (!folder) folder = await Folder.create({ name: 'Encounter Enemies', type: 'Actor' });
  await actor.update({ folder: folder.id });

  console.log(`%c[HORDE] Spawned ${tokenDisplayName} at (${dropPosition.x}, ${dropPosition.y}) — Tier ${threatTier}, Traits: [${threatTraits.join(', ')}]`, 'color: #4ECDC4; font-weight: bold;');
  return createdToken;
}
window.spawnHordePictAtPosition = spawnHordePictAtPosition;

// ==========================================
// DEDICATED SERVANT — Spawn Winged Nightmare
// ==========================================
async function spawnDedicatedServantNightmare(x, y) {
  const response = await fetch('systems/conan/data/enemies.json');
  if (!response.ok) return;
  const data = await response.json();
  const group = data.categories?.demons?.groups?.['winged-nightmares'];
  const nightmare = group?.enemies?.find(e => e.id === 'winged-nightmare');
  if (!nightmare) {
    console.error('[DEDICATED SERVANT] Could not find winged-nightmare in enemies.json!');
    return;
  }

  let enemy = JSON.parse(JSON.stringify(nightmare));
  enemy.category = 'demons';
  enemy.group = 'winged-nightmares';
  enemy.groupBackground = group.backgroundImg || null;

  // Apply custom images
  const customImages = game.settings.get('conan', 'enemyCustomImages') || {};
  const imgKey = `demons.winged-nightmares.${enemy.id}`;
  if (customImages[imgKey]) {
    if (customImages[imgKey].portraitImg) enemy.portraitImg = customImages[imgKey].portraitImg;
    if (customImages[imgKey].tokenImg) enemy.tokenImg = customImages[imgKey].tokenImg;
  }

  // Flatten defenses (randomize)
  const pDef = enemy.defenses.physical;
  enemy.physicalDefense = pDef.min + Math.floor(Math.random() * (pDef.max - pDef.min + 1));
  const sDef = enemy.defenses.sorcery;
  enemy.sorceryDefense = sDef.min + Math.floor(Math.random() * (sDef.max - sDef.min + 1));

  const portraitImg = enemy.portraitImg || enemy.tokenImg || 'icons/svg/mystery-man.svg';
  const tokenImg = enemy.tokenImg || 'icons/svg/mystery-man.svg';

  const actorData = {
    name: enemy.name,
    type: 'npc2',
    img: portraitImg,
    system: {
      enemyType: enemy.type,
      stats: {
        might: { value: enemy.stats.might.value, die: enemy.stats.might.die },
        edge: { value: enemy.stats.edge.value, die: enemy.stats.edge.die },
        grit: { value: enemy.stats.grit.value, die: enemy.stats.grit.die },
        wits: { value: enemy.stats.wits.value, die: enemy.stats.wits.die }
      },
      defenses: { physical: enemy.physicalDefense, sorcery: enemy.sorceryDefense },
      threshold: enemy.threshold || null,
      lifePoints: null,
      ar: null,
      attacks: enemy.attacks || {},
      actions: enemy.actions || { perTurn: 2, attackLimit: 1 },
      rules: enemy.rules || [],
      isDefaultEnemy: true,
      sourceEnemyId: enemy.id
    }
  };

  const scene = canvas.scene;
  if (!scene) return;

  const actor = await Actor.create(actorData, { conanEnemySpawn: true });
  const dropPosition = canvas.grid.getSnappedPosition(x, y);

  await actor.update({
    'prototypeToken.actorLink': false,
    'prototypeToken.texture.src': tokenImg,
    'prototypeToken.disposition': CONST.TOKEN_DISPOSITIONS.HOSTILE,
    'prototypeToken.displayName': CONST.TOKEN_DISPLAY_MODES.ALWAYS,
    'prototypeToken.displayBars': CONST.TOKEN_DISPLAY_MODES.NONE,
    'prototypeToken.lockRotation': true
  });

  const tokenData = await actor.getTokenDocument({ x: dropPosition.x, y: dropPosition.y, actorLink: false });
  const [createdToken] = await scene.createEmbeddedDocuments('Token', [tokenData]);

  await createdToken.setFlag('conan', 'enemyData', {
    id: enemy.id, name: enemy.name, type: enemy.type,
    category: enemy.category, group: enemy.group, groupBackground: enemy.groupBackground,
    stats: enemy.stats, defenses: enemy.defenses,
    physicalDefense: enemy.physicalDefense, sorceryDefense: enemy.sorceryDefense,
    threshold: enemy.threshold, lifePoints: enemy.lifePoints,
    ar: enemy.ar, armorRating: enemy.armorRating,
    attacks: enemy.attacks, actions: enemy.actions, rules: enemy.rules,
    portraitImg: portraitImg, tokenImg: tokenImg, actorId: actor.id,
    threatTier: 0, threatTraits: []
  });

  let folder = game.folders.find(f => f.name === 'Encounter Enemies' && f.type === 'Actor');
  if (!folder) folder = await Folder.create({ name: 'Encounter Enemies', type: 'Actor' });
  await actor.update({ folder: folder.id });

  console.log(`%c[DEDICATED SERVANT] Spawned Winged Nightmare at (${dropPosition.x}, ${dropPosition.y})`, 'color: #FF6B4A; font-weight: bold;');
  return createdToken;
}
window.spawnDedicatedServantNightmare = spawnDedicatedServantNightmare;

// ==========================================
// SUMMON FIEND — Spawn Fiend or Horror
// ==========================================
async function spawnDemonAtPosition(x, y, demonType) {
  const response = await fetch('systems/conan/data/enemies.json');
  if (!response.ok) return;
  const data = await response.json();
  const group = data.categories?.demons?.groups?.['lesser-demons'];
  const demon = group?.enemies?.find(e => e.id === demonType);
  if (!demon) {
    console.error(`[SUMMON FIEND] Could not find ${demonType} in enemies.json!`);
    return;
  }

  let enemy = JSON.parse(JSON.stringify(demon));
  enemy.category = 'demons';
  enemy.group = 'lesser-demons';
  enemy.groupBackground = group.backgroundImg || null;

  // Apply custom images
  const customImages = game.settings.get('conan', 'enemyCustomImages') || {};
  const imgKey = `demons.lesser-demons.${enemy.id}`;
  if (customImages[imgKey]) {
    if (customImages[imgKey].portraitImg) enemy.portraitImg = customImages[imgKey].portraitImg;
    if (customImages[imgKey].tokenImg) enemy.tokenImg = customImages[imgKey].tokenImg;
  }

  // Flatten defenses (randomize)
  const pDef = enemy.defenses.physical;
  enemy.physicalDefense = pDef.min + Math.floor(Math.random() * (pDef.max - pDef.min + 1));
  const sDef = enemy.defenses.sorcery;
  enemy.sorceryDefense = sDef.min + Math.floor(Math.random() * (sDef.max - sDef.min + 1));

  // Antagonist: randomize AR, set LP
  let armorRating = null;
  if (enemy.ar) {
    armorRating = enemy.ar.min + Math.floor(Math.random() * (enemy.ar.max - enemy.ar.min + 1));
  }

  const portraitImg = enemy.portraitImg || enemy.tokenImg || 'icons/svg/mystery-man.svg';
  const tokenImg = enemy.tokenImg || 'icons/svg/mystery-man.svg';

  const actorData = {
    name: enemy.name,
    type: 'npc2',
    img: portraitImg,
    system: {
      enemyType: enemy.type,
      stats: {
        might: { value: enemy.stats.might.value, die: enemy.stats.might.die },
        edge: { value: enemy.stats.edge.value, die: enemy.stats.edge.die },
        grit: { value: enemy.stats.grit.value, die: enemy.stats.grit.die },
        wits: { value: enemy.stats.wits.value, die: enemy.stats.wits.die }
      },
      defenses: { physical: enemy.physicalDefense, sorcery: enemy.sorceryDefense },
      threshold: null,
      lifePoints: enemy.lifePoints ? { value: enemy.lifePoints, max: enemy.lifePoints } : null,
      ar: armorRating,
      attacks: enemy.attacks || {},
      actions: enemy.actions || { perTurn: 3, attackLimit: 2 },
      rules: enemy.rules || [],
      isDefaultEnemy: true,
      sourceEnemyId: enemy.id
    }
  };

  const scene = canvas.scene;
  if (!scene) return;

  const actor = await Actor.create(actorData, { conanEnemySpawn: true });
  const dropPosition = canvas.grid.getSnappedPosition(x, y);

  await actor.update({
    'prototypeToken.actorLink': false,
    'prototypeToken.texture.src': tokenImg,
    'prototypeToken.disposition': CONST.TOKEN_DISPOSITIONS.HOSTILE,
    'prototypeToken.displayName': CONST.TOKEN_DISPLAY_MODES.ALWAYS,
    'prototypeToken.displayBars': CONST.TOKEN_DISPLAY_MODES.OWNER,
    'prototypeToken.lockRotation': true
  });

  const tokenData = await actor.getTokenDocument({ x: dropPosition.x, y: dropPosition.y, actorLink: false });
  const [createdToken] = await scene.createEmbeddedDocuments('Token', [tokenData]);

  // DUAL LP WRITE — set both currentHP flag and actor LP
  const initHP = enemy.lifePoints || 0;
  if (initHP > 0) {
    await createdToken.setFlag('conan', 'currentHP', initHP);
  }

  await createdToken.setFlag('conan', 'enemyData', {
    id: enemy.id, name: enemy.name, type: enemy.type,
    category: enemy.category, group: enemy.group, groupBackground: enemy.groupBackground,
    stats: enemy.stats, defenses: enemy.defenses,
    physicalDefense: enemy.physicalDefense, sorceryDefense: enemy.sorceryDefense,
    threshold: enemy.threshold, lifePoints: enemy.lifePoints,
    ar: enemy.ar, armorRating: armorRating,
    attacks: enemy.attacks, actions: enemy.actions, rules: enemy.rules,
    portraitImg: portraitImg, tokenImg: tokenImg, actorId: actor.id,
    threatTier: 0, threatTraits: []
  });

  let folder = game.folders.find(f => f.name === 'Encounter Enemies' && f.type === 'Actor');
  if (!folder) folder = await Folder.create({ name: 'Encounter Enemies', type: 'Actor' });
  await actor.update({ folder: folder.id });

  console.log(`%c[SUMMON FIEND] Spawned ${enemy.name} (AR: ${armorRating}, LP: ${initHP}) at (${dropPosition.x}, ${dropPosition.y})`, 'color: #C43C3C; font-weight: bold;');
  return createdToken;
}
window.spawnDemonAtPosition = spawnDemonAtPosition;

// ==========================================
// FIRST WIFE — Spawn replacement Enchantress at 40-60% HP
// ==========================================
async function spawnFirstWifeEnchantress(x, y, traits, tier) {
  const inheritedTraits = traits || [];
  const inheritedTier = tier || 0;

  const response = await fetch('systems/conan/data/enemies.json');
  if (!response.ok) return;
  const data = await response.json();
  const group = data.categories?.human?.groups?.['silk-vipers'];
  const enchantress = group?.enemies?.find(e => e.id === 'enchantress');
  if (!enchantress) {
    console.error('[FIRST WIFE] Could not find enchantress in enemies.json!');
    return;
  }

  let enemy = JSON.parse(JSON.stringify(enchantress));
  enemy.category = 'human';
  enemy.group = 'silk-vipers';
  enemy.groupBackground = group.backgroundImg || null;

  // Custom images
  const customImages = game.settings.get('conan', 'enemyCustomImages') || {};
  const imgKey = `human.silk-vipers.${enemy.id}`;
  if (customImages[imgKey]) {
    if (customImages[imgKey].portraitImg) enemy.portraitImg = customImages[imgKey].portraitImg;
    if (customImages[imgKey].tokenImg) enemy.tokenImg = customImages[imgKey].tokenImg;
  }

  // Flatten defenses
  const pDef = enemy.defenses.physical;
  enemy.physicalDefense = pDef.min + Math.floor(Math.random() * (pDef.max - pDef.min + 1));
  const sDef = enemy.defenses.sorcery;
  enemy.sorceryDefense = sDef.min + Math.floor(Math.random() * (sDef.max - sDef.min + 1));

  // AR randomize
  const arMin = enemy.ar?.min || 0;
  const arMax = enemy.ar?.max || 0;
  enemy.armorRating = arMin + Math.floor(Math.random() * (arMax - arMin + 1));

  // Apply inherited spawn-time trait effects
  if (inheritedTraits.includes('faithful')) {
    enemy.sorceryDefense = (enemy.sorceryDefense || 0) + 2;
  }

  // Apply tier name from THREAT_NAME_MAP
  const nameMap = THREAT_NAME_MAP[enemy.id];
  if (nameMap && nameMap[inheritedTier]) {
    enemy = { ...enemy, name: nameMap[inheritedTier] };
  }

  // LP at 40-60% of base
  const baseLP = enemy.lifePoints || 40;
  const lpPercent = 0.4 + (Math.random() * 0.2); // 0.4 to 0.6
  const reducedLP = Math.max(1, Math.round(baseLP * lpPercent));

  const portraitImg = enemy.portraitImg || enemy.tokenImg || 'icons/svg/mystery-man.svg';
  const tokenImg = enemy.tokenImg || 'icons/svg/mystery-man.svg';

  // Pick a name
  const nameData = pickSilkViperName();

  // Build nameplate with skulls
  const skullPrefix = inheritedTier > 0 ? '💀'.repeat(inheritedTier) + ' ' : '';
  const displayName = skullPrefix + enemy.name;

  const actorData = {
    name: displayName,
    type: 'npc2',
    img: portraitImg,
    system: {
      enemyType: enemy.type,
      stats: {
        might: { value: enemy.stats.might.value, die: enemy.stats.might.die },
        edge: { value: enemy.stats.edge.value, die: enemy.stats.edge.die },
        grit: { value: enemy.stats.grit.value, die: enemy.stats.grit.die },
        wits: { value: enemy.stats.wits.value, die: enemy.stats.wits.die }
      },
      defenses: { physical: enemy.physicalDefense, sorcery: enemy.sorceryDefense },
      threshold: null,
      lifePoints: { value: reducedLP, max: reducedLP },
      ar: enemy.armorRating,
      attacks: enemy.attacks || {},
      actions: enemy.actions || { perTurn: 2, attackLimit: null },
      rules: enemy.rules || [],
      isDefaultEnemy: true,
      sourceEnemyId: enemy.id
    }
  };

  const scene = canvas.scene;
  if (!scene) return;

  const actor = await Actor.create(actorData, { conanEnemySpawn: true });
  const dropPosition = canvas.grid.getSnappedPosition(x, y);

  await actor.update({
    'prototypeToken.actorLink': false,
    'prototypeToken.texture.src': tokenImg,
    'prototypeToken.disposition': CONST.TOKEN_DISPOSITIONS.HOSTILE,
    'prototypeToken.displayName': CONST.TOKEN_DISPLAY_MODES.ALWAYS,
    'prototypeToken.displayBars': CONST.TOKEN_DISPLAY_MODES.NONE,
    'prototypeToken.lockRotation': true
  });

  const tokenData = await actor.getTokenDocument({ x: dropPosition.x, y: dropPosition.y, actorLink: false });
  const [createdToken] = await scene.createEmbeddedDocuments('Token', [tokenData]);

  await createdToken.setFlag('conan', 'enemyData', {
    id: enemy.id, name: enemy.name, type: enemy.type,
    category: enemy.category, group: enemy.group, groupBackground: enemy.groupBackground,
    stats: enemy.stats, defenses: enemy.defenses,
    physicalDefense: enemy.physicalDefense, sorceryDefense: enemy.sorceryDefense,
    threshold: null, lifePoints: reducedLP,
    ar: enemy.ar, armorRating: enemy.armorRating,
    attacks: enemy.attacks, actions: enemy.actions, rules: enemy.rules,
    portraitImg: portraitImg, tokenImg: tokenImg, actorId: actor.id,
    chatName: nameData.name, chatGender: nameData.gender,
    threatTier: inheritedTier, threatTraits: inheritedTraits
  });

  // DUAL LP WRITE — set currentHP flag
  await createdToken.setFlag('conan', 'currentHP', reducedLP);

  let folder = game.folders.find(f => f.name === 'Encounter Enemies' && f.type === 'Actor');
  if (!folder) folder = await Folder.create({ name: 'Encounter Enemies', type: 'Actor' });
  await actor.update({ folder: folder.id });

  console.log(`%c[FIRST WIFE] Spawned ${displayName} at ${reducedLP}/${baseLP} LP (${Math.round(lpPercent * 100)}%), Tier ${inheritedTier}, Traits: [${inheritedTraits.join(', ')}]`, 'color: #FF69B4; font-weight: bold;');
  return createdToken;
}
window.spawnFirstWifeEnchantress = spawnFirstWifeEnchantress;

// ========== TOKEN DOUBLE-CLICK - Intercept before sheet opens ==========
// Override Token._onClickLeft2 to intercept double-clicks on enemy tokens BEFORE the sheet opens
Hooks.once('ready', () => {
  const originalOnClickLeft2 = Token.prototype._onClickLeft2;

  Token.prototype._onClickLeft2 = function(event) {
    console.log('Conan | Token double-click intercepted', this.name);

    // First check if we have enemy data stored in token flags (preferred method)
    const flagData = this.document?.getFlag('conan', 'enemyData');
    console.log('Conan | Token flag data:', flagData ? 'found' : 'not found');

    if (flagData) {
      // Use the stored enemy data from token flags
      event.preventDefault();
      event.stopPropagation();

      showEnemyRollDialog(flagData, this.document);
      return; // Don't call the original method
    }

    // Fallback: check actor system data (for tokens with actors in Encounter Enemies folder)
    const actor = this.actor;
    console.log('Conan | Token actor:', actor?.name, 'isDefaultEnemy:', actor?.system?.isDefaultEnemy);

    if (actor?.system?.isDefaultEnemy || actor?.system?.sourceEnemyId) {
      event.preventDefault();
      event.stopPropagation();

      // Build enemy data from the token's actor (fallback - no flag data)
      const sys = actor.system;
      const enemyData = {
        id: sys.sourceEnemyId || actor.id,
        name: actor.name,
        type: sys.enemyType || 'Minion',
        category: 'human', // Default category when no flag data available
        stats: sys.stats || {
          might: { value: 2, die: 'D6' },
          edge: { value: 2, die: 'D6' },
          grit: { value: 2, die: 'D6' },
          wits: { value: 2, die: 'D6' }
        },
        defenses: {
          physical: { min: sys.defenses?.physical || 7, max: sys.defenses?.physical || 7 },
          sorcery: { min: sys.defenses?.sorcery || 5, max: sys.defenses?.sorcery || 5 }
        },
        physicalDefense: sys.defenses?.physical,
        sorceryDefense: sys.defenses?.sorcery,
        threshold: sys.threshold,
        lifePoints: sys.lifePoints?.max,
        ar: sys.ar ? { min: sys.ar, max: sys.ar } : null,
        attacks: sys.attacks || {},
        rules: sys.rules || [],
        portraitImg: actor.img,
        tokenImg: this.document?.texture?.src || actor.img
      };

      showEnemyRollDialog(enemyData, this.document);
      return; // Don't call the original method
    }

    // For non-enemy tokens, use the default behavior
    return originalOnClickLeft2.call(this, event);
  };

  console.log('Conan | Token double-click handler installed for enemy tokens');
});

// ========== BACKUP: Intercept ActorSheet render for enemy actors ==========
// This catches cases where the sheet is opened through other means (HUD, sidebar, etc.)
Hooks.on('renderActorSheet', (sheet, html, data) => {
  const actor = sheet.actor;

  // Check if this is one of our enemy actors
  if (actor?.system?.isDefaultEnemy || actor?.system?.sourceEnemyId) {
    console.log('Conan | Intercepted enemy actor sheet render, redirecting to dialog');

    // Hide the sheet element immediately to prevent visual flash
    if (html[0]) html[0].style.display = 'none';

    // Close the default sheet
    sheet.close({ force: true });

    // Find the token for this actor on the active scene
    const token = canvas.tokens?.placeables.find(t => t.actor?.id === actor.id);

    // Check if token has stored enemy data in flags (preferred - has category/group/background)
    const tokenFlagData = token?.document?.getFlag('conan', 'enemyData');

    if (tokenFlagData) {
      // Use the stored flag data which has all the theming and background info
      console.log('Conan | Using token flag data for enemy dialog');
      setTimeout(() => showEnemyRollDialog(tokenFlagData, token?.document), 10);
    } else {
      // Fallback: Build enemy data from the actor (no background/category info)
      const sys = actor.system;
      const enemyData = {
        id: sys.sourceEnemyId || actor.id,
        name: actor.name,
        type: sys.enemyType || 'Minion',
        category: 'human', // Default for actors without token flag data
        stats: sys.stats || {
          might: { value: 2, die: 'D6' },
          edge: { value: 2, die: 'D6' },
          grit: { value: 2, die: 'D6' },
          wits: { value: 2, die: 'D6' }
        },
        defenses: {
          physical: { min: sys.defenses?.physical || 7, max: sys.defenses?.physical || 7 },
          sorcery: { min: sys.defenses?.sorcery || 5, max: sys.defenses?.sorcery || 5 }
        },
        physicalDefense: sys.defenses?.physical,
        sorceryDefense: sys.defenses?.sorcery,
        threshold: sys.threshold,
        lifePoints: sys.lifePoints?.max,
        ar: sys.ar ? { min: sys.ar, max: sys.ar } : null,
        attacks: sys.attacks || {},
        rules: sys.rules || [],
        portraitImg: actor.img,
        tokenImg: token?.document?.texture?.src || actor.img
      };

      // Small delay to ensure sheet closes before dialog opens
      setTimeout(() => showEnemyRollDialog(enemyData, token?.document), 10);
    }
  }
});

// ============================================================================
// WINDS OF FATE DIALOG
// A floating, draggable dialog for setting universal roll modifiers (-5 to +5)
// ============================================================================
class WindsOfFateDialog extends Application {
  static _instance = null;
  _pendingPlayerValue = null;
  _pendingEnemyValue = null;
  _hookIds = [];

  // Flavor text for each level, in the style of Akiro the Wizard
  static FLAVOR_TEXT = {
    '-5': "The winds blow cold and cruel... fate itself hath turned against thee.",
    '-4': "Dark omens gather upon the horizon. The spirits are most displeased.",
    '-3': "The threads of destiny grow tangled and frayed. Tread carefully.",
    '-2': "A chill wind doth whisper of misfortune yet to come.",
    '-1': "The fates stir restlessly... fortune wavers like a dying flame.",
    '0': "The winds of fate notice thee not.",
    '1': "A gentle breeze of fortune beginneth to blow.",
    '2': "The spirits whisper words of encouragement. Hope stirs.",
    '3': "The threads of destiny align in thy favor. Strike true!",
    '4': "The winds of fate blow strong at thy back! Seize the moment!",
    '5': "By Crom! The very heavens themselves champion thy cause!"
  };

  static get defaultOptions() {
    return foundry.utils.mergeObject(super.defaultOptions, {
      id: 'winds-of-fate-dialog',
      title: 'Winds of Fate',
      template: 'systems/conan/templates/winds-of-fate.html',
      classes: ['conan', 'winds-of-fate'],
      width: 280,
      height: 520,
      top: 100,
      left: 100,
      resizable: true,
      minimizable: true,
      popOut: true
    });
  }

  /**
   * Show the dialog (singleton pattern)
   */
  static show() {
    if (!this._instance) {
      this._instance = new WindsOfFateDialog();
    }
    this._instance.render(true);
  }

  /**
   * Get the current Winds of Fate value for players
   */
  static getPlayerValue() {
    return game.settings.get('conan', 'windsOfFatePlayers') || 0;
  }

  /**
   * Get the current Winds of Fate value for enemies
   */
  static getEnemyValue() {
    return game.settings.get('conan', 'windsOfFateEnemies') || 0;
  }

  /**
   * Get the appropriate value based on actor type.
   * For players, stacks global + individual personal modifier.
   */
  static getValueForActor(actor) {
    if (!actor) return 0;
    const type = actor.type;
    // character and character2 are players, npc and npc2 are enemies
    if (type === 'character' || type === 'character2') {
      const global = this.getPlayerValue();
      const personal = actor.getFlag('conan', 'windsOfFatePersonal') || 0;
      return global + personal;
    } else if (type === 'npc' || type === 'npc2') {
      return this.getEnemyValue();
    }
    return 0;
  }

  /**
   * Get flavor text for a value
   */
  static getFlavorText(value) {
    return this.FLAVOR_TEXT[String(value)] || this.FLAVOR_TEXT['0'];
  }

  /**
   * Get combined flavor text based on both values
   */
  static getCombinedFlavorText(playerValue, enemyValue) {
    // If both are zero, neutral message
    if (playerValue === 0 && enemyValue === 0) {
      return this.FLAVOR_TEXT['0'];
    }
    // If only one is set, use that flavor
    if (playerValue !== 0 && enemyValue === 0) {
      return this.getFlavorText(playerValue);
    }
    if (enemyValue !== 0 && playerValue === 0) {
      return this.getFlavorText(enemyValue);
    }
    // Both are set - show a combined message
    const playerText = playerValue > 0 ? 'favor the heroes' : 'curse the heroes';
    const enemyText = enemyValue > 0 ? 'aid the foe' : 'hinder the foe';
    return `The winds ${playerText} and ${enemyText}...`;
  }

  /**
   * Set both Winds of Fate values and optionally announce to chat
   */
  static async setValues(playerValue, enemyValue, announce = false) {
    const clampedPlayer = Math.max(-5, Math.min(5, parseInt(playerValue) || 0));
    const clampedEnemy = Math.max(-5, Math.min(5, parseInt(enemyValue) || 0));
    const oldPlayerValue = this.getPlayerValue();
    const oldEnemyValue = this.getEnemyValue();

    await game.settings.set('conan', 'windsOfFatePlayers', clampedPlayer);
    await game.settings.set('conan', 'windsOfFateEnemies', clampedEnemy);

    // Send chat message if announcing and values changed
    if (announce && (clampedPlayer !== oldPlayerValue || clampedEnemy !== oldEnemyValue)) {
      const playerDisplay = clampedPlayer > 0 ? `+${clampedPlayer}` : clampedPlayer;
      const enemyDisplay = clampedEnemy > 0 ? `+${clampedEnemy}` : clampedEnemy;

      // Determine overall wind direction
      let windClass = 'neutral';
      if (clampedPlayer > 0 || clampedEnemy < 0) windClass = 'favorable';
      if (clampedPlayer < 0 || clampedEnemy > 0) windClass = 'unfavorable';
      if ((clampedPlayer > 0 && clampedEnemy > 0) || (clampedPlayer < 0 && clampedEnemy < 0)) windClass = 'mixed';

      const content = `
        <div class="winds-of-fate-message ${windClass}">
          <div class="wof-msg-header">
            <img src="systems/conan/images/icons/winds_of_fate_icon.png" class="wof-msg-icon"/>
            <span class="wof-msg-title">The Winds of Fate Shift</span>
          </div>
          <div class="wof-msg-values">
            <div class="wof-msg-value-row"><span class="wof-msg-label">Players:</span> <span class="wof-msg-value">${playerDisplay}</span></div>
            <div class="wof-msg-value-row"><span class="wof-msg-label">Enemies:</span> <span class="wof-msg-value">${enemyDisplay}</span></div>
          </div>
          <div class="wof-msg-flavor">"${this.getCombinedFlavorText(clampedPlayer, clampedEnemy)}"</div>
        </div>
      `;

      ChatMessage.create({
        content: content,
        speaker: { alias: 'The Winds of Fate' }
      });
    }

    if (this._instance) {
      this._instance.render(false);
    }
  }

  getData() {
    const playerValue = WindsOfFateDialog.getPlayerValue();
    const enemyValue = WindsOfFateDialog.getEnemyValue();

    // Find player characters on the active scene
    const players = [];
    const scene = game.scenes.active;
    if (scene) {
      for (const tokenDoc of scene.tokens) {
        const actor = tokenDoc.actor;
        if (!actor || (actor.type !== 'character' && actor.type !== 'character2')) continue;
        // Avoid duplicates (same actor with multiple tokens)
        if (players.find(p => p.actorId === actor.id)) continue;
        players.push({
          actorId: actor.id,
          name: actor.name,
          img: tokenDoc.texture?.src || actor.img,
          personal: actor.getFlag('conan', 'windsOfFatePersonal') || 0
        });
      }
    }

    return {
      playerValue: playerValue,
      enemyValue: enemyValue,
      flavorText: WindsOfFateDialog.getCombinedFlavorText(playerValue, enemyValue),
      players: players
    };
  }

  activateListeners(html) {
    super.activateListeners(html);

    // Clean up any previous hooks (activateListeners runs on each render)
    this._removeHooks();

    // Re-render when tokens are added/removed or scene changes
    const rerender = () => { if (this.rendered) this.render(false); };
    this._hookIds = [
      Hooks.on('createToken', rerender),
      Hooks.on('deleteToken', rerender),
      Hooks.on('canvasReady', rerender)
    ];
    this._hookNames = ['createToken', 'deleteToken', 'canvasReady'];

    // Initialize pending values
    this._pendingPlayerValue = WindsOfFateDialog.getPlayerValue();
    this._pendingEnemyValue = WindsOfFateDialog.getEnemyValue();

    // Player slider input
    html.find('.wof-slider-players').on('input', (e) => {
      const val = parseInt(e.target.value);
      this._pendingPlayerValue = val;
      html.find('.wof-value-players').text(val > 0 ? `+${val}` : val);
      html.find('.wof-flavor-text').text(WindsOfFateDialog.getCombinedFlavorText(val, this._pendingEnemyValue));
    });

    // Enemy slider input
    html.find('.wof-slider-enemies').on('input', (e) => {
      const val = parseInt(e.target.value);
      this._pendingEnemyValue = val;
      html.find('.wof-value-enemies').text(val > 0 ? `+${val}` : val);
      html.find('.wof-flavor-text').text(WindsOfFateDialog.getCombinedFlavorText(this._pendingPlayerValue, val));
    });

    // Player quick buttons
    html.find('.wof-quick-btn-players').click((e) => {
      const val = parseInt(e.currentTarget.dataset.value);
      this._pendingPlayerValue = val;
      html.find('.wof-slider-players').val(val);
      html.find('.wof-value-players').text(val > 0 ? `+${val}` : val);
      html.find('.wof-flavor-text').text(WindsOfFateDialog.getCombinedFlavorText(val, this._pendingEnemyValue));
    });

    // Enemy quick buttons
    html.find('.wof-quick-btn-enemies').click((e) => {
      const val = parseInt(e.currentTarget.dataset.value);
      this._pendingEnemyValue = val;
      html.find('.wof-slider-enemies').val(val);
      html.find('.wof-value-enemies').text(val > 0 ? `+${val}` : val);
      html.find('.wof-flavor-text').text(WindsOfFateDialog.getCombinedFlavorText(this._pendingPlayerValue, val));
    });

    // Apply button - saves and announces
    html.find('.wof-apply-btn').click(async () => {
      await WindsOfFateDialog.setValues(this._pendingPlayerValue, this._pendingEnemyValue, true);
    });

    // Silent apply button - saves without chat message
    html.find('.wof-apply-silent-btn').click(async () => {
      await WindsOfFateDialog.setValues(this._pendingPlayerValue, this._pendingEnemyValue, false);
    });

    // Per-player individual modifier inputs
    html.find('.wof-player-value').on('change', async (e) => {
      const input = e.currentTarget;
      const actorId = input.dataset.actorId;
      const val = Math.max(-5, Math.min(5, parseInt(input.value) || 0));
      input.value = val;
      const actor = game.actors.get(actorId);
      if (actor) {
        if (val === 0) {
          await actor.unsetFlag('conan', 'windsOfFatePersonal');
        } else {
          await actor.setFlag('conan', 'windsOfFatePersonal', val);
        }
      }
    });

    // +/- buttons for individual modifiers
    html.find('.wof-player-inc').click(async (e) => {
      const actorId = e.currentTarget.dataset.actorId;
      const input = html.find(`.wof-player-value[data-actor-id="${actorId}"]`);
      const current = parseInt(input.val()) || 0;
      const val = Math.min(5, current + 1);
      input.val(val).trigger('change');
    });

    html.find('.wof-player-dec').click(async (e) => {
      const actorId = e.currentTarget.dataset.actorId;
      const input = html.find(`.wof-player-value[data-actor-id="${actorId}"]`);
      const current = parseInt(input.val()) || 0;
      const val = Math.max(-5, current - 1);
      input.val(val).trigger('change');
    });
  }

  _removeHooks() {
    if (this._hookIds?.length) {
      for (let i = 0; i < this._hookIds.length; i++) {
        Hooks.off(this._hookNames[i], this._hookIds[i]);
      }
      this._hookIds = [];
      this._hookNames = [];
    }
  }

  async close(options) {
    this._removeHooks();
    return super.close(options);
  }
}

// Make WindsOfFateDialog globally accessible
window.WindsOfFateDialog = WindsOfFateDialog;
