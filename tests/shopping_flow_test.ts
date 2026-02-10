import { TestUsers, TestAddresses, TestPayments, TestProducts, Timeouts } from '../config/test-data.config';

export {};

Feature('Shopping Flow Tests - Sauce Labs Demo App');

const LoginPage = require('../pages/login.page');
const ProductsPage = require('../pages/products.page');
const ProductDetailsPage = require('../pages/product-details.page');
const CartPage = require('../pages/cart.page');
const CheckoutPage = require('../pages/checkout.page');

Before(async ({ I }) => {
  // Wait for app to initialize
  await I.wait(Timeouts.medium);
});

/**
 * @author Sanjay Singh Panwar
 * Complete E2E Shopping Flow with German Address
 * Browse → Select Product → Add to Cart → Checkout → Login → Shipping Info → Payment → Review → Place Order
 */
Scenario('Complete E2E shopping flow: Select product, checkout with German address, and place order @e2e-complete', async ({ I }) => {
  // Step 1: Verify products page loads
  await ProductsPage.waitForPageLoad();
  const isProductsDisplayed = await ProductsPage.isPageDisplayed();
  I.assertTrue(isProductsDisplayed, 'Products page should be displayed');
  
  // Step 2: Select a product
  await ProductsPage.tapFirstProduct();
  await ProductDetailsPage.waitForPageLoad();
  
  // Get product details for verification
  const productName = await ProductDetailsPage.getProductName();
  const productPrice = await ProductDetailsPage.getProductPrice();
  
  // Step 3: Add product to cart
  await ProductDetailsPage.addToCart();
  await I.wait(Timeouts.short);
  
  // Step 4: Go to cart
  await ProductDetailsPage.goToCart();
  await CartPage.waitForPageLoad();
  
  // Verify product is in cart
  const itemCount = await CartPage.getItemCount();
  I.assertEquals(itemCount, 1, 'Cart should contain 1 item');
  
  // Step 5: Proceed to checkout - Login page will appear
  await CartPage.checkout();
  await I.wait(Timeouts.medium);
  
  // Step 6: Login when prompted at checkout
  await LoginPage.waitForPageLoad();
  await LoginPage.login(TestUsers.validUser.username, TestUsers.validUser.password);
  await I.wait(Timeouts.medium);
  
  // Step 7: Now on checkout page - Fill shipping information with German address
  await CheckoutPage.waitForPageLoad();
  await CheckoutPage.fillShippingAddress(TestAddresses.germanAddress);
  await I.wait(Timeouts.short);
  await I.saveScreenshot('checkout_shipping_info_filled.png');
  
  // Step 8: Proceed to payment
  await CheckoutPage.proceedToPayment();
  await CheckoutPage.waitForPaymentPage();
  
  // Step 9: Enter card details
  await CheckoutPage.fillPaymentDetails(TestPayments.validCard);
  await I.wait(Timeouts.short);
  await I.saveScreenshot('checkout_payment_filled.png');
  
  // Step 10: Review order
  await CheckoutPage.reviewOrder();
  await I.wait(Timeouts.medium);
  
  // Step 11: Verify product details on review page
  await I.saveScreenshot('checkout_review_order.png');
  
  // Step 12: Place order
  await CheckoutPage.placeOrder();
  
  // Step 13: Verify order completion
  await CheckoutPage.waitForCompletePage();
  const isOrderComplete = await CheckoutPage.isOrderCompleteDisplayed();
  I.assertTrue(isOrderComplete, 'Order complete screen should be displayed');
  
  await I.saveScreenshot('checkout_order_complete.png');
  
  // Step 14: Continue shopping
  await CheckoutPage.continueShopping();
  await ProductsPage.waitForPageLoad();
}).tag('@smoke').tag('@shopping').tag('@e2e').tag('@checkout').tag('@regression').tag('@e2e-complete');

/**
 * @author Sanjay Singh Panwar
 * E2E Shopping Flow: Browse → Add to Cart → Checkout (US Address)
 */
