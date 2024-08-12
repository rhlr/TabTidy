let cache = new Map();
let MAX_TAB_COUNT = 10; // Default value if not set in storage

// Function to close tabs if the limit is exceeded
function closeOldTabs() {
  // Retrieve the maxTabs and autoCleanupEnabled settings from storage
  chrome.storage.local.get(['maxTabs', 'autoCleanup'], function(result) {
    const autoCleanupEnabled = result.autoCleanup !== undefined ? result.autoCleanup : true; // Default to true
    const maxTabCount = result.maxTabs !== undefined ? result.maxTabs : MAX_TAB_COUNT; // Use stored value or default

    if (!autoCleanupEnabled) {
      return; // Exit if auto cleanup is disabled
    }

    while (cache.size > maxTabCount) {
      const oldestTabId = cache.keys().next().value;
      chrome.tabs.remove(parseInt(oldestTabId));
      cache.delete(oldestTabId);
    }
    saveCacheToStorage();
  });
}

// Function to update the cache when a tab is interacted with
function updateCache(tab) {
  const timestamp = new Date().toISOString();
  
  // Truncate the tab title to 15 characters and add "..." if longer
  let title = tab.title;
  if (title.length > 15) {
    title = title.substring(0, 15) + '...';
  }

  // Remove the tab from the cache if it exists
  if (cache.has(tab.id)) {
    cache.delete(tab.id);
  }

  // Add the tab to the end (most recently used)
  cache.set(tab.id, { title: title, lastInteracted: timestamp });

  // Perform cleanup if needed
  closeOldTabs();
}

// Function to save the cache to local storage
function saveCacheToStorage() {
  const cacheArray = Array.from(cache.entries());
  chrome.storage.local.set({ tabtidy: cacheArray });
}

// Load the cache from local storage when the extension starts
chrome.storage.local.get(['tabtidy'], function(result) {
  if (result.tabtidy) {
    cache = new Map(result.tabtidy);
  }
});

// Listen for tab creation, update, or activation
chrome.tabs.onCreated.addListener(function(tab) {
  updateCache(tab);
});

chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {
  if (changeInfo.status === 'complete') {
    updateCache(tab);
  }
});

chrome.tabs.onActivated.addListener(function(activeInfo) {
  chrome.tabs.get(activeInfo.tabId, function(tab) {
    updateCache(tab);
  });
});

// Initial cleanup on load
closeOldTabs();
