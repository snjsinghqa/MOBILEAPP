export {};

Feature('Product Navigation Discovery Tests');

const ProductsPage = require('../pages/products.page');
const ProductDetailsPage = require('../pages/product-details.page');

const { I } = inject();

/**
 * Discovery test to understand what happens after navigating back from product details
 */
Scenario('Discover state after returning from product details', async ({ I }) => {
  console.log('\n=== DISCOVERY: Navigation Back from Product Details ===\n');
  
  // Start at products page
  await ProductsPage.waitForPageLoad();
  console.log('[OK] Products page loaded initially');
  
  // Tap first product
  await ProductsPage.tapFirstProduct();
  await ProductDetailsPage.waitForPageLoad();
  console.log('[OK] Product details page loaded');
  
  // Add to cart
  await ProductDetailsPage.addToCart();
  console.log('[OK] Product added to cart');
  await I.wait(2);
  
  // Go back
  await ProductDetailsPage.goBack();
  console.log('[OK] Tapped back button');
  await I.wait(3);
  
  console.log('\n--- Checking Products Page Elements ---');
  
  // Check if menu icon is visible (used by waitForPageLoad)
  try {
    const menuIcon = await I.grabNumberOfVisibleElements('~Menu Icon');
    console.log(`Menu Icon: ${menuIcon > 0 ? '✅ VISIBLE' : '❌ NOT VISIBLE'} (count: ${menuIcon})`);
  } catch (e) {
    console.log(`Menu Icon: ❌ ERROR - ${e.message}`);
  }
  
  // Check if product images are visible
  try {
    const productImages = await I.grabNumberOfVisibleElements('~Product Image');
    console.log(`Product Images: ${productImages > 0 ? '✅ VISIBLE' : '❌ NOT VISIBLE'} (count: ${productImages})`);
  } catch (e) {
    console.log(`Product Images: ❌ ERROR - ${e.message}`);
  }
  
  // Check if we're on products page or somewhere else
  try {
    const productsTitle = await I.grabNumberOfVisibleElements('~Displays all products of catalog');
    console.log(`Products Title: ${productsTitle > 0 ? '✅ VISIBLE' : '❌ NOT VISIBLE'} (count: ${productsTitle})`);
  } catch (e) {
    console.log(`Products Title: ❌ ERROR - ${e.message}`);
  }
  
  // Try using resource ID instead
  try {
    const productImageById = await I.grabNumberOfVisibleElements('android=new UiSelector().resourceId("com.saucelabs.mydemoapp.android:id/productIV")');
    console.log(`Product Image (by resource ID): ${productImageById > 0 ? '✅ VISIBLE' : '❌ NOT VISIBLE'} (count: ${productImageById})`);
    
    // Check specific instances
    for (let i = 0; i < 3; i++) {
      try {
        const instanceLocator = `android=new UiSelector().resourceId("com.saucelabs.mydemoapp.android:id/productIV").instance(${i})`;
        const instanceCount = await I.grabNumberOfVisibleElements(instanceLocator);
        console.log(`  - Product Image instance ${i}: ${instanceCount > 0 ? '✅ VISIBLE' : '❌ NOT VISIBLE'}`);
      } catch (e) {
        console.log(`  - Product Image instance ${i}: ❌ ERROR`);
      }
    }
  } catch (e) {
    console.log(`Product Image (by resource ID): ❌ ERROR - ${e.message}`);
  }
  
  // Get all text visible on screen to understand what page we're on
  try {
    await I.saveScreenshot('after_back_from_product_details.png');
    console.log('\n[INFO] Screenshot saved: after_back_from_product_details.png');
  } catch (e) {
    console.log(`[ERROR] Could not save screenshot: ${e.message}`);
  }
  
  console.log('\n=== END DISCOVERY ===\n');
});
