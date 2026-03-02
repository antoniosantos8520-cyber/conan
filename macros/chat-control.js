// ──────────────────────────────────────────────────
// Chat Control — GM Macro (system-agnostic)
// ──────────────────────────────────────────────────
// Toggle two options:
//   1. Force Whisper — all player messages silently become GM whispers
//   2. Rolls Only   — block typed chat, only dice rolls go through
//
// Usage: Create a new macro (Script type), paste this in, run it.
//        Run again any time to change settings.
//
// NOTE: Uses "core" flag namespace so it works with any game system.
//       Settings persist in world flags and survive reloads,
//       but hooks must be re-applied — run the macro once after
//       each world load, or add it to a "ready" hook in a module.
// ──────────────────────────────────────────────────

(() => {
  if (!game.user.isGM) return ui.notifications.warn("GM only.");

  const NS = "core";  // flag namespace — works with any system
  const KEY = "chatControl";
  const stored = game.world.getFlag(NS, KEY) ?? { whisper: false, rollsOnly: false };

  // Hook state lives on game object so we can clean up on re-run
  if (!game._chatControl) game._chatControl = {};

  function applyHooks(opts) {
    // Remove old hooks
    if (game._chatControl.whisperHook) {
      Hooks.off("preCreateChatMessage", game._chatControl.whisperHook);
      game._chatControl.whisperHook = null;
    }
    if (game._chatControl.rollsOnlyHook) {
      Hooks.off("preCreateChatMessage", game._chatControl.rollsOnlyHook);
      game._chatControl.rollsOnlyHook = null;
    }

    if (opts.rollsOnly) {
      game._chatControl.rollsOnlyHook = Hooks.on("preCreateChatMessage", (msg) => {
        const sender = game.users.get(msg.user?.id ?? msg.user);
        if (sender?.isGM) return true;
        const hasRoll = msg.rolls?.length > 0 || msg.isRoll;
        if (!hasRoll) {
          ui.notifications.warn("Chat is restricted to rolls only.");
          return false;
        }
      });
    }

    if (opts.whisper) {
      game._chatControl.whisperHook = Hooks.on("preCreateChatMessage", (msg) => {
        const sender = game.users.get(msg.user?.id ?? msg.user);
        if (sender?.isGM) return true;
        if (msg.whisper?.length > 0) return true;
        const gmIds = game.users.filter(u => u.isGM).map(u => u.id);
        msg.updateSource({ whisper: gmIds });
      });
    }
  }

  applyHooks(stored);

  // Build dialog
  new Dialog({
    title: "Chat Control",
    content: `
      <style>
        .chat-ctrl { padding: 8px 4px; }
        .chat-ctrl label {
          display: flex; align-items: center; gap: 8px;
          padding: 6px 0; font-size: 13px; cursor: pointer;
        }
        .chat-ctrl input[type="checkbox"] { width: 16px; height: 16px; }
        .chat-ctrl .hint { font-size: 11px; color: #888; margin-left: 24px; margin-top: -4px; }
      </style>
      <div class="chat-ctrl">
        <label>
          <input type="checkbox" name="whisper" ${stored.whisper ? "checked" : ""}>
          Force Whisper to GM
        </label>
        <div class="hint">All player messages become GM whispers automatically.</div>
        <label>
          <input type="checkbox" name="rollsOnly" ${stored.rollsOnly ? "checked" : ""}>
          Rolls Only (block chat)
        </label>
        <div class="hint">Players can only send rolls — typed messages are blocked.</div>
      </div>
    `,
    buttons: {
      apply: {
        icon: '<i class="fas fa-check"></i>',
        label: "Apply",
        callback: async (html) => {
          const whisper = html.find('[name="whisper"]').is(":checked");
          const rollsOnly = html.find('[name="rollsOnly"]').is(":checked");
          const opts = { whisper, rollsOnly };
          await game.world.setFlag(NS, KEY, opts);
          applyHooks(opts);
          const parts = [];
          if (whisper) parts.push("Force Whisper ON");
          if (rollsOnly) parts.push("Rolls Only ON");
          ui.notifications.info(parts.length ? parts.join(" | ") : "Chat controls disabled.");
        }
      },
      cancel: { icon: '<i class="fas fa-times"></i>', label: "Cancel" }
    },
    default: "apply"
  }).render(true);
})();
