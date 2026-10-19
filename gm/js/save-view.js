// Save tab: backups, restoring, and the linked save file.
(function () {
  const { h, fill, toast, timeAgo } = UI;
  const count = (n, word) => n + ' ' + word + (n === 1 ? '' : 's');

  async function run(action, done) {
    try {
      await action();
      if (done) toast(done, 'good');
    } catch (e) {
      if (e.name !== 'AbortError') toast(e.message, 'bad');
    }
    App.rerender();
  }

  function render(root) {
    const s = Store.state;
    const fileInput = h('input', {
      type: 'file', accept: '.json,application/json', hidden: true,
      onchange: e => {
        const f = e.target.files[0];
        if (!f) return;
        if (!confirm('Replace everything in the app with the contents of "' + f.name + '"?')) return;
        run(() => Store.importFile(f), 'Backup loaded.');
      }
    });

    const linked = Store.linkedFileName;
    const linkCard = Store.canLinkFile()
      ? h('div.card',
          h('h2', 'Save file in a folder'),
          h('p.muted', 'Keep your data in a real file you choose, such as one in this project folder. ' +
            'Use "Save to file" at the end of each session.'),
          linked
            ? [h('p', 'Linked to ', h('strong', linked)),
               h('div.row',
                 h('button.primary', { onclick: () => run(Store.saveToLinkedFile, 'Saved to ' + linked + '.') }, 'Save to file'),
                 h('button', { onclick: () => confirm('Replace everything in the app with the contents of ' + linked + '?') &&
                   run(Store.loadFromLinkedFile, 'Loaded from ' + linked + '.') }, 'Load from file'),
                 h('button.ghost', { onclick: () => run(Store.unlinkFile) }, 'Unlink'))]
            : h('button.primary', { onclick: () => run(Store.linkFile, 'Save file linked.') }, 'Choose a save file'))
      : h('div.card',
          h('h2', 'Save file in a folder'),
          h('p.muted', 'This browser can not save straight to a file. Open the app in Chrome or Edge to use this, or use the backup download below.'));

    fill(root,
      h('div.page-narrow',
        h('h1', 'Save'),
        h('p.muted', 'The app saves automatically in this browser as you work. ' +
          'Clearing browser data or switching browsers loses it, so keep a backup file too.'),
        h('p', 'Last backup: ', h('strong', timeAgo(s.settings.lastBackupAt))),
        linkCard,
        h('div.card',
          h('h2', 'Backup file'),
          h('p.muted', 'Download everything (players, encounters, custom NPC types, shops, map images) as one file, or load one back in.'),
          h('div.row',
            h('button.primary', { onclick: () => run(Store.exportDownload, 'Backup downloaded.') }, 'Download backup'),
            h('button', { onclick: () => fileInput.click() }, 'Load a backup'),
            fileInput)),
        h('div.card',
          h('h2', 'What is saved'),
          h('ul',
            h('li', count(s.players.length, 'player')),
            h('li', count(s.encounters.length, 'encounter')),
            h('li', count(s.customNpcs.length, 'custom NPC type')),
            h('li', count((s.shops || []).length, 'shop'))))
      )
    );
  }

  App.register('save', render);
})();
