/**
 * @author Sanjay Singh Panwar
 * Custom step methods for the Mobile Automation Framework
 */

export = function() {
  return actor({

    /**
 * @author Sanjay Singh Panwar
     * Custom login step
     * @param username - Username or email
     * @param password - Password
     */
    login: async function(username: string, password: string) {
      await this.waitForElement('~username-input', 10);
      await this.fillField('~username-input', username);
      await this.fillField('~password-input', password);
      await this.tap('~login-button');
      await this.wait(2);
    },

    /**
 * @author Sanjay Singh Panwar
     * Wait for app to be ready
     */
    waitForAppReady: async function() {
      await this.wait(3);
    },

    /**
 * @author Sanjay Singh Panwar
     * Assert element is visible
     * @param locator - Element locator
     */
    assertVisible: async function(locator: string) {
      const count = await this.grabNumberOfVisibleElements(locator);
      if (count === 0) {
        throw new Error(`Element ${locator} is not visible`);
      }
    },

    /**
 * @author Sanjay Singh Panwar
     * Assert element is not visible
     * @param locator - Element locator
     */
    assertNotVisible: async function(locator: string) {
      const count = await this.grabNumberOfVisibleElements(locator);
      if (count > 0) {
        throw new Error(`Element ${locator} is visible but should not be`);
      }
    },

    /**
 * @author Sanjay Singh Panwar
     * Assert text equals expected value
     * @param actual - Actual text
     * @param expected - Expected text
     * @param message - Assertion message
     */
    assertEquals: function(actual: any, expected: any, message?: string) {
      if (actual !== expected) {
        throw new Error(message || `Expected "${expected}" but got "${actual}"`);
      }
    },

    /**
 * @author Sanjay Singh Panwar
     * Assert condition is true
     * @param condition - Condition to check
     * @param message - Assertion message
     */
    assertTrue: function(condition: boolean, message?: string) {
      if (!condition) {
        throw new Error(message || 'Expected condition to be true but was false');
      }
    },

    /**
 * @author Sanjay Singh Panwar
     * Assert condition is false
     * @param condition - Condition to check
     * @param message - Assertion message
     */
    assertFalse: function(condition: boolean, message?: string) {
      if (condition) {
        throw new Error(message || 'Expected condition to be false but was true');
      }
    },

    /**
 * @author Sanjay Singh Panwar
     * Assert text contains substring
     * @param text - Text to check
     * @param substring - Substring to find
     * @param message - Assertion message
     */
    assertContains: function(text: string, substring: string, message?: string) {
      if (!text.includes(substring)) {
        throw new Error(message || `Expected "${text}" to contain "${substring}"`);
      }
    },

    /**
 * @author Sanjay Singh Panwar
     * Retry action with attempts
     * @param action - Action to retry
     * @param attempts - Number of attempts
     * @param delay - Delay between attempts in ms
     */
    retryAction: async function(action: () => Promise<void>, attempts: number = 3, delay: number = 1000) {
      let lastError: Error | null = null;
      for (let i = 0; i < attempts; i++) {
        try {
          await action();
          return;
        } catch (error) {
          lastError = error as Error;
          await this.wait(delay / 1000);
        }
      }
      throw lastError;
    },

    /**
 * @author Sanjay Singh Panwar
     * Scroll until element is found
     * @param locator - Element locator
     * @param direction - Scroll direction ('up' or 'down')
     * @param maxScrolls - Maximum number of scrolls
     */
    scrollUntilVisible: async function(locator: string, direction: 'up' | 'down' = 'down', maxScrolls: number = 10) {
      for (let i = 0; i < maxScrolls; i++) {
        const count = await this.grabNumberOfVisibleElements(locator);
        if (count > 0) {
          return;
        }
        
        if (direction === 'down') {
          await (this as any).swipeUp(0.3);
        } else {
          await (this as any).swipeDown(0.3);
        }
        await this.wait(0.5);
      }
      throw new Error(`Element ${locator} not found after ${maxScrolls} scrolls`);
    },

    /**
 * @author Sanjay Singh Panwar
     * Wait for element and tap
     * @param locator - Element locator
     * @param timeout - Timeout in seconds
     */
    waitAndTap: async function(locator: string, timeout: number = 10) {
      await this.waitForElement(locator, timeout);
      await this.waitForVisible(locator, timeout);
      await this.tap(locator);
    },

    /**
 * @author Sanjay Singh Panwar
     * Wait for element and fill field
     * @param locator - Element locator
     * @param value - Value to fill
     * @param timeout - Timeout in seconds
     */
    waitAndFill: async function(locator: string, value: string, timeout: number = 10) {
      await this.waitForElement(locator, timeout);
      await this.waitForVisible(locator, timeout);
      await this.fillField(locator, value);
    },

    /**
 * @author Sanjay Singh Panwar
     * Get element count
     * @param locator - Element locator
     */
    getElementCount: async function(locator: string): Promise<number> {
      return await this.grabNumberOfVisibleElements(locator);
    },

    /**
 * @author Sanjay Singh Panwar
     * Check if running on Android
     */
    isAndroid: function(): boolean {
      return process.env.PLATFORM?.toLowerCase() === 'android';
    },

    /**
 * @author Sanjay Singh Panwar
     * Check if running on iOS
     */
    isIOS: function(): boolean {
      return process.env.PLATFORM?.toLowerCase() === 'ios';
    },

  });
}
