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

Conditions aren't just reminders. Once applied — by the GM, a player, a spell, or an enemy ability — they **enforce themselves** on the character sheet and in chat, so there's minimal tracking for anyone at the table.

- **Unconscious** — Out cold. Physical & Sorcery Defense display as **0/0** (on the sheet field and the GM's hover tooltip). All attack, skill, and spell rolls are blocked with a "cannot act" notice. Death saves still work.
- **Stunned** — Head ringing: **no magic, no Stamina spends, and the token is locked in place.** Attacks and skill checks are still allowed; defenses are unchanged. Applied manually, by the Pict *Stunned* trait (spend 1 SP to shake it off early), or by *Wave of Darkness*; clears at the end of the stunned character's next turn.
- **Bound** — Hands tied: **unarmed attacks only** (weapon, thrown, and ranged attacks are blocked). Sorcery and Stamina still flow freely. The shield's Physical Defense contribution is dropped on the sheet + tooltip while bound — but your gear stays equipped, no re-equipping when it clears.
- **Blinded** — The token's **vision is cut off**, and every attack **auto-misses unless the Flex die saves it**. A blind swing also carries a **25% chance of friendly fire** — the engine rolls a normal attack and flags it for the GM to resolve against a nearby ally. (Blind even overrides Cruel Fate.)
- **Prone** — Knocked down: the prone fighter's own **physical attack damage is halved** when it lands. At the start of their turn the engine reminds them that moving costs 2 actions (stand up = 1 action, then take one more).
- **Poisoned** — Hidden severity (1–3): a fresh per-roll penalty to checks/attacks/casting, a per-round Life Point drain reported in chat, and Stamina spends that fizzle to nothing.
- **Burning** — 1d4 fire damage per round, with a 50/50 chance to extinguish on each tick (up to 3 rounds).

*Being finalized next: Grappled, Bleeding, Frightened.*

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

## YouTube

How-to videos, tips and tricks, and feature walkthroughs — **coming soon**.

---

## Compatibility

- **Foundry VTT**: v11 minimum, verified on v13
- **Game System**: Conan: The Hyborian Age (Monolith Edition)
- **NOT compatible** with Modiphius's "Conan: Adventures in an Age Undreamed Of" (2d20 system) — completely different game, completely different mechanics

---

## Release History

### v0.9.7 — 2026-06-07

**Status effects that enforce themselves, cross-client Stamina sync, and a pile of combat fixes.**

**Self-enforcing status effects (players)**
- Five conditions now apply their own mechanics on the sheet and in chat — minimal tracking for player or GM:
  - **Unconscious** — defenses show 0/0 (sheet + GM tooltip); all attack/skill/spell rolls blocked; death saves still allowed
  - **Stunned** — no magic, no Stamina spends, token locked; attacks/skills still work (covers manual, Pict trait, and Wave of Darkness)
  - **Bound** — unarmed attacks only; sorcery + Stamina still flow; shield's Physical Defense dropped while bound (gear stays equipped)
  - **Blinded** — token vision cut; attacks auto-miss unless Flex saves them, with a 25% friendly-fire chance for the GM to resolve; overrides Cruel Fate
  - **Prone** — the prone fighter's physical attack damage is halved; turn-start reminder that moving costs 2 actions
- Unified condition teardown (`clearConditionEffects`) so manual removal and turn-based expiry always match — early-dismissed timed effects no longer linger
- *Garrote* (Silk Vipers / Bride) decoupled into its own effect; *Wave of Darkness* now runs through the standard stun system

**Stamina-spend (SP boost) now syncs to everyone**
- Spending Stamina to boost a skill, attack, or damage roll now shows the boosted total + breakdown for the **GM and all players**, not just the clicking player (flag-persisted, re-rendered on every client)
- **Fix**: the GM's Smart Mouse used to apply a player's *un-boosted* damage — it now picks up the boosted total
- The chosen spend button **glows** instead of graying out; boosted result boxes get a red outline

**Poison severity randomization (PCs)**
- `checksDown` rolls a fresh hidden 1–3 penalty per check/attack/cast; `lpDrain` rolls a visible 1–3 per round reported in the Venom card; breakdown panels show the actual rolled value
- Every SP-cost spell now consistently fizzles when poisoned (`noStamina`)

**Fighting Styles — Defensive Fighter + Strangler**
- **Defensive Fighter** (Shield + One-Handed): passive +1 AR, **+2 while you haven't moved this round**; a second area-move ends the stance (book hindrance)
- **Strangler** (two fists, no armor): both fists add to damage; a damage Flex triggers **SLAMMED** — a marquee banner on the target + Unconscious until the end of their next turn (−1 AR / −1 PD hindrance)
- **Dual Wielder** weapon-pick mode with a persistent paired-weapon outline; qualification reworked (no skill prereq, shield excluded)
- Stances auto-drop if your loadout no longer qualifies

**New enemies — Risen Dawn**
- The **Risen Dawn** false-Mitra sun-cult group (Acolyte, Dawn Keeper, Sun Brother, High Hierophant) with their own Threat-Engine trait pool + skull tiers, plus bestiary additions

**Enemy card polish**
- Full-card art centering, more readable stat dice, and a fix so every condition icon (e.g. Unconscious) renders at the correct size on enemy cards

**Combat fixes**
- Mounted-attack SP-boost no longer corrupts the card display
- Cruel Fate no longer rides along on a blinded attack

### v0.9.6 — 2026-05-29

**Major release — Workshop redesign, Custom Armor/Shield pipeline, Fighting Styles (Dual Wielder + Ambidextrous), ARMS-tab Armor section overhaul, Howard module spin-out.**

**Fighting Styles — Dual Wielder + Ambidextrous**
- The book's "Fighting Styles" subsystem (last-page Advanced Rules) is now an automated feature. Dual Wielder is fully wired end-to-end; the chassis hosts the remaining five styles (Defensive Fighter, Flexible Fighter, Great-Weapon Fighter, Deadeye Shooter, Phalanx Fighter) for future passes
- **Advanced Skills tier** added to the skill catalog (book convention: `"6+ skills"` prerequisite, auto-sorted to the bottom of the Legendary tier). First entry: **Ambidextrous** (2 XP) — extends Dual Wielder's qualification to allow a One-Handed Heavy + One-Handed Light/Medium combo
- New **STANCE row** appears between ARMS and ARMOR on the character sheet, but only when the character has both a qualifying weapon loadout AND a purchased Advanced Skill that unlocks at least one style. Tile-style icons match the weapon card visual treatment exactly (95×95 frame, dark border, 3D bevel, neutral-cream-at-rest, accent-red-on-hover)
- Click a stance icon → cost dialog (1 SP / 2 Actions / Cancel) with current Stamina shown. Click a stance name → details panel expands with Bonus + Hindrance + Adoption Cost
- Drop the active stance via click + confirm dialog. Locks fighting styles for the rest of combat (book rule). Reset happens automatically on combat end, or manually by clicking the Initiative button
- **Dual Wielder mechanical effects**: -1 AR shown via a rotated red-on-parchment stamp in the bottom-right corner of the AR shield + applied in the damage reduction pipeline. Attack rolls both weapons' damage independently (primary gets stat + bonuses, off-hand is die-only — only one stat counted per the rule). Chat shows two side-by-side damage boxes with parallel breakdowns; shift+click on a target applies the sum
- Flex damage threaded through both paths — Stamina choice posts the standard two-box card; Massive! choice renders two boxes with `roll + maxDie` for each weapon
- Attack + damage chat titles read `{primary} + {offhand} Attack/Damage` with a bronze `⚔ DUAL WIELDER` badge under the header

**ARMS tab — Armor section overhaul**
- The 7-button always-visible armor row (Unarmored / Light / Medium / Heavy / Shield / Custom Armor / Custom Shield) was replaced with **2 display tiles** (current armor + equipped shield)
- New **ARMOR header button** mirrors the existing ARMS pattern
- **ARMOR picker menu overlay** with 5 armor cards (Unarmored / Light / Medium / Heavy / Custom slot) + 3 shield cards (None / Shield / Custom slot). Drag workshop-forged items onto custom slots; right-click clears
- The always-visible description textarea + "Armor Rule" note are gone. Replaced with a **click-to-expand info sub-panel** below the tile grid (click an armor or shield tile name; click outside dismisses)
- 165 lines of dead CSS + 3 dead JS bindings removed in the cleanup

**Workshop — major UI redesign (Albert / GM Tools)**
- All three Workshop sub-tabs (Weapons, Armor, Shields) reworked from inline forms into **compact forging dialogs** that pop up on demand
- Forged item lists are now **tile grids** modeled on the character-sheet armed-weapon pattern (95×95, dark border, themed corner badge — ammo for weapons, AR for armor, +Phys Def for shields)
- Click a tile's name label → inline detail panel expands right after that tile's row showing full stats + EDIT and DELETE buttons. Only one open at a time
- Themed background images per sub-tab (forge interior for Weapons, armory at night for Armor, bronze hall for Shields). New `+ NEW` pills in sub-tab accent colors (hot-iron red / cold-steel blue / aged bronze)
- HTML5 form validation, regex-enforced damage formula (`2d6+3` style), nine specific Range options, integrated Foundry FilePicker rooted at the appropriate folder per item type
- Drag from anywhere on a tile to drop onto a character sheet (image, label, or border — all three work)

**Custom Armor + Custom Shield (Workshop pipeline)**
- New **Workshop → Forged Armors** sub-tab: forge custom armors with name, AR, Min Might, Recovery Penalty flag, free-text Encumbrance / Penalty / Move notes, plus an unlimited Bonuses repeater (each bonus has a target stat or defense and a value)
- New **Workshop → Forged Shields** sub-tab: same flow for shields with Phys Def Bonus, Sorc Def Bonus, Min Might, Min Edge gating, and the same Bonuses repeater (stat-only for shields)
- Character sheet's **Custom Armor slot** and **Custom Shield slot** (now inside the refactored ARMOR menu) accept drag-drops from these Workshop sub-tabs. Equip / unequip swaps stat values cleanly. AR + Phys Def + bonuses cascade through the damage breakdown
- **Custom armor stat bonuses surface in the damage breakdown** — e.g., a "+1 Might Steel Cuirass" shows as a "Custom Armor: +1 Steel Cuirass" line under the Might line so the math is transparent to the player

**Min-Might Encumbrance — now actually enforced**
- Standard armors and shields each have a `Min Might` value from the rulebook. Until this release the value was displayed but never enforced. Now: if the wearer's effective Might is below the threshold, **all stat dice degrade by one tier** (D10→D8→D6→D4→2) and a "ENCUMBERED" indicator appears next to the affected stat blocks. Recovers automatically when armor is removed or Might is raised
- **Soldier's Endurance** skill ignores the encumbrance penalty (and, for Heavy Armor, lets the character treat the armor's stipulations as Medium). The skill's effect text was updated to the canonical rulebook wording

