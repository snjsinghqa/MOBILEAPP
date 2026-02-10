export {};

Feature('Empty Cart Discovery - Sauce Labs Demo App');

const ProductsPage = require('../pages/products.page');

/**
 * Discovery test to identify what elements are visible in an empty cart
 * @author Sanjay Singh Panwar
 */
Scenario('Discover elements visible in empty cart', async ({ I }) => {
  // Start from products page
  await ProductsPage.waitForPageLoad();
  
  // Navigate directly to cart (empty)
  await ProductsPage.goToCart();
  
  // Wait a moment for page to load
  await I.wait(3);
  
  await I.saveScreenshot('empty_cart_state.png');
  
  // Check various cart-related elements
  const cartLocators = [
    { name: 'Cart TV (resourceId)', locator: 'android=new UiSelector().resourceId("com.saucelabs.mydemoapp.android:id/cartTV")' },
    { name: 'Cart Screen (accessibility)', locator: '~Cart Screen' },
    { name: 'Cart content scroll', locator: '~Manages scrolling of views in given screen' },
    { name: 'Go Shopping button (text)', locator: '//android.widget.Button[@text="Go Shopping"]' },
    { name: 'No Items text', locator: '//android.widget.TextView[@text="No Items"]' },
    { name: 'View menu (back button)', locator: '~View menu' },
    { name: 'Total price', locator: 'android=new UiSelector().resourceId("com.saucelabs.mydemoapp.android:id/totalPriceTV")' },
    { name: 'Proceed to checkout', locator: '~Confirms products for checkout' },
  ];
  
  console.log('\n========== EMPTY CART ELEMENT DISCOVERY ==========');
  
  for (const item of cartLocators) {
    try {
      const elements = await I.grabNumberOfVisibleElements(item.locator);
      if (elements > 0) {
        console.log(`✅ [OK] ${item.name}: Found ${elements} element(s)`);
      } else {
        console.log(`❌ [NOT FOUND] ${item.name}`);
      }
    } catch (e) {
      console.log(`❌ [ERROR] ${item.name}: ${e.message}`);
    }
  }
  
  // Try to find ANY TextView elements
  try {
    const allTextViews = await I.grabNumberOfVisibleElements('//android.widget.TextView');
    console.log(`\n[INFO] Found ${allTextViews} TextView element(s) on empty cart`);
  } catch (e) {
    console.log(`\n[INFO] Could not count TextViews: ${e.message}`);
  }
  
  // Try to find ANY Button elements
  try {
    const allButtons = await I.grabNumberOfVisibleElements('//android.widget.Button');
    console.log(`[INFO] Found ${allButtons} Button element(s) on empty cart`);
  } catch (e) {
    console.log(`[INFO] Could not count Buttons: ${e.message}`);
  }
  
  // Check if we can detect the empty cart state using goShopping button
  console.log('\n========== EMPTY CART STATE CHECK ==========');
  try {
    const goShoppingExists = await I.grabNumberOfVisibleElements('//android.widget.Button[@text="Go Shopping"]');
    if (goShoppingExists > 0) {
      console.log('✅ Empty cart detected via "Go Shopping" button');
    } else {
      console.log('❌ "Go Shopping" button not found - cart might not be empty OR different empty state');
    }
  } catch (e) {
    console.log(`❌ Could not check empty cart state: ${e.message}`);
  }
  
  console.log('===================================================\n');
}).tag('@discovery').tag('@cart');
