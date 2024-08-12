# TabTidy Chrome Extension

**TabTidy** is a Chrome extension designed to help you manage your browser tabs efficiently using an LRU (Least Recently Used) cache. It automatically closes tabs that you haven't interacted with recently, based on customizable settings. The extension also provides a user-friendly popup interface to view tracked tabs, manually trigger cleanup, save settings, and clear the extension's storage.

## Features

- **Automatic Tab Cleanup:** Automatically closes the least recently used tabs when the number of open tabs exceeds a specified limit.
- **Customizable Settings:** Configure the maximum number of tabs to keep open and enable/disable the LRU cleanup feature.
- **Manual Cleanup:** Trigger a manual cleanup of tabs directly from the popup.
- **Tracked Tabs List:** View the list of currently tracked tabs and their last interaction times.
- **Clear Storage:** Clear all tracked tab data stored by the extension.

## Installation

1. **Clone or Download the Repository:**

   ```bash
   git clone https://github.com/your-username/TabTidy.git
   ```

   Alternatively, download the ZIP file from the GitHub repository and extract it.

2. **Load the Extension in Chrome:**

   1. Open Chrome and go to `chrome://extensions/`.
   2. Enable "Developer mode" using the toggle in the top right corner.
   3. Click on the "Load unpacked" button.
   4. Select the directory where you cloned or extracted the TabTidy extension.

3. **Start Using TabTidy:**

   - Click on the TabTidy icon in the Chrome toolbar to open the popup and access the extension's features.

## Usage

### Viewing Tracked Tabs

1. **Open the Popup:**
   - Click on the TabTidy icon in the Chrome toolbar.
   
2. **Tracked Tabs List:**
   - The popup displays a list of currently tracked tabs with their titles and the last time they were interacted with.

### Manual Cleanup

1. **Trigger Manual Cleanup:**
   - In the popup, click on the **Manual Cleanup** button to manually remove tabs that exceed your specified maximum tab count.

### Customizing Settings

1. **Max Tabs Setting:**
   - Set the maximum number of tabs to keep open in the **Max Tabs** input field.
   
2. **Enable/Disable LRU Cleanup:**
   - Use the checkbox labeled **Enable LRU** to enable or disable the automatic tab cleanup feature.
   
3. **Save Settings:**
   - Click the **Save Settings** button to apply your changes.

### Clearing Storage

1. **Clear Stored Data:**
   - In the popup, click on the **Clear Storage** button to remove all tracked tab data stored by the extension.

## How It Works

- **Tab Tracking:** TabTidy tracks your tabs based on their last interaction time and stores this information in the browser's local storage.

- **Automatic Cleanup:** When the number of open tabs exceeds the specified limit, the extension automatically closes the least recently used tabs, ensuring that you never have too many tabs open at once.

- **Customization:** You can adjust the maximum number of tabs allowed and enable or disable the automatic cleanup feature according to your preference.

## Contributing

Contributions are welcome! If you have suggestions for improvements or find any issues, feel free to submit a pull request or open an issue on GitHub.

## License
