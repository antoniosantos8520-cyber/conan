/**
 * The Dread Clock — Foundry VTT
 * Tracks the 11 hours from sundown (7 PM) to dawn (6 AM).
 * GM advances/retreats the clock. Players can view.
 * Called via: game.conan.dreadClock()
 */

const DREAD_HOURS = [
  { time: '7 PM',  label: 'Sundown',            tolls: 1,  untilDawn: 11, message: `The sun drops below the harbor. Shadows stretch across the cobblestones of Toragis. Night begins.` },
  { time: '8 PM',  label: '2nd Hour of Night',   tolls: 2,  untilDawn: 10, message: `The bells toll. The last light dies on the western water.` },
  { time: '9 PM',  label: '3rd Hour of Night',   tolls: 3,  untilDawn: 9,  message: `The bells toll the third hour. The streets darken.` },
  { time: '10 PM', label: '4th Hour of Night',   tolls: 4,  untilDawn: 8,  message: `The bells toll. Midnight approaches. The city grows quiet.` },
  { time: '11 PM', label: '5th Hour of Night',   tolls: 5,  untilDawn: 7,  message: `The bells toll. The hour is late. Few remain on the streets.` },
  { time: '12 AM', label: 'Midnight',            tolls: 6,  untilDawn: 6,  message: `Midnight. The bells toll deep and slow. The darkest hour.` },
  { time: '1 AM',  label: '7th Hour of Night',   tolls: 7,  untilDawn: 5,  message: `The bells toll. The night stretches on. Dawn is a distant promise.` },
  { time: '2 AM',  label: '8th Hour of Night',   tolls: 8,  untilDawn: 4,  message: `The bells toll. The cold hour. Even the taverns have gone dark.` },
  { time: '3 AM',  label: '9th Hour of Night',   tolls: 9,  untilDawn: 3,  message: `The bells toll. The air changes. Something stirs in the east — not yet light, but the memory of it.` },
  { time: '4 AM',  label: '10th Hour of Night',  tolls: 10, untilDawn: 2,  message: `The bells toll. Two hours. The sky above the eastern hills is not yet pale, but it will be.` },
  { time: '5 AM',  label: '11th Hour of Night',  tolls: 11, untilDawn: 1,  message: `The bells toll. One hour. The first grey light touches the highest rooftops. Hold on.` },
  { time: '6 AM',  label: 'Dawn',                tolls: 12, untilDawn: 0,  message: `The bells toll six. The sky over the eastern hills goes gold. The sun rises over Toragis. Dawn.` }
];

// Desperate flavor text for "hours until dawn"
function _dawnText(hour) {
  const h = DREAD_HOURS[hour];
  if (hour === 0)  return 'Night begins. Dawn is far away.';
  if (hour <= 3)   return `${h.untilDawn} hours until dawn.`;
  if (hour === 4)  return `${h.untilDawn} hours until dawn. The night deepens.`;
  if (hour === 5)  return 'Midnight. The darkest hour.';
  if (hour <= 7)   return `${h.untilDawn} hours until dawn. Hold fast.`;
  if (hour === 8)  return `${h.untilDawn} hours. Not yet. Almost.`;
  if (hour === 9)  return '2 hours. The east remembers light.';
  if (hour === 10) return '1 hour. Hold on.';
  if (hour === 11) return 'Dawn.';
  return '';
}

