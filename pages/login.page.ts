import { BasePage } from './base.page';

const { I } = inject();

/**
 * Login Page Object for Sauce Labs Demo App
 * Contains locators and methods for the login screen
 * 
 * iOS Locators (based on ios_login_page.xml analysis):
 * - Username Field: XCUIElementTypeTextField (no accessibility ID, using class chain)
 * - Password Field: XCUIElementTypeSecureTextField (no accessibility ID, using class chain)
 * - Login Button: XCUIElementTypeButton with name="Login"
 * - Username Hints: Clickable buttons with accessibility IDs (bob@example.com, alice@example.com, etc.)
 * - Login Screen: Identified by "Usernames" static text header
 * - Navigation: More-tab-item → Login Button
 * 
 * @author Sanjay Singh Panwar
 */
class LoginPage extends BasePage {
  
  // Locators - Native Android app uses resource-id, iOS uses accessibility id
  private locators = {
    // Username/Email field
    usernameField: {
      android: 'android=new UiSelector().resourceId("com.saucelabs.mydemoapp.android:id/nameET")',
      ios: '-ios class chain:**/XCUIElementTypeTextField[1]', // First text field on login page
    },
    
    // Password field
    passwordField: {
      android: 'android=new UiSelector().resourceId("com.saucelabs.mydemoapp.android:id/passwordET")',
      ios: '-ios class chain:**/XCUIElementTypeSecureTextField[1]', // First secure text field
    },
    
    // Login button
    loginButton: {
      android: 'android=new UiSelector().resourceId("com.saucelabs.mydemoapp.android:id/loginBtn")',
      ios: '-ios predicate string:type == "XCUIElementTypeButton" AND name == "Login" AND label == "Login"',
    },
    
    // Error message container (no server-side validation in this demo app)
    errorMessage: {
      android: 'android=new UiSelector().resourceId("com.saucelabs.mydemoapp.android:id/nameErrorTV")',
      ios: '-ios predicate string:type == "XCUIElementTypeStaticText" AND (label CONTAINS "error" OR label CONTAINS "required")',
    },
    
    // Username error message
    usernameError: {
      android: 'android=new UiSelector().resourceId("com.saucelabs.mydemoapp.android:id/nameErrorTV")',
      ios: '-ios predicate string:type == "XCUIElementTypeStaticText" AND label CONTAINS "Username"',
    },
    
    // Password error message (no separate password error in native app, uses general error)
    passwordError: {
      android: 'android=new UiSelector().resourceId("com.saucelabs.mydemoapp.android:id/passwordErrorTV").className("android.widget.TextView")',
      ios: '-ios predicate string:type == "XCUIElementTypeStaticText" AND label CONTAINS "Password"',
    },
    
    // Login screen container (check for Login title or usernames list)
    loginScreen: {
      android: 'android=new UiSelector().resourceId("com.saucelabs.mydemoapp.android:id/loginTV")',
      ios: '~Usernames', // Static text header showing username hints
    },
    
    // Login page title
    loginTitle: {
      android: 'android=new UiSelector().resourceId("com.saucelabs.mydemoapp.android:id/loginTV")',
      ios: '-ios predicate string:type == "XCUIElementTypeStaticText" AND label == "Login" AND value == "Login"',
    },
    
    // Products screen (after successful login)
    productsScreen: {
      android: '~Displays all products of catalog',
      ios: '~title',
    },
    
    // Menu button to open drawer
    menuButton: {
      android: '~View menu',
      ios: '~More-tab-item',
    },
    
    // Login menu item in drawer
    loginMenuItem: {
      android: '~Login Menu Item',
      ios: '~Login Button',
    },
    
    // Biometric login button (if available)
    biometricButton: {
      android: '~Biometrics button',
      ios: '~Biometrics button',
    },
    
    // Pre-filled username hints (clickable)
    usernameHints: {
      bob: {
        android: 'android=new UiSelector().text("bob@example.com")',
        ios: '~bob@example.com', // Accessible button with username
      },
      alice: {
        android: 'android=new UiSelector().text("alice@example.com")',
        ios: '~alice@example.com',
      },
      john: {
        android: 'android=new UiSelector().text("john@example.com")',
        ios: '~john@example.com',
      },
      visual: {
        android: 'android=new UiSelector().text("visual@example.com")',
        ios: '~visual@example.com',
      },
    },
    
    // Logout menu item in drawer
    logoutMenuItem: {
      android: '~Logout Menu Item',
      ios: '~LogOut-menu-item', // Based on More menu XML structure
    },
    
    // Logout confirmation OK button (if modal appears)
    logoutConfirmButton: {
      android: 'android=new UiSelector().text("LOGOUT")',
      ios: '~LOGOUT',
    },
  };

  /**
   * Get the username field locator
   */
  get usernameField() {
    return this.getLocator(
      this.locators.usernameField.android,
      this.locators.usernameField.ios
    );
  }

  /**
   * Get the password field locator
   */
  get passwordField() {
    return this.getLocator(
      this.locators.passwordField.android,
      this.locators.passwordField.ios
    );
  }

  /**
   * Get the login button locator
   */
  get loginButton() {
    return this.getLocator(
      this.locators.loginButton.android,
      this.locators.loginButton.ios
    );
  }

  /**
   * Get the error message locator
   */
  get errorMessage() {
    return this.getLocator(
      this.locators.errorMessage.android,
      this.locators.errorMessage.ios
    );
  }

