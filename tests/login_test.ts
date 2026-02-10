import { TestUsers } from '../config/test-data.config';

export {};

Feature('Login Tests - Sauce Labs Demo App');

const LoginPage = require('../pages/login.page');
const ProductsPage = require('../pages/products.page');

Before(async ({ I }) => {
  // Wait for app to fully initialize
  await I.wait(2);
});

/**
 * @author Sanjay Singh Panwar
 * Successful Login Tests
 */
Scenario('Login with valid credentials - bod@example.com', async ({ I }) => {
  // Navigate to login (open menu and select login)
  await ProductsPage.waitForPageLoad();
  await ProductsPage.openMenu();
  await I.wait(1);
  
  // Tap on Login menu item using platform-specific locator
  await I.tap(LoginPage.loginMenuItem);
  
  // Wait for login page
  await LoginPage.waitForPageLoad();
  
  // Perform login with valid credentials
  await LoginPage.login(TestUsers.validUser.username, TestUsers.validUser.password);
  
  // Verify successful login - should navigate back to products
  await ProductsPage.waitForPageLoad();
  const isProductsDisplayed = await ProductsPage.isPageDisplayed();
  I.assertTrue(isProductsDisplayed, 'Products page should be displayed after successful login');
  
  // Take screenshot for verification
  await I.saveScreenshot('login_successful.png');
}).tag('@smoke').tag('@login').tag('@regression');

Scenario('Login with visual user credentials - visual@example.com', async ({ I }) => {
  // Navigate to login
  await ProductsPage.waitForPageLoad();
  await ProductsPage.openMenu();
  await I.wait(1);
  await I.tap(LoginPage.loginMenuItem);
  
  // Wait for login page
  await LoginPage.waitForPageLoad();
  
  // Perform login
  await LoginPage.login(TestUsers.visualUser.username, TestUsers.visualUser.password);
  
  // Verify successful login
  await ProductsPage.waitForPageLoad();
  const isProductsDisplayed = await ProductsPage.isPageDisplayed();
  I.assertTrue(isProductsDisplayed, 'Products page should be displayed after successful login');
}).tag('@login').tag('@regression');

/**
 * @author Sanjay Singh Panwar
 * Invalid Credentials Tests - Security Validation
 * These tests validate that the app does NOT allow login with random/invalid credentials
 */
Scenario('SECURITY: App should NOT allow login with random invalid credentials', async ({ I }) => {
  // Navigate to login
  await ProductsPage.waitForPageLoad();
  await ProductsPage.openMenu();
  await I.wait(1);
  await I.tap(LoginPage.loginMenuItem);
  
  // Wait for login page
  await LoginPage.waitForPageLoad();
  
  // Try to login with completely random/invalid credentials
  const randomUsername = `fake_user_${Date.now()}@invalid.com`;
  const randomPassword = `invalid_pass_${Math.random().toString(36).substring(7)}`;
  
  await LoginPage.login(randomUsername, randomPassword);
  await I.wait(2);
  
  // Check if we're still on login page (expected behavior) or wrongly redirected to products
  const isStillOnLoginPage = await LoginPage.isPageDisplayed();
  const isOnProductsPage = await ProductsPage.isPageDisplayed();
  
  // FAIL if app allows login with invalid credentials - this is a security bug!
  if (isOnProductsPage && !isStillOnLoginPage) {
    await I.saveScreenshot('SECURITY_BUG_invalid_login_accepted.png');
    throw new Error(`SECURITY BUG: App allowed login with invalid credentials! Username: ${randomUsername}`);
  }
  
  // Verify we're still on login page (correct behavior)
  I.assertTrue(isStillOnLoginPage, 'User should remain on login page with invalid credentials');
  
  await I.saveScreenshot('invalid_credentials_rejected.png');
}).tag('@security').tag('@login').tag('@negative').tag('@critical');

