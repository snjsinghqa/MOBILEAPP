import Helper from '@codeceptjs/helper';

/**
 * @author Sanjay Singh Panwar
 * Custom Mobile Helper for advanced mobile gestures and actions
 */
class MobileHelper extends Helper {
  
  /**
 * @author Sanjay Singh Panwar
   * Get the Appium helper instance
   */
  private getAppium() {
    return this.helpers['Appium'];
  }

  /**
 * @author Sanjay Singh Panwar
   * Get the WebDriver browser instance
   */
  private getBrowser() {
    return this.getAppium().browser;
  }

  /**
 * @author Sanjay Singh Panwar
   * Swipe from one point to another
   * @param startX - Starting X coordinate (percentage 0-1)
   * @param startY - Starting Y coordinate (percentage 0-1)
   * @param endX - Ending X coordinate (percentage 0-1)
   * @param endY - Ending Y coordinate (percentage 0-1)
   * @param duration - Duration of swipe in ms
   */
  async swipe(startX: number, startY: number, endX: number, endY: number, duration: number = 800) {
    const browser = this.getBrowser();
    const { width, height } = await browser.getWindowSize();
    
    await browser.performActions([
      {
        type: 'pointer',
        id: 'finger1',
        parameters: { pointerType: 'touch' },
        actions: [
          { type: 'pointerMove', duration: 0, x: Math.round(width * startX), y: Math.round(height * startY) },
          { type: 'pointerDown', button: 0 },
          { type: 'pause', duration: 100 },
          { type: 'pointerMove', duration, x: Math.round(width * endX), y: Math.round(height * endY) },
          { type: 'pointerUp', button: 0 },
        ],
      },
    ]);
    
    await browser.releaseActions();
  }

  /**
 * @author Sanjay Singh Panwar
   * Swipe up on the screen
   * @param percentage - How much to swipe (0-1)
   */
  async swipeUp(percentage: number = 0.5) {
    await this.swipe(0.5, 0.7, 0.5, 0.7 - percentage);
  }

  /**
 * @author Sanjay Singh Panwar
   * Swipe down on the screen
   * @param percentage - How much to swipe (0-1)
   */
  async swipeDown(percentage: number = 0.5) {
    await this.swipe(0.5, 0.3, 0.5, 0.3 + percentage);
  }

  /**
 * @author Sanjay Singh Panwar
   * Swipe left on the screen
   * @param percentage - How much to swipe (0-1)
   */
  async swipeLeft(percentage: number = 0.5) {
    await this.swipe(0.8, 0.5, 0.8 - percentage, 0.5);
  }

  /**
 * @author Sanjay Singh Panwar
   * Swipe right on the screen
   * @param percentage - How much to swipe (0-1)
   */
  async swipeRight(percentage: number = 0.5) {
    await this.swipe(0.2, 0.5, 0.2 + percentage, 0.5);
  }

  /**
 * @author Sanjay Singh Panwar
   * Scroll to element by swiping until element is visible
   * @param locator - Element locator
   * @param maxSwipes - Maximum number of swipes
   * @param direction - Direction to swipe ('up' | 'down')
   */
  async scrollToElement(locator: string, maxSwipes: number = 10, direction: 'up' | 'down' = 'up') {
    const appium = this.getAppium();
    
    for (let i = 0; i < maxSwipes; i++) {
      try {
        const element = await appium.grabNumberOfVisibleElements(locator);
        if (element > 0) {
          return true;
        }
      } catch (e) {
        // Element not found, continue swiping
      }
      
      if (direction === 'up') {
        await this.swipeUp(0.3);
      } else {
        await this.swipeDown(0.3);
      }
      
      await this.pause(500);
    }
    
    throw new Error(`Element ${locator} not found after ${maxSwipes} swipes`);
  }

  /**
 * @author Sanjay Singh Panwar
   * Long press on an element
   * @param locator - Element locator
   * @param duration - Duration of press in ms
   */
  async longPress(locator: string, duration: number = 2000) {
    const appium = this.getAppium();
    const browser = this.getBrowser();
    
    const element = await browser.$(locator);
    const location = await element.getLocation();
    const size = await element.getSize();
    
    const centerX = location.x + size.width / 2;
    const centerY = location.y + size.height / 2;
    
    await browser.performActions([
      {
        type: 'pointer',
        id: 'finger1',
        parameters: { pointerType: 'touch' },
        actions: [
          { type: 'pointerMove', duration: 0, x: Math.round(centerX), y: Math.round(centerY) },
          { type: 'pointerDown', button: 0 },
          { type: 'pause', duration },
          { type: 'pointerUp', button: 0 },
        ],
      },
    ]);
    
    await browser.releaseActions();
  }