  /**
   * Get the username error locator
   */
  get usernameError() {
    return this.getLocator(
      this.locators.usernameError.android,
      this.locators.usernameError.ios
    );
  }

  /**
   * Get the password error locator
   */
  get passwordError() {
    return this.getLocator(
      this.locators.passwordError.android,
      this.locators.passwordError.ios
    );
  }

  /**
   * Get the login screen container locator
   */
  get loginScreen() {
    return this.getLocator(
      this.locators.loginScreen.android,
      this.locators.loginScreen.ios
    );
  }

  /**
   * Get the login menu item locator
   */
  get loginMenuItem() {
    return this.getLocator(
      this.locators.loginMenuItem.android,
      this.locators.loginMenuItem.ios
    );
  }

  /**
   * Get the logout menu item locator
   */
  get logoutMenuItem() {
    return this.getLocator(
      this.locators.logoutMenuItem.android,
      this.locators.logoutMenuItem.ios
    );
  }

  /**
   * Get the logout confirm button locator
   */
  get logoutConfirmButton() {
    return this.getLocator(
      this.locators.logoutConfirmButton.android,
      this.locators.logoutConfirmButton.ios
    );
  }

  /**
   * Wait for page to load
   */
  async waitForPageLoad(): Promise<void> {
    await this.waitForVisible(this.loginScreen, 20);
    await this.waitForVisible(this.usernameField, 20);
    await this.waitForVisible(this.loginButton, 20);
  }

  /**
   * Check if page is displayed
   */
  async isPageDisplayed(): Promise<boolean> {
    return await this.elementExists(this.loginScreen);
  }

  /**
   * Enter username/email without opening keyboard
   * @param username - Username or email
   */
  async enterUsername(username: string): Promise<void> {
    await this.waitForElement(this.usernameField, 20);
    await this.setFieldValue(this.usernameField, username);
  }

  /**
   * Select pre-filled username hint (clicks on suggested username)
   * @param username - Username to select (bob, alice, john, or visual)
   */
  async selectUsernameHint(username: 'bob' | 'alice' | 'john' | 'visual'): Promise<void> {
    const hintLocator = this.getLocator(
      this.locators.usernameHints[username].android,
      this.locators.usernameHints[username].ios
    );
    await this.waitForElement(hintLocator, 20);
    await this.tap(hintLocator);
  }

  /**
   * Enter password without opening keyboard
   * @param password - Password
   */
  async enterPassword(password: string): Promise<void> {
    await this.waitForElement(this.passwordField, 20);
    await this.setFieldValue(this.passwordField, password);
  }

  /**
   * Tap login button
   */
  async tapLoginButton(): Promise<void> {
    await this.tap(this.loginButton);
  }

  /**
   * Perform login with credentials
   * @param username - Username or email
   * @param password - Password
   */
  async login(username: string, password: string): Promise<void> {
    await this.enterUsername(username);
    await this.enterPassword(password);
    await this.tapLoginButton();
  }

  /**
   * Get error message text
   */
  async getErrorMessage(): Promise<string> {
    await this.waitForVisible(this.errorMessage, 20);
    return await this.getText(this.errorMessage);
  }

  /**
   * Check if generic error message is displayed
   */
  async isErrorDisplayed(): Promise<boolean> {
    try {
      await this.waitForVisible(this.errorMessage, 20);
      return await this.elementExists(this.errorMessage);
    } catch {
      return false;
    }
  }

  /**
   * Check if username validation error is displayed
   */
  async isUsernameErrorDisplayed(): Promise<boolean> {
    try {
      await this.waitForVisible(this.usernameError, 20);
      return await this.elementExists(this.usernameError);
    } catch {
      return false;
    }
  }

  /**
   * Check if password validation error is displayed
   */
  async isPasswordErrorDisplayed(): Promise<boolean> {
    try {
      await this.waitForVisible(this.passwordError, 20);
      return await this.elementExists(this.passwordError);
    } catch {
      return false;
    }
  }

  /**
   * Get username error message text
   */
  async getUsernameErrorMessage(): Promise<string> {
    await this.waitForVisible(this.usernameError, 20);
    return await this.getText(this.usernameError);
  }

  /**
   * Get password error message text
   */
  async getPasswordErrorMessage(): Promise<string> {
    await this.waitForVisible(this.passwordError, 20);
    return await this.getText(this.passwordError);
  }

  /**
   * Tap biometric login button
   */
  async tapBiometricLogin() {
    const locator = this.getLocator(
      this.locators.biometricButton.android,
      this.locators.biometricButton.ios
    );
    await this.tap(locator);
  }

  /**
   * Clear login form
   */
  async clearForm() {
    await this.clearField(this.usernameField);
    await this.clearField(this.passwordField);
  }

  /**
   * Perform logout from menu
   */
  async logout() {
    await this.waitForElement(this.logoutMenuItem, 20);
    await this.tap(this.logoutMenuItem);
    await I.wait(1);
    // Handle confirmation dialog if it appears
    try {
      const confirmExists = await this.elementExists(this.logoutConfirmButton);
      if (confirmExists) {
        await this.tap(this.logoutConfirmButton);
        await I.wait(1);
      }
    } catch {
      // No confirmation dialog
    }
  }

  /**
   * Check if user is logged in (logout menu item visible means logged in)
   */
  async isUserLoggedIn(): Promise<boolean> {
    try {
      return await this.elementExists(this.logoutMenuItem);
    } catch {
      return false;
    }
  }
}

export = new LoginPage();