Scenario('SECURITY: App should NOT allow login with valid username but wrong password', async ({ I }) => {
  // Navigate to login
  await ProductsPage.waitForPageLoad();
  await ProductsPage.openMenu();
  await I.wait(1);
  await I.tap(LoginPage.loginMenuItem);
  
  // Wait for login page
  await LoginPage.waitForPageLoad();
  
  // Try to login with valid username but completely wrong password
  const validUsername = TestUsers.validUser.username; // bob@example.com
  const wrongPassword = 'completely_wrong_password_123';
  
  await LoginPage.login(validUsername, wrongPassword);
  await I.wait(2);
  
  // Check if app wrongly accepted login
  const isStillOnLoginPage = await LoginPage.isPageDisplayed();
  const isOnProductsPage = await ProductsPage.isPageDisplayed();
  
  // FAIL if app allows login with wrong password
  if (isOnProductsPage && !isStillOnLoginPage) {
    await I.saveScreenshot('SECURITY_BUG_wrong_password_accepted.png');
    throw new Error(`SECURITY BUG: App allowed login with wrong password for user: ${validUsername}`);
  }
  
  I.assertTrue(isStillOnLoginPage, 'User should remain on login page with wrong password');
  
  await I.saveScreenshot('wrong_password_rejected.png');
}).tag('@security').tag('@login').tag('@negative').tag('@critical');

Scenario('SECURITY: App should NOT allow login with non-existent user', async ({ I }) => {
  // Navigate to login
  await ProductsPage.waitForPageLoad();
  await ProductsPage.openMenu();
  await I.wait(1);
  await I.tap(LoginPage.loginMenuItem);
  
  // Wait for login page
  await LoginPage.waitForPageLoad();
  
  // Try to login with a non-existent user
  const nonExistentUser = 'nonexistent_user_xyz@fake.com';
  const anyPassword = 'some_password';
  
  await LoginPage.login(nonExistentUser, anyPassword);
  await I.wait(2);
  
  // Check if app wrongly accepted login
  const isStillOnLoginPage = await LoginPage.isPageDisplayed();
  const isOnProductsPage = await ProductsPage.isPageDisplayed();
  
  // FAIL if app allows login with non-existent user
  if (isOnProductsPage && !isStillOnLoginPage) {
    await I.saveScreenshot('SECURITY_BUG_nonexistent_user_accepted.png');
    throw new Error(`SECURITY BUG: App allowed login with non-existent user: ${nonExistentUser}`);
  }
  
  I.assertTrue(isStillOnLoginPage, 'User should remain on login page with non-existent user');
  
  await I.saveScreenshot('nonexistent_user_rejected.png');
}).tag('@security').tag('@login').tag('@negative').tag('@critical');

/**
 * @author Sanjay Singh Panwar
 * Validation Tests - Empty Field Errors
 * Note: The Sauce Labs Demo App only validates client-side (empty fields)
 */
Scenario('Login with empty username shows validation error', async ({ I }) => {
  // Navigate to login
  await ProductsPage.waitForPageLoad();
  await ProductsPage.openMenu();
  await I.wait(1);
  await I.tap(LoginPage.loginMenuItem);
  
  // Wait for login page
  await LoginPage.waitForPageLoad();
  
  // Enter only password, leave username empty
  await LoginPage.enterPassword(TestUsers.validUser.password);
  await LoginPage.tapLoginButton();
  
  // Wait and verify username validation error
  await I.wait(1);
  const isUsernameErrorDisplayed = await LoginPage.isUsernameErrorDisplayed();
  I.assertTrue(isUsernameErrorDisplayed, 'Username validation error should be displayed');
  
  await I.saveScreenshot('login_empty_username_error.png');
}).tag('@login').tag('@negative').tag('@validation');

Scenario('Login with empty fields shows validation error', async ({ I }) => {
  // Navigate to login
  await ProductsPage.waitForPageLoad();
  await ProductsPage.openMenu();
  await I.wait(1);
  await I.tap(LoginPage.loginMenuItem);
  
  // Wait for login page
  await LoginPage.waitForPageLoad();
  
  // Tap login without entering any credentials
  await LoginPage.tapLoginButton();
  
  // Wait and verify username validation error is displayed
  await I.wait(1);
  const isUsernameErrorDisplayed = await LoginPage.isUsernameErrorDisplayed();
  I.assertTrue(isUsernameErrorDisplayed, 'Username validation error should be displayed');
  
  await I.saveScreenshot('login_empty_both_fields_error.png');
}).tag('@login').tag('@negative').tag('@validation');

/**
 * @author Sanjay Singh Panwar
 * Login Page UI Tests
 */