**Howard the Chronicler spun out into its own module**
- Howard's actor type, sheet, and all its dependencies were removed from the system and published as a **standalone Foundry module** at <https://github.com/antoniosantos8520-cyber/Howard-the-Chronicler>. Manifest URL: `https://raw.githubusercontent.com/antoniosantos8520-cyber/Howard-the-Chronicler/main/module.json`
- Existing Howard actors in worlds where the user installs the module continue to work transparently. Worlds without the module need to either install it or delete those actors
- Rationale: Howard is scenario-specific tooling for one campaign module, not a core engine capability. Splitting keeps the system focused on the rule engine

**Enemy / scene polish**
- **Body-level floating tooltips on enemy cards** — hover over an enemy token to see its full enemy card without clicking. Tracks token movement and respects token visibility
- **Color/shape marker prefixes on spawned enemies** — every new enemy token gets a unique colored shape emoji (circle / square / heart / diamond, 32 markers total) prepended to its name (e.g. `🔵 Veteran Guard 💀💀`). Lets players call targets by color at the table. Marker auto-frees when the token is deleted

**Fixes**
- **"Spell Bonus" mislabeling**: bows have flat damage built into their formula (`1d6+1`, `1d8+1`). The breakdown parser was labeling any static formula part as "Spell Bonus" regardless of source — confusing for ranged characters from the Steppes origin (which adds its own separate +1 Ranged Damage). Now labeled **"Weapon Bonus"** for non-spells; spell damage keeps the "Spell Bonus" label. The Origin Bonus line continues to display Steppes' contribution separately so both `+1`s are visible with correct labels
- Various smaller polish items captured in the per-session notes during development

