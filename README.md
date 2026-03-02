# Blood and Steel

A Foundry VTT system for **Conan: The Hyborian Age** (Monolith Edition).

Built from scratch — not a reskin, not a port. Blood and Steel is a purpose-built engine for Monolith's Conan RPG, with custom character sheets, enemy card dialogs, a GM tools suite, sorcery system, and more.

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

Updates will appear automatically in Foundry when new versions are released.

---

## Getting Started — Character Creation

1. Open the **Actors** tab in the sidebar
2. Click **Create Actor**, name your character, and select the **character2** type
3. Open the character sheet
4. Click the **?** tab — this is the built-in Character Creator tutorial that walks you through the entire process step by step

The tutorial covers origin selection, stat allocation, skill purchasing, equipment, and everything else you need to get a character ready for the Hyborian Age.

---

## Albert — The GM Tools Sheet

Albert is your GM command center. Create an Actor of type **tools** to access it.

### Enemies Tab
Browse, spawn, and manage all enemy types from the Monolith bestiary. Enemies are organized by category (Human, Beast, Undead, Demon, Monstrosity, Inanimate) with themed color schemes for each. Click and drag an enemy to the VTT to spawn their token directly onto the scene.

**Enemy Cards**: Double-click any enemy token on the canvas to open their enemy card dialog — a CCG-style portrait card with stats, abilities, weapons, and real-time HP tracking. This replaces the default Foundry actor sheet for enemies.

### Area Map Maker
Drag A–Z area markers onto your scene and define connections between them in the matrix. Lines are drawn automatically between connected areas. Hovering over a token shows the distance (in areas) and line-of-sight status to every marked area on the map. Supports LOS blockers for areas that block sight lines.

### Travel Master
Plan overland journeys with terrain types, weather, and encounter management. Still a work in progress — functional but rough around the edges.

---

## Combat

### Initiative
Roll initiative from the **character sheet's initiative button**, not from the token or the combat tracker. The system uses its own initiative flow that ties into the character's stats.

### Smart Mouse
**Shift + Right-Click** a target token to instantly apply the last damage and effect you rolled. No dialog, no prompts — just point and punish.

### Winds of Fate
Monolith's Rule of Three fate mechanic, built into the GM tools sheet. Apply bonuses to the whole board or to individual players to tip the scales when the story demands it.

---

## Sorcery

Spells are cast directly from the character sheet's **Spells tab**. Click the spell icon to quick-cast, or click the spell border to expand and see full details.

### Casting Flow
1. Click a spell to cast — the system rolls against your stat and applies the LP/SP cost automatically
2. A floating red number appears over your token showing the life force spent
3. The Flex Die offers three choices: **Stamina recovery**, **Cast!/Massive!** (enhanced effect), or **Regain Cost** (refund the LP/SP you just spent)

### Spell Effects
Spells that deal damage follow the same damage pipeline as weapons — roll damage, apply to target with Smart Mouse. Buff and debuff spells apply their effects automatically where possible. Attack spells that hit enemies show up as active effects on the enemy card.

---

## Threat Engine

When guards are spawned from Albert's enemy tab, the Threat Engine kicks in. It procedurally generates difficulty by assigning skull tiers (0–3 skulls) and random combat traits to each guard, creating 78 unique possible builds from a single enemy template.

- Skulls are baked into the token nameplate so all players can see the relative danger
- 1,2,3 skull icons and trait badges appear on the GM's enemy card
- Traits modify stats, add abilities, and change how the enemy fights
- Every encounter feels different even when using the same enemy types

---

## YouTube

How-to videos, tips and tricks, and feature walkthroughs — **coming soon**.

---

## Compatibility

- **Foundry VTT**: v11 minimum, verified on v13
- **Game System**: Conan: The Hyborian Age (Monolith Edition)
- **NOT compatible** with Modiphius's "Conan: Adventures in an Age Undreamed Of" (2d20 system) — completely different game

---

## License

This project is licensed under the [GNU General Public License v3.0](LICENSE).

Blood and Steel is a fan-made system for personal use. Conan and all related properties are trademarks of their respective owners. This project is not affiliated with or endorsed by Monolith Edition or Conan Properties.