Scenario('Verify login page elements are displayed correctly', async ({ I }) => {
  // Navigate to login
  await ProductsPage.waitForPageLoad();
  await ProductsPage.openMenu();
  await I.wait(1);
  await I.tap(LoginPage.loginMenuItem);
  
  // Wait for login page
  await LoginPage.waitForPageLoad();
  
  // Verify all elements are visible
  const isPageDisplayed = await LoginPage.isPageDisplayed();
  I.assertTrue(isPageDisplayed, 'Login page should be displayed');
  
  // Take screenshot of login page
  await I.saveScreenshot('login_page_elements.png');
}).tag('@login').tag('@ui');

/**
 * @author Sanjay Singh Panwar
 * Logout Tests
 * Tests for user logout functionality
 */
Scenario('Successful logout after login @smoke @login @logout @regression', async ({ I }) => {
  // First login
  await ProductsPage.waitForPageLoad();
  await ProductsPage.openMenu();
  await I.wait(1);
  await I.tap(LoginPage.loginMenuItem);
  
  // Wait for login page and login
  await LoginPage.waitForPageLoad();
  await LoginPage.login(TestUsers.validUser.username, TestUsers.validUser.password);
  
  // Wait for login to complete and products page to load
  await I.wait(3);
  const isProductsDisplayed = await ProductsPage.isPageDisplayed();
  I.assertTrue(isProductsDisplayed, 'Products page should be displayed after login');
  
  await I.saveScreenshot('before_logout.png');
  
  // Now logout - open menu again
  await ProductsPage.openMenu();
  await I.wait(1);
  
  // Tap logout menu item using the LoginPage locator
  await I.tap(LoginPage.logoutMenuItem);
  await I.wait(2);
  
  // Handle any logout confirmation dialog
  try {
    const okButton = await I.grabNumberOfVisibleElements(LoginPage.logoutConfirmButton);
    if (okButton > 0) {
      await I.tap(LoginPage.logoutConfirmButton);
      await I.wait(1);
    }
  } catch {
    // No dialog
  }
  
  // Verify we're back on products screen
  await I.wait(3);
  await I.saveScreenshot('logout_result.png');
  
  // Verify products page is displayed
  await ProductsPage.waitForPageLoad();
  
  // Open menu to verify login option is back
  await ProductsPage.openMenu();
  await I.wait(1);
  
  // Check if Login Menu Item is visible (means we logged out)
  const loginVisible = await I.grabNumberOfVisibleElements(LoginPage.loginMenuItem);
  I.assertTrue(loginVisible > 0, 'Login menu item should be visible after logout (user logged out)');
  
  await I.saveScreenshot('logout_successful.png');
});

Scenario.skip('Verify user session cleared after logout', async ({ I }) => {
  // Login first
  await ProductsPage.waitForPageLoad();
  await ProductsPage.openMenu();
  await I.wait(1);
  await I.tap(LoginPage.loginMenuItem);
  
  await LoginPage.waitForPageLoad();
  await LoginPage.login(TestUsers.validUser.username, TestUsers.validUser.password);
  
  // Wait for login to complete
  await I.wait(3);
  const isProductsVisible = await ProductsPage.isPageDisplayed();
  I.assertTrue(isProductsVisible, 'Products page should be displayed after login');
  
  // Add item to cart while logged in
  await ProductsPage.tapFirstProduct();
  await I.wait(2);
  const ProductDetailsPage = require('../pages/product-details.page');
  await ProductDetailsPage.addToCart();
  await I.wait(1);
  
  // Navigate back 
  await ProductDetailsPage.goBack();
  await I.wait(1);
  
  // Open menu and logout
  await I.tap('~View menu');
  await I.wait(1);
  await I.tap('~Logout Menu Item');
  await I.wait(2);
  
  // Handle any confirmation
  try {
    const okButton = await I.grabNumberOfVisibleElements('~OK');
    if (okButton > 0) {
      await I.tap('~OK');
    }
  } catch {}
  
  await I.wait(2);
  
  // Verify logout - open menu and check login option is visible
  await I.tap('~View menu');
  await I.wait(1);
  const loginVisible = await I.grabNumberOfVisibleElements('~Login Menu Item');
  I.assertTrue(loginVisible > 0, 'Login menu item should be visible after logout');
  
  await I.saveScreenshot('session_cleared_after_logout.png');
}).tag('@login').tag('@logout').tag('@session');

After(async ({ I }) => {
  // Clean up - reset app state if needed
  // This runs after each scenario
});
