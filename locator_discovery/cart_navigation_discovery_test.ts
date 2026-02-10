/**
 * Cart Navigation Discovery Test
 * Find the correct locator for back navigation from cart page
 * @author Sanjay Singh Panwar
 */

export {};

Feature('Cart Navigation Discovery');

const ProductsPage = require('../pages/products.page');
const ProductDetailsPage = require('../pages/product-details.page');
const CartPage = require('../pages/cart.page');

Scenario('Discover cart page back navigation elements', async ({ I }) => {
  // Navigate to cart with a product
  await ProductsPage.waitForPageLoad();
  await ProductsPage.tapFirstProduct();
  await ProductDetailsPage.waitForPageLoad();
  await ProductDetailsPage.addToCart();
  await ProductDetailsPage.goToCart();
  await CartPage.waitForPageLoad();
  
  console.log('[INFO] On cart page, discovering navigation elements...');
  
  // Check various potential back navigation locators
  const potentialLocators = [
    { name: 'Navigate back', locator: '~Navigate back' },
    { name: 'View menu', locator: '~View menu' },
    { name: 'Back button', locator: '~Back button' },
    { name: 'Go back', locator: '~Go back' },
    { name: 'Menu button (resourceId)', locator: 'android=new UiSelector().resourceId("com.saucelabs.mydemoapp.android:id/menuIV")' },
    { name: 'Back with description', locator: 'android=new UiSelector().descriptionContains("back")' },
    { name: 'Navigate with description', locator: 'android=new UiSelector().descriptionContains("nav")' },
    { name: 'Menu with description', locator: 'android=new UiSelector().descriptionContains("menu")' },
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
          if (text) {
            console.log(`     Text: "${text}"`);
          }
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
  
  console.log('\n[INFO] Checking for all buttons on cart page...');
  
  try {
    const buttons = await I.grabNumberOfVisibleElements('android=new UiSelector().className("android.widget.ImageButton")');
    console.log(`[INFO] Found ${buttons} ImageButton(s) on cart page`);
  } catch {
    console.log('[INFO] Could not count ImageButtons');
  }
  
  await I.saveScreenshot('cart_navigation_discovery.png');
  
  console.log('\n[INFO] Discovery complete! Check the screenshot and logs above.');
}).tag('@discovery');
