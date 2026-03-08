/**
 * Conan Actor Sheet 2 - Modern Tabbed Interface
 * Reuses dice mechanics from the original system
 */

// Poison discovery messages — random selection when effects reveal themselves
const VENOM_FLEX_MESSAGES = [
  "For a moment, everything aligns — then the venom pulls it away. Your body refuses to answer.",
  "Your vision swirls and darkens. The perfect moment slips through your fingers like sand.",
  "Something inside you ignites — then the poison smothers it. The world spins.",
  "Your instincts scream to act — but the venom has severed the connection.",
  "The opening was there. The venom took it from you before you could move."
];

const VENOM_STAMINA_MESSAGES = [
  "The venom dulls your body's response. Your effort is wasted.",
  "You reach deep for the strength within — but the poison has already claimed it.",
  "Your muscles seize as the venom tightens its grip. The effort dissolves into nothing.",
  "You push through the haze — but your body gives nothing back. The venom holds."
];

const VENOM_SKILL_MESSAGES = [
  "Your hands move on instinct, but the venom has stolen the memory from your muscles.",
  "You know what to do — your body simply won't obey. The venom has severed the connection.",
  "The skill is there, buried under a tide of poison. Your body betrays your training.",
  "You reach for technique and find only numbness. The venom has taken this from you."
];

const VENOM_SPELL_MESSAGES = [
  "The venom interferes with your concentration. The spell dissipates.",
  "You feel the sorcery rise within you — then the poison scatters it like ash.",
  "The incantation forms on your lips, but the venom unravels the words before they take hold.",
  "Your mind reaches for the spell — the poison pulls you back into your suffering body."
];

// Origin-specific beast form data — keyed by origin ID
// Images are read from GM Tools custom images (enemyCustomImages setting)
// Key format: originBeast.<groupKey>.<id>
const ORIGIN_BEASTS = {
  "from-the-blood-of-acheron": {
    id: "the-last-king",
    groupKey: "blood-of-acheron",
    name: "The Last King",
    attackName: "Judgement",
    description: "A godlike being of terrible beautiful fury — pale ashen skin veined with black sigils, eyes burning with cold violet corpse-light, armor fused to flesh like living obsidian. A faint aura of whispering spirits orbits a crown of shattered fragments atop a regal, monstrous silhouette."
  }
};

// Reload ammo recovery rates by projectile type
const RELOAD_RATES = {
  thrown: { base: 95, decay: 1.5, floor: 25 },
  arrow:  { base: 95, decay: 5,   floor: 5 },
  bolt:   { base: 95, decay: 4,   floor: 10 },
  sling:  { base: 95, decay: 1.5, floor: 20 }
};

const HORSE_NAMES = [
  "Thunder", "Shadow", "Storm", "Midnight", "Blaze", "Spirit", "Star",
  "Dusty", "Smoke", "Flash", "Scout", "Ranger", "Nomad", "Desert",
  "Fury", "Lightning", "Wind", "Ghost", "Warrior", "Savage", "Steel",
  "Bronze", "Iron", "Coal", "Ash", "Ember", "Flame", "Phoenix",
  "Khan", "Raja", "Sultan", "Conan", "Crom", "Bel", "Set"
];

const HORSE_IMAGE_MAP = {
  'from-the-hills': 'horse_from_the_hill',
  'from-the-streets': 'horse_generic',
  'from-the-steppes': 'horse_generic',
  'from-the-north': 'horse_generic',
  'from-the-wilds': 'horse_generic',
  'from-a-civilized-land': 'horse_generic',
  'from-parts-unknown': 'horse_generic',
  'from-the-blood-of-jhebbal-sag': 'horse_generic',
  'from-the-blood-of-acheron': 'horse_generic',
  'from-the-blood-of-a-demon': 'horse_generic'
};

// ============================================================================
// TREASURE GENERATOR — Combinatorial name/description for flex plunder
// ============================================================================

const TREASURE_OBJECTS = [
  'Ring', 'Amulet', 'Idol', 'Goblet', 'Dagger', 'Crown', 'Totem',
  'Figurine', 'Mask', 'Medallion', 'Bracelet', 'Chalice', 'Scepter',
  'Mirror', 'Comb', 'Brooch', 'Pendant', 'Seal', 'Anklet', 'Circlet',
  'Armband', 'Reliquary', 'Scarab', 'Talisman', 'Urn', 'Coffer',
  'Statuette', 'Eye', 'Fang', 'Claw'
];

const TREASURE_MATERIALS = [
  'Golden', 'Silver', 'Jade', 'Ivory', 'Obsidian', 'Ruby-Studded',
  'Sapphire', 'Bronze', 'Amber', 'Onyx', 'Pearl', 'Emerald',
  'Crystal', 'Copper', 'Bone', 'Ebony', 'Marble', 'Lapis Lazuli',
  'Turquoise', 'Bloodstone', 'Iron-Bound', 'Jeweled', 'Platinum',
  'Serpentine', 'Alabaster'
];

const TREASURE_ORIGINS = [
  { name: 'Stygian',      desc: 'the sorcerer-priests of Stygia' },
  { name: 'Khitan',       desc: 'the far kingdoms of Khitai' },
  { name: 'Turanian',     desc: 'the courts of Turan' },
  { name: 'Vendhyan',     desc: 'the temples of Vendhya' },
  { name: 'Zamoran',      desc: 'the thieves\' markets of Zamora' },
  { name: 'Kushite',      desc: 'the deep jungles of Kush' },
  { name: 'Aquilonian',   desc: 'the great halls of Aquilonia' },
  { name: 'Nemedian',     desc: 'the scholar-lords of Nemedia' },
  { name: 'Ophirean',     desc: 'the golden vaults of Ophir' },
  { name: 'Shemite',      desc: 'the merchant caravans of Shem' },
  { name: 'Zingaran',     desc: 'the pirate coasts of Zingara' },
  { name: 'Hyperborean',  desc: 'the frozen ruins of Hyperborea' },
  { name: 'Iranistani',   desc: 'the bazaars of Iranistan' },
  { name: 'Corinthian',   desc: 'the hill-cities of Corinthia' },
  { name: 'Kothian',      desc: 'the merchant princes of Koth' },
  { name: 'Argossean',    desc: 'the seafaring traders of Argos' },
  { name: 'Nordheimr',    desc: 'the frost-bitten longhouses of Nordheim' },
  { name: 'Cimmerian',    desc: 'the dark hills of Cimmeria' },
  { name: 'Puntish',      desc: 'the lost kingdom of Punt' },
  { name: 'Acheronian',   desc: 'the pre-cataclysmic vaults of Acheron' }
];

const TREASURE_DESC_TEMPLATES = [
  (obj, mat, orig) => `${orig.article} ${mat.toLowerCase()} ${obj.toLowerCase()} bearing the marks of ${orig.desc}. ${orig.flavor}`,
  (obj, mat, orig) => `An ancient ${obj.toLowerCase()} of ${mat.toLowerCase()} make, plundered from ${orig.desc}. ${orig.flavor}`,
  (obj, mat, orig) => `A ${mat.toLowerCase()} ${obj.toLowerCase()}, unmistakably ${orig.name} in origin. ${orig.flavor}`,
  (obj, mat, orig) => `${orig.article} ${obj.toLowerCase()} wrought in ${mat.toLowerCase()}, likely stolen from ${orig.desc}. ${orig.flavor}`,
  (obj, mat, orig) => `This ${mat.toLowerCase()} ${obj.toLowerCase()} carries the weight of ${orig.name} history. ${orig.flavor}`,
  (obj, mat, orig) => `A battered ${mat.toLowerCase()} ${obj.toLowerCase()} etched with ${orig.name} script. ${orig.flavor}`,
  (obj, mat, orig) => `${orig.article} ${mat.toLowerCase()} ${obj.toLowerCase()} that reeks of grave dust and ${orig.name} sorcery.`,
  (obj, mat, orig) => `Once belonging to ${orig.desc}, this ${mat.toLowerCase()} ${obj.toLowerCase()} gleams in the torchlight.`
];

const TREASURE_FLAVORS = {
  'Stygian':     'The serpent motifs are unmistakable.',
  'Khitan':      'Delicate dragon patterns coil across its surface.',
  'Turanian':    'It glimmers with eastern opulence.',
  'Vendhyan':    'Lotus blossoms are carved into every surface.',
  'Zamoran':     'It has changed hands many times.',
  'Kushite':     'Primal symbols are etched deep into the metalwork.',
  'Aquilonian':  'The lion crest of Aquilonia is faintly visible.',
  'Nemedian':    'Scholarly inscriptions line the edges.',
  'Ophirean':    'The craftsmanship is exquisite beyond measure.',
  'Shemite':     'Sand and spice still cling to its crevices.',
  'Zingaran':    'Salt spray has not dulled its beauty.',
  'Hyperborean': 'It radiates an unnatural cold.',
  'Iranistani':  'Geometric patterns cover every surface.',
  'Corinthian':  'Simple but elegant in its design.',
  'Kothian':     'A merchant\'s stamp marks the underside.',
  'Argossean':   'Barnacles still cling to the base.',
  'Nordheimr':   'Runes of power are carved along the rim.',
  'Cimmerian':   'Crude but heavy — worth its weight.',
  'Puntish':     'Strange glyphs defy translation.',
  'Acheronian':  'It pulses with a faint, unsettling warmth.'
};

function generateTreasure(plunderValue) {
  const obj = TREASURE_OBJECTS[Math.floor(Math.random() * TREASURE_OBJECTS.length)];
  const mat = TREASURE_MATERIALS[Math.floor(Math.random() * TREASURE_MATERIALS.length)];
  const orig = TREASURE_ORIGINS[Math.floor(Math.random() * TREASURE_ORIGINS.length)];
  const template = TREASURE_DESC_TEMPLATES[Math.floor(Math.random() * TREASURE_DESC_TEMPLATES.length)];

  // Build origin data with article and flavor
  const vowels = 'AEIOU';
  const article = vowels.includes(mat[0].toUpperCase()) ? 'An' : 'A';
  const origData = {
    ...orig,
    article,
    flavor: TREASURE_FLAVORS[orig.name] || ''
  };

  const name = `${orig.name} ${mat} ${obj}`;
  const description = template(obj, mat, origData);

  return { name, description, plunderValue };
}

// ═══════════════════════════════════════════════════════
// PLUNDER DESCRIPTION MATRIX
// Generates short, flavorful descriptions for plunder slots
// ═══════════════════════════════════════════════════════

const PLUNDER_LOOT = [
  // ── Coins & Currency ──
  'Blood-stained silver coins',
  'Clipped dinars, edges filed smooth',
  'A pouch of tarnished coppers',
  'Bent gold pieces, bitten to test purity',
  'A knotted rag of mixed coin',
  'Corroded bronze tokens',
  'Stamped iron trade-discs',
  'Sweaty palmful of silver bits',
  'A dead man\'s coin purse',
  'Foreign coins no one can identify',
  'Worn silver, faces rubbed smooth',
  'A handful of square-cut copper',
  'Electrum coins with serpent stamps',
  'Crude lead slugs passed off as silver',
  'Temple offering coins, still blessed',
  'Coins fused together by old fire',
  'Greasy coppers wrapped in hide',
  'A mercenary\'s unpaid wages',
  'Tax collector\'s strongbox scrapings',
  'Coins so old the kings are forgotten',
  // ── Trade Goods ──
  'Silk scraps, still worth trading',
  'Black lotus resin wrapped in paper',
  'A bundle of saffron, pungent and valuable',
  'Cured snakeskin, rolled tight',
  'Salt bricks stamped with caravan marks',
  'Cinnabar powder in a clay jar',
  'Ivory shavings swept from a workshop',
  'Strips of indigo-dyed linen',
  'A stoppered vial of perfumed oil',
  'Pressed tea bricks from the east',
  'A coil of fine copper wire',
  'Dried peppers, worth silver by weight',
  'Frankincense nuggets in a leather pouch',
  'A bolt of moth-eaten velvet',
  'Raw amber chunks, unpolished',
  'A jar of rendered tallow, trade-grade',
  'Sandalwood chips, fragrant',
  'Wax-sealed packets of rare spice',
  'Sharkskin leather, supple and tough',
  'A spool of gold-threaded cord',
  // ── Scrounged Valuables ──
  'Dented copper cups from a dead man\'s pack',
  'A fistful of bronze arrowheads',
  'Teeth from a bone necklace',
  'Belt buckles ripped from the fallen',
  'A cracked hand mirror, silver-backed',
  'Brass buttons off a soldier\'s coat',
  'Broken sword pommel, gem pried loose',
  'Horse tack, decent enough to sell',
  'A chipped obsidian knife',
  'Pewter flask, drained dry',
  'Lock of hair braided with silver wire',
  'Bone dice, loaded — worth extra to cheats',
  'Tin candle-holders, slightly bent',
  'A leather tool roll, half empty',
  'Glass beads strung on sinew',
  'Iron manacles, key included',
  'Tarnished silver hairpins',
  'Wooden prayer tokens, painted gold',
  'A waterstained map to nowhere useful',
  'Scrimshaw carvings on whale tooth',
  // ── Exotic & Evocative ──
  'Crocodile teeth — traders pay well for these',
  'Prayer beads, sold to the faithless',
  'A corsair\'s earring, crusted with salt',
  'Tiger claws strung on catgut',
  'Desert scorpion carapaces, alchemist bait',
  'Eagle talons wrapped in red cord',
  'A shrunken monkey paw, supposedly lucky',
  'Vulture feathers, prized by sorcerers',
  'Jackal pelts, poorly cured',
  'A necklace of river pearls, half real',
  'Lizard-skin pouch full of colored sand',
  'Stingray barbs, poisoner\'s stock',
  'A stoppered horn of fermented mare\'s milk',
  'Sun-bleached bones, claimed as relics',
  'Shark vertebrae, polished to buttons',
  'A bag of uncut garnets, mostly flawed',
  'Parrot plumage, bright and saleable',
  'Dried seahorse, eastern medicine',
  'A clay jar of honey, sealed with beeswax',
  'Carved antler toggles from the north'
];

const PLUNDER_ORIGINS = [
  'Shadizar', 'Aghrapur', 'Tarantia', 'Messantia', 'Khorshemish',
  'Luxur', 'Kordava', 'Belverus', 'Numalia', 'Sultanapur',
  'Zamboula', 'Khawarizm', 'Arenjun', 'Akbitana', 'Yaralet',
  'Khemi', 'Paikang', 'Ruo-Gen', 'Ayodhya', 'Punt',
  'Xuchotl', 'Xapur', 'Kuthchemes', 'Dagonia', 'Yezud',
  'Ianthe', 'Ophir', 'Eruk', 'Khor', 'Ghulistan',
  'Bamula', 'Zabhela', 'Xotalanc', 'Attalus', 'Haloga'
];

function generatePlunderDesc() {
  const loot = PLUNDER_LOOT[Math.floor(Math.random() * PLUNDER_LOOT.length)];
  const origin = PLUNDER_ORIGINS[Math.floor(Math.random() * PLUNDER_ORIGINS.length)];
  return `${loot}, from ${origin}`;
}

// ============================================================================
// SQUANDER SYSTEM — Between-tales plunder-to-XP progression
// ============================================================================

const SQUANDER_TIER_COSTS = [3, 3, 3, 6, 9, 12]; // cumulative: 3, 6, 9, 15, 24, 36

const SQUANDER_XP_BANDS = [
  { min: 1, max: 7, xp: 1 },
  { min: 8, max: 13, xp: 2 },
  { min: 14, max: 17, xp: 3 },
  { min: 18, max: 99, xp: 4 }
];

const SQUANDER_NAMES = {
  'from-the-hills': 'Revel',
  'from-the-streets': 'Spree',
  'from-the-steppes': 'Cavaliering',
  'from-the-north': 'Rampage',
  'from-the-wilds': 'Frenzy',
  'from-a-civilized-land': 'Indulgence',
  'from-parts-unknown': 'Perdition',
  'from-the-blood-of-jhebbal-sag': 'Bacchanalia',
  'from-the-blood-of-acheron': 'Ruination',
  'from-the-blood-of-a-demon': 'Blackrevel'
};

const SQUANDER_FLAVOR = {
  'from-the-hills': [
    "You find a place with low ceilings, strong drink, and the kind of clientele who carry blades to dinner.",
    "The tavern smells like blood and cheap wine. You grin. This is your kind of place.",
    "You've got blood money in your pocket and no intention of saving it. Tonight, the hills are far away."
  ],
  'from-the-streets': [
    "You've got more coin than you've ever held at once. Tomorrow it'll be gone — it always is.",
    "Tonight you're going to live like the men who used to kick you out of their doorways.",
    "The streets taught you everything except how to hold onto gold. Time to prove it."
  ],
  'from-the-steppes': [
    "You leave the city behind. Buy a skin of wine, saddle your horse, and ride until the walls are a smudge.",
    "Out here the sky is endless and your coin buys freedom — good provisions, fast company, a falcon if you can find one.",
    "The steppe doesn't care what you are. It only cares if you can ride."
  ],
  'from-the-north': [
    "The mead hall beckons. You kick the door open and roar for drink.",
    "You've gold to spend and a thirst that could drain the Vilayet Sea.",
    "Tonight you drink like a king of Vanaheim. Tomorrow the furniture pays the price."
  ],
  'from-the-wilds': [
    "The wild calls. You strip off civilization's trappings and answer.",
    "Something primal stirs in your blood. The coin means nothing — the night means everything.",
    "You vanish into the dark places between the firelight. When you return, you are changed."
  ],
  'from-a-civilized-land': [
    "You know exactly which wine to order and which lotus to smoke. Tonight, you indulge.",
    "The finer things call to you — silk, perfume, conversation sharp as any blade.",
    "Civilization has its pleasures, and you intend to sample every one of them."
  ],
  'from-parts-unknown': [
    "Nobody knows where you go on nights like these. Nobody asks.",
    "You disappear into the city's throat. What happens next is between you and the dark.",
    "When they ask where you were, you smile. That's answer enough."
  ],
  'from-the-blood-of-jhebbal-sag': [
    "The old blood sings. Tonight you honor it with excess worthy of the wild god.",
    "Jhebbal Sag's children feast without shame. So shall you.",
    "The sacred and the profane blur together. The old god approves."
  ],
  'from-the-blood-of-acheron': [
    "Ancient pleasures call from three thousand years of silence. You answer.",
    "The blood of dead sorcerer-kings burns in your veins. It demands satisfaction.",
    "What the priest-kings of Acheron did for power, you do for pleasure. The result is the same."
  ],
  'from-the-blood-of-a-demon': [
    "The demonic blood runs hot tonight. What follows will leave scorch marks.",
    "Hell has its own idea of a good time. You're about to find out what it is.",
    "When the demon blood sings, mortals run. You lean in."
  ]
};

// ── SQUANDER TABLES ──
// Each origin has glory[] and chaos[] arrays. Index 0 = roll 1-3, index 1 = roll 4, etc.
// Entries: { title, text, boons } — boons is mechanical effects text (empty string if none)

const SQUANDER_TABLES = {
  'from-the-hills': {
    glory: [
      { title: "Nothing Worth Telling", text: "You drank cheap wine in a back-alley tavern and watched the rats fight under the tables. The night offered nothing. You went to bed with a full belly and an empty head. Even your coin couldn't buy excitement tonight.", boons: "" },
      { title: "First Blood", text: "You found a fighting den and put a man on the floor in the opening round. Teeth scattered like dice. The crowd threw coins at your feet and you drank their health with a bloody grin.", boons: "" },
      { title: "The Doorway", text: "A woman with black hair and knowing hands pulled you into a doorway. What followed was worth twice what you paid. You left at dawn with bruises in interesting places and no regrets.", boons: "" },
      { title: "King of the Tavern", text: "You drank a merchant under his own table, then drank his bodyguard under the next. By midnight the room was yours. The barkeep called you \"my lord\" and meant it.", boons: "" },
      { title: "Arm-Breaker", text: "Arm-wrestling on the docks. You broke a sailor's grip and his pride in the same motion. His crew bought your drinks out of sheer terror. Nobody wanted to be next.", boons: "" },
      { title: "A Fair Kill", text: "You killed a man over a dice game. Fair fight — he drew first. Nobody mourned him. The tavern keeper helped drag the body to the alley and poured you a free one. These things happen south of the hills.", boons: "" },
      { title: "The Merchant's Wife", text: "Her husband was away on business. The wine was excellent, the bed was silk, and you were gone before sunrise with a gold bracelet she pressed into your hand and a kiss that tasted like conspiracy.", boons: "" },
      { title: "Spent Like a King", text: "You found the finest whorehouse in the district and spent like a man who expects to die tomorrow. They treated you like royalty. You left lighter in coin and heavier in satisfaction.", boons: "" },
      { title: "Alley Work", text: "A knife fight behind the tavern. You gave better than you got. The other man crawled away and you kept his purse. He started it. That's what you'll say if anyone asks.", boons: "" },
      { title: "Hillfolk", text: "You heard the old tongue across a crowded room. A fellow from the hills, far from home like you. You drank until dawn and sang songs that haven't been heard south of the passes in years. He knows people here.", boons: "Gain a hillfolk contact." },
      { title: "Soldiers' Table", text: "You drank with off-duty guards and played the dumb barbarian. They talked freely — rotations, bribes, which gates go unwatched. You remembered every word.", boons: "Gain a guard contact." },
      { title: "No Rules", text: "A pit fight with no referee and no mercy. You won with blood on your teeth and your boot on his neck. The pit boss liked what he saw.", boons: "Gain a fighting pit contact." },
      { title: "Thieves' Dice", text: "You gambled with cutpurses and won. They respected the audacity. One told you about a fence who pays well and asks nothing.", boons: "Gain a fence contact. Recover 1 plunder." },
      { title: "The Tournament", text: "Bare knuckles in a warehouse. You put down every man they sent. The prize was real. The blood was real. The woman who followed you home afterward was very real.", boons: "Recover 2 plunder." },
      { title: "The Old Killer", text: "A retired sellsword recognized something in you — the way you hold steel, maybe, or the way you watch doors. He shared a bottle and techniques that would cost years to learn by blood.", boons: "Gain a one-time combat bonus (+2 to one roll next tale)." },
      { title: "The Widow's Villa", text: "A wealthy woman — widow, merchant, minor noble, you didn't ask — took you to her home. Three days of wine, flesh, and feasting. She was very generous when you left.", boons: "Gain 1 treasure." },
      { title: "The Lord Who Likes Dangerous Men", text: "You drank with a man of power who needs problems solved quietly. The kind of work that pays in gold and silence. He liked what he saw in your eyes.", boons: "Gain a noble contact who deals in dirty work." },
      { title: "You Owned This City Tonight", text: "Fought, fucked, drank, and gambled your way through every quarter from dusk to dawn. Your name is on every tongue — the whores, the pit fighters, the watch, the thieves. You woke with gold in your fist and blood on your knuckles.", boons: "Gain 1 treasure + permanent reputation in this city." }
    ],
    chaos: [
      { title: "Dead Night", text: "You sat in a foul tavern nursing a single cup of something that tasted like goat piss. Wrong part of town, wrong night. Even the whores looked bored. You went to bed sober and angry. Your coin couldn't buy a good time tonight.", boons: "" },
      { title: "The Beating", text: "You picked a fight with a man built like a siege tower. The beating was thorough and educational. You woke up in the mud missing a boot. But you got one good hit in — felt his nose break under your fist. That's something.", boons: "Lose 7 HP." },
      { title: "The Lover's Toll", text: "She was beautiful, skilled, and expensive. When you woke she'd taken your purse, your knife, and your dignity. You're not even angry. She earned every coin.", boons: "" },
      { title: "Bad Dice", text: "You gambled like a fool. Lost everything, borrowed more, lost that too. You owe someone in this city now.", boons: "Lose 1 extra plunder." },
      { title: "Copper Wine", text: "You killed a man in a tavern. Not a fair fight — he came at you with a broken bottle and you opened his belly with your knife. No one cared. Someone dragged the body out. You kept drinking. The wine tasted like copper for the rest of the night.", boons: "" },
      { title: "Gutter Dawn", text: "Cheap wine, a dark alley, a whore who went through your pockets while you snored. You woke in the gutter with the sunrise in your eyes, your purse empty, and a headache like a war drum. But the night before — what you remember of it — was magnificent.", boons: "" },
      { title: "Loud Mouth", text: "Drunk and stupid, you insulted someone who mattered — a gang boss, a watch captain, someone with reach. The details are hazy but the threat was clear.", boons: "You've made an enemy in this city (GM's choice)." },
      { title: "Thrown Out", text: "The whorehouse threw you out for \"disturbing the merchandise.\" You'd spent everything and started arm-wrestling the bouncer. You lost. He threw you through the door into a rain puddle. You finished your song in the street. Beautifully.", boons: "" },
      { title: "The Chase", text: "A deal went wrong. A foot chase through black alleys, over walls, through someone's bedroom. You escaped with your skin but left your purse in the grip of a man whose face you'll remember. He'll remember yours.", boons: "" },
      { title: "Thieves' Welcome", text: "You drank with men who were sizing you up for a mark. They jumped you on the walk home. You broke two jaws and one of your own fingers before they scattered. They know your face now.", boons: "Gain a criminal rival who respects your fists." },
      { title: "The Debt", text: "Dice, wine, and bad decisions. You lost coin, dignity, and a bet you don't remember making. Someone in this city thinks you owe them something. It'll come up at the worst possible time.", boons: "Gain a debt (GM's choice)." },
      { title: "Marked", text: "A knife fight with a cutpurse. You won, but he carved you first — a slash across the ribs that'll scar nicely. The woman who stitched you up by candlelight had steady hands, a sharp tongue, and a price for silence.", boons: "Gain a healer contact. Lose 12 HP." },
      { title: "The Window", text: "You bedded someone you shouldn't have. Someone married to someone dangerous. The scramble out the window — naked, clutching your boots, three stories up — was the most alive you've felt in months.", boons: "Gain a jealous enemy. Lose 1 plunder." },
      { title: "Arrested", text: "A brawl with the city watch. You put two down before they swarmed you. The beating was professional. You spent two days in a cell and bribed your way out. But a grizzled sergeant respected your fight.", boons: "Gain a watch contact who'll look the other way. Lose 4 HP." },
      { title: "Foul Songs", text: "The watch caught you in a state of severe undress doing something obscene on the steps of a temple. The night in the cells wasn't bad — the drunk next to you knew every filthy song ever composed. You learned four. The priest is still furious.", boons: "Gain a petty criminal contact." },
      { title: "Shanghied", text: "You woke on a ship. An actual ship, three miles from port. The crew says you volunteered. Getting back cost you dearly. But the captain says you helped them steal something magnificent while blackout drunk.", boons: "Gain a ship captain contact + gain 1 treasure." },
      { title: "The Den", text: "A night that went wrong at every turn — robbed, stabbed, chased, stabbed again. But in the chaos you stumbled into a thieves' den. They let you live because you fought like a cornered wolf and they respect that.", boons: "Gain a thieves' guild contact. Lose half HP." },
      { title: "The Night That Nearly Killed You", text: "A brawl became a knife fight became a running battle through the streets. You left bodies behind. You took wounds that'll ache for weeks. But somewhere in the carnage you pulled something off a dead man's hand — something valuable, something old.", boons: "Gain 1 treasure + a scar + an enemy worth worrying about. Roll 2d6 — you have that many HP remaining." }
    ]
  },
  'from-the-streets': {
    glory: [
      { title: "Cold Shoulder", text: "You dressed up, walked into a decent establishment, and the doorman took one look at you and laughed. You spent your coin at the usual shithole instead. Even with gold in your pocket, the streets know what you are.", boons: "" },
      { title: "Buying Rounds", text: "You walked into the cheapest tavern in the Maul and bought drinks for every man and woman in the room. For one hour you were the most popular person in the district. Nobody will remember your name tomorrow but tonight they shouted it.", boons: "" },
      { title: "Silk For a Night", text: "You bought clothes you can't afford — Shemite silk, soft boots, a cloak that doesn't smell like the gutter. You wore them to a tavern where nobody recognized you. For one evening you weren't from the streets. It felt like lying. It felt wonderful.", boons: "" },
      { title: "The Good Stuff", text: "You bought the expensive wine — not the swill you're used to, the real thing. Ophirean red, served in a clean cup. You drank it slowly, tasting every coin. This is what they drink. This is what the money buys. Now you know.", boons: "" },
      { title: "Rat Baiting", text: "You bet heavy on the rat fights in a cellar under the tanner's shop. Picked a scrappy grey bastard that looked like you felt. He won three bouts before something bigger ate him. You broke even and drank to his memory.", boons: "" },
      { title: "The High Table", text: "You bribed your way into a gambling den above your station. Men in silk, women in jewels, and you in your best stolen coat. You lost coin but you sat at the table. You drank their wine and they didn't look down at you. Much.", boons: "" },
      { title: "Hired Company", text: "You paid for the best the house had — not a quick tumble in a back room but the full night. Clean sheets, perfumed skin, someone who pretended you mattered. In the morning you almost believed it. You left a bigger tip than you should have.", boons: "" },
      { title: "Lotus Night", text: "You bought the black lotus — the real thing, not the cut garbage they sell in the Maul. The dreams were vivid and strange and beautiful. You saw cities that don't exist and a version of yourself that never lived in the gutter. You woke up peaceful for the first time in years.", boons: "" },
      { title: "The Feast", text: "You rented a room at an inn above your means, ordered food you couldn't pronounce, and ate until you couldn't move. Roast lamb, honeyed figs, bread that wasn't stale. Your stomach ached afterward. You didn't care. This is how the other half lives.", boons: "" },
      { title: "Street King", text: "You went back to the old neighborhood and spent like a lord. Bought food for the beggars, drinks for the street kids, paid off a whore's debt to her madam. For one night you were the one they looked up to. One of the kids reminded you of yourself.", boons: "Gain a street urchin contact — loyal eyes and ears." },
      { title: "Lucky Dice", text: "A high-stakes game in the back of a wine shop. You threw coin on the table like it meant nothing — because tonight it didn't. The dice loved you. You walked out even and drunk, which for this kind of game counts as winning.", boons: "Gain a gambler contact who respects your nerve." },
      { title: "Above Your Station", text: "You spent enough to get into a place where nobles drink. They thought you were amusing — the clever street rat with quick hands and a sharp tongue. One of them liked you enough to keep talking.", boons: "Gain a minor noble contact who finds the lower classes entertaining." },
      { title: "The Debt Paid", text: "You found someone you owed — an old debt, the kind that weighs on you. You paid it in full, in gold, and watched their face change. It cost you more than it should have. You feel lighter than you have in months.", boons: "Recover 1 plunder (karma)." },
      { title: "The Courtesan", text: "You spent a fortune on a woman who serves lords and merchants. She was worth every coin — not just the body but the conversation. She told you things about powerful men that powerful men don't want known.", boons: "Gain a courtesan contact with ears in the halls of power." },
      { title: "The Fixer", text: "You threw money around the right tavern and caught the attention of a man who makes problems disappear. He sat with you, drank your wine, and told you plainly — you spend like someone worth knowing.", boons: "Gain a one-time combat bonus (+2 to one roll next tale) and a fixer contact." },
      { title: "The Big Game", text: "You bought into a game you had no business sitting at. Merchants, smugglers, a man who might have been a guild boss. You played with coin you couldn't afford to lose and the dice didn't care about your station. You won.", boons: "Gain 1 treasure." },
      { title: "Living Large", text: "You rented a villa for three days. Hired servants. Bought wine by the cask. Invited every thief, whore, and gutter-runner you knew and threw the kind of party that the streets will talk about for years. A guild lieutenant came uninvited — and was impressed.", boons: "Gain a thieves' guild contact." },
      { title: "The Night You Were Somebody", text: "You burned through more coin than most street rats see in a lifetime. Gambling dens, lotus smoke, silk sheets, hired muscle at the door of a party YOU threw. By dawn, people who wouldn't have spat on you last week were calling you by name. You woke up broke, smiling, and known.", boons: "Gain 1 treasure + permanent reputation — you're no longer just another gutter rat." }
    ],
    chaos: [
      { title: "Turned Away", text: "You tried to spend your coin at three different establishments and all three took one look at you and shut the door. The streets don't forget where you come from just because your pockets are full. You drank alone at a stall and fed the scraps to a stray dog. Even the dog left.", boons: "" },
      { title: "Flashing Coin", text: "You spent too loudly in the wrong part of town. Two men followed you into an alley and beat the purse off you. You got a few hits in but they were professionals and you were drunk. They left you your teeth as a courtesy.", boons: "Lose 7 HP." },
      { title: "The Setup", text: "She was beautiful and she laughed at everything you said. You spent lavishly — the good wine, the private room, the full night. She drugged your cup around midnight. You woke up in your smallclothes in an alley with nothing but a headache and the memory of her perfume.", boons: "" },
      { title: "Chasing Losses", text: "The dice game started well. Then it didn't. You kept doubling down because that's what the money was for, right? By the time you stopped you'd burned through everything and then some. The house man is patient but he keeps a ledger.", boons: "Lose 1 extra plunder." },
      { title: "Too Rich For Your Blood", text: "You bought into a card game above your station. The players were polite, the wine was excellent, and they systematically took every coin you had with the efficiency of men who've been separating fools from money since before you were born. You learned nothing except that you are not one of them.", boons: "" },
      { title: "Lotus Sickness", text: "You bought the black lotus and smoked too much of it. The dreams turned dark — serpents, drowning, a face you didn't want to see. You woke in the den two days later, lighter in coin and heavier in shadow. The den keeper says you screamed.", boons: "" },
      { title: "Wrong Crowd", text: "You threw money around trying to impress people who turned out to be connected to a local gang. They smiled, drank your wine, and now they think you have more where that came from. They'll be visiting.", boons: "Gain an enemy — a gang that thinks you're worth shaking down." },
      { title: "The Counterfeit", text: "You paid for an expensive night with coin that turned out to be partly counterfeit — mixed in with your plunder from the last score. The whorehouse madam noticed. The beating from her bouncers was impersonal but thorough. You're not welcome back.", boons: "" },
      { title: "Evicted", text: "You rented a room at a fine inn, ordered the best of everything, and by midnight the innkeeper realized what you were. The eviction was loud, public, and involved two large men and a flight of stairs. Your silk shirt tore on the way down.", boons: "" },
      { title: "Marked", text: "You spent too freely and a pickpocket crew took notice — not as a mark but as competition. Who is this gutter rat with heavy pockets? They want to know where you got it. They'll be asking around.", boons: "Gain a rival crew who wants your source." },
      { title: "The Bad Bet", text: "You put heavy coin on a pit fight — the wrong fighter. Lost everything in the first round. The pit boss offered to lend you more at interest. You were drunk enough to accept.", boons: "Gain a debt to a pit boss (GM's choice)." },
      { title: "Mugged", text: "Walking home flush and drunk through the Maul. They came out of a doorway — three of them with knives. You fought but the wine made you slow. They took everything and left you with a gash across the ribs that'll remind you to stay sober in dark alleys.", boons: "Gain a street healer contact (the one who stitched you). Lose 12 HP." },
      { title: "The Wrong Bed", text: "You spent a fortune on a courtesan who belonged to someone important. He found out. The men he sent were polite but firm. They took back every coin and made it clear that if your face is seen in this district again, it won't be attached to your head.", boons: "Gain a powerful enemy. Lose 1 plunder." },
      { title: "Busted", text: "The watch spotted you spending more than a street rat should and decided to ask questions. The cell was cold, the interrogation was thorough, and the bribe to get out cost more than the entire night. A certain watchman now has your name in a ledger.", boons: "Gain a corrupt watch contact who knows your business. Lose 4 HP." },
      { title: "Lotus Debt", text: "Three days in a lotus den. You went in with a full purse and came out hollow-eyed, broke, and owing the den keeper for two days you don't remember. He's patient. He's also connected. The dreams were worth it — you think.", boons: "Gain a lotus den contact who'll extend credit you shouldn't take." },
      { title: "The Heist Party", text: "You threw a party so wild it drew the attention of the city watch, a guild enforcer, AND a jealous lover of someone you shouldn't have touched. The resulting chaos involved a rooftop chase, a canal swim, and a hiding spot under a fish cart until dawn. But in the confusion someone dropped something valuable and you're the one who picked it up.", boons: "Gain 1 treasure + gain an enemy." },
      { title: "Spending Spree Gone Wrong", text: "You spent like a king and drew the wrong eyes. A guild crew decided that anyone throwing gold like that either stole it from them or owes them a cut. The conversation in the alley went badly. Very badly. You survived because you're fast and the canal was close. Someone in the guild spoke up for you after — said you had guts.", boons: "Gain a guild contact. Lose half HP." },
      { title: "The Night the Money Ran Red", text: "You burned through a fortune in one glorious, stupid night. Then someone decided you'd burned through THEIR fortune. The knife found your back in a wine shop. You crawled out, bled through two districts, and collapsed in the doorway of a woman who owed you from the old days. She cauterized the wound with a heated blade and hid you for three days while they searched. On the dead man who started it — there was something in his coat worth more than everything you'd spent.", boons: "Gain 1 treasure + a contact (the woman who saved you) + an enemy (whoever sent the knife). Roll 2d6 — you have that many HP remaining." }
    ]
  },
  'from-the-steppes': {
    glory: [
      { title: "Bad Provisions", text: "You paid too much for stale bread, sour wine, and a waterskin that leaks. The ride was short, the campfire was cold, and you were back inside the walls by morning. Even the horse looked disappointed.", boons: "" },
      { title: "The Long Ride", text: "You bought good wine and rode until the city was gone. No destination, no plan, just the wind and the sound of hooves. You drank under the stars and slept in the grass. The simplest night you've had in months and the best.", boons: "" },
      { title: "The Falcon", text: "You spent a small fortune on a hunting falcon from a Hyrkanian trader — half-trained, mean-eyed, magnificent. She sat your wrist like she was born there. You hunted hares across the flats and ate them roasted over a fire you built yourself.", boons: "" },
      { title: "Koumiss and Firelight", text: "You found a nomad camp and bought your way in with wine and silver. They shared their koumiss — sour, strong, and perfect. You drank with strangers under a sky so wide it made the city feel like a cage.", boons: "" },
      { title: "The Race", text: "You bet heavy on a horse race between camps — your mount against a nomad's mare. You lost by a length but the ride was the fastest you've felt in years. The wind took your coin but it gave you something better.", boons: "" },
      { title: "Saddle Company", text: "You hired a rider — beautiful, willing, and expensive. Three days on the steppe, two horses, one bedroll. The nights were warm and the days were free. When you parted they kissed you once and rode east without looking back.", boons: "" },
      { title: "The Hunt", text: "You bought provisions for a week and rode into the grasslands to hunt. Antelope on the second day — a clean shot from the saddle at full gallop. You roasted the meat over thornwood and ate like a king with dirt on your hands. This is what the money is for.", boons: "" },
      { title: "The Caravan", text: "You spent coin at a merchant caravan camped at a crossroads — Turanian silks, Iranistani spices, wine from places you can't pronounce. You overpaid for everything and drank with the caravan guards until the fire burned low. They travel far and hear things.", boons: "" },
      { title: "Archery Contest", text: "You threw coin into an archery contest between riders at a waystation. Shot from horseback at full gallop — three targets, three hits. The nomads stopped laughing at the city-dweller after the second. You drank their koumiss as a prize.", boons: "" },
      { title: "The Old Rider", text: "A grey-haired nomad shared your campfire. He'd ridden from the Vilayet to the Eastern Desert and back in his youth. He told you about routes, water holes, and places where caravans vanish. Knowledge only the steppe gives.", boons: "Gain a nomad contact who knows every trail." },
      { title: "Horse Trading", text: "You spent a day at a nomad horse market, drinking and haggling. Didn't buy — nothing matched your mount — but the breeders respected your eye. One offered to remember your name for next season.", boons: "Gain a horse breeder contact." },
      { title: "The Feast", text: "You bought a cask of wine and a whole lamb and hosted a feast for a nomad clan. They ate your food, drank your wine, and by dawn they'd adopted you as a friend of the tribe. Out here that means something — it means safety, shelter, and fresh horses when you need them.", boons: "Gain a nomad clan contact." },
      { title: "The Wager", text: "A riding contest with a nomad chief's son — a full day's race across open steppe, no trail, no rules. You rode your horse half to death and won by the length of your shadow at sunset. The chief was impressed.", boons: "Recover 1 plunder in gifts from the clan." },
      { title: "The Falconer", text: "You spent days with a Hyrkanian falconer, buying his time and his knowledge. By the end your bird flew true and returned to your wrist like she was part of your arm. He told you the falcon sees what the rider cannot — enemies, water, prey.", boons: "Gain a one-time combat bonus (+2 to one roll next tale) and a falconer contact." },
      { title: "Star Reader", text: "A night with a steppe shaman who read the sky like a book. You paid in wine and silver for what she told you — the stars have positions, and those positions mean things. You don't understand all of it. You understand enough.", boons: "Gain a shaman contact who sees things others don't." },
      { title: "The Wild Herd", text: "You rode out alone and found a wild horse herd on the open steppe. Three days of riding, patience, and more coin spent on rope and provisions than you'd like to admit. You broke a stallion that fought you every step. He's yours now — and he's magnificent.", boons: "Gain 1 treasure (the horse is worth a fortune)." },
      { title: "Blood Oath", text: "A nomad chief invited you to ride with his war band for a raid on a rival clan's herds. You spent everything on supplies and weapons for the ride. It was fast, brutal, and glorious. By the end the chief cut his palm and pressed it to yours. You are blood now.", boons: "Gain a war chief contact — when he calls, you ride. When you call, he rides." },
      { title: "Lord of the Steppe", text: "A week on the grasslands. You bought provisions for twenty riders, hosted three feasts, won a horse race, bedded the most beautiful rider east of the Vilayet, and hunted a lion from the saddle. The nomad camps are singing your name. When you ride back to the city you feel like a man returning to a cage.", boons: "Gain 1 treasure + permanent reputation among the steppe peoples." }
    ],
    chaos: [
      { title: "Lame Horse", text: "Your mount threw a shoe an hour out of the city. You spent half the day walking back, leading a limping horse, with the steppe mocking you from the horizon. The provisions spoiled in the heat. You never even made it to the grasslands.", boons: "" },
      { title: "Thrown", text: "Your horse spooked at a snake and threw you hard. You hit the ground like a sack of grain and the bastard bolted. You walked three miles to catch him, bruised from hip to shoulder and spitting dirt. The steppe doesn't care about your dignity.", boons: "Lose 7 HP." },
      { title: "Horse Thief", text: "You made camp, drank wine, and slept like the dead. When you woke your horse was gone — and so was your saddle, your spare boots, and the woman you'd paid to ride with you. She took everything that wasn't strapped to your body. You walked back to the city barefoot.", boons: "" },
      { title: "Bad Trade", text: "You bought a falcon from a trader who swore it was trained. It wasn't. The bird took a chunk out of your hand, ate your provisions, and flew away the moment you unhooded it. The trader is long gone.", boons: "Lose 1 extra plunder." },
      { title: "The Storm", text: "A steppe storm rolled in without warning — black sky, horizontal rain, wind that flattened the grass. Your fire drowned, your provisions soaked through, and you spent the night in a ditch with your horse standing over you. By morning everything you'd bought was ruined.", boons: "" },
      { title: "Koumiss Sickness", text: "The nomads shared their fermented mare's milk. You drank too much trying to keep up. What followed was two days of violent illness in a nomad tent while old women laughed at you and children poked your ribs. You survived. Your pride did not.", boons: "" },
      { title: "Unwelcome Guest", text: "You rode into a nomad camp with wine and silver, expecting hospitality. The chief took one look at you and spat. Wrong tribe. Wrong season. Wrong offering. They took your wine as an insult tax and told you to ride until you couldn't see their fires.", boons: "Gain an enemy — a nomad clan that remembers your face." },
      { title: "The Race You Lost", text: "You bet everything on a horse race against a nomad girl half your age. She beat you so badly the entire camp laughed for an hour. You drank their koumiss, smiled through it, and rode home poorer and humbler. She was magnificent. You were not.", boons: "" },
      { title: "Wolf Night", text: "Wolves found your camp. Your horse screamed and bolted. You spent the night in a tree with nothing but a knife and your wineskin, listening to them circle below. By dawn they were gone. So was your horse. You found him a mile away, shaking. The provisions were scattered and eaten.", boons: "" },
      { title: "The Cheat", text: "You gambled with nomad riders and lost — not to luck but to a coordinated cheat. Two of them worked you from both sides while a third watched your tells. By the time you realized it, your coin was distributed across three different saddlebags. They're probably still laughing.", boons: "Gain a rival nomad band who'll try it again." },
      { title: "Sandstorm", text: "You rode too far east and the steppe turned to dust. A sandstorm buried you for a day. You drank your wine just to keep water in your body and your horse nearly died. Getting back cost you everything you'd brought.", boons: "Gain a debt — you owe a water trader for saving your horse." },
      { title: "Bandits", text: "A raiding party caught you alone on the steppe. Four riders, fast and armed. You fought from the saddle — killed one, wounded another — but they unhorsed you and took everything. The fall cracked ribs. A passing merchant found you and stitched what he could.", boons: "Gain a caravan merchant contact. Lose 12 HP." },
      { title: "The Wrong Woman", text: "She rode with you for three days and three nights. Beautiful, wild, everything the steppe promises. Then her husband showed up with six armed riders. The negotiation cost you every coin you had and the fastest ride of your life. He's still looking for you.", boons: "Gain a jealous husband enemy. Lose 1 plunder." },
      { title: "Border Patrol", text: "Turanian cavalry stopped you on the edge of their territory. Your papers were wrong — or you didn't have any. The beating was efficient and the cell in their outpost was a hole in the ground. You bribed your way out with everything you had left. One of the soldiers was sympathetic — he rides the steppe too.", boons: "Gain a Turanian soldier contact. Lose 4 HP." },
      { title: "The Shaman's Price", text: "You sought a steppe shaman for wisdom. She demanded payment — not coin but blood. A ritual under the stars, a knife across your palm, smoke that made the sky spin. What she told you may have been prophecy or poison-dream. Either way, you'll remember it.", boons: "Gain a shaman contact who speaks in riddles." },
      { title: "Stampede", text: "You rode too close to a wild horse herd and they bolted — with you in the middle. Miles of thundering hooves and blind terror. Your mount kept its feet by a miracle. When it was over you found yourself in a valley you've never seen, clutching the mane of a horse that should be dead. In the valley — an old camp, abandoned, and in the ashes something that gleamed.", boons: "Gain 1 treasure + gain an enemy (whatever drove the last camp away)." },
      { title: "Raided", text: "You rode with nomads who hit a caravan. It was supposed to be easy — merchants, light guard. The guard wasn't light. Turanian regulars, armed and angry. The fight was a disaster. You took an arrow pulling a wounded rider to safety. The clan remembers what you did.", boons: "Gain a blood-sworn nomad contact. Lose half HP." },
      { title: "Left For Dead", text: "Three days from the city, raiders caught you alone. They beat you, took everything, and left you for the vultures. You crawled to a creek and drank mud-water until a nomad herder found you and dragged you to his camp. His daughter nursed you for a week. On the lead raider's horse — which the herder caught wandering — there was something in the saddlebag that the raider had killed for. Now it's yours.", boons: "Gain 1 treasure + a contact (the herder's family) + an enemy (the raider band). Roll 2d6 — you have that many HP remaining." }
    ]
  }
};

// Track which origins have full tables vs stubs
const SQUANDER_COMPLETE_ORIGINS = new Set(Object.keys(SQUANDER_TABLES));

// Stub tables for origins not yet written
const SQUANDER_STUB_ENTRY = { title: "A Night to Remember", text: "The details are hazy, but the coin is gone and you have stories to tell. The specifics will come in time — for now, the plunder is spent and the experience is earned.", boons: "" };
for (const originId of Object.keys(SQUANDER_NAMES)) {
  if (!SQUANDER_TABLES[originId]) {
    const stubEntries = Array(18).fill(SQUANDER_STUB_ENTRY);
    SQUANDER_TABLES[originId] = { glory: [...stubEntries], chaos: [...stubEntries] };
  }
}

export default class ConanActorSheet2 extends ActorSheet {
  
  /** @override */
  static get defaultOptions() {
    return mergeObject(super.defaultOptions, {
      classes: ["conan", "sheet", "actor", "sheet2"],
      template: "systems/conan/sheet2/actor-sheet2.hbs",
      width: 545,
      height: 730,
      tabs: [] // We handle tabs manually
    });
  }

  /** Track active tab internally */
  _activeTab = "home";

  /** Track previous tab for double-click navigation */
  _previousTab = "home";

  /** Track character info view mode */
  _charInfoMode = "front"; // "front" or "bts"

  /** Track trio info view mode */
  _trioInfoMode = "front"; // "front" or "bts"

  /** Track open recovery dialog */
  _openRecoveryDialog = null;
  _openRecoveryIconIndex = null;

  /** Track open weapon edit panel */
  _openWeaponPanelId = null;

  /** Track open spell edit panel */
  _openSpellPanelId = null;

  /** Track which discipline sections are expanded */
  _expandedDisciplines = new Set();

  /** Track selected discipline in invoke menu */
  _selectedDiscipline = null;

  /** Track selected spell in invoke menu */
  _selectedSpellId = null;

  /** Track scroll position to preserve across re-renders */
  _scrollPosition = 0;

  /**
   * Save current scroll position before updates
   */
  _saveScrollPosition() {
    const content = this.element?.find('.sheet2-swapArea')?.[0];
    if (content) {
      this._scrollPosition = content.scrollTop;
    }
  }

  /**
   * Restore scroll position after re-render
   */
  _restoreScrollPosition(html) {
    const content = html.find('.sheet2-swapArea')[0];
    if (content && this._scrollPosition) {
      content.scrollTop = this._scrollPosition;
    }
  }

  /**
   * Clear all custom tooltips from the DOM
   * Called when panels close, tabs change, or elements become hidden
   */
  _clearAllTooltips() {
    $('.custom-tooltip').remove();
    $('.spell-cast-tooltip').remove();
  }

  /** @override */
  async close(options = {}) {
    // Trigger blur on any focused inputs to ensure pending changes are saved
    const focusedEl = this.element?.find(':focus');
    if (focusedEl?.length) {
      focusedEl.trigger('blur');
      // Wait a tick for the blur handler to complete
      await new Promise(resolve => setTimeout(resolve, 50));
    }
    // Clean up any lingering tooltips when the sheet closes
    this._clearAllTooltips();
    return super.close(options);
  }

  /** Static cache for quotes (shared across all instances) */
  static _quotesCache = null;

  /**
   * Load quotes from JSON file (cached)
   * @returns {Array} Array of quote objects
   */
  static async _loadQuotes() {
    if (ConanActorSheet2._quotesCache) {
      return ConanActorSheet2._quotesCache;
    }
    try {
      const response = await fetch('systems/conan/conan-quotes.json');
      const data = await response.json();
      ConanActorSheet2._quotesCache = data.quotes || [];
      return ConanActorSheet2._quotesCache;
    } catch (error) {
      console.error('Conan | Failed to load quotes:', error);
      // Fallback quote
      return [{
        text: "Hither came Conan, the Cimmerian, black-haired, sullen-eyed, sword in hand.",
        source: "Robert E. Howard, \"The Phoenix on the Sword\""
      }];
    }
  }

  /**
   * Get a random quote from the cache
   * @returns {Object} Random quote object with text and source
   */
  _getRandomQuote() {
    const quotes = ConanActorSheet2._quotesCache || [];
    if (quotes.length === 0) {
      return {
        text: "Hither came Conan, the Cimmerian, black-haired, sullen-eyed, sword in hand.",
        source: "Robert E. Howard, \"The Phoenix on the Sword\""
      };
    }
    const randomIndex = Math.floor(Math.random() * quotes.length);
    return quotes[randomIndex];
  }

  /** @override */
  getData() {
    const context = super.getData();
    const actorData = this.actor.toObject(false);
    context.system = actorData.system;
    context.config = CONFIG.CONAN;

    // Ensure XP tracking exists
    if (!context.system.xp || context.system.xp.available === undefined) {
      const defaultXP = [true, true, true, false, false, false, false, false, false, false];
      context.system.xp = { available: defaultXP };
    } else {
      // Normalize to array if Foundry converted to object
      let xpData = context.system.xp.available;
      if (!Array.isArray(xpData)) {
        const normalized = [];
        for (let i = 0; i < 10; i++) {
          normalized[i] = xpData[i] === true || xpData[String(i)] === true;
        }
        context.system.xp.available = normalized;
      }
    }
    
    // Initialize armor system if missing
    if (!context.system.armorEquipped) {
      context.system.armorEquipped = {
        type: "unarmored",
        shield: false,
        description: this._getArmorDescription("unarmored", false)
      };
    }

    // Initialize inventory system if missing
    if (!context.system.inventory) {
      context.system.inventory = {};
    }

    // Initialize mount system if missing (pre-existing actors)
    if (!context.system.mount) {
      context.system.mount = { type: null, name: '', saddlebag: {} };
    }

    // Initialize journal system if missing
    if (!context.system.journal) {
      context.system.journal = {
        activePage: 1,
        pages: { "1": { content: "" } }
      };
    }
    if (!context.system.journal.pages) {
      context.system.journal.pages = { "1": { content: "" } };
    }
    if (!context.system.journal.activePage) {
      context.system.journal.activePage = 1;
    }

    // Prepare journal pages for template
    const journalPages = {};
    const activePage = context.system.journal.activePage;
    const sortedPageNums = Object.keys(context.system.journal.pages).map(n => parseInt(n)).sort((a, b) => a - b);
    for (const num of sortedPageNums) {
      journalPages[num] = {
        subject: context.system.journal.pages[num]?.subject || "",
        content: context.system.journal.pages[num]?.content || "",
        active: num === activePage
      };
    }
    context.journalPages = journalPages;
    context.activePageContent = context.system.journal.pages[activePage]?.content || "";
    context.activePageSubject = context.system.journal.pages[activePage]?.subject || "";
    context.canDeletePage = sortedPageNums.length > 1;

    // Check if badges page is active (special value "badges")
    context.badgesPageActive = (activePage === "badges");

    // Initialize recovery system if missing
    if (!context.system.recovery) {
      context.system.recovery = {
        used1: false,
        used2: false
      };
    }

    // Initialize initiative system if missing
    if (!context.system.initiative) {
      context.system.initiative = {
        value: null,
        locked: true
      };
    }
    // Default initiative locked to true if undefined
    if (context.system.initiative.locked === undefined) {
      context.system.initiative.locked = true;
    }

    // Initialize flex die if missing
    if (!context.system.flex) {
      context.system.flex = {
        die: 'd10'
      };
    }

    // ========================================
    // LEGENDARY SKILLS DETECTION & BONUSES
    // ========================================
    // Scan all skills once and track which legendary skills are present
    const skills = context.system.skills || {};

    // Skill detection flags
    let hasImprovedFlex = false;
    let hasImprovedFlexII = false;
    let hasCombatReadiness = false;
    let hasCombatReadinessII = false;
    let hasToughSouled = false;
    let hasSteelTrapReflexes = false;
    let hasSteelTrapReflexesII = false;
    let hasSteelThews = false;
    let hasSteelThewsII = false;
    let hasStudious = false;
    let hasStudiousII = false;
    let hasWhaleboneAndGristle = false;
    let hasWhaleboneAndGristleII = false;
    let hasDetermined = false;
    let hasDeterminedII = false;
    let hasMighty = false;
    let hasMightyII = false;
    let hasSharpness = false;
    let hasSharpnessII = false;
    let hasWise = false;
    let hasWiseII = false;
    let hasFierceStrokes = false;
    let hasFierceShots = false;
    let hasFierceMind = false;
    let hasHardy = false;
    let hasBlocker = false;
    let hasImpalingThrow = false;
    let hasSacrificeArmor = false;
    let hasUnseenStrike = false;
    let hasMurderousFrenzy = false;
    let hasPoisoner = false;
    let hasEagleEyed = false;
    let hasEagleEyedII = false;
    let hasIronHide = false;
    let hasIronHideII = false;
    let hasUncannyWarding = false;
    let hasUncannyWardingII = false;
    let hasInfamy = false;
    let hasPantherish = false;
    let hasCharge = false;
    let hasDefender = false;
    let hasFleetFooted = false;
    let hasHitAndRun = false;
    let hasOfTheShadows = false;
    let hasLotusBlood = false;
    let hasLeaderOfMen = false;
    let hasProtector = false;
    let hasSoldiersEndurance = false;
    let hasSorcerousVigor = false;
    let hasAdeptSorcerer = false;
    let hasResilient = false;
    let hasWideArc = false;
    let hasLegendarySwordArm = false;
    let hasSharpshooter = false;
    let hasLegendary = false;
    let legendarySkillId = null;

    for (const skill of Object.values(skills)) {
      const skillName = skill.name?.toLowerCase() || '';
      // Flex skills
      if (skillName === 'improved flex') hasImprovedFlex = true;
      if (skillName === 'improved flex ii') hasImprovedFlexII = true;
      // Initiative skills
      if (skillName === 'combat readiness') hasCombatReadiness = true;
      if (skillName === 'combat readiness ii') hasCombatReadinessII = true;
      // Defense skills
      if (skillName === 'tough-souled' || skillName === 'tough souled') hasToughSouled = true;
      if (skillName === 'blocker') hasBlocker = true;
      // Stat value bonus skills (+1 to stat)
      if (skillName === 'steel trap reflexes') hasSteelTrapReflexes = true;
      if (skillName === 'steel trap reflexes ii') hasSteelTrapReflexesII = true;
      if (skillName === 'steely thews') hasSteelThews = true;
      if (skillName === 'steely thews ii') hasSteelThewsII = true;
      if (skillName === 'studious') hasStudious = true;
      if (skillName === 'studious ii') hasStudiousII = true;
      if (skillName === 'whalebone and gristle') hasWhaleboneAndGristle = true;
      if (skillName === 'whalebone and gristle ii') hasWhaleboneAndGristleII = true;
      // Stat die upgrade skills
      if (skillName === 'determined') hasDetermined = true;
      if (skillName === 'determined ii') hasDeterminedII = true;
      if (skillName === 'mighty') hasMighty = true;
      if (skillName === 'mighty ii') hasMightyII = true;
      if (skillName === 'sharpness') hasSharpness = true;
      if (skillName === 'sharpness ii') hasSharpnessII = true;
      if (skillName === 'wise') hasWise = true;
      if (skillName === 'wise ii') hasWiseII = true;
      // Combat advantage skills
      if (skillName === 'fierce strokes') hasFierceStrokes = true;
      if (skillName === 'fierce shots') hasFierceShots = true;
      if (skillName === 'fierce mind') hasFierceMind = true;
      // Combat skills (Arms column)
      if (skillName === 'impaling throw') hasImpalingThrow = true;
      if (skillName === 'sacrifice armor') hasSacrificeArmor = true;
      if (skillName === 'unseen strike') hasUnseenStrike = true;
      if (skillName === 'murderous frenzy') hasMurderousFrenzy = true;
      if (skillName === 'poisoner') hasPoisoner = true;
      if (skillName === 'eagle-eyed' || skillName === 'eagle eyed') hasEagleEyed = true;
      if (skillName === 'eagle-eyed ii' || skillName === 'eagle eyed ii') hasEagleEyedII = true;
      if (skillName === 'wide arc' || skillName === 'wide-arc') hasWideArc = true;
      // LP bonus skills
      if (skillName === 'iron hide' || skillName === 'iron-hide') hasIronHide = true;
      if (skillName === 'iron hide ii' || skillName === 'iron-hide ii') hasIronHideII = true;
      // Sorcery defense skills
      if (skillName === 'uncanny warding' || skillName === 'uncanny-warding') hasUncannyWarding = true;
      if (skillName === 'uncanny warding ii' || skillName === 'uncanny-warding ii') hasUncannyWardingII = true;
      // Sorcery casting skills
      if (skillName === 'lotus blood' || skillName === 'lotus-blood') hasLotusBlood = true;
      if (skillName === 'sorcerous vigor' || skillName === 'sorcerous-vigor') hasSorcerousVigor = true;
      if (skillName === 'adept sorcerer' || skillName === 'adept-sorcerer') hasAdeptSorcerer = true;
      // Check modifier skills (Home tab row)
      if (skillName === 'infamy') hasInfamy = true;
      if (skillName === 'pantherish') hasPantherish = true;
      // Movement/Action skills
      if (skillName === 'charge') hasCharge = true;
      // Stance skills
      if (skillName === 'defender') hasDefender = true;
      // Movement skills
      if (skillName === 'fleet footed' || skillName === 'fleet-footed') hasFleetFooted = true;
      if (skillName === 'hit and run' || skillName === 'hit-and-run') hasHitAndRun = true;
      // Stealth/Detection skills
      if (skillName === 'of the shadows' || skillName === 'of-the-shadows') hasOfTheShadows = true;
      // Leadership skills
      if (skillName === 'leader of men' || skillName === 'leader-of-men') hasLeaderOfMen = true;
      if (skillName === 'protector') hasProtector = true;
      // Recovery skills
      if (skillName === 'hardy') hasHardy = true;
      if (skillName === 'resilient') hasResilient = true;
      // Armor skills
      if (skillName === "soldier's endurance" || skillName === 'soldiers endurance') hasSoldiersEndurance = true;
      // Bonus attack skills (legendary tier)
      if (skillName === 'legendary sword arm' || skillName === 'legendary-sword-arm') hasLegendarySwordArm = true;
      if (skillName === 'sharpshooter') hasSharpshooter = true;
      // Legendary skill (+1 to chosen stat)
      if (skillName === 'legendary') {
        hasLegendary = true;
        legendarySkillId = Object.keys(skills).find(k => skills[k] === skill);
      }
    }

    // ----------------------------------------
    // STAT VALUE BONUSES (added to base stat)
    // ----------------------------------------
    let edgeSkillBonus = 0;
    let mightSkillBonus = 0;
    let witsSkillBonus = 0;
    let gritSkillBonus = 0;

    if (hasSteelTrapReflexes) edgeSkillBonus += 1;
    if (hasSteelTrapReflexesII) edgeSkillBonus += 1;
    if (hasSteelThews) mightSkillBonus += 1;
    if (hasSteelThewsII) mightSkillBonus += 1;
    if (hasStudious) witsSkillBonus += 1;
    if (hasStudiousII) witsSkillBonus += 1;
    if (hasWhaleboneAndGristle) gritSkillBonus += 1;
    if (hasWhaleboneAndGristleII) gritSkillBonus += 1;

    // Legendary skill bonus (+1 to player-chosen stat)
    const legendaryTargetStat = context.system.legendary?.stat || null;
    if (hasLegendary && legendaryTargetStat) {
      if (legendaryTargetStat === 'might') mightSkillBonus += 1;
      else if (legendaryTargetStat === 'edge') edgeSkillBonus += 1;
      else if (legendaryTargetStat === 'wits') witsSkillBonus += 1;
      else if (legendaryTargetStat === 'grit') gritSkillBonus += 1;
    }

    // Store skill bonuses for display (these are added on top of base stats)
    context.edgeSkillBonus = edgeSkillBonus;
    context.mightSkillBonus = mightSkillBonus;
    context.witsSkillBonus = witsSkillBonus;
    context.gritSkillBonus = gritSkillBonus;

    // Stat bonus skill flags for passive icons (highest version only)
    context.hasSteelThews = hasSteelThews || hasSteelThewsII;
    context.hasSteelThewsII = hasSteelThewsII;
    context.hasSteelTrapReflexes = hasSteelTrapReflexes || hasSteelTrapReflexesII;
    context.hasSteelTrapReflexesII = hasSteelTrapReflexesII;
    context.hasStudious = hasStudious || hasStudiousII;
    context.hasStudiousII = hasStudiousII;
    context.hasWhaleboneAndGristle = hasWhaleboneAndGristle || hasWhaleboneAndGristleII;
    context.hasWhaleboneAndGristleII = hasWhaleboneAndGristleII;

    // Calculate effective stat values (base + skill bonus)
    const baseEdge = context.system.attributes?.edge?.value || 0;
    const baseMight = context.system.attributes?.might?.value || 0;
    const baseWits = context.system.attributes?.wits?.value || 0;
    const baseGrit = context.system.attributes?.grit?.value || 0;

    context.effectiveEdge = baseEdge + edgeSkillBonus;
    context.effectiveMight = baseMight + mightSkillBonus;
    context.effectiveWits = baseWits + witsSkillBonus;
    context.effectiveGrit = baseGrit + gritSkillBonus;

    // ----------------------------------------
    // STAT DIE UPGRADES
    // ----------------------------------------
    // Determine effective stat dice based on skills
    // Base is d6, upgrades: d6 → d8 → d10
    const baseEdgeDie = context.system.attributes?.edge?.die || 'd6';
    const baseMightDie = context.system.attributes?.might?.die || 'd6';
    const baseWitsDie = context.system.attributes?.wits?.die || 'd6';
    const baseGritDie = context.system.attributes?.grit?.die || 'd6';

    // Helper to upgrade die
    const upgradeDie = (baseDie, hasUpgrade1, hasUpgrade2) => {
      if (hasUpgrade2) return 'd10';
      if (hasUpgrade1) return baseDie === 'd6' ? 'd8' : baseDie;
      return baseDie;
    };

    context.effectiveEdgeDie = upgradeDie(baseEdgeDie, hasSharpness, hasSharpnessII);
    context.effectiveMightDie = upgradeDie(baseMightDie, hasMighty, hasMightyII);
    context.effectiveWitsDie = upgradeDie(baseWitsDie, hasWise, hasWiseII);
    context.effectiveGritDie = upgradeDie(baseGritDie, hasDetermined, hasDeterminedII);

    // Track which dice are skill-improved for visual indicators
    context.hasSharpness = hasSharpness;
    context.hasSharpnessII = hasSharpnessII;
    context.hasMighty = hasMighty;
    context.hasMightyII = hasMightyII;
    context.hasWise = hasWise;
    context.hasWiseII = hasWiseII;
    context.hasDetermined = hasDetermined;
    context.hasDeterminedII = hasDeterminedII;

    // ----------------------------------------
    // INITIATIVE BONUS (Combat Readiness)
    // ----------------------------------------
    let initiativeSkillBonus = 0;
    if (hasCombatReadiness) initiativeSkillBonus += 1;
    if (hasCombatReadinessII) initiativeSkillBonus += 1;
    context.initiativeSkillBonus = initiativeSkillBonus;
    context.hasCombatReadiness = hasCombatReadiness;
    context.hasCombatReadinessII = hasCombatReadinessII;

    // ----------------------------------------
    // DEFENSE BONUSES (Tough-Souled, Blocker)
    // ----------------------------------------
    context.hasToughSouled = hasToughSouled;
    context.hasBlocker = hasBlocker;
    context.hasSoldiersEndurance = hasSoldiersEndurance;
    // Tough-Souled bonus is applied in defense calculation below

    // ----------------------------------------
    // COMBAT ADVANTAGE SKILLS (Fierce)
    // ----------------------------------------
    context.hasFierceStrokes = hasFierceStrokes;
    context.hasFierceShots = hasFierceShots;
    context.hasFierceMind = hasFierceMind;

    // ----------------------------------------
    // COMBAT SKILLS (Arms Column)
    // ----------------------------------------
    context.hasImpalingThrow = hasImpalingThrow;
    context.hasSacrificeArmor = hasSacrificeArmor;
    context.hasUnseenStrike = hasUnseenStrike;
    context.hasMurderousFrenzy = hasMurderousFrenzy;
    context.hasWideArc = hasWideArc;
    context.hasAssassin = this._hasAssassin();
    context.hasBrawler = this._hasBrawler();
    context.hasWaterfrontFists = this._hasWaterfrontFists();
    context.hasBornInSaddle = this._hasBornInSaddle();
    context.hasCharge = hasCharge;

    // Check if active skills are actually usable (has SP + meets conditions)
    const currentSP = context.system.stamina || 0;
    const currentArmorType = context.system.armorEquipped?.type || 'unarmored';

    // Heavy Armor Recovery Penalty: only 1 Recovery per Rest unless has Soldier's Endurance
    context.hasHeavyArmorRecoveryPenalty = currentArmorType === 'heavy' && !hasSoldiersEndurance;
    const impalingThrowActive = context.system.impalingThrowActive || false;

    // Impaling Throw: needs 1 SP AND not already active
    context.canUseImpalingThrow = hasImpalingThrow && currentSP >= 1 && !impalingThrowActive;
    context.impalingThrowActive = impalingThrowActive;

    // Unseen Strike: no SP cost, toggle on before surprise attack
    const unseenStrikeActive = context.system.unseenStrikeActive || false;
    context.canUseUnseenStrike = hasUnseenStrike && !unseenStrikeActive;
    context.unseenStrikeActive = unseenStrikeActive;

    // Sacrifice Armor: needs 1 SP AND must have armor equipped (not unarmored)
    context.canUseSacrificeArmor = hasSacrificeArmor && currentSP >= 1 && currentArmorType !== 'unarmored';

    // Blocker: toggle stance, requires shield equipped
    const blockerActive = context.system.blockerActive || false;
    const shieldEquippedForBlocker = context.system.armorEquipped?.shield || false;
    context.canUseBlocker = hasBlocker && shieldEquippedForBlocker && !blockerActive;
    context.blockerActive = blockerActive;

    // Defender: toggle stance, intercept attack on ally (once per round)
    const defenderActive = context.system.defenderActive || false;
    context.hasDefender = hasDefender;
    context.canUseDefender = hasDefender && !defenderActive;
    context.defenderActive = defenderActive;

    // Fleet Footed: passive, 2 Move = bonus 3rd Move
    context.hasFleetFooted = hasFleetFooted;

    // Murderous Frenzy: passive, requires two-handed heavy weapon armed (Greatsword, Greataxe, Maul)
    let hasTwoHandedHeavyArmed = false;
    try {
      const twoHandedHeavyWeapons = ['greatsword', 'greataxe', 'maul'];
      const armedWeaponsList = context.system.armedWeapons || {};
      hasTwoHandedHeavyArmed = Object.values(armedWeaponsList).some(w =>
        w && twoHandedHeavyWeapons.includes((w.name || '').toLowerCase())
      );
    } catch (e) {
      console.warn('Murderous Frenzy check failed:', e);
    }
    context.canUseMurderousFrenzy = hasMurderousFrenzy && hasTwoHandedHeavyArmed;

    // Charge: 1 SP for 2 Move + Melee Attack as single action
    context.canUseCharge = hasCharge && currentSP >= 1;

    // Hit and Run: 1 SP for Attack + 2 Move as single action
    context.hasHitAndRun = hasHitAndRun;
    context.canUseHitAndRun = hasHitAndRun && currentSP >= 1;

    // Poisoner: passive, requires Ichor item in inventory with qty >= 1
    context.hasPoisoner = hasPoisoner;
    let hasIchorAvailable = false;
    let ichorQuantity = 0;
    try {
      const inventory = context.system.inventory || {};
      for (const item of Object.values(inventory)) {
        // Check for isPoisonerItem flag (primary) or name match (fallback)
        if (item && (item.isPoisonerItem || (item.name || '').toLowerCase() === 'ichor')) {
          ichorQuantity = item.quantity || 0;
          hasIchorAvailable = ichorQuantity >= 1;
          break;
        }
      }
    } catch (e) {
      console.warn('Poisoner check failed:', e);
    }
    context.canUsePoisoner = hasPoisoner && hasIchorAvailable;
    context.ichorQuantity = ichorQuantity;

    // Reload: passive icon shown when any ammo weapon is equipped
    let hasAmmoWeapon = false;
    const armedWeaponsCheck = context.system.armedWeapons || {};
    for (const w of Object.values(armedWeaponsCheck)) {
      if (w?.ammo) { hasAmmoWeapon = true; break; }
    }
    if (!hasAmmoWeapon) {
      const thrownCheck = context.system.thrownAttacks || {};
      for (const a of Object.values(thrownCheck)) {
        if (a?.ammo) { hasAmmoWeapon = true; break; }
      }
    }
    if (!hasAmmoWeapon) {
      const rangedCheck = context.system.rangedAttacks || {};
      for (const a of Object.values(rangedCheck)) {
        if (a?.ammo) { hasAmmoWeapon = true; break; }
      }
    }
    const reloadTracker = context.system.reloadTracker || null;
    context.hasReloadIcon = hasAmmoWeapon;
    context.reloadTrackerActive = !!(reloadTracker?.active);

    // Eagle-Eyed: passive +1 ranged damage (II replaces I for display)
    context.hasEagleEyed = hasEagleEyed;
    context.hasEagleEyedII = hasEagleEyedII;

    // Iron Hide: +3 max LP (II adds +Grit)
    context.hasIronHide = hasIronHide || hasIronHideII; // Show icon if either is owned
    context.hasIronHideII = hasIronHideII;
    // Calculate total Iron Hide LP bonus for tooltip
    let ironHideLpBonus = 0;
    if (hasIronHide) ironHideLpBonus += 3;
    if (hasIronHideII) {
      const effectiveGrit = context.system.attributes?.grit?.value || 0;
      ironHideLpBonus += effectiveGrit;
    }
    context.ironHideLpBonus = ironHideLpBonus;

    // ----------------------------------------
    // CHECK MODIFIER SKILLS (Home tab row)
    // ----------------------------------------
    // Infamy: situational +2 to intimidate/convince checks
    const infamyActive = context.system.infamyActive || false;
    context.hasInfamy = hasInfamy;
    context.canUseInfamy = hasInfamy && !infamyActive;
    context.infamyActive = infamyActive;

    // Pantherish: 1 SP to reroll a failed check (active ability)
    context.hasPantherish = hasPantherish;
    context.canUsePantherish = hasPantherish && currentSP >= 1;

    // Legendary Sword Arm: bonus melee attack once per turn
    context.hasLegendarySwordArm = hasLegendarySwordArm;

    // Sharpshooter: bonus ranged attack once per turn
    context.hasSharpshooter = hasSharpshooter;

    // Of the Shadows: situational +1 to Edge checks when active
    const ofTheShadowsActive = context.system.ofTheShadowsActive || false;
    context.hasOfTheShadows = hasOfTheShadows;
    context.canUseOfTheShadows = hasOfTheShadows && !ofTheShadowsActive;
    context.ofTheShadowsActive = ofTheShadowsActive;

    // Leader of Men: 1-2 SP to buff allies with +1 attack
    // Check if this character is actively buffing anyone
    const leaderOfMenTargets = context.system.leaderOfMenTargets || [];
    const leaderOfMenActive = leaderOfMenTargets.length > 0;
    context.hasLeaderOfMen = hasLeaderOfMen;
    context.canUseLeaderOfMen = hasLeaderOfMen && currentSP >= 1;
    context.leaderOfMenActive = leaderOfMenActive;
    context.leaderOfMenTargetCount = leaderOfMenTargets.length;

    // Check if THIS character is receiving a Leader of Men buff from someone else
    const leaderOfMenBuff = context.system.leaderOfMenBuff || null;
    context.hasLeaderOfMenBuff = !!leaderOfMenBuff;
    context.leaderOfMenBuffSource = leaderOfMenBuff?.leaderName || '';

    // Bane Weapon: Cast spell to give ally +1d6/1d8/1d10 damage on melee/thrown attacks
    const invokedSpellsForBW = context.system.sorcery?.invokedSpells || {};
    const knowsBaneWeapon = !!invokedSpellsForBW["create-bane-weapon"];
    const baneWeaponCasterData = context.system.baneWeaponCaster || null;
    const baneWeaponBuffData = context.system.baneWeaponBuff || null;
    const currentLP = context.system.lifePoints?.value ?? 0;
    context.knowsBaneWeapon = knowsBaneWeapon;
    context.baneWeaponCasterActive = !!baneWeaponCasterData;
    context.baneWeaponCasterTarget = baneWeaponCasterData?.targetName || '';
    context.baneWeaponCasterDie = baneWeaponCasterData?.damageDie || '';
    context.canCastBaneWeapon = knowsBaneWeapon && !baneWeaponCasterData && currentLP >= 4;
    context.hasBaneWeaponBuff = !!baneWeaponBuffData;
    context.baneWeaponBuffSource = baneWeaponBuffData?.casterName || '';
    context.baneWeaponBuffDie = baneWeaponBuffData?.damageDie || '';

    // Favor of the Four Winds: received movement buff
    const favorFourWindsBuff = context.system.favorFourWindsBuff || null;
    context.hasFavorFourWindsBuff = !!favorFourWindsBuff;
    context.favorFourWindsBuffSource = favorFourWindsBuff?.casterName || '';

    // Radium Gem: toggle light spell (requires gem in inventory)
    const originIdForGem = context.system.origin?.id || '';
    const hasAlchemyAccess = this._getOriginSorceryAccess(originIdForGem).includes('alchemy');
    const inventory = context.system.inventory || {};
    const gemItem = Object.values(inventory).find(item => item && item.isAlchemyGem);
    const gemQuantity = gemItem ? (gemItem.quantity || 0) : 0;
    const radiumGemActive = context.system.radiumGemActive || false;
    context.hasRadiumGem = hasAlchemyAccess;
    context.canUseRadiumGem = hasAlchemyAccess && gemQuantity >= 1;
    context.radiumGemActive = radiumGemActive && gemQuantity >= 1; // Auto-deactivate if gem lost

    // Lotus Miasma: situational icon (shows when spell is learned, green when maintained)
    const knowsLotusMiasma = !!invokedSpellsForBW["lotus-miasma"];
    context.hasLotusMiasma = knowsLotusMiasma;
    context.lotusMiasmaActive = !!(context.system.lotusMiasmaActive);

    // Counter Ward: situational icon (purple when ready, red+glow when triggered)
    const knowsCounterWard = !!invokedSpellsForBW["counter-ward"];
    context.hasCounterWard = knowsCounterWard;
    context.counterWardTriggered = !!(game.conan?.counterWardAlert);

    // Eyes of the Raven: toggle +2 Edge perception (shows when spell is learned, green when active)
    const knowsEyesOfTheRaven = !!invokedSpellsForBW["eyes-of-the-raven"];
    context.hasEyesOfTheRaven = knowsEyesOfTheRaven;
    context.eyesOfTheRavenActive = !!(context.system.eyesOfTheRavenActive);

    // Inspire spell: +2 to all Checks (set by another caster, two-click dismiss)
    const inspireState = context.system.inspireSpellActive || false;
    context.inspireSpellActive = inspireState === 'active';
    context.inspireSpellWarning = inspireState === 'warning';

    // Astral Projection: three-state icon (gold=ready, purple=active, gray=spent)
    const knowsAstralProjection = !!invokedSpellsForBW["astral-projection"];
    context.hasAstralProjection = knowsAstralProjection;
    const apState = context.system.astralProjectionState || 'ready';
    context.astralProjectionReady = knowsAstralProjection && apState === 'ready';
    context.astralProjectionActive = knowsAstralProjection && apState === 'active';
    context.astralProjectionSpent = knowsAstralProjection && apState === 'spent';

    // Demonic Steed: active mounted state with LP maintenance
    context.demonicSteedActive = !!context.system.demonicSteedActive;

    // Frightful Aura: three-state icon (gold=ready, purple=active, gray=spent)
    const knowsFrightfulAura = !!invokedSpellsForBW["frightful-aura"];
    context.hasFrightfulAura = knowsFrightfulAura;
    const faState = context.system.frightfulAuraState || 'ready';
    context.frightfulAuraReady = knowsFrightfulAura && faState === 'ready';
    context.frightfulAuraActive = knowsFrightfulAura && faState === 'active';
    context.frightfulAuraSpent = knowsFrightfulAura && faState === 'spent';

    // Mesmerism: shows when learned (gold), green when controlling a target
    const knowsMesmerism = !!invokedSpellsForBW["mesmerism"];
    context.hasMesmerism = knowsMesmerism;
    context.mesmerismActive = !!(this.actor.getFlag('conan', 'mesmerismCaster')?.active);

    // Bloody Talons: active or spent state for spell card reset button
    context.bloodyTalonsActive = !!(context.system.bloodyTalonsActive);
    context.bloodyTalonsSpent = !!(context.system.bloodyTalonsSpent);

    // Uncanny Reach: active state for overlay icon + sorcery stack
    context.uncannyReachActive = !!(context.system.uncannyReachActive);

    // Chilling Presence: toggle aura on/off (no cost, narrative)
    const knowsChillingPresence = this._getOriginSorceryAccess(context.system.origin?.id || '').includes('necromanticMagic');
    context.hasChillingPresence = knowsChillingPresence;
    context.chillingPresenceActive = !!(context.system.chillingPresenceActive);

    // Capture Soul: three-state icon (empty=waiting, captured=green, primed=red)
    const knowsCaptureSoul = !!invokedSpellsForBW["capture-soul"];
    context.hasCaptureSoul = knowsCaptureSoul;
    const soulState = context.system.capturedSoulState || null;
    context.captureSoulEmpty = knowsCaptureSoul && !soulState;
    context.captureSoulCaptured = knowsCaptureSoul && soulState === 'captured';
    context.captureSoulPrimed = knowsCaptureSoul && soulState === 'primed';

    // Fearsome Ward: three-state icon (gold=ready, green=active, gray=spent)
    const knowsFearsomeWard = !!invokedSpellsForBW["fearsome-ward"];
    context.hasFearsomeWard = knowsFearsomeWard;
    const fwState = context.system.fearsomeWardState || 'ready';
    context.fearsomeWardReady = knowsFearsomeWard && fwState === 'ready';
    context.fearsomeWardActive = knowsFearsomeWard && fwState === 'active';
    context.fearsomeWardSpent = knowsFearsomeWard && fwState === 'spent';

    // Protector: 1 SP to give ally 1 SP (1/round)
    context.hasProtector = hasProtector;
    context.canUseProtector = hasProtector && currentSP >= 1;

    // Wise: Wits die upgrade (passive indicator)
    // Wise II replaces Wise I icon when both owned
    context.hasWise = hasWise && !hasWiseII;
    context.hasWiseII = hasWiseII;

    // ----------------------------------------
    // RECOVERY SKILLS
    // ----------------------------------------
    context.hasHardy = hasHardy;
    context.hasResilient = hasResilient;

    // ----------------------------------------
    // LEGENDARY SKILL (+1 any stat)
    // ----------------------------------------
    context.hasLegendary = hasLegendary;
    context.legendaryTargetStat = legendaryTargetStat;
    context.legendaryMight = hasLegendary && legendaryTargetStat === 'might';
    context.legendaryEdge = hasLegendary && legendaryTargetStat === 'edge';
    context.legendaryWits = hasLegendary && legendaryTargetStat === 'wits';
    context.legendaryGrit = hasLegendary && legendaryTargetStat === 'grit';
    context.legendaryNeedsSelection = hasLegendary && !legendaryTargetStat;

    // ----------------------------------------
    // FLEX DIE (Improved Flex)
    // ----------------------------------------
    // Determine effective flex die (skill-improved value)
    // Improved Flex: d10 → d8, Improved Flex II: d8 → d6
    let effectiveFlexDie = context.system.flex.die;
    if (hasImprovedFlexII) {
      effectiveFlexDie = 'd6';
    } else if (hasImprovedFlex) {
      if (effectiveFlexDie === 'd10') {
        effectiveFlexDie = 'd8';
      }
    }
    context.effectiveFlexDie = effectiveFlexDie;
    context.flexImprovedBySkill = (effectiveFlexDie !== context.system.flex.die);
    context.hasImprovedFlex = hasImprovedFlex;
    context.hasImprovedFlexII = hasImprovedFlexII;

    // Initialize defense system if missing
    if (!context.system.defense) {
      context.system.defense = {
        physical: 5,
        sorcery: 5,
        ar: 0,
        arLocked: true,
        physicalOverride: null,
        sorceryOverride: null
      };
    }
    // Default AR locked to true if undefined
    if (context.system.defense.arLocked === undefined) {
      context.system.defense.arLocked = true;
    }
    // Default defense locks to true if undefined
    if (context.system.defense.physicalLocked === undefined) {
      context.system.defense.physicalLocked = true;
    }
    if (context.system.defense.sorceryLocked === undefined) {
      context.system.defense.sorceryLocked = true;
    }

    // Auto-calculate Physical Defense (Edge + 2, min 5, +1 shield if Edge >= 3) unless unlocked and overridden
    // Now uses effective Edge (base + skill bonus from Steel Trap Reflexes)
    const physicalOverride = context.system.defense?.physicalOverride;
    const physicalLocked = context.system.defense?.physicalLocked !== false;
    const shieldEquipped = context.system.armorEquipped?.shield || false;
    const effectiveEdgeForDef = context.effectiveEdge; // Uses skill-boosted Edge

    if (!physicalLocked && physicalOverride !== null && physicalOverride !== undefined && physicalOverride !== "") {
      context.system.defense.physical = parseInt(physicalOverride);
    } else {
      const baseDefense = Math.max(5, effectiveEdgeForDef + 2);
      // Shield only adds +1 if effective Edge >= 3
      const shieldBonus = (shieldEquipped && effectiveEdgeForDef >= 3) ? 1 : 0;
      // Tough-Souled adds +1 to Physical Defense
      const toughSouledBonus = hasToughSouled ? 1 : 0;
      // Blocker adds +1 when stance is active (requires shield)
      const blockerBonus = blockerActive ? 1 : 0;
      // Protect bonus from Guard ability (stored in flags, max +3)
      const protectData = this.actor.getFlag('conan', 'protectBonus');
      const protectBonus = Math.min(protectData?.total || 0, 3);
      context.system.defense.physical = baseDefense + shieldBonus + toughSouledBonus + blockerBonus + protectBonus;
      context.protectBonus = protectBonus;
      context.physicalToughSouledBonus = toughSouledBonus;
      context.physicalBlockerBonus = blockerBonus;
    }

    // Auto-calculate Sorcery Defense (Wits + 2, min 5) unless unlocked and overridden
    // Uses effective Wits (base + skill bonus from Studious)
    // Also add +1 for Uncanny Warding skill from origin or purchased
    // Also add +1 for Tough-Souled
    const sorceryOverride = context.system.defense?.sorceryOverride;
    const sorceryLocked = context.system.defense?.sorceryLocked !== false;
    if (!sorceryLocked && sorceryOverride !== null && sorceryOverride !== undefined && sorceryOverride !== "") {
      context.system.defense.sorcery = parseInt(sorceryOverride);
    } else {
      const effectiveWitsForDef = context.effectiveWits; // Uses skill-boosted Wits
      let sorceryDef = Math.max(5, effectiveWitsForDef + 2);
      let sorcerySkillBonus = 0;

      // Check for Uncanny Warding from origin skills
      const originBonuses = this._getActiveOriginBonuses();
      if (originBonuses.grantedSkills.includes("uncanny-warding")) {
        sorcerySkillBonus += 1;
      }

      // Check for Uncanny Warding from purchased skills (non-origin)
      for (const skill of Object.values(skills)) {
        if (skill.fromOrigin) continue; // Skip origin skills, already counted
        const skillName = skill.name?.toLowerCase() || '';
        if (skillName === 'uncanny warding') {
          sorcerySkillBonus += 1;
        } else if (skillName === 'uncanny warding ii') {
          sorcerySkillBonus += 1; // Stacks with Uncanny Warding
        }
      }

      // Tough-Souled adds +1 to Sorcery Defense
      const toughSouledBonus = hasToughSouled ? 1 : 0;

      sorceryDef += sorcerySkillBonus + toughSouledBonus;
      context.sorcerySkillBonus = sorcerySkillBonus; // For display (context only, not system)
      context.sorceryToughSouledBonus = toughSouledBonus;
      context.hasUncannyWarding = hasUncannyWarding || hasUncannyWardingII || sorcerySkillBonus > 0;
      context.hasUncannyWardingII = hasUncannyWardingII;
      context.hasLotusBlood = hasLotusBlood;
      context.hasSorcerousVigor = hasSorcerousVigor;
      context.hasAdeptSorcerer = hasAdeptSorcerer;
      context.system.defense.sorcery = sorceryDef;
    }

    // Initialize origin system if missing or migrate from old format
    if (!context.system.origin || typeof context.system.origin === 'string') {
      context.system.origin = {
        id: "",
        name: "",
        baseLP: 0
      };
    }

    // Initialize originBonuses if missing or has wrong format (should be object, not string)
    if (!context.system.originBonuses || typeof context.system.originBonuses !== 'object') {
      context.system.originBonuses = {
        statChoice: "",
        skillChoice: ""
      };
    }

    // Auto-calculate LP Max: Origin Base + (Effective Grit × 2) + Skill Bonuses + Origin Skill Bonuses
    // Uses effective Grit which includes skill bonuses from Whalebone and Gristle
    // Only auto-calculate if maxOverride is not set
    const effectiveGritForLP = context.effectiveGrit;
    context.system.lpGritBonus = effectiveGritForLP * 2; // For display in formula box

    const lpMaxOverride = context.system.lifePoints?.maxOverride;
    if (lpMaxOverride === null || lpMaxOverride === undefined || lpMaxOverride === "") {
      const originBaseLP = context.system.origin?.baseLP || 0;

      // Check for Iron Hide from origin skills (+3 max LP)
      const originBonuses = this._getActiveOriginBonuses();
      let originSkillLPBonus = 0;
      let originSkillLPSources = [];
      if (originBonuses.grantedSkills.includes("iron-hide")) {
        originSkillLPBonus += 3;
        originSkillLPSources.push("Iron Hide +3");
      }

      // Store origin skill LP bonus for display
      context.system.lifePoints.originSkillBonus = originSkillLPBonus;
      context.system.lifePoints.originSkillSources = originSkillLPSources.join(", ");

      // Calculate purchased (non-origin) skill LP bonuses
      let purchasedSkillLPBonus = 0;
      let purchasedSkillLPSources = [];
      const skillDefs = this._getSkillDefinitions();

      for (const [id, skill] of Object.entries(skills)) {
        // Skip origin skills
        if (skill.fromOrigin || (skill.effect && skill.effect.includes("(Origin)"))) {
          continue;
        }

        // Check skill definitions for LP bonus
        for (const [defId, def] of Object.entries(skillDefs)) {
          if (!def.fromOrigin && (skill.name === def.name || skill.name?.toLowerCase() === def.name?.toLowerCase())) {
            if (def.lpBonus) {
              purchasedSkillLPBonus += def.lpBonus;
              purchasedSkillLPSources.push(`${def.name} +${def.lpBonus}`);
            } else if (def.lpBonusStat) {
              // Stat-based LP bonus (e.g., Iron Hide II = +effective Grit)
              // Use effective stat value which includes skill bonuses
              const effectiveStatValue = def.lpBonusStat === 'grit' ? effectiveGritForLP :
                                         def.lpBonusStat === 'edge' ? context.effectiveEdge :
                                         def.lpBonusStat === 'might' ? context.effectiveMight :
                                         def.lpBonusStat === 'wits' ? context.effectiveWits :
                                         context.system.attributes?.[def.lpBonusStat]?.value || 0;
              if (effectiveStatValue > 0) {
                purchasedSkillLPBonus += effectiveStatValue;
                purchasedSkillLPSources.push(`${def.name} +${effectiveStatValue}`);
              }
            }
            break;
          }
        }
      }

      // Store purchased skill LP bonus for display
      context.system.lifePoints.purchasedSkillBonus = purchasedSkillLPBonus;
      context.system.lifePoints.purchasedSkillSources = purchasedSkillLPSources.join(", ");

      context.system.lifePoints.max = originBaseLP + context.system.lpGritBonus + originSkillLPBonus + purchasedSkillLPBonus;
    } else {
      context.system.lifePoints.max = parseInt(lpMaxOverride);
    }

    // Persist computed max to actor so token bars and HUD read the correct value
    const computedMax = context.system.lifePoints.max;
    const storedMax = this.actor._source?.system?.lifePoints?.max;
    if (computedMax !== storedMax) {
      this.actor.update({'system.lifePoints.max': computedMax}, {render: false});
    }

    // Persist computed defense values so GM hover tooltip reads correct values
    const storedPhysDef = this.actor._source?.system?.defense?.physical;
    const storedSorcDef = this.actor._source?.system?.defense?.sorcery;
    const computedPhys = context.system.defense.physical;
    const computedSorc = context.system.defense.sorcery;
    if (computedPhys !== storedPhysDef || computedSorc !== storedSorcDef) {
      this.actor.update({
        'system.defense.physical': computedPhys,
        'system.defense.sorcery': computedSorc
      }, {render: false});
    }

    // Initialize origin notes if missing
    if (context.system.originNotes === undefined) {
      context.system.originNotes = "";
    }

    // Initialize useOriginBackground preference if missing (default to true)
    if (context.system.useOriginBackground === undefined) {
      context.system.useOriginBackground = true;
    }

    // Get full origin data for display
    const originId = context.system.origin?.id;
    if (originId) {
      const origins = this._getOriginData();
      const originData = origins[originId] || null;
      if (originData && originData.description) {
        // Convert description newlines to HTML paragraphs
        originData.descriptionHtml = originData.description
          .split('\n\n')
          .map(p => `<p>${p}</p>`)
          .join('');
      }
      context.originData = originData;

      // Set background image based on origin (only if toggle is checked and image exists)
      if (context.system.useOriginBackground && originData && originData.backgroundImage) {
        context.sheetBackground = `systems/conan/images/${originData.backgroundImage}`;
      } else {
        context.sheetBackground = 'systems/conan/images/sheet2_background.jpg';
      }
    } else {
      context.originData = null;
      context.sheetBackground = 'systems/conan/images/sheet2_background.jpg';
    }

    // Calculate active origin bonuses
    context.originBonuses = this._getActiveOriginBonuses();

    // Get a random quote (independent of origin)
    context.randomQuote = this._getRandomQuote();

    // Initialize armed weapons system if missing
    if (!context.system.armedWeapons) {
      context.system.armedWeapons = {};
    }

    // Prepare armed weapons display data
    const weaponCatalog = this._getWeaponCatalog();
    const armedWeapons = context.system.armedWeapons || {};

    // Check for Waterfront Fists and Assassin skills for unarmed weapon modifications
    const hasWaterfrontFists = this._hasWaterfrontFists();
    const hasAssassin = this._hasAssassin();

    for (const [id, weapon] of Object.entries(armedWeapons)) {
      // Abbreviate weapon name to 7 chars max
      weapon.abbrev = this._abbreviateWeaponName(weapon.name);

      // Set default image based on type or specific weapon
      const defaultImages = {
        melee: 'systems/conan/images/melee_attack_icon.png',
        thrown: 'systems/conan/images/range_attack_icon.png',
        ranged: 'systems/conan/images/range_attack_icon.png'
      };
      weapon.image = weapon.useSpecificImage && weapon.specificImage
        ? weapon.specificImage
        : defaultImages[weapon.type] || defaultImages.melee;

      // Check if this is an unarmed weapon that gets upgraded by Waterfront Fists
      const isUnarmed = weapon.name === "Unarmed" || weapon.category === "Unarmed";
      const isUpgradedUnarmed = isUnarmed && hasWaterfrontFists;

      // Waterfront Fists: Change unarmed damage from flat "2" to "1d4"
      if (isUpgradedUnarmed && weapon.damage === "2") {
        weapon.damage = "1d4";
        weapon.waterfrontFistsUpgrade = true;
        // Mark as Light, One-Handed (Improvised) for skill purposes
        weapon.effectiveCategory = "One-Handed Light";
      }

      // Fierce Strokes icon for melee weapons
      if (weapon.type === 'melee' && hasFierceStrokes) {
        weapon.showFierceStrokesIcon = true;
      }

      // Poisoner: Show toggle on all melee weapons when character has Poisoner skill
      if (weapon.type === 'melee' && hasPoisoner) {
        weapon.canBePoisoned = true;
        weapon.ichorQty = context.ichorQuantity;
        // Only show counter overlay on poisoned weapons with ichor available
        if (weapon.isPoisoned && context.ichorQuantity > 0) {
          weapon.showIchor = true;
        }
      }

      // Calculate attack/damage formulas and bonuses
      // Waterfront Fists + Assassin: Use Edge instead of Might for attack (unarmed now counts as Light)
      let attackStat = weapon.type === 'melee' ? 'might' : 'edge';
      if (isUpgradedUnarmed && hasAssassin) {
        attackStat = 'edge'; // Assassin lets you use Edge for Light/Medium weapons
        weapon.assassinApplies = true;
      }

      const damageStat = weapon.type === 'ranged' ? null : 'might';
      const attackAttr = context.system.attributes?.[attackStat] || { die: 'd6', value: 0 };
      const damageAttr = damageStat ? context.system.attributes?.[damageStat] : null;

      weapon.attackStat = attackStat.charAt(0).toUpperCase() + attackStat.slice(1);
      weapon.attackStatValue = attackAttr.value || 0;
      weapon.attackFormula = `1${attackAttr.die} + ${attackAttr.value}`;
      weapon.attackOriginBonus = context.originBonuses?.attacks?.[attackStat] || 0;

      if (damageStat) {
        weapon.damageStat = damageStat.charAt(0).toUpperCase() + damageStat.slice(1);
        weapon.damageStatValue = damageAttr?.value || 0;
        weapon.damageFormula = `${weapon.damage} + ${damageAttr?.value || 0}`;
        weapon.damageOriginBonus = context.originBonuses?.damage?.[weapon.type] || 0;
      } else {
        weapon.damageStat = '--';
        weapon.damageStatValue = 0;
        weapon.damageFormula = weapon.damage;
        weapon.damageOriginBonus = context.originBonuses?.damage?.ranged || 0;
      }

      // Origin bonus description (attack bonus from origin stat choice)
      if (weapon.attackOriginBonus > 0) {
        weapon.originBonus = `+${weapon.attackOriginBonus} Attack`;
      }
      // Damage bonus from origin (e.g., From the Hills melee damage)
      if (weapon.damageOriginBonus > 0) {
        weapon.originDamageBonus = `+${weapon.damageOriginBonus} Damage`;
      }

      // Check for skill bonuses that apply to this weapon type
      // Pass weapon object for Waterfront Fists/Assassin interaction
      // Returns { attack: [...], damage: [...] } with skill names and bonuses
      const skillBonuses = this._getWeaponSkillBonuses(weapon.type, weapon);

      // Store damage skill bonuses for the damage line display
      if (skillBonuses.damage.length > 0) {
        weapon.damageSkillBonus = skillBonuses.damage.join(', ');
      }
      // Store attack skill bonuses for the attack line display
      if (skillBonuses.attack.length > 0) {
        weapon.attackSkillBonus = skillBonuses.attack.join(', ');
      }

      // Impaling Throw: Mark thrown weapons when ability is active
      if (weapon.type === 'thrown' && context.system.impalingThrowActive) {
        weapon.impalingThrowReady = true;
      }

      // Snake Arrow: Mark ranged weapons when spell buff is active
      if (weapon.type === 'ranged' && context.system.snakeArrowActive) {
        weapon.snakeArrowReady = true;
      }

      // Bloody Talons: Mark unarmed weapons when spell buff is active
      const isUnarmedForTalons = weapon.name === 'Unarmed' || weapon.category === 'Unarmed';
      if (isUnarmedForTalons && context.system.bloodyTalonsActive) {
        weapon.bloodyTalonsReady = true;
      }

      // Uncanny Reach: Mark melee weapons when spell is active, upgrade Touch→Close
      if (weapon.type === 'melee' && context.system.uncannyReachActive) {
        weapon.uncannyReachReady = true;
        if (weapon.range === 'Touch') {
          weapon.range = 'Close';
        }
      }

      // Build Active Bonuses display data
      const isMounted = context.system.conditions?.mounted || false;
      const hasBornInSaddle = this._hasBornInSaddle();
      weapon.isMounted = isMounted;
      weapon.hasBornInSaddle = hasBornInSaddle;

      // Base attack bonus = stat value + origin bonus
      const baseAttackBonus = weapon.attackStatValue + (weapon.attackOriginBonus || 0);

      // Build bonus description parts for attack line (stat, origin, attack skills)
      const bonusParts = [];
      bonusParts.push(`${weapon.attackStat} ${weapon.attackStatValue >= 0 ? '+' : ''}${weapon.attackStatValue}`);
      if (weapon.attackOriginBonus > 0) {
        bonusParts.push(`Origin +${weapon.attackOriginBonus}`);
      }
      // Attack skills (like Assassin) shown on attack line
      if (skillBonuses.attack.length > 0) {
        bonusParts.push(skillBonuses.attack.join(', '));
      }

      if (!isMounted) {
        // Not mounted: single line showing all bonuses
        weapon.activeBonuses = {
          singleLine: true,
          label: 'Active Bonuses',
          value: bonusParts.join(', ')
        };
      } else {
        // Mounted: calculate separate modifiers for vs Non-Mounted and vs Mounted
        let vsNonMountedMod = 0;
        let vsMountedMod = 0;

        if (weapon.type === 'melee') {
          // Melee mounted: +1 vs non-mounted (general mounted combat rule)
          vsNonMountedMod = 1;
          vsMountedMod = 0;
        } else {
          // Ranged or Thrown
          if (hasBornInSaddle) {
            // Born in Saddle: cancels -2 penalty, gives +1 vs non-mounted
            vsNonMountedMod = 1;
            vsMountedMod = 0;
          } else {
            // No skill: -2 penalty to all ranged attacks when mounted
            vsNonMountedMod = -2;
            vsMountedMod = -2;
          }
        }

        // Build the display strings
        const vsNonMountedParts = [...bonusParts];
        const vsMountedParts = [...bonusParts];

        if (vsNonMountedMod !== 0) {
          vsNonMountedParts.push(`Mounted ${vsNonMountedMod >= 0 ? '+' : ''}${vsNonMountedMod}`);
        }
        if (vsMountedMod !== 0) {
          vsMountedParts.push(`Mounted ${vsMountedMod >= 0 ? '+' : ''}${vsMountedMod}`);
        }

        weapon.activeBonuses = {
          singleLine: false,
          vsNonMounted: {
            label: 'vs Non-Mounted',
            value: vsNonMountedParts.join(', '),
            modifier: vsNonMountedMod,
            isPenalty: vsNonMountedMod < 0
          },
          vsMounted: {
            label: 'vs Mounted',
            value: vsMountedParts.join(', '),
            isPenalty: vsMountedMod < 0,
            modifier: vsMountedMod
          }
        };
      }
    }

    // Calculate weapon count for grid layout
    context.weaponCount = Object.keys(armedWeapons).length;

    // Poisoner icon state: check if any melee weapon is currently poisoned
    context.anyWeaponPoisoned = Object.values(armedWeapons).some(w => w.type === 'melee' && w.isPoisoned);

    // Check weapon encumbrance (max 3 weapons, or 2 with shield) - unarmed doesn't count
    const hasShield = context.system.armorEquipped?.shield || false;
    const maxWeapons = hasShield ? 2 : 3;
    const weaponEncumbranceCount = Object.values(armedWeapons).filter(w => w.name !== "Unarmed" && w.category !== "Unarmed").length;
    const isWeaponEncumbered = weaponEncumbranceCount > maxWeapons;

    // Check inventory encumbrance (max 5 items, 6+ triggers encumbered)
    // Exclude special items (Alchemy Gem) from count - they don't take inventory slots
    const inventoryItems = context.system.inventory || {};
    const inventoryCount = Object.values(inventoryItems).filter(item => item && !item.isAlchemyGem).length;
    const isInventoryEncumbered = inventoryCount >= 6;
    context.system.inventoryCount = inventoryCount;

    // Build display-ready inventory array for template (sorted: protected → treasure → plunder → gear)
    const inventoryDisplay = [];
    let totalPlunderValue = 0;
    for (const [id, item] of Object.entries(inventoryItems)) {
      if (!item) continue;
      const isProtected = !!(item.isAlchemyGem || item.isPoisonerItem);
      const isPlunder = !!item.plunder && !item.isTreasureItem;
      const isTreasure = !!item.isTreasureItem;
      // Sort key: 0=protected, 1=treasure, 2=plunder, 3=gear
      let sortKey = 3;
      if (isProtected) sortKey = 0;
      else if (isTreasure) sortKey = 1;
      else if (isPlunder) sortKey = 2;
      if (item.plunder) totalPlunderValue += (item.quantity || item.plunder || 0);
      inventoryDisplay.push({
        id,
        name: item.name || '',
        description: item.description || '',
        quantity: item.quantity || 0,
        plunder: item.plunder || 0,
        isTreasureItem: isTreasure,
        isSpecial: isProtected,
        isAlchemyGem: !!item.isAlchemyGem,
        isPoisonerItem: !!item.isPoisonerItem,
        isPlunder: isPlunder,
        sortKey
      });
    }
    inventoryDisplay.sort((a, b) => a.sortKey - b.sortKey);
    // Mark group breaks for template separators
    for (let i = 1; i < inventoryDisplay.length; i++) {
      if (inventoryDisplay[i].sortKey !== inventoryDisplay[i - 1].sortKey) {
        inventoryDisplay[i].groupBreak = true;
      }
    }
    context.system.inventoryDisplay = inventoryDisplay;
    context.system.totalPlunderValue = totalPlunderValue;

    // Squander system — origin-specific data for overlay
    const originIdForSquander = context.system.origin?.id || '';
    context.squanderName = SQUANDER_NAMES[originIdForSquander] || '';
    if (context.squanderName) {
      const sqInfo = this._getSquanderPlunderInfo();
      const sqFlavors = SQUANDER_FLAVOR[originIdForSquander] || SQUANDER_FLAVOR['from-the-hills'];
      context.squanderFlavor = sqFlavors[Math.floor(Math.random() * sqFlavors.length)];
      context.squanderDefault = Math.min(sqInfo.totalPlunder, 3);
      context.squanderCanTreasure = sqInfo.hasTreasure && (sqInfo.totalPlunder - sqInfo.firstTreasureValue) >= 3;
      context.squanderTierDisplay = this._getSquanderTier(3);
      context.squanderOriginComplete = SQUANDER_COMPLETE_ORIGINS.has(originIdForSquander);
    }

    // Radium Gem auto-cleanup: remove if no alchemy access
    const originIdForGemCleanup = context.system.origin?.id;
    const hasAlchemyForCleanup = originIdForGemCleanup ? this._getOriginSorceryAccess(originIdForGemCleanup).includes('alchemy') : false;
    if (!hasAlchemyForCleanup) {
      const orphanGems = Object.entries(inventoryItems).filter(([, item]) => item && item.isAlchemyGem);
      if (orphanGems.length > 0) {
        const cleanupUpdates = {};
        for (const [gemId] of orphanGems) {
          cleanupUpdates[`system.inventory.-=${gemId}`] = null;
        }
        this.actor.update(cleanupUpdates, { render: false });
      }
    }

    // Combined encumbrance check
    context.system.isEncumbered = isWeaponEncumbered || isInventoryEncumbered;
    context.system.isWeaponEncumbered = isWeaponEncumbered;
    context.system.isInventoryEncumbered = isInventoryEncumbered;

    // Armed weapons for pack overlay (exclude Unarmed — it's a combat card, not inventory)
    const armedForPack = Object.values(armedWeapons).filter(w => w && w.name !== 'Unarmed' && w.category !== 'Unarmed');
    context.system.armedWeaponsDisplay = armedForPack;

    // ===== MOUNT SYSTEM =====
    const mount = context.system.mount || { type: null, name: '', saddlebag: {} };
    context.hasMount = !!mount.type;
    if (mount.type === 'horse') {
      const originId = context.system.origin?.id || '';
      const horseKey = HORSE_IMAGE_MAP[originId] || 'horse_generic';
      context.mountImagePath = `systems/conan/images/Mounts/${horseKey}.png`;
    } else {
      context.mountImagePath = '';
    }
    // Demonic Steed: override mount image and name while active
    if (context.system.demonicSteedActive) {
      context.hasMount = true;
      context.mountImagePath = 'systems/conan/images/Mounts/horse_demonic.png';
      context.system.mount = { ...(context.system.mount || {}), name: 'MORTIS' };
    }
    // Store for tab switch handlers
    this._mountImagePath = context.mountImagePath;
    this._hasMount = context.hasMount;

    // Build saddlebag display (sorted: treasure → plunder → gear)
    const saddlebagItems = mount.saddlebag || {};
    const saddlebagDisplay = [];
    let saddlebagPlunderValue = 0;
    for (const [id, item] of Object.entries(saddlebagItems)) {
      if (!item) continue;
      const isPlunder = !!item.plunder && !item.isTreasureItem;
      const isTreasure = !!item.isTreasureItem;
      let sortKey = 2; // gear
      if (isTreasure) sortKey = 0;
      else if (isPlunder) sortKey = 1;
      if (item.plunder) saddlebagPlunderValue += (item.quantity || item.plunder || 0);
      saddlebagDisplay.push({
        id,
        name: item.name || '',
        description: item.description || '',
        quantity: item.quantity || 0,
        plunder: item.plunder || 0,
        isTreasureItem: isTreasure,
        isPlunder: isPlunder,
        sortKey
      });
    }
    saddlebagDisplay.sort((a, b) => a.sortKey - b.sortKey);
    for (let i = 1; i < saddlebagDisplay.length; i++) {
      if (saddlebagDisplay[i].sortKey !== saddlebagDisplay[i - 1].sortKey) {
        saddlebagDisplay[i].groupBreak = true;
      }
    }
    context.system.saddlebagDisplay = saddlebagDisplay;
    context.system.saddlebagCount = saddlebagDisplay.length;
    context.system.saddlebagPlunderValue = saddlebagPlunderValue;

    // Initialize all conditions from stored data
    context.system.isMounted = context.system.conditions?.mounted || false;
    context.system.isPoisoned = context.system.conditions?.poisoned || false;
    context.system.isUnconscious = context.system.conditions?.unconscious || false;
    context.system.isStunned = context.system.conditions?.stunned || false;
    context.system.isBound = context.system.conditions?.bound || false;
    context.system.isFrightened = context.system.conditions?.frightened || false;
    context.system.isBlinded = context.system.conditions?.blinded || false;
    context.system.isProne = context.system.conditions?.prone || false;
    context.system.isGrappled = context.system.conditions?.grappled || false;
    context.system.isBleeding = context.system.conditions?.bleeding || false;
    context.system.isBurning = context.system.conditions?.burning || false;

    // Check if any conditions are active for template rendering
    context.hasActiveConditions = context.system.isEncumbered ||
      context.system.isMounted || context.system.isPoisoned ||
      context.system.isUnconscious || context.system.isStunned ||
      context.system.isBound || context.system.isFrightened ||
      context.system.isBlinded || context.system.isProne ||
      context.system.isGrappled || context.system.isBleeding ||
      context.system.isBurning;

    // ==========================================
    // BUFFS/DEBUFFS DETECTION & MECHANICAL EFFECTS
    // ==========================================

    // Initialize buffs/debuffs from stored data
    const buffsDebuffs = context.system.buffsDebuffs || {};

    // Buff detection flags
    context.hasArmorUp = buffsDebuffs.armorUp || false;
    context.hasBaneWeapon = buffsDebuffs.baneWeapon || false;
    context.hasBeastForm = buffsDebuffs.beastForm || false;
    context.hasEdgeUp = buffsDebuffs.edgeUp || false;
    context.hasDemonicSteed = buffsDebuffs.demonicSteed || false;
    context.hasInspired = buffsDebuffs.inspired || false;
    context.hasDemonicWard = buffsDebuffs.demonicWard || false;
    context.hasUncannyReach = buffsDebuffs.uncannyReach || false;
    context.hasBloodhound = buffsDebuffs.bloodhound || false;
    context.bloodhoundTarget = context.system.bloodhoundTarget || '';

    // Debuff detection flags
    context.hasInitReduced = buffsDebuffs.initReduced || false;
    context.hasPhysDefDown = buffsDebuffs.physDefDown || false;
    context.hasSorcDefDown = buffsDebuffs.sorcDefDown || false;
    context.hasSlowed = buffsDebuffs.slowed || false;
    context.hasWeakened = buffsDebuffs.weakened || false;
    context.hasChecksDown = buffsDebuffs.checksDown || false;
    context.hasControlled = buffsDebuffs.controlled || false;

    // Stunned debuff (from Pict Stunned trait or Wave of Darkness)
    const stunnedFlag = this.actor.getFlag('conan', 'stunnedDebuff');
    context.hasStunned = stunnedFlag?.active || false;

    // Check if any buffs or debuffs are active
    context.hasActiveBuffs = context.hasArmorUp || context.hasBaneWeapon ||
      context.hasBeastForm || context.hasEdgeUp || context.hasDemonicSteed ||
      context.hasInspired || context.hasDemonicWard || context.hasUncannyReach;

    context.hasActiveDebuffs = context.hasInitReduced || context.hasPhysDefDown ||
      context.hasSorcDefDown || context.hasSlowed || context.hasWeakened ||
      context.hasChecksDown || context.hasControlled || context.hasStunned;

    context.hasActiveBuffsOrDebuffs = context.hasActiveBuffs || context.hasActiveDebuffs;

    // ----------------------------------------
    // MECHANICAL EFFECTS FROM BUFFS
    // ----------------------------------------

    // Calculate AR bonus from buffs (stackable)
    let arBuffBonus = 0;
    if (context.hasArmorUp) arBuffBonus += 3;
    // Add more AR-affecting buffs here as needed:
    // if (context.hasDemonicWard) arBuffBonus += X;
    context.arBuffBonus = arBuffBonus;

    // Calculate effective AR (base AR + buff bonus)
    const baseAR = context.system.defense?.ar || 0;
    context.effectiveAR = baseAR + arBuffBonus;
    context.hasARBuff = arBuffBonus > 0;

    // Check if any AR-affecting buffs are active (for icon container)
    context.hasActiveARBuffs = context.hasArmorUp || context.hasDemonicWard;

    // ==========================================
    // SORCERY SYSTEM DATA PREPARATION
    // ==========================================

    // Initialize sorcery system if missing
    if (!context.system.sorcery) {
      context.system.sorcery = {
        invokedSpells: {},
        selectedDisciplines: [] // For "From Parts Unknown" origin
      };
    }

    // Get origin's sorcery access
    const sorceryAccess = this._getOriginSorceryAccess(originId);
    context.hasSorceryAccess = sorceryAccess.length > 0;

    // Get spell catalog
    const spellCatalog = this._getSpellCatalog();

    // Prepare available disciplines for the invoke menu
    context.availableDisciplines = sorceryAccess.map(discId => {
      const fullName = spellCatalog[discId]?.name || discId;
      return {
        id: discId,
        name: fullName.replace(' Magic', ''),
        fullName: fullName
      };
    });

    // Calculate available XP for display
    context.system.xp.availableCount = this._getAvailableXP();

    // Get invoked (purchased) spells
    const invokedSpells = context.system.sorcery?.invokedSpells || {};

    // Prepare sorcery disciplines with their spells for front display
    context.sorceryDisciplines = [];
    let hasAnySpells = false;

    for (const discId of sorceryAccess) {
      const discipline = spellCatalog[discId];
      if (!discipline) continue;

      const disciplineData = {
        id: discId,
        name: discipline.name,
        spells: []
      };

      // Add inherent spells (always available, free)
      for (const spell of discipline.inherentSpells) {
        disciplineData.spells.push({
          id: spell.id,
          name: spell.name,
          abbrev: this._abbreviateSpellName(spell.name),
          type: spell.type,
          typeDisplay: spell.type.charAt(0).toUpperCase() + spell.type.slice(1),
          cost: spell.cost,
          costDisplay: this._formatSpellCost(spell.cost),
          actions: spell.actions,
          range: spell.range || null,
          damage: spell.damage || null,
          isHealing: spell.isHealing || false,
          effect: spell.effect,
          duration: spell.duration || null,
          limit: spell.limit || null,
          isInherent: true
        });
        hasAnySpells = true;
      }

      // Add invoked (purchased) spells for this discipline
      for (const [spellId, spellData] of Object.entries(invokedSpells)) {
        if (spellData.discipline === discId) {
          // Find the spell in the catalog
          const catalogSpell = discipline.purchasableSpells.find(s => s.id === spellId);
          if (catalogSpell) {
            disciplineData.spells.push({
              id: spellId,
              name: catalogSpell.name,
              abbrev: this._abbreviateSpellName(catalogSpell.name),
              type: catalogSpell.type,
              typeDisplay: catalogSpell.type.charAt(0).toUpperCase() + catalogSpell.type.slice(1),
              cost: catalogSpell.cost,
              costDisplay: this._formatSpellCost(catalogSpell.cost),
              actions: catalogSpell.actions,
              range: catalogSpell.range || null,
              damage: catalogSpell.damage || null,
              isHealing: catalogSpell.isHealing || false,
              effect: catalogSpell.effect,
              duration: catalogSpell.duration || null,
              limit: catalogSpell.limit || null,
              xpCost: catalogSpell.xpCost,
              isInherent: false
            });
            hasAnySpells = true;
          }
        }
      }

      // Only add discipline if it has spells
      if (disciplineData.spells.length > 0) {
        context.sorceryDisciplines.push(disciplineData);
      }
    }

    context.hasAnySpells = hasAnySpells;

    // Infernal Ward: shows in stat icon bar during combat
    const hasInfernalWard = sorceryAccess.includes('demonicMagic');
    context.hasInfernalWard = hasInfernalWard;

    // Demonic Vessel: passive detection of unnatural beings on the scene
    const hasDemonicVessel = sorceryAccess.includes('demonicMagic');
    context.hasDemonicVessel = hasDemonicVessel;
    context.demonicVesselAlert = false;
    context.demonicVesselTooltip = '';
    if (hasDemonicVessel && canvas?.scene) {
      // Full demon category + specific unnatural groups from other categories
      const UNNATURAL_GROUPS = new Set([
        'vampires', 'ghouls', 'deep-dwellers', 'black-ones'
      ]);
      const GROUP_LABELS = {
        'vampires': 'Vampires', 'ghouls': 'Ghouls',
        'deep-dwellers': 'Deep Dwellers', 'black-ones': 'Black Ones'
      };
      const detected = new Set();
      for (const t of canvas.scene.tokens) {
        const ed = t.getFlag('conan', 'enemyData');
        if (ed?.category === 'demons') {
          detected.add('Demons');
        } else if (ed?.group && UNNATURAL_GROUPS.has(ed.group)) {
          detected.add(GROUP_LABELS[ed.group]);
        }
        // Player characters with Blood of a Demon origin
        if (t.actor?.type === 'character2' && t.actor.system?.origin?.id === 'from-the-blood-of-a-demon' && t.actor.id !== this.actor.id) {
          detected.add('Demon-Blooded');
        }
      }
      if (detected.size > 0) {
        context.demonicVesselAlert = true;
        context.demonicVesselTooltip = 'Demonic Vessel senses: ' + [...detected].join(', ');
      }
      // Infernal Ward: red alert when demons on scene, gray when spent
      if (hasInfernalWard) {
        const demonsOnScene = [...canvas.scene.tokens].some(t => t.getFlag('conan', 'enemyData')?.category === 'demons');
        const wardSpent = !!context.system.infernalWardSpent;
        context.infernalWardAlert = demonsOnScene && !wardSpent;
        context.infernalWardSpent = wardSpent;
      }
    }

    // Undead Ward: same pattern as Infernal Ward but for undead category
    const hasUndeadWard = sorceryAccess.includes('necromanticMagic');
    context.hasUndeadWard = hasUndeadWard;
    if (hasUndeadWard && canvas?.scene) {
      const undeadOnScene = [...canvas.scene.tokens].some(t => t.getFlag('conan', 'enemyData')?.category === 'undead');
      const wardSpent = !!context.system.undeadWardSpent;
      context.undeadWardAlert = undeadOnScene && !wardSpent;
      context.undeadWardSpent = wardSpent;
    }

    // Prepare available spells for the spell selection menu (matching skills pattern)
    const availableXP = this._getAvailableXP();
    context.availableSpellsByDiscipline = sorceryAccess.map(discId => {
      const discipline = spellCatalog[discId];
      if (!discipline) return null;

      const spells = discipline.purchasableSpells.map(spell => {
        const owned = !!invokedSpells[spell.id];
        const cantAfford = spell.xpCost > availableXP;
        const unavailable = !owned && cantAfford;

        return {
          id: spell.id,
          name: spell.name,
          xpCost: spell.xpCost,
          type: spell.type,
          typeDisplay: spell.type.charAt(0).toUpperCase() + spell.type.slice(1),
          cost: spell.cost,
          costDisplay: this._formatSpellCost(spell.cost),
          actions: spell.actions,
          range: spell.range || null,
          damage: spell.damage || null,
          isHealing: spell.isHealing || false,
          effect: spell.effect,
          limit: spell.limit || null,
          owned: owned,
          unavailable: unavailable,
          cantAfford: cantAfford,
          queued: false // Will be updated dynamically in JS
        };
      }).sort((a, b) => a.xpCost - b.xpCost);

      return {
        id: discId,
        name: discipline.name.replace(' Magic', ''),
        fullName: discipline.name,
        spells: spells
      };
    }).filter(d => d !== null);

    // ==========================================
    // SKILLS SYSTEM DATA PREPARATION
    // ==========================================

    // Calculate available XP as a simple number
    context.xpAvailable = this._getAvailableXP();

    // Prepare owned skills for display
    context.preparedSkills = this._prepareOwnedSkills();

    // Prepare earned badges for the badges page (skills with icons)
    const skillBadges = context.preparedSkills
      .filter(skill => skill.icon)
      .map(skill => ({
        id: skill.id,
        name: skill.name,
        icon: skill.icon,
        effect: skill.effect,
        fromOrigin: skill.fromOrigin
      }));

    // Add spell badges for learned spells with custom icons
    const spellBadges = [];
    const learnedSpells = this.actor.system.sorcery?.invokedSpells || {};
    const sorceryAccessForBadges = this._getOriginSorceryAccess(originId);

    // Inherent spell badges (from discipline access)
    if (sorceryAccessForBadges.includes('alchemy')) {
      spellBadges.push({
        id: 'create-food',
        name: 'Create Food',
        icon: 'systems/conan/images/icons/create_food_icon.png',
        effect: 'Create enough food and water for one person for one day.',
        fromOrigin: true,
        isSpell: true
      });
      spellBadges.push({
        id: 'radium-gem',
        name: 'Radium Gem',
        icon: 'systems/conan/images/icons/radium_gem_icon.png',
        effect: 'Glowing gem provides light for 1 hour per Wits value. Requires gem.',
        fromOrigin: true,
        isSpell: true
      });
      spellBadges.push({
        id: 'artifact-spirit',
        name: 'Artifact Spirit',
        icon: 'systems/conan/images/icons/artifact_spirit_icon.png',
        effect: 'Sense magical properties of an item you touch.',
        fromOrigin: true,
        isSpell: true
      });
    }

    if (sorceryAccessForBadges.includes('blackMagic')) {
      spellBadges.push({
        id: 'whispers-darkness',
        name: 'Whispers in the Darkness',
        icon: 'systems/conan/images/icons/whispers_in_the_darkness_icon.png',
        effect: 'Send a telepathic message to someone you can see.',
        fromOrigin: true,
        isSpell: true
      });
      spellBadges.push({
        id: 'illusory-shadow',
        name: 'Illusory Shadow',
        icon: 'systems/conan/images/icons/illusory_shadow_icon.png',
        effect: 'Create a shadowy illusion that lasts for 1 minute.',
        fromOrigin: true,
        isSpell: true
      });
      spellBadges.push({
        id: 'nights-gift',
        name: "Night's Gift",
        icon: 'systems/conan/images/icons/nights_gift_icon.png',
        effect: 'See in complete darkness for 1 hour.',
        fromOrigin: true,
        isSpell: true
      });
    }

    if (sorceryAccessForBadges.includes('whiteMagic')) {
      spellBadges.push({
        id: 'signs-jhebbal-sag',
        name: 'Signs of Jhebbal Sag',
        icon: 'systems/conan/images/icons/the_signs_of_jhebbal_sag_icon.png',
        effect: 'Communicate with animals for 10 minutes.',
        fromOrigin: true,
        isSpell: true
      });
      spellBadges.push({
        id: 'sense-sorcery',
        name: 'Sense Sorcery',
        icon: 'systems/conan/images/icons/sense_sorcery_icon.png',
        effect: 'Detect active magic and sorcerers within Close range.',
        fromOrigin: true,
        isSpell: true
      });
      spellBadges.push({
        id: 'life-sight',
        name: 'Life Sight',
        icon: 'systems/conan/images/icons/life_sight_icon.png',
        effect: 'See living creatures through walls for 1 minute.',
        fromOrigin: true,
        isSpell: true
      });
    }

    if (sorceryAccessForBadges.includes('demonicMagic')) {
      spellBadges.push({
        id: 'bloodhound',
        name: 'Bloodhound',
        icon: 'systems/conan/images/icons/bloodhound_icon.png',
        effect: 'Track a target by sampling their blood. Bond persists until dispelled or death.',
        fromOrigin: true,
        isSpell: true
      });
      spellBadges.push({
        id: 'demonic-vessel',
        name: 'Demonic Vessel',
        icon: 'systems/conan/images/icons/demonic_vessel_icon.png',
        effect: 'Sense demons and unnatural beings nearby. Cursed items glow in your sight.',
        fromOrigin: true,
        isSpell: true
      });
      spellBadges.push({
        id: 'infernal-ward',
        name: 'Infernal Ward',
        icon: 'systems/conan/images/icons/infernal_ward_icon.png',
        effect: 'Demons ignore you unless attacked first, as long as other foes are present.',
        fromOrigin: true,
        isSpell: true
      });
    }

    if (sorceryAccessForBadges.includes('necromanticMagic')) {
      spellBadges.push({
        id: 'death-sight',
        name: 'Death Sight',
        icon: 'systems/conan/images/icons/death_sight_icon.png',
        effect: 'Determine how and how long ago a creature died by touch — or other, less natural senses.',
        fromOrigin: true,
        isSpell: true
      });
      spellBadges.push({
        id: 'chilling-presence',
        name: 'Chilling Presence',
        icon: 'systems/conan/images/icons/chilling_presence_icon.png',
        effect: 'Dramatically lower the temperature around you.',
        fromOrigin: true,
        isSpell: true
      });
      spellBadges.push({
        id: 'undead-ward',
        name: 'Undead Ward',
        icon: 'systems/conan/images/icons/undead_ward_icon.png',
        effect: 'Undead only target you if no other foes remain or you attack them first.',
        fromOrigin: true,
        isSpell: true
      });
    }

    // Purchased spell badges
    if (learnedSpells['create-bane-weapon']) {
      spellBadges.push({
        id: 'create-bane-weapon',
        name: 'Create Bane Weapon',
        icon: 'systems/conan/images/icons/create_bane_weapon_icon.png',
        effect: 'Enchant ally weapon: +1d6/1d8/1d10 damage. Maintain: 3 LP/round.',
        fromOrigin: false,
        isSpell: true
      });
    }

    if (learnedSpells['tide-of-stone']) {
      spellBadges.push({
        id: 'tide-of-stone',
        name: 'Tide of Stone',
        icon: 'systems/conan/images/icons/tide_of_stone_icon.png',
        effect: 'Attack: 1d8+2, target suffers -1 Physical Defense. Range: Medium.',
        fromOrigin: false,
        isSpell: true
      });
    }

    if (learnedSpells['animate-living-statue']) {
      spellBadges.push({
        id: 'animate-living-statue',
        name: 'Animate Living Statue',
        icon: 'systems/conan/images/icons/animate_living_statue_icon.png',
        effect: 'Summon a Living Statue to fight as your ally. Cost: 1 SP + 10 LP.',
        fromOrigin: false,
        isSpell: true
      });
    }

    if (learnedSpells['body-of-living-iron']) {
      spellBadges.push({
        id: 'body-of-living-iron',
        name: 'Body of Living Iron',
        icon: 'systems/conan/images/icons/armor_up_icon.png',
        effect: '+3 AR until end of combat. Once per combat.',
        fromOrigin: false,
        isSpell: true
      });
    }

    if (learnedSpells['lotus-miasma']) {
      spellBadges.push({
        id: 'lotus-miasma',
        name: 'Lotus Miasma',
        icon: 'systems/conan/images/icons/lotus_miasma_icon.png',
        effect: 'Attack: WitsDie+3, area. Ignores AR. Roll 5+ causes Poison. Range: Close.',
        fromOrigin: false,
        isSpell: true
      });
    }

    if (learnedSpells['lotus-flash']) {
      spellBadges.push({
        id: 'lotus-flash',
        name: 'Lotus Flash',
        icon: 'systems/conan/images/icons/lotus_flash_icon.png',
        effect: 'All enemies reduce Initiative to 1 until end of next Turn. Range: Medium.',
        fromOrigin: false,
        isSpell: true
      });
    }

    if (learnedSpells['craft-seal']) {
      spellBadges.push({
        id: 'craft-seal',
        name: 'Craft Seal',
        icon: 'systems/conan/images/icons/craft_seal_icon.png',
        effect: 'Lock/unlock or place/remove a magical seal on a door or container.',
        fromOrigin: false,
        isSpell: true
      });
    }

    // === WHITE MAGIC BADGES ===
    if (learnedSpells['talons-of-jhil']) {
      spellBadges.push({
        id: 'talons-of-jhil', name: 'Talons of Jhil',
        icon: 'systems/conan/images/icons/talons_of_jhil_icon.png',
        effect: 'Attack: 1d6+1 spectral talons. Range: Long.',
        fromOrigin: false, isSpell: true
      });
    }
    if (learnedSpells['eyes-of-the-raven']) {
      spellBadges.push({
        id: 'eyes-of-the-raven', name: 'Eyes of the Raven',
        icon: 'systems/conan/images/icons/eyes_of_the_raven_icon.png',
        effect: '+2 Edge to Perception checks. Toggle on/off via sorcery icon.',
        fromOrigin: false, isSpell: true
      });
    }
    if (learnedSpells['healing']) {
      spellBadges.push({
        id: 'healing', name: 'Healing',
        icon: 'systems/conan/images/icons/healing_icon.png',
        effect: 'Target regains WitsDie Life Points. Range: Touch.',
        fromOrigin: false, isSpell: true
      });
    }
    if (learnedSpells['call-beast']) {
      spellBadges.push({
        id: 'call-beast', name: 'Call Beast',
        icon: 'systems/conan/images/icons/call_beast_icon.png',
        effect: 'Summon a beast ally. LP cost varies by beast type (3-10 LP).',
        fromOrigin: false, isSpell: true
      });
    }
    if (learnedSpells['favor-four-winds']) {
      spellBadges.push({
        id: 'favor-four-winds', name: 'Favor of the Four Winds',
        icon: 'systems/conan/images/icons/favor_of_the_four_winds_icon.png',
        effect: 'Target gains 3 bonus Move Actions on their next Turn.',
        fromOrigin: false, isSpell: true
      });
    }
    if (learnedSpells['inspire']) {
      spellBadges.push({
        id: 'inspire', name: 'Inspire',
        icon: 'systems/conan/images/icons/inspire_icon.png',
        effect: 'Ally gains +1 SP and +2 to Checks. Once per Tale per target. Range: Medium.',
        fromOrigin: false, isSpell: true
      });
    }
    if (learnedSpells['counter-ward']) {
      spellBadges.push({
        id: 'counter-ward', name: 'Counter Ward',
        icon: 'systems/conan/images/icons/counter_ward_icon.png',
        effect: 'Reaction: Wits Contest to cancel an enemy spell as it is cast.',
        fromOrigin: false, isSpell: true
      });
    }
    if (learnedSpells['snake-arrow']) {
      spellBadges.push({
        id: 'snake-arrow', name: 'Snake Arrow',
        icon: 'systems/conan/images/icons/snake_arrow_icon.png',
        effect: 'Next ranged attack deals +1d6 damage and poisons target (-2 attacks, 1 dmg/round).',
        fromOrigin: false, isSpell: true
      });
    }
    if (learnedSpells['astral-projection']) {
      spellBadges.push({
        id: 'astral-projection', name: 'Astral Projection',
        icon: 'systems/conan/images/icons/astral_projection_icon.png',
        effect: 'Project your spirit as a ghost. Free, once per tale.',
        fromOrigin: false, isSpell: true
      });
    }
    if (learnedSpells['frightful-aura']) {
      spellBadges.push({
        id: 'frightful-aura', name: 'Frightful Aura',
        icon: 'systems/conan/images/icons/frightful_aura_icon.png',
        effect: '1 SP: Targeted enemies get -2 to Wits & Grit checks. Once per combat.',
        fromOrigin: false, isSpell: true
      });
    }
    if (learnedSpells['fearsome-ward']) {
      spellBadges.push({
        id: 'fearsome-ward', name: 'Fearsome Ward',
        icon: 'systems/conan/images/icons/fearsome_ward_icon.png',
        effect: 'Free Action: Attackers must pass Wits Check or suffer -2 to Attack. Once per combat.',
        fromOrigin: false, isSpell: true
      });
    }
    if (learnedSpells['wave-of-darkness']) {
      spellBadges.push({
        id: 'wave-of-darkness', name: 'Wave of Darkness',
        icon: 'systems/conan/images/icons/wave_of_darkness_icon.png',
        effect: 'Attack: 1d8+2 sorcery damage. Target cannot Move on their next Turn.',
        fromOrigin: false, isSpell: true
      });
    }
    if (learnedSpells['beast-form']) {
      spellBadges.push({
        id: 'beast-form', name: 'Beast Form',
        icon: 'systems/conan/images/icons/beast_form_icon.png',
        effect: 'Transform into origin beast. +2 Might/Edge/Def, +1 AR, 1d10 unarmed. Maintained 3 LP/round.',
        fromOrigin: false, isSpell: true
      });
    }
    if (learnedSpells['mesmerism']) {
      spellBadges.push({
        id: 'mesmerism', name: 'Mesmerism',
        icon: 'systems/conan/images/icons/mesmerism_icon.png',
        effect: 'Control target enemy. Permanent after 3 rounds. 1 SP, 2 Actions.',
        fromOrigin: false, isSpell: true
      });
    }
    // === DEMONIC MAGIC BADGES ===
    if (learnedSpells['bloody-talons']) {
      spellBadges.push({
        id: 'bloody-talons', name: 'Bloody Talons',
        icon: 'systems/conan/images/icons/bloody_talons_icon.png',
        effect: 'Unarmed attacks deal +1d6 damage until end of combat. Cost: 4 LP.',
        fromOrigin: false, isSpell: true
      });
    }
    if (learnedSpells['demonic-ward']) {
      spellBadges.push({
        id: 'demonic-ward', name: 'Demonic Ward',
        icon: 'systems/conan/images/icons/demonic_ward_icon.png',
        effect: 'Wits Check 8: Halve all non-Sorcery damage taken. Maintained: 1 Action.',
        fromOrigin: false, isSpell: true
      });
    }
    if (learnedSpells['uncanny-reach']) {
      spellBadges.push({
        id: 'uncanny-reach', name: 'Uncanny Reach',
        icon: 'systems/conan/images/icons/uncanny_reach_icon.png',
        effect: 'Touch range becomes Close, +1 melee damage. Maintained: 1 LP/round.',
        fromOrigin: false, isSpell: true
      });
    }
    if (learnedSpells['demonic-steed']) {
      spellBadges.push({
        id: 'demonic-steed', name: 'Demonic Steed',
        icon: 'systems/conan/images/icons/demonic_steed_icon.png',
        effect: 'Count as Mounted until spell ends. Maintained: 2 LP/round.',
        fromOrigin: false, isSpell: true
      });
    }
    if (learnedSpells['hellfire']) {
      spellBadges.push({
        id: 'hellfire', name: 'Hellfire',
        icon: 'systems/conan/images/icons/hellfire_icon.png',
        effect: 'Attack: 10 sorcery damage. Target suffers -1 to Checks & Attacks. Range: Medium.',
        fromOrigin: false, isSpell: true
      });
    }
    if (learnedSpells['summon-fiend']) {
      spellBadges.push({
        id: 'summon-fiend', name: 'Summon Fiend',
        icon: 'systems/conan/images/icons/summon_fiend_icon.png',
        effect: 'Summon a Fiend to fight as your ally. Cost: 1 SP + 8 LP.',
        fromOrigin: false, isSpell: true
      });
    }
    if (learnedSpells['summon-horror']) {
      spellBadges.push({
        id: 'summon-horror', name: 'Summon Horror',
        icon: 'systems/conan/images/icons/summon_horror_icon.png',
        effect: 'Summon a Horror to fight as your ally. Cost: 2 SP + 12 LP.',
        fromOrigin: false, isSpell: true
      });
    }
    // === NECROMANTIC MAGIC BADGES ===
    if (learnedSpells['life-leech']) {
      spellBadges.push({
        id: 'life-leech', name: 'Life Leech',
        icon: 'systems/conan/images/icons/life_leech_icon.png',
        effect: 'Attack: WitsDie sorcery damage. Regain LP equal to damage dealt. Range: Touch.',
        fromOrigin: false, isSpell: true
      });
    }
    if (learnedSpells['chilling-touch']) {
      spellBadges.push({
        id: 'chilling-touch', name: 'Chilling Touch',
        icon: 'systems/conan/images/icons/chilling_touch_icon.png',
        effect: 'Attack: WitsDie+1 sorcery damage. Target suffers -1 Phys / -2 Sorc Defense. Range: Touch.',
        fromOrigin: false, isSpell: true
      });
    }
    if (learnedSpells['stamina-leech']) {
      spellBadges.push({
        id: 'stamina-leech', name: 'Stamina Leech',
        icon: 'systems/conan/images/icons/stamina_leech_icon.png',
        effect: 'Gain 1 SP. Cost: 6 LP or free if a corpse is nearby.',
        fromOrigin: false, isSpell: true
      });
    }
    if (learnedSpells['capture-soul']) {
      spellBadges.push({
        id: 'capture-soul', name: 'Capture Soul',
        icon: 'systems/conan/images/icons/capture_soul_icon.png',
        effect: 'Heal WitsDie LP. Capture soul for +2 to any Check or Attack. One soul max.',
        fromOrigin: false, isSpell: true
      });
    }
    if (learnedSpells['summon-ghost']) {
      spellBadges.push({
        id: 'summon-ghost', name: 'Summon Ghost',
        icon: 'systems/conan/images/icons/summon_ghost_icon.png',
        effect: 'Summon a Ghost to fight as your ally. Cost: 4 LP.',
        fromOrigin: false, isSpell: true
      });
    }
    if (learnedSpells['death-scream']) {
      spellBadges.push({
        id: 'death-scream', name: 'Death Scream',
        icon: 'systems/conan/images/icons/death_scream_icon.png',
        effect: 'WitsDie+2 sorcery damage to all in Medium Range who can hear. Ignores AR.',
        fromOrigin: false, isSpell: true
      });
    }
    if (learnedSpells['raise-dead']) {
      spellBadges.push({
        id: 'raise-dead', name: 'Raise Dead',
        icon: 'systems/conan/images/icons/raise_dead_icon.png',
        effect: 'Raise 4 Skeleton Warriors as allies. Requires nearby dead bodies/remains. Cost: 10 LP.',
        fromOrigin: false, isSpell: true
      });
    }

    context.earnedBadges = [...skillBadges, ...spellBadges];

    // Prepare available skills for the selection menu
    context.availableSkills = this._prepareAvailableSkills(context.xpAvailable);

    // Pass active tab state to template to prevent flash on re-render
    context.activeTab = this._activeTab;

    return context;
  }

  // ==========================================
  // WEAPON CATALOG
  // ==========================================

  _getWeaponCatalog() {
    const imgPath = 'systems/conan/images/weapons/';
    const placeholder = 'icons/svg/sword.svg'; // Foundry default placeholder
    return {
      melee: {
        unarmed: { name: "Unarmed", type: "Unarmed", damage: "2", range: "Touch", rules: "Does not count as Melee weapon for bonus purposes", image: `${imgPath}unarmed_icon.png` },
        dagger: { name: "Dagger", type: "One-Handed Light", damage: "1d4", range: "Touch", image: `${imgPath}dagger_icon.png` },
        club: { name: "Club", type: "One-Handed Light", damage: "1d4", range: "Touch", image: `${imgPath}club_icon.png` },
        knife: { name: "Knife", type: "One-Handed Light", damage: "1d4", range: "Touch", image: `${imgPath}knife_icon.png` },
        rapier: { name: "Rapier", type: "One-Handed Light", damage: "1d4", range: "Touch", image: `${imgPath}rapier_icon.png` },
        staff: { name: "Staff", type: "One-Handed Light", damage: "1d4", range: "Touch", image: `${imgPath}staff_icon.png` },
        whip: { name: "Whip", type: "One-Handed Light", damage: "1d4", range: "Touch", image: `${imgPath}whip_icon.png` },
        shortSword: { name: "Short Sword", type: "One-Handed Medium", damage: "1d6", range: "Touch", image: `${imgPath}short_sword_icon.png` },
        tulwar: { name: "Tulwar", type: "One-Handed Medium", damage: "1d6", range: "Touch", image: `${imgPath}tulwar_icon.png` },
        hatchet: { name: "Hatchet", type: "One-Handed Medium", damage: "1d6", range: "Touch", image: `${imgPath}hatchet_icon.png` },
        handAxe: { name: "Hand Axe", type: "One-Handed Medium", damage: "1d6", range: "Touch", image: `${imgPath}hand_axe_icon.png` },
        huntingSpear: { name: "Hunting Spear", type: "One-Handed Medium", damage: "1d6", range: "Touch", image: `${imgPath}hunting_spear_icon.png` },
        mace: { name: "Mace", type: "One-Handed Heavy", damage: "1d6", range: "Touch", image: `${imgPath}mace_icon.png` },
        warhammer: { name: "Warhammer", type: "One-Handed Heavy", damage: "1d6", range: "Touch", image: `${imgPath}warhammer_icon.png` },
        broadsword: { name: "Broadsword", type: "One-Handed Heavy", damage: "1d8", range: "Touch", image: `${imgPath}broadsword_icon.png` },
        longSword: { name: "Long Sword", type: "One-Handed Heavy", damage: "1d8", range: "Touch", image: `${imgPath}long_sword_icon.png` },
        cutlass: { name: "Cutlass", type: "One-Handed Heavy", damage: "1d8", range: "Touch", image: `${imgPath}cutlass_icon.png` },
        battleAxe: { name: "Battle-Axe", type: "One-Handed Heavy", damage: "1d8", range: "Touch", image: `${imgPath}battle_axe_icon.png` },
        scimitar: { name: "Scimitar", type: "One-Handed Heavy", damage: "1d8", range: "Touch", image: `${imgPath}scimitar_icon.png` },
        warSpear: { name: "War Spear", type: "Two-Handed Medium", damage: "1d10", range: "Close 1", rules: "Enemy AR considered 2 lower", image: `${imgPath}war_spear_icon.png` },
        halberd: { name: "Halberd", type: "Two-Handed Medium", damage: "1d10", range: "Close 1", rules: "Enemy AR considered 2 lower", image: `${imgPath}halberd_icon.png` },
        lance: { name: "Lance", type: "Two-Handed Medium", damage: "1d10", range: "Close 1", rules: "Enemy AR considered 2 lower", image: `${imgPath}lance_icon.png` },
        greatSword: { name: "Great Sword", type: "Two-Handed Heavy", damage: "1d12", range: "Touch", image: `${imgPath}great_sword_icon.png` },
        greatAxe: { name: "Great Axe", type: "Two-Handed Heavy", damage: "1d12", range: "Touch", image: `${imgPath}great_axe_icon.png` },
        maul: { name: "Maul", type: "Two-Handed Heavy", damage: "1d12", range: "Touch", image: `${imgPath}maul_icon.png` }
      },
      thrown: {
        rock: { name: "Rock", type: "Improvised Light", damage: "2", range: "Medium 3", ammo: { current: 3, max: 3 }, image: `${imgPath}rock_icon.png` },
        throwingKnife: { name: "Throwing Knife", type: "Thrown Light", damage: "1d4", range: "Medium 3", ammo: { current: 3, max: 3 }, image: `${imgPath}throwing_knife_icon.png` },
        throwingStar: { name: "Throwing Star", type: "Thrown Light", damage: "1d4", range: "Medium 3", ammo: { current: 5, max: 5 }, image: `${imgPath}throwing_star_icon.png` },
        javelin: { name: "Javelin", type: "Thrown Medium", damage: "1d6", range: "Medium 3", ammo: { current: 3, max: 3 }, image: `${imgPath}javelin_icon.png` },
        throwingAxe: { name: "Throwing Axe", type: "Thrown Medium", damage: "1d6", range: "Medium 3", ammo: { current: 2, max: 2 }, image: `${imgPath}throwing_axe_icon.png` }
      },
      ranged: {
        sling: { name: "Sling", type: "Ranged Light", damage: "1d4", range: "Medium 3", ammo: { current: 20, max: 20 }, rules: "-1 to Attack. May be used One-Handed", image: `${imgPath}sling_icon.png` },
        primitiveBow: { name: "Primitive Bow", type: "Ranged Light", damage: "1d4+1", range: "Long 4", ammo: { current: 20, max: 20 }, image: `${imgPath}primitive_bow_icon.png` },
        shortBow: { name: "Short Bow", type: "Ranged Medium", damage: "1d6+1", range: "Long 6", ammo: { current: 20, max: 20 }, image: `${imgPath}short_bow_icon.png` },
        lightCrossbow: { name: "Light Crossbow", type: "Ranged Medium", damage: "1d8+1", range: "Medium 3", ammo: { current: 20, max: 20 }, rules: "1 Action reload. +2 Damage at Close", image: `${imgPath}light_crossbow_icon.png` },
        longBow: { name: "Long Bow", type: "Ranged Heavy", damage: "1d8+1", range: "Distant 8", ammo: { current: 20, max: 20 }, rules: "Cannot use at Touch Range", image: `${imgPath}long_bow_icon.png` },
        heavyCrossbow: { name: "Heavy Crossbow", type: "Ranged Heavy", damage: "1d10+1", range: "Distant 7", ammo: { current: 20, max: 20 }, rules: "1 Action reload. +2 Damage at Close", image: `${imgPath}heavy_crossbow_icon.png` }
      }
    };
  }

  _abbreviateWeaponName(name) {
    if (!name) return "???";
    if (name.length <= 7) return name;

    // Common abbreviations
    const abbrevs = {
      "Broadsword": "BrdSwd",
      "Long Sword": "LngSwd",
      "Short Sword": "ShtSwd",
      "Great Sword": "GrtSwd",
      "Battle-Axe": "BtlAxe",
      "Great Axe": "GrtAxe",
      "Hand Axe": "HndAxe",
      "Throwing Knife": "ThrKnf",
      "Throwing Star": "ThrStr",
      "Throwing Axe": "ThrAxe",
      "Hunting Spear": "HntSpr",
      "War Spear": "WarSpr",
      "Primitive Bow": "PrmBow",
      "Short Bow": "ShtBow",
      "Long Bow": "LngBow",
      "Light Crossbow": "LtXbow",
      "Heavy Crossbow": "HvXbow",
      "Warhammer": "WarHmr"
    };

    if (abbrevs[name]) return abbrevs[name];

    // Generic abbreviation: first 7 chars
    return name.substring(0, 7);
  }

  // ==========================================
  // SORCERY SPELL CATALOG
  // ==========================================

  _getSpellCatalog() {
    return {
      alchemy: {
        id: "alchemy",
        name: "Alchemy",
        inherentSpells: [
          { id: "create-food", name: "Create Food", type: "cast", cost: {}, actions: 1, effect: "Create enough food and water for one person for one day." },
          { id: "radium-gem", name: "Radium Gem", type: "cast", cost: {}, actions: 0, effect: "A glowing gem that provides light for 1 hour per Wits value. Toggle on/off as a free action." },
          { id: "artifact-spirit", name: "Artifact Spirit", type: "cast", cost: {}, actions: 1, effect: "Sense magical properties of an item you touch." }
        ],
        purchasableSpells: [
          { id: "lotus-flash", name: "Lotus Flash", xpCost: 1, type: "cast", cost: { sp: 1 }, actions: 1, range: "Medium", effect: "All enemies reduce Initiative to 1 until end of next Turn." },
          { id: "body-of-living-iron", name: "Body of Living Iron", xpCost: 2, type: "cast", cost: { sp: 1 }, actions: 0, effect: "+3 AR until end of combat.", limit: "Once per combat" },
          { id: "craft-seal", name: "Craft Seal", xpCost: 2, type: "cast", cost: { sp: 1 }, actions: "1-2", effect: "Lock/unlock or place/remove a magical seal on a door or container." },
          { id: "tide-of-stone", name: "Tide of Stone", xpCost: 3, type: "attack", cost: { lp: 6 }, actions: 1, range: "Medium", damage: "1d8+2", effect: "Target suffers -1 Physical Defense if damaged." },
          { id: "create-bane-weapon", name: "Create Bane Weapon", xpCost: 4, type: "cast", cost: { lp: "4/6/8" }, actions: 1, effect: "Weapon deals +1d6/1d8/1d10 damage and knocks target Prone.", duration: { hasDuration: true, maintainCost: "3 LP + 1 Action" } },
          { id: "animate-living-statue", name: "Animate Living Statue", xpCost: 5, type: "cast", cost: { sp: 1, lp: 10 }, actions: 2, effect: "Summon a Living Statue to fight as your ally." },
          { id: "lotus-miasma", name: "Lotus Miasma", xpCost: 6, type: "attack", cost: { sp: 1 }, actions: 2, range: "Close", damage: "WitsDie+3", effect: "Hits all non-Undead in area, ignores AR. Roll of 5+ causes Poison.", duration: { hasDuration: true, maintainCost: "1 LP + 2 Actions" } }
        ]
      },
      blackMagic: {
        id: "blackMagic",
        name: "Black Magic",
        inherentSpells: [
          { id: "whispers-darkness", name: "Whispers in the Darkness", type: "cast", cost: {}, actions: 1, effect: "Send a telepathic message to someone you can see." },
          { id: "illusory-shadow", name: "Illusory Shadow", type: "cast", cost: {}, actions: 1, effect: "Create a shadowy illusion that lasts for 1 minute." },
          { id: "nights-gift", name: "Night's Gift", type: "cast", cost: {}, actions: 0, effect: "See in complete darkness for 1 hour." }
        ],
        purchasableSpells: [
          { id: "snake-arrow", name: "Snake Arrow", xpCost: 1, type: "cast", cost: { lp: 3 }, actions: 1, effect: "Your next Ranged Attack deals +1d6 damage and Poisons the target." },
          { id: "astral-projection", name: "Astral Projection", xpCost: 2, type: "cast", cost: {}, actions: 2, effect: "Wits Check 8: Appear as a ghost anywhere you have been.", limit: "Once per Tale" },
          { id: "frightful-aura", name: "Frightful Aura", xpCost: 2, type: "cast", cost: { sp: 1 }, actions: 1, effect: "Enemies within Close range suffer -2 to Wits and Grit Checks.", limit: "Once per combat" },
          { id: "fearsome-ward", name: "Fearsome Ward", xpCost: 3, type: "cast", cost: { lp: "2/5/8" }, actions: 0, effect: "Attackers must pass a Wits Check or suffer -2 to their Attack.", limit: "Once per combat" },
          { id: "wave-of-darkness", name: "Wave of Darkness", xpCost: 3, type: "attack", cost: { lp: 6 }, actions: 1, range: "Medium", damage: "1d8+2", effect: "Target cannot Move on their next Turn." },
          { id: "beast-form", name: "Beast Form", xpCost: 4, type: "cast", cost: { sp: 2 }, actions: 1, effect: "+2 Might/Edge/Physical Defense, +1 AR, unarmed attacks deal 1d10.", duration: { hasDuration: true, maintainCost: "3 LP" }, limit: "Once per Tale" },
          { id: "mesmerism", name: "Mesmerism", xpCost: 6, type: "attack", cost: { sp: 1 }, actions: 2, range: "Close", effect: "Control target's Actions on their turn.", duration: { hasDuration: true, maintainCost: "2 Actions" } }
        ]
      },
      demonicMagic: {
        id: "demonicMagic",
        name: "Demonic Magic",
        inherentSpells: [
          { id: "bloodhound", name: "Bloodhound", type: "cast", cost: {}, actions: 1, effect: "By sampling a target's blood the Sorcerer forms a bond, can track them, and knows if they are near. There is no escape from this bond until the Sorcerer dispels it or one of them dies." },
          { id: "demonic-vessel", name: "Demonic Vessel", type: "cast", cost: {}, actions: 0, effect: "The Sorcerer can sense demons and other unnatural beings nearby. Cursed and fiendish items glow in their sight." },
          { id: "infernal-ward", name: "Infernal Ward", type: "cast", cost: {}, actions: 0, effect: "Demonic blood carries many curses and some boons. Demons will ignore the sorcerer unless Attacked first, but only as long as there are other foes on the field." }
        ],
        purchasableSpells: [
          { id: "bloody-talons", name: "Bloody Talons", xpCost: 1, type: "cast", cost: { lp: 4 }, actions: 1, effect: "Unarmed attacks deal +1d6 damage until end of combat.", limit: "Once per combat" },
          { id: "demonic-ward", name: "Demonic Ward", xpCost: 2, type: "cast", cost: {}, actions: 1, effect: "Wits Check 8: Halve all non-Sorcery damage taken.", duration: { hasDuration: true, maintainCost: "1 Action" } },
          { id: "uncanny-reach", name: "Uncanny Reach", xpCost: 2, type: "cast", cost: { lp: 2 }, actions: 0, effect: "Touch range becomes Close, +1 damage to melee attacks.", duration: { hasDuration: true, maintainCost: "1 LP" } },
          { id: "demonic-steed", name: "Demonic Steed", xpCost: 3, type: "cast", cost: { sp: 1 }, actions: 1, effect: "Count as Mounted until the spell ends.", duration: { hasDuration: true, maintainCost: "2 LP" } },
          { id: "hellfire", name: "Hellfire", xpCost: 3, type: "attack", cost: { lp: 6 }, actions: 1, range: "Medium", damage: "10", effect: "Target suffers -1 to Checks and Attacks on their next Turn." },
          { id: "summon-fiend", name: "Summon Fiend", xpCost: 4, type: "cast", cost: { sp: 1, lp: 8 }, actions: 2, effect: "Summon a Fiend to fight as your ally." },
          { id: "summon-horror", name: "Summon Horror", xpCost: 6, type: "cast", cost: { sp: 2, lp: 12 }, actions: 2, effect: "Summon a Horror to fight as your ally." }
        ]
      },
      necromanticMagic: {
        id: "necromanticMagic",
        name: "Necromantic Magic",
        inherentSpells: [
          { id: "death-sight", name: "Death Sight", type: "cast", cost: {}, actions: 1, effect: "Determine how and how long ago a creature died by touch — or other, less natural senses." },
          { id: "chilling-presence", name: "Chilling Presence", type: "cast", cost: {}, actions: 0, effect: "Lower the temperature around you; extinguish small flames." },
          { id: "undead-ward", name: "Undead Ward", type: "cast", cost: {}, actions: 1, effect: "Undead must pass Wits Check to approach you for 1 hour." }
        ],
        purchasableSpells: [
          { id: "life-leech", name: "Life Leech", xpCost: 1, type: "attack", cost: { sp: 1 }, actions: 1, range: "Touch", damage: "WitsDie", effect: "Regain Life Points equal to damage dealt." },
          { id: "chilling-touch", name: "Chilling Touch", xpCost: 2, type: "attack", cost: { sp: 1 }, actions: 1, range: "Touch", damage: "WitsDie+1", effect: "Target suffers -1 Physical Defense and -2 Sorcery Defense." },
          { id: "stamina-leech", name: "Stamina Leech", xpCost: 2, type: "cast", cost: { lp: 6 }, actions: 1, effect: "Gain 1 Stamina Point." },
          { id: "capture-soul", name: "Capture Soul", xpCost: 3, type: "cast", cost: { sp: 1 }, actions: 1, range: "Touch", effect: "Heal WitsDie LP. Capture soul for +2 to any Check or Attack. One soul max." },
          { id: "summon-ghost", name: "Summon Ghost", xpCost: 3, type: "cast", cost: { lp: 4 }, actions: 2, effect: "Summon a Ghost to fight as your ally." },
          { id: "death-scream", name: "Death Scream", xpCost: 5, type: "attack", cost: { lp: 6 }, actions: 2, range: "Medium", damage: "WitsDie+2", effect: "Hits all creatures who can hear you, ignores AR." },
          { id: "raise-dead", name: "Raise Dead", xpCost: 6, type: "cast", cost: { lp: 10 }, actions: 2, effect: "Raise 4 Skeleton Warriors to fight as your allies." }
        ]
      },
      whiteMagic: {
        id: "whiteMagic",
        name: "White Magic",
        inherentSpells: [
          { id: "signs-jhebbal-sag", name: "Signs of Jhebbal Sag", type: "cast", cost: {}, actions: 1, effect: "Communicate with animals for 10 minutes." },
          { id: "sense-sorcery", name: "Sense Sorcery", type: "cast", cost: {}, actions: 0, effect: "Detect active magic and sorcerers within Close range." },
          { id: "life-sight", name: "Life Sight", type: "cast", cost: {}, actions: 1, effect: "See living creatures through walls for 1 minute." }
        ],
        purchasableSpells: [
          { id: "talons-of-jhil", name: "Talons of Jhil", xpCost: 1, type: "attack", cost: { lp: 3 }, actions: 1, range: "Long", damage: "1d6+1", effect: "Spectral talons strike your target from afar." },
          { id: "eyes-of-the-raven", name: "Eyes of the Raven", xpCost: 2, type: "cast", cost: { sp: 1 }, actions: 0, effect: "+2 Edge to Perception checks. Toggle on/off via icon.", limit: "Toggle" },
          { id: "healing", name: "Healing", xpCost: 2, type: "cast", cost: { sp: 1 }, actions: 2, range: "Touch", damage: "WitsDie", isHealing: true, effect: "Target regains Life Points equal to the roll." },
          { id: "call-beast", name: "Call Beast", xpCost: 3, type: "cast", cost: { lp: "3-10" }, actions: 2, effect: "Summon a beast ally (LP cost varies by beast type)." },
          { id: "favor-four-winds", name: "Favor of the Four Winds", xpCost: 3, type: "cast", cost: { lp: 4 }, actions: 1, effect: "Target gains 3 bonus Move Actions on their next Turn." },
          { id: "inspire", name: "Inspire", xpCost: 4, type: "cast", cost: { sp: 1 }, actions: 1, range: "Medium", effect: "Ally gains +1 Stamina Point and +2 to Checks.", limit: "Once per Tale per target" },
          { id: "counter-ward", name: "Counter Ward", xpCost: 6, type: "reaction", cost: { sp: 1 }, actions: 0, effect: "Wits Contest to cancel an enemy's spell as it is cast." }
        ]
      }
    };
  }

  /**
   * Get sorcery access based on origin
   * Returns array of discipline IDs the character can access
   */
  _getOriginSorceryAccess(originId) {
    const sorceryMap = {
      "from-the-hills": [],
      "from-the-streets": [],
      "from-the-steppes": [],
      "from-the-north": [],
      "from-the-wilds": [],
      "from-a-civilized-land": ["alchemy"],
      "from-parts-unknown": ["alchemy", "blackMagic", "demonicMagic", "necromanticMagic", "whiteMagic"], // Can choose any 2
      "from-the-blood-of-jhebbal-sag": ["alchemy", "whiteMagic"],
      "from-the-blood-of-acheron": ["alchemy", "blackMagic", "demonicMagic", "necromanticMagic", "whiteMagic"],
      "from-the-blood-of-a-demon": ["blackMagic", "demonicMagic"]
    };
    return sorceryMap[originId] || [];
  }

  /**
   * Check if origin allows choosing disciplines (From Parts Unknown)
   */
  _originAllowsDisciplineChoice(originId) {
    return originId === "from-parts-unknown";
  }

  /**
   * Format spell cost for display
   */
  _formatSpellCost(cost) {
    if (!cost) return "Free";
    const parts = [];
    if (cost.lp) parts.push(`${cost.lp} LP`);
    if (cost.sp) parts.push(`${cost.sp} SP`);
    return parts.length > 0 ? parts.join(", ") : "Free";
  }

  /**
   * Abbreviate spell name for card display
   */
  _abbreviateSpellName(name) {
    if (!name) return "???";
    if (name.length <= 8) return name;

    // Common abbreviations for long spell names
    const abbrevs = {
      "Body of Living Iron": "LivIron",
      "Create Bane Weapon": "BaneWpn",
      "Animate Living Statue": "LivStat",
      "Lotus Miasma": "LotMias",
      "Whispers in the Darkness": "Whisper",
      "Illusory Shadow": "IllShad",
      "Astral Projection": "AstProj",
      "Frightful Aura": "FrtAura",
      "Fearsome Ward": "FrsWard",
      "Wave of Darkness": "WavDark",
      "Demonic Vessel": "DmnVesl",
      "Infernal Ward": "InfWard",
      "Bloody Talons": "BldTaln",
      "Demonic Ward": "DmnWard",
      "Uncanny Reach": "UncRech",
      "Demonic Steed": "DmnSted",
      "Summon Fiend": "SumFnd",
      "Summon Horror": "SumHorr",
      "Chilling Presence": "ChilPrs",
      "Undead Ward": "UndWard",
      "Life Leech": "LifLech",
      "Chilling Touch": "ChilTch",
      "Stamina Leech": "StmLech",
      "Capture Soul": "CapSoul",
      "Summon Ghost": "SumGhst",
      "Death Scream": "DthScrm",
      "Raise Dead": "RseDead",
      "Signs of Jhebbal Sag": "SgnJheb",
      "Sense Sorcery": "SnsSorc",
      "Life Sight": "LifSght",
      "Talons of Jhil": "TlnJhil",
      "Eyes of the Raven": "EyeRavn",
      "Call Beast": "CalBst",
      "Favor of the Four Winds": "FavWind",
      "Counter Ward": "CntWard",
      "Lotus Flash": "LotFlsh",
      "Craft Seal": "CrfSeal",
      "Tide of Stone": "TidSton",
      "Snake Arrow": "SnkArrw",
      "Beast Form": "BstForm"
    };

    if (abbrevs[name]) return abbrevs[name];
    return name.substring(0, 8);
  }

  /**
   * Get available XP count from checkbox array
   */
  _getAvailableXP() {
    const xpData = this.actor.system.xp?.available;
    if (!xpData) return 0;

    // Count checked (available) XP
    let count = 0;
    if (Array.isArray(xpData)) {
      count = xpData.filter(v => v === true).length;
    } else {
      for (let i = 0; i < 10; i++) {
        if (xpData[i] === true || xpData[String(i)] === true) count++;
      }
    }
    return count;
  }

  // ==========================================
  // ORIGIN DATA LOOKUP
  // ==========================================

  _getOriginData() {
    return {
      "from-the-hills": {
        id: "from-the-hills",
        name: "From the Hills",
        baseLP: 30,
        sorcery: "None",
        bonuses: "At the start of each Tale, choose Might, Edge, or Grit. For the duration of that Tale, apply +1 to all Checks and Attacks related to the chosen Stat.",
        startingSkills: "None",
        backgroundImage: "bg_hills.jpg",
        flavorQuote: "He came of a race of hillmen, accustomed to scaling forbidding crags, and he was a man of unusual strength and agility.",
        quoteSource: "Robert E. Howard, \"Jewels of Gwahlur\"",
        description: "You grew up beyond the frontiers of civilization. Beyond the Border Kingdoms, beyond the perfumed fops calling themselves knights in Aquilonia. You grew up in a land where blood and danger always lay just beyond the nearest hilltop, where the air itself froze in the lungs, where snow made every forward step a struggle. The hills breed hardy people, and you're the hardiest of them. Since you could lift a sword, you've been embroiled in blood feuds and tribal combat. Since you could walk, you've negotiated the forests and the hilltops. Since you could talk, your throat has been hoarse with war cries.\n\nYou're a warrior-born. It's the only way you've managed to survive. Those native to the harsh, unyielding terrain of the north are born with sword in hand. You learned to stab in the cradle, your food withheld from you unless you could claim it like a warrior, and in place of the wooden toys given to most infants, you clutched a wooden shield. Battle is your life. You came of age in the shield wall; you earned your tribe's respect in the duels fought between rivals in the heart of your village, watched over by the carved stone faces of the gods. War, bloodshed, the clash of blades and the screams of the dying; these make up your life. Blood-hardened, iron-strong, hill-born... this is you.\n\nBut it's not all you are. Even as you swarmed over the walls of the civilized outposts of the southern kingdoms, you wanted more. The gray hills of your homeland might have inculcated the skills of the sword, made you granite-tough and tiger-fast in the melee, but where was the joy of battle you felt? Where were the sword songs? Where the quaffing of ale, and the celebration of a battle won? No. The hills of the north may have made you, but you wanted more than grim faces and gray skies. So you've taken up your sword once more, but now you head out into the broader world, ready to write a legend for yourself, in blood and gold."
      },
      "from-the-streets": {
        id: "from-the-streets",
        name: "From the Streets",
        baseLP: 22,
        sorcery: "None",
        bonuses: "+1 to all Edge Checks and Attacks.",
        startingSkills: "Fleet-Footed OR Of the Shadows",
        backgroundImage: "bg_streets.jpg",
        flavorQuote: "In one of these dens merriment thundered to the low smoke-stained roof, where rascals gathered in every stage of rags and tatters.",
        quoteSource: "Robert E. Howard, \"The Tower of the Elephant\"",
        description: "Every city has one. A place you don't tread if you aren't good with a knife and able to pick a pocket so deftly even the pocket doesn't realize it's empty. In Zamora, the place is called the Maul. Elsewhere, the Maze. The specifics might differ, but the essence remains the same. Knotted tangles of avenues and passageways. Drinking dens populated by the harshest and cruelest. Hovels where the old wither and the hunted hide. And you were born here. Born in the hidden underside of civilization. Heir only to muck and larceny. It wasn't an auspicious start, but you don't care about auspices (indeed, you're not quite sure what they are; you had a different sort of education to those book-learning brats in the better parts of the city).\n\nIt started with filching things from unwatched windowsills. Just some food, maybe, nothing anyone would miss too much, even in a place as penurious as the Maul. But soon you realized this was the way to make your life count for something. They—those fancy fools in the palaces who pretended not to see you as you scampered through the markets—won't give you anything. But that was okay; you preferred taking it from them anyway.\n\nIn places like the Maul, or whichever version of it you hail from, you don't go long as a young thief before you get shown how things work. It's never just a case of taking what you can. There's always a bigger rat in the sewer, and soon you were working for the bigger rats, giving them a share of your hauls, and learning as fast as you could. You learned about finding the right mark and how to tell the truly rich from the merely flashy; you learned about the treasures you could take and those you should avoid because they carried the otherworldly touch; and you learned how to cut a throat and drive the knife into the guts of your opponent and leave them to bleed out.\n\nYou learned it all, you learned it well. Now it's time to take your talents out into the wide world. There are much richer pickings than this city, and you're going to take them for every penny."
      },
      "from-the-steppes": {
        id: "from-the-steppes",
        name: "From the Steppes",
        baseLP: 26,
        sorcery: "None",
        bonuses: "+1 to all Ranged Damage.",
        startingSkills: "Born in the Saddle",
        backgroundImage: "bg_steppes.jpg",
        flavorQuote: "Shaking the sweat and blood from his eyes, Conan saw four horsemen sitting their steeds in the twilight and staring up at him.",
        quoteSource: "Robert E. Howard, \"A Witch Shall Be Born\"",
        description: "So vast they used to tell you your homeland was a reflection of heaven itself, the steppes stretch on endlessly beneath the sky. Here, the horse tribes of the Hyrkanians rule. Here, the rider rules. Here, you were born in the saddle. You could ride before you could walk, before you knew the names of the sky spirits or the stars watching over you. You rode with the tribe as they followed the seasons across the infinite steppe.\n\nYou bonded with your mount, trusting them as you trusted no other living soul. You learned to wield a sword, but most importantly, you learned to use the bow. The bow is the true weapon of your people. Made from the wood of the hardy trees growing along the riverbanks, layered with the horn of the cattle you herded, and strung with the guts of the wild cats and lions ranging the plains, it can drive an arrow through the throat of an armored Bossonian knight at two-hundred yards. And you can fire it with the same speed and accuracy from the back of your charging horse as any fool standing steady on their feet.\n\nEventually, even the horizons of the steppes began to feel like a constraint to you. You heard the tales of the civilized cities of the west from the merchants and the mercenaries accompanying them. You heard of the treasures waiting to be claimed from hands grown soft and clumsy from complacency, hands long unused to the strain of the reins against fingers, to the pressure of the taut bowstring. So you bid farewell to your tribe, to the steppes, to the spirits of your homeland. A different destiny waits for you. You know you'll return one day soon, though. The steppes are a part of you, and you intend to bring them to the soft, decadent world beyond their borders, and make those of that world quake in fear."
      },
      "from-the-north": {
        id: "from-the-north",
        name: "From the North",
        baseLP: 32,
        sorcery: "None",
        bonuses: "+1 to all Melee Damage.",
        startingSkills: "Iron Hide OR Charge",
        backgroundImage: "bg_steppes.jpg", // TODO: replace with bg_north.jpg when available
        flavorQuote: "Man of the raven locks, tell me your name, so that my brothers in Vanaheim may know who was the last of Wulfhere's band to fall before the sword of Heimdul.",
        quoteSource: "Robert E. Howard, \"Gods of the North\"",
        description: "Where the icebergs, calved from the great glaciers of the north, drift. Where the skalds intone strange songs of the frost giant, Ymir, and his beautiful daughter. Where the mead is drunk, and the old gods toast as though they sit at one's right hand... that is where you first drew breath, breath which fogged in the air and hung above your small, frail form like a mighty doom waiting to be embraced.\n\nSuch is the way of things in the remote regions of the north. Here the ice crystals form in your beard in seconds, and falling into the water is a death sentence—provided the fall is hard enough to breach the thick ice crusting over it. Fortunately, you were strong enough to survive, to grow to adulthood in the brutal cultures of your homeland. Your people are ship builders, sailors, reavers. You pillaged the shores of those nations to the south, dragging back gold and captives and tales of your own heroism, to become the great sagas you dreamed of having sung in your name.\n\nYou'd done this since you were a child. You knew the whims of the sea almost as well as you did the tempers of your crewmates, the cold anger of your monarch. You knew how to make a ship skip over and through the waves, you knew how to catch the wind, how to break the storm. And you knew how to find those secret coves, the hidden rivers, leading you into the fatted, verdant lands of the south. There, those unexpecting fools also discovered you knew the way of the sword and the spear; that you knew how to feed the ravens, as well as to follow them to the richest outposts.\n\nBut too often your ship turned for home before you were done exploring. Too often the mead hall summoned you back before you'd gathered enough loot, or performed enough heroic feats, to earn your place in the skald's songs. Not this time, however. This time, you decided to stay. To strike out into the lands of the south, to claim your destiny, and to find the mightiest doom ever heard of in the whole of the freezing north."
      },
      "from-the-wilds": {
        id: "from-the-wilds",
        name: "From the Wilds",
        baseLP: 30,
        sorcery: "None",
        bonuses: "+1 to all Grit Checks.\nSpend 1 Stamina Point to regain 2 Life Points.",
        startingSkills: "None",
        backgroundImage: "bg_hills.jpg", // TODO: replace with bg_wilds.jpg when available
        flavorQuote: "As he talked he was leading the way deeper and deeper into the ancient wilderness.",
        quoteSource: "Robert E. Howard, \"Beyond the Black River\"",
        description: "They call you many things. Few sound kind to your ear. The markings of your homeland—the tattoos or scarification, the woad coloring your skin, or the necklace of ears and animal teeth dangling around your neck—all draw their attention, leading to the sudden fear you see in their eyes, the hostile whispers. But you're long used to it. You've always known those from the so-called \"civilized\" lands feared those like you. They fear all things lying beyond the narrow limits of their cultured expectations; they do not understand the surge of life, of primal joy, felt by those who were born in the wilderness.\n\nYou know only the hardness of earth beneath your feet, the rush of the river's uncorrected course, and you are as comfortable in the branches of a tree as on the ground. The wild made you as much as any other human beings have. Of course, you weren't born alone. You have family: you might belong to those clans of humans dwelling in the forests beyond the Border Kingdoms or deep in the jungles where the encroachment of \"civilization\" is limited to the occasional boat full of fools trying to claim new land for their ruler or themselves. There was a village where you grew and ate and occasionally slept. There were friends, teachers, guides to the ways of the wild. But they didn't coddle you, didn't make you sit and learn the names of dozens of dead aristocrats.\n\nInstead, you ventured out into the wilds alone. You hunted the deer, you tracked the auroch, you shot down the eagle. You fought through the crocodile-infested swamps, and you harvested the venom from the vipers on the jungle floor. You are the wilderness. When men call you names, they do so because they see you do not need them and their goods, their endless fripperies, to survive. You can survive because it is what you were shaped for, shaped for by the wilderness itself. And now you will survive any adventure, any danger you encounter. Surviving, after all, is what you have always done."
      },
      "from-a-civilized-land": {
        id: "from-a-civilized-land",
        name: "From a Civilized Land",
        baseLP: 22,
        sorcery: "Alchemy",
        bonuses: "+2 to all Wits Checks.",
        startingSkills: "Uncanny Warding",
        backgroundImage: "bg_streets.jpg", // TODO: replace with bg_civilized.jpg when available
        flavorQuote: "Once, limned against a purple sunless horizon, he saw the mighty walls and towers of a great city such as rose nowhere on the waking earth he knew.",
        quoteSource: "Robert E. Howard, \"Hour of the Dragon\"",
        description: "The cities of Aquilonia, Nemedia, Corinthia, and Stygia are many things. Decadent, perhaps. But not safe. Never safe. So, when you hear the claims of your homeland being soft, effete, or incapable of preparing a person for the dangers of a life exploring the darkest corners of the Thurian continent, it's almost enough to laugh. It's true, you'll admit, that civilized people do not have their heads split in two by a sword as a regular thing. Civilized people tend to be poisoned, or garrotted in their beds. Or have their heads removed by the executioner as a result of the political machinations of various rivals. It's a quieter form of slaughter, perhaps, but no less effective.\n\nYou grew up amongst this, learned to navigate politics and intrigue, sometimes delivered at the point of a knife. Perhaps you were the child of a minor aristocrat, raised to fulfill some function in court. Perhaps you were born into a merchant family, given some education as a result of your parent's wealth. Maybe you were a servant in the house of a noble, made to study with the children of your master.\n\nWhatever your past, it left you with some skill in scheming and stabbing, and enough education to read, to write, to think... and it left you with so many questions. Questions people didn't want to answer. About the past, perhaps. Or about things you weren't meant to talk about. Like the demons in those stories you were told. Were they real? You know you weren't meant to ask those questions; you could see their faces went still when you spoke.\n\nBeing smart enough to stop asking didn't mean you stopped wanting the answers. And now you're old enough to venture into the world and find them for yourself. There are so many mysteries in the world, so many ancient and forgotten places, so much waiting to be rediscovered. And you're the one to do so. You've spent hours in the libraries of the great palaces, masquerading as a curator. You've examined the maps of long-dead scholars, hunting for the lost temples of the wise. Now you're ready. Ready to discover the truth of this world. And if you need to get your hands bloody to do so... so be it."
      },
      "from-parts-unknown": {
        id: "from-parts-unknown",
        name: "From Parts Unknown",
        baseLP: 26,
        sorcery: "Any two disciplines",
        bonuses: "+1 to all Checks made as part of a Contest.\nSpend 1 Stamina Point to gain +2 Sorcery Defense for the duration of the current combat.",
        startingSkills: "None",
        backgroundImage: "bg_hills.jpg", // TODO: replace with bg_unknown.jpg when available
        flavorQuote: "Men said he spent much time in the hills, in curious conclaves with surviving remnants of an old race.",
        quoteSource: "Robert E. Howard, \"Hour of the Dragon\"",
        description: "Your homeland isn't on any maps. Or at least so you tell people. You keep your past to yourself, and only you know why. Perhaps it is so soaked in blood even the most stout-hearted soldier would start running if they heard a part of it. Maybe your name is cursed by those you once called friends. Maybe, where you once dwelled, there were statues erected to your name and temples sanctified to your worship—until they realized you were no god. Just a person with a quick tongue and an eye for opportunity. And then the statues got pulled down, and you needed to run.\n\nYou could be hunted by people not looking for your blood. You might be royalty, chafing against the constraints of your role or the expectations of your family. Heirs to the throne are known to run away; are you one of them? Perhaps you truly are from some land uncharted by even the most assiduous scholars. One of the remnant peoples of ancient Valusia, or ocean-drunk Atlantis. The world is vast and strange, and it holds to its secrets even more tightly than you.\n\nOnly you know the truth, and for now at least, you're keeping it to yourself. There are some truths you can't conceal, despite your best efforts. You know how to handle yourself—few survive long in this world if they can't, after all. Whether it's with the blade or an ability to call upon the dark elemental forces of magic, you can protect yourself against the depredations of those who'd do you harm. And, as those who greet you in inns and taverns loudly announce, you aren't from around here. You might hide where you're from, but you can't quite conceal that it isn't from here. There's a lilt to your accent, a style to your hair, a habit you can't quite shake. Other than this, you're a mystery. Just how you like it."
      },
      "from-the-blood-of-jhebbal-sag": {
        id: "from-the-blood-of-jhebbal-sag",
        name: "From the Blood of Jhebbal Sag",
        baseLP: 28,
        sorcery: "Alchemy, White Magic",
        bonuses: "Whenever you regain Life Points, regain 2 additional Life Points.",
        startingSkills: "Healing spell",
        backgroundImage: "bg_hills.jpg", // TODO: replace with bg_jhebbal.jpg when available
        flavorQuote: "Once all living things worshipped him. That was long ago, when beasts and men spoke one language.",
        quoteSource: "Robert E. Howard, \"Beyond the Black River\"",
        description: "In the dense forests of the north, amidst the endless ranks of trees, in the heart of the wild itself... there dwells the old god. Humanity knows him as Jhebbal Sag. Once, so the tales tell, all humans and beasts spoke with the same tongue. Even now, some of the animals stalking the woods and jungles and plains of the earth visit the forgotten places, the ancient groves where Jhebbal Sag once ruled. And perhaps, just perhaps, a few people do too.\n\nYou knew you were different almost before you knew anything else. You could sense it. Sense how people felt before they felt it themselves. Smell their apprehension, detect the anger before it tore itself free from their throats, understand their desires forming in their minds. But it was in the way animals treated you that you truly recognized your growing power. They knew you, somehow. No dog ever howled at you in panic, or yapped in uncertain excitement at your coming. Even when you ventured out into the deep dark spaces, where the big game waited to be taken—even then, you never feared the wrath of the bear as your kin did. You knew the bear would know you, and you were right. Even the deadliest beasts in the forests saw you as being one of them in some way you couldn't explain.\n\nAt least until you heard of Jhebbal Sag. Of the ancient bonds between humans, and animals, and the god. Of those women who slept in his groves and were rendered miraculously pregnant, or those men who returned to their wives with a strange light in their eyes, having wandered into a forsaken part of the woods. You knew then where your gifts came from. As though the god whispered in your ear. The old, wild blood of Jhebbal Sag ran in your veins.\n\nAnd now you venture forth to use your powers for some greater end. What it is, you do not know. Not yet. But nature is alive with signs, signs you can read. You will find your way; you know it."
      },
      "from-the-blood-of-acheron": {
        id: "from-the-blood-of-acheron",
        name: "From the Blood of Acheron",
        baseLP: 20,
        sorcery: "All disciplines",
        bonuses: "+1 to all Wits Checks.\nSpend 1 Stamina Point to reduce the Life Point cost of casting a spell by half (rounding up).",
        startingSkills: "None",
        backgroundImage: "bg_streets.jpg", // TODO: replace with bg_acheron.jpg when available
        flavorQuote: "Aye. And when the day of reckoning came, the sword was not spared. So Acheron ceased to be.",
        quoteSource: "Robert E. Howard, \"Hour of the Dragon\"",
        description: "Nothing is ever truly lost, or truly forgotten. No matter how thoroughly the blade is cleaned, the residue of blood clings to its steel. No matter how careful the scholar's effacement, the previous manuscript can be detected beneath their new text. Such is the nature of things. The world itself is such a palimpsest; each great empire brought low, erased from memory, and its remains either crushed beneath the rampaging boots of its conquerors, or else claimed by them and reshaped. Such is what happened to the great empire of Acheron. At its height, it dominated the Thurian continent, ruling over almost all, save for archaic Stygia itself.\n\nAcheron was a society ruled over by mighty sorcerers, prepared to spill the blood of their own subjects in order to procure the impossible powers they wielded. Long ago toppled by the barbarians of the north, their greatest sorcerers—those like the infamous Xaltotun—long since slain or otherwise consigned to their tombs. Acheron is dead. Except, of course, nothing truly dies; it is merely covered over. It still dwells below. Waiting.\n\nWaiting to emerge in you. For you possess powers you cannot explain. You can hear the dread whispers of long-dead things, resting in the earth. You can hear the voice of those ancient priest-kings, hear their rage at being brought low, hear the exultation as they talk of the many sacrifices they offered up in pursuit of their own dark goals, hear the cruelty bestowed by ultimate power. And you hear it over a gulf of three thousand years. For it has been three thousand years since Acheron was brought low, and the blood of those mighty sorcerers is long thought spent. Except now it is awake in you.\n\nWhat does this call to sorcery mean for you? It has dragged you away from the lands of your birth, away from the security of home and hearth and family. It thrusts you into danger, into the inexplicable, always in search of something else. Your powers grow stronger, grow stranger, and the voices of ancient Acheron sing more loudly in your ears. But how far dare you follow them?"
      },
      "from-the-blood-of-a-demon": {
        id: "from-the-blood-of-a-demon",
        name: "From the Blood of a Demon",
        baseLP: 26,
        sorcery: "Black Magic, Demonic Magic",
        bonuses: "+1 to all Sorcery Attacks.\n+2 to all Sorcery Damage.",
        startingSkills: "None",
        backgroundImage: "bg_steppes.jpg", // TODO: replace with bg_demon.jpg when available
        flavorQuote: "I am of human origin, but I rule demons. You have seen the Lords of the Black Circle.",
        quoteSource: "Robert E. Howard, \"People of the Black Circle\"",
        description: "You heard the stories, of course. You couldn't not. Even if you'd been able to ignore the whispers, the speculative gazes, the pointed fingers, they wouldn't have let you. The ones who wanted to use the stories of your parentage as an excuse to hurt or bully or belittle you. They never did anything in hushed voices if they could shout it in front of half a street. You know what is said of you, and so does everyone else: at least one of your parents was a demon. You are the bastard child of a creature summoned up from hell itself.\n\nPerhaps your mother confirmed the story. Perhaps she swore it was nonsense. Perhaps she died long ago, leaving you with only the curse of your heritage. But is it a curse? Certainly it feels like it sometimes, or did when you were a youth. But now... now you feel the power stirring inside you. Gradually unfurling itself like a serpent, coiled about a branch. You're more than human, though the thought terrifies you as much as it thrills you. You possess capacities those around you can barely dream of, able to call upon powers you know are impossible for all but the most powerful of sorcerers—and those exist only in fables. Or so you used to think.\n\nSo, now you'll head out into the world. To Nemedia, perhaps, to seek fame. To seek gold. To seek life. Or to Stygia, where the serpent cults hold traffic with demons—might you try to find your father, to ask him your purpose, to make him explain your existence? Or will you do what demons are meant to do: bring slaughter and death to those who caused you pain? And there are oh so many of them to choose from. So your existence is balanced between the human and the inhuman, between good and evil, between civilization and savagery. You've known this struggle all your life. On which side will you fall?"
      }
    };
  }

  // ==========================================
  // UTILITY METHODS
  // ==========================================

  /**
   * Get the color of the actor's owner (primary player owner).
   * Returns the user's color or a default gray if no owner found.
   */
  _getOwnerColor() {
    // Find the owner with the highest permission level (excluding GM)
    let ownerColor = '#888888'; // Default gray

    for (const [userId, level] of Object.entries(this.actor.ownership)) {
      if (level === CONST.DOCUMENT_OWNERSHIP_LEVELS.OWNER) {
        const user = game.users.get(userId);
        if (user && !user.isGM && user.color) {
          ownerColor = user.color;
          break;
        }
      }
    }

    return ownerColor;
  }

  /**
   * Get gendered pronoun for this actor.
   * @param {'subject'|'object'|'possessive'|'reflexive'} form
   * @returns {string} e.g. "she", "her", "his", "themselves"
   */
  _pronoun(form) {
    const g = this.actor.system.gender;
    const table = {
      f: { subject: 'she', object: 'her', possessive: 'her', reflexive: 'herself' },
      m: { subject: 'he', object: 'him', possessive: 'his', reflexive: 'himself' }
    };
    const neutral = { subject: 'they', object: 'them', possessive: 'their', reflexive: 'themselves' };
    return (table[g] || neutral)[form] || 'their';
  }

  // ==========================================
  // ORIGIN BONUS CALCULATIONS
  // ==========================================

  /**
   * Calculate active bonuses based on selected origin and user choices.
   * Returns an object with all computed bonuses that can be applied to rolls.
   */
  _getActiveOriginBonuses() {
    const originId = this.actor.system.origin?.id;
    const choices = this.actor.system.originBonuses || {};

    // Default bonus structure
    const bonuses = {
      statChecks: { might: 0, edge: 0, grit: 0, wits: 0 },
      attacks: { might: 0, edge: 0, wits: 0, contest: 0 },
      damage: { melee: 0, ranged: 0, sorcery: 0 },
      lpRecovery: 0,
      staminaSpends: [],
      grantedSkills: [],  // Skills automatically granted by origin
      requiresChoice: false,
      choiceType: null,
      choiceOptions: [],
      choiceMade: false
    };

    if (!originId) return bonuses;

    switch (originId) {
      case "from-the-hills":
        // +1 to chosen Stat (Might/Edge/Grit) Checks & Attacks
        bonuses.requiresChoice = true;
        bonuses.choiceType = "stat";
        bonuses.choiceOptions = [
          { value: "might", label: "Might" },
          { value: "edge", label: "Edge" },
          { value: "grit", label: "Grit" }
        ];
        if (choices.statChoice && ["might", "edge", "grit"].includes(choices.statChoice)) {
          bonuses.choiceMade = true;
          bonuses.statChecks[choices.statChoice] = 1;
          bonuses.attacks[choices.statChoice] = 1;
        }
        break;

      case "from-the-streets":
        // +1 to all Edge Checks and Attacks + skill choice
        bonuses.statChecks.edge = 1;
        bonuses.attacks.edge = 1;
        bonuses.requiresChoice = true;
        bonuses.choiceType = "skill";
        bonuses.choiceOptions = [
          { value: "fleet-footed", label: "Fleet Footed" },
          { value: "of-the-shadows", label: "Of the Shadows" }
        ];
        if (choices.skillChoice && ["fleet-footed", "of-the-shadows"].includes(choices.skillChoice)) {
          bonuses.choiceMade = true;
          bonuses.grantedSkills.push(choices.skillChoice);
        }
        break;

      case "from-the-steppes":
        // +1 to all Ranged Damage + Born in the Saddle skill
        bonuses.damage.ranged = 1;
        bonuses.grantedSkills.push("born-in-saddle");
        break;

      case "from-the-north":
        // +1 to all Melee Damage + skill choice (Iron Hide or Charge)
        bonuses.damage.melee = 1;
        bonuses.requiresChoice = true;
        bonuses.choiceType = "skill";
        bonuses.choiceOptions = [
          { value: "iron-hide", label: "Iron Hide (+3 Max LP)" },
          { value: "charge", label: "Charge" }
        ];
        if (choices.skillChoice && ["iron-hide", "charge"].includes(choices.skillChoice)) {
          bonuses.choiceMade = true;
          bonuses.grantedSkills.push(choices.skillChoice);
          // Add Charge as stamina option if selected
          if (choices.skillChoice === "charge") {
            bonuses.staminaSpends.push({
              id: "charge-attack",
              cost: 1,
              effect: "Charge (2 Move + Melee)",
              action: "charge"
            });
          }
        }
        break;

      case "from-the-wilds":
        // +1 to all Grit Checks + stamina spend
        bonuses.statChecks.grit = 1;
        bonuses.staminaSpends.push({
          id: "wilds-heal",
          cost: 1,
          effect: "Regain 2 LP",
          action: "heal-lp",
          healAmount: 2
        });
        break;

      case "from-a-civilized-land":
        // +2 to all Wits Checks + Uncanny Warding skill
        bonuses.statChecks.wits = 2;
        bonuses.grantedSkills.push("uncanny-warding");
        break;

      case "from-parts-unknown":
        // +1 to all Contest Checks + stamina spend
        bonuses.attacks.contest = 1;
        bonuses.staminaSpends.push({
          id: "unknown-sorcdef",
          cost: 1,
          effect: "+2 Sorcery Def (combat)",
          action: "sorcery-defense",
          defenseBonus: 2
        });
        break;

      case "from-the-blood-of-jhebbal-sag":
        // +2 LP whenever regaining LP + Healing spell (as stamina action)
        bonuses.lpRecovery = 2;
        bonuses.staminaSpends.push({
          id: "jhebbal-heal",
          cost: 1,
          effect: "Healing (Wits die LP)",
          action: "healing-spell"
        });
        break;

      case "from-the-blood-of-acheron":
        // +1 to all Wits Checks + stamina spend
        bonuses.statChecks.wits = 1;
        bonuses.staminaSpends.push({
          id: "acheron-spell",
          cost: 1,
          effect: "Halve Spell LP Cost",
          action: "halve-spell-cost"
        });
        break;

      case "from-the-blood-of-a-demon":
        // +1 to all Sorcery Attacks + +2 Sorcery Damage
        bonuses.attacks.wits = 1;  // Sorcery attacks use Wits
        bonuses.damage.sorcery = 2;
        break;
    }

    return bonuses;
  }

  /**
   * Handle origin bonus choice selection (stat or skill).
   */
  async _onOriginBonusChoice(event) {
    event.preventDefault();
    const element = event.currentTarget;
    const choiceType = element.dataset.choiceType;
    const choiceValue = element.dataset.choiceValue;

    // Get current bonuses state
    const currentBonuses = this.actor.system.originBonuses;
    const isValidObject = currentBonuses && typeof currentBonuses === 'object';

    // Always do a full object update to ensure proper persistence
    const newBonuses = {
      statChoice: isValidObject ? (currentBonuses.statChoice || "") : "",
      skillChoice: isValidObject ? (currentBonuses.skillChoice || "") : ""
    };

    if (choiceType === "stat") {
      newBonuses.statChoice = choiceValue;
      await this.actor.update({ 'system.originBonuses': newBonuses });
    } else if (choiceType === "skill") {
      // Get the current origin's skill choice options to know what to remove
      const originBonuses = this._getActiveOriginBonuses();
      const otherChoices = originBonuses.choiceOptions
        .map(opt => opt.value)
        .filter(v => v !== choiceValue);

      // Remove the other choice skill(s) if they were origin-granted
      for (const otherSkillId of otherChoices) {
        await this._removeOriginSkillById(otherSkillId);
      }

      newBonuses.skillChoice = choiceValue;
      await this.actor.update({ 'system.originBonuses': newBonuses });

      // Auto-add the chosen skill to the skills tab
      await this._addOriginSkill(choiceValue);
    }
  }

  /**
   * Check if the character has the "Born in the Saddle" skill (from origin or purchased).
   * @returns {boolean}
   */
  _hasBornInSaddle() {
    // Check origin-granted skills
    const originBonuses = this._getActiveOriginBonuses();
    if (originBonuses.grantedSkills.includes("born-in-saddle")) return true;

    // Check purchased/owned skills
    const skills = this.actor.system.skills || {};
    for (const skill of Object.values(skills)) {
      // Check by name or definition ID (defId is used for purchased skills)
      if (skill.name === "Born in the Saddle" ||
          skill.defId === "born-in-saddle" ||
          skill.id === "born-in-saddle") {
        return true;
      }
    }
    return false;
  }

  /**
   * Check if actor has Waterfront Fists skill
   * (Makes unarmed attacks count as Improvised Weapons - Light, One-Handed, 1d4 damage)
   * @returns {boolean}
   */
  _hasWaterfrontFists() {
    // Check origin-granted skills
    const originBonuses = this._getActiveOriginBonuses();
    if (originBonuses.grantedSkills.includes("waterfront-fists")) return true;

    // Check purchased/owned skills
    const skills = this.actor.system.skills || {};
    for (const skill of Object.values(skills)) {
      if (skill.name === "Waterfront Fists" ||
          skill.defId === "waterfront-fists" ||
          skill.id === "waterfront-fists") {
        return true;
      }
    }
    return false;
  }

  /**
   * Check if actor has Assassin skill
   * (Use Edge instead of Might for Light/Medium One-Handed melee attacks)
   * @returns {boolean}
   */
  _hasAssassin() {
    // Check origin-granted skills
    const originBonuses = this._getActiveOriginBonuses();
    if (originBonuses.grantedSkills.includes("assassin")) return true;

    // Check purchased/owned skills
    const skills = this.actor.system.skills || {};
    for (const skill of Object.values(skills)) {
      if (skill.name === "Assassin" ||
          skill.defId === "assassin" ||
          skill.id === "assassin") {
        return true;
      }
    }
    return false;
  }

  /**
   * Check if actor has Brawler skill
   * @returns {boolean}
   */
  _hasBrawler() {
    // Check origin-granted skills
    const originBonuses = this._getActiveOriginBonuses();
    if (originBonuses.grantedSkills.includes("brawler")) return true;

    // Check purchased/owned skills
    const skills = this.actor.system.skills || {};
    for (const skill of Object.values(skills)) {
      if (skill.name === "Brawler" ||
          skill.defId === "brawler" ||
          skill.id === "brawler") {
        return true;
      }
    }
    return false;
  }

  /**
   * Check if actor has Lotus Blood skill
   * (Sorcery SP cost -1, minimum 1)
   * @returns {boolean}
   */
  _hasLotusBlood() {
    // Check origin-granted skills
    const originBonuses = this._getActiveOriginBonuses();
    if (originBonuses.grantedSkills.includes("lotus-blood")) return true;

    // Check purchased/owned skills
    const skills = this.actor.system.skills || {};
    for (const skill of Object.values(skills)) {
      if (skill.name === "Lotus Blood" ||
          skill.defId === "lotus-blood" ||
          skill.id === "lotus-blood") {
        return true;
      }
    }
    return false;
  }

  /**
   * Check if the character has Sorcerous Vigor skill
   * @returns {boolean}
   */
  _hasSorcerousVigor() {
    // Check origin-granted skills
    const originBonuses = this._getActiveOriginBonuses();
    if (originBonuses.grantedSkills.includes("sorcerous-vigor")) return true;

    // Check purchased/owned skills
    const skills = this.actor.system.skills || {};
    for (const skill of Object.values(skills)) {
      const skillName = skill.name?.toLowerCase() || '';
      if (skillName === "sorcerous vigor" ||
          skillName === "sorcerous-vigor" ||
          skill.defId === "sorcerous-vigor" ||
          skill.id === "sorcerous-vigor") {
        return true;
      }
    }
    return false;
  }

  /**
   * Check if the character has Fierce Mind skill
   * @returns {boolean}
   */
  _hasFierceMind() {
    // Check origin-granted skills
    const originBonuses = this._getActiveOriginBonuses();
    if (originBonuses.grantedSkills.includes("fierce-mind")) return true;

    // Check purchased/owned skills
    const skills = this.actor.system.skills || {};
    for (const skill of Object.values(skills)) {
      const skillName = skill.name?.toLowerCase() || '';
      if (skillName === "fierce mind" ||
          skillName === "fierce-mind" ||
          skill.defId === "fierce-mind" ||
          skill.id === "fierce-mind") {
        return true;
      }
    }
    return false;
  }

  /**
   * Get the effective die for a stat, accounting for skill upgrades
   * Mighty: Might d6→d8, Mighty II: d8→d10
   * Sharpness: Edge d6→d8, Sharpness II: d8→d10
   * Wise: Wits d6→d8, Wise II: d8→d10
   * Determined: Grit d6→d8, Determined II: d8→d10
   * @param {string} statName - 'might', 'edge', 'wits', or 'grit'
   * @returns {string} The effective die (e.g., 'd8')
   */
  _getEffectiveStatDie(statName) {
    const baseDie = this.actor.system.attributes?.[statName]?.die || 'd6';
    const skills = this.actor.system.skills || {};

    // Check for relevant skill upgrades
    let hasTier1 = false;
    let hasTier2 = false;

    for (const skill of Object.values(skills)) {
      const skillName = skill.name?.toLowerCase() || '';

      if (statName === 'might') {
        if (skillName === 'mighty') hasTier1 = true;
        if (skillName === 'mighty ii') hasTier2 = true;
      } else if (statName === 'edge') {
        if (skillName === 'sharpness') hasTier1 = true;
        if (skillName === 'sharpness ii') hasTier2 = true;
      } else if (statName === 'wits') {
        if (skillName === 'wise') hasTier1 = true;
        if (skillName === 'wise ii') hasTier2 = true;
      } else if (statName === 'grit') {
        if (skillName === 'determined') hasTier1 = true;
        if (skillName === 'determined ii') hasTier2 = true;
      }
    }

    // Apply upgrades: base → tier1 → tier2
    // d6 → d8 → d10
    const dieProgression = ['d6', 'd8', 'd10', 'd12'];
    let currentIndex = dieProgression.indexOf(baseDie);
    if (currentIndex === -1) currentIndex = 0;

    if (hasTier1) currentIndex = Math.min(currentIndex + 1, dieProgression.length - 1);
    if (hasTier2) currentIndex = Math.min(currentIndex + 1, dieProgression.length - 1);

    return dieProgression[currentIndex];
  }

  /**
   * Calculate the true maximum LP including all bonuses from origin, skills, and grit
   * This should be used instead of reading actor.system.lifePoints.max directly
   * @returns {number} The calculated maximum LP
   */
  _getCalculatedMaxLP() {
    const lpMaxOverride = this.actor.system.lifePoints?.maxOverride;

    // If there's a manual override, use that
    if (lpMaxOverride !== null && lpMaxOverride !== undefined && lpMaxOverride !== "") {
      return parseInt(lpMaxOverride);
    }

    const originBaseLP = this.actor.system.origin?.baseLP || 0;
    const baseGrit = this.actor.system.attributes?.grit?.value || 0;
    const skills = this.actor.system.skills || {};

    // Calculate effective grit (including Whalebone and Gristle bonuses)
    let gritSkillBonus = 0;
    for (const [id, skill] of Object.entries(skills)) {
      const skillName = skill.name?.toLowerCase() || '';
      if (skillName === 'whalebone and gristle') gritSkillBonus += 1;
      if (skillName === 'whalebone and gristle ii') gritSkillBonus += 1;
    }
    const effectiveGrit = baseGrit + gritSkillBonus;
    const gritLPBonus = effectiveGrit * 2;

    // Get origin bonuses
    const originBonuses = this._getActiveOriginBonuses();

    // Calculate origin skill LP bonus (Iron Hide from origin)
    let originSkillLPBonus = 0;
    if (originBonuses.grantedSkills.includes("iron-hide")) {
      originSkillLPBonus += 3;
    }

    // Calculate purchased skill LP bonuses
    let purchasedSkillLPBonus = 0;

    for (const [id, skill] of Object.entries(skills)) {
      // Skip origin skills
      if (skill.fromOrigin || (skill.effect && skill.effect.includes("(Origin)"))) {
        continue;
      }

      const skillName = skill.name?.toLowerCase() || '';

      // Iron Hide: +3 LP
      if (skillName === 'iron hide' || skillName === 'iron-hide') {
        purchasedSkillLPBonus += 3;
      }
      // Iron Hide II: +effective Grit LP
      else if (skillName === 'iron hide ii' || skillName === 'iron-hide ii') {
        purchasedSkillLPBonus += effectiveGrit;
      }
      // Determined II: +5 LP
      else if (skillName === 'determined ii' || skillName === 'determined-ii') {
        purchasedSkillLPBonus += 5;
      }
    }

    return originBaseLP + gritLPBonus + originSkillLPBonus + purchasedSkillLPBonus;
  }

  /**
   * Get effective stat values including skill bonuses
   * Used for attack/check rolls to apply legendary skill upgrades
   * @param {string} attribute - 'might', 'edge', 'grit', or 'wits'
   * @returns {Object} { die, value, skillDieUpgrade, skillValueBonus }
   */
  _getEffectiveStatValues(attribute) {
    const attrData = this.actor.system.attributes[attribute] || {};
    const baseDie = attrData.die || 'd6';
    const baseValue = attrData.value || 0;
    const skills = this.actor.system.skills || {};

    // Track skill detection
    let hasDieUpgrade1 = false;
    let hasDieUpgrade2 = false;
    let valueBonus = 0;
    let dieUpgradeName = '';
    let valueUpgradeName = '';

    // Scan skills for relevant upgrades
    for (const skill of Object.values(skills)) {
      const skillName = skill.name?.toLowerCase() || '';

      switch (attribute) {
        case 'might':
          if (skillName === 'mighty') { hasDieUpgrade1 = true; dieUpgradeName = 'Mighty'; }
          if (skillName === 'mighty ii') { hasDieUpgrade2 = true; dieUpgradeName = 'Mighty II'; }
          if (skillName === 'steely thews') { valueBonus += 1; valueUpgradeName = 'Steely Thews'; }
          if (skillName === 'steely thews ii') { valueBonus += 1; valueUpgradeName = 'Steely Thews II'; }
          break;
        case 'edge':
          if (skillName === 'sharpness') { hasDieUpgrade1 = true; dieUpgradeName = 'Sharpness'; }
          if (skillName === 'sharpness ii') { hasDieUpgrade2 = true; dieUpgradeName = 'Sharpness II'; }
          if (skillName === 'steel trap reflexes') { valueBonus += 1; valueUpgradeName = 'Steel Trap Reflexes'; }
          if (skillName === 'steel trap reflexes ii') { valueBonus += 1; valueUpgradeName = 'Steel Trap Reflexes II'; }
          break;
        case 'grit':
          if (skillName === 'determined') { hasDieUpgrade1 = true; dieUpgradeName = 'Determined'; }
          if (skillName === 'determined ii') { hasDieUpgrade2 = true; dieUpgradeName = 'Determined II'; }
          if (skillName === 'whalebone and gristle') { valueBonus += 1; valueUpgradeName = 'Whalebone and Gristle'; }
          if (skillName === 'whalebone and gristle ii') { valueBonus += 1; valueUpgradeName = 'Whalebone and Gristle II'; }
          break;
        case 'wits':
          if (skillName === 'wise') { hasDieUpgrade1 = true; dieUpgradeName = 'Wise'; }
          if (skillName === 'wise ii') { hasDieUpgrade2 = true; dieUpgradeName = 'Wise II'; }
          if (skillName === 'studious') { valueBonus += 1; valueUpgradeName = 'Studious'; }
          if (skillName === 'studious ii') { valueBonus += 1; valueUpgradeName = 'Studious II'; }
          break;
      }
    }

    // Legendary skill: +1 to chosen stat
    const legendaryTargetStat = this.actor.system.legendary?.stat;
    if (legendaryTargetStat === attribute) {
      // Check if actor actually has Legendary skill
      const hasLegendary = Object.values(skills).some(s => s.name?.toLowerCase() === 'legendary');
      if (hasLegendary) {
        valueBonus += 1;
        valueUpgradeName = valueUpgradeName ? `${valueUpgradeName}, Legendary` : 'Legendary';
      }
    }

    // Calculate effective die (d6 → d8 → d10)
    let effectiveDie = baseDie;
    if (hasDieUpgrade2) {
      effectiveDie = 'd10';
    } else if (hasDieUpgrade1 && baseDie === 'd6') {
      effectiveDie = 'd8';
    }

    // Calculate effective value
    const effectiveValue = baseValue + valueBonus;

    // Build display strings for chat
    const skillDieUpgrade = (effectiveDie !== baseDie) ? dieUpgradeName : null;
    const skillValueBonus = (valueBonus > 0) ? `+${valueBonus} ${valueUpgradeName}` : null;

    return {
      die: effectiveDie,
      value: effectiveValue,
      skillDieUpgrade,
      skillValueBonus
    };
  }

  /**
   * Get skill bonuses that apply to a specific weapon type
   * @param {string} weaponType - 'melee', 'thrown', or 'ranged'
   * @param {Object} weapon - The weapon object (optional, for Waterfront Fists check)
   * @returns {Object} Object with attack and damage bonus arrays
   */
  _getWeaponSkillBonuses(weaponType, weapon = null) {
    const attackBonuses = [];
    const damageBonuses = [];
    const skills = this.actor.system.skills || {};

    // Check if this is an unarmed weapon upgraded by Waterfront Fists
    const isUnarmed = weapon && (weapon.name === "Unarmed" || weapon.category === "Unarmed");
    const hasWaterfrontFists = this._hasWaterfrontFists();
    const isUpgradedUnarmed = isUnarmed && hasWaterfrontFists;

    // If Waterfront Fists upgrades unarmed, show it on damage line
    if (isUpgradedUnarmed) {
      damageBonuses.push('Waterfront Fists 1d4');
    }

    // Define skills that give combat bonuses and their effects
    // category: 'attack' = shown on Attack line, 'damage' = shown on Damage line, 'both' = shown on both
    const combatSkills = {
      // Damage bonuses (melee)
      'brawler': { types: ['melee'], name: 'Brawler', bonus: '+1 Dmg', category: 'damage' },
      'fierce-strokes': { types: ['melee'], name: 'Fierce Strokes', bonus: 'Roll 2 best', category: 'attack' },
      // Damage bonuses (ranged/thrown)
      'eagle-eyed': { types: ['ranged', 'thrown'], name: 'Eagle-Eyed', bonus: '+1 Dmg', category: 'damage' },
      'eagle-eyed-ii': { types: ['ranged', 'thrown'], name: 'Eagle-Eyed II', bonus: '+1 Dmg', category: 'damage' },
      'fierce-shots': { types: ['ranged', 'thrown'], name: 'Fierce Shots', bonus: 'Roll 2 best', category: 'attack' },
      'impaling-throw': { types: ['thrown'], name: 'Impaling Throw', bonus: '1SP: x2', category: 'damage' },
      // Attack bonuses - Assassin requires Light/Medium One-Handed (or upgraded unarmed)
      'assassin': { types: ['melee'], name: 'Assassin', bonus: 'Edge Atk', category: 'attack', requiresLightMedium: true },
      // Sorcery bonuses
      'fierce-mind': { types: ['sorcery'], name: 'Fierce Mind', bonus: 'Roll 2 best', category: 'attack' },
      // Both attack and damage
      'unseen-strike': { types: ['melee', 'ranged', 'thrown'], name: 'Unseen Strike', bonus: '+2 Atk +1 Dmg', category: 'both' },
      // Born in Saddle shown separately in mounted section
      'born-in-saddle': { types: ['ranged', 'thrown'], name: 'Born in Saddle', bonus: 'No penalty', category: 'attack', mountedOnly: true }
    };

    for (const skill of Object.values(skills)) {
      const defId = skill.defId || skill.id || '';
      const skillName = skill.name?.toLowerCase() || '';

      for (const [skillId, config] of Object.entries(combatSkills)) {
        // Check if skill matches and applies to weapon type
        if ((defId === skillId || skillName.includes(skillId.replace(/-/g, ' '))) &&
            config.types.includes(weaponType)) {
          // Skip mounted-only bonuses if not mounted
          if (config.mountedOnly && !this.actor.system.conditions?.mounted) continue;
          // Skip Born in Saddle here since it's shown in mounted section
          if (skillId === 'born-in-saddle') continue;

          // Assassin requires Light or Medium One-Handed weapon
          // Normal unarmed doesn't qualify, but Waterfront Fists-upgraded unarmed does
          if (config.requiresLightMedium) {
            const weaponCategory = weapon?.category || weapon?.type || '';
            const isLightOrMedium = weaponCategory.includes('Light') || weaponCategory.includes('Medium');
            // Waterfront Fists makes unarmed count as Light, One-Handed
            if (!isLightOrMedium && !isUpgradedUnarmed) continue;
          }

          // Categorize skill by attack/damage
          const displayStr = `${config.name} ${config.bonus}`;
          if (config.category === 'attack') {
            attackBonuses.push(displayStr);
          } else if (config.category === 'damage') {
            damageBonuses.push(displayStr);
          } else if (config.category === 'both') {
            attackBonuses.push(displayStr);
            damageBonuses.push(displayStr);
          }
        }
      }
    }

    return { attack: attackBonuses, damage: damageBonuses };
  }

  /**
   * Get mounted combat modifiers for different weapon types and target types.
   * General Mounted Combat Rules:
   * - Melee vs non-mounted: +1 Attack (general rule, no skill required)
   * - Melee vs mounted: +0
   * - Ranged/Thrown: -2 Attack penalty (all targets)
   * Born in the Saddle skill:
   * - Cancels the -2 ranged/thrown penalty
   * - Gives +1 to ranged/thrown attacks vs non-mounted foes
   * @returns {Object} Modifiers for melee and ranged attacks
   */
  _getMountedCombatModifiers() {
    const isMounted = this.actor.system.conditions?.mounted || false;
    const hasBornInSaddle = this._hasBornInSaddle();

    return {
      isMounted,
      hasBornInSaddle,
      // Melee modifiers - general mounted combat rule: +1 vs non-mounted (no skill required)
      meleeVsNonMounted: isMounted ? 1 : 0,
      meleeVsMounted: 0,
      // Ranged/Thrown modifiers
      // Without Born in Saddle: -2 penalty to all ranged attacks
      // With Born in Saddle: +1 vs non-mounted, 0 vs mounted (penalty cancelled)
      rangedVsNonMounted: isMounted ? (hasBornInSaddle ? 1 : -2) : 0,
      rangedVsMounted: isMounted ? (hasBornInSaddle ? 0 : -2) : 0,
      // Legacy properties for backwards compatibility
      meleeBonus: isMounted ? 1 : 0,
      rangedPenalty: (isMounted && !hasBornInSaddle) ? -2 : 0
    };
  }

  /**
   * Skill definitions for origin-granted skills.
   */
  _getSkillDefinitions() {
    return {
      // Origin Skills
      "born-in-saddle-origin": { name: "Born in the Saddle", effect: "No ranged penalty mounted. +1 Attack vs non-mounted. (Origin)", fromOrigin: true },
      "charge-origin": { name: "Charge", effect: "1 SP: 2 Move + Melee Attack as 1 Action. (Origin)", fromOrigin: true },
      "iron-hide-origin": { name: "Iron Hide", effect: "+3 max Life Points. (Origin)", lpBonus: 3, fromOrigin: true },
      "fleet-footed-origin": { name: "Fleet Footed", effect: "2 Move Actions = bonus 3rd Move. (Origin)", fromOrigin: true },
      "of-the-shadows-origin": { name: "Of the Shadows", effect: "+1 Edge stealth/detection Checks. (Origin)", fromOrigin: true },
      "uncanny-warding-origin": { name: "Uncanny Warding", effect: "+1 Sorcery Defense. (Origin)", sorceryDefBonus: 1, fromOrigin: true },
      // Purchasable Skills (XP) - these can grant LP bonuses
      "iron-hide": { name: "Iron Hide", effect: "+3 max Life Points.", lpBonus: 3, fromOrigin: false },
      "iron-hide-ii": { name: "Iron Hide II", effect: "+Grit max Life Points.", lpBonusStat: "grit", fromOrigin: false },
      "determined-ii": { name: "Determined II", effect: "+5 max Life Points.", lpBonus: 5, fromOrigin: false }
    };
  }

  /**
   * Add an origin-granted skill to the skills tab.
   * If a purchased (non-origin) version exists, it will be removed and XP refunded.
   */
  async _addOriginSkill(skillId) {
    const skillDefs = this._getSkillDefinitions();
    // Try with -origin suffix first, then without
    const skillDef = skillDefs[`${skillId}-origin`] || skillDefs[skillId];
    if (!skillDef) {
      console.warn(`ConanActorSheet2 | No skill definition found for origin skill: ${skillId}`);
      return;
    }

    const existingSkills = this.actor.system.skills || {};
    const skillNameClean = skillDef.name.replace(" (Origin)", "");

    // Check if an origin version already exists
    const originVersionExists = Object.values(existingSkills).some(
      s => s.fromOrigin && (s.name === skillDef.name || s.name === skillNameClean)
    );

    if (originVersionExists) {
      // Origin version already exists, nothing to do
      return;
    }

    // Check if a purchased (non-origin) version exists
    let purchasedSkillId = null;
    let purchasedSkill = null;
    for (const [id, skill] of Object.entries(existingSkills)) {
      if (!skill.fromOrigin && (skill.name === skillNameClean || skill.name === skillDef.name)) {
        purchasedSkillId = id;
        purchasedSkill = skill;
        break;
      }
    }

    const updateData = {};

    // If purchased version exists, remove it and refund XP
    if (purchasedSkillId && purchasedSkill) {
      // Find XP cost from skill definitions
      const allSkillDefs = this._getAllSkillDefinitions();
      const allSkills = [...allSkillDefs.starting, ...allSkillDefs.legendary];
      const purchasedDef = allSkills.find(def =>
        def.name.toLowerCase() === purchasedSkill.name?.toLowerCase()
      );

      const xpToRefund = purchasedDef?.xpCost || 0;

      // Remove the purchased skill
      updateData[`system.skills.-=${purchasedSkillId}`] = null;

      // Refund XP
      if (xpToRefund > 0) {
        const currentXP = this.actor.system.xp || 0;
        updateData['system.xp'] = currentXP + xpToRefund;
        ui.notifications.info(`Removed purchased ${skillNameClean} and refunded ${xpToRefund} XP. Origin grants this skill!`);
      } else {
        ui.notifications.info(`Replaced purchased ${skillNameClean} with origin-granted version.`);
      }
    }

    // Add the origin skill
    const newId = `origin_${skillId}_${Date.now()}`;
    updateData[`system.skills.${newId}`] = {
      name: skillDef.name,
      effect: skillDef.effect,
      fromOrigin: true
    };

    await this.actor.update(updateData);

    if (!purchasedSkillId) {
      ui.notifications.info(`Origin grants: ${skillDef.name}`);
    }
  }

  /**
   * Remove origin-granted skills when origin changes.
   */
  async _removeOriginSkills() {
    const skills = this.actor.system.skills || {};
    const updates = {};

    for (const [id, skill] of Object.entries(skills)) {
      if (skill.fromOrigin || (skill.effect && skill.effect.includes("(Origin)"))) {
        updates[`system.skills.-=${id}`] = null;
      }
    }

    if (Object.keys(updates).length > 0) {
      await this.actor.update(updates);
    }
  }

  /**
   * Remove purchased spells and active spell state for disciplines the character
   * no longer has access to after an origin change.
   */
  async _cleanupLostSorcery(oldAccess, newAccess) {
    const lostDisciplines = oldAccess.filter(d => !newAccess.includes(d));
    if (lostDisciplines.length === 0) return;

    // Map discipline → spell IDs
    const spellCatalog = this._getSpellCatalog();
    const lostSpellIds = new Set();
    for (const discId of lostDisciplines) {
      const disc = spellCatalog[discId];
      if (!disc) continue;
      for (const s of disc.purchasableSpells) lostSpellIds.add(s.id);
    }
    if (lostSpellIds.size === 0) return;

    // Build updates: remove invoked spells and their state flags
    const invokedSpells = this.actor.system.sorcery?.invokedSpells || {};
    const updates = {};
    for (const spellId of lostSpellIds) {
      if (invokedSpells[spellId]) {
        updates[`system.sorcery.invokedSpells.-=${spellId}`] = null;
      }
    }

    // Clear spell-specific state flags for lost spells
    if (lostSpellIds.has('lotus-miasma')) updates['system.lotusMiasmaActive'] = false;
    if (lostSpellIds.has('body-of-living-iron')) updates['system.buffsDebuffs.armorUp'] = false;
    if (lostSpellIds.has('snake-arrow')) updates['system.snakeArrowActive'] = false;
    if (lostSpellIds.has('astral-projection')) updates['system.astralProjectionState'] = 'ready';
    if (lostSpellIds.has('frightful-aura')) {
      updates['system.frightfulAuraState'] = 'ready';
      updates['system.frightfulAuraTargets'] = [];
    }
    if (lostSpellIds.has('fearsome-ward')) {
      updates['system.fearsomeWardState'] = 'ready';
      updates['system.fearsomeWardTarget'] = null;
    }
    if (lostSpellIds.has('eyes-of-the-raven')) updates['system.eyesOfTheRavenActive'] = false;
    if (lostSpellIds.has('beast-form') && this.actor.system.beastFormData?.active) {
      updates['system.beastFormData'] = null;
      updates['system.lifePoints.maxOverride'] = null;
      updates['system.buffsDebuffs.beastForm'] = false;
    }
    if (lostSpellIds.has('mesmerism')) {
      // Clear caster flag (target cleanup would need separate handling)
      const casterFlag = this.actor.getFlag('conan', 'mesmerismCaster');
      if (casterFlag?.active) {
        await this.actor.unsetFlag('conan', 'mesmerismCaster');
      }
    }

    if (Object.keys(updates).length > 0) {
      await this.actor.update(updates);
    }
  }

  /**
   * Remove a specific origin-granted skill by its skill definition ID.
   * Only removes if the skill has fromOrigin flag or "(Origin)" in effect.
   */
  async _removeOriginSkillById(skillDefId) {
    const skillDefs = this._getSkillDefinitions();
    // Try with -origin suffix first, then without
    const skillDef = skillDefs[`${skillDefId}-origin`] || skillDefs[skillDefId];
    if (!skillDef) {
      console.warn(`ConanActorSheet2 | No skill definition found for removal: ${skillDefId}`);
      return;
    }

    const skills = this.actor.system.skills || {};
    const updates = {};

    for (const [id, skill] of Object.entries(skills)) {
      // Check if this skill matches the definition AND is origin-granted
      const isMatchingSkill = skill.name === skillDef.name ||
                              skill.name === skillDef.name.replace(" (Origin)", "");
      const isFromOrigin = skill.fromOrigin || (skill.effect && skill.effect.includes("(Origin)"));

      if (isMatchingSkill && isFromOrigin) {
        updates[`system.skills.-=${id}`] = null;
      }
    }

    if (Object.keys(updates).length > 0) {
      await this.actor.update(updates);
    }
  }

  /**
   * Add all automatic origin skills (non-choice skills like Born in the Saddle).
   */
  async _addAutomaticOriginSkills(originId) {
    const automaticSkills = {
      "from-the-steppes": ["born-in-saddle"],
      "from-a-civilized-land": ["uncanny-warding"]
    };

    const skillsToAdd = automaticSkills[originId] || [];
    for (const skillId of skillsToAdd) {
      await this._addOriginSkill(skillId);
    }
  }

  /**
   * Ensure the Alchemy Gem inventory item exists when alchemy discipline is accessible.
   * Follows the Poisoner/Ichor pattern for auto-created items.
   */
  async _ensureAlchemyGem() {
    const inventory = this.actor.system.inventory || {};

    // Check if gem already exists
    const hasGem = Object.values(inventory).some(item => item && item.isAlchemyGem);
    if (hasGem) return;

    const gemId = `item${Date.now()}`;
    await this.actor.update({
      [`system.inventory.${gemId}`]: {
        name: "Radium Gem",
        description: "A strange, glowing gem used as a focus for Alchemy sorcery. Required to cast the Radium Gem spell.",
        quantity: 1,
        isAlchemyGem: true
      }
    });
  }

  /**
   * Remove the Alchemy Gem inventory item when alchemy discipline access is lost.
   */
  async _removeAlchemyGem() {
    const inventory = this.actor.system.inventory || {};
    const updates = {};

    for (const [itemId, item] of Object.entries(inventory)) {
      if (item && item.isAlchemyGem) {
        updates[`system.inventory.-=${itemId}`] = null;
      }
    }

    if (Object.keys(updates).length > 0) {
      await this.actor.update(updates);
    }
  }

  /** @override */
  activateListeners(html) {
    super.activateListeners(html);

    // Dismiss any orphaned tooltips on sheet re-render (both Foundry and custom)
    this._dismissAllTooltips();
    this._clearAllTooltips();

    // ===== CHARACTER INFO TOGGLE =====
    html.find('.toggle-char-info').click(this._onToggleCharInfo.bind(this));

    // ===== TRIO INFO TOGGLE =====
    html.find('.toggle-trio-info').click(this._onToggleTrioInfo.bind(this));

    // ===== DEFENSE LOCK TOGGLE =====
    html.find('.toggle-defense-lock').change(this._onToggleDefenseLock.bind(this));

    // ===== TAB SWITCHING =====
    html.find('.sheet2-tabBtn:not(.sheet2-tabBtn-guide)').click(this._onTabClick.bind(this));

    // ===== DOUBLE-CLICK TAB NAVIGATION =====
    html.find('.sheet2-main').on('dblclick', this._onDoubleClickNavigation.bind(this));

    // ===== CHARACTER CREATOR GUIDE =====
    html.find('.sheet2-tabBtn-guide').click(this._onOpenGuide.bind(this));

    // ===== STAT ITEM EXPAND/COLLAPSE =====
    html.find('.stat-toggle').click(this._onStatToggle.bind(this));

    // ===== ROLLS =====
    html.find('.roll-attribute').click(this._onRollAttribute.bind(this));
    html.find('.sheet2-initDisplay').click(this._onRollInitiative.bind(this));

    // FIGHT! pulse — show when combat is active and this actor hasn't joined
    this._updateFightPulse(html);

    // Body of Living Iron: click AR buff icon to dismiss
    html.find('.sheet2-arBonusIcon[alt="Armor Up"]').click(async (event) => {
      event.preventDefault();
      event.stopPropagation();
      if (!this.actor.system.buffsDebuffs?.armorUp) return;
      await this.actor.update({ 'system.buffsDebuffs.armorUp': false });
      ChatMessage.create({
        speaker: ChatMessage.getSpeaker({ actor: this.actor }),
        content: `<div class="conan-enemy-roll ability-use"><div class="roll-header" style="color: #B0C4DE;">Body of Living Iron Dismissed</div><div class="roll-section ability-desc"><strong>${this.actor.name}</strong>'s iron skin fades. AR reduced by 3.</div></div>`
      });
    });
    // Demonic Ward: click AR buff icon to dismiss
    html.find('.sheet2-arBonusIcon[alt="Demonic Ward"]').click(async (event) => {
      event.preventDefault();
      event.stopPropagation();
      if (!this.actor.system.buffsDebuffs?.demonicWard) return;
      await this.actor.update({ 'system.buffsDebuffs.demonicWard': false });
      ChatMessage.create({
        speaker: ChatMessage.getSpeaker({ actor: this.actor }),
        content: `<div class="conan-enemy-roll ability-use"><div class="roll-header" style="color: #C43C3C;">Demonic Ward Dismissed</div><div class="roll-section ability-desc"><strong>${this.actor.name}</strong>'s ward sigils fade.</div></div>`
      });
    });
    // Weapon attack: remove title on mousedown to prevent tooltip orphan
    html.find('.roll-weapon-attack').on('mousedown', (event) => {
      const el = event.currentTarget;
      if (el.hasAttribute('title')) {
        el.removeAttribute('title');
      }
      if (game.tooltip) game.tooltip.deactivate();
    });
    html.find('.roll-weapon-attack').click(this._onRollWeaponAttack.bind(this));
    html.find('.roll-spell').click(this._onRollSpell.bind(this));
    html.find('.spell-img-cast').on('mouseenter', (ev) => {
      const tip = $('<div class="spell-cast-tooltip">CAST</div>').appendTo(document.body);
      $(ev.currentTarget).data('castTip', tip);
      tip.css({ left: ev.clientX + 12, top: ev.clientY - 8 });
    }).on('mousemove', (ev) => {
      const tip = $(ev.currentTarget).data('castTip');
      if (tip) tip.css({ left: ev.clientX + 12, top: ev.clientY - 8 });
    }).on('mouseleave', (ev) => {
      const tip = $(ev.currentTarget).data('castTip');
      if (tip) tip.remove();
    }).click((ev) => {
      ev.preventDefault();
      ev.stopPropagation();
      const tip = $(ev.currentTarget).data('castTip');
      if (tip) tip.remove();
      const spellId = $(ev.currentTarget).attr('data-spell-id');
      const fakeEvent = { preventDefault: () => {}, currentTarget: this.element.find(`.roll-spell[data-spell-id="${spellId}"]`)[0] };
      this._onRollSpell(fakeEvent);
    });
    html.find('.roll-skill').click(this._onRollSkill.bind(this));
    html.find('.roll-death-save').click(this._onRollDeathSave.bind(this));

    // ===== WEAPON SYSTEM =====
    html.find('.open-add-weapon').click(this._onOpenAddWeapon.bind(this));
    html.find('.close-add-weapon').click(this._onCloseAddWeapon.bind(this));
    html.find('.sheet2-weaponCategoryTab').click(this._onWeaponCategoryTab.bind(this));
    html.find('.sheet2-weaponSubTab').click(this._onWeaponSubCategoryTab.bind(this));
    html.find('.sheet2-weaponPickerGrid').on('click', '.sheet2-weaponCard', this._onWeaponCardClick.bind(this));
    html.find('.arm-weapon').click(this._onArmWeapon.bind(this));
    html.find('.weapon-toggle').click(this._onWeaponToggle.bind(this));
    html.find('.delete-weapon').click(this._onDeleteWeapon.bind(this));
    html.find('.weapon-image-toggle').change(this._onWeaponImageToggle.bind(this));
    html.find('.ammo-increase, .ammo-decrease').click(this._onAmmoChange.bind(this));
    html.find('.poison-toggle').click(this._onPoisonToggle.bind(this));

    // ===== EQUIP TAB: MOUNT + PACK + SADDLEBAG =====
    html.find('.equip-mount-btn').click(this._onMountButtonClick.bind(this));
    html.find('.equip-pack-btn').click(this._onPackButtonClick.bind(this));
    html.find('.equip-saddlebag-btn').click(this._onSaddlebagButtonClick.bind(this));
    html.find('.pack-dropdown-header').click(this._onPackDropdownToggle.bind(this));
    html.find('.equip-plunder-btn').click(this._onPlunderButtonClick.bind(this));
    html.find('.equip-squander-btn').click(this._onSquanderButtonClick.bind(this));

    // ===== PACK OVERLAY: INVENTORY CRUD =====
    html.find('.pack-slot-add').click(this._onAddInventoryItem.bind(this));
    html.find('.pack-slot-delete').click(this._onDeleteInventoryItem.bind(this));
    html.find('.pack-slot-name').on('change', this._onInventoryNameChange.bind(this));
    html.find('.pack-slot-desc').on('change', this._onInventoryDescChange.bind(this));
    html.find('.pack-slot-qty').on('change', this._onInventoryQtyChange.bind(this));

    // Auto-resize description textareas to fit content
    html.find('textarea.pack-slot-desc').each(function() {
      this.style.height = 'auto';
      this.style.height = this.scrollHeight + 'px';
    }).on('input', function() {
      this.style.height = 'auto';
      this.style.height = this.scrollHeight + 'px';
    });

    // ===== SADDLEBAG OVERLAY: INVENTORY CRUD =====
    html.find('.saddlebag-slot-add').click(this._onAddSaddlebagItem.bind(this));
    html.find('.saddlebag-slot-delete').click(this._onDeleteSaddlebagItem.bind(this));
    html.find('.saddlebag-slot-name').on('change', this._onSaddlebagNameChange.bind(this));
    html.find('.saddlebag-slot-desc').on('change', this._onSaddlebagDescChange.bind(this));
    html.find('.saddlebag-slot-qty').on('change', this._onSaddlebagQtyChange.bind(this));

    // Auto-resize saddlebag description textareas
    html.find('textarea.saddlebag-slot-desc').each(function() {
      this.style.height = 'auto';
      this.style.height = this.scrollHeight + 'px';
    }).on('input', function() {
      this.style.height = 'auto';
      this.style.height = this.scrollHeight + 'px';
    });

    // ===== PLUNDER +/- SPEND =====
    html.find('.pack-plunder-minus').click(this._onSpendPlunder.bind(this, 'pack'));
    html.find('.pack-plunder-plus').click(this._onAddPlunder.bind(this, 'pack'));
    html.find('.saddlebag-plunder-minus').click(this._onSpendPlunder.bind(this, 'saddlebag'));
    html.find('.saddlebag-plunder-plus').click(this._onAddPlunder.bind(this, 'saddlebag'));

    // ===== SQUANDER OVERLAY CONTROLS =====
    this._squanderAmount = this._squanderAmount || 3;
    this._squanderTreasure = this._squanderTreasure || false;
    const sqOverlay = html.find('.equip-squander-overlay');
    if (sqOverlay.length) {
      const sheet = this;
      const { totalPlunder, firstTreasureValue } = this._getSquanderPlunderInfo();

      sqOverlay.find('.squander-minus').click(() => {
        if (sheet._squanderAmount > 3) {
          sheet._squanderAmount--;
          sheet._updateSquanderOverlay(sqOverlay);
        }
      });
      sqOverlay.find('.squander-plus').click(() => {
        const max = sheet._squanderTreasure ? totalPlunder - firstTreasureValue : totalPlunder;
        if (sheet._squanderAmount < max) {
          sheet._squanderAmount++;
          sheet._updateSquanderOverlay(sqOverlay);
        }
      });
      sqOverlay.find('.squander-treasure-toggle').click((ev) => {
        ev.preventDefault();
        ev.stopPropagation();
        sheet._squanderTreasure = !sheet._squanderTreasure;
        const max = sheet._squanderTreasure ? totalPlunder - firstTreasureValue : totalPlunder;
        if (sheet._squanderAmount > max) sheet._squanderAmount = Math.max(3, max);
        sqOverlay.find('.squander-treasure-check').text(sheet._squanderTreasure ? '☑' : '☐');
        sheet._updateSquanderOverlay(sqOverlay);
      });
      sqOverlay.find('.squander-roll-btn').click(async () => {
        const originId = sheet.actor.system.origin?.id;
        const squanderName = SQUANDER_NAMES[originId];
        await sheet._executeSquander(originId, squanderName, sheet._squanderAmount, sheet._squanderTreasure);
        sheet._equipView = 'scene';
        sheet.element.find('.tab-equip').removeClass('view-squander');
      });
      sqOverlay.find('.squander-close-btn').click(() => {
        sheet._equipView = 'scene';
        sheet.element.find('.tab-equip').removeClass('view-squander');
      });

      // Restore current values into the overlay
      this._updateSquanderOverlay(sqOverlay);
    }

    // ===== INVENTORY ITEM CLICK-TO-EXPAND =====
    html.find('.inv-has-desc').on('click', (ev) => {
      // Don't toggle if clicking a button (delete, etc.)
      if ($(ev.target).closest('button').length) return;
      const item = $(ev.currentTarget);
      const wasExpanded = item.hasClass('expanded');
      // Close all others first
      html.find('.inv-item.expanded').removeClass('expanded');
      // Toggle this one
      if (!wasExpanded) item.addClass('expanded');
    });
    // Click outside closes any expanded item
    html.find('.equip-overlay').on('click', (ev) => {
      if (!$(ev.target).closest('.inv-has-desc').length) {
        html.find('.inv-item.expanded').removeClass('expanded');
      }
    });

    // ===== JOURNAL SYSTEM =====
    html.find('.sheet2-journalPageTab').click(this._onJournalPageSelect.bind(this));
    html.find('.add-journal-page').click(this._onAddJournalPage.bind(this));
    html.find('.delete-journal-page').click(this._onDeleteJournalPage.bind(this));
    html.find('.journal-page-content').change(this._onJournalPageContentChange.bind(this));
    html.find('.journal-page-content').on('blur', this._onJournalPageContentChange.bind(this)); // Backup save on blur
    html.find('.journal-subject-input').change(this._onJournalSubjectChange.bind(this));
    html.find('.journal-subject-input').on('blur', this._onJournalSubjectChange.bind(this)); // Backup save on blur

    // ===== SORCERY SYSTEM =====
    html.find('.open-invoke-spell').click(this._onOpenSpellMenu.bind(this));
    html.find('.close-invoke-spell').click(this._onCloseSpellMenu.bind(this));
    html.find('.discipline-tier-toggle').click(this._onDisciplineTierToggle.bind(this));
    html.find('.spell-option-toggle').click(this._onSpellOptionToggle.bind(this));
    html.find('.spell-queue-toggle').click(this._onSpellQueueToggle.bind(this));
    html.find('.confirm-spell-selection').click(this._onConfirmSpellSelection.bind(this));
    html.find('.discipline-toggle').click(this._onDisciplineToggle.bind(this));
    html.find('.spell-toggle').click(this._onSpellToggle.bind(this));
    html.find('.delete-spell').click(this._onDeleteSpell.bind(this));
    html.find('.spell-to-chat').click(this._onSpellToChat.bind(this));

    // Click outside spell edit panel to close it
    html.find('.tab-sorcery').click(this._onSorceryAreaClick.bind(this));

    // ===== SKILLS SYSTEM =====
    html.find('.open-skill-menu').click(this._onOpenSkillMenu.bind(this));
    html.find('.close-skill-menu').click(this._onCloseSkillMenu.bind(this));
    html.find('.skill-option-toggle').click(this._onSkillOptionToggle.bind(this));
    html.find('.skill-queue-toggle').click(this._onSkillQueueToggle.bind(this));
    html.find('.confirm-skill-selection').click(this._onConfirmSkillSelection.bind(this));
    html.find('.use-skill').click(this._onUseSkill.bind(this));
    html.find('.skill-delete').click(this._onSkillDelete.bind(this));
    html.find('.skill-card-click').click(this._onSkillCardClick.bind(this));
    html.find('.skill-toggle').click(this._onSkillToggle.bind(this));
    html.find('.skill-to-chat').click(this._onSkillToChat.bind(this));
    html.find('.skill-def-to-chat').click(this._onSkillDefToChat.bind(this));
    html.find('.xp-increase').click(this._onXPIncrease.bind(this));
    html.find('.xp-decrease').click(this._onXPDecrease.bind(this));

    // ===== ADD/DELETE ITEMS =====
    html.find('.item-delete').click(this._onDeleteItem.bind(this));

    // ===== ARMOR BUTTONS (in Arms tab) =====
    html.find('.sheet2-armsArmorBtn').click(this._onArmorTypeSelect.bind(this));

    // ===== COMBAT SKILL ICONS (Active abilities in Arms tab) =====
    html.find('.impaling-throw-trigger.usable').click(this._onImpalingThrow.bind(this));
    html.find('.sacrifice-armor-trigger.usable').click(this._onSacrificeArmor.bind(this));
    // Blocker is a toggle - can activate (usable) or deactivate (stance-active)
    html.find('.blocker-trigger.usable').click(this._onBlockerToggle.bind(this));
    html.find('.blocker-trigger.stance-active').click(this._onBlockerToggle.bind(this));
    // Unseen Strike is a toggle - activate before surprise attack, deactivate to cancel
    html.find('.unseen-strike-trigger.usable').click(this._onUnseenStrikeToggle.bind(this));
    html.find('.unseen-strike-trigger.stance-active').click(this._onUnseenStrikeToggle.bind(this));
    // Defender is a stance toggle - intercept attack on ally (once per round)
    html.find('.defender-trigger.usable').click(this._onDefenderToggle.bind(this));
    html.find('.defender-trigger.stance-active').click(this._onDefenderToggle.bind(this));
    // Charge: 1 SP for 2 Move + Melee Attack as single action
    html.find('.charge-trigger.usable').click(this._onCharge.bind(this));
    // Hit and Run: 1 SP for Attack + 2 Move as single action
    html.find('.hit-and-run-trigger.usable').click(this._onHitAndRun.bind(this));
    // Leader of Men: opens dialog to select allies to buff
    html.find('.leader-of-men-trigger.usable').click(this._onLeaderOfMenOpen.bind(this));
    html.find('.leader-of-men-trigger.stance-active').click(this._onLeaderOfMenOpen.bind(this));
    html.find('.close-leader-menu').click(this._onLeaderOfMenClose.bind(this));
    html.find('.leader-cost-radio').change(this._onLeaderCostChange.bind(this));
    html.find('.leader-inspire').click(this._onLeaderInspire.bind(this));
    html.find('.leader-stand-down').click(this._onLeaderStandDown.bind(this));
    // Reload: click green icon to open ammo recovery dialog
    html.find('.reload-trigger.stance-active').click(this._onReloadClick.bind(this));
    // Poisoner: click to apply poison (usable) or remove poison (stance-active)
    html.find('.poisoner-trigger.usable').click(this._onPoisonerIconClick.bind(this));
    html.find('.poisoner-trigger.stance-active').click(this._onPoisonerIconClick.bind(this));

    // Bane Weapon: click active icon to dismiss
    html.find('.bane-weapon-trigger.stance-active').click(this._onBaneWeaponDismiss.bind(this));

    // Lotus Miasma: click active icon to dismiss maintenance
    html.find('.lotus-miasma-trigger.stance-active').click(this._onLotusMiasmaDismiss.bind(this));

    // Demonic Steed: click active icon to dismiss
    html.find('.demonic-steed-trigger.stance-active').click(async (event) => {
      event.preventDefault();
      await this.actor.update({
        'system.demonicSteedActive': false,
        'system.conditions.mounted': false
      });
      const tokenImg = this.actor.prototypeToken?.texture?.src || this.actor.img || 'icons/svg/mystery-man.svg';
      ChatMessage.create({
        speaker: ChatMessage.getSpeaker({ actor: this.actor }),
        content: `<div class="spell-chat-card" style="border-color: #666;">
          <div class="spell-chat-header">
            <div class="spell-chat-portrait-wrap"><img src="${tokenImg}" class="spell-chat-portrait"/><img src="systems/conan/images/icons/demonic_steed_icon.png" class="spell-chat-badge" alt="Demonic Steed"/></div>
            <div class="spell-chat-title"><span class="spell-chat-name">Demonic Steed Dismissed</span><span class="spell-chat-type">Demonic Magic</span></div>
          </div>
          <div class="spell-chat-body">
            <div class="spell-chat-effect"><em>The spectral steed dissolves into dark smoke as ${this.actor.name} dismounts.</em></div>
          </div>
        </div>`
      });
    });

    // Uncanny Reach: click active icon to dismiss
    html.find('.uncanny-reach-trigger.stance-active').click(async (event) => {
      event.preventDefault();
      await this.actor.update({ 'system.uncannyReachActive': false });
      const tokenImg = this.actor.prototypeToken?.texture?.src || this.actor.img || 'icons/svg/mystery-man.svg';
      ChatMessage.create({
        speaker: ChatMessage.getSpeaker({ actor: this.actor }),
        content: `<div class="spell-chat-card" style="border-color: #666;">
          <div class="spell-chat-header">
            <div class="spell-chat-portrait-wrap"><img src="${tokenImg}" class="spell-chat-portrait"/><img src="systems/conan/images/icons/uncanny_reach_icon.png" class="spell-chat-badge" alt="Uncanny Reach"/></div>
            <div class="spell-chat-title"><span class="spell-chat-name">Uncanny Reach Dismissed</span><span class="spell-chat-type">Demonic Magic</span></div>
          </div>
          <div class="spell-chat-body">
            <div class="spell-chat-effect"><em>${this.actor.name}'s limbs retract to their natural length.</em></div>
          </div>
        </div>`
      });
    });

    // Mesmerism: click icon — if active dismiss, if not active trigger cast
    html.find('.mesmerism-trigger').click(async (event) => {
      event.preventDefault();
      const casterFlag = this.actor.getFlag('conan', 'mesmerismCaster');
      if (casterFlag?.active) {
        // Dismiss — find target and clean up
        const targetTokenDoc = game.scenes.active?.tokens.get(casterFlag.targetTokenId);
        if (targetTokenDoc?.actor) {
          // Read target flag BEFORE clearing it (has casterUserId)
          const targetMesmer = targetTokenDoc.actor.getFlag('conan', 'mesmerismControl');
          await targetTokenDoc.actor.unsetFlag('conan', 'mesmerismControl');
          const mesmerIcon = 'systems/conan/images/icons/mesmerism_icon.png';
          const effects = targetTokenDoc.effects || [];
          if (effects.includes(mesmerIcon)) {
            await targetTokenDoc.update({ effects: effects.filter(e => e !== mesmerIcon) });
          }
          // Only revoke ownership if NOT permanent (permanent = player keeps the token)
          if (targetMesmer?.casterUserId && !targetMesmer.permanent) {
            await targetTokenDoc.actor.update({ [`ownership.-=${targetMesmer.casterUserId}`]: null });
          }
        }
        await this.actor.unsetFlag('conan', 'mesmerismCaster');
        ChatMessage.create({
          content: `<div class="conan-enemy-roll ability-use"><div class="roll-header" style="color: #9400D3;">Mesmerism Dismissed</div><div class="roll-section ability-desc"><strong>${this.actor.name}</strong> releases control of <strong>${casterFlag.targetName || 'the target'}</strong>.</div></div>`,
          speaker: ChatMessage.getSpeaker({ actor: this.actor })
        });
      } else {
        // Not active — trigger CAST flow (same as clicking Cast on the spell card)
        this._onCastSpell({ preventDefault: () => {}, currentTarget: { dataset: { spellId: 'mesmerism' } } });
      }
    });

    // Counter Ward: restore glow if alert is active (survives re-render)
    if (game.conan?.counterWardAlert) {
      html.find('.sheet2-spellCardImg[data-spell-id="counter-ward"]').addClass('counter-ward-alert')
        .on('click', () => game.conan?.triggerCounterWard?.());
      html.find('.counter-ward-trigger').removeClass('usable').addClass('counter-ward-alert')
        .on('click', () => game.conan?.triggerCounterWard?.());
    }
    // Counter Ward situational icon: clickable when triggered
    html.find('.counter-ward-trigger.counter-ward-alert').on('click', () => game.conan?.triggerCounterWard?.());

    // Radium Gem: click to toggle on/off
    html.find('.radium-gem-trigger.usable').click(this._onRadiumGemToggle.bind(this));
    html.find('.radium-gem-trigger.stance-active').click(this._onRadiumGemToggle.bind(this));

    // Eyes of the Raven: click to toggle +2 Edge perception on/off
    html.find('.eyes-of-raven-trigger.usable').click(this._onEyesOfTheRavenToggle.bind(this));
    html.find('.eyes-of-raven-trigger.stance-active').click(this._onEyesOfTheRavenToggle.bind(this));

    // Chilling Presence: click sorcery icon to toggle aura on/off
    html.find('.chilling-presence-trigger.usable').click(async (event) => {
      event.preventDefault();
      await this.actor.update({ 'system.chillingPresenceActive': true });
    });
    html.find('.chilling-presence-trigger.stance-active').click(async (event) => {
      event.preventDefault();
      await this.actor.update({ 'system.chillingPresenceActive': false });
    });

    // Capture Soul: click empty (purple) to cast, captured (green) to prime, primed (red) to un-prime
    html.find('.capture-soul-trigger.soul-empty').click(async (event) => {
      event.preventDefault();
      const spellId = event.currentTarget.dataset.spellId || 'capture-soul';
      const fakeEvent = { preventDefault: () => {}, currentTarget: this.element.find(`.roll-spell[data-spell-id="${spellId}"]`)[0] };
      this._onRollSpell(fakeEvent);
    });
    html.find('.capture-soul-trigger.soul-captured').click(async (event) => {
      event.preventDefault();
      await this.actor.update({ 'system.capturedSoulState': 'primed' });
      ui.notifications.info(`${this.actor.name} primes the captured soul — +2 to next Check or Attack.`);
    });
    html.find('.capture-soul-trigger.soul-primed').click(async (event) => {
      event.preventDefault();
      await this.actor.update({ 'system.capturedSoulState': 'captured' });
      ui.notifications.info(`${this.actor.name} holds the soul back — no longer primed.`);
    });
    // Capture Soul: reset button on spell card — release soul
    html.find('.capture-soul-reset').click(async (event) => {
      event.preventDefault();
      await this.actor.update({ 'system.capturedSoulState': null });
      ui.notifications.info(`${this.actor.name} releases the captured soul.`);
    });

    // ===== CHECK SKILL ICONS (Home tab row) =====
    // Infamy is a toggle - activate before intimidate/convince check
    html.find('.infamy-trigger.usable').click(this._onInfamyToggle.bind(this));
    html.find('.infamy-trigger.stance-active').click(this._onInfamyToggle.bind(this));
    // Pantherish: 1 SP to reroll last failed check or attack
    html.find('.pantherish-trigger.usable').click(this._onPantherishClick.bind(this));
    // Of the Shadows: toggle for +1 Edge on checks
    html.find('.of-the-shadows-trigger.usable').click(this._onOfTheShadowsToggle.bind(this));
    html.find('.of-the-shadows-trigger.stance-active').click(this._onOfTheShadowsToggle.bind(this));
    // Eyes of the Raven: click active icon on home tab to roll Edge perception check (+2)
    html.find('.eyes-of-raven-check-trigger').click((event) => {
      event.preventDefault();
      this._onRollAttribute(event, { forceAttribute: 'edge', eyesOfTheRaven: true });
    });
    // Inspire spell buff: two-click dismiss (green → purple warning → dismiss)
    html.find('.inspire-buff-trigger').click(async (event) => {
      event.preventDefault();
      const currentState = this.actor.system.inspireSpellActive;
      if (currentState === 'active') {
        // First click: switch to warning state (purple)
        await this.actor.update({ 'system.inspireSpellActive': 'warning' });
        ui.notifications.warn(`${this.actor.name}'s Inspire buff is fading — click again to dismiss.`);
      } else if (currentState === 'warning') {
        // Second click: dismiss
        await this.actor.update({ 'system.inspireSpellActive': false });
        ui.notifications.info(`${this.actor.name}'s Inspire effect has been dismissed.`);
      }
    });
    // Astral Projection: three-state icon click (ready → active, active → spent)
    html.find('.astral-projection-trigger').click(async (event) => {
      event.preventDefault();
      const apState = this.actor.system.astralProjectionState || 'ready';
      if (apState === 'ready') {
        await this._onAstralProjectionToggle('activate');
      } else if (apState === 'active') {
        await this._onAstralProjectionToggle('deactivate');
      }
    });
    // Astral Projection reset: spell card reset button
    html.find('.astral-projection-reset').click(async (event) => {
      event.preventDefault();
      await this.actor.update({ 'system.astralProjectionState': 'ready' });
      ui.notifications.info(`${this.actor.name}'s Astral Projection has been reset.`);
    });
    // Frightful Aura: icon click (ready → cast targeting, active → dismiss)
    html.find('.frightful-aura-trigger').click(async (event) => {
      event.preventDefault();
      const faState = this.actor.system.frightfulAuraState || 'ready';
      if (faState === 'ready') {
        const currentSP = this.actor.system.stamina || 0;
        if (currentSP < 1) {
          ui.notifications.warn('Not enough Stamina Points! Need 1 SP.');
          return;
        }
        await this._onFrightfulAuraCast();
      } else if (faState === 'active') {
        await this._onFrightfulAuraDismiss();
      }
    });
    // Frightful Aura reset: spell card reset button
    html.find('.frightful-aura-reset').click(async (event) => {
      event.preventDefault();
      await this.actor.update({ 'system.frightfulAuraState': 'ready' });
      ui.notifications.info(`${this.actor.name}'s Frightful Aura has been reset.`);
    });
    // Fearsome Ward: icon click (ready → cast tier dialog, active → dismiss)
    html.find('.fearsome-ward-trigger').click(async (event) => {
      event.preventDefault();
      const fwState = this.actor.system.fearsomeWardState || 'ready';
      if (fwState === 'ready') {
        const catalog = this._getSpellCatalog();
        const fwSpell = catalog.blackMagic?.spells?.find(s => s.id === 'fearsome-ward');
        const fwIcon = 'systems/conan/images/icons/fearsome_ward_icon.png';
        await this._onFearsomeWardCast(fwSpell, fwIcon);
      } else if (fwState === 'active') {
        await this._onFearsomeWardDismiss();
      }
    });
    // Fearsome Ward reset: spell card reset button (also clears enemy debuffs)
    html.find('.fearsome-ward-reset').click(async (event) => {
      event.preventDefault();
      // Clear any lingering fearsomeWardDebuff flags from scene tokens
      for (const tokenDoc of game.scenes.active?.tokens || []) {
        if (tokenDoc.actor?.getFlag('conan', 'fearsomeWardDebuff')) {
          await tokenDoc.actor.unsetFlag('conan', 'fearsomeWardDebuff');
        }
      }
      await this.actor.update({ 'system.fearsomeWardState': 'ready', 'system.fearsomeWardTarget': null });
      ui.notifications.info(`${this.actor.name}'s Fearsome Ward has been reset.`);
    });
    // Beast Form: reset button on spell card (emergency — clears all state)
    html.find('.beast-form-reset').click(async (event) => {
      event.preventDefault();
      const bfData = this.actor.system.beastFormData;

      // Clear actor state
      await this.actor.update({
        'system.beastFormData': null,
        'system.lifePoints.maxOverride': null,
        'system.buffsDebuffs.beastForm': false
      });

      // Try to restore token image + clear enemyData flag
      const tokenDoc = this.actor.getActiveTokens(false, true)?.[0];
      if (tokenDoc) {
        const updates = { 'flags.conan.-=enemyData': null };
        if (bfData?.originalTokenImg) updates['texture.src'] = bfData.originalTokenImg;
        await tokenDoc.update(updates);
      }

      ui.notifications.info(`${this.actor.name}'s Beast Form has been reset.`);
    });
    // Mesmerism: reset button on spell card (emergency — clears caster state)
    html.find('.mesmerism-reset').click(async (event) => {
      event.preventDefault();
      const casterFlag = this.actor.getFlag('conan', 'mesmerismCaster');
      if (casterFlag?.targetTokenId) {
        const targetTokenDoc = game.scenes.active?.tokens.get(casterFlag.targetTokenId);
        if (targetTokenDoc?.actor) {
          const targetMesmer = targetTokenDoc.actor.getFlag('conan', 'mesmerismControl');
          await targetTokenDoc.actor.unsetFlag('conan', 'mesmerismControl');
          const mesmerIcon = 'systems/conan/images/icons/mesmerism_icon.png';
          const effects = targetTokenDoc.effects || [];
          if (effects.includes(mesmerIcon)) {
            await targetTokenDoc.update({ effects: effects.filter(e => e !== mesmerIcon) });
          }
          if (targetMesmer?.casterUserId) {
            await targetTokenDoc.actor.update({ [`ownership.-=${targetMesmer.casterUserId}`]: null });
          }
        }
      }
      await this.actor.unsetFlag('conan', 'mesmerismCaster');
      ui.notifications.info(`${this.actor.name}'s Mesmerism has been reset.`);
    });
    // Bloody Talons: dismiss (end early, marks as spent)
    html.find('.bloody-talons-dismiss').click(async (event) => {
      event.preventDefault();
      await this.actor.update({ 'system.bloodyTalonsActive': false, 'system.bloodyTalonsSpent': true });
      ChatMessage.create({
        speaker: ChatMessage.getSpeaker({ actor: this.actor }),
        content: `<div class="conan-enemy-roll ability-use"><div class="roll-header" style="color: #C43C3C;">Bloody Talons Dismissed</div><div class="roll-section ability-desc"><strong>${this.actor.name}</strong>'s talons retract, the dark magic fading from ${this._pronoun('possessive')} hands.</div></div>`
      });
      ui.notifications.info(`${this.actor.name}'s Bloody Talons dismissed.`);
    });
    // Bloody Talons: reset (after combat ends, clears spent flag)
    html.find('.bloody-talons-reset').click(async (event) => {
      event.preventDefault();
      await this.actor.update({ 'system.bloodyTalonsActive': false, 'system.bloodyTalonsSpent': false });
      ui.notifications.info(`${this.actor.name}'s Bloody Talons has been reset.`);
    });
    // Beast Form: icon click to dismiss
    html.find('.beast-form-trigger').click(async (event) => {
      event.preventDefault();
      const bfData = this.actor.system.beastFormData;
      if (!bfData?.active) return;

      // Cap LP to original max
      const originalMax = bfData.originalMaxLP || 0;
      const currentLP = this.actor.system.lifePoints?.value || 0;
      const cappedLP = Math.min(currentLP, originalMax);

      // Restore actor state
      await this.actor.update({
        'system.beastFormData': null,
        'system.lifePoints.maxOverride': null,
        'system.lifePoints.value': cappedLP,
        'system.buffsDebuffs.beastForm': false
      });

      // Restore token image + clear enemyData flag
      const tokenDoc = this.actor.getActiveTokens(false, true)?.[0];
      if (tokenDoc) {
        await tokenDoc.update({
          'texture.src': bfData.originalTokenImg || this.actor.img,
          'flags.conan.-=enemyData': null
        });
      }

      ChatMessage.create({
        speaker: ChatMessage.getSpeaker({ actor: this.actor }),
        content: `<div class="conan-enemy-roll ability-use"><div class="roll-header" style="color: #D4A017;">Beast Form Dismissed</div><div class="roll-section ability-desc"><strong>${this.actor.name}</strong> reverts to human form.</div></div>`
      });
      ui.notifications.info(`${this.actor.name} reverts to human form.`);
    });
    // Bloodhound: icon click to show target name
    html.find('.bloodhound-trigger').click(async (event) => {
      event.preventDefault();
      const targetName = this.actor.system.bloodhoundTarget;
      if (!targetName) return;
      ui.notifications.info(`Bloodhound is tracking: ${targetName}`);
    });
    // Bloodhound: reset button on spell card — dismiss the bond
    html.find('.bloodhound-reset').click(async (event) => {
      event.preventDefault();
      const targetName = this.actor.system.bloodhoundTarget || 'unknown';
      await this.actor.update({
        'system.bloodhoundTarget': null,
        'system.buffsDebuffs.bloodhound': false
      });
      ChatMessage.create({
        speaker: ChatMessage.getSpeaker({ actor: this.actor }),
        content: `<div class="conan-enemy-roll ability-use"><div class="roll-header" style="color: #B22222;">Bloodhound Dismissed</div><div class="roll-section ability-desc"><strong>${this.actor.name}</strong> severs the blood bond with <strong>${targetName}</strong>.</div></div>`
      });
      ui.notifications.info(`${this.actor.name} severs the blood bond with ${targetName}.`);
    });
    // Infernal Ward: reset button on spell card — clear spent state
    html.find('.infernal-ward-reset').click(async (event) => {
      event.preventDefault();
      await this.actor.update({ 'system.infernalWardSpent': false });
      ui.notifications.info('Infernal Ward reset.');
    });
    // Undead Ward: reset button on spell card — clear spent state
    html.find('.undead-ward-reset').click(async (event) => {
      event.preventDefault();
      await this.actor.update({ 'system.undeadWardSpent': false });
      ui.notifications.info('Undead Ward reset.');
    });
    // Demonic Ward: reset button on spell card — dismiss ward
    html.find('.demonic-ward-reset').click(async (event) => {
      event.preventDefault();
      await this.actor.update({ 'system.buffsDebuffs.demonicWard': false });
      ui.notifications.info('Demonic Ward dismissed.');
    });
    // Demonic Steed: reset button on spell card — dismiss steed
    html.find('.demonic-steed-reset').click(async (event) => {
      event.preventDefault();
      await this.actor.update({
        'system.demonicSteedActive': false,
        'system.conditions.mounted': false
      });
      ui.notifications.info('Demonic Steed dismissed.');
    });
    // Uncanny Reach: reset button on spell card — dismiss
    html.find('.uncanny-reach-reset').click(async (event) => {
      event.preventDefault();
      await this.actor.update({ 'system.uncannyReachActive': false });
      ui.notifications.info('Uncanny Reach dismissed.');
    });
    // Protector: opens dialog to select ally to give SP
    html.find('.protector-trigger.usable').click(this._onProtectorOpen.bind(this));
    html.find('.close-protector-menu').click(this._onProtectorClose.bind(this));
    // Legendary: click to select which stat to boost
    html.find('.legendary-trigger.usable').click(this._onLegendaryClick.bind(this));

    // ===== STAMINA BUTTONS =====
    html.find('.stamina-increase').click(this._onStaminaChange.bind(this));
    html.find('.stamina-decrease').click(this._onStaminaChange.bind(this));
    html.find('.stamina-dropdown-toggle').click(this._onStaminaDropdownToggle.bind(this));
    html.find('.sheet2-staminaMenuItem').click(this._onStaminaSpend.bind(this));

    // ===== RECOVERY ICONS =====
    html.find('.recovery-icon-btn').click(this._onRecoveryIconClick.bind(this));

    // ===== CONDITION BADGES (All conditions are toggleable except encumbered which is auto) =====
    html.find('.sheet2-conditionIcon, [class*="condition-toggle-"]').click(this._onConditionToggle.bind(this));

    // ===== GENDER / PRONOUN TOGGLE (3-state: f, m, null) =====
    html.find('.gender-toggle-f').click(async () => {
      await this.actor.update({ 'system.gender': this.actor.system.gender === 'f' ? null : 'f' });
    });
    html.find('.gender-toggle-m').click(async () => {
      await this.actor.update({ 'system.gender': this.actor.system.gender === 'm' ? null : 'm' });
    });
    html.find('.gender-toggle-off').click(async () => {
      await this.actor.update({ 'system.gender': null });
    });

    // ===== ORIGIN SELECT =====
    html.find('.origin-select').change(this._onOriginChange.bind(this));

    // ===== ORIGIN BONUS CHOICES =====
    html.find('.origin-bonus-choice').click(this._onOriginBonusChoice.bind(this));

    // Restore active tab state after render
    this._restoreTabState(html);

    // Restore character info view mode
    this._restoreCharInfoState(html);

    // Restore trio info view mode
    this._restoreTrioInfoState(html);

    // Restore open weapon panel state
    if (this._openWeaponPanelId) {
      const editPanel = html.find(`.sheet2-weaponEdit[data-for="${this._openWeaponPanelId}"]`);
      const toggle = html.find(`.weapon-toggle[data-weapon-id="${this._openWeaponPanelId}"]`);
      if (editPanel.length) {
        editPanel.addClass('active');
        toggle.addClass('open');
      }
    }

    // Restore open spell card state
    if (this._openSpellPanelId) {
      const spellCard = html.find(`.sheet2-spellCard[data-spell-id="${this._openSpellPanelId}"]`);
      if (spellCard.length) {
        spellCard.addClass('expanded');
      }
    }

    // Restore expanded discipline sections
    if (this._expandedDisciplines.size) {
      for (const discId of this._expandedDisciplines) {
        const badge = html.find(`.sheet2-disciplineBadge[data-discipline="${discId}"]`);
        const grid = html.find(`.sheet2-spellsGrid[data-discipline-grid="${discId}"]`);
        badge.removeClass('collapsed');
        grid.removeClass('collapsed');
      }
    }

    // Restore equip section collapse states
    if (this._equipSectionStates) {
      for (const [sectionName, isOpen] of Object.entries(this._equipSectionStates)) {
        const chevron = html.find(`.equip-section-toggle[data-section="${sectionName}"]`);
        const content = html.find(`[data-section-content="${sectionName}"]`);
        if (isOpen) {
          chevron.addClass('open');
          content.removeClass('collapsed');
        } else {
          chevron.removeClass('open');
          content.addClass('collapsed');
        }
      }
    }

    // Click outside to close weapon edit panel
    html.on('click', (event) => {
      const $target = $(event.target);
      const isInsidePanel = $target.closest('.sheet2-weaponEdit').length > 0;
      const isChevron = $target.closest('.weapon-toggle').length > 0;
      const isAmmoButton = $target.closest('.ammo-increase, .ammo-decrease').length > 0;

      if (!isInsidePanel && !isChevron && !isAmmoButton && this._openWeaponPanelId) {
        this._clearAllTooltips();
        html.find('.sheet2-weaponEdit').removeClass('active');
        html.find('.weapon-toggle').removeClass('open');
        this._openWeaponPanelId = null;
      }
    });

    // Configure tooltips for larger font and instant display
    // Restore scroll position after re-render
    this._restoreScrollPosition(html);

    // Auto-resize armor description textarea
    this._autoResizeArmorDescription(html);

    this._configureTooltips(html);
  }

  _configureTooltips(html) {
    // Override tooltip manager settings for this sheet
    const tooltipElements = html.find('[title]');

    tooltipElements.each((_, el) => {
      const $el = $(el);
      const originalTitle = $el.attr('title');

      // Remove default title to prevent browser tooltip
      $el.removeAttr('title');

      // Function to remove tooltip
      const removeTooltip = () => {
        const tooltip = $el.data('tooltip');
        if (tooltip) {
          tooltip.remove();
          $el.off('mousemove');
          $el.removeData('tooltip');
        }
      };

      // Add custom tooltip on hover with immediate display
      $el.on('mouseenter', (event) => {
        const tooltip = $('<div>')
          .addClass('custom-tooltip')
          .css({
            position: 'fixed',
            background: 'rgba(0, 0, 0, 0.9)',
            color: '#fff',
            padding: '10px 14px',
            borderRadius: '6px',
            fontSize: '20px',
            fontWeight: '500',
            lineHeight: '1.4',
            maxWidth: '500px',
            zIndex: '10000',
            pointerEvents: 'none',
            whiteSpace: 'normal',
            wordWrap: 'break-word'
          })
          .text(originalTitle)
          .appendTo('body');

        // Position tooltip near cursor
        const updatePosition = (e) => {
          tooltip.css({
            left: e.clientX + 15 + 'px',
            top: e.clientY + 15 + 'px'
          });
        };

        updatePosition(event);
        $el.on('mousemove', updatePosition);

        $el.data('tooltip', tooltip);
      });

      // Remove tooltip on mouseleave
      $el.on('mouseleave', removeTooltip);

      // Remove tooltip immediately on mousedown/click to prevent interference
      $el.on('mousedown click', removeTooltip);
    });
  }

  // ==========================================
  // CHARACTER INFO TOGGLE
  // ==========================================

  _onToggleCharInfo(event) {
    event.preventDefault();
    this._clearAllTooltips();
    const html = $(this.element);

    // Toggle between front and behind-the-scenes views
    const frontView = html.find('.sheet2-charView-front');
    const btsView = html.find('.sheet2-charView-bts');

    // Toggle state
    if (this._charInfoMode === "front") {
      this._charInfoMode = "bts";
    } else {
      this._charInfoMode = "front";
    }

    frontView.toggleClass('active');
    btsView.toggleClass('active');
  }

  _onToggleTrioInfo(event) {
    event.preventDefault();
    this._clearAllTooltips();
    const html = $(this.element);

    // Toggle between front and behind-the-scenes views
    const frontView = html.find('.sheet2-triView-front');
    const btsView = html.find('.sheet2-triView-bts');

    // Toggle state
    if (this._trioInfoMode === "front") {
      this._trioInfoMode = "bts";
    } else {
      this._trioInfoMode = "front";
    }

    frontView.toggleClass('active');
    btsView.toggleClass('active');
  }

  async _onToggleDefenseLock(event) {
    const checkbox = event.currentTarget;
    const defenseType = checkbox.dataset.defense; // 'physical' or 'sorcery'
    const isNowLocked = checkbox.checked;

    const overrideKey = defenseType === 'physical' ? 'physicalOverride' : 'sorceryOverride';

    // If locking (checkbox now checked), clear the override value
    if (isNowLocked) {
      await this.actor.update({
        [`system.defense.${overrideKey}`]: null
      });
    }
    // The checkbox name attribute handles the locked state update automatically
  }

  // ==========================================
  // TAB MANAGEMENT
  // ==========================================

  _onTabClick(event) {
    event.preventDefault();
    const button = event.currentTarget;
    const tabKey = button.dataset.tab;

    if (tabKey === this._activeTab) return;

    // Clear any lingering tooltips before switching tabs
    this._clearAllTooltips();

    const html = $(this.element);

    // Update button states
    html.find('.sheet2-tabBtn').removeClass('active');
    button.classList.add('active');

    // Update panel visibility
    html.find('.sheet2-tabPanel').removeClass('active');
    html.find(`.sheet2-tabPanel[data-tab="${tabKey}"]`).addClass('active');


    // Hide portrait on equip tab, show on all others
    html.find('.sheet2-portraitBg').toggleClass('equip-hidden', tabKey === 'equip');

    // Reset equip view when leaving equip tab
    if (tabKey !== 'equip') {
      this._equipView = 'scene';
    }

    // Track previous tab for double-click navigation
    this._previousTab = this._activeTab;
    this._activeTab = tabKey;
  }

  /**
   * Handle double-click navigation between tabs
   * Double-click on any tab → go to Home
   * Double-click on Home → go to previous tab
   * @param {Event} event - Double-click event
   */
  _onDoubleClickNavigation(event) {
    const target = event.target;

    // Exclude: Interactive elements
    const interactiveSelectors = [
      'button', 'input', 'select', 'textarea', 'a',
      '.roll-attribute', '.roll-weapon-attack', '.roll-spell', '.roll-skill',
      '.damage-roll-btn', '.recovery-icon', '.sheet2-tabBtn',
      '.stat-toggle', '.toggle-char-info', '.toggle-trio-info',
      '.clickable', '.dropdown-toggle', '.skill-icon-clickable',
      '.weapon-icon', '.spell-icon', '.delete-btn', '.add-btn',
      '.invoke-btn', '.condition-icon', '.xp-checkbox',
      '[contenteditable]'
    ];

    // Check if target or any ancestor matches interactive selectors
    for (const selector of interactiveSelectors) {
      if (target.closest(selector)) return;
    }

    // Exclude: Elements with tooltips (title attribute)
    if (target.hasAttribute('title') || target.closest('[title]')) return;

    // Exclude: If any dropdown is actively open (select element is focused)
    const activeElement = document.activeElement;
    if (activeElement && (activeElement.tagName === 'SELECT' || activeElement.tagName === 'INPUT')) return;

    // Navigation logic
    const html = $(this.element);

    if (this._activeTab === 'home') {
      // On home tab → go to previous tab (if it's not home)
      if (this._previousTab && this._previousTab !== 'home') {
        this._navigateToTab(html, this._previousTab);
      }
    } else {
      // On any other tab → go to home
      this._navigateToTab(html, 'home');
    }
  }

  /**
   * Navigate to a specific tab (helper for double-click navigation)
   * @param {jQuery} html - The sheet HTML
   * @param {string} tabKey - The tab to navigate to
   */
  _navigateToTab(html, tabKey) {
    if (tabKey === this._activeTab) return;

    this._clearAllTooltips();

    html.find('.sheet2-tabBtn').removeClass('active');
    html.find(`.sheet2-tabBtn[data-tab="${tabKey}"]`).addClass('active');

    html.find('.sheet2-tabPanel').removeClass('active');
    html.find(`.sheet2-tabPanel[data-tab="${tabKey}"]`).addClass('active');


    // Hide portrait on equip tab, show on all others
    html.find('.sheet2-portraitBg').toggleClass('equip-hidden', tabKey === 'equip');

    this._previousTab = this._activeTab;
    this._activeTab = tabKey;
  }

  /**
   * Handle opening the Character Creator Guide
   * @param {Event} event - Click event
   */
  _onOpenGuide(event) {
    event.preventDefault();

    // Import and open the guide (dynamic import to avoid circular dependencies)
    import('./character-creator-guide.js').then(module => {
      const CharacterCreatorGuide = module.default;

      // Check if a guide is already open for this actor
      const existingGuide = Object.values(ui.windows).find(w =>
        w instanceof CharacterCreatorGuide && w._actor?.id === this.actor.id
      );

      if (existingGuide) {
        existingGuide.bringToTop();
        return;
      }

      // Open new guide window
      new CharacterCreatorGuide(this.actor).render(true);
    });
  }

  _restoreTabState(html) {
    // Restore tab button
    html.find('.sheet2-tabBtn').removeClass('active');
    html.find(`.sheet2-tabBtn[data-tab="${this._activeTab}"]`).addClass('active');

    // Restore panel
    html.find('.sheet2-tabPanel').removeClass('active');
    html.find(`.sheet2-tabPanel[data-tab="${this._activeTab}"]`).addClass('active');

    // Hide portrait on equip tab, show on all others
    html.find('.sheet2-portraitBg').toggleClass('equip-hidden', this._activeTab === 'equip');

    // Restore equip view state (pack/saddlebag/squander overlay)
    if (this._equipView === 'pack') {
      html.find('.tab-equip').addClass('view-pack');
    } else if (this._equipView === 'saddlebag') {
      html.find('.tab-equip').addClass('view-saddlebag');
    } else if (this._equipView === 'squander') {
      html.find('.tab-equip').addClass('view-squander');
    }

    // Restore pack dropdown open states
    if (this._inventoryOpen) {
      html.find('.pack-dropdown-header[data-section="inventory"]').addClass('open');
    }
    if (this._armedOpen) {
      html.find('.pack-dropdown-header[data-section="armed"]').addClass('open');
    }
    if (this._saddlebagOpen) {
      html.find('.pack-dropdown-header[data-section="saddlebag"]').addClass('open');
    }
  }


  _restoreCharInfoState(html) {
    // Restore character info view mode
    const frontView = html.find('.sheet2-charView-front');
    const btsView = html.find('.sheet2-charView-bts');

    if (this._charInfoMode === "bts") {
      frontView.removeClass('active');
      btsView.addClass('active');
    } else {
      frontView.addClass('active');
      btsView.removeClass('active');
    }
  }

  _restoreTrioInfoState(html) {
    // Restore trio info view mode
    const frontView = html.find('.sheet2-triView-front');
    const btsView = html.find('.sheet2-triView-bts');

    if (this._trioInfoMode === "bts") {
      frontView.removeClass('active');
      btsView.addClass('active');
    } else {
      frontView.addClass('active');
      btsView.removeClass('active');
    }
  }

  // ==========================================
  // STAT ITEM EXPAND/COLLAPSE
  // ==========================================

  _onStatToggle(event) {
    event.preventDefault();
    event.stopPropagation();

    const html = $(this.element);
    const chevron = event.currentTarget;
    const attribute = chevron.dataset.attribute;
    const statItem = $(chevron).closest('.sheet2-statItem');
    const editPanel = html.find('.sheet2-statEditPanel');
    const isCurrentlyActive = statItem.hasClass('active');

    // Reset all stats to inactive
    html.find('.sheet2-statItem').removeClass('active');
    html.find('.sheet2-statChev').text('▶');
    html.find('.sheet2-statEdit').removeClass('active');

    if (isCurrentlyActive) {
      // Clicking same stat - close the panel
      this._clearAllTooltips();
      editPanel.removeClass('open');
    } else {
      // Open the clicked stat
      statItem.addClass('active');
      $(chevron).text('▼');
      editPanel.addClass('open');
      html.find(`.sheet2-statEdit[data-for="${attribute}"]`).addClass('active');
    }
  }

  // ==========================================
  // FLEX DIE SYSTEM (from original sheet)
  // ==========================================

  async _rollFlexDie(rollType = 'check', suppressCelebration = false) {
    // Calculate effective flex die based on Improved Flex skills
    let flexDie = this.actor.system.flex?.die || 'd10';
    const skills = this.actor.system.skills || {};
    let hasImprovedFlex = false;
    let hasImprovedFlexII = false;
    for (const skill of Object.values(skills)) {
      const skillName = skill.name?.toLowerCase() || '';
      if (skillName === 'improved flex') hasImprovedFlex = true;
      if (skillName === 'improved flex ii') hasImprovedFlexII = true;
    }
    if (hasImprovedFlexII) {
      flexDie = 'd6';
    } else if (hasImprovedFlex && flexDie === 'd10') {
      flexDie = 'd8';
    }

    const flexRoll = new Roll(flexDie, this.actor.getRollData());
    await flexRoll.evaluate();

    const maxValue = { 'd10': 10, 'd8': 8, 'd6': 6, 'd1': 1 }[flexDie];

    // Poison: noFlex — die still rolls but never triggers
    const poisonEffects = this.actor.getFlag('conan', 'poisonEffects');
    const flexSuppressed = poisonEffects?.active && poisonEffects.effects?.noFlex;
    const isTriggered = flexSuppressed ? false : (flexRoll.total === maxValue);

    // Get celebration data (for use by caller or auto-trigger)
    let celebData = null;
    if (isTriggered) {
      const flexCeleb = game.settings.get('conan', 'flexCelebrations') || {};

      // Map roll types to celebration types
      const rollTypeToCelebType = {
        'skill': 'skill', 'melee_hit': 'attack', 'ranged_hit': 'attack',
        'melee_damage': 'damage', 'ranged_damage': 'damage',
        'spell_hit': 'spell', 'spell_damage': 'spellDamage', 'death': 'deathSave',
        'attack': 'attack', 'damage': 'damage', 'check': 'skill'
      };
      const celebType = rollTypeToCelebType[rollType];

      if (flexCeleb?.enabled && celebType) {
        const players = Array.isArray(flexCeleb.players) ? flexCeleb.players : [];
        if (players.includes(this.actor.id)) {
          const celebrations = flexCeleb.celebrations || {};
          const playerCelebs = Array.isArray(celebrations[this.actor.id]) ? celebrations[this.actor.id] : [];
          const celeb = playerCelebs.find(c => c.type === celebType && c.enabled !== false);
          if (celeb) {
            celebData = celeb;
          }
        }
      }

      // Only auto-trigger celebration if not suppressed (for flex choice cards, we defer)
      if (!suppressCelebration && celebData) {
        const msg = await ChatMessage.create({
          content: '',
          whisper: [],
          blind: true,
          flags: {
            conan: {
              flexCelebration: true,
              actorId: this.actor.id,
              rollType: rollType,
              celebData: celebData
            }
          }
        });
        // Delete the message so it doesn't clutter chat - hook already fired
        if (msg) msg.delete();
      }
    }

    return {
      roll: flexRoll,
      triggered: isTriggered,
      die: flexDie,
      result: flexRoll.total,
      celebData: celebData, // Return celebData so caller can use it later
      suppressed: flexSuppressed && (flexRoll.total === maxValue) // Poison killed what would have been a trigger
    };
  }

  /**
   * Build flex choice card HTML for attack/damage/spell flex triggers
   * @param {string} type - The type of flex (attack, damage, spell, skill, death)
   * @param {object} flexData - The flex die roll data
   * @param {object} choiceData - Data needed for button handlers
   * @param {string} tokenImg - Token image URL
   * @param {string} ownerColor - Owner's color
   * @returns {string} - HTML content for the flex choice card
   */
  _buildFlexChoiceCard(type, flexData, choiceData, tokenImg, ownerColor) {
    // Type-specific styling
    const typeStyles = {
      attack: {
        gradient: 'linear-gradient(180deg, #1a365d 0%, #0d1b2a 100%)',
        headerGradient: 'linear-gradient(180deg, #2d4a7d 0%, #1a365d 100%)',
        borderColor: '#4299e1',
        accentColor: '#63b3ed',
        icon: '⚔️',
        title: 'ATTACK FLEX!'
      },
      damage: {
        gradient: 'linear-gradient(180deg, #5a2d2d 0%, #3d1a1a 100%)',
        headerGradient: 'linear-gradient(180deg, #7d3d3d 0%, #5a2d2d 100%)',
        borderColor: '#E10600',
        accentColor: '#ff6b6b',
        icon: '💥',
        title: 'DAMAGE FLEX!'
      },
      spell: {
        gradient: 'linear-gradient(180deg, #2d2d5a 0%, #1a1a3d 100%)',
        headerGradient: 'linear-gradient(180deg, #3d3d7d 0%, #2d2d5a 100%)',
        borderColor: '#9f7aea',
        accentColor: '#b794f4',
        icon: '✨',
        title: 'SPELL FLEX!'
      },
      skill: {
        gradient: 'linear-gradient(180deg, #2d5a2d 0%, #1a3d1a 100%)',
        headerGradient: 'linear-gradient(180deg, #3d7d3d 0%, #2d5a2d 100%)',
        borderColor: '#48bb78',
        accentColor: '#68d391',
        icon: '🎯',
        title: 'SKILL FLEX!'
      },
      death: {
        gradient: 'linear-gradient(180deg, #4a4a4a 0%, #2d2d2d 100%)',
        headerGradient: 'linear-gradient(180deg, #5a5a5a 0%, #4a4a4a 100%)',
        borderColor: '#a0aec0',
        accentColor: '#cbd5e0',
        icon: '💀',
        title: 'DEATH SAVE FLEX!'
      },
      squander: {
        gradient: 'linear-gradient(180deg, #3d2a1a 0%, #1f1510 100%)',
        headerGradient: 'linear-gradient(180deg, #5a3d2d 0%, #3d2a1a 100%)',
        borderColor: '#d4a844',
        accentColor: '#d4a844',
        icon: '🎲',
        title: 'SQUANDER FLEX!'
      }
    };

    const style = typeStyles[type] || typeStyles.skill;
    const title = (type === 'squander' && choiceData.squanderName) ? `${choiceData.squanderName.toUpperCase()} FLEX!` : style.title;
    const dataStr = JSON.stringify(choiceData).replace(/"/g, '&quot;');

    let content = `<div class="conan-roll flex-choice-card" style="border-color: ${style.borderColor}; background: ${style.gradient};">`;
    content += `<div class="roll-header" style="background: ${style.headerGradient};">`;
    content += `<img src="${tokenImg}" class="token-img" alt="${this.actor.name}">`;
    content += `<div class="roll-title" style="color: ${style.accentColor};">${style.icon} ${title}</div>`;
    content += `</div>`;

    // Show roll result for attack, skill, spell, and death types (not damage - that's already resolved)
    if (type !== 'damage' && choiceData.rollTotal !== undefined) {
      content += `<div class="flex-roll-result" style="text-align: center; padding: 10px 15px; margin: 0 15px; background: rgba(0,0,0,0.3); border-radius: 8px;">`;
      content += `<div style="font-size: 14px; text-transform: uppercase; letter-spacing: 0.1em; color: ${style.accentColor}; margin-bottom: 4px;">Your Roll</div>`;
      content += `<div style="font-size: 32px; font-weight: 800; color: #fff; text-shadow: 0 0 10px ${style.accentColor};">${choiceData.rollTotal}</div>`;
      if (choiceData.rollLabel) {
        content += `<div style="font-size: 14px; color: #aaa; margin-top: 2px;">${choiceData.rollLabel}</div>`;
      }
      content += `</div>`;
    }

    // Choice buttons
    content += `<div class="flex-choice-buttons" style="display: flex; justify-content: center; gap: 8px; padding: 10px; flex-wrap: wrap;">`;

    // Squander flex: no stamina option, unique choices
    if (type === 'squander') {
      content += `<button type="button" class="flex-choice-btn effect-choice" data-choice="squanderTier" data-flex-data="${dataStr}" style="background: linear-gradient(180deg, #2d5a2d 0%, #1a3d1a 100%); color: #90EE90; border: 2px solid #4CAF50; padding: 10px 14px; border-radius: 8px; cursor: pointer; font-weight: bold; font-size: 15px; min-width: 80px; transition: all 0.2s;">`;
      content += `⬆ +1 Tier</button>`;
      content += `<button type="button" class="flex-choice-btn effect-choice" data-choice="squanderGlory" data-flex-data="${dataStr}" style="background: linear-gradient(180deg, #3d5a1a 0%, #2a3d10 100%); color: #FFD700; border: 2px solid #d4a844; padding: 10px 14px; border-radius: 8px; cursor: pointer; font-weight: bold; font-size: 15px; min-width: 80px; transition: all 0.2s;">`;
      content += `☀ Glory</button>`;
      content += `<button type="button" class="flex-choice-btn effect-choice" data-choice="squanderChaos" data-flex-data="${dataStr}" style="background: linear-gradient(180deg, #5a1a1a 0%, #3d1010 100%); color: #ff6b6b; border: 2px solid #E10600; padding: 10px 14px; border-radius: 8px; cursor: pointer; font-weight: bold; font-size: 15px; min-width: 80px; transition: all 0.2s;">`;
      content += `💀 Chaos</button>`;
      content += `</div></div>`;
      return content;
    }

    // Stamina button (always available for non-squander types)
    content += `<button type="button" class="flex-choice-btn stamina-choice" data-choice="stamina" data-flex-data="${dataStr}" style="background: linear-gradient(180deg, #2d5a2d 0%, #1a3d1a 100%); color: #90EE90; border: 2px solid #4CAF50; padding: 10px 14px; border-radius: 8px; cursor: pointer; font-weight: bold; font-size: 15px; min-width: 80px; transition: all 0.2s;">`;
    content += `+1 Stamina!</button>`;

    // Type-specific effect button
    if (type === 'attack') {
      content += `<button type="button" class="flex-choice-btn effect-choice" data-choice="hit" data-flex-data="${dataStr}" style="background: linear-gradient(180deg, #8b0000 0%, #5c0000 100%); color: #FFD700; border: 2px solid #E10600; padding: 10px 14px; border-radius: 8px; cursor: pointer; font-weight: bold; font-size: 15px; min-width: 80px; transition: all 0.2s;">`;
      content += `⚔️ HIT!</button>`;
    } else if (type === 'damage') {
      content += `<button type="button" class="flex-choice-btn effect-choice" data-choice="massive" data-flex-data="${dataStr}" style="background: linear-gradient(180deg, #8b0000 0%, #5c0000 100%); color: #FFD700; border: 2px solid #E10600; padding: 10px 14px; border-radius: 8px; cursor: pointer; font-weight: bold; font-size: 15px; min-width: 80px; transition: all 0.2s;">`;
      content += `💥 Massive! (${choiceData.massiveDamage})</button>`;
    } else if (type === 'spell') {
      const isMesmerism = choiceData.spellId === 'mesmerism';
      const spellFlexLabel = isMesmerism ? '🔮 Dominate!' : '✨ Cast!';
      const spellFlexStyle = isMesmerism
        ? 'background: linear-gradient(180deg, #4a1a6b 0%, #2d0f40 100%); color: #d9a3ff; border: 2px solid #9400D3;'
        : 'background: linear-gradient(180deg, #3d3d7d 0%, #2d2d5a 100%); color: #b794f4; border: 2px solid #9f7aea;';
      content += `<button type="button" class="flex-choice-btn effect-choice" data-choice="hit" data-flex-data="${dataStr}" style="${spellFlexStyle} padding: 10px 14px; border-radius: 8px; cursor: pointer; font-weight: bold; font-size: 15px; min-width: 80px; transition: all 0.2s;">`;
      content += `${spellFlexLabel}</button>`;
      // Sorcery flex: regain spell cost (only if spell had a cost and not already regained this cast)
      if ((choiceData.spellCostLp > 0 || choiceData.spellCostSp > 0) && !game.conan?.lastSpellCostRegained) {
        const costParts = [];
        if (choiceData.spellCostLp > 0) costParts.push(`${choiceData.spellCostLp} LP`);
        if (choiceData.spellCostSp > 0) costParts.push(`${choiceData.spellCostSp} SP`);
        content += `<button type="button" class="flex-choice-btn effect-choice" data-choice="regain" data-flex-data="${dataStr}" style="background: linear-gradient(180deg, #5a2d5a 0%, #3d1a3d 100%); color: #ff99ff; border: 2px solid #cc66cc; padding: 10px 14px; border-radius: 8px; cursor: pointer; font-weight: bold; font-size: 15px; min-width: 80px; transition: all 0.2s;">`;
        content += `🔮 Regain ${costParts.join(' + ')}</button>`;
      }
    } else if (type === 'skill') {
      content += `<button type="button" class="flex-choice-btn effect-choice" data-choice="success" data-flex-data="${dataStr}" style="background: linear-gradient(180deg, #3d7d3d 0%, #2d5a2d 100%); color: #90EE90; border: 2px solid #48bb78; padding: 10px 14px; border-radius: 8px; cursor: pointer; font-weight: bold; font-size: 15px; min-width: 80px; transition: all 0.2s;">`;
      content += `🎯 Success!</button>`;
    }

    content += `</div>`;
    content += `</div>`;

    return content;
  }

  // ==========================================
  // CRUEL FATE SYSTEM
  // ==========================================

  /**
   * Check if a roll resulted in Cruel Fate (stat die rolled a 1)
   * @param {Roll} roll - The roll to check
   * @returns {boolean} - True if Cruel Fate occurred
   */
  _checkCruelFate(roll) {
    // Check if the first term (the stat die) rolled a 1
    if (roll.terms && roll.terms[0] && roll.terms[0].results) {
      const dieResult = roll.terms[0].results[0].result;
      return dieResult === 1;
    }
    return false;
  }

  // ==========================================
  // ATTRIBUTE ROLLS
  // ==========================================

  async _onRollAttribute(event, options = {}) {
    event?.preventDefault?.();
    const { isReroll = false, forceAttribute = null, eyesOfTheRaven = false, howardCheckInstance = null } = options;

    const element = event?.currentTarget;
    const attribute = forceAttribute || element?.dataset?.attribute;
    const attrData = this.actor.system.attributes[attribute];

    if (!attrData) return;

    // Store this check for potential Pantherish reroll (only if not already a reroll)
    if (!isReroll) {
      this._lastRollData = this._lastRollData || {};
      this._lastRollData.check = { attribute };
    }

    // Get effective die and value (includes skill bonuses)
    const { die, value, skillDieUpgrade, skillValueBonus } = this._getEffectiveStatValues(attribute);

    // Get origin bonuses for stat checks
    const originBonuses = this._getActiveOriginBonuses();
    const statBonus = originBonuses.statChecks[attribute] || 0;

    // Check for Infamy (pre-activated for intimidate/convince checks)
    const infamyActive = this.actor.system.infamyActive || false;
    let infamyBonus = 0;
    if (infamyActive) {
      infamyBonus = 2;
      // Clear the flag - it's consumed on this check
      await this.actor.update({ 'system.infamyActive': false });
    }

    // Check for Of the Shadows (stance - +1 to Edge checks while active)
    const ofTheShadowsActive = this.actor.system.ofTheShadowsActive || false;
    let ofTheShadowsBonus = 0;
    if (ofTheShadowsActive && attribute === 'edge') {
      ofTheShadowsBonus = 1;
      // Don't clear - it's a stance that stays active until manually toggled off
    }

    // Eyes of the Raven (+2 perception) — only when triggered via the Raven icon
    let eyesOfTheRavenBonus = 0;
    if (eyesOfTheRaven && attribute === 'edge') {
      eyesOfTheRavenBonus = 2;
    }

    // Inspire spell (+2 to all Checks while active)
    const inspireActive = this.actor.system.inspireSpellActive === 'active' || this.actor.system.inspireSpellActive === 'warning';
    let inspireBonus = inspireActive ? 2 : 0;

    // Captured Soul (+2 to next Check or Attack when primed, then consumed)
    const soulPrimed = this.actor.system.capturedSoulState === 'primed';
    let soulBonus = soulPrimed ? 2 : 0;
    if (soulPrimed) {
      this.actor.update({ 'system.capturedSoulState': null });
    }

    // Build roll formula with origin bonus and Infamy
    let rollFormula = `1${die} + ${value}`;
    if (statBonus > 0) {
      rollFormula += ` + ${statBonus}`;
    }
    if (infamyBonus > 0) {
      rollFormula += ` + ${infamyBonus}`;
    }
    if (ofTheShadowsBonus > 0) {
      rollFormula += ` + ${ofTheShadowsBonus}`;
    }
    if (eyesOfTheRavenBonus > 0) {
      rollFormula += ` + ${eyesOfTheRavenBonus}`;
    }
    if (inspireBonus > 0) {
      rollFormula += ` + ${inspireBonus}`;
    }
    if (soulBonus > 0) {
      rollFormula += ` + ${soulBonus}`;
    }

    // Poison: checksDown — silent -1 penalty to all checks
    const poisonEffects = this.actor.getFlag('conan', 'poisonEffects');
    const poisonPenalty = (poisonEffects?.active && poisonEffects.effects?.checksDown) ? -1 : 0;
    if (poisonPenalty !== 0) {
      rollFormula += ` - 1`;
    }

    const roll = new Roll(rollFormula, this.actor.getRollData());
    await roll.evaluate();

    // Get Winds of Fate modifier
    const windsOfFate = WindsOfFateDialog.getValueForActor(this.actor);
    const adjustedTotal = roll.total + windsOfFate;

    const flexData = await this._rollFlexDie('skill', true); // Suppress auto-celebration
    const cruelFate = this._checkCruelFate(roll);
    const ownerColor = this._getOwnerColor();
    const tokenImg = this.actor.prototypeToken?.texture?.src || this.actor.img || 'icons/svg/mystery-man.svg';

    // Build formula display
    let formulaDisplay = `1${die} + ${value}`;
    if (skillDieUpgrade) {
      formulaDisplay += ` <span style="color: #FFD700;">(${skillDieUpgrade})</span>`;
    }
    if (skillValueBonus) {
      formulaDisplay += ` <span style="color: #90EE90;">(${skillValueBonus})</span>`;
    }
    if (statBonus > 0) {
      formulaDisplay += ` <span style="color: #90EE90;">(+${statBonus} Origin)</span>`;
    }
    if (infamyBonus > 0) {
      formulaDisplay += ` <span style="color: #DDA0DD;">(+${infamyBonus} Infamy)</span>`;
    }
    if (ofTheShadowsBonus > 0) {
      formulaDisplay += ` <span style="color: #9370DB;">(+${ofTheShadowsBonus} Shadows)</span>`;
    }
    if (eyesOfTheRavenBonus > 0) {
      formulaDisplay += ` <span style="color: #87CEEB;">(+${eyesOfTheRavenBonus} Raven)</span>`;
    }
    if (inspireBonus > 0) {
      formulaDisplay += ` <span style="color: #90EE90;">(+${inspireBonus} Inspire)</span>`;
    }
    if (soulBonus > 0) {
      formulaDisplay += ` <span style="color: #DC143C;">(+${soulBonus} Soul)</span>`;
    }
    if (poisonPenalty !== 0) {
      formulaDisplay += ` <span style="color: #32CD32;">(-1 Venom)</span>`;
    }
    if (windsOfFate !== 0) {
      formulaDisplay += ` <span style="color: #c9a668;">(${windsOfFate > 0 ? '+' : ''}${windsOfFate} Fate)</span>`;
    }

    // Get the die roll result
    const dieResult = roll.terms[0]?.results?.[0]?.result || roll.total - value - statBonus - infamyBonus - ofTheShadowsBonus - eyesOfTheRavenBonus - inspireBonus - soulBonus;

    // Build skill breakdown HTML base (without closing tag - we'll add flex line for non-flex rolls)
    const buildSkillBreakdown = (includeFlex) => {
      let html = `<div class="skill-breakdown" style="display: none;">`;
      html += `<div class="breakdown-header">Skill Breakdown</div>`;
      html += `<div class="breakdown-line"><span class="breakdown-label">Base Roll</span><span class="breakdown-value">1${die} → ${dieResult}</span></div>`;
      html += `<div class="breakdown-line"><span class="breakdown-label">${attrData.label}</span><span class="breakdown-value">+${value}</span></div>`;
      if (skillDieUpgrade) {
        html += `<div class="breakdown-line skill-bonus"><span class="breakdown-label">Die Upgrade</span><span class="breakdown-value">${skillDieUpgrade}</span></div>`;
      }
      if (skillValueBonus) {
        html += `<div class="breakdown-line skill-bonus"><span class="breakdown-label">Skill Bonus</span><span class="breakdown-value">${skillValueBonus}</span></div>`;
      }
      if (statBonus > 0) {
        html += `<div class="breakdown-line skill-bonus"><span class="breakdown-label">Origin</span><span class="breakdown-value">+${statBonus}</span></div>`;
      }
      if (infamyBonus > 0) {
        html += `<div class="breakdown-line skill-bonus"><span class="breakdown-label">Infamy</span><span class="breakdown-value">+${infamyBonus}</span></div>`;
      }
      if (ofTheShadowsBonus > 0) {
        html += `<div class="breakdown-line skill-bonus"><span class="breakdown-label">Of the Shadows</span><span class="breakdown-value">+${ofTheShadowsBonus}</span></div>`;
      }
      if (eyesOfTheRavenBonus > 0) {
        html += `<div class="breakdown-line skill-bonus"><span class="breakdown-label">Eyes of the Raven</span><span class="breakdown-value">+${eyesOfTheRavenBonus}</span></div>`;
      }
      if (inspireBonus > 0) {
        html += `<div class="breakdown-line skill-bonus"><span class="breakdown-label">Inspire</span><span class="breakdown-value">+${inspireBonus}</span></div>`;
      }
      if (soulBonus > 0) {
        html += `<div class="breakdown-line skill-bonus" style="color: #DC143C;"><span class="breakdown-label">Captured Soul</span><span class="breakdown-value">+${soulBonus}</span></div>`;
      }
      if (poisonPenalty !== 0) {
        html += `<div class="breakdown-line breakdown-poison"><span class="breakdown-label">Venom</span><span class="breakdown-value">-1</span></div>`;
      }
      if (windsOfFate !== 0) {
        html += `<div class="breakdown-line skill-bonus" style="color: #c9a668;"><span class="breakdown-label">Winds of Fate</span><span class="breakdown-value">${windsOfFate > 0 ? '+' : ''}${windsOfFate}</span></div>`;
      }
      html += `<div class="breakdown-line breakdown-total"><span class="breakdown-label">TOTAL</span><span class="breakdown-value">${adjustedTotal}</span></div>`;
      if (includeFlex) {
        html += `<div class="breakdown-line flex-line"><span class="breakdown-label">Flex Die (${flexData.die})</span><span class="breakdown-value">${flexData.result}</span></div>`;
      }
      html += `</div>`;
      return html;
    };

    // If flex triggered, show flex choice card
    if (flexData.triggered) {
      // Build normal content for stamina choice fallback (no flex die shown)
      const hciAttr = howardCheckInstance ? ` data-howard-check="${howardCheckInstance}"` : '';
      let normalContent = `<div class="conan-roll" style="border-color: ${ownerColor};"${hciAttr}>`;
      normalContent += `<div class="roll-header">`;
      normalContent += `<img src="${tokenImg}" class="token-img" alt="${this.actor.name}">`;
      normalContent += `<div class="roll-title">${attrData.label} Roll</div>`;
      normalContent += `</div>`;
      if (cruelFate) normalContent += `<div class="cruel-fate-indicator">Cruel Fate</div>`;
      if (isReroll) {
        normalContent += `<div class="reroll-indicator" style="display: flex; align-items: center; justify-content: center; gap: 6px; padding: 4px 8px; background: rgba(50,205,50,0.2); border-radius: 4px; margin-bottom: 6px;">`;
        normalContent += `<img src="systems/conan/images/icons/pantherish_i_icon.png" style="width: 20px; height: 20px;" alt="Pantherish"/>`;
        normalContent += `<span style="color: #32CD32; font-weight: bold;">PANTHERISH REROLL</span>`;
        normalContent += `</div>`;
      }
      if (infamyBonus > 0) {
        normalContent += `<div class="skill-indicator" style="background: linear-gradient(180deg, #4a3060 0%, #2d1a40 100%); border-color: #9370DB; color: #DDA0DD;">Infamy (+2)</div>`;
      }
      if (eyesOfTheRavenBonus > 0) {
        normalContent += `<div class="skill-indicator" style="background: linear-gradient(180deg, #1a3050 0%, #0d1a30 100%); border-color: #87CEEB; color: #87CEEB;">Eyes of the Raven (+2)</div>`;
      }
      if (inspireBonus > 0) {
        normalContent += `<div class="skill-indicator" style="background: linear-gradient(180deg, #1a3a1a 0%, #0d200d 100%); border-color: #90EE90; color: #90EE90;">Inspired (+2)</div>`;
      }
      if (soulBonus > 0) {
        normalContent += `<div class="skill-indicator" style="background: linear-gradient(180deg, #3a0a0a 0%, #200505 100%); border-color: #DC143C; color: #DC143C;">Captured Soul (+2)</div>`;
      }
      normalContent += `<div class="sp-boost-row">`;
      normalContent += `<button type="button" class="sp-boost-btn" data-boost="1" data-cost="1" data-actor-id="${this.actor.id}" data-base-total="${adjustedTotal}" data-cruel-fate="${cruelFate}" data-roll-label="${attrData.label}">+1</button>`;
      normalContent += `<div class="skill-result-box clickable-breakdown" style="cursor: pointer;">${adjustedTotal}</div>`;
      normalContent += `<button type="button" class="sp-boost-btn" data-boost="2" data-cost="2" data-actor-id="${this.actor.id}" data-base-total="${adjustedTotal}" data-cruel-fate="${cruelFate}" data-roll-label="${attrData.label}">+2</button>`;
      normalContent += `</div>`;
      normalContent += buildSkillBreakdown(false);
      normalContent += `</div>`;

      const flexChoiceData = {
        actorId: this.actor.id,
        rollType: 'skill',
        celebData: flexData.celebData,
        normalContent: normalContent,
        rollLabel: `${attrData.label} Check`,
        rollTotal: adjustedTotal
      };

      const flexCardContent = this._buildFlexChoiceCard('skill', flexData, flexChoiceData, tokenImg, ownerColor);

      ChatMessage.create({
        speaker: ChatMessage.getSpeaker({ actor: this.actor }),
        content: flexCardContent,
        rolls: [roll, flexData.roll],
        rollMode: game.settings.get('core', 'rollMode')
      });
    } else {
      // No flex - show normal skill roll card with flex die in breakdown
      const hciAttr2 = howardCheckInstance ? ` data-howard-check="${howardCheckInstance}"` : '';
      let content = `<div class="conan-roll" style="border-color: ${ownerColor};"${hciAttr2}>`;
      content += `<div class="roll-header">`;
      content += `<img src="${tokenImg}" class="token-img" alt="${this.actor.name}">`;
      content += `<div class="roll-title">${attrData.label} Roll</div>`;
      content += `</div>`;
      if (cruelFate) content += `<div class="cruel-fate-indicator">Cruel Fate</div>`;
      if (isReroll) {
        content += `<div class="reroll-indicator" style="display: flex; align-items: center; justify-content: center; gap: 6px; padding: 4px 8px; background: rgba(50,205,50,0.2); border-radius: 4px; margin-bottom: 6px;">`;
        content += `<img src="systems/conan/images/icons/pantherish_i_icon.png" style="width: 20px; height: 20px;" alt="Pantherish"/>`;
        content += `<span style="color: #32CD32; font-weight: bold;">PANTHERISH REROLL</span>`;
        content += `</div>`;
      }
      if (infamyBonus > 0) {
        content += `<div class="skill-indicator" style="background: linear-gradient(180deg, #4a3060 0%, #2d1a40 100%); border-color: #9370DB; color: #DDA0DD;">Infamy (+2)</div>`;
      }
      if (eyesOfTheRavenBonus > 0) {
        content += `<div class="skill-indicator" style="background: linear-gradient(180deg, #1a3050 0%, #0d1a30 100%); border-color: #87CEEB; color: #87CEEB;">Eyes of the Raven (+2)</div>`;
      }
      if (inspireBonus > 0) {
        content += `<div class="skill-indicator" style="background: linear-gradient(180deg, #1a3a1a 0%, #0d200d 100%); border-color: #90EE90; color: #90EE90;">Inspired (+2)</div>`;
      }
      if (soulBonus > 0) {
        content += `<div class="skill-indicator" style="background: linear-gradient(180deg, #3a0a0a 0%, #200505 100%); border-color: #DC143C; color: #DC143C;">Captured Soul (+2)</div>`;
      }
      content += `<div class="sp-boost-row">`;
      content += `<button type="button" class="sp-boost-btn" data-boost="1" data-cost="1" data-actor-id="${this.actor.id}" data-base-total="${adjustedTotal}" data-cruel-fate="${cruelFate}" data-roll-label="${attrData.label}">+1</button>`;
      content += `<div class="skill-result-box clickable-breakdown" style="cursor: pointer;">${adjustedTotal}</div>`;
      content += `<button type="button" class="sp-boost-btn" data-boost="2" data-cost="2" data-actor-id="${this.actor.id}" data-base-total="${adjustedTotal}" data-cruel-fate="${cruelFate}" data-roll-label="${attrData.label}">+2</button>`;
      content += `</div>`;
      content += buildSkillBreakdown(true);

      // Poison: flex die was suppressed — show dread message
      if (flexData.suppressed) {
        const venomMsg = VENOM_FLEX_MESSAGES[Math.floor(Math.random() * VENOM_FLEX_MESSAGES.length)];
        content += `<div style="padding: 6px 10px; margin-top: 6px; background: rgba(50,205,50,0.1); border-left: 2px solid #32CD32; border-radius: 2px; color: #32CD32; font-style: italic; font-size: 15px;">${venomMsg}</div>`;
      }

      content += `</div>`;

      ChatMessage.create({
        speaker: ChatMessage.getSpeaker({ actor: this.actor }),
        content: content,
        rolls: [roll, flexData.roll],
        rollMode: game.settings.get('core', 'rollMode')
      });
    }
  }

  // ==========================================
  // INITIATIVE
  // ==========================================

  /**
   * Check if FIGHT! pulse should show on the initiative button.
   * Pulses when: combat exists, this actor is NOT yet a combatant.
   */
  _updateFightPulse(html) {
    const initBtn = html.find('.sheet2-initDisplay');
    if (!initBtn.length) return;

    const combat = game.combat;
    if (!combat) {
      initBtn.removeClass('fight-pulse');
      return;
    }

    const isInCombat = combat.combatants.some(c => c.actorId === this.actor.id);
    if (isInCombat) {
      initBtn.removeClass('fight-pulse');
    } else {
      initBtn.addClass('fight-pulse');
    }
  }

  async _onRollInitiative(event) {
    event.preventDefault();

    // Check if there's a manual initiative override
    const initiativeOverride = this.actor.system.initiative?.value;

    // Check for Combat Readiness skills (+1 Initiative each, stacks)
    let combatReadinessBonus = 0;
    let combatReadinessSkills = [];
    const skills = this.actor.system.skills || {};
    for (const skill of Object.values(skills)) {
      const skillName = skill.name?.toLowerCase() || '';
      if (skillName === 'combat readiness') {
        combatReadinessBonus += 1;
        combatReadinessSkills.push('Combat Readiness');
      }
      if (skillName === 'combat readiness ii') {
        combatReadinessBonus += 1;
        combatReadinessSkills.push('Combat Readiness II');
      }
    }

    let initiative;
    let roll = null;
    let rollFormula = "";

    if (initiativeOverride !== null && initiativeOverride !== undefined && initiativeOverride !== "") {
      // Use manual override (Combat Readiness still applies)
      initiative = parseInt(initiativeOverride) + combatReadinessBonus;

      let content = `<div class="conan-roll">`;
      content += `<h3>Initiative (Manual)</h3>`;
      content += `<div class="roll-result"><strong>Initiative:</strong> ${initiative}</div>`;
      if (combatReadinessBonus > 0) {
        content += `<div class="roll-formula">Override ${initiativeOverride} + ${combatReadinessSkills.join(' + ')} +${combatReadinessBonus}</div>`;
      } else {
        content += `<div class="roll-formula">Using manual override value</div>`;
      }
      content += `</div>`;

      ChatMessage.create({
        speaker: ChatMessage.getSpeaker({ actor: this.actor }),
        content: content,
        rollMode: game.settings.get('core', 'rollMode')
      });
    } else {
      // Calculate from effective Edge (includes Sharpness skill die upgrades and Steel Trap Reflexes value bonus)
      const { die, value, skillDieUpgrade, skillValueBonus } = this._getEffectiveStatValues('edge');

      const totalBonus = value + combatReadinessBonus;
      rollFormula = combatReadinessBonus > 0 ? `1${die} + ${value} + ${combatReadinessBonus}` : `1${die} + ${value}`;

      roll = new Roll(rollFormula, this.actor.getRollData());
      await roll.evaluate();

      initiative = roll.total;

      let content = `<div class="conan-roll">`;
      content += `<h3>Initiative Roll</h3>`;
      content += `<div class="roll-result"><strong>Initiative:</strong> ${initiative}</div>`;

      // Build formula display with skill indicators
      let formulaDisplay = `1${die} + ${value}`;
      if (skillDieUpgrade) {
        formulaDisplay += ` <span style="color: #FFD700;">(${skillDieUpgrade})</span>`;
      }
      if (skillValueBonus) {
        formulaDisplay += ` <span style="color: #90EE90;">(${skillValueBonus})</span>`;
      }
      if (combatReadinessBonus > 0) {
        formulaDisplay += ` + ${combatReadinessBonus}`;
      }
      content += `<div class="roll-formula">${formulaDisplay} = ${initiative}</div>`;

      if (combatReadinessBonus > 0) {
        content += `<div class="roll-skill-bonus" style="color: #6495ED;">${combatReadinessSkills.join(', ')} +${combatReadinessBonus}</div>`;
      }
      content += `</div>`;

      ChatMessage.create({
        speaker: ChatMessage.getSpeaker({ actor: this.actor }),
        content: content,
        rolls: [roll],
        rollMode: game.settings.get('core', 'rollMode')
      });
    }

    // Add to combat tracker
    const combat = game.combat;
    if (!combat) {
      const newCombat = await game.combats.documentClass.create({
        scene: canvas.scene?.id,
        active: true
      });
      await newCombat.activate();
    }

    const activeCombat = game.combat;
    if (activeCombat) {
      const existingCombatant = activeCombat.combatants.find(c => c.actorId === this.actor.id);

      if (existingCombatant) {
        await activeCombat.setInitiative(existingCombatant.id, initiative);
        ui.notifications.info(`Updated initiative for ${this.actor.name}: ${initiative}`);
      } else {
        // Find token for this actor - check if opened from token first, then search scene
        let tokenId = this.actor.token?.id || null;
        if (!tokenId && canvas.scene) {
          // Find token on current scene that represents this actor
          const sceneToken = canvas.scene.tokens.find(t => t.actorId === this.actor.id);
          tokenId = sceneToken?.id || null;
        }

        await activeCombat.createEmbeddedDocuments("Combatant", [{
          tokenId: tokenId,
          actorId: this.actor.id,
          sceneId: canvas.scene?.id || null,
          initiative: initiative
        }]);
        ui.notifications.info(`Added ${this.actor.name} to combat with initiative ${initiative}`);
      }
    }

    // Activate reload tracker for ammo recovery
    const existingTracker = this.actor.system.reloadTracker || {};
    if (!existingTracker.active) {
      await this.actor.update({
        'system.reloadTracker': {
          ...existingTracker,
          active: true,
          weapons: existingTracker.weapons || {}
        }
      });
    }
  }

  // ==========================================
  // WEAPON SYSTEM - NEW
  // ==========================================

  _onOpenAddWeapon(event) {
    event.preventDefault();
    const menu = this.element.find('.sheet2-addWeaponMenu');
    menu.addClass('active');

    // Reset selection state
    this._selectedWeaponKey = null;
    this._selectedWeaponType = 'melee';
    this._selectedSubCategory = 'light';

    // Set default category tab to melee
    this.element.find('.sheet2-weaponCategoryTab').removeClass('active');
    this.element.find('.sheet2-weaponCategoryTab[data-category="melee"]').addClass('active');

    // Show melee sub-tabs, reset to light
    this.element.find('.sheet2-weaponSubCategoryTabs').addClass('active');
    this.element.find('.sheet2-weaponSubTab').removeClass('active');
    this.element.find('.sheet2-weaponSubTab[data-subcategory="light"]').addClass('active');

    // Populate the weapon grid for melee-light
    this._populateWeaponGrid('melee', 'light');

    // Reset preview
    this.element.find('.sheet2-pickerPreviewEmpty').show();
    this.element.find('.sheet2-pickerPreviewContent').hide();
    this.element.find('.arm-weapon').prop('disabled', true);
  }

  _onCloseAddWeapon(event) {
    event.preventDefault();
    this._clearAllTooltips();
    const menu = this.element.find('.sheet2-addWeaponMenu');
    menu.removeClass('active');
  }

  /**
   * Populate the weapon grid with cards for a given category
   * @param {string} category - melee, thrown, or ranged
   * @param {string} [subcategory] - light, medium, or heavy (for melee only)
   */
  _populateWeaponGrid(category, subcategory = null) {
    const catalog = this._getWeaponCatalog();
    let weapons = catalog[category] || {};
    const grid = this.element.find('.sheet2-weaponPickerGrid');
    const placeholder = 'icons/svg/sword.svg';

    // Filter melee weapons by subcategory if specified
    if (category === 'melee' && subcategory) {
      const filtered = {};
      for (const [key, weapon] of Object.entries(weapons)) {
        const type = weapon.type.toLowerCase();
        if (subcategory === 'light' && (type.includes('light') || type === 'unarmed')) {
          filtered[key] = weapon;
        } else if (subcategory === 'medium' && type.includes('medium')) {
          filtered[key] = weapon;
        } else if (subcategory === 'heavy' && type.includes('heavy')) {
          filtered[key] = weapon;
        }
      }
      weapons = filtered;
    }

    grid.attr('data-category', category);
    grid.empty();

    for (const [key, weapon] of Object.entries(weapons)) {
      const card = $(`
        <div class="sheet2-weaponCard" data-weapon-key="${key}" data-weapon-type="${category}" title="${weapon.name}">
          <img src="${weapon.image}" class="sheet2-weaponCardImg" alt="${weapon.name}" onerror="this.src='${placeholder}'"/>
        </div>
      `);
      grid.append(card);
    }
  }

  /**
   * Handle category tab click
   */
  _onWeaponCategoryTab(event) {
    event.preventDefault();
    const tab = $(event.currentTarget);
    const category = tab.data('category');

    // Update active tab
    this.element.find('.sheet2-weaponCategoryTab').removeClass('active');
    tab.addClass('active');

    // Show/hide sub-category tabs (only for melee)
    if (category === 'melee') {
      this.element.find('.sheet2-weaponSubCategoryTabs').addClass('active');
      this.element.find('.sheet2-weaponSubTab').removeClass('active');
      this.element.find('.sheet2-weaponSubTab[data-subcategory="light"]').addClass('active');
      this._selectedSubCategory = 'light';
      this._populateWeaponGrid(category, 'light');
    } else {
      this.element.find('.sheet2-weaponSubCategoryTabs').removeClass('active');
      this._selectedSubCategory = null;
      this._populateWeaponGrid(category);
    }

    this._selectedWeaponType = category;

    // Clear selection
    this._selectedWeaponKey = null;
    this.element.find('.sheet2-pickerPreviewEmpty').show();
    this.element.find('.sheet2-pickerPreviewContent').hide();
    this.element.find('.arm-weapon').prop('disabled', true);
  }

  /**
   * Handle melee sub-category tab click
   */
  _onWeaponSubCategoryTab(event) {
    event.preventDefault();
    const tab = $(event.currentTarget);
    const subcategory = tab.data('subcategory');

    // Update active sub-tab
    this.element.find('.sheet2-weaponSubTab').removeClass('active');
    tab.addClass('active');

    // Populate grid for melee with subcategory filter
    this._populateWeaponGrid('melee', subcategory);
    this._selectedSubCategory = subcategory;

    // Clear selection
    this._selectedWeaponKey = null;
    this.element.find('.sheet2-pickerPreviewEmpty').show();
    this.element.find('.sheet2-pickerPreviewContent').hide();
    this.element.find('.arm-weapon').prop('disabled', true);
  }

  /**
   * Handle weapon card click
   */
  _onWeaponCardClick(event) {
    event.preventDefault();
    const card = $(event.currentTarget);
    const weaponKey = card.data('weapon-key');
    const weaponType = card.data('weapon-type');

    // Update selection visual
    this.element.find('.sheet2-weaponCard').removeClass('selected');
    card.addClass('selected');

    // Store selection
    this._selectedWeaponKey = weaponKey;
    this._selectedWeaponType = weaponType;

    // Get weapon data
    const catalog = this._getWeaponCatalog();
    const weapon = catalog[weaponType]?.[weaponKey];

    if (!weapon) return;

    // Update preview
    const previewImg = this.element.find('.sheet2-pickerPreviewImage');
    previewImg.attr('src', weapon.image).attr('alt', weapon.name);
    previewImg.off('error').on('error', function() { this.src = 'icons/svg/sword.svg'; });
    this.element.find('.sheet2-pickerPreviewName').text(weapon.name);
    this.element.find('.weapon-preview-category').text(weapon.type);
    this.element.find('.weapon-preview-damage').text(weapon.damage);
    this.element.find('.weapon-preview-range').text(weapon.range);

    if (weapon.rules) {
      this.element.find('.weapon-preview-rules').text(weapon.rules);
      this.element.find('.weapon-preview-rules-row').show();
    } else {
      this.element.find('.weapon-preview-rules-row').hide();
    }

    this.element.find('.sheet2-pickerPreviewEmpty').hide();
    this.element.find('.sheet2-pickerPreviewContent').show();
    this.element.find('.arm-weapon').prop('disabled', false);
  }

  async _onArmWeapon(event) {
    event.preventDefault();
    const type = this._selectedWeaponType;
    const weaponKey = this._selectedWeaponKey;
    const useSpecificImage = this.element.find('.add-weapon-use-specific-image').is(':checked');

    if (!type || !weaponKey) return;

    const catalog = this._getWeaponCatalog();
    const weaponData = catalog[type]?.[weaponKey];

    if (!weaponData) return;

    const newId = `weapon${Date.now()}`;
    const newWeapon = {
      name: weaponData.name,
      type: type,
      category: weaponData.type,
      damage: weaponData.damage,
      range: weaponData.range,
      rules: weaponData.rules || null,
      useSpecificImage: useSpecificImage,
      specificImage: weaponData.image || null
    };

    // Add ammo for thrown/ranged
    if (weaponData.ammo) {
      newWeapon.ammo = { ...weaponData.ammo };
    }

    await this.actor.update({
      [`system.armedWeapons.${newId}`]: newWeapon
    });

    // Close the menu
    this._onCloseAddWeapon(event);
  }

  _onWeaponToggle(event) {
    event.preventDefault();
    event.stopPropagation();
    const weaponId = event.currentTarget.dataset.weaponId;
    const editPanel = this.element.find(`.sheet2-weaponEdit[data-for="${weaponId}"]`);
    const toggle = $(event.currentTarget);
    const allPanels = this.element.find('.sheet2-weaponEdit');
    const allToggles = this.element.find('.weapon-toggle');

    // Close all other panels
    this._clearAllTooltips();
    allPanels.not(editPanel).removeClass('active');
    allToggles.not(toggle).removeClass('open');

    // Toggle this panel
    if (editPanel.hasClass('active')) {
      editPanel.removeClass('active');
      toggle.removeClass('open');
      this._openWeaponPanelId = null;
    } else {
      editPanel.addClass('active');
      toggle.addClass('open');
      this._openWeaponPanelId = weaponId;
    }
  }

  async _onDeleteWeapon(event) {
    event.preventDefault();
    event.stopPropagation();
    const weaponId = event.currentTarget.dataset.weaponId;
    const weaponName = event.currentTarget.dataset.weaponName || 'this weapon';

    const confirmed = await Dialog.confirm({
      title: `Delete ${weaponName}`,
      content: `<p>Delete <strong>${weaponName}</strong>?</p>`,
      yes: () => true,
      no: () => false,
      defaultYes: false
    });
    if (!confirmed) return;

    // Clear the open panel tracking since we're deleting this weapon
    if (this._openWeaponPanelId === weaponId) {
      this._openWeaponPanelId = null;
    }

    await this.actor.update({
      [`system.armedWeapons.-=${weaponId}`]: null
    });
  }

  async _onWeaponImageToggle(event) {
    event.stopPropagation();
    const weaponId = event.currentTarget.dataset.weaponId;
    const useSpecific = event.currentTarget.checked;

    await this.actor.update({
      [`system.armedWeapons.${weaponId}.useSpecificImage`]: useSpecific
    });
  }

  async _onAmmoChange(event) {
    event.preventDefault();
    event.stopPropagation();
    this._saveScrollPosition();
    const weaponId = event.currentTarget.dataset.weaponId;
    const delta = parseInt(event.currentTarget.dataset.delta);
    const weapon = this.actor.system.armedWeapons?.[weaponId];

    if (!weapon?.ammo) return;

    const newCurrent = Math.max(0, Math.min(weapon.ammo.max, weapon.ammo.current + delta));

    await this.actor.update({
      [`system.armedWeapons.${weaponId}.ammo.current`]: newCurrent
    });
  }

  /**
   * Track ammo spent for reload recovery system.
   * @param {string} weaponId - The weapon/attack ID
   * @param {Object} weapon - The weapon/attack data object
   * @param {string} source - 'armed', 'thrown', or 'ranged' (or weapon.type for armed)
   */
  async _trackAmmoSpent(weaponId, weapon, source) {
    const tracker = this.actor.system.reloadTracker;
    if (!tracker?.active) return;

    const reloadType = this._getReloadType(weapon, source);
    const existing = tracker.weapons?.[weaponId] || { name: weapon.name, reloadType, source, spent: 0 };
    existing.spent += 1;
    existing.name = weapon.name;
    existing.reloadType = reloadType;
    existing.source = source;

    await this.actor.update({
      [`system.reloadTracker.weapons.${weaponId}`]: existing
    }, { render: false });
  }

  /**
   * Determine reload type for recovery formula.
   * @param {Object} weapon - The weapon/attack data
   * @param {string} source - 'armed', 'thrown', 'ranged', or weapon type
   * @returns {string} 'thrown', 'bolt', 'sling', or 'arrow'
   */
  _getReloadType(weapon, source) {
    if (weapon.type === 'thrown' || source === 'thrown') return 'thrown';
    const name = (weapon.name || '').toLowerCase();
    if (name.includes('crossbow')) return 'bolt';
    if (name.includes('sling')) return 'sling';
    return 'arrow';
  }

  async _onPoisonToggle(event) {
    event.preventDefault();
    event.stopPropagation();
    this._saveScrollPosition();

    const weaponId = event.currentTarget.dataset.weaponId;
    const weapon = this.actor.system.armedWeapons?.[weaponId];
    if (!weapon) return;

    // Toggle the poisoned state
    const newPoisonedState = !weapon.isPoisoned;
    const weaponName = weapon.name;

    // Build update object
    const updates = {
      [`system.armedWeapons.${weaponId}.isPoisoned`]: newPoisonedState
    };

    // When removing poison, reduce Ichor by 1 (poison is wasted)
    if (!newPoisonedState && weapon.isPoisoned) {
      const inventory = this.actor.system.inventory || {};
      for (const [itemId, item] of Object.entries(inventory)) {
        if (item && item.isPoisonerItem) {
          const currentQty = item.quantity || 0;
          if (currentQty > 0) {
            updates[`system.inventory.${itemId}.quantity`] = currentQty - 1;
            ui.notifications.warn(`Removed poison from ${weaponName} (1 Ichor wasted, ${currentQty - 1} remaining)`);
          }
          break;
        }
      }
    } else if (newPoisonedState) {
      ui.notifications.info(`Applied poison to ${weaponName}`);
    }

    await this.actor.update(updates);
  }

  /**
   * Handle Poisoner icon click from the Arms tab skill stack.
   * If any weapon is poisoned → remove poison from all (waste 1 Ichor each).
   * If no weapon is poisoned → pick a melee weapon to poison (auto if only 1).
   */
  async _onPoisonerIconClick(event) {
    event.preventDefault();
    this._dismissAllTooltips();

    const armedWeapons = this.actor.system.armedWeapons || {};
    const meleeWeapons = Object.entries(armedWeapons).filter(([_, w]) => w.type === 'melee');
    const poisonedWeapons = meleeWeapons.filter(([_, w]) => w.isPoisoned);

    if (poisonedWeapons.length > 0) {
      // REMOVE poison from all poisoned weapons — waste 1 Ichor per weapon
      const updates = {};
      let ichorWasted = 0;

      // Find Ichor item
      const inventory = this.actor.system.inventory || {};
      let ichorId = null;
      let ichorQty = 0;
      for (const [itemId, item] of Object.entries(inventory)) {
        if (item?.isPoisonerItem) {
          ichorId = itemId;
          ichorQty = item.quantity || 0;
          break;
        }
      }

      for (const [weaponId, weapon] of poisonedWeapons) {
        updates[`system.armedWeapons.${weaponId}.isPoisoned`] = false;
        if (ichorId && ichorQty > 0) {
          ichorQty -= 1;
          ichorWasted += 1;
        }
      }

      if (ichorId && ichorWasted > 0) {
        updates[`system.inventory.${ichorId}.quantity`] = ichorQty;
      }

      await this.actor.update(updates);
      const weaponNames = poisonedWeapons.map(([_, w]) => w.name).join(', ');
      ui.notifications.warn(`Cleaned poison from ${weaponNames} (${ichorWasted} Ichor wasted, ${ichorQty} remaining)`);
    } else {
      // APPLY poison — pick a melee weapon
      if (meleeWeapons.length === 0) {
        ui.notifications.warn('No melee weapons equipped to poison.');
        return;
      }

      // Check ichor availability
      const inventory = this.actor.system.inventory || {};
      let hasIchor = false;
      for (const item of Object.values(inventory)) {
        if (item?.isPoisonerItem && (item.quantity || 0) >= 1) {
          hasIchor = true;
          break;
        }
      }
      if (!hasIchor) {
        ui.notifications.warn('No Ichor available!');
        return;
      }

      if (meleeWeapons.length === 1) {
        // Only one melee weapon — apply directly
        const [weaponId, weapon] = meleeWeapons[0];
        await this.actor.update({ [`system.armedWeapons.${weaponId}.isPoisoned`]: true });
        ui.notifications.info(`Applied poison to ${weapon.name}`);
      } else {
        // Multiple melee weapons — show picker dialog
        let dialogContent = '<div class="reload-dialog">';
        for (const [weaponId, weapon] of meleeWeapons) {
          dialogContent += `<div class="reload-weapon-row" style="cursor: pointer; transition: background 0.15s;" data-weapon-id="${weaponId}" data-weapon-name="${weapon.name}">`;
          dialogContent += `<div class="reload-weapon-name">🐍 ${weapon.name}</div>`;
          dialogContent += `</div>`;
        }
        dialogContent += '</div>';

        const sheet = this;
        new Dialog({
          title: 'Apply Poison — Select Weapon',
          content: dialogContent,
          buttons: {},
          render: (html) => {
            html.find('.reload-weapon-row').click(async function() {
              const weaponId = this.dataset.weaponId;
              const weaponName = this.dataset.weaponName;
              await sheet.actor.update({ [`system.armedWeapons.${weaponId}.isPoisoned`]: true });
              ui.notifications.info(`Applied poison to ${weaponName}`);
              // Close the dialog
              html.closest('.dialog').find('.header-button.close').click();
            });
            html.find('.reload-weapon-row').hover(
              function() { $(this).css('background', 'rgba(76, 175, 80, 0.2)'); },
              function() { $(this).css('background', ''); }
            );
          },
          default: null
        }).render(true);
      }
    }
  }

  // ==========================================
  // INVENTORY SYSTEM
  // ==========================================

  async _onAddInventoryItem(event) {
    event.preventDefault();
    this._saveScrollPosition();

    const newId = `item${Date.now()}`;
    const newItem = {
      name: "New Item",
      description: "",
      quantity: 1
    };

    await this.actor.update({
      [`system.inventory.${newId}`]: newItem
    });
  }

  async _onDeleteInventoryItem(event) {
    event.preventDefault();
    event.stopPropagation();
    this._saveScrollPosition();

    const itemId = event.currentTarget.dataset.itemId;
    const item = this.actor.system.inventory?.[itemId];

    // Prevent deletion of Ichor item while Poisoner skill exists
    if (item && item.isPoisonerItem) {
      // Check if character still has Poisoner skill
      const skills = this.actor.system.skills || {};
      const hasPoisoner = Object.values(skills).some(s =>
        s && (s.name || '').toLowerCase() === 'poisoner'
      );
      if (hasPoisoner) {
        ui.notifications.warn("Cannot delete Ichor while you have the Poisoner skill!");
        return;
      }
    }

    // Prevent deletion of Alchemy Gem while character has alchemy access
    if (item && item.isAlchemyGem) {
      const originId = this.actor.system.origin?.id;
      const sorceryAccess = this._getOriginSorceryAccess(originId);
      if (sorceryAccess.includes('alchemy')) {
        ui.notifications.warn("Cannot delete the Radium Gem while you have access to Alchemy!");
        return;
      }
    }

    await this.actor.update({
      [`system.inventory.-=${itemId}`]: null
    });
  }

  async _onInventoryNameChange(event) {
    event.preventDefault();
    this._saveScrollPosition();

    const itemId = event.currentTarget.dataset.itemId;
    const newName = event.currentTarget.value;

    await this.actor.update({
      [`system.inventory.${itemId}.name`]: newName
    });
  }

  async _onInventoryDescChange(event) {
    event.preventDefault();
    this._saveScrollPosition();

    const itemId = event.currentTarget.dataset.itemId;
    const newDesc = event.currentTarget.value;

    await this.actor.update({
      [`system.inventory.${itemId}.description`]: newDesc
    });
  }

  async _onInventoryQtyChange(event) {
    event.preventDefault();
    this._saveScrollPosition();

    const itemId = event.currentTarget.dataset.itemId;
    const newQty = Math.max(0, parseInt(event.currentTarget.value) || 0);
    const item = this.actor.system.inventory?.[itemId];

    // Plunder overflow: if qty > 3, cap at 3 and spill remainder into new slot(s)
    if (item?.plunder && newQty > 3) {
      const inventory = foundry.utils.deepClone(this.actor.system.inventory);
      inventory[itemId].quantity = 3;
      inventory[itemId].plunder = 3;
      let overflow = newQty - 3;

      while (overflow > 0) {
        const adding = Math.min(3, overflow);
        const newId = `item${Date.now()}${Math.random().toString(36).slice(2, 5)}`;
        inventory[newId] = {
          name: 'Plunder',
          description: '',
          quantity: adding,
          plunder: adding
        };
        overflow -= adding;
      }

      await this.actor.update({ 'system.inventory': inventory });
      return;
    }

    const updates = { [`system.inventory.${itemId}.quantity`]: newQty };
    // Keep plunder value in sync with quantity
    if (item?.plunder) {
      updates[`system.inventory.${itemId}.plunder`] = newQty;
    }
    await this.actor.update(updates);
  }

  // ==========================================
  // MOUNT SYSTEM
  // ==========================================

  async _onMountButtonClick(event) {
    event.preventDefault();
    const mount = this.actor.system.mount;
    if (mount?.type) {
      this._showReleaseMountDialog();
    } else {
      this._showMountSelectionDialog();
    }
  }

  // ===== PLUNDER SYSTEM =====

  async _onPlunderButtonClick(event) {
    event.preventDefault();

    // Calculate effective flex die (same logic as _rollFlexDie but NO poison suppression)
    let flexDie = this.actor.system.flex?.die || 'd10';
    const skills = this.actor.system.skills || {};
    let hasImprovedFlex = false;
    let hasImprovedFlexII = false;
    for (const skill of Object.values(skills)) {
      const skillName = skill.name?.toLowerCase() || '';
      if (skillName === 'improved flex') hasImprovedFlex = true;
      if (skillName === 'improved flex ii') hasImprovedFlexII = true;
    }
    if (hasImprovedFlexII) {
      flexDie = 'd6';
    } else if (hasImprovedFlex && flexDie === 'd10') {
      flexDie = 'd8';
    }

    // Roll both dice simultaneously
    const plunderRoll = new Roll('1d8', this.actor.getRollData());
    const flexRoll = new Roll(flexDie, this.actor.getRollData());
    await plunderRoll.evaluate();
    await flexRoll.evaluate();

    const d8Result = plunderRoll.total;
    const flexResult = flexRoll.total;
    const flexMax = { 'd10': 10, 'd8': 8, 'd6': 6, 'd1': 1 }[flexDie];
    const flexTriggered = (flexResult === flexMax);

    // Determine plunder amount from d8
    let basePlunder;
    if (d8Result <= 4) basePlunder = 1;
    else if (d8Result <= 7) basePlunder = 2;
    else basePlunder = 3;

    // Ultra-rare: The Vessel of Claude (1 in 200 per plunder roll)
    let isTreasure = false;
    let treasureValue = 0;
    let treasureData = null;
    const vesselRoll = Math.floor(Math.random() * 200);
    if (vesselRoll === 0) {
      isTreasure = true;
      treasureValue = 10;
      treasureData = {
        name: 'The Vessel of Claude',
        description: 'A seamless orb of unknown metal, warm to the touch and faintly humming. Those who hold it swear they hear whispered answers to questions not yet asked. No smith in the Hyborian Age can identify its make, and sorcerers recoil from its presence — not from malice, but from the unsettling sense that it already knows what they intend. It is worth a king\'s ransom to the right buyer, if such a buyer exists.',
        plunderValue: 10
      };
    } else if (flexTriggered) {
      // Normal flex treasure
      isTreasure = true;
      treasureValue = Math.floor(Math.random() * 3) + 4; // 4, 5, or 6
      treasureData = generateTreasure(treasureValue);
    }

    // Show the plunder dialog
    this._showPlunderDialog({
      d8Result, flexResult, flexDie, flexMax, flexTriggered,
      basePlunder, isTreasure, treasureValue, treasureData
    });

    // Chat message — spell-card pattern with gold plunder theme
    const charName = this.actor.name;
    const tokenImg = this.actor.prototypeToken?.texture?.src || this.actor.img;
    const ownerColor = this._getOwnerColor();

    // Flavor text
    const plunderFlavors = [
      'rifles through the fallen',
      'searches the wreckage',
      'loots the spoils',
      'claims the plunder',
      'picks through the remains',
      'scavenges the battlefield'
    ];
    const flavor = plunderFlavors[Math.floor(Math.random() * plunderFlavors.length)];

    // Build result section
    let resultHTML;
    if (isTreasure) {
      resultHTML = `
        <div class="spell-chat-effect plunder-treasure-effect">
          <em>${charName} ${flavor} and discovers something valuable...</em>
        </div>
        <div class="plunder-treasure-name">${treasureData.name}</div>
        <div class="plunder-result-box plunder-treasure-box">
          <span class="plunder-result-label">Treasure</span>
          <span class="plunder-result-value">${treasureValue}</span>
        </div>
        <div class="plunder-treasure-desc"><em>${treasureData.description}</em></div>`;
    } else {
      resultHTML = `
        <div class="spell-chat-effect">
          <em>${charName} ${flavor}...</em>
        </div>
        <div class="plunder-result-box">
          <span class="plunder-result-value">${basePlunder}</span>
        </div>`;
    }

    const chatContent = `
      <div class="spell-chat-card plunder-chat-card" style="border-color: ${ownerColor};">
        <div class="spell-chat-header">
          <div class="spell-chat-portrait-wrap">
            <img src="${tokenImg}" class="spell-chat-portrait"/>
            <img src="systems/conan/images/icons/plunder_icon.png" class="spell-chat-badge" alt="Plunder"/>
          </div>
          <div class="spell-chat-title"><strong>${charName}</strong> plunders</div>
        </div>
        <div class="spell-chat-body">
          <div class="plunder-dice-row">
            <div class="plunder-die-chip">
              <span class="plunder-die-label">d8</span>
              <span class="plunder-die-val">${d8Result}</span>
            </div>
            <div class="plunder-die-chip ${flexTriggered ? 'plunder-flex-hit' : ''}">
              <span class="plunder-die-label">${flexDie}</span>
              <span class="plunder-die-val">${flexResult}${flexTriggered ? '!' : ''}</span>
            </div>
          </div>
          ${resultHTML}
          <div class="spell-chat-meta">
            <strong>Plunder:</strong> d8 → ${basePlunder}${isTreasure ? ` &nbsp;|&nbsp; <strong style="color: #d4a844;">FLEX → Treasure!</strong>` : ''}
          </div>
        </div>
      </div>`;

    await ChatMessage.create({
      content: chatContent,
      speaker: ChatMessage.getSpeaker({ actor: this.actor })
    });
  }

  _showPlunderDialog({ d8Result, flexResult, flexDie, flexMax, flexTriggered, basePlunder, isTreasure, treasureValue, treasureData }) {
    const sheet = this;
    const actorName = this.actor.name;
    const hasMount = !!this.actor.system.mount?.type;

    // Count current slots (excluding special items like Alchemy Gem)
    const inventory = this.actor.system.inventory || {};
    const currentSlots = Object.values(inventory).filter(item => item && !item.isAlchemyGem).length;
    const willEncumber = currentSlots >= 5;

    // Count saddlebag slots
    const saddlebag = this.actor.system.mount?.saddlebag || {};
    const saddlebagSlots = Object.keys(saddlebag).length;
    const saddlebagFull = saddlebagSlots >= 6;

    // Build dialog content
    let resultHTML;
    if (isTreasure) {
      resultHTML = `
        <div class="plunder-dialog-result plunder-treasure">
          <div class="plunder-dialog-title">Treasure Found!</div>
          <div class="plunder-dialog-value"><strong>${treasureData.name}</strong></div>
          <div class="plunder-dialog-note">Worth ${treasureValue} plunder — takes one inventory slot</div>
        </div>`;
    } else {
      resultHTML = `
        <div class="plunder-dialog-result">
          <div class="plunder-dialog-title">Plunder Found</div>
          <div class="plunder-dialog-value"><strong>${basePlunder}</strong> plunder</div>
        </div>`;
    }

    // Capacity display — show both when mounted
    let capacityHTML = `
      <div class="plunder-dialog-capacity ${willEncumber ? 'plunder-will-encumber' : ''}">
        Pack: ${currentSlots}/5 slots${willEncumber ? ' — <strong>Will Encumber!</strong>' : ''}
      </div>`;
    if (hasMount) {
      capacityHTML += `
        <div class="plunder-dialog-capacity ${saddlebagFull ? 'plunder-will-encumber' : ''}">
          Saddlebag: ${saddlebagSlots}/6 slots${saddlebagFull ? ' — <strong>Full!</strong>' : ''}
        </div>`;
    }

    const content = `
      <div class="plunder-dialog">
        <div class="plunder-dialog-dice">
          <div class="plunder-die-box">
            <span class="plunder-die-label">d8</span>
            <span class="plunder-die-value">${d8Result}</span>
          </div>
          <div class="plunder-die-box ${flexTriggered ? 'plunder-flex-hit' : ''}">
            <span class="plunder-die-label">${flexDie}</span>
            <span class="plunder-die-value">${flexResult}${flexTriggered ? '!' : ''}</span>
          </div>
        </div>
        ${resultHTML}
        ${capacityHTML}
      </div>`;

    // Build buttons — if mounted, offer Pack and Saddlebag separately
    const plunderData = { isTreasure, treasureValue, basePlunder, treasureData };
    let buttons;
    if (hasMount) {
      buttons = {
        pack: {
          label: 'Pack',
          callback: () => { sheet._acceptPlunder(plunderData); }
        },
        saddlebag: {
          label: 'Saddlebag',
          callback: () => { sheet._acceptPlunderToSaddlebag(plunderData); }
        },
        decline: {
          label: 'Walk Away',
          callback: () => {}
        }
      };
    } else {
      buttons = {
        accept: {
          label: isTreasure ? 'Take Treasure' : 'Take Plunder',
          callback: () => { sheet._acceptPlunder(plunderData); }
        },
        decline: {
          label: 'Walk Away',
          callback: () => {}
        }
      };
    }

    new Dialog({
      title: `${actorName} — Plunder`,
      content: content,
      buttons: buttons,
      default: hasMount ? 'pack' : 'accept'
    }, {
      width: 300,
      classes: ['plunder-dialog-window']
    }).render(true);
  }

  async _acceptPlunder({ isTreasure, treasureValue, basePlunder, treasureData }) {
    const inventory = foundry.utils.deepClone(this.actor.system.inventory || {});
    const normalCount = Object.values(inventory).filter(item => item && !item.isAlchemyGem).length;

    if (isTreasure) {
      const newId = foundry.utils.randomID();
      inventory[newId] = {
        name: treasureData.name,
        description: treasureData.description,
        quantity: treasureValue,
        plunder: treasureValue,
        isTreasureItem: true
      };
      if (normalCount + 1 > 5) {
        ui.notifications.warn('You are now Encumbered!');
      }
    } else {
      // Fill partially-filled plunder slots first, then new slots
      let remaining = basePlunder;

      // Top up existing plunder slots
      for (const [id, slot] of Object.entries(inventory)) {
        if (remaining <= 0) break;
        if (slot.plunder && slot.plunder < 3) {
          const canAdd = 3 - slot.plunder;
          const adding = Math.min(canAdd, remaining);
          inventory[id].plunder += adding;
          inventory[id].quantity = inventory[id].plunder;
          remaining -= adding;
        }
      }

      // Fill new slots for remainder
      while (remaining > 0) {
        const adding = Math.min(3, remaining);
        const newId = foundry.utils.randomID();
        const desc = generatePlunderDesc();
        inventory[newId] = {
          name: 'Plunder',
          description: desc,
          quantity: adding,
          plunder: adding
        };
        remaining -= adding;
      }

      const finalCount = Object.values(inventory).filter(item => item && !item.isAlchemyGem).length;
      if (finalCount > 5 && normalCount <= 5) {
        ui.notifications.warn('You are now Encumbered!');
      }
    }

    await this.actor.update({ 'system.inventory': inventory });
  }

  async _acceptPlunderToSaddlebag({ isTreasure, treasureValue, basePlunder, treasureData }) {
    const saddlebag = foundry.utils.deepClone(this.actor.system.mount?.saddlebag || {});
    const currentCount = Object.keys(saddlebag).length;

    if (isTreasure) {
      if (currentCount >= 6) {
        ui.notifications.warn("Saddlebag is full! Treasure lost.");
        return;
      }
      const newId = foundry.utils.randomID();
      saddlebag[newId] = {
        name: treasureData.name,
        description: treasureData.description,
        quantity: treasureValue,
        plunder: treasureValue,
        isTreasureItem: true
      };
    } else {
      let remaining = basePlunder;

      // Top up existing plunder slots in saddlebag
      for (const [id, slot] of Object.entries(saddlebag)) {
        if (remaining <= 0) break;
        if (slot.plunder && slot.plunder < 3) {
          const canAdd = 3 - slot.plunder;
          const adding = Math.min(canAdd, remaining);
          saddlebag[id].plunder += adding;
          saddlebag[id].quantity = saddlebag[id].plunder;
          remaining -= adding;
        }
      }

      // Fill new slots for remainder (hard cap at 6)
      while (remaining > 0 && Object.keys(saddlebag).length < 6) {
        const adding = Math.min(3, remaining);
        const newId = foundry.utils.randomID();
        const desc = generatePlunderDesc();
        saddlebag[newId] = {
          name: 'Plunder',
          description: desc,
          quantity: adding,
          plunder: adding
        };
        remaining -= adding;
      }

      if (remaining > 0) {
        ui.notifications.warn(`Saddlebag full! ${remaining} plunder lost.`);
      }
    }

    await this.actor.update({ 'system.mount.saddlebag': saddlebag });
  }

  _showMountSelectionDialog() {
    const sheet = this;
    const content = `
      <div class="mount-selection-dialog">
        <div class="mount-option mount-option-horse" data-mount-type="horse">
          <img src="systems/conan/images/icons/mounted_icon.png" alt="Horse"/>
          <span class="mount-option-name">Horse</span>
        </div>
        <div class="mount-option mount-option-disabled">
          <img src="systems/conan/images/icons/mounted_icon.png" alt="Camel"/>
          <span class="mount-option-name">Camel</span>
        </div>
        <div class="mount-option mount-option-disabled">
          <img src="systems/conan/images/icons/mounted_icon.png" alt="Beast"/>
          <span class="mount-option-name">Beast</span>
        </div>
        <div class="mount-option mount-option-disabled">
          <img src="systems/conan/images/icons/mounted_icon.png" alt="Bird"/>
          <span class="mount-option-name">Bird</span>
        </div>
      </div>
    `;

    new Dialog({
      title: 'Summon Mount',
      content: content,
      buttons: {},
      render: (html) => {
        html.find('.mount-option-horse').click(async function() {
          const name = HORSE_NAMES[Math.floor(Math.random() * HORSE_NAMES.length)];
          await sheet.actor.update({
            'system.mount.type': 'horse',
            'system.mount.name': name,
            'system.mount.saddlebag': {},
            'system.conditions.mounted': true
          });
          ui.notifications.info(`${name} answers your call!`);
          html.closest('.dialog').find('.header-button.close').click();
        });
      },
      default: null
    }).render(true);
  }

  _showReleaseMountDialog() {
    const sheet = this;
    const mountName = this.actor.system.mount?.name || 'your mount';

    new Dialog({
      title: 'Release Mount',
      content: `<p style="text-align:center; padding:12px;">Release <strong>${mountName}</strong>?<br/><small style="color:#ff6464;">All saddlebag contents will be lost. Life is brutal in the Hyborian Age.</small></p>`,
      buttons: {
        release: {
          label: 'Release',
          callback: async () => {
            // Snapshot mount data for undo
            const mountSnapshot = foundry.utils.deepClone(sheet.actor.system.mount);
            const wasMounted = sheet.actor.system.conditions?.mounted || false;
            const actorId = sheet.actor.id;
            const charName = sheet.actor.name;

            await sheet.actor.update({
              'system.mount.type': null,
              'system.mount.name': '',
              'system.mount.saddlebag': {},
              'system.conditions.mounted': false
            });
            ui.notifications.warn(`${mountName} disappears into the wilds.`);

            // GM-only undo chat message
            const undoId = foundry.utils.randomID();
            game.conan = game.conan || {};
            game.conan.mountUndoData = game.conan.mountUndoData || {};
            game.conan.mountUndoData[undoId] = { actorId, mountSnapshot, wasMounted };

            ChatMessage.create({
              content: `<div class="mount-undo-msg" style="display:flex;align-items:center;gap:8px;padding:4px 6px;">
                <span style="font-size:12px;color:#ccc;"><strong>${charName}</strong> released <strong>${mountName}</strong></span>
                <button class="mount-undo-btn" data-undo-id="${undoId}" style="margin-left:auto;background:none;border:1px solid rgba(255,255,255,0.2);border-radius:4px;color:#ffa;cursor:pointer;padding:2px 6px;font-size:14px;" title="Undo release">&#x21A9;</button>
              </div>`,
              whisper: [game.user.id],
              speaker: { alias: 'Mount Release' }
            });
          }
        },
        cancel: {
          label: 'Cancel'
        }
      },
      default: 'cancel'
    }).render(true);
  }

  // ==========================================
  // PACK DROPDOWN TOGGLES
  // ==========================================

  _onPackDropdownToggle(event) {
    event.preventDefault();
    const header = $(event.currentTarget);
    const section = header.data('section');
    header.toggleClass('open');
    // Track open state for restore after re-render
    if (section === 'inventory') this._inventoryOpen = header.hasClass('open');
    if (section === 'armed') this._armedOpen = header.hasClass('open');
    if (section === 'saddlebag') this._saddlebagOpen = header.hasClass('open');
  }

  // ==========================================
  // PACK DIALOG
  // ==========================================

  async _onPackButtonClick(event) {
    event.preventDefault();
    const tabEquip = this.element.find('.tab-equip');
    if (this._equipView === 'pack') {
      this._equipView = 'scene';
      tabEquip.removeClass('view-pack view-saddlebag view-squander');
    } else {
      this._equipView = 'pack';
      tabEquip.removeClass('view-saddlebag view-squander').addClass('view-pack');
    }
  }

  _showPackDialog() {
    // Close existing pack dialog if open
    if (this._packDialog) {
      try { this._packDialog.close(); } catch(e) {}
      this._packDialog = null;
    }

    const sheet = this;
    const inventory = this.actor.system.inventory || {};
    const armedWeapons = this.actor.system.armedWeapons || {};
    const inventoryCount = Object.values(inventory).filter(item => item && !item.isAlchemyGem).length;

    // Build inventory items HTML
    let inventoryHTML = '';
    for (const [id, item] of Object.entries(inventory)) {
      if (!item) continue;
      const isSpecial = item.isAlchemyGem || item.isPoisonerItem;
      const escapedName = (item.name || '').replace(/"/g, '&quot;');
      const escapedDesc = (item.description || '').replace(/</g, '&lt;').replace(/>/g, '&gt;');
      inventoryHTML += `
        <div class="pack-item-card ${item.isAlchemyGem ? 'alchemy-gem' : ''} ${item.isPoisonerItem ? 'poisoner-item' : ''}" data-item-id="${id}">
          <div class="pack-item-header">
            <input type="text" class="pack-item-name pack-inventory-name" data-item-id="${id}" value="${escapedName}" placeholder="Item name..." ${isSpecial ? 'readonly' : ''}/>
            ${isSpecial
              ? '<span class="pack-item-lock">&#x1F512;</span>'
              : `<button type="button" class="pack-item-delete pack-inventory-delete" data-item-id="${id}" title="Remove">&times;</button>`
            }
          </div>
          <textarea class="pack-item-desc pack-inventory-desc" data-item-id="${id}" placeholder="Description..." ${isSpecial ? 'readonly' : ''}>${escapedDesc}</textarea>
          <div class="pack-item-footer">
            <label class="pack-item-qty">
              <span>Qty:</span>
              <input type="number" class="pack-inventory-qty" data-item-id="${id}" value="${item.quantity || 0}" min="0"/>
            </label>
          </div>
        </div>
      `;
    }

    if (Object.keys(inventory).length === 0) {
      inventoryHTML = '<div class="pack-empty">Pack is empty. Click + to add items.</div>';
    }

    // Build armed weapons display (read-only)
    let weaponsHTML = '';
    for (const [id, weapon] of Object.entries(armedWeapons)) {
      if (!weapon) continue;
      weaponsHTML += `
        <div class="pack-weapon-card">
          <img src="${weapon.image || 'icons/svg/sword.svg'}" class="pack-weapon-img" alt="${weapon.name}"/>
          <div class="pack-weapon-info">
            <span class="pack-weapon-name">${weapon.name}</span>
            <span class="pack-weapon-detail">${weapon.damage || '?'} dmg | ${weapon.range || 'Melee'}</span>
          </div>
        </div>
      `;
    }

    if (Object.keys(armedWeapons).length === 0) {
      weaponsHTML = '<div class="pack-empty">No weapons armed.</div>';
    }

    const content = `
      <div class="pack-dialog">
        <div class="pack-section">
          <div class="pack-section-head">
            <h3>Inventory</h3>
            <span class="pack-counter ${inventoryCount >= 6 ? 'encumbered' : ''}">${inventoryCount}/5</span>
            <button type="button" class="pack-add-btn pack-add-inventory" title="Add Item">+</button>
          </div>
          <div class="pack-items-list">
            ${inventoryHTML}
          </div>
        </div>
        <div class="pack-section pack-weapons-section">
          <div class="pack-section-head">
            <h3>Armed Weapons</h3>
          </div>
          <div class="pack-weapons-list">
            ${weaponsHTML}
          </div>
        </div>
      </div>
    `;

    this._packDialog = new Dialog({
      title: 'Pack',
      content: content,
      buttons: {},
      render: (html) => {
        // Add item
        html.find('.pack-add-inventory').click(async () => {
          const newId = `item${Date.now()}`;
          await sheet.actor.update({
            [`system.inventory.${newId}`]: { name: "New Item", description: "", quantity: 1 }
          });
          sheet._showPackDialog(); // Refresh
        });

        // Delete item
        html.find('.pack-inventory-delete').click(async function(event) {
          event.preventDefault();
          event.stopPropagation();
          const itemId = this.dataset.itemId;
          const item = sheet.actor.system.inventory?.[itemId];

          // Protect Ichor
          if (item?.isPoisonerItem) {
            const skills = sheet.actor.system.skills || {};
            const hasPoisoner = Object.values(skills).some(s => s && (s.name || '').toLowerCase() === 'poisoner');
            if (hasPoisoner) {
              ui.notifications.warn("Cannot delete Ichor while you have the Poisoner skill!");
              return;
            }
          }

          // Protect Alchemy Gem
          if (item?.isAlchemyGem) {
            const originId = sheet.actor.system.origin?.id;
            const sorceryAccess = sheet._getOriginSorceryAccess(originId);
            if (sorceryAccess.includes('alchemy')) {
              ui.notifications.warn("Cannot delete the Radium Gem while you have access to Alchemy!");
              return;
            }
          }

          await sheet.actor.update({ [`system.inventory.-=${itemId}`]: null });
          sheet._showPackDialog(); // Refresh
        });

        // Name change
        html.find('.pack-inventory-name').on('change blur', async function(event) {
          const itemId = this.dataset.itemId;
          const newName = this.value;
          await sheet.actor.update({ [`system.inventory.${itemId}.name`]: newName });
        });

        // Description change
        html.find('.pack-inventory-desc').on('change blur', async function(event) {
          const itemId = this.dataset.itemId;
          const newDesc = this.value;
          await sheet.actor.update({ [`system.inventory.${itemId}.description`]: newDesc });
        });

        // Quantity change
        html.find('.pack-inventory-qty').on('change', async function(event) {
          const itemId = this.dataset.itemId;
          const newQty = Math.max(0, parseInt(this.value) || 0);
          await sheet.actor.update({ [`system.inventory.${itemId}.quantity`]: newQty });
        });
      },
      close: () => { sheet._packDialog = null; },
      default: null
    }, { width: 400, height: 500, resizable: true });

    this._packDialog.render(true);
  }

  // ==========================================
  // SADDLEBAG DIALOG
  // ==========================================

  async _onSaddlebagButtonClick(event) {
    event.preventDefault();
    const tabEquip = this.element.find('.tab-equip');
    if (this._equipView === 'saddlebag') {
      this._equipView = 'scene';
      tabEquip.removeClass('view-pack view-saddlebag view-squander');
    } else {
      this._equipView = 'saddlebag';
      tabEquip.removeClass('view-pack view-squander').addClass('view-saddlebag');
    }
  }

  // ---- Saddlebag CRUD handlers (mirror pack inventory, write to system.mount.saddlebag) ----

  async _onAddSaddlebagItem(event) {
    event.preventDefault();
    this._saveScrollPosition();

    // Hard cap: 6 slots for saddlebag
    const saddlebag = this.actor.system.mount?.saddlebag || {};
    const currentCount = Object.keys(saddlebag).length;
    if (currentCount >= 6) {
      ui.notifications.warn("Saddlebag is full! (6 slots max)");
      return;
    }

    const newId = `item${Date.now()}`;
    await this.actor.update({
      [`system.mount.saddlebag.${newId}`]: { name: "New Item", description: "", quantity: 1 }
    });
  }

  async _onDeleteSaddlebagItem(event) {
    event.preventDefault();
    event.stopPropagation();
    this._saveScrollPosition();

    const itemId = event.currentTarget.dataset.itemId;
    await this.actor.update({
      [`system.mount.saddlebag.-=${itemId}`]: null
    });
  }

  async _onSaddlebagNameChange(event) {
    event.preventDefault();
    this._saveScrollPosition();
    const itemId = event.currentTarget.dataset.itemId;
    await this.actor.update({
      [`system.mount.saddlebag.${itemId}.name`]: event.currentTarget.value
    });
  }

  async _onSaddlebagDescChange(event) {
    event.preventDefault();
    this._saveScrollPosition();
    const itemId = event.currentTarget.dataset.itemId;
    await this.actor.update({
      [`system.mount.saddlebag.${itemId}.description`]: event.currentTarget.value
    });
  }

  async _onSaddlebagQtyChange(event) {
    event.preventDefault();
    this._saveScrollPosition();
    const itemId = event.currentTarget.dataset.itemId;
    const newQty = Math.max(0, parseInt(event.currentTarget.value) || 0);
    const item = this.actor.system.mount?.saddlebag?.[itemId];

    // Plunder overflow in saddlebag: cap at 3, spill into new slots (up to 6 total)
    if (item?.plunder && newQty > 3) {
      const saddlebag = foundry.utils.deepClone(this.actor.system.mount.saddlebag || {});
      saddlebag[itemId].quantity = 3;
      saddlebag[itemId].plunder = 3;
      let overflow = newQty - 3;

      while (overflow > 0 && Object.keys(saddlebag).length < 6) {
        const adding = Math.min(3, overflow);
        const newId = `item${Date.now()}${Math.random().toString(36).slice(2, 5)}`;
        saddlebag[newId] = { name: 'Plunder', description: '', quantity: adding, plunder: adding };
        overflow -= adding;
      }
      if (overflow > 0) {
        ui.notifications.warn(`Saddlebag full! ${overflow} plunder lost.`);
      }
      await this.actor.update({ 'system.mount.saddlebag': saddlebag });
    } else {
      const updates = { [`system.mount.saddlebag.${itemId}.quantity`]: newQty };
      if (item?.plunder) updates[`system.mount.saddlebag.${itemId}.plunder`] = newQty;
      await this.actor.update(updates);
    }
  }

  // ==========================================
  // PLUNDER SPEND / ADD (+/- buttons)
  // ==========================================

  async _onSpendPlunder(source, event) {
    event.preventDefault();
    const isPack = source === 'pack';
    const container = isPack
      ? foundry.utils.deepClone(this.actor.system.inventory || {})
      : foundry.utils.deepClone(this.actor.system.mount?.saddlebag || {});

    // Find plunder slots (regular first, then treasure), sorted lowest qty first
    const plunderSlots = Object.entries(container)
      .filter(([, item]) => item && item.plunder && !item.isTreasureItem)
      .sort((a, b) => a[1].quantity - b[1].quantity);
    const treasureSlots = Object.entries(container)
      .filter(([, item]) => item && item.plunder && item.isTreasureItem)
      .sort((a, b) => a[1].quantity - b[1].quantity);
    const allPlunder = [...plunderSlots, ...treasureSlots];

    if (allPlunder.length === 0) {
      ui.notifications.warn('No plunder to spend!');
      return;
    }

    // Spend from the first (lowest qty regular plunder) slot
    const [targetId, targetItem] = allPlunder[0];
    const path = isPack ? 'system.inventory' : 'system.mount.saddlebag';
    if (targetItem.quantity <= 1) {
      // Remove the slot entirely — Foundry needs `-=key` to delete nested properties
      await this.actor.update({ [`${path}.-=${targetId}`]: null });
    } else {
      container[targetId].quantity -= 1;
      container[targetId].plunder = container[targetId].quantity;
      await this.actor.update({ [path]: container });
    }
  }

  async _onAddPlunder(source, event) {
    event.preventDefault();
    const isPack = source === 'pack';
    const container = isPack
      ? foundry.utils.deepClone(this.actor.system.inventory || {})
      : foundry.utils.deepClone(this.actor.system.mount?.saddlebag || {});

    // Try to top up an existing non-full plunder slot (regular, not treasure)
    const plunderSlots = Object.entries(container)
      .filter(([, item]) => item && item.plunder && !item.isTreasureItem && item.quantity < 3);

    if (plunderSlots.length > 0) {
      const [targetId] = plunderSlots[0];
      container[targetId].quantity += 1;
      container[targetId].plunder = container[targetId].quantity;
    } else {
      // Check slot cap for saddlebag
      if (!isPack && Object.keys(container).length >= 6) {
        ui.notifications.warn('Saddlebag is full!');
        return;
      }
      // Create a new plunder slot
      const newId = foundry.utils.randomID();
      const desc = generatePlunderDesc();
      container[newId] = { name: 'Plunder', description: desc, quantity: 1, plunder: 1 };
    }

    const path = isPack ? 'system.inventory' : 'system.mount.saddlebag';
    await this.actor.update({ [path]: container });
  }

  // ==========================================
  // SQUANDER SYSTEM
  // ==========================================

  /**
   * Count total plunder across pack and saddlebag
   */
  _getSquanderPlunderInfo() {
    const inventory = this.actor.system.inventory || {};
    const saddlebag = this.actor.system.mount?.saddlebag || {};

    let totalPlunder = 0;
    let hasTreasure = false;
    let firstTreasureValue = 0;

    for (const item of Object.values(inventory)) {
      if (item && item.plunder) {
        totalPlunder += (item.quantity || item.plunder || 0);
        if (item.isTreasureItem && !hasTreasure) {
          hasTreasure = true;
          firstTreasureValue = item.quantity || item.plunder || 0;
        }
      }
    }
    for (const item of Object.values(saddlebag)) {
      if (item && item.plunder) {
        totalPlunder += (item.quantity || item.plunder || 0);
        if (item.isTreasureItem && !hasTreasure) {
          hasTreasure = true;
          firstTreasureValue = item.quantity || item.plunder || 0;
        }
      }
    }

    return { totalPlunder, hasTreasure, firstTreasureValue };
  }

  /**
   * Calculate tier from plunder spent
   */
  _getSquanderTier(plunderSpent) {
    let cumulative = 0;
    let tier = -1;
    for (let i = 0; i < SQUANDER_TIER_COSTS.length; i++) {
      cumulative += SQUANDER_TIER_COSTS[i];
      if (plunderSpent >= cumulative) {
        tier = i;
      } else {
        break;
      }
    }
    return Math.max(0, tier);
  }

  /**
   * Get XP from result number using bands
   */
  _getSquanderXP(resultNumber) {
    for (const band of SQUANDER_XP_BANDS) {
      if (resultNumber >= band.min && resultNumber <= band.max) return band.xp;
    }
    return 4; // 18+ catches everything above
  }

  /**
   * Get table entry for a given origin, side, and roll result
   */
  _getSquanderEntry(originId, side, rollResult) {
    const table = SQUANDER_TABLES[originId];
    if (!table) return SQUANDER_TABLES['from-the-hills'][side][0];

    const entries = table[side];
    // Index mapping: roll 1-3 = index 0, roll 4 = index 1, roll 5 = index 2, ... roll 20 = index 17
    let index;
    if (rollResult <= 3) {
      index = 0;
    } else {
      index = Math.min(rollResult - 3, entries.length - 1);
    }
    return entries[index];
  }

  /**
   * Add XP to the actor
   */
  async _addSquanderXP(amount) {
    const xpData = [...(this.actor.system.xp?.available || [])];
    for (let i = 0; i < amount; i++) {
      const idx = xpData.findIndex(v => v !== true);
      if (idx >= 0) {
        xpData[idx] = true;
      } else if (xpData.length < 20) {
        xpData.push(true);
      }
    }
    await this.actor.update({ 'system.xp.available': xpData });
  }

  /**
   * Drain plunder from inventory (pack first, then saddlebag)
   */
  async _drainPlunder(amount, includeTreasure) {
    const inventory = foundry.utils.deepClone(this.actor.system.inventory || {});
    const saddlebag = foundry.utils.deepClone(this.actor.system.mount?.saddlebag || {});

    let remaining = amount;

    // Helper to drain from a container
    const drainFrom = (container) => {
      // Regular plunder first (sorted lowest qty first)
      const regularSlots = Object.entries(container)
        .filter(([, item]) => item && item.plunder && !item.isTreasureItem)
        .sort((a, b) => a[1].quantity - b[1].quantity);

      for (const [id, item] of regularSlots) {
        if (remaining <= 0) break;
        const canTake = Math.min(remaining, item.quantity);
        item.quantity -= canTake;
        item.plunder = item.quantity;
        remaining -= canTake;
        if (item.quantity <= 0) {
          delete container[id];
        }
      }

      // Then treasure slots if still needed
      if (remaining > 0) {
        const treasureSlots = Object.entries(container)
          .filter(([, item]) => item && item.plunder && item.isTreasureItem)
          .sort((a, b) => a[1].quantity - b[1].quantity);

        for (const [id, item] of treasureSlots) {
          if (remaining <= 0) break;
          const canTake = Math.min(remaining, item.quantity);
          item.quantity -= canTake;
          item.plunder = item.quantity;
          remaining -= canTake;
          if (item.quantity <= 0) {
            delete container[id];
          }
        }
      }
    };

    // Drain from pack first, then saddlebag
    drainFrom(inventory);
    if (remaining > 0) drainFrom(saddlebag);

    // Remove one treasure item if requested
    if (includeTreasure) {
      let treasureRemoved = false;
      // Try pack first
      for (const [id, item] of Object.entries(inventory)) {
        if (item && item.isTreasureItem && !treasureRemoved) {
          delete inventory[id];
          treasureRemoved = true;
          break;
        }
      }
      // Then saddlebag
      if (!treasureRemoved) {
        for (const [id, item] of Object.entries(saddlebag)) {
          if (item && item.isTreasureItem) {
            delete saddlebag[id];
            break;
          }
        }
      }
    }

    // Build update — use Foundry's delete syntax for removed keys
    const updateData = {};

    // Rebuild inventory: delete removed keys, update remaining
    const origInventory = this.actor.system.inventory || {};
    for (const id of Object.keys(origInventory)) {
      if (!inventory[id]) {
        updateData[`system.inventory.-=${id}`] = null;
      }
    }
    for (const [id, item] of Object.entries(inventory)) {
      if (origInventory[id]) {
        updateData[`system.inventory.${id}.quantity`] = item.quantity;
        updateData[`system.inventory.${id}.plunder`] = item.plunder;
      }
    }

    // Rebuild saddlebag
    const origSaddlebag = this.actor.system.mount?.saddlebag || {};
    for (const id of Object.keys(origSaddlebag)) {
      if (!saddlebag[id]) {
        updateData[`system.mount.saddlebag.-=${id}`] = null;
      }
    }
    for (const [id, item] of Object.entries(saddlebag)) {
      if (origSaddlebag[id]) {
        updateData[`system.mount.saddlebag.${id}.quantity`] = item.quantity;
        updateData[`system.mount.saddlebag.${id}.plunder`] = item.plunder;
      }
    }

    if (Object.keys(updateData).length > 0) {
      await this.actor.update(updateData);
    }
  }

  /**
   * Squander button click — toggle the squander overlay (like pack/saddlebag)
   */
  _onSquanderButtonClick(event) {
    event.preventDefault();
    const tabEquip = this.element.find('.tab-equip');
    if (this._equipView === 'squander') {
      this._equipView = 'scene';
      tabEquip.removeClass('view-pack view-saddlebag view-squander');
    } else {
      const { totalPlunder } = this._getSquanderPlunderInfo();
      if (totalPlunder < 3) {
        ui.notifications.warn('Not enough plunder to squander! (minimum 3)');
        return;
      }
      this._equipView = 'squander';
      this._squanderAmount = Math.min(totalPlunder, 3);
      this._squanderTreasure = false;
      tabEquip.removeClass('view-pack view-saddlebag').addClass('view-squander');
    }
  }

  /**
   * Update the squander overlay's dynamic values (amount, tier) without re-rendering
   */
  _updateSquanderOverlay(overlay) {
    overlay.find('.squander-dialog-value').text(this._squanderAmount);
    const tier = Math.min(this._getSquanderTier(this._squanderAmount), 5);
    const tierText = `Tier ${tier} (d20+${tier})${this._squanderTreasure ? ' +1 XP' : ''}`;
    overlay.find('.squander-dialog-tier').text(tierText);
  }

  /**
   * Execute the squander roll, flex choice, XP award, and chat message
   */
  async _executeSquander(originId, squanderName, plunderAmount, includeTreasure) {
    const sheet = this;

    // 1. Calculate tier (treasure bumps XP after roll, not tier)
    const baseTier = this._getSquanderTier(plunderAmount);
    let tier = Math.min(baseTier, 5);
    const squandered = plunderAmount % 3;

    // 2. Drain plunder from inventory
    await this._drainPlunder(plunderAmount, includeTreasure);

    // 3. Randomize table side
    let side = Math.random() < 0.5 ? 'glory' : 'chaos';

    // 4. Roll d20
    const d20Roll = new Roll('1d20', this.actor.getRollData());
    await d20Roll.evaluate();
    const d20Result = d20Roll.total;

    // 5. Roll flex die
    let flexDie = this.actor.system.flex?.die || 'd10';
    const skills = this.actor.system.skills || {};
    let hasImprovedFlex = false;
    let hasImprovedFlexII = false;
    for (const skill of Object.values(skills)) {
      const skillName = skill.name?.toLowerCase() || '';
      if (skillName === 'improved flex') hasImprovedFlex = true;
      if (skillName === 'improved flex ii') hasImprovedFlexII = true;
    }
    if (hasImprovedFlexII) {
      flexDie = 'd6';
    } else if (hasImprovedFlex && flexDie === 'd10') {
      flexDie = 'd8';
    }
    const flexRoll = new Roll(flexDie, this.actor.getRollData());
    await flexRoll.evaluate();
    const flexResult = flexRoll.total;
    const flexMax = { 'd10': 10, 'd8': 8, 'd6': 6, 'd1': 1 }[flexDie] || 10;
    const flexTriggered = flexResult === flexMax;

    // 6. Flex: if triggered, post choice card to chat and return
    if (flexTriggered) {
      const tokenImg = this.actor.prototypeToken?.texture?.src || this.actor.img;
      const flexChoiceData = {
        actorId: this.actor.id,
        rollType: 'squander',
        originId, squanderName, side, d20Result, tier,
        plunderAmount, squandered, includeTreasure,
        flexDie, flexResult, flexMax
      };
      const flexCardContent = this._buildFlexChoiceCard('squander', { die: flexDie, result: flexResult }, flexChoiceData, tokenImg, '');
      await ChatMessage.create({
        speaker: ChatMessage.getSpeaker({ actor: this.actor }),
        content: flexCardContent,
        rolls: [d20Roll, flexRoll]
      });
      return; // conan.js handler finishes the squander on button click
    }

    // 7. Calculate final result (no flex)
    const finalTier = Math.min(tier, 5);
    const resultNumber = Math.min(d20Result + finalTier, 25); // cap display but XP bands handle 18+
    const clampedResult = Math.max(1, resultNumber);

    // 8. Get XP and table entry (treasure bumps XP +1 after lookup)
    let xpEarned = this._getSquanderXP(clampedResult);
    if (includeTreasure) xpEarned = Math.min(xpEarned + 1, 4);
    const entry = this._getSquanderEntry(originId, side, clampedResult);

    // 9. Add XP
    await this._addSquanderXP(xpEarned);

    // 9b. Generate and award treasure if boons include it
    let treasureReward = null;
    if (entry.boons && entry.boons.toLowerCase().includes('treasure')) {
      const treasureValue = Math.floor(Math.random() * 3) + 4; // 4-6 like flex treasures
      treasureReward = generateTreasure(treasureValue);
      await this._acceptPlunder({ isTreasure: true, treasureValue, basePlunder: 0, treasureData: treasureReward });
    }

    // 10. Build and send chat message
    const tokenImg = this.actor.prototypeToken?.texture?.src || this.actor.img;
    const charName = this.actor.name;
    const sideLabel = side === 'glory' ? 'Glory' : 'Chaos';
    const sideBadgeClass = side === 'glory' ? 'squander-side-glory' : 'squander-side-chaos';
    const flexClass = '';
    const flexBumpNote = '';
    const flexSideNote = '';

    let chatContent = `
      <div class="spell-chat-card squander-chat-card">
        <div class="spell-chat-header">
          <div class="spell-chat-portrait-wrap">
            <img src="${tokenImg}" class="spell-chat-portrait"/>
          </div>
          <div class="spell-chat-title">
            <strong>${charName}</strong> goes on a <em>${squanderName}</em>
          </div>
        </div>
        <div class="spell-chat-body">
          <div style="text-align: center;">
            <span class="squander-side-badge ${sideBadgeClass}">${sideLabel}</span>
          </div>
          <div class="squander-dice-row">
            <div class="squander-die-chip">
              <span class="squander-die-label">d20</span>
              <span class="squander-die-val">${d20Result}</span>
            </div>
            <div class="squander-die-chip">
              <span class="squander-die-label">Tier</span>
              <span class="squander-die-val">+${finalTier}${flexBumpNote}</span>
            </div>
            <div class="squander-die-chip ${flexClass}">
              <span class="squander-die-label">${flexDie}</span>
              <span class="squander-die-val">${flexResult}${flexTriggered ? '!' : ''}</span>
            </div>
          </div>
          <div class="squander-result-title">${entry.title}</div>
          <div class="squander-result-text">${entry.text}</div>
          <div class="squander-xp-award">+${xpEarned} XP</div>`;

    if (entry.boons) {
      chatContent += `<div class="squander-boons">${entry.boons}</div>`;
    }

    if (treasureReward) {
      chatContent += `
          <div class="squander-treasure-reward">
            <div class="plunder-treasure-name">${treasureReward.name}</div>
            <div class="plunder-treasure-desc">${treasureReward.description}</div>
          </div>`;
    }

    chatContent += `
          <div class="squander-plunder-info">
            ${plunderAmount} plunder spent${squandered > 0 ? ` (${squandered} squandered)` : ''}${includeTreasure ? ' + 1 treasure' : ''}${flexSideNote}
          </div>
        </div>
      </div>`;

    await ChatMessage.create({
      content: chatContent,
      speaker: ChatMessage.getSpeaker({ actor: this.actor }),
      rolls: [d20Roll, flexRoll]
    });
  }

  /**
   * Finish a squander roll after flex choice is made (called from conan.js chat handler)
   */
  async _finishSquander(choice, flexData) {
    const { originId, squanderName, d20Result, plunderAmount, squandered, includeTreasure, flexDie, flexResult, flexMax } = flexData;
    let { side, tier } = flexData;

    // Apply flex choice
    if (choice === 'squanderTier') {
      tier = Math.min(tier + 1, 5);
    } else if (choice === 'squanderGlory') {
      side = 'glory';
    } else if (choice === 'squanderChaos') {
      side = 'chaos';
    }

    const finalTier = Math.min(tier, 5);
    const resultNumber = Math.min(d20Result + finalTier, 25);
    const clampedResult = Math.max(1, resultNumber);
    let xpEarned = this._getSquanderXP(clampedResult);
    if (includeTreasure) xpEarned = Math.min(xpEarned + 1, 4);
    const entry = this._getSquanderEntry(originId, side, clampedResult);

    await this._addSquanderXP(xpEarned);

    let treasureReward = null;
    if (entry.boons && entry.boons.toLowerCase().includes('treasure')) {
      const treasureValue = Math.floor(Math.random() * 3) + 4;
      treasureReward = generateTreasure(treasureValue);
      await this._acceptPlunder({ isTreasure: true, treasureValue, basePlunder: 0, treasureData: treasureReward });
    }

    const tokenImg = this.actor.prototypeToken?.texture?.src || this.actor.img;
    const charName = this.actor.name;
    const sideLabel = side === 'glory' ? 'Glory' : 'Chaos';
    const sideBadgeClass = side === 'glory' ? 'squander-side-glory' : 'squander-side-chaos';
    const flexBumpNote = choice === 'squanderTier' ? ' (+1 bump)' : '';
    const flexSideNote = (choice === 'squanderGlory' || choice === 'squanderChaos') ? ' (side chosen)' : '';

    let chatContent = `
      <div class="spell-chat-card squander-chat-card">
        <div class="spell-chat-header">
          <div class="spell-chat-portrait-wrap">
            <img src="${tokenImg}" class="spell-chat-portrait"/>
          </div>
          <div class="spell-chat-title">
            <strong>${charName}</strong> goes on a <em>${squanderName}</em>
          </div>
        </div>
        <div class="spell-chat-body">
          <div style="text-align: center;">
            <span class="squander-side-badge ${sideBadgeClass}">${sideLabel}</span>
          </div>
          <div class="squander-dice-row">
            <div class="squander-die-chip">
              <span class="squander-die-label">d20</span>
              <span class="squander-die-val">${d20Result}</span>
            </div>
            <div class="squander-die-chip">
              <span class="squander-die-label">Tier</span>
              <span class="squander-die-val">+${finalTier}${flexBumpNote}</span>
            </div>
            <div class="squander-die-chip squander-flex-hit">
              <span class="squander-die-label">${flexDie}</span>
              <span class="squander-die-val">${flexResult}!</span>
            </div>
          </div>
          <div class="squander-result-title">${entry.title}</div>
          <div class="squander-result-text">${entry.text}</div>
          <div class="squander-xp-award">+${xpEarned} XP</div>`;

    if (entry.boons) {
      chatContent += `<div class="squander-boons">${entry.boons}</div>`;
    }

    if (treasureReward) {
      chatContent += `
          <div class="squander-treasure-reward">
            <div class="plunder-treasure-name">${treasureReward.name}</div>
            <div class="plunder-treasure-desc">${treasureReward.description}</div>
          </div>`;
    }

    chatContent += `
          <div class="squander-plunder-info">
            ${plunderAmount} plunder spent${squandered > 0 ? ` (${squandered} squandered)` : ''}${includeTreasure ? ' + 1 treasure' : ''}${flexSideNote}
          </div>
        </div>
      </div>`;

    await ChatMessage.create({
      content: chatContent,
      speaker: ChatMessage.getSpeaker({ actor: this.actor })
    });
  }

  // ==========================================
  // JOURNAL SYSTEM
  // ==========================================

  async _onJournalPageSelect(event) {
    event.preventDefault();
    const pageData = event.currentTarget.dataset.page;

    // Handle special "badges" page or numeric pages
    const pageValue = pageData === "badges" ? "badges" : parseInt(pageData);

    await this.actor.update({
      "system.journal.activePage": pageValue
    });
  }

  async _onAddJournalPage(event) {
    event.preventDefault();
    const pages = this.actor.system.journal?.pages || {};
    const pageNums = Object.keys(pages).map(n => parseInt(n));
    const newPageNum = pageNums.length > 0 ? Math.max(...pageNums) + 1 : 1;

    await this.actor.update({
      [`system.journal.pages.${newPageNum}`]: { subject: "", content: "" },
      "system.journal.activePage": newPageNum
    });
  }

  async _onDeleteJournalPage(event) {
    event.preventDefault();
    const pageNum = parseInt(event.currentTarget.dataset.page);
    const pages = this.actor.system.journal?.pages || {};
    const pageNums = Object.keys(pages).map(n => parseInt(n)).sort((a, b) => a - b);

    // Don't delete if only one page
    if (pageNums.length <= 1) return;

    // Find next page to switch to
    const currentIndex = pageNums.indexOf(pageNum);
    let newActivePage;
    if (currentIndex > 0) {
      newActivePage = pageNums[currentIndex - 1];
    } else {
      newActivePage = pageNums[currentIndex + 1];
    }

    await this.actor.update({
      [`system.journal.pages.-=${pageNum}`]: null,
      "system.journal.activePage": newActivePage
    });
  }

  async _onJournalPageContentChange(event) {
    event.preventDefault();
    const pageNum = this.actor.system.journal?.activePage || 1;
    const newContent = event.currentTarget.value;

    await this.actor.update({
      [`system.journal.pages.${pageNum}.content`]: newContent
    });
  }

  async _onJournalSubjectChange(event) {
    event.preventDefault();
    const pageNum = this.actor.system.journal?.activePage || 1;
    const newSubject = event.currentTarget.value;

    await this.actor.update({
      [`system.journal.pages.${pageNum}.subject`]: newSubject
    });
  }

  async _onRollWeaponAttack(event) {
    event.preventDefault();

    // Remove title attribute to prevent browser native tooltip from orphaning
    const clickedEl = event.currentTarget;
    if (clickedEl.hasAttribute('title')) {
      clickedEl.removeAttribute('title');
    }
    clickedEl.blur();

    // Dismiss any active tooltip before sheet re-renders
    this._dismissAllTooltips();

    const weaponId = event.currentTarget.dataset.weaponId;
    const weapon = this.actor.system.armedWeapons?.[weaponId];

    if (!weapon) return;

    // Check ammo for thrown/ranged
    if (weapon.ammo) {
      if (weapon.ammo.current <= 0) {
        ui.notifications.warn(`${weapon.name}: Out of ammo!`);
        return;
      }
      // Decrease ammo
      await this.actor.update({
        [`system.armedWeapons.${weaponId}.ammo.current`]: weapon.ammo.current - 1
      });
      // Track spent ammo for reload recovery
      await this._trackAmmoSpent(weaponId, weapon, weapon.type || 'armed');
    }

    // Execute the attack
    await this._executeWeaponAttack(weaponId, weapon);
  }

  /**
   * Execute the actual weapon attack roll
   * @param {string} weaponId - The weapon ID
   * @param {Object} weapon - The weapon data
   * @param {Object} options - Optional parameters (isReroll, etc.)
   */
  async _executeWeaponAttack(weaponId, weapon, options = {}) {
    const { isReroll = false } = options;

    // Store this attack for potential Pantherish reroll (only if not already a reroll)
    if (!isReroll) {
      this._lastRollData = this._lastRollData || {};
      this._lastRollData.attack = { weaponId, weapon: { ...weapon } };
    }

    // Get origin bonuses
    const originBonuses = this._getActiveOriginBonuses();

    // Get mounted combat modifiers
    const mountedMods = this._getMountedCombatModifiers();

    // Check for Assassin skill (uses Edge for attack with 1H Light/Medium melee weapons)
    const hasAssassin = this._hasAssassin();

    // Check for Waterfront Fists (makes unarmed count as Light, One-Handed)
    const hasWaterfrontFists = this._hasWaterfrontFists();
    const isUnarmed = weapon.name === "Unarmed" || weapon.category === "Unarmed";
    const isUpgradedUnarmed = isUnarmed && hasWaterfrontFists;

    // Assassin skill: 1H Light or Medium melee uses Edge for attack
    // Waterfront Fists makes unarmed count as Light, One-Handed, so Assassin applies
    const assassinApplies = hasAssassin &&
                            weapon.type === 'melee' &&
                            (weapon.category === 'One-Handed Light' || weapon.category === 'One-Handed Medium' || isUpgradedUnarmed);

    // Determine stats based on weapon type (Assassin overrides melee attack stat)
    const attackStat = assassinApplies ? 'edge' : (weapon.type === 'melee' ? 'might' : 'edge');
    const damageStat = weapon.type === 'ranged' ? null : 'might';

    const attackAttr = this.actor.system.attributes[attackStat];
    let attackBonus = originBonuses.attacks?.[attackStat] || 0;

    // Check for Unseen Strike (pre-activated for surprise attack)
    const unseenStrikeActive = this.actor.system.unseenStrikeActive || false;
    let unseenStrikeBonus = { attack: 0, damage: 0, indicator: null };
    if (unseenStrikeActive) {
      unseenStrikeBonus = { attack: 2, damage: 1, indicator: '🗡️ SURPRISE ATTACK!' };
      // Clear the flag - it's consumed on this attack
      await this.actor.update({ 'system.unseenStrikeActive': false });
    }

    // Check for Leader of Men buff (received from another character)
    const leaderOfMenBuff = this.actor.system.leaderOfMenBuff || null;
    let leaderOfMenBonus = 0;
    if (leaderOfMenBuff && leaderOfMenBuff.bonus) {
      leaderOfMenBonus = leaderOfMenBuff.bonus; // +1 to attacks
    }

    // Captured Soul (+2 to next attack when primed, then consumed)
    const attackSoulPrimed = this.actor.system.capturedSoulState === 'primed';
    let attackSoulBonus = attackSoulPrimed ? 2 : 0;
    if (attackSoulPrimed) {
      this.actor.update({ 'system.capturedSoulState': null });
    }

    // Calculate mounted modifiers for both target types
    let vsNonMountedMod = 0;
    let vsMountedMod = 0;
    if (mountedMods.isMounted) {
      if (weapon.type === 'melee') {
        vsNonMountedMod = mountedMods.meleeVsNonMounted;
        vsMountedMod = mountedMods.meleeVsMounted;
      } else {
        vsNonMountedMod = mountedMods.rangedVsNonMounted;
        vsMountedMod = mountedMods.rangedVsMounted;
      }
    }

    // Build base attack formula (without mounted modifier)
    // Use effective die AND value that accounts for skill upgrades (Mighty/Sharpness, Legendary, etc.)
    const { die: effectiveAttackDie, value: effectiveAttackValue } = this._getEffectiveStatValues(attackStat);
    let baseAttackFormula = `1${effectiveAttackDie} + ${effectiveAttackValue}`;
    if (attackBonus > 0) baseAttackFormula += ` + ${attackBonus}`;

    // Add Unseen Strike attack bonus (+2)
    if (unseenStrikeBonus.attack > 0) baseAttackFormula += ` + ${unseenStrikeBonus.attack}`;

    // Add Leader of Men buff bonus (+1)
    if (leaderOfMenBonus > 0) baseAttackFormula += ` + ${leaderOfMenBonus}`;

    // Add Captured Soul attack bonus (+2)
    if (attackSoulBonus > 0) baseAttackFormula += ` + ${attackSoulBonus}`;

    // Poison: checksDown — silent -1 penalty to attacks
    const poisonEffects = this.actor.getFlag('conan', 'poisonEffects');
    const poisonPenalty = (poisonEffects?.active && poisonEffects.effects?.checksDown) ? -1 : 0;
    if (poisonPenalty !== 0) baseAttackFormula += ` - 1`;

    // Hex: -1 per stack to attacks (from witch Hex trait)
    const hexDebuff = this.actor.getFlag('conan', 'hexDebuff');
    const hexPenalty = hexDebuff?.stacks || 0;
    if (hexPenalty > 0) baseAttackFormula += ` - ${hexPenalty}`;

    // Lotus Dust: -1 per stack to attacks (from Silk Viper lotusdust trait)
    const lotusDustDebuff = this.actor.getFlag('conan', 'lotusDustDebuff');
    const lotusDustPenalty = lotusDustDebuff?.stacks || 0;
    if (lotusDustPenalty > 0) baseAttackFormula += ` - ${lotusDustPenalty}`;

    // Roll the base attack once (same dice result for both target types)
    const attackRoll = new Roll(baseAttackFormula, this.actor.getRollData());
    await attackRoll.evaluate();

    // Get Winds of Fate modifier
    const windsOfFate = WindsOfFateDialog.getValueForActor(this.actor);

    // Get the dice result to use for both calculations
    const dieResult = attackRoll.terms[0]?.total || 0;

    // Calculate totals for different target types using same dice result (including Winds of Fate)
    const vsNonMountedTotal = attackRoll.total + vsNonMountedMod + windsOfFate;
    const vsMountedTotal = attackRoll.total + vsMountedMod + windsOfFate;

    const attackFlexType = weapon.type === 'melee' ? 'melee_hit' : 'ranged_hit';
    const attackFlexData = await this._rollFlexDie(attackFlexType, true); // Suppress auto-celebration
    const cruelFate = this._checkCruelFate(attackRoll);

    // Glamour blind check — attacks auto-miss unless flex saves them
    const glamourBlind = this.actor.system.conditions?.blinded && this.actor.getFlag('conan', 'glamourDebuff')?.active;

    // Store damage info for button (damage rolled separately)
    const damageBonus = originBonuses.damage?.[weapon.type] || 0;

    // Build chat message
    const typeLabel = weapon.type.charAt(0).toUpperCase() + weapon.type.slice(1);
    const tokenImg = this.actor.prototypeToken?.texture?.src || this.actor.img || 'icons/svg/mystery-man.svg';
    const ownerColor = this._getOwnerColor();

    let content = `<div class="conan-roll" style="border-color: ${ownerColor};">`;
    content += `<div class="roll-header">`;
    content += `<img src="${tokenImg}" class="token-img" alt="${this.actor.name}">`;
    content += `<div class="roll-title">${weapon.name} Attack</div>`;
    content += `</div>`;

    if (cruelFate) {
      content += `<div class="cruel-fate-indicator">Cruel Fate</div>`;
    }

    // Add Pantherish reroll indicator
    if (isReroll) {
      content += `<div class="reroll-indicator" style="display: flex; align-items: center; justify-content: center; gap: 6px; padding: 4px 8px; background: rgba(50,205,50,0.2); border-radius: 4px; margin-bottom: 6px;">`;
      content += `<img src="systems/conan/images/icons/pantherish_i_icon.png" style="width: 20px; height: 20px;" alt="Pantherish"/>`;
      content += `<span style="color: #32CD32; font-weight: bold;">PANTHERISH REROLL</span>`;
      content += `</div>`;
    }

    // Build attack skill icons array
    const attackSkillIcons = [];
    if (assassinApplies) {
      attackSkillIcons.push({ icon: 'systems/conan/images/icons/assassin_i_icon.png', title: 'Assassin (Edge Attack)' });
    }
    if (unseenStrikeBonus.attack > 0) {
      attackSkillIcons.push({ icon: 'systems/conan/images/icons/unseen_strike_i_icon.png', title: 'Unseen Strike (+2 Attack)' });
    }
    if (leaderOfMenBonus > 0) {
      attackSkillIcons.push({ icon: 'systems/conan/images/icons/leader_of_men_i_icon.png', title: `Inspired by ${leaderOfMenBuff.leaderName} (+1 Attack)` });
    }
    if (windsOfFate !== 0) {
      attackSkillIcons.push({ icon: 'systems/conan/images/icons/winds_of_fate_icon.png', title: `Winds of Fate (${windsOfFate > 0 ? '+' : ''}${windsOfFate})` });
    }
    if (attackSoulBonus > 0) {
      attackSkillIcons.push({ icon: 'systems/conan/images/icons/capture_soul_icon.png', title: 'Captured Soul (+2 Attack)' });
    }

    if (weapon.ammo) {
      content += `<div class="ammo-info"><strong>Ammo:</strong> ${weapon.ammo.current}/${weapon.ammo.max}</div>`;
    }

    // Build attack breakdown data
    const attackDieRoll = attackRoll.terms[0]?.total || 0;
    const attackBreakdownLines = [];
    attackBreakdownLines.push({ label: `${attackStat.charAt(0).toUpperCase() + attackStat.slice(1)} Die`, value: effectiveAttackDie, roll: attackDieRoll });
    attackBreakdownLines.push({ label: `${attackStat.charAt(0).toUpperCase() + attackStat.slice(1)} Value`, value: `+${attackAttr.value}` });
    if (assassinApplies) attackBreakdownLines.push({ label: 'Assassin', value: 'Edge Attack', isSkill: true });
    if (attackBonus > 0) attackBreakdownLines.push({ label: 'Origin Bonus', value: `+${attackBonus}` });
    if (unseenStrikeBonus.attack > 0) attackBreakdownLines.push({ label: 'Unseen Strike', value: `+${unseenStrikeBonus.attack}`, isSkill: true });
    if (leaderOfMenBonus > 0) attackBreakdownLines.push({ label: 'Leader of Men', value: `+${leaderOfMenBonus}`, isSkill: true });
    if (attackSoulBonus > 0) attackBreakdownLines.push({ label: 'Captured Soul', value: `+${attackSoulBonus}`, isSkill: true });
    if (poisonPenalty !== 0) attackBreakdownLines.push({ label: 'Venom', value: `-1`, isPoison: true });
    if (hexPenalty > 0) attackBreakdownLines.push({ label: `Hex (×${hexPenalty})`, value: `-${hexPenalty}`, isPoison: true });
    if (lotusDustPenalty > 0) attackBreakdownLines.push({ label: `Lotus Dust (×${lotusDustPenalty})`, value: `-${lotusDustPenalty}`, isPoison: true });
    if (windsOfFate !== 0) attackBreakdownLines.push({ label: 'Winds of Fate', value: windsOfFate > 0 ? `+${windsOfFate}` : `${windsOfFate}`, isFate: true });

    // Build attack breakdown HTML
    let attackBreakdownHtml = `<div class="attack-breakdown" style="display: none;">`;
    attackBreakdownHtml += `<div class="breakdown-header">Attack Breakdown</div>`;
    for (const line of attackBreakdownLines) {
      const lineClass = line.isSkill ? 'breakdown-skill' : (line.isPoison ? 'breakdown-poison' : '');
      if (line.roll !== undefined) {
        attackBreakdownHtml += `<div class="breakdown-line ${lineClass}"><span class="breakdown-label">${line.label}</span><span class="breakdown-value">${line.value} → ${line.roll}</span></div>`;
      } else {
        attackBreakdownHtml += `<div class="breakdown-line ${lineClass}"><span class="breakdown-label">${line.label}</span><span class="breakdown-value">${line.value}</span></div>`;
      }
    }

    // Build attack skill icons grid HTML
    let attackSkillIconsHtml = '';
    if (attackSkillIcons.length > 0) {
      attackSkillIconsHtml = `<div class="roll-skill-icons">`;
      for (const skill of attackSkillIcons) {
        attackSkillIconsHtml += `<img src="${skill.icon}" class="roll-skill-icon" title="${skill.title}" alt="${skill.title}"/>`;
      }
      attackSkillIconsHtml += `</div>`;
    }

    // Show dual attack results when mounted
    if (mountedMods.isMounted) {
      if (vsNonMountedMod !== 0) attackBreakdownHtml += `<div class="breakdown-line"><span class="breakdown-label">vs Non-Mounted</span><span class="breakdown-value">${vsNonMountedMod > 0 ? '+' : ''}${vsNonMountedMod}</span></div>`;
      if (vsMountedMod !== 0) attackBreakdownHtml += `<div class="breakdown-line"><span class="breakdown-label">vs Mounted</span><span class="breakdown-value">${vsMountedMod > 0 ? '+' : ''}${vsMountedMod}</span></div>`;
      attackBreakdownHtml += `<div class="breakdown-total" style="background: linear-gradient(180deg, #1a365d 0%, #0d1b2a 100%); border-color: #4299e1;"><span class="breakdown-label">Total</span><span class="breakdown-value">${vsNonMountedTotal} / ${vsMountedTotal}</span></div>`;
      attackBreakdownHtml += `</div>`;

      const atkRollLabel = attackStat.charAt(0).toUpperCase() + attackStat.slice(1);
      content += `<div class="roll-result-wrapper">`;
      content += `<div class="mounted-attack-results">`;
      content += `<div class="attack-result-box attack-vs-nonmounted clickable-breakdown" style="cursor: pointer;">`;
      content += `<span class="attack-label">vs Non-Mounted</span>`;
      content += `<span class="attack-total">${vsNonMountedTotal}</span>`;
      content += `</div>`;

      content += `<div class="attack-result-box attack-vs-mounted clickable-breakdown" style="cursor: pointer;">`;
      content += `<span class="attack-label">vs Mounted</span>`;
      content += `<span class="attack-total">${vsMountedTotal}</span>`;
      content += `</div>`;
      content += `</div>`;
      content += `<div class="sp-boost-row">`;
      content += `<button type="button" class="sp-boost-btn" data-boost="1" data-cost="1" data-actor-id="${this.actor.id}" data-base-total="${attackRoll.total}" data-cruel-fate="${cruelFate}" data-roll-label="${atkRollLabel}" data-roll-type="attack">+1</button>`;
      content += `<button type="button" class="sp-boost-btn" data-boost="2" data-cost="2" data-actor-id="${this.actor.id}" data-base-total="${attackRoll.total}" data-cruel-fate="${cruelFate}" data-roll-label="${atkRollLabel}" data-roll-type="attack">+2</button>`;
      content += `</div>`;
      content += attackSkillIconsHtml;
      content += `</div>`;
      content += attackBreakdownHtml;
    } else {
      attackBreakdownHtml += `<div class="breakdown-total" style="background: linear-gradient(180deg, #1a365d 0%, #0d1b2a 100%); border-color: #4299e1;"><span class="breakdown-label">Total</span><span class="breakdown-value">${attackRoll.total}</span></div>`;
      attackBreakdownHtml += `</div>`;

      const atkRollLabel = attackStat.charAt(0).toUpperCase() + attackStat.slice(1);
      content += `<div class="sp-boost-row">`;
      content += `<button type="button" class="sp-boost-btn" data-boost="1" data-cost="1" data-actor-id="${this.actor.id}" data-base-total="${attackRoll.total}" data-cruel-fate="${cruelFate}" data-roll-label="${atkRollLabel}" data-roll-type="attack">+1</button>`;
      content += `<div class="attack-result-box clickable-breakdown" style="cursor: pointer;">${attackRoll.total}</div>`;
      content += `<button type="button" class="sp-boost-btn" data-boost="2" data-cost="2" data-actor-id="${this.actor.id}" data-base-total="${attackRoll.total}" data-cruel-fate="${cruelFate}" data-roll-label="${atkRollLabel}" data-roll-type="attack">+2</button>`;
      content += `</div>`;
      content += attackSkillIconsHtml;
      content += attackBreakdownHtml;
    }

    // Build damage data first (needed for both normal card and flex choice)
    let damageData = null;
    let impalingThrowActive = false;
    let snakeArrowActive = false;
    if (weapon.damage) {
      // Waterfront Fists: Upgrade unarmed damage from "2" to "1d4"
      let effectiveDamage = weapon.damage;
      if (isUpgradedUnarmed && weapon.damage === "2") {
        effectiveDamage = "1d4";
      }

      // Check for Impaling Throw on thrown weapons
      impalingThrowActive = weapon.type === 'thrown' && this.actor.system.impalingThrowActive;
      if (impalingThrowActive) {
        // Clear the flag now that the attack is being made
        await this.actor.update({ 'system.impalingThrowActive': false });
      }

      // Check for Snake Arrow on ranged weapons
      snakeArrowActive = weapon.type === 'ranged' && this.actor.system.snakeArrowActive;
      if (snakeArrowActive) {
        await this.actor.update({ 'system.snakeArrowActive': false });
      }

      // Check for Bloody Talons on unarmed weapons (persists until combat ends)
      const bloodyTalonsActive = isUnarmed && this.actor.system.bloodyTalonsActive;

      // Check for Uncanny Reach on melee weapons (+1 damage)
      const uncannyReachActive = weapon.type === 'melee' && this.actor.system.uncannyReachActive;

      damageData = {
        actorId: this.actor.id,
        damage: effectiveDamage,
        damageStat: damageStat || '',
        damageBonus: damageBonus,
        weaponType: weapon.type,
        weaponName: weapon.name,
        waterfrontFists: isUpgradedUnarmed,
        impalingThrow: impalingThrowActive,
        snakeArrow: snakeArrowActive,
        bloodyTalons: bloodyTalonsActive,
        uncannyReach: uncannyReachActive,
        isPoisoned: weapon.isPoisoned || false,
        unseenStrikeDamageBonus: unseenStrikeBonus.damage || 0
      };
    }

    // === GLAMOUR BLIND: auto-miss unless flex triggers ===
    if (glamourBlind && !attackFlexData.triggered) {
      const BLIND_MISS = [
        `${this.actor.name} swings wildly into the darkness — steel finds only air!`,
        `Blinded and desperate, ${this.actor.name} lashes out at shadows!`,
        `${this.actor.name} strikes blind — the blade cuts nothing but empty space!`,
        `Darkness swallows ${this.actor.name}'s senses — the attack goes wide!`,
        `${this.actor.name} fights by sound alone — and misses!`,
      ];
      const blindContent = `<div class="conan-roll" style="border-color: ${ownerColor};">` +
        `<div class="roll-header">` +
        `<img src="${tokenImg}" class="token-img" alt="${this.actor.name}">` +
        `<div class="roll-title">${weapon.name} Attack — BLINDED!</div>` +
        `</div>` +
        `<div style="text-align: center; margin: 8px 0;">` +
        `<img src="systems/conan/images/icons/blinded_icon.png" alt="Blinded" style="width: 36px; height: 36px; filter: drop-shadow(0 0 4px rgba(112,128,144,0.6)); vertical-align: middle;"/>` +
        `</div>` +
        `<div style="color: #708090; text-align: center; font-style: italic; padding: 4px 8px;">${BLIND_MISS[Math.floor(Math.random() * BLIND_MISS.length)]}</div>` +
        `<div class="flex-result"><strong>Flex Die (${attackFlexData.die}):</strong> ${attackFlexData.result}</div>` +
        `<div style="color: #ff6666; text-align: center; font-weight: bold; padding: 4px;">MISS — Glamour blinds the attack!</div>` +
        `</div>`;

      ChatMessage.create({
        speaker: ChatMessage.getSpeaker({ actor: this.actor }),
        content: blindContent,
        rolls: [attackRoll, attackFlexData.roll],
        rollMode: game.settings.get('core', 'rollMode')
      });
      return;
    }

    // If flex triggered, show flex choice card
    if (attackFlexData.triggered) {
      // Build the normal content for if they choose stamina
      let normalContent = `<div class="conan-roll" style="border-color: ${ownerColor};">`;
      normalContent += `<div class="roll-header">`;
      normalContent += `<img src="${tokenImg}" class="token-img" alt="${this.actor.name}">`;
      normalContent += `<div class="roll-title">${weapon.name} Attack</div>`;
      normalContent += `</div>`;

      if (cruelFate) {
        normalContent += `<div class="cruel-fate-indicator">Cruel Fate</div>`;
      }

      if (weapon.ammo) {
        normalContent += `<div class="ammo-info"><strong>Ammo:</strong> ${weapon.ammo.current}/${weapon.ammo.max}</div>`;
      }

      // Add attack result (mounted or normal)
      const flexAtkRollLabel = attackStat.charAt(0).toUpperCase() + attackStat.slice(1);
      if (mountedMods.isMounted) {
        normalContent += `<div class="roll-result-wrapper">`;
        normalContent += `<div class="mounted-attack-results">`;
        normalContent += `<div class="attack-result-box attack-vs-nonmounted clickable-breakdown" style="cursor: pointer;">`;
        normalContent += `<span class="attack-label">vs Non-Mounted</span>`;
        normalContent += `<span class="attack-total">${vsNonMountedTotal}</span>`;
        normalContent += `</div>`;
        normalContent += `<div class="attack-result-box attack-vs-mounted clickable-breakdown" style="cursor: pointer;">`;
        normalContent += `<span class="attack-label">vs Mounted</span>`;
        normalContent += `<span class="attack-total">${vsMountedTotal}</span>`;
        normalContent += `</div>`;
        normalContent += `</div>`;
        normalContent += `<div class="sp-boost-row">`;
        normalContent += `<button type="button" class="sp-boost-btn" data-boost="1" data-cost="1" data-actor-id="${this.actor.id}" data-base-total="${attackRoll.total}" data-cruel-fate="${cruelFate}" data-roll-label="${flexAtkRollLabel}" data-roll-type="attack">+1</button>`;
        normalContent += `<button type="button" class="sp-boost-btn" data-boost="2" data-cost="2" data-actor-id="${this.actor.id}" data-base-total="${attackRoll.total}" data-cruel-fate="${cruelFate}" data-roll-label="${flexAtkRollLabel}" data-roll-type="attack">+2</button>`;
        normalContent += `</div>`;
        normalContent += attackSkillIconsHtml;
        normalContent += `</div>`;
        normalContent += attackBreakdownHtml;
      } else {
        normalContent += `<div class="sp-boost-row">`;
        normalContent += `<button type="button" class="sp-boost-btn" data-boost="1" data-cost="1" data-actor-id="${this.actor.id}" data-base-total="${attackRoll.total}" data-cruel-fate="${cruelFate}" data-roll-label="${flexAtkRollLabel}" data-roll-type="attack">+1</button>`;
        normalContent += `<div class="attack-result-box clickable-breakdown" style="cursor: pointer;">${attackRoll.total}</div>`;
        normalContent += `<button type="button" class="sp-boost-btn" data-boost="2" data-cost="2" data-actor-id="${this.actor.id}" data-base-total="${attackRoll.total}" data-cruel-fate="${cruelFate}" data-roll-label="${flexAtkRollLabel}" data-roll-type="attack">+2</button>`;
        normalContent += `</div>`;
        normalContent += attackSkillIconsHtml;
        normalContent += attackBreakdownHtml;
      }

      if (impalingThrowActive) {
        normalContent += `<div class="skill-indicator impaling-throw-indicator">💀 IMPALING THROW: DOUBLE DAMAGE!</div>`;
      }
      if (snakeArrowActive) {
        normalContent += `<div class="skill-indicator snake-arrow-indicator">🐍 SNAKE ARROW: +1d6 DAMAGE & POISON!</div>`;
      }

      if (damageData) {
        normalContent += `<button class="damage-roll-btn" data-damage='${JSON.stringify(damageData)}'>DAMAGE</button>`;
      }

      if (weapon.range) normalContent += `<div><strong>Range:</strong> ${weapon.range}</div>`;
      if (weapon.rules) normalContent += `<div><strong>Rules:</strong> ${weapon.rules}</div>`;
      normalContent += `</div>`;

      // Build flex choice card
      const flexChoiceData = {
        actorId: this.actor.id,
        rollType: attackFlexType,
        celebData: attackFlexData.celebData,
        damageData: damageData,
        normalContent: normalContent,
        rollTotal: vsNonMountedTotal,
        rollLabel: `${weapon.name} Attack`
      };

      const flexCardContent = this._buildFlexChoiceCard('attack', attackFlexData, flexChoiceData, tokenImg, ownerColor);

      ChatMessage.create({
        speaker: ChatMessage.getSpeaker({ actor: this.actor }),
        content: flexCardContent,
        rolls: [attackRoll, attackFlexData.roll],
        rollMode: game.settings.get('core', 'rollMode')
      });
    } else {
      // No flex - show normal attack card
      content += `<div class="flex-result">`;
      content += `<strong>Flex Die (${attackFlexData.die}):</strong> ${attackFlexData.result}`;
      content += `</div>`;

      if (impalingThrowActive) {
        content += `<div class="skill-indicator impaling-throw-indicator">💀 IMPALING THROW: DOUBLE DAMAGE!</div>`;
      }
      if (snakeArrowActive) {
        content += `<div class="skill-indicator snake-arrow-indicator">🐍 SNAKE ARROW: +1d6 DAMAGE & POISON!</div>`;
      }

      if (damageData) {
        content += `<button class="damage-roll-btn" data-damage='${JSON.stringify(damageData)}'>DAMAGE</button>`;
      }

      if (weapon.range) content += `<div><strong>Range:</strong> ${weapon.range}</div>`;
      if (weapon.rules) content += `<div><strong>Rules:</strong> ${weapon.rules}</div>`;
      if (attackFlexData.suppressed) {
        const venomMsg = VENOM_FLEX_MESSAGES[Math.floor(Math.random() * VENOM_FLEX_MESSAGES.length)];
        content += `<div style="padding: 6px 10px; margin-top: 6px; background: rgba(50,205,50,0.1); border-left: 2px solid #32CD32; border-radius: 2px; color: #32CD32; font-style: italic; font-size: 15px;">${venomMsg}</div>`;
      }
      content += `</div>`;

      ChatMessage.create({
        speaker: ChatMessage.getSpeaker({ actor: this.actor }),
        content: content,
        rolls: [attackRoll, attackFlexData.roll],
        rollMode: game.settings.get('core', 'rollMode')
      });
    }
  }

  // ==========================================
  // MELEE ATTACKS (LEGACY - kept for backwards compatibility)
  // ==========================================

  async _onRollMeleeAttack(event) {
    event.preventDefault();
    const attackId = event.currentTarget.dataset.attackId;
    const attack = this.actor.system.meleeAttacks[attackId];

    if (!attack) return;

    // Get origin bonuses
    const originBonuses = this._getActiveOriginBonuses();

    // Get mounted combat modifiers
    const mountedMods = this._getMountedCombatModifiers();
    const mountedModifier = mountedMods.meleeBonus;

    const attackAttrName = attack.attackAttribute || "might";
    const attackAttr = this.actor.system.attributes[attackAttrName];

    // Attack bonus from origin (based on attack attribute)
    const attackBonus = originBonuses.attacks[attackAttrName] || 0;

    // Build attack formula with origin bonus and mounted modifier
    // Use effective die AND value that accounts for skill upgrades (Mighty/Sharpness, Legendary, etc.)
    const { die: effectiveAttackDie, value: effectiveAttackValue } = this._getEffectiveStatValues(attackAttrName);
    let attackFormula = `1${effectiveAttackDie} + ${effectiveAttackValue}`;
    if (attackBonus > 0) {
      attackFormula += ` + ${attackBonus}`;
    }
    if (mountedModifier > 0) {
      attackFormula += ` + ${mountedModifier}`;
    }

    const attackRoll = new Roll(attackFormula, this.actor.getRollData());
    await attackRoll.evaluate();

    // Get Winds of Fate modifier
    const windsOfFate = WindsOfFateDialog.getValueForActor(this.actor);
    const adjustedAttackTotal = attackRoll.total + windsOfFate;

    const attackFlexData = await this._rollFlexDie('melee_hit', true); // Suppress auto-celebration
    const cruelFate = this._checkCruelFate(attackRoll);

    // Store damage info for button (damage rolled separately)
    const damageBonus = originBonuses.damage.melee || 0;
    const damageAttrName = attack.damageAttribute || "might";

    const tokenImg = this.actor.prototypeToken?.texture?.src || this.actor.img || 'icons/svg/mystery-man.svg';
    const ownerColor = this._getOwnerColor();

    // Build attack breakdown
    const attackDieRoll = attackRoll.terms[0]?.total || attackRoll.total;
    const attackBreakdownLines = [];
    attackBreakdownLines.push({ label: `${attackAttrName.charAt(0).toUpperCase() + attackAttrName.slice(1)} Die`, value: effectiveAttackDie, roll: attackDieRoll });
    attackBreakdownLines.push({ label: `${attackAttrName.charAt(0).toUpperCase() + attackAttrName.slice(1)} Value`, value: `+${attackAttr.value}` });
    if (attackBonus > 0) attackBreakdownLines.push({ label: 'Origin Bonus', value: `+${attackBonus}` });
    if (mountedModifier > 0) attackBreakdownLines.push({ label: 'Mounted Bonus', value: `+${mountedModifier}` });
    if (windsOfFate !== 0) attackBreakdownLines.push({ label: 'Winds of Fate', value: windsOfFate > 0 ? `+${windsOfFate}` : `${windsOfFate}`, isFate: true });

    let attackBreakdownHtml = `<div class="attack-breakdown" style="display: none;">`;
    attackBreakdownHtml += `<div class="breakdown-header">Attack Breakdown</div>`;
    for (const line of attackBreakdownLines) {
      const skillClass = line.isSkill ? 'breakdown-skill' : '';
      if (line.roll !== undefined) {
        attackBreakdownHtml += `<div class="breakdown-line ${skillClass}"><span class="breakdown-label">${line.label}</span><span class="breakdown-value">${line.value} → ${line.roll}</span></div>`;
      } else {
        attackBreakdownHtml += `<div class="breakdown-line ${skillClass}"><span class="breakdown-label">${line.label}</span><span class="breakdown-value">${line.value}</span></div>`;
      }
    }
    attackBreakdownHtml += `<div class="breakdown-total" style="background: linear-gradient(180deg, #1a365d 0%, #0d1b2a 100%); border-color: #4299e1;"><span class="breakdown-label">Total</span><span class="breakdown-value">${adjustedAttackTotal}</span></div>`;
    attackBreakdownHtml += `</div>`;

    // Build damage data
    let damageData = null;
    if (attack.damage) {
      damageData = {
        actorId: this.actor.id,
        damage: attack.damage,
        damageStat: damageAttrName,
        damageBonus: damageBonus,
        weaponType: 'melee',
        weaponName: attack.name
      };
    }

    // If flex triggered, show flex choice card
    if (attackFlexData.triggered) {
      // Build normal content for stamina choice fallback
      let normalContent = `<div class="conan-roll" style="border-color: ${ownerColor};">`;
      normalContent += `<div class="roll-header">`;
      normalContent += `<img src="${tokenImg}" class="token-img" alt="${this.actor.name}">`;
      normalContent += `<div class="roll-title">${attack.name} Attack</div>`;
      normalContent += `</div>`;
      if (cruelFate) normalContent += `<div class="cruel-fate-indicator">Cruel Fate</div>`;
      normalContent += `<div class="attack-result-box clickable-breakdown" style="cursor: pointer;">${attackRoll.total}</div>`;
      normalContent += attackBreakdownHtml;
      if (damageData) normalContent += `<button class="damage-roll-btn" data-damage='${JSON.stringify(damageData)}'>DAMAGE</button>`;
      if (attack.range) normalContent += `<div><strong>Range:</strong> ${attack.range}</div>`;
      normalContent += `</div>`;

      const flexChoiceData = {
        actorId: this.actor.id,
        rollType: 'melee_hit',
        celebData: attackFlexData.celebData,
        damageData: damageData,
        normalContent: normalContent,
        rollTotal: adjustedAttackTotal,
        rollLabel: `${attack.name} Attack`
      };

      const flexCardContent = this._buildFlexChoiceCard('attack', attackFlexData, flexChoiceData, tokenImg, ownerColor);

      ChatMessage.create({
        speaker: ChatMessage.getSpeaker({ actor: this.actor }),
        content: flexCardContent,
        rolls: [attackRoll, attackFlexData.roll],
        rollMode: game.settings.get('core', 'rollMode')
      });
    } else {
      // No flex - show normal attack card
      let content = `<div class="conan-roll" style="border-color: ${ownerColor};">`;
      content += `<div class="roll-header">`;
      content += `<img src="${tokenImg}" class="token-img" alt="${this.actor.name}">`;
      content += `<div class="roll-title">${attack.name} Attack</div>`;
      content += `</div>`;
      if (cruelFate) content += `<div class="cruel-fate-indicator">Cruel Fate</div>`;
      content += `<div class="attack-result-box clickable-breakdown" style="cursor: pointer;">${attackRoll.total}</div>`;
      content += attackBreakdownHtml;
      content += `<div class="flex-result"><strong>Flex Die (${attackFlexData.die}):</strong> ${attackFlexData.result}</div>`;
      if (damageData) content += `<button class="damage-roll-btn" data-damage='${JSON.stringify(damageData)}'>DAMAGE</button>`;
      if (attack.range) content += `<div><strong>Range:</strong> ${attack.range}</div>`;
      if (attackFlexData.suppressed) {
        const venomMsg = VENOM_FLEX_MESSAGES[Math.floor(Math.random() * VENOM_FLEX_MESSAGES.length)];
        content += `<div style="padding: 6px 10px; margin-top: 6px; background: rgba(50,205,50,0.1); border-left: 2px solid #32CD32; border-radius: 2px; color: #32CD32; font-style: italic; font-size: 15px;">${venomMsg}</div>`;
      }
      content += `</div>`;

      ChatMessage.create({
        speaker: ChatMessage.getSpeaker({ actor: this.actor }),
        content: content,
        rolls: [attackRoll, attackFlexData.roll],
        rollMode: game.settings.get('core', 'rollMode')
      });
    }
  }

  // ==========================================
  // THROWN ATTACKS
  // ==========================================

  async _onRollThrownAttack(event) {
    event.preventDefault();
    const attackId = event.currentTarget.dataset.attackId;
    const attack = this.actor.system.thrownAttacks[attackId];

    if (!attack) return;

    // Check ammo
    const currentAmmo = attack.ammo?.current ?? 0;
    if (currentAmmo <= 0) {
      ui.notifications.warn(`${attack.name}: Out of ammo!`);
      return;
    }

    // Decrease ammo
    await this.actor.update({
      [`system.thrownAttacks.${attackId}.ammo.current`]: currentAmmo - 1
    });
    // Track spent ammo for reload recovery
    await this._trackAmmoSpent(attackId, attack, 'thrown');

    // Get origin bonuses
    const originBonuses = this._getActiveOriginBonuses();

    // Get mounted combat modifiers (thrown has same penalty as ranged unless Born in the Saddle)
    const mountedMods = this._getMountedCombatModifiers();
    const mountedPenalty = mountedMods.rangedPenalty;

    // Thrown attacks use Edge for attack roll
    const attackAttrName = attack.attackAttribute || "edge";
    const attackAttr = this.actor.system.attributes[attackAttrName];

    // Attack bonus from origin (based on attack attribute - edge for thrown)
    const attackBonus = originBonuses.attacks[attackAttrName] || 0;

    // Build attack formula with origin bonus and mounted penalty
    // Use effective die AND value that accounts for skill upgrades (Sharpness, Legendary, etc.)
    const { die: effectiveAttackDie, value: effectiveAttackValue } = this._getEffectiveStatValues(attackAttrName);
    let attackFormula = `1${effectiveAttackDie} + ${effectiveAttackValue}`;
    if (attackBonus > 0) {
      attackFormula += ` + ${attackBonus}`;
    }
    if (mountedPenalty !== 0) {
      attackFormula += ` + ${mountedPenalty}`;
    }

    const attackRoll = new Roll(attackFormula, this.actor.getRollData());
    await attackRoll.evaluate();

    // Get Winds of Fate modifier
    const windsOfFate = WindsOfFateDialog.getValueForActor(this.actor);
    const adjustedAttackTotal = attackRoll.total + windsOfFate;

    const attackFlexData = await this._rollFlexDie('ranged_hit', true); // Suppress auto-celebration
    const cruelFate = this._checkCruelFate(attackRoll);

    // Store damage info for button (damage rolled separately)
    const damageBonus = originBonuses.damage.ranged || 0;

    const tokenImg = this.actor.prototypeToken?.texture?.src || this.actor.img || 'icons/svg/mystery-man.svg';
    const ownerColor = this._getOwnerColor();

    // Build attack breakdown
    const attackDieRoll = attackRoll.terms[0]?.total || attackRoll.total;
    const attackBreakdownLines = [];
    attackBreakdownLines.push({ label: `${attackAttrName.charAt(0).toUpperCase() + attackAttrName.slice(1)} Die`, value: effectiveAttackDie, roll: attackDieRoll });
    attackBreakdownLines.push({ label: `${attackAttrName.charAt(0).toUpperCase() + attackAttrName.slice(1)} Value`, value: `+${attackAttr.value}` });
    if (attackBonus > 0) attackBreakdownLines.push({ label: 'Origin Bonus', value: `+${attackBonus}` });
    if (mountedPenalty < 0) attackBreakdownLines.push({ label: 'Mounted Penalty', value: `${mountedPenalty}` });
    if (windsOfFate !== 0) attackBreakdownLines.push({ label: 'Winds of Fate', value: windsOfFate > 0 ? `+${windsOfFate}` : `${windsOfFate}`, isFate: true });

    let attackBreakdownHtml = `<div class="attack-breakdown" style="display: none;">`;
    attackBreakdownHtml += `<div class="breakdown-header">Attack Breakdown</div>`;
    for (const line of attackBreakdownLines) {
      const skillClass = line.isSkill ? 'breakdown-skill' : '';
      if (line.roll !== undefined) {
        attackBreakdownHtml += `<div class="breakdown-line ${skillClass}"><span class="breakdown-label">${line.label}</span><span class="breakdown-value">${line.value} → ${line.roll}</span></div>`;
      } else {
        attackBreakdownHtml += `<div class="breakdown-line ${skillClass}"><span class="breakdown-label">${line.label}</span><span class="breakdown-value">${line.value}</span></div>`;
      }
    }
    attackBreakdownHtml += `<div class="breakdown-total" style="background: linear-gradient(180deg, #1a365d 0%, #0d1b2a 100%); border-color: #4299e1;"><span class="breakdown-label">Total</span><span class="breakdown-value">${adjustedAttackTotal}</span></div>`;
    attackBreakdownHtml += `</div>`;

    // Build damage data
    let damageData = null;
    if (attack.damage) {
      damageData = {
        actorId: this.actor.id,
        damage: attack.damage,
        damageStat: 'might',
        damageBonus: damageBonus,
        weaponType: 'ranged',
        weaponName: attack.name
      };
    }

    // If flex triggered, show flex choice card
    if (attackFlexData.triggered) {
      // Build normal content for stamina choice fallback
      let normalContent = `<div class="conan-roll" style="border-color: ${ownerColor};">`;
      normalContent += `<div class="roll-header">`;
      normalContent += `<img src="${tokenImg}" class="token-img" alt="${this.actor.name}">`;
      normalContent += `<div class="roll-title">${attack.name} Attack</div>`;
      normalContent += `</div>`;
      if (cruelFate) normalContent += `<div class="cruel-fate-indicator">Cruel Fate</div>`;
      normalContent += `<div class="ammo-info"><strong>Ammo:</strong> ${currentAmmo - 1}/${attack.ammo?.max || 3}</div>`;
      const thrownFlexLabel = attackAttrName.charAt(0).toUpperCase() + attackAttrName.slice(1);
      normalContent += `<div class="sp-boost-row">`;
      normalContent += `<button type="button" class="sp-boost-btn" data-boost="1" data-cost="1" data-actor-id="${this.actor.id}" data-base-total="${attackRoll.total}" data-cruel-fate="${cruelFate}" data-roll-label="${thrownFlexLabel}" data-roll-type="attack">+1</button>`;
      normalContent += `<div class="attack-result-box clickable-breakdown" style="cursor: pointer;">${attackRoll.total}</div>`;
      normalContent += `<button type="button" class="sp-boost-btn" data-boost="2" data-cost="2" data-actor-id="${this.actor.id}" data-base-total="${attackRoll.total}" data-cruel-fate="${cruelFate}" data-roll-label="${thrownFlexLabel}" data-roll-type="attack">+2</button>`;
      normalContent += `</div>`;
      normalContent += attackBreakdownHtml;
      if (damageData) normalContent += `<button class="damage-roll-btn" data-damage='${JSON.stringify(damageData)}'>DAMAGE</button>`;
      if (attack.range) normalContent += `<div><strong>Range:</strong> ${attack.range}</div>`;
      normalContent += `</div>`;

      const flexChoiceData = {
        actorId: this.actor.id,
        rollType: 'ranged_hit',
        celebData: attackFlexData.celebData,
        damageData: damageData,
        normalContent: normalContent,
        rollTotal: adjustedAttackTotal,
        rollLabel: `${attack.name} Attack`
      };

      const flexCardContent = this._buildFlexChoiceCard('attack', attackFlexData, flexChoiceData, tokenImg, ownerColor);

      ChatMessage.create({
        speaker: ChatMessage.getSpeaker({ actor: this.actor }),
        content: flexCardContent,
        rolls: [attackRoll, attackFlexData.roll],
        rollMode: game.settings.get('core', 'rollMode')
      });
    } else {
      // No flex - show normal attack card
      let content = `<div class="conan-roll" style="border-color: ${ownerColor};">`;
      content += `<div class="roll-header">`;
      content += `<img src="${tokenImg}" class="token-img" alt="${this.actor.name}">`;
      content += `<div class="roll-title">${attack.name} Attack</div>`;
      content += `</div>`;
      if (cruelFate) content += `<div class="cruel-fate-indicator">Cruel Fate</div>`;
      content += `<div class="ammo-info"><strong>Ammo:</strong> ${currentAmmo - 1}/${attack.ammo?.max || 3}</div>`;
      const thrownLabel = attackAttrName.charAt(0).toUpperCase() + attackAttrName.slice(1);
      content += `<div class="sp-boost-row">`;
      content += `<button type="button" class="sp-boost-btn" data-boost="1" data-cost="1" data-actor-id="${this.actor.id}" data-base-total="${attackRoll.total}" data-cruel-fate="${cruelFate}" data-roll-label="${thrownLabel}" data-roll-type="attack">+1</button>`;
      content += `<div class="attack-result-box clickable-breakdown" style="cursor: pointer;">${attackRoll.total}</div>`;
      content += `<button type="button" class="sp-boost-btn" data-boost="2" data-cost="2" data-actor-id="${this.actor.id}" data-base-total="${attackRoll.total}" data-cruel-fate="${cruelFate}" data-roll-label="${thrownLabel}" data-roll-type="attack">+2</button>`;
      content += `</div>`;
      content += attackBreakdownHtml;
      content += `<div class="flex-result"><strong>Flex Die (${attackFlexData.die}):</strong> ${attackFlexData.result}</div>`;
      if (damageData) content += `<button class="damage-roll-btn" data-damage='${JSON.stringify(damageData)}'>DAMAGE</button>`;
      if (attack.range) content += `<div><strong>Range:</strong> ${attack.range}</div>`;
      if (attackFlexData.suppressed) {
        const venomMsg = VENOM_FLEX_MESSAGES[Math.floor(Math.random() * VENOM_FLEX_MESSAGES.length)];
        content += `<div style="padding: 6px 10px; margin-top: 6px; background: rgba(50,205,50,0.1); border-left: 2px solid #32CD32; border-radius: 2px; color: #32CD32; font-style: italic; font-size: 15px;">${venomMsg}</div>`;
      }
      content += `</div>`;

      ChatMessage.create({
        speaker: ChatMessage.getSpeaker({ actor: this.actor }),
        content: content,
        rolls: [attackRoll, attackFlexData.roll],
        rollMode: game.settings.get('core', 'rollMode')
      });
    }
  }

  // ==========================================
  // RANGED ATTACKS
  // ==========================================

  async _onRollRangedAttack(event) {
    event.preventDefault();
    const attackId = event.currentTarget.dataset.attackId;
    const attack = this.actor.system.rangedAttacks[attackId];

    if (!attack) return;

    // Check ammo
    const currentAmmo = attack.ammo?.current ?? 0;
    if (currentAmmo <= 0) {
      ui.notifications.warn(`${attack.name}: Out of ammo!`);
      return;
    }

    // Decrement ammo
    await this.actor.update({
      [`system.rangedAttacks.${attackId}.ammo.current`]: currentAmmo - 1
    });
    // Track spent ammo for reload recovery
    await this._trackAmmoSpent(attackId, attack, 'ranged');

    // Get origin bonuses
    const originBonuses = this._getActiveOriginBonuses();

    // Get mounted combat modifiers (ranged penalty unless Born in the Saddle)
    const mountedMods = this._getMountedCombatModifiers();
    const mountedPenalty = mountedMods.rangedPenalty;

    const attackType = attack.type || "bow";
    const attackAttrName = attack.attackAttribute || "edge";
    const attackAttr = this.actor.system.attributes[attackAttrName];

    // Attack bonus from origin (based on attack attribute - typically edge for ranged)
    const attackBonus = originBonuses.attacks[attackAttrName] || 0;

    // Build attack formula with origin bonus and mounted penalty
    // Use effective die AND value that accounts for skill upgrades (Sharpness, Legendary, etc.)
    const { die: effectiveAttackDie, value: effectiveAttackValue } = this._getEffectiveStatValues(attackAttrName);
    let attackFormula = `1${effectiveAttackDie} + ${effectiveAttackValue}`;
    if (attackBonus > 0) {
      attackFormula += ` + ${attackBonus}`;
    }
    if (mountedPenalty !== 0) {
      attackFormula += ` + ${mountedPenalty}`;
    }

    const attackRoll = new Roll(attackFormula, this.actor.getRollData());
    await attackRoll.evaluate();

    // Get Winds of Fate modifier
    const windsOfFate = WindsOfFateDialog.getValueForActor(this.actor);
    const adjustedAttackTotal = attackRoll.total + windsOfFate;

    const attackFlexData = await this._rollFlexDie('ranged_hit', true); // Suppress auto-celebration
    const cruelFate = this._checkCruelFate(attackRoll);

    // Store damage info for button (damage rolled separately)
    const damageBonus = originBonuses.damage.ranged || 0;

    const typeLabel = attackType === "thrown" ? "Thrown" : "Bow";
    const tokenImg = this.actor.prototypeToken?.texture?.src || this.actor.img || 'icons/svg/mystery-man.svg';
    const ownerColor = this._getOwnerColor();

    // Build attack breakdown
    const attackDieRoll = attackRoll.terms[0]?.total || attackRoll.total;
    const attackBreakdownLines = [];
    attackBreakdownLines.push({ label: `${attackAttrName.charAt(0).toUpperCase() + attackAttrName.slice(1)} Die`, value: effectiveAttackDie, roll: attackDieRoll });
    attackBreakdownLines.push({ label: `${attackAttrName.charAt(0).toUpperCase() + attackAttrName.slice(1)} Value`, value: `+${attackAttr.value}` });
    if (attackBonus > 0) attackBreakdownLines.push({ label: 'Origin Bonus', value: `+${attackBonus}` });
    if (mountedPenalty < 0) attackBreakdownLines.push({ label: 'Mounted Penalty', value: `${mountedPenalty}` });
    if (windsOfFate !== 0) attackBreakdownLines.push({ label: 'Winds of Fate', value: windsOfFate > 0 ? `+${windsOfFate}` : `${windsOfFate}`, isFate: true });

    let attackBreakdownHtml = `<div class="attack-breakdown" style="display: none;">`;
    attackBreakdownHtml += `<div class="breakdown-header">Attack Breakdown</div>`;
    for (const line of attackBreakdownLines) {
      const skillClass = line.isSkill ? 'breakdown-skill' : '';
      if (line.roll !== undefined) {
        attackBreakdownHtml += `<div class="breakdown-line ${skillClass}"><span class="breakdown-label">${line.label}</span><span class="breakdown-value">${line.value} → ${line.roll}</span></div>`;
      } else {
        attackBreakdownHtml += `<div class="breakdown-line ${skillClass}"><span class="breakdown-label">${line.label}</span><span class="breakdown-value">${line.value}</span></div>`;
      }
    }
    attackBreakdownHtml += `<div class="breakdown-total" style="background: linear-gradient(180deg, #1a365d 0%, #0d1b2a 100%); border-color: #4299e1;"><span class="breakdown-label">Total</span><span class="breakdown-value">${adjustedAttackTotal}</span></div>`;
    attackBreakdownHtml += `</div>`;

    // Build damage data
    let damageData = null;
    if (attack.damage) {
      damageData = {
        actorId: this.actor.id,
        damage: attack.damage,
        damageStat: attackType === "thrown" ? 'might' : '',
        damageBonus: damageBonus,
        weaponType: 'ranged',
        weaponName: attack.name
      };
    }

    // If flex triggered, show flex choice card
    if (attackFlexData.triggered) {
      // Build normal content for stamina choice fallback
      let normalContent = `<div class="conan-roll" style="border-color: ${ownerColor};">`;
      normalContent += `<div class="roll-header">`;
      normalContent += `<img src="${tokenImg}" class="token-img" alt="${this.actor.name}">`;
      normalContent += `<div class="roll-title">${attack.name} Attack</div>`;
      normalContent += `</div>`;
      if (cruelFate) normalContent += `<div class="cruel-fate-indicator">Cruel Fate</div>`;
      normalContent += `<div class="ammo-info"><strong>Ammo:</strong> ${currentAmmo - 1}/${attack.ammo?.max || 10}</div>`;
      const rangedFlexLabel = attackAttrName.charAt(0).toUpperCase() + attackAttrName.slice(1);
      normalContent += `<div class="sp-boost-row">`;
      normalContent += `<button type="button" class="sp-boost-btn" data-boost="1" data-cost="1" data-actor-id="${this.actor.id}" data-base-total="${attackRoll.total}" data-cruel-fate="${cruelFate}" data-roll-label="${rangedFlexLabel}" data-roll-type="attack">+1</button>`;
      normalContent += `<div class="attack-result-box clickable-breakdown" style="cursor: pointer;">${attackRoll.total}</div>`;
      normalContent += `<button type="button" class="sp-boost-btn" data-boost="2" data-cost="2" data-actor-id="${this.actor.id}" data-base-total="${attackRoll.total}" data-cruel-fate="${cruelFate}" data-roll-label="${rangedFlexLabel}" data-roll-type="attack">+2</button>`;
      normalContent += `</div>`;
      normalContent += attackBreakdownHtml;
      if (damageData) normalContent += `<button class="damage-roll-btn" data-damage='${JSON.stringify(damageData)}'>DAMAGE</button>`;
      normalContent += `</div>`;

      const flexChoiceData = {
        actorId: this.actor.id,
        rollType: 'ranged_hit',
        celebData: attackFlexData.celebData,
        damageData: damageData,
        normalContent: normalContent,
        rollTotal: adjustedAttackTotal,
        rollLabel: `${attack.name} Attack`
      };

      const flexCardContent = this._buildFlexChoiceCard('attack', attackFlexData, flexChoiceData, tokenImg, ownerColor);

      ChatMessage.create({
        speaker: ChatMessage.getSpeaker({ actor: this.actor }),
        content: flexCardContent,
        rolls: [attackRoll, attackFlexData.roll],
        rollMode: game.settings.get('core', 'rollMode')
      });
    } else {
      // No flex - show normal attack card
      let content = `<div class="conan-roll" style="border-color: ${ownerColor};">`;
      content += `<div class="roll-header">`;
      content += `<img src="${tokenImg}" class="token-img" alt="${this.actor.name}">`;
      content += `<div class="roll-title">${attack.name} Attack</div>`;
      content += `</div>`;
      if (cruelFate) content += `<div class="cruel-fate-indicator">Cruel Fate</div>`;
      content += `<div class="ammo-info"><strong>Ammo:</strong> ${currentAmmo - 1}/${attack.ammo?.max || 10}</div>`;
      const rangedLabel = attackAttrName.charAt(0).toUpperCase() + attackAttrName.slice(1);
      content += `<div class="sp-boost-row">`;
      content += `<button type="button" class="sp-boost-btn" data-boost="1" data-cost="1" data-actor-id="${this.actor.id}" data-base-total="${attackRoll.total}" data-cruel-fate="${cruelFate}" data-roll-label="${rangedLabel}" data-roll-type="attack">+1</button>`;
      content += `<div class="attack-result-box clickable-breakdown" style="cursor: pointer;">${attackRoll.total}</div>`;
      content += `<button type="button" class="sp-boost-btn" data-boost="2" data-cost="2" data-actor-id="${this.actor.id}" data-base-total="${attackRoll.total}" data-cruel-fate="${cruelFate}" data-roll-label="${rangedLabel}" data-roll-type="attack">+2</button>`;
      content += `</div>`;
      content += attackBreakdownHtml;
      content += `<div class="flex-result"><strong>Flex Die (${attackFlexData.die}):</strong> ${attackFlexData.result}</div>`;
      if (damageData) content += `<button class="damage-roll-btn" data-damage='${JSON.stringify(damageData)}'>DAMAGE</button>`;
      if (attackFlexData.suppressed) {
        const venomMsg = VENOM_FLEX_MESSAGES[Math.floor(Math.random() * VENOM_FLEX_MESSAGES.length)];
        content += `<div style="padding: 6px 10px; margin-top: 6px; background: rgba(50,205,50,0.1); border-left: 2px solid #32CD32; border-radius: 2px; color: #32CD32; font-style: italic; font-size: 15px;">${venomMsg}</div>`;
      }
      content += `</div>`;

      ChatMessage.create({
        speaker: ChatMessage.getSpeaker({ actor: this.actor }),
        content: content,
        rolls: [attackRoll, attackFlexData.roll],
        rollMode: game.settings.get('core', 'rollMode')
      });
    }
  }

  // ==========================================
  // SPELLS
  // ==========================================

  /**
   * Find a spell by ID from either inherent spells or invoked spells
   */
  _findSpellById(spellId) {
    const spellCatalog = this._getSpellCatalog();
    const originId = this.actor.system.origin?.id;
    const sorceryAccess = this._getOriginSorceryAccess(originId);

    // Search in all accessible disciplines
    for (const discId of sorceryAccess) {
      const discipline = spellCatalog[discId];
      if (!discipline) continue;

      // Check inherent spells
      const inherentSpell = discipline.inherentSpells.find(s => s.id === spellId);
      if (inherentSpell) {
        return { ...inherentSpell, discipline: discId, isInherent: true };
      }

      // Check purchasable spells (if invoked)
      const invokedSpells = this.actor.system.sorcery?.invokedSpells || {};
      if (invokedSpells[spellId]) {
        const purchasedSpell = discipline.purchasableSpells.find(s => s.id === spellId);
        if (purchasedSpell) {
          return { ...purchasedSpell, discipline: discId, isInherent: false };
        }
      }
    }

    return null;
  }

  async _onRollSpell(event) {
    event.preventDefault();
    const spellId = event.currentTarget.dataset.spellId;
    const spell = this._findSpellById(spellId);

    if (!spell) {
      ui.notifications.warn("Spell not found!");
      return;
    }

    // Block all spellcasting while in beast form (except the beast-form check itself)
    if (this.actor.system.beastFormData?.active && spellId !== 'beast-form') {
      ui.notifications.warn('Cannot cast spells while in Beast Form!');
      return;
    }

    // Spell icon lookup for chat card badge
    const spellIconMap = {
      'whispers-darkness': 'systems/conan/images/icons/whispers_in_the_darkness_icon.png',
      'illusory-shadow': 'systems/conan/images/icons/illusory_shadow_icon.png',
      'nights-gift': 'systems/conan/images/icons/nights_gift_icon.png',
      'radium-gem': 'systems/conan/images/icons/radium_gem_icon.png',
      'create-food': 'systems/conan/images/icons/create_food_icon.png',
      'artifact-spirit': 'systems/conan/images/icons/artifact_spirit_icon.png',
      'lotus-flash': 'systems/conan/images/icons/lotus_flash_icon.png',
      'body-of-living-iron': 'systems/conan/images/icons/armor_up_icon.png',
      'craft-seal': 'systems/conan/images/icons/craft_seal_icon.png',
      'tide-of-stone': 'systems/conan/images/icons/tide_of_stone_icon.png',
      'create-bane-weapon': 'systems/conan/images/icons/create_bane_weapon_icon.png',
      'animate-living-statue': 'systems/conan/images/icons/animate_living_statue_icon.png',
      'lotus-miasma': 'systems/conan/images/icons/lotus_miasma_icon.png',
      'signs-jhebbal-sag': 'systems/conan/images/icons/the_signs_of_jhebbal_sag_icon.png',
      'sense-sorcery': 'systems/conan/images/icons/sense_sorcery_icon.png',
      'life-sight': 'systems/conan/images/icons/life_sight_icon.png',
      'talons-of-jhil': 'systems/conan/images/icons/talons_of_jhil_icon.png',
      'eyes-of-the-raven': 'systems/conan/images/icons/eyes_of_the_raven_icon.png',
      'healing': 'systems/conan/images/icons/healing_icon.png',
      'call-beast': 'systems/conan/images/icons/call_beast_icon.png',
      'favor-four-winds': 'systems/conan/images/icons/favor_of_the_four_winds_icon.png',
      'inspire': 'systems/conan/images/icons/inspire_icon.png',
      'counter-ward': 'systems/conan/images/icons/counter_ward_icon.png',
      'snake-arrow': 'systems/conan/images/icons/snake_arrow_icon.png',
      'astral-projection': 'systems/conan/images/icons/astral_projection_icon.png',
      'frightful-aura': 'systems/conan/images/icons/frightful_aura_icon.png',
      'fearsome-ward': 'systems/conan/images/icons/fearsome_ward_icon.png',
      'wave-of-darkness': 'systems/conan/images/icons/wave_of_darkness_icon.png',
      'beast-form': 'systems/conan/images/icons/beast_form_icon.png',
      'mesmerism': 'systems/conan/images/icons/mesmerism_icon.png',
      'bloodhound': 'systems/conan/images/icons/bloodhound_icon.png',
      'demonic-vessel': 'systems/conan/images/icons/demonic_vessel_icon.png',
      'bloody-talons': 'systems/conan/images/icons/bloody_talons_icon.png',
      'demonic-steed': 'systems/conan/images/icons/demonic_steed_icon.png',
      'demonic-ward': 'systems/conan/images/icons/demonic_ward_icon.png',
      'hellfire': 'systems/conan/images/icons/hellfire_icon.png',
      'uncanny-reach': 'systems/conan/images/icons/uncanny_reach_icon.png',
      'summon-fiend': 'systems/conan/images/icons/summon_fiend_icon.png',
      'summon-horror': 'systems/conan/images/icons/summon_horror_icon.png',
      'summon-ghost': 'systems/conan/images/icons/summon_ghost_icon.png',
      'death-scream': 'systems/conan/images/icons/death_scream_icon.png',
      'raise-dead': 'systems/conan/images/icons/raise_dead_icon.png',
      'death-sight': 'systems/conan/images/icons/death_sight_icon.png',
      'chilling-presence': 'systems/conan/images/icons/chilling_presence_icon.png',
      'undead-ward': 'systems/conan/images/icons/undead_ward_icon.png',
      'life-leech': 'systems/conan/images/icons/life_leech_icon.png',
      'chilling-touch': 'systems/conan/images/icons/chilling_touch_icon.png',
      'stamina-leech': 'systems/conan/images/icons/stamina_leech_icon.png',
      'capture-soul': 'systems/conan/images/icons/capture_soul_icon.png'
    };
    const spellIcon = spellIconMap[spellId] || '';
    // Portrait HTML with optional badge overlapping bottom-right of portrait
    const buildPortraitHtml = (tokenImg) => spellIcon
      ? `<div class="spell-chat-portrait-wrap"><img src="${tokenImg}" class="spell-chat-portrait"/><img src="${spellIcon}" class="spell-chat-badge" alt="${spell.name}"/></div>`
      : `<img src="${tokenImg}" class="spell-chat-portrait"/>`;

    // Radium Gem: toggle on/off instead of normal cast (free action, syncs with icon)
    if (spellId === 'radium-gem') {
      const inventory = this.actor.system.inventory || {};
      const gemItem = Object.values(inventory).find(item => item && item.isAlchemyGem);
      const gemQty = gemItem ? (gemItem.quantity || 0) : 0;
      if (gemQty < 1) {
        ui.notifications.warn("You need a Radium Gem in your inventory to activate this!");
        return;
      }
      const isActive = this.actor.system.radiumGemActive || false;
      await this.actor.update({ 'system.radiumGemActive': !isActive });
      const tokenImg = this.actor.prototypeToken?.texture?.src || this.actor.img || 'icons/svg/mystery-man.svg';
      const ownerColor = this._getOwnerColor();
      const statusText = !isActive ? 'activates' : 'extinguishes';
      const statusGlow = !isActive ? 'color: #90EE90;' : 'color: #999;';
      const chatContent = `
        <div class="spell-chat-card" style="border-color: ${ownerColor};">
          <div class="spell-chat-header">
            ${buildPortraitHtml(tokenImg)}
            <div class="spell-chat-title">
              <strong>${this.actor.name}</strong> ${statusText} their <strong>Radium Gem</strong>
            </div>
          </div>
          <div class="spell-chat-body">
            <div class="spell-chat-effect" style="${statusGlow}">${!isActive ? 'The gem glows with inner light, illuminating the area.' : 'The gem dims and the light fades.'}</div>
            <div class="spell-chat-meta"><strong>Cost:</strong> Free &nbsp;|&nbsp; <strong>Duration:</strong> 1 hour per Wits value</div>
          </div>
        </div>`;
      await ChatMessage.create({
        speaker: ChatMessage.getSpeaker({ actor: this.actor }),
        content: chatContent
      });
      return;
    }

    // Body of Living Iron: +3 AR until end of combat, 1 SP, free action, once per combat
    if (spellId === 'body-of-living-iron') {
      if (this.actor.system.buffsDebuffs?.armorUp) {
        ui.notifications.warn('Body of Living Iron is already active!');
        return;
      }
      const currentSP = this.actor.system.stamina || 0;
      if (currentSP < 1) {
        ui.notifications.warn('Not enough Stamina Points (1 SP required).');
        return;
      }
      await this.actor.update({
        'system.stamina': currentSP - 1,
        'system.buffsDebuffs.armorUp': true
      });
      const tokenImg = this.actor.prototypeToken?.texture?.src || this.actor.img || 'icons/svg/mystery-man.svg';
      const ownerColor = this._getOwnerColor();
      const newAR = (this.actor.system.defense?.ar || 0) + 3;
      await ChatMessage.create({
        speaker: ChatMessage.getSpeaker({ actor: this.actor }),
        content: `
          <div class="spell-chat-card" style="border-color: ${ownerColor};">
            <div class="spell-chat-header">
              ${buildPortraitHtml(tokenImg)}
              <div class="spell-chat-title">
                <strong>${this.actor.name}</strong> casts <strong>Body of Living Iron</strong>
              </div>
            </div>
            <div class="spell-chat-body">
              <div class="spell-chat-effect" style="color: #90EE90;">Iron-hard skin forms over ${this.actor.name}'s body. Armor Rating increased by 3 (now ${newAR}).</div>
              <div class="spell-chat-meta"><strong>Cost:</strong> 1 SP &nbsp;|&nbsp; <strong>Duration:</strong> Until end of combat</div>
            </div>
          </div>`
      });
      return;
    }

    // Eyes of the Raven: toggle on/off instead of normal cast (costs 1 SP to activate)
    if (spellId === 'eyes-of-the-raven') {
      const isActive = this.actor.system.eyesOfTheRavenActive || false;
      if (!isActive) {
        // Activating — costs 1 SP
        const currentSP = this.actor.system.stamina || 0;
        if (currentSP < 1) {
          ui.notifications.warn("Not enough Stamina Points to activate Eyes of the Raven!");
          return;
        }
        await this.actor.update({
          'system.eyesOfTheRavenActive': true,
          'system.stamina': currentSP - 1
        });
      } else {
        // Deactivating — free
        await this.actor.update({ 'system.eyesOfTheRavenActive': false });
      }
      const tokenImg = this.actor.prototypeToken?.texture?.src || this.actor.img || 'icons/svg/mystery-man.svg';
      const ownerColor = this._getOwnerColor();
      const statusText = !isActive ? 'activates' : 'dismisses';
      const statusGlow = !isActive ? 'color: #90EE90;' : 'color: #999;';
      const chatContent = `
        <div class="spell-chat-card" style="border-color: ${ownerColor};">
          <div class="spell-chat-header">
            ${buildPortraitHtml(tokenImg)}
            <div class="spell-chat-title">
              <strong>${this.actor.name}</strong> ${statusText} <strong>Eyes of the Raven</strong>
            </div>
          </div>
          <div class="spell-chat-body">
            <div class="spell-chat-effect" style="${statusGlow}">${!isActive ? 'Heightened perception — +2 Edge to Perception checks.' : 'The supernatural sight fades.'}</div>
            <div class="spell-chat-meta"><strong>Cost:</strong> ${!isActive ? '1 SP' : 'Free'} &nbsp;|&nbsp; <strong>Duration:</strong> Until deactivated</div>
          </div>
        </div>`;
      await ChatMessage.create({
        speaker: ChatMessage.getSpeaker({ actor: this.actor }),
        content: chatContent
      });
      return;
    }

    // Special handling for Fearsome Ward - tier dialog, target enemy, Wits check
    if (spellId === 'fearsome-ward') {
      const fwState = this.actor.system.fearsomeWardState || 'ready';
      if (fwState === 'active') {
        ui.notifications.info('Fearsome Ward is already active.');
        return;
      }
      if (fwState === 'spent') {
        ui.notifications.warn('Fearsome Ward has already been used this combat.');
        return;
      }
      await this._onFearsomeWardCast(spell, spellIcon);
      return;
    }

    // Special handling for Beast Form - transform into origin beast
    if (spellId === 'beast-form') {
      if (this.actor.system.beastFormData?.active) {
        ui.notifications.info('Beast Form is already active.');
        return;
      }
      await this._handleBeastFormCast(spell, spellIcon);
      return;
    }

    // Mesmerism: guard against double-cast, then fall through to generic sorcery attack
    if (spellId === 'mesmerism') {
      if (this.actor.getFlag('conan', 'mesmerismCaster')?.active) {
        ui.notifications.info('Mesmerism is already active. Dismiss it first.');
        return;
      }
      // Falls through to generic cost handling + sorcery attack flow below
    }

    // Special handling for Bloodhound - name input dialog, persistent tracking bond
    if (spellId === 'bloodhound') {
      if (this.actor.system.bloodhoundTarget) {
        ui.notifications.info(`Bloodhound is already tracking ${this.actor.system.bloodhoundTarget}. Dismiss it first.`);
        return;
      }
      const ownerColor = this._getOwnerColor();
      const tokenImg = this.actor.prototypeToken?.texture?.src || this.actor.img || 'icons/svg/mystery-man.svg';
      new Dialog({
        title: 'Bloodhound — Name the Target',
        content: `<form><div class="form-group"><label>Target Name</label><input type="text" name="targetName" placeholder="Enter the target's name..." autofocus/></div></form>`,
        buttons: {
          bond: {
            icon: '<i class="fas fa-link"></i>',
            label: 'Form Bond',
            callback: async (html) => {
              const targetName = html.find('[name="targetName"]').val()?.trim();
              if (!targetName) {
                ui.notifications.warn('You must enter a target name.');
                return;
              }
              await this.actor.update({
                'system.bloodhoundTarget': targetName,
                'system.buffsDebuffs.bloodhound': true
              });
              ChatMessage.create({
                speaker: ChatMessage.getSpeaker({ actor: this.actor }),
                content: `<div class="spell-chat-card" style="border-color: ${ownerColor};"><div class="spell-chat-header">${buildPortraitHtml(tokenImg)}<div class="spell-chat-title"><span class="spell-chat-name">${spell.name}</span><span class="spell-chat-type">Demonic Magic</span></div></div><div class="spell-chat-body"><div class="spell-chat-effect">${this.actor.name} draws the blood across ${this._pronoun('possessive')} tongue. The bond is sealed.<br><strong>${targetName}</strong> can escape only in death.</div></div></div>`,
                rollMode: game.settings.get('core', 'rollMode')
              });
            }
          }
        },
        default: 'bond'
      }).render(true);
      return;
    }

    // Special handling for Bloody Talons - +1d6 unarmed damage until end of combat
    if (spellId === 'bloody-talons') {
      if (this.actor.system.bloodyTalonsActive) {
        ui.notifications.warn('Bloody Talons is already active!');
        return;
      }
      if (this.actor.system.bloodyTalonsSpent) {
        ui.notifications.warn('Bloody Talons has already been used this combat.');
        return;
      }
      const lpCost = 4;
      const currentLP = this.actor.system.lifePoints?.value || 0;
      if (currentLP < lpCost) {
        ui.notifications.warn(`Not enough Life Points! Need ${lpCost} LP, have ${currentLP}.`);
        return;
      }
      await this._deductSpellCost(lpCost, 0, spell.name);

      // Auto-arm unarmed if not already armed
      const armedWeapons = this.actor.system.armedWeapons || {};
      const hasUnarmed = Object.values(armedWeapons).some(w => w.name === 'Unarmed' || w.category === 'Unarmed');
      const updates = { 'system.bloodyTalonsActive': true };
      if (!hasUnarmed) {
        const catalog = this._getWeaponCatalog();
        const unarmedData = { ...catalog.melee.unarmed, id: 'unarmed' };
        const newId = foundry.utils.randomID();
        updates[`system.armedWeapons.${newId}`] = unarmedData;
      }
      await this.actor.update(updates);

      const ownerColor = this._getOwnerColor();
      const tokenImg = this.actor.prototypeToken?.texture?.src || this.actor.img || 'icons/svg/mystery-man.svg';
      ChatMessage.create({
        speaker: ChatMessage.getSpeaker({ actor: this.actor }),
        content: `<div class="spell-chat-card" style="border-color: ${ownerColor};">
          <div class="spell-chat-header">
            ${buildPortraitHtml(tokenImg)}
            <div class="spell-chat-title"><span class="spell-chat-name">${spell.name}</span><span class="spell-chat-type">Demonic Magic</span></div>
          </div>
          <div class="spell-chat-body">
            <div class="spell-chat-effect"><em>${this.actor.name}'s fingers twist and darken as razor-sharp talons erupt from ${this._pronoun('possessive')} flesh.</em><br><strong>+1d6 unarmed damage until end of combat.</strong></div>
            <div class="spell-chat-meta"><strong>Cost:</strong> ${lpCost} LP</div>
          </div>
        </div>`,
        rollMode: game.settings.get('core', 'rollMode')
      });
      return;
    }

    // Special handling for Demonic Steed - mounted status with LP maintenance
    if (spellId === 'demonic-steed') {
      if (this.actor.system.demonicSteedActive) {
        ui.notifications.warn('Demonic Steed is already active!');
        return;
      }
      const currentSP = this.actor.system.stamina || 0;
      if (currentSP < 1) {
        ui.notifications.warn('Not enough Stamina Points! Need 1 SP.');
        return;
      }
      await this._deductSpellCost(0, 1, spell.name);
      await this.actor.update({
        'system.demonicSteedActive': true,
        'system.conditions.mounted': true
      });

      const ownerColor = this._getOwnerColor();
      const tokenImg = this.actor.prototypeToken?.texture?.src || this.actor.img || 'icons/svg/mystery-man.svg';
      ChatMessage.create({
        speaker: ChatMessage.getSpeaker({ actor: this.actor }),
        content: `<div class="spell-chat-card" style="border-color: ${ownerColor};">
          <div class="spell-chat-header">
            ${buildPortraitHtml(tokenImg)}
            <div class="spell-chat-title"><span class="spell-chat-name">${spell.name}</span><span class="spell-chat-type">Demonic Magic</span></div>
          </div>
          <div class="spell-chat-body">
            <div class="spell-chat-effect"><em>Dark smoke coils at ${this.actor.name}'s feet as a spectral steed rises from the ground beneath ${this._pronoun('object')}. ${this.actor.name} is now Mounted.</em></div>
            <div class="spell-chat-meta"><strong>Cost:</strong> 1 SP &bull; <strong>Maintenance:</strong> 2 LP/round</div>
          </div>
        </div>`,
        rollMode: game.settings.get('core', 'rollMode')
      });
      return;
    }

    // Special handling for Demonic Ward - Wits check 8, toggle 50% non-sorcery damage reduction
    if (spellId === 'demonic-ward') {
      // If already active, dismiss it
      if (this.actor.system.buffsDebuffs?.demonicWard) {
        await this.actor.update({ 'system.buffsDebuffs.demonicWard': false });
        const tokenImg = this.actor.prototypeToken?.texture?.src || this.actor.img || 'icons/svg/mystery-man.svg';
        ChatMessage.create({
          speaker: ChatMessage.getSpeaker({ actor: this.actor }),
          content: `<div class="spell-chat-card" style="border-color: #666;">
            <div class="spell-chat-header">
              ${buildPortraitHtml(tokenImg)}
              <div class="spell-chat-title"><span class="spell-chat-name">Demonic Ward Dismissed</span><span class="spell-chat-type">Demonic Magic</span></div>
            </div>
            <div class="spell-chat-body">
              <div class="spell-chat-effect"><em>The ward's sigils fade from ${this.actor.name}'s skin.</em></div>
            </div>
          </div>`
        });
        return;
      }

      // Full Wits check with all bonuses + flex die (mirrors _onRollAttribute)
      const { die, value, skillDieUpgrade, skillValueBonus } = this._getEffectiveStatValues('wits');
      const originBonuses = this._getActiveOriginBonuses();
      const statBonus = originBonuses.statChecks['wits'] || 0;

      // Inspire spell (+2 to all Checks while active)
      const inspireActive = this.actor.system.inspireSpellActive === 'active' || this.actor.system.inspireSpellActive === 'warning';
      const inspireBonus = inspireActive ? 2 : 0;

      // Captured Soul (+2 to next Check or Attack when primed, then consumed)
      const soulPrimed = this.actor.system.capturedSoulState === 'primed';
      const soulBonus = soulPrimed ? 2 : 0;
      if (soulPrimed) {
        this.actor.update({ 'system.capturedSoulState': null });
      }

      // Poison: checksDown — silent -1 penalty
      const poisonEffects = this.actor.getFlag('conan', 'poisonEffects');
      const poisonPenalty = (poisonEffects?.active && poisonEffects.effects?.checksDown) ? -1 : 0;

      // Build roll formula
      let rollFormula = `1${die} + ${value}`;
      if (statBonus > 0) rollFormula += ` + ${statBonus}`;
      if (inspireBonus > 0) rollFormula += ` + ${inspireBonus}`;
      if (soulBonus > 0) rollFormula += ` + ${soulBonus}`;
      if (poisonPenalty !== 0) rollFormula += ` - 1`;

      const roll = new Roll(rollFormula, this.actor.getRollData());
      await roll.evaluate();

      const windsOfFate = WindsOfFateDialog.getValueForActor(this.actor);
      const adjustedTotal = roll.total + windsOfFate;
      const difficulty = 8;
      const success = adjustedTotal >= difficulty;

      const flexData = await this._rollFlexDie('skill', true);
      const cruelFate = this._checkCruelFate(roll);
      const ownerColor = this._getOwnerColor();
      const tokenImg = this.actor.prototypeToken?.texture?.src || this.actor.img || 'icons/svg/mystery-man.svg';
      const dieResult = roll.terms[0]?.results?.[0]?.result || roll.total - value;

      // Activate ward on success
      if (success) {
        await this.actor.update({ 'system.buffsDebuffs.demonicWard': true });
      }

      // Build breakdown
      const buildWardBreakdown = (includeFlex) => {
        let html = `<div class="skill-breakdown" style="display: none;">`;
        html += `<div class="breakdown-header">Wits Check Breakdown</div>`;
        html += `<div class="breakdown-line"><span class="breakdown-label">Base Roll</span><span class="breakdown-value">1${die} → ${dieResult}</span></div>`;
        html += `<div class="breakdown-line"><span class="breakdown-label">Wits</span><span class="breakdown-value">+${value}</span></div>`;
        if (skillDieUpgrade) html += `<div class="breakdown-line skill-bonus"><span class="breakdown-label">Die Upgrade</span><span class="breakdown-value">${skillDieUpgrade}</span></div>`;
        if (skillValueBonus) html += `<div class="breakdown-line skill-bonus"><span class="breakdown-label">Skill Bonus</span><span class="breakdown-value">${skillValueBonus}</span></div>`;
        if (statBonus > 0) html += `<div class="breakdown-line skill-bonus"><span class="breakdown-label">Origin</span><span class="breakdown-value">+${statBonus}</span></div>`;
        if (inspireBonus > 0) html += `<div class="breakdown-line skill-bonus"><span class="breakdown-label">Inspire</span><span class="breakdown-value">+${inspireBonus}</span></div>`;
        if (soulBonus > 0) html += `<div class="breakdown-line skill-bonus" style="color: #DC143C;"><span class="breakdown-label">Captured Soul</span><span class="breakdown-value">+${soulBonus}</span></div>`;
        if (poisonPenalty !== 0) html += `<div class="breakdown-line breakdown-poison"><span class="breakdown-label">Venom</span><span class="breakdown-value">-1</span></div>`;
        if (windsOfFate !== 0) html += `<div class="breakdown-line skill-bonus" style="color: #c9a668;"><span class="breakdown-label">Winds of Fate</span><span class="breakdown-value">${windsOfFate > 0 ? '+' : ''}${windsOfFate}</span></div>`;
        html += `<div class="breakdown-line breakdown-total"><span class="breakdown-label">TOTAL</span><span class="breakdown-value">${adjustedTotal}</span></div>`;
        html += `<div class="breakdown-line"><span class="breakdown-label">Difficulty</span><span class="breakdown-value">${difficulty}</span></div>`;
        if (includeFlex) html += `<div class="breakdown-line flex-line"><span class="breakdown-label">Flex Die (${flexData.die})</span><span class="breakdown-value">${flexData.result}</span></div>`;
        html += `</div>`;
        return html;
      };

      // Success/fail result line
      const resultColor = success ? '#90EE90' : '#ff6b6b';
      const resultText = success ? 'Success!' : 'Failed!';
      const effectText = success
        ? `<em>Dark sigils burn across ${this.actor.name}'s skin as a demonic ward takes hold.</em><br><strong>Non-sorcery damage halved. Maintained: 1 Action.</strong>`
        : `<em>${this.actor.name} traces the ward sigils but the magic fails to take hold.</em>`;

      if (flexData.triggered) {
        // Build normalContent for stamina choice fallback
        let normalContent = `<div class="conan-roll spell-chat-card" style="border-color: ${ownerColor};">`;
        normalContent += `<div class="spell-chat-header">`;
        normalContent += buildPortraitHtml(tokenImg);
        normalContent += `<div class="spell-chat-title"><strong>${spell.name}</strong> — <span style="font-size: 13px; color: #b8a0d0;">Demonic Magic</span></div>`;
        normalContent += `</div>`;
        normalContent += `<div class="spell-chat-body">`;
        normalContent += `<div class="spell-chat-effect">${effectText}</div>`;
        if (cruelFate) normalContent += `<div class="cruel-fate-indicator">Cruel Fate</div>`;
        normalContent += `<div class="skill-result-box clickable-breakdown" style="cursor: pointer;">${adjustedTotal}</div>`;
        normalContent += buildWardBreakdown(false);
        normalContent += `<div class="spell-chat-meta"><strong>Wits Check:</strong> ${adjustedTotal} vs ${difficulty} — <span style="color: ${resultColor};">${resultText}</span></div>`;
        normalContent += `</div></div>`;

        const flexChoiceData = {
          actorId: this.actor.id,
          rollType: 'skill',
          celebData: flexData.celebData,
          normalContent: normalContent,
          rollLabel: `Demonic Ward Wits Check`,
          rollTotal: adjustedTotal
        };

        const flexCardContent = this._buildFlexChoiceCard('spell', flexData, flexChoiceData, tokenImg, ownerColor);

        ChatMessage.create({
          speaker: ChatMessage.getSpeaker({ actor: this.actor }),
          content: flexCardContent,
          rolls: [roll, flexData.roll],
          rollMode: game.settings.get('core', 'rollMode')
        });
      } else {
        // No flex - show full result card
        let content = `<div class="conan-roll spell-chat-card" style="border-color: ${ownerColor};">`;
        content += `<div class="spell-chat-header">`;
        content += buildPortraitHtml(tokenImg);
        content += `<div class="spell-chat-title"><strong>${spell.name}</strong> — <span style="font-size: 13px; color: #b8a0d0;">Demonic Magic</span></div>`;
        content += `</div>`;
        content += `<div class="spell-chat-body">`;
        content += `<div class="spell-chat-effect">${effectText}</div>`;
        if (cruelFate) content += `<div class="cruel-fate-indicator">Cruel Fate</div>`;
        content += `<div class="skill-result-box clickable-breakdown" style="cursor: pointer;">${adjustedTotal}</div>`;
        content += buildWardBreakdown(true);
        content += `<div class="spell-chat-meta"><strong>Wits Check:</strong> ${adjustedTotal} vs ${difficulty} — <span style="color: ${resultColor};">${resultText}</span></div>`;
        if (flexData.suppressed) {
          const venomMsg = VENOM_FLEX_MESSAGES[Math.floor(Math.random() * VENOM_FLEX_MESSAGES.length)];
          content += `<div style="padding: 6px 10px; margin-top: 6px; background: rgba(50,205,50,0.1); border-left: 2px solid #32CD32; border-radius: 2px; color: #32CD32; font-style: italic; font-size: 15px;">${venomMsg}</div>`;
        }
        content += `</div></div>`;

        ChatMessage.create({
          speaker: ChatMessage.getSpeaker({ actor: this.actor }),
          content: content,
          rolls: [roll, flexData.roll],
          rollMode: game.settings.get('core', 'rollMode')
        });
      }
      return;
    }

    // Special handling for Uncanny Reach - touch→close, +1 melee damage, maintained 1 LP/turn
    if (spellId === 'uncanny-reach') {
      if (this.actor.system.uncannyReachActive) {
        // Toggle off
        await this.actor.update({ 'system.uncannyReachActive': false });
        const tokenImg = this.actor.prototypeToken?.texture?.src || this.actor.img || 'icons/svg/mystery-man.svg';
        ChatMessage.create({
          speaker: ChatMessage.getSpeaker({ actor: this.actor }),
          content: `<div class="spell-chat-card" style="border-color: #666;">
            <div class="spell-chat-header">
              ${buildPortraitHtml(tokenImg)}
              <div class="spell-chat-title"><span class="spell-chat-name">Uncanny Reach Dismissed</span><span class="spell-chat-type">Demonic Magic</span></div>
            </div>
            <div class="spell-chat-body">
              <div class="spell-chat-effect"><em>${this.actor.name}'s limbs retract to their natural length as the dark magic fades.</em></div>
            </div>
          </div>`
        });
        return;
      }
      await this._deductSpellCost(2, 0, spell.name);
      await this.actor.update({ 'system.uncannyReachActive': true });

      const ownerColor = this._getOwnerColor();
      const tokenImg = this.actor.prototypeToken?.texture?.src || this.actor.img || 'icons/svg/mystery-man.svg';
      ChatMessage.create({
        speaker: ChatMessage.getSpeaker({ actor: this.actor }),
        content: `<div class="spell-chat-card" style="border-color: ${ownerColor};">
          <div class="spell-chat-header">
            ${buildPortraitHtml(tokenImg)}
            <div class="spell-chat-title"><span class="spell-chat-name">${spell.name}</span><span class="spell-chat-type">Demonic Magic</span></div>
          </div>
          <div class="spell-chat-body">
            <div class="spell-chat-effect"><em>${this.actor.name}'s arms elongate unnaturally, fingers stretching into impossible lengths.</em><br><strong>Touch → Close range. +1 melee damage.</strong></div>
            <div class="spell-chat-meta"><strong>Cost:</strong> 2 LP &bull; <strong>Maintenance:</strong> 1 LP/turn</div>
          </div>
        </div>`,
        rollMode: game.settings.get('core', 'rollMode')
      });
      return;
    }

    // Special handling for Frightful Aura - target enemies, apply -2 Wits/Grit debuff
    if (spellId === 'frightful-aura') {
      const faState = this.actor.system.frightfulAuraState || 'ready';
      if (faState === 'active') {
        ui.notifications.info('Frightful Aura is already active.');
        return;
      }
      if (faState === 'spent') {
        ui.notifications.warn('Frightful Aura has already been used this combat.');
        return;
      }
      const currentSP = this.actor.system.stamina || 0;
      if (currentSP < 1) {
        ui.notifications.warn('Not enough Stamina Points! Need 1 SP.');
        return;
      }
      await this._onFrightfulAuraCast(spell, spellIcon);
      return;
    }

    // Special handling for Astral Projection - three-state (ready → active → spent)
    if (spellId === 'astral-projection') {
      const apState = this.actor.system.astralProjectionState || 'ready';
      if (apState === 'active') {
        ui.notifications.info('Astral Projection is active. Click the icon on your stat bar to end it.');
        return;
      }
      if (apState === 'spent') {
        ui.notifications.warn('Astral Projection has already been used. Reset it from the spell card.');
        return;
      }
      await this._onAstralProjectionToggle('activate');
      return;
    }

    // Special handling for Snake Arrow - buff next ranged attack with +1d6 and poison
    if (spellId === 'snake-arrow') {
      if (this.actor.system.snakeArrowActive) {
        ui.notifications.warn('Snake Arrow is already active! Make a ranged attack first.');
        return;
      }
      const lpCost = 3;
      const currentLP = this.actor.system.lifePoints?.value || 0;
      if (currentLP < lpCost) {
        ui.notifications.warn(`Not enough Life Points! Need ${lpCost} LP, have ${currentLP}.`);
        return;
      }
      await this._deductSpellCost(lpCost, 0, spell.name);
      await this.actor.update({ 'system.snakeArrowActive': true });
      const ownerColor = this._getOwnerColor();
      const tokenImg = this.actor.prototypeToken?.texture?.src || this.actor.img || 'icons/svg/mystery-man.svg';
      ChatMessage.create({
        speaker: ChatMessage.getSpeaker({ actor: this.actor }),
        content: `<div class="conan-roll spell-chat-card" style="border-color: ${ownerColor};">
          <div class="spell-chat-header">
            ${buildPortraitHtml(tokenImg)}
            <div class="spell-chat-title"><strong>${this.actor.name}</strong> casts <strong>Snake Arrow</strong></div>
          </div>
          <div class="spell-chat-body">
            <div class="spell-chat-effect"><em>Next ranged attack deals +1d6 damage and poisons the target!</em></div>
            <div class="spell-chat-meta"><strong>Cost:</strong> ${lpCost} LP</div>
          </div>
        </div>`,
        rollMode: game.settings.get('core', 'rollMode')
      });
      return;
    }

    // Special handling for Call Beast - custom dialog to select beast type (LP cost varies)
    if (spellId === 'call-beast') {
      await this._handleCallBeastCast(spell, spellIcon);
      return;
    }

    // Special handling for Counter Ward - reactive Wits contest
    if (spellId === 'counter-ward') {
      if (game.conan?.counterWardAlert) {
        game.conan.triggerCounterWard();
      } else {
        ui.notifications.info('No enemy spell to counter. Counter Ward is a reaction spell.');
      }
      return;
    }

    // Special handling for Inspire - dialog to select ally, apply +2 buff and +1 SP
    if (spellId === 'inspire') {
      await this._handleInspireCast(spell, spellIcon);
      return;
    }

    // Special handling for Healing - dialog to select target
    if (spellId === 'healing') {
      await this._handleHealingCast(spell, spellIcon);
      return;
    }

    // Special handling for Favor of the Four Winds
    if (spellId === 'favor-four-winds') {
      await this._handleFavorFourWindsCast(spell, spellIcon);
      return;
    }

    // Death Sight: narrative spell — post flavor chat, no mechanical effect (free)
    if (spellId === 'death-sight') {
      const ownerColor = this._getOwnerColor();
      const tokenImg = this.actor.prototypeToken?.texture?.src || this.actor.img || 'icons/svg/mystery-man.svg';
      ChatMessage.create({
        speaker: ChatMessage.getSpeaker({ actor: this.actor }),
        content: `<div class="spell-chat-card" style="border-color: ${ownerColor};">
          <div class="spell-chat-header">
            ${buildPortraitHtml(tokenImg)}
            <div class="spell-chat-title"><span class="spell-chat-name">${spell.name}</span><span class="spell-chat-type">Necromantic Magic</span></div>
          </div>
          <div class="spell-chat-body">
            <div class="spell-chat-effect"><em>${this.actor.name} presses ${this._pronoun('possessive')} lips to cold flesh, tastes the scent of stale blood, and sinks ${this._pronoun('possessive')} fingers into the corpse — learning how and when death arrived.</em></div>
            <div class="spell-chat-meta"><strong>Cost:</strong> Free &bull; <strong>Actions:</strong> 1</div>
          </div>
        </div>`,
        rollMode: game.settings.get('core', 'rollMode')
      });
      return;
    }

    // Chilling Presence: toggle aura on/off (free action, no cost)
    if (spellId === 'chilling-presence') {
      const isActive = this.actor.system.chillingPresenceActive || false;
      await this.actor.update({ 'system.chillingPresenceActive': !isActive });
      const tokenImg = this.actor.prototypeToken?.texture?.src || this.actor.img || 'icons/svg/mystery-man.svg';
      const ownerColor = this._getOwnerColor();
      const statusGlow = !isActive ? 'color: #90EE90;' : 'color: #999;';
      const flavorText = !isActive
        ? `The air around ${this.actor.name} grows deathly cold. Breath turns to mist, small flames gutter and die, and the living draw back from the unnatural chill that clings to ${this._pronoun('object')} like a shroud.`
        : `The cold recedes as ${this.actor.name} releases ${this._pronoun('possessive')} grip on the veil between life and death.`;
      await ChatMessage.create({
        speaker: ChatMessage.getSpeaker({ actor: this.actor }),
        content: `<div class="spell-chat-card" style="border-color: ${ownerColor};">
          <div class="spell-chat-header">
            ${buildPortraitHtml(tokenImg)}
            <div class="spell-chat-title"><span class="spell-chat-name">${spell.name}</span><span class="spell-chat-type">Necromantic Magic</span></div>
          </div>
          <div class="spell-chat-body">
            <div class="spell-chat-effect" style="${statusGlow}"><em>${flavorText}</em></div>
            <div class="spell-chat-meta"><strong>Cost:</strong> Free &bull; <strong>Duration:</strong> Until dismissed</div>
          </div>
        </div>`
      });
      return;
    }

    // Stamina Leech: gain 1 SP — choose 6 LP or free (corpse nearby)
    if (spellId === 'stamina-leech') {
      const ownerColor = this._getOwnerColor();
      const tokenImg = this.actor.prototypeToken?.texture?.src || this.actor.img || 'icons/svg/mystery-man.svg';
      const currentSP = this.actor.system.stamina || 0;
      const currentLP = this.actor.system.lifePoints?.value ?? 0;
      const canPayLP = currentLP >= 6;

      new Dialog({
        title: 'Stamina Leech',
        content: `<div style="text-align:center; padding: 8px;">
          <p style="margin: 4px 0; color: #ccc;">Gain <strong>1 Stamina Point</strong></p>
          <p style="margin: 4px 0; color: #888; font-size: 0.85em;">SP: ${currentSP} &bull; LP: ${currentLP}</p>
        </div>`,
        buttons: {
          pay: {
            label: `Cast Normal (6 LP)`,
            callback: async () => {
              if (!canPayLP) {
                ui.notifications.warn('Not enough Life Points (need 6).');
                return;
              }
              await this._deductSpellCost(6, 0, spell.name);
              const newSP = (this.actor.system.stamina || 0) + 1;
              await this.actor.update({ 'system.stamina': newSP });
              ChatMessage.create({
                speaker: ChatMessage.getSpeaker({ actor: this.actor }),
                content: `<div class="spell-chat-card" style="border-color: ${ownerColor};">
                  <div class="spell-chat-header">
                    ${buildPortraitHtml(tokenImg)}
                    <div class="spell-chat-title"><span class="spell-chat-name">${spell.name}</span><span class="spell-chat-type">Necromantic Magic</span></div>
                  </div>
                  <div class="spell-chat-body">
                    <div class="spell-chat-effect"><em>${this.actor.name} draws upon ${this._pronoun('possessive')} own life force, blood darkening beneath the skin as vitality is converted to raw will.</em></div>
                    <div class="spell-chat-meta"><strong>Cost:</strong> 6 LP &bull; <strong>SP:</strong> ${newSP - 1} → ${newSP}</div>
                  </div>
                </div>`,
                rollMode: game.settings.get('core', 'rollMode')
              });
            }
          },
          free: {
            label: `Corpse Leech`,
            callback: async () => {
              const newSP = (this.actor.system.stamina || 0) + 1;
              await this.actor.update({ 'system.stamina': newSP });
              ChatMessage.create({
                speaker: ChatMessage.getSpeaker({ actor: this.actor }),
                content: `<div class="spell-chat-card" style="border-color: ${ownerColor};">
                  <div class="spell-chat-header">
                    ${buildPortraitHtml(tokenImg)}
                    <div class="spell-chat-title"><span class="spell-chat-name">${spell.name}</span><span class="spell-chat-type">Necromantic Magic</span></div>
                  </div>
                  <div class="spell-chat-body">
                    <div class="spell-chat-effect"><em>${this.actor.name} kneels beside the fallen, pressing a hand to the cold flesh. A faint shudder passes through the corpse as the last dregs of life are siphoned away — the dead have no use for what remains.</em></div>
                    <div class="spell-chat-meta"><strong>Cost:</strong> Free (corpse) &bull; <strong>SP:</strong> ${newSP - 1} → ${newSP}</div>
                  </div>
                </div>`,
                rollMode: game.settings.get('core', 'rollMode')
              });
            }
          }
        },
        default: canPayLP ? 'pay' : 'free'
      }).render(true);
      return;
    }

    // Capture Soul: 1 SP cost, heal WitsDie LP, capture soul (one max)
    if (spellId === 'capture-soul') {
      const currentSoulState = this.actor.system.capturedSoulState || null;
      if (currentSoulState === 'captured' || currentSoulState === 'primed') {
        ui.notifications.warn('You already hold a captured soul. Release it before capturing another.');
        return;
      }
      const currentSP = this.actor.system.stamina || 0;
      if (currentSP < 1) {
        ui.notifications.warn('Not enough Stamina Points (need 1).');
        return;
      }
      // Deduct 1 SP
      await this._deductSpellCost(0, 1, spell.name);
      // Heal WitsDie LP
      const witsAttr = this.actor.system.attributes.wits;
      const healRoll = new Roll(`1${witsAttr.die}`);
      await healRoll.evaluate();
      const healAmount = healRoll.total;
      const currentLP = this.actor.system.lifePoints?.value ?? 0;
      const maxLP = this._getCalculatedMaxLP();
      const newLP = Math.min(maxLP, currentLP + healAmount);
      const actualHeal = newLP - currentLP;
      await this.actor.update({
        'system.lifePoints.value': newLP,
        'system.capturedSoulState': 'captured'
      });
      // Floating green heal on caster token
      const casterToken = canvas.tokens?.placeables?.find(t => t.actor?.id === this.actor.id);
      if (casterToken && typeof showFloatingDamage === 'function') {
        showFloatingDamage(casterToken.id, -actualHeal, false, false, true);
        game.socket?.emit('system.conan', { action: 'floatingDamage', tokenId: casterToken.id, damage: -actualHeal, isDead: false, isWounded: false, isHealing: true });
      }
      const ownerColor = this._getOwnerColor();
      const tokenImg = this.actor.prototypeToken?.texture?.src || this.actor.img || 'icons/svg/mystery-man.svg';
      ChatMessage.create({
        speaker: ChatMessage.getSpeaker({ actor: this.actor }),
        content: `<div class="spell-chat-card" style="border-color: ${ownerColor};">
          <div class="spell-chat-header">
            ${buildPortraitHtml(tokenImg)}
            <div class="spell-chat-title"><span class="spell-chat-name">${spell.name}</span><span class="spell-chat-type">Necromantic Magic</span></div>
          </div>
          <div class="spell-chat-body">
            <div class="spell-chat-effect" style="color: #90EE90;"><em>${this.actor.name} presses ${this._pronoun('possessive')} foot upon the corpse, commanding it to yield. Eyes and mouth blaze with an eerie light as its howling soul is ripped back from the abyss. A new plaything to be kept or spent as ${this._pronoun('subject')} pleases.</em></div>
            <div class="spell-chat-meta"><strong>Cost:</strong> 1 SP &bull; <strong>Healed:</strong> ${actualHeal} LP (${witsAttr.die}: ${healRoll.total}) &bull; <strong>Soul:</strong> Captured</div>
          </div>
        </div>`,
        rolls: [healRoll],
        rollMode: game.settings.get('core', 'rollMode')
      });
      return;
    }

    // Check if spell has any cost
    const hasCost = spell.cost && (spell.cost.lp || spell.cost.sp);
    let paidLpCost = 0;
    let paidSpCost = 0;
    game.conan.lastSpellCostRegained = false;

    if (hasCost) {
      // Confirm spell cast and get resolved costs
      const costResult = await this._confirmSpellCast(spell);
      if (!costResult) {
        // User cancelled
        return;
      }

      // Special handling for Create Bane Weapon - defer cost until target confirmed
      if (spellId === 'create-bane-weapon') {
        await this._handleBaneWeaponCast(costResult.lp, costResult.sp);
        return; // Bane Weapon has its own chat message
      }

      // Deduct the costs (for all other spells)
      await this._deductSpellCost(costResult.lp, costResult.sp, spell.name);
      paidLpCost = costResult.lp || 0;
      paidSpCost = costResult.sp || 0;

      // Poison: noStamina — if spell had SP cost, it fizzles (SP already spent)
      if (costResult.sp > 0) {
        const poisonEffects = this.actor.getFlag('conan', 'poisonEffects');
        if (poisonEffects?.active && poisonEffects.effects?.noStamina) {
          const ownerColor = this._getOwnerColor();
          const tokenImg = this.actor.prototypeToken?.texture?.src || this.actor.img || 'icons/svg/mystery-man.svg';
          ChatMessage.create({
            speaker: ChatMessage.getSpeaker({ actor: this.actor }),
            content: `<div class="conan-roll spell-chat-card" style="border-color: ${ownerColor};">
              <div class="spell-chat-header">
                <div class="spell-chat-portrait-wrap">
                  <img src="${tokenImg}" class="spell-chat-portrait"/>
                  <img src="${spellIcon}" class="spell-chat-badge" alt="${spell.name}"/>
                </div>
                <div class="spell-chat-title"><strong>${this.actor.name}</strong> attempts <strong>${spell.name}</strong></div>
              </div>
              <div class="spell-chat-body">
                <div class="spell-chat-effect" style="color: #32CD32;">${VENOM_SPELL_MESSAGES[Math.floor(Math.random() * VENOM_SPELL_MESSAGES.length)]}</div>
                <div class="spell-chat-meta"><strong>Cost:</strong> ${costResult.sp} SP (wasted)</div>
              </div>
            </div>`
          });
          return;
        }
      }

      // Special handling for Animate Living Statue - spell badge becomes draggable summon
      if (spellId === 'animate-living-statue') {
        const tokenImg = this.actor.prototypeToken?.texture?.src || this.actor.img || 'icons/svg/mystery-man.svg';
        const ownerColor = this._getOwnerColor();
        const costDisplay = this._formatSpellCost(spell.cost);
        const casterName = this.actor.name.replace(/'/g, '&#39;');
        const summonData = `{"enemyId":"living-statue-stone","category":"inanimate","group":"living-statues","casterName":"${casterName}"}`;

        let content = `<div class="conan-roll spell-chat-card" style="border-color: ${ownerColor};">`;
        content += `<div class="spell-chat-header">`;
        // Custom portrait HTML — badge has data-summon for drag-to-canvas
        content += `<div class="spell-chat-portrait-wrap">`;
        content += `<img src="${tokenImg}" class="spell-chat-portrait"/>`;
        content += `<img src="${spellIcon}" class="spell-chat-badge spell-summon-badge" alt="${spell.name}" data-summon='${summonData}' title="Drag onto the map to place your Living Statue"/>`;
        content += `</div>`;
        content += `<div class="spell-chat-title"><strong>${this.actor.name}</strong> casts <strong>Animate Living Statue</strong></div>`;
        content += `</div>`;
        content += `<div class="spell-chat-body">`;
        content += `<div class="spell-chat-effect">${spell.effect}</div>`;
        content += `<div class="spell-chat-meta"><strong>Cost:</strong> ${costDisplay}</div>`;
        content += `</div></div>`;

        await ChatMessage.create({
          speaker: ChatMessage.getSpeaker({ actor: this.actor }),
          content: content
        });
        return;
      }

      // Summon Fiend — drag-to-canvas summon
      if (spellId === 'summon-fiend') {
        const tokenImg = this.actor.prototypeToken?.texture?.src || this.actor.img || 'icons/svg/mystery-man.svg';
        const ownerColor = this._getOwnerColor();
        const costDisplay = this._formatSpellCost(spell.cost);
        const casterName = this.actor.name.replace(/'/g, '&#39;');
        const summonData = `{"enemyId":"fiend","category":"demons","group":"lesser-demons","casterName":"${casterName}","tokenImg":"systems/conan/images/enemies/fiend_token.png","portraitImg":"systems/conan/images/enemies/fiend_portrait.png"}`;

        let content = `<div class="conan-roll spell-chat-card" style="border-color: ${ownerColor};">`;
        content += `<div class="spell-chat-header">`;
        content += `<div class="spell-chat-portrait-wrap">`;
        content += `<img src="${tokenImg}" class="spell-chat-portrait"/>`;
        content += `<img src="${spellIcon}" class="spell-chat-badge spell-summon-badge" alt="${spell.name}" data-summon='${summonData}' title="Drag onto the map to place your Fiend"/>`;
        content += `</div>`;
        content += `<div class="spell-chat-title"><strong>${this.actor.name}</strong> casts <strong>Summon Fiend</strong></div>`;
        content += `</div>`;
        content += `<div class="spell-chat-body">`;
        content += `<div class="spell-chat-effect"><em>Dark sigils burn in the air as ${this.actor.name} tears a rift between worlds. A Fiend claws its way through, bound to the sorcerer's will.</em><br><strong>${spell.effect}</strong></div>`;
        content += `<div class="spell-chat-meta"><strong>Cost:</strong> ${costDisplay}</div>`;
        content += `</div></div>`;

        await ChatMessage.create({
          speaker: ChatMessage.getSpeaker({ actor: this.actor }),
          content: content
        });
        return;
      }

      // Summon Horror — drag-to-canvas summon
      if (spellId === 'summon-horror') {
        const tokenImg = this.actor.prototypeToken?.texture?.src || this.actor.img || 'icons/svg/mystery-man.svg';
        const ownerColor = this._getOwnerColor();
        const costDisplay = this._formatSpellCost(spell.cost);
        const casterName = this.actor.name.replace(/'/g, '&#39;');
        const summonData = `{"enemyId":"horror","category":"demons","group":"lesser-demons","casterName":"${casterName}"}`;

        let content = `<div class="conan-roll spell-chat-card" style="border-color: ${ownerColor};">`;
        content += `<div class="spell-chat-header">`;
        content += `<div class="spell-chat-portrait-wrap">`;
        content += `<img src="${tokenImg}" class="spell-chat-portrait"/>`;
        content += `<img src="${spellIcon}" class="spell-chat-badge spell-summon-badge" alt="${spell.name}" data-summon='${summonData}' title="Drag onto the map to place your Horror"/>`;
        content += `</div>`;
        content += `<div class="spell-chat-title"><strong>${this.actor.name}</strong> casts <strong>Summon Horror</strong></div>`;
        content += `</div>`;
        content += `<div class="spell-chat-body">`;
        content += `<div class="spell-chat-effect"><em>The ground cracks as ${this.actor.name} channels raw demonic power. A monstrous Horror erupts from the void, howling with rage.</em><br><strong>${spell.effect}</strong></div>`;
        content += `<div class="spell-chat-meta"><strong>Cost:</strong> ${costDisplay}</div>`;
        content += `</div></div>`;

        await ChatMessage.create({
          speaker: ChatMessage.getSpeaker({ actor: this.actor }),
          content: content
        });
        return;
      }

      // Summon Ghost — drag-to-canvas summon (Necromantic Magic)
      if (spellId === 'summon-ghost') {
        const tokenImg = this.actor.prototypeToken?.texture?.src || this.actor.img || 'icons/svg/mystery-man.svg';
        const ownerColor = this._getOwnerColor();
        const costDisplay = this._formatSpellCost(spell.cost);
        const casterName = this.actor.name.replace(/'/g, '&#39;');
        const summonData = `{"enemyId":"ghost","category":"undead","group":"ghosts","casterName":"${casterName}"}`;

        let content = `<div class="conan-roll spell-chat-card" style="border-color: ${ownerColor};">`;
        content += `<div class="spell-chat-header">`;
        content += `<div class="spell-chat-portrait-wrap">`;
        content += `<img src="${tokenImg}" class="spell-chat-portrait"/>`;
        content += `<img src="${spellIcon}" class="spell-chat-badge spell-summon-badge" alt="${spell.name}" data-summon='${summonData}' title="Drag onto the map to place your Ghost"/>`;
        content += `</div>`;
        content += `<div class="spell-chat-title"><strong>${this.actor.name}</strong> casts <strong>Summon Ghost</strong></div>`;
        content += `</div>`;
        content += `<div class="spell-chat-body">`;
        content += `<div class="spell-chat-effect" style="color: #90EE90;"><em>${this.actor.name} whispers forbidden words into the dark. The air turns to ice as a wailing shape tears free from the void — a restless spirit, bound to the sorcerer's will until death claims it again.</em></div>`;
        content += `<div class="spell-chat-meta"><strong>Cost:</strong> ${costDisplay} &bull; <strong>Actions:</strong> 2 &bull; <strong>Range:</strong> Close</div>`;
        content += `</div></div>`;

        await ChatMessage.create({
          speaker: ChatMessage.getSpeaker({ actor: this.actor }),
          content: content
        });
        return;
      }

      // Raise Dead — drag-to-canvas summon x4 Skeleton Warriors (Necromantic Magic)
      if (spellId === 'raise-dead') {
        const tokenImg = this.actor.prototypeToken?.texture?.src || this.actor.img || 'icons/svg/mystery-man.svg';
        const ownerColor = this._getOwnerColor();
        const costDisplay = this._formatSpellCost(spell.cost);
        const casterName = this.actor.name.replace(/'/g, '&#39;');
        const castId = `raise-dead-${Date.now()}`;
        const summonData = JSON.stringify({ enemyId: 'skeleton-warrior', category: 'undead', group: 'skeletons', casterName: casterName, castId: castId, maxSummons: 4 }).replace(/"/g, '&quot;');

        let content = `<div class="conan-roll spell-chat-card" style="border-color: ${ownerColor};">`;
        content += `<div class="spell-chat-header">`;
        content += `<div class="spell-chat-portrait-wrap">`;
        content += `<img src="${tokenImg}" class="spell-chat-portrait"/>`;
        content += `<img src="${spellIcon}" class="spell-chat-badge spell-summon-badge" alt="${spell.name}" data-summon="${summonData}" title="Drag onto the map to place a Skeleton Warrior (×4)"/>`;
        content += `</div>`;
        content += `<div class="spell-chat-title"><strong>${this.actor.name}</strong> casts <strong>Raise Dead</strong></div>`;
        content += `</div>`;
        content += `<div class="spell-chat-body">`;
        content += `<div class="spell-chat-effect" style="color: #90EE90;"><em>The ground splits and cracks as ${this.actor.name} commands the dead to rise. Skeletal hands claw upward through soil and stone — four ancient warriors dragging themselves from their graves, weapons still clutched in bony fists.</em></div>`;
        content += `<div class="spell-chat-meta"><strong>Cost:</strong> ${costDisplay} &bull; <strong>Actions:</strong> 2 &bull; <strong>Range:</strong> Medium &bull; <strong>Summons:</strong> 4 Skeleton Warriors</div>`;
        content += `</div></div>`;

        await ChatMessage.create({
          speaker: ChatMessage.getSpeaker({ actor: this.actor }),
          content: content
        });
        return;
      }

    }

    // Get origin bonuses
    const originBonuses = this._getActiveOriginBonuses();
    const spellType = spell.type || 'cast';
    const costDisplay = this._formatSpellCost(spell.cost);

    if (spellType === 'attack') {
      const witsAttr = this.actor.system.attributes.wits;

      // Sorcery attack bonus (uses wits)
      const attackBonus = originBonuses.attacks.wits || 0;
      const damageBonus = originBonuses.damage.sorcery || 0;

      // Check for Fierce Mind skill (roll 2, take best)
      const hasFierceMind = this._hasFierceMind();

      // Build attack formula with origin bonus
      // Use effective die AND value that accounts for skill upgrades (Wise, Legendary, etc.)
      const { die: effectiveWitsDie, value: effectiveWitsValue } = this._getEffectiveStatValues('wits');
      // Fierce Mind: roll 2 dice, keep highest (2d8kh1 syntax)
      const dieSize = effectiveWitsDie.replace('d', '');
      let attackFormula = hasFierceMind ? `2d${dieSize}kh1 + ${effectiveWitsValue}` : `1${effectiveWitsDie} + ${effectiveWitsValue}`;
      if (attackBonus > 0) {
        attackFormula += ` + ${attackBonus}`;
      }

      // Poison: checksDown — silent -1 penalty to sorcery attacks
      const poisonEffects = this.actor.getFlag('conan', 'poisonEffects');
      const poisonPenalty = (poisonEffects?.active && poisonEffects.effects?.checksDown) ? -1 : 0;
      if (poisonPenalty !== 0) attackFormula += ` - 1`;

      const attackRoll = new Roll(attackFormula, this.actor.getRollData());
      await attackRoll.evaluate();

      // Get Winds of Fate modifier
      const windsOfFate = WindsOfFateDialog.getValueForActor(this.actor);
      const adjustedAttackTotal = attackRoll.total + windsOfFate;

      const attackFlexData = await this._rollFlexDie('spell_hit', true); // Suppress auto-celebration
      const cruelFate = this._checkCruelFate(attackRoll);

      const tokenImg = this.actor.prototypeToken?.texture?.src || this.actor.img || 'icons/svg/mystery-man.svg';
      const ownerColor = this._getOwnerColor();

      // Build attack breakdown
      const attackBreakdownLines = [];

      if (hasFierceMind) {
        // Show both dice rolled with Fierce Mind
        const diceResults = attackRoll.terms[0]?.results || [];
        const allRolls = diceResults.map(r => r.result);
        const keptRoll = attackRoll.terms[0]?.total || attackRoll.total;
        const rollDisplay = allRolls.length === 2
          ? `[${allRolls[0]}, ${allRolls[1]}] → ${keptRoll}`
          : `→ ${keptRoll}`;
        attackBreakdownLines.push({ label: 'Fierce Mind', value: `2${effectiveWitsDie}kh`, roll: rollDisplay, isSkill: true, isRaw: true });
      } else {
        const attackDieRoll = attackRoll.terms[0]?.total || attackRoll.total;
        attackBreakdownLines.push({ label: 'Wits Die', value: effectiveWitsDie, roll: attackDieRoll });
      }

      attackBreakdownLines.push({ label: 'Wits Value', value: `+${witsAttr.value}` });
      if (attackBonus > 0) attackBreakdownLines.push({ label: 'Origin Bonus', value: `+${attackBonus}` });
      if (poisonPenalty !== 0) attackBreakdownLines.push({ label: 'Venom', value: `-1`, isPoison: true });
      if (windsOfFate !== 0) attackBreakdownLines.push({ label: 'Winds of Fate', value: windsOfFate > 0 ? `+${windsOfFate}` : `${windsOfFate}`, isFate: true });

      let attackBreakdownHtml = `<div class="attack-breakdown" style="display: none;">`;
      attackBreakdownHtml += `<div class="breakdown-header">Sorcery Attack</div>`;
      for (const line of attackBreakdownLines) {
        const lineClass = line.isSkill ? 'breakdown-skill' : (line.isPoison ? 'breakdown-poison' : '');
        if (line.isRaw && line.roll !== undefined) {
          // Raw roll display (already formatted, like Fierce Mind)
          attackBreakdownHtml += `<div class="breakdown-line ${lineClass}"><span class="breakdown-label">${line.label}</span><span class="breakdown-value">${line.value} ${line.roll}</span></div>`;
        } else if (line.roll !== undefined) {
          attackBreakdownHtml += `<div class="breakdown-line ${lineClass}"><span class="breakdown-label">${line.label}</span><span class="breakdown-value">${line.value} → ${line.roll}</span></div>`;
        } else {
          attackBreakdownHtml += `<div class="breakdown-line ${lineClass}"><span class="breakdown-label">${line.label}</span><span class="breakdown-value">${line.value}</span></div>`;
        }
      }
      attackBreakdownHtml += `<div class="breakdown-total" style="background: linear-gradient(180deg, #4a1a6b 0%, #2d0f40 100%); border-color: #9b59b6;"><span class="breakdown-label">Total</span><span class="breakdown-value">${adjustedAttackTotal}</span></div>`;
      attackBreakdownHtml += `</div>`;

      // Build damage data
      let damageData = null;
      if (spell.damage) {
        damageData = {
          actorId: this.actor.id,
          damage: spell.damage,
          damageStat: '',
          damageBonus: damageBonus,
          weaponType: 'sorcery',
          weaponName: spell.name,
          spellCostLp: paidLpCost,
          spellCostSp: paidSpCost,
          isSpell: true
        };
        // Attach spell effect metadata for debuff application on shift+click
        if (spell.id === 'tide-of-stone') {
          damageData.spellEffect = { type: 'tide-of-stone', defPenalty: 1 };
        }
        if (spell.id === 'lotus-miasma') {
          damageData.spellEffect = { type: 'lotus-miasma', ignoresAR: true, poisonThreshold: 5 };
        }
        if (spell.id === 'wave-of-darkness') {
          damageData.spellEffect = { type: 'wave-of-darkness' };
        }
        if (spell.id === 'hellfire') {
          damageData.spellEffect = { type: 'hellfire' };
        }
        if (spell.id === 'life-leech') {
          damageData.spellEffect = { type: 'life-leech', casterActorId: this.actor.id };
        }
        if (spell.id === 'chilling-touch') {
          damageData.spellEffect = { type: 'chilling-touch', physPenalty: 1, sorcPenalty: 2 };
        }
        if (spell.id === 'death-scream') {
          damageData.spellEffect = { type: 'death-scream', ignoresAR: true };
        }
      }

      // Mesmerism: prime shift+click targeting (no damage, just control effect)
      if (spell.id === 'mesmerism') {
        game.conan.lastDamageRoll = 0;
        game.conan.lastDamageEffect = {
          type: 'mesmerism',
          casterActorId: this.actor.id,
          casterUserId: game.user.id
        };
      }

      // If flex triggered, show flex choice card
      if (attackFlexData.triggered) {
        // Build normal content for stamina choice fallback - Portrait style
        let normalContent = `<div class="conan-roll spell-chat-card" style="border-color: ${ownerColor};">`;
        normalContent += `<div class="spell-chat-header">`;
        normalContent += buildPortraitHtml(tokenImg);
        normalContent += `<div class="spell-chat-title"><strong>${this.actor.name}</strong> attacks with <strong>${spell.name}</strong></div>`;
        normalContent += `</div>`;
        normalContent += `<div class="spell-chat-body">`;
        if (spell.effect) normalContent += `<div class="spell-chat-effect">${spell.effect}</div>`;
        if (cruelFate) normalContent += `<div class="cruel-fate-indicator">Cruel Fate</div>`;
        normalContent += `<div class="sp-boost-row">`;
        normalContent += `<button type="button" class="sp-boost-btn" data-boost="1" data-cost="1" data-actor-id="${this.actor.id}" data-base-total="${adjustedAttackTotal}" data-cruel-fate="${cruelFate}" data-roll-label="Wits" data-roll-type="attack">+1</button>`;
        normalContent += `<div class="attack-result-box clickable-breakdown" style="cursor: pointer;">${adjustedAttackTotal}</div>`;
        normalContent += `<button type="button" class="sp-boost-btn" data-boost="2" data-cost="2" data-actor-id="${this.actor.id}" data-base-total="${adjustedAttackTotal}" data-cruel-fate="${cruelFate}" data-roll-label="Wits" data-roll-type="attack">+2</button>`;
        normalContent += `</div>`;
        normalContent += attackBreakdownHtml;
        if (damageData) normalContent += `<button class="damage-roll-btn" data-damage='${JSON.stringify(damageData)}'>DAMAGE</button>`;
        if (spell.id === 'mesmerism') normalContent += `<div class="spell-chat-effect" style="color: #9400D3; margin-top: 6px;"><strong>Shift+click an enemy token to mesmerize it.</strong></div>`;
        const flexMetaParts = [`<strong>Cost:</strong> ${costDisplay}`];
        if (spell.limit) flexMetaParts.push(`<span style="color: #FFD700;">${spell.limit}</span>`);
        normalContent += `<div class="spell-chat-meta">${flexMetaParts.join(' &nbsp;|&nbsp; ')}</div>`;
        normalContent += `</div></div>`;

        const flexChoiceData = {
          actorId: this.actor.id,
          rollType: 'spell_hit',
          celebData: attackFlexData.celebData,
          damageData: damageData,
          normalContent: normalContent,
          rollTotal: adjustedAttackTotal,
          rollLabel: `${spell.name} Spell`,
          spellCostLp: paidLpCost,
          spellCostSp: paidSpCost,
          spellId: spellId
        };

        const flexCardContent = this._buildFlexChoiceCard('spell', attackFlexData, flexChoiceData, tokenImg, ownerColor);

        ChatMessage.create({
          speaker: ChatMessage.getSpeaker({ actor: this.actor }),
          content: flexCardContent,
          rolls: [attackRoll, attackFlexData.roll],
          rollMode: game.settings.get('core', 'rollMode')
        });
      } else {
        // No flex - Portrait style spell card
        let content = `<div class="conan-roll spell-chat-card" style="border-color: ${ownerColor};">`;
        content += `<div class="spell-chat-header">`;
        content += buildPortraitHtml(tokenImg);
        content += `<div class="spell-chat-title"><strong>${this.actor.name}</strong> attacks with <strong>${spell.name}</strong></div>`;
        content += `</div>`;
        content += `<div class="spell-chat-body">`;
        if (spell.effect) content += `<div class="spell-chat-effect">${spell.effect}</div>`;
        if (cruelFate) content += `<div class="cruel-fate-indicator">Cruel Fate</div>`;
        content += `<div class="sp-boost-row">`;
        content += `<button type="button" class="sp-boost-btn" data-boost="1" data-cost="1" data-actor-id="${this.actor.id}" data-base-total="${adjustedAttackTotal}" data-cruel-fate="${cruelFate}" data-roll-label="Wits" data-roll-type="attack">+1</button>`;
        content += `<div class="attack-result-box clickable-breakdown" style="cursor: pointer;">${adjustedAttackTotal}</div>`;
        content += `<button type="button" class="sp-boost-btn" data-boost="2" data-cost="2" data-actor-id="${this.actor.id}" data-base-total="${adjustedAttackTotal}" data-cruel-fate="${cruelFate}" data-roll-label="Wits" data-roll-type="attack">+2</button>`;
        content += `</div>`;
        content += attackBreakdownHtml;
        content += `<div class="flex-result"><strong>Flex Die (${attackFlexData.die}):</strong> ${attackFlexData.result}</div>`;
        if (damageData) content += `<button class="damage-roll-btn" data-damage='${JSON.stringify(damageData)}'>DAMAGE</button>`;
        if (spell.id === 'mesmerism') content += `<div class="spell-chat-effect" style="color: #9400D3; margin-top: 6px;"><strong>Shift+click an enemy token to mesmerize it.</strong></div>`;
        const atkMetaParts = [`<strong>Cost:</strong> ${costDisplay}`];
        if (spell.limit) atkMetaParts.push(`<span style="color: #FFD700;">${spell.limit}</span>`);
        content += `<div class="spell-chat-meta">${atkMetaParts.join(' &nbsp;|&nbsp; ')}</div>`;
        if (attackFlexData.suppressed) {
          const venomMsg = VENOM_FLEX_MESSAGES[Math.floor(Math.random() * VENOM_FLEX_MESSAGES.length)];
          content += `<div style="padding: 6px 10px; margin-top: 6px; background: rgba(50,205,50,0.1); border-left: 2px solid #32CD32; border-radius: 2px; color: #32CD32; font-style: italic; font-size: 15px;">${venomMsg}</div>`;
        }
        content += `</div></div>`;

        ChatMessage.create({
          speaker: ChatMessage.getSpeaker({ actor: this.actor }),
          content: content,
          rolls: [attackRoll, attackFlexData.roll],
          rollMode: game.settings.get('core', 'rollMode')
        });
      }

      // Activate Lotus Miasma maintenance tracking after initial cast
      if (spellId === 'lotus-miasma') {
        await this.actor.update({ 'system.lotusMiasmaActive': true });
      }
    } else {
      // Non-attack spells (cast or reaction)
      const damageBonus = originBonuses.damage.sorcery || 0;
      const witsAttr = this.actor.system.attributes.wits;
      let spellRoll = null;
      let damageFormulaDisplay = "";

      if (spell.damage) {
        // Handle WitsDie damage formulas
        let damageFormula = spell.damage.replace(/WitsDie/g, `1${witsAttr.die}`);
        damageFormulaDisplay = spell.damage;
        if (damageBonus > 0) {
          damageFormula += ` + ${damageBonus}`;
          damageFormulaDisplay += ` <span style="color: #90EE90;">(+${damageBonus} Origin)</span>`;
        }
        spellRoll = new Roll(damageFormula, this.actor.getRollData());
        await spellRoll.evaluate();
      }

      const tokenImg = this.actor.prototypeToken?.texture?.src || this.actor.img || 'icons/svg/mystery-man.svg';
      const ownerColor = this._getOwnerColor();

      // Portrait-style spell card
      let content = `<div class="conan-roll spell-chat-card" style="border-color: ${ownerColor};">`;
      content += `<div class="spell-chat-header">`;
      content += buildPortraitHtml(tokenImg);
      content += `<div class="spell-chat-title"><strong>${this.actor.name}</strong> casts <strong>${spell.name}</strong></div>`;
      content += `</div>`;
      content += `<div class="spell-chat-body">`;

      if (spell.effect) content += `<div class="spell-chat-effect">${spell.effect}</div>`;
      if (spellRoll) {
        // Build spell damage/healing breakdown
        const spellDieRoll = spellRoll.terms[0]?.total || spellRoll.total;
        const spellBreakdownLines = [];
        const isHealing = spell.isHealing || false;
        const labelText = isHealing ? 'Base Healing' : 'Base Damage';
        const headerText = isHealing ? 'Spell Healing' : 'Spell Damage';
        spellBreakdownLines.push({ label: labelText, value: spell.damage, roll: spellDieRoll });
        if (damageBonus > 0) spellBreakdownLines.push({ label: 'Origin Bonus', value: `+${damageBonus}` });

        let spellBreakdownHtml = `<div class="damage-breakdown" style="display: none;">`;
        spellBreakdownHtml += `<div class="breakdown-header">${headerText}</div>`;
        for (const line of spellBreakdownLines) {
          if (line.roll !== undefined) {
            spellBreakdownHtml += `<div class="breakdown-line"><span class="breakdown-label">${line.label}</span><span class="breakdown-value">${line.value} → ${line.roll}</span></div>`;
          } else {
            spellBreakdownHtml += `<div class="breakdown-line"><span class="breakdown-label">${line.label}</span><span class="breakdown-value">${line.value}</span></div>`;
          }
        }
        const totalStyle = isHealing
          ? 'background: linear-gradient(180deg, #1a6b1a 0%, #0f400f 100%); border-color: #44bb44;'
          : 'background: linear-gradient(180deg, #4a1a6b 0%, #2d0f40 100%); border-color: #9b59b6;';
        spellBreakdownHtml += `<div class="breakdown-total" style="${totalStyle}"><span class="breakdown-label">Total</span><span class="breakdown-value">${spellRoll.total}</span></div>`;
        spellBreakdownHtml += `</div>`;

        // Healing spells get green styling and data attribute for capture
        const healingAttr = isHealing ? ' data-healing="true"' : '';
        const casterAttr = isHealing ? ` data-caster-id="${this.actor.id}"` : '';
        const boxStyle = isHealing
          ? 'cursor: pointer; background: linear-gradient(180deg, #2d5a2d 0%, #1a3d1a 100%); border-color: #44ff44; color: #90EE90;'
          : 'cursor: pointer;';
        content += `<div class="damage-result-box clickable-breakdown"${healingAttr}${casterAttr} style="${boxStyle}">${spellRoll.total}</div>`;
        if (!isHealing) {
          content += `<div class="sp-boost-row">`;
          content += `<button type="button" class="sp-dmg-boost-btn" data-dice="1" data-cost="1" data-actor-id="${this.actor.id}">+1</button>`;
          content += `<button type="button" class="sp-dmg-boost-btn" data-dice="2" data-cost="2" data-actor-id="${this.actor.id}">+2</button>`;
          content += `</div>`;
        }
        content += spellBreakdownHtml;
      }



      // Meta line (cost, limit, duration consolidated)
      const metaParts = [`<strong>Cost:</strong> ${costDisplay}`];
      if (spell.limit) metaParts.push(`<span style="color: #FFD700;">${spell.limit}</span>`);
      if (spell.duration) metaParts.push(`<span style="color: #DDA0DD;">Maintain: ${spell.duration.maintainCost}</span>`);
      content += `<div class="spell-chat-meta">${metaParts.join(' &nbsp;|&nbsp; ')}</div>`;
      content += `</div></div>`;

      ChatMessage.create({
        speaker: ChatMessage.getSpeaker({ actor: this.actor }),
        content: content,
        rolls: spellRoll ? [spellRoll] : [],
        rollMode: game.settings.get('core', 'rollMode')
      });

      // === LOTUS FLASH: Click targets, then Shift to apply initiative reduction ===
      if (spellId === 'lotus-flash') {
        if (!game.combat) {
          ui.notifications.warn('Lotus Flash: No active combat encounter.');
        } else if (game.conan?.lotusFlashTargets?.length > 0) {
          ui.notifications.warn('Lotus Flash: Previous cast still active. Wait for affected enemies to take their turn.');
        } else {
          const flashSelected = [];
          const casterActor = this.actor;

          // Release all tokens so next click fires controlToken
          canvas.tokens?.releaseAll();

          ui.notifications.info('Lotus Flash: Click enemy tokens, then press Shift to blind them.');

          // Track clicked tokens
          const flashControlHook = Hooks.on('controlToken', (controlledToken, isControlled) => {
            if (!isControlled) return;
            const tDoc = controlledToken.document ?? controlledToken;
            const tId = tDoc.id ?? tDoc._id;
            if (flashSelected.includes(tId)) return;
            flashSelected.push(tId);
            ui.notifications.info(`${controlledToken.name || tDoc.name} targeted by Lotus Flash (${flashSelected.length} targets).`);
          });

          // Shift release stores targets as pending (applied at start of next round)
          const shiftUpHandler = async (e) => {
            if (e.key !== 'Shift') return;
            document.removeEventListener('keyup', shiftUpHandler);
            document.removeEventListener('keydown', escHandler);
            Hooks.off('controlToken', flashControlHook);

            if (flashSelected.length === 0) {
              ui.notifications.warn('No targets selected. Lotus Flash cancelled.');
              return;
            }

            game.conan = game.conan || {};
            game.conan.lotusFlashTargets = game.conan.lotusFlashTargets || [];

            const affectedNames = [];
            for (const tokenId of flashSelected) {
              const combatant = game.combat.combatants.find(c => c.tokenId === tokenId);
              if (combatant && combatant.initiative !== null) {
                // Store as pending — initiative change applied at next round start
                game.conan.lotusFlashTargets.push({
                  combatantId: combatant.id,
                  originalInitiative: combatant.initiative,
                  tokenName: combatant.name,
                  pending: true
                });
                affectedNames.push(combatant.name);
              }
            }

            if (affectedNames.length > 0) {
              ChatMessage.create({
                speaker: ChatMessage.getSpeaker({ actor: casterActor }),
                content: `<div class="conan-roll"><h3 style="color: #FFD700;">Lotus Flash</h3><div class="skill-effect" style="color: #ccc;"><em>A blinding flash of alchemical light sears the eyes of the enemy!</em></div><div class="skill-effect"><strong>${affectedNames.join(', ')}</strong> — Initiative drops to <strong>1</strong> next round</div><div class="skill-effect" style="color: #aaa; font-size: 0.85em;">Restores after their turn.</div></div>`,
                rollMode: game.settings.get('core', 'rollMode')
              });
            }
          };
          document.addEventListener('keyup', shiftUpHandler);

          // Cancel on Escape
          const escHandler = (e) => {
            if (e.key === 'Escape') {
              Hooks.off('controlToken', flashControlHook);
              document.removeEventListener('keyup', shiftUpHandler);
              document.removeEventListener('keydown', escHandler);
              ui.notifications.info('Lotus Flash targeting cancelled.');
            }
          };
          document.addEventListener('keydown', escHandler);
        }
      }
    }
  }

  /**
   * Show confirmation dialog for spell casting with cost
   * Handles stepped costs (like "4/6/8") by letting player choose
   * Returns resolved costs or null if cancelled
   */
  async _confirmSpellCast(spell) {
    return new Promise((resolve) => {
      const cost = spell.cost || {};
      const currentLP = this.actor.system.lifePoints?.value || 0;
      const currentSP = this.actor.system.stamina || 0;

      // Check if LP cost is stepped (like "4/6/8" or "3-10")
      const isSteppedLP = typeof cost.lp === 'string' && (cost.lp.includes('/') || cost.lp.includes('-'));

      // Parse costs - track original for display
      let lpOptions = [];
      let originalSpCost = parseInt(cost.sp) || 0;
      let spCost = originalSpCost;

      // Check for skill modifiers
      const hasLotusBlood = this._hasLotusBlood();
      const hasSorcerousVigor = this._hasSorcerousVigor();

      // Apply Lotus Blood skill: SP cost -1 (min 1)
      if (hasLotusBlood && spCost > 0) {
        spCost = Math.max(1, spCost - 1);
      }

      if (isSteppedLP) {
        // Handle stepped costs like "4/6/8" or "3-10"
        if (cost.lp.includes('/')) {
          lpOptions = cost.lp.split('/').map(v => parseInt(v.trim()));
        } else if (cost.lp.includes('-')) {
          // Range like "3-10" - offer min and max
          const [min, max] = cost.lp.split('-').map(v => parseInt(v.trim()));
          lpOptions = [min, max];
        }
      } else {
        lpOptions = [parseInt(cost.lp) || 0];
      }

      // Store original LP options before Sorcerous Vigor reduction
      const originalLpOptions = [...lpOptions];

      // Apply Sorcerous Vigor skill: LP cost -2 (min 1)
      if (hasSorcerousVigor) {
        lpOptions = lpOptions.map(lp => lp > 0 ? Math.max(1, lp - 2) : 0);
      }

      // Check if player has enough SP (SP cannot go negative)
      if (spCost > currentSP) {
        ui.notifications.warn(`Not enough Stamina to cast ${spell.name}! Need ${spCost} SP, have ${currentSP}.`);
        resolve(null);
        return;
      }

      // Build compact dialog content
      const lpColor = '#E10600';
      const spColor = '#87CEEB';
      const warningColor = '#FFD700';
      const skillColor = '#90EE90';
      const lpCostVal = lpOptions[0] || 0;
      const willKill = lpCostVal > 0 && currentLP - lpCostVal <= 0;

      let dialogContent = `<div style="font-family: 'Montserrat', system-ui, sans-serif; padding: 12px; background: linear-gradient(180deg, #1B1B20 0%, #0B0B0D 100%); color: #FFFFFF;">`;

      // Resources row - compact horizontal
      dialogContent += `<div style="font-size: 9px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.12em; color: rgba(255,255,255,0.5); margin-bottom: 4px;">Resources</div>`;
      dialogContent += `<div style="display: flex; gap: 20px; margin-bottom: 12px;">`;
      dialogContent += `<span><span style="color: ${lpColor}; font-weight: 600;">LP</span> <span style="font-weight: 800;">${currentLP}</span></span>`;
      dialogContent += `<span><span style="color: ${spColor}; font-weight: 600;">SP</span> <span style="font-weight: 800;">${currentSP}</span></span>`;
      dialogContent += `</div>`;

      // Cost section
      dialogContent += `<div style="font-size: 9px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.12em; color: rgba(255,255,255,0.5); margin-bottom: 4px;">Cost</div>`;

      if (isSteppedLP && lpOptions.length > 1) {
        // Stepped LP costs - compact radio buttons
        dialogContent += `<div style="display: flex; flex-wrap: wrap; gap: 6px; margin-bottom: 4px;">`;
        lpOptions.forEach((lp, idx) => {
          const originalLp = originalLpOptions[idx];
          const optionWillKill = currentLP - lp <= 0;
          const bgColor = optionWillKill ? 'rgba(225,6,0,0.2)' : 'rgba(255,255,255,0.05)';
          const borderColor = optionWillKill ? lpColor : '#2a2a2e';
          dialogContent += `<label style="display: flex; align-items: center; gap: 4px; padding: 4px 8px; background: ${bgColor}; border: 1px solid ${borderColor}; border-radius: 4px; cursor: pointer; font-size: 12px;">`;
          dialogContent += `<input type="radio" name="lpCost" value="${lp}" ${idx === 0 ? 'checked' : ''} style="accent-color: ${lpColor}; margin: 0;">`;
          if (hasSorcerousVigor && originalLp !== lp) {
            dialogContent += `<span style="color: ${optionWillKill ? lpColor : '#fff'}; font-weight: 600;"><s style="opacity: 0.5;">${originalLp}</s> ${lp} LP</span>`;
          } else {
            dialogContent += `<span style="color: ${optionWillKill ? lpColor : '#fff'}; font-weight: 600;">${lp} LP</span>`;
          }
          if (optionWillKill) dialogContent += `<span style="color: ${warningColor}; font-size: 9px; font-weight: 700;">!</span>`;
          dialogContent += `</label>`;
        });
        dialogContent += `</div>`;
        if (spCost > 0) {
          if (hasLotusBlood && originalSpCost !== spCost) {
            dialogContent += `<div><span style="color: ${spColor}; font-weight: 600;">SP</span> <span style="font-weight: 800;"><s style="opacity: 0.5;">${originalSpCost}</s> ${spCost}</span></div>`;
          } else {
            dialogContent += `<div><span style="color: ${spColor}; font-weight: 600;">SP</span> <span style="font-weight: 800;">${spCost}</span></div>`;
          }
        }
      } else {
        // Simple costs - horizontal
        dialogContent += `<div style="display: flex; gap: 20px;">`;
        const originalLpCostVal = originalLpOptions[0] || 0;
        if (lpCostVal > 0) {
          if (hasSorcerousVigor && originalLpCostVal !== lpCostVal) {
            dialogContent += `<span><span style="color: ${lpColor}; font-weight: 600;">LP</span> <span style="font-weight: 800; ${willKill ? `color: ${lpColor};` : ''}"><s style="opacity: 0.5;">${originalLpCostVal}</s> ${lpCostVal}</span></span>`;
          } else {
            dialogContent += `<span><span style="color: ${lpColor}; font-weight: 600;">LP</span> <span style="font-weight: 800; ${willKill ? `color: ${lpColor};` : ''}">${lpCostVal}</span></span>`;
          }
        }
        if (spCost > 0) {
          if (hasLotusBlood && originalSpCost !== spCost) {
            dialogContent += `<span><span style="color: ${spColor}; font-weight: 600;">SP</span> <span style="font-weight: 800;"><s style="opacity: 0.5;">${originalSpCost}</s> ${spCost}</span></span>`;
          } else {
            dialogContent += `<span><span style="color: ${spColor}; font-weight: 600;">SP</span> <span style="font-weight: 800;">${spCost}</span></span>`;
          }
        }
        if (lpCostVal === 0 && spCost === 0) {
          dialogContent += `<span style="color: rgba(255,255,255,0.5);">None</span>`;
        }
        dialogContent += `</div>`;

        // Lethal warning if needed
        if (willKill) {
          dialogContent += `<div style="margin-top: 8px; padding: 6px; background: rgba(225,6,0,0.2); border: 1px solid ${lpColor}; border-radius: 4px; text-align: center;">`;
          dialogContent += `<span style="font-size: 10px; font-weight: 700; color: ${warningColor}; text-transform: uppercase;">LETHAL</span>`;
          dialogContent += `</div>`;
        }
      }

      // Skill modifiers section - always show if character has the skills
      if (hasSorcerousVigor || hasLotusBlood) {
        dialogContent += `<div style="margin-top: 10px; padding: 6px 8px; background: rgba(144, 238, 144, 0.1); border: 1px solid rgba(144, 238, 144, 0.3); border-radius: 4px;">`;
        dialogContent += `<div style="font-size: 8px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.1em; color: ${skillColor}; margin-bottom: 3px;">Active Skills</div>`;
        if (hasSorcerousVigor) {
          const vigorReduction = originalLpOptions[0] > 0 ? Math.min(2, originalLpOptions[0] - 1) : 0;
          dialogContent += `<div style="font-size: 10px; color: rgba(255,255,255,0.8);">⚡ Sorcerous Vigor: <span style="color: ${skillColor};">-2 LP cost</span></div>`;
        }
        if (hasLotusBlood) {
          dialogContent += `<div style="font-size: 10px; color: rgba(255,255,255,0.8);">🌸 Lotus Blood: <span style="color: ${skillColor};">-1 SP cost</span></div>`;
        }
        dialogContent += `</div>`;
      }

      dialogContent += `</div>`;

      const dialog = new Dialog({
        title: `Cast ${spell.name}`,
        content: dialogContent,
        buttons: {
          cast: {
            icon: '<i class="fas fa-magic"></i>',
            label: "Cast",
            callback: (html) => {
              let selectedLP = lpOptions[0] || 0;
              if (isSteppedLP && lpOptions.length > 1) {
                const checked = html.find('input[name="lpCost"]:checked');
                selectedLP = parseInt(checked.val()) || lpOptions[0];
              }
              resolve({ lp: selectedLP, sp: spCost });
            }
          },
          cancel: {
            icon: '<i class="fas fa-times"></i>',
            label: "Cancel",
            callback: () => resolve(null)
          }
        },
        default: "cast",
        render: (html) => {
          // Style the dialog with BPM theme
          const dialogEl = html.closest('.dialog');
          dialogEl.css({
            'background': 'linear-gradient(180deg, #1B1B20 0%, #0B0B0D 100%)',
            'border': '3px solid #2a2a2e',
            'border-radius': '16px',
            'box-shadow': '0 12px 30px rgba(0,0,0,0.55), inset 2px 2px 6px rgba(255,255,255,0.07), inset -2px -2px 6px rgba(0,0,0,0.5)',
            'outline': '1px solid rgba(255,255,255,0.04)'
          });

          // Style the header
          dialogEl.find('.window-header').css({
            'background': 'linear-gradient(180deg, #1B1B20 0%, #151519 100%)',
            'border-bottom': '3px solid #E10600',
            'border-radius': '13px 13px 0 0',
            'padding': '10px 16px',
            'font-family': "'Montserrat', system-ui, sans-serif",
            'font-weight': '700',
            'text-transform': 'uppercase',
            'letter-spacing': '0.08em',
            'color': '#FFFFFF'
          });

          // Style the title
          dialogEl.find('.window-title').css({
            'font-size': '14px',
            'text-shadow': '0 2px 4px rgba(0,0,0,0.9)'
          });

          // Style the close button
          dialogEl.find('.close').css({
            'color': 'rgba(255,255,255,0.6)'
          });

          // Style the content area
          dialogEl.find('.dialog-content').css({
            'padding': '0',
            'background': 'transparent'
          });

          // Style the button container
          dialogEl.find('.dialog-buttons').css({
            'background': '#0B0B0D',
            'padding': '8px 12px',
            'border-top': '1px solid #2a2a2e',
            'display': 'flex',
            'gap': '8px',
            'justify-content': 'flex-end'
          });

          // Style all buttons base - smaller
          dialogEl.find('.dialog-button').css({
            'font-family': "'Montserrat', system-ui, sans-serif",
            'font-size': '10px',
            'font-weight': '700',
            'text-transform': 'uppercase',
            'letter-spacing': '0.08em',
            'padding': '6px 12px',
            'border-radius': '4px',
            'border': '1px solid #2a2a2e',
            'cursor': 'pointer',
            'transition': 'all 0.15s ease'
          });

          // Style the Cast button (primary action - red accent)
          dialogEl.find('button[data-button="cast"]').css({
            'background': 'linear-gradient(180deg, #E10600 0%, #B00000 100%)',
            'border-color': '#E10600',
            'color': '#FFFFFF',
            'box-shadow': '0 2px 4px rgba(0,0,0,0.3)'
          });

          // Style the Cancel button (secondary)
          dialogEl.find('button[data-button="cancel"]').css({
            'background': 'linear-gradient(180deg, #1B1B20 0%, #0B0B0D 100%)',
            'border-color': '#2a2a2e',
            'color': 'rgba(255,255,255,0.6)'
          });
        },
        close: () => resolve(null)
      }, {
        width: 260,
        classes: ['conan-spell-dialog']
      });

      dialog.render(true);
    });
  }

  /**
   * Deduct LP and/or SP costs from the actor
   * LP can go negative (player can kill themselves)
   * SP is already validated to not go negative
   */
  async _deductSpellCost(lpCost, spCost, spellName) {
    const updates = {};
    const currentLP = this.actor.system.lifePoints?.value || 0;
    const currentSP = this.actor.system.stamina || 0;

    if (lpCost > 0) {
      const newLP = currentLP - lpCost;
      updates['system.lifePoints.value'] = newLP;

      // Show floating LP cost on caster's token
      const casterToken = canvas.tokens?.placeables.find(t => t.actor?.id === this.actor.id);
      if (casterToken && typeof showFloatingDamage === 'function') {
        showFloatingDamage(casterToken.id, lpCost, false, false, false);
        game.socket.emit("system.conan", {
          action: "floatingDamage",
          tokenId: casterToken.id,
          damage: lpCost,
          isDead: false,
          isWounded: false,
          isHealing: false
        });
      }

      // Warn if this kills the character
      if (newLP <= 0) {
        ui.notifications.warn(`${this.actor.name} has been reduced to ${newLP} LP from casting ${spellName}!`);
      }
    }

    if (spCost > 0) {
      updates['system.stamina'] = currentSP - spCost;
    }

    if (Object.keys(updates).length > 0) {
      await this.actor.update(updates);
    }
  }

  // ==========================================
  // SKILLS
  // ==========================================

  async _onRollSkill(event) {
    event.preventDefault();
    const skillId = event.currentTarget.dataset.skillId;
    const skill = this.actor.system.skills[skillId];

    if (!skill) return;

    // Check for Inspire spell bonus (+2 to all Checks)
    const inspireActive = this.actor.system.inspireSpellActive === 'active' || this.actor.system.inspireSpellActive === 'warning';
    const inspireBonus = inspireActive ? 2 : 0;

    // Captured Soul (+2 when primed, then consumed)
    const skillSoulPrimed = this.actor.system.capturedSoulState === 'primed';
    const skillSoulBonus = skillSoulPrimed ? 2 : 0;
    if (skillSoulPrimed) {
      this.actor.update({ 'system.capturedSoulState': null });
    }

    let rollFormula = '2d6';
    if (inspireBonus > 0) rollFormula += ` + ${inspireBonus}`;
    if (skillSoulBonus > 0) rollFormula += ` + ${skillSoulBonus}`;

    const roll = new Roll(rollFormula, this.actor.getRollData());
    await roll.evaluate();
    const flexData = await this._rollFlexDie('skill');
    const cruelFate = this._checkCruelFate(roll);
    const ownerColor = this._getOwnerColor();

    let content = `<div class="conan-roll" style="border-color: ${ownerColor};">`;
    content += `<h3>${skill.name}</h3>`;
    if (cruelFate) {
      content += `<div class="cruel-fate-indicator">Cruel Fate</div>`;
    }
    if (inspireBonus > 0) {
      content += `<div class="skill-indicator" style="background: linear-gradient(180deg, #1a3a1a 0%, #0d200d 100%); border-color: #90EE90; color: #90EE90;">Inspired (+2)</div>`;
    }
    if (skillSoulBonus > 0) {
      content += `<div class="skill-indicator" style="background: linear-gradient(180deg, #3a0a0a 0%, #200505 100%); border-color: #DC143C; color: #DC143C;">Captured Soul (+2)</div>`;
    }
    content += `<div class="roll-result"><strong>Total:</strong> ${roll.total}</div>`;
    if (skill.effect) content += `<div class="skill-effect"><em>${skill.effect}</em></div>`;
    content += `<div class="flex-result ${flexData.triggered ? 'flex-triggered' : ''}">`;
    content += `<strong>Flex Die:</strong> ${flexData.result}`;
    if (flexData.triggered) content += ` <span class="trigger-icon">⚡ FLEX!</span>`;
    content += `</div></div>`;

    ChatMessage.create({
      speaker: ChatMessage.getSpeaker({ actor: this.actor }),
      content: content,
      rolls: [roll, flexData.roll],
      rollMode: game.settings.get('core', 'rollMode')
    });
  }

  /**
   * Load all skill definitions from the rules reference
   * @returns {Object} Object containing starting and legendary skill arrays
   */
  _getAllSkillDefinitions() {
    return {
      starting: [
        { id: "born-in-saddle", name: "Born in the Saddle", xpCost: 1, effect: "Ignore the penalty for Ranged Attacks while Mounted. +1 to Attacks when Mounted and targeting an un-Mounted foe." },
        { id: "charge", name: "Charge", xpCost: 1, effect: "Spend 1 Stamina Point: Make two Move Actions followed by a Melee Attack Action. This only counts as 1 Action.", spCost: 1 },
        { id: "defender", name: "Defender", xpCost: 1, effect: "Choose a Friendly Character within Touch Range. Become the target of a single Attack made against that character. May only be used once per Round." },
        { id: "fleet-footed", name: "Fleet Footed", xpCost: 1, effect: "When making 2 Move Actions in the same Turn, take an additional bonus Move Action." },
        { id: "hit-and-run", name: "Hit and Run", xpCost: 1, effect: "Spend 1 Stamina Point: Make an Attack Action followed by two Move Actions. This only counts as 1 Action.", spCost: 1 },
        { id: "iron-hide", name: "Iron Hide", xpCost: 1, effect: "Increase maximum Life Points by 3.", lpBonus: 3 },
        { id: "of-the-shadows", name: "Of the Shadows", xpCost: 1, effect: "+1 to all Edge Checks involving stealth (hiding, moving quietly, passing unseen) or to detect others." },
        { id: "uncanny-warding", name: "Uncanny Warding", xpCost: 1, effect: "Increase Sorcery Defense by 1." },
        { id: "assassin", name: "Assassin", xpCost: 2, effect: "When using a One-Handed Light or Medium Melee weapon, apply Edge to the Melee Attack instead of Might. Still add Might to the Damage roll." },
        { id: "brawler", name: "Brawler", xpCost: 2, effect: "Increase the Damage of all Melee Attacks by +1." },
        { id: "eagle-eyed", name: "Eagle-Eyed", xpCost: 2, effect: "Increase the Damage of all Ranged Attacks by +1." },
        { id: "pantherish", name: "Pantherish", xpCost: 2, effect: "Spend 1 Stamina Point: Reroll a failed Check or Attack roll.", spCost: 1 },
        { id: "resilient", name: "Resilient", xpCost: 2, effect: "During a Recovery, regain 3 additional Life Points and gain 1 additional Stamina Point." },
        { id: "waterfront-fists", name: "Waterfront Fists", xpCost: 2, effect: "While unarmed, Melee Attacks count as Improvised Weapons (Light, One-Handed)." },
        { id: "improved-flex", name: "Improved Flex", xpCost: 3, effect: "Improve Flex die from D10 to D8." }
      ],
      legendary: [
        { id: "combat-readiness", name: "Combat Readiness", xpCost: 1, effect: "Increase Initiative by 1." },
        { id: "impaling-throw", name: "Impaling Throw", xpCost: 1, effect: "Spend 1 Stamina Point: Double the Damage of a Thrown weapon attack.", spCost: 1 },
        { id: "infamy", name: "Infamy", xpCost: 1, effect: "+2 to intimidate or convince Contests against opponents who know your reputation." },
        { id: "hardy", name: "Hardy", xpCost: 1, effect: "Whenever you regain Life Points, regain an additional 2 Life Points." },
        { id: "sacrifice-armor", name: "Sacrifice Armor", xpCost: 1, effect: "Spend 1 Stamina Point: Negate all damage from one attack. Your Armor Rating is reduced to 0. May only be used once per Tale.", spCost: 1 },
        { id: "unseen-strike", name: "Unseen Strike", xpCost: 1, effect: "When attacking a surprised or unaware target: +2 to Attack roll, +1 to Damage." },
        { id: "blocker", name: "Blocker", xpCost: 2, effect: "While wielding a Shield and if you have not made a Move Action this Turn, increase Physical Defense by 1." },
        { id: "lotus-blood", name: "Lotus Blood", xpCost: 2, effect: "Reduce the Stamina Point cost of Sorcery by 1 (minimum 1)." },
        { id: "murderous-frenzy", name: "Murderous Frenzy", xpCost: 2, effect: "When you kill a Minion with a Two-Handed Heavy weapon, automatically kill a second Minion of the same type within Touch Range." },
        { id: "poisoner", name: "Poisoner", xpCost: 2, effect: "When dealing 3+ Damage with a Melee Attack, may apply a Poison effect. Requires poisonous substances." },
        { id: "protector", name: "Protector", xpCost: 2, effect: "Spend 1 Stamina Point: Give 1 Stamina Point to an ally within Touch Range. May only be used once per Round.", spCost: 1 },
        { id: "soldiers-endurance", name: "Soldier's Endurance", xpCost: 2, effect: "Ignore armor encumbrance penalties. When wearing Heavy Armor, use Medium Armor stipulations instead." },
        { id: "sorcerous-vigor", name: "Sorcerous Vigor", xpCost: 2, effect: "Reduce the Life Point cost of Sorcery by 2 (minimum 1)." },
        { id: "combat-readiness-ii", name: "Combat Readiness II", xpCost: 2, prerequisite: "combat-readiness", effect: "Increase Initiative by an additional 1 (stacks with Combat Readiness)." },
        { id: "eagle-eyed-ii", name: "Eagle-Eyed II", xpCost: 2, prerequisite: "eagle-eyed", effect: "Increase Ranged Attack Damage by an additional 1 (stacks with Eagle-Eyed)." },
        { id: "iron-hide-ii", name: "Iron Hide II", xpCost: 2, prerequisite: "iron-hide", effect: "Increase maximum Life Points by your Grit value.", lpBonusStat: "grit" },
        { id: "uncanny-warding-ii", name: "Uncanny Warding II", xpCost: 2, prerequisite: "uncanny-warding", effect: "Increase Sorcery Defense by an additional 1 (stacks with Uncanny Warding)." },
        { id: "fierce-mind", name: "Fierce Mind", xpCost: 3, effect: "When making a Sorcery Attack, roll two dice and take the best result." },
        { id: "fierce-shots", name: "Fierce Shots", xpCost: 3, effect: "When making a Ranged Attack, roll two dice and take the best result." },
        { id: "fierce-strokes", name: "Fierce Strokes", xpCost: 3, effect: "When making a Melee Attack, roll two dice and take the best result." },
        { id: "steel-trap-reflexes", name: "Steel Trap Reflexes", xpCost: 3, effect: "Increase Edge Stat by 1." },
        { id: "steely-thews", name: "Steely Thews", xpCost: 3, effect: "Increase Might Stat by 1." },
        { id: "studious", name: "Studious", xpCost: 3, effect: "Increase Wits Stat by 1." },
        { id: "whalebone-and-gristle", name: "Whalebone and Gristle", xpCost: 3, effect: "Increase Grit Stat by 1." },
        { id: "determined", name: "Determined", xpCost: 4, effect: "Upgrade Grit die from D6 to D8." },
        { id: "leader-of-men", name: "Leader of Men", xpCost: 4, effect: "Spend 1 SP + Action: Give one ally +1 to all Attack rolls until your next Turn. Spend 2 SP: Affect up to 3 allies.", spCost: 1 },
        { id: "mighty", name: "Mighty", xpCost: 4, effect: "Upgrade Might die from D6 to D8." },
        { id: "sharpness", name: "Sharpness", xpCost: 4, effect: "Upgrade Edge die from D6 to D8." },
        { id: "wide-arc", name: "Wide Arc", xpCost: 4, effect: "Melee Attacks can hit 2 targets within Touch Range. Use the higher Defense value. May only be used once per Round." },
        { id: "wise", name: "Wise", xpCost: 4, effect: "Upgrade Wits die from D6 to D8." },
        { id: "improved-flex-ii", name: "Improved Flex II", xpCost: 5, prerequisite: "improved-flex", effect: "Upgrade Flex die from D8 to D6." },
        { id: "steel-trap-reflexes-ii", name: "Steel Trap Reflexes II", xpCost: 5, prerequisite: "steel-trap-reflexes", effect: "Increase Edge Stat by an additional 1 (stacks with Steel Trap Reflexes)." },
        { id: "steely-thews-ii", name: "Steely Thews II", xpCost: 5, prerequisite: "steely-thews", effect: "Increase Might Stat by an additional 1 (stacks with Steely Thews)." },
        { id: "studious-ii", name: "Studious II", xpCost: 5, prerequisite: "studious", effect: "Increase Wits Stat by an additional 1 (stacks with Studious)." },
        { id: "tough-souled", name: "Tough-Souled", xpCost: 5, effect: "Increase both Physical Defense and Sorcery Defense by 1." },
        { id: "whalebone-and-gristle-ii", name: "Whalebone and Gristle II", xpCost: 5, prerequisite: "whalebone-and-gristle", effect: "Increase Grit Stat by an additional 1 (stacks with Whalebone and Gristle)." },
        { id: "adept-sorcerer", name: "Adept Sorcerer", xpCost: 6, prerequisite: "4+ skills", effect: "Once per Turn, make a bonus Sorcery Attack Action that only costs 1 Action." },
        { id: "determined-ii", name: "Determined II", xpCost: 6, prerequisite: "determined", effect: "Upgrade Grit die from D8 to D10. Increase maximum Life Points by 5.", lpBonus: 5 },
        { id: "legendary", name: "Legendary", xpCost: 6, effect: "Increase any one Stat of your choice by 1." },
        { id: "legendary-sword-arm", name: "Legendary Sword Arm", xpCost: 6, prerequisite: "4+ skills", effect: "Once per Turn, make a bonus Melee Attack Action." },
        { id: "mighty-ii", name: "Mighty II", xpCost: 6, prerequisite: "mighty", effect: "Upgrade Might die from D8 to D10." },
        { id: "sharpness-ii", name: "Sharpness II", xpCost: 6, prerequisite: "sharpness", effect: "Upgrade Edge die from D8 to D10." },
        { id: "sharpshooter", name: "Sharpshooter", xpCost: 6, prerequisite: "4+ skills", effect: "Once per Turn, make a bonus Ranged Attack Action." },
        { id: "wise-ii", name: "Wise II", xpCost: 6, prerequisite: "wise", effect: "Upgrade Wits die from D8 to D10." }
      ]
    };
  }

  /**
   * Prepare owned skills for display in the skills tab
   * @returns {Array} Array of skill objects with display properties
   */
  _prepareOwnedSkills() {
    const skills = this.actor.system.skills || {};
    const allSkillDefs = this._getAllSkillDefinitions();
    const allSkills = [...allSkillDefs.starting, ...allSkillDefs.legendary];

    // Skill name to icon path mapping
    const skillIcons = {
      'born in the saddle': 'systems/conan/images/icons/born_in_the_saddle_i_icon.png',
      'fierce strokes': 'systems/conan/images/icons/fierce_strokes_i_icon.png',
      'fierce shots': 'systems/conan/images/icons/fierce_shots_i_icon.png',
      'impaling throw': 'systems/conan/images/icons/impaling_throw_i_icon.png',
      'charge': 'systems/conan/images/icons/charge_i_icon.png',
      'sacrifice armor': 'systems/conan/images/icons/sacrifice_armor_i_icon.png',
      'unseen strike': 'systems/conan/images/icons/unseen_strike_i_icon.png',
      'defender': 'systems/conan/images/icons/defender_i_icon.png',
      'hardy': 'systems/conan/images/icons/hardy_i_icon.png',
      'infamy': 'systems/conan/images/icons/infamy_i_icon.png',
      'blocker': 'systems/conan/images/icons/blocker_i_icon.png',
      'assassin': 'systems/conan/images/icons/assassin_i_icon.png',
      'brawler': 'systems/conan/images/icons/brawler_i_icon.png',
      'waterfront fists': 'systems/conan/images/icons/waterfront_fists_i_icon.png',
      'fleet footed': 'systems/conan/images/icons/fleet_footed_i_icon.png',
      'hit and run': 'systems/conan/images/icons/hit_and_run_i_icon.png',
      'pantherish': 'systems/conan/images/icons/pantherish_i_icon.png',
      'of the shadows': 'systems/conan/images/icons/of_the_shadows_i_icon.png',
      'lotus blood': 'systems/conan/images/icons/lotus_blood_i_icon.png',
      'leader of men': 'systems/conan/images/icons/leader_of_men_i_icon.png',
      'murderous frenzy': 'systems/conan/images/icons/murderous_frenzy_i_icon.png',
      'combat readiness': 'systems/conan/images/icons/combat_readiness_i_icon.png',
      'combat readiness ii': 'systems/conan/images/icons/combat_readiness_ii_icon.png',
      'poisoner': 'systems/conan/images/icons/poisoner_i_icon.png',
      'eagle-eyed': 'systems/conan/images/icons/eagle_eyed_i_icon.png',
      'eagle-eyed ii': 'systems/conan/images/icons/eagle_eyed_ii_icon.png',
      'iron hide': 'systems/conan/images/icons/iron_hide_i_icon.png',
      'iron hide ii': 'systems/conan/images/icons/iron_hide_ii_icon.png',
      'uncanny warding': 'systems/conan/images/icons/uncanny_warding_i_icon.png',
      'uncanny warding ii': 'systems/conan/images/icons/uncanny_warding_ii_icon.png',
      'steely thews': 'systems/conan/images/icons/steely_thews_i_icon.png',
      'steely thews ii': 'systems/conan/images/icons/steely_thews_ii_icon.png',
      'steel trap reflexes': 'systems/conan/images/icons/steel_trap_reflexes_i_icon.png',
      'steel trap reflexes ii': 'systems/conan/images/icons/steel_trap_reflexes_ii_icon.png',
      'tough-souled': 'systems/conan/images/icons/tough_souled_i_icon.png',
      'studious': 'systems/conan/images/icons/studious_i_icon.png',
      'studious ii': 'systems/conan/images/icons/studious_ii_icon.png',
      'whalebone and gristle': 'systems/conan/images/icons/whalebone_and_gristle_i_icon.png',
      'whalebone and gristle ii': 'systems/conan/images/icons/whalebone_and_gristle_ii_icon.png',
      'improved flex': 'systems/conan/images/icons/improved_flex_i_icon.png',
      'improved flex ii': 'systems/conan/images/icons/improved_flex_ii_icon.png',
      'wise': 'systems/conan/images/icons/wise_i_icon.png',
      'wise ii': 'systems/conan/images/icons/wise_ii_icon.png',
      'protector': 'systems/conan/images/icons/protector_icon.png',
      "soldier's endurance": "systems/conan/images/icons/soldier's_endurance_icon.png",
      'sorcerous vigor': 'systems/conan/images/icons/sorcerous_vigor_i_icon.png',
      'adept sorcerer': 'systems/conan/images/icons/adept_sorcerer_icon.png',
      'resilient': 'systems/conan/images/icons/resilient_icon.png',
      'fierce mind': 'systems/conan/images/icons/fierce_mind_icon.png',
      'determined': 'systems/conan/images/icons/determined_i_icon.png',
      'determined ii': 'systems/conan/images/icons/determined_ii_icon.png',
      'mighty': 'systems/conan/images/icons/mighty_i_icon.png',
      'mighty ii': 'systems/conan/images/icons/mighty_ii_icon.png',
      'sharpness': 'systems/conan/images/icons/sharpness_i_icon.png',
      'sharpness ii': 'systems/conan/images/icons/sharpness_ii_icon.png',
      'wide arc': 'systems/conan/images/icons/wide_arc_icon.png',
      'legendary sword arm': 'systems/conan/images/icons/ledgendary_sword_arm_icon.png',
      'sharpshooter': 'systems/conan/images/icons/sharpshooter_icon.png',
      'legendary': 'systems/conan/images/icons/legendary_icon.png'
    };

    const preparedSkills = [];

    for (const [id, skill] of Object.entries(skills)) {
      // Find matching definition for additional data
      const def = allSkills.find(s =>
        s.name === skill.name ||
        s.name === skill.name?.replace(" (Origin)", "") ||
        skill.name?.includes(s.name)
      );

      // Check for skill icon
      const skillNameLower = skill.name?.toLowerCase() || '';
      const icon = skillIcons[skillNameLower] || null;

      // Determine if skill is actionable (has a use button in skills tab)
      // This includes: skills with SP/LP costs, stance toggles, and skills with special dialogs
      const stanceSkills = ['infamy', 'of the shadows', 'unseen strike', 'defender', 'blocker'];
      const dialogSkills = ['leader of men', 'protector'];
      const activeSkills = ['pantherish', 'charge', 'hit and run', 'impaling throw', 'sacrifice armor'];

      let actionType = null;
      if (dialogSkills.includes(skillNameLower)) actionType = 'dialog';
      else if (stanceSkills.includes(skillNameLower)) actionType = 'stance';
      else if (activeSkills.includes(skillNameLower) || def?.spCost > 0 || def?.lpCost > 0) actionType = 'active';

      preparedSkills.push({
        id: id,
        name: skill.name,
        effect: def?.effect || skill.effect,
        fromOrigin: skill.fromOrigin || false,
        xpCost: def?.xpCost || null,
        spCost: def?.spCost || null,
        lpCost: def?.lpCost || null,
        hasUseCost: actionType !== null,
        actionType: actionType,
        icon: icon
      });
    }

    // Sort: origin skills first, then by name
    preparedSkills.sort((a, b) => {
      if (a.fromOrigin && !b.fromOrigin) return -1;
      if (!a.fromOrigin && b.fromOrigin) return 1;
      return a.name.localeCompare(b.name);
    });

    return preparedSkills;
  }

  /**
   * Prepare available skills for the selection menu
   * @param {number} availableXP Current available XP
   * @returns {Object} Object with starting and legendary skill arrays
   */
  _prepareAvailableSkills(availableXP) {
    const allSkillDefs = this._getAllSkillDefinitions();
    const ownedSkills = this.actor.system.skills || {};
    const ownedSkillNames = Object.values(ownedSkills).map(s =>
      s.name?.replace(" (Origin)", "").toLowerCase()
    );

    // Count non-origin skills for "4+ skills" prerequisite
    const nonOriginSkillCount = Object.values(ownedSkills).filter(s => !s.fromOrigin).length;

    const prepareSkillList = (skills) => {
      return skills.map(skill => {
        const owned = ownedSkillNames.includes(skill.name.toLowerCase());
        const cantAfford = skill.xpCost > availableXP;
        const prereqMet = this._checkSkillPrerequisite(skill.prerequisite, ownedSkillNames, nonOriginSkillCount);
        const prereqUnmet = skill.prerequisite && !prereqMet;

        return {
          ...skill,
          owned,
          cantAfford,
          prereqMet,
          prereqUnmet,
          unavailable: owned || cantAfford || prereqUnmet,
          prerequisiteDisplay: this._getPrerequisiteDisplay(skill.prerequisite),
          queued: false
        };
      });
    };

    return {
      starting: prepareSkillList(allSkillDefs.starting),
      legendary: prepareSkillList(allSkillDefs.legendary)
    };
  }

  /**
   * Check if a skill prerequisite is met
   * @param {string} prerequisite The prerequisite string
   * @param {Array} ownedSkillNames Array of owned skill names (lowercase)
   * @param {number} nonOriginSkillCount Count of non-origin skills
   * @returns {boolean} Whether the prerequisite is met
   */
  _checkSkillPrerequisite(prerequisite, ownedSkillNames, nonOriginSkillCount) {
    if (!prerequisite) return true;

    // Handle "4+ skills" prerequisite
    if (prerequisite === "4+ skills") {
      return nonOriginSkillCount >= 4;
    }

    // Handle skill ID prerequisite - look up the skill name
    const allSkillDefs = this._getAllSkillDefinitions();
    const allSkills = [...allSkillDefs.starting, ...allSkillDefs.legendary];
    const prereqSkill = allSkills.find(s => s.id === prerequisite);

    if (prereqSkill) {
      return ownedSkillNames.includes(prereqSkill.name.toLowerCase());
    }

    return true;
  }

  /**
   * Get human-readable prerequisite display text
   * @param {string} prerequisite The prerequisite string
   * @returns {string} Display text
   */
  _getPrerequisiteDisplay(prerequisite) {
    if (!prerequisite) return "";

    if (prerequisite === "4+ skills") {
      return "4+ Skills";
    }

    // Look up skill name
    const allSkillDefs = this._getAllSkillDefinitions();
    const allSkills = [...allSkillDefs.starting, ...allSkillDefs.legendary];
    const prereqSkill = allSkills.find(s => s.id === prerequisite);

    return prereqSkill ? prereqSkill.name : prerequisite;
  }

  /** Track queued skills in the skill menu */
  _skillQueue = [];

  /** Track queued spells in the invoke menu */
  _spellSelectionQueue = [];
  _openDisciplinePopup = null;

  /**
   * Open the skill selection menu
   */
  _onOpenSkillMenu(event) {
    event.preventDefault();
    this._skillQueue = [];
    const menu = this.element.find('.sheet2-skillMenu');
    menu.addClass('active');
    this._updateSkillMenuUI();
  }

  /**
   * Close the skill selection menu
   */
  _onCloseSkillMenu(event) {
    event.preventDefault();
    this._clearAllTooltips();
    const menu = this.element.find('.sheet2-skillMenu');
    menu.removeClass('active');
    this._skillQueue = [];

    // Reset all skill options to collapsed state
    this.element.find('.sheet2-skillOption').removeClass('expanded queued');
    this.element.find('.sheet2-skillOptionChev').text('▶');
  }

  /**
   * Toggle a skill option's expanded state
   */
  _onSkillOptionToggle(event) {
    event.preventDefault();
    event.stopPropagation();

    const header = $(event.currentTarget);
    const option = header.closest('.sheet2-skillOption');
    const chevron = header.find('.sheet2-skillOptionChev');

    // Toggle expanded state
    if (option.hasClass('expanded')) {
      option.removeClass('expanded');
      chevron.text('▶');
    } else {
      // Collapse all others first
      this.element.find('.sheet2-skillOption').removeClass('expanded');
      this.element.find('.sheet2-skillOptionChev').text('▶');

      option.addClass('expanded');
      chevron.text('▼');
    }
  }

  /**
   * Toggle a skill in the queue (highlight/unhighlight)
   */
  _onSkillQueueToggle(event) {
    event.preventDefault();
    event.stopPropagation();

    const button = $(event.currentTarget);
    const option = button.closest('.sheet2-skillOption');
    const skillId = option.attr('data-skill-def-id');
    const xpCost = parseInt(option.attr('data-xp-cost')) || 0;

    // Check if already in queue
    const queueIndex = this._skillQueue.findIndex(s => s.id === skillId);

    if (queueIndex >= 0) {
      // Remove from queue
      this._skillQueue.splice(queueIndex, 1);
      option.removeClass('queued');
      button.text('ADD');
    } else {
      // Check if we can afford it with current queue
      const currentQueueCost = this._skillQueue.reduce((sum, s) => sum + s.xpCost, 0);
      const availableXP = this._getAvailableXP();

      if (currentQueueCost + xpCost > availableXP) {
        ui.notifications.warn("Not enough XP to add this skill!");
        return;
      }

      // Add to queue
      const allSkillDefs = this._getAllSkillDefinitions();
      const allSkills = [...allSkillDefs.starting, ...allSkillDefs.legendary];
      const skillDef = allSkills.find(s => s.id === skillId);

      if (skillDef) {
        this._skillQueue.push({
          id: skillId,
          name: skillDef.name,
          effect: skillDef.effect,
          xpCost: skillDef.xpCost,
          spCost: skillDef.spCost || null,
          lpCost: skillDef.lpCost || null,
          lpBonus: skillDef.lpBonus || null,
          lpBonusStat: skillDef.lpBonusStat || null
        });
        option.addClass('queued');
        button.text('QUEUED');
      }
    }

    this._updateSkillMenuUI();
  }

  /**
   * Update the skill menu UI (queue summary, button states)
   */
  _updateSkillMenuUI() {
    const queueCount = this._skillQueue.length;
    const queueCost = this._skillQueue.reduce((sum, s) => sum + s.xpCost, 0);
    const availableXP = this._getAvailableXP();
    const remainingXP = availableXP - queueCost;

    // Update queue summary
    this.element.find('.queue-count').text(queueCount);
    this.element.find('.queue-cost').text(queueCost);

    // Update XP display in menu
    this.element.find('.menu-xp-display').text(remainingXP);

    // Enable/disable confirm button
    const confirmBtn = this.element.find('.confirm-skill-selection');
    confirmBtn.prop('disabled', queueCount === 0);

    // Update affordability of non-queued skills based on remaining XP
    this.element.find('.sheet2-skillOption').each((_, el) => {
      const option = $(el);
      if (option.hasClass('owned') || option.hasClass('queued')) return;

      const xpCost = parseInt(option.attr('data-xp-cost')) || 0;
      const addBtn = option.find('.skill-queue-toggle');

      if (xpCost > remainingXP) {
        option.addClass('cant-afford-now');
        addBtn.prop('disabled', true);
      } else {
        option.removeClass('cant-afford-now');
        addBtn.prop('disabled', false);
      }
    });
  }

  /**
   * Confirm skill selection and add queued skills
   */
  async _onConfirmSkillSelection(event) {
    event.preventDefault();

    if (this._skillQueue.length === 0) return;

    const totalCost = this._skillQueue.reduce((sum, s) => sum + s.xpCost, 0);
    const availableXP = this._getAvailableXP();

    if (totalCost > availableXP) {
      ui.notifications.error("Not enough XP to learn these skills!");
      return;
    }

    // Deduct XP
    const xpData = [...(this.actor.system.xp?.available || [])];
    let xpToDeduct = totalCost;

    for (let i = xpData.length - 1; i >= 0 && xpToDeduct > 0; i--) {
      if (xpData[i] === true) {
        xpData[i] = false;
        xpToDeduct--;
      }
    }

    // Add skills
    const updates = {
      'system.xp.available': xpData
    };

    let purchasedPoisoner = false;
    let purchasedSoldiersEndurance = false;
    for (const skill of this._skillQueue) {
      const newId = `skill_${skill.id}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      updates[`system.skills.${newId}`] = {
        name: skill.name,
        effect: skill.effect,
        fromOrigin: false,
        defId: skill.id,
        xpCost: skill.xpCost
      };
      // Check if Poisoner skill was purchased
      if (skill.name.toLowerCase() === 'poisoner') {
        purchasedPoisoner = true;
      }
      // Check if Soldier's Endurance was purchased
      if (skill.name.toLowerCase() === "soldier's endurance") {
        purchasedSoldiersEndurance = true;
      }
    }

    // Auto-create Ichor inventory item when Poisoner skill is purchased
    if (purchasedPoisoner) {
      const ichorId = `item${Date.now()}`;
      updates[`system.inventory.${ichorId}`] = {
        name: "Ichor",
        description: "Poisonous substances for coating weapons. Consumed on successful melee hits dealing 3+ damage.",
        quantity: 5,
        isPoisonerItem: true  // Flag to prevent deletion while Poisoner skill exists
      };
    }

    await this.actor.update(updates);

    // Send dark flavor chat message when Poisoner skill is purchased
    if (purchasedPoisoner) {
      const tokenImg = this.actor.prototypeToken?.texture?.src || this.actor.img || 'icons/svg/mystery-man.svg';
      const chatContent = `
        <div class="conan-roll" style="border-color: #4CAF50;">
          <div class="roll-header">
            <img src="${tokenImg}" class="token-img" alt="${this.actor.name}">
            <div class="roll-title" style="color: #90EE90;">Poisoner</div>
          </div>
          <div style="padding: 8px; color: #90EE90; font-style: italic; text-align: center;">
            "Even the strongest of foes are helpless when it comes to the ichor of fiends, devils, and demons..."
          </div>
          <div style="padding: 8px; color: #aaa; font-size: 15px; text-align: center;">
            🐍 Apply poison to your melee weapons using the toggle in the weapon details panel.
          </div>
        </div>
      `;
      ChatMessage.create({
        speaker: ChatMessage.getSpeaker({ actor: this.actor }),
        content: chatContent
      });
    }

    // Update armor description if Soldier's Endurance was purchased and wearing heavy armor
    if (purchasedSoldiersEndurance) {
      const currentArmor = this.actor.system.armorEquipped || { type: "unarmored", shield: false };
      if (currentArmor.type === 'heavy') {
        await this.actor.update({
          'system.armorEquipped.description': this._getArmorDescription('heavy', currentArmor.shield)
        });
      }
    }

    // Update flex die if Improved Flex skill was added
    await this._updateFlexDieFromSkills();

    // Show notification before clearing queue
    const learnedCount = this._skillQueue.length;
    ui.notifications.info(`Learned ${learnedCount} skill(s)!`);

    // Close menu
    const menu = this.element.find('.sheet2-skillMenu');
    menu.removeClass('active');
    this._skillQueue = [];
  }

  /**
   * Use a skill (deduct SP/LP costs or delegate to specialized handler)
   */
  async _onUseSkill(event) {
    event.preventDefault();

    const button = $(event.currentTarget);
    const skillId = button.attr('data-skill-id');
    const skill = this.actor.system.skills[skillId];

    if (!skill) return;

    const skillNameLower = skill.name?.toLowerCase() || '';

    // Check for skills that need specialized handlers (dialogs, stance toggles, etc.)
    // Dialog skills - open their targeting dialogs
    if (skillNameLower === 'leader of men' || skillNameLower === 'leader-of-men') {
      return this._onLeaderOfMenOpen(event);
    }
    if (skillNameLower === 'protector') {
      return this._onProtectorOpen(event);
    }
    if (skillNameLower === 'legendary') {
      return this._onLegendaryClick(event);
    }

    // Stance toggle skills - toggle their state
    if (skillNameLower === 'infamy') {
      return this._onInfamyToggle(event);
    }
    if (skillNameLower === 'of the shadows' || skillNameLower === 'of-the-shadows') {
      return this._onOfTheShadowsToggle(event);
    }
    if (skillNameLower === 'unseen strike' || skillNameLower === 'unseen-strike') {
      return this._onUnseenStrikeToggle(event);
    }
    if (skillNameLower === 'defender') {
      return this._onDefenderToggle(event);
    }
    if (skillNameLower === 'blocker') {
      return this._onBlockerToggle(event);
    }

    // Active skills with special behaviors
    if (skillNameLower === 'pantherish') {
      // Pantherish from skills tab defaults to check context
      event.currentTarget.dataset = event.currentTarget.dataset || {};
      event.currentTarget.dataset.context = 'check';
      return this._onPantherishClick(event);
    }
    if (skillNameLower === 'charge') {
      return this._onCharge(event);
    }
    if (skillNameLower === 'hit and run' || skillNameLower === 'hit-and-run') {
      return this._onHitAndRun(event);
    }
    if (skillNameLower === 'impaling throw' || skillNameLower === 'impaling-throw') {
      return this._onImpalingThrow(event);
    }
    // Find the skill definition to get costs
    const allSkillDefs = this._getAllSkillDefinitions();
    const allSkills = [...allSkillDefs.starting, ...allSkillDefs.legendary];
    const skillDef = allSkills.find(s =>
      s.name === skill.name ||
      s.name === skill.name?.replace(" (Origin)", "")
    );

    const spCost = skillDef?.spCost || 0;
    const lpCost = skillDef?.lpCost || 0;

    // Check if we can afford it
    const currentSP = this.actor.system.stamina || 0;
    const currentLP = this.actor.system.lifePoints?.value || 0;

    if (spCost > 0 && currentSP < spCost) {
      ui.notifications.warn(`Not enough Stamina! Need ${spCost} SP, have ${currentSP}.`);
      return;
    }

    // Poison: noStamina — skills with SP cost fizzle (SP still spent)
    if (spCost > 0) {
      const poisonEffects = this.actor.getFlag('conan', 'poisonEffects');
      if (poisonEffects?.active && poisonEffects.effects?.noStamina) {
        // Deduct SP — wasted
        await this.actor.update({ 'system.stamina': currentSP - spCost });
        const venomMsg = VENOM_SKILL_MESSAGES[Math.floor(Math.random() * VENOM_SKILL_MESSAGES.length)];
        const ownerColor = this._getOwnerColor();
        ChatMessage.create({
          speaker: ChatMessage.getSpeaker({ actor: this.actor }),
          content: `<div class="conan-roll" style="border-color: ${ownerColor};">
            <h3>${skill.name}</h3>
            <div class="skill-effect"><em style="color: #32CD32;">${venomMsg}</em></div>
            <div class="skill-cost-deducted"><span class="sp-cost">-${spCost} SP (wasted)</span></div>
          </div>`
        });
        return;
      }
    }

    // Deduct costs
    const updates = {};
    if (spCost > 0) {
      updates['system.stamina'] = currentSP - spCost;
    }
    if (lpCost > 0) {
      updates['system.lifePoints.value'] = currentLP - lpCost;
    }

    // Special handling for Sacrifice Armor - set armor to unarmored
    let armorChangeMessage = '';
    if (skillNameLower === 'sacrifice armor') {
      const currentArmor = this.actor.system.armorEquipped || { type: "unarmored", shield: false };
      const armorData = this._getArmorData();
      const oldArmorData = armorData[currentArmor.type] || armorData.unarmored;

      updates['system.armorEquipped.type'] = 'unarmored';
      updates['system.defense.ar'] = 0;
      updates['system.armorEquipped.description'] = this._getArmorDescription('unarmored', currentArmor.shield);

      armorChangeMessage = `<div class="skill-effect" style="color: #ff6b6b;">Armor sacrificed: ${oldArmorData.name} (AR ${oldArmorData.ar}) → Unarmored (AR 0)</div>`;
    }

    if (Object.keys(updates).length > 0) {
      await this.actor.update(updates);
    }

    // Post to chat
    let content = `<div class="conan-roll">`;
    content += `<h3>${skill.name}</h3>`;
    content += `<div class="skill-effect"><em>${skill.effect}</em></div>`;
    if (armorChangeMessage) {
      content += armorChangeMessage;
    }
    if (spCost > 0 || lpCost > 0) {
      content += `<div class="skill-cost-deducted">`;
      if (spCost > 0) content += `<span class="sp-cost">-${spCost} SP</span>`;
      if (lpCost > 0) content += `<span class="lp-cost">-${lpCost} LP</span>`;
      content += `</div>`;
    }
    content += `</div>`;

    ChatMessage.create({
      speaker: ChatMessage.getSpeaker({ actor: this.actor }),
      content: content,
      rollMode: game.settings.get('core', 'rollMode')
    });
  }

  /**
   * Delete a skill from the character
   */
  async _onSkillDelete(event) {
    event.preventDefault();
    event.stopPropagation();

    const skillId = $(event.currentTarget).attr('data-skill-id');
    if (!skillId) return;

    const skill = this.actor.system.skills[skillId];
    if (!skill) return;

    // Don't allow deleting origin skills
    if (skill.fromOrigin) {
      ui.notifications.warn("Cannot remove origin skills!");
      return;
    }

    const confirmed = await Dialog.confirm({
      title: "Forget Skill",
      content: `<p>Forget <strong>${skill.name}</strong>? The XP will not be refunded.</p>`,
    });
    if (!confirmed) return;

    const skillName = skill.name?.toLowerCase() || '';

    // Build update object - always remove the skill
    const updateData = {
      [`system.skills.-=${skillId}`]: null
    };

    // Check for prerequisite chain - remove skills that depend on this one
    const allSkillDefs = this._getAllSkillDefinitions();
    const allSkills = [...allSkillDefs.starting, ...allSkillDefs.legendary];
    const deletedSkillDef = allSkills.find(def => def.name.toLowerCase() === skillName);
    if (deletedSkillDef) {
      // Find any skills the actor has that require this skill as prerequisite
      const actorSkills = this.actor.system.skills || {};
      for (const [actorSkillId, actorSkill] of Object.entries(actorSkills)) {
        const actorSkillDef = allSkills.find(def => def.name.toLowerCase() === actorSkill.name?.toLowerCase());
        if (actorSkillDef && actorSkillDef.prerequisite === deletedSkillDef.id) {
          // This skill depends on the deleted skill - remove it too
          updateData[`system.skills.-=${actorSkillId}`] = null;

          // Also clear any active states for the dependent skill
          const depSkillName = actorSkill.name?.toLowerCase() || '';
          if (depSkillName === 'combat readiness ii') {
            // Combat Readiness II has no active state, but clear context flag if needed
          }
          if (depSkillName === 'improved flex ii') {
            // Will be handled by _updateFlexDieFromSkills
          }

          ui.notifications.info(`Also removed ${actorSkill.name} (requires ${skill.name}).`);
        }
      }
    }

    // Clear active states for skills that have them
    if (skillName === 'blocker') {
      updateData['system.blockerActive'] = false;
    }
    if (skillName === 'impaling throw') {
      updateData['system.impalingThrowActive'] = false;
    }
    if (skillName === 'unseen strike') {
      updateData['system.unseenStrikeActive'] = false;
    }
    if (skillName === 'infamy') {
      updateData['system.infamyActive'] = false;
    }
    // Delete Ichor inventory item and clear poison from all weapons when Poisoner skill is removed
    if (skillName === 'poisoner') {
      const inventory = this.actor.system.inventory || {};
      for (const [itemId, item] of Object.entries(inventory)) {
        if (item && item.isPoisonerItem) {
          updateData[`system.inventory.-=${itemId}`] = null;
        }
      }
      // Clear isPoisoned from all armed weapons
      const armedWeapons = this.actor.system.armedWeapons || {};
      for (const [weaponId, weapon] of Object.entries(armedWeapons)) {
        if (weapon && weapon.isPoisoned) {
          updateData[`system.armedWeapons.${weaponId}.isPoisoned`] = false;
        }
      }
    }
    // Revert armor description when Soldier's Endurance is removed
    if (skillName === "soldier's endurance" || skillName === 'soldiers endurance') {
      const currentArmor = this.actor.system.armorEquipped || { type: "unarmored", shield: false };
      if (currentArmor.type === 'heavy') {
        const armorData = this._getArmorData();
        let description = armorData.heavy.description;
        if (currentArmor.shield) description += armorData.shield.description;
        updateData['system.armorEquipped.description'] = description;
      }
    }
    await this.actor.update(updateData);

    // Update flex die if Improved Flex skill was removed
    await this._updateFlexDieFromSkills();

    ui.notifications.info(`Removed ${skill.name}.`);
  }

  /**
   * Update the stored flex die value based on Improved Flex skills.
   * Called when skills are added or removed to keep the flex die in sync.
   * - No Improved Flex skills: d10
   * - Improved Flex only: d8
   * - Improved Flex II: d6
   */
  async _updateFlexDieFromSkills() {
    const skills = this.actor.system.skills || {};
    let hasImprovedFlex = false;
    let hasImprovedFlexII = false;

    for (const skill of Object.values(skills)) {
      const skillName = skill.name?.toLowerCase() || '';
      if (skillName === 'improved flex') hasImprovedFlex = true;
      if (skillName === 'improved flex ii') hasImprovedFlexII = true;
    }

    // Determine correct flex die based on skills
    let targetFlexDie;
    if (hasImprovedFlexII) {
      targetFlexDie = 'd6';
    } else if (hasImprovedFlex) {
      targetFlexDie = 'd8';
    } else {
      targetFlexDie = 'd10';
    }

    // Only update if different from current stored value
    const currentFlexDie = this.actor.system.flex?.die || 'd10';
    if (currentFlexDie !== targetFlexDie) {
      await this.actor.update({
        'system.flex.die': targetFlexDie
      });
    }
  }

  /**
   * Click on a skill card to post its details to chat
   */
  _onSkillCardClick(event) {
    // Don't trigger if clicking on delete button or use button
    if ($(event.target).closest('.skill-delete, .use-skill').length) {
      return;
    }

    event.preventDefault();

    const skillId = $(event.currentTarget).attr('data-skill-id');
    const skill = this.actor.system.skills[skillId];

    if (!skill) return;

    // Find the skill definition for additional data
    const allSkillDefs = this._getAllSkillDefinitions();
    const allSkills = [...allSkillDefs.starting, ...allSkillDefs.legendary];
    const skillDef = allSkills.find(s =>
      s.name === skill.name ||
      s.name === skill.name?.replace(" (Origin)", "")
    );

    // Build chat message
    let content = `<div class="conan-roll skill-info">`;
    content += `<h3>${skill.name}</h3>`;

    // Show badges
    content += `<div class="skill-badges">`;
    if (skill.fromOrigin) {
      content += `<span class="skill-badge origin">ORIGIN</span>`;
    }
    if (skillDef?.xpCost) {
      content += `<span class="skill-badge cost">${skillDef.xpCost} XP</span>`;
    }
    if (skillDef?.spCost) {
      content += `<span class="skill-badge sp-cost">${skillDef.spCost} SP to use</span>`;
    }
    content += `</div>`;

    content += `<div class="skill-effect"><em>${skill.effect}</em></div>`;
    content += `</div>`;

    ChatMessage.create({
      speaker: ChatMessage.getSpeaker({ actor: this.actor }),
      content: content,
      rollMode: game.settings.get('core', 'rollMode')
    });
  }

  /**
   * Toggle skill card expand/collapse
   */
  _onSkillToggle(event) {
    event.preventDefault();
    event.stopPropagation();

    const header = $(event.currentTarget);
    const card = header.closest('.sheet2-skillCard2');
    card.toggleClass('expanded');
  }

  /**
   * Send skill info to chat
   */
  _onSkillToChat(event) {
    event.preventDefault();
    event.stopPropagation();

    const skillId = $(event.currentTarget).attr('data-skill-id');
    const skill = this.actor.system.skills[skillId];

    if (!skill) return;

    // Find the skill definition for additional data
    const allSkillDefs = this._getAllSkillDefinitions();
    const allSkills = [...allSkillDefs.starting, ...allSkillDefs.legendary];
    const skillDef = allSkills.find(s =>
      s.name === skill.name ||
      s.name === skill.name?.replace(" (Origin)", "")
    );

    const ownerColor = this._getOwnerColor();

    // Build chat message
    let content = `<div class="conan-roll skill-info" style="border-color: ${ownerColor};">`;
    content += `<h3>${skill.name}</h3>`;

    // Show badges (origin & SP cost only — XP cost not shown in chat)
    content += `<div class="skill-badges">`;
    if (skill.fromOrigin) {
      content += `<span class="skill-badge origin">ORIGIN</span>`;
    }
    if (skillDef?.spCost) {
      content += `<span class="skill-badge sp-cost">${skillDef.spCost} SP to use</span>`;
    }
    content += `</div>`;

    content += `<div class="skill-effect">${skill.effect}</div>`;
    content += `</div>`;

    ChatMessage.create({
      speaker: ChatMessage.getSpeaker({ actor: this.actor }),
      content: content,
      rollMode: game.settings.get('core', 'rollMode')
    });
  }

  /**
   * Send skill definition info to chat (from skill selection menu)
   */
  _onSkillDefToChat(event) {
    event.preventDefault();
    event.stopPropagation();

    const skillDefId = $(event.currentTarget).attr('data-skill-def-id');
    if (!skillDefId) return;

    // Find the skill definition
    const allSkillDefs = this._getAllSkillDefinitions();
    const allSkills = [...allSkillDefs.starting, ...allSkillDefs.legendary];
    const skillDef = allSkills.find(s => s.id === skillDefId);

    if (!skillDef) return;

    const ownerColor = this._getOwnerColor();

    // Build chat message
    let content = `<div class="conan-roll skill-info" style="border-color: ${ownerColor};">`;
    content += `<h3>${skillDef.name}</h3>`;

    // Show badges
    content += `<div class="skill-badges">`;
    if (skillDef.xpCost) {
      content += `<span class="skill-badge cost">${skillDef.xpCost} XP</span>`;
    }
    if (skillDef.spCost) {
      content += `<span class="skill-badge sp-cost">${skillDef.spCost} SP to use</span>`;
    }
    if (skillDef.lpCost) {
      content += `<span class="skill-badge lp-cost">${skillDef.lpCost} LP to use</span>`;
    }
    if (skillDef.prerequisite) {
      const prereqDisplay = this._getPrerequisiteDisplay(skillDef.prerequisite);
      content += `<span class="skill-badge prereq">Requires: ${prereqDisplay}</span>`;
    }
    content += `</div>`;

    content += `<div class="skill-effect">${skillDef.effect}</div>`;
    content += `</div>`;

    ChatMessage.create({
      speaker: ChatMessage.getSpeaker({ actor: this.actor }),
      content: content,
      rollMode: game.settings.get('core', 'rollMode')
    });
  }

  /**
   * Increase XP by 1
   */
  async _onXPIncrease(event) {
    event.preventDefault();

    const xpData = [...(this.actor.system.xp?.available || [])];

    // Find first unchecked slot and check it
    for (let i = 0; i < xpData.length; i++) {
      if (xpData[i] !== true) {
        xpData[i] = true;
        break;
      }
    }

    // If all 10 are checked, add another slot
    if (xpData.filter(v => v === true).length === xpData.length && xpData.length < 20) {
      xpData.push(true);
    }

    await this.actor.update({ 'system.xp.available': xpData });
  }

  /**
   * Decrease XP by 1
   */
  async _onXPDecrease(event) {
    event.preventDefault();

    const xpData = [...(this.actor.system.xp?.available || [])];

    // Find last checked slot and uncheck it
    for (let i = xpData.length - 1; i >= 0; i--) {
      if (xpData[i] === true) {
        xpData[i] = false;
        break;
      }
    }

    await this.actor.update({ 'system.xp.available': xpData });
  }

  // ==========================================
  // DEATH SAVE
  // ==========================================

  async _onRollDeathSave(event) {
    event.preventDefault();

    const gritAttr = this.actor.system.attributes.grit;
    const die = gritAttr?.die || 'd6';
    const value = gritAttr?.value || 0;

    // Death Save is a Grit check - apply origin bonuses
    const originBonuses = this._getActiveOriginBonuses();
    const gritBonus = originBonuses.statChecks.grit || 0;

    // Captured Soul (+2 when primed, then consumed)
    const deathSoulPrimed = this.actor.system.capturedSoulState === 'primed';
    let deathSoulBonus = deathSoulPrimed ? 2 : 0;
    if (deathSoulPrimed) {
      this.actor.update({ 'system.capturedSoulState': null });
    }

    // Build roll formula with origin bonus
    let rollFormula = `1${die} + ${value}`;
    if (gritBonus > 0) {
      rollFormula += ` + ${gritBonus}`;
    }
    if (deathSoulBonus > 0) {
      rollFormula += ` + ${deathSoulBonus}`;
    }

    const roll = new Roll(rollFormula, this.actor.getRollData());
    await roll.evaluate();

    const flexData = await this._rollFlexDie('death');

    // Get Winds of Fate modifier
    const windsOfFate = WindsOfFateDialog.getValueForActor(this.actor);
    const adjustedTotal = roll.total + windsOfFate;

    // Determine success (8+ to survive) or failure
    const survived = adjustedTotal >= 8 || flexData.triggered;
    const iconImage = survived ? 'deathcheckpass_icon.png' : 'deathcheck_icon.png';
    const resultText = survived ? 'LIVE' : 'DIE';

    // Show formula with bonus
    let formulaDisplay = `1${die} + ${value}`;
    if (gritBonus > 0) {
      formulaDisplay += ` <span style="color: #90EE90;">(+${gritBonus} Origin)</span>`;
    }
    if (deathSoulBonus > 0) {
      formulaDisplay += ` <span style="color: #DC143C;">(+${deathSoulBonus} Soul)</span>`;
    }
    if (windsOfFate !== 0) {
      formulaDisplay += ` <span style="color: #9370DB;">(${windsOfFate > 0 ? '+' : ''}${windsOfFate} Winds)</span>`;
    }

    let content = `<div class="death-save-result" style="text-align: center; padding: 30px; background: #000; border-radius: 8px;">`;
    content += `<img src="systems/conan/images/${iconImage}" alt="${resultText}" style="width: 250px; height: 250px; display: block; margin: 0 auto 20px auto; object-fit: contain;"/>`;
    content += `<div style="font-size: 48px; font-weight: 900; color: ${survived ? '#4CAF50' : '#f44336'}; letter-spacing: 3px;">${resultText}</div>`;
    content += `<div style="font-size: 14px; color: #aaa; margin-top: 10px;">Roll: ${formulaDisplay} = ${adjustedTotal}</div>`;
    content += `</div>`;

    ChatMessage.create({
      speaker: ChatMessage.getSpeaker({ actor: this.actor }),
      content: content,
      rolls: [roll, flexData.roll],
      rollMode: game.settings.get('core', 'rollMode')
    });
  }

  // ==========================================
  // ADD ITEMS
  // ==========================================

  async _onAddMeleeAttack(event) {
    event.preventDefault();
    const attacks = this.actor.system.meleeAttacks || {};
    const newId = `melee${Date.now()}`;

    await this.actor.update({
      [`system.meleeAttacks.${newId}`]: {
        name: "New Melee Attack",
        range: "Touch",
        damage: "1d6",
        attackAttribute: "might",
        damageAttribute: "might"
      }
    });
  }

  async _onAddThrownAttack(event) {
    event.preventDefault();
    const attacks = this.actor.system.thrownAttacks || {};
    const newId = `thrown${Date.now()}`;

    await this.actor.update({
      [`system.thrownAttacks.${newId}`]: {
        name: "New Thrown Attack",
        range: "Medium",
        damage: "1d6",
        attackAttribute: "edge",
        damageAttribute: "might",
        ammo: { current: 3, max: 3 }
      }
    });
  }

  async _onAddRangedAttack(event) {
    event.preventDefault();
    const attacks = this.actor.system.rangedAttacks || {};
    const newId = `ranged${Date.now()}`;
    
    await this.actor.update({
      [`system.rangedAttacks.${newId}`]: {
        name: "New Ranged Attack",
        range: "Medium",
        damage: "1d6",
        attackAttribute: "edge",
        type: "bow",
        ammo: { current: 10, max: 10 }
      }
    });
  }

  // ==========================================
  // SORCERY SYSTEM HANDLERS
  // ==========================================

  /**
   * Open the spell selection menu (matching skills pattern)
   */
  _onOpenSpellMenu(event) {
    event.preventDefault();

    // Check if character has sorcery access
    const originId = this.actor.system.origin?.id;
    const sorceryAccess = this._getOriginSorceryAccess(originId);
    if (sorceryAccess.length === 0) {
      ui.notifications.warn("Your origin does not grant access to sorcery.");
      return;
    }

    const menu = this.element.find('.sheet2-spellMenu');
    menu.addClass('active');

    // Initialize spell selection queue
    this._spellSelectionQueue = [];

    // Update summary display
    this._updateSpellSelectionSummary();

    // Reset all spell option states
    this.element.find('.sheet2-spellOption').removeClass('queued expanded');
    this.element.find('.spell-queue-toggle').text('ADD');
    this.element.find('.sheet2-spellOptionChev').text('▶');
  }

  /**
   * Close the spell selection menu
   */
  _onCloseSpellMenu(event) {
    event.preventDefault();
    this._clearAllTooltips();
    const menu = this.element.find('.sheet2-spellMenu');
    menu.removeClass('active');

    // Reset state
    this._spellSelectionQueue = [];
  }

  /**
   * Toggle a discipline tier expanded/collapsed
   */
  _onDisciplineTierToggle(event) {
    event.preventDefault();
    const header = $(event.currentTarget);
    const disciplineId = header.attr('data-discipline');
    const content = this.element.find(`.sheet2-spellTierContent[data-discipline-content="${disciplineId}"]`);
    const confirmBar = content.find('.sheet2-disciplineConfirm');
    const chevron = header.find('.sheet2-spellTierChev');

    // Toggle expanded state
    const isExpanded = content.hasClass('expanded');
    content.toggleClass('expanded');
    confirmBar.toggleClass('collapsed', isExpanded); // Hide confirm bar when collapsing
    chevron.text(isExpanded ? '▶' : '▼');
  }

  /**
   * Toggle a spell option expanded to show details
   */
  _onSpellOptionToggle(event) {
    event.preventDefault();
    event.stopPropagation();

    const header = $(event.currentTarget);
    const option = header.closest('.sheet2-spellOption');
    const chevron = option.find('.sheet2-spellOptionChev');

    // Toggle expanded state
    const isExpanded = option.hasClass('expanded');
    option.toggleClass('expanded');
    chevron.text(isExpanded ? '▶' : '▼');
  }

  /**
   * Toggle a spell in the selection queue
   */
  _onSpellQueueToggle(event) {
    event.preventDefault();
    event.stopPropagation();

    const button = $(event.currentTarget);
    const option = button.closest('.sheet2-spellOption');
    // Use .attr() for reliable reading of data attributes
    const spellId = button.attr('data-spell-def-id');
    const disciplineId = button.attr('data-discipline');
    const xpCost = parseInt(option.attr('data-xp-cost')) || 0;

    // Get spell data from catalog
    const spellCatalog = this._getSpellCatalog();
    const discipline = spellCatalog[disciplineId];
    const spell = discipline?.purchasableSpells.find(s => s.id === spellId);
    if (!spell) return;

    // Check if already queued
    const queueIndex = this._spellSelectionQueue.findIndex(s => s.id === spellId);

    if (queueIndex >= 0) {
      // Remove from queue
      this._spellSelectionQueue.splice(queueIndex, 1);
      option.removeClass('queued');
      button.text('ADD');
    } else {
      // Check affordability
      const availableXP = this._getAvailableXP();
      const queuedXP = this._spellSelectionQueue.reduce((sum, s) => sum + s.xpCost, 0);
      const remainingXP = availableXP - queuedXP;

      if (xpCost > remainingXP) {
        ui.notifications.warn("Not enough XP to add this spell!");
        return;
      }

      // Add to queue
      this._spellSelectionQueue.push({
        id: spellId,
        name: spell.name,
        discipline: disciplineId,
        xpCost: xpCost
      });
      option.addClass('queued');
      button.text('QUEUED');
    }

    // Update summary and affordability
    this._updateSpellSelectionSummary();
    this._updateSpellAffordability();
  }

  /**
   * Update per-discipline spell selection summaries
   */
  _updateSpellSelectionSummary() {
    const count = this._spellSelectionQueue.length;
    const totalXP = this._spellSelectionQueue.reduce((sum, s) => sum + s.xpCost, 0);
    this.element.find('.spell-queue-count').text(count);
    this.element.find('.spell-queue-cost').text(totalXP);
    this.element.find('.confirm-spell-selection').prop('disabled', count === 0);
    this._updateSpellAffordability();
  }

  /**
   * Update which spells can be afforded based on remaining XP
   */
  _updateSpellAffordability() {
    const availableXP = this._getAvailableXP();
    const queuedXP = this._spellSelectionQueue.reduce((sum, s) => sum + s.xpCost, 0);
    const remainingXP = availableXP - queuedXP;

    // Update header XP display
    this.element.find('.sheet2-spellMenu .menu-xp-display').text(remainingXP);

    // Update each spell option's affordability
    this.element.find('.sheet2-spellOption').each((_, el) => {
      const option = $(el);
      if (option.hasClass('owned') || option.hasClass('queued')) return;

      const xpCost = parseInt(option.attr('data-xp-cost')) || 0;
      if (xpCost > remainingXP) {
        option.addClass('unavailable');
        option.find('.sheet2-spellOptionStatus').text('Cannot Afford');
      } else {
        option.removeClass('unavailable');
      }
    });
  }

  /**
   * Confirm spell selection — purchase all queued spells across all disciplines
   */
  async _onConfirmSpellSelection(event) {
    event.preventDefault();

    if (this._spellSelectionQueue.length === 0) return;

    const totalCost = this._spellSelectionQueue.reduce((sum, s) => sum + s.xpCost, 0);
    const availableXP = this._getAvailableXP();

    if (totalCost > availableXP) {
      ui.notifications.warn("Not enough XP to learn these spells!");
      return;
    }

    // Deduct XP
    const xpData = [...(this.actor.system.xp?.available || [])];
    let xpToDeduct = totalCost;

    for (let i = xpData.length - 1; i >= 0 && xpToDeduct > 0; i--) {
      if (xpData[i] === true) {
        xpData[i] = false;
        xpToDeduct--;
      }
    }

    // Build update object for all queued spells
    const updates = {
      'system.xp.available': xpData
    };

    for (const spell of this._spellSelectionQueue) {
      updates[`system.sorcery.invokedSpells.${spell.id}`] = {
        discipline: spell.discipline,
        invokedAt: Date.now()
      };
    }

    await this.actor.update(updates);

    // Show notification
    const spellNames = this._spellSelectionQueue.map(s => s.name).join(', ');
    ui.notifications.info(`Learned ${spellNames} for ${totalCost} XP!`);

    // Close menu and clear queue
    const menu = this.element.find('.sheet2-spellMenu');
    menu.removeClass('active');
    this._spellSelectionQueue = [];
  }

  /**
   * Toggle discipline section on the front display (learned spells)
   */
  _onDisciplineToggle(event) {
    event.preventDefault();
    const button = $(event.currentTarget);
    const disciplineId = button.data('discipline');
    const spellsGrid = this.element.find(`.sheet2-spellsGrid[data-discipline-grid="${disciplineId}"]`);

    // Toggle collapsed state
    button.toggleClass('collapsed');
    spellsGrid.toggleClass('collapsed');

    // Track expanded state for re-render restoration
    if (button.hasClass('collapsed')) {
      this._expandedDisciplines.delete(disciplineId);
    } else {
      this._expandedDisciplines.add(disciplineId);
    }
  }

  _onSpellToggle(event) {
    event.preventDefault();
    event.stopPropagation();

    const target = $(event.currentTarget);
    const spellId = target.attr('data-spell-id');
    const spellCard = this.element.find(`.sheet2-spellCard[data-spell-id="${spellId}"]`);

    // Close any other open spell card
    this._clearAllTooltips();
    if (this._openSpellPanelId && this._openSpellPanelId !== spellId) {
      this.element.find('.sheet2-spellCard').removeClass('expanded');
    }

    // Toggle this spell card
    if (spellCard.hasClass('expanded')) {
      spellCard.removeClass('expanded');
      this._openSpellPanelId = null;
    } else {
      spellCard.addClass('expanded');
      this._openSpellPanelId = spellId;
    }
  }

  /**
   * Send spell details to chat
   */
  _onSpellToChat(event) {
    event.preventDefault();
    event.stopPropagation();

    const spellId = event.currentTarget.dataset.spellId;
    if (!spellId) return;

    // Find spell from catalog (handles both inherent and purchased spells)
    const spellData = this._findSpellById(spellId);

    if (!spellData) {
      ui.notifications.warn("Spell data not found.");
      return;
    }

    // Format cost display
    const costParts = [];
    if (spellData.cost?.sp) costParts.push(`${spellData.cost.sp} SP`);
    if (spellData.cost?.lp) costParts.push(`${spellData.cost.lp} LP`);
    const costDisplay = costParts.join(', ') || 'Free';
    const typeDisplay = spellData.type === 'attack' ? 'Attack' : spellData.type === 'cast' ? 'Cast' : spellData.type;

    // Build chat message content
    const chatContent = `
      <div class="conan-spell-chat" style="background: linear-gradient(180deg, #1a1a1e 0%, #0d0d0f 100%); border-left: 3px solid rgba(138, 43, 226, 0.6); padding: 10px 14px; border-radius: 4px;">
        <div style="font-weight: 700; font-size: 18px; color: #fff; margin-bottom: 6px;">${spellData.name}</div>
        <div style="display: flex; flex-wrap: wrap; gap: 6px; margin-bottom: 8px; font-size: 14px;">
          <span style="background: rgba(0,0,0,0.4); padding: 3px 8px; border-radius: 3px; color: #BA55D3;">${typeDisplay}</span>
          <span style="background: rgba(0,0,0,0.4); padding: 3px 8px; border-radius: 3px; color: #87CEEB;">${costDisplay}</span>
          ${spellData.range ? `<span style="background: rgba(0,0,0,0.4); padding: 3px 8px; border-radius: 3px;">${spellData.range}</span>` : ''}
          ${spellData.damage ? `<span style="background: rgba(0,0,0,0.4); padding: 3px 8px; border-radius: 3px; color: #FF6B6B;">${spellData.damage}</span>` : ''}
        </div>
        <div style="font-size: 16px; color: rgba(255,255,255,0.8); line-height: 1.5;">${spellData.effect}</div>
        ${spellData.limit ? `<div style="font-size: 14px; color: #BA55D3; margin-top: 6px;">Limit: ${spellData.limit}</div>` : ''}
      </div>
    `;

    ChatMessage.create({
      speaker: ChatMessage.getSpeaker({ actor: this.actor }),
      content: chatContent
    });
  }

  async _onDeleteSpell(event) {
    event.preventDefault();
    event.stopPropagation();

    const spellId = event.currentTarget.dataset.spellId;
    if (!spellId) return;

    const spellData = this._findSpellById(spellId);
    const spellName = spellData?.name || spellId;

    const confirmed = await Dialog.confirm({
      title: "Forget Spell",
      content: `<p>Forget <strong>${spellName}</strong>? The XP will not be refunded.</p>`,
    });
    if (!confirmed) return;

    // Remove from invoked spells
    await this.actor.update({
      [`system.sorcery.invokedSpells.-=${spellId}`]: null
    });

    this._openSpellPanelId = null;
    ui.notifications.info(`${spellName} forgotten.`);
  }

  _onSorceryAreaClick(event) {
    // Only close if we have an open panel and click is outside it
    if (!this._openSpellPanelId) return;

    const target = $(event.target);

    // Don't close if clicking inside a spell card
    if (target.closest('.sheet2-spellCard').length ||
        target.closest('.spell-toggle').length) {
      return;
    }

    // Close the open spell card
    this._clearAllTooltips();
    this.element.find('.sheet2-spellCard').removeClass('expanded');
    this._openSpellPanelId = null;
  }

  async _onAddSkill(event) {
    event.preventDefault();
    const newId = `skill${Date.now()}`;
    
    await this.actor.update({
      [`system.skills.${newId}`]: {
        name: "New Skill",
        effect: ""
      }
    });
  }

  // ==========================================
  // DELETE ITEMS
  // ==========================================

  async _onDeleteItem(event) {
    event.preventDefault();
    const element = event.currentTarget;
    const itemId = element.dataset.itemId;
    const parent = element.closest('[data-attack-type], [data-spell-id], [data-skill-id]');
    
    if (parent?.dataset.attackType === 'melee') {
      await this.actor.update({ [`system.meleeAttacks.-=${itemId}`]: null });
    } else if (parent?.dataset.attackType === 'thrown') {
      await this.actor.update({ [`system.thrownAttacks.-=${itemId}`]: null });
    } else if (parent?.dataset.attackType === 'ranged') {
      await this.actor.update({ [`system.rangedAttacks.-=${itemId}`]: null });
    } else if (parent?.dataset.spellId) {
      await this.actor.update({ [`system.spells.-=${itemId}`]: null });
    } else if (parent?.dataset.skillId) {
      await this.actor.update({ [`system.skills.-=${itemId}`]: null });
    }
  }

  // ==========================================
  // ARMOR
  // ==========================================

  _getArmorData() {
    return {
      unarmored: { name: "Unarmored", ar: 0, description: "No armor equipped. | AR: 0 | No penalties." },
      light: { name: "Light Armor", ar: 3, description: "LIGHT ARMOR | AR: 3 | Encumbrance: 1 Might\nPenalties: -1 Sorcery, -1 Stealth" },
      medium: { name: "Medium Armor", ar: 5, description: "MEDIUM ARMOR | AR: 5 | Encumbrance: 3 Might\nPenalties: -2 Sorcery, -2 Stealth | Max 2 Move Actions" },
      heavy: { name: "Heavy Armor", ar: 8, description: "HEAVY ARMOR | AR: 8 | Encumbrance: 5 Might\nPenalties: -3 Sorcery, -3 Stealth | Max 1 Move Action | 1 Recovery per session" },
      shield: { name: "Shield", ar: 0, description: "\n+ SHIELD | +1 Physical Defense | Encumbrance: 3 Might | Requires one free hand" }
    };
  }

  _getArmorDescription(armorType, hasShield) {
    const armorData = this._getArmorData();
    const armor = armorData[armorType] || armorData.unarmored;
    let description = armor.description;

    // Soldier's Endurance: Heavy armor uses Medium armor penalties
    if (armorType === 'heavy' && this._hasSoldiersEndurance()) {
      description = "HEAVY ARMOR | AR: 8 | Soldier's Endurance\nPenalties: -2 Sorcery, -2 Stealth | Max 2 Move Actions";
    }

    if (hasShield) description += armorData.shield.description;
    return description;
  }

  /**
   * Check if the actor has the Soldier's Endurance skill
   */
  _hasSoldiersEndurance() {
    const skills = this.actor.system.skills || {};
    for (const skill of Object.values(skills)) {
      const skillName = skill.name?.toLowerCase() || '';
      if (skillName === "soldier's endurance" || skillName === 'soldiers endurance') {
        return true;
      }
    }
    return false;
  }

  async _onArmorTypeSelect(event) {
    event.preventDefault();
    this._saveScrollPosition();

    const selectedType = event.currentTarget.dataset.armorType;
    const currentArmor = this.actor.system.armorEquipped || { type: "unarmored", shield: false };
    const armorData = this._getArmorData();

    let updates = {};

    if (selectedType === "shield") {
      const newShieldState = !currentArmor.shield;
      updates['system.armorEquipped.shield'] = newShieldState;
      updates['system.armorEquipped.description'] = this._getArmorDescription(currentArmor.type, newShieldState);

      // If shield is being removed and Blocker stance is active, deactivate it
      if (!newShieldState && this.actor.system.blockerActive) {
        updates['system.blockerActive'] = false;
        ui.notifications.info("Blocker stance ended - shield removed.");
      }
    } else {
      const oldArmorType = currentArmor.type || "unarmored";
      const oldArmorData = armorData[oldArmorType] || armorData.unarmored;
      const newArmorData = armorData[selectedType];
      const currentAR = this.actor.system.defense.ar || 0;
      const arDiff = newArmorData.ar - oldArmorData.ar;

      updates['system.armorEquipped.type'] = selectedType;
      updates['system.defense.ar'] = currentAR + arDiff;
      updates['system.armorEquipped.description'] = this._getArmorDescription(selectedType, currentArmor.shield);
    }

    await this.actor.update(updates);
  }

  /**
   * Handle Impaling Throw skill activation from the Arms tab icon
   * Costs 1 SP, doubles thrown weapon damage on next attack
   */
  async _onImpalingThrow(event) {
    event.preventDefault();
    this._dismissAllTooltips();

    const spCost = 1;
    const currentSP = this.actor.system.stamina || 0;

    if (currentSP < spCost) {
      ui.notifications.warn(`Not enough Stamina! Need ${spCost} SP, have ${currentSP}.`);
      return;
    }

    // Poison: noStamina — skill fizzles
    const poisonEffects = this.actor.getFlag('conan', 'poisonEffects');
    if (poisonEffects?.active && poisonEffects.effects?.noStamina) {
      await this.actor.update({ 'system.stamina': currentSP - spCost });
      const venomMsg = VENOM_SKILL_MESSAGES[Math.floor(Math.random() * VENOM_SKILL_MESSAGES.length)];
      ChatMessage.create({
        speaker: ChatMessage.getSpeaker({ actor: this.actor }),
        content: `<div class="conan-roll"><h3>Impaling Throw</h3><div class="skill-effect"><em style="color: #32CD32;">${venomMsg}</em></div><div class="skill-cost-deducted"><span class="sp-cost">-${spCost} SP (wasted)</span></div></div>`
      });
      return;
    }

    // Deduct SP and set impaling throw active flag
    await this.actor.update({
      'system.stamina': currentSP - spCost,
      'system.impalingThrowActive': true
    });

    // Post to chat
    let content = `<div class="conan-roll">`;
    content += `<h3>Impaling Throw</h3>`;
    content += `<div class="skill-effect"><em>Next thrown weapon attack deals DOUBLE damage!</em></div>`;
    content += `<div class="skill-cost-deducted"><span class="sp-cost">-${spCost} SP</span></div>`;
    content += `</div>`;

    ChatMessage.create({
      speaker: ChatMessage.getSpeaker({ actor: this.actor }),
      content: content,
      rollMode: game.settings.get('core', 'rollMode')
    });
  }

  /**
   * Handle Charge skill activation from the Arms tab icon
   * Costs 1 SP, allows 2 Move + Melee Attack as single action
   */
  async _onCharge(event) {
    event.preventDefault();
    this._dismissAllTooltips();

    const spCost = 1;
    const currentSP = this.actor.system.stamina || 0;

    if (currentSP < spCost) {
      ui.notifications.warn(`Not enough Stamina! Need ${spCost} SP, have ${currentSP}.`);
      return;
    }

    // Poison: noStamina — skill fizzles
    const poisonEffects = this.actor.getFlag('conan', 'poisonEffects');
    if (poisonEffects?.active && poisonEffects.effects?.noStamina) {
      await this.actor.update({ 'system.stamina': currentSP - spCost });
      const venomMsg = VENOM_SKILL_MESSAGES[Math.floor(Math.random() * VENOM_SKILL_MESSAGES.length)];
      ChatMessage.create({
        speaker: ChatMessage.getSpeaker({ actor: this.actor }),
        content: `<div class="conan-roll"><h3>Charge</h3><div class="skill-effect"><em style="color: #32CD32;">${venomMsg}</em></div><div class="skill-cost-deducted"><span class="sp-cost">-${spCost} SP (wasted)</span></div></div>`
      });
      return;
    }

    // Deduct SP
    await this.actor.update({
      'system.stamina': currentSP - spCost
    });

    // Post to chat
    let content = `<div class="conan-roll">`;
    content += `<h3>⚔️ CHARGE!</h3>`;
    content += `<div class="skill-effect"><em>2 Move Actions + 1 Melee Attack as a single Action!</em></div>`;
    content += `<div class="skill-cost-deducted"><span class="sp-cost">-${spCost} SP</span></div>`;
    content += `</div>`;

    ChatMessage.create({
      speaker: ChatMessage.getSpeaker({ actor: this.actor }),
      content: content,
      rollMode: game.settings.get('core', 'rollMode')
    });
  }

  /**
   * Handle Hit and Run skill activation from the Arms tab icon
   * Costs 1 SP, allows Attack + 2 Move as single action
   */
  async _onHitAndRun(event) {
    event.preventDefault();
    this._dismissAllTooltips();

    const spCost = 1;
    const currentSP = this.actor.system.stamina || 0;

    if (currentSP < spCost) {
      ui.notifications.warn(`Not enough Stamina! Need ${spCost} SP, have ${currentSP}.`);
      return;
    }

    // Poison: noStamina — skill fizzles
    const poisonEffects = this.actor.getFlag('conan', 'poisonEffects');
    if (poisonEffects?.active && poisonEffects.effects?.noStamina) {
      await this.actor.update({ 'system.stamina': currentSP - spCost });
      const venomMsg = VENOM_SKILL_MESSAGES[Math.floor(Math.random() * VENOM_SKILL_MESSAGES.length)];
      ChatMessage.create({
        speaker: ChatMessage.getSpeaker({ actor: this.actor }),
        content: `<div class="conan-roll"><h3>Hit and Run</h3><div class="skill-effect"><em style="color: #32CD32;">${venomMsg}</em></div><div class="skill-cost-deducted"><span class="sp-cost">-${spCost} SP (wasted)</span></div></div>`
      });
      return;
    }

    // Deduct SP
    await this.actor.update({
      'system.stamina': currentSP - spCost
    });

    // Post to chat
    let content = `<div class="conan-roll">`;
    content += `<h3>💨 HIT AND RUN!</h3>`;
    content += `<div class="skill-effect"><em>1 Attack + 2 Move Actions as a single Action!</em></div>`;
    content += `<div class="skill-cost-deducted"><span class="sp-cost">-${spCost} SP</span></div>`;
    content += `</div>`;

    ChatMessage.create({
      speaker: ChatMessage.getSpeaker({ actor: this.actor }),
      content: content,
      rollMode: game.settings.get('core', 'rollMode')
    });
  }

  /**
   * Open Leader of Men dialog to select allies to buff
   */
  async _onLeaderOfMenOpen(event) {
    event.preventDefault();
    this._dismissAllTooltips();

    const html = $(this.element);
    const dialog = html.find('.sheet2-leaderOfMenDialog');
    const allyList = html.find('.sheet2-leaderAllyList');

    // Get all player character actors in the current scene
    const currentScene = game.scenes.active;
    const allies = [];

    if (currentScene) {
      // Get token documents from the scene (same pattern as tools-sheet.js)
      const tokenDocs = currentScene.tokens.contents || [];
      for (const tokenDoc of tokenDocs) {
        const tokenActor = tokenDoc.actor;
        // Only include player characters (not this actor)
        // Use 'character2' for sheet2 actors, or 'character' for legacy
        if (tokenActor &&
            (tokenActor.type === 'character2' || tokenActor.type === 'character') &&
            tokenActor.id !== this.actor.id &&
            tokenActor.hasPlayerOwner) {
          // Check if already buffed by this leader
          const existingBuff = tokenActor.system.leaderOfMenBuff;
          const isBuffedByMe = existingBuff?.leaderId === this.actor.id;
          const isBuffedByOther = existingBuff && existingBuff.leaderId !== this.actor.id;

          allies.push({
            id: tokenActor.id,
            name: tokenActor.name,
            isBuffedByMe,
            isBuffedByOther,
            buffedBy: existingBuff?.leaderName || ''
          });
        }
      }
    }

    // Populate ally list
    if (allies.length === 0) {
      allyList.html('<div class="sheet2-leaderAllyPlaceholder">No allies in scene</div>');
    } else {
      let listHtml = '';
      for (const ally of allies) {
        let statusText = '';
        let disabledClass = '';
        let checkedAttr = '';

        if (ally.isBuffedByMe) {
          statusText = 'Currently inspired';
          checkedAttr = 'checked';
        } else if (ally.isBuffedByOther) {
          statusText = `Inspired by ${ally.buffedBy}`;
          // Can still select to take over the buff
        }

        listHtml += `
          <div class="sheet2-leaderAllyItem ${ally.isBuffedByMe ? 'selected' : ''} ${disabledClass}"
               data-actor-id="${ally.id}">
            <input type="checkbox" class="sheet2-leaderAllyCheckbox leader-ally-checkbox"
                   data-actor-id="${ally.id}" ${checkedAttr}/>
            <span class="sheet2-leaderAllyName">${ally.name}</span>
            ${statusText ? `<span class="sheet2-leaderAllyStatus">${statusText}</span>` : ''}
          </div>
        `;
      }
      allyList.html(listHtml);

      // Add click handlers to ally items
      allyList.find('.sheet2-leaderAllyItem').click((e) => {
        if ($(e.target).is('input')) return; // Let checkbox handle itself
        const checkbox = $(e.currentTarget).find('.leader-ally-checkbox');
        checkbox.prop('checked', !checkbox.prop('checked')).trigger('change');
      });

      // Add change handlers to checkboxes
      allyList.find('.leader-ally-checkbox').change(() => this._updateLeaderSelection(html));
    }

    // Reset cost selection and update UI
    html.find('.leader-cost-radio[value="1"]').prop('checked', true);
    this._updateLeaderSelection(html);

    // Show dialog and initialize dragging
    dialog.addClass('active');
    this._initLeaderDialogDrag(dialog);
  }

  /**
   * Initialize drag functionality for Leader of Men dialog
   */
  _initLeaderDialogDrag(dialog) {
    const handle = dialog.find('.leader-dialog-drag-handle');
    let isDragging = false;
    let startX, startY, startLeft, startTop;

    handle.off('mousedown.leaderDrag').on('mousedown.leaderDrag', (e) => {
      if ($(e.target).closest('.sheet2-closeLeaderMenu').length) return; // Don't drag when clicking close button

      isDragging = true;
      startX = e.clientX;
      startY = e.clientY;

      // Get current position (remove transform for accurate positioning)
      const rect = dialog[0].getBoundingClientRect();
      dialog.css({
        transform: 'none',
        left: rect.left + 'px',
        top: rect.top + 'px'
      });
      startLeft = rect.left;
      startTop = rect.top;

      $(document).on('mousemove.leaderDrag', (moveEvent) => {
        if (!isDragging) return;
        const dx = moveEvent.clientX - startX;
        const dy = moveEvent.clientY - startY;
        dialog.css({
          left: (startLeft + dx) + 'px',
          top: (startTop + dy) + 'px'
        });
      });

      $(document).on('mouseup.leaderDrag', () => {
        isDragging = false;
        $(document).off('mousemove.leaderDrag mouseup.leaderDrag');
      });
    });
  }

  /**
   * Close Leader of Men dialog
   */
  _onLeaderOfMenClose(event) {
    event.preventDefault();
    const html = $(this.element);
    html.find('.sheet2-leaderOfMenDialog').removeClass('active');
  }

  /**
   * Handle cost radio change in Leader of Men dialog
   */
  _onLeaderCostChange(event) {
    const html = $(this.element);
    this._updateLeaderSelection(html);
  }

  /**
   * Update selection state and button enablement
   */
  _updateLeaderSelection(html) {
    const cost = parseInt(html.find('.leader-cost-radio:checked').val()) || 1;
    const maxCount = cost === 1 ? 1 : 3;
    const selectedCount = html.find('.leader-ally-checkbox:checked').length;

    // Update summary
    html.find('.leader-selected-count').text(selectedCount);
    html.find('.leader-max-count').text(maxCount);

    // Enable/disable inspire button
    const inspireBtn = html.find('.leader-inspire');
    inspireBtn.prop('disabled', selectedCount === 0 || selectedCount > maxCount);

    // Update selected state on items
    html.find('.sheet2-leaderAllyItem').each((_, item) => {
      const $item = $(item);
      const checkbox = $item.find('.leader-ally-checkbox');
      $item.toggleClass('selected', checkbox.prop('checked'));
    });

    // Disable unchecked items if at max
    html.find('.sheet2-leaderAllyItem').each((_, item) => {
      const $item = $(item);
      const checkbox = $item.find('.leader-ally-checkbox');
      if (!checkbox.prop('checked') && selectedCount >= maxCount) {
        $item.addClass('disabled');
        checkbox.prop('disabled', true);
      } else {
        $item.removeClass('disabled');
        checkbox.prop('disabled', false);
      }
    });
  }

  /**
   * Handle INSPIRE button - apply buff to selected allies
   */
  async _onLeaderInspire(event) {
    event.preventDefault();
    const html = $(this.element);

    const cost = parseInt(html.find('.leader-cost-radio:checked').val()) || 1;
    const currentSP = this.actor.system.stamina || 0;

    if (currentSP < cost) {
      ui.notifications.warn(`Not enough Stamina! Need ${cost} SP, have ${currentSP}.`);
      return;
    }

    // Get selected allies
    const selectedIds = [];
    html.find('.leader-ally-checkbox:checked').each((_, cb) => {
      selectedIds.push($(cb).attr('data-actor-id'));
    });

    if (selectedIds.length === 0) {
      ui.notifications.warn('No allies selected!');
      return;
    }

    // Deduct SP
    await this.actor.update({
      'system.stamina': currentSP - cost,
      'system.leaderOfMenTargets': selectedIds
    });

    // Create invisible chat message to sync buff across clients
    await ChatMessage.create({
      content: '<div style="display:none;"></div>',
      speaker: ChatMessage.getSpeaker({ alias: 'System' }),
      whisper: [],
      flags: {
        conan: {
          leaderOfMenApply: true,
          leaderId: this.actor.id,
          leaderName: this.actor.name,
          targetIds: selectedIds
        }
      }
    });

    // Get ally names for chat message
    const allyNames = selectedIds.map(id => {
      const actor = game.actors.get(id);
      return actor?.name || 'Unknown';
    }).join(', ');

    // Post visible chat message
    let content = `<div class="conan-roll">`;
    content += `<h3 style="color: #ffd700;">⚔️ LEADER OF MEN!</h3>`;
    content += `<div class="skill-effect"><em>${this.actor.name} inspires their allies!</em></div>`;
    content += `<div class="skill-effect" style="color: #90EE90;">${allyNames} gains +1 to Attacks!</div>`;
    content += `<div class="skill-cost-deducted"><span class="sp-cost">-${cost} SP</span></div>`;
    content += `</div>`;

    ChatMessage.create({
      speaker: ChatMessage.getSpeaker({ actor: this.actor }),
      content: content,
      rollMode: game.settings.get('core', 'rollMode')
    });

    // Close dialog
    html.find('.sheet2-leaderOfMenDialog').removeClass('active');
  }

  /**
   * Handle STAND DOWN button - remove buff from all allies
   */
  async _onLeaderStandDown(event) {
    event.preventDefault();
    const html = $(this.element);

    const targetIds = this.actor.system.leaderOfMenTargets || [];

    if (targetIds.length === 0) {
      ui.notifications.info('No allies currently inspired.');
      return;
    }

    // Clear local targets
    await this.actor.update({
      'system.leaderOfMenTargets': []
    });

    // Create invisible chat message to sync buff removal across clients
    await ChatMessage.create({
      content: '<div style="display:none;"></div>',
      speaker: ChatMessage.getSpeaker({ alias: 'System' }),
      whisper: [],
      flags: {
        conan: {
          leaderOfMenRemove: true,
          leaderId: this.actor.id,
          leaderName: this.actor.name,
          targetIds: targetIds
        }
      }
    });

    // Post visible chat message
    let content = `<div class="conan-roll">`;
    content += `<h3 style="color: #888;">Leader of Men</h3>`;
    content += `<div class="skill-effect" style="color: #888;"><em>${this.actor.name} stands down.</em></div>`;
    content += `<div class="skill-effect" style="color: #ff6b6b;">Inspiration ended.</div>`;
    content += `</div>`;

    ChatMessage.create({
      speaker: ChatMessage.getSpeaker({ actor: this.actor }),
      content: content,
      rollMode: game.settings.get('core', 'rollMode')
    });

    // Close dialog
    html.find('.sheet2-leaderOfMenDialog').removeClass('active');
  }

  /**
   * Open Protector dialog to select ally to give SP
   */
  async _onProtectorOpen(event) {
    event.preventDefault();
    this._dismissAllTooltips();

    const html = $(this.element);
    const dialog = html.find('.sheet2-protectorDialog');
    const allyList = html.find('.sheet2-protectorAllyList');

    // Get all player character actors in the current scene
    const currentScene = game.scenes.active;
    const allies = [];

    if (currentScene) {
      const tokenDocs = currentScene.tokens.contents || [];
      for (const tokenDoc of tokenDocs) {
        const tokenActor = tokenDoc.actor;
        // Only include player characters (not this actor)
        if (tokenActor &&
            (tokenActor.type === 'character2' || tokenActor.type === 'character') &&
            tokenActor.id !== this.actor.id &&
            tokenActor.hasPlayerOwner) {
          allies.push({
            id: tokenActor.id,
            name: tokenActor.name,
            currentSP: tokenActor.system.stamina || 0
          });
        }
      }
    }

    // Populate ally list
    if (allies.length === 0) {
      allyList.html('<div class="sheet2-protectorAllyPlaceholder">No allies in scene</div>');
    } else {
      let listHtml = '';
      for (const ally of allies) {
        listHtml += `
          <div class="sheet2-protectorAllyItem protector-give-sp" data-actor-id="${ally.id}">
            <span class="sheet2-protectorAllyName">${ally.name}</span>
            <span class="sheet2-protectorAllySP">${ally.currentSP} SP</span>
            <button type="button" class="sheet2-protectorGiveBtn">GIVE 1 SP</button>
          </div>
        `;
      }
      allyList.html(listHtml);

      // Add click handlers to give buttons
      allyList.find('.protector-give-sp').click((e) => this._onProtectorGiveSP(e));
    }

    // Show dialog and initialize dragging
    dialog.addClass('active');
    this._initProtectorDialogDrag(dialog);
  }

  /**
   * Initialize drag functionality for Protector dialog
   */
  _initProtectorDialogDrag(dialog) {
    const handle = dialog.find('.protector-dialog-drag-handle');
    let isDragging = false;
    let startX, startY, startLeft, startTop;

    handle.off('mousedown.protectorDrag').on('mousedown.protectorDrag', (e) => {
      if ($(e.target).closest('.sheet2-closeProtectorMenu').length) return;

      isDragging = true;
      startX = e.clientX;
      startY = e.clientY;

      const rect = dialog[0].getBoundingClientRect();
      dialog.css({
        transform: 'none',
        left: rect.left + 'px',
        top: rect.top + 'px'
      });
      startLeft = rect.left;
      startTop = rect.top;

      $(document).on('mousemove.protectorDrag', (moveEvent) => {
        if (!isDragging) return;
        const dx = moveEvent.clientX - startX;
        const dy = moveEvent.clientY - startY;
        dialog.css({
          left: (startLeft + dx) + 'px',
          top: (startTop + dy) + 'px'
        });
      });

      $(document).on('mouseup.protectorDrag', () => {
        isDragging = false;
        $(document).off('mousemove.protectorDrag mouseup.protectorDrag');
      });
    });
  }

  /**
   * Close Protector dialog
   */
  _onProtectorClose(event) {
    event.preventDefault();
    const html = $(this.element);
    html.find('.sheet2-protectorDialog').removeClass('active');
  }

  /**
   * Handle giving SP to an ally via Protector skill
   */
  async _onProtectorGiveSP(event) {
    event.preventDefault();
    const allyId = $(event.currentTarget).attr('data-actor-id');
    const ally = game.actors.get(allyId);

    if (!ally) {
      ui.notifications.error('Could not find ally!');
      return;
    }

    const spCost = 1;
    const currentSP = this.actor.system.stamina || 0;

    if (currentSP < spCost) {
      ui.notifications.warn(`Not enough Stamina! Need ${spCost} SP, have ${currentSP}.`);
      return;
    }

    // Deduct SP from self
    await this.actor.update({
      'system.stamina': currentSP - spCost
    });

    // Add SP to ally
    const allyCurrentSP = ally.system.stamina || 0;
    await ally.update({
      'system.stamina': allyCurrentSP + 1
    });

    // Post chat message
    let content = `<div class="conan-roll">`;
    content += `<h3 style="color: #4a9eff;">🛡️ PROTECTOR!</h3>`;
    content += `<div class="skill-effect"><em>${this.actor.name} shares their vigor!</em></div>`;
    content += `<div class="skill-effect" style="color: #90EE90;">${ally.name} gains +1 SP!</div>`;
    content += `<div class="skill-cost-deducted"><span class="sp-cost">-${spCost} SP</span></div>`;
    content += `</div>`;

    ChatMessage.create({
      speaker: ChatMessage.getSpeaker({ actor: this.actor }),
      content: content,
      rollMode: game.settings.get('core', 'rollMode')
    });

    // Close dialog
    const html = $(this.element);
    html.find('.sheet2-protectorDialog').removeClass('active');
  }

  /**
   * Handle Legendary skill click - select which stat to boost
   */
  async _onLegendaryClick(event) {
    event.preventDefault();
    this._dismissAllTooltips();

    const currentStat = this.actor.system.legendary?.stat || null;

    // Create dialog to select stat
    const dialogContent = `
      <div style="padding: 10px;">
        <p style="margin-bottom: 15px; color: #c4a574;">Choose which stat to enhance with Legendary (+1):</p>
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px;">
          <button type="button" class="legendary-stat-btn" data-stat="might" style="padding: 12px; font-weight: bold; background: ${currentStat === 'might' ? '#ffd700' : '#333'}; color: ${currentStat === 'might' ? '#000' : '#fff'}; border: 2px solid ${currentStat === 'might' ? '#ffd700' : '#666'}; border-radius: 4px; cursor: pointer;">
            MIGHT ${currentStat === 'might' ? '✓' : ''}
          </button>
          <button type="button" class="legendary-stat-btn" data-stat="edge" style="padding: 12px; font-weight: bold; background: ${currentStat === 'edge' ? '#ffd700' : '#333'}; color: ${currentStat === 'edge' ? '#000' : '#fff'}; border: 2px solid ${currentStat === 'edge' ? '#ffd700' : '#666'}; border-radius: 4px; cursor: pointer;">
            EDGE ${currentStat === 'edge' ? '✓' : ''}
          </button>
          <button type="button" class="legendary-stat-btn" data-stat="wits" style="padding: 12px; font-weight: bold; background: ${currentStat === 'wits' ? '#ffd700' : '#333'}; color: ${currentStat === 'wits' ? '#000' : '#fff'}; border: 2px solid ${currentStat === 'wits' ? '#ffd700' : '#666'}; border-radius: 4px; cursor: pointer;">
            WITS ${currentStat === 'wits' ? '✓' : ''}
          </button>
          <button type="button" class="legendary-stat-btn" data-stat="grit" style="padding: 12px; font-weight: bold; background: ${currentStat === 'grit' ? '#ffd700' : '#333'}; color: ${currentStat === 'grit' ? '#000' : '#fff'}; border: 2px solid ${currentStat === 'grit' ? '#ffd700' : '#666'}; border-radius: 4px; cursor: pointer;">
            GRIT ${currentStat === 'grit' ? '✓' : ''}
          </button>
        </div>
        ${currentStat ? `<p style="margin-top: 15px; color: #90EE90; text-align: center;">Currently boosting: <strong>${currentStat.toUpperCase()}</strong></p>` : ''}
      </div>
    `;

    const dialog = new Dialog({
      title: 'Legendary - Choose Stat',
      content: dialogContent,
      buttons: {
        cancel: {
          icon: '<i class="fas fa-times"></i>',
          label: 'Cancel'
        }
      },
      render: (html) => {
        html.find('.legendary-stat-btn').click(async (e) => {
          const selectedStat = $(e.currentTarget).attr('data-stat');
          await this.actor.update({
            'system.legendary.stat': selectedStat
          });

          // Post chat message announcing the choice
          let content = `<div class="conan-roll">`;
          content += `<h3 style="color: #ffd700;">⭐ LEGENDARY!</h3>`;
          content += `<div class="skill-effect"><em>${this.actor.name} channels legendary power!</em></div>`;
          content += `<div class="skill-effect" style="color: #ffd700;">+1 ${selectedStat.toUpperCase()}</div>`;
          content += `</div>`;

          ChatMessage.create({
            speaker: ChatMessage.getSpeaker({ actor: this.actor }),
            content: content,
            rollMode: game.settings.get('core', 'rollMode')
          });

          dialog.close();
        });
      },
      default: 'cancel'
    }, {
      width: 300
    });

    dialog.render(true);
  }

  /**
   * Handle toggling Radium Gem on/off (click on icon)
   */
  async _onRadiumGemToggle(event) {
    event.preventDefault();

    // Check gem quantity
    const inventory = this.actor.system.inventory || {};
    const gemItem = Object.values(inventory).find(item => item && item.isAlchemyGem);
    const gemQty = gemItem ? (gemItem.quantity || 0) : 0;

    if (gemQty < 1) {
      ui.notifications.warn("You need a Radium Gem in your inventory to activate this!");
      return;
    }

    const isActive = this.actor.system.radiumGemActive || false;
    await this.actor.update({ 'system.radiumGemActive': !isActive });

    if (!isActive) {
      ui.notifications.info(`${this.actor.name}'s Radium Gem glows with inner light.`);
    } else {
      ui.notifications.info(`${this.actor.name}'s Radium Gem dims.`);
    }
  }

  /**
   * Handle toggling Eyes of the Raven on/off (click on icon)
   */
  async _onEyesOfTheRavenToggle(event) {
    event.preventDefault();

    const isActive = this.actor.system.eyesOfTheRavenActive || false;
    if (!isActive) {
      // Activating — costs 1 SP
      const currentSP = this.actor.system.stamina || 0;
      if (currentSP < 1) {
        ui.notifications.warn("Not enough Stamina Points to activate Eyes of the Raven!");
        return;
      }
      await this.actor.update({
        'system.eyesOfTheRavenActive': true,
        'system.stamina': currentSP - 1
      });
      ui.notifications.info(`${this.actor.name} activates Eyes of the Raven — perception sharpened. (1 SP spent)`);
    } else {
      // Deactivating — free
      await this.actor.update({ 'system.eyesOfTheRavenActive': false });
      ui.notifications.info(`${this.actor.name} deactivates Eyes of the Raven.`);
    }
  }

  /**
   * Handle Astral Projection toggle (activate or deactivate)
   * @param {'activate'|'deactivate'} action
   */
  async _onAstralProjectionToggle(action) {
    const tokenImg = this.actor.prototypeToken?.texture?.src || this.actor.img || 'icons/svg/mystery-man.svg';
    const spellIcon = 'systems/conan/images/icons/astral_projection_icon.png';
    const portraitHtml = `<div class="spell-chat-portrait-wrap"><img src="${tokenImg}" class="spell-chat-portrait"/><img src="${spellIcon}" class="spell-chat-badge" alt="Astral Projection"/></div>`;

    if (action === 'activate') {
      await this.actor.update({ 'system.astralProjectionState': 'active' });
      const token = this.actor.getActiveTokens()?.[0];
      if (token?.document) await token.document.update({ alpha: 0.4 });
      ChatMessage.create({
        speaker: ChatMessage.getSpeaker({ actor: this.actor }),
        content: `
          <div class="spell-chat-card" style="border-color: #6a0dad;">
            <div class="spell-chat-header">
              ${portraitHtml}
              <div class="spell-chat-title">
                <strong>${this.actor.name}</strong> casts <strong>Astral Projection</strong>
              </div>
            </div>
            <div class="spell-chat-body">
              <div class="spell-chat-effect" style="color: #9370DB;">The soul tears free of its mortal shell, drifting like smoke through walls of stone and shadow...</div>
              <div class="spell-chat-meta"><strong>Cost:</strong> Free &nbsp;|&nbsp; <strong>Limit:</strong> Once per Tale</div>
            </div>
          </div>`
      });
    } else {
      await this.actor.update({ 'system.astralProjectionState': 'spent' });
      const token = this.actor.getActiveTokens()?.[0];
      if (token?.document) await token.document.update({ alpha: 1.0 });
      ChatMessage.create({
        speaker: ChatMessage.getSpeaker({ actor: this.actor }),
        content: `
          <div class="spell-chat-card" style="border-color: #444;">
            <div class="spell-chat-header">
              ${portraitHtml}
              <div class="spell-chat-title">
                <strong>${this.actor.name}</strong> ends <strong>Astral Projection</strong>
              </div>
            </div>
            <div class="spell-chat-body">
              <div class="spell-chat-effect" style="color: #666;">The spirit snaps back into flesh. The journey beyond is over... for now.</div>
            </div>
          </div>`
      });
    }
  }

  /**
   * Handle Frightful Aura casting — enter targeting mode, Shift to activate
   */
  async _onFrightfulAuraCast(spell, spellIcon) {
    const casterActor = this.actor;
    const selected = [];

    canvas.tokens?.releaseAll();
    ui.notifications.info('Frightful Aura: Click enemy tokens to target, then press Shift to activate.');

    const controlHook = Hooks.on('controlToken', (controlledToken, isControlled) => {
      if (!isControlled) return;
      const tDoc = controlledToken.document ?? controlledToken;
      const tId = tDoc.id ?? tDoc._id;
      if (selected.includes(tId)) return;
      selected.push(tId);
      ui.notifications.info(`${controlledToken.name || tDoc.name} targeted by Frightful Aura (${selected.length} targets).`);
    });

    const shiftUpHandler = async (e) => {
      if (e.key !== 'Shift') return;
      document.removeEventListener('keyup', shiftUpHandler);
      document.removeEventListener('keydown', escHandler);
      Hooks.off('controlToken', controlHook);

      if (selected.length === 0) {
        ui.notifications.warn('No targets selected. Frightful Aura cancelled.');
        return;
      }

      // Deduct 1 SP
      const currentSP = casterActor.system.stamina || 0;
      await casterActor.update({
        'system.stamina': Math.max(0, currentSP - 1),
        'system.frightfulAuraState': 'active',
        'system.frightfulAuraTargets': selected
      });

      // Apply debuff to each target
      const targetNames = [];
      for (const tokenId of selected) {
        const targetTokenDoc = game.scenes.active?.tokens.get(tokenId);
        if (targetTokenDoc?.actor) {
          await targetTokenDoc.actor.setFlag('conan', 'frightfulAuraDebuff', { active: true, source: casterActor.id });
          targetNames.push(targetTokenDoc.name);
        }
      }

      // Chat message
      const tokenImg = casterActor.prototypeToken?.texture?.src || casterActor.img || 'icons/svg/mystery-man.svg';
      const iconPath = 'systems/conan/images/icons/frightful_aura_icon.png';
      const portraitHtml = `<div class="spell-chat-portrait-wrap"><img src="${tokenImg}" class="spell-chat-portrait"/><img src="${iconPath}" class="spell-chat-badge" alt="Frightful Aura"/></div>`;
      ChatMessage.create({
        speaker: ChatMessage.getSpeaker({ actor: casterActor }),
        content: `
          <div class="spell-chat-card" style="border-color: #6a0dad;">
            <div class="spell-chat-header">
              ${portraitHtml}
              <div class="spell-chat-title">
                <strong>${casterActor.name}</strong> casts <strong>Frightful Aura</strong>
              </div>
            </div>
            <div class="spell-chat-body">
              <div class="spell-chat-effect" style="color: #9370DB;">A wave of dread radiates outward — <strong>${targetNames.join(', ')}</strong> ${targetNames.length === 1 ? 'recoils' : 'recoil'} in fear!</div>
              <div class="spell-chat-meta"><strong>Cost:</strong> 1 SP &nbsp;|&nbsp; <strong>Effect:</strong> -2 to Wits & Grit Checks &nbsp;|&nbsp; <strong>Duration:</strong> Until end of combat</div>
            </div>
          </div>`
      });
    };
    document.addEventListener('keyup', shiftUpHandler);

    const escHandler = (e) => {
      if (e.key === 'Escape') {
        Hooks.off('controlToken', controlHook);
        document.removeEventListener('keyup', shiftUpHandler);
        document.removeEventListener('keydown', escHandler);
        ui.notifications.info('Frightful Aura targeting cancelled.');
      }
    };
    document.addEventListener('keydown', escHandler);
  }

  /**
   * Handle dismissing Frightful Aura — remove debuff from all targets
   */
  async _onFrightfulAuraDismiss() {
    const targets = this.actor.system.frightfulAuraTargets || [];
    for (const tokenId of targets) {
      const targetTokenDoc = game.scenes.active?.tokens.get(tokenId);
      if (targetTokenDoc?.actor) {
        await targetTokenDoc.actor.unsetFlag('conan', 'frightfulAuraDebuff');
      }
    }
    await this.actor.update({
      'system.frightfulAuraState': 'spent',
      'system.frightfulAuraTargets': []
    });
    const tokenImg = this.actor.prototypeToken?.texture?.src || this.actor.img || 'icons/svg/mystery-man.svg';
    const iconPath = 'systems/conan/images/icons/frightful_aura_icon.png';
    const portraitHtml = `<div class="spell-chat-portrait-wrap"><img src="${tokenImg}" class="spell-chat-portrait"/><img src="${iconPath}" class="spell-chat-badge" alt="Frightful Aura"/></div>`;
    ChatMessage.create({
      speaker: ChatMessage.getSpeaker({ actor: this.actor }),
      content: `
        <div class="spell-chat-card" style="border-color: #444;">
          <div class="spell-chat-header">
            ${portraitHtml}
            <div class="spell-chat-title">
              <strong>${this.actor.name}</strong> ends <strong>Frightful Aura</strong>
            </div>
          </div>
          <div class="spell-chat-body">
            <div class="spell-chat-effect" style="color: #666;">The oppressive dread lifts. Courage returns to those who faltered.</div>
          </div>
        </div>`
    });
  }

  /**
   * Beast Form: transform player token into origin-specific beast.
   * Sets enemyData flag so double-click opens beast card.
   */
  async _handleBeastFormCast(spell, spellIcon) {
    console.log('Conan | Beast Form CAST intercept');

    // 1. Check origin against ORIGIN_BEASTS
    const originId = this.actor.system.origin?.id || '';
    const beastData = ORIGIN_BEASTS[originId];
    if (!beastData) {
      ui.notifications.warn('Beast Form is not available for this origin.');
      return;
    }

    // 2. Find player's token on the active scene
    const tokenDoc = this.actor.getActiveTokens(false, true)?.[0];
    if (!tokenDoc) {
      ui.notifications.warn('No token found on the active scene.');
      return;
    }

    // 3. Check SP cost (2 SP)
    const currentSP = this.actor.system.stamina || 0;
    if (currentSP < 2) {
      ui.notifications.warn('Not enough Stamina Points (2 SP required).');
      return;
    }

    // 4. Deduct SP cost
    await this._deductSpellCost(0, 2, 'Beast Form');

    // 5. Read player stats
    const might = this.actor.system.attributes?.might?.value || 0;
    const edge = this.actor.system.attributes?.edge?.value || 0;
    const grit = this.actor.system.attributes?.grit?.value || 0;
    const wits = this.actor.system.attributes?.wits?.value || 0;
    const mightDie = (this.actor.system.attributes?.might?.die || 'd6').toUpperCase();
    const edgeDie = (this.actor.system.attributes?.edge?.die || 'd6').toUpperCase();
    const gritDie = (this.actor.system.attributes?.grit?.die || 'd6').toUpperCase();
    const witsDie = (this.actor.system.attributes?.wits?.die || 'd6').toUpperCase();
    const physDef = this.actor.system.defense?.physical || 10;
    const sorcDef = this.actor.system.defense?.sorcery || 10;
    const currentAR = this.actor.system.defense?.ar || 0;

    // 6. Compute boosted values (+2 Might, +2 Edge, +2 Grit, +2 Phys Def, +1 AR)
    const boostedMight = might + 2;
    const boostedEdge = edge + 2;
    const boostedGrit = grit + 2;
    const boostedPhysDef = physDef + 2;
    const boostedAR = currentAR + 1;

    // 7. Compute LP — max override = normal max + 4 (from +2 Grit × 2)
    const currentMaxLP = this._getCalculatedMaxLP();
    const beastMaxLP = currentMaxLP + 4;
    const currentLP = this.actor.system.lifePoints?.value || 0;

    // 8. Read custom images from GM Tools setting (set via the enemy card portrait editor)
    const customImages = game.settings.get('conan', 'enemyCustomImages') || {};
    const imageKey = `originBeast.${beastData.groupKey}.${beastData.id}`;
    const customImg = customImages[imageKey] || {};
    const portraitImg = customImg.portraitImg || 'icons/svg/mystery-man.svg';
    const beastTokenImg = customImg.tokenImg || 'icons/svg/mystery-man.svg';

    // 9. Build beast enemyData for the card dialog
    const beastEnemyData = {
      id: beastData.id,
      name: beastData.name,
      type: 'Antagonist',
      category: 'originBeast',
      isBeastForm: true,
      ownerActorId: this.actor.id,
      description: beastData.description,
      lifePoints: beastMaxLP,
      physicalDefense: String(boostedPhysDef),
      sorceryDefense: String(sorcDef),
      ar: { min: boostedAR, max: boostedAR },
      armorRating: boostedAR,
      stats: {
        might: { value: boostedMight, die: mightDie },
        edge: { value: boostedEdge, die: edgeDie },
        grit: { value: boostedGrit, die: gritDie },
        wits: { value: wits, die: witsDie }
      },
      attacks: {
        melee: [{ name: beastData.attackName, range: 'Reach', damage: '1D10' }],
        ranged: []
      },
      rules: [],
      traits: 'Cannot cast spells or speak while transformed.',
      portraitImg: portraitImg,
      tokenImg: beastTokenImg
    };

    // 9. Store state on actor + set maxOverride + boost current LP by 4
    const originalTokenImg = tokenDoc.texture?.src || this.actor.img;
    await this.actor.update({
      'system.beastFormData': {
        active: true,
        originalTokenImg: originalTokenImg,
        originalMaxLP: currentMaxLP,
        enemyData: beastEnemyData
      },
      'system.lifePoints.maxOverride': beastMaxLP,
      'system.lifePoints.value': currentLP + 4,
      'system.buffsDebuffs.beastForm': true
    });

    // 10. Swap token image + set enemyData flag (single update)
    await tokenDoc.update({
      'texture.src': beastTokenImg,
      'flags.conan.enemyData': beastEnemyData
    });

    // 11. Post chat message
    ChatMessage.create({
      speaker: ChatMessage.getSpeaker({ actor: this.actor }),
      content: `<div class="conan-enemy-roll ability-use"><div class="roll-header" style="color: #D4A017;">Beast Form</div><div class="roll-section ability-desc"><strong>${this.actor.name}</strong> transforms into <strong style="color: #D4A017;">${beastData.name}</strong>!<br><em>${beastData.description}</em></div></div>`
    });

    ui.notifications.info(`${this.actor.name} transforms into ${beastData.name}!`);
  }

  async _onFearsomeWardCast(spell, spellIcon) {
    const currentLP = this.actor.system.lifePoints?.value ?? 0;
    const tiers = [
      { lp: 2, dc: 5, label: 'Tier I — 2 LP (DC 5)' },
      { lp: 5, dc: 8, label: 'Tier II — 5 LP (DC 8)' },
      { lp: 8, dc: 11, label: 'Tier III — 8 LP (DC 11)' }
    ];
    const tierButtons = tiers.map((t, i) => {
      const disabled = currentLP < t.lp ? 'disabled style="opacity:0.4;pointer-events:none;"' : '';
      return `<button class="fw-tier-btn" data-tier="${i}" ${disabled}>${t.label}</button>`;
    }).join('');

    const tierDialog = new Dialog({
      title: 'Fearsome Ward',
      content: `<div style="text-align:center;padding:8px;">
        <p style="margin-bottom:10px;"><strong>Choose the power of your ward:</strong></p>
        <div style="display:flex;flex-direction:column;gap:6px;">${tierButtons}</div>
      </div>`,
      buttons: { cancel: { label: 'Cancel' } },
      render: (html) => {
        html.find('.fw-tier-btn').click(async (ev) => {
          const tierIdx = parseInt(ev.currentTarget.dataset.tier);
          const tier = tiers[tierIdx];
          tierDialog.close();
          await this._onFearsomeWardTarget(tier, spell, spellIcon);
        });
      }
    });
    tierDialog.render(true);
  }

  /**
   * Fearsome Ward: after tier selected, enter targeting mode
   */
  async _onFearsomeWardTarget(tier, spell, spellIcon) {
    ui.notifications.info(`Fearsome Ward (DC ${tier.dc}) — Click the attacking enemy, then press Shift.`);

    // Deduct LP cost
    await this._deductSpellCost(tier.lp, 0, 'Fearsome Ward');

    // Clear any pending damage "ammo" and set targeting flag so Shift doesn't also apply damage
    if (game.conan) {
      game.conan.lastDamageRoll = null;
      game.conan.lastDamageEffect = null;
      game.conan.spellTargetingActive = true;
    }

    // Enter targeting mode: click enemy token, Shift to confirm
    canvas.tokens.releaseAll();
    let selectedToken = null;

    const controlHook = Hooks.on('controlToken', (token, controlled) => {
      if (!controlled) return;
      selectedToken = token;
    });

    const shiftHandler = async (ev) => {
      if (ev.key !== 'Shift' || !selectedToken) return;
      document.removeEventListener('keyup', shiftHandler);
      document.removeEventListener('keyup', escHandler);
      Hooks.off('controlToken', controlHook);

      const targetTokenDoc = selectedToken.document;
      const enemyData = targetTokenDoc.getFlag('conan', 'enemyData');
      if (!enemyData) {
        ui.notifications.warn('Target is not an enemy.');
        await this.actor.update({ 'system.fearsomeWardState': 'spent' });
        return;
      }

      // Roll enemy Wits check: Wits die + Wits value vs DC
      const witsValue = enemyData.stats?.wits?.value ?? 0;
      const witsDie = enemyData.stats?.wits?.die || 'd6';
      const dieFormula = `1${witsDie.toLowerCase()}`;
      const witsRoll = await new Roll(dieFormula).evaluate();
      const total = witsRoll.total + witsValue;
      const passed = total >= tier.dc;

      // Build chat card
      const tokenImg = this.actor.prototypeToken?.texture?.src || this.actor.img || 'icons/svg/mystery-man.svg';
      const iconPath = 'systems/conan/images/icons/fearsome_ward_icon.png';
      const portraitHtml = spellIcon
        ? `<div class="spell-chat-portrait-wrap"><img src="${tokenImg}" class="spell-chat-portrait"/><img src="${iconPath}" class="spell-chat-badge" alt="Fearsome Ward"/></div>`
        : `<img src="${tokenImg}" class="spell-chat-portrait"/>`;

      if (passed) {
        // Enemy passed — ward fizzles, spell spent
        await this.actor.update({ 'system.fearsomeWardState': 'spent' });
        ChatMessage.create({
          speaker: ChatMessage.getSpeaker({ actor: this.actor }),
          content: `
            <div class="spell-chat-card" style="border-color: #666;">
              <div class="spell-chat-header">
                ${portraitHtml}
                <div class="spell-chat-title"><strong>Fearsome Ward</strong> — Resisted!</div>
              </div>
              <div class="spell-chat-body">
                <div class="spell-chat-effect"><strong>${enemyData.name}</strong> shrugs off the ward.</div>
                <div class="spell-chat-effect" style="color:#888;">Wits Check: ${witsDie} (${witsRoll.total}) + ${witsValue} = <strong>${total}</strong> vs DC ${tier.dc} — <span style="color:#4a4;">PASSED</span></div>
              </div>
            </div>`,
          rolls: [witsRoll]
        });
      } else {
        // Enemy failed — apply ward debuff, spell active (store IDs for cross-cleanup)
        await targetTokenDoc.actor.setFlag('conan', 'fearsomeWardDebuff', { active: true, casterId: this.actor.id });
        await this.actor.update({ 'system.fearsomeWardState': 'active', 'system.fearsomeWardTarget': targetTokenDoc.id });
        ChatMessage.create({
          speaker: ChatMessage.getSpeaker({ actor: this.actor }),
          content: `
            <div class="spell-chat-card" style="border-color: #b8860b;">
              <div class="spell-chat-header">
                ${portraitHtml}
                <div class="spell-chat-title"><strong>Fearsome Ward</strong> — The ward takes hold!</div>
              </div>
              <div class="spell-chat-body">
                <div class="spell-chat-effect" style="color:#b8860b;"><strong>${enemyData.name}</strong> recoils in dread. The sorcerer's dark power seizes their mind — their strikes against the caster falter.</div>
                <div class="spell-chat-effect" style="color:#888;">Wits Check: ${witsDie} (${witsRoll.total}) + ${witsValue} = <strong>${total}</strong> vs DC ${tier.dc} — <span style="color:#c44;">FAILED</span></div>
                <div class="spell-chat-effect"><strong>−2 to melee attacks</strong> against ${this.actor.name} until end of combat.</div>
              </div>
            </div>`,
          rolls: [witsRoll]
        });
      }
      canvas.tokens.releaseAll();
      if (game.conan) game.conan.spellTargetingActive = false;
    };

    document.addEventListener('keyup', shiftHandler);

    // Escape to cancel
    const escHandler = (ev) => {
      if (ev.key !== 'Escape') return;
      document.removeEventListener('keyup', shiftHandler);
      document.removeEventListener('keyup', escHandler);
      Hooks.off('controlToken', controlHook);
      canvas.tokens.releaseAll();
      if (game.conan) game.conan.spellTargetingActive = false;
      ui.notifications.info('Fearsome Ward targeting cancelled.');
    };
    document.addEventListener('keyup', escHandler);
  }

  /**
   * Fearsome Ward: dismiss active ward
   */
  async _onFearsomeWardDismiss() {
    // Clear enemy debuff using stored target ID
    const targetTokenId = this.actor.system.fearsomeWardTarget;
    if (targetTokenId) {
      const targetTokenDoc = game.scenes.active?.tokens.get(targetTokenId);
      if (targetTokenDoc?.actor?.getFlag('conan', 'fearsomeWardDebuff')) {
        await targetTokenDoc.actor.unsetFlag('conan', 'fearsomeWardDebuff');
      }
    }
    await this.actor.update({ 'system.fearsomeWardState': 'spent', 'system.fearsomeWardTarget': null });
    const tokenImg = this.actor.prototypeToken?.texture?.src || this.actor.img || 'icons/svg/mystery-man.svg';
    const iconPath = 'systems/conan/images/icons/fearsome_ward_icon.png';
    const portraitHtml = `<div class="spell-chat-portrait-wrap"><img src="${tokenImg}" class="spell-chat-portrait"/><img src="${iconPath}" class="spell-chat-badge" alt="Fearsome Ward"/></div>`;
    ChatMessage.create({
      speaker: ChatMessage.getSpeaker({ actor: this.actor }),
      content: `
        <div class="spell-chat-card" style="border-color: #444;">
          <div class="spell-chat-header">
            ${portraitHtml}
            <div class="spell-chat-title"><strong>${this.actor.name}</strong> ends <strong>Fearsome Ward</strong></div>
          </div>
          <div class="spell-chat-body">
            <div class="spell-chat-effect" style="color: #666;">The dark ward fades. The enemy's courage returns.</div>
          </div>
        </div>`
    });
  }

  /**
   * Handle dismissing Bane Weapon (click on active icon)
   */
  async _onBaneWeaponDismiss(event) {
    event.preventDefault();

    const casterData = this.actor.system.baneWeaponCaster;
    if (!casterData) {
      ui.notifications.info('No active Bane Weapon to dismiss.');
      return;
    }

    const targetId = casterData.targetId;
    const targetActor = game.actors.get(targetId);

    // Create invisible chat message to sync buff removal across clients
    await ChatMessage.create({
      content: '<div style="display:none;"></div>',
      speaker: ChatMessage.getSpeaker({ alias: 'System' }),
      whisper: [],
      flags: {
        conan: {
          baneWeaponRemove: true,
          casterId: this.actor.id,
          targetId: targetId
        }
      }
    });

    // Post visible chat message
    let content = `<div class="conan-roll">`;
    content += `<h3 style="color: #888;">Bane Weapon</h3>`;
    content += `<div class="skill-effect" style="color: #888;"><em>${this.actor.name} releases the enchantment.</em></div>`;
    content += `<div class="skill-effect" style="color: #ff6b6b;">${targetActor?.name || 'Target'}'s weapon returns to normal.</div>`;
    content += `</div>`;

    ChatMessage.create({
      speaker: ChatMessage.getSpeaker({ actor: this.actor }),
      content: content,
      rollMode: game.settings.get('core', 'rollMode')
    });
  }

  /**
   * Handle dismissing Lotus Miasma maintenance (click on active icon)
   */
  async _onLotusMiasmaDismiss(event) {
    event.preventDefault();

    if (!this.actor.system.lotusMiasmaActive) {
      ui.notifications.info('No active Lotus Miasma to dismiss.');
      return;
    }

    await this.actor.update({ 'system.lotusMiasmaActive': false });

    ChatMessage.create({
      speaker: ChatMessage.getSpeaker({ actor: this.actor }),
      content: `<div class="conan-roll"><h3 style="color: #888;">Lotus Miasma Ends</h3><div class="skill-effect" style="color: #888;"><em>${this.actor.name} lets the toxic cloud dissipate.</em></div></div>`,
      rollMode: game.settings.get('core', 'rollMode')
    });
  }

  /**
   * Handle Inspire spell casting
   * Shows ally selection dialog, deducts 1 SP, gives target +1 SP and +2 to all Checks
   */
  async _handleInspireCast(spell, spellIcon) {
    // Get list of ally characters on the scene (exclude self)
    const targets = [];
    const seenActorIds = new Set();

    for (const t of canvas.tokens.placeables) {
      if (!t.actor || t.actor.id === this.actor.id) continue;
      if (seenActorIds.has(t.actor.id)) continue;
      if (t.actor.type === 'character2' && t.actor.hasPlayerOwner) {
        targets.push(t.actor);
        seenActorIds.add(t.actor.id);
      }
    }

    if (targets.length === 0) {
      ui.notifications.warn('No valid ally targets in the current scene.');
      return;
    }

    // Build target selection dialog (Bane Weapon pattern)
    let dialogContent = `<div style="font-family: 'Montserrat', system-ui, sans-serif; padding: 12px; background: linear-gradient(180deg, #1B1B20 0%, #0B0B0D 100%); color: #FFFFFF;">`;
    dialogContent += `<div style="font-size: 9px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.12em; color: rgba(255,255,255,0.5); margin-bottom: 8px;">Select Ally to Inspire</div>`;
    dialogContent += `<div style="display: flex; flex-direction: column; gap: 4px;">`;

    targets.forEach((target, idx) => {
      const tokenImg = target.prototypeToken?.texture?.src || target.img || 'icons/svg/mystery-man.svg';
      const alreadyInspired = target.system.inspireSpellActive;
      const disabledAttr = alreadyInspired ? ' disabled' : '';
      const labelNote = alreadyInspired ? ' <span style="color: #90EE90;">(Already Inspired)</span>' : '';
      dialogContent += `<label style="display: flex; align-items: center; gap: 8px; padding: 6px 8px; background: rgba(255,255,255,0.05); border: 1px solid #2a2a2e; border-radius: 4px; cursor: ${alreadyInspired ? 'not-allowed' : 'pointer'}; ${alreadyInspired ? 'opacity: 0.5;' : ''}">`;
      dialogContent += `<input type="radio" name="targetId" value="${target.id}" ${idx === 0 && !alreadyInspired ? 'checked' : ''} style="accent-color: #90EE90; margin: 0;"${disabledAttr}>`;
      dialogContent += `<img src="${tokenImg}" style="width: 24px; height: 24px; border-radius: 50%; object-fit: cover;">`;
      dialogContent += `<span style="font-weight: 600;">${target.name}${labelNote}</span>`;
      dialogContent += `</label>`;
    });

    dialogContent += `</div>`;
    dialogContent += `<div style="margin-top: 12px; padding: 8px; background: rgba(144,238,144,0.15); border: 1px solid #90EE90; border-radius: 4px; text-align: center;">`;
    dialogContent += `<span style="color: #90EE90; font-weight: 700;">+1 SP</span> <span style="color: rgba(255,255,255,0.7);">and</span> <span style="color: #90EE90; font-weight: 700;">+2 to all Checks</span>`;
    dialogContent += `</div>`;
    dialogContent += `</div>`;

    const self = this;

    return new Promise((resolve) => {
      const dialog = new Dialog({
        title: 'Inspire — Choose Ally',
        content: dialogContent,
        buttons: {
          cast: {
            label: 'Inspire',
            callback: async (html) => {
              const targetId = html.find('input[name="targetId"]:checked').val();
              if (!targetId) {
                ui.notifications.warn('No target selected.');
                resolve();
                return;
              }
              const targetActor = game.actors.get(targetId);
              if (!targetActor) {
                ui.notifications.warn('Target not found.');
                resolve();
                return;
              }

              // Deduct 1 SP from caster
              await self._deductSpellCost(0, 1, 'Inspire');

              // Poison: noStamina — spell fizzles (SP already spent)
              const poisonEffects = self.actor.getFlag('conan', 'poisonEffects');
              if (poisonEffects?.active && poisonEffects.effects?.noStamina) {
                const ownerColor = self._getOwnerColor();
                const tokenImg = self.actor.prototypeToken?.texture?.src || self.actor.img || 'icons/svg/mystery-man.svg';
                ChatMessage.create({
                  speaker: ChatMessage.getSpeaker({ actor: self.actor }),
                  content: `<div class="conan-roll spell-chat-card" style="border-color: ${ownerColor};">
                    <div class="spell-chat-header">
                      <div class="spell-chat-portrait-wrap"><img src="${tokenImg}" class="spell-chat-portrait"/><img src="${spellIcon}" class="spell-chat-badge" alt="Inspire"/></div>
                      <div class="spell-chat-title"><strong>${self.actor.name}</strong> attempts <strong>Inspire</strong></div>
                    </div>
                    <div class="spell-chat-body">
                      <div class="spell-chat-effect" style="color: #32CD32;">${VENOM_SPELL_MESSAGES[Math.floor(Math.random() * VENOM_SPELL_MESSAGES.length)]}</div>
                      <div class="spell-chat-meta"><strong>Cost:</strong> 1 SP (wasted)</div>
                    </div>
                  </div>`
                });
                resolve();
                return;
              }

              // Apply buff to target: +1 SP and inspireSpellActive flag
              // Hidden chat message for GM to apply (player may not have permission on other's actor)
              await ChatMessage.create({
                content: '<div style="display:none;"></div>',
                speaker: ChatMessage.getSpeaker({ alias: 'System' }),
                whisper: [],
                flags: {
                  conan: {
                    inspireSpellApply: true,
                    targetId: targetId
                  }
                }
              });

              // Post portrait chat card
              const tokenImg = self.actor.prototypeToken?.texture?.src || self.actor.img || 'icons/svg/mystery-man.svg';
              const ownerColor = self._getOwnerColor();

              let content = `<div class="conan-roll spell-chat-card" style="border-color: ${ownerColor};">`;
              content += `<div class="spell-chat-header">`;
              content += `<div class="spell-chat-portrait-wrap"><img src="${tokenImg}" class="spell-chat-portrait"/><img src="${spellIcon}" class="spell-chat-badge" alt="Inspire"/></div>`;
              content += `<div class="spell-chat-title"><strong>${self.actor.name}</strong> inspires <strong>${targetActor.name}</strong></div>`;
              content += `</div>`;
              content += `<div class="spell-chat-body">`;
              content += `<div class="spell-chat-effect">${targetActor.name} gains <span style="color: #90EE90; font-weight: 700;">+1 Stamina Point</span> and <span style="color: #90EE90; font-weight: 700;">+2 to all Checks</span> until dismissed.</div>`;
              content += `<div class="spell-chat-meta"><strong>Cost:</strong> 1 SP</div>`;
              content += `</div></div>`;

              ChatMessage.create({
                speaker: ChatMessage.getSpeaker({ actor: self.actor }),
                content: content
              });

              resolve();
            }
          },
          cancel: {
            label: 'Cancel',
            callback: () => resolve()
          }
        },
        default: 'cast'
      }, { width: 320 });
      dialog.render(true);
    });
  }


  /**
   * Handle Healing spell casting.
   * Dialog with self + allies, rolls WitsDie, applies LP healing directly.
   */
  async _handleHealingCast(spell, spellIcon) {
    const currentSP = this.actor.system.stamina || 0;
    if (currentSP < 1) {
      ui.notifications.warn('Not enough Stamina Points to cast Healing (1 SP required).');
      return;
    }

    // Build target list: self first, then allies on scene
    const targets = [];
    const seenActorIds = new Set();
    targets.push(this.actor);
    seenActorIds.add(this.actor.id);

    for (const t of canvas.tokens.placeables) {
      if (!t.actor || seenActorIds.has(t.actor.id)) continue;
      if (t.actor.type === 'character2' && t.actor.hasPlayerOwner) {
        targets.push(t.actor);
        seenActorIds.add(t.actor.id);
      }
    }

    const self = this;
    const ownerColor = this._getOwnerColor();

    let dialogContent = `<div style="font-family: 'Montserrat', system-ui, sans-serif; padding: 12px; background: linear-gradient(180deg, #1B1B20 0%, #0B0B0D 100%); color: #FFFFFF;">`;
    dialogContent += `<div style="font-size: 9px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.12em; color: rgba(255,255,255,0.5); margin-bottom: 8px;">Select Target — Healing</div>`;
    dialogContent += `<div style="display: flex; flex-direction: column; gap: 4px;">`;

    let firstChecked = false;
    targets.forEach((target) => {
      const tImg = target.prototypeToken?.texture?.src || target.img || 'icons/svg/mystery-man.svg';
      const isSelf = target.id === self.actor.id;
      const selfLabel = isSelf ? ' <span style="color: rgba(255,255,255,0.4);">(Self)</span>' : '';
      const checked = !firstChecked ? 'checked' : '';
      if (!firstChecked) firstChecked = true;
      dialogContent += `<label style="display: flex; align-items: center; gap: 8px; padding: 6px 8px; background: rgba(255,255,255,0.05); border: 1px solid #2a2a2e; border-radius: 4px; cursor: pointer;">`;
      dialogContent += `<input type="radio" name="targetId" value="${target.id}" ${checked} style="accent-color: #90EE90; margin: 0;">`;
      dialogContent += `<img src="${tImg}" style="width: 24px; height: 24px; border-radius: 50%; object-fit: cover;">`;
      dialogContent += `<span style="font-weight: 600;">${target.name}${selfLabel}</span>`;
      dialogContent += `</label>`;
    });

    dialogContent += `</div>`;
    dialogContent += `<div style="margin-top: 12px; padding: 8px; background: rgba(144,238,144,0.15); border: 1px solid #90EE90; border-radius: 4px; text-align: center;">`;
    dialogContent += `<span style="color: #90EE90; font-weight: 700;">Restore Life Points</span> <span style="color: rgba(255,255,255,0.7);">equal to Wits Die roll</span>`;
    dialogContent += `</div>`;
    dialogContent += `<div style="margin-top: 8px; text-align: center; font-size: 13px; color: rgba(255,255,255,0.7); font-weight: 600;">Cost: <span style="color: #87CEEB;">1 Stamina Point</span></div>`;
    dialogContent += `</div>`;

    return new Promise((resolve) => {
      const dialog = new Dialog({
        title: 'Healing — Choose Target',
        content: dialogContent,
        buttons: {
          cast: {
            label: 'Heal',
            callback: async (html) => {
              const targetId = html.find('input[name="targetId"]:checked').val();
              if (!targetId) {
                ui.notifications.warn('No target selected.');
                resolve();
                return;
              }
              const targetActor = game.actors.get(targetId);
              if (!targetActor) {
                ui.notifications.warn('Target not found.');
                resolve();
                return;
              }

              // Deduct 1 SP
              await self._deductSpellCost(0, 1, 'Healing');

              // Roll WitsDie for healing amount
              const { die: witsDie } = self._getEffectiveStatValues('wits');
              const healRoll = new Roll(`1${witsDie}`, self.actor.getRollData());
              await healRoll.evaluate();
              const baseHeal = healRoll.total;

              // Calculate target's healing bonuses (Hardy, Blood of Jhebbal Sag)
              let targetHealAmount = baseHeal;
              const targetBonusSources = [];
              const targetOriginId = targetActor.system?.origin?.id;
              if (targetOriginId === 'from-the-blood-of-jhebbal-sag') {
                targetHealAmount += 2;
                targetBonusSources.push('Blood of Jhebbal Sag (+2)');
              }
              const targetSkills = targetActor.system?.skills || {};
              for (const skill of Object.values(targetSkills)) {
                if (skill.name?.toLowerCase() === 'hardy') {
                  targetHealAmount += 2;
                  targetBonusSources.push('Hardy (+2)');
                  break;
                }
              }

              // Apply healing to target
              const isSelf = targetId === self.actor.id;
              const tLP = targetActor.system?.lifePoints;
              const tHasValue = typeof tLP === 'object' && tLP !== null;
              const tCurrentLP = tHasValue ? (tLP.value || 0) : (tLP || 0);
              const tMaxLP = tHasValue ? (tLP.max || tCurrentLP) : tCurrentLP;
              const tNewLP = Math.min(tMaxLP, tCurrentLP + targetHealAmount);
              const tActualHeal = tNewLP - tCurrentLP;

              // Check poison before sending (read-only, no permission needed)
              let poisonCured = false;
              if (targetActor.type === 'character2') {
                const poisonEffects = targetActor.getFlag('conan', 'poisonEffects');
                if (poisonEffects?.active) poisonCured = true;
              }

              if (isSelf) {
                // Self: direct update (always have permission on own actor)
                if (tHasValue) {
                  await targetActor.update({ 'system.lifePoints.value': tNewLP });
                } else {
                  await targetActor.update({ 'system.lifePoints': tNewLP });
                }
                if (poisonCured) {
                  await targetActor.unsetFlag('conan', 'poisonEffects');
                  await targetActor.update({ 'system.conditions.poisoned': false });
                }
                const healToken = canvas.tokens.placeables.find(t => t.actor?.id === targetId);
                if (healToken && typeof window.showFloatingDamage === 'function') {
                  window.showFloatingDamage(healToken.id, -tActualHeal, false, false, true);
                  game.socket.emit("system.conan", {
                    action: "floatingDamage",
                    tokenId: healToken.id,
                    damage: -tActualHeal,
                    isDead: false,
                    isWounded: false,
                    isHealing: true
                  });
                }
              } else {
                // Other player: hidden chat message for GM to apply
                await ChatMessage.create({
                  content: '<div style="display:none;"></div>',
                  speaker: ChatMessage.getSpeaker({ alias: 'System' }),
                  whisper: [],
                  flags: {
                    conan: {
                      healingApply: true,
                      targetId: targetId,
                      healAmount: targetHealAmount,
                      checkPoison: poisonCured
                    }
                  }
                });
              }

              // Visible chat card
              const tokenImg = self.actor.prototypeToken?.texture?.src || self.actor.img || 'icons/svg/mystery-man.svg';
              const targetText = isSelf
                ? `heals themselves`
                : `heals <strong>${targetActor.name}</strong>`;
              const bonusNote = targetBonusSources.length > 0
                ? ` <span style="color: #32CD32; font-size: 0.9em;">(${baseHeal} roll + ${targetBonusSources.join(', ')})</span>`
                : '';

              let content = `<div class="conan-roll spell-chat-card" style="border-color: ${ownerColor};">`;
              content += `<div class="spell-chat-header">`;
              content += `<div class="spell-chat-portrait-wrap"><img src="${tokenImg}" class="spell-chat-portrait"/><img src="${spellIcon}" class="spell-chat-badge" alt="Healing"/></div>`;
              content += `<div class="spell-chat-title"><strong>${self.actor.name}</strong> ${targetText}</div>`;
              content += `</div>`;
              content += `<div class="spell-chat-body">`;
              content += `<div class="spell-chat-effect" style="color: #90EE90; font-size: 1.1em; font-weight: 700; text-align: center;">+${tActualHeal} Life Points${bonusNote}</div>`;
              if (poisonCured) {
                content += `<div class="spell-chat-effect" style="color: #32CD32; font-size: 0.95em; text-align: center; margin-top: 4px;"><em>Poison Cured — the healing magic burns the venom away.</em></div>`;
              }
              content += `<div class="spell-chat-meta"><strong>Cost:</strong> 1 SP &nbsp;|&nbsp; <strong>Roll:</strong> ${witsDie} → ${baseHeal}</div>`;
              content += `</div></div>`;

              ChatMessage.create({
                speaker: ChatMessage.getSpeaker({ actor: self.actor }),
                content: content
              });

              resolve();
            }
          },
          cancel: {
            label: 'Cancel',
            callback: () => resolve()
          }
        },
        default: 'cast'
      }, { width: 320 });
      dialog.render(true);
    });
  }

  /**
   * Handle Favor of the Four Winds spell casting.
   * Dialog with self + allies, deducts 4 LP. Self = direct update, other = hidden chat message.
   */
  async _handleFavorFourWindsCast(spell, spellIcon) {
    const currentLP = this.actor.system.lifePoints?.value ?? 0;
    if (currentLP < 4) {
      ui.notifications.warn('Not enough Life Points to cast Favor of the Four Winds (4 LP required).');
      return;
    }

    // Build target list: self first, then allies on scene
    const targets = [];
    const seenActorIds = new Set();
    targets.push(this.actor);
    seenActorIds.add(this.actor.id);

    for (const t of canvas.tokens.placeables) {
      if (!t.actor || seenActorIds.has(t.actor.id)) continue;
      if (t.actor.type === 'character2' && t.actor.hasPlayerOwner) {
        targets.push(t.actor);
        seenActorIds.add(t.actor.id);
      }
    }

    const self = this;
    const ownerColor = this._getOwnerColor();

    let dialogContent = `<div style="font-family: 'Montserrat', system-ui, sans-serif; padding: 12px; background: linear-gradient(180deg, #1B1B20 0%, #0B0B0D 100%); color: #FFFFFF;">`;
    dialogContent += `<div style="font-size: 9px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.12em; color: rgba(255,255,255,0.5); margin-bottom: 8px;">Select Target — Favor of the Four Winds</div>`;
    dialogContent += `<div style="display: flex; flex-direction: column; gap: 4px;">`;

    let firstChecked = false;
    targets.forEach((target) => {
      const tImg = target.prototypeToken?.texture?.src || target.img || 'icons/svg/mystery-man.svg';
      const isSelf = target.id === self.actor.id;
      const buffed = !!target.system.favorFourWindsBuff;
      const disabled = buffed ? ' disabled' : '';
      const selfLabel = isSelf ? ' <span style="color: rgba(255,255,255,0.4);">(Self)</span>' : '';
      const buffLabel = buffed ? ' <span style="color: #87CEEB;">(Already Buffed)</span>' : '';
      const checked = !buffed && !firstChecked ? 'checked' : '';
      if (checked) firstChecked = true;
      dialogContent += `<label style="display: flex; align-items: center; gap: 8px; padding: 6px 8px; background: rgba(255,255,255,0.05); border: 1px solid #2a2a2e; border-radius: 4px; cursor: ${buffed ? 'not-allowed' : 'pointer'}; ${buffed ? 'opacity: 0.5;' : ''}">`;
      dialogContent += `<input type="radio" name="targetId" value="${target.id}" ${checked} style="accent-color: #87CEEB; margin: 0;"${disabled}>`;
      dialogContent += `<img src="${tImg}" style="width: 24px; height: 24px; border-radius: 50%; object-fit: cover;">`;
      dialogContent += `<span style="font-weight: 600;">${target.name}${selfLabel}${buffLabel}</span>`;
      dialogContent += `</label>`;
    });

    dialogContent += `</div>`;
    dialogContent += `<div style="margin-top: 12px; padding: 8px; background: rgba(135,206,235,0.15); border: 1px solid #87CEEB; border-radius: 4px; text-align: center;">`;
    dialogContent += `<span style="color: #87CEEB; font-weight: 700;">+3 bonus Move Actions</span> <span style="color: rgba(255,255,255,0.7);">on target's next Turn</span>`;
    dialogContent += `</div>`;
    dialogContent += `<div style="margin-top: 8px; text-align: center; font-size: 13px; color: rgba(255,255,255,0.7); font-weight: 600;">Cost: <span style="color: #ff6b6b;">4 Life Points</span></div>`;
    dialogContent += `</div>`;

    return new Promise((resolve) => {
      const dialog = new Dialog({
        title: 'Favor of the Four Winds — Choose Target',
        content: dialogContent,
        buttons: {
          cast: {
            label: 'Cast',
            callback: async (html) => {
              const targetId = html.find('input[name="targetId"]:checked').val();
              if (!targetId) {
                ui.notifications.warn('No target selected.');
                resolve();
                return;
              }
              const targetActor = game.actors.get(targetId);
              if (!targetActor) {
                ui.notifications.warn('Target not found.');
                resolve();
                return;
              }

              // Deduct 4 LP
              await self._deductSpellCost(4, 0, 'Favor of the Four Winds');

              const isSelf = targetId === self.actor.id;

              if (isSelf) {
                // Self: direct update
                await self.actor.update({
                  'system.favorFourWindsBuff': {
                    casterId: self.actor.id,
                    casterName: self.actor.name
                  }
                });
              } else {
                // Other: hidden chat message for GM to apply
                await ChatMessage.create({
                  content: '<div style="display:none;"></div>',
                  speaker: ChatMessage.getSpeaker({ alias: 'System' }),
                  whisper: [],
                  flags: {
                    conan: {
                      favorFourWindsApply: true,
                      casterId: self.actor.id,
                      casterName: self.actor.name,
                      targetId: targetId
                    }
                  }
                });
              }

              // Visible chat card
              const tokenImg = self.actor.prototypeToken?.texture?.src || self.actor.img || 'icons/svg/mystery-man.svg';
              const targetText = isSelf
                ? `calls upon the <strong>Four Winds</strong>`
                : `calls the <strong>Four Winds</strong> to aid <strong>${targetActor.name}</strong>`;
              const effectName = isSelf ? self.actor.name : targetActor.name;

              let content = `<div class="conan-roll spell-chat-card" style="border-color: ${ownerColor};">`;
              content += `<div class="spell-chat-header">`;
              content += `<div class="spell-chat-portrait-wrap"><img src="${tokenImg}" class="spell-chat-portrait"/><img src="${spellIcon}" class="spell-chat-badge" alt="Favor of the Four Winds"/></div>`;
              content += `<div class="spell-chat-title"><strong>${self.actor.name}</strong> ${targetText}</div>`;
              content += `</div>`;
              content += `<div class="spell-chat-body">`;
              content += `<div class="spell-chat-effect">${effectName} gains <span style="color: #87CEEB; font-weight: 700;">+3 bonus Move Actions</span> on their next Turn.</div>`;
              content += `<div class="spell-chat-meta"><strong>Cost:</strong> 4 LP &nbsp;|&nbsp; <strong>Duration:</strong> Target's next Turn</div>`;
              content += `</div></div>`;

              ChatMessage.create({
                speaker: ChatMessage.getSpeaker({ actor: self.actor }),
                content: content
              });

              resolve();
            }
          },
          cancel: {
            label: 'Cancel',
            callback: () => resolve()
          }
        },
        default: 'cast'
      }, { width: 320 });
      dialog.render(true);
    });
  }

  /**
   * Handle Call Beast spell casting
   * Shows beast selection dialog, deducts LP, creates draggable summon chat card
   */
  async _handleCallBeastCast(spell, spellIcon) {
    const beasts = [
      { id: 'wild-dog', name: 'Wild Dog', lp: 3, category: 'beasts', group: 'wild-animals' },
      { id: 'hyena', name: 'Hyena', lp: 4, category: 'beasts', group: 'wild-animals' },
      { id: 'wolf', name: 'Wolf', lp: 6, category: 'beasts', group: 'wild-animals' },
      { id: 'giant-serpent', name: 'Giant Serpent', lp: 7, category: 'beasts', group: 'giant-serpents' },
      { id: 'crocodile', name: 'Crocodile', lp: 8, category: 'beasts', group: 'wild-animals' },
      { id: 'lion', name: 'Lion', lp: 9, category: 'beasts', group: 'wild-animals' },
      { id: 'bear', name: 'Bear', lp: 10, category: 'beasts', group: 'wild-animals' }
    ];

    const currentLP = this.actor.system.lifePoints?.value || 0;

    // Build dialog HTML with beast options
    let dialogContent = `<div style="display: flex; flex-direction: column; gap: 6px; padding: 4px;">`;
    dialogContent += `<p style="margin: 0 0 4px; color: #ccc; font-size: 0.9em;">Current LP: <strong style="color: #ff6666;">${currentLP}</strong></p>`;
    for (const beast of beasts) {
      const canAfford = currentLP > beast.lp; // Must survive (LP > cost, not >=)
      const disabledAttr = canAfford ? '' : ' disabled';
      const style = canAfford
        ? 'cursor: pointer; padding: 6px 10px; background: linear-gradient(180deg, #2a3a2a 0%, #1a2a1a 100%); border: 1px solid #4a6a4a; border-radius: 4px; color: #c0c0c0; display: flex; justify-content: space-between; align-items: center;'
        : 'padding: 6px 10px; background: #1a1a1a; border: 1px solid #333; border-radius: 4px; color: #555; display: flex; justify-content: space-between; align-items: center; opacity: 0.5;';
      dialogContent += `<button type="button" class="call-beast-option" data-beast-id="${beast.id}" style="${style}"${disabledAttr}>`;
      dialogContent += `<span>${beast.name}</span>`;
      dialogContent += `<span style="color: ${canAfford ? '#ff8888' : '#555'}; font-weight: bold;">${beast.lp} LP</span>`;
      dialogContent += `</button>`;
    }
    dialogContent += `</div>`;

    // Show dialog — resolve on beast selection or cancel
    const selectedBeast = await new Promise((resolve) => {
      const d = new Dialog({
        title: 'Call Beast — Choose Your Ally',
        content: dialogContent,
        buttons: {
          cancel: { label: 'Cancel', callback: () => resolve(null) }
        },
        default: 'cancel',
        render: (html) => {
          html.find('.call-beast-option').on('click', function () {
            const beastId = this.dataset.beastId;
            const beast = beasts.find(b => b.id === beastId);
            resolve(beast);
            d.close();
          });
        },
        close: () => resolve(null)
      }, { width: 300 });
      d.render(true);
    });

    if (!selectedBeast) return; // Cancelled

    // Deduct LP
    await this._deductSpellCost(selectedBeast.lp, 0, `Call Beast (${selectedBeast.name})`);

    // Build summon chat card with draggable badge
    const tokenImg = this.actor.prototypeToken?.texture?.src || this.actor.img || 'icons/svg/mystery-man.svg';
    const ownerColor = this._getOwnerColor();
    const casterName = this.actor.name.replace(/'/g, '&#39;');
    const summonData = JSON.stringify({
      enemyId: selectedBeast.id,
      category: selectedBeast.category,
      group: selectedBeast.group,
      casterName: casterName
    }).replace(/"/g, '&quot;');

    let content = `<div class="conan-roll spell-chat-card" style="border-color: ${ownerColor};">`;
    content += `<div class="spell-chat-header">`;
    content += `<div class="spell-chat-portrait-wrap">`;
    content += `<img src="${tokenImg}" class="spell-chat-portrait"/>`;
    content += `<img src="${spellIcon}" class="spell-chat-badge spell-summon-badge" alt="Call Beast" data-summon="${summonData}" title="Drag onto the map to place your ${selectedBeast.name}"/>`;
    content += `</div>`;
    content += `<div class="spell-chat-title"><strong>${this.actor.name}</strong> calls a <strong>${selectedBeast.name}</strong></div>`;
    content += `</div>`;
    content += `<div class="spell-chat-body">`;
    content += `<div class="spell-chat-effect">A ${selectedBeast.name} answers the call, arriving as a friendly ally until defeated or combat ends.</div>`;
    content += `<div class="spell-chat-meta"><strong>Cost:</strong> ${selectedBeast.lp} LP</div>`;
    content += `</div></div>`;

    await ChatMessage.create({
      speaker: ChatMessage.getSpeaker({ actor: this.actor }),
      content: content
    });
  }

  /**
   * Handle Create Bane Weapon spell casting
   * Shows target selection, applies buff to target, stores caster tracking
   * @param {number} lpCost - The LP cost paid (4, 6, or 8)
   */
  async _handleBaneWeaponCast(lpCost, spCost = 0) {
    // Determine damage die based on LP cost
    let damageDie;
    if (lpCost >= 8) {
      damageDie = '1d10';
    } else if (lpCost >= 6) {
      damageDie = '1d8';
    } else {
      damageDie = '1d6';
    }

    // Check if already maintaining a Bane Weapon
    if (this.actor.system.baneWeaponCaster) {
      ui.notifications.warn('Already maintaining a Bane Weapon enchantment. Dismiss the current one first.');
      return;
    }

    // Store costs for deduction after target confirmed
    const deferredLpCost = lpCost;
    const deferredSpCost = spCost;

    // Get list of potential targets: player characters + friendly tokens on the scene
    const targets = [];
    const seenActorIds = new Set();

    for (const t of canvas.tokens.placeables) {
      if (!t.actor || t.actor.id === this.actor.id) continue;
      if (seenActorIds.has(t.actor.id)) continue;

      // Any character2 on scene (tools/howard are different actor types, already excluded)
      if (t.actor.type === 'character2') {
        targets.push(t.actor);
        seenActorIds.add(t.actor.id);
      }
      // Friendly tokens (summons like Living Statue)
      else if (t.document.disposition === CONST.TOKEN_DISPOSITIONS.FRIENDLY && t.document.getFlag('conan', 'enemyData')) {
        targets.push(t.actor);
        seenActorIds.add(t.actor.id);
      }
    }

    if (targets.length === 0) {
      ui.notifications.warn('No valid targets in the current scene for Bane Weapon.');
      return;
    }

    // Build target selection dialog
    let dialogContent = `<div style="font-family: 'Montserrat', system-ui, sans-serif; padding: 12px; background: linear-gradient(180deg, #1B1B20 0%, #0B0B0D 100%); color: #FFFFFF;">`;
    dialogContent += `<div style="font-size: 9px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.12em; color: rgba(255,255,255,0.5); margin-bottom: 8px;">Select Target</div>`;
    dialogContent += `<div style="display: flex; flex-direction: column; gap: 4px;">`;

    targets.forEach((target, idx) => {
      const tokenImg = target.prototypeToken?.texture?.src || target.img || 'icons/svg/mystery-man.svg';
      dialogContent += `<label style="display: flex; align-items: center; gap: 8px; padding: 6px 8px; background: rgba(255,255,255,0.05); border: 1px solid #2a2a2e; border-radius: 4px; cursor: pointer;">`;
      dialogContent += `<input type="radio" name="targetId" value="${target.id}" ${idx === 0 ? 'checked' : ''} style="accent-color: #9b59b6; margin: 0;">`;
      dialogContent += `<img src="${tokenImg}" style="width: 24px; height: 24px; border-radius: 50%; object-fit: cover;">`;
      dialogContent += `<span style="font-weight: 600;">${target.name}</span>`;
      dialogContent += `</label>`;
    });

    dialogContent += `</div>`;
    dialogContent += `<div style="margin-top: 12px; padding: 8px; background: rgba(155,89,182,0.2); border: 1px solid #9b59b6; border-radius: 4px; text-align: center;">`;
    dialogContent += `<span style="font-weight: 700; color: #dda0dd;">${damageDie}</span> <span style="color: rgba(255,255,255,0.7);">bonus damage on melee/thrown attacks</span>`;
    dialogContent += `</div>`;
    dialogContent += `</div>`;

    const casterId = this.actor.id;
    const casterName = this.actor.name;

    return new Promise((resolve) => {
      const dialog = new Dialog({
        title: 'Create Bane Weapon',
        content: dialogContent,
        buttons: {
          cast: {
            label: 'Enchant Weapon',
            callback: async (html) => {
              const targetId = html.find('input[name="targetId"]:checked').val();
              const targetActor = game.actors.get(targetId);

              if (!targetActor) {
                ui.notifications.warn('Target not found.');
                resolve();
                return;
              }

              // NOW deduct the LP cost (only after target confirmed)
              await this._deductSpellCost(deferredLpCost, deferredSpCost, 'Create Bane Weapon');

              // Create invisible chat message to sync buff application across clients
              await ChatMessage.create({
                content: '<div style="display:none;"></div>',
                speaker: ChatMessage.getSpeaker({ alias: 'System' }),
                whisper: [],
                flags: {
                  conan: {
                    baneWeaponApply: true,
                    casterId: casterId,
                    casterName: casterName,
                    targetId: targetId,
                    targetName: targetActor.name,
                    damageDie: damageDie
                  }
                }
              });

              // Post visible chat message — portrait-style spell card
              const tokenImg = this.actor.prototypeToken?.texture?.src || this.actor.img || 'icons/svg/mystery-man.svg';
              const ownerColor = this._getOwnerColor();
              const baneIcon = 'systems/conan/images/icons/create_bane_weapon_icon.png';

              let content = `<div class="conan-roll spell-chat-card" style="border-color: ${ownerColor};">`;
              content += `<div class="spell-chat-header">`;
              content += `<div class="spell-chat-portrait-wrap"><img src="${tokenImg}" class="spell-chat-portrait"/><img src="${baneIcon}" class="spell-chat-badge" alt="Create Bane Weapon"/></div>`;
              content += `<div class="spell-chat-title"><strong>${this.actor.name}</strong> casts <strong>Create Bane Weapon</strong></div>`;
              content += `</div>`;
              content += `<div class="spell-chat-body">`;
              content += `<div class="spell-chat-effect">${targetActor.name}'s weapon gains <span style="color: #dda0dd; font-weight: 700;">+${damageDie}</span> damage and knocks targets Prone on hit.</div>`;
              content += `<div class="spell-chat-meta"><strong>Cost:</strong> ${lpCost} LP &nbsp;|&nbsp; <strong>Maintain:</strong> 3 LP + 1 Action per round</div>`;
              content += `</div>`;
              content += `</div>`;

              ChatMessage.create({
                speaker: ChatMessage.getSpeaker({ actor: this.actor }),
                content: content,
                rollMode: game.settings.get('core', 'rollMode')
              });

              resolve();
            }
          },
          cancel: {
            label: 'Cancel',
            callback: () => {
              ui.notifications.info('Bane Weapon cancelled.');
              resolve();
            }
          }
        },
        default: 'cast'
      }, {
        width: 320
      });

      dialog.render(true);
    });
  }

  /**
   * Handle Sacrifice Armor skill activation from the Arms tab icon
   * Costs 1 SP, sets armor to unarmored (AR 0)
   */
  async _onSacrificeArmor(event) {
    event.preventDefault();
    this._dismissAllTooltips();

    const spCost = 1;
    const currentSP = this.actor.system.stamina || 0;

    if (currentSP < spCost) {
      ui.notifications.warn(`Not enough Stamina! Need ${spCost} SP, have ${currentSP}.`);
      return;
    }

    // Get current armor for the chat message
    const currentArmor = this.actor.system.armorEquipped || { type: "unarmored", shield: false };
    const armorData = this._getArmorData();
    const oldArmorData = armorData[currentArmor.type] || armorData.unarmored;

    // Deduct SP and set armor to unarmored
    await this.actor.update({
      'system.stamina': currentSP - spCost,
      'system.armorEquipped.type': 'unarmored',
      'system.defense.ar': 0,
      'system.armorEquipped.description': this._getArmorDescription('unarmored', currentArmor.shield)
    });

    // Post to chat
    let content = `<div class="conan-roll">`;
    content += `<h3>Sacrifice Armor</h3>`;
    content += `<div class="skill-effect"><em>Negates all incoming damage this attack!</em></div>`;
    content += `<div class="skill-effect" style="color: #ff6b6b;">Armor sacrificed: ${oldArmorData.name} (AR ${oldArmorData.ar}) → Unarmored (AR 0)</div>`;
    content += `<div class="skill-cost-deducted"><span class="sp-cost">-${spCost} SP</span></div>`;
    content += `</div>`;

    ChatMessage.create({
      speaker: ChatMessage.getSpeaker({ actor: this.actor }),
      content: content,
      rollMode: game.settings.get('core', 'rollMode')
    });
  }

  /**
   * Handle Blocker skill toggle from the Arms tab icon
   * Toggle stance - when active, +1 Physical Defense (requires shield)
   */
  async _onBlockerToggle(event) {
    event.preventDefault();
    this._dismissAllTooltips();

    const currentlyActive = this.actor.system.blockerActive || false;
    const newState = !currentlyActive;

    // Toggle the blocker stance
    await this.actor.update({
      'system.blockerActive': newState
    });

    // Post to chat
    let content = `<div class="conan-roll">`;
    content += `<h3>Blocker</h3>`;
    if (newState) {
      content += `<div class="skill-effect" style="color: #90EE90;"><em>Stance ACTIVATED - +1 Physical Defense while not moving this round!</em></div>`;
    } else {
      content += `<div class="skill-effect" style="color: #ff6b6b;"><em>Stance DEACTIVATED</em></div>`;
    }
    content += `</div>`;

    ChatMessage.create({
      speaker: ChatMessage.getSpeaker({ actor: this.actor }),
      content: content,
      rollMode: game.settings.get('core', 'rollMode')
    });
  }

  /**
   * Handle Unseen Strike skill toggle from the Arms tab icon
   * Toggle on before a surprise attack - next attack gets +2 Atk, +1 Dmg
   * No SP cost, consumes on next attack
   */
  async _onUnseenStrikeToggle(event) {
    event.preventDefault();
    this._dismissAllTooltips();

    const currentlyActive = this.actor.system.unseenStrikeActive || false;
    const newState = !currentlyActive;

    // Toggle the unseen strike ready state
    await this.actor.update({
      'system.unseenStrikeActive': newState
    });

    // Post to chat
    let content = `<div class="conan-roll">`;
    content += `<h3>Unseen Strike</h3>`;
    if (newState) {
      content += `<div class="skill-effect" style="color: #dda520;"><em>🗡️ PREPARED - Next attack gets +2 Attack, +1 Damage!</em></div>`;
    } else {
      content += `<div class="skill-effect" style="color: #888;"><em>Cancelled</em></div>`;
    }
    content += `</div>`;

    ChatMessage.create({
      speaker: ChatMessage.getSpeaker({ actor: this.actor }),
      content: content,
      rollMode: game.settings.get('core', 'rollMode')
    });
  }

  /**
   * Handle Defender skill toggle from the Arms tab icon
   * STANCE: Toggle on to intercept one attack on a friendly character
   * No SP cost, once per round (manual deactivation for now)
   */
  async _onDefenderToggle(event) {
    event.preventDefault();
    this._dismissAllTooltips();

    const currentlyActive = this.actor.system.defenderActive || false;
    const newState = !currentlyActive;

    // Toggle the defender stance
    await this.actor.update({
      'system.defenderActive': newState
    });

    // Post to chat
    let content = `<div class="conan-roll">`;
    content += `<h3>🛡️ Defender</h3>`;
    if (newState) {
      content += `<div class="skill-effect" style="color: #dda520;"><em>STANCE ACTIVE - Ready to intercept one attack on an ally within touch range!</em></div>`;
      content += `<div class="skill-note" style="color: #888; font-size: 0.85em; margin-top: 4px;">(Once per round - deactivate manually after use)</div>`;
    } else {
      content += `<div class="skill-effect" style="color: #888;"><em>Stance deactivated</em></div>`;
    }
    content += `</div>`;

    ChatMessage.create({
      speaker: ChatMessage.getSpeaker({ actor: this.actor }),
      content: content,
      rollMode: game.settings.get('core', 'rollMode')
    });
  }

  // ==========================================
  // RELOAD AMMO RECOVERY
  // ==========================================

  /**
   * Handle Reload icon click — open ammo recovery dialog
   */
  async _onReloadClick(event) {
    event.preventDefault();
    this._dismissAllTooltips();

    const tracker = this.actor.system.reloadTracker;
    if (!tracker?.active) return;

    const weapons = tracker.weapons || {};
    const weaponEntries = Object.entries(weapons).filter(([_, w]) => w.spent > 0);

    if (weaponEntries.length === 0) {
      await this.actor.update({ 'system.reloadTracker': { active: false, weapons: {} } });
      ui.notifications.info('No ammo was spent — reload complete.');
      return;
    }

    // Build dialog content showing per-weapon recovery info
    let dialogContent = '<div class="reload-dialog">';
    for (const [id, w] of weaponEntries) {
      const rates = RELOAD_RATES[w.reloadType] || RELOAD_RATES.arrow;
      const recoveryRate = Math.max(rates.floor, Math.round(rates.base - w.spent * rates.decay));
      const recovered = Math.max(1, Math.round(w.spent * recoveryRate / 100));

      dialogContent += `<div class="reload-weapon-row">`;
      dialogContent += `<div class="reload-weapon-name">${w.name}</div>`;
      dialogContent += `<div class="reload-weapon-info">`;
      dialogContent += `<span class="reload-type">${w.reloadType}</span>`;
      dialogContent += `<span class="reload-stat">Spent: <strong>${w.spent}</strong></span>`;
      dialogContent += `<span class="reload-stat">Recovery: <strong>${recoveryRate}%</strong></span>`;
      dialogContent += `<span class="reload-stat">Expected: <strong>${recovered}</strong></span>`;
      dialogContent += `</div></div>`;
    }
    dialogContent += '</div>';

    new Dialog({
      title: 'Reload — Ammo Recovery',
      content: dialogContent,
      buttons: {
        reload: {
          icon: '<i class="fas fa-redo"></i>',
          label: 'Reload',
          callback: async () => { await this._processReload(weaponEntries); }
        },
        reset: {
          icon: '<i class="fas fa-times"></i>',
          label: 'Reset',
          callback: async () => {
            await this.actor.update({ 'system.reloadTracker': { active: false, weapons: {} } });
            ui.notifications.info('Reload tracker reset — no ammo recovered.');
          }
        }
      },
      default: 'reload'
    }).render(true);
  }

  /**
   * Process reload recovery for all tracked weapons and post chat card
   * @param {Array} weaponEntries - Array of [weaponId, weaponTrackingData]
   */
  async _processReload(weaponEntries) {
    const results = [];
    const updateData = {};

    for (const [weaponId, w] of weaponEntries) {
      const rates = RELOAD_RATES[w.reloadType] || RELOAD_RATES.arrow;
      const recoveryRate = Math.max(rates.floor, Math.round(rates.base - w.spent * rates.decay));
      const recovered = Math.max(1, Math.round(w.spent * recoveryRate / 100));

      results.push({
        weaponId, name: w.name, reloadType: w.reloadType,
        source: w.source, spent: w.spent,
        recoveryRate, recovered
      });

      // Determine where to restore ammo based on source
      if (w.source === 'armed' || w.source === 'melee' || w.source === 'thrown' || w.source === 'ranged') {
        // Check armedWeapons first
        const armed = this.actor.system.armedWeapons?.[weaponId];
        if (armed?.ammo) {
          const newCurrent = Math.min(armed.ammo.max, armed.ammo.current + recovered);
          updateData[`system.armedWeapons.${weaponId}.ammo.current`] = newCurrent;
          continue;
        }
        // Check thrownAttacks
        const thrown = this.actor.system.thrownAttacks?.[weaponId];
        if (thrown?.ammo) {
          const newCurrent = Math.min(thrown.ammo.max, thrown.ammo.current + recovered);
          updateData[`system.thrownAttacks.${weaponId}.ammo.current`] = newCurrent;
          continue;
        }
        // Check rangedAttacks
        const ranged = this.actor.system.rangedAttacks?.[weaponId];
        if (ranged?.ammo) {
          const newCurrent = Math.min(ranged.ammo.max, ranged.ammo.current + recovered);
          updateData[`system.rangedAttacks.${weaponId}.ammo.current`] = newCurrent;
          continue;
        }
      }
    }

    // Clear tracker in the same batch
    updateData['system.reloadTracker'] = { active: false, weapons: {} };
    await this.actor.update(updateData);

    // Post chat card
    this._postReloadChatCard(results);
  }

  /**
   * Post reload results to chat with expandable breakdown
   * @param {Array} results - Array of { name, spent, recoveryRate, recovered, reloadType }
   */
  _postReloadChatCard(results) {
    const tokenImg = this.actor.prototypeToken?.texture?.src || this.actor.img || 'icons/svg/mystery-man.svg';
    const ownerColor = this._getOwnerColor();

    let content = `<div class="conan-roll reload-chat-card" style="border-color: ${ownerColor};">`;
    content += `<div class="roll-header">`;
    content += `<img src="${tokenImg}" class="token-img" alt="${this.actor.name}">`;
    content += `<div class="roll-title">Reload</div>`;
    content += `</div>`;

    for (const r of results) {
      content += `<div class="reload-weapon-entry">`;
      content += `<div class="reload-weapon-label">${r.name} <span class="reload-type-tag">${r.reloadType}</span></div>`;
      content += `<div class="damage-result-box clickable-breakdown reload-result-box" style="cursor: pointer;">${r.recovered}</div>`;

      // Hidden breakdown — toggled on click
      content += `<div class="reload-breakdown" style="display: none;">`;
      content += `<div class="breakdown-header">Recovery Breakdown</div>`;
      content += `<div class="breakdown-line"><span class="breakdown-label">Type</span><span class="breakdown-value">${r.reloadType}</span></div>`;
      content += `<div class="breakdown-line"><span class="breakdown-label">Spent</span><span class="breakdown-value">${r.spent}</span></div>`;
      content += `<div class="breakdown-line"><span class="breakdown-label">Base Rate</span><span class="breakdown-value">${(RELOAD_RATES[r.reloadType] || RELOAD_RATES.arrow).base}%</span></div>`;
      content += `<div class="breakdown-line"><span class="breakdown-label">Decay</span><span class="breakdown-value">-${r.spent} × ${(RELOAD_RATES[r.reloadType] || RELOAD_RATES.arrow).decay}</span></div>`;
      content += `<div class="breakdown-line"><span class="breakdown-label">Recovery Rate</span><span class="breakdown-value">${r.recoveryRate}%</span></div>`;
      content += `<div class="breakdown-total"><span class="breakdown-label">Recovered</span><span class="breakdown-value">+${r.recovered} / ${r.spent} spent</span></div>`;
      content += `</div>`;

      content += `</div>`;
    }

    content += `</div>`;

    ChatMessage.create({
      speaker: ChatMessage.getSpeaker({ actor: this.actor }),
      content: content,
      rollMode: game.settings.get('core', 'rollMode')
    });
  }

  /**
   * Handle Infamy skill toggle from the Home tab check skills row
   * Toggle on before an intimidate/convince check - adds +2 to the check
   * No SP cost, consumes on next relevant check
   */
  async _onInfamyToggle(event) {
    event.preventDefault();
    this._dismissAllTooltips();

    const currentlyActive = this.actor.system.infamyActive || false;
    const newState = !currentlyActive;

    // Toggle the infamy ready state
    await this.actor.update({
      'system.infamyActive': newState
    });

    // Post to chat
    let content = `<div class="conan-roll">`;
    content += `<h3>Infamy</h3>`;
    if (newState) {
      content += `<div class="skill-effect" style="color: #9370DB;"><em>😈 PREPARED - Next intimidate/convince check gets +2!</em></div>`;
    } else {
      content += `<div class="skill-effect" style="color: #888;"><em>Cancelled</em></div>`;
    }
    content += `</div>`;

    ChatMessage.create({
      speaker: ChatMessage.getSpeaker({ actor: this.actor }),
      content: content,
      rollMode: game.settings.get('core', 'rollMode')
    });
  }

  /**
   * Handle Of the Shadows skill toggle from the Home tab check skills row
   * Toggle on for +1 Edge on checks - situational stance
   * No SP cost, deactivate manually when no longer needed
   */
  async _onOfTheShadowsToggle(event) {
    event.preventDefault();
    this._dismissAllTooltips();

    const currentlyActive = this.actor.system.ofTheShadowsActive || false;
    const newState = !currentlyActive;

    // Toggle the of the shadows state
    await this.actor.update({
      'system.ofTheShadowsActive': newState
    });

    // Post to chat
    let content = `<div class="conan-roll">`;
    content += `<h3>Of the Shadows</h3>`;
    if (newState) {
      content += `<div class="skill-effect" style="color: #9370DB;"><em>🌑 ACTIVE - Edge checks get +1!</em></div>`;
    } else {
      content += `<div class="skill-effect" style="color: #888;"><em>Deactivated</em></div>`;
    }
    content += `</div>`;

    ChatMessage.create({
      speaker: ChatMessage.getSpeaker({ actor: this.actor }),
      content: content,
      rollMode: game.settings.get('core', 'rollMode')
    });
  }

  /**
   * Handle Pantherish skill click - 1 SP to reroll last failed check or attack
   * Context-aware: On Home/Skills tab rerolls checks, on Arms tab rerolls attacks
   * For attack rerolls: does NOT consume ammo or poison
   */
  async _onPantherishClick(event) {
    event.preventDefault();
    this._dismissAllTooltips();

    // Check stamina
    const currentSP = this.actor.system.stamina || 0;
    if (currentSP < 1) {
      ui.notifications.warn("Not enough Stamina Points for Pantherish (need 1 SP)");
      return;
    }

    // Get context from clicked element
    const context = event.currentTarget.dataset.context || 'attack';

    // Get stored last roll data
    const lastRollData = this._lastRollData || {};

    if (context === 'attack') {
      // Reroll last attack
      if (!lastRollData.attack) {
        ui.notifications.warn("No recent attack to reroll!");
        return;
      }

      // Spend 1 SP
      await this.actor.update({
        'system.stamina': currentSP - 1
      });

      // Re-execute the attack with reroll flag (skips ammo/poison consumption)
      const { weaponId, weapon } = lastRollData.attack;
      await this._executeWeaponAttack(weaponId, weapon, { isReroll: true });

      // Clear the stored data
      this._lastRollData = { ...this._lastRollData, attack: null };

    } else if (context === 'check') {
      // Reroll last check
      if (!lastRollData.check) {
        ui.notifications.warn("No recent check to reroll!");
        return;
      }

      // Spend 1 SP
      await this.actor.update({
        'system.stamina': currentSP - 1
      });

      // Re-execute the check
      const { attribute } = lastRollData.check;
      await this._onRollAttribute(null, { isReroll: true, forceAttribute: attribute });

      // Clear the stored data
      this._lastRollData = { ...this._lastRollData, check: null };
    }
  }

  /**
   * Auto-resize the armor description textarea to fit its content
   */
  _autoResizeArmorDescription(html) {
    const textarea = html.find('.sheet2-armsArmorDetails')[0];
    if (textarea) {
      // Use requestAnimationFrame to ensure DOM is fully rendered before measuring
      requestAnimationFrame(() => {
        textarea.style.height = 'auto';
        textarea.style.height = textarea.scrollHeight + 'px';
      });
    }
  }

  // ==========================================
  // XP
  // ==========================================

  async _onXPChange(event) {
    event.preventDefault();
    const checkbox = event.currentTarget;
    const index = parseInt(checkbox.dataset.index);
    const checked = checkbox.checked;
    
    let xpData = this.actor.system.xp?.available || [];
    let xpArray = Array.isArray(xpData) ? [...xpData] : [];
    
    if (!Array.isArray(xpData)) {
      for (let i = 0; i < 10; i++) {
        xpArray[i] = xpData[i] === true || xpData[String(i)] === true;
      }
    }
    
    xpArray[index] = checked;
    
    await this.actor.update({ 'system.xp.available': xpArray });
  }

  // ==========================================
  // STAMINA
  // ==========================================

  async _onStaminaChange(event) {
    event.preventDefault();
    this._saveScrollPosition();
    const delta = parseInt(event.currentTarget.dataset.delta) || 0;
    const currentStamina = this.actor.system.stamina || 0;
    const newStamina = Math.max(0, currentStamina + delta);

    await this.actor.update({ 'system.stamina': newStamina });
  }

  _onStaminaDropdownToggle(event) {
    event.preventDefault();
    event.stopPropagation();
    this._clearAllTooltips();
    const html = $(this.element);
    const staminaMenu = html.find('.sheet2-staminaMenu');
    staminaMenu.toggleClass('open');
  }

  async _onStaminaSpend(event) {
    event.preventDefault();
    event.stopPropagation();
    this._saveScrollPosition();
    const html = $(this.element);
    const menuItem = event.currentTarget;
    const cost = parseInt(menuItem.dataset.cost) || 0;
    const action = menuItem.dataset.action;
    const rollFormula = menuItem.dataset.roll;
    const isOriginSpend = menuItem.dataset.originSpend === "true";
    const currentStamina = this.actor.system.stamina || 0;

    // Check if enough stamina
    if (currentStamina < cost) {
      ui.notifications.warn(`Not enough Stamina! Need ${cost}, have ${currentStamina}.`);
      return;
    }

    // Close menu
    html.find('.sheet2-staminaMenu').removeClass('open');

    // Poison: noStamina — SP is spent but the bonus does nothing
    const poisonEffects = this.actor.getFlag('conan', 'poisonEffects');
    const staminaNullified = poisonEffects?.active && poisonEffects.effects?.noStamina;

    if (staminaNullified) {
      // Deduct stamina — player loses the SP
      const newStamina = currentStamina - cost;
      await this.actor.update({ 'system.stamina': newStamina });

      // Thematic waste message — no bonus applied
      const venomMsg = VENOM_STAMINA_MESSAGES[Math.floor(Math.random() * VENOM_STAMINA_MESSAGES.length)];
      const ownerColor = this._getOwnerColor();
      ChatMessage.create({
        speaker: ChatMessage.getSpeaker({ actor: this.actor }),
        content: `<div class="conan-roll stamina-spend" style="border-color: ${ownerColor};">
          <h3>${this.actor.name}</h3>
          <div class="stamina-section">
            <div class="stamina-cost">-${cost} Stamina</div>
            <em style="color: #32CD32;">${venomMsg}</em>
          </div>
        </div>`
      });
      return;
    }

    // Handle origin-specific stamina spends
    if (isOriginSpend) {
      await this._handleOriginStaminaSpend(menuItem, cost, action);
      return;
    }

    // Deduct stamina for regular spends
    const newStamina = currentStamina - cost;
    await this.actor.update({ 'system.stamina': newStamina });

    // If this is a damage roll, roll the dice
    if (rollFormula) {
      const roll = new Roll(rollFormula);
      await roll.evaluate();

      roll.toMessage({
        speaker: ChatMessage.getSpeaker({ actor: this.actor }),
        flavor: `<strong>${this.actor.name}</strong> spends <strong>${cost} Stamina</strong> for Bonus Damage`
      });
    } else {
      // Send chat message about stamina spend
      const effectText = $(menuItem).find('.sheet2-staminaEffect').text();
      const ownerColor = this._getOwnerColor();
      ChatMessage.create({
        speaker: ChatMessage.getSpeaker({ actor: this.actor }),
        content: `<div class="conan-roll stamina-spend" style="border-color: ${ownerColor};">
          <h3>${this.actor.name}</h3>
          <div class="stamina-section">
            <div class="stamina-cost">-${cost} Stamina</div>
            <em>${effectText}</em>
          </div>
        </div>`
      });
    }
  }

  /**
   * Handle origin-specific stamina spend effects.
   */
  async _handleOriginStaminaSpend(menuItem, cost, action) {
    const currentStamina = this.actor.system.stamina || 0;
    const effectText = $(menuItem).find('.sheet2-staminaEffect').text();

    switch (action) {
      case "heal-lp": {
        // From the Wilds: Spend 1 SP to regain 2 LP
        const healAmount = parseInt(menuItem.dataset.healAmount) || 2;
        const currentLP = this.actor.system.lifePoints?.value || 0;
        const maxLP = this._getCalculatedMaxLP();
        const newLP = Math.min(maxLP, currentLP + healAmount);
        const actualHeal = newLP - currentLP;

        await this.actor.update({
          'system.stamina': currentStamina - cost,
          'system.lifePoints.value': newLP
        });

        ChatMessage.create({
          speaker: ChatMessage.getSpeaker({ actor: this.actor }),
          content: `<div class="conan-roll stamina-spend">
            <h3>${this.actor.name}</h3>
            <div class="stamina-section">
              <div class="stamina-cost">-${cost} Stamina</div>
              <em>${effectText}</em>
            </div>
            <div class="effect-result heal">
              <strong>+${actualHeal} LP</strong> (${currentLP} → ${newLP})
            </div>
          </div>`
        });
        break;
      }

      case "sorcery-defense": {
        // From Parts Unknown: Spend 1 SP to gain +2 Sorcery Defense for combat
        const defenseBonus = parseInt(menuItem.dataset.defenseBonus) || 2;
        const currentSorcDef = this.actor.system.defense?.sorcery || 5;

        await this.actor.update({
          'system.stamina': currentStamina - cost,
          'system.defense.sorcery': currentSorcDef + defenseBonus
        });

        ChatMessage.create({
          speaker: ChatMessage.getSpeaker({ actor: this.actor }),
          content: `<div class="conan-roll stamina-spend">
            <h3>${this.actor.name}</h3>
            <div class="stamina-section">
              <div class="stamina-cost">-${cost} Stamina</div>
              <em>${effectText}</em>
            </div>
            <div class="effect-result buff">
              <strong>Sorcery Defense: ${currentSorcDef} → ${currentSorcDef + defenseBonus}</strong>
              <div style="font-size: 14px; margin-top: 5px;">(Reset manually after combat ends)</div>
            </div>
          </div>`
        });
        break;
      }

      case "halve-spell-cost": {
        // Blood of Acheron: Spend 1 SP to halve next spell's LP cost
        await this.actor.update({
          'system.stamina': currentStamina - cost
        });

        ChatMessage.create({
          speaker: ChatMessage.getSpeaker({ actor: this.actor }),
          content: `<div class="conan-roll stamina-spend">
            <h3>${this.actor.name}</h3>
            <div class="stamina-section">
              <div class="stamina-cost">-${cost} Stamina</div>
              <em>${effectText}</em>
            </div>
            <div class="effect-result magic">
              <strong>Next spell costs half LP (round up)!</strong>
            </div>
          </div>`
        });
        break;
      }

      case "healing-spell": {
        // Blood of Jhebbal Sag: Healing spell - heal Wits die worth of LP
        // Costs 2 Actions, heals self or target in Touch Range
        const witsDie = this.actor.system.attributes?.wits?.die || 'd6';
        const healRoll = new Roll(`1${witsDie}`);
        await healRoll.evaluate();
        const healAmount = healRoll.total;

        const currentLP = this.actor.system.lifePoints?.value || 0;
        const maxLP = this._getCalculatedMaxLP();
        const newLP = Math.min(maxLP, currentLP + healAmount);
        const actualHeal = newLP - currentLP;

        await this.actor.update({
          'system.stamina': currentStamina - cost,
          'system.lifePoints.value': newLP
        });

        ChatMessage.create({
          speaker: ChatMessage.getSpeaker({ actor: this.actor }),
          content: `<div class="conan-roll stamina-spend spell-cast">
            <h3>Healing Spell</h3>
            <div class="stamina-section">
              <div class="stamina-cost">-${cost} Stamina + 2 Actions</div>
              <em>Blood of Jhebbal Sag</em>
            </div>
            <div class="effect-result heal">
              <strong>+${actualHeal} LP</strong> (rolled ${witsDie}: ${healAmount})
              <div style="font-size: 14px; margin-top: 5px;">${currentLP} → ${newLP}</div>
            </div>
          </div>`,
          rolls: [healRoll],
          rollMode: game.settings.get('core', 'rollMode')
        });
        break;
      }

      case "charge": {
        // Charge skill: 1 SP = 2 Move Actions + Melee Attack as 1 Action
        await this.actor.update({ 'system.stamina': currentStamina - cost });

        ChatMessage.create({
          speaker: ChatMessage.getSpeaker({ actor: this.actor }),
          content: `<div class="conan-roll stamina-spend">
            <h3>Charge!</h3>
            <div class="stamina-section">
              <div class="stamina-cost">-${cost} Stamina</div>
              <em>${this.actor.name} charges into battle!</em>
            </div>
            <div class="effect-result action">
              <strong>2 Move + Melee Attack as 1 Action</strong>
            </div>
          </div>`
        });
        break;
      }

      default: {
        // Generic origin spend - just deduct stamina and announce
        await this.actor.update({ 'system.stamina': currentStamina - cost });

        ChatMessage.create({
          speaker: ChatMessage.getSpeaker({ actor: this.actor }),
          content: `<div class="conan-roll stamina-spend">
            <h3>${this.actor.name}</h3>
            <div class="stamina-section">
              <div class="stamina-cost">-${cost} Stamina</div>
              <em>${effectText}</em>
            </div>
          </div>`
        });
      }
    }
  }

  // ==========================================
  // RECOVERY
  // ==========================================

  async _onRecoveryIconClick(event) {
    event.preventDefault();
    this._saveScrollPosition();
    const button = event.currentTarget;
    const index = parseInt(button.dataset.recoveryIndex);
    const isUsed = button.dataset.used === "true";

    // If a dialog is already open for this icon, close it
    if (this._openRecoveryDialog && this._openRecoveryIconIndex === index) {
      this._openRecoveryDialog.close();
      this._openRecoveryDialog = null;
      this._openRecoveryIconIndex = null;
      return;
    }

    // Close any existing dialog before opening a new one
    if (this._openRecoveryDialog) {
      this._openRecoveryDialog.close();
      this._openRecoveryDialog = null;
      this._openRecoveryIconIndex = null;
    }

    // Show appropriate dialog based on used state
    if (isUsed) {
      // Show Reset dialog
      await this._showRecoveryDialog("reset", index);
    } else {
      // Show Recover dialog
      await this._showRecoveryDialog("recover", index);
    }
  }

  async _showRecoveryDialog(type, index) {
    // Calculate recovery preview for the dialog
    let recoveryPreviewHtml = '';
    if (type === "recover") {
      const maxLP = this._getCalculatedMaxLP();
      const currentLP = this.actor.system.lifePoints?.value || 0;
      const baseAmount = Math.floor(maxLP / 2);

      // Check for Hardy skill (+2 LP)
      let hasHardy = false;
      const skills = this.actor.system.skills || {};
      for (const skill of Object.values(skills)) {
        if (skill.name?.toLowerCase() === 'hardy') {
          hasHardy = true;
          break;
        }
      }
      const hardyBonus = hasHardy ? 2 : 0;

      // Check for Resilient skill (+3 LP)
      let hasResilient = false;
      for (const skill of Object.values(skills)) {
        if (skill.name?.toLowerCase() === 'resilient') {
          hasResilient = true;
          break;
        }
      }
      const resilientBonus = hasResilient ? 3 : 0;

      // Origin bonus
      const originBonuses = this._getActiveOriginBonuses();
      const originBonus = originBonuses.lpRecovery || 0;

      const totalAmount = baseAmount + hardyBonus + resilientBonus + originBonus;
      const newLP = Math.min(maxLP, currentLP + totalAmount);
      const actualHealed = newLP - currentLP;

      // Build preview lines
      let previewLines = [`<span style="color: #aaa;">Base: ${baseAmount} LP (50% of ${maxLP})</span>`];
      if (hardyBonus > 0) previewLines.push(`<span style="color: #90EE90;">Hardy: +${hardyBonus} LP</span>`);
      if (resilientBonus > 0) previewLines.push(`<span style="color: #90EE90;">Resilient: +${resilientBonus} LP</span>`);
      if (originBonus > 0) previewLines.push(`<span style="color: #90EE90;">Origin: +${originBonus} LP</span>`);
      previewLines.push(`<span style="color: #fff; font-weight: bold;">Total: +${actualHealed} LP (${currentLP} → ${newLP})</span>`);
      // SP recovery
      const currentSP = this.actor.system.stamina || 0;
      const resilientSP = hasResilient ? 1 : 0;
      const totalSP = 1 + resilientSP;
      previewLines.push(`<span style="color: #87CEEB;">+${totalSP} SP${resilientSP > 0 ? ' (1 base + 1 Resilient)' : ''} (${currentSP} → ${currentSP + totalSP})</span>`);

      recoveryPreviewHtml = previewLines.join('<br>');
    }

    const html = `
      <div class="recovery-dialog">
        ${type === "recover" ? `
          <h3>Recover?</h3>
          <p style="text-align: left; line-height: 1.6;">${recoveryPreviewHtml}</p>
          <div class="dialog-buttons">
            <button class="dialog-btn dialog-yes" data-action="recover-yes">Yes</button>
          </div>
        ` : `
          <h3>Reset?</h3>
          <p>Reset both recovery icons</p>
          <div class="dialog-buttons">
            <button class="dialog-btn dialog-yes" data-action="reset-yes">Yes</button>
          </div>
        `}
      </div>
    `;

    const dialog = new Dialog({
      title: type === "recover" ? "Recovery" : "Reset Recovery",
      content: html,
      buttons: {},
      render: (dialogHtml) => {
        // Add click handlers
        dialogHtml.find('.dialog-btn').click(async (e) => {
          const action = e.currentTarget.dataset.action;

          if (action === "recover-yes") {
            await this._performRecover(index);
          } else if (action === "reset-yes") {
            await this._performReset();
          }

          // Close dialog and clear tracking
          this._openRecoveryDialog = null;
          this._openRecoveryIconIndex = null;
          $(dialogHtml).closest('.dialog').find('.close').click();
        });

        // Close on click outside
        setTimeout(() => {
          $(dialogHtml).closest('.dialog').on('click', (e) => {
            if ($(e.target).hasClass('dialog') || $(e.target).hasClass('window-content')) {
              this._openRecoveryDialog = null;
              this._openRecoveryIconIndex = null;
              $(dialogHtml).closest('.dialog').find('.close').click();
            }
          });
        }, 100);
      },
      default: "close",
      close: () => {
        // Clear tracking when dialog is closed
        this._openRecoveryDialog = null;
        this._openRecoveryIconIndex = null;
      }
    }, {
      width: 300,
      height: "auto"
    });

    // Store the dialog instance and icon index
    this._openRecoveryDialog = dialog;
    this._openRecoveryIconIndex = index;

    dialog.render(true);
  }

  async _performRecover(index) {
    const maxLP = this._getCalculatedMaxLP();
    const currentLP = this.actor.system.lifePoints?.value || 0;
    const currentSP = this.actor.system.stamina || 0;

    // Get origin bonus for LP recovery (Blood of Jhebbal Sag: +2 LP on recovery)
    const originBonuses = this._getActiveOriginBonuses();
    const lpRecoveryBonus = originBonuses.lpRecovery || 0;

    // Check for Hardy skill (+2 LP on recovery)
    let hasHardy = false;
    const skills = this.actor.system.skills || {};
    for (const skill of Object.values(skills)) {
      if (skill.name?.toLowerCase() === 'hardy') {
        hasHardy = true;
        break;
      }
    }
    const hardyLPBonus = hasHardy ? 2 : 0;

    // Check for Resilient skill (+3 LP, +1 SP on recovery)
    let hasResilient = false;
    for (const skill of Object.values(skills)) {
      if (skill.name?.toLowerCase() === 'resilient') {
        hasResilient = true;
        break;
      }
    }
    const resilientLPBonus = hasResilient ? 3 : 0;
    const resilientSPBonus = hasResilient ? 1 : 0;

    const baseRecoveryAmount = Math.floor(maxLP / 2);
    const totalRecoveryAmount = baseRecoveryAmount + lpRecoveryBonus + hardyLPBonus + resilientLPBonus;
    const newLP = Math.min(maxLP, currentLP + totalRecoveryAmount);
    const baseSPRecovery = 1; // Base: +1 SP per recovery
    const newSP = currentSP + baseSPRecovery + resilientSPBonus;

    // Update LP, SP, and mark recovery as used
    const updates = {
      'system.lifePoints.value': newLP,
      'system.stamina': newSP
    };

    // Poisoner: refill Ichor on recovery (+5, max 15)
    let ichorRefilled = 0;
    const inventory = this.actor.system.inventory || {};
    for (const [itemId, item] of Object.entries(inventory)) {
      if (item?.isPoisonerItem) {
        const currentIchor = item.quantity || 0;
        const newIchor = Math.min(15, currentIchor + 5);
        ichorRefilled = newIchor - currentIchor;
        if (ichorRefilled > 0) {
          updates[`system.inventory.${itemId}.quantity`] = newIchor;
        }
        break;
      }
    }

    if (index === 0) {
      updates['system.recovery.used1'] = true;
    } else {
      updates['system.recovery.used2'] = true;
    }

    // Recovery clears poison
    const poisonEffects = this.actor.getFlag('conan', 'poisonEffects');
    if (poisonEffects?.active) {
      updates['system.conditions.poisoned'] = false;
    }

    await this.actor.update(updates);

    // Clear poison flag separately (setFlag after update)
    if (poisonEffects?.active) {
      await this.actor.unsetFlag('conan', 'poisonEffects');
    }

    // Send chat message about recovery (with bonuses if applicable)
    const healedAmount = newLP - currentLP;
    let bonusTexts = [];
    if (lpRecoveryBonus > 0) bonusTexts.push(`+${lpRecoveryBonus} Origin`);
    if (hardyLPBonus > 0) bonusTexts.push(`+${hardyLPBonus} Hardy`);
    if (resilientLPBonus > 0) bonusTexts.push(`+${resilientLPBonus} Resilient`);
    let bonusText = bonusTexts.length > 0 ? ` <span style="color: #90EE90;">(${bonusTexts.join(', ')})</span>` : '';
    const ownerColor = this._getOwnerColor();

    // Build SP text for chat
    const totalSPGain = baseSPRecovery + resilientSPBonus;
    let spBonusText = `<div class="lp-change" style="color: #87CEEB;">+${totalSPGain} SP${resilientSPBonus > 0 ? ' <span style="color: #99ccff;">(1 base + 1 Resilient)</span>' : ''}</div>`;

    // Build Ichor refill text for chat
    let ichorText = '';
    if (ichorRefilled > 0) {
      ichorText = `<div class="lp-change" style="color: #90EE90;">+${ichorRefilled} Ichor 🐍</div>`;
    }

    ChatMessage.create({
      speaker: ChatMessage.getSpeaker({ actor: this.actor }),
      content: `<div class="conan-roll recovery-msg" style="border-color: ${ownerColor};">
        <h3>Recovery</h3>
        <div class="recovery-section">
          <strong>${this.actor.name}</strong> takes a moment to recover
        </div>
        <div class="effect-result heal">
          <div class="lp-change">+${healedAmount} LP${bonusText}</div>
          <div style="font-size: 14px; margin-top: 5px;">${currentLP} → ${newLP}</div>
          ${spBonusText}
          ${ichorText}
        </div>
      </div>`
    });
  }

  async _performReset() {
    // Reset both recovery icons
    await this.actor.update({
      'system.recovery.used1': false,
      'system.recovery.used2': false
    });
  }

  // ==========================================
  // TOOLTIP HELPER
  // ==========================================

  /**
   * Dismiss all Foundry tooltips to prevent orphaned tooltips
   * when the sheet re-renders.
   */
  _dismissAllTooltips() {
    // Use Foundry's tooltip API
    if (game.tooltip) {
      game.tooltip.deactivate();
      if (game.tooltip.pending) {
        clearTimeout(game.tooltip.pending);
        game.tooltip.pending = null;
      }
    }

    // Direct DOM fallback
    const tooltipEl = document.getElementById('tooltip');
    if (tooltipEl) {
      tooltipEl.classList.remove('active');
      tooltipEl.style.display = 'none';
    }
  }

  // ==========================================
  // CONDITION TOGGLES
  // ==========================================

  async _onConditionToggle(event) {
    event.preventDefault();
    event.stopPropagation();
    this._saveScrollPosition();

    const badge = event.currentTarget;
    const classList = badge.classList;

    // Define all conditions with their keys and chat messages
    const conditions = {
      mounted: { on: 'mounts', off: 'dismounts' },
      poisoned: { on: 'becomes poisoned', off: 'recovers from poison' },
      unconscious: { on: 'falls unconscious', off: 'regains consciousness' },
      stunned: { on: 'is stunned', off: 'recovers from being stunned' },
      bound: { on: 'is bound', off: 'breaks free from bonds' },
      frightened: { on: 'is overcome with fear', off: 'steels their nerve' },
      blinded: { on: 'is blinded', off: 'regains their sight' },
      prone: { on: 'is knocked prone', off: 'gets back up' },
      grappled: { on: 'is grappled', off: 'breaks free from the grapple' },
      bleeding: { on: 'starts bleeding', off: 'stops the bleeding' },
      burning: { on: 'catches fire', off: 'extinguishes the flames' }
    };

    // Find which condition was clicked
    for (const [conditionKey, messages] of Object.entries(conditions)) {
      if (classList.contains(`condition-${conditionKey}`) || classList.contains(`condition-toggle-${conditionKey}`)) {
        const currentState = this.actor.system.conditions?.[conditionKey] || false;
        await this.actor.update({ [`system.conditions.${conditionKey}`]: !currentState });

        // Stunned: dismissing costs 1 SP if from Pict Stunned trait
        if (conditionKey === 'stunned' && currentState === true) {
          const stunFlag = this.actor.getFlag('conan', 'stunnedDebuff');
          if (stunFlag?.active && stunFlag.source === 'pict') {
            const currentSP = this.actor.system.stamina || 0;
            if (currentSP < 1) {
              ui.notifications.warn('Not enough Stamina Points to shake off the stun! (1 SP required)');
              await this.actor.update({ 'system.conditions.stunned': true }); // revert the toggle
              break;
            }
            await this.actor.update({ 'system.stamina': currentSP - 1 });
            await this.actor.unsetFlag('conan', 'stunnedDebuff');
            // Unlock token
            if (stunFlag.tokenId) {
              const stunTokenDoc = game.scenes.active?.tokens.get(stunFlag.tokenId);
              if (stunTokenDoc) await stunTokenDoc.update({ locked: false });
            }
          }
        }

        // Glamour Blind: dismissing costs 1 SP
        if (conditionKey === 'blinded' && currentState === true) {
          const glamourFlag = this.actor.getFlag('conan', 'glamourDebuff');
          if (glamourFlag?.active) {
            const currentSP = this.actor.system.stamina || 0;
            if (currentSP < 1) {
              ui.notifications.warn('Not enough Stamina Points to overcome Glamour! (1 SP required)');
              await this.actor.update({ 'system.conditions.blinded': true }); // revert
              break;
            }
            await this.actor.update({ 'system.stamina': currentSP - 1 });
            await this.actor.unsetFlag('conan', 'glamourDebuff');

            ChatMessage.create({
              speaker: ChatMessage.getSpeaker({ actor: this.actor }),
              content: `<div class="conan-roll"><div class="roll-header"><div class="roll-title">${this.actor.name} — Overcomes Glamour!</div></div><div style="text-align: center; padding: 8px; color: #2d6b2d; font-style: italic;">With sheer force of will, ${this.actor.name} shakes off the blinding sorcery!</div><div style="text-align: center; color: #ff8888;">Cost: 1 SP</div></div>`
            });
          }
        }

        // Bound (Garrote): GM can freely dismiss from condition bar
        if (conditionKey === 'bound' && currentState === true) {
          const boundFlag = this.actor.getFlag('conan', 'boundDebuff');
          if (boundFlag?.active) {
            await this.actor.unsetFlag('conan', 'boundDebuff');
            if (boundFlag.tokenId) {
              const boundTokenDoc = game.scenes.active?.tokens.get(boundFlag.tokenId);
              if (boundTokenDoc) await boundTokenDoc.update({ locked: false });
            }
          }
        }

        // Poison: toggling OFF clears all poison effects
        if (conditionKey === 'poisoned' && currentState === true) {
          await this.actor.unsetFlag('conan', 'poisonEffects');
        }

        // Burning: toggling OFF clears burningDebuff flag (free dismiss)
        if (conditionKey === 'burning' && currentState === true) {
          await this.actor.unsetFlag('conan', 'burningDebuff');
        }

        // Poison: GM toggling ON triggers severity roll + secret effects (traps, environmental, narrative)
        if (conditionKey === 'poisoned' && currentState === false && game.user.isGM) {
          // Trigger the same poison application as weapon-triggered poison
          if (typeof applyPoisonToCharacter === 'function') {
            applyPoisonToCharacter(this.actor, 'GM Applied');
          } else if (typeof window.applyPoisonToCharacter === 'function') {
            window.applyPoisonToCharacter(this.actor, 'GM Applied');
          } else {
            // Fallback: broadcast via invisible ChatMessage to trigger the conan.js handler
            const msg = await ChatMessage.create({
              content: '', whisper: [], blind: true,
              flags: { conan: { poisonGMApply: true, actorId: this.actor.id } }
            });
            if (msg) msg.delete();
          }
        }

        // Chat message about condition change
        const action = currentState ? messages.off : messages.on;
        const conditionClass = currentState ? 'condition-off' : 'condition-on';
        const conditionLabel = conditionKey.charAt(0).toUpperCase() + conditionKey.slice(1);
        const ownerColor = this._getOwnerColor();
        ChatMessage.create({
          speaker: ChatMessage.getSpeaker({ actor: this.actor }),
          content: `<div class="conan-roll condition-msg ${conditionClass} condition-${conditionKey}" style="border-color: ${ownerColor};">
            <h3>${conditionLabel}</h3>
            <div class="condition-section">
              <strong>${this.actor.name}</strong> ${action}!
            </div>
          </div>`
        });
        break;
      }
    }
  }

  // ==========================================
  // ORIGIN
  // ==========================================

  async _onOriginChange(event) {
    event.preventDefault();
    const selectedId = event.currentTarget.value;

    // Track old origin's alchemy access before changing
    const oldOriginId = this.actor.system.origin?.id;
    const oldSorceryAccess = oldOriginId ? this._getOriginSorceryAccess(oldOriginId) : [];
    const hadAlchemy = oldSorceryAccess.includes('alchemy');

    // Remove old origin skills first
    await this._removeOriginSkills();

    if (!selectedId) {
      // Clear origin and reset bonus choices (use full object for proper persistence)
      await this.actor.update({
        'system.origin.id': "",
        'system.origin.name': "",
        'system.origin.baseLP': 0,
        'system.originNotes': "",
        'system.originBonuses': { statChoice: "", skillChoice: "" }
      });
      // Remove alchemy gem if old origin had alchemy
      if (hadAlchemy) await this._removeAlchemyGem();
      // Clean up all sorcery from old origin
      await this._cleanupLostSorcery(oldSorceryAccess, []);
      return;
    }

    const origins = this._getOriginData();
    const origin = origins[selectedId];

    if (origin) {
      // Update origin and reset bonus choices for new origin
      // Use origin.bonuses for the notes field (contains mechanical bonuses info)
      // Use full object for originBonuses to ensure proper persistence
      await this.actor.update({
        'system.origin.id': origin.id,
        'system.origin.name': origin.name,
        'system.origin.baseLP': origin.baseLP,
        'system.originNotes': origin.bonuses || "",
        'system.originBonuses': { statChoice: "", skillChoice: "" }
      });

      // Add automatic origin skills (non-choice skills)
      await this._addAutomaticOriginSkills(selectedId);

      // Manage Alchemy Gem based on new origin's sorcery access
      const newSorceryAccess = this._getOriginSorceryAccess(selectedId);
      const hasAlchemy = newSorceryAccess.includes('alchemy');

      if (hasAlchemy) {
        await this._ensureAlchemyGem();
      } else if (hadAlchemy) {
        await this._removeAlchemyGem();
      }

      // Clean up purchased spells and state for lost disciplines
      await this._cleanupLostSorcery(oldSorceryAccess, newSorceryAccess);
    }
  }
}

// ============================================================================
// GLOBAL HOOKS - Clear orphaned tooltips when actors update
// ============================================================================

// When any actor updates (including from other users), clear tooltips to prevent orphans
Hooks.on('updateActor', (actor, changes, options, userId) => {
  // Clear custom tooltips globally
  $('.custom-tooltip').remove();

  // Dismiss Foundry tooltips
  if (game.tooltip) {
    game.tooltip.deactivate();
  }
});

// ============================================================================
// FIGHT! PULSE — re-render open player sheets when combat state changes
// ============================================================================

function refreshFightPulseOnOpenSheets() {
  // Re-render all open character2 sheets so _updateFightPulse fires
  for (const app of Object.values(ui.windows)) {
    if (app.actor?.type === 'character2' && app.rendered) {
      app.render(false);
    }
  }
}

Hooks.on('createCombat', refreshFightPulseOnOpenSheets);
Hooks.on('deleteCombat', refreshFightPulseOnOpenSheets);
Hooks.on('createCombatant', refreshFightPulseOnOpenSheets);
Hooks.on('deleteCombatant', refreshFightPulseOnOpenSheets);