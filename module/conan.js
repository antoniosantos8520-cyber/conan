import ConanActorSheet2 from "../sheet2/actor-sheet2.js";
import ConanNPCSheet2 from "./npc-sheet2.js";
import ConanToolsSheet from "./tools-sheet.js";
import HowardSheet from "./howard-sheet.js";
import { dreadClock } from "../scripts/dread-clock.js";

// Handlebars helpers (previously in legacy actor-sheet.js / npc-sheet.js)
Handlebars.registerHelper('select', function(selected, options) {
  return options.fn(this)
    .split('\n')
    .map(function(line) {
      const value = line.match(/value="([^"]*)"/);
      if (value && value[1] === selected) {
        return line.replace('>', ' selected>');
      }
      return line;
    })
    .join('\n');
});
Handlebars.registerHelper('eq', function(a, b) {
  return a === b;
});

// Suppress Foundry's annoying window size warning (must be done early)
const originalConsoleWarn = console.warn.bind(console);
console.warn = function(...args) {
  const msg = args[0];
  if (typeof msg === 'string' && (msg.includes('window dimensions') || msg.includes('zoom factor'))) {
    return; // Suppress window size warnings
  }
  return originalConsoleWarn(...args);
};

Hooks.once('init', async function() {
  console.log('Conan | Initializing Conan RPG System');

  // Also suppress via ui.notifications when it becomes available
  Hooks.once('ready', () => {
    const originalNotifyWarn = ui.notifications.warn.bind(ui.notifications);
    ui.notifications.warn = function(message, options) {
      if (typeof message === 'string' && (message.includes('window dimensions') || message.includes('zoom factor'))) {
        return;
      }
      return originalNotifyWarn(message, options);
    };
  });

  // Define custom config
  CONFIG.CONAN = {
    diceTypes: ['d4', 'd6', 'd8', 'd10', 'd12']
  };

  // Register settings for persistent enemy custom images
  game.settings.register('conan', 'enemyCustomImages', {
    name: 'Enemy Custom Images',
    hint: 'Stores custom portrait and token images for enemies',
    scope: 'world',
    config: false, // Hidden from settings UI
    type: Object,
    default: {}
  });

  // Register settings for enemy group backgrounds
  game.settings.register('conan', 'enemyGroupBackgrounds', {
    name: 'Enemy Group Backgrounds',
    hint: 'Stores background images for enemy groups',
    scope: 'world',
    config: false, // Hidden from settings UI
    type: Object,
    default: {}
  });

  // Register settings for flex celebrations (world-level storage)
  game.settings.register('conan', 'flexCelebrations', {
    name: 'Flex Celebrations',
    hint: 'Stores flex celebration configuration for players',
    scope: 'world',
    config: false, // Hidden from settings UI
    type: Object,
    default: {
      enabled: true,
      players: [],
      celebrations: {}
    }
  });

  // Register settings for custom enemies (world-level storage)
  game.settings.register('conan', 'customEnemies', {
    name: 'Custom Enemies',
    hint: 'Stores GM-created custom enemies',
    scope: 'world',
    config: false, // Hidden from settings UI
    type: Array,
    default: []
  });

  // Register Winds of Fate settings (universal roll modifiers)
  game.settings.register('conan', 'windsOfFatePlayers', {
    name: 'Winds of Fate (Players)',
    hint: 'Modifier applied to player attack rolls, skill checks, and death saves (-5 to +5)',
    scope: 'world',
    config: false,
    type: Number,
    default: 0
  });

  game.settings.register('conan', 'windsOfFateEnemies', {
    name: 'Winds of Fate (Enemies)',
    hint: 'Modifier applied to enemy/NPC attack rolls, skill checks, and death saves (-5 to +5)',
    scope: 'world',
    config: false,
    type: Number,
    default: 0
  });

  // Register Dread Clock hour (0-11, sundown to dawn)
  game.settings.register('conan', 'dreadClockHour', {
    name: 'Dread Clock Hour',
    scope: 'world',
    config: false,
    type: Number,
    default: 0
  });

  // Register settings for saved travel journeys
  game.settings.register('conan', 'savedJourneys', {
    name: 'Saved Journeys',
    hint: 'Stores saved travel journeys for the Travel Master',
    scope: 'world',
    config: false,
    type: Object,
    default: {}
  });

  // Override isVisible for per-player area visibility during torch/LOS system
  // GM sees everything. Players only see enemies in their area or torch-lit adjacent areas.
  const _origIsVisible = Object.getOwnPropertyDescriptor(
    Object.getPrototypeOf(Token.prototype), 'isVisible'
  ) || Object.getOwnPropertyDescriptor(Token.prototype, 'isVisible');
  if (_origIsVisible?.get) {
    Object.defineProperty(Token.prototype, 'isVisible', {
      get() {
        const base = _origIsVisible.get.call(this);
        if (game.user.isGM) return base; // GM sees everything
        if (!base) return false; // Already invisible (e.g. hidden by GM manually)
        // Only filter enemy tokens
        const enemyData = this.document?.flags?.conan?.enemyData;
        if (!enemyData) return base;
        // Get local player's visible areas
        const vis = _getLocalPlayerVisibility();
        if (!vis.visibleAreas) return base; // No areas set up — default behavior
        const areaData = canvas.scene?.getFlag('conan', 'areaData');
        if (!areaData?.areas) return base;
        const losBlockers = areaData.losBlockers || [];
        const blockerSet = new Set(losBlockers);
        // Find which area this enemy is in
        const enemyArea = _getAreaAtPoint(
          this.document.x + ((this.document.width || 1) * canvas.grid.size / 2),
          this.document.y + ((this.document.height || 1) * canvas.grid.size / 2),
          areaData.areas
        );
        if (vis.lightsOut) {
          // Lights out: enemy visible only if in a visible area
          if (!enemyArea) return false; // not in any area during lights out = hidden
          return vis.visibleAreas.has(enemyArea);
        } else {
          // Lights on: enemy visible unless in LOS-blocked area without player present
          if (!enemyArea) return true;
          if (blockerSet.has(enemyArea)) return vis.playerAreas.has(enemyArea);
          return true;
        }
      },
      configurable: true
    });
  }

  // Override token bar drawing for custom health gradient
  // Shows full red->orange->yellow->green spectrum; bar shrinks from right revealing danger zone
  const originalDrawBar = Token.prototype._drawBar;
  Token.prototype._drawBar = function(number, bar, data) {
    // Only customize bar1 (health bar)
    if (number !== 0) {
      return originalDrawBar.call(this, number, bar, data);
    }

    const val = Number(data.value);
    const max = Math.max(data.max, 1);
    const pct = Math.clamp(val, 0, max) / max;

    // Bar dimensions
    const h = Math.max(canvas.dimensions.size / 12, 8);
    const w = this.w;
    const stroke = Math.clamp(h / 8, 1, 2);
    const innerW = w - stroke * 2;
    const innerH = h - stroke * 2;
    const fillW = innerW * pct;

    bar.clear();

    // Add danger glow when health is below 50%
    if (pct < 0.5 && pct > 0) {
      // Glow intensity increases as health decreases (0.5 -> 0 = 0 -> 1 intensity)
      const glowIntensity = 1 - (pct / 0.5);
      // Glow color shifts from orange to red as health drops
      const glowColor = pct < 0.25 ? 0xff2020 : 0xff6600;

      // Draw multiple expanding glow layers
      const glowLayers = 4;
      for (let g = glowLayers; g > 0; g--) {
        const expand = g * 2;
        const alpha = glowIntensity * 0.15 * (1 - g / (glowLayers + 1));
        bar.beginFill(glowColor, alpha);
        bar.drawRoundedRect(-expand, -expand, w + expand * 2, h + expand * 2, 3 + expand);
        bar.endFill();
      }
    }

    // Draw background (dark, for empty portion)
    bar.beginFill(0x000000, 0.6);
    bar.drawRoundedRect(0, 0, w, h, 3);
    bar.endFill();

    // Draw the gradient-filled portion using thin vertical slices
    // Gradient goes: Red (left/danger) -> Orange -> Yellow -> Green (right/healthy)
    if (pct > 0) {
      const slices = Math.max(Math.floor(fillW), 1);
      const sliceWidth = fillW / slices;

      for (let i = 0; i < slices; i++) {
        // Calculate position within the FULL bar (0 to 1)
        const slicePct = (i + 0.5) / slices * pct;
        const color = getGradientColorAt(slicePct);

        bar.beginFill(color, 1.0);
        bar.drawRect(stroke + i * sliceWidth, stroke, sliceWidth + 0.5, innerH);
        bar.endFill();
      }
    }

    // Draw border
    bar.lineStyle(stroke, 0x000000, 1.0);
    bar.drawRoundedRect(0, 0, w, h, 3);

    // Position the bar at bottom of token
    bar.position.set(0, this.h - h);

    return true;
  };

  // Force token bars to redraw when actor lifePoints change
  // This fixes the issue where typing directly in token HUD doesn't trigger bar redraw
  Hooks.on('updateActor', (actor, changes, options, userId) => {
    if (changes.system?.lifePoints) {
      const tokens = actor.getActiveTokens();
      for (const token of tokens) {
        // Redraw token bar
        if (token.bars) {
          token.drawBars();
        }
        // DUAL LP SYNC: When lifePoints.value changes (e.g. token HUD), sync to currentHP flag
        // so the enemy card dialog stays in sync with the token bar
        // GM-only: players don't have permission to write flags on enemy tokens
        if (game.user.isGM) {
          const enemyData = token.document.getFlag('conan', 'enemyData');
          if (enemyData) {
            const newLP = actor.system.lifePoints?.value;
            const currentFlag = token.document.getFlag('conan', 'currentHP');
            if (newLP !== undefined && newLP !== currentFlag) {
              console.log(`%c[LP SYNC] %c${token.name}%c — actor.lifePoints.value (${currentFlag}) → (${newLP}), syncing to currentHP flag`, 'color: #ff69b4; font-weight: bold;', 'color: #fff; font-weight: bold;', 'color: #ff69b4;');
              token.document.setFlag('conan', 'currentHP', newLP);
            }
          }
        }
      }
    }
  });

  /**
   * Get gradient color at a specific position (0-1)
   * 0 = Red (danger), 0.33 = Orange, 0.66 = Yellow, 1 = Green (healthy)
   */
  function getGradientColorAt(pct) {
    // Color stops across the bar: red -> orange -> yellow -> green
    const colors = [
      { pct: 0.00, r: 180, g: 20, b: 20 },    // Red (danger)
      { pct: 0.33, r: 230, g: 120, b: 20 },   // Orange
      { pct: 0.66, r: 230, g: 210, b: 40 },   // Yellow
      { pct: 1.00, r: 40, g: 180, b: 40 }     // Green (healthy)
    ];

    // Find the two color stops we're between
    let lower = colors[0];
    let upper = colors[colors.length - 1];

    for (let i = 0; i < colors.length - 1; i++) {
      if (pct >= colors[i].pct && pct <= colors[i + 1].pct) {
        lower = colors[i];
        upper = colors[i + 1];
        break;
      }
    }

    // Interpolate between the two colors
    const range = upper.pct - lower.pct;
    const rangePct = range === 0 ? 0 : (pct - lower.pct) / range;

    const r = Math.round(lower.r + (upper.r - lower.r) * rangePct);
    const g = Math.round(lower.g + (upper.g - lower.g) * rangePct);
    const b = Math.round(lower.b + (upper.b - lower.b) * rangePct);

    return (r << 16) | (g << 8) | b;
  }

  // Register sheet application classes
  Actors.unregisterSheet("core", ActorSheet);
  
  // Register Character 2 sheet (new tabbed version)
  Actors.registerSheet("conan", ConanActorSheet2, {
    types: ["character2"],
    makeDefault: true,
    label: "CONAN.SheetLabels.Character2"
  });
  
  // Register NPC 2 sheet (new version with conditions support)
  Actors.registerSheet("conan", ConanNPCSheet2, {
    types: ["npc2"],
    makeDefault: true,
    label: "CONAN.SheetLabels.NPC2"
  });

  // Register GM Tools sheet
  Actors.registerSheet("conan", ConanToolsSheet, {
    types: ["tools"],
    makeDefault: true,
    label: "CONAN.SheetLabels.Tools"
  });

  // Register Howard the Chronicler sheet
  Actors.registerSheet("conan", HowardSheet, {
    types: ["howard"],
    makeDefault: true,
    label: "CONAN.SheetLabels.Howard"
  });

  // Install shift+click damage handler early, before canvas creates tokens
  // (Must be in init, not ready — Foundry's MouseInteractionManager captures
  // callback references when tokens are drawn, which happens before ready)
  setupDamageApplicationHandler();

  // Preload Handlebars templates
  return preloadHandlebarsTemplates();
});

// Prevent creation of howard actors via normal means (auto-create only)
// Also set default image and name for tools actors
Hooks.on('preCreateActor', (actor, data, options, userId) => {
  // Block manual creation of npc2 (Enemy Card) — only spawned via GM Tools
  if (actor.type === 'npc2' && !options.conanEnemySpawn) {
    ui.notifications.warn('Enemy Cards are created automatically when dragging enemies from GM Tools.');
    return false;
  }

  // Block manual creation of howard type (it's auto-created)
  if (actor.type === 'howard' && !options.conanAutoCreate) {
    const existingHoward = game.actors.find(a => a.type === 'howard');
    if (existingHoward) {
      ui.notifications.warn('Howard the Chronicler already exists. There can be only one!');
      return false;
    }
  }

  if (actor.type === 'tools') {
    const updates = {};

    // Set default name if it's the generic "New Actor"
    if (!data.name || data.name === 'New Actor') {
      updates.name = 'GM Tools';
    }

    // Set default image if it's the mystery man
    if (!data.img || data.img === 'icons/svg/mystery-man.svg') {
      updates.img = 'systems/conan/images/gm_helper.png';
    }

    // Set default token image
    if (!data.prototypeToken?.texture?.src) {
      updates['prototypeToken.texture.src'] = 'systems/conan/images/gm_helper.png';
      updates['prototypeToken.name'] = updates.name || data.name || 'GM Tools';
    }

    if (Object.keys(updates).length > 0) {
      actor.updateSource(updates);
    }
  }
});

// Prevent deletion of Howard the Chronicler
Hooks.on('preDeleteActor', (actor, options, userId) => {
  if (actor.type === 'howard') {
    ui.notifications.error('Howard the Chronicler cannot be deleted. He is eternal.');
    return false;
  }
});

// Hide 'howard' from the create actor type dropdown
Hooks.on('renderDialog', (dialog, html, data) => {
  // Check if this is the create actor dialog
  if (dialog.data?.title === 'Create New Actor' || dialog.title === 'Create New Actor') {
    const select = html.find('select[name="type"]');
    if (select.length) {
      select.find('option[value="howard"]').remove();
    }
  }
});

// Demonic Vessel: re-render character sheets when unnatural tokens appear/disappear
const DEMONIC_VESSEL_GROUPS = new Set([
  'vampires', 'ghouls', 'deep-dwellers', 'black-ones'
]);
function _isUnnaturalToken(tokenDoc) {
  const ed = tokenDoc.getFlag('conan', 'enemyData');
  if (ed?.category === 'demons') return true;
  if (ed?.group && DEMONIC_VESSEL_GROUPS.has(ed.group)) return true;
  // Player character with Blood of a Demon origin
  if (tokenDoc.actor?.type === 'character2' && tokenDoc.actor.system?.origin?.id === 'from-the-blood-of-a-demon') return true;
  return false;
}
function _actorHasDemonicMagic(actor) {
  const origin = actor.system?.origin?.id;
  if (!origin) return false;
  if (origin === 'from-the-blood-of-a-demon' || origin === 'from-the-blood-of-acheron') return true;
  if (origin === 'from-parts-unknown') return (actor.system.sorcery?.selectedDisciplines || []).includes('demonicMagic');
  return false;
}
function _actorHasNecromanticMagic(actor) {
  const origin = actor.system?.origin?.id;
  if (!origin) return false;
  if (origin === 'from-the-blood-of-acheron') return true;
  if (origin === 'from-parts-unknown') return (actor.system.sorcery?.selectedDisciplines || []).includes('necromanticMagic');
  return false;
}
function _rerenderDemonicVesselSheets(sceneId) {
  if (!canvas?.scene || canvas.scene.id !== sceneId) return;
  for (const token of canvas.scene.tokens) {
    if (!token.actor || token.actor.type !== 'character2') continue;
    if (_actorHasDemonicMagic(token.actor) && token.actor.sheet?.rendered) {
      token.actor.sheet.render(false);
    }
  }
}

function _getUnnaturalLabel(tokenDoc) {
  const ed = tokenDoc.getFlag('conan', 'enemyData');
  if (ed?.category === 'demons') return 'something demonic';
  const labels = {
    'vampires': 'the undead', 'ghouls': 'something that feeds on the dead',
    'deep-dwellers': 'something from the deep', 'black-ones': 'an ancient darkness'
  };
  if (ed?.group && labels[ed.group]) return labels[ed.group];
  if (tokenDoc.actor?.type === 'character2' && tokenDoc.actor.system?.origin?.id === 'from-the-blood-of-a-demon') return 'tainted blood';
  return 'something unnatural';
}

// updateToken fires when enemyData flag is set (after token creation)
Hooks.on('updateToken', (tokenDoc, changes, options, userId) => {
  // Only react when enemyData flag is being set
  if (!changes?.flags?.conan?.enemyData) return;
  if (!_isUnnaturalToken(tokenDoc) || !tokenDoc.parent) return;

  _rerenderDemonicVesselSheets(tokenDoc.parent.id);

  // Post sinister chat whisper to characters with Demonic Vessel
  // GM-only: prevent duplicate messages from every player client
  if (!game.user.isGM) return;
  if (!canvas?.scene || canvas.scene.id !== tokenDoc.parent.id) return;
  const hint = _getUnnaturalLabel(tokenDoc);
  for (const token of canvas.scene.tokens) {
    if (!token.actor || token.actor.type !== 'character2') continue;
    if (!_actorHasDemonicMagic(token.actor)) continue;
    const portrait = token.actor.prototypeToken?.texture?.src || token.actor.img || 'icons/svg/mystery-man.svg';
    // Whisper to the player who owns this character
    const ownerIds = Object.entries(token.actor.ownership)
      .filter(([id, level]) => id !== 'default' && level >= CONST.DOCUMENT_OWNERSHIP_LEVELS.OWNER)
      .map(([id]) => id);
    ChatMessage.create({
      speaker: ChatMessage.getSpeaker({ actor: token.actor }),
      content: `<div class="spell-chat-card" style="border-color: #C43C3C;">
        <div class="spell-chat-header">
          <div class="spell-chat-portrait-wrap">
            <img src="${portrait}" class="spell-chat-portrait"/>
            <img src="systems/conan/images/icons/demonic_vessel_icon.png" class="spell-chat-badge" alt="Demonic Vessel"/>
          </div>
          <div class="spell-chat-title">
            <span class="spell-chat-name">Demonic Vessel</span>
            <span class="spell-chat-type">Demonic Magic</span>
          </div>
        </div>
        <div class="spell-chat-body">
          <div class="spell-chat-effect"><em>The air thickens. ${token.actor.name}'s skin prickles with a familiar dread — ${hint} draws near.</em></div>
        </div>
      </div>`,
      whisper: ownerIds.length > 0 ? ownerIds : [game.user.id]
    });
  }
});

Hooks.on('deleteToken', (tokenDoc, options, userId) => {
  if (_isUnnaturalToken(tokenDoc) && tokenDoc.parent) {
    setTimeout(() => _rerenderDemonicVesselSheets(tokenDoc.parent.id), 100);
  }
});

// Listen for chat messages that trigger cross-client events
Hooks.on('createChatMessage', (message, options, userId) => {
  // Flex celebration
  const flexData = message.getFlag('conan', 'flexCelebration');
  if (flexData) {
    const celebData = message.getFlag('conan', 'celebData');
    if (celebData) {
      Hooks.call('conanFlexTriggered', message.getFlag('conan', 'actorId'), message.getFlag('conan', 'rollType'), celebData);
    }
  }

  // Counter Ward — detect enemy spell casts and alert players who have the spell
  const enemySpell = message.getFlag('conan', 'enemySpellCast');
  if (enemySpell) {
    // Find player-owned characters with Counter Ward learned (system.sorcery.invokedSpells['counter-ward'])
    const warders = game.actors.filter(a =>
      a.type === 'character2' && a.hasPlayerOwner && a.system.sorcery?.invokedSpells?.['counter-ward']
    );
    if (warders.length > 0) {
      game.conan = game.conan || {};
      game.conan.counterWardAlert = {
        messageId: message.id,
        enemyName: enemySpell.enemyName,
        abilityName: enemySpell.abilityName,
        tokenId: enemySpell.tokenId,
        enemyWits: enemySpell.enemyWits,
        enemyWitsDie: enemySpell.enemyWitsDie,
        warderIds: warders.map(a => a.id)
      };

      // Token burst — icon explodes outward from the warder's token
      for (const warderId of warders.map(a => a.id)) {
        const tok = canvas.tokens?.placeables?.find(t => t.actor?.id === warderId);
        if (!tok) continue;
        const wt = canvas.stage.worldTransform;
        const cx = tok.x + canvas.grid.size / 2;
        const cy = tok.y + canvas.grid.size / 2;
        const sx = wt.a * cx + wt.c * cy + wt.tx;
        const sy = wt.b * cx + wt.d * cy + wt.ty;
        const burst = document.createElement('div');
        burst.classList.add('counter-ward-token-burst');
        burst.style.left = sx + 'px';
        burst.style.top = sy + 'px';
        burst.innerHTML = `<img src="systems/conan/images/icons/counter_ward_icon.png">`;
        document.body.appendChild(burst);
        setTimeout(() => burst.remove(), 1200);
      }

      // Add glow to counter-ward icons on any open sheet + attach click handler
      const alertEls = [
        ...document.querySelectorAll('.sheet2-spellCardImg[data-spell-id="counter-ward"]'),
        ...document.querySelectorAll('.counter-ward-trigger'),
        ...Array.from(document.querySelectorAll('.sheet2-badgeItem.spell-badge')).filter(el => el.title?.startsWith('Counter Ward'))
      ];
      alertEls.forEach(el => {
        el.classList.remove('usable');
        el.classList.add('counter-ward-alert');
        el.addEventListener('click', () => game.conan?.triggerCounterWard?.(), { once: true });
      });
    }
  }

  // Camera pan (travel master)
  const cameraPan = message.getFlag('conan', 'cameraPan');
  if (cameraPan) {
    const x = message.getFlag('conan', 'x');
    const y = message.getFlag('conan', 'y');
    const scale = message.getFlag('conan', 'scale');
    const duration = message.getFlag('conan', 'duration') || 1000;

    // Only pan for non-GM users (GM already panned locally)
    if (!game.user.isGM && canvas?.ready) {
      canvas.animatePan({ x, y, scale, duration });
    }
  }

  // Leader of Men - Apply buff to targets
  const leaderApply = message.getFlag('conan', 'leaderOfMenApply');
  if (leaderApply) {
    const leaderId = message.getFlag('conan', 'leaderId');
    const leaderName = message.getFlag('conan', 'leaderName');
    const targetIds = message.getFlag('conan', 'targetIds') || [];

    // Only the GM applies the buff to avoid race conditions
    if (game.user.isGM) {
      for (const targetId of targetIds) {
        const targetActor = game.actors.get(targetId);
        if (targetActor) {
          // Remove buff from old leader if different
          const existingBuff = targetActor.system.leaderOfMenBuff;
          if (existingBuff && existingBuff.leaderId !== leaderId) {
            // Remove this target from old leader's target list
            const oldLeader = game.actors.get(existingBuff.leaderId);
            if (oldLeader) {
              const oldTargets = oldLeader.system.leaderOfMenTargets || [];
              const newTargets = oldTargets.filter(id => id !== targetId);
              oldLeader.update({ 'system.leaderOfMenTargets': newTargets });
            }
          }

          // Apply new buff
          targetActor.update({
            'system.leaderOfMenBuff': {
              leaderId: leaderId,
              leaderName: leaderName,
              bonus: 1
            }
          });
        }
      }
    }
  }

  // Leader of Men - Remove buff from targets
  const leaderRemove = message.getFlag('conan', 'leaderOfMenRemove');
  if (leaderRemove) {
    const leaderId = message.getFlag('conan', 'leaderId');
    const targetIds = message.getFlag('conan', 'targetIds') || [];

    // Only the GM removes the buff to avoid race conditions
    if (game.user.isGM) {
      for (const targetId of targetIds) {
        const targetActor = game.actors.get(targetId);
        if (targetActor) {
          // Only remove if this leader applied the buff
          const existingBuff = targetActor.system.leaderOfMenBuff;
          if (existingBuff && existingBuff.leaderId === leaderId) {
            targetActor.update({
              'system.leaderOfMenBuff': null
            });
          }
        }
      }
    }
  }

  // Bane Weapon - Apply buff to target
  const baneWeaponApply = message.getFlag('conan', 'baneWeaponApply');
  if (baneWeaponApply) {
    const casterId = message.getFlag('conan', 'casterId');
    const casterName = message.getFlag('conan', 'casterName');
    const targetId = message.getFlag('conan', 'targetId');
    const damageDie = message.getFlag('conan', 'damageDie');
    const lpCost = message.getFlag('conan', 'lpCost');

    // Only the GM applies the buff to avoid race conditions
    if (game.user.isGM) {
      const targetActor = game.actors.get(targetId);
      const casterActor = game.actors.get(casterId);

      if (targetActor) {
        // Remove existing buff from old caster if different
        const existingBuff = targetActor.system.baneWeaponBuff;
        if (existingBuff && existingBuff.casterId !== casterId) {
          const oldCaster = game.actors.get(existingBuff.casterId);
          if (oldCaster) {
            oldCaster.update({ 'system.baneWeaponCaster': null });
          }
        }

        // Apply buff to target
        targetActor.update({
          'system.baneWeaponBuff': {
            casterId: casterId,
            casterName: casterName,
            damageDie: damageDie
          },
          'system.buffsDebuffs.baneWeapon': true
        });
      }

      // Update caster's tracking data
      if (casterActor) {
        casterActor.update({
          'system.baneWeaponCaster': {
            targetId: targetId,
            targetName: targetActor?.name || 'Unknown',
            damageDie: damageDie,
            lpCost: lpCost
          }
        });
      }
    }
  }

  // Bane Weapon - Remove buff from target
  const baneWeaponRemove = message.getFlag('conan', 'baneWeaponRemove');
  if (baneWeaponRemove) {
    const casterId = message.getFlag('conan', 'casterId');
    const targetId = message.getFlag('conan', 'targetId');

    // Only the GM removes the buff to avoid race conditions
    if (game.user.isGM) {
      const targetActor = game.actors.get(targetId);
      const casterActor = game.actors.get(casterId);

      if (targetActor) {
        // Only remove if this caster applied the buff
        const existingBuff = targetActor.system.baneWeaponBuff;
        if (existingBuff && existingBuff.casterId === casterId) {
          targetActor.update({
            'system.baneWeaponBuff': null,
            'system.buffsDebuffs.baneWeapon': false
          });
        }
      }

      // Clear caster's tracking data
      if (casterActor) {
        const casterData = casterActor.system.baneWeaponCaster;
        if (casterData && casterData.targetId === targetId) {
          casterActor.update({
            'system.baneWeaponCaster': null
          });
        }
      }
    }
  }

  // Favor of the Four Winds - Apply movement buff to target
  const favorWindsApply = message.getFlag('conan', 'favorFourWindsApply');
  if (favorWindsApply) {
    const casterId = message.getFlag('conan', 'casterId');
    const casterName = message.getFlag('conan', 'casterName');
    const targetId = message.getFlag('conan', 'targetId');

    if (game.user.isGM) {
      const targetActor = game.actors.get(targetId);
      if (targetActor) {
        targetActor.update({
          'system.favorFourWindsBuff': {
            casterId: casterId,
            casterName: casterName
          }
        });
      }
    }
  }

  // Healing spell — GM applies LP update + poison cure to target
  const healingApply = message.getFlag('conan', 'healingApply');
  if (healingApply && game.user.isGM) {
    const hTargetId = message.getFlag('conan', 'targetId');
    const healAmount = message.getFlag('conan', 'healAmount');
    const checkPoison = message.getFlag('conan', 'checkPoison');
    const hTargetActor = game.actors.get(hTargetId);

    if (hTargetActor) {
      const tLP = hTargetActor.system?.lifePoints;
      const tHasValue = typeof tLP === 'object' && tLP !== null;
      const tCurrentLP = tHasValue ? (tLP.value || 0) : (tLP || 0);
      const tMaxLP = tHasValue ? (tLP.max || tCurrentLP) : tCurrentLP;
      const tNewLP = Math.min(tMaxLP, tCurrentLP + healAmount);
      const tActualHeal = tNewLP - tCurrentLP;

      const lpUpdate = tHasValue
        ? { 'system.lifePoints.value': tNewLP }
        : { 'system.lifePoints': tNewLP };

      hTargetActor.update(lpUpdate).then(() => {
        // Cure poison after LP update completes
        if (checkPoison) {
          hTargetActor.unsetFlag('conan', 'poisonEffects').then(() => {
            hTargetActor.update({ 'system.conditions.poisoned': false });
          });
        }
        // Floating green heal number on target token (local + broadcast to all clients)
        const healToken = canvas.tokens?.placeables?.find(t => t.actor?.id === hTargetId);
        if (healToken && typeof window.showFloatingDamage === 'function') {
          broadcastFloatingDamage(healToken.id, -tActualHeal, false, false, true);
        }
      });
    }
  }

  // Inspire spell — GM applies +1 SP and inspireSpellActive buff to target
  const inspireApply = message.getFlag('conan', 'inspireSpellApply');
  if (inspireApply && game.user.isGM) {
    const iTargetId = message.getFlag('conan', 'targetId');
    const iTargetActor = game.actors.get(iTargetId);
    if (iTargetActor) {
      const iTargetSP = iTargetActor.system.stamina || 0;
      iTargetActor.update({
        'system.inspireSpellActive': 'active',
        'system.stamina': iTargetSP + 1
      });
    }
  }

  // Howard — Show to Players
  if (message.getFlag('conan', 'howardShow')) {
    if (!game.user.isGM) {
      const taleId = message.getFlag('conan', 'taleId');
      const pageIndex = message.getFlag('conan', 'pageIndex') ?? 0;
      HowardSheet.handleShowBroadcast(taleId, pageIndex);
    }
  }

  // Howard — Panel/text block reveal/hide on player screens
  if (message.getFlag('conan', 'howardReveal')) {
    if (!game.user.isGM) {
      const action = message.getFlag('conan', 'action');
      const key = message.getFlag('conan', 'key');
      const pageId = message.getFlag('conan', 'pageId');
      HowardSheet.handleRevealBroadcast(action, key, pageId);
    }
  }

  // Howard — Presentation mode reveal/hide on player screens
  if (message.getFlag('conan', 'howardPresReveal')) {
    if (!game.user.isGM) {
      const action = message.getFlag('conan', 'action');
      const elId = message.getFlag('conan', 'elId');
      const taleId = message.getFlag('conan', 'taleId');
      const pageIndex = message.getFlag('conan', 'pageIndex');
      HowardSheet.handlePresRevealBroadcast(action, elId, taleId, pageIndex);
    }
  }

  // Howard — Presentation mode zoom on player screens
  if (message.getFlag('conan', 'howardPresZoom')) {
    if (!game.user.isGM) {
      const taleId = message.getFlag('conan', 'taleId');
      const pageIndex = message.getFlag('conan', 'pageIndex');
      const elId = message.getFlag('conan', 'elId');
      HowardSheet.handlePresZoomBroadcast(taleId, pageIndex, elId);
    }
  }

  // Howard — Page visibility changed, re-render player view
  if (message.getFlag('conan', 'howardPageVisibility')) {
    if (!game.user.isGM) {
      const howard = game.actors.find(a => a.type === 'howard');
      if (howard?.sheet?.rendered) {
        howard.sheet.render(false);
      }
    }
  }

  // Howard — Dismiss on all player screens
  if (message.getFlag('conan', 'howardDismiss')) {
    if (!game.user.isGM) {
      HowardSheet.handleDismissBroadcast();
    }
  }

  // Poison — Apply effects to player character via invisible message
  if (message.getFlag('conan', 'poisonApply')) {
    const actorId = message.getFlag('conan', 'actorId');
    const effects = message.getFlag('conan', 'effects');
    if (game.user.isGM && actorId && effects) {
      const actor = game.actors.get(actorId);
      if (actor) {
        // Merge new effects with existing (stacking — never reset)
        const existing = actor.getFlag('conan', 'poisonEffects') || { active: false, effects: {} };
        const mergedEffects = { ...existing.effects };
        for (const [key, val] of Object.entries(effects)) {
          if (val) mergedEffects[key] = true;
        }
        actor.setFlag('conan', 'poisonEffects', {
          active: true,
          source: message.getFlag('conan', 'source') || 'Poison',
          effects: mergedEffects
        });
        actor.update({ 'system.conditions.poisoned': true });
      }
    }
  }

  // Poison — Clear effects on recovery
  if (message.getFlag('conan', 'poisonClear')) {
    const actorId = message.getFlag('conan', 'actorId');
    if (game.user.isGM && actorId) {
      const actor = game.actors.get(actorId);
      if (actor) {
        actor.unsetFlag('conan', 'poisonEffects');
        actor.update({ 'system.conditions.poisoned': false });
      }
    }
  }

  // GM manual poison toggle — triggers severity roll + secret effects
  if (message.getFlag('conan', 'poisonGMApply')) {
    const actorId = message.getFlag('conan', 'actorId');
    if (game.user.isGM && actorId) {
      const actor = game.actors.get(actorId);
      if (actor) {
        applyPoisonToCharacter(actor, 'Poison', 'icons/svg/poison.svg', { ruleName: 'Poison' });
      }
    }
  }

});

