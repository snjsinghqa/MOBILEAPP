/**
 * Logout Locator Discovery Test
 * This test helps identify the correct logout menu item locator
 * @author Sanjay Singh Panwar
 */

import { TestUsers } from '../config/test-data.config';
const LoginPage = require('../pages/login.page');
const ProductsPage = require('../pages/products.page');

Feature('Logout Locator Discovery');

Before(async ({ I }) => {
  // App should already be launched by Appium
  console.log('Starting logout locator discovery...');
});

Scenario('Discover logout menu item locator @discovery @logout', async ({ I }) => {
  // First login
  await ProductsPage.waitForPageLoad();
  await ProductsPage.openMenu();
  await I.wait(1);
  
  // Tap login menu item
  await I.tap(LoginPage.loginMenuItem);
  
  // Login
  await LoginPage.waitForPageLoad();
  await LoginPage.login(TestUsers.validUser.username, TestUsers.validUser.password);
  
  // Wait for login to complete
  await I.wait(3);
  await I.saveScreenshot('after_login.png');
  
  // Now open menu again to find logout
  await I.tap('~View menu');
  await I.wait(2);
  await I.saveScreenshot('menu_after_login.png');
  
  // Try different logout locators
  const logoutLocators = [
    '~menu item log out',
    '~Logout Menu Item',
    '~Logout',
    '~Log Out',
    '~LOG OUT',
    'android=new UiSelector().text("Log Out")',
    'android=new UiSelector().textContains("log out")',
    'android=new UiSelector().descriptionContains("log out")',
    'android=new UiSelector().descriptionContains("Log Out")',
    'android=new UiSelector().descriptionContains("Logout")',
  ];
  
  for (const locator of logoutLocators) {
    try {
      console.log(`Trying locator: ${locator}`);
      const count = await I.grabNumberOfVisibleElements(locator);
      if (count > 0) {
        console.log(`[OK] FOUND! Locator works: ${locator}`);
        await I.saveScreenshot(`logout_found_${locator.replace(/[^a-zA-Z0-9]/g, '_')}.png`);
        
        // Tap it to verify
        await I.tap(locator);
        await I.wait(2);
        await I.saveScreenshot('after_logout_tap.png');
        
        console.log('Logout locator confirmed:', locator);
        break;
      }
    } catch (error) {
      console.log(`✗ Locator failed: ${locator}`);
    }
  }
  
  // Also dump page source
  const source = await I.grabSource();
  console.log('Page source:', source.substring(0, 2000));
}).tag('@discovery');

After(async ({ I }) => {
  console.log('Discovery test completed');
});
