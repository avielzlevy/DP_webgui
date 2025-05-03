document.addEventListener('DOMContentLoaded', () => {
    const cb = document.getElementById('enabled');
  
    // 1. Load saved state (default: true)
    chrome.storage.local.get(['enabled'], prefs => {
      cb.checked = prefs.enabled ?? true;
    });
  
    // 2. Listen for toggle changes
    cb.addEventListener('change', () => {
      const enabled = cb.checked;
      // Persist the new setting
      chrome.storage.local.set({ enabled });
  
      // 3. Immediately redirect the active tab
      chrome.tabs.query({ active: true, currentWindow: true }, tabs => {
        const tab = tabs[0];
        if (!tab || !tab.url) return;
  
        try {
          const url = new URL(tab.url);
          // If enabling, force Old WebGUI (root); if disabling, go to new UI
          const targetPath = enabled ? '/' : '/ui/homepage';
          const target = `${url.origin}${targetPath}`;
          // Only navigate if it’s a DataPower page
          if (url.origin === new URL(target).origin) {
            chrome.tabs.update(tab.id, { url: target });
          }
        } catch (e) {
          // malformed URL? ignore
        }
      });
    });
  });
  