// Build the SVG clock face
function _buildClockSVG(hour) {
  const size = 180;
  const cx = size / 2, cy = size / 2;
  const r = 75; // main arc radius
  const notchOuter = 80, notchInner = 70;
  const markerR = 6;

  // Arc goes from 7PM (135°) clockwise through midnight (top, 270°) to 6AM (405°=45°)
  // That's 270° of arc for 11 hours
  const startAngle = 135; // 7 PM at bottom-left
  const totalArc = 270;   // sweep to 6 AM at bottom-right

  function angleForHour(h) {
    return startAngle + (h / 11) * totalArc;
  }

  function toRad(deg) { return deg * Math.PI / 180; }
  function polarX(angle, radius) { return cx + radius * Math.cos(toRad(angle)); }
  function polarY(angle, radius) { return cy + radius * Math.sin(toRad(angle)); }

  // Build notch marks
  let notches = '';
  for (let i = 0; i <= 11; i++) {
    const a = angleForHour(i);
    const x1 = polarX(a, notchInner), y1 = polarY(a, notchInner);
    const x2 = polarX(a, notchOuter), y2 = polarY(a, notchOuter);
    const cls = i === hour ? 'dread-notch dread-notch-active' : 'dread-notch';
    const width = (i === 0 || i === 5 || i === 11) ? 2.5 : 1.5;
    notches += `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" class="${cls}" stroke-width="${width}"/>`;
  }

  // Arc path for the background arc (full dusk-to-dawn)
  const arcStart = angleForHour(0);
  const arcEnd = angleForHour(11);
  const ax1 = polarX(arcStart, r), ay1 = polarY(arcStart, r);
  const ax2 = polarX(arcEnd, r), ay2 = polarY(arcEnd, r);

  // Elapsed arc (from start to current hour)
  let elapsedArc = '';
  if (hour > 0) {
    const eEnd = angleForHour(hour);
    const ex2 = polarX(eEnd, r), ey2 = polarY(eEnd, r);
    const eSweep = (hour / 11) * totalArc;
    const eLargeArc = eSweep > 180 ? 1 : 0;
    elapsedArc = `<path d="M ${ax1} ${ay1} A ${r} ${r} 0 ${eLargeArc} 1 ${ex2} ${ey2}"
      class="dread-arc-elapsed" fill="none" stroke-width="6"/>`;
  }

  // Remaining arc (current hour to dawn)
  let remainingArc = '';
  if (hour < 11) {
    const rStart = angleForHour(hour);
    const rx1 = polarX(rStart, r), ry1 = polarY(rStart, r);
    const rSweep = ((11 - hour) / 11) * totalArc;
    const rLargeArc = rSweep > 180 ? 1 : 0;
    remainingArc = `<path d="M ${rx1} ${ry1} A ${r} ${r} 0 ${rLargeArc} 1 ${ax2} ${ay2}"
      class="dread-arc-remaining" fill="none" stroke-width="6"/>`;
  }

  // Marker dot at current hour
  const mAngle = angleForHour(hour);
  const mx = polarX(mAngle, r), my = polarY(mAngle, r);
  const markerClass = hour === 11 ? 'dread-marker dread-marker-dawn' : 'dread-marker';

  // Skull glyph in center — clickable reset button at dawn (GM only)
  const skullClickable = hour === 11 && game.user?.isGM;
  const skull = skullClickable
    ? `<g class="dread-skull-reset" style="cursor:pointer"><circle cx="${cx}" cy="${cy}" r="22" fill="transparent"/><text x="${cx}" y="${cy + 2}" class="dread-skull dread-skull-active">☠</text></g>`
    : `<text x="${cx}" y="${cy + 2}" class="dread-skull">☠</text>`;

  // Threat threshold display (GM only, below skull)
  const threshold = game.settings?.get('conan', 'dreadClockThreshold') ?? 8;
  const thresholdText = game.user?.isGM
    ? `<text x="${cx}" y="${cy + 22}" class="dread-threshold-text">${threshold}+</text>`
    : '';

  // Dawn/dusk labels
  const duskX = polarX(angleForHour(0), r - 18), duskY = polarY(angleForHour(0), r - 18);
  const dawnX = polarX(angleForHour(11), r - 18), dawnY = polarY(angleForHour(11), r - 18);

  return `
    <svg viewBox="0 0 ${size} ${size}" class="dread-clock-svg" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <radialGradient id="dreadBronzeBg">
          <stop offset="0%" stop-color="#3a2f1e"/>
          <stop offset="70%" stop-color="#2a1f12"/>
          <stop offset="100%" stop-color="#1a1008"/>
        </radialGradient>
        <filter id="dreadGlow">
          <feGaussianBlur stdDeviation="3" result="blur"/>
          <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
        </filter>
      </defs>

      <!-- Bronze disk background -->
      <circle cx="${cx}" cy="${cy}" r="88" class="dread-disk-outer"/>
      <circle cx="${cx}" cy="${cy}" r="85" class="dread-disk"/>

      <!-- Arcs -->
      ${elapsedArc}
      ${remainingArc}

      <!-- Notches -->
      ${notches}

      <!-- Labels -->
      <text x="${duskX}" y="${duskY}" class="dread-label-dusk">dusk</text>
      <text x="${dawnX}" y="${dawnY}" class="dread-label-dawn">dawn</text>

      <!-- Skull center -->
      ${skull}
      ${thresholdText}

      <!-- Marker -->
      <circle cx="${mx}" cy="${my}" r="${markerR}" class="${markerClass}" filter="url(#dreadGlow)"/>
    </svg>
  `;
}