Hooks.once('ready', async function() {
  console.log('Conan | System Ready');

  // Initialize game.conan namespace for system-wide data
  game.conan = game.conan || {};
  game.conan.lastDamageRoll = null; // Stores the last damage roll value for quick-apply
  game.conan.lastDamageEffect = null; // Stores spell effect metadata (e.g., Tide of Stone debuff) for shift+click application
  game.conan.lastEnemyAttack = null; // Stores enemy attack metadata for poison detection
  game.conan.pendingCompanionDamage = null; // Untamed: queued companion damage after main attack applied
  game.conan.lotusFlashTargets = []; // Tracks enemies with reduced initiative from Lotus Flash
  // Torch visibility recalc — exposed so tools-sheet.js can call it
  game.conan._recalcTorchVisibility = _recalcTorchVisibility;
  game.conan._clearPlayerAreaCache = () => _playerAreaCache.clear();
  game.conan._hasAreaLOS = _hasAreaLOS;
  game.conan._invalidatePlayerVisCache = _invalidatePlayerVisCache;
  game.conan.dreadClock = dreadClock;

  // Auto-create Albert (GM Tools) on first world load if none exists
  if (game.user.isGM && !game.actors.find(a => a.type === 'tools')) {
    const albert = await Actor.create({ name: 'Albert', type: 'tools' });
    console.log('Conan | Created Albert (GM Tools) automatically');
    ui.notifications.info('Albert (GM Tools) has been created in your Actors tab.');
  }

  // Counter Ward — Wits contest triggered by clicking glowing icon
  game.conan.triggerCounterWard = async function() {
    const alert = game.conan?.counterWardAlert;
    if (!alert) {
      ui.notifications.warn('No enemy spell to counter.');
      return;
    }

    // Find the first warder this user owns
    const warder = alert.warderIds.map(id => game.actors.get(id)).find(a => a?.isOwner);
    if (!warder) {
      ui.notifications.warn('You do not own a character with Counter Ward.');
      return;
    }

    const currentSP = warder.system.stamina || 0;
    if (currentSP < 1) {
      ui.notifications.warn('Not enough Stamina Points to cast Counter Ward (1 SP required).');
      return;
    }

    const witsAttr = warder.system.attributes?.wits || {};
    const witsDie = witsAttr.die || 'd8';
    const witsVal = witsAttr.value || 0;

    const dialogContent = `
      <div style="font-family: 'Montserrat', system-ui, sans-serif; padding: 12px; background: linear-gradient(180deg, #1B1B20 0%, #0B0B0D 100%); color: #FFF;">
        <div style="font-size: 13px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.12em; color: rgba(255,255,255,0.5); margin-bottom: 8px;">Counter Ward — Wits Contest</div>
        <div style="display: flex; align-items: center; gap: 10px; padding: 8px; background: rgba(255,50,50,0.15); border: 1px solid rgba(255,50,50,0.4); border-radius: 4px; margin-bottom: 8px;">
          <img src="systems/conan/images/icons/counter_ward_icon.png" style="width: 36px; height: 36px; filter: drop-shadow(0 0 6px rgba(255,50,50,0.8));">
          <div>
            <div style="font-weight: 700; color: #FF6B6B;">${alert.enemyName}</div>
            <div style="font-size: 15px; color: rgba(255,255,255,0.7);">used <strong>${alert.abilityName}</strong></div>
          </div>
        </div>
        <div style="display: flex; justify-content: space-between; padding: 6px 8px; background: rgba(255,255,255,0.05); border-radius: 4px; margin-bottom: 6px;">
          <span>Your Wits: <strong>${witsVal}</strong> + <strong>1${witsDie}</strong></span>
          <span>Enemy Wits: <strong style="color: #FF6B6B;">${alert.enemyWits}</strong></span>
        </div>
        <div style="text-align: center; font-size: 13px; color: rgba(255,255,255,0.7); font-weight: 600;">Cost: <span style="color: #87CEEB;">1 Stamina Point</span></div>
      </div>`;

    new Dialog({
      title: 'Counter Ward',
      content: dialogContent,
      buttons: {
        counter: {
          label: 'Counter!',
          callback: async () => {
            // Deduct 1 SP
            await warder.update({ 'system.stamina': currentSP - 1 });

            // Roll Wits
            const roll = new Roll(`1${witsDie} + ${witsVal}`);
            await roll.evaluate();
            const total = roll.total;
            const success = total >= alert.enemyWits;

            // Clear alert + remove glow
            game.conan.counterWardAlert = null;
            document.querySelectorAll('.counter-ward-alert').forEach(el => {
              el.classList.remove('counter-ward-alert');
              el.replaceWith(el.cloneNode(true)); // remove click listener
            });

            // Chat result
            const resultColor = success ? '#90EE90' : '#FF6B6B';
            const resultText = success ? 'COUNTERED' : 'FAILED';
            const resultDesc = success
              ? `${warder.name} counters ${alert.enemyName}'s ${alert.abilityName}!`
              : `${warder.name} fails to counter ${alert.enemyName}'s ${alert.abilityName}.`;

            const spellIcon = 'systems/conan/images/icons/counter_ward_icon.png';
            const chatContent = `
              <div class="spell-chat-card" style="border-color: ${resultColor};">
                <div class="spell-chat-portrait" style="position: relative;">
                  <img src="${warder.prototypeToken?.texture?.src || warder.img}" style="width: 100%; height: 100%; object-fit: cover;">
                  <img src="${spellIcon}" class="spell-chat-badge" style="filter: drop-shadow(0 0 4px ${resultColor});">
                </div>
                <div class="spell-chat-info">
                  <div class="spell-chat-name" style="color: ${resultColor};">Counter Ward — ${resultText}</div>
                  <div class="spell-chat-effect">${resultDesc}</div>
                  <div class="spell-chat-effect" style="margin-top: 4px;">
                    Wits Roll: <strong>${roll.total}</strong> (${witsDie}: ${roll.dice[0]?.total ?? '?'} + ${witsVal}) vs <strong>${alert.enemyWits}</strong>
                  </div>
                </div>
              </div>`;

            ChatMessage.create({
              speaker: ChatMessage.getSpeaker({ actor: warder }),
              content: chatContent,
              rolls: [roll]
            });
          }
        },
        pass: {
          label: 'Pass',
          callback: () => {
            game.conan.counterWardAlert = null;
            document.querySelectorAll('.counter-ward-alert').forEach(el => {
              el.classList.remove('counter-ward-alert');
              el.replaceWith(el.cloneNode(true));
            });
          }
        }
      },
      default: 'counter'
    }).render(true);
  };

  // Auto-create Howard the Chronicler if missing (GM only)
  if (game.user.isGM) {
    const existingHoward = game.actors.find(a => a.type === 'howard');
    const howardImg = 'systems/conan/images/howard.png';

    if (!existingHoward) {
      console.log('Conan | Creating Howard the Chronicler');
      await Actor.create({
        name: 'Howard the Chronicler',
        type: 'howard',
        img: howardImg,
        ownership: { default: CONST.DOCUMENT_OWNERSHIP_LEVELS.OBSERVER },
        prototypeToken: {
          name: 'Howard',
          actorLink: true,
          texture: {
            src: howardImg
          },
          lockRotation: true,
          displayName: CONST.TOKEN_DISPLAY_MODES.ALWAYS
        }
      }, { conanAutoCreate: true });
      ui.notifications.info('Howard the Chronicler has arrived to record your tales.');
    } else {
      // Update Howard's image and token settings if needed
      const defaultImages = [
        'icons/svg/mystery-man.svg',
        'icons/sundries/books/book-worn-brown.svg'
      ];
      const needsUpdate = defaultImages.includes(existingHoward.img) ||
                          existingHoward.prototypeToken.name !== 'Howard' ||
                          !existingHoward.prototypeToken.actorLink;

      // Ensure players have Observer access (needed for Show to Players)
      const needsOwnership = (existingHoward.ownership?.default ?? 0) < CONST.DOCUMENT_OWNERSHIP_LEVELS.OBSERVER;

      if (needsUpdate || needsOwnership) {
        console.log('Conan | Updating Howard the Chronicler');
        const updateData = {};
        if (needsUpdate) {
          updateData.img = howardImg;
          updateData['prototypeToken.name'] = 'Howard';
          updateData['prototypeToken.actorLink'] = true;
          updateData['prototypeToken.texture.src'] = howardImg;
          updateData['prototypeToken.lockRotation'] = true;
          updateData['prototypeToken.displayName'] = CONST.TOKEN_DISPLAY_MODES.ALWAYS;
        }
        if (needsOwnership) {
          updateData['ownership.default'] = CONST.DOCUMENT_OWNERSHIP_LEVELS.OBSERVER;
        }
        await existingHoward.update(updateData);
      }
    }
  }

  // Preload random quotes for character sheets
  try {
    await ConanActorSheet2._loadQuotes();
    console.log('Conan | Random quotes loaded');
  } catch (e) {
    console.warn('Conan | Failed to load quotes:', e);
  }

  // Register socket listener for system events
  game.socket.on("system.conan", (data) => {
    if (data.action === "showTokenArt") {
      displayTokenArtOverlay(data.imgSrc, data.name);
    }
    // Flex Celebration - broadcast to all players when a flex die triggers
    if (data.action === "flexCelebration") {
      Hooks.call('conanFlexTriggered', data.actorId, data.rollType, data.celebData);
    }
    // Party inventory sync - refresh open dialogs when another user saves
    if (data.action === "partyInventoryUpdated") {
      if (window.conanPartyInventoryDialog?.rendered) {
        // Refresh the dialog with new data
        window.conanPartyInventoryDialog.data.content = window.buildPartyInventoryHTML(data.inventoryData);
        window.conanPartyInventoryDialog.render(true);
        ui.notifications.info("Party inventory updated by another player!");
      }
    }
    // Travel tab - pan and zoom camera for all players
    if (data.action === "panToLocation") {
      if (canvas?.scene) {
        const panOptions = {
          x: data.x,
          y: data.y,
          duration: data.duration || 1000
        };
        // Include zoom/scale if provided
        if (data.scale !== undefined) {
          panOptions.scale = data.scale;
        }
        canvas.animatePan(panOptions);
      }
    }

    // Legacy: Floating damage sync via socket (kept for backward compat)
    if (data.action === "floatingDamage") {
      showFloatingDamage(data.tokenId, data.damage, data.isDead, data.isWounded, data.isHealing);
    }
  });

});

/**
 * Display token artwork in a fullscreen overlay
 * Called by the Show Token Art macro via socket
 */
function displayTokenArtOverlay(imgSrc, name) {
  // Remove any existing overlays first
  $('#token-art-overlay').remove();

  const overlayHTML = `
    <div id="token-art-overlay" style="
      position: fixed;
      top: 0;
      left: 0;
      width: 100vw;
      height: 100vh;
      background: rgba(0, 0, 0, 0.95);
      z-index: 10000;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      animation: fadeIn 0.3s ease-in-out;
    ">
      <style>
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes zoomIn {
          from { transform: scale(0.8); opacity: 0; }
          to { transform: scale(1); opacity: 1; }
        }
        #token-art-overlay h2 {
          color: #d4af37;
          font-size: 42px;
          margin-bottom: 30px;
          text-shadow: 3px 3px 6px rgba(0,0,0,0.9);
          animation: fadeIn 0.5s ease-in-out;
          font-family: "Modesto Condensed", "Palatino Linotype", serif;
        }
        #token-art-overlay img {
          max-width: 90vw;
          max-height: 75vh;
          border: 5px solid #d4af37;
          border-radius: 10px;
          box-shadow: 0 0 40px rgba(212, 175, 55, 0.6);
          animation: zoomIn 0.4s ease-out;
          object-fit: contain;
        }
        #token-art-overlay p {
          color: #fff;
          font-size: 20px;
          margin-top: 25px;
          animation: fadeIn 0.7s ease-in-out;
          opacity: 0.8;
        }
      </style>
      <h2>${name}</h2>
      <img src="${imgSrc}" alt="${name}">
      <p>Click anywhere to close</p>
    </div>
  `;

  $('body').append(overlayHTML);

  // Close on click
  $('#token-art-overlay').on('click', function() {
    $(this).fadeOut(300, function() {
      $(this).remove();
    });
  });

  // Close on ESC key
  $(document).on('keydown.tokenArt', function(e) {
    if (e.key === 'Escape') {
      $('#token-art-overlay').fadeOut(300, function() {
        $(this).remove();
      });
      $(document).off('keydown.tokenArt');
    }
  });
}

// Make function globally accessible for macros
window.displayTokenArtOverlay = displayTokenArtOverlay;

// LP Max is now calculated dynamically in getData() of actor-sheet2.js
// This handles all skill bonuses (Iron Hide, Whalebone & Gristle, etc.) correctly
// No preUpdateActor or renderActorSheet hooks needed for LP max calculation

// Set default prototype token settings based on actor type
Hooks.on('preCreateActor', (actor, data, options, userId) => {
  const actorType = data.type;

  // Default prototype token settings
  let prototypeToken = {};

  if (actorType === 'character' || actorType === 'character2') {
    // Player Characters: Linked, vision enabled, name/health always visible
    prototypeToken = {
      actorLink: true,
      sight: {
        enabled: true,
        range: 0,
        visionMode: "basic"
      },
      displayName: CONST.TOKEN_DISPLAY_MODES.ALWAYS,  // 50 = Always
      displayBars: CONST.TOKEN_DISPLAY_MODES.ALWAYS,  // 50 = Always
      bar1: {
        attribute: "lifePoints"
      }
    };
  }

  // Apply the prototype token settings
  actor.updateSource({ prototypeToken });
});

/**
 * Get effective stat value including skill bonuses for damage calculations
 * Includes: Steely Thews, Steel Trap Reflexes, Studious, Whalebone and Gristle, Legendary
 * @param {Actor} actor - The actor
 * @param {string} statName - 'might', 'edge', 'wits', or 'grit'
 * @returns {number} The effective stat value with all bonuses
 */
function _getEffectiveStatValue(actor, statName) {
  const baseValue = actor.system.attributes?.[statName]?.value || 0;
  const skills = actor.system.skills || {};
  let bonus = 0;

  for (const skill of Object.values(skills)) {
    const skillName = skill.name?.toLowerCase() || '';

    switch (statName) {
      case 'might':
        if (skillName === 'steely thews') bonus += 1;
        if (skillName === 'steely thews ii') bonus += 1;
        break;
      case 'edge':
        if (skillName === 'steel trap reflexes') bonus += 1;
        if (skillName === 'steel trap reflexes ii') bonus += 1;
        break;
      case 'grit':
        if (skillName === 'whalebone and gristle') bonus += 1;
        if (skillName === 'whalebone and gristle ii') bonus += 1;
        break;
      case 'wits':
        if (skillName === 'studious') bonus += 1;
        if (skillName === 'studious ii') bonus += 1;
        break;
    }
  }

  // Legendary skill: +1 to chosen stat
  const legendaryTargetStat = actor.system.legendary?.stat;
  if (legendaryTargetStat === statName) {
    const hasLegendary = Object.values(skills).some(s => s.name?.toLowerCase() === 'legendary');
    if (hasLegendary) bonus += 1;
  }

  return baseValue + bonus;
}

