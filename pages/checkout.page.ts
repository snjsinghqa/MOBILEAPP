import { BasePage } from './base.page';

const { I } = inject();

/**
 * Checkout Page Object for Sauce Labs Demo App
 * Contains locators and methods for the checkout flow screens
 * @author Sanjay Singh Panwar
 */
class CheckoutPage extends BasePage {
  
  // Locators - Sauce Labs Demo App specific
  private locators = {
    // Checkout address screen - use form field presence
    checkoutAddressScreen: {
      android: 'android=new UiSelector().resourceId("com.saucelabs.mydemoapp.android:id/fullNameET")',
      ios: '~Checkout Address Screen',
    },
    
    // Checkout payment screen - use payment button presence
    checkoutPaymentScreen: {
      android: 'android=new UiSelector().resourceId("com.saucelabs.mydemoapp.android:id/paymentBtn")',
      ios: '~Checkout Payment Screen',
    },
    
    // Checkout complete screen
    checkoutCompleteScreen: {
      android: 'android=new UiSelector().resourceId("com.saucelabs.mydemoapp.android:id/completeTV")',
      ios: '~Checkout Complete Screen',
    },
    
    // Address form fields - using resource IDs
    fullNameField: {
      android: 'android=new UiSelector().resourceId("com.saucelabs.mydemoapp.android:id/fullNameET")',
      ios: '~Full Name* input field',
    },
    
    addressLine1Field: {
      android: 'android=new UiSelector().resourceId("com.saucelabs.mydemoapp.android:id/address1ET")',
      ios: '~Address Line 1* input field',
    },
    
    addressLine2Field: {
      android: 'android=new UiSelector().resourceId("com.saucelabs.mydemoapp.android:id/address2ET")',
      ios: '~Address Line 2 input field',
    },
    
    cityField: {
      android: 'android=new UiSelector().resourceId("com.saucelabs.mydemoapp.android:id/cityET")',
      ios: '~City* input field',
    },
    
    stateField: {
      android: 'android=new UiSelector().resourceId("com.saucelabs.mydemoapp.android:id/stateET")',
      ios: '~State/Region input field',
    },
    
    zipCodeField: {
      android: 'android=new UiSelector().resourceId("com.saucelabs.mydemoapp.android:id/zipET")',
      ios: '~Zip Code* input field',
    },
    
    countryField: {
      android: 'android=new UiSelector().resourceId("com.saucelabs.mydemoapp.android:id/countryET")',
      ios: '~Country* input field',
    },
    
    // Payment form fields
    cardNumberField: {
      android: 'android=new UiSelector().resourceId("com.saucelabs.mydemoapp.android:id/cardNumberET")',
      ios: '~Card Number* input field',
    },
    
    expirationDateField: {
      android: 'android=new UiSelector().resourceId("com.saucelabs.mydemoapp.android:id/expirationDateET")',
      ios: '~Expiration Date* input field',
    },
    
    securityCodeField: {
      android: 'android=new UiSelector().resourceId("com.saucelabs.mydemoapp.android:id/securityCodeET")',
      ios: '~Security Code* input field',
    },
    
    cardHolderField: {
      android: 'android=new UiSelector().resourceId("com.saucelabs.mydemoapp.android:id/nameET")',
      ios: '~Full Name* input field',
    },
    
    // Billing address checkbox
    billAddressCheckbox: {
      android: 'android=new UiSelector().resourceId("com.saucelabs.mydemoapp.android:id/billAddressChB")',
      ios: '~checkbox',
    },
    
    // To payment button
    toPaymentButton: {
      android: 'android=new UiSelector().text("To Payment")',
      ios: '~To Payment button',
    },
    
    // Review order button
    reviewOrderButton: {
      android: 'android=new UiSelector().text("Review Order")',
      ios: '~Review Order button',
    },
    
    // Place order button
    placeOrderButton: {
      android: 'android=new UiSelector().text("Place Order")',
      ios: '~Place Order button',
    },
    
    // Continue shopping button (order complete)
    continueShoppingButton: {
      android: 'android=new UiSelector().resourceId("com.saucelabs.mydemoapp.android:id/shoopingBt")',
      ios: '~Continue Shopping button',
    },
    
    // Success checkmark
    checkoutComplete: {
      android: 'android=new UiSelector().text("Checkout Complete")',
      ios: '~checkout complete icon',
    },
    
    // Checkout order summary
    orderSummary: {
      android: '~Checkout summary',
      ios: '~checkout summary',
    },
    

  };

  /**
   * Get checkout address screen locator
   */
  get checkoutAddressScreen() {
    return this.getLocator(
      this.locators.checkoutAddressScreen.android,
      this.locators.checkoutAddressScreen.ios
    );
  }

  /**
   * Get checkout payment screen locator
   */
  get checkoutPaymentScreen() {
    return this.getLocator(
      this.locators.checkoutPaymentScreen.android,
      this.locators.checkoutPaymentScreen.ios
    );
  }

