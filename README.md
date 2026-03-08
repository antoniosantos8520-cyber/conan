# Blood and Steel

A Foundry VTT system for **Conan: The Hyborian Age** (Monolith Edition).

Built from scratch — not a reskin, not a port. Blood and Steel is a purpose-built engine for Monolith's Conan RPG, with custom character sheets, enemy card dialogs, a full GM tools suite, sorcery system, comic book storytelling tools, and more.

> *"Civilized men are more discourteous than savages because they know they can be impolite without having their skulls split."* — Robert E. Howard

---

## Installation

1. In Foundry VTT, go to **Settings > Game Systems > Install System**
2. Paste this manifest URL into the field at the bottom:

```
https://raw.githubusercontent.com/antoniosantos8520-cyber/conan/main/system.json
```

3. Click **Install**
4. Create a new world using **Blood and Steel** as the game system
5. **Albert** (the GM Tools sheet) is created automatically when you first load the world

Updates will appear automatically in Foundry when new versions are released.

---

## Getting Started — Character Creation

1. Open the **Actors** tab in the sidebar
2. Click **Create Actor**, name your character, and select the **character2** type
3. Open the character sheet
4. Click the **?** tab — this is the built-in **Character Creator** tutorial that walks you through the entire process step by step

The tutorial covers origin selection, stat allocation, skill purchasing, equipment, sorcery, and everything else you need to get a character ready for the Hyborian Age.

### Character Sheet Tabs

| Tab | What It Does |
|-----|-------------|
| **Home** | Portrait, origin, stats (Might/Edge/Grit/Wits), defenses, LP bar, Flex die, Stamina pool |
| **Attacks** | Melee and ranged weapons with one-click attack rolls, damage formulas, and ammo tracking |
| **Skills** | Full skill tree with ranks (1–5), XP costs, and origin bonuses |
| **Equip** | Inventory system with armor, shield, mount, saddlebag, and weapon loadout |
| **Spells** | Sorcery disciplines, spell learning, and casting (see Sorcery section below) |
| **Stamina** | Stamina pool management and special abilities |
| **Journal** | Multi-page personal notes with rich text editing |

### Stats and Defenses

Every character has four stats — **Might**, **Edge**, **Grit**, and **Wits** — each with a value and a die type. Rolls are stat die + stat value vs. a Difficulty number (roll-over system). Characters also have Physical Defense, Sorcery Defense, and Armor Rating.

### Life Points

Max LP is calculated from your Origin base + (Grit x 2) + skill bonuses. Two recovery slots let you heal between encounters. The token bar on the canvas reads your LP in real time.

### Conditions

11 conditions that can be toggled on the character sheet: Mounted, Poisoned, Unconscious, Stunned, Bound, Frightened, Blinded, Prone, Grappled, Bleeding, and Burning. Each one has mechanical effects integrated into the combat system.

---

## Albert — The GM Tools Sheet

Albert is your GM command center. He's created automatically the first time you load a world. Open him from the Actors tab.

### Enemies Tab

Browse, spawn, and manage all enemy types from the bestiary. Enemies are organized into **6 categories** with themed color schemes:

| Category | Theme |
|----------|-------|
| **Human** | Steel blue |
| **Beast** | Forest green |
| **Undead** | Sickly purple |
| **Demon** | Infernal red |
| **Monstrosity** | Dark teal |
| **Inanimate** | Stone gray |

**Drag and drop** any enemy token image onto the canvas to spawn them directly into the scene. The system auto-creates the actor, places the token, and stores all enemy data.

**Double-click** any enemy token on the canvas to open their **Enemy Card** — a CCG-style portrait card (5:7 trading card ratio) with stats, abilities, weapons, active effects, and real-time HP tracking.

### Area Map Maker

Drag **A–Z area markers** onto your scene and define connections between them in the matrix. Lines are drawn automatically between connected areas. Hovering over any token shows the **distance in areas** and **line-of-sight status** to every marked area on the map.