// Handle damage button clicks in chat messages
Hooks.on('renderChatMessage', (message, html, data) => {
  // Capture damage value from damage roll messages for shift+click application
  // Check for player damage rolls (.damage-result-box)
  const damageBox = html.find('.damage-result-box').first();
  if (damageBox.length > 0) {
    const damageText = damageBox.text().trim();
    const damageValue = parseInt(damageText);
    if (!isNaN(damageValue) && damageValue > 0) {
      game.conan = game.conan || {};
      // Check if this is a healing spell (data-healing attribute)
      const isHealing = damageBox.attr('data-healing') === 'true';
      game.conan.lastDamageRoll = isHealing ? -damageValue : damageValue;
      // Track who dealt this damage (for Infernal Ward break on demon hit)
      game.conan.lastDamageActorId = message.speaker?.actor || null;
      // Clear enemy source - player damage comes from lastDamageActorId instead
      game.conan.lastEnemyAttack = null;
      // Track if bane weapon was part of this damage (applies Prone on hit)
      game.conan.lastDamageHasBane = damageBox.attr('data-bane-weapon') === 'true';
      // For healing spells, store caster ID so applyDamageToToken can also heal the caster
      if (isHealing) {
        const casterId = damageBox.attr('data-caster-id') || null;
        if (casterId) {
          game.conan.lastDamageEffect = { type: 'healing', casterActorId: casterId };
        }
      }
      // Note: do NOT clear lastDamageEffect here for non-healing - the DAMAGE button handler manages it.
      // This hook fires AFTER the button handler, so clearing here would wipe spell effects.
    }
  }

  // Check for enemy attack rolls (.roll-section.damage .roll-result) - format is "= X"
  // Use .last() so when Bane Weapon adds a "Total Damage" line, we capture the total
  const enemyDamageResults = html.find('.roll-section.damage .roll-result');
  if (enemyDamageResults.length > 0) {
    const enemyDamageResult = enemyDamageResults.last();
    const damageText = enemyDamageResult.text().trim();
    // Extract number from "= X" or "= +X" format (Bane Weapon uses +N)
    const match = damageText.match(/=\s*\+?(\d+)/);
    if (match) {
      const damageValue = parseInt(match[1]);
      if (!isNaN(damageValue) && damageValue > 0) {
        game.conan = game.conan || {};
        game.conan.lastDamageRoll = damageValue;
        // Clear player source - enemy damage comes from lastEnemyAttack.enemyName instead
        game.conan.lastDamageActorId = null;
        // Clear spell effect - enemy damage doesn't carry spell effects
        // BUT preserve if the effect was set programmatically (e.g. Death Scream ignoresAR, enemy Hellfire inferno)
        if (!game.conan.lastDamageEffect?.ignoresAR && !game.conan.lastDamageEffect?.inferno) {
          game.conan.lastDamageEffect = null;
        }
        console.log(`%c[TRACE 2/4] DAMAGE PARSED — lastDamageRoll = ${damageValue}`, 'color: #FFD700; font-weight: bold;');
        console.log(`  Parsed from: "${damageText}", lastEnemyAttack:`, game.conan.lastEnemyAttack);
      }
    }
  }

  // Handle undo damage button clicks (GM only)
  html.find('.undo-damage-btn').off('click').on('click', async (event) => {
    if (!game.user.isGM) return;

    const button = event.currentTarget;
    const undoDataStr = button.dataset.undo;
    if (!undoDataStr) return;

    let undoData;
    try {
      undoData = JSON.parse(undoDataStr);
    } catch (e) {
      console.error("Failed to parse undo data:", e);
      return;
    }

    // Get the scene and token
    const scene = game.scenes.get(undoData.sceneId);
    if (!scene) return;

    const tokenDoc = scene.tokens.get(undoData.tokenId);
    if (!tokenDoc) {
      ui.notifications.warn("Token no longer exists.");
      return;
    }

    // Restore previous state - use token's actor (handles both linked and unlinked tokens)
    const tokenActor = tokenDoc.actor;

    // Restore wound/dead flags
    await tokenDoc.setFlag('conan', 'wounded', undoData.wounded);
    await tokenDoc.setFlag('conan', 'dead', undoData.dead);

    // Restore HP via the token's actor (works for linked, unlinked, and GM Tools tokens)
    if (undoData.hp !== null && tokenActor?.system?.lifePoints !== undefined) {
      if (undoData.hasValueProp || typeof tokenActor.system.lifePoints === 'object') {
        await tokenActor.update({ 'system.lifePoints.value': undoData.hp });
      } else {
        await tokenActor.update({ 'system.lifePoints': undoData.hp });
      }
    }

    // Restore token appearance
    await tokenDoc.update({
      'texture.tint': undoData.tint || null,
      'alpha': undoData.alpha ?? 1
    });

    // Disable button and show confirmation
    button.disabled = true;
    button.textContent = 'Undone';
    button.style.color = '#4a4';
  });

  // Mount release undo button (GM only)
  html.find('.mount-undo-btn').off('click').on('click', async (event) => {
    if (!game.user.isGM) return;
    const button = event.currentTarget;
    const undoId = button.dataset.undoId;
    const undoData = game.conan?.mountUndoData?.[undoId];
    if (!undoData) {
      ui.notifications.warn('Undo data expired.');
      return;
    }
    const actor = game.actors.get(undoData.actorId);
    if (!actor) {
      ui.notifications.warn('Actor no longer exists.');
      return;
    }
    await actor.update({
      'system.mount': undoData.mountSnapshot,
      'system.conditions.mounted': undoData.wasMounted
    });
    delete game.conan.mountUndoData[undoId];
    button.disabled = true;
    button.innerHTML = '&#x2713;';
    button.style.color = '#4a4';
    button.title = 'Restored';
    ui.notifications.info(`${undoData.mountSnapshot.name} has been restored.`);
  });

  // Demonic Steed: dismiss button on maintenance chat card
  html.find('.dismiss-demonic-steed-btn').off('click').on('click', async (event) => {
    const button = event.currentTarget;
    const actorId = button.dataset.actorId;
    const actor = game.actors.get(actorId);
    if (!actor || !actor.isOwner) return;
    await actor.update({ 'system.demonicSteedActive': false, 'system.conditions.mounted': false });
    button.textContent = 'Dismissed';
    button.disabled = true;
    button.style.color = '#4a4';
    ChatMessage.create({
      content: `<div class="conan-roll"><h3 style="color: #666;">Demonic Steed Dismissed</h3><div class="skill-effect" style="color: #888;"><em>The spectral steed dissolves into dark smoke as ${actor.name} dismounts.</em></div></div>`,
      speaker: ChatMessage.getSpeaker({ alias: 'System' })
    });
  });

  // Uncanny Reach: Maintain button (spend 1 LP)
  html.find('.maintain-uncanny-reach-btn').off('click').on('click', async (event) => {
    const button = event.currentTarget;
    const actorId = button.dataset.actorId;
    const actor = game.actors.get(actorId);
    if (!actor || !actor.isOwner) return;
    const currentLP = actor.system.lifePoints?.value ?? 0;
    const newLP = Math.max(0, currentLP - 1);
    await actor.update({ 'system.lifePoints.value': newLP });
    // Show floating cost on token
    if (typeof showFloatingDamage === 'function') {
      const token = actor.getActiveTokens()?.[0];
      if (token) broadcastFloatingDamage(token.id, 1, false, false, false);
    }
    button.textContent = 'Maintained';
    button.disabled = true;
    button.style.color = '#4a4';
    // Disable the dismiss button too
    const dismissBtn = button.parentElement?.querySelector('.dismiss-uncanny-reach-btn');
    if (dismissBtn) { dismissBtn.disabled = true; dismissBtn.style.opacity = '0.5'; }
  });

  // Uncanny Reach: Dismiss button
  html.find('.dismiss-uncanny-reach-btn').off('click').on('click', async (event) => {
    const button = event.currentTarget;
    const actorId = button.dataset.actorId;
    const actor = game.actors.get(actorId);
    if (!actor || !actor.isOwner) return;
    await actor.update({ 'system.uncannyReachActive': false });
    button.textContent = 'Dismissed';
    button.disabled = true;
    button.style.color = '#a44';
    // Disable the maintain button too
    const maintainBtn = button.parentElement?.querySelector('.maintain-uncanny-reach-btn');
    if (maintainBtn) { maintainBtn.disabled = true; maintainBtn.style.opacity = '0.5'; }
    ChatMessage.create({
      content: `<div class="conan-roll"><h3 style="color: #666;">Uncanny Reach Dismissed</h3><div class="skill-effect" style="color: #888;"><em>${actor.name}'s limbs retract to their natural length.</em></div></div>`,
      speaker: ChatMessage.getSpeaker({ alias: 'System' })
    });
  });

  // Poison Grit Check button handler
  html.find('.poison-grit-check-btn').off('click').on('click', async (event) => {
    const button = event.currentTarget;
    if (button.classList.contains('used')) return;

    let checkData;
    try {
      checkData = JSON.parse(button.dataset.check);
    } catch (e) {
      console.error("Failed to parse poison check data:", e);
      return;
    }

    const actor = game.actors.get(checkData.actorId);
    if (!actor) return;

    // Only the owning player or GM can roll
    if (!actor.isOwner) return;

    // Roll Grit check: 1[GritDie] + GritValue (with poison penalty if checksDown active)
    const gritAttr = actor.system.attributes?.grit;
    if (!gritAttr) return;
    const gritDie = gritAttr.die || 'd6';
    const gritValue = gritAttr.value || 0;

    // Check for existing poison penalty (-1 to all checks)
    const existingPoison = actor.getFlag('conan', 'poisonEffects');
    const poisonPenalty = (existingPoison?.active && existingPoison.effects?.checksDown) ? -1 : 0;
    const rollFormula = poisonPenalty ? `1${gritDie} + ${gritValue} - 1` : `1${gritDie} + ${gritValue}`;

    const roll = new Roll(rollFormula);
    await roll.evaluate();

    const passed = roll.total >= checkData.gritDC;

    // Mark button as used
    button.classList.add('used');
    button.textContent = passed ? 'RESISTED' : 'FAILED';
    button.style.opacity = '0.5';
    button.style.pointerEvents = 'none';

    const penaltyDisplay = poisonPenalty ? ' <span style="color: #32CD32;">- 1 Venom</span>' : '';

    if (passed) {
      // Resist card — player sees this
      ChatMessage.create({
        speaker: ChatMessage.getSpeaker({ actor }),
        content: `<div class="conan-roll spell-chat-card poison-chat-card poison-resist-card">
          <div class="spell-chat-body">
            <div class="spell-chat-effect" style="text-align: center;">
              <strong>${actor.name}</strong> resists the ${checkData.ruleName}!
              <br><span style="color: rgba(255,255,255,0.6);">Grit: 1${gritDie}(${roll.terms[0]?.total || '?'}) + ${gritValue}${penaltyDisplay} = ${roll.total} vs DC ${checkData.gritDC}</span>
            </div>
          </div>
        </div>`,
        rolls: [roll]
      });
    } else {
      // Failed — route based on outcome
      if (checkData.outcome === 'immobilized') {
        // Spider Queen: apply Immobilized condition
        await actor.update({ 'system.conditions.bound': true });
        ChatMessage.create({
          speaker: ChatMessage.getSpeaker({ actor }),
          content: `<div class="conan-roll spell-chat-card poison-chat-card">
            <div class="spell-chat-body">
              <div class="spell-chat-effect" style="text-align: center;">
                <em>The venom locks your muscles. You cannot move.</em>
                <br><strong>${actor.name}</strong> is <strong>Immobilized</strong>!
                <br><span style="color: rgba(255,255,255,0.6);">Grit: 1${gritDie}(${roll.terms[0]?.total || '?'}) + ${gritValue}${penaltyDisplay} = ${roll.total} vs DC ${checkData.gritDC}</span>
              </div>
            </div>
          </div>`,
          rolls: [roll]
        });
      } else {
        // Poison: apply full poison system
        await applyPoisonToCharacter(actor, checkData.enemyName, checkData.enemyImg, checkData);

        // Brood Mother bonus damage
        if (checkData.bonusDamage) {
          const bonusRoll = new Roll(checkData.bonusDamage);
          await bonusRoll.evaluate();
          game.conan.lastDamageRoll = bonusRoll.total;
          game.conan.lastDamageEffect = { ignoresAR: true };
          // Don't set lastEnemyAttack so bonus damage doesn't re-trigger poison
          ChatMessage.create({
            speaker: { alias: checkData.enemyName },
            content: `<div class="conan-enemy-roll attack">
              <div class="roll-header" style="color: #32CD32;">${checkData.ruleName} — Venom Damage</div>
              <div class="roll-section damage">
                <span class="roll-label" style="color: #ccc;">Venom Damage (ignores AR):</span>
                <span class="roll-dice" style="color: #fff;">${checkData.bonusDamage}</span>
                <span class="roll-result" style="color: #fff; font-weight: bold;">= ${bonusRoll.total}</span>
              </div>
              <div style="text-align: center; color: #FFD700; font-size: 14px; margin-top: 4px;">Shift+click ${actor.name} to apply venom damage</div>
            </div>`,
            rolls: [bonusRoll]
          });
        }
      }
    }
  });

  // Remove any existing click handlers first, then add new one
  html.find('.damage-roll-btn').off('click').on('click', async (event) => {
    const button = event.currentTarget;

    // Check if already used
    if (button.classList.contains('used')) {
      return;
    }

    // Get damage data from the button
    const damageDataStr = button.dataset.damage;
    if (!damageDataStr) return;

    let damageData;
    try {
      damageData = JSON.parse(damageDataStr);
    } catch (e) {
      console.error("Failed to parse damage data:", e);
      return;
    }

    const actor = game.actors.get(damageData.actorId);
    if (!actor) {
      ui.notifications.warn("Actor not found for damage roll.");
      return;
    }

    // Store spell effect metadata for shift+click debuff application (e.g., Tide of Stone, Snake Arrow)
    if (damageData.snakeArrow) {
      game.conan.lastDamageEffect = { type: 'snake-venom' };
    } else {
      game.conan.lastDamageEffect = damageData.spellEffect || null;
    }

    // Build damage formula
    let damageFormula = damageData.damage;

    // Handle WitsDie for spells
    if (damageData.isSpell) {
      const witsAttr = actor.system.attributes.wits;
      damageFormula = damageFormula.replace(/WitsDie/g, `1${witsAttr.die}`);
    }

    // Add damage stat bonus if applicable (using effective value with skill bonuses)
    if (damageData.damageStat) {
      const damageAttr = actor.system.attributes[damageData.damageStat];
      if (damageAttr) {
        // Calculate effective stat value including skill bonuses (Steely Thews, Legendary, etc.)
        const effectiveStatValue = _getEffectiveStatValue(actor, damageData.damageStat);
        damageFormula += ` + ${effectiveStatValue}`;
      }
    }

    // Add origin damage bonus
    if (damageData.damageBonus > 0) {
      damageFormula += ` + ${damageData.damageBonus}`;
    }

    // Add skill-based damage bonuses (Brawler for melee, Eagle-Eyed for ranged/thrown)
    // Track individual skill contributions for display
    let skillDamageBonus = 0;
    const skillContributions = [];
    const skills = actor.system.skills || {};
    for (const skill of Object.values(skills)) {
      const skillName = skill.name?.toLowerCase() || '';
      // Brawler: +1 melee damage
      if (skillName === 'brawler' && damageData.weaponType === 'melee') {
        skillDamageBonus += 1;
        skillContributions.push({ name: 'Brawler', bonus: 1, type: 'Melee Dmg' });
      }
      // Eagle-Eyed: +1 ranged damage (includes thrown)
      if (skillName === 'eagle-eyed' && (damageData.weaponType === 'ranged' || damageData.weaponType === 'thrown')) {
        skillDamageBonus += 1;
        skillContributions.push({ name: 'Eagle-Eyed', bonus: 1, type: 'Ranged Dmg' });
      }
      // Eagle-Eyed II: additional +1 ranged damage
      if (skillName === 'eagle-eyed ii' && (damageData.weaponType === 'ranged' || damageData.weaponType === 'thrown')) {
        skillDamageBonus += 1;
        skillContributions.push({ name: 'Eagle-Eyed II', bonus: 1, type: 'Ranged Dmg' });
      }
    }
    if (skillDamageBonus > 0) {
      damageFormula += ` + ${skillDamageBonus}`;
    }

    // Add Unseen Strike damage bonus (+1)
    const unseenStrikeDamageBonus = damageData.unseenStrikeDamageBonus || 0;
    if (unseenStrikeDamageBonus > 0) {
      damageFormula += ` + ${unseenStrikeDamageBonus}`;
      skillContributions.push({ name: 'Unseen Strike', bonus: unseenStrikeDamageBonus, type: 'Surprise' });
    }

    // Add Bane Weapon damage bonus (die bonus for melee/thrown attacks)
    const baneWeaponBuff = actor.system.baneWeaponBuff || null;
    let baneWeaponDie = null;
    if (baneWeaponBuff && (damageData.weaponType === 'melee' || damageData.weaponType === 'thrown')) {
      baneWeaponDie = baneWeaponBuff.damageDie; // e.g., "1d6", "1d8", "1d10"
      damageFormula += ` + ${baneWeaponDie}`;
      skillContributions.push({ name: 'Bane Weapon', bonus: baneWeaponDie, type: 'Enchanted', isBaneWeapon: true, casterName: baneWeaponBuff.casterName });
    }

    // Roll the damage
    const damageRoll = new Roll(damageFormula, actor.getRollData());
    await damageRoll.evaluate();

    // Apply Impaling Throw double damage
    let impalingThrowDamage = null;
    if (damageData.impalingThrow) {
      impalingThrowDamage = damageRoll.total * 2;
    }

    // Apply Snake Arrow bonus +1d6
    let snakeArrowBonus = 0;
    if (damageData.snakeArrow) {
      const snakeRoll = new Roll('1d6');
      await snakeRoll.evaluate();
      snakeArrowBonus = snakeRoll.total;
    }

    // Apply Bloody Talons bonus +1d6
    let bloodyTalonsBonus = 0;
    if (damageData.bloodyTalons) {
      const talonsRoll = new Roll('1d6');
      await talonsRoll.evaluate();
      bloodyTalonsBonus = talonsRoll.total;
    }

    // Apply Uncanny Reach bonus +1 flat
    const uncannyReachBonus = damageData.uncannyReach ? 1 : 0;

    // Roll flex die for damage (suppress auto-celebration - we'll trigger on choice)
    const sheet = actor.sheet;
    let flexData = { die: 'd6', result: 0, triggered: false, celebData: null };
    if (sheet && sheet._rollFlexDie) {
      const flexType = damageData.weaponType === 'sorcery' ? 'spell_damage' :
                       damageData.weaponType === 'melee' ? 'melee_damage' : 'ranged_damage';
      flexData = await sheet._rollFlexDie(flexType, true); // Suppress auto-celebration
    }

    // Calculate massive damage if flex triggered
    let massiveDamage = null;
    if (flexData.triggered) {
      const dieMatch = damageData.damage.match(/(\d+)?d(\d+)/i);
      if (dieMatch) {
        massiveDamage = damageRoll.total + parseInt(dieMatch[2]);
      } else {
        massiveDamage = damageRoll.total * 2;
      }
    }

    // Build breakdown data for expandable panel
    const damageDieRoll = damageRoll.terms[0]?.total || damageRoll.total;
    const breakdownLines = [];
    // For WitsDie spells (e.g., Lotus Miasma "WitsDie+3"), use resolved formula for breakdown
    const isWitsDieSpell = /WitsDie/i.test(damageData.damage);
    const breakdownFormula = isWitsDieSpell ? damageFormula : damageData.damage;
    // Split die from static bonus in damage formula (e.g., "1d8+2" → die "1d8", static "+2")
    const diePartMatch = breakdownFormula.match(/^(\d*d\d+)(.*)/i);
    const dieOnly = diePartMatch ? diePartMatch[1] : breakdownFormula;
    const staticPart = diePartMatch ? diePartMatch[2].trim() : '';
    breakdownLines.push({ label: isWitsDieSpell ? 'Wits Die' : 'Base Damage', value: dieOnly, roll: damageDieRoll });
    if (staticPart) {
      breakdownLines.push({ label: 'Spell Bonus', value: staticPart });
    }
    if (damageData.damageStat) {
      const effectiveStatValue = _getEffectiveStatValue(actor, damageData.damageStat);
      breakdownLines.push({ label: damageData.damageStat.charAt(0).toUpperCase() + damageData.damageStat.slice(1), value: `+${effectiveStatValue}` });
    }
    if (damageData.damageBonus > 0) breakdownLines.push({ label: 'Origin Bonus', value: `+${damageData.damageBonus}` });
    for (const contrib of skillContributions) {
      breakdownLines.push({ label: contrib.name, value: `+${contrib.bonus}`, isSkill: true });
    }

    // Build simple tooltip string for backwards compat
    let damageTooltip = `${damageData.damage} (${damageDieRoll})`;
    if (damageData.damageStat) {
      const effectiveStatValue = _getEffectiveStatValue(actor, damageData.damageStat);
      damageTooltip += ` + ${effectiveStatValue}`;
    }
    if (damageData.damageBonus > 0) damageTooltip += ` + ${damageData.damageBonus} Origin`;
    for (const contrib of skillContributions) {
      damageTooltip += ` + ${contrib.name} ${contrib.bonus}`;
    }
    damageTooltip += ` = ${damageRoll.total}`;

    // Build chat message content
    const tokenImg = actor.prototypeToken?.texture?.src || actor.img || 'icons/svg/mystery-man.svg';

    // Get owner color
    let ownerColor = '#888888';
    for (const [userId, level] of Object.entries(actor.ownership)) {
      if (level === CONST.DOCUMENT_OWNERSHIP_LEVELS.OWNER) {
        const user = game.users.get(userId);
        if (user && !user.isGM && user.color) {
          ownerColor = user.color;
          break;
        }
      }
    }

    // Build skill icons array for damage (show highest version only)
    const damageSkillIcons = [];
    const hasEagleEyedII = skillContributions.some(c => c.name === 'Eagle-Eyed II');
    const hasEagleEyed = skillContributions.some(c => c.name === 'Eagle-Eyed');
    if (hasEagleEyedII) {
      damageSkillIcons.push({ icon: 'systems/conan/images/icons/eagle_eyed_ii_icon.png', title: 'Eagle-Eyed II (+1 Damage)' });
    } else if (hasEagleEyed) {
      damageSkillIcons.push({ icon: 'systems/conan/images/icons/eagle_eyed_i_icon.png', title: 'Eagle-Eyed (+1 Damage)' });
    }
    if (skillContributions.some(c => c.name === 'Brawler')) {
      damageSkillIcons.push({ icon: 'systems/conan/images/icons/brawler_i_icon.png', title: 'Brawler (+1 Damage)' });
    }
    if (skillContributions.some(c => c.name === 'Unseen Strike')) {
      damageSkillIcons.push({ icon: 'systems/conan/images/icons/unseen_strike_i_icon.png', title: 'Unseen Strike (+1 Damage)' });
    }
    const baneWeaponContrib = skillContributions.find(c => c.name === 'Bane Weapon');
    if (baneWeaponContrib) {
      damageSkillIcons.push({ icon: 'systems/conan/images/icons/create_bane_weapon_icon.png', title: `Bane Weapon (+${baneWeaponContrib.bonus} from ${baneWeaponContrib.casterName})` });
    }
    if (damageData.waterfrontFists) {
      damageSkillIcons.push({ icon: 'systems/conan/images/icons/waterfront_fists_icon.png', title: 'Waterfront Fists (1d4 Unarmed)' });
    }
    if (damageData.snakeArrow) {
      damageSkillIcons.push({ icon: 'systems/conan/images/icons/snake_arrow_icon.png', title: `Snake Arrow (+${snakeArrowBonus} from 1d6)` });
    }
    if (damageData.bloodyTalons) {
      damageSkillIcons.push({ icon: 'systems/conan/images/icons/bloody_talons_icon.png', title: `Bloody Talons (+${bloodyTalonsBonus} from 1d6)` });
    }
    if (damageData.uncannyReach) {
      damageSkillIcons.push({ icon: 'systems/conan/images/icons/uncanny_reach_icon.png', title: 'Uncanny Reach (+1)' });
    }

    // Build breakdown HTML for expandable panel
    let breakdownHtml = `<div class="damage-breakdown" style="display: none;">`;
    breakdownHtml += `<div class="breakdown-header">Damage Breakdown</div>`;
    for (const line of breakdownLines) {
      const skillClass = line.isSkill ? 'breakdown-skill' : '';
      if (line.roll !== undefined) {
        breakdownHtml += `<div class="breakdown-line ${skillClass}"><span class="breakdown-label">${line.label}</span><span class="breakdown-value">${line.value} → ${line.roll}</span></div>`;
      } else {
        breakdownHtml += `<div class="breakdown-line ${skillClass}"><span class="breakdown-label">${line.label}</span><span class="breakdown-value">${line.value}</span></div>`;
      }
    }
    if (damageData.impalingThrow) {
      breakdownHtml += `<div class="breakdown-line breakdown-skill"><span class="breakdown-label">Impaling Throw</span><span class="breakdown-value">× 2</span></div>`;
    }
    if (damageData.snakeArrow) {
      breakdownHtml += `<div class="breakdown-line breakdown-skill"><span class="breakdown-label">Snake Arrow</span><span class="breakdown-value">+${snakeArrowBonus} (1d6)</span></div>`;
    }
    if (damageData.bloodyTalons) {
      breakdownHtml += `<div class="breakdown-line breakdown-skill"><span class="breakdown-label">Bloody Talons</span><span class="breakdown-value">+${bloodyTalonsBonus} (1d6)</span></div>`;
    }
    if (damageData.uncannyReach) {
      breakdownHtml += `<div class="breakdown-line breakdown-skill"><span class="breakdown-label">Uncanny Reach</span><span class="breakdown-value">+1</span></div>`;
    }
    let finalBaseDamage = damageData.impalingThrow ? impalingThrowDamage : damageRoll.total;
    finalBaseDamage += snakeArrowBonus + bloodyTalonsBonus + uncannyReachBonus;
    breakdownHtml += `<div class="breakdown-total"><span class="breakdown-label">Total</span><span class="breakdown-value">${finalBaseDamage}</span></div>`;
    breakdownHtml += `</div>`;

    // Build skill icons grid HTML
    let skillIconsHtml = '';
    if (damageSkillIcons.length > 0) {
      skillIconsHtml = `<div class="roll-skill-icons">`;
      for (const skill of damageSkillIcons) {
        skillIconsHtml += `<img src="${skill.icon}" class="roll-skill-icon" title="${skill.title}" alt="${skill.title}"/>`;
      }
      skillIconsHtml += `</div>`;
    }

    const finalDamage = (damageData.impalingThrow ? impalingThrowDamage : damageRoll.total) + snakeArrowBonus + bloodyTalonsBonus + uncannyReachBonus;

    // Build normal content (used both for normal display and stamina choice fallback)
    const buildNormalContent = () => {
      let content = `<div class="conan-roll damage-roll" style="border-color: ${ownerColor};">`;
      content += `<div class="roll-header">`;
      content += `<img src="${tokenImg}" class="token-img" alt="${actor.name}">`;
      content += `<div class="roll-title">${damageData.weaponName} Damage</div>`;
      content += `</div>`;

      // Show damage with skill icons
      const baneAttr = baneWeaponDie ? ' data-bane-weapon="true"' : '';
      if (damageData.impalingThrow) {
        content += `<div class="roll-result-wrapper">`;
        content += skillIconsHtml;
        content += `<div class="damage-result-box impaling-damage clickable-breakdown"${baneAttr} style="background: linear-gradient(180deg, #8b0000 0%, #5c0000 100%); border-color: #ff4444; font-size: 28px; cursor: pointer;">${finalDamage}</div>`;
        content += `</div>`;
      } else if (damageData.bloodyTalons) {
        content += `<div class="roll-result-wrapper">`;
        content += skillIconsHtml;
        content += `<div class="damage-result-box clickable-breakdown"${baneAttr} style="background: linear-gradient(180deg, #8b0000 0%, #5c0000 100%); border-color: #C43C3C; font-size: 28px; cursor: pointer;">${finalDamage}</div>`;
        content += `</div>`;
      } else if (damageData.uncannyReach) {
        content += `<div class="roll-result-wrapper">`;
        content += skillIconsHtml;
        content += `<div class="damage-result-box clickable-breakdown"${baneAttr} style="background: linear-gradient(180deg, #5c0020 0%, #3a0010 100%); border-color: #b4003c; font-size: 28px; cursor: pointer;">${finalDamage}</div>`;
        content += `</div>`;
      } else if (damageData.snakeArrow) {
        content += `<div class="roll-result-wrapper">`;
        content += skillIconsHtml;
        content += `<div class="damage-result-box clickable-breakdown"${baneAttr} style="background: linear-gradient(180deg, #4a0080 0%, #2d004d 100%); border-color: #9040ff; font-size: 28px; cursor: pointer;">${finalDamage}</div>`;
        content += `</div>`;
      } else {
        content += `<div class="roll-result-wrapper">`;
        content += skillIconsHtml;
        content += `<div class="damage-result-box clickable-breakdown"${baneAttr} style="cursor: pointer;">${finalDamage}</div>`;
        content += `</div>`;
      }
      // SP damage boost buttons (+1d4 / +2d4)
      content += `<div class="sp-boost-row">`;
      content += `<button type="button" class="sp-dmg-boost-btn" data-dice="1" data-cost="1" data-actor-id="${damageData.actorId}">+1</button>`;
      content += `<button type="button" class="sp-dmg-boost-btn" data-dice="2" data-cost="2" data-actor-id="${damageData.actorId}">+2</button>`;
      content += `</div>`;
      content += breakdownHtml;

      content += `<div class="flex-result">`;
      content += `<strong>Flex Die (${flexData.die}):</strong> ${flexData.result}`;
      content += `</div>`;

      content += `</div>`;
      return content;
    };

    // If flex triggered, show flex choice card
    if (flexData.triggered) {
      // Calculate effective massive damage
      const effectiveTotal = damageData.impalingThrow ? impalingThrowDamage : damageRoll.total;
      const dieMatch = damageData.damage.match(/(\d+)?d(\d+)/i);
      const maxDieValue = dieMatch ? parseInt(dieMatch[2]) : effectiveTotal;
      const effectiveMassive = effectiveTotal + maxDieValue;

      const flexType = damageData.weaponType === 'sorcery' ? 'spell_damage' :
                       damageData.weaponType === 'melee' ? 'melee_damage' : 'ranged_damage';

      const flexChoiceData = {
        actorId: actor.id,
        rollType: flexType,
        celebData: flexData.celebData,
        baseDamage: effectiveTotal,
        massiveDamage: effectiveMassive,
        maxDieValue: maxDieValue,
        normalContent: buildNormalContent(),
        breakdownHtml: breakdownHtml,
        spellCostLp: damageData.spellCostLp || 0,
        spellCostSp: damageData.spellCostSp || 0
      };

      const flexCardContent = _buildFlexChoiceCard(actor, 'damage', flexData, flexChoiceData, tokenImg, ownerColor);

      ChatMessage.create({
        speaker: ChatMessage.getSpeaker({ actor: actor }),
        content: flexCardContent,
        rolls: [damageRoll, flexData.roll],
        rollMode: game.settings.get('core', 'rollMode')
      });
    } else {
      // No flex - show normal damage card
      let content = buildNormalContent();

      // Poisoner skill trigger: poisoned melee weapons dealing 3+ damage consume Ichor and poison target
      if (damageData.isPoisoned && damageData.weaponType === 'melee' && finalDamage >= 3) {
        // Find Ichor in inventory
        const inventory = actor.system.inventory || {};
        let ichorId = null;
        let ichorQuantity = 0;
        for (const [id, item] of Object.entries(inventory)) {
          if (item && item.isPoisonerItem) {
            ichorId = id;
            ichorQuantity = item.quantity || 0;
            break;
          }
        }
        if (ichorId && ichorQuantity >= 1) {
          // Reduce Ichor by 1
          await actor.update({
            [`system.inventory.${ichorId}.quantity`]: ichorQuantity - 1
          });
          // Add poison indicator - need to insert before closing div
          content = content.slice(0, -6); // Remove </div>
          content += `<div class="skill-indicator poisoner-indicator" style="background: linear-gradient(180deg, #2d5a2d 0%, #1a3d1a 100%); border-color: #4CAF50; color: #90EE90; font-size: 18px; padding: 8px; margin-top: 5px;">🐍 TARGET POISONED!</div>`;
          content += `<div style="font-size: 14px; color: #90EE90; text-align: center; margin-top: 2px;">Ichor remaining: ${ichorQuantity - 1}</div>`;
          content += `</div>`;
        }
      }

      ChatMessage.create({
        speaker: ChatMessage.getSpeaker({ actor: actor }),
        content: content,
        rolls: [damageRoll, flexData.roll],
        rollMode: game.settings.get('core', 'rollMode')
      });
    }

    // Gray out the button
    button.classList.add('used');
    button.disabled = true;
    button.textContent = 'ROLLED';
  });

  // ========== SP BOOST: +1/+2 stamina spend buttons on skill checks ==========
  html.find('.sp-boost-btn').each((i, btn) => {
    const actorId = btn.dataset.actorId;
    const actor = game.actors.get(actorId);
    if (!actor || !actor.isOwner) {
      btn.style.display = 'none';
      return;
    }
    const currentSP = actor.system.stamina || 0;
    btn.title = `SP: ${currentSP}`;
    const cost = parseInt(btn.dataset.cost);
    if (currentSP < cost) btn.disabled = true;
  });

  html.find('.sp-boost-btn').off('click').on('click', async (event) => {
    event.preventDefault();
    event.stopPropagation();
    const btn = event.currentTarget;
    // Immediate guard against double-fire
    if (btn.disabled || btn.classList.contains('used')) return;
    const row = btn.closest('.sp-boost-row');
    row?.querySelectorAll('.sp-boost-btn').forEach(b => { b.disabled = true; });

    const actorId = btn.dataset.actorId;
    const cost = parseInt(btn.dataset.cost);
    const boost = parseInt(btn.dataset.boost);
    const baseTotal = parseInt(btn.dataset.baseTotal);
    const isCruelFate = btn.dataset.cruelFate === 'true';
    const rollLabel = btn.dataset.rollLabel || 'Check';
    const actor = game.actors.get(actorId);
    if (!actor || !actor.isOwner) return;

    const currentSP = actor.system.stamina || 0;
    if (currentSP < cost) {
      ui.notifications.warn(`Not enough Stamina Points (need ${cost}, have ${currentSP}).`);
      // Re-enable buttons since we didn't actually spend
      row?.querySelectorAll('.sp-boost-btn').forEach(b => {
        const c = parseInt(b.dataset.cost);
        if (currentSP >= c) b.disabled = false;
      });
      return;
    }

    // Deduct SP
    await actor.update({ 'system.stamina': currentSP - cost });
    const newTotal = baseTotal + boost;
    const rollType = btn.dataset.rollType || 'skill';
    const messageEl = btn.closest('.conan-roll') || btn.closest('.spell-chat-card');

    if (rollType === 'attack') {
      // Attack rolls: update single result box OR both mounted totals
      const resultBox = row?.querySelector('.attack-result-box');
      if (resultBox) {
        resultBox.textContent = newTotal;
      } else {
        // Mounted attacks: update both .attack-total spans
        const wrapper = messageEl?.querySelector('.roll-result-wrapper') || messageEl;
        wrapper?.querySelectorAll('.attack-total').forEach(span => {
          const oldVal = parseInt(span.textContent);
          if (!isNaN(oldVal)) span.textContent = oldVal + boost;
        });
      }
      // Update the attack breakdown
      const breakdown = messageEl?.querySelector('.attack-breakdown');
      if (breakdown) {
        const totalLine = breakdown.querySelector('.breakdown-total');
        if (totalLine) {
          const staminaLine = document.createElement('div');
          staminaLine.className = 'breakdown-line skill-bonus';
          staminaLine.style.color = '#ff6b6b';
          staminaLine.innerHTML = `<span class="breakdown-label">Stamina</span><span class="breakdown-value">+${boost}</span>`;
          totalLine.parentNode.insertBefore(staminaLine, totalLine);
          const totalValue = totalLine.querySelector('.breakdown-value');
          if (totalValue) {
            // Mounted shows "X / Y" format, non-mounted shows single number
            const totalText = totalValue.textContent;
            if (totalText.includes('/')) {
              const parts = totalText.split('/').map(s => parseInt(s.trim()));
              totalValue.textContent = parts.map(v => v + boost).join(' / ');
            } else {
              totalValue.textContent = newTotal;
            }
          }
        }
      }
    } else {
      // Skill rolls: update single result box
      const resultBox = row?.querySelector('.skill-result-box');
      if (resultBox) {
        resultBox.textContent = newTotal;
      }
      // Update the skill breakdown
      const breakdown = messageEl?.querySelector('.skill-breakdown');
      if (breakdown) {
        const totalLine = breakdown.querySelector('.breakdown-total');
        if (totalLine) {
          const staminaLine = document.createElement('div');
          staminaLine.className = 'breakdown-line skill-bonus';
          staminaLine.style.color = '#ff6b6b';
          staminaLine.innerHTML = `<span class="breakdown-label">Stamina</span><span class="breakdown-value">+${boost}</span>`;
          totalLine.parentNode.insertBefore(staminaLine, totalLine);
          const totalValue = totalLine.querySelector('.breakdown-value');
          if (totalValue) totalValue.textContent = newTotal;
        }
      }
    }

    // Mark the used button (both already disabled at top of handler)
    btn.classList.add('used');

    // Update tooltips to reflect new SP
    row?.querySelectorAll('.sp-boost-btn').forEach(b => {
      b.title = `SP: ${currentSP - cost}`;
    });

    // Cruel Fate defiance — special chat message when SP pushes past a rolled 1
    if (isCruelFate) {
      const g = actor.system.gender;
      const pro = {
        f: { subject: 'she', object: 'her', possessive: 'her', reflexive: 'herself' },
        m: { subject: 'he', object: 'him', possessive: 'his', reflexive: 'himself' }
      };
      const neutral = { subject: 'they', object: 'them', possessive: 'their', reflexive: 'themselves' };
      const p = pro[g] || neutral;
      const name = actor.name;

      const S = p.subject.charAt(0).toUpperCase() + p.subject.slice(1);

      // Generic messages (fallback for any origin)
      const genericMessages = [
        `${name} snarls through gritted teeth, forcing ${p.possessive} body past what fate demands.`,
        `The gods cast their die — but ${name} spits in their face and presses on.`,
        `Destiny falters. ${name} drives ${p.possessive} will like iron through the moment.`,
        `Where lesser souls would crumble, ${name} burns ${p.possessive} reserves and endures.`,
        `Fate's hand closes around ${name} — but ${p.subject} tears free, bloodied and defiant.`,
        `${name} feels ${p.possessive} muscles scream and ${p.possessive} vision blur. ${S} pushes through anyway.`,
        `A cruel twist — but ${name} has not survived this long by bowing to misfortune.`,
        `The world tilts against ${name}. ${S} steadies ${p.reflexive} by sheer force of will.`,
        `${name}'s blood burns hot. Fate will not claim ${p.possessive} triumph — not today.`,
        `By Crom — ${name} refuses to fall. Raw stamina carries ${p.object} where skill could not.`
      ];

      // Origin-specific messages
      const originMessages = {
        'from-the-hills': [
          `In the hills of Cimmeria, failure is never accepted. ${name} defies the gods and presses on.`,
          `${name}'s Cimmerian blood runs thick with defiance. The hills breed no cowards.`,
          `The gray hills of ${p.possessive} homeland forged ${name} harder than this. ${S} endures.`,
          `Crom demands no prayers — only strength. ${name} answers with ${p.possessive} own.`,
          `${name} remembers the bitter winds of ${p.possessive} homeland. This is nothing.`
        ],
        'from-the-streets': [
          `The gutters taught ${name} one truth: the dead don't get paid. ${S} fights on.`,
          `${name} has cheated worse odds in darker alleys. Fate is just another mark.`,
          `A street rat knows when to fold — and this isn't it. ${name} digs deep.`,
          `${name} didn't claw ${p.possessive} way out of the slums to die like this.`,
          `Fate deals from the bottom of the deck — but ${name} has been cheating longer.`
        ],
        'from-the-steppes': [
          `The endless steppes break the weak before they can walk. ${name} was never weak.`,
          `${name}'s ancestors rode through worse beneath the open sky. ${S} will not falter.`,
          `On the steppes, the wind bows to no one — and neither does ${name}.`,
          `${name} steadies ${p.reflexive} like a rider in a storm. The saddle holds.`,
          `The blood of horse-lords does not spill easily. ${name} grits ${p.possessive} teeth and rides on.`
        ],
        'from-the-north': [
          `The frost giants themselves could not break the will of the North. Nor can fate break ${name}.`,
          `By Ymir's frozen beard — ${name} has endured worse winters than this.`,
          `Northern blood runs hot even in the coldest hour. ${name} burns through the pain.`,
          `${name} laughs — a savage, northern laugh. The Aesir do not kneel to misfortune.`,
          `The long dark of the North teaches one thing: survive. ${name} obeys that lesson now.`
        ],
        'from-the-wilds': [
          `The jungle devours the hesitant. ${name} has never hesitated.`,
          `${name} moves through this trial like ${p.subject} moves through the wilds — without mercy for ${p.reflexive}.`,
          `The beasts of the wild do not surrender. Neither does ${name}.`,
          `Where civilized folk would faint, ${name} draws on the savage endurance of the wilds.`,
          `The primal world knows no fate — only the strong and the dead. ${name} chooses strength.`
        ],
        'from-a-civilized-land': [
          `${name} draws on the discipline of civilization — trained will over raw fortune.`,
          `Civilized lands breed thinkers. ${name} has already thought past this setback.`,
          `${name} was schooled in the great cities. Failure was never part of the curriculum.`,
          `Where barbarians rage, ${name} calculates. And the calculation says: press on.`,
          `The towers of ${p.possessive} homeland were not built by those who accept defeat. Neither does ${name}.`
        ],
        'from-parts-unknown': [
          `No one knows where ${name} came from — and no one will see ${p.subject} fall here.`,
          `${name} has survived things with no name. This is merely fate, and fate can be broken.`,
          `The mystery that forged ${name} did not forge ${p.subject} to break this easily.`,
          `${name} carries secrets heavier than any doom. ${S} shoulders this one too.`,
          `Whatever dark road brought ${name} here made ${p.subject} stronger than any cruel twist of fortune.`
        ],
        'from-the-blood-of-jhebbal-sag': [
          `The beast blood in ${name}'s veins howls defiance. ${S} will not be brought low.`,
          `Something primal stirs in ${name}. The blood of Jhebbal Sag does not yield.`,
          `${name}'s pupils narrow to slits. The animal within refuses to fall.`,
          `The old god's blood burns through ${name} like wildfire. Fate means nothing to a beast.`,
          `${name} bares ${p.possessive} teeth in a snarl no civilized throat should make. ${S} endures.`
        ],
        'from-the-blood-of-acheron': [
          `Ancient power stirs in ${name}'s veins. The blood of Acheron does not bow to fate.`,
          `${name} feels the dead empire whisper through ${p.possessive} blood: we did not fall to something so small.`,
          `The sorcery of lost Acheron courses through ${name}. ${S} bends reality before it bends ${p.object}.`,
          `Ten thousand years of Acheronian will compress into this moment. ${name} refuses to break.`,
          `${name}'s eyes flash with something ancient. The heirs of Acheron do not accept defeat.`
        ],
        'from-the-blood-of-a-demon': [
          `The demon blood in ${name}'s veins ignites. Hell does not bow to fate — and neither does ${p.subject}.`,
          `Something inhuman drives ${name} past the breaking point. The blood hungers for more.`,
          `${name}'s tainted blood boils. Where mortal flesh would fail, the demon endures.`,
          `A cruel smile crosses ${name}'s face. ${S} has more of ${p.possessive} father's spite than any god's mercy.`,
          `The abyss that sired ${name}'s line laughs at mortal fate. ${S} laughs with it.`
        ]
      };

      const originId = actor.system.origin?.id;
      const pool = originMessages[originId] || [];
      const allMessages = [...pool, ...genericMessages];
      const flavorText = allMessages[Math.floor(Math.random() * allMessages.length)];
      const tokenImg = actor.prototypeToken?.texture?.src || actor.img || 'icons/svg/mystery-man.svg';
      const staminaIcon = 'systems/conan/images/stamina_icon.jpg';

      ChatMessage.create({
        speaker: ChatMessage.getSpeaker({ actor }),
        content: `<div class="spell-chat-card" style="border-color: #8b0000;">
          <div class="spell-chat-header" style="background: linear-gradient(180deg, #2a1010 0%, #1a0808 100%);">
            <div class="spell-chat-portrait-wrap">
              <img src="${tokenImg}" class="spell-chat-portrait" style="border-color: #8b0000;"/>
              <img src="${staminaIcon}" class="spell-chat-badge" alt="Stamina"/>
            </div>
            <div class="spell-chat-title"><strong>Cruel Fate Defied</strong> — <span style="font-size: 15px; color: #cc6666;">${rollLabel} Roll +${boost} = ${newTotal}</span></div>
          </div>
          <div class="spell-chat-body">
            <div class="spell-chat-effect" style="border-left-color: #8b0000;"><em>${flavorText}</em></div>
          </div>
        </div>`
      });
    }
  });

  // ========== SP DAMAGE BOOST: +1d4/+2d4 stamina spend buttons on damage rolls ==========
  html.find('.sp-dmg-boost-btn').each((i, btn) => {
    const actorId = btn.dataset.actorId;
    const actor = game.actors.get(actorId);
    if (!actor || !actor.isOwner) {
      btn.style.display = 'none';
      return;
    }
    const currentSP = actor.system.stamina || 0;
    btn.title = `SP: ${currentSP}`;
    const cost = parseInt(btn.dataset.cost);
    if (currentSP < cost) btn.disabled = true;
  });

  html.find('.sp-dmg-boost-btn').off('click').on('click', async (event) => {
    event.preventDefault();
    event.stopPropagation();
    const btn = event.currentTarget;
    // Immediate guard against double-fire
    if (btn.disabled || btn.classList.contains('used')) return;
    const row = btn.closest('.sp-boost-row');
    row?.querySelectorAll('.sp-dmg-boost-btn').forEach(b => { b.disabled = true; });

    const actorId = btn.dataset.actorId;
    const diceCount = parseInt(btn.dataset.dice);
    const cost = parseInt(btn.dataset.cost);
    const actor = game.actors.get(actorId);
    if (!actor || !actor.isOwner) return;

    const currentSP = actor.system.stamina || 0;
    if (currentSP < cost) {
      ui.notifications.warn(`Not enough Stamina Points (need ${cost}, have ${currentSP}).`);
      row?.querySelectorAll('.sp-dmg-boost-btn').forEach(b => {
        const c = parseInt(b.dataset.cost);
        if (currentSP >= c) b.disabled = false;
      });
      return;
    }

    // Deduct SP
    await actor.update({ 'system.stamina': currentSP - cost });

    // Roll the d4(s)
    const formula = `${diceCount}d4`;
    const spRoll = new Roll(formula);
    await spRoll.evaluate();
    const spBonus = spRoll.total;

    // Show 3D dice if Dice So Nice is installed
    if (game.dice3d) {
      game.dice3d.showForRoll(spRoll, game.user, true);
    }

    // Show the individual die results on the button
    const dieResults = spRoll.terms[0]?.results?.map(r => r.result) || [spBonus];
    btn.textContent = `+${spBonus}`;
    btn.title = `Rolled ${formula}: [${dieResults.join(', ')}] = ${spBonus}`;

    // Find and update the damage result box
    const messageEl = btn.closest('.conan-roll') || btn.closest('.spell-chat-card');
    const damageBox = messageEl?.querySelector('.damage-result-box');
    if (damageBox) {
      const oldDamage = parseInt(damageBox.textContent.trim());
      const newDamage = oldDamage + spBonus;
      damageBox.textContent = newDamage;
      // Update lastDamageRoll so shift+click picks up the new total
      game.conan.lastDamageRoll = newDamage;
    }

    // Update the damage breakdown: insert stamina line before TOTAL, update TOTAL value
    const breakdown = messageEl?.querySelector('.damage-breakdown');
    if (breakdown) {
      const totalLine = breakdown.querySelector('.breakdown-total');
      if (totalLine) {
        const staminaLine = document.createElement('div');
        staminaLine.className = 'breakdown-line skill-bonus';
        staminaLine.style.color = '#ff6b6b';
        staminaLine.innerHTML = `<span class="breakdown-label">Stamina (${formula})</span><span class="breakdown-value">+${spBonus}</span>`;
        totalLine.parentNode.insertBefore(staminaLine, totalLine);
        const totalValue = totalLine.querySelector('.breakdown-value');
        if (totalValue) {
          const oldTotal = parseInt(totalValue.textContent);
          totalValue.textContent = oldTotal + spBonus;
        }
      }
    }

    // Mark used and update tooltips
    btn.classList.add('used');
    row?.querySelectorAll('.sp-dmg-boost-btn').forEach(b => {
      b.title = `SP: ${currentSP - cost}`;
    });
  });

  // Handle clickable breakdown boxes - toggle visibility (client-side only, so each user controls their own view)
  html.find('.clickable-breakdown').off('click').on('click', (event) => {
    const box = event.currentTarget;
    const messageEl = box.closest('.conan-roll');
    if (!messageEl) return;

    // Find damage, attack, or skill breakdown
    let breakdown = messageEl.querySelector('.damage-breakdown');
    let glowColor = 'rgba(221, 165, 32, 0.6)'; // Gold for damage

    if (!breakdown) {
      breakdown = messageEl.querySelector('.attack-breakdown');
      glowColor = 'rgba(66, 153, 225, 0.6)'; // Blue for attack
    }
    if (!breakdown) {
      breakdown = messageEl.querySelector('.skill-breakdown');
      glowColor = 'rgba(144, 238, 144, 0.6)'; // Green for skill
    }
    // Reload cards: each weapon entry has its own breakdown (not shared)
    if (!breakdown) {
      const entry = box.closest('.reload-weapon-entry');
      if (entry) {
        breakdown = entry.querySelector('.reload-breakdown');
        glowColor = 'rgba(76, 175, 80, 0.6)'; // Green for reload
      }
    }
    if (!breakdown) return;

    // Toggle visibility
    if (breakdown.style.display === 'none' || !breakdown.style.display) {
      breakdown.style.display = 'block';
      box.style.boxShadow = `0 0 15px ${glowColor}`;
    } else {
      breakdown.style.display = 'none';
      box.style.boxShadow = '';
    }
  });

  // Handle flex choice button clicks
  html.find('.flex-choice-btn').off('click').on('click', async (event) => {
    const button = event.currentTarget;
    const choice = button.dataset.choice;
    const flexDataStr = button.dataset.flexData;

    if (!flexDataStr) return;

    let flexData;
    try {
      flexData = JSON.parse(flexDataStr);
    } catch (e) {
      console.error("Failed to parse flex data:", e);
      return;
    }

    const actor = game.actors.get(flexData.actorId);
    if (!actor) {
      ui.notifications.warn("Actor not found.");
      return;
    }

    // Disable all buttons in this card
    const cardEl = button.closest('.flex-choice-card');
    if (cardEl) {
      cardEl.querySelectorAll('.flex-choice-btn').forEach(btn => {
        btn.disabled = true;
        btn.classList.add('used');
      });
    }

    // Handle the choice
    if (choice === 'stamina') {
      // Add +1 stamina
      const currentStamina = actor.system.stamina || 0;
      await actor.update({ 'system.stamina': currentStamina + 1 });

      // Post confirmation
      ChatMessage.create({
        speaker: ChatMessage.getSpeaker({ actor: actor }),
        content: `<div class="conan-roll flex-result-message" style="border-color: #4CAF50; background: linear-gradient(180deg, #1a3d1a 0%, #0d1f0d 100%);"><div class="roll-header" style="background: linear-gradient(180deg, #2d5a2d 0%, #1a3d1a 100%);"><div class="roll-title" style="color: #90EE90;">⚡ +1 Stamina!</div></div><div style="text-align: center; padding: 10px; color: #90EE90;">Flex bonus applied. Stamina is now ${currentStamina + 1}.</div></div>`,
        rollMode: game.settings.get('core', 'rollMode')
      });

      // Now post the normal roll result (stored in flexData)
      if (flexData.normalContent) {
        ChatMessage.create({
          speaker: ChatMessage.getSpeaker({ actor: actor }),
          content: flexData.normalContent,
          rollMode: game.settings.get('core', 'rollMode')
        });
      }

    } else if (choice === 'hit') {
      // Trigger celebration first
      await _triggerFlexCelebration(actor, flexData.rollType, flexData.celebData);

      // Mesmerism Dominate: mark as permanent control
      if (flexData.spellId === 'mesmerism' && game.conan?.lastDamageEffect?.type === 'mesmerism') {
        game.conan.lastDamageEffect.permanent = true;
        ChatMessage.create({
          speaker: ChatMessage.getSpeaker({ actor: actor }),
          content: `<div class="conan-roll flex-result-message" style="border-color: #9400D3; background: linear-gradient(180deg, #2d1a3d 0%, #1a0d2d 100%);"><div class="roll-header" style="background: linear-gradient(180deg, #4a2d6b 0%, #2d1a3d 100%);"><div class="roll-title" style="color: #d9a3ff;">🔮 DOMINATE!</div></div><div style="text-align: center; padding: 10px; color: #d9a3ff;">The target's will is permanently shattered. Control is immediate and absolute.<br><strong>Shift+click an enemy token to dominate it.</strong></div></div>`,
          rollMode: game.settings.get('core', 'rollMode')
        });
      } else {
        // Post HIT confirmation
        ChatMessage.create({
          speaker: ChatMessage.getSpeaker({ actor: actor }),
          content: `<div class="conan-roll flex-result-message" style="border-color: #E10600; background: linear-gradient(180deg, #3d1a1a 0%, #1f0d0d 100%);"><div class="roll-header" style="background: linear-gradient(180deg, #5a2d2d 0%, #3d1a1a 100%);"><div class="roll-title" style="color: #ff6b6b;">⚡ HIT! Auto-Success!</div></div><div style="text-align: center; padding: 10px; color: #ff9999;">The attack automatically hits!</div></div>`,
          rollMode: game.settings.get('core', 'rollMode')
        });
      }

      // Trigger damage roll if damage data exists
      if (flexData.damageData) {
        _rollDamageFromFlexChoice(actor, flexData.damageData);
      }

    } else if (choice === 'massive') {
      // Trigger celebration first
      await _triggerFlexCelebration(actor, flexData.rollType, flexData.celebData);

      // Post massive damage result with expandable breakdown
      const massiveTotal = flexData.massiveDamage || 0;
      const maxDieValue = flexData.maxDieValue || 0;
      // Inject Max Die line and replace total with massive total in breakdown
      let massiveBreakdown = flexData.breakdownHtml || '';
      if (massiveBreakdown) {
        const maxDieLine = `<div class="breakdown-line breakdown-skill"><span class="breakdown-label">Max Die (Massive)</span><span class="breakdown-value">+${maxDieValue}</span></div>`;
        massiveBreakdown = massiveBreakdown
          .replace(/<div class="breakdown-total">.*?<\/div>/, `${maxDieLine}<div class="breakdown-total"><span class="breakdown-label">Total</span><span class="breakdown-value">${massiveTotal}</span></div>`);
      }
      ChatMessage.create({
        speaker: ChatMessage.getSpeaker({ actor: actor }),
        content: `<div class="conan-roll flex-result-message damage-roll" style="border-color: #E10600; background: linear-gradient(180deg, #3d1a1a 0%, #1f0d0d 100%);"><div class="roll-header" style="background: linear-gradient(180deg, #5a2d2d 0%, #3d1a1a 100%);"><div class="roll-title" style="color: #ff6b6b;">⚡ MASSIVE DAMAGE!</div></div><div class="damage-result-box clickable-breakdown" style="background: linear-gradient(180deg, #8b0000 0%, #5c0000 100%); border-color: #ff4444; font-size: 32px; margin: 10px auto; cursor: pointer;">${massiveTotal}</div><div class="sp-boost-row"><button type="button" class="sp-dmg-boost-btn" data-dice="1" data-cost="1" data-actor-id="${actor.id}">+1</button><button type="button" class="sp-dmg-boost-btn" data-dice="2" data-cost="2" data-actor-id="${actor.id}">+2</button></div>${massiveBreakdown}</div>`,
        rollMode: game.settings.get('core', 'rollMode')
      });

    } else if (choice === 'success') {
      // Trigger celebration first
      await _triggerFlexCelebration(actor, flexData.rollType, flexData.celebData);

      // Post SUCCESS confirmation for skill check
      const rollLabel = flexData.rollLabel || 'Skill Check';
      ChatMessage.create({
        speaker: ChatMessage.getSpeaker({ actor: actor }),
        content: `<div class="conan-roll flex-result-message" style="border-color: #48bb78; background: linear-gradient(180deg, #1a3d1a 0%, #0d1f0d 100%);"><div class="roll-header" style="background: linear-gradient(180deg, #2d5a2d 0%, #1a3d1a 100%);"><div class="roll-title" style="color: #68d391;">🎯 AUTO-SUCCESS!</div></div><div style="text-align: center; padding: 10px; color: #90EE90;">${rollLabel} automatically succeeds!</div></div>`,
        rollMode: game.settings.get('core', 'rollMode')
      });

    } else if (choice === 'regain') {
      // Sorcery flex: regain spell's LP and/or SP cost (once per spell cast)
      game.conan.lastSpellCostRegained = true;
      const lpRefund = flexData.spellCostLp || 0;
      const spRefund = flexData.spellCostSp || 0;
      const updates = {};

      if (lpRefund > 0) {
        const currentLP = actor.system.lifePoints?.value || 0;
        const maxLP = actor.system.lifePoints?.max || currentLP;
        updates['system.lifePoints.value'] = Math.min(currentLP + lpRefund, maxLP);
      }
      if (spRefund > 0) {
        const currentSP = actor.system.stamina || 0;
        updates['system.stamina'] = currentSP + spRefund;
      }

      if (Object.keys(updates).length > 0) {
        await actor.update(updates);
      }

      // Show floating healing number on caster's token for LP refund
      if (lpRefund > 0) {
        const casterToken = canvas.tokens?.placeables.find(t => t.actor?.id === actor.id);
        if (casterToken) {
          broadcastFloatingDamage(casterToken.id, -lpRefund, false, false, true);
        }
      }

      // Build confirmation message
      const refundParts = [];
      if (lpRefund > 0) refundParts.push(`${lpRefund} LP`);
      if (spRefund > 0) refundParts.push(`${spRefund} SP`);
      const refundText = refundParts.join(' and ');

      ChatMessage.create({
        speaker: ChatMessage.getSpeaker({ actor: actor }),
        content: `<div class="conan-roll flex-result-message" style="border-color: #cc66cc; background: linear-gradient(180deg, #3d1a3d 0%, #1f0d1f 100%);"><div class="roll-header" style="background: linear-gradient(180deg, #5a2d5a 0%, #3d1a3d 100%);"><div class="roll-title" style="color: #ff99ff;">🔮 SORCERY FLEX!</div></div><div style="text-align: center; padding: 10px; color: #ff99ff;">Spell cost regained: ${refundText}</div></div>`,
        rollMode: game.settings.get('core', 'rollMode')
      });

      // Post the normal roll result
      if (flexData.normalContent) {
        ChatMessage.create({
          speaker: ChatMessage.getSpeaker({ actor: actor }),
          content: flexData.normalContent,
          rollMode: game.settings.get('core', 'rollMode')
        });
      }

    } else if (choice === 'squanderTier' || choice === 'squanderGlory' || choice === 'squanderChaos') {
      // Squander flex: delegate to actor sheet to finish the roll
      if (actor.sheet && typeof actor.sheet._finishSquander === 'function') {
        await actor.sheet._finishSquander(choice, flexData);
      }
    }
  });

  // ========== SUMMON SPELL — Make badge draggable for drag-to-canvas ==========
  const summonBadge = html.find('.spell-summon-badge[data-summon]');
  if (summonBadge.length > 0) {
    const badgeEl = summonBadge[0];
    badgeEl.setAttribute('draggable', 'true');
    badgeEl.addEventListener('dragstart', (ev) => {
      const summonInfo = JSON.parse(badgeEl.dataset.summon);
      ev.dataTransfer.setData('text/plain', JSON.stringify({
        type: 'ConanSummon',
        summon: summonInfo
      }));
      ev.dataTransfer.setDragImage(badgeEl, 37, 37);
    });
  }

  // ========== LOTUS MIASMA MAINTENANCE — Yes/No button handlers ==========
  html.find('.miasma-maintain-yes').off('click').on('click', async (event) => {
    const button = event.currentTarget;
    if (button.disabled) return;

    let miasmaData;
    try {
      miasmaData = JSON.parse(button.dataset.miasma);
    } catch (e) {
      console.error("Failed to parse miasma data:", e);
      return;
    }

    const actor = game.actors.get(miasmaData.actorId);
    if (!actor) {
      ui.notifications.warn("Actor not found for Lotus Miasma maintenance.");
      return;
    }

    // Deduct 1 LP
    const currentLP = actor.system.lifePoints?.value ?? 0;
    const newLP = Math.max(0, currentLP - 1);
    await actor.update({ 'system.lifePoints.value': newLP });

    // Roll WitsDie+3 damage
    const witsDie = miasmaData.witsDie || 'd8';
    const damageFormula = `1${witsDie} + 3`;
    const damageRoll = await new Roll(damageFormula).evaluate();
    const totalDamage = damageRoll.total;

    // Store damage for shift+click application
    game.conan = game.conan || {};
    game.conan.lastDamageRoll = totalDamage;
    game.conan.lastDamageEffect = { type: 'lotus-miasma', ignoresAR: true, poisonThreshold: 5 };

    // Disable both buttons
    button.disabled = true;
    button.textContent = 'Maintained';
    button.style.opacity = '0.5';
    const noBtn = button.parentElement.querySelector('.miasma-maintain-no');
    if (noBtn) { noBtn.disabled = true; noBtn.style.opacity = '0.3'; }

    // Post damage result chat card
    const dieResult = damageRoll.terms[0]?.total || damageRoll.total;
    ChatMessage.create({
      content: `<div class="conan-roll"><h3 style="color: #9370DB;">Lotus Miasma — Damage</h3><div class="skill-effect"><em>${actor.name}</em> maintains the toxic cloud.</div><div class="skill-effect">LP: ${currentLP} → ${newLP}</div><div class="damage-result-box" style="font-size: 1.4em; text-align: center; padding: 6px; margin: 6px 0; background: rgba(147, 112, 219, 0.2); border: 1px solid #9370DB; border-radius: 4px; cursor: pointer;" title="Shift+click enemies to apply">${totalDamage}</div><div class="skill-effect" style="color: #888; font-size: 0.85em;">Roll: 1${witsDie}(${dieResult}) + 3 = ${totalDamage} | Ignores AR | 5+ = Poison</div><div class="skill-effect" style="color: #FFD700; font-size: 0.85em;">Shift+click enemy tokens to apply damage</div></div>`,
      speaker: ChatMessage.getSpeaker({ actor: actor }),
      rolls: [damageRoll],
      rollMode: game.settings.get('core', 'rollMode')
    });

    // If LP dropped to 0, auto-dismiss the spell
    if (newLP <= 0) {
      await actor.update({ 'system.lotusMiasmaActive': false });
      ChatMessage.create({
        content: `<div class="conan-roll"><h3 style="color: #ff6b6b;">Lotus Miasma Ends</h3><div class="skill-effect" style="color: #888;"><em>${actor.name} collapses from the strain of the sorcery.</em></div></div>`,
        speaker: ChatMessage.getSpeaker({ alias: 'System' }),
        rollMode: game.settings.get('core', 'rollMode')
      });
    }
  });

  html.find('.miasma-maintain-no').off('click').on('click', async (event) => {
    const button = event.currentTarget;
    if (button.disabled) return;

    let miasmaData;
    try {
      miasmaData = JSON.parse(button.dataset.miasma);
    } catch (e) {
      console.error("Failed to parse miasma data:", e);
      return;
    }

    const actor = game.actors.get(miasmaData.actorId);
    if (!actor) return;

    // Deactivate maintenance
    await actor.update({ 'system.lotusMiasmaActive': false });

    // Disable both buttons
    button.disabled = true;
    button.textContent = 'Ended';
    button.style.opacity = '0.5';
    const yesBtn = button.parentElement.querySelector('.miasma-maintain-yes');
    if (yesBtn) { yesBtn.disabled = true; yesBtn.style.opacity = '0.3'; }

    ChatMessage.create({
      content: `<div class="conan-roll"><h3 style="color: #888;">Lotus Miasma Ends</h3><div class="skill-effect" style="color: #888;"><em>${actor.name} lets the toxic cloud dissipate.</em></div></div>`,
      speaker: ChatMessage.getSpeaker({ actor: actor }),
      rollMode: game.settings.get('core', 'rollMode')
    });
  });
});

/**
 * Trigger flex celebration for an actor
 * @param {Actor} actor - The actor
 * @param {string} rollType - The roll type (melee_hit, damage, etc.)
 * @param {object} celebData - The celebration data
 */
async function _triggerFlexCelebration(actor, rollType, celebData) {
  if (!celebData) return;

  // Broadcast celebration via chat message (syncs to all clients automatically)
  const msg = await ChatMessage.create({
    content: '',
    whisper: [],
    blind: true,
    flags: {
      conan: {
        flexCelebration: true,
        actorId: actor.id,
        rollType: rollType,
        celebData: celebData
      }
    }
  });
  // Delete the message so it doesn't clutter chat - hook already fired
  if (msg) msg.delete();
}

/**
 * Roll damage from a flex choice (HIT! button)
 * @param {Actor} actor - The actor
 * @param {object} damageData - The damage data from the attack
 */