  /**
 * @author Sanjay Singh Panwar
   * Double tap on an element
   * @param locator - Element locator
   */
  async doubleTap(locator: string) {
    const appium = this.getAppium();
    await appium.tap(locator);
    await this.pause(100);
    await appium.tap(locator);
  }

  /**
 * @author Sanjay Singh Panwar
   * Pinch gesture (zoom out)
   * @param scale - Scale factor (0.5 = 50% zoom out)
   */
  async pinch(scale: number = 0.5) {
    const browser = this.getBrowser();
    const { width, height } = await browser.getWindowSize();
    
    const centerX = width / 2;
    const centerY = height / 2;
    const distance = 100;
    
    await browser.performActions([
      {
        type: 'pointer',
        id: 'finger1',
        parameters: { pointerType: 'touch' },
        actions: [
          { type: 'pointerMove', duration: 0, x: centerX - distance, y: centerY },
          { type: 'pointerDown', button: 0 },
          { type: 'pointerMove', duration: 500, x: centerX - (distance * scale), y: centerY },
          { type: 'pointerUp', button: 0 },
        ],
      },
      {
        type: 'pointer',
        id: 'finger2',
        parameters: { pointerType: 'touch' },
        actions: [
          { type: 'pointerMove', duration: 0, x: centerX + distance, y: centerY },
          { type: 'pointerDown', button: 0 },
          { type: 'pointerMove', duration: 500, x: centerX + (distance * scale), y: centerY },
          { type: 'pointerUp', button: 0 },
        ],
      },
    ]);
    
    await browser.releaseActions();
  }

  /**
 * @author Sanjay Singh Panwar
   * Zoom gesture (zoom in)
   * @param scale - Scale factor (2 = 200% zoom in)
   */
  async zoom(scale: number = 2) {
    const browser = this.getBrowser();
    const { width, height } = await browser.getWindowSize();
    
    const centerX = width / 2;
    const centerY = height / 2;
    const distance = 50;
    
    await browser.performActions([
      {
        type: 'pointer',
        id: 'finger1',
        parameters: { pointerType: 'touch' },
        actions: [
          { type: 'pointerMove', duration: 0, x: centerX - distance, y: centerY },
          { type: 'pointerDown', button: 0 },
          { type: 'pointerMove', duration: 500, x: centerX - (distance * scale), y: centerY },
          { type: 'pointerUp', button: 0 },
        ],
      },
      {
        type: 'pointer',
        id: 'finger2',
        parameters: { pointerType: 'touch' },
        actions: [
          { type: 'pointerMove', duration: 0, x: centerX + distance, y: centerY },
          { type: 'pointerDown', button: 0 },
          { type: 'pointerMove', duration: 500, x: centerX + (distance * scale), y: centerY },
          { type: 'pointerUp', button: 0 },
        ],
      },
    ]);
    
    await browser.releaseActions();
  }

  /**
 * @author Sanjay Singh Panwar
   * Hide keyboard if visible
   */
  async hideKeyboard() {
    const browser = this.getBrowser();
    try {
      await browser.hideKeyboard();
    } catch (e) {
      // Keyboard might not be visible
    }
  }

  /**
 * @author Sanjay Singh Panwar
   * Get device orientation
   */
  async getOrientation(): Promise<string> {
    const browser = this.getBrowser();
    return await browser.getOrientation();
  }

  /**
 * @author Sanjay Singh Panwar
   * Set device orientation
   * @param orientation - 'PORTRAIT' or 'LANDSCAPE'
   */
  async setOrientation(orientation: 'PORTRAIT' | 'LANDSCAPE') {
    const browser = this.getBrowser();
    await browser.setOrientation(orientation);
  }

  /**
 * @author Sanjay Singh Panwar
   * Toggle airplane mode (Android only)
   */
  async toggleAirplaneMode() {
    const browser = this.getBrowser();
    await browser.toggleAirplaneMode();
  }

  /**
 * @author Sanjay Singh Panwar
   * Toggle WiFi (Android only)
   */
  async toggleWifi() {
    const browser = this.getBrowser();
    await browser.toggleWiFi();
  }

