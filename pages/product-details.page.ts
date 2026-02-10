import { BasePage } from './base.page';

const { I } = inject();

/**
 * Product Details Page Object for Sauce Labs Demo App
 * Contains locators and methods for the product detail screen
 * @author Sanjay Singh Panwar
 */
class ProductDetailsPage extends BasePage {
  
  // Locators - Sauce Labs Demo App specific (Native Android + iOS)
  private locators = {
    // Product details screen container
    productScreen: {
      android: '~Displays selected product',
      ios: '~Product Screen',
    },
    
    // Product image
    productImage: {
      android: '~Product Image',
      ios: '~Product Image',
    },
    
    // Product name
    productName: {
      android: 'android=new UiSelector().resourceId("com.saucelabs.mydemoapp.android:id/productTV")',
      ios: '~Product Title',
    },
    
    // Product price
    productPrice: {
      android: 'android=new UiSelector().resourceId("com.saucelabs.mydemoapp.android:id/priceTV")',
      ios: '~Product Price',
    },
    
    // Product description
    productDescription: {
      android: 'android=new UiSelector().resourceId("com.saucelabs.mydemoapp.android:id/highlightsTV")',
      ios: '~Product Description',
    },
    
    // Add to cart button
    addToCartButton: {
      android: '~Tap to add product to cart',
      ios: '~Add To Cart button',
    },
    
    // Add to cart counter (quantity)
    counterPlusButton: {
      android: '~Increase item quantity',
      ios: '~counter plus button',
    },
    
    counterMinusButton: {
      android: '~Decrease item quantity',
      ios: '~counter minus button',
    },
    
    counterAmount: {
      android: 'android=new UiSelector().resourceId("com.saucelabs.mydemoapp.android:id/noTV")',
      ios: '~counter amount',
    },
    
    // Color selector (if available)
    colorCircle: {
      android: '~Displays available colors of selected product',
      ios: '~color circle',
    },
    
    // Selected color indicator
    colorCircleSelected: {
      android: '~Indicates when color is selected',
      ios: '~circle selected',
    },
    
    // Back navigation
    backButton: {
      android: '~View menu',
      ios: '~Navigate back',
    },
    
    // Cart icon
    cartIcon: {
      android: '~View cart',
      ios: '~Cart-tab-item',
    },
    
    // Cart badge
    cartBadge: {
      android: 'android=new UiSelector().resourceId("com.saucelabs.mydemoapp.android:id/cartTV")',
      ios: '~cart badge',
    },
    
    // Star rating (review)
    starRating: {
      android: '~star rating',
      ios: '~star rating',
    },
    
    // Highlights section
    highlights: {
      android: '~Highlights',
      ios: '~Highlights',
    },
  };

  /**
   * Get product screen locator
   */
  get productScreen() {
    return this.getLocator(
      this.locators.productScreen.android,
      this.locators.productScreen.ios
    );
  }

  /**
   * Get add to cart button locator
   */
  get addToCartButton() {
    return this.getLocator(
      this.locators.addToCartButton.android,
      this.locators.addToCartButton.ios
    );
  }

  /**
   * Get product name locator
   */
  get productName() {
    return this.getLocator(
      this.locators.productName.android,
      this.locators.productName.ios
    );
  }

  /**
   * Get product price locator
   */
  get productPrice() {
    return this.getLocator(
      this.locators.productPrice.android,
      this.locators.productPrice.ios
    );
  }

  /**
   * Wait for page to load
   */
  async waitForPageLoad(): Promise<void> {
    await this.waitForVisible(this.productScreen, 15);
    await this.waitForVisible(this.addToCartButton, 10);
  }

  /**
   * Check if page is displayed
   */
  async isPageDisplayed(): Promise<boolean> {
    return await this.elementExists(this.productScreen);
  }

  /**
   * Get product title text
   */
  async getProductName(): Promise<string> {
    await this.waitForVisible(this.productName, 5);
    return await this.getText(this.productName);
  }

