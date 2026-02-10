import { BasePage } from './base.page';

const { I } = inject();

/**
 * Cart Page Object for Sauce Labs Demo App
 * Contains locators and methods for the shopping cart screen
 * @author Sanjay Singh Panwar
 */
class CartPage extends BasePage {
  
  // Locators - Sauce Labs Demo App specific (Native Android + iOS)
  private locators = {
    // Cart screen container
    cartScreen: {
      android: 'android=new UiSelector().resourceId("com.saucelabs.mydemoapp.android:id/cartTV")',
      ios: '~Cart Screen',
    },
    
    // Cart content container
    cartContent: {
      android: '~Manages scrolling of views in given screen',
      ios: '~cart content',
    },
    
    // Product row/item in cart
    productRow: {
      android: '~Displays selected product',
      ios: '~Product Row',
    },
    
    // Product title in cart
    productTitle: {
      android: 'android=new UiSelector().resourceId("com.saucelabs.mydemoapp.android:id/titleTV")',
      ios: '~Product Title',
    },
    
    // Product price in cart
    productPrice: {
      android: 'android=new UiSelector().resourceId("com.saucelabs.mydemoapp.android:id/priceTV")',
      ios: '~Product Price',
    },
    
    // Quantity counter
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
    
    // Remove item button
    removeItem: {
      android: '~Removes product from cart',
      ios: '~remove item',
    },
    
    // Total price
    totalPrice: {
      android: 'android=new UiSelector().resourceId("com.saucelabs.mydemoapp.android:id/totalPriceTV")',
      ios: '~total price',
    },
    
    // Total number
    totalNumber: {
      android: 'android=new UiSelector().resourceId("com.saucelabs.mydemoapp.android:id/itemsTV")',
      ios: '~total number',
    },
    
    // Proceed to checkout button
    proceedToCheckout: {
      android: '~Confirms products for checkout',
      ios: '~Proceed To Checkout button',
    },
    
    // Go shopping button (when cart is empty)
    goShopping: {
      android: '//android.widget.Button[@text="Go Shopping"]',
      ios: '~Go Shopping button',
    },
    
    // Empty cart message
    noItemsText: {
      android: '//android.widget.TextView[@text="No Items"]',
      ios: '**/XCUIElementTypeStaticText[`label == "No Items"`]',
    },
    
    // Back button (hamburger/menu button used for navigation)
    backButton: {
      android: '~View menu',
      ios: '~Navigate back',
    },
    
    // Cart items count label
    cartItemsCount: {
      android: '~cart items count',
      ios: '~cart items count',
    },
  };

  /**
   * Get cart screen locator
   */
  get cartScreen() {
    return this.getLocator(
      this.locators.cartScreen.android,
      this.locators.cartScreen.ios
    );
  }

  /**
   * Get proceed to checkout button locator
   */
  get proceedToCheckout() {
    return this.getLocator(
      this.locators.proceedToCheckout.android,
      this.locators.proceedToCheckout.ios
    );
  }

  /**
   * Get product row locator
   */
  get productRow() {
    return this.getLocator(
      this.locators.productRow.android,
      this.locators.productRow.ios
    );
  }

  /**
   * Wait for page to load
   */
  async waitForPageLoad(): Promise<void> {
    await this.waitForVisible(this.cartScreen, 30);
  }

  /**
   * Check if page is displayed
   */
  async isPageDisplayed(): Promise<boolean> {
    return await this.elementExists(this.cartScreen);
  }

  /**
   * Check if cart is empty
   */
  async isCartEmpty(): Promise<boolean> {
    const goShoppingButton = this.getLocator(
      this.locators.goShopping.android,
      this.locators.goShopping.ios
    );
    return await this.elementExists(goShoppingButton);
  }

  /**
   * Get number of items in cart
   */
  async getItemCount(): Promise<number> {
    return await I.grabNumberOfVisibleElements(this.productRow);
  }