### v0.9.5 — 2026-05-25

**Critical compatibility fix + Area tool overhaul.**

**Critical fix**
- Restored token drops on Foundry v13/v14. v0.9.4 silently broke area-marker drops, enemy drops from Albert, and trait-triggered spawns (Horde Pict, Dedicated Servant Nightmare, Summon Fiend, First Wife Enchantress) due to a removed grid API. All six call sites migrated to `canvas.grid.getSnappedPoint`.

**Enemy cards**
- The new CCG-style portrait card now applies to **all** enemies, not just bestiary entries with threat-engine traits. Custom enemies built via Albert's Summon button and procedurally-summoned creatures (Call Beast, Raise Dead, Summon Fiend, etc.) all use the new layout.

**Albert — Areas tab overhaul**
- Replaced the 26-letter palette with a single drag-icon that auto-assigns the next available letter (fill-gaps ordering — delete B and the next drop refills B)
- Consolidated the three stacked sections into one tight control bar (drag-icon + Lock / Connect / Clear / Reset / Torch buttons)
- **New In/Out/Through line-of-sight model** with editor table — three independent per-area flags fully describe LOS behavior
  - **In**: can the area be seen INTO from outside
  - **Out**: can tokens IN it see/shoot OUT
  - **Through**: can sight/projectiles transit THROUGH it