  /**
   * Get product price text
   */
  async getProductPrice(): Promise<string> {
    await this.waitForVisible(this.productPrice, 5);
    return await this.getText(this.productPrice);
  }

  /**
   * Get product description text
   */
  async getProductDescription(): Promise<string> {
    const locator = this.getLocator(
      this.locators.productDescription.android,
      this.locators.productDescription.ios
    );
    return await this.getText(locator);
  }

  /**
   * Add product to cart
   */
  async addToCart(): Promise<void> {
    await this.waitForVisible(this.addToCartButton, 5);
    await this.tap(this.addToCartButton);
  }

  /**
   * Increase quantity
   */
  async increaseQuantity(): Promise<void> {
    const plusButton = this.getLocator(
      this.locators.counterPlusButton.android,
      this.locators.counterPlusButton.ios
    );
    await this.tap(plusButton);
  }

  /**
   * Decrease quantity
   */
  async decreaseQuantity(): Promise<void> {
    const minusButton = this.getLocator(
      this.locators.counterMinusButton.android,
      this.locators.counterMinusButton.ios
    );
    await this.tap(minusButton);
  }

  /**
   * Get current quantity
   */
  async getQuantity(): Promise<number> {
    const counterAmount = this.getLocator(
      this.locators.counterAmount.android,
      this.locators.counterAmount.ios
    );
    const text = await this.getText(counterAmount);
    return parseInt(text) || 1;
  }

  /**
   * Set quantity to specific value
   * @param quantity - Desired quantity
   */
  async setQuantity(quantity: number): Promise<void> {
    const current = await this.getQuantity();
    if (quantity > current) {
      for (let i = 0; i < quantity - current; i++) {
        await this.increaseQuantity();
      }
    } else if (quantity < current) {
      for (let i = 0; i < current - quantity; i++) {
        await this.decreaseQuantity();
      }
    }
  }

  /**
   * Add multiple quantities to cart
   * @param quantity - Number of items to add
   */
  async addToCartWithQuantity(quantity: number) {
    await this.setQuantity(quantity);
    await this.addToCart();
  }

  /**
   * Select color option (if available)
   * @param colorIndex - Zero-based index of color option
   */
  async selectColor(colorIndex: number) {
    const colorLocator = this.getLocator(
      this.locators.colorCircle.android,
      this.locators.colorCircle.ios
    );
    const locator = `(${colorLocator})[${colorIndex + 1}]`;
    await this.tap(locator);
  }

  /**
   * Go back to products page
   */
  async goBack() {
    const backButton = this.getLocator(
      this.locators.backButton.android,
      this.locators.backButton.ios
    );
    await this.tap(backButton);
  }

  /**
   * Navigate to cart
   */
  async goToCart() {
    const cartIcon = this.getLocator(
      this.locators.cartIcon.android,
      this.locators.cartIcon.ios
    );
    await this.tap(cartIcon);
  }

  /**
   * Get cart badge count
   */
  async getCartBadgeCount(): Promise<number> {
    const cartBadge = this.getLocator(
      this.locators.cartBadge.android,
      this.locators.cartBadge.ios
    );
    const exists = await this.elementExists(cartBadge);
    if (!exists) return 0;
    const text = await this.getText(cartBadge);
    return parseInt(text) || 0;
  }

  /**
   * Check if product has color options
   */
  async hasColorOptions(): Promise<boolean> {
    const colorLocator = this.getLocator(
      this.locators.colorCircle.android,
      this.locators.colorCircle.ios
    );
    return await this.elementExists(colorLocator);
  }

  /**
   * Scroll down on product details
   */
  async scrollDown() {
    const mobileHelper = this.I as any;
    if (mobileHelper.swipeUp) {
      await mobileHelper.swipeUp(0.3);
    }
  }

  /**
   * Scroll up on product details
   */
  async scrollUp() {
    const mobileHelper = this.I as any;
    if (mobileHelper.swipeDown) {
      await mobileHelper.swipeDown(0.3);
    }
  }
}

export = new ProductDetailsPage();