  /**
   * Get total price text
   */
  async getTotalPrice(): Promise<string> {
    const totalNumber = this.getLocator(
      this.locators.totalNumber.android,
      this.locators.totalNumber.ios
    );
    return await this.getText(totalNumber);
  }

  /**
   * Proceed to checkout
   */
  async checkout(): Promise<void> {
    await this.waitForVisible(this.proceedToCheckout, 5);
    await this.tap(this.proceedToCheckout);
  }

  /**
   * Go shopping (from empty cart)
   */
  async goShopping(): Promise<void> {
    const goShoppingButton = this.getLocator(
      this.locators.goShopping.android,
      this.locators.goShopping.ios
    );
    await this.tap(goShoppingButton);
  }

  /**
   * Remove first item from cart
   */
  async removeFirstItem(): Promise<void> {
    const removeButton = this.getLocator(
      this.locators.removeItem.android,
      this.locators.removeItem.ios
    );
    await this.tap(removeButton);
  }

  /**
   * Remove item at specific index
   * @param index - Zero-based index
   */
  async removeItemAtIndex(index: number): Promise<void> {
    const removeButton = this.getLocator(
      this.locators.removeItem.android,
      this.locators.removeItem.ios
    );
    const locator = `(${removeButton})[${index + 1}]`;
    await this.tap(locator);
  }

  /**
   * Increase quantity of first item
   */
  async increaseFirstItemQuantity(): Promise<void> {
    const plusButton = this.getLocator(
      this.locators.counterPlusButton.android,
      this.locators.counterPlusButton.ios
    );
    await this.tap(plusButton);
  }

  /**
   * Decrease quantity of first item
   */
  async decreaseFirstItemQuantity(): Promise<void> {
    const minusButton = this.getLocator(
      this.locators.counterMinusButton.android,
      this.locators.counterMinusButton.ios
    );
    await this.tap(minusButton);
  }

  /**
   * Get quantity of first item in cart
   */
  async getFirstItemQuantity(): Promise<number> {
    const counterAmount = this.getLocator(
      this.locators.counterAmount.android,
      this.locators.counterAmount.ios
    );
    const text = await this.getText(counterAmount);
    return parseInt(text) || 1;
  }

  /**
   * Get product name of first item
   */
  async getFirstItemName(): Promise<string> {
    const titleLocator = this.getLocator(
      this.locators.productTitle.android,
      this.locators.productTitle.ios
    );
    return await this.getText(titleLocator);
  }

  /**
   * Get all product names in cart
   */
  async getAllItemNames(): Promise<string[]> {
    const titleLocator = this.getLocator(
      this.locators.productTitle.android,
      this.locators.productTitle.ios
    );
    const count = await I.grabNumberOfVisibleElements(titleLocator);
    const names: string[] = [];
    for (let i = 1; i <= count; i++) {
      const text = await I.grabTextFrom(`(${titleLocator})[${i}]`);
      names.push(text);
    }
    return names;
  }

  /**
   * Go back to previous screen
   */
  async goBack(): Promise<void> {
    const backButton = this.getLocator(
      this.locators.backButton.android,
      this.locators.backButton.ios
    );
    await this.tap(backButton);
  }

  /**
   * Clear cart (remove all items)
   */
  async clearCart(): Promise<void> {
    while (!(await this.isCartEmpty())) {
      const itemCount = await this.getItemCount();
      if (itemCount === 0) break;
      await this.removeFirstItem();
      await this.pause(0.5);
    }
  }

  /**
   * Scroll down in cart
   */
  async scrollDown() {
    const mobileHelper = this.I as any;
    if (mobileHelper.swipeUp) {
      await mobileHelper.swipeUp(0.3);
    }
  }

  /**
   * Check if checkout button is enabled
   */
  async isCheckoutEnabled(): Promise<boolean> {
    const exists = await this.elementExists(this.proceedToCheckout);
    return exists;
  }
}

export = new CartPage();