// Build dialog HTML
function _buildContent(hour) {
  const h = DREAD_HOURS[hour];
  const isDawn = hour === 11;
  const svg = _buildClockSVG(hour);

  const threshold = game.settings.get('conan', 'dreadClockThreshold');

  // Corner buttons around the clock face (GM only)
  const cornerBtns = game.user.isGM ? `
    <button class="dread-corner dread-corner-tl dread-threat-minus" title="Reduce threat (harder to trigger)">−</button>
    <button class="dread-corner dread-corner-tr dread-threat-plus" title="Increase threat (easier to trigger)">+</button>
    <button class="dread-corner dread-corner-bl dread-threat-roll" title="Roll d8 vs ${threshold}+">⚄</button>
    <button class="dread-corner dread-corner-br dread-threat-reset" title="Reset threshold to 8">↺</button>
  ` : '';

  const gmControls = game.user.isGM ? `
    <div class="dread-controls">
      <button class="dread-btn dread-btn-retreat" ${hour === 0 ? 'disabled' : ''}>◄ Retreat</button>
      <button class="dread-btn dread-btn-advance" ${hour === 11 ? 'disabled' : ''}>Advance ►</button>
    </div>
  ` : '';

  return `
    <div class="dread-clock-container${isDawn ? ' dread-dawn' : ''}">
      <div class="dread-clock-ring">
        ${svg}
        ${cornerBtns}
      </div>
      <div class="dread-hour-label">${h.label}</div>
      <div class="dread-dawn-text">${_dawnText(hour)}</div>
      ${gmControls}
    </div>
  `;
}

// Send styled chat message
async function _sendTollMessage(hour) {
  const h = DREAD_HOURS[hour];
  const isDawn = hour === 11;

  const content = `
    <div class="dread-chat-toll dread-sky-${hour}${isDawn ? ' dread-chat-dawn' : ''}">
      <div class="dread-chat-bell">${isDawn ? '☀' : '🔔'}</div>
      <div class="dread-chat-text">${h.message}</div>
      <div class="dread-chat-time">${h.label} — ${h.time}</div>
    </div>
  `;

  await ChatMessage.create({
    content,
    speaker: { alias: 'The Bells of Toragis' },
    whisper: [] // visible to all
  });
}

// Reset chat message — new night begins
async function _sendResetMessage() {
  const content = `
    <div class="dread-chat-toll dread-sky-0">
      <div class="dread-chat-bell">☠</div>
      <div class="dread-chat-text">The sun drops below the harbor once more. The shadows lengthen. The Headsman stirs. Another night begins.</div>
      <div class="dread-chat-time">Sundown — 7 PM</div>
    </div>
  `;
  await ChatMessage.create({
    content,
    speaker: { alias: 'The Bells of Toragis' },
    whisper: []
  });
}