- LOS check: from X to Y, a path must exist where `X.Out`, `Y.In`, and every intermediate area's `Through` are all true (any valid path counts)
- Enemies in `In:false` areas are hidden from players unless a player enters the area
- Player tokens in `In:false` areas appear dimmed (30% alpha) to other players; GM and the owner always see full alpha
- Reset now fully nukes the scene (deletes marker tokens, drawings, AND flags)
- Lock button now controls new drops (no more "lock then unlock" dance)
- Drop is orphan-aware (no false "Area X is already on this scene" errors when the old token is gone)
- Connect button sweeps orphan area entries before drawing
- Removed legacy 3-state LOS right-click cycle on matrix labels

**Documentation**
- Removed Dread Clock from README feature list — it's scenario-specific tooling for one module, not a core engine capability

### v0.9.4 — 2026-05-24

**Foundry v13 compatibility update + new content.**

- Bumped Foundry compatibility: minimum **v12**, verified **v14**
- Fixed v13 deprecations: `mergeObject` → `foundry.utils.mergeObject` in `tools-sheet.js` and `character-creator-guide.js`
- Added SQUANDER tables for two new origins: **From the North** and **From the Wilds**
- New images: `greg.png` / `greg2.png` mount portraits, `bg_civilized.jpg`, `bg_wilds.jpg`; replaced `bg_streets.jpg` with higher-res version

### v0.9.3 — 2026-04-23

**Black Souls Faction**
- New enemy category with themed card styling (dark serpent green)
- **Black Hearts** group: The Watcher, The Strong Arm, and more
- 5 threat traits: Devoted, Warded, Black Blood, Overwhelmed, Chosen

**Mechanics**
- **Poisoner skill**: Shift+click on damage applies snake-venom poison (1–3 dmg/round, defense decay)
- **Fierce Shots & Fierce Strokes**: Now actually roll 2 dice and take the best (previously display-only)
- **Defensive Fighting**: Auto-expires at the start of the defender's next turn

**Howard the Chronicler**
- New **Theater** scene + Presentation button
- Per-page fight scene picker in GM Notes — link a battle map to a page
- New tales now start on a blank page (not the splash template)

**Fixes**
- `system.json` now declares `documentTypes` — silences the V16 `template.json` deprecation warning

### v0.9.2 — 2026-03-08

- **Silk Vipers** — Harem assassin enemy group: Handmaiden (poisoned blade), Bride (stunning lash, garrote), and Enchantress (Lust blind, Tender Mercy healing). Traits: Lotus Dust, Garrote, First Wife succession, Harmless, Madwoman.
- **Howard Roll Call** — Ad-hoc skill checks from Presentation mode with hidden success text and GM reveal.
- **Dread Clock Threat System** — Adjustable threat threshold with corner buttons (+/−/roll/reset) and d8 threat checks.
- **Comprehensive README** — Full feature documentation covering character creation, all enemy categories, Threat Engine traits, sorcery, combat mechanics, Dread Clock, Howard the Chronicler, and the Area Distance Tool.

### v0.9.1 — 2026-03-07

**Three new enemy sorcerer categories in the Threat Engine**

- **Witch** — Glamour (blind target), Hex (stacking attack curse −1/−2/−3, removed on death), Beastmaster (double summons), Feral Bond (+2 attack/damage on summoned beasts)
- **Necromancer** — Eternal Servant (resurrects all dead skeletons each round), Deathless (killing blow kills a living skeleton instead), Soul Harvest (heal 1d6 LP per skeleton death), Bone Armor (reflect damage equal to living skeleton count)
- **Summoner (Stygian Fire Cult)** — Four-tier portraits: Torch → Pyre → Burning One → Volcanist. Inferno (burning DoT), Damnation (15 dmg hellfire), Volatile (1d8 death explosion), Backdraft (1d4 melee reflect), Eruption (escalating self-destruct up to 2d10 AoE)

**New player condition: Burning**
- Toggle on the character sheet with icon
- Burning ticks 1d4 fire damage per round with a 50/50 chance to extinguish each tick
- Integrates with the Summoner's Inferno ability automatically

**All human enemies complete** — Every human enemy category has been run through the Threat Engine and is ready for drag-and-drop play.

---

## License

This project is licensed under the [GNU General Public License v3.0](LICENSE).

Blood and Steel is a fan-made system for personal use. Conan and all related properties are trademarks of their respective owners. This project is not affiliated with or endorsed by Monolith Edition or Conan Properties.