  /**
 * @author Sanjay Singh Panwar
   * Toggle location services
   */
  async toggleLocationServices() {
    const browser = this.getBrowser();
    await browser.toggleLocationServices();
  }

  /**
 * @author Sanjay Singh Panwar
   * Pause execution for specified milliseconds
   * @param ms - Milliseconds to pause
   */
  async pause(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  /**
 * @author Sanjay Singh Panwar
   * Take a screenshot and save it
   * @param name - Screenshot name
   */
  async takeScreenshot(name: string) {
    const appium = this.getAppium();
    await appium.saveScreenshot(`./output/screenshots/${name}.png`);
  }

  /**
 * @author Sanjay Singh Panwar
   * Wait for element to be visible and clickable
   * @param locator - Element locator
   * @param timeout - Timeout in seconds
   */
  async waitForElementClickable(locator: string, timeout: number = 10) {
    const appium = this.getAppium();
    await appium.waitForElement(locator, timeout);
    await appium.waitForVisible(locator, timeout);
  }

  /**
 * @author Sanjay Singh Panwar
   * Get element text
   * @param locator - Element locator
   */
  async getElementText(locator: string): Promise<string> {
    const browser = this.getBrowser();
    const element = await browser.$(locator);
    return await element.getText();
  }

  /**
 * @author Sanjay Singh Panwar
   * Check if element is displayed
   * @param locator - Element locator
   */
  async isElementDisplayed(locator: string): Promise<boolean> {
    const browser = this.getBrowser();
    try {
      const element = await browser.$(locator);
      return await element.isDisplayed();
    } catch (e) {
      return false;
    }
  }

  /**
 * @author Sanjay Singh Panwar
   * Pull file from device (Android)
   * @param remotePath - Path on device
   */
  async pullFile(remotePath: string): Promise<string> {
    const browser = this.getBrowser();
    return await browser.pullFile(remotePath);
  }

  /**
 * @author Sanjay Singh Panwar
   * Push file to device (Android)
   * @param remotePath - Path on device
   * @param base64Data - Base64 encoded file content
   */
  async pushFile(remotePath: string, base64Data: string) {
    const browser = this.getBrowser();
    await browser.pushFile(remotePath, base64Data);
  }

  /**
 * @author Sanjay Singh Panwar
   * Execute mobile command
   * @param command - Mobile command name
   * @param args - Command arguments
   */
  async executeMobileCommand(command: string, args: object = {}) {
    const browser = this.getBrowser();
    return await browser.execute(`mobile: ${command}`, args);
  }

  /**
 * @author Sanjay Singh Panwar
   * Get current activity (Android only)
   */
  async getCurrentActivity(): Promise<string> {
    const browser = this.getBrowser();
    return await browser.getCurrentActivity();
  }

  /**
 * @author Sanjay Singh Panwar
   * Get current package (Android only)
   */
  async getCurrentPackage(): Promise<string> {
    const browser = this.getBrowser();
    return await browser.getCurrentPackage();
  }

  /**
 * @author Sanjay Singh Panwar
   * Start activity (Android only)
   * @param appPackage - Package name
   * @param appActivity - Activity name
   */
  async startActivity(appPackage: string, appActivity: string) {
    const browser = this.getBrowser();
    await browser.startActivity(appPackage, appActivity);
  }

  /**
 * @author Sanjay Singh Panwar
   * Shake device (iOS only)
   */
  async shake() {
    const browser = this.getBrowser();
    await browser.shake();
  }

  /**
 * @author Sanjay Singh Panwar
   * Lock device
   * @param seconds - Duration to lock
   */
  async lockDevice(seconds: number = 0) {
    const browser = this.getBrowser();
    await browser.lock(seconds);
  }

  /**
 * @author Sanjay Singh Panwar
   * Unlock device
   */
  async unlockDevice() {
    const browser = this.getBrowser();
    await browser.unlock();
  }

  /**
 * @author Sanjay Singh Panwar
   * Check if device is locked
   */
  async isDeviceLocked(): Promise<boolean> {
    const browser = this.getBrowser();
    return await browser.isLocked();
  }

  /**
 * @author Sanjay Singh Panwar
   * Press back button (Android only)
   */
  async pressBack() {
    const browser = this.getBrowser();
    await browser.back();
  }

  /**
 * @author Sanjay Singh Panwar
   * Press home button
   */
  async pressHome() {
    const browser = this.getBrowser();
    await browser.execute('mobile: pressButton', { name: 'home' });
  }
}

module.exports = MobileHelper;
