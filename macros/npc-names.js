// NPC Names — Quick Reference Macro
// Paste this into a Foundry Script macro

(() => {
  const SETTING_KEY = 'npc-names-list';
  const FLAG_SCOPE = 'world';

  // Register setting if not already done
  if (!game.settings.settings.has(`${FLAG_SCOPE}.${SETTING_KEY}`)) {
    game.settings.register(FLAG_SCOPE, SETTING_KEY, {
      name: 'NPC Names List',
      scope: 'world',
      config: false,
      type: Array,
      default: []
    });
  }

  // If already open, bring to front
  const existing = Object.values(ui.windows).find(w => w.options?.id === 'npc-names-dialog');
  if (existing) { existing.bringToTop(); return; }

  function getNpcs() {
    try { return game.settings.get(FLAG_SCOPE, SETTING_KEY) || []; }
    catch { return []; }
  }

  function saveNpcs(list) {
    return game.settings.set(FLAG_SCOPE, SETTING_KEY, list);
  }

  function renderList(html) {
    const list = getNpcs();
    const container = html.find('.npc-names-list');
    if (!list.length) {
      container.html('<div class="npc-names-empty">No NPCs added yet.</div>');
      return;
    }
    let cards = '';
    for (let i = 0; i < list.length; i++) {
      const n = list[i];
      cards += `
        <div class="npc-names-card" data-index="${i}">
          <img src="${n.img}" class="npc-names-portrait" />
          <div class="npc-names-label">
            <button type="button" class="npc-names-delete" data-index="${i}" title="Delete"><i class="fas fa-trash"></i></button>
            <span class="npc-names-name">${n.name}</span>
          </div>
        </div>`;
    }
    container.html(cards);

    // Wire delete buttons
    container.find('.npc-names-delete').click(async (ev) => {
      ev.stopPropagation();
      const idx = parseInt(ev.currentTarget.dataset.index);
      const npc = list[idx];
      const confirm = await Dialog.confirm({
        title: 'Delete NPC',
        content: `<p>Remove <strong>${npc.name}</strong> from the list?</p>`
      });
      if (confirm) {
        const updated = getNpcs().filter((_, j) => j !== idx);
        await saveNpcs(updated);
        renderList(html);
      }
    });
  }

  const dialogContent = `
    <div class="npc-names-wrapper">
      <button type="button" class="npc-names-add-btn"><i class="fas fa-plus"></i> Add NPC</button>
      <div class="npc-names-list"></div>
    </div>
    <style>
      #npc-names-dialog .dialog-content { overflow: hidden; }
      #npc-names-dialog .dialog-buttons { display: none; }
      .npc-names-wrapper {
        display: flex;
        flex-direction: column;
        gap: 6px;
        height: 100%;
      }
      .npc-names-add-btn {
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 6px;
        padding: 6px 10px;
        background: rgba(255,255,255,0.08);
        border: 1px solid #666;
        border-radius: 4px;
        color: #ccc;
        cursor: pointer;
        font-size: 12px;
        flex-shrink: 0;
      }
      .npc-names-add-btn:hover { background: rgba(255,255,255,0.15); color: #fff; }
      .npc-names-list {
        display: flex;
        flex-wrap: wrap;
        gap: 8px;
        overflow-y: auto;
        flex: 1;
        align-content: flex-start;
      }
      .npc-names-card {
        display: flex;
        flex-direction: column;
        align-items: center;
        width: 80px;
      }
      .npc-names-portrait {
        width: 80px;
        height: 80px;
        object-fit: cover;
        border-radius: 4px;
        border: 1px solid #555;
      }
      .npc-names-label {
        display: flex;
        align-items: center;
        gap: 3px;
        margin-top: 2px;
        width: 100%;
      }
      .npc-names-name {
        font-size: 11px;
        font-weight: 600;
        color: #eee;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        flex: 1;
      }
      .npc-names-delete {
        background: none;
        border: none;
        color: #c44;
        cursor: pointer;
        font-size: 10px;
        padding: 0;
        width: 15px;
        height: 15px;
        display: flex;
        align-items: center;
        justify-content: center;
        flex-shrink: 0;
      }
      .npc-names-delete:hover { color: #f66; }
      .npc-names-empty {
        font-size: 12px;
        color: #888;
        font-style: italic;
        text-align: center;
        padding: 12px;
        width: 100%;
      }
    </style>`;

  const dlg = new Dialog({
    title: 'NPC Names',
    content: dialogContent,
    buttons: {},
    render: (html) => {
      renderList(html);

      html.find('.npc-names-add-btn').click(() => {
        let pickedImg = 'icons/svg/mystery-man.svg';
        const addContent = `
          <form style="display:flex;flex-direction:column;gap:8px;padding:4px;">
            <div style="display:flex;gap:8px;align-items:center;">
              <img src="${pickedImg}" class="npc-add-preview" style="width:48px;height:48px;object-fit:cover;border-radius:4px;border:1px solid #555;cursor:pointer;" title="Click to pick image" />
              <input type="text" name="npcName" placeholder="NPC Name" style="flex:1;" autofocus />
            </div>
          </form>`;

        new Dialog({
          title: 'Add NPC',
          content: addContent,
          buttons: {
            add: {
              icon: '<i class="fas fa-plus"></i>',
              label: 'Add',
              callback: async (addHtml) => {
                const name = addHtml.find('[name="npcName"]').val()?.trim();
                if (!name) return;
                const list = getNpcs();
                list.push({ name, img: pickedImg });
                await saveNpcs(list);
                renderList(html);
              }
            },
            cancel: { label: 'Cancel' }
          },
          default: 'add',
          render: (addHtml) => {
            addHtml.find('.npc-add-preview').click(() => {
              new FilePicker({
                type: 'image',
                current: pickedImg,
                callback: (path) => {
                  pickedImg = path;
                  addHtml.find('.npc-add-preview').attr('src', path);
                }
              }).render(true);
            });
          }
        }).render(true);
      });
    },
    close: () => {}
  }, {
    id: 'npc-names-dialog',
    width: 280,
    height: 350,
    resizable: true,
    classes: ['bpm-dialog-window']
  });
  dlg.render(true);
})();