async function _rollDamageFromFlexChoice(actor, damageData) {
  // Build damage formula
  let damageFormula = damageData.damage;

  // Handle WitsDie for spells
  if (damageData.isSpell) {
    const witsAttr = actor.system.attributes.wits;
    damageFormula = damageFormula.replace(/WitsDie/g, `1${witsAttr.die}`);
  }

  // Add damage stat bonus if applicable (using effective value with skill bonuses)
  if (damageData.damageStat) {
    const damageAttr = actor.system.attributes[damageData.damageStat];
    if (damageAttr) {
      // Calculate effective stat value including skill bonuses (Steely Thews, Legendary, etc.)
      const effectiveStatValue = _getEffectiveStatValue(actor, damageData.damageStat);
      damageFormula += ` + ${effectiveStatValue}`;
    }
  }

  // Add origin damage bonus
  if (damageData.damageBonus > 0) {
    damageFormula += ` + ${damageData.damageBonus}`;
  }

  // Add skill-based damage bonuses
  let skillDamageBonus = 0;
  const skillContributions = [];
  const skills = actor.system.skills || {};
  for (const skill of Object.values(skills)) {
    const skillName = skill.name?.toLowerCase() || '';
    if (skillName === 'brawler' && damageData.weaponType === 'melee') {
      skillDamageBonus += 1;
      skillContributions.push({ name: 'Brawler', bonus: 1 });
    }
    if (skillName === 'eagle-eyed' && (damageData.weaponType === 'ranged' || damageData.weaponType === 'thrown')) {
      skillDamageBonus += 1;
      skillContributions.push({ name: 'Eagle-Eyed', bonus: 1 });
    }
    if (skillName === 'eagle-eyed ii' && (damageData.weaponType === 'ranged' || damageData.weaponType === 'thrown')) {
      skillDamageBonus += 1;
      skillContributions.push({ name: 'Eagle-Eyed II', bonus: 1 });
    }
  }
  if (skillDamageBonus > 0) {
    damageFormula += ` + ${skillDamageBonus}`;
  }

  // Add Unseen Strike damage bonus
  if (damageData.unseenStrikeDamageBonus > 0) {
    damageFormula += ` + ${damageData.unseenStrikeDamageBonus}`;
  }

  // Add Bane Weapon damage bonus (die bonus for melee/thrown attacks)
  const baneWeaponBuff = actor.system.baneWeaponBuff || null;
  let baneWeaponDie = null;
  if (baneWeaponBuff && (damageData.weaponType === 'melee' || damageData.weaponType === 'thrown')) {
    baneWeaponDie = baneWeaponBuff.damageDie;
    damageFormula += ` + ${baneWeaponDie}`;
    skillContributions.push({ name: 'Bane Weapon', bonus: baneWeaponDie, type: 'Enchanted', isBaneWeapon: true, casterName: baneWeaponBuff.casterName });
  }

  // Roll the damage
  const damageRoll = new Roll(damageFormula, actor.getRollData());
  await damageRoll.evaluate();

  // Apply Impaling Throw double damage
  let impalingThrowDamage = null;
  if (damageData.impalingThrow) {
    impalingThrowDamage = damageRoll.total * 2;
  }

  // Apply Snake Arrow bonus +1d6
  let snakeArrowBonus = 0;
  if (damageData.snakeArrow) {
    const snakeRoll = new Roll('1d6');
    await snakeRoll.evaluate();
    snakeArrowBonus = snakeRoll.total;
  }

  // Apply Bloody Talons bonus +1d6
  let bloodyTalonsBonus = 0;
  if (damageData.bloodyTalons) {
    const talonsRoll = new Roll('1d6');
    await talonsRoll.evaluate();
    bloodyTalonsBonus = talonsRoll.total;
  }

  // Apply Uncanny Reach bonus +1 flat
  const uncannyReachBonus = damageData.uncannyReach ? 1 : 0;

  // Roll flex die for damage
  const sheet = actor.sheet;
  let flexData = { die: 'd6', result: 0, triggered: false };
  if (sheet && sheet._rollFlexDie) {
    const flexType = damageData.weaponType === 'sorcery' ? 'spell_damage' :
                     damageData.weaponType === 'melee' ? 'melee_damage' : 'ranged_damage';
    flexData = await sheet._rollFlexDie(flexType, true); // Pass true to suppress auto-celebration
  }

  // Calculate massive damage if flex triggered
  let massiveDamage = null;
  if (flexData.triggered) {
    const dieMatch = damageData.damage.match(/(\d+)?d(\d+)/i);
    if (dieMatch) {
      massiveDamage = damageRoll.total + parseInt(dieMatch[2]);
    } else {
      massiveDamage = damageRoll.total * 2;
    }
  }

  const finalDamage = (damageData.impalingThrow ? impalingThrowDamage : damageRoll.total) + snakeArrowBonus + bloodyTalonsBonus + uncannyReachBonus;
  const tokenImg = actor.prototypeToken?.texture?.src || actor.img || 'icons/svg/mystery-man.svg';

  // Build breakdown data for expandable panel
  const damageDieRoll = damageRoll.terms[0]?.total || damageRoll.total;
  const breakdownLines = [];
  // For WitsDie spells (e.g., Lotus Miasma "WitsDie+3"), use resolved formula for breakdown
  const isWitsDieSpell = /WitsDie/i.test(damageData.damage);
  const breakdownFormula = isWitsDieSpell ? damageFormula : damageData.damage;
  // Split die from static bonus in damage formula (e.g., "1d8+2" → die "1d8", static "+2")
  const diePartMatch = breakdownFormula.match(/^(\d*d\d+)(.*)/i);
  const dieOnly = diePartMatch ? diePartMatch[1] : breakdownFormula;
  const staticPart = diePartMatch ? diePartMatch[2].trim() : '';
  breakdownLines.push({ label: isWitsDieSpell ? 'Wits Die' : 'Base Damage', value: dieOnly, roll: damageDieRoll });
  if (staticPart) {
    breakdownLines.push({ label: 'Spell Bonus', value: staticPart });
  }
  if (damageData.damageStat) {
    const effectiveStatValue = _getEffectiveStatValue(actor, damageData.damageStat);
    breakdownLines.push({ label: damageData.damageStat.charAt(0).toUpperCase() + damageData.damageStat.slice(1), value: `+${effectiveStatValue}` });
  }
  if (damageData.damageBonus > 0) breakdownLines.push({ label: 'Origin Bonus', value: `+${damageData.damageBonus}` });
  for (const contrib of skillContributions) {
    breakdownLines.push({ label: contrib.name, value: `+${contrib.bonus}`, isSkill: true });
  }
  if (damageData.impalingThrow) breakdownLines.push({ label: 'Impaling Throw', value: '× 2', isSkill: true });
  if (damageData.snakeArrow) breakdownLines.push({ label: 'Snake Arrow', value: `+${snakeArrowBonus} (1d6)`, isSkill: true });
  if (damageData.bloodyTalons) breakdownLines.push({ label: 'Bloody Talons', value: `+${bloodyTalonsBonus} (1d6)`, isSkill: true });
  if (damageData.uncannyReach) breakdownLines.push({ label: 'Uncanny Reach', value: '+1', isSkill: true });

  let breakdownHtml = `<div class="damage-breakdown" style="display: none;">`;
  breakdownHtml += `<div class="breakdown-header">Damage Breakdown</div>`;
  for (const line of breakdownLines) {
    const skillClass = line.isSkill ? 'breakdown-skill' : '';
    if (line.roll !== undefined) {
      breakdownHtml += `<div class="breakdown-line ${skillClass}"><span class="breakdown-label">${line.label}</span><span class="breakdown-value">${line.value} → ${line.roll}</span></div>`;
    } else {
      breakdownHtml += `<div class="breakdown-line ${skillClass}"><span class="breakdown-label">${line.label}</span><span class="breakdown-value">${line.value}</span></div>`;
    }
  }
  breakdownHtml += `<div class="breakdown-total"><span class="breakdown-label">Total</span><span class="breakdown-value">${finalDamage}</span></div>`;
  breakdownHtml += `</div>`;

  // Get owner color
  let ownerColor = '#888888';
  for (const [userId, level] of Object.entries(actor.ownership)) {
    if (level === CONST.DOCUMENT_OWNERSHIP_LEVELS.OWNER) {
      const user = game.users.get(userId);
      if (user && !user.isGM && user.color) {
        ownerColor = user.color;
        break;
      }
    }
  }

  // If flex triggered on damage, show flex choice card
  if (flexData.triggered) {
    // Get celebration data
    const celebData = _getFlexCelebrationData(actor, damageData.weaponType === 'sorcery' ? 'spell_damage' :
                      damageData.weaponType === 'melee' ? 'melee_damage' : 'ranged_damage');

    const dieMatch = damageData.damage.match(/(\d+)?d(\d+)/i);
    const maxDieValue = dieMatch ? parseInt(dieMatch[2]) : finalDamage;

    const flexChoiceData = {
      actorId: actor.id,
      rollType: damageData.weaponType === 'sorcery' ? 'spell_damage' :
                damageData.weaponType === 'melee' ? 'melee_damage' : 'ranged_damage',
      celebData: celebData,
      baseDamage: finalDamage,
      massiveDamage: finalDamage + maxDieValue,
      maxDieValue: maxDieValue,
      normalContent: _buildNormalDamageContent(actor, damageData, damageRoll, flexData, finalDamage, tokenImg, ownerColor, breakdownHtml, !!baneWeaponDie),
      breakdownHtml: breakdownHtml,
      spellCostLp: damageData.spellCostLp || 0,
      spellCostSp: damageData.spellCostSp || 0
    };

    const flexCardContent = _buildFlexChoiceCard(actor, 'damage', flexData, flexChoiceData, tokenImg, ownerColor);

    ChatMessage.create({
      speaker: ChatMessage.getSpeaker({ actor: actor }),
      content: flexCardContent,
      rolls: [damageRoll, flexData.roll],
      rollMode: game.settings.get('core', 'rollMode')
    });
  } else {
    // No flex - show normal damage card
    const content = _buildNormalDamageContent(actor, damageData, damageRoll, flexData, finalDamage, tokenImg, ownerColor, breakdownHtml, !!baneWeaponDie);

    ChatMessage.create({
      speaker: ChatMessage.getSpeaker({ actor: actor }),
      content: content,
      rolls: [damageRoll, flexData.roll],
      rollMode: game.settings.get('core', 'rollMode')
    });
  }

}

/**
 * Get flex celebration data for an actor
 */
function _getFlexCelebrationData(actor, rollType) {
  const flexCeleb = game.settings.get('conan', 'flexCelebrations') || {};

  const rollTypeToCelebType = {
    'skill': 'skill', 'melee_hit': 'attack', 'ranged_hit': 'attack',
    'melee_damage': 'damage', 'ranged_damage': 'damage',
    'spell_hit': 'spell', 'spell_damage': 'spellDamage', 'death': 'deathSave',
    'attack': 'attack', 'damage': 'damage', 'check': 'skill'
  };
  const celebType = rollTypeToCelebType[rollType];

  if (flexCeleb?.enabled && celebType) {
    const players = Array.isArray(flexCeleb.players) ? flexCeleb.players : [];
    if (players.includes(actor.id)) {
      const celebrations = flexCeleb.celebrations || {};
      const playerCelebs = Array.isArray(celebrations[actor.id]) ? celebrations[actor.id] : [];
      const celeb = playerCelebs.find(c => c.type === celebType && c.enabled !== false);
      if (celeb) {
        return celeb;
      }
    }
  }
  return null;
}

/**
 * Build flex choice card HTML
 */
function _buildFlexChoiceCard(actor, type, flexData, choiceData, tokenImg, ownerColor) {
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
    }
  };

  const style = typeStyles[type] || typeStyles.skill;
  const dataStr = JSON.stringify(choiceData).replace(/"/g, '&quot;');

  let content = `<div class="conan-roll flex-choice-card" style="border-color: ${style.borderColor}; background: ${style.gradient};">`;
  content += `<div class="roll-header" style="background: ${style.headerGradient};">`;
  content += `<img src="${tokenImg}" class="token-img" alt="${actor.name}">`;
  content += `<div class="roll-title" style="color: ${style.accentColor};">${style.icon} ${style.title}</div>`;
  content += `</div>`;

  // Choice buttons
  content += `<div class="flex-choice-buttons" style="display: flex; justify-content: center; gap: 8px; padding: 10px; flex-wrap: wrap;">`;

  // Stamina button (always available)
  content += `<button type="button" class="flex-choice-btn stamina-choice" data-choice="stamina" data-flex-data="${dataStr}" style="background: linear-gradient(180deg, #2d5a2d 0%, #1a3d1a 100%); color: #90EE90; border: 2px solid #4CAF50; padding: 10px 14px; border-radius: 8px; cursor: pointer; font-weight: bold; font-size: 15px; min-width: 80px; transition: all 0.2s;">`;
  content += `+1 Stamina!</button>`;

  // Type-specific effect button
  if (type === 'attack') {
    content += `<button type="button" class="flex-choice-btn effect-choice" data-choice="hit" data-flex-data="${dataStr}" style="background: linear-gradient(180deg, #8b0000 0%, #5c0000 100%); color: #FFD700; border: 2px solid #E10600; padding: 10px 14px; border-radius: 8px; cursor: pointer; font-weight: bold; font-size: 15px; min-width: 80px; transition: all 0.2s;">`;
    content += `⚔️ HIT!</button>`;
  } else if (type === 'damage') {
    content += `<button type="button" class="flex-choice-btn effect-choice" data-choice="massive" data-flex-data="${dataStr}" style="background: linear-gradient(180deg, #8b0000 0%, #5c0000 100%); color: #FFD700; border: 2px solid #E10600; padding: 10px 14px; border-radius: 8px; cursor: pointer; font-weight: bold; font-size: 15px; min-width: 80px; transition: all 0.2s;">`;
    content += `💥 Massive! (${choiceData.massiveDamage})</button>`;
    // Sorcery flex: regain spell cost (only if not already regained this cast)
    if ((choiceData.spellCostLp > 0 || choiceData.spellCostSp > 0) && !game.conan?.lastSpellCostRegained) {
      const costParts = [];
      if (choiceData.spellCostLp > 0) costParts.push(`${choiceData.spellCostLp} LP`);
      if (choiceData.spellCostSp > 0) costParts.push(`${choiceData.spellCostSp} SP`);
      content += `<button type="button" class="flex-choice-btn effect-choice" data-choice="regain" data-flex-data="${dataStr}" style="background: linear-gradient(180deg, #5a2d5a 0%, #3d1a3d 100%); color: #ff99ff; border: 2px solid #cc66cc; padding: 10px 14px; border-radius: 8px; cursor: pointer; font-weight: bold; font-size: 15px; min-width: 80px; transition: all 0.2s;">`;
      content += `🔮 Regain ${costParts.join(' + ')}</button>`;
    }
  }

  content += `</div>`;
  content += `</div>`;

  return content;
}

/**
 * Build normal damage content (for stamina choice fallback)
 */
function _buildNormalDamageContent(actor, damageData, damageRoll, flexData, finalDamage, tokenImg, ownerColor, breakdownHtml = '', hasBaneWeapon = false) {
  const baneAttr = hasBaneWeapon ? ' data-bane-weapon="true"' : '';
  let content = `<div class="conan-roll damage-roll" style="border-color: ${ownerColor};">`;
  content += `<div class="roll-header">`;
  content += `<img src="${tokenImg}" class="token-img" alt="${actor.name}">`;
  content += `<div class="roll-title">${damageData.weaponName} Damage</div>`;
  content += `</div>`;

  if (damageData.impalingThrow) {
    content += `<div class="roll-result-wrapper">`;
    content += `<div class="damage-result-box impaling-damage clickable-breakdown"${baneAttr} style="background: linear-gradient(180deg, #8b0000 0%, #5c0000 100%); border-color: #ff4444; font-size: 28px; cursor: pointer;">${finalDamage}</div>`;
    content += `</div>`;
  } else if (damageData.bloodyTalons) {
    content += `<div class="roll-result-wrapper">`;
    content += `<div class="damage-result-box clickable-breakdown"${baneAttr} style="background: linear-gradient(180deg, #8b0000 0%, #5c0000 100%); border-color: #C43C3C; font-size: 28px; cursor: pointer;">${finalDamage}</div>`;
    content += `</div>`;
  } else if (damageData.uncannyReach) {
    content += `<div class="roll-result-wrapper">`;
    content += `<div class="damage-result-box clickable-breakdown"${baneAttr} style="background: linear-gradient(180deg, #5c0020 0%, #3a0010 100%); border-color: #b4003c; font-size: 28px; cursor: pointer;">${finalDamage}</div>`;
    content += `</div>`;
  } else if (damageData.snakeArrow) {
    content += `<div class="roll-result-wrapper">`;
    content += `<div class="damage-result-box clickable-breakdown"${baneAttr} style="background: linear-gradient(180deg, #4a0080 0%, #2d004d 100%); border-color: #9040ff; font-size: 28px; cursor: pointer;">${finalDamage}</div>`;
    content += `</div>`;
  } else {
    content += `<div class="roll-result-wrapper">`;
    content += `<div class="damage-result-box clickable-breakdown"${baneAttr} style="cursor: pointer;">${finalDamage}</div>`;
    content += `</div>`;
  }
  // SP damage boost buttons (+1d4 / +2d4)
  content += `<div class="sp-boost-row">`;
  content += `<button type="button" class="sp-dmg-boost-btn" data-dice="1" data-cost="1" data-actor-id="${damageData.actorId}">+1</button>`;
  content += `<button type="button" class="sp-dmg-boost-btn" data-dice="2" data-cost="2" data-actor-id="${damageData.actorId}">+2</button>`;
  content += `</div>`;
  content += breakdownHtml;

  content += `<div class="flex-result">`;
  content += `<strong>Flex Die (${flexData.die}):</strong> ${flexData.result}`;
  content += `</div>`;

  content += `</div>`;
  return content;
}

/**
 * Set up the shift+click handler for applying damage to tokens
 * Overrides Token._onClickLeft to intercept shift+click
 */
function setupDamageApplicationHandler() {
  // Override Token single-click handler to intercept shift+click
  const originalOnClickLeft = Token.prototype._onClickLeft;
  Token.prototype._onClickLeft = function(event) {
    // Check for shift key - try multiple methods
    const isShiftKeyboard = game.keyboard?.isModifierActive?.(KeyboardManager.MODIFIER_KEYS.SHIFT);
    const isShiftEvent = event?.shiftKey || event?.data?.originalEvent?.shiftKey;
    const isShift = isShiftKeyboard || isShiftEvent;

    // If shift is held, apply damage instead of normal click behavior
    // But skip if spell targeting is active — let the click through for targeting hooks
    if (isShift && !game.conan?.spellTargetingActive) {
      event.preventDefault?.();
      event.stopPropagation?.();
      applyDamageToToken(this);
      return;
    }
    // Otherwise, call original handler
    return originalOnClickLeft.call(this, event);
  };
}

/**
 * Apply the last damage roll to a token
 * @param {Token} token - The token to apply damage to
 */
