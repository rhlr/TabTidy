document.addEventListener('DOMContentLoaded', function() {
  const tabListElement = document.getElementById('tabs');
  const cleanupButton = document.getElementById('cleanupButton');
  const maxTabsInput = document.getElementById('maxTabs');
  const enableLRUCheckbox = document.getElementById('enableLRU');
  const saveSettingsButton = document.getElementById('saveSettings');
  const clearStorageButton = document.getElementById('clearStorageButton');

  // Load the cache and settings from local storage
  loadSettings();

  // Display the list of tracked tabs
  chrome.storage.local.get(['tabtidy'], function(result) {
    if (result.tabtidy) {
      const cache = new Map(result.tabtidy);  // Initialize cache here
      tabListElement.innerHTML = '';
      cache.forEach((data, tabId) => {
        const tabItem = document.createElement('div');
        tabItem.className = 'tab-item';
        tabItem.innerHTML = `
          <span>${data.title}</span>
          <span>Last: ${new Date(data.lastInteracted).toLocaleString()}</span>
        `;
        tabListElement.appendChild(tabItem);
      });
    } else {
      tabListElement.innerHTML = '<p>No tabs are currently tracked.</p>';
    }
  });

  // Handle manual cleanup
  cleanupButton.addEventListener('click', function() {
    manualCleanup();
  });

  // Handle settings save
  saveSettingsButton.addEventListener('click', function() {
    const maxTabs = parseInt(maxTabsInput.value, 10);
    const enableLRU = enableLRUCheckbox.checked;
    saveSettings(maxTabs, enableLRU);
  });

  // Handle storage clear
  clearStorageButton.addEventListener('click', function() {
    clearStorage();
  });

  // Function to manually trigger the tab cleanup process
  function manualCleanup() {
    chrome.storage.local.get(['tabtidy'], function(result) {
      const cache = new Map(result.tabtidy);
      const maxTabs = parseInt(maxTabsInput.value, 10);
      while (cache.size > maxTabs) {
        const oldestTabId = cache.keys().next().value;
        chrome.tabs.remove(parseInt(oldestTabId));
        cache.delete(oldestTabId);
      }
      saveCacheToStorage(cache);
      alert('Manual cleanup completed.');
      window.location.reload(); // Refresh the popup to update the tab list
    });
  }

  // Function to load settings from storage
  function loadSettings() {
    chrome.storage.local.get(['maxTabs', 'enableLRU'], function(result) {
      if (result.maxTabs) {
        maxTabsInput.value = result.maxTabs;
      }
      if (result.enableLRU !== undefined) {
        enableLRUCheckbox.checked = result.enableLRU;
      }
    });
  }

  // Function to save settings to storage
  function saveSettings(maxTabs, enableLRU) {
    chrome.storage.local.set({
      maxTabs: maxTabs,
      enableLRU: enableLRU
    }, function() {
      alert('Settings saved.');
    });
  }

  // Function to save the cache
  function saveCacheToStorage(cache) {
    const cacheArray = Array.from(cache.entries());
    chrome.storage.local.set({ tabtidy: cacheArray });
  }

  // Function to clear the tabtidy storage
  function clearStorage() {
    chrome.storage.local.remove('tabtidy', function() {
      alert('Storage cleared.');
      window.location.reload(); // Refresh the popup to update the tab list
    });
  }
});