- **LOS Blockers**: Mark areas that block sight lines — the system uses BFS pathfinding to determine what can see what
- **Canvas Tooltip**: Hover any token to see distance and LOS info in real time
- Works with stacked tokens (doesn't fail when tokens overlap)

### Travel Master

Plan overland journeys with terrain types, weather, and encounter management.

- **5 travel modes**: Foot (18 mi/day), Mount (30), Wagon (15), River Ship (40), Sea Ship (90)
- **7 terrain types**: Road, Plains, Hills, Mountains, Forest, Jungle/Swamp, Desert — each with speed multipliers
- **6 weather types**: Clear, Hot, Cold, Heavy Rain, Storm, Fog
- **18+ named locations** across the Hyborian Age world with flavor text
- Automatic encounter distance rolls and category selection

### Winds of Fate

Monolith's **Rule of Three** fate mechanic, built into the GM tools. Apply bonuses to the whole board or to individual players to tip the scales when the story demands it.

---

## Combat

### Initiative

Roll initiative from the **character sheet's initiative button**, not from the token or combat tracker. The system uses its own initiative flow tied to the character's stats.

### Smart Mouse

**Shift + Right-Click** a target token to instantly apply the last damage and effect you rolled. No dialog, no prompts — just point and punish.

### Flex Die

The d10 Flex Die is a core Monolith mechanic. When it triggers:

- **Reroll** a failed attack or check
- **Add damage** to a successful hit
- **Prevent** incoming damage
- **Spell Flex** gets 3 choices: Stamina recovery, Cast!/Massive! (enhanced effect), or Regain Cost (refund the LP/SP you just spent)

### Damage Pipeline

1. Attack roll: stat die + stat value vs. target defense
2. Damage roll: weapon formula + modifiers (traits, buffs, spells)
3. Armor reduction: AR reduces **all** damage — melee, ranged, **and** sorcery (unless a spell explicitly bypasses it)
4. Floating damage number appears over the target token (red for damage, green for healing)

### Floating Numbers

- **Red**: Damage dealt
- **Green**: Healing received
- **Purple**: Spell cost refunded (Sorcery Flex Regain)
- Numbers rise above the token and fade — visible to all players via socket broadcast

### Conditions in Combat

Conditions have real mechanical effects:

- **Blinded**: Auto-miss all attacks unless Flex die saves you
- **Stunned**: Skip your next turn
- **Bound**: Cannot move, take 1d4 damage per turn until freed
- **Poisoned**: Flex die disrupted, stamina spend blocked, spell casting interrupted
- **Burning**: 1d4 fire damage per round with 50/50 chance to extinguish each tick
- **Frightened**: -1 to checks and attacks
- **Bleeding**: 1 damage per round until healed

### Defense Hover Tooltip (GM Only)

Hover over any token on the canvas and see **Phy X / Sor Y** displayed above it — blue for physical defense, purple for sorcery. Works for both enemy tokens and player tokens.

---

## Enemy Card System

Double-click any enemy token to open their card. The enemy card is a CCG-style portrait dialog with:

- **Portrait panel** (left): Full character art with type badge (Minion = green, Antagonist = red)
- **Stats panel** (right): Defense icons (heart, shield, hat-wizard, helmet), stat values (M/E/G/W), weapon attack buttons
- **Active effects** (bottom-right): Protect shields, Inspire buffs, Tide of Stone debuffs
- **Threat badges** (top): Gold skull icons + trait tags with tooltips (GM only)
- **HP tracking**: Editable HP field that syncs in real time with the token bar
- **Status grid**: 8 toggleable conditions (Mounted, Poisoned, Unconscious, Stunned, Bound, Blinded, Prone, Grappled)

### Enemy Abilities

Abilities appear as clickable buttons on the enemy card:

- **Protect** (Guards): Guard absorbs hits for a nearby ally. Shield icon with stack count on the protected target. Click to dismiss one stack at a time.
- **Inspire** (Guard Captains): 3-state cycle (Ready → Active → Spent). Click targets one by one, then press Shift to activate. Gives +1 attack to inspired allies.
- **War Cry** (Pict Champions): +1 attack to nearby Picts
- **Bellow for Blood** (Barbarian Chieftains): +1 damage to all barbarians
- **Blood Sacrifice** (Cultists): Self-destruct to heal allies
- **Lust** (Enchantress): Blinds a player — they see nothing but the object of their desire
- **Tender Mercy** (Enchantress): Heals an ally enemy for 2d4+2 LP
- **Summon Beast** / **Raise Dead** / **Summon Fiend**: Spawn additional enemies on the battlefield
- **Hellfire** (Summoner): Sorcery attack that sets targets ablaze

---

## The Bestiary

### Human Enemies

**Guards** — City watch, palace guards, fortress sentinels
- Guard (Minion), Sergeant (Minion), Guard Captain (Antagonist)
- Special: Protect and Inspire abilities

**Bandits** — Highway robbers, desperate outlaws
- Bandit (Minion), Veteran Bandit (Minion), Bandit Leader (Antagonist)

**Picts** — Savage hunters from the western wilderness
- Pict Hunter (Minion), Pict Warrior (Minion), Pict Champion (Antagonist)
- Special: War Cry buff

**Cultists** — Worshippers of dark gods
- Cultist Initiate (Minion), Cultist (Minion), High Priest (Antagonist)
- Special: Blood Sacrifice, Summon Fiend

**Pirates** — Sea raiders and cutthroats
- Pirate (Minion), Pirate Mate (Minion), Pirate Captain (Antagonist)

**Barbarians** — Northern warriors and Cimmerian raiders
- Barbarian Youth (Minion), Barbarian (Minion), Barbarian Chieftain (Antagonist)
- Special: Barbaric Resilience, Bellow for Blood

**Steppe Riders** — Mounted nomads of the eastern grasslands
- Steppe Rider Youth (Minion), Steppe Rider (Minion), Steppe Khan (Antagonist)
- Special: Mounted combat

**Sorcerers** — Three distinct archetypes:
- **Witch** (Antagonist) — Call Beast, Favor of the Four Winds. Traits: Glamour (blind), Hex (stacking curse), Beastmaster (double summons), Feral Bond (buffed beasts)
- **Necromancer** (Antagonist) — Raise Dead, Death Scream, Command the Dead. Traits: Eternal Servant (resurrect skeletons every round), Deathless (killing blow kills a skeleton instead), Soul Harvest (heal on skeleton death), Bone Armor (reflect damage)
- **Summoner** (Antagonist) — Hellfire, Summon Fiend, Demonic Ward. Tiered portraits: Torch → Pyre → Burning One → Volcanist. Traits: Inferno (burning DoT), Damnation (15 dmg hellfire), Volatile (death explosion), Backdraft (melee reflect), Eruption (escalating self-destruct at 2d10 AoE)

**Silk Vipers** — Harem assassins who kill with a glance, a whisper, a tender touch
- Handmaiden (Minion) — Poisoned Blade
- Bride (Minion) — Stunning Lash, Garrote (binds target, 1d4/turn)
- Enchantress (Antagonist) — Lust (blind), Tender Mercy (heal allies)
- Traits: Lotus Dust (-1 attack stacking), Garrote (bind), First Wife (replacement spawns on death), Harmless (survive first killing blow), Madwoman (+2 def/dmg after surviving)

### Undead

**Skeletons** — Skeleton Warrior, Skeleton Veteran, Skeleton Champion
**Mummies** — Mummy, Mummy Elect, Mummy King (with Chilling Blast/Wave)
**Ghosts** — Apparition, Ghost, Enraged Ghost (Intangible — immune to physical)
**Vampires** — Blood Feast healing, hypnotic gaze

### Beasts

**Predators** — Wolf, Hyena, Lion, Tiger
**Serpents** — Viper, Python, Giant Serpent
**Apes** — Gray Man-Ape, Gray Man-Ape Brute
**Other** — Crocodile, Giant Spider, Bear, Wild Boar, and more

### Demons

**Lesser Demons** — Fiend, Horror
**Greater Demons** — Winged Nightmare, Demon Lord

### Monstrosities

**Black Ones**, **Atavisms**, and other ancient horrors from beyond the veil of civilization.

### Inanimate

**Living Statues** — Stone (60 LP, 10 AR) and Steel (80 LP, 12 AR) variants. Pure damage sponges.

---

## Threat Engine

When enemies are spawned from Albert's enemy tab, the **Threat Engine** procedurally generates difficulty. Each enemy gets a **skull tier** (0–3) and **random combat traits**, creating dozens of unique builds from every enemy template.

### Skull Tiers

| Tier | Name | Chance | Skulls |
|------|------|--------|--------|
| 0 | Normal | 40% | — |
| 1 | Seasoned | 30% | 💀 |
| 2 | Veteran | 20% | 💀💀 |
| 3 | Elite | 10% | 💀💀💀 |

Skulls are baked into the token nameplate so **all players** can see relative danger. Gold skull icons and trait badges appear on the GM's enemy card.

### Traits by Category

Every enemy category has its own trait pool. Traits are randomly assigned at spawn time based on skull tier. Here's a taste:

**Guards**: Tough (ignore damage ≤ 2), Aggressive (+1 attack/damage), Tactical (enhanced Protect/Inspire), Armored (+2 AR), Defensive (+1 to both defenses)

**Picts**: War Chant (+2 damage under War Cry), Wildman (death strike on dying), Horde (2 hunters spawn on death), Thunderstrike (stun + lock target)

**Cultists**: Dedicated Servant (death summons Winged Nightmare), Zealot (+1d4 damage), Martyr (death buffs all cultists), From the Grave (1d4 to killer on death)

**Pirates**: Riposte (counter-attack), Nimble (+2 Phys Def), Cutthroat (+2 damage), Dirty Fighter (reduce target AR, stacks to 3)

**Barbarians**: Berserker (+1 damage per dead barbarian, stacking), Roar (enhanced Resilience), Bloody Axe (+2 damage), Iron Will (+2 Sorc Def)

**Steppe Riders**: Swift (negate first non-spell damage per round), Eagle Eye (+1 ranged, ignore 2 AR), Trample (+2 melee), Untamed (horse auto-attacks)

**Witches**: Glamour (blind target), Hex (stacking -1 attack curse), Beastmaster (double summons), Feral Bond (+2 attack/damage on beasts)

**Necromancers**: Eternal Servant (mass resurrect), Deathless (redirect killing blow), Soul Harvest (heal 1d6), Bone Armor (reflect damage)

**Summoners**: Inferno (burning DoT), Damnation (15 dmg hellfire), Volatile (1d8 death explosion), Backdraft (1d4 melee reflect), Eruption (escalating 2d10 AoE self-destruct)

**Silk Vipers**: Lotus Dust (stacking -1 attack), Garrote (bind + 1d4/turn), First Wife (replacement on death), Harmless (survive first kill), Madwoman (grows stronger after surviving)

Every encounter feels different even when using the same enemy types. 78+ unique trait combinations across all categories.

---

## Sorcery

Spells are cast from the character sheet's **Spells tab**. Click the spell icon to quick-cast, or click the spell border to expand and see full details.

### Disciplines

**Witchcraft** — Eye of the Familiar (inherent), Call Beast, Favor of the Four Winds, Lotus Miasma, Eyes of the Raven

**Necromancy** — Sense Sorcery (inherent), Raise Dead, Death Scream, Counter-Ward

**Black Magic** — Snake Arrow, Astral Projection, Frightful Aura, Fearsome Ward, Wave of Darkness, Beast Form, Mesmerism

**Sorcery** (Demon Pacts) — Demonic Ward, Demonic Steed, Hellfire, Summon Fiend

**White Magic** — Capture Soul, Create Bane Weapon, Healing Magic, Impaling Throw

### Casting Flow

1. Click a spell to cast — the system rolls against your stat and applies the LP/SP cost automatically
2. A **floating red number** appears over your token showing the life force spent
3. The **Flex Die** offers three choices: **Stamina recovery**, **Cast!/Massive!** (enhanced effect), or **Regain Cost** (refund the LP/SP you just paid — shown as a floating green heal number)

### Spell Effects

- **Attack spells** follow the same damage pipeline as weapons — roll, apply with Smart Mouse
- **Buff spells** apply effects automatically (Beast Form, Eyes of the Raven, Demonic Ward, etc.)
- **Debuff spells** apply to enemy cards as active effects (Tide of Stone reduces defense)
- **Healing spells** open a target dialog — pick self or allies, LP restored with floating green number and poison cure
- **Summon spells** spawn tokens directly onto the battlefield
- **Maintained spells** toggle on/off from the character sheet

### Damage Breakdowns

All damage results have expandable breakdown boxes. Click to see the math: `1d8+2` splits into "Base Damage: 1d8 → 6" + "Spell Bonus: +2".

### Cross-System Effects

Spells cast from the character sheet can affect enemy cards. **Tide of Stone** reduces an enemy's physical defense (stacking, unlimited). The enemy card shows the debuff with color-coded defense values — green (buffed), red (debuffed), yellow (contested).

---

## Dread Clock

A narrative time tracker for night-based scenarios. The Dread Clock runs from **7 PM (Sundown)** to **6 AM (Dawn)** — 11 hours of darkness.

### Clock Face

An SVG bronze clock with filled/unfilled arcs showing elapsed time, hour notches, and a glowing marker at the current hour. Every hour advance posts atmospheric flavor text to chat.

### Threat System (GM Only)

The Dread Clock includes a **threat threshold** mechanic:

- Configurable threshold (default 8, range 1–8)
- **Roll button**: d8 vs. threshold — meet or beat triggers the Headsman event
- **Corner buttons**: + (easier to trigger), - (harder), dice (roll now), reset (back to 8)
- Threshold and controls hidden from players — they only see the clock face

### Controls

- **Advance/Retreat**: Move the clock forward or backward one hour
- **Dawn Reset**: At dawn, reset to Sundown for the next night
- **Live Sync**: All connected clients see clock updates in real time

---

## Howard the Chronicler

A built-in **comic book creation and presentation tool** for storytelling. Create visual tales with panels, speech bubbles, narration, and skill checks — then present them to your players page by page with dramatic reveals.

### Tale Structure

Each tale is a comic book with a cover page and numbered story pages. Pages use one of **8 templates**: Splash (1 giant panel), Cinematic (3 horizontal strips), Standard (6-panel grid), Dense (9-panel grid), Split (2 vertical halves), L-Shape (1 large + 2 stacked), Stat Block, and Handout.

### Three Editor Modes

| Mode | Purpose |
|------|---------|
| **GM** | View and organize tales, GM notes visible, manage content |
| **Forge** | Build pages with 4 tools: PAGE (image layers), PANEL (freeform panels), TEXT (rich text), SPEECH (speech bubbles with tails) |
| **Presentation** | Broadcast to players with dramatic reveals, zoom, and hidden elements |

### Forge Mode Tools

- **PAGE**: Add and position image layers on the page background. Drag to move, scroll to zoom, layer ordering.
- **PANEL**: Draw freeform panels anywhere on the page. Configurable size, position, transparency, and image layers.
- **TEXT**: Place rich text blocks with formatting (bold, italic, color, font). Draw a rectangle, type your text.
- **SPEECH**: Create speech bubbles with 8-direction tails. Assign to characters, write dialogue.

### Presentation Mode

Enter Presentation from Forge mode. Your players see a read-only comic viewer.

- **Show**: Broadcasts the current tale to all players
- **Reveal**: Click hidden elements one by one to dramatically reveal them to players
- **Zoom**: Click a panel to zoom it full-size on both GM and player screens
- **Undo**: Re-hide the last revealed element
- **Hidden Pages**: Entire pages can be hidden from players and revealed during presentation

### Skill Checks

Place skill check markers on pages during Forge mode. Set the skill, DC, and hidden success text. During presentation, players can click to roll — pass or fail, with the success text revealed only on a pass.

### Roll Call

Ad-hoc skill checks from Presentation mode. Open the Roll Call dialog, set the skill and DC, and all players roll — with hidden success text that you reveal after the results.

---

## YouTube

How-to videos, tips and tricks, and feature walkthroughs — **coming soon**.

---

## Compatibility

- **Foundry VTT**: v11 minimum, verified on v13
- **Game System**: Conan: The Hyborian Age (Monolith Edition)
- **NOT compatible** with Modiphius's "Conan: Adventures in an Age Undreamed Of" (2d20 system) — completely different game, completely different mechanics

---

## License

This project is licensed under the [GNU General Public License v3.0](LICENSE).

Blood and Steel is a fan-made system for personal use. Conan and all related properties are trademarks of their respective owners. This project is not affiliated with or endorsed by Monolith Edition or Conan Properties.