// Roll the Headsman threat check
async function _rollThreatCheck() {
  const threshold = game.settings.get('conan', 'dreadClockThreshold');
  const roll = await new Roll('1d8').evaluate();
  const triggered = roll.total >= threshold;

  const content = `
    <div class="dread-chat-toll dread-sky-5">
      <div class="dread-chat-bell">${triggered ? '☠' : '🎲'}</div>
      <div class="dread-chat-text dread-chat-roll-result ${triggered ? 'dread-chat-triggered' : 'dread-chat-safe'}">
        ${triggered
          ? `<span class="dread-roll-value">${roll.total}</span> — The Headsman appears.`
          : `<span class="dread-roll-value">${roll.total}</span> — The streets are quiet... for now.`
        }
      </div>
      <div class="dread-chat-time">d8 vs ${threshold}+</div>
    </div>
  `;

  await ChatMessage.create({
    content,
    speaker: { alias: 'The Bells of Toragis' },
    whisper: []
  });

  // If triggered, reset threshold back to 8
  if (triggered) {
    await game.settings.set('conan', 'dreadClockThreshold', 8);
  }
}

// Refresh the clock UI after threshold change
function _refreshClock() {
  if (!_dreadDialog?.rendered) return;
  const hour = game.settings.get('conan', 'dreadClockHour');
  const el = _dreadDialog.element;
  el.find('.dread-clock-container').replaceWith(_buildContent(hour));
  _bindGMControls(el);
}

// Bind all GM controls on a dialog element
function _bindGMControls(el) {
  if (!game.user.isGM) return;

  el.find('.dread-btn-advance').click(async () => {
    const cur = game.settings.get('conan', 'dreadClockHour');
    if (cur >= 11) return;
    const next = cur + 1;
    await game.settings.set('conan', 'dreadClockHour', next);
    await _sendTollMessage(next);
  });

  el.find('.dread-btn-retreat').click(async () => {
    const cur = game.settings.get('conan', 'dreadClockHour');
    if (cur <= 0) return;
    await game.settings.set('conan', 'dreadClockHour', cur - 1);
  });

  // Skull reset — only present at dawn
  el.find('.dread-skull-reset').click(async () => {
    await game.settings.set('conan', 'dreadClockHour', 0);
    await _sendResetMessage();
  });

  // Threat corner buttons
  el.find('.dread-threat-minus').click(async () => {
    const cur = game.settings.get('conan', 'dreadClockThreshold');
    if (cur >= 8) return;
    await game.settings.set('conan', 'dreadClockThreshold', cur + 1);
    _refreshClock();
  });

  el.find('.dread-threat-plus').click(async () => {
    const cur = game.settings.get('conan', 'dreadClockThreshold');
    if (cur <= 1) return;
    await game.settings.set('conan', 'dreadClockThreshold', cur - 1);
    _refreshClock();
  });

  el.find('.dread-threat-roll').click(async () => {
    await _rollThreatCheck();
    _refreshClock();
  });

  el.find('.dread-threat-reset').click(async () => {
    await game.settings.set('conan', 'dreadClockThreshold', 8);
    _refreshClock();
  });
}

// Singleton dialog reference
let _dreadDialog = null;

// Main function — opens or focuses the clock
export function dreadClock() {
  if (_dreadDialog && _dreadDialog.rendered) {
    _dreadDialog.bringToTop();
    return;
  }

  const hour = game.settings.get('conan', 'dreadClockHour');

  _dreadDialog = new Dialog({
    title: 'The Dread Clock',
    content: _buildContent(hour),
    buttons: {},
    render: (html) => {
      html.closest('.dialog').find('.dialog-buttons').hide();
      _bindGMControls(html);
    },
    close: () => { _dreadDialog = null; }
  }, {
    width: 220,
    height: game.user.isGM ? 340 : 300,
    resizable: false,
    id: 'dread-clock-dialog'
  });

  _dreadDialog.render(true);
}

// Hook: re-render any open clock dialog when settings change (live sync)
Hooks.on('updateSetting', (setting) => {
  if ((setting.key === 'conan.dreadClockHour' || setting.key === 'conan.dreadClockThreshold') && _dreadDialog?.rendered) {
    _refreshClock();
  }
});
