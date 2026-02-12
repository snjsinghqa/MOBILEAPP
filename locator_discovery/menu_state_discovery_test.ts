export {};

Feature('Menu State Discovery - Sauce Labs Demo App');

const ProductsPage = require('../pages/products.page');

/**
 * Discovery test to identify menu state and available menu items
 * @author Sanjay Singh Panwar
 */
Scenario('Discover menu state and available items', async ({ I }) => {
  // Start from products page
  await ProductsPage.waitForPageLoad();
  
  // Open menu
  await ProductsPage.openMenu();
  await I.wait(2);
  
  await I.saveScreenshot('menu_state.png');
  
  // Check various menu items
  const menuItems = [
    { name: 'Log In menu item', locator: '~menu item log in' },
    { name: 'Log Out menu item', locator: '~menu item log out' },
    { name: 'Logout Menu Item (from Login page)', locator: '~Logout Menu Item' },
    { name: 'About menu item', locator: '~menu item about' },
    { name: 'WebView menu item', locator: '~menu item webview' },
    { name: 'QR Code Scanner', locator: '~menu item qr code scanner' },
    { name: 'Geo Location', locator: '~menu item geo location' },
    { name: 'Drawing', locator: '~menu item drawing' },
    { name: 'API Calls', locator: '~menu item api calls' },
  ];
  
  console.log('\n========== MENU STATE DISCOVERY ==========');
  
  for (const item of menuItems) {
    try {
      const elements = await I.grabNumberOfVisibleElements(item.locator);
      if (elements > 0) {
        console.log(`[OK] ${item.name}: Found ${elements} element(s)`);
      } else {
        console.log(`[NOT FOUND] ${item.name}`);
      }
    } catch (e) {
      console.log(`[ERROR] ${item.name}: ${e.message}`);
    }
  }
  
  // Get all menu items text
  try {
    const menuItemTexts = await I.grabTextFrom('//android.widget.TextView[@content-desc and contains(@content-desc, "menu item")]');
    console.log(`\n[INFO] Menu item texts found: ${JSON.stringify(menuItemTexts)}`);
  } catch (e) {
    console.log(`\n[INFO] Could not grab menu item texts: ${e.message}`);
  }
  
  console.log('===================================================\n');
  
  // Close menu by tapping menu icon again
  await ProductsPage.openMenu();
  await I.wait(1);
}).tag('@discovery').tag('@menu');