async function applyDamageToToken(token) {
  try {
    // Safety check for token
    if (!token || !token.document) {
      console.error("Conan | applyDamageToToken called with invalid token");
      return;
    }

    // Skip damage application if a spell targeting mode is active
    if (game.conan?.spellTargetingActive) return;

    // === MESMERISM: No-damage effect — intercept before damage check ===
    const mesmerismEffect = game.conan?.lastDamageEffect;
    if (mesmerismEffect?.type === 'mesmerism') {
      game.conan.lastDamageEffect = null;
      game.conan.lastDamageRoll = null;

      if (!game.user.isGM) return;

      const enemyData = token.document.getFlag('conan', 'enemyData');
      if (!enemyData) {
        ui.notifications.warn('Mesmerism can only target enemies with cards.');
        return;
      }

      const isDominate = mesmerismEffect.permanent || false;

      // Apply mesmerism flag on the target actor
      if (token.actor) {
        await token.actor.setFlag('conan', 'mesmerismControl', {
          active: true,
          casterActorId: mesmerismEffect.casterActorId,
          casterUserId: mesmerismEffect.casterUserId,
          roundCount: isDominate ? 3 : 0,
          permanent: isDominate
        });
      }

      // Store caster-side flag only for non-permanent (caster needs to maintain)
      // Dominate = permanent, caster is immediately free to cast again
      const casterActor = game.actors.get(mesmerismEffect.casterActorId);
      if (!isDominate && casterActor) {
        await casterActor.setFlag('conan', 'mesmerismCaster', {
          active: true,
          targetTokenId: token.document.id,
          targetName: enemyData.name || token.name
        });
      }

      // Add semi-transparent icon overlay on the token
      const mesmerismIcon = 'systems/conan/images/icons/mesmerism_icon.png';
      const currentEffects = token.document.effects || [];
      if (!currentEffects.includes(mesmerismIcon)) {
        await token.document.update({ effects: [...currentEffects, mesmerismIcon] });
      }

      // Grant controlling player ownership of the token
      if (mesmerismEffect.casterUserId && token.actor) {
        await token.actor.update({
          [`ownership.${mesmerismEffect.casterUserId}`]: CONST.DOCUMENT_OWNERSHIP_LEVELS.OWNER
        });
      }

      // Chat message
      const casterName = casterActor?.name || 'Sorcerer';
      if (isDominate) {
        ChatMessage.create({
          content: `<div class="conan-enemy-roll ability-use"><div class="roll-header" style="color: #9400D3;">Mesmerism — DOMINATE</div><div class="roll-section ability-desc"><strong>${casterName}</strong> utterly dominates <strong style="color: #9400D3;">${enemyData.name || token.name}</strong>!<br><em>The target's will is permanently shattered. They are nothing more than a puppet.</em></div></div>`,
          speaker: { alias: 'GM' }
        });
      } else {
        ChatMessage.create({
          content: `<div class="conan-enemy-roll ability-use"><div class="roll-header" style="color: #9400D3;">Mesmerism</div><div class="roll-section ability-desc"><strong>${casterName}</strong> takes control of <strong style="color: #9400D3;">${enemyData.name || token.name}</strong>!<br><em>The target's eyes glaze over, their will no longer their own.</em></div></div>`,
          speaker: { alias: 'GM' }
        });
      }

      return;
    }

    // Check if we have a damage value
    if (!game.conan?.lastDamageRoll) {
      ui.notifications.warn("No damage roll to apply. Roll damage first!");
      return;
    }

    let damage = game.conan.lastDamageRoll;
    const isHealing = damage < 0;
    let healAmount = Math.abs(damage);

    // Permission check: GM only
    if (!game.user.isGM) {
      return; // Silently ignore for non-GMs
    }

    // Get token data - check flags first for GM Tools enemies, then actor
    const enemyData = token.document.getFlag('conan', 'enemyData');
    const actor = token.actor;

  // ==========================================
  // ARMOR & BUFF-BASED DAMAGE REDUCTION
  // ==========================================
  // Check for AR (Armor Rating) and active buffs that reduce incoming physical damage
  const ignoresAR = game.conan?.lastDamageEffect?.ignoresAR === true;
  let damageReduction = 0;
  let reductionSources = [];

  if (!ignoresAR) {
    // Beast form: use beast's AR (already includes player AR + bonus)
    if (enemyData?.isBeastForm && enemyData.armorRating > 0) {
      damageReduction += enemyData.armorRating;
      reductionSources.push(`Beast Armor (-${enemyData.armorRating})`);
    } else {
      // Get base AR from actor's defense (equipped armor), reduced by Dirty Fighter debuff and Eagle Eye
      let baseAR = actor?.system?.defense?.ar || 0;
      const dirtyDebuff = actor?.getFlag('conan', 'dirtyFighterDebuff');
      if (dirtyDebuff?.stacks > 0 && baseAR > 0) {
        const reducedAR = Math.max(0, baseAR - dirtyDebuff.stacks);
        reductionSources.push(`Armor (-${reducedAR}, base ${baseAR} − ${dirtyDebuff.stacks} Dirty Fighter)`);
        baseAR = reducedAR;
      }
      // Eagle Eye: ranged attacks from steppe riders ignore 2 AR
      const eagleEyeAttack = game.conan?.lastEnemyAttack;
      if (eagleEyeAttack?.threatTraits?.includes('eagleeye') && eagleEyeAttack.attackType === 'ranged' && baseAR > 0) {
        const eagleReduction = Math.min(2, baseAR);
        baseAR = Math.max(0, baseAR - eagleReduction);
        reductionSources.push(`Eagle Eye (-${eagleReduction} AR pierced)`);
      }
      if (baseAR > 0) {
        damageReduction += baseAR;
        if (!dirtyDebuff?.stacks) reductionSources.push(`Armor (-${baseAR})`);
      }

      // For GM Tools enemies, check enemyData for AR (stored as armorRating during spawn)
      const enemyAR = enemyData?.armorRating || enemyData?.ar || 0;
      if (enemyAR > 0) {
        // Only add if we didn't already get AR from actor
        if (baseAR === 0) {
          damageReduction += enemyAR;
          reductionSources.push(`Armor (-${enemyAR})`);
        }
      }
    }

    // Check actor's buffsDebuffs for damage reduction buffs
    const buffsDebuffs = actor?.system?.buffsDebuffs || {};

    // armorUp: +3 AR (reduces physical damage by 3)
    if (buffsDebuffs.armorUp) {
      damageReduction += 3;
      reductionSources.push('Body of Living Iron (-3)');
    }
  } else {
    reductionSources.push('AR Ignored (Lotus Miasma)');
  }

  // Apply damage reduction (only for damage, not healing)
  // Minimum damage is always 1 - any hit deals at least 1 damage
  const originalDamage = damage;
  if (!isHealing && damageReduction > 0) {
    damage = Math.max(1, damage - damageReduction);
    if (damage !== originalDamage) {
      console.log(`Conan | Damage reduced: ${originalDamage} -> ${damage} (${reductionSources.join(', ')})`);
    }
  }

  // ==========================================
  // DEMONIC WARD: 50% non-sorcery damage reduction (after AR)
  // ==========================================
  const hasDemonicWard = actor?.system?.buffsDebuffs?.demonicWard || actor?.getFlag('conan', 'demonicWard');
  if (!isHealing && damage > 0 && hasDemonicWard) {
    // Check if damage source is sorcery — sorcery bypasses the ward
    const isSorceryDamage = game.conan?.lastEnemyAttack?.attackType === 'sorcery' ||
      game.conan?.lastDamageEffect?.type != null;
    if (!isSorceryDamage) {
      const preDemWard = damage;
      damage = Math.max(1, Math.floor(damage / 2));
      reductionSources.push(`Demonic Ward (½ → ${damage})`);
      console.log(`Conan | Demonic Ward: ${preDemWard} → ${damage}`);
    }
  }

  // ==========================================
  // TOUGH TRAIT CHECK (Threat Engine)
  // ==========================================
  if (!isHealing && enemyData?.threatTraits?.includes('tough') && damage <= 2) {
    ChatMessage.create({
      content: `<div class="conan-enemy-roll ability-use"><div class="roll-header" style="color: #e0c070;">Too Tough!</div><div class="roll-section ability-desc"><strong>${token.name}</strong> is too Tough to go down! (${damage} damage ignored)</div></div>`,
      speaker: { alias: 'GM' }
    });
    broadcastFloatingDamage(token.id, 0, false, false, false);
    return;
  }

  // ==========================================
  // SWIFT TRAIT CHECK (Threat Engine — Steppe Riders)
  // ==========================================
  // Once per round: negate non-spell damage, prompt reroll. Refreshes on rider's turn.
  const isSpellDamage = game.conan?.lastDamageEffect?.type != null;
  if (!isHealing && enemyData?.threatTraits?.includes('swift') && !isSpellDamage) {
    const swiftUsed = token.document.getFlag('conan', 'swiftUsed');
    if (!swiftUsed) {
      await token.document.setFlag('conan', 'swiftUsed', true);
      const swiftName = enemyData.chatName || enemyData.name || token.name;

      const SWIFT_FLAVOR = [
        `${swiftName} wheels away — your blade cuts air!`,
        `${swiftName}'s mount darts aside at the last instant!`,
        `Too slow! ${swiftName} is already gone!`,
        `${swiftName} ducks low in the saddle — the strike whistles overhead!`,
      ];

      ChatMessage.create({
        content: `
          <div class="enemy-msg theme-human">
            <div class="enemy-msg-header">
              <div class="msg-icon"><i class="fas fa-wind"></i></div>
              <div class="msg-titles"><div class="msg-name">Swift!</div></div>
            </div>
            <div class="enemy-msg-body">
              <div class="enemy-msg-flavor">${SWIFT_FLAVOR[Math.floor(Math.random() * SWIFT_FLAVOR.length)]}</div>
              <div style="color: #87CEEB; text-align: center; margin-top: 4px; font-weight: bold;">Attack again!</div>
            </div>
          </div>`,
        speaker: { alias: enemyData.name }
      });

      broadcastFloatingDamage(token.id, 0, false, false, false);
      return;
    }
  }

  // ==========================================
  // HEALING BONUSES (Origin & Skills)
  // ==========================================
  let healingBonus = 0;
  let healingBonusSources = [];
  const originalHealAmount = healAmount;

  if (isHealing && actor) {
    // Check origin for LP recovery bonus (Blood of Jhebbal Sag: +2 LP when regaining LP)
    const originId = actor.system?.origin?.id;
    if (originId === 'from-the-blood-of-jhebbal-sag') {
      healingBonus += 2;
      healingBonusSources.push('Blood of Jhebbal Sag (+2)');
    }

    // Check for Hardy skill (+2 LP when regaining LP)
    const skills = actor.system?.skills || {};
    for (const skill of Object.values(skills)) {
      const skillName = skill.name?.toLowerCase() || '';
      if (skillName === 'hardy') {
        healingBonus += 2;
        healingBonusSources.push('Hardy (+2)');
        break;
      }
    }

    // Apply healing bonus
    if (healingBonus > 0) {
      healAmount += healingBonus;
      console.log(`Conan | Healing increased: ${originalHealAmount} -> ${healAmount} (${healingBonusSources.join(', ')})`);
    }
  }

  let isDead = false;
  let isWounded = false;
  let newHP = 0;
  let tokenType = 'unknown';

  // Store previous state for undo
  const prevState = {
    tokenId: token.id,
    sceneId: canvas.scene.id,
    damage: damage,
    wounded: token.document.getFlag('conan', 'wounded') || false,
    dead: token.document.getFlag('conan', 'dead') || false,
    tint: token.document.texture.tint,
    alpha: token.document.alpha,
    hp: null,
    isGMToken: !!enemyData
  };

  if (enemyData) {
    // GM Tools enemy token (type npc2 with enemyData flag)
    tokenType = enemyData.type; // 'Minion' or 'Antagonist'

    if (tokenType === 'Minion') {
      // Minion threshold logic - no LP tracking
      const threshold = enemyData.threshold || 5;
      const isAlreadyWounded = token.document.getFlag('conan', 'wounded') || false;
      console.log(`%c[LP DAMAGE] %c${token.name}%c (Minion) — Threshold: ${threshold} | Damage: ${damage} | Already wounded: ${isAlreadyWounded}`, 'color: #ff4444; font-weight: bold;', 'color: #fff; font-weight: bold;', 'color: #ff4444;');
      prevState.hp = null; // Minions don't track HP

      if (isAlreadyWounded) {
        // Already wounded - any hit kills (unless Armored extra life)
        const hasArmoredLife = token.document.getFlag('conan', 'armoredLife');
        if (hasArmoredLife) {
          // Consume armored life — survive this hit
          await token.document.setFlag('conan', 'armoredLife', false);
          ChatMessage.create({
            content: `<div class="conan-enemy-roll ability-use"><div class="roll-header" style="color: #e0c070;">Armored!</div><div class="roll-section ability-desc"><strong>${token.name}</strong>'s armor absorbs the killing blow!</div></div>`,
            speaker: { alias: 'GM' }
          });
        } else {
          isDead = true;
          await token.document.setFlag('conan', 'dead', true);
        }
      } else if (damage >= threshold) {
        // Damage meets/exceeds threshold (unless Armored extra life)
        const hasArmoredLife = token.document.getFlag('conan', 'armoredLife');
        if (hasArmoredLife) {
          // Consume armored life — wound instead of kill
          await token.document.setFlag('conan', 'armoredLife', false);
          isWounded = true;
          await token.document.setFlag('conan', 'wounded', true);
          ChatMessage.create({
            content: `<div class="conan-enemy-roll ability-use"><div class="roll-header" style="color: #e0c070;">Armored!</div><div class="roll-section ability-desc"><strong>${token.name}</strong>'s armor absorbs the killing blow! They are wounded but still standing.</div></div>`,
            speaker: { alias: 'GM' }
          });
        } else {
          isDead = true;
          await token.document.setFlag('conan', 'dead', true);
        }
      } else {
        // Damage below threshold - mark as wounded
        isWounded = true;
        await token.document.setFlag('conan', 'wounded', true);
      }
    } else {
      // Antagonist - has LP, update via token.actor (synthetic actor for unlinked tokens)
      if (actor?.system?.lifePoints) {
        const currentHP = actor.system.lifePoints.value ?? actor.system.lifePoints.max ?? enemyData.lifePoints;
        const maxHP = actor.system.lifePoints.max ?? enemyData.lifePoints ?? currentHP;
        prevState.hp = currentHP;

        if (isHealing) {
          // Healing: add HP, cap at max
          newHP = Math.min(maxHP, currentHP + healAmount);
        } else {
          // Damage: subtract HP, floor at 0
          newHP = Math.max(0, currentHP - damage);
        }

        // Update the synthetic actor's LP (this updates the token's bar)
        console.log(`%c[LP DAMAGE] %c${token.name}%c — HP: ${currentHP} → ${newHP} (max: ${maxHP}) | ${isHealing ? 'Healed +' + healAmount : 'Took ' + damage + ' dmg'}`, 'color: #ff4444; font-weight: bold;', 'color: #fff; font-weight: bold;', 'color: #ff4444;');
        console.log(`%c  [LP WRITE] %cactor.update('system.lifePoints.value': ${newHP})`, 'color: #ff9944;', 'color: #ffcc88;');
        await actor.update({ 'system.lifePoints.value': newHP });

        if (newHP <= 0 && !isHealing) {
          // DEATHLESS: redirect killing blow to a living skeleton
          let deathlessRedirected = false;
          if (enemyData?.threatTraits?.includes('deathless')) {
            const necroId = token.document.id;
            const livingSkel = canvas.scene.tokens.find(t => {
              return t.getFlag('conan', 'summonedBy') === necroId && !t.getFlag('conan', 'dead');
            });
            if (livingSkel) {
              deathlessRedirected = true;
              // Restore necromancer to pre-damage HP
              newHP = currentHP;
              await actor.update({ 'system.lifePoints.value': currentHP });
              // Kill the skeleton
              await livingSkel.setFlag('conan', 'dead', true);
              await livingSkel.setFlag('conan', 'wounded', true);
              await livingSkel.update({ 'texture.tint': '#ff0000', alpha: 0.5 });
              const skelData = livingSkel.getFlag('conan', 'enemyData');
              const skelName = skelData?.chatName || skelData?.name || livingSkel.name;
              const necroName = enemyData.chatName || enemyData.name;
              // Floating damage on skeleton instead
              broadcastFloatingDamage(livingSkel.id, damage, true, false, false);
              ChatMessage.create({
                content: `<div class="enemy-msg theme-undead"><div class="enemy-msg-header"><div class="msg-icon"><i class="fas fa-shield-alt"></i></div><div class="msg-titles"><div class="msg-name">Deathless!</div></div></div><div class="enemy-msg-body"><div class="enemy-msg-flavor">${necroName} should have died — but ${skelName} crumbles to dust in their place!</div></div></div>`,
                speaker: { alias: enemyData.name }
              });
              console.log(`%c[DEATHLESS] ${necroName} survived — ${skelName} dies instead`, 'color: #9400D3; font-weight: bold;');
            }
          }
          if (!deathlessRedirected) {
            isDead = true;
            await token.document.setFlag('conan', 'dead', true);
            console.log(`%c  [LP WRITE] %ctoken.setFlag('dead', true) — KILLED`, 'color: #ff9944;', 'color: #ff4444; font-weight: bold;');
          }
        }
      }
    }
  } else if (actor) {
    // Regular actor token (PC or NPC - not from GM Tools)
    tokenType = actor.type;

    // Check for lifePoints in system data - character2 uses system.lifePoints.value
    const lpData = actor.system?.lifePoints;
    if (lpData !== undefined && lpData !== null) {
      // Get current LP - character2 and npc2 use {value, max} object
      let currentLP;
      let maxLP = 0;
      if (typeof lpData === 'object') {
        currentLP = lpData.value ?? lpData.max ?? 0;
        maxLP = lpData.max ?? currentLP;
        prevState.hasValueProp = true;
      } else if (typeof lpData === 'number') {
        currentLP = lpData;
        maxLP = lpData;
        prevState.hasValueProp = false;
      } else {
        ui.notifications.warn(`${token.name} has invalid life points data.`);
        return;
      }

      prevState.hp = currentLP;

      if (isHealing) {
        // Healing: add HP, cap at max
        newHP = Math.min(maxLP, currentLP + healAmount);
      } else {
        // Damage: subtract HP, floor at 0
        newHP = Math.max(0, currentLP - damage);
      }

      // Update LP on the actor (works for both linked and unlinked tokens)
      try {
        if (prevState.hasValueProp) {
          await actor.update({ 'system.lifePoints.value': newHP });
        } else {
          await actor.update({ 'system.lifePoints': newHP });
        }
      } catch (e) {
        console.error(`Conan | ERROR updating actor:`, e);
        ui.notifications.error(`Failed to update ${token.name}'s life points: ${e.message}`);
        return;
      }

      if (newHP <= 0 && !isHealing) {
        isDead = true;
      }
    } else {
      ui.notifications.warn(`${token.name} has no life points to damage.`);
      return;
    }
  } else {
    ui.notifications.warn("Cannot determine token type for damage application.");
    return;
  }

  // Healing sorcery clears poison on PC targets
  if (isHealing && actor && (actor.type === 'character2')) {
    const poisonEffects = actor.getFlag('conan', 'poisonEffects');
    if (poisonEffects?.active) {
      await actor.unsetFlag('conan', 'poisonEffects');
      await actor.update({ 'system.conditions.poisoned': false });
      ChatMessage.create({
        content: `<div class="conan-roll" style="border-color: #32CD32;">
          <h3 style="color: #90EE90;">Poison Cured</h3>
          <div class="skill-effect"><em>The healing magic burns the venom from ${actor.name}'s blood.</em></div>
        </div>`,
        speaker: ChatMessage.getSpeaker({ alias: 'System' })
      });
    }
  }

  // Beast Form: auto-dismiss on 0 LP instead of marking dead
  if (enemyData?.isBeastForm && newHP <= 0 && !isHealing && actor) {
    isDead = false; // Don't mark player token as dead
    await token.document.unsetFlag('conan', 'dead'); // Clear if set
    const bfData = actor.system.beastFormData;
    if (bfData) {
      const originalMax = bfData.originalMaxLP || 0;
      await actor.update({
        'system.beastFormData': null,
        'system.lifePoints.maxOverride': null,
        'system.lifePoints.value': 0,
        'system.buffsDebuffs.beastForm': false
      });
      const tokenDoc = actor.getActiveTokens(false, true)?.[0];
      if (tokenDoc) {
        await tokenDoc.update({
          'texture.src': bfData.originalTokenImg || actor.img,
          'flags.conan.-=enemyData': null
        });
      }
      ChatMessage.create({
        content: `<div class="conan-enemy-roll ability-use"><div class="roll-header" style="color: #D4A017;">Beast Form Shattered</div><div class="roll-section ability-desc"><strong>${actor.name}</strong> is struck down in beast form and reverts, broken and bloodied.</div></div>`,
        speaker: ChatMessage.getSpeaker({ alias: 'System' })
      });
    }
  }

  // Mesmerism: damage to caster breaks the spell (unless permanent)
  if (!isHealing && damage > 0 && actor) {
    const mesmerCasterFlag = actor.getFlag('conan', 'mesmerismCaster');
    if (mesmerCasterFlag?.active) {
      // Find the controlled target and check if permanent
      const targetTokenDoc = game.scenes.active?.tokens.get(mesmerCasterFlag.targetTokenId);
      const targetMesmer = targetTokenDoc?.actor?.getFlag('conan', 'mesmerismControl');
      if (targetMesmer && !targetMesmer.permanent) {
        // Break the spell — clear target flag
        await targetTokenDoc.actor.unsetFlag('conan', 'mesmerismControl');
        // Remove token overlay
        const mesmerIcon = 'systems/conan/images/icons/mesmerism_icon.png';
        const tEffects = targetTokenDoc.effects || [];
        if (tEffects.includes(mesmerIcon)) {
          await targetTokenDoc.update({ effects: tEffects.filter(e => e !== mesmerIcon) });
        }
        // Revoke ownership
        if (targetMesmer.casterUserId && targetTokenDoc.actor) {
          await targetTokenDoc.actor.update({ [`ownership.-=${targetMesmer.casterUserId}`]: null });
        }
        // Clear caster flag
        await actor.unsetFlag('conan', 'mesmerismCaster');

        ChatMessage.create({
          content: `<div class="conan-enemy-roll ability-use"><div class="roll-header" style="color: #9400D3;">Mesmerism Shattered</div><div class="roll-section ability-desc"><strong>${actor.name}</strong> takes damage! <strong>${mesmerCasterFlag.targetName || 'Target'}</strong> breaks free of the sorcerer's control.</div></div>`,
          speaker: { alias: 'GM' }
        });
      }
    }
  }

  // ==========================================
  // BARBARIC RESILIENCE (Barbarian death save)
  // ==========================================
  // On minion death: auto-roll Grit DC 8. Pass = survive (wounded), die end of next turn.
  // Roar trait: pass = survive permanently (no dying timer).
  const BARB_IDS_RESILIENCE = ['barbarian-youth', 'barbarian', 'barbarian-chieftain'];
  if (isDead && enemyData && BARB_IDS_RESILIENCE.includes(enemyData.id) && enemyData.type === 'Minion' && !isHealing) {
    const resUsed = token.document.getFlag('conan', 'resilienceUsed');
    if (!resUsed) {
      const gritValue = enemyData.stats?.grit?.value || 3;
      const gritDie = enemyData.stats?.grit?.die || 'D8';
      const gritRoll = await new Roll(`1${gritDie.toLowerCase()}`).evaluate();
      const gritTotal = gritRoll.total + gritValue;
      const passed = gritTotal >= 8;

      await token.document.setFlag('conan', 'resilienceUsed', true);

      const resName = enemyData.chatName || enemyData.name;
      const hasRoar = enemyData.threatTraits?.includes('roar');

      if (passed) {
        // Survive! Flip isDead back to false
        isDead = false;
        await token.document.unsetFlag('conan', 'dead');
        isWounded = true;
        await token.document.setFlag('conan', 'wounded', true);

        if (hasRoar) {
          // Roar: permanent survive — no dying timer
          ChatMessage.create({
            speaker: { alias: enemyData.name },
            content: `
              <div class="enemy-msg theme-human">
                <div class="enemy-msg-header">
                  <div class="msg-icon"><i class="fas fa-heart-pulse"></i></div>
                  <div class="msg-titles"><div class="msg-name">Barbaric Resilience!</div></div>
                </div>
                <div class="enemy-msg-body">
                  <div class="roll-row">
                    <div class="roll-dice"><div class="die stat">${gritRoll.total}</div></div>
                    <span class="roll-plus">+</span>
                    <span class="roll-value">Grit ${gritValue}</span>
                    <div class="roll-total">${gritTotal}</div>
                  </div>
                  <div style="color: #FF6B4A; text-align: center; margin-top: 4px; font-weight: bold;">${resName} ROARS with defiance and refuses to fall!</div>
                </div>
              </div>`,
            rolls: [gritRoll]
          });
        } else {
          // Standard: survive but die at end of next turn
          await token.document.setFlag('conan', 'resilientDying', true);
          ChatMessage.create({
            speaker: { alias: enemyData.name },
            content: `
              <div class="enemy-msg theme-human">
                <div class="enemy-msg-header">
                  <div class="msg-icon"><i class="fas fa-heart-pulse"></i></div>
                  <div class="msg-titles"><div class="msg-name">Barbaric Resilience!</div></div>
                </div>
                <div class="enemy-msg-body">
                  <div class="roll-row">
                    <div class="roll-dice"><div class="die stat">${gritRoll.total}</div></div>
                    <span class="roll-plus">+</span>
                    <span class="roll-value">Grit ${gritValue}</span>
                    <div class="roll-total">${gritTotal}</div>
                  </div>
                  <div style="color: #FFD700; text-align: center; margin-top: 4px; font-weight: bold;">${resName} refuses to die — one last turn before the end!</div>
                </div>
              </div>`,
            rolls: [gritRoll]
          });
        }
      } else {
        // Failed — dies normally
        ChatMessage.create({
          speaker: { alias: enemyData.name },
          content: `
            <div class="enemy-msg theme-human">
              <div class="enemy-msg-header">
                <div class="msg-icon"><i class="fas fa-skull"></i></div>
                <div class="msg-titles"><div class="msg-name">Barbaric Resilience — Failed!</div></div>
              </div>
              <div class="enemy-msg-body">
                <div class="roll-row">
                  <div class="roll-dice"><div class="die stat">${gritRoll.total}</div></div>
                  <span class="roll-plus">+</span>
                  <span class="roll-value">Grit ${gritValue}</span>
                  <div class="roll-total">${gritTotal}</div>
                </div>
                <div style="color: #888; text-align: center; margin-top: 4px;">${resName} falls. (Needed 8)</div>
              </div>
            </div>`,
          rolls: [gritRoll]
        });
      }

      console.log(`%c[RESILIENCE] ${resName} — Grit ${gritTotal} vs DC 8: ${passed ? 'PASSED' + (hasRoar ? ' (Roar — permanent!)' : ' (dying next turn)') : 'FAILED'}`, 'color: #FFD700; font-weight: bold;');
    }
  }

  // Show floating damage/healing number (local + broadcast to all clients via ChatMessage)
  broadcastFloatingDamage(token.id, damage, isDead, isWounded, isHealing);

  // Bone Armor: reflect damage = number of living skeletons summoned by this necromancer
  if (!isHealing && enemyData?.threatTraits?.includes('bonearmor') && game.conan?.lastDamageActorId) {
    // Count living skeletons summoned by this necromancer
    const necroTokenId = token.document.id;
    const livingSkeletons = canvas.scene.tokens.filter(t => {
      if (t.getFlag('conan', 'summonedBy') !== necroTokenId) return false;
      if (t.getFlag('conan', 'dead')) return false;
      return true;
    });
    const reflectDmg = livingSkeletons.length;
    if (reflectDmg > 0) {
      const attackerActor = game.actors.get(game.conan.lastDamageActorId);
      if (attackerActor?.system?.lifePoints) {
        const curLP = attackerActor.system.lifePoints.value ?? attackerActor.system.lifePoints.max ?? 0;
        const newLP = Math.max(0, curLP - reflectDmg);
        await attackerActor.update({ 'system.lifePoints.value': newLP });
        const attackerToken = canvas.tokens.placeables.find(t => t.actor?.id === attackerActor.id);
        if (attackerToken) broadcastFloatingDamage(attackerToken.id, reflectDmg, false, false, false);
        const necroName = enemyData.chatName || enemyData.name || token.name;
        ChatMessage.create({
          content: `<div class="enemy-msg theme-human"><div class="enemy-msg-header"><div class="msg-icon"><i class="fas fa-bone"></i></div><div class="msg-titles"><div class="msg-name">Bone Armor! (${reflectDmg})</div></div></div><div class="enemy-msg-body"><div class="enemy-msg-flavor">Shards of bone lash out from ${necroName} — ${attackerActor.name} takes ${reflectDmg} damage!</div></div></div>`,
          speaker: { alias: enemyData.name }
        });
      }
    }
  }

  // Backdraft: melee attackers take 1d4 fire damage when they strike
  if (!isHealing && enemyData?.threatTraits?.includes('backdraft') && game.conan?.lastDamageActorId) {
    const attackerActor = game.actors.get(game.conan.lastDamageActorId);
    if (attackerActor?.system?.lifePoints) {
      const bdRoll = await new Roll('1d4').evaluate();
      const bdDmg = bdRoll.total;
      const curLP = attackerActor.system.lifePoints.value ?? attackerActor.system.lifePoints.max ?? 0;
      const newLP = Math.max(0, curLP - bdDmg);
      await attackerActor.update({ 'system.lifePoints.value': newLP });
      const attackerToken = canvas.tokens.placeables.find(t => t.actor?.id === attackerActor.id);
      if (attackerToken) broadcastFloatingDamage(attackerToken.id, bdDmg, false, false, false);
      const bdName = enemyData.chatName || enemyData.name || token.name;
      ChatMessage.create({
        content: `<div class="enemy-msg theme-human"><div class="enemy-msg-header"><div class="msg-icon"><i class="fas fa-fire"></i></div><div class="msg-titles"><div class="msg-name">Backdraft! (${bdDmg})</div></div></div><div class="enemy-msg-body"><div class="enemy-msg-flavor">Flames erupt from ${bdName} — ${attackerActor.name} takes ${bdDmg} fire damage!</div></div></div>`,
        speaker: { alias: enemyData.name }
      });
    }
  }

  // Inferno: Hellfire sets target ablaze (burning debuff, max 3 rounds)
  if (!isHealing && game.conan?.lastDamageEffect?.type === 'inferno' && game.conan.lastDamageEffect.inferno) {
    const targetActor = token.actor || (token.document ? game.actors.get(token.document.actorId) : null);
    if (targetActor) {
      await targetActor.setFlag('conan', 'burningDebuff', { active: true, roundsLeft: 3 });
      await targetActor.update({ 'system.conditions.burning': true });
      const targetName = targetActor.name || token.name;
      ChatMessage.create({
        content: `<div class="enemy-msg theme-human"><div class="enemy-msg-header"><div class="msg-icon"><i class="fas fa-fire"></i></div><div class="msg-titles"><div class="msg-name">Ablaze!</div></div></div><div class="enemy-msg-body"><div class="enemy-msg-flavor">${targetName} is engulfed in hellfire! Burns for up to 3 rounds.</div></div></div>`,
        speaker: { alias: 'GM' }
      });
    }
  }

  // Send simple GM whisper with undo button
  const undoData = JSON.stringify(prevState).replace(/"/g, '&quot;');
  let changeText = isHealing ? `+${healAmount}` : `-${damage}`;

  // Add reduction info to chat message if damage was reduced
  let modifierNote = '';
  if (!isHealing && damageReduction > 0 && originalDamage !== damage) {
    const sourceText = reductionSources.join(', ');
    modifierNote = ` <span style="color: #4682B4; font-size: 0.9em;">(${originalDamage} raw, ${sourceText})</span>`;
  }
  // Add healing bonus info to chat message
  if (isHealing && healingBonus > 0 && originalHealAmount !== healAmount) {
    const sourceText = healingBonusSources.join(', ');
    modifierNote = ` <span style="color: #32CD32; font-size: 0.9em;">(${originalHealAmount} base, ${sourceText})</span>`;
  }
  // Show AR Ignored note for spells that bypass armor
  if (!isHealing && ignoresAR) {
    modifierNote = ` <span style="color: #90EE90; font-size: 0.9em;">(AR Ignored)</span>`;
  }

  ChatMessage.create({
    content: `${token.name} ${changeText}${modifierNote} <button type="button" class="undo-damage-btn" data-undo="${undoData}">Undo</button>`,
    whisper: [game.user.id]
  });

  // Public damage/healing notification for all players
  // Source: player actor name (lastDamageActorId) or enemy name (lastEnemyAttack)
  const sourceName = game.conan.lastDamageActorId
    ? (game.actors.get(game.conan.lastDamageActorId)?.name || 'Unknown')
    : (game.conan.lastEnemyAttack?.enemyName || null);

  // Build icon + status tag based on result
  let headerIcon, headerTitle, statusTag;
  if (isHealing) {
    headerIcon = 'fa-heart';
    headerTitle = 'Healing';
    statusTag = '';
  } else if (isDead) {
    headerIcon = 'fa-skull';
    headerTitle = sourceName || 'Damage';
    statusTag = `<span class="mech-tag debuff"><i class="fas fa-skull-crossbones"></i> KILLED</span>`;
  } else if (isWounded) {
    headerIcon = 'fa-crosshairs';
    headerTitle = sourceName || 'Damage';
    statusTag = `<span class="mech-tag debuff"><i class="fas fa-bolt"></i> WOUNDED</span>`;
  } else {
    headerIcon = 'fa-crosshairs';
    headerTitle = sourceName || 'Damage';
    statusTag = '';
  }

  // Build mechanic tags
  const damagePill = isHealing
    ? `<span class="mech-tag buff"><i class="fas fa-heart"></i> +${healAmount} LP</span>`
    : `<span class="mech-tag damage"><i class="fas fa-tint"></i> ${damage}</span>`;
  const targetPill = `<span class="mech-tag target"><i class="fas fa-bullseye"></i> ${token.name}</span>`;
  const arNote = modifierNote ? `<div style="color: #888; font-size: 12px; margin-top: 4px; text-align: center;">${modifierNote}</div>` : '';

  ChatMessage.create({
    content: `<div class="enemy-msg theme-human">
      <div class="enemy-msg-header">
        <div class="msg-icon"><i class="fas ${headerIcon}"></i></div>
        <div class="msg-titles"><div class="msg-name">${headerTitle}</div></div>
      </div>
      <div class="enemy-msg-body">
        <div class="enemy-msg-mechanic">${damagePill}${targetPill}${statusTag}</div>
        ${arNote}
      </div>
    </div>`,
    speaker: { alias: 'Blood & Steel' }
  });

  // Apply visual effect to token if dead
  if (isDead) {
    // Tint token red and reduce alpha
    await token.document.update({
      'texture.tint': '#660000',
      'alpha': 0.5
    });
  } else if (isWounded) {
    // Tint token orange for wounded minions
    await token.document.update({
      'texture.tint': '#cc6600'
    });
  }

  // Apply spell effects (e.g., Tide of Stone -1 Physical Defense)
  const spellEffect = game.conan.lastDamageEffect;
  if (spellEffect?.type === 'tide-of-stone' && !isHealing && damage > 0) {
    const enemyFlag = token.document.getFlag('conan', 'enemyData');
    if (enemyFlag) {
      // Decrement physical defense
      const curDef = parseInt(enemyFlag.physicalDefense) || 0;
      const newDef = Math.max(0, curDef - spellEffect.defPenalty);
      await token.document.setFlag('conan', 'enemyData', {
        ...enemyFlag,
        physicalDefense: newDef
      });
      // Set/increment debuff flag on actor
      const existing = token.actor?.getFlag('conan', 'tideOfStoneDebuff') || { total: 0 };
      if (token.actor) {
        await token.actor.setFlag('conan', 'tideOfStoneDebuff', {
          total: existing.total + spellEffect.defPenalty
        });
      }
      // Chat notification
      ChatMessage.create({
        speaker: { alias: 'GM' },
        content: `<div class="conan-enemy-roll ability-use"><div class="roll-header">Tide of Stone</div><div class="roll-section ability-desc"><strong>${token.name}</strong> suffers <strong>-${spellEffect.defPenalty} Physical Defense</strong> (now ${newDef}).</div></div>`
      });
    }
  }

  // Lotus Miasma: Poison if total damage >= 5 (same roll applies to all targets)
  if (spellEffect?.type === 'lotus-miasma' && !isHealing && damage > 0) {
    const poisonThreshold = spellEffect.poisonThreshold || 5;
    const isPoisoned = damage >= poisonThreshold;

    // Auto-apply Poison condition if damage threshold met
    if (isPoisoned && token.actor && (token.actor.type === 'character2' || token.actor.type === 'npc2')) {
      const currentPoisoned = token.actor.system?.conditions?.poisoned || false;
      if (!currentPoisoned) {
        await token.actor.update({ 'system.conditions.poisoned': true });
      }
    }

    // Chat message with damage + poison result
    const poisonText = isPoisoned
      ? `<strong style="color: #32CD32;">Poisoned!</strong>`
      : `<span style="color: #999;">Not Poisoned (damage &lt; 5)</span>`;
    ChatMessage.create({
      speaker: { alias: 'GM' },
      content: `<div class="conan-enemy-roll ability-use"><div class="roll-header">Lotus Miasma</div><div class="roll-section ability-desc"><strong>${token.name}</strong> takes <strong>${damage} damage</strong> (AR Ignored) — ${poisonText}</div></div>`
    });
  }

  // Snake Venom: Apply poison debuff to enemy (-2 attacks, 1 dmg/round)
  if (spellEffect?.type === 'snake-venom' && !isHealing && damage > 0) {
    if (token.actor) {
      await token.actor.setFlag('conan', 'snakeVenom', { active: true });
      // Clear effect so it can't be applied to multiple targets
      game.conan.lastDamageEffect = null;
      ChatMessage.create({
        speaker: { alias: 'GM' },
        content: `<div class="conan-enemy-roll ability-use"><div class="roll-header" style="color: #b060ff;">Snake Venom</div><div class="roll-section ability-desc"><strong>${token.name}</strong> is <strong style="color: #b060ff;">Poisoned!</strong> (-2 to attacks, 1 damage per round)</div></div>`
      });
    }
  }

  // Wave of Darkness: Apply stun debuff (cannot move, dismissed after target's next turn)
  if (spellEffect?.type === 'wave-of-darkness' && !isHealing && damage > 0) {
    if (token.actor) {
      const combatant = game.combat?.combatants?.find(c => c.tokenId === token.document?.id);
      await token.actor.setFlag('conan', 'stunnedDebuff', {
        active: true,
        combatantId: combatant?.id || null
      });
      game.conan.lastDamageEffect = null;
      ChatMessage.create({
        speaker: { alias: 'GM' },
        content: `<div class="conan-enemy-roll ability-use"><div class="roll-header" style="color: #4B0082;">Wave of Darkness</div><div class="roll-section ability-desc"><strong>${token.name}</strong> is <strong style="color: #9370DB;">Stunned!</strong> Cannot make any move actions.</div></div>`
      });
    }
  }

  // Hellfire: Apply stacking -1 to Checks & Attacks debuff (clears at END of target's next turn)
  if (spellEffect?.type === 'hellfire' && !isHealing && damage > 0) {
    if (token.actor) {
      const existing = token.actor.getFlag('conan', 'hellfireDebuff') || { total: 0 };
      await token.actor.setFlag('conan', 'hellfireDebuff', { total: existing.total + 1 });
      game.conan.lastDamageEffect = null;
      const newTotal = existing.total + 1;
      ChatMessage.create({
        speaker: { alias: 'GM' },
        content: `<div class="conan-enemy-roll ability-use"><div class="roll-header" style="color: #ff4500;">Hellfire</div><div class="roll-section ability-desc"><strong>${token.name}</strong> is seared by hellfire! <strong style="color: #ff4500;">-${newTotal}</strong> to Checks & Attacks.</div></div>`
      });
    }
  }

  // Chilling Touch: Apply -1 Physical Defense, -2 Sorcery Defense
  if (spellEffect?.type === 'chilling-touch' && !isHealing && damage > 0) {
    const enemyFlag = token.document.getFlag('conan', 'enemyData');
    if (enemyFlag) {
      const curPhysDef = parseInt(enemyFlag.physicalDefense) || 0;
      const curSorcDef = parseInt(enemyFlag.sorceryDefense) || 0;
      const newPhysDef = Math.max(0, curPhysDef - spellEffect.physPenalty);
      const newSorcDef = Math.max(0, curSorcDef - spellEffect.sorcPenalty);
      await token.document.setFlag('conan', 'enemyData', {
        ...enemyFlag,
        physicalDefense: newPhysDef,
        sorceryDefense: newSorcDef
      });
      // Set/increment debuff flag on actor for defense color tracking
      const existing = token.actor?.getFlag('conan', 'chillingTouchDebuff') || { physTotal: 0, sorcTotal: 0 };
      if (token.actor) {
        await token.actor.setFlag('conan', 'chillingTouchDebuff', {
          physTotal: existing.physTotal + spellEffect.physPenalty,
          sorcTotal: existing.sorcTotal + spellEffect.sorcPenalty
        });
      }
      game.conan.lastDamageEffect = null;
      ChatMessage.create({
        speaker: { alias: 'GM' },
        content: `<div class="conan-enemy-roll ability-use"><div class="roll-header" style="color: #87CEEB;">Chilling Touch</div><div class="roll-section ability-desc"><strong>${token.name}</strong> suffers <strong style="color: #4682B4;">-${spellEffect.physPenalty} Physical Defense</strong> (now ${newPhysDef}) and <strong style="color: #9370DB;">-${spellEffect.sorcPenalty} Sorcery Defense</strong> (now ${newSorcDef}).</div></div>`
      });
    }
  }

  // Bane Weapon: Apply Prone to target when damage includes bane weapon bonus
  if (game.conan?.lastDamageHasBane && !isHealing && damage > 0) {
    if (token.actor) {
      await token.actor.setFlag('conan', 'proneDebuff', { active: true });
      // Add prone token overlay
      const proneIcon = 'systems/conan/images/icons/prone_icon.png';
      const currentEffects = token.document?.effects || [];
      if (!currentEffects.includes(proneIcon)) {
        await token.document.update({ effects: [...currentEffects, proneIcon] });
      }
      ChatMessage.create({
        speaker: { alias: 'GM' },
        content: `<div class="conan-enemy-roll ability-use"><div class="roll-header" style="color: #CD853F;">Knocked Prone!</div><div class="roll-section ability-desc"><strong>${token.name}</strong> is knocked <strong style="color: #CD853F;">Prone</strong> by the enchanted weapon.</div></div>`
      });
    }
    game.conan.lastDamageHasBane = false;
  }

  // Infernal Ward: breaks when sorcerer's damage is applied to a demon
  if (!isHealing && damage > 0 && enemyData?.category === 'demons') {
    const attackerActorId = game.conan?.lastDamageActorId;
    if (attackerActorId) {
      const attackerActor = game.actors.get(attackerActorId);
      if (attackerActor && _actorHasDemonicMagic(attackerActor) && !attackerActor.system.infernalWardSpent) {
        await attackerActor.update({ 'system.infernalWardSpent': true });
        // Chat message from the demon
        const demonPortrait = enemyData.portraitImg || enemyData.tokenImg || 'icons/svg/mystery-man.svg';
        const demonName = enemyData.name || token.name || 'The Demon';
        const attackerName = attackerActor.name;
        const quotes = [
          `I see you now, sorcerer. Your blood reeks of the old pacts... and you have broken them.`,
          `YOU. The stench of stolen blood. You dared strike me? The pact is broken — I will tear the ward from your very soul.`
        ];
        const quote = quotes[Math.floor(Math.random() * quotes.length)];
        ChatMessage.create({
          speaker: ChatMessage.getSpeaker({ alias: demonName }),
          content: `<div class="spell-chat-card" style="border-color: #8B0000;">
            <div class="spell-chat-header">
              <div class="spell-chat-portrait-wrap">
                <img src="${demonPortrait}" class="spell-chat-portrait"/>
                <img src="systems/conan/images/icons/infernal_ward_icon.png" class="spell-chat-badge" alt="Infernal Ward"/>
              </div>
              <div class="spell-chat-title">
                <span class="spell-chat-name">Infernal Ward Broken</span>
                <span class="spell-chat-type">Demonic Magic</span>
              </div>
            </div>
            <div class="spell-chat-body">
              <div class="spell-chat-effect"><em>With that strike ${demonName} looks at <strong>${attackerName}</strong></em></div>
              <div class="spell-chat-effect" style="color: #ff6666; margin-top: 4px;">"${quote}"</div>
            </div>
          </div>`
        });
      }
    }
  }

  // Undead Ward: breaks when sorcerer's damage is applied to an undead
  if (!isHealing && damage > 0 && enemyData?.category === 'undead') {
    const attackerActorId = game.conan?.lastDamageActorId;
    if (attackerActorId) {
      const attackerActor = game.actors.get(attackerActorId);
      if (attackerActor && _actorHasNecromanticMagic(attackerActor) && !attackerActor.system.undeadWardSpent) {
        await attackerActor.update({ 'system.undeadWardSpent': true });
        const undeadPortrait = enemyData.portraitImg || enemyData.tokenImg || 'icons/svg/mystery-man.svg';
        const undeadName = enemyData.name || token.name || 'The Undead';
        const attackerName = attackerActor.name;
        const quotes = [
          `You reek of the grave, sorcerer... yet you raise your hand against the dead? The ward is broken. We see you now.`,
          `Foolish necromancer. You who walk between worlds dare strike at us? The dead forget nothing — and forgive less.`
        ];
        const quote = quotes[Math.floor(Math.random() * quotes.length)];
        ChatMessage.create({
          speaker: ChatMessage.getSpeaker({ alias: undeadName }),
          content: `<div class="spell-chat-card" style="border-color: #2E8B57;">
            <div class="spell-chat-header">
              <div class="spell-chat-portrait-wrap">
                <img src="${undeadPortrait}" class="spell-chat-portrait"/>
                <img src="systems/conan/images/icons/undead_ward_icon.png" class="spell-chat-badge" alt="Undead Ward"/>
              </div>
              <div class="spell-chat-title">
                <span class="spell-chat-name">Undead Ward Broken</span>
                <span class="spell-chat-type">Necromantic Magic</span>
              </div>
            </div>
            <div class="spell-chat-body">
              <div class="spell-chat-effect"><em>With that strike ${undeadName} turns its hollow gaze toward <strong>${attackerName}</strong></em></div>
              <div class="spell-chat-effect" style="color: #7CFC00; margin-top: 4px;">"${quote}"</div>
            </div>
          </div>`
        });
      }
    }
  }

  // Life Leech: caster heals for damage dealt to target (after AR)
  if (spellEffect?.type === 'life-leech' && !isHealing && damage > 0 && spellEffect.casterActorId) {
    const casterActor = game.actors.get(spellEffect.casterActorId);
    if (casterActor) {
      let leechHeal = damage;
      let leechBonusSources = [];

      // Apply origin healing bonuses
      const casterOriginId = casterActor.system?.origin?.id;
      if (casterOriginId === 'from-the-blood-of-jhebbal-sag') {
        leechHeal += 2;
        leechBonusSources.push('Blood of Jhebbal Sag (+2)');
      }
      // Apply skill healing bonuses (Hardy)
      const casterSkills = casterActor.system?.skills || {};
      for (const skill of Object.values(casterSkills)) {
        if (skill.name?.toLowerCase() === 'hardy') {
          leechHeal += 2;
          leechBonusSources.push('Hardy (+2)');
          break;
        }
      }

      // Cap at max LP
      const casterLPData = casterActor.system?.lifePoints;
      const casterHasValueProp = typeof casterLPData === 'object' && casterLPData !== null;
      const casterCurrentLP = casterHasValueProp ? (casterLPData.value || 0) : (casterLPData || 0);
      const casterMaxLP = casterHasValueProp ? (casterLPData.max || casterCurrentLP) : casterCurrentLP;
      const casterNewLP = Math.min(casterMaxLP, casterCurrentLP + leechHeal);
      const casterActualHeal = casterNewLP - casterCurrentLP;

      if (casterActualHeal > 0) {
        if (casterHasValueProp) {
          await casterActor.update({ 'system.lifePoints.value': casterNewLP });
        } else {
          await casterActor.update({ 'system.lifePoints': casterNewLP });
        }

        // Floating green heal on caster token
        const casterToken = canvas.tokens.placeables.find(t => t.actor?.id === casterActor.id);
        if (casterToken) {
          broadcastFloatingDamage(casterToken.id, -leechHeal, false, false, true);
        }

        // Chat notification
        let bonusNote = '';
        if (leechBonusSources.length > 0) {
          bonusNote = ` <span style="color: #32CD32; font-size: 0.9em;">(${damage} leeched, ${leechBonusSources.join(', ')})</span>`;
        }
        ChatMessage.create({
          content: `${casterActor.name} drains +${casterActualHeal} LP${bonusNote} (Life Leech)`,
          whisper: [game.user.id]
        });
      }
    }
  }

  // Healing spell: also heal the caster when target is healed
  if (spellEffect?.type === 'healing' && isHealing && spellEffect.casterActorId) {
    const casterActor = game.actors.get(spellEffect.casterActorId);
    // Skip if caster IS the target (avoid double-heal)
    if (casterActor && casterActor.id !== actor?.id) {
      // Calculate caster's own healing bonuses
      let casterHealAmount = originalHealAmount;
      let casterBonusSources = [];

      const casterOriginId = casterActor.system?.origin?.id;
      if (casterOriginId === 'from-the-blood-of-jhebbal-sag') {
        casterHealAmount += 2;
        casterBonusSources.push('Blood of Jhebbal Sag (+2)');
      }
      const casterSkills = casterActor.system?.skills || {};
      for (const skill of Object.values(casterSkills)) {
        if (skill.name?.toLowerCase() === 'hardy') {
          casterHealAmount += 2;
          casterBonusSources.push('Hardy (+2)');
          break;
        }
      }

      // Get caster's current and max LP
      const casterLPData = casterActor.system?.lifePoints;
      const casterHasValueProp = typeof casterLPData === 'object' && casterLPData !== null;
      const casterCurrentLP = casterHasValueProp ? (casterLPData.value || 0) : (casterLPData || 0);
      const casterMaxLP = casterHasValueProp ? (casterLPData.max || casterCurrentLP) : casterCurrentLP;
      const casterNewLP = Math.min(casterMaxLP, casterCurrentLP + casterHealAmount);
      const casterActualHeal = casterNewLP - casterCurrentLP;

      if (casterActualHeal > 0) {
        // Update caster's LP
        if (casterHasValueProp) {
          await casterActor.update({ 'system.lifePoints.value': casterNewLP });
        } else {
          await casterActor.update({ 'system.lifePoints': casterNewLP });
        }

        // Show floating healing on caster's token
        const casterToken = canvas.tokens.placeables.find(t => t.actor?.id === casterActor.id);
        if (casterToken) {
          broadcastFloatingDamage(casterToken.id, -casterHealAmount, false, false, true);
        }

        // GM whisper for caster self-heal
        let casterBonusNote = '';
        if (casterBonusSources.length > 0) {
          casterBonusNote = ` <span style="color: #32CD32; font-size: 0.9em;">(${originalHealAmount} base, ${casterBonusSources.join(', ')})</span>`;
        }
        ChatMessage.create({
          content: `${casterActor.name} self-heals +${casterActualHeal}${casterBonusNote} (Healing spell)`,
          whisper: [game.user.id]
        });
      }
    }
  }

  // ==========================================
  // DOUBLESTRIKE TRAIT (Threat Engine — Bandits)
  // ==========================================
  // Capture doublestrike data before poison block clears lastEnemyAttack
  const doublestrikeInfo = (game.conan?.lastEnemyAttack?.doublestrike && !isHealing && damage > 0)
    ? { ...game.conan.lastEnemyAttack }
    : null;

  // Capture Stunned trait info before poison block clears lastEnemyAttack
  const hasStunnedTrait = !isHealing && damage > 0
    && game.conan?.lastEnemyAttack?.threatTraits?.includes('thunderstrike')
    && game.conan?.lastEnemyAttack?.attackType === 'melee' // melee only — no stun from arrows
    && !enemyData // only triggers on player tokens (enemyData = null for PCs)
    && actor?.type === 'character2';

  // Capture Dirty Fighter trait info before poison block clears lastEnemyAttack
  const hasDirtyFighter = !isHealing && damage > 0
    && game.conan?.lastEnemyAttack?.threatTraits?.includes('dirty')
    && !enemyData // only triggers on player tokens
    && actor?.type === 'character2';

  // Capture Untamed data before poison block clears lastEnemyAttack
  const untamedData = !isHealing && damage > 0
    && game.conan?.lastEnemyAttack?.threatTraits?.includes('untamed')
    && !game.conan?.lastEnemyAttack?.companionFired
    ? { ...game.conan.lastEnemyAttack } : null;

  // Capture Riposte info — enemy survives player damage → counter-attacks
  // Fires on ENEMY tokens (enemyData != null), only if they survive (checked later after isDead is set)
  const riposteEnemyData = !isHealing && damage > 0
    && enemyData?.threatTraits?.includes('riposte')
    ? { ...enemyData } : null;

  // ==========================================
  // ENEMY POISON/VENOM DETECTION
  // ==========================================
  const enemyAttack = game.conan.lastEnemyAttack;
  console.log(`%c[TRACE 3/4] SHIFT+CLICK — applyDamageToToken on ${token.name}`, 'color: #00BFFF; font-weight: bold;');
  console.log(`  damage = ${damage}, isHealing = ${isHealing}`);
  console.log(`  lastEnemyAttack:`, enemyAttack);
  console.log(`  lastDamageEffect:`, game.conan.lastDamageEffect);
  if (enemyAttack && !isHealing && damage > 0) {
    // Poison rules lookup — must match tools-sheet.js POISON_RULES
    const POISON_RULES = {
      'giant-scorpion': { ruleName: 'Poison Sting', weaponName: 'Stinger', damageThreshold: 2, gritDC: 8, dcType: 'fixed', outcome: 'poisoned' },
      'giant-scorpion-brood-guard': { ruleName: 'Poison Sting', weaponName: 'Stinger', damageThreshold: 2, gritDC: 10, dcType: 'fixed', outcome: 'poisoned' },
      'giant-scorpion-brood-mother': { ruleName: 'Potent Venom', weaponName: 'Barbed Stinger', damageThreshold: 2, gritDC: null, dcType: 'dynamic', outcome: 'poisoned', bonusDamage: '1d10', bonusDamageIgnoresAR: true },
      'scourge-of-set': { ruleName: 'Venomous Bite', weaponName: null, damageThreshold: 3, gritDC: 11, dcType: 'fixed', outcome: 'poisoned' },
      'giant-spider-queen': { ruleName: 'Paralyzing Venom', weaponName: null, damageThreshold: 3, gritDC: 10, dcType: 'fixed', outcome: 'immobilized' },
      'giant-serpent': { ruleName: 'Venomous Bite', weaponName: null, damageThreshold: 5, gritDC: null, dcType: 'none', outcome: 'poisoned' }
    };

    const poisonRule = POISON_RULES[enemyAttack.enemyId];
    console.log(`%c[TRACE 4/4] POISON CHECK — enemyId: "${enemyAttack.enemyId}"`, 'color: #FF4444; font-weight: bold;');
    console.log(`  Rule found:`, poisonRule ? poisonRule : 'NO MATCH — enemy not in POISON_RULES');
    if (poisonRule) {
      const weaponMatches = !poisonRule.weaponName || poisonRule.weaponName === enemyAttack.weaponName;
      const isMelee = enemyAttack.attackType === 'melee';
      const meetsThreshold = damage >= poisonRule.damageThreshold;
      const isPC = token.actor && token.actor.type === 'character2';

      console.log(`  weaponMatches: ${weaponMatches} (rule wants "${poisonRule.weaponName}", attack used "${enemyAttack.weaponName}")`);
      console.log(`  isMelee: ${isMelee} (attackType: "${enemyAttack.attackType}")`);
      console.log(`  meetsThreshold: ${meetsThreshold} (damage ${damage} >= threshold ${poisonRule.damageThreshold})`);
      console.log(`  isPC: ${isPC} (actorType: "${token.actor?.type}")`);
      console.log(`  ALL PASS: ${weaponMatches && isMelee && meetsThreshold && isPC}`);

      if (weaponMatches && isMelee && meetsThreshold && isPC) {
        if (poisonRule.dcType === 'none') {
          // Auto-poison (Giant Serpent) — no Grit check
          console.log(`  → AUTO-POISON (no Grit check)`);
          await applyPoisonToCharacter(token.actor, enemyAttack.enemyName, enemyAttack.tokenImg, poisonRule);
        } else if (poisonRule.outcome === 'immobilized') {
          // Immobilize (Spider Queen) — Grit check, condition not poison
          console.log(`  → IMMOBILIZE — prompting Grit check DC ${poisonRule.gritDC}`);
          promptGritCheck(token, enemyAttack, poisonRule, poisonRule.gritDC, damage);
        } else {
          // Standard poison — Grit check required
          const gritDC = poisonRule.dcType === 'dynamic' ? damage : poisonRule.gritDC;
          console.log(`  → POISON — prompting Grit check DC ${gritDC} (${poisonRule.dcType})`);
          promptGritCheck(token, enemyAttack, poisonRule, gritDC, damage);
        }
      } else {
        console.log(`  → POISON SKIPPED — conditions not met`);
      }
    }
    // Clear to prevent re-triggering on next shift+click (e.g., Brood Mother bonus damage)
    game.conan.lastEnemyAttack = null;
  }

  // ==========================================
  // DOUBLESTRIKE — Auto-roll second attack
  // ==========================================
  if (doublestrikeInfo) {
    const dsData = doublestrikeInfo.doublestrikeData;
    if (dsData) {
      // Roll second attack (stat die + stat value, no buffs/debuffs — raw follow-up)
      const dieFormula2 = `1${dsData.statDie.toLowerCase()}`;
      const skillRoll2 = await new Roll(dieFormula2).evaluate();
      const skillTotal2 = skillRoll2.total + dsData.statValue;
      const statLabel2 = dsData.stat.charAt(0).toUpperCase() + dsData.stat.slice(1);

      // Roll second damage
      const dmgFormula2 = dsData.damage.replace(/D/gi, 'd');
      const damageRoll2 = await new Roll(dmgFormula2).evaluate();
      const totalDamage2 = damageRoll2.total;

      // Damage dice HTML
      const dmgDice2 = damageRoll2.dice?.[0]?.results?.map(r => `<div class="die dmg">${r.result}</div>`).join('') || `<div class="die dmg">${damageRoll2.total}</div>`;

      // Parse weapon bonus from damage formula (e.g., "1d4+2" → 2)
      const dsShortName = dsData.eShort || doublestrikeInfo.enemyName;
      const dsDmgMatch = dmgFormula2.match(/\d+d\d+\+?(\d+)?/i);
      const dsWeaponBonus = dsDmgMatch?.[1] ? parseInt(dsDmgMatch[1]) : 0;
      let dsDmgBonuses = '';
      if (dsWeaponBonus) dsDmgBonuses += `<span class="roll-plus">+</span><span class="roll-value">${dsWeaponBonus}</span>`;

      // Build chat message — theme header + flavor + roll rows
      const dsContent = `
        <div class="enemy-msg theme-human">
          <div class="enemy-msg-header">
            <div class="msg-icon"><i class="fas fa-sword"></i></div>
            <div class="msg-titles">
              <div class="msg-name">Double Strike!</div>
            </div>
          </div>
          <div class="enemy-msg-body">
            <div style="color: #ccc; text-align: center; margin-bottom: 6px; font-style: italic;">${dsShortName} strikes again with blinding speed!</div>
            <div class="roll-row">
              <div class="roll-dice"><div class="die stat">${skillRoll2.total}</div></div>
              <span class="roll-plus">+</span>
              <span class="roll-value">${statLabel2} ${dsData.statValue}</span>
              <div class="roll-total">${skillTotal2}</div>
            </div>
            <div class="roll-row">
              <div class="roll-dice">${dmgDice2}</div>
              ${dsDmgBonuses}
              <div class="roll-total">${totalDamage2}</div>
            </div>
          </div>
        </div>`;

      // Set lastDamageRoll directly (no need for renderChatMessage hook to parse)
      game.conan.lastDamageRoll = totalDamage2;

      // Set lastEnemyAttack for second attack (no doublestrike — cannot chain)
      game.conan.lastEnemyAttack = {
        enemyId: doublestrikeInfo.enemyId,
        enemyName: doublestrikeInfo.enemyName,
        weaponName: dsData.name,
        attackType: dsData.attackType,
        tokenImg: doublestrikeInfo.tokenImg,
        doublestrike: false,
        doublestrikeData: null
      };

      await ChatMessage.create({
        speaker: { alias: doublestrikeInfo.enemyName },
        content: dsContent,
        rolls: [skillRoll2, damageRoll2]
      });

      console.log(`%c[DOUBLESTRIKE] Second attack rolled — Hit: ${skillTotal2}, Damage: ${totalDamage2}`, 'color: #8B0000; font-weight: bold;');
    }
  }

  // ==========================================
  // UNTAMED — Companion auto-attack after damage applied
  // ==========================================
  if (untamedData) {
    const atkType = untamedData.attackType;
    const isAntag = untamedData.enemyType === 'Antagonist';
    if (atkType === 'melee' || (atkType === 'ranged' && isAntag)) {
      const isHorse = atkType === 'melee';
      const companionName = isHorse ? 'War Horse' : 'War Eagle';
      const companionIcon = isHorse ? 'horse-head' : 'dove';
      const companionAtkBonus = isHorse ? 3 : 2;
      const companionDmgBonus = isHorse ? 2 : 1;

      const compAtkRoll = await new Roll('1d6').evaluate();
      const compAtkTotal = compAtkRoll.total + companionAtkBonus;
      const compDmgRoll = await new Roll('1d4').evaluate();
      const compDmgTotal = compDmgRoll.total + companionDmgBonus;

      const eShort = untamedData.enemyName?.split(' ')[0] || 'Rider';
      const compFlavors = isHorse
        ? [`${eShort}'s mount rears and STOMPS!`, `The warhorse lashes out with iron-shod hooves!`, `${eShort}'s steed tramples everything in reach!`]
        : [`A war eagle DIVES from above, talons extended!`, `${eShort}'s eagle shrieks and rakes with razor claws!`, `Wings fold — the eagle strikes like a thunderbolt!`];

      game.conan.lastDamageRoll = compDmgTotal;

      await ChatMessage.create({
        speaker: { alias: companionName },
        content: `
          <div class="enemy-msg theme-human">
            <div class="enemy-msg-header">
              <div class="msg-icon"><i class="fas fa-${companionIcon}"></i></div>
              <div class="msg-titles"><div class="msg-name">${companionName} — Companion Attack</div></div>
            </div>
            <div class="enemy-msg-body">
              <div class="enemy-msg-flavor">${compFlavors[Math.floor(Math.random() * compFlavors.length)]}</div>
              <div class="roll-row">
                <div class="roll-dice"><div class="die stat">${compAtkRoll.total}</div></div>
                <span class="roll-plus">+</span>
                <span class="roll-value">${companionAtkBonus}</span>
                <div class="roll-total">${compAtkTotal}</div>
              </div>
              <div class="roll-row">
                <div class="roll-dice"><div class="die dmg">${compDmgRoll.total}</div></div>
                <span class="roll-plus">+</span>
                <span class="roll-value">${companionDmgBonus}</span>
                <div class="roll-total">${compDmgTotal}</div>
              </div>
            </div>
          </div>`,
        rolls: [compAtkRoll, compDmgRoll]
      });

      console.log(`%c[UNTAMED] ${companionName} attacks — Hit: ${compAtkTotal}, Damage: ${compDmgTotal}`, 'color: #8B4513; font-weight: bold;');
    }
  }

  // ==========================================
  // WILDMAN TRAIT (Threat Engine — Picts)
  // ==========================================
  // On death: auto-roll melee attack + damage, GM picks the target
  if (isDead && enemyData?.threatTraits?.includes('wildman') && !isHealing) {
    const meleeAtk = enemyData.attacks?.melee;
    if (meleeAtk) {
      const wmStat = 'might';
      const wmStatValue = enemyData.stats?.might?.value || 3;
      const wmStatDie = enemyData.stats?.might?.die || 'D6';
      const wmDieFormula = `1${wmStatDie.toLowerCase()}`;
      const wmSkillRoll = await new Roll(wmDieFormula).evaluate();
      const wmSkillTotal = wmSkillRoll.total + wmStatValue;

      const wmDmgFormula = meleeAtk.damage.replace(/D/gi, 'd');
      const wmDmgRoll = await new Roll(wmDmgFormula).evaluate();
      const wmTotalDamage = wmDmgRoll.total;

      const wmDmgDice = wmDmgRoll.dice?.[0]?.results?.map(r => `<div class="die dmg">${r.result}</div>`).join('') || `<div class="die dmg">${wmDmgRoll.total}</div>`;
      const wmDmgMatch = wmDmgFormula.match(/\d+d\d+\+?(\d+)?/i);
      const wmWeaponBonus = wmDmgMatch?.[1] ? parseInt(wmDmgMatch[1]) : 0;
      let wmDmgBonuses = '';
      if (wmWeaponBonus) wmDmgBonuses += `<span class="roll-plus">+</span><span class="roll-value">${wmWeaponBonus}</span>`;

      const wmName = enemyData.chatName || enemyData.name;
      const WILDMAN_FLAVOR = [
        `With a final, savage snarl, ${wmName} lashes out even as death takes them!`,
        `${wmName} refuses to die quietly — one last swing of the ${meleeAtk.name.toLowerCase()} finds its mark!`,
        `The light fades from ${wmName}'s eyes, but the ${meleeAtk.name.toLowerCase()} still bites!`,
        `Even in death, ${wmName} strikes — a wild, desperate blow!`,
      ];

      const wmContent = `
        <div class="enemy-msg theme-human">
          <div class="enemy-msg-header">
            <div class="msg-icon"><i class="fas fa-skull-crossbones"></i></div>
            <div class="msg-titles">
              <div class="msg-name">Death Strike!</div>
            </div>
          </div>
          <div class="enemy-msg-body">
            <div style="color: #ccc; text-align: center; margin-bottom: 6px; font-style: italic;">${WILDMAN_FLAVOR[Math.floor(Math.random() * WILDMAN_FLAVOR.length)]}</div>
            <div class="roll-row">
              <div class="roll-dice"><div class="die stat">${wmSkillRoll.total}</div></div>
              <span class="roll-plus">+</span>
              <span class="roll-value">Might ${wmStatValue}</span>
              <div class="roll-total">${wmSkillTotal}</div>
            </div>
            <div class="roll-row">
              <div class="roll-dice">${wmDmgDice}</div>
              ${wmDmgBonuses}
              <div class="roll-total">${wmTotalDamage}</div>
            </div>
          </div>
        </div>`;

      // Store as lastDamageRoll so GM can shift+click to apply
      game.conan.lastDamageRoll = wmTotalDamage;
      game.conan.lastEnemyAttack = {
        enemyId: enemyData.id,
        enemyName: enemyData.name,
        weaponName: meleeAtk.name,
        attackType: 'melee',
        tokenImg: enemyData.portraitImg || enemyData.tokenImg || 'icons/svg/mystery-man.svg',
        doublestrike: false,
        doublestrikeData: null
      };

      await ChatMessage.create({
        speaker: { alias: enemyData.name },
        content: wmContent,
        rolls: [wmSkillRoll, wmDmgRoll]
      });

      console.log(`%c[WILDMAN] Death strike! — Hit: ${wmSkillTotal}, Damage: ${wmTotalDamage}`, 'color: #8B4513; font-weight: bold;');
    }
  }

  // ==========================================
  // RIPOSTE TRAIT (Threat Engine — Pirates)
  // ==========================================
  // On surviving damage: auto-roll counter-attack, GM shift+clicks to apply
  if (!isDead && riposteEnemyData && !isHealing) {
    // Pick the best melee weapon the enemy has
    const rpAtk = riposteEnemyData.attacks?.melee;
    if (rpAtk) {
      const rpStat = 'edge'; // Pirates favor Edge
      const rpStatValue = riposteEnemyData.stats?.edge?.value || riposteEnemyData.stats?.might?.value || 3;
      const rpStatDie = riposteEnemyData.stats?.edge?.die || riposteEnemyData.stats?.might?.die || 'D6';
      const rpDieFormula = `1${rpStatDie.toLowerCase()}`;
      const rpSkillRoll = await new Roll(rpDieFormula).evaluate();
      const rpSkillTotal = rpSkillRoll.total + rpStatValue;

      const rpDmgFormula = rpAtk.damage.replace(/D/gi, 'd');
      const rpDmgRoll = await new Roll(rpDmgFormula).evaluate();

      // Add cutthroat bonus if enemy also has cutthroat
      const rpCutthroat = riposteEnemyData.threatTraits?.includes('cutthroat') ? 2 : 0;
      const rpTotalDamage = rpDmgRoll.total + rpCutthroat;

      const rpDmgDice = rpDmgRoll.dice?.[0]?.results?.map(r => `<div class="die dmg">${r.result}</div>`).join('') || `<div class="die dmg">${rpDmgRoll.total}</div>`;
      const rpDmgMatch = rpDmgFormula.match(/\d+d\d+\+?(\d+)?/i);
      const rpWeaponBonus = rpDmgMatch?.[1] ? parseInt(rpDmgMatch[1]) : 0;
      let rpDmgBonuses = '';
      if (rpWeaponBonus) rpDmgBonuses += `<span class="roll-plus">+</span><span class="roll-value">${rpWeaponBonus}</span>`;
      if (rpCutthroat) rpDmgBonuses += `<span class="roll-plus">+</span><span class="roll-value">${rpCutthroat}</span>`;

      const rpName = riposteEnemyData.chatName || riposteEnemyData.name;
      const RIPOSTE_FLAVOR = [
        `${rpName} parries and strikes back in one fluid motion!`,
        `Steel rings as ${rpName} turns defense into attack!`,
        `${rpName} sidesteps the blow and lunges — a pirate's counter!`,
        `${rpName} catches the blade on their guard and ripostes with deadly precision!`,
      ];

      const rpContent = `
        <div class="enemy-msg theme-human">
          <div class="enemy-msg-header">
            <div class="msg-icon"><i class="fas fa-swords"></i></div>
            <div class="msg-titles">
              <div class="msg-name">Riposte!</div>
            </div>
          </div>
          <div class="enemy-msg-body">
            <div style="color: #ccc; text-align: center; margin-bottom: 6px; font-style: italic;">${RIPOSTE_FLAVOR[Math.floor(Math.random() * RIPOSTE_FLAVOR.length)]}</div>
            <div class="roll-row">
              <div class="roll-dice"><div class="die stat">${rpSkillRoll.total}</div></div>
              <span class="roll-plus">+</span>
              <span class="roll-value">Edge ${rpStatValue}</span>
              <div class="roll-total">${rpSkillTotal}</div>
            </div>
            <div class="roll-row">
              <div class="roll-dice">${rpDmgDice}</div>
              ${rpDmgBonuses}
              <div class="roll-total">${rpTotalDamage}</div>
            </div>
          </div>
        </div>`;

      // Store as lastDamageRoll so GM can shift+click to apply
      game.conan.lastDamageRoll = rpTotalDamage;
      // Include threatTraits so Dirty Fighter chains on the riposte damage
      game.conan.lastEnemyAttack = {
        enemyId: riposteEnemyData.id,
        enemyName: riposteEnemyData.name,
        weaponName: rpAtk.name,
        attackType: 'melee',
        tokenImg: riposteEnemyData.portraitImg || riposteEnemyData.tokenImg || 'icons/svg/mystery-man.svg',
        threatTraits: riposteEnemyData.threatTraits || [],
        doublestrike: false,
        doublestrikeData: null
      };

      await ChatMessage.create({
        speaker: { alias: riposteEnemyData.name },
        content: rpContent,
        rolls: [rpSkillRoll, rpDmgRoll]
      });

      console.log(`%c[RIPOSTE] Counter-attack! — Hit: ${rpSkillTotal}, Damage: ${rpTotalDamage}`, 'color: #1E90FF; font-weight: bold;');
    }
  }

  // ==========================================
  // HORDE TRAIT (Threat Engine — Picts)
  // ==========================================
  // On death: GM clicks to place 2 Pict Hunters
  if (isDead && enemyData?.threatTraits?.includes('horde') && !isHealing) {
    const deadName = enemyData.chatName || enemyData.name;
    const deadPos = { x: token.document.x, y: token.document.y };
    let hordeRemaining = 2;

    const HORDE_FLAVOR = [
      `As ${deadName} falls, savage war cries erupt from the shadows — more Picts emerge!`,
      `${deadName} crumples, but the undergrowth erupts with painted warriors!`,
      `The death of ${deadName} draws more Picts from hiding like wolves to blood!`,
    ];

    ChatMessage.create({
      speaker: { alias: enemyData.name },
      content: `
        <div class="enemy-msg theme-human">
          <div class="enemy-msg-header">
            <div class="msg-icon"><i class="fas fa-users"></i></div>
            <div class="msg-titles">
              <div class="msg-name">Horde!</div>
            </div>
          </div>
          <div class="enemy-msg-body">
            <div style="color: #ccc; text-align: center; font-style: italic;">${HORDE_FLAVOR[Math.floor(Math.random() * HORDE_FLAVOR.length)]}</div>
            <div style="color: #4ECDC4; text-align: center; margin-top: 4px; font-weight: bold;">Click the map to place 2 Pict Hunters.</div>
          </div>
        </div>`
    });

    ui.notifications.info(`HORDE: Click the map to place 2 Pict Hunters. (${hordeRemaining} remaining)`);

    // Set crosshair cursor
    document.body.style.cursor = 'crosshair';

    const hordeClickHandler = async (event) => {
      if (hordeRemaining <= 0) return;

      // Get canvas coordinates from Pixi event
      const local = event.getLocalPosition(canvas.stage);

      await window.spawnHordePictAtPosition(local.x, local.y);
      hordeRemaining--;

      if (hordeRemaining > 0) {
        ui.notifications.info(`HORDE: ${hordeRemaining} Pict Hunter(s) remaining. Click to place.`);
      } else {
        document.body.style.cursor = '';
        canvas.stage.off('pointerdown', hordeClickHandler);
        ui.notifications.info('Horde reinforcements placed!');
      }
    };

    canvas.stage.on('pointerdown', hordeClickHandler);
  }

  // ==========================================
  // STUNNED TRAIT (Threat Engine — Picts)
  // ==========================================
  // On dealing damage to a player: lock their token + set Stunned status
  if (hasStunnedTrait && actor && token) {
    // Lock the player's token so they can't move it
    await token.document.update({ locked: true });

    // Set stunned flag on the player's actor (refreshes duration if already stunned)
    const combatant = game.combat?.combatants?.find(c => c.tokenId === token.document?.id);
    await actor.setFlag('conan', 'stunnedDebuff', {
      active: true,
      tokenId: token.document.id,
      combatantId: combatant?.id || null,
      source: 'pict' // distinguish from Wave of Darkness stun
    });
    // Set the condition flag so the stunned icon shows on the character sheet
    await actor.update({ 'system.conditions.stunned': true });

    const stunnedFlavor = [
      `The blow leaves ${actor.name} reeling — the world spins!`,
      `${actor.name} staggers, vision blurring from the savage strike!`,
      `A thunderous impact rattles ${actor.name}'s skull — everything tilts sideways!`,
    ];

    ChatMessage.create({
      speaker: { alias: 'GM' },
      content: `
        <div class="enemy-msg theme-human">
          <div class="enemy-msg-header">
            <div class="msg-icon"><i class="fas fa-stars"></i></div>
            <div class="msg-titles">
              <div class="msg-name">Stunned!</div>
            </div>
          </div>
          <div class="enemy-msg-body">
            <div style="color: #ccc; text-align: center; font-style: italic;">${stunnedFlavor[Math.floor(Math.random() * stunnedFlavor.length)]}</div>
            <div style="color: #FFD700; text-align: center; margin-top: 4px;">Token locked! Spend 1 SP from character sheet to dismiss, or it clears at end of next turn.</div>
          </div>
        </div>`
    });

    console.log(`%c[STUNNED] ${actor.name} is stunned! Token locked.`, 'color: #FFD700; font-weight: bold;');
  }

  // ==========================================
  // DIRTY FIGHTER TRAIT (Threat Engine — Pirates)
  // ==========================================
  // On dealing damage to a player: -1 AR debuff, stacking up to 3
  if (hasDirtyFighter && actor && token) {
    const currentDebuff = actor.getFlag('conan', 'dirtyFighterDebuff');
    const currentStacks = currentDebuff?.stacks || 0;
    if (currentStacks < 3) {
      const newStacks = currentStacks + 1;
      await actor.setFlag('conan', 'dirtyFighterDebuff', { stacks: newStacks });

      const dirtyFlavors = [
        `throws sand in ${actor.name}'s eyes!`,
        `kicks dirt at ${actor.name}'s face!`,
        `stamps on ${actor.name}'s foot mid-swing!`,
        `headbutts ${actor.name} between blows!`,
        `spits in ${actor.name}'s eyes!`,
      ];

      ChatMessage.create({
        speaker: { alias: 'GM' },
        content: `
          <div class="enemy-msg theme-human">
            <div class="enemy-msg-header">
              <div class="msg-icon"><i class="fas fa-hand-fist"></i></div>
              <div class="msg-titles">
                <div class="msg-name">Dirty Fighter!</div>
              </div>
            </div>
            <div class="enemy-msg-body">
              <div style="color: #ccc; text-align: center; font-style: italic;">${dirtyFlavors[Math.floor(Math.random() * dirtyFlavors.length)]}</div>
              <div style="color: #FF6B4A; text-align: center; margin-top: 4px;">AR reduced by ${newStacks}! (${newStacks}/3 stacks)</div>
            </div>
          </div>`
      });
    }
  }

  // ==========================================
  // FROM THE GRAVE TRAIT (Threat Engine — Cultists)
  // ==========================================
  // On death: auto-deal 1d4 damage to the player who killed this enemy
  if (isDead && enemyData?.threatTraits?.includes('fromgrave') && !isHealing) {
    const graveName = enemyData.chatName || enemyData.name;
    const graveRoll = await new Roll('1d4').evaluate();
    const graveDamage = graveRoll.total;

    // Find the player who dealt the killing blow
    const sourceActorId = game.conan?.lastDamageActorId;
    const sourceActor = sourceActorId ? game.actors.get(sourceActorId) : null;

    if (sourceActor && sourceActor.type === 'character2') {
      const playerToken = canvas.tokens.placeables.find(t => t.actor?.id === sourceActorId);
      const playerAR = sourceActor.system?.armorRating || 0;
      const actualDamage = Math.max(0, graveDamage - playerAR);

      if (actualDamage > 0 && playerToken) {
        const currentLP = sourceActor.system.lifePoints?.value || 0;
        const newLP = Math.max(0, currentLP - actualDamage);
        await sourceActor.update({ 'system.lifePoints.value': newLP });
        broadcastFloatingDamage(playerToken.id, actualDamage, newLP <= 0, false);
      }

      const GRAVE_FLAVOR = [
        `With their last breath, ${graveName} whispers a dark curse upon ${sourceActor.name}!`,
        `${graveName}'s dying eyes burn with malice — dark energy lashes at ${sourceActor.name}!`,
        `A final, hateful snarl from ${graveName} — the curse strikes ${sourceActor.name}!`,
        `As ${graveName} crumples, shadow tendrils lash out at ${sourceActor.name}!`,
      ];

      ChatMessage.create({
        speaker: { alias: enemyData.name },
        content: `
          <div class="enemy-msg theme-human">
            <div class="enemy-msg-header">
              <div class="msg-icon"><i class="fas fa-skull-crossbones"></i></div>
              <div class="msg-titles">
                <div class="msg-name">From the Grave!</div>
              </div>
            </div>
            <div class="enemy-msg-body">
              <div style="color: #ccc; text-align: center; font-style: italic;">${GRAVE_FLAVOR[Math.floor(Math.random() * GRAVE_FLAVOR.length)]}</div>
              <div class="roll-row" style="justify-content: center; margin-top: 6px;">
                <div class="roll-dice"><div class="die dmg">${graveRoll.total}</div></div>
                <div class="roll-total" style="color: #ff4444;">${graveDamage} damage${playerAR > 0 ? ` (−${playerAR} AR = ${actualDamage})` : ''}</div>
              </div>
            </div>
          </div>`
      });

      console.log(`%c[FROM THE GRAVE] ${graveName} curses ${sourceActor.name} for ${actualDamage} damage!`, 'color: #9400D3; font-weight: bold;');
    }
  }

  // Volatile: on death, 1d8 fire damage to killer
  if (isDead && enemyData?.threatTraits?.includes('volatile') && !isHealing) {
    const volName = enemyData.chatName || enemyData.name;
    const volRoll = await new Roll('1d8').evaluate();
    const volDamage = volRoll.total;
    const sourceActorId = game.conan?.lastDamageActorId;
    const sourceActor = sourceActorId ? game.actors.get(sourceActorId) : null;

    if (sourceActor && sourceActor.type === 'character2') {
      const playerToken = canvas.tokens.placeables.find(t => t.actor?.id === sourceActorId);
      const playerAR = sourceActor.system?.armorRating || 0;
      const actualDamage = Math.max(0, volDamage - playerAR);
      if (actualDamage > 0 && playerToken) {
        const currentLP = sourceActor.system.lifePoints?.value || 0;
        const newLP = Math.max(0, currentLP - actualDamage);
        await sourceActor.update({ 'system.lifePoints.value': newLP });
        broadcastFloatingDamage(playerToken.id, actualDamage, newLP <= 0, false);
      }
      ChatMessage.create({
        speaker: { alias: enemyData.name },
        content: `<div class="enemy-msg theme-human"><div class="enemy-msg-header"><div class="msg-icon"><i class="fas fa-explosion"></i></div><div class="msg-titles"><div class="msg-name">Volatile!</div></div></div><div class="enemy-msg-body"><div style="color: #ccc; text-align: center; font-style: italic;">${volName} detonates in a pillar of flame!</div><div class="roll-row" style="justify-content: center; margin-top: 6px;"><div class="roll-dice"><div class="die dmg">${volRoll.total}</div></div><div class="roll-total" style="color: #ff4444;">${volDamage} fire damage${playerAR > 0 ? ` (−${playerAR} AR = ${actualDamage})` : ''}</div></div></div></div>`
      });
      console.log(`%c[VOLATILE] ${volName} explodes for ${actualDamage} fire damage to ${sourceActor.name}!`, 'color: #ff4500; font-weight: bold;');
    }
  }

  // ==========================================
  // MARTYR TRAIT (Threat Engine — Cultists)
  // ==========================================
  // On death: all remaining cultists gain +1 damage (max 3 stacks)
  const CULTIST_IDS = ['cultist-initiate', 'cultist', 'cultist-high-priest'];
  if (isDead && enemyData?.threatTraits?.includes('martyr') && !isHealing) {
    const martyrName = enemyData.chatName || enemyData.name;

    // Find all living cultist tokens on scene
    const cultistTokens = canvas.tokens.placeables.filter(t => {
      if (t.id === token.id) return false; // Skip the dying cultist
      const tEnemy = t.document?.getFlag('conan', 'enemyData');
      return tEnemy && CULTIST_IDS.includes(tEnemy.id) && !t.document?.getFlag('conan', 'dead');
    });

    let newStacks = 0;
    for (const ct of cultistTokens) {
      const currentBuff = ct.actor?.getFlag('conan', 'martyrBuff') || { stacks: 0 };
      newStacks = Math.min(3, currentBuff.stacks + 1);
      await ct.actor?.setFlag('conan', 'martyrBuff', { stacks: newStacks });
    }

    const MARTYR_FLAVOR = [
      `${martyrName}'s death fuels the dark cause — the remaining cultists surge with fury!`,
      `As ${martyrName} falls, a wave of fanatical rage sweeps through the cult!`,
      `${martyrName}'s sacrifice ignites the blood of every cultist on the field!`,
    ];

    ChatMessage.create({
      speaker: { alias: enemyData.name },
      content: `
        <div class="enemy-msg theme-human">
          <div class="enemy-msg-header">
            <div class="msg-icon"><i class="fas fa-skull"></i></div>
            <div class="msg-titles">
              <div class="msg-name">Martyr!</div>
            </div>
          </div>
          <div class="enemy-msg-body">
            <div style="color: #ccc; text-align: center; font-style: italic;">${MARTYR_FLAVOR[Math.floor(Math.random() * MARTYR_FLAVOR.length)]}</div>
            <div style="color: #ff4444; text-align: center; margin-top: 4px; font-weight: bold;">All cultists gain +1 damage! (${newStacks} stack${newStacks !== 1 ? 's' : ''})</div>
          </div>
        </div>`
    });

    console.log(`%c[MARTYR] ${martyrName} dies — ${cultistTokens.length} cultists buffed to ${newStacks} stacks`, 'color: #ff4444; font-weight: bold;');
  }

  // ==========================================
  // BERSERKER TRAIT (Threat Engine — Barbarians)
  // ==========================================
  // Any barbarian death: all barbarians with berserker trait gain +1 damage (max 3)
  const BARBARIAN_IDS = ['barbarian-youth', 'barbarian', 'barbarian-chieftain'];
  if (isDead && enemyData && BARBARIAN_IDS.includes(enemyData.id) && !isHealing) {
    // Find all living barbarians with berserker trait
    const berserkerTokens = canvas.tokens.placeables.filter(t => {
      if (t.id === token.id) return false;
      const tEnemy = t.document?.getFlag('conan', 'enemyData');
      return tEnemy && BARBARIAN_IDS.includes(tEnemy.id)
        && tEnemy.threatTraits?.includes('berserker')
        && !t.document?.getFlag('conan', 'dead');
    });

    if (berserkerTokens.length > 0) {
      let newStacks = 0;
      for (const bt of berserkerTokens) {
        const currentBuff = bt.actor?.getFlag('conan', 'berserkerBuff') || { stacks: 0 };
        newStacks = Math.min(3, currentBuff.stacks + 1);
        await bt.actor?.setFlag('conan', 'berserkerBuff', { stacks: newStacks });
      }

      const deadName = enemyData.chatName || enemyData.name;
      const BERSERKER_FLAVOR = [
        `${deadName}'s death sends a surge of rage through the warband!`,
        `The fall of ${deadName} drives the berserkers into a frenzy!`,
        `Blood sprays and the berserkers howl — ${deadName}'s death demands vengeance!`,
      ];

      ChatMessage.create({
        speaker: { alias: enemyData.name },
        content: `
          <div class="enemy-msg theme-human">
            <div class="enemy-msg-header">
              <div class="msg-icon"><i class="fas fa-axe-battle"></i></div>
              <div class="msg-titles">
                <div class="msg-name">Berserker Fury!</div>
              </div>
            </div>
            <div class="enemy-msg-body">
              <div style="color: #ccc; text-align: center; font-style: italic;">${BERSERKER_FLAVOR[Math.floor(Math.random() * BERSERKER_FLAVOR.length)]}</div>
              <div style="color: #FF6B4A; text-align: center; margin-top: 4px; font-weight: bold;">Berserkers gain +1 damage! (${newStacks} stack${newStacks !== 1 ? 's' : ''})</div>
            </div>
          </div>`
      });

      console.log(`%c[BERSERKER] ${deadName} dies — ${berserkerTokens.length} berserkers buffed to ${newStacks} stacks`, 'color: #FF6B4A; font-weight: bold;');
    }
  }

  // ==========================================
  // DEDICATED SERVANT TRAIT — MINION (Threat Engine — Cultists)
  // ==========================================
  // On minion death: summon 1 Winged Nightmare via click-to-place
  if (isDead && enemyData?.threatTraits?.includes('dedicated') && enemyData?.type === 'Minion' && !isHealing) {
    const dedName = enemyData.chatName || enemyData.name;

    const DED_FLAVOR = [
      `As ${dedName} falls, the veil between worlds tears open — a shrieking nightmare descends!`,
      `${dedName}'s death cry echoes beyond this world — dark wings unfurl from the void!`,
      `The blood of ${dedName} pools into an eldritch sigil — something answers from beyond!`,
    ];

    ChatMessage.create({
      speaker: { alias: enemyData.name },
      content: `
        <div class="enemy-msg theme-demons">
          <div class="enemy-msg-header">
            <div class="msg-icon"><i class="fas fa-dragon"></i></div>
            <div class="msg-titles">
              <div class="msg-name">Dedicated Servant!</div>
            </div>
          </div>
          <div class="enemy-msg-body">
            <div style="color: #ccc; text-align: center; font-style: italic;">${DED_FLAVOR[Math.floor(Math.random() * DED_FLAVOR.length)]}</div>
            <div style="color: #FF6B4A; text-align: center; margin-top: 4px; font-weight: bold;">Click the map to place a Winged Nightmare.</div>
          </div>
        </div>`
    });

    ui.notifications.info(`DEDICATED SERVANT: Click the map to place a Winged Nightmare.`);
    document.body.style.cursor = 'crosshair';

    const dedClickHandler = async (event) => {
      const local = event.getLocalPosition(canvas.stage);
      await window.spawnDedicatedServantNightmare(local.x, local.y);
      document.body.style.cursor = '';
      canvas.stage.off('pointerdown', dedClickHandler);
      ui.notifications.info('Winged Nightmare placed!');
    };

    canvas.stage.on('pointerdown', dedClickHandler);
  }

  // ==========================================
  // SOUL HARVEST TRAIT (Threat Engine — Necromancer)
  // ==========================================
  // When a skeleton dies, if its summoner necromancer has soulharvest, heal 1D6 LP
  if (isDead && !isHealing) {
    const summonerId = token.document.getFlag('conan', 'summonedBy');
    if (summonerId) {
      const necroTokenDoc = canvas.scene.tokens.get(summonerId);
      const necroData = necroTokenDoc?.getFlag('conan', 'enemyData');
      if (necroData?.threatTraits?.includes('soulharvest') && !necroTokenDoc.getFlag('conan', 'dead')) {
        const healRoll = await new Roll('1d6').evaluate();
        const healAmt = healRoll.total;
        // DUAL LP WRITE — heal necromancer
        const necroActor = necroTokenDoc.actor;
        if (necroActor?.system?.lifePoints) {
          const curLP = necroActor.system.lifePoints.value ?? 0;
          const maxLP = necroActor.system.lifePoints.max ?? necroData.lifePoints ?? curLP;
          const newLP = Math.min(maxLP, curLP + healAmt);
          await necroActor.update({ 'system.lifePoints.value': newLP });
          // Floating green heal on necromancer token
          const necroToken = canvas.tokens.get(summonerId);
          if (necroToken) broadcastFloatingDamage(necroToken.id, healAmt, false, false, true);
          const necroName = necroData.chatName || necroData.name;
          const skelName = enemyData.chatName || enemyData.name || token.name;
          ChatMessage.create({
            content: `<div class="enemy-msg theme-human"><div class="enemy-msg-header"><div class="msg-icon"><i class="fas fa-skull"></i></div><div class="msg-titles"><div class="msg-name">Soul Harvest!</div></div></div><div class="enemy-msg-body"><div class="enemy-msg-flavor">${necroName} devours ${skelName}'s departing soul — heals ${healAmt} LP!</div></div></div>`,
            speaker: { alias: necroData.name }
          });
        }
      }
    }
  }

  } catch (error) {
    console.error("Conan | Error in applyDamageToToken:", error);
    ui.notifications.error("Failed to apply damage. Check console for details.");
  }
}

// ==========================================
// POISON SYSTEM FUNCTIONS
// ==========================================

// Severity dread messages — player only sees these, NOT the effects
const POISON_DREAD_MESSAGES = {
  1: "The venom burns, but you can fight through it.",
  2: "The poison courses through your veins. Something is wrong.",
  3: "A cold numbness spreads through your body. The world dims.",
  4: "The venom takes hold completely. Your body betrays you."
};

// All possible poison effects
const POISON_EFFECTS = [
  { id: 'checksDown', label: '-1 to Checks/Attacks' },
  { id: 'lpDrain', label: 'Lose 1 LP/Round' },
  { id: 'noStamina', label: 'Stamina Spends Nullified' },
  { id: 'noFlex', label: 'Flex Die Suppressed' }
];

/**
 * Post a Grit Check prompt to chat for a poisoned target
 */
function promptGritCheck(token, enemyAttack, poisonRule, gritDC, damageDealt) {
  const actor = token.actor;
  const outcomeLabel = poisonRule.outcome === 'immobilized' ? 'Immobilized' : 'Poisoned';

  const checkData = {
    tokenId: token.id,
    sceneId: canvas.scene.id,
    actorId: actor.id,
    enemyName: enemyAttack.enemyName,
    enemyId: enemyAttack.enemyId,
    enemyImg: enemyAttack.tokenImg,
    ruleName: poisonRule.ruleName,
    gritDC: gritDC,
    outcome: poisonRule.outcome,
    bonusDamage: poisonRule.bonusDamage || null,
    bonusDamageIgnoresAR: poisonRule.bonusDamageIgnoresAR || false,
    damageDealt: damageDealt
  };

  const dataStr = JSON.stringify(checkData).replace(/"/g, '&quot;');

  ChatMessage.create({
    speaker: { alias: enemyAttack.enemyName },
    content: `<div class="conan-roll spell-chat-card poison-chat-card">
      <div class="spell-chat-header">
        <div class="spell-chat-portrait-wrap">
          <img src="${enemyAttack.tokenImg}" class="spell-chat-portrait" style="width: 200px; height: 200px;">
        </div>
        <div class="spell-chat-title">${poisonRule.ruleName}</div>
      </div>
      <div class="spell-chat-body">
        <div class="spell-chat-effect">
          <strong>${enemyAttack.enemyName}</strong> strikes <strong>${actor.name}</strong> for <strong>${damageDealt} damage</strong>!
          <br><em>${actor.name} must resist or become ${outcomeLabel}.</em>
        </div>
        <button class="poison-grit-check-btn" data-check="${dataStr}">
          GRIT CHECK (DC ${gritDC})
        </button>
      </div>
    </div>`
  });
}

/**
 * Apply poison effects to a character (after failed Grit check or auto-poison)
 * Rolls severity d6, picks random effects, syncs via invisible ChatMessage
 */
async function applyPoisonToCharacter(actor, enemyName, enemyImg, ruleData) {
  // Check existing effects to only add NEW ones
  const existing = actor.getFlag('conan', 'poisonEffects') || { active: false, effects: {} };
  const availableEffects = POISON_EFFECTS.filter(e => !existing.effects?.[e.id]);

  // If already fully poisoned, nothing more to add
  if (availableEffects.length === 0) {
    ChatMessage.create({
      speaker: { alias: enemyName },
      content: `<div class="conan-roll spell-chat-card poison-chat-card">
        <div class="spell-chat-header">
          <div class="spell-chat-portrait-wrap">
            <img src="${enemyImg}" class="spell-chat-portrait" style="width: 200px; height: 200px;">
          </div>
          <div class="spell-chat-title">${ruleData.ruleName || 'Venom'}</div>
        </div>
        <div class="spell-chat-body">
          <div class="spell-chat-effect">
            <strong>${actor.name}</strong> is already wracked with venom. The additional poison has no further effect.
          </div>
        </div>
      </div>`
    });
    return;
  }

  // Roll d6 for severity
  const severityRoll = new Roll('1d6');
  await severityRoll.evaluate();
  const severityResult = severityRoll.total;

  // Determine how many effects
  let effectCount;
  if (severityResult <= 2) effectCount = 1;
  else if (severityResult <= 4) effectCount = 2;
  else if (severityResult === 5) effectCount = 3;
  else effectCount = 4;

  // Cap at available effects
  effectCount = Math.min(effectCount, availableEffects.length);

  // Shuffle and pick
  const shuffled = [...availableEffects];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  const selectedEffects = shuffled.slice(0, effectCount);

  // Build effects object for sync
  const newEffects = {};
  selectedEffects.forEach(e => { newEffects[e.id] = true; });

  // Severity label
  const totalEffects = Object.values(existing.effects || {}).filter(v => v).length + effectCount;
  const severityLabel = totalEffects >= 4 ? 'CATASTROPHIC' : totalEffects === 3 ? 'SEVERE' : totalEffects === 2 ? 'MODERATE' : 'MILD';

  // Dread message for player (no details!)
  const dreadMsg = POISON_DREAD_MESSAGES[Math.min(totalEffects, 4)];

  // Player-visible card — dread message only
  ChatMessage.create({
    speaker: { alias: enemyName },
    content: `<div class="conan-roll spell-chat-card poison-chat-card">
      <div class="spell-chat-header">
        <div class="spell-chat-portrait-wrap">
          <img src="${enemyImg}" class="spell-chat-portrait" style="width: 200px; height: 200px;">
        </div>
        <div class="spell-chat-title">POISONED</div>
      </div>
      <div class="spell-chat-body">
        <div class="spell-chat-effect">
          <em>${dreadMsg}</em>
        </div>
      </div>
    </div>`
  });

  // GM-only whisper — severity details + effect list
  const effectsList = selectedEffects.map(e => `• ${e.label}`).join('\n');
  const existingList = Object.entries(existing.effects || {}).filter(([k,v]) => v).map(([k]) => {
    const eff = POISON_EFFECTS.find(e => e.id === k);
    return eff ? `• ${eff.label} (existing)` : '';
  }).filter(s => s).join('\n');

  ChatMessage.create({
    speaker: { alias: 'Poison System' },
    content: `<div style="background: #1a3a1a; border: 1px solid #32CD32; border-radius: 4px; padding: 8px; color: #32CD32;">
      <strong>${actor.name}</strong> — Severity: d6 = ${severityResult} (${severityLabel})
      <br><strong>New effects:</strong><br>${effectsList}
      ${existingList ? `<br><strong>Existing:</strong><br>${existingList}` : ''}
    </div>`,
    whisper: [game.user.id]
  });

  // Sync via invisible ChatMessage
  const msg = await ChatMessage.create({
    content: '', whisper: [], blind: true,
    flags: {
      conan: {
        poisonApply: true,
        actorId: actor.id,
        source: enemyName,
        effects: newEffects
      }
    }
  });
  if (msg) msg.delete();
}

/**
 * Show a floating damage/healing number above a token
 * @param {string} tokenId - The token ID
 * @param {number} damage - The damage amount (negative for healing)
 * @param {boolean} isDead - Whether the target died
 * @param {boolean} isWounded - Whether the target was wounded (minions)
 * @param {boolean} isHealing - Whether this is healing (positive effect)
 */
function showFloatingDamage(tokenId, damage, isDead, isWounded, isHealing = false) {
  const token = canvas.tokens.get(tokenId);
  if (!token) return;

  // Create floating text element
  const floatText = document.createElement('div');
  floatText.className = 'conan-floating-damage';

  // Set text content based on result
  let displayText;
  let textColor;

  if (isHealing) {
    const healAmount = Math.abs(damage);
    displayText = `+${healAmount}`;
    textColor = '#44ff44'; // Green for healing
  } else if (isDead) {
    displayText = `-${damage} DEAD!`;
    textColor = '#ff0000';
  } else if (isWounded) {
    displayText = `-${damage} HIT!`;
    textColor = '#ff8800';
  } else {
    displayText = `-${damage}`;
    textColor = '#ff4444';
  }

  floatText.textContent = displayText;

  // Calculate position (top of token, so it floats upward into clear space)
  const tokenBounds = token.bounds;
  const topCenterX = tokenBounds.x + (tokenBounds.width / 2);
  const topY = tokenBounds.y; // Top edge of token

  // Convert canvas position to screen position
  const transform = canvas.stage.worldTransform;
  const screenX = (topCenterX * transform.a) + transform.tx;
  const screenY = (topY * transform.d) + transform.ty;

  // Style the floating text
  floatText.style.cssText = `
    position: fixed;
    left: ${screenX}px;
    top: ${screenY}px;
    transform: translate(-50%, -50%);
    font-size: 32px;
    font-weight: bold;
    color: ${textColor};
    text-shadow:
      2px 2px 4px rgba(0,0,0,0.9),
      -1px -1px 2px rgba(0,0,0,0.9),
      0 0 10px rgba(255,0,0,0.5);
    pointer-events: none;
    z-index: 10000;
    font-family: "Modesto Condensed", "Palatino Linotype", serif;
    animation: floatUp 1.5s ease-out forwards;
  `;

  // Add animation keyframes if not already present
  if (!document.getElementById('conan-float-animation')) {
    const style = document.createElement('style');
    style.id = 'conan-float-animation';
    style.textContent = `
      @keyframes floatUp {
        0% {
          opacity: 1;
          transform: translate(-50%, -50%) scale(1);
        }
        20% {
          transform: translate(-50%, -70%) scale(1.2);
        }
        100% {
          opacity: 0;
          transform: translate(-50%, -150%) scale(0.8);
        }
      }
    `;
    document.head.appendChild(style);
  }

  // Add to DOM
  document.body.appendChild(floatText);

  // Remove after animation completes
  setTimeout(() => {
    floatText.remove();
  }, 1500);
}

/**
 * Show floating damage locally on GM screen only (no cross-client broadcast).
 * Cross-client notification is handled by public ChatMessage in applyDamageToToken.
 */
function broadcastFloatingDamage(tokenId, damage, isDead, isWounded, isHealing = false) {
  showFloatingDamage(tokenId, damage, isDead, isWounded, isHealing);
}

// Make functions globally accessible
window.applyDamageToToken = applyDamageToToken;
window.showFloatingDamage = showFloatingDamage;
window.broadcastFloatingDamage = broadcastFloatingDamage;

/**
 * Auto-clear combat-duration effects when combat ends
 * Frightful Aura: clear debuff from all enemies, reset caster state
 */
Hooks.on('deleteCombat', async (combat, options, userId) => {
  if (!game.user.isGM) return;

  // Clear Frightful Aura debuffs from all tokens in the scene
  for (const tokenDoc of game.scenes.active?.tokens || []) {
    if (tokenDoc.actor?.getFlag('conan', 'frightfulAuraDebuff')) {
      await tokenDoc.actor.unsetFlag('conan', 'frightfulAuraDebuff');
    }
  }

  // Reset Frightful Aura state on all player characters
  for (const actor of game.actors) {
    if (actor.type === 'character2' && actor.system.frightfulAuraState && actor.system.frightfulAuraState !== 'ready') {
      await actor.update({ 'system.frightfulAuraState': 'ready', 'system.frightfulAuraTargets': [] });
    }
  }

  // Clear Fearsome Ward debuffs from all tokens in the scene
  for (const tokenDoc of game.scenes.active?.tokens || []) {
    if (tokenDoc.actor?.getFlag('conan', 'fearsomeWardDebuff')) {
      await tokenDoc.actor.unsetFlag('conan', 'fearsomeWardDebuff');
    }
  }

  // Reset Fearsome Ward state on all player characters
  for (const actor of game.actors) {
    if (actor.type === 'character2' && actor.system.fearsomeWardState && actor.system.fearsomeWardState !== 'ready') {
      await actor.update({ 'system.fearsomeWardState': 'ready', 'system.fearsomeWardTarget': null });
    }
  }

  // Clear Stunned debuffs (Wave of Darkness + Pict Stunned trait) from all tokens
  for (const tokenDoc of game.scenes.active?.tokens || []) {
    const stunData = tokenDoc.actor?.getFlag('conan', 'stunnedDebuff');
    if (stunData) {
      if (stunData.tokenId) await tokenDoc.update({ locked: false });
      await tokenDoc.actor.update({ 'system.conditions.stunned': false });
      await tokenDoc.actor.unsetFlag('conan', 'stunnedDebuff');
    }
  }

  // Clear Prone debuffs (Bane Weapon) from all tokens
  for (const tokenDoc of game.scenes.active?.tokens || []) {
    if (tokenDoc.actor?.getFlag('conan', 'proneDebuff')) {
      await tokenDoc.actor.unsetFlag('conan', 'proneDebuff');
      const proneIcon = 'systems/conan/images/icons/prone_icon.png';
      const effects = tokenDoc.effects || [];
      if (effects.includes(proneIcon)) {
        await tokenDoc.update({ effects: effects.filter(e => e !== proneIcon) });
      }
    }
  }

  // Clear Hellfire debuffs from all tokens
  for (const tokenDoc of game.scenes.active?.tokens || []) {
    if (tokenDoc.actor?.getFlag('conan', 'hellfireDebuff')) {
      await tokenDoc.actor.unsetFlag('conan', 'hellfireDebuff');
    }
  }

  // Clear Martyr buff from all enemy tokens (Threat Engine — Cultists)
  for (const tokenDoc of game.scenes.active?.tokens || []) {
    if (tokenDoc.actor?.getFlag('conan', 'martyrBuff')) {
      await tokenDoc.actor.unsetFlag('conan', 'martyrBuff');
    }
  }

  // Clear Dirty Fighter debuff from all player tokens (Threat Engine — Pirates)
  for (const tokenDoc of game.scenes.active?.tokens || []) {
    if (tokenDoc.actor?.getFlag('conan', 'dirtyFighterDebuff')) {
      await tokenDoc.actor.unsetFlag('conan', 'dirtyFighterDebuff');
    }
  }

  // Clear Berserker buff from all enemy tokens (Threat Engine — Barbarians)
  for (const tokenDoc of game.scenes.active?.tokens || []) {
    if (tokenDoc.actor?.getFlag('conan', 'berserkerBuff')) {
      await tokenDoc.actor.unsetFlag('conan', 'berserkerBuff');
    }
  }

  // Clear Bellow for Blood buff + used flag from all barbarian tokens
  for (const tokenDoc of game.scenes.active?.tokens || []) {
    if (tokenDoc.actor?.getFlag('conan', 'bellowBuff')) {
      await tokenDoc.actor.unsetFlag('conan', 'bellowBuff');
    }
    if (tokenDoc.getFlag('conan', 'bellowUsed')) {
      await tokenDoc.unsetFlag('conan', 'bellowUsed');
    }
  }

  // Clear Swift used flag from all steppe rider tokens
  for (const tokenDoc of game.scenes.active?.tokens || []) {
    if (tokenDoc.getFlag('conan', 'swiftUsed')) {
      await tokenDoc.unsetFlag('conan', 'swiftUsed');
    }
  }

  // Dismiss Beast Form on all player characters
  for (const actor of game.actors) {
    if (actor.type === 'character2' && actor.system.beastFormData?.active) {
      const bfData = actor.system.beastFormData;
      const originalMax = bfData.originalMaxLP || 0;
      const currentLP = actor.system.lifePoints?.value || 0;
      const cappedLP = Math.min(currentLP, originalMax);
      await actor.update({
        'system.beastFormData': null,
        'system.lifePoints.maxOverride': null,
        'system.lifePoints.value': Math.max(0, cappedLP),
        'system.buffsDebuffs.beastForm': false
      });
      const tokenDoc = actor.getActiveTokens(false, true)?.[0];
      if (tokenDoc) {
        await tokenDoc.update({
          'texture.src': bfData.originalTokenImg || actor.img,
          'flags.conan.-=enemyData': null
        });
      }
      ChatMessage.create({
        content: `<div class="conan-enemy-roll ability-use"><div class="roll-header" style="color: #D4A017;">Beast Form Ends</div><div class="roll-section ability-desc">Combat ends. <strong>${actor.name}</strong> reverts to human form.</div></div>`,
        speaker: ChatMessage.getSpeaker({ alias: 'System' })
      });
    }
  }

  // Clear Infernal Ward spent state on all player characters
  for (const actor of game.actors) {
    if (actor.type === 'character2' && actor.system.infernalWardSpent) {
      await actor.update({ 'system.infernalWardSpent': false });
    }
  }

  // Clear Undead Ward spent state on all player characters
  for (const actor of game.actors) {
    if (actor.type === 'character2' && actor.system.undeadWardSpent) {
      await actor.update({ 'system.undeadWardSpent': false });
    }
  }

  // Clear Demonic Ward on all player characters
  for (const actor of game.actors) {
    if (actor.type === 'character2' && actor.system.buffsDebuffs?.demonicWard) {
      await actor.update({ 'system.buffsDebuffs.demonicWard': false });
    }
  }

  // Clear Demonic Steed on all player characters
  for (const actor of game.actors) {
    if (actor.type === 'character2' && actor.system.demonicSteedActive) {
      await actor.update({ 'system.demonicSteedActive': false, 'system.conditions.mounted': false });
    }
  }

  // Clear Uncanny Reach on all player characters
  for (const actor of game.actors) {
    if (actor.type === 'character2' && actor.system.uncannyReachActive) {
      await actor.update({ 'system.uncannyReachActive': false });
    }
  }

  // Clear Bloody Talons on all player characters
  for (const actor of game.actors) {
    if (actor.type === 'character2' && (actor.system.bloodyTalonsActive || actor.system.bloodyTalonsSpent)) {
      await actor.update({ 'system.bloodyTalonsActive': false, 'system.bloodyTalonsSpent': false });
    }
  }

  // Clear Body of Living Iron (+3 AR) on all player characters
  for (const actor of game.actors) {
    if (actor.type === 'character2' && actor.system.buffsDebuffs?.armorUp) {
      await actor.update({ 'system.buffsDebuffs.armorUp': false });
    }
  }

  // Clear non-permanent Mesmerism from all scene tokens + caster flags
  for (const tokenDoc of game.scenes.active?.tokens || []) {
    const mFlag = tokenDoc.actor?.getFlag('conan', 'mesmerismControl');
    if (mFlag?.active && !mFlag.permanent) {
      await tokenDoc.actor.unsetFlag('conan', 'mesmerismControl');
      // Remove token overlay
      const mesmerIcon = 'systems/conan/images/icons/mesmerism_icon.png';
      const tEffects = tokenDoc.effects || [];
      if (tEffects.includes(mesmerIcon)) {
        await tokenDoc.update({ effects: tEffects.filter(e => e !== mesmerIcon) });
      }
      // Revoke ownership
      if (mFlag.casterUserId && tokenDoc.actor) {
        await tokenDoc.actor.update({ [`ownership.-=${mFlag.casterUserId}`]: null });
      }
      // Clear caster flag
      if (mFlag.casterActorId) {
        const caster = game.actors.get(mFlag.casterActorId);
        if (caster) await caster.unsetFlag('conan', 'mesmerismCaster');
      }
    }
  }

});

/**
 * Handle combat turn changes for maintained spell costs
 * Bane Weapon: 3 LP per round to maintain (deducted on caster's turn)
 */
Hooks.on('updateCombat', async (combat, changed, options, userId) => {
  // Only process by GM to avoid race conditions
  if (!game.user.isGM) return;

  // Only process when turn changes (not just round changes)
  if (changed.turn === undefined && changed.round === undefined) return;

  // === COUNTER WARD: Clear alert when turn advances ===
  if (game.conan?.counterWardAlert) {
    game.conan.counterWardAlert = null;
    document.querySelectorAll('.counter-ward-alert').forEach(el => {
      el.classList.remove('counter-ward-alert');
      el.classList.add('usable');
    });
  }

  // === LOTUS FLASH: Apply pending initiative drops at new round, restore after turn ===
  // Guard: skip if this hook was triggered by our own turn reset or GM went backwards
  const wentBackward = (combat.round < (combat.previous?.round ?? combat.round)) ||
    (combat.round === combat.previous?.round && combat.turn < (combat.previous?.turn ?? combat.turn));
  if (game.conan?.lotusFlashTargets?.length > 0 && !game.conan?._lotusFlashAdjusting && !wentBackward) {
    let flashAppliedThisHook = false;

    // NEW ROUND: Apply pending targets — set their initiative to 1
    if (changed.round !== undefined) {
      const pendingTargets = game.conan.lotusFlashTargets.filter(t => t.pending);
      if (pendingTargets.length > 0) {
        flashAppliedThisHook = true;
        const appliedNames = [];
        for (const target of pendingTargets) {
          target.pending = false;
          await combat.setInitiative(target.combatantId, 1);
          appliedNames.push(target.tokenName);
        }
        // Reset turn to 0 — setInitiative reorders turns and the active turn
        // follows the old combatant, skipping everyone shuffled above them
        game.conan._lotusFlashAdjusting = true;
        await combat.update({ turn: 0 });
        delete game.conan._lotusFlashAdjusting;

        ChatMessage.create({
          content: `<div class="conan-roll"><h3 style="color: #FFD700;">Lotus Flash Takes Effect</h3><div class="skill-effect" style="color: #ccc;"><em>The blinding venom still burns their eyes...</em></div><div class="skill-effect"><strong>${appliedNames.join(', ')}</strong> — Initiative set to <strong>1</strong></div></div>`,
          speaker: ChatMessage.getSpeaker({ alias: 'System' }),
          rollMode: game.settings.get('core', 'rollMode')
        });
      }
    }

    // TURN CHANGE: Restore initiative for active targets whose turn just ended
    // Skip if we just applied the drop this hook — setInitiative reshuffles combat.turns
    if (!flashAppliedThisHook) {
      const prevTurnIndex = combat.previous?.turn;
      if (prevTurnIndex !== undefined && prevTurnIndex !== null) {
        const prevCombatant = combat.turns[prevTurnIndex];
        if (prevCombatant) {
          const flashIdx = game.conan.lotusFlashTargets.findIndex(t => t.combatantId === prevCombatant.id && !t.pending);
          if (flashIdx !== -1) {
            const flashData = game.conan.lotusFlashTargets[flashIdx];
            await combat.setInitiative(prevCombatant.id, flashData.originalInitiative);
            game.conan.lotusFlashTargets.splice(flashIdx, 1);
            ChatMessage.create({
              content: `<div class="conan-roll"><h3 style="color: #FFD700;">Lotus Flash Fades</h3><div class="skill-effect"><strong>${flashData.tokenName}</strong> — Initiative restored to <strong>${flashData.originalInitiative}</strong></div></div>`,
              speaker: ChatMessage.getSpeaker({ alias: 'System' }),
              rollMode: game.settings.get('core', 'rollMode')
            });
          }
        }
      }
    }
  }

  // === FAVOR OF THE FOUR WINDS: Auto-expire when buffed character's turn ends ===
  const ffwPrevIdx = combat.previous?.turn;
  if (ffwPrevIdx !== undefined && ffwPrevIdx !== null) {
    const ffwPrev = combat.turns[ffwPrevIdx];
    if (ffwPrev?.actor?.system?.favorFourWindsBuff) {
      await ffwPrev.actor.update({ 'system.favorFourWindsBuff': null });
      ChatMessage.create({
        content: `<div class="conan-roll"><h3 style="color: #87CEEB;">Favor of the Four Winds Fades</h3><div class="skill-effect" style="color: #888;"><em>The winds settle around ${ffwPrev.actor.name} as their turn ends.</em></div></div>`,
        speaker: ChatMessage.getSpeaker({ alias: 'System' }),
        rollMode: game.settings.get('core', 'rollMode')
      });
    }
  }

  // === STUN: Auto-dismiss when stunned combatant's turn ends (Wave of Darkness + Pict Stunned trait) ===
  const stunPrevIdx = combat.previous?.turn;
  if (stunPrevIdx !== undefined && stunPrevIdx !== null) {
    const stunPrev = combat.turns[stunPrevIdx];
    if (stunPrev?.actor) {
      const stunFlag = stunPrev.actor.getFlag('conan', 'stunnedDebuff');
      if (stunFlag?.active) {
        await stunPrev.actor.unsetFlag('conan', 'stunnedDebuff');
        // Unlock token if it was locked by Pict Stunned trait
        if (stunFlag.tokenId) {
          const stunTokenDoc = game.scenes.active?.tokens.get(stunFlag.tokenId);
          if (stunTokenDoc) await stunTokenDoc.update({ locked: false });
        }
        // Clear the condition flag on the character sheet
        await stunPrev.actor.update({ 'system.conditions.stunned': false });
        const stunSource = stunFlag.source === 'pict' ? 'the stun' : 'the darkness';
        ChatMessage.create({
          content: `<div class="conan-enemy-roll ability-use"><div class="roll-header" style="color: #4B0082;">Stun Fades</div><div class="roll-section ability-desc"><strong>${stunPrev.actor.name}</strong> shakes off ${stunSource} and can move again.</div></div>`,
          speaker: ChatMessage.getSpeaker({ alias: 'System' })
        });
      }
    }
  }

  // === HELLFIRE: Auto-clear at END of affected target's turn ===
  const hfPrevIdx = combat.previous?.turn;
  if (hfPrevIdx !== undefined && hfPrevIdx !== null) {
    const hfPrev = combat.turns[hfPrevIdx];
    if (hfPrev?.actor) {
      const hfFlag = hfPrev.actor.getFlag('conan', 'hellfireDebuff');
      if (hfFlag?.total > 0) {
        await hfPrev.actor.unsetFlag('conan', 'hellfireDebuff');
        ChatMessage.create({
          content: `<div class="conan-enemy-roll ability-use"><div class="roll-header" style="color: #ff4500;">Hellfire Fades</div><div class="roll-section ability-desc"><strong>${hfPrev.actor.name}</strong> shakes off the searing flames. Checks and Attacks return to normal.</div></div>`,
          speaker: ChatMessage.getSpeaker({ alias: 'System' })
        });
      }
    }
  }

  // === BARBARIC RESILIENCE: Kill barbarian at end of their turn if resilientDying ===
  const resPrevIdx = combat.previous?.turn;
  if (resPrevIdx !== undefined && resPrevIdx !== null) {
    const resPrev = combat.turns[resPrevIdx];
    if (resPrev?.token) {
      const resTokenDoc = game.scenes.active?.tokens.get(resPrev.token.id);
      const resFlag = resTokenDoc?.getFlag('conan', 'resilientDying');
      if (resFlag) {
        const resEnemy = resTokenDoc.getFlag('conan', 'enemyData');
        const resName = resEnemy?.chatName || resEnemy?.name || resPrev.name;

        // Kill them
        await resTokenDoc.setFlag('conan', 'dead', true);
        const resToken = canvas.tokens.get(resTokenDoc.id);
        if (resToken) {
          await resToken.document.update({ 'texture.tint': '#660000', 'alpha': 0.5 });
          if (typeof window.showFloatingDamage === 'function') {
            broadcastFloatingDamage(resToken.id, 0, true, false, false);
          }
        }

        ChatMessage.create({
          speaker: { alias: resEnemy?.name || 'Barbarian' },
          content: `
            <div class="enemy-msg theme-human">
              <div class="enemy-msg-header">
                <div class="msg-icon"><i class="fas fa-skull"></i></div>
                <div class="msg-titles"><div class="msg-name">Final Breath</div></div>
              </div>
              <div class="enemy-msg-body">
                <div style="color: #ccc; text-align: center; font-style: italic;">${resName} fought on through sheer will... but the body can endure no more.</div>
              </div>
            </div>`
        });

        console.log(`%c[RESILIENCE] ${resName} dies at end of turn (resilientDying)`, 'color: #FFD700; font-weight: bold;');
      }
    }
  }

  // === SWIFT: Refresh at start of rider's turn ===
  const swiftCombatant = combat.combatant;
  if (swiftCombatant?.token) {
    const swiftTokenDoc = game.scenes.active?.tokens.get(swiftCombatant.token.id);
    const swiftEnemy = swiftTokenDoc?.getFlag('conan', 'enemyData');
    if (swiftEnemy?.threatTraits?.includes('swift') && swiftTokenDoc.getFlag('conan', 'swiftUsed')) {
      await swiftTokenDoc.setFlag('conan', 'swiftUsed', false);
      console.log(`%c[SWIFT] ${swiftEnemy.chatName || swiftEnemy.name} — Swift refreshed`, 'color: #87CEEB; font-weight: bold;');
    }
  }

  // === GLAMOUR BLIND: Expires at end of blinded player's turn ===
  const prevCombatant = combat.combats?.length ? null : null; // fallback
  const prevTurn = combat.previous?.turn;
  if (prevTurn != null && combat.turns?.[prevTurn]) {
    const glamourPrevCombatant = combat.turns[prevTurn];
    const glamourActor = glamourPrevCombatant?.actor;
    if (glamourActor?.type === 'character2') {
      const glamourFlag = glamourActor.getFlag('conan', 'glamourDebuff');
      if (glamourFlag?.active) {
        await glamourActor.update({ 'system.conditions.blinded': false });
        await glamourActor.unsetFlag('conan', 'glamourDebuff');
        ChatMessage.create({
          speaker: ChatMessage.getSpeaker({ actor: glamourActor }),
          content: `<div class="conan-roll"><div class="roll-header"><div class="roll-title">${glamourActor.name} — Glamour Fades</div></div><div style="text-align: center; padding: 8px; color: #2d6b2d; font-style: italic;">The blinding sorcery loosens its grip — sight returns!</div></div>`
        });
        console.log(`%c[GLAMOUR] ${glamourActor.name} — Glamour expired end of turn`, 'color: #708090; font-weight: bold;');
      }
    }
  }

  // === HELLISH BURNING: 1d4 damage on burning player's turn, random extinguish check ===
  const burnCombatant = combat.combatant;
  if (burnCombatant?.actor) {
    const burnFlag = burnCombatant.actor.getFlag('conan', 'burningDebuff');
    if (burnFlag?.active && burnFlag.roundsLeft > 0) {
      // Extinguish check: 50/50 each round — coin flip before damage
      const extinguishRoll = Math.random();
      const goesOut = extinguishRoll < 0.5;
      const playerName = burnCombatant.actor.name;

      if (goesOut) {
        // Fire goes out — no damage this round
        await burnCombatant.actor.unsetFlag('conan', 'burningDebuff');
        await burnCombatant.actor.update({ 'system.conditions.burning': false });
        ChatMessage.create({
          content: `<div class="enemy-msg theme-human"><div class="enemy-msg-header"><div class="msg-icon"><i class="fas fa-fire"></i></div><div class="msg-titles"><div class="msg-name">Flames Die Out!</div></div></div><div class="enemy-msg-body"><div class="enemy-msg-flavor">${playerName} smothers the hellfire — the flames sputter and die!</div></div></div>`,
          speaker: { alias: 'GM' }
        });
      } else {
        // Fire persists — deal 1d4 damage
        const burnRoll = await new Roll('1d4').evaluate();
        const burnDmg = burnRoll.total;
        const lpData = burnCombatant.actor.system?.lifePoints;
        if (lpData) {
          const curLP = lpData.value ?? lpData.max ?? 0;
          const newLP = Math.max(0, curLP - burnDmg);
          await burnCombatant.actor.update({ 'system.lifePoints.value': newLP });
          // Floating damage on burning token
          const burnToken = burnCombatant.token ? canvas.tokens.get(burnCombatant.token.id) : null;
          if (burnToken) broadcastFloatingDamage(burnToken.id, burnDmg, false, false, false);
        }
        const remaining = burnFlag.roundsLeft - 1;
        if (remaining <= 0) {
          // Max rounds reached — fire goes out after this damage
          await burnCombatant.actor.unsetFlag('conan', 'burningDebuff');
          await burnCombatant.actor.update({ 'system.conditions.burning': false });
          ChatMessage.create({
            content: `<div class="enemy-msg theme-human"><div class="enemy-msg-header"><div class="msg-icon"><i class="fas fa-fire"></i></div><div class="msg-titles"><div class="msg-name">Burning! (Final)</div></div></div><div class="enemy-msg-body"><div style="text-align: center; margin-bottom: 6px;"><img src="systems/conan/images/icons/burning_icon.png" alt="Burning" style="width: 48px; height: 48px; filter: drop-shadow(0 0 6px rgba(255,69,0,0.8));"/></div><div class="enemy-msg-flavor">${playerName} burns for ${burnDmg} damage! The hellfire finally dies out.</div></div></div>`,
            speaker: { alias: 'GM' }
          });
        } else {
          await burnCombatant.actor.setFlag('conan', 'burningDebuff', { active: true, roundsLeft: remaining });
          ChatMessage.create({
            content: `<div class="enemy-msg theme-human"><div class="enemy-msg-header"><div class="msg-icon"><i class="fas fa-fire"></i></div><div class="msg-titles"><div class="msg-name">Burning!</div></div></div><div class="enemy-msg-body"><div style="text-align: center; margin-bottom: 6px;"><img src="systems/conan/images/icons/burning_icon.png" alt="Burning" style="width: 48px; height: 48px; filter: drop-shadow(0 0 6px rgba(255,69,0,0.8));"/></div><div class="enemy-msg-flavor">${playerName} burns for ${burnDmg} damage! (${remaining} round${remaining > 1 ? 's' : ''} remaining)</div></div></div>`,
            speaker: { alias: 'GM' }
          });
        }
      }
    }
  }

  // === HEX: Auto-tick +1 stack at start of witch's turn (cap 3) ===
  const hexCombatant = combat.combatant;
  if (hexCombatant?.token) {
    const hexTokenDoc = game.scenes.active?.tokens.get(hexCombatant.token.id);
    const hexEnemy = hexTokenDoc?.getFlag('conan', 'enemyData');
    if (hexEnemy?.id === 'witch' && hexEnemy.threatTraits?.includes('hex')) {
      const allPlayers = game.actors.filter(a => a.type === 'character2');
      for (const player of allPlayers) {
        const hFlag = player.getFlag('conan', 'hexDebuff');
        if (hFlag?.sources?.includes(hexTokenDoc.id) && hFlag.stacks < 3) {
          hFlag.stacks += 1;
          await player.setFlag('conan', 'hexDebuff', hFlag);
          ChatMessage.create({
            speaker: { alias: hexEnemy.chatName || hexEnemy.name },
            content: `<div class="conan-roll"><div class="roll-header"><div class="roll-title">Hex Deepens — ${player.name}</div></div><div style="text-align: center; padding: 8px; color: #9400D3; font-style: italic;">The curse tightens its grip... <strong>-${hFlag.stacks} Attack</strong></div></div>`
          });
          console.log(`%c[HEX] ${player.name} hex deepens to -${hFlag.stacks}`, 'color: #9400D3; font-weight: bold;');
        }
      }
    }
  }

  // === ETERNAL SERVANT: Resurrect dead skeletons at start of necromancer's turn ===
  const esCombatant = combat.combatant;
  if (esCombatant?.token) {
    const esTokenDoc = game.scenes.active?.tokens.get(esCombatant.token.id);
    const esEnemy = esTokenDoc?.getFlag('conan', 'enemyData');
    if (esEnemy?.id === 'necromancer' && esEnemy.threatTraits?.includes('eternalservant')) {
      const necroId = esTokenDoc.id;
      const deadSkeletons = canvas.scene.tokens.filter(t => {
        return t.getFlag('conan', 'summonedBy') === necroId && t.getFlag('conan', 'dead');
      });
      if (deadSkeletons.length > 0) {
        for (const skelDoc of deadSkeletons) {
          await skelDoc.setFlag('conan', 'dead', false);
          await skelDoc.setFlag('conan', 'wounded', false);
          // Reset tint/alpha to alive state
          await skelDoc.update({ 'texture.tint': null, alpha: 1.0 });
          // Reset minion HP: clear wounded state so next hit uses threshold again
        }
        const necroName = esEnemy.chatName || esEnemy.name;
        ChatMessage.create({
          content: `<div class="enemy-msg theme-undead"><div class="enemy-msg-header"><div class="msg-icon"><i class="fas fa-skull"></i></div><div class="msg-titles"><div class="msg-name">Eternal Servant!</div></div></div><div class="enemy-msg-body"><div class="enemy-msg-flavor">${necroName} raises a hand — ${deadSkeletons.length} skeleton${deadSkeletons.length > 1 ? 's claw' : ' claws'} back from the grave!</div></div></div>`,
          speaker: { alias: esEnemy.name }
        });
        console.log(`%c[ETERNAL SERVANT] ${necroName} resurrected ${deadSkeletons.length} skeletons`, 'color: #90EE90; font-weight: bold;');
      }
    }
  }

  // === ERUPTION: Volcanist escalating self-destruct — warning messages, GM applies damage manually ===
  if (esCombatant?.token) {
    const erupTokenDoc = game.scenes.active?.tokens.get(esCombatant.token.id);
    const erupEnemy = erupTokenDoc?.getFlag('conan', 'enemyData');
    if (erupEnemy?.threatTraits?.includes('eruption') && !erupTokenDoc.getFlag('conan', 'dead')) {
      const erupActor = esCombatant.actor;
      const curHP = erupActor?.system?.lifePoints?.value ?? 0;
      const maxHP = erupActor?.system?.lifePoints?.max ?? 1;
      const hpPct = curHP / maxHP;

      // Eruption chance: full health 5%, half health 50%, 10 or less LP 90%
      let eruptChance;
      if (curHP <= 10) eruptChance = 0.9;
      else if (hpPct <= 0.5) eruptChance = 0.5;
      else eruptChance = 0.05;

      const eruptRoll = Math.random();
      const erupName = erupEnemy.chatName || erupEnemy.name;
      const chancePct = Math.round(eruptChance * 100);

      if (eruptRoll < eruptChance) {
        // ERUPTION! Roll 2d10, set lastDamageRoll, kill Volcanist — GM shift+clicks targets
        const erupDmgRoll = await new Roll('2d10').evaluate();
        const erupDmg = erupDmgRoll.total;

        game.conan = game.conan || {};
        game.conan.lastDamageRoll = erupDmg;
        game.conan.lastDamageEffect = null;

        // Kill the Volcanist
        await erupActor.update({ 'system.lifePoints.value': 0 });
        await erupTokenDoc.setFlag('conan', 'dead', true);
        const hpFlag = erupTokenDoc.getFlag('conan', 'currentHP');
        if (hpFlag !== undefined) await erupTokenDoc.setFlag('conan', 'currentHP', 0);
        await erupTokenDoc.update({ 'texture.tint': '#660000', alpha: 0.5 });

        ChatMessage.create({
          content: `<div class="enemy-msg theme-human"><div class="enemy-msg-header"><div class="msg-icon"><i class="fas fa-volcano"></i></div><div class="msg-titles"><div class="msg-name">ERUPTION!</div></div></div><div class="enemy-msg-body"><div style="color: #ff4444; text-align: center; font-weight: bold; font-size: 1.1em;">${erupName} ERUPTS!</div><div style="color: #ccc; text-align: center; font-style: italic; margin: 4px 0;">The air itself ignites — fire consumes everything nearby!</div><div class="roll-row" style="justify-content: center; margin-top: 6px;"><div class="roll-dice"><div class="die dmg">${erupDmgRoll.dice[0]?.results[0]?.result || '?'}</div><div class="die dmg">${erupDmgRoll.dice[0]?.results[1]?.result || '?'}</div></div><div class="roll-total" style="color: #ff4444;">${erupDmg} fire damage</div></div><div style="color: #ff6b6b; text-align: center; margin-top: 4px; font-size: 0.85em;">Shift+click targets in the area to apply damage.</div><div style="color: #ff6b6b; text-align: center; margin-top: 2px; font-style: italic;">${erupName} is consumed by the inferno.</div></div></div>`,
          speaker: { alias: erupEnemy.name }
        });
        console.log(`%c[ERUPTION] ${erupName} ERUPTS for ${erupDmg}! GM shift+clicks to apply.`, 'color: #ff4500; font-weight: bold;');
      } else {
        // Escalating warning messages based on HP threshold
        let warningMsg, warningIcon;
        if (curHP <= 10) {
          const critical = [
            `${erupName}'s skin splits open — molten light pours from the wounds!`,
            `The ground cracks beneath ${erupName} — magma bubbles at their feet!`,
            `${erupName} screams — their body is barely holding the fire within!`,
            `Waves of unbearable heat blast outward from ${erupName} — RUN!`,
          ];
          warningMsg = critical[Math.floor(Math.random() * critical.length)];
          warningIcon = 'volcano';
        } else if (hpPct <= 0.5) {
          const half = [
            `${erupName}'s veins glow like rivers of lava beneath the skin...`,
            `The air around ${erupName} shimmers violently — heat distortion warps the light.`,
            `Cracks of orange fire spread across ${erupName}'s body...`,
            `${erupName} trembles — embers drift from their mouth with every breath.`,
          ];
          warningMsg = half[Math.floor(Math.random() * half.length)];
          warningIcon = 'fire-flame-curved';
        } else {
          const calm = [
            `A faint heat haze surrounds ${erupName}... something simmers beneath the surface.`,
            `${erupName}'s eyes flicker with an inner fire — barely noticeable.`,
            `The air near ${erupName} feels uncomfortably warm.`,
            `Wisps of smoke curl from ${erupName}'s fingertips.`,
          ];
          warningMsg = calm[Math.floor(Math.random() * calm.length)];
          warningIcon = 'temperature-high';
        }

        ChatMessage.create({
          content: `<div class="enemy-msg theme-human"><div class="enemy-msg-header"><div class="msg-icon"><i class="fas fa-${warningIcon}"></i></div><div class="msg-titles"><div class="msg-name">Eruption (${chancePct}%)</div></div></div><div class="enemy-msg-body"><div style="color: #ccc; text-align: center; font-style: italic;">${warningMsg}</div></div></div>`,
          speaker: { alias: erupEnemy.name }
        });
        console.log(`%c[ERUPTION] ${erupName} holds (${chancePct}% chance)`, 'color: #ff8c00; font-weight: bold;');
      }
    }
  }

  // === SNAKE VENOM: 1 damage tick at start of poisoned enemy's turn ===
  const venomCombatant = combat.combatant;
  if (venomCombatant?.actor) {
    const venomFlag = venomCombatant.actor.getFlag('conan', 'snakeVenom');
    if (venomFlag?.active) {
      const venomToken = venomCombatant.token;
      const venomEnemy = venomToken?.getFlag('conan', 'enemyData');

      if (venomEnemy) {
        let venomKilled = false;

        if (venomEnemy.type === 'Minion') {
          // Minion: if already wounded, venom kills them
          const isWounded = venomToken.getFlag('conan', 'wounded') || false;
          if (isWounded) {
            venomKilled = true;
            await venomToken.setFlag('conan', 'dead', true);
            // Tint dead
            await venomToken.update({ 'texture.tint': '#660000', 'alpha': 0.5 });
          } else {
            // First damage source — wound the minion
            await venomToken.setFlag('conan', 'wounded', true);
            await venomToken.update({ 'texture.tint': '#cc6600' });
          }
        } else {
          // Antagonist: deal 1 damage via dual LP system
          const currentHP = venomCombatant.actor.system.lifePoints?.value ?? 0;
          const newHP = Math.max(0, currentHP - 1);
          await venomCombatant.actor.update({ 'system.lifePoints.value': newHP });
          if (newHP <= 0) {
            venomKilled = true;
            await venomToken.setFlag('conan', 'dead', true);
            await venomToken.update({ 'texture.tint': '#660000', 'alpha': 0.5 });
          }
        }

        const deathMsg = venomKilled ? ` <strong style="color: #ff4444;">— SLAIN BY VENOM!</strong>` : '';
        ChatMessage.create({
          content: `<div class="conan-enemy-roll ability-use"><div class="roll-header" style="color: #b060ff;">🐍 Snake Venom</div><div class="roll-section ability-desc"><strong>${venomEnemy.name}</strong> takes <strong style="color: #b060ff;">1 poison damage</strong> at the start of their turn.${deathMsg}</div></div>`,
          speaker: { alias: 'GM' }
        });

        // If killed by venom, clear the venom flag
        if (venomKilled) {
          await venomCombatant.actor.unsetFlag('conan', 'snakeVenom');
        }
      }
    }
  }


  // === MESMERISM: Increment round counter on mesmerised enemy's turn start ===
  const mesmerCombatant = combat.combatant;
  if (mesmerCombatant?.actor) {
    const mesmerFlag = mesmerCombatant.actor.getFlag('conan', 'mesmerismControl');
    if (mesmerFlag?.active && !mesmerFlag.permanent) {
      const newCount = (mesmerFlag.roundCount || 0) + 1;
      if (newCount >= 3) {
        // Permanent — no more maintenance cost
        await mesmerCombatant.actor.setFlag('conan', 'mesmerismControl', {
          ...mesmerFlag,
          roundCount: newCount,
          permanent: true
        });
        const casterActor = game.actors.get(mesmerFlag.casterActorId);
        // Free the caster to cast Mesmerism again
        if (casterActor) {
          await casterActor.unsetFlag('conan', 'mesmerismCaster');
        }
        ChatMessage.create({
          content: `<div class="conan-enemy-roll ability-use"><div class="roll-header" style="color: #9400D3;">Mesmerism — Permanent</div><div class="roll-section ability-desc"><strong>${mesmerCombatant.token?.name || 'Target'}</strong>'s will is completely broken. Control by <strong>${casterActor?.name || 'Sorcerer'}</strong> is now permanent.<br><em>${casterActor?.name || 'The sorcerer'} may cast Mesmerism again.</em></div></div>`,
          speaker: { alias: 'GM' }
        });
      } else {
        await mesmerCombatant.actor.setFlag('conan', 'mesmerismControl', {
          ...mesmerFlag,
          roundCount: newCount
        });
        ChatMessage.create({
          content: `<div class="conan-enemy-roll ability-use"><div class="roll-header" style="color: #9400D3;">Mesmerism — Round ${newCount}/3</div><div class="roll-section ability-desc"><strong>${mesmerCombatant.token?.name || 'Target'}</strong> remains under control.</div></div>`,
          speaker: { alias: 'GM' }
        });
      }
    }
  }

  // Get the current combatant whose turn just started
  const currentCombatant = combat.combatant;
  if (!currentCombatant) return;

  const actor = currentCombatant.actor;
  if (!actor || actor.type !== 'character2') return;

  // === BANE WEAPON MAINTENANCE ===
  const baneWeaponCaster = actor.system.baneWeaponCaster;
  if (baneWeaponCaster) {
    const currentLP = actor.system.lifePoints?.value ?? 0;
    const maintenanceCost = 3;

    if (currentLP <= 0) {
      const targetActor = game.actors.get(baneWeaponCaster.targetId);
      if (targetActor) {
        await targetActor.update({ 'system.baneWeaponBuff': null, 'system.buffsDebuffs.baneWeapon': false });
      }
      await actor.update({ 'system.baneWeaponCaster': null });
      ChatMessage.create({
        content: `<div class="conan-roll"><h3 style="color: #ff6b6b;">Bane Weapon Ends</h3><div class="skill-effect" style="color: #888;"><em>${actor.name} can no longer maintain the enchantment.</em></div><div class="skill-effect" style="color: #ff6b6b;">${targetActor?.name || 'Target'}'s weapon returns to normal.</div></div>`,
        speaker: ChatMessage.getSpeaker({ alias: 'System' }),
        rollMode: game.settings.get('core', 'rollMode')
      });
    } else {
      const newLP = Math.max(0, currentLP - maintenanceCost);
      await actor.update({ 'system.lifePoints.value': newLP });
      if (newLP <= 0) {
        const targetActor = game.actors.get(baneWeaponCaster.targetId);
        if (targetActor) {
          await targetActor.update({ 'system.baneWeaponBuff': null, 'system.buffsDebuffs.baneWeapon': false });
        }
        await actor.update({ 'system.baneWeaponCaster': null });
        ChatMessage.create({
          content: `<div class="conan-roll"><h3 style="color: #ff6b6b;">Bane Weapon Ends</h3><div class="skill-effect" style="color: #888;"><em>${actor.name} collapses from the strain of maintaining the enchantment.</em></div><div class="skill-effect" style="color: #ff6b6b;">${targetActor?.name || 'Target'}'s weapon returns to normal.</div></div>`,
          speaker: ChatMessage.getSpeaker({ alias: 'System' }),
          rollMode: game.settings.get('core', 'rollMode')
        });
      } else {
        ChatMessage.create({
          content: `<div class="conan-roll"><h3 style="color: #dda0dd;">Bane Weapon Maintained</h3><div class="skill-effect" style="color: #888;"><em>${actor.name} pays ${maintenanceCost} LP to maintain the enchantment.</em></div><div class="skill-effect">LP: ${currentLP} → ${newLP}</div></div>`,
          speaker: ChatMessage.getSpeaker({ alias: 'System' }),
          rollMode: game.settings.get('core', 'rollMode')
        });
      }
    }
  }

  // === BEAST FORM MAINTENANCE: 3 LP/round ===
  const beastFormData = actor.system.beastFormData;
  if (beastFormData?.active) {
    const currentLP = actor.system.lifePoints?.value ?? 0;

    // Helper: dismiss beast form (restore token + clear state)
    const dismissBeastForm = async (reason) => {
      const originalMax = beastFormData.originalMaxLP || 0;
      const lpAfterDismiss = Math.min(actor.system.lifePoints?.value ?? 0, originalMax);
      await actor.update({
        'system.beastFormData': null,
        'system.lifePoints.maxOverride': null,
        'system.lifePoints.value': Math.max(0, lpAfterDismiss),
        'system.buffsDebuffs.beastForm': false
      });
      // Restore token image + clear enemyData flag
      const tokenDoc = actor.getActiveTokens(false, true)?.[0];
      if (tokenDoc) {
        await tokenDoc.update({
          'texture.src': beastFormData.originalTokenImg || actor.img,
          'flags.conan.-=enemyData': null
        });
      }
      ChatMessage.create({
        content: `<div class="conan-enemy-roll ability-use"><div class="roll-header" style="color: #D4A017;">Beast Form Ends</div><div class="roll-section ability-desc"><em>${reason}</em><br><strong>${actor.name}</strong> reverts to human form.</div></div>`,
        speaker: ChatMessage.getSpeaker({ alias: 'System' })
      });
    };

    if (currentLP <= 0) {
      // Already at 0 LP — auto-dismiss
      await dismissBeastForm(`${actor.name} has no life force left to sustain the transformation.`);
    } else {
      const maintenanceCost = 3;
      const newLP = Math.max(0, currentLP - maintenanceCost);
      await actor.update({ 'system.lifePoints.value': newLP });
      if (newLP <= 0) {
        // Maintenance killed them — auto-dismiss
        await dismissBeastForm(`${actor.name} collapses from the strain of maintaining the beast form.`);
      } else {
        // Floating red number for maintenance cost
        const bfToken = actor.getActiveTokens()?.[0];
        if (bfToken) {
          broadcastFloatingDamage(bfToken.id, maintenanceCost, false, false, false);
        }
        ChatMessage.create({
          content: `<div class="conan-enemy-roll ability-use"><div class="roll-header" style="color: #D4A017;">Beast Form Maintained</div><div class="roll-section ability-desc"><em>${actor.name} pays ${maintenanceCost} LP to sustain the transformation.</em><br>LP: ${currentLP} → ${newLP}</div></div>`,
          speaker: ChatMessage.getSpeaker({ alias: 'System' })
        });
      }
    }
  }

  // === DEMONIC STEED MAINTENANCE: 2 LP/round ===
  if (actor.system.demonicSteedActive) {
    const currentLP = actor.system.lifePoints?.value ?? 0;

    if (currentLP <= 0) {
      await actor.update({ 'system.demonicSteedActive': false, 'system.conditions.mounted': false });
      ChatMessage.create({
        content: `<div class="conan-roll"><h3 style="color: #ff6b6b;">Demonic Steed Ends</h3><div class="skill-effect" style="color: #888;"><em>${actor.name} has no life force left to sustain the steed.</em></div></div>`,
        speaker: ChatMessage.getSpeaker({ alias: 'System' }),
        rollMode: game.settings.get('core', 'rollMode')
      });
    } else {
      const maintenanceCost = 2;
      const newLP = Math.max(0, currentLP - maintenanceCost);
      await actor.update({ 'system.lifePoints.value': newLP });
      if (newLP <= 0) {
        await actor.update({ 'system.demonicSteedActive': false, 'system.conditions.mounted': false });
        ChatMessage.create({
          content: `<div class="conan-roll"><h3 style="color: #ff6b6b;">Demonic Steed Ends</h3><div class="skill-effect" style="color: #888;"><em>${actor.name} collapses from the strain of sustaining the steed.</em></div><div class="skill-effect" style="color: #ff6b6b;">LP: ${currentLP} → ${newLP}</div></div>`,
          speaker: ChatMessage.getSpeaker({ alias: 'System' }),
          rollMode: game.settings.get('core', 'rollMode')
        });
      } else {
        ChatMessage.create({
          content: `<div class="conan-roll"><h3 style="color: #dda0dd;">Demonic Steed Maintained</h3><div class="skill-effect" style="color: #888;"><em>${actor.name} pays ${maintenanceCost} LP to sustain the spectral steed.</em></div><div class="skill-effect">LP: ${currentLP} → ${newLP}</div><button type="button" class="dismiss-demonic-steed-btn" data-actor-id="${actor.id}" style="margin-top: 6px; padding: 3px 10px; background: #555; color: #ccc; border: 1px solid #888; border-radius: 4px; cursor: pointer; font-size: 11px;">Dismiss Steed</button></div>`,
          speaker: ChatMessage.getSpeaker({ alias: 'System' }),
          rollMode: game.settings.get('core', 'rollMode')
        });
      }
    }
  }

  // === UNCANNY REACH MAINTENANCE: 1 LP/turn ===
  if (actor.system.uncannyReachActive) {
    const currentLP = actor.system.lifePoints?.value ?? 0;

    if (currentLP <= 0) {
      await actor.update({ 'system.uncannyReachActive': false });
      ChatMessage.create({
        content: `<div class="conan-roll"><h3 style="color: #ff6b6b;">Uncanny Reach Ends</h3><div class="skill-effect" style="color: #888;"><em>${actor.name} has no life force left to sustain the spell.</em></div></div>`,
        speaker: ChatMessage.getSpeaker({ alias: 'System' }),
        rollMode: game.settings.get('core', 'rollMode')
      });
    } else {
      ChatMessage.create({
        content: `<div class="conan-roll"><h3 style="color: #b4003c;">Uncanny Reach — Maintain?</h3><div class="skill-effect" style="color: #ccc;"><em>${actor.name}</em> is maintaining <strong>Uncanny Reach</strong></div><div class="skill-effect" style="color: #aaa;">Cost: <strong>1 LP</strong></div><div class="skill-effect" style="color: #aaa;">Current LP: <strong>${currentLP}</strong></div><div style="display: flex; gap: 8px; justify-content: center; margin-top: 8px;"><button class="maintain-uncanny-reach-btn" data-actor-id="${actor.id}" style="background: #2d6b2d; color: #90EE90; border: 1px solid #4a4; padding: 4px 16px; cursor: pointer; border-radius: 3px; font-weight: bold;">Spend 1 LP</button><button class="dismiss-uncanny-reach-btn" data-actor-id="${actor.id}" style="background: #6b2d2d; color: #ff6b6b; border: 1px solid #a44; padding: 4px 16px; cursor: pointer; border-radius: 3px; font-weight: bold;">Dismiss</button></div></div>`,
        speaker: ChatMessage.getSpeaker({ alias: 'System' }),
        rollMode: game.settings.get('core', 'rollMode')
      });
    }
  }

  // === LOTUS MIASMA MAINTENANCE ===
  const lotusMiasmaActive = actor.system.lotusMiasmaActive;
  if (lotusMiasmaActive) {
    const currentLP = actor.system.lifePoints?.value ?? 0;

    if (currentLP <= 0) {
      // No LP left - auto-dismiss
      await actor.update({ 'system.lotusMiasmaActive': false });
      ChatMessage.create({
        content: `<div class="conan-roll"><h3 style="color: #ff6b6b;">Lotus Miasma Ends</h3><div class="skill-effect" style="color: #888;"><em>${actor.name} can no longer sustain the toxic cloud.</em></div></div>`,
        speaker: ChatMessage.getSpeaker({ alias: 'System' }),
        rollMode: game.settings.get('core', 'rollMode')
      });
    } else {
      // Post maintenance prompt with Yes/No buttons
      // Get caster's wits die for the damage formula
      const witsDie = actor.system.attributes?.wits?.die || 'd8';
      const maintenanceData = JSON.stringify({ actorId: actor.id, witsDie: witsDie });

      ChatMessage.create({
        content: `<div class="conan-roll"><h3 style="color: #9370DB;">Lotus Miasma — Maintain?</h3><div class="skill-effect" style="color: #ccc;"><em>${actor.name}</em> is maintaining <strong>Lotus Miasma</strong></div><div class="skill-effect" style="color: #aaa;">Cost: <strong>1 LP</strong> + <strong>2 Actions</strong></div><div class="skill-effect" style="color: #aaa;">Current LP: <strong>${currentLP}</strong></div><div style="display: flex; gap: 8px; justify-content: center; margin-top: 8px;"><button class="miasma-maintain-yes" data-miasma='${maintenanceData}' style="background: #2d6b2d; color: #90EE90; border: 1px solid #4a4; padding: 4px 16px; cursor: pointer; border-radius: 3px; font-weight: bold;">Yes — Roll Damage</button><button class="miasma-maintain-no" data-miasma='${maintenanceData}' style="background: #6b2d2d; color: #ff6b6b; border: 1px solid #a44; padding: 4px 16px; cursor: pointer; border-radius: 3px; font-weight: bold;">No — End Spell</button></div></div>`,
        speaker: ChatMessage.getSpeaker({ alias: 'System' }),
        rollMode: game.settings.get('core', 'rollMode')
      });
    }
  }

  // === POISON: LP DRAIN ON TURN START ===
  const poisonEffects = actor.getFlag('conan', 'poisonEffects');
  if (poisonEffects?.active && poisonEffects.effects?.lpDrain) {
    const currentLP = actor.system.lifePoints?.value ?? 0;
    if (currentLP > 0) {
      const newLP = currentLP - 1;
      await actor.update({ 'system.lifePoints.value': newLP });

      const ownerColor = game.users.find(u => u.character?.id === actor.id)?.color || '#32CD32';
      ChatMessage.create({
        content: `<div class="conan-roll" style="border-color: ${ownerColor};">
          <h3 style="color: #32CD32;">Venom</h3>
          <div class="skill-effect" style="color: #ccc;"><em>The poison burns through ${actor.name}'s veins.</em></div>
          <div class="skill-effect" style="color: #ff6b6b;"><strong>-1 LP</strong> (${currentLP} → ${newLP})</div>
        </div>`,
        speaker: ChatMessage.getSpeaker({ alias: 'System' }),
        rollMode: game.settings.get('core', 'rollMode')
      });

      if (newLP <= 0) {
        ChatMessage.create({
          content: `<div class="conan-roll" style="border-color: #ff6b6b;">
            <h3 style="color: #ff6b6b;">Fallen!</h3>
            <div class="skill-effect"><strong>${actor.name}</strong> succumbs to the venom!</div>
          </div>`,
          speaker: ChatMessage.getSpeaker({ alias: 'System' }),
          rollMode: game.settings.get('core', 'rollMode')
        });
      }
    }
  }
});

// ========== AREA-BASED DISTANCE TOOLTIP ==========

/**
 * Determine which area a token is in by checking bounding boxes
 * @param {Token} playerToken - The token to locate
 * @param {Object} areas - The areas object from scene flags
 * @returns {string|null} Area label or null
 */
function _getTokenArea(playerToken, areas) {
  const px = playerToken.x + playerToken.w / 2;
  const py = playerToken.y + playerToken.h / 2;
  return _getAreaAtPoint(px, py, areas);
}

/**
 * Determine which area a world point is in by checking bounding boxes
 * @param {number} wx - World X coordinate
 * @param {number} wy - World Y coordinate
 * @param {Object} areas - The areas object from scene flags
 * @returns {string|null} Area label or null
 */
function _getAreaAtPoint(wx, wy, areas) {
  const gridSize = canvas.grid.size;
  for (const [label, areaInfo] of Object.entries(areas)) {
    // Use TokenDocument (committed position) not PlaceableObject (may be mid-animation)
    const areaTokDoc = canvas.scene.tokens.get(areaInfo.tokenId);
    if (!areaTokDoc) continue;
    const halfW = ((areaInfo.gridW || 3) * gridSize) / 2;
    const halfH = ((areaInfo.gridH || 3) * gridSize) / 2;
    // Center area on marker token's center (matches how drawings are rendered)
    const cx = areaTokDoc.x + ((areaTokDoc.width || 1) * gridSize) / 2;
    const cy = areaTokDoc.y + ((areaTokDoc.height || 1) * gridSize) / 2;
    if (wx >= cx - halfW && wx <= cx + halfW &&
        wy >= cy - halfH && wy <= cy + halfH) {
      return label;
    }
  }
  return null;
}

/**
 * Bbox overlap test — returns area label if ANY edge of the token overlaps the area bounds.
 * Uses the PlaceableObject (visual position), not TokenDocument (committed position).
 * @param {Token} token - The PlaceableObject token (has .x, .y, .w, .h visual coords)
 * @param {Object} areas - The areas object from scene flags
 * @returns {string|null} Area label or null
 */
function _getTokenOverlapArea(token, areas) {
  const gridSize = canvas.grid.size;
  // Token visual bounding box
  const tokL = token.x;
  const tokT = token.y;
  const tokR = token.x + (token.w || gridSize);
  const tokB = token.y + (token.h || gridSize);

  for (const [label, areaInfo] of Object.entries(areas)) {
    const markerDoc = canvas.scene.tokens.get(areaInfo.tokenId);
    if (!markerDoc) continue;
    const aw = (areaInfo.gridW || 3) * gridSize;
    const ah = (areaInfo.gridH || 3) * gridSize;
    // Area centered on marker token's center (matches how drawings are rendered)
    const markerCx = markerDoc.x + ((markerDoc.width || 1) * gridSize) / 2;
    const markerCy = markerDoc.y + ((markerDoc.height || 1) * gridSize) / 2;
    const areaL = markerCx - aw / 2;
    const areaT = markerCy - ah / 2;
    const areaR = markerCx + aw / 2;
    const areaB = markerCy + ah / 2;

    // Rectangles overlap if none of the 4 separation conditions hold
    if (tokR > areaL && tokL < areaR && tokB > areaT && tokT < areaB) {
      return label;
    }
  }
  return null;
}

/**
 * BFS shortest path between two areas
 * @param {Array} connections - Array of [labelA, labelB] pairs
 * @param {string} from - Start area label
 * @param {string} to - Target area label
 * @returns {number} Hop count, or -1 if no path
 */
function _getAreaDistance(connections, from, to) {
  if (from === to) return 0;
  // Build adjacency list
  const adj = {};
  for (const [a, b] of connections) {
    (adj[a] ??= []).push(b);
    (adj[b] ??= []).push(a);
  }
  // BFS
  const visited = new Set([from]);
  const queue = [[from, 0]];
  while (queue.length) {
    const [current, dist] = queue.shift();
    for (const neighbor of adj[current] || []) {
      if (neighbor === to) return dist + 1;
      if (!visited.has(neighbor)) {
        visited.add(neighbor);
        queue.push([neighbor, dist + 1]);
      }
    }
  }
  return -1;
}

/**
 * Check LOS between two areas — BFS that avoids blocker areas
 * Blockers are areas that block sight through them (not from/to them)
 * @param {Array} connections - Array of [labelA, labelB] pairs
 * @param {string} from - Start area label
 * @param {string} to - Target area label
 * @param {Array} losBlockers - Array of area labels that block LOS
 * @returns {boolean} true if LOS exists
 */
function _hasAreaLOS(connections, from, to, losBlockers) {
  if (from === to) return true;
  if (!losBlockers || losBlockers.length === 0) return true;

  const blockerSet = new Set(losBlockers);
  // You can see OUT of a blocker, but not INTO or THROUGH one
  blockerSet.delete(from);
  if (blockerSet.size === 0) return true;
  // Can't see into a blocker area
  if (blockerSet.has(to)) return false;

  // BFS on connection graph, skipping blocker nodes
  const adj = {};
  for (const [a, b] of connections) {
    (adj[a] ??= []).push(b);
    (adj[b] ??= []).push(a);
  }
  const visited = new Set([from]);
  const queue = [from];
  while (queue.length) {
    const current = queue.shift();
    for (const neighbor of adj[current] || []) {
      if (neighbor === to) return true;
      if (!visited.has(neighbor) && !blockerSet.has(neighbor)) {
        visited.add(neighbor);
        queue.push(neighbor);
      }
    }
  }
  return false;
}

// ========== PER-PLAYER VISIBILITY (isVisible override) ==========
// Each client computes which areas its local player can see. Cached and refreshed
// when player area changes (via refreshToken sensor) or torch state changes.

let _playerVisCache = { time: 0, visibleAreas: null, playerAreas: null, lightsOut: false };

/**
 * Compute the set of areas visible to the LOCAL player (not GM).
 * Returns { visibleAreas: Set, playerAreas: Set, lightsOut: boolean }
 * Cached for 200ms to avoid recomputing every isVisible call in the same frame.
 */
function _getLocalPlayerVisibility() {
  const now = Date.now();
  if (now - _playerVisCache.time < 200 && _playerVisCache.visibleAreas) return _playerVisCache;

  const areaData = canvas.scene?.getFlag('conan', 'areaData');
  if (!areaData?.areas || Object.keys(areaData.areas).length === 0) {
    _playerVisCache = { time: now, visibleAreas: null, playerAreas: null, lightsOut: false };
    return _playerVisCache;
  }

  const torchData = canvas.scene.getFlag('conan', 'torchTimer') || {};
  const lightsOut = !!torchData.lightsOut;
  const losBlockers = areaData.losBlockers || [];

  // Build adjacency
  const adj = {};
  for (const [a, b] of (areaData.connections || [])) {
    (adj[a] ??= []).push(b);
    (adj[b] ??= []).push(a);
  }

  // Find areas where THIS player's owned tokens are
  const playerAreas = new Set();
  const visibleAreas = new Set();
  for (const token of canvas.tokens.placeables) {
    const doc = token.document;
    if (!doc?.actor || doc.actor.type !== 'character2' || !doc.actorLink) continue;
    if (!doc.actor.testUserPermission(game.user, 'OWNER')) continue;
    const area = _getTokenOverlapArea(token, areaData.areas)
      || _playerAreaCache.get(doc.id) || null;
    if (!area) continue;
    playerAreas.add(area);
    visibleAreas.add(area);
    // Torch adjacency (lightsOut only)
    if (lightsOut) {
      const torch = torchData.torches?.[doc.id];
      if (torch?.active) {
        for (const neighbor of (adj[area] || [])) {
          if (_hasAreaLOS(areaData.connections, area, neighbor, losBlockers)) {
            visibleAreas.add(neighbor);
          }
        }
      }
    }
  }

  _playerVisCache = { time: now, visibleAreas, playerAreas, lightsOut };
  return _playerVisCache;
}

/** Invalidate the per-player visibility cache (called when player changes area or torch state changes) */
function _invalidatePlayerVisCache() {
  _playerVisCache.time = 0;
}

// ========== TORCH VISIBILITY RECALCULATION ==========

/**
 * Recalculate which area markers should be lit based on torch-bearing player positions.
 * Called from updateToken hook and from tools-sheet torch toggle.
 */
async function _recalcTorchVisibility() {
  if (!game.user.isGM || !canvas?.scene) return;
  // Queue — if already running, latest request runs after current finishes
  _recalcTorchVisibility._pending = true;
  if (_recalcTorchVisibility._running) return;
  _recalcTorchVisibility._running = true;
  try {
    while (_recalcTorchVisibility._pending) {
      _recalcTorchVisibility._pending = false;
      await _recalcTorchVisibilityInner();
    }
  } finally {
    _recalcTorchVisibility._running = false;
  }
}

async function _recalcTorchVisibilityInner() {
  const areaData = canvas.scene.getFlag('conan', 'areaData');
  if (!areaData?.areas || Object.keys(areaData.areas).length === 0) return;

  const torchData = canvas.scene.getFlag('conan', 'torchTimer') || {};
  const lightsOut = !!torchData.lightsOut;
  const losBlockers = areaData.losBlockers || [];
  const blockerSet = new Set(losBlockers);

  // Build adjacency list from connections
  const adj = {};
  for (const [a, b] of (areaData.connections || [])) {
    (adj[a] ??= []).push(b);
    (adj[b] ??= []).push(a);
  }

  // 1. Find player-occupied areas + torch-lit areas
  const playerAreas = new Set();   // areas with a player physically present
  const torchAreas = new Set();    // areas with an active torch bearer
  const visibleAreas = new Set();  // all areas where enemies should be visible
  for (const token of canvas.tokens.placeables) {
    const doc = token.document;
    if (!doc?.actor || doc.actor.type !== 'character2' || !doc.actorLink) continue;
    const area = _getTokenOverlapArea(token, areaData.areas)
      || _playerAreaCache.get(doc.id) || null; // Fall back to cached area if between zones
    if (!area) continue;
    playerAreas.add(area);
    visibleAreas.add(area); // Shared area — always visible (lights on or off)
    // Torch bearer (only matters during lightsOut): adjacent areas also visible
    if (lightsOut) {
      const torch = torchData.torches?.[doc.id];
      if (torch?.active) {
        torchAreas.add(area);
        for (const neighbor of (adj[area] || [])) {
          if (_hasAreaLOS(areaData.connections, area, neighbor, losBlockers)) {
            visibleAreas.add(neighbor);
          }
        }
      }
    }
  }

  // 2. Determine visibility per enemy
  // Lights On:  visible UNLESS in a LOS-blocked area without a player present
  // Lights Out: visible only if area is in visibleAreas set
  const enemyTokens = canvas.scene.tokens.filter(t => t.flags?.conan?.enemyData);
  const updates = [];
  for (const enemyTok of enemyTokens) {
    const enemyArea = _getAreaAtPoint(
      enemyTok.x + ((enemyTok.width || 1) * canvas.grid.size / 2),
      enemyTok.y + ((enemyTok.height || 1) * canvas.grid.size / 2),
      areaData.areas
    );
    let shouldBeVisible;
    if (lightsOut) {
      shouldBeVisible = enemyArea && visibleAreas.has(enemyArea);
    } else {
      // Lights on: everyone visible EXCEPT enemies in LOS-blocked areas (unless player is there)
      if (!enemyArea) {
        shouldBeVisible = true; // not in any area — visible
      } else if (blockerSet.has(enemyArea)) {
        shouldBeVisible = playerAreas.has(enemyArea); // blocked area — only if player present
      } else {
        shouldBeVisible = true; // normal area — always visible with lights on
      }
    }
    const isHidden = enemyTok.hidden;
    if (isHidden === shouldBeVisible) {
      updates.push({ _id: enemyTok.id, hidden: !shouldBeVisible });
    }
  }
  if (updates.length) {
    await canvas.scene.updateEmbeddedDocuments('Token', updates);
  }

  // 3. Update area marker lights (cosmetic glow — only during lightsOut)
  if (!lightsOut) return;
  const gridSize = canvas.grid.size;
  const markerUpdates = [];
  for (const [label, areaInfo] of Object.entries(areaData.areas)) {
    const markerDoc = canvas.scene.tokens.get(areaInfo.tokenId);
    if (!markerDoc) continue;
    // Light radius in distance units (e.g. feet) — must fill the area box
    const gw = areaInfo.gridW || 3;
    const gh = areaInfo.gridH || 3;
    const gridDist = canvas.scene.grid.distance || 5;
    const fillRadius = (Math.max(gw, gh) / 2) * gridDist;
    // Check if this area is adjacent to a torch area (spillover glow)
    const isNearTorch = !torchAreas.has(label) && (adj[label] || []).some(n => torchAreas.has(n));
    let light;
    if (torchAreas.has(label)) {
      light = { bright: fillRadius * 0.7, dim: fillRadius, color: '#ff8800', alpha: 0.35,
        animation: { type: 'torch', speed: 3, intensity: 3 } };
    } else if (isNearTorch) {
      light = { bright: 0, dim: fillRadius, color: '#ff9933', alpha: 0.2,
        animation: { type: 'torch', speed: 2, intensity: 2 } };
    } else if (visibleAreas.has(label)) {
      // Player present, no torch — faint cool moonlight
      light = { bright: 0, dim: fillRadius * 0.7, color: '#8899bb', alpha: 0.15,
        animation: { type: null } };
    } else {
      light = { bright: 0, dim: 0, color: null, alpha: 0.5,
        animation: { type: null } };
    }

    const cur = markerDoc.light;
    if (cur?.bright !== light.bright || cur?.dim !== light.dim || cur?.color !== light.color) {
      markerUpdates.push({ _id: markerDoc.id, light });
    }
  }
  if (markerUpdates.length) {
    await canvas.scene.updateEmbeddedDocuments('Token', markerUpdates);
  }
}

/**
 * Show a distance tooltip near a hovered token
 */
function _showAreaTooltip(screenX, screenY, areaLabel, distance, distClass, losBlocked = false) {
  _removeAreaTooltip();

  const tooltip = document.createElement('div');
  tooltip.id = 'area-distance-tooltip';

  // Format: "B. Range 3 / LOS" or "B. Range 3 / No LOS" or "B. (current)" or "B."
  const letterSpan = document.createElement('span');
  letterSpan.className = 'area-tooltip-letter';
  letterSpan.textContent = areaLabel + '.';
  tooltip.appendChild(letterSpan);

  if (distance === null || distClass < 0) {
    // No controlled token or not in an area — just show the letter
  } else if (distClass === 0) {
    const infoSpan = document.createElement('span');
    infoSpan.textContent = ' You are here';
    tooltip.appendChild(infoSpan);
  } else if (distance < 0) {
    const infoSpan = document.createElement('span');
    infoSpan.textContent = ' No path';
    tooltip.appendChild(infoSpan);
  } else {
    const rangeSpan = document.createElement('span');
    rangeSpan.textContent = ` Range ${distance}`;
    tooltip.appendChild(rangeSpan);

    const losSpan = document.createElement('span');
    losSpan.textContent = losBlocked ? ' / No LOS' : ' / LOS';
    losSpan.className = losBlocked ? 'los-blocked-text' : 'los-clear-text';
    tooltip.appendChild(losSpan);
  }

  // Color by distance
  if (distClass === 0) tooltip.className = 'area-dist-same';
  else if (distClass < 0) tooltip.className = 'area-dist-none';
  else if (distance <= 2) tooltip.className = 'area-dist-close';
  else if (distance <= 4) tooltip.className = 'area-dist-mid';
  else tooltip.className = 'area-dist-far';

  tooltip.style.position = 'fixed';
  tooltip.style.left = `${screenX}px`;
  tooltip.style.top = `${screenY - 20}px`;
  tooltip.style.transform = 'translate(-50%, -100%)';

  document.body.appendChild(tooltip);
}

function _removeAreaTooltip() {
  const existing = document.getElementById('area-distance-tooltip');
  if (existing) existing.remove();
}

/**
 * GM Defense Tooltip: show Phy/Sor defense values above any token on hover
 */
function _showDefenseTooltip(token, phys, sorc) {
  _removeDefenseTooltip();
  const tooltip = document.createElement('div');
  tooltip.id = 'defense-hover-tooltip';
  tooltip.innerHTML = `<span class="def-phys">Phy ${phys}</span> / <span class="def-sorc">Sor ${sorc}</span>`;

  const wt = canvas.stage.worldTransform;
  const cx = token.x + token.w / 2;
  const cy = token.y;
  const sx = wt.a * cx + wt.c * cy + wt.tx;
  const sy = wt.b * cx + wt.d * cy + wt.ty;

  tooltip.style.position = 'fixed';
  tooltip.style.left = `${sx}px`;
  tooltip.style.top = `${sy - 10}px`;
  tooltip.style.transform = 'translate(-50%, -100%)';

  document.body.appendChild(tooltip);
}

function _removeDefenseTooltip() {
  const existing = document.getElementById('defense-hover-tooltip');
  if (existing) existing.remove();
}

// Hook: show defense tooltip (GM only) on token hover
Hooks.on('hoverToken', (token, hovered) => {
  if (!hovered) {
    _removeDefenseTooltip();
    return;
  }

  // Skip area marker tokens
  if (token.document.getFlag('conan', 'areaMarker')) return;

  // GM-only: show defense values on any token with defenses
  if (game.user.isGM) {
    const enemyData = token.document.getFlag('conan', 'enemyData');
    const actor = token.actor;
    let phys = null;
    let sorc = null;

    if (enemyData) {
      phys = enemyData.physicalDefense;
      sorc = enemyData.sorceryDefense;
    } else if (actor?.system?.defense) {
      phys = actor.system.defense.physical;
      sorc = actor.system.defense.sorcery;
    }

    if (phys != null && sorc != null) {
      _showDefenseTooltip(token, phys, sorc);
    }
  }
});

// Area distance tooltip — canvas mousemove over area bounding boxes
let _areaTooltipThrottle = 0;
let _lastAreaHovered = null;

function _clearAreaTooltipState() {
  _lastAreaHovered = null;
  _removeAreaTooltip();
}

Hooks.on('canvasReady', () => {
  _clearAreaTooltipState();
  _playerAreaCache.clear(); // Reset sensor grid cache on scene change
  canvas.stage.off('pointermove', _onAreaPointerMove);
  canvas.stage.off('pointerleave', _clearAreaTooltipState);
  canvas.stage.on('pointermove', _onAreaPointerMove);
  canvas.stage.on('pointerleave', _clearAreaTooltipState);
  // Apply LOS blocker visibility on scene load
  setTimeout(() => _recalcTorchVisibility(), 500);
});

// Clear tooltip when token selection changes (deselect, select different token)
Hooks.on('controlToken', () => {
  _clearAreaTooltipState();
});

// Invalidate player vis cache when torch/lights state changes (scene flags update)
Hooks.on('updateScene', (scene, changes) => {
  if (changes.flags?.conan?.torchTimer || changes.environment) {
    _invalidatePlayerVisCache();
  }
});

// ========== AREA SENSOR GRID — refreshToken ==========
// Fires every visual frame during token movement. Detects when any edge of a
// player token crosses an area boundary.
// GM: triggers recalc for marker lights.
// Players: invalidates local visibility cache so isVisible re-evaluates.
const _playerAreaCache = new Map(); // tokenId → last known area label

Hooks.on('refreshToken', (token) => {
  // Only care about player tokens
  const doc = token.document;
  if (!doc?.actor || doc.actor.type !== 'character2' || !doc.actorLink) return;

  const areaData = canvas.scene?.getFlag('conan', 'areaData');
  if (!areaData?.areas || Object.keys(areaData.areas).length === 0) return;

  // Use VISUAL position (PlaceableObject.x/y — updates every frame during animation)
  const currentArea = _getTokenOverlapArea(token, areaData.areas);
  const lastArea = _playerAreaCache.get(doc.id) ?? null;

  if (currentArea !== lastArea) {
    if (currentArea === null) return; // Between areas — keep last valid area
    _playerAreaCache.set(doc.id, currentArea);
    if (game.user.isGM) {
      // GM: update marker lights + hidden flags for LOS blockers
      setTimeout(() => _recalcTorchVisibility(), 50);
    } else {
      // Player: invalidate vis cache so isVisible re-evaluates on next render frame
      _invalidatePlayerVisCache();
    }
  }
});

function _onAreaPointerMove(event) {
  // Throttle to every 80ms
  const now = Date.now();
  if (now - _areaTooltipThrottle < 80) return;
  _areaTooltipThrottle = now;

  // Don't show tooltip if mouse is over a UI element (sheet, dialog, sidebar, chat)
  const screenX = event.data.global.x;
  const screenY = event.data.global.y;
  const el = document.elementFromPoint(screenX, screenY);
  if (!el || !el.closest('#board')) {
    if (_lastAreaHovered) _clearAreaTooltipState();
    return;
  }

  const areaData = canvas.scene?.getFlag('conan', 'areaData');
  if (!areaData?.areas || !areaData?.connections) {
    if (_lastAreaHovered) {
      _lastAreaHovered = null;
      _removeAreaTooltip();
    }
    return;
  }

  // Convert screen position to world coordinates
  const worldPos = event.data.getLocalPosition(canvas.stage);
  const hoveredArea = _getAreaAtPoint(worldPos.x, worldPos.y, areaData.areas);

  if (!hoveredArea) {
    if (_lastAreaHovered) {
      _lastAreaHovered = null;
      _removeAreaTooltip();
    }
    return;
  }

  // Same area as last check — skip recalculation
  if (hoveredArea === _lastAreaHovered) return;
  _lastAreaHovered = hoveredArea;

  // Find player's controlled token
  const controlled = canvas.tokens.controlled[0];
  if (!controlled) {
    _removeAreaTooltip();
    return;
  }

  // Determine player's area
  const playerArea = _getTokenArea(controlled, areaData.areas);

  if (!playerArea) {
    _showAreaTooltip(screenX, screenY, hoveredArea, null, -1);
    return;
  }

  if (playerArea === hoveredArea) {
    _showAreaTooltip(screenX, screenY, hoveredArea, null, 0);
    return;
  }

  const distance = _getAreaDistance(areaData.connections, playerArea, hoveredArea);
  const hasLOS = _hasAreaLOS(areaData.connections, playerArea, hoveredArea, areaData.losBlockers || []);

  _showAreaTooltip(screenX, screenY, hoveredArea, distance, distance, !hasLOS);
}

/**
 * Preload Handlebars templates
 */
async function preloadHandlebarsTemplates() {
  return loadTemplates([
    "systems/conan/templates/tools-sheet.html",
    "systems/conan/templates/howard-sheet.hbs",
    "systems/conan/sheet2/actor-sheet2.hbs",
    "systems/conan/sheet2/parts/tab-home.hbs",
    "systems/conan/sheet2/parts/tab-attacks.hbs",
    "systems/conan/sheet2/parts/tab-skills.hbs",
    "systems/conan/sheet2/parts/tab-spells.hbs",
    "systems/conan/sheet2/parts/tab-equip.hbs",
    "systems/conan/sheet2/parts/tab-stamina.hbs",
    "systems/conan/sheet2/parts/tab-journal.hbs",
    "systems/conan/sheet2/character-creator-guide.hbs"
  ]);
}