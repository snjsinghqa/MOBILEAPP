export {};

Feature('Guest Checkout Discovery - Sauce Labs Demo App');

const ProductsPage = require('../pages/products.page');
const ProductDetailsPage = require('../pages/product-details.page');
const CartPage = require('../pages/cart.page');

/**
 * Discovery test to identify what happens during guest checkout
 * @author Sanjay Singh Panwar
 */
Scenario('Discover guest checkout flow', async ({ I }) => {
  // Start from products page
  await ProductsPage.waitForPageLoad();
  
  // Add product to cart
  await ProductsPage.tapFirstProduct();
  await ProductDetailsPage.waitForPageLoad();
  await ProductDetailsPage.addToCart();
  await ProductDetailsPage.goToCart();
  await CartPage.waitForPageLoad();
  
  await I.saveScreenshot('cart_before_checkout.png');
  
  // Try to proceed to checkout
  await CartPage.checkout();
  
  // Wait to see what screen appears
  await I.wait(5);
  
  await I.saveScreenshot('after_checkout_button.png');
  
  // Check what elements are visible
  const checkoutLocators = [
    { name: 'Full Name field (resourceId)', locator: 'android=new UiSelector().resourceId("com.saucelabs.mydemoapp.android:id/fullNameET")' },
    { name: 'Login screen', locator: 'android=new UiSelector().resourceId("com.saucelabs.mydemoapp.android:id/loginBtn")' },
    { name: 'Login required message', locator: '//android.widget.TextView[contains(@text, "login") or contains(@text, "Login")]' },
    { name: 'Products screen', locator: '~Displays all products of catalog' },
    { name: 'To Payment button', locator: 'android=new UiSelector().resourceId("com.saucelabs.mydemoapp.android:id/paymentBtn")' },
    { name: 'Checkout title', locator: '//android.widget.TextView[@text="Checkout"]' },
  ];
  
  console.log('\n========== GUEST CHECKOUT DISCOVERY ==========');
  
  for (const item of checkoutLocators) {
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
  
  // Get all visible TextViews to understand what screen we're on
  try {
    const allTextViews = await I.grabTextFrom('//android.widget.TextView');
    console.log(`\n[INFO] Visible text elements:`, allTextViews);
  } catch (e) {
    console.log(`\n[INFO] Could not grab text: ${e.message}`);
  }
  
  console.log('===================================================\n');
}).tag('@discovery').tag('@checkout');