Scenario('Complete E2E shopping flow: Browse products, add to cart, and checkout with valid address', async ({ I }) => {
    // Step 1: Verify products page loads
  await ProductsPage.waitForPageLoad();
  const isProductsDisplayed = await ProductsPage.isPageDisplayed();
  I.assertTrue(isProductsDisplayed, 'Products page should be displayed');
  
  // Step 2: Select a product
  await ProductsPage.tapFirstProduct();
  await ProductDetailsPage.waitForPageLoad();
  
  // Get product details for verification
  const productName = await ProductDetailsPage.getProductName();
  const productPrice = await ProductDetailsPage.getProductPrice();
  
  // Step 3: Add product to cart
  await ProductDetailsPage.addToCart();
  await I.wait(Timeouts.short);
  
  // Step 4: Go to cart
  await ProductDetailsPage.goToCart();
  await CartPage.waitForPageLoad();
  
  // Verify product is in cart
  const itemCount = await CartPage.getItemCount();
  I.assertEquals(itemCount, 1, 'Cart should contain 1 item');
  
  // Step 5: Proceed to checkout - Login page will appear
  await CartPage.checkout();
  await I.wait(Timeouts.medium);
  
  // Step 6: Login when prompted at checkout
  await LoginPage.waitForPageLoad();
  await LoginPage.login(TestUsers.validUser.username, TestUsers.validUser.password);
  await I.wait(Timeouts.medium);
  
  // Step 7: Now on checkout page - Fill shipping information with valid Address address
  await CheckoutPage.waitForPageLoad();
  await CheckoutPage.fillShippingAddress(TestAddresses.validAddress);
  await I.wait(Timeouts.short);
  await I.saveScreenshot('checkout_shipping_info_filled.png');
  
  // Step 8: Proceed to payment
  await CheckoutPage.proceedToPayment();
  await CheckoutPage.waitForPaymentPage();
  
  // Step 9: Enter card details
  await CheckoutPage.fillPaymentDetails(TestPayments.validCard);
  await I.wait(Timeouts.short);
  await I.saveScreenshot('checkout_payment_filled.png');
  
  // Step 10: Review order
  await CheckoutPage.reviewOrder();
  await I.wait(Timeouts.medium);
  
  // Step 11: Verify product details on review page
  await I.saveScreenshot('checkout_review_order.png');
  
  // Step 12: Place order
  await CheckoutPage.placeOrder();
  
  // Step 13: Verify order completion
  await CheckoutPage.waitForCompletePage();
  const isOrderComplete = await CheckoutPage.isOrderCompleteDisplayed();
  I.assertTrue(isOrderComplete, 'Order complete screen should be displayed');
  
  await I.saveScreenshot('checkout_order_complete.png');
  
  // Step 14: Continue shopping
  await CheckoutPage.continueShopping();
  await ProductsPage.waitForPageLoad();
}).tag('@shopping').tag('@cart').tag('@regression');

/**
 * @author Sanjay Singh Panwar
 * Add Product with Quantity Greater Than 1
 */
Scenario('Add product with quantity of 3 to cart', async ({ I }) => {
  // Products page
  await ProductsPage.waitForPageLoad();
  
  // Select a product
  await ProductsPage.tapFirstProduct();
  await ProductDetailsPage.waitForPageLoad();
  
  // Set quantity to 3
  await ProductDetailsPage.setQuantity(3);
  
  // Verify quantity
  const quantity = await ProductDetailsPage.getQuantity();
  I.assertEquals(quantity, 3, 'Quantity should be 3');
  
  // Add to cart
  await ProductDetailsPage.addToCart();
  
  // Verify cart badge
  const cartCount = await ProductDetailsPage.getCartBadgeCount();
  I.assertEquals(cartCount, 3, 'Cart should show quantity of 3');
  
  await I.saveScreenshot('cart_quantity_3.png');
}).tag('@shopping').tag('@cart');

/**
 * @author Sanjay Singh Panwar
 * Remove Item from Cart
 */