  /**
   * Get checkout complete screen locator
   */
  get checkoutCompleteScreen() {
    return this.getLocator(
      this.locators.checkoutCompleteScreen.android,
      this.locators.checkoutCompleteScreen.ios
    );
  }

  /**
   * Wait for address page to load
   */
  async waitForPageLoad(): Promise<void> {
    await this.waitForVisible(this.checkoutAddressScreen, 15);
  }

  /**
   * Wait for payment page to load
   */
  async waitForPaymentPage(): Promise<void> {
    await this.waitForVisible(this.checkoutPaymentScreen, 15);
  }

  /**
   * Wait for checkout complete page
   */
  async waitForCompletePage(): Promise<void> {
    await this.waitForVisible(this.checkoutCompleteScreen, 30);
  }

  /**
   * Check if address page is displayed
   */
  async isPageDisplayed(): Promise<boolean> {
    return await this.elementExists(this.checkoutAddressScreen);
  }

  /**
   * Check if payment page is displayed
   */
  async isPaymentPageDisplayed(): Promise<boolean> {
    return await this.elementExists(this.checkoutPaymentScreen);
  }

  /**
   * Check if order complete page is displayed
   */
  async isOrderCompleteDisplayed(): Promise<boolean> {
    return await this.elementExists(this.checkoutCompleteScreen);
  }

  /**
   * Fill shipping address form
   */
  async fillShippingAddress(address: {
    fullName: string;
    addressLine1: string;
    addressLine2?: string;
    city: string;
    state?: string;
    zipCode: string;
    country: string;
  }) {
    // Full name
    const fullNameField = this.getLocator(
      this.locators.fullNameField.android,
      this.locators.fullNameField.ios
    );
    await this.tap(fullNameField);
    await this.fillField(fullNameField, address.fullName);
    
    // Address line 1
    const addressLine1Field = this.getLocator(
      this.locators.addressLine1Field.android,
      this.locators.addressLine1Field.ios
    );
    await this.tap(addressLine1Field);
    await this.fillField(addressLine1Field, address.addressLine1);
    
    // Address line 2 (optional)
    if (address.addressLine2) {
      const addressLine2Field = this.getLocator(
        this.locators.addressLine2Field.android,
        this.locators.addressLine2Field.ios
      );
      await this.tap(addressLine2Field);
      await this.fillField(addressLine2Field, address.addressLine2);
    }
    
    // City
    const cityField = this.getLocator(
      this.locators.cityField.android,
      this.locators.cityField.ios
    );
    await this.tap(cityField);
    await this.fillField(cityField, address.city);
    
    // State (optional)
    if (address.state) {
      const stateField = this.getLocator(
        this.locators.stateField.android,
        this.locators.stateField.ios
      );
      await this.tap(stateField);
      await this.fillField(stateField, address.state);
    }
    
    // Zip code
    const zipCodeField = this.getLocator(
      this.locators.zipCodeField.android,
      this.locators.zipCodeField.ios
    );
    await this.tap(zipCodeField);
    await this.fillField(zipCodeField, address.zipCode);
    
    // Country
    const countryField = this.getLocator(
      this.locators.countryField.android,
      this.locators.countryField.ios
    );
    await this.tap(countryField);
    await this.fillField(countryField, address.country);
  }

  /**
   * Fill payment details
   */
  async fillPaymentDetails(payment: {
    cardNumber: string;
    expirationDate: string;
    securityCode: string;
    cardHolderName?: string;
  }) {
    // Wait for payment page to load
    await this.pause(2);
    
    // Card number - fill first as it's usually at the top
    const cardNumberField = this.getLocator(
      this.locators.cardNumberField.android,
      this.locators.cardNumberField.ios
    );
    await this.waitForElement(cardNumberField, 10);
    await this.tap(cardNumberField);
    await this.fillField(cardNumberField, payment.cardNumber);
    console.log(`Filled Card Number: ${payment.cardNumber}`);
    
    // Expiration date
    const expirationField = this.getLocator(
      this.locators.expirationDateField.android,
      this.locators.expirationDateField.ios
    );
    await this.tap(expirationField);
    await this.fillField(expirationField, payment.expirationDate);
    console.log(`Filled Expiration Date: ${payment.expirationDate}`);
    
    // Security code
    const securityCodeField = this.getLocator(
      this.locators.securityCodeField.android,
      this.locators.securityCodeField.ios
    );
    await this.tap(securityCodeField);
    await this.fillField(securityCodeField, payment.securityCode);
    console.log(`Filled Security Code: ${payment.securityCode}`);
    
    // Hide keyboard before checking for optional fields
    try {
      await this.I.hideDeviceKeyboard();
      await this.pause(1);
    } catch {
      console.log('Keyboard hide not needed');
    }
    
    // Full Name / Cardholder Name field (optional - may not be present)
    if (payment.cardHolderName) {
      const cardHolderField = this.getLocator(
        this.locators.cardHolderField.android,
        this.locators.cardHolderField.ios
      );
      
      try {
        // Check if field exists without waiting
        const exists = await this.elementExists(cardHolderField);
        if (exists) {
          await this.tap(cardHolderField);
          await this.fillField(cardHolderField, payment.cardHolderName);
          console.log(`[OK] Filled Cardholder Name: ${payment.cardHolderName}`);
          
          // Hide keyboard after filling
          try {
            await this.I.hideDeviceKeyboard();
          } catch {
            // Ignore
          }
        } else {
          console.log('[WARNING] Cardholder name field not visible on current screen, skipping...');
        }
      } catch (error) {
        console.log('[WARNING] Cardholder name field not available, continuing without it...');
      }
    }
    
    console.log('[OK] Payment details filled successfully');
  }

