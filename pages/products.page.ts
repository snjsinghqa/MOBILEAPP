import { BasePage } from './base.page';

const { I } = inject();

/**
 * Products Page Object for Sauce Labs Demo App
 * Contains locators and methods for the product catalog screen
 * @author Sanjay Singh Panwar
 */
class ProductsPage extends BasePage {
  
  // Locators - Native Android uses resource-id/content-desc, iOS uses accessibility id
  private locators = {
    // Products screen container (title text)
    productsScreen: {
      android: '~Displays all products of catalog',
      ios: '~title',
    },
    
    // Store item (product card) - use Product Image for clicking
    storeItem: {
      android: '~Product Image',
      ios: '~ProductItem',
    },
    
    // Product title text
    productTitle: {
      android: '~Product Title',
      ios: '~Product Name',
    },
    
    // Product price
    productPrice: {
      android: '~Product Price',
      ios: '~Product Price',
    },
    
    // Sort button
    sortButton: {
      android: '~Shows current sorting order and displays available sorting options',
      ios: '~sort button',
    },
    
    // Cart badge (shows item count)
    cartBadge: {
      android: 'android=new UiSelector().resourceId("com.saucelabs.mydemoapp.android:id/cartTV")',
      ios: '~cart badge',
    },
    
    // Cart icon
    cartIcon: {
      android: '~View cart',
      ios: '~Cart-tab-item',
    },
    
    // Menu icon (hamburger/More tab)
    menuIcon: {
      android: '~View menu',
      ios: '~More-tab-item',
    },
    
    // Products header
    productsHeader: {
      android: 'android=new UiSelector().resourceId("com.saucelabs.mydemoapp.android:id/productTV")',
      ios: '**/XCUIElementTypeStaticText[`label == "Products"`]',
    },
    
    // Sort options - native Android uses text selector
    sortNameAsc: {
      android: '//android.widget.TextView[@text="Name - Ascending"]',
      ios: '~nameAsc',
    },
    sortNameDesc: {
      android: '//android.widget.TextView[@text="Name - Descending"]',
      ios: '~nameDesc',
    },
    sortPriceAsc: {
      android: '//android.widget.TextView[@text="Price - Ascending"]',
      ios: '~priceAsc',
    },
    sortPriceDesc: {
      android: '//android.widget.TextView[@text="Price - Descending"]',
      ios: '~priceDesc',
    },
  };

  /**
   * Get products screen locator
   */
  get productsScreen() {
    return this.getLocator(
      this.locators.productsScreen.android,
      this.locators.productsScreen.ios
    );
  }

  /**
   * Get store item locator
   */
  get storeItem() {
    return this.getLocator(
      this.locators.storeItem.android,
      this.locators.storeItem.ios
    );
  }

  /**
   * Get cart icon locator
   */
  get cartIcon() {
    return this.getLocator(
      this.locators.cartIcon.android,
      this.locators.cartIcon.ios
    );
  }

  /**
   * Get cart badge locator
   */
  get cartBadge() {
    return this.getLocator(
      this.locators.cartBadge.android,
      this.locators.cartBadge.ios
    );
  }

  /**
   * Wait for page to load
   */
  async waitForPageLoad(): Promise<void> {
    await this.waitForVisible(this.productsScreen, 15);
  }

  /**
   * Check if page is displayed
   */
  async isPageDisplayed(): Promise<boolean> {
    return await this.elementExists(this.productsScreen);
  }

  /**
   * Get number of products displayed
   */
  async getProductCount(): Promise<number> {
    return await I.grabNumberOfVisibleElements(this.storeItem);
  }

  /**
   * Tap on first product
   */
  async tapFirstProduct() {
    await this.waitForVisible(this.storeItem, 10);
    await this.tap(this.storeItem);
  }

  /**
   * Tap on product at specific index
   * @param index - Zero-based index
   */
  async tapProductAtIndex(index: number) {
    await this.waitForVisible(this.storeItem, 10);
    const locator = this.isAndroid 
      ? `(${this.locators.storeItem.android})[${index + 1}]`
      : `(${this.locators.storeItem.ios})[${index + 1}]`;
    await this.tap(locator);
  }

  /**
   * Tap on product by name
   * @param productName - Name of the product
   */
  async tapProductByName(productName: string) {
    const locator = this.isAndroid
      ? `//android.widget.TextView[@text="${productName}"]`
      : `**/XCUIElementTypeStaticText[\`label == "${productName}"\`]`;
    await this.waitForVisible(locator, 10);
    await this.tap(locator);
  }

  /**
   * Navigate to cart
   */
  async goToCart() {
    await this.tap(this.cartIcon);
  }

  /**
   * Get cart badge count
   * @returns Number of items in cart
   */
  async getCartBadgeCount(): Promise<number> {
    const exists = await this.elementExists(this.cartBadge);
    if (!exists) return 0;
    const text = await this.getText(this.cartBadge);
    return parseInt(text) || 0;
  }

  /**
   * Check if cart has items
   */
  async cartHasItems(): Promise<boolean> {
    return await this.elementExists(this.cartBadge);
  }

  /**
   * Open sort menu
   */
  async openSortMenu() {
    const sortButton = this.getLocator(
      this.locators.sortButton.android,
      this.locators.sortButton.ios
    );
    await this.tap(sortButton);
  }

  /**
   * Sort products by name ascending (A-Z)
   */
  async sortByNameAscending() {
    await this.openSortMenu();
    await this.tap(this.getLocator(
      this.locators.sortNameAsc.android,
      this.locators.sortNameAsc.ios
    ));
  }

  /**
   * Sort products by name descending (Z-A)
   */
  async sortByNameDescending() {
    await this.openSortMenu();
    await this.tap(this.getLocator(
      this.locators.sortNameDesc.android,
      this.locators.sortNameDesc.ios
    ));
  }

  /**
   * Sort products by price ascending (low to high)
   */
  async sortByPriceAscending() {
    await this.openSortMenu();
    await this.tap(this.getLocator(
      this.locators.sortPriceAsc.android,
      this.locators.sortPriceAsc.ios
    ));
  }

  /**
   * Sort products by price descending (high to low)
   */
  async sortByPriceDescending() {
    await this.openSortMenu();
    await this.tap(this.getLocator(
      this.locators.sortPriceDesc.android,
      this.locators.sortPriceDesc.ios
    ));
  }

  /**
   * Open side menu
   */
  async openMenu() {
    const menuIcon = this.getLocator(
      this.locators.menuIcon.android,
      this.locators.menuIcon.ios
    );
    await this.tap(menuIcon);
  }

  /**
   * Scroll down to load more products
   */
  async scrollDownProducts() {
    const mobileHelper = this.I as any;
    if (mobileHelper.swipeUp) {
      await mobileHelper.swipeUp(0.4);
    }
  }

  /**
   * Get product titles
   */
  async getProductTitles(): Promise<string[]> {
    const titleLocator = this.getLocator(
      this.locators.productTitle.android,
      this.locators.productTitle.ios
    );
    const count = await I.grabNumberOfVisibleElements(titleLocator);
    const titles: string[] = [];
    for (let i = 1; i <= count; i++) {
      const text = await I.grabTextFrom(`(${titleLocator})[${i}]`);
      titles.push(text);
    }
    return titles;
  }
}

export = new ProductsPage();
