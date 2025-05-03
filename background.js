chrome.tabs.onUpdated.addListener(async (tabId, changeInfo, tab) => {
    if (changeInfo.url) {
        try {
            const { enabled } = await chrome.storage.local.get(['enabled']);
            if (enabled === false) {
                return;
            }
            const url = new URL(changeInfo.url);
            if (url.pathname === '/ui/homepage') {
                // Redirect to the root of the same origin
                chrome.tabs.update(tabId, { url: `${url.origin}/` });
            }
        } catch (e) {
            // ignore invalid URLs
        }
    }
});

