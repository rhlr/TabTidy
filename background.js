let cache = new Map();
let MAX_TAB_COUNT = 10; // Default value if not set in storage
const RETRY_LIMIT = 3; // Maximum number of retry attempts
const RETRY_DELAY = 1000; // Delay between retries in milliseconds (e.g., 1 second)

// Check if it's the first time the extension is loaded
chrome.runtime.onInstalled.addListener(function (details) {
  if (details.reason === 'install') {
    initializeCacheWithAllTabs();
  }
});

// Function to initialize the cache with all currently open tabs
function initializeCacheWithAllTabs() {
  chrome.tabs.query({}, function (tabs) {
    tabs.forEach(tab => {
      updateCache(tab);
    });
    saveCacheToStorage();
  });
}

// Function to close a tab with retry logic
function closeTabWithRetry(tabId, retries = 0) {
  // First, check if the tab still exists
  chrome.tabs.get(tabId, function (tab) {
    if (chrome.runtime.lastError || !tab) {
      // If the tab doesn't exist, remove it from the cache
      cache.delete(tabId);
      saveCacheToStorage(); // Save the updated cache
      return;
    }

    // If the tab exists, try to close it
    chrome.tabs.remove(tabId).catch(error => {
      if (retries < RETRY_LIMIT) {
        setTimeout(() => closeTabWithRetry(tabId, retries + 1), RETRY_DELAY);
      } else {
        console.error(`Failed to close tab ${tabId} after ${RETRY_LIMIT} attempts:`, error);
      }
    });
  });
}

// Function to close tabs if the limit is exceeded
function closeOldTabs() {
  // Retrieve the maxTabs and autoCleanupEnabled settings from storage
  chrome.storage.local.get(['maxTabs', 'autoCleanup'], function (result) {
    const autoCleanupEnabled = result.autoCleanup !== undefined ? result.autoCleanup : true; // Default to true
    const maxTabCount = result.maxTabs !== undefined ? result.maxTabs : MAX_TAB_COUNT; // Use stored value or default

    if (!autoCleanupEnabled) {
      return; // Exit if auto cleanup is disabled
    }

    while (cache.size > maxTabCount) {
      const oldestTabId = cache.keys().next().value;
      closeTabWithRetry(parseInt(oldestTabId)); // Use retry logic when closing the tab
      cache.delete(oldestTabId);
      saveCacheToStorage(); // Save the updated cache
    }
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
  saveCacheToStorage();
}

// Function to handle manual tab closures and remove them from the cache
// Warning: Redundant code as a safeguard to ensure the cache stays clean
chrome.tabs.onRemoved.addListener(function (tabId, removeInfo) {
  if (cache.has(tabId)) {
    cache.delete(tabId);
    saveCacheToStorage(); // Save the updated cache
  }
});

// Function to save the cache to local storage
function saveCacheToStorage() {
  const cacheArray = Array.from(cache.entries());
  chrome.storage.local.set({ tabtidy: cacheArray });
}

// Load the cache from local storage when the extension starts
chrome.storage.local.get(['tabtidy'], function (result) {
  if (result.tabtidy) {
    cache = new Map(result.tabtidy);
  }
});

// Listen for tab creation, update, or activation
chrome.tabs.onCreated.addListener(function (tab) {
  updateCache(tab);
});

chrome.tabs.onUpdated.addListener(function (tabId, changeInfo, tab) {
  if (changeInfo.status === 'complete') {
    updateCache(tab);
  }
});

chrome.tabs.onActivated.addListener(function (activeInfo) {
  chrome.tabs.get(activeInfo.tabId, function (tab) {
    updateCache(tab);
  });
});

// Initial cleanup on load
closeOldTabs();
