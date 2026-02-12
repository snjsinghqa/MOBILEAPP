/**
 * Cart Locator Discovery Test
 * This test helps identify the correct cart page locators
 * @author Sanjay Singh Panwar
 */

import { TestUsers } from '../config/test-data.config';
const LoginPage = require('../pages/login.page');
const ProductsPage = require('../pages/products.page');
const ProductDetailsPage = require('../pages/product-details.page');

Feature('Cart Locator Discovery');

Before(async ({ I }) => {
  // App should already be launched by Appium
  console.log('Starting cart locator discovery...');
});

Scenario('Discover cart screen locators @discovery @cart', async ({ I }) => {
  // Just wait for products page
  await I.wait(5);
  await I.saveScreenshot('products_page_start.png');
  
  // Dump current page source
  let source = await I.grabSource();
  console.log('\n[PRODUCTS PAGE SOURCE (first 2000 chars)]');
console.log(source.substring(0, 2000));
  
  // Try to find and tap product carefully
  try {
    const productCount = await I.grabNumberOfVisibleElements('~store item');
    console.log(`\n[INFO] Found ${productCount} products on page`);
    
    if (productCount > 0) {
      await I.tap('(~store item)[1]');
      await I.wait(3);
      await I.saveScreenshot('after_tapping_product.png');
      
      // Try to add to cart
      const addToCartCount = await I.grabNumberOfVisibleElements('~Add To Cart button');
      console.log(`[INFO] Add to cart button count: ${addToCartCount}`);
      
      if (addToCartCount > 0) {
        await I.tap('~Add To Cart button');
        await I.wait(2);
        
        // Try to tap cart icon
        const cartBadgeCount = await I.grabNumberOfVisibleElements('~cart badge');
        console.log(`[INFO] Cart badge count: ${cartBadgeCount}`);
        
        if (cartBadgeCount > 0) {
          await I.tap('~cart badge');
          await I.wait(3);
          await I.saveScreenshot('cart_screen.png');
          
          // Now we're on cart page - dump source
          source = await I.grabSource();
          console.log('\n[CART PAGE SOURCE (first 2000 chars)]');
          console.log(source.substring(0, 2000));
        }
      }
    }
  } catch (error) {
    console.log('[ERROR] Failed to navigate to cart:', error);
    await I.saveScreenshot('error_state.png');
  }
  
  console.log('\n=== CART SCREEN LOCATOR DISCOVERY ===');
  
  // Try different cart screen locators
  const cartScreenLocators = [
    '~cart screen',
    '~Cart Screen',
    '~Cart',
    '~shopping cart',
    '~Shopping Cart',
    'android=new UiSelector().text("Cart")',
    'android=new UiSelector().textContains("Cart")',
    'android=new UiSelector().resourceId("com.saucelabs.mydemoapp.android:id/cartTV")',
    'android=new UiSelector().descriptionContains("cart")',
    'android=new UiSelector().descriptionContains("Cart")',
  ];
  
  console.log('\n[TESTING CART SCREEN LOCATORS]');
  for (const locator of cartScreenLocators) {
    try {
      const count = await I.grabNumberOfVisibleElements(locator);
      if (count > 0) {
        console.log(`[OK] FOUND! Cart screen locator: ${locator}`);
        await I.saveScreenshot(`cart_screen_found_${locator.replace(/[^a-zA-Z0-9]/g, '_')}.png`);
      }
    } catch (error) {
      console.log(`[FAIL] Cart screen locator: ${locator}`);
    }
  }
  
  // Try different product row locators
  const productRowLocators = [
    '~product row',
    '~Product Row',
    '~Displays selected product',
    '~cart item',
    '~Cart Item',
    'android=new UiSelector().descriptionContains("product")',
    'android=new UiSelector().descriptionContains("Displays")',
    'android=new UiSelector().className("android.view.ViewGroup")',
  ];
  
  console.log('\n[TESTING PRODUCT ROW LOCATORS]');
  for (const locator of productRowLocators) {
    try {
      const count = await I.grabNumberOfVisibleElements(locator);
      if (count > 0) {
        console.log(`[OK] FOUND! Product row locator: ${locator} (count: ${count})`);
      }
    } catch (error) {
      console.log(`[FAIL] Product row locator: ${locator}`);
    }
  }
  
  // Try different proceed to checkout button locators
  const checkoutButtonLocators = [
    '~Proceed To Checkout button',
    '~Proceed To Checkout',
    '~Confirms products for checkout',
    '~checkout button',
    '~Checkout Button',
    '~Checkout',
    'android=new UiSelector().text("Proceed To Checkout")',
    'android=new UiSelector().textContains("Checkout")',
    'android=new UiSelector().descriptionContains("Checkout")',
    'android=new UiSelector().descriptionContains("checkout")',
  ];
  
  console.log('\n[TESTING PROCEED TO CHECKOUT BUTTON LOCATORS]');
  for (const locator of checkoutButtonLocators) {
    try {
      const count = await I.grabNumberOfVisibleElements(locator);
      if (count > 0) {
        console.log(`[OK] FOUND! Checkout button locator: ${locator}`);
      }
    } catch (error) {
      console.log(`[FAIL] Checkout button locator: ${locator}`);
    }
  }
  
  // Try different counter/quantity locators
  const counterLocators = [
    '~counter plus button',
    '~counter minus button',
    '~counter amount',
    '~Increase item quantity',
    '~Decrease item quantity',
    'android=new UiSelector().resourceId("com.saucelabs.mydemoapp.android:id/plusIV")',
    'android=new UiSelector().resourceId("com.saucelabs.mydemoapp.android:id/minusIV")',
    'android=new UiSelector().resourceId("com.saucelabs.mydemoapp.android:id/noTV")',
    'android=new UiSelector().descriptionContains("quantity")',
  ];
  
  console.log('\n[TESTING COUNTER/QUANTITY LOCATORS]');
  for (const locator of counterLocators) {
    try {
      const count = await I.grabNumberOfVisibleElements(locator);
      if (count > 0) {
        console.log(`[OK] FOUND! Counter locator: ${locator}`);
      }
    } catch (error) {
      console.log(`[FAIL] Counter locator: ${locator}`);
    }
  }
  
  // Try different remove item button locators
  const removeButtonLocators = [
    '~remove item',
    '~Remove Item',
    '~Removes product from cart',
    '~delete item',
    '~Delete',
    'android=new UiSelector().descriptionContains("remove")',
    'android=new UiSelector().descriptionContains("Removes")',
    'android=new UiSelector().resourceId("com.saucelabs.mydemoapp.android:id/removeIV")',
  ];
  
  console.log('\n[TESTING REMOVE ITEM BUTTON LOCATORS]');
  for (const locator of removeButtonLocators) {
    try {
      const count = await I.grabNumberOfVisibleElements(locator);
      if (count > 0) {
        console.log(`[OK] FOUND! Remove button locator: ${locator}`);
      }
    } catch (error) {
      console.log(`[FAIL] Remove button locator: ${locator}`);
    }
  }
  
  // Dump page source for manual inspection if not already dumped
  try {
    const finalSource = await I.grabSource();
    console.log('\n[FINAL PAGE SOURCE EXCERPT]');
    console.log(finalSource.substring(0, 3000));
  } catch (e) {
    console.log('[INFO] Page source already captured');
  }
  
  console.log('\n=== CART LOCATOR DISCOVERY COMPLETE ===');
}).tag('@discovery');

After(async ({ I }) => {
  console.log('Discovery test completed');
});
