/**
 * Product Details Navigation Discovery Test
 * Find the correct locator for back navigation from product details
 * @author Sanjay Singh Panwar
 */

export {};

Feature('Product Details Navigation Discovery');

const ProductsPage = require('../pages/products.page');
const ProductDetailsPage = require('../pages/product-details.page');

Scenario('Discover product details back navigation elements', async ({ I }) => {
  // Navigate to product details
  await ProductsPage.waitForPageLoad();
  await ProductsPage.tapFirstProduct();
  await ProductDetailsPage.waitForPageLoad();
  
  console.log('[INFO] On product details page, discovering navigation elements...');
  
  // Get page source to analyze
  const pageSource = await I.grabSource();
  
  // Look for "shopping" related elements
  if (pageSource.includes('shopping') || pageSource.includes('Shopping')) {
    console.log('[FOUND] Page contains "shopping" text');
  }
  
  // Check various potential back navigation locators
  const potentialLocators = [
    { name: 'Go Shopping Button (resourceId)', locator: 'android=new UiSelector().resourceId("com.saucelabs.mydemoapp.android:id/shoppingBt")' },
    { name: 'Go Shopping (text)', locator: 'android=new UiSelector().text("Go Shopping")' },
    { name: 'Go Shopping (textContains)', locator: 'android=new UiSelector().textContains("Shopping")' },
    { name: 'Continue Shopping', locator: 'android=new UiSelector().text("Continue Shopping")' },
    { name: 'Back button', locator: '~View menu' },
    { name: 'Navigate back', locator: '~Navigate back' },
    { name: 'Back to products', locator: 'android=new UiSelector().descriptionContains("back")' },
    { name: 'Menu button', locator: 'android=new UiSelector().resourceId("com.saucelabs.mydemoapp.android:id/menuIV")' },
  ];
  
  console.log('[INFO] Testing navigation locators...\n');
  
  for (const { name, locator } of potentialLocators) {
    try {
      const count = await I.grabNumberOfVisibleElements(locator);
      if (count > 0) {
        console.log(`[OK] ${name}: "${locator}" - Found ${count} element(s)`);
        
        // Try to get more info about the element
        try {
          const text = await I.grabTextFrom(locator);
          console.log(`     Text: "${text}"`);
        } catch {
          console.log(`     (no text content)`);
        }
      } else {
        console.log(`[NOT FOUND] ${name}: "${locator}"`);
      }
    } catch (error) {
      console.log(`[ERROR] ${name}: Could not check locator`);
    }
  }
  
  console.log('\n[INFO] Checking for navigation buttons with description...');
  
  // Try to find all buttons
  try {
    const buttons = await I.grabNumberOfVisibleElements('android=new UiSelector().className("android.widget.Button")');
    console.log(`[INFO] Found ${buttons} button(s) on product details page`);
  } catch {
    console.log('[INFO] Could not count buttons');
  }
  
  // Try to find navigation elements by description
  try {
    const navElements = await I.grabNumberOfVisibleElements('android=new UiSelector().descriptionContains("nav")');
    console.log(`[INFO] Found ${navElements} element(s) with "nav" in description`);
  } catch {
    console.log('[INFO] No elements with "nav" in description');
  }
  
  await I.saveScreenshot('product_details_navigation_discovery.png');
  
  console.log('\n[INFO] Discovery complete! Check the screenshot and logs above.');
}).tag('@discovery');
