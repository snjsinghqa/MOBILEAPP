const { I } = inject();

/**
 * Base Page Object class that all pages should extend
 * Contains common methods and properties for mobile page objects
 * @author Sanjay Singh Panwar
 */
export abstract class BasePage {
  protected I: any;
  protected isAndroid: boolean;
  protected isIOS: boolean;

  constructor() {
    this.I = actor();
    this.isAndroid = process.env.PLATFORM?.toLowerCase() === 'android';
    this.isIOS = process.env.PLATFORM?.toLowerCase() === 'ios';
  }

  /**
   * Get platform-specific locator
   * @param androidLocator - Android locator
   * @param iosLocator - iOS locator
   * @author Sanjay Singh Panwar
   */
  protected getLocator(androidLocator: string, iosLocator: string): string {
    return this.isAndroid ? androidLocator : iosLocator;
  }

  /**
   * Create accessibility ID locator (works on both platforms)
   * @param id - Accessibility identifier
   * @returns Accessibility ID locator string
   * @example accessibilityId("Login button") returns "~Login button"
   */
  protected accessibilityId(id: string): string {
    return `~${id}`;
  }

  /**
   * Create Android resource ID locator
   * @param packageName - App package name
   * @param id - Resource ID
   * @returns Android resource ID locator string
   * @example androidResourceId("com.example.app", "loginBtn") 
   *          returns 'android=new UiSelector().resourceId("com.example.app:id/loginBtn")'
   */
  protected androidResourceId(packageName: string, id: string): string {
    return `android=new UiSelector().resourceId("${packageName}:id/${id}")`;
  }

  /**
   * Create Android UiSelector with description contains
   * @param text - Description text to match
   * @returns Android description locator string
   * @example androidDescriptionContains("cart") 
   *          returns 'android=new UiSelector().descriptionContains("cart")'
   */
  protected androidDescriptionContains(text: string): string {
    return `android=new UiSelector().descriptionContains("${text}")`;
  }

  /**
   * Create Android UiSelector with text contains
   * @param text - Text to match
   * @returns Android text locator string
   * @example androidTextContains("Login") 
   *          returns 'android=new UiSelector().textContains("Login")'
   */
  protected androidTextContains(text: string): string {
    return `android=new UiSelector().textContains("${text}")`;
  }

  /**
   * Create Android UiSelector with text
   * @param text - Exact text to match
   * @returns Android text locator string
   * @example androidText("Login") 
   *          returns 'android=new UiSelector().text("Login")'
   */
  protected androidText(text: string): string {
    return `android=new UiSelector().text("${text}")`;
  }

  /**
   * Create custom Android UiSelector locator
   * @param selector - UiSelector expression (without "new UiSelector().")
   * @returns Android UiSelector locator string
   * @example androidUiSelector('className("android.widget.Button").index(2)') 
   *          returns 'android=new UiSelector().className("android.widget.Button").index(2)'
   */
  protected androidUiSelector(selector: string): string {
    return `android=new UiSelector().${selector}`;
  }

  /**
   * Create iOS predicate string locator
   * @param predicate - iOS predicate expression
   * @returns iOS predicate locator string
   * @example iosPredicateString('label == "Login"') 
   *          returns '-ios predicate string:label == "Login"'
   */
  protected iosPredicateString(predicate: string): string {
    return `-ios predicate string:${predicate}`;
  }

  /**
   * Create iOS class chain locator
   * @param chain - iOS class chain expression
   * @returns iOS class chain locator string
   */
  protected iosClassChain(chain: string): string {
    return `-ios class chain:**/${chain}`;
  }

  /**
   * Create XPath locator
   * @param path - XPath expression
   * @returns XPath locator string
   */
  protected xpath(path: string): string {
    return path.startsWith('//') ? path : `//${path}`;
  }

  /**
   * Wait for page to load
   * Should be overridden by child classes
   * @author Sanjay Singh Panwar
   */
  abstract waitForPageLoad(): Promise<void>;

  /**
   * Check if page is displayed
   * Should be overridden by child classes
   * @author Sanjay Singh Panwar
   */
  abstract isPageDisplayed(): Promise<boolean>;

  /**
   * Wait for element with timeout
   * @param locator - Element locator
   * @param timeout - Timeout in seconds
   */
  async waitForElement(locator: string, timeout: number = 10) {
    await this.I.waitForElement(locator, timeout);
  }

  /**
   * Wait for element to be visible
   * @param locator - Element locator
   * @param timeout - Timeout in seconds
   */
  async waitForVisible(locator: string, timeout: number = 10) {
    await this.I.waitForVisible(locator, timeout);
  }

  /**
   * Wait for element to be invisible/hidden
   * @param locator - Element locator
   * @param timeout - Timeout in seconds
   */
  async waitForInvisible(locator: string, timeout: number = 10) {
    await this.I.waitForInvisible(locator, timeout);
  }

  /**
   * Tap on element
   * @param locator - Element locator
   */
  async tap(locator: string) {
    await this.I.tap(locator);
  }

  /**
   * Fill field with text (opens keyboard)
   * @param locator - Element locator
   * @param value - Text value
   */
  async fillField(locator: string, value: string) {
    await this.I.fillField(locator, value);
  }

  /**
   * Set field value without user keyboard interaction
   * Fills the field and immediately dismisses keyboard
   * @param locator - Element locator
   * @param value - Text value
   */
  async setFieldValue(locator: string, value: string) {
    // Clear and set value
    await this.I.clearField(locator);
    await this.I.appendField(locator, value);
    // Immediately hide keyboard after setting value
    try {
      await this.I.hideDeviceKeyboard();
    } catch {
      // Keyboard may not be open or already dismissed
    }
  }

  /**
   * Clear field
   * @param locator - Element locator
   */
  async clearField(locator: string) {
    await this.I.clearField(locator);
  }

  /**
   * Get text from element
   * @param locator - Element locator
   */
  async getText(locator: string): Promise<string> {
    return await this.I.grabTextFrom(locator);
  }

  /**
   * Get attribute value from element
   * @param locator - Element locator
   * @param attribute - Attribute name
   */
  async getAttribute(locator: string, attribute: string): Promise<string> {
    return await this.I.grabAttributeFrom(locator, attribute);
  }

  /**
   * Check if element exists
   * @param locator - Element locator
   */
  async elementExists(locator: string): Promise<boolean> {
    try {
      const count = await this.I.grabNumberOfVisibleElements(locator);
      return count > 0;
    } catch (error) {
      return false;
    }
  }

  /**
   * Scroll to element
   * @param locator - Element locator
   */
  async scrollTo(locator: string) {
    await this.I.scrollTo(locator);
  }

  /**
   * Take screenshot
   * @param name - Screenshot name
   */
  async takeScreenshot(name: string) {
    await this.I.saveScreenshot(`${name}.png`);
  }

  /**
   * Wait for text to appear
   * @param text - Text to wait for
   * @param timeout - Timeout in seconds
   */
  async waitForText(text: string, timeout: number = 10) {
    await this.I.waitForText(text, timeout);
  }

  /**
   * See text on screen
   * @param text - Text to verify
   */
  async seeText(text: string) {
    await this.I.see(text);
  }

  /**
   * Don't see text on screen
   * @param text - Text that should not be visible
   */
  async dontSeeText(text: string) {
    await this.I.dontSee(text);
  }

  /**
   * Pause execution
   * @param seconds - Seconds to pause
   */
  async pause(seconds: number) {
    await this.I.wait(seconds);
  }
}