  /**
   * Proceed to payment
   */
  async proceedToPayment(): Promise<void> {
    const toPaymentButton = this.getLocator(
      this.locators.toPaymentButton.android,
      this.locators.toPaymentButton.ios
    );
    
    // Hide keyboard first
    try {
      await this.I.hideDeviceKeyboard();
      await this.pause(1);
    } catch {
      console.log('Keyboard hide not needed or failed');
    }
    
    // Check if button is visible, if not try scrolling
    let buttonVisible = await this.elementExists(toPaymentButton);
    
    if (!buttonVisible) {
      console.log('To Payment button not immediately visible, scrolling...');
      await this.I.swipeUp();
      await this.pause(1);
      buttonVisible = await this.elementExists(toPaymentButton);
      
      if (buttonVisible) {
        console.log('[OK] To Payment button found after scrolling');
      }
    } else {
      console.log('[OK] To Payment button is visible');
    }
    
    // Wait for button to be visible before tapping
    await this.waitForVisible(toPaymentButton, 10);
    await this.tap(toPaymentButton);
    console.log('[OK] Tapped To Payment button');
  }

  /**
   * Review order
   */
  async reviewOrder(): Promise<void> {
    const reviewOrderButton = this.getLocator(
      this.locators.reviewOrderButton.android,
      this.locators.reviewOrderButton.ios
    );
    
    // Hide keyboard first
    try {
      await this.I.hideDeviceKeyboard();
      await this.pause(1);
    } catch {
      console.log('Keyboard hide not needed or failed');
    }
    
    // Wait a bit for the page to settle after filling payment details
    await this.pause(2);
    
    // Check if button is already visible
    let buttonVisible = await this.elementExists(reviewOrderButton);
    
    // If not visible, try scrolling with a safer approach
    if (!buttonVisible) {
      console.log('Review Order button not immediately visible, attempting to scroll...');
      
      // Try alternative scrolling approach using performActions
      try {
        // Perform scroll action using touch actions (more reliable than swipeUp)
        await this.I.performTouchAction({
          action: 'press',
          options: { x: 500, y: 1500 }
        });
        await this.I.performTouchAction({
          action: 'moveTo',
          options: { x: 500, y: 500 }
        });
        await this.I.performTouchAction({ action: 'release' });
        await this.pause(1);
        
        buttonVisible = await this.elementExists(reviewOrderButton);
        
        if (buttonVisible) {
          console.log('[OK] Review Order button found after scrolling');
        }
      } catch (scrollError) {
        console.log('Scroll attempt failed, will try to find button anyway');
      }
    } else {
      console.log('[OK] Review Order button is visible');
    }
    
    // Wait for button and tap it
    await this.waitForVisible(reviewOrderButton, 10);
    await this.tap(reviewOrderButton);
    console.log('[OK] Tapped Review Order button');
  }

  /**
   * Place order
   */
  async placeOrder(): Promise<void> {
    const placeOrderButton = this.getLocator(
      this.locators.placeOrderButton.android,
      this.locators.placeOrderButton.ios
    );
    await this.tap(placeOrderButton);
  }

  /**
   * Continue shopping (from order complete)
   */
  async continueShopping(): Promise<void> {
    const continueButton = this.getLocator(
      this.locators.continueShoppingButton.android,
      this.locators.continueShoppingButton.ios
    );
    await this.tap(continueButton);
  }

  /**
   * Check if order was placed successfully
   */
  async isOrderSuccessful(): Promise<boolean> {
    const checkoutComplete = this.getLocator(
      this.locators.checkoutComplete.android,
      this.locators.checkoutComplete.ios
    );
    return await this.elementExists(checkoutComplete);
  }

  /**
   * Scroll down on checkout form
   */
  async scrollDown(): Promise<void> {
    try {
      await this.I.swipeUp();
    } catch (error) {
      console.log('Scroll not available or not needed:', error);
    }
  }
}

export = new CheckoutPage();