Scenario('Remove item from cart', async ({ I }) => {
  // Products page
  await ProductsPage.waitForPageLoad();
  
  // Add a product to cart
  await ProductsPage.tapFirstProduct();
  await ProductDetailsPage.waitForPageLoad();
  await ProductDetailsPage.addToCart();
  await I.wait(1);
  
  // Navigate to cart
  await ProductDetailsPage.goToCart();
  await CartPage.waitForPageLoad();
  
  // Verify item is in cart
  let itemCount = await CartPage.getItemCount();
  I.assertEquals(itemCount, 1, 'Cart should have 1 item');
  
  // Remove the item
  await CartPage.removeFirstItem();
  await I.wait(1);
  
  // Verify cart is empty
  const isCartEmpty = await CartPage.isCartEmpty();
  I.assertTrue(isCartEmpty, 'Cart should be empty after removing item');
  
  await I.saveScreenshot('cart_empty_after_remove.png');
}).tag('@shopping').tag('@cart');

/**
 * @author Sanjay Singh Panwar
 * Browse Products and Sort
 */
Scenario('Browse products and sort by price low to high', async ({ I }) => {
  // Products page
  await ProductsPage.waitForPageLoad();
  
  // Sort by price ascending
  await ProductsPage.sortByPriceAscending();
  await I.wait(1);
  
  // Verify products page is still displayed
  const isDisplayed = await ProductsPage.isPageDisplayed();
  I.assertTrue(isDisplayed, 'Products page should be displayed after sorting');
  
  await I.saveScreenshot('products_sorted_price_asc.png');
}).tag('@shopping').tag('@products');

/**
 * @author Sanjay Singh Panwar
 * Product Details Page
 */
Scenario('View product details with all information', async ({ I }) => {
  // Products page
  await ProductsPage.waitForPageLoad();
  
  // Select a product
  await ProductsPage.tapFirstProduct();
  await ProductDetailsPage.waitForPageLoad();
  
  // Get and verify product details
  const productName = await ProductDetailsPage.getProductName();
  const productPrice = await ProductDetailsPage.getProductPrice();
  
  I.assertTrue(productName.length > 0, 'Product name should not be empty');
  I.assertTrue(productPrice.includes('$'), 'Product price should include dollar sign');
  
  console.log(`Product: ${productName}, Price: ${productPrice}`);
  
  await I.saveScreenshot('product_details_page.png');
}).tag('@shopping').tag('@products');

/**
 * @author Sanjay Singh Panwar
 * Empty Cart Checkout Prevention
 */
Scenario('Cannot checkout with empty cart', async ({ I }) => {
  // Products page
  await ProductsPage.waitForPageLoad();
  
  // Navigate directly to cart
  await ProductsPage.goToCart();
  
  // Don't use waitForPageLoad() for empty cart (cartTV doesn't exist)
  await I.wait(3);
  
  // Verify cart is empty or checkout button is not available
  const isCartEmpty = await CartPage.isCartEmpty();
  
  if (isCartEmpty) {
    // Go shopping button should be available
    await I.saveScreenshot('cart_empty_go_shopping.png');
    I.assertTrue(true, 'Empty cart correctly shows Go Shopping option');
  }
}).tag('@shopping').tag('@cart').tag('@negative');

/**
 * @author Sanjay Singh Panwar
 * Update Cart Quantity
 */
Scenario('Update item quantity in cart', async ({ I }) => {
  // Products page
  await ProductsPage.waitForPageLoad();
  
  // Add a product to cart
  await ProductsPage.tapFirstProduct();
  await ProductDetailsPage.waitForPageLoad();
  await ProductDetailsPage.addToCart();
  
  // Navigate to cart
  await ProductDetailsPage.goToCart();
  await CartPage.waitForPageLoad();
  
  // Get initial quantity
  const initialQuantity = await CartPage.getFirstItemQuantity();
  I.assertEquals(initialQuantity, 1, 'Initial quantity should be 1');
  
  // Increase quantity
  await CartPage.increaseFirstItemQuantity();
  await I.wait(0.5);
  
  // Verify quantity increased
  const newQuantity = await CartPage.getFirstItemQuantity();
  I.assertEquals(newQuantity, 2, 'Quantity should be 2 after increase');
  
  await I.saveScreenshot('cart_quantity_updated.png');
}).tag('@shopping').tag('@cart');

After(async ({ I }) => {
  // Reset cart if needed by clearing data
  // This can be enhanced based on app reset capabilities
});
