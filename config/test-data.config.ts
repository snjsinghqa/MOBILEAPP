/**
 * Test data configuration for Sauce Labs Demo App tests
 * @author Sanjay Singh Panwar
 */

// Sauce Labs Demo App valid credentials (Native Android/iOS)
export const TestUsers = {
  validUser: {
    username: 'bod@example.com',
    password: '10203040',
    displayName: 'Bod',
  },
  visualUser: {
    username: 'visual@example.com',
    password: '10203040',
    displayName: 'Visual',
  },
  lockedUser: {
    username: 'alice@example.com',
    password: '10203040',
    displayName: 'Alice (Locked)',
  },
  invalidUser: {
    username: 'invalid@example.com',
    password: 'wrongpassword',
  },
  emptyUser: {
    username: '',
    password: '',
  },
};

// Shipping addresses for checkout
export const TestAddresses = {
  validAddress: {
    fullName: 'John Doe',
    addressLine1: '123 Main Street',
    addressLine2: 'Apt 4B',
    city: 'Düsseldorf',
    state: 'NRW',
    zipCode: '40227',
    country: 'Germany',
  },
  minimalAddress: {
    fullName: 'Jane Smith',
    addressLine1: '456 Oak Avenue',
    city: 'Düsseldorf',
    zipCode: '40227',
    country: 'Germany',
  },
  germanAddress: {
    fullName: 'Jane Smith',
    addressLine1: '123 Main Street',
    addressLine2: 'Apt 4B',
    city: 'Düsseldorf',
    state: 'NRW',
    zipCode: '40227',
    country: 'Germany',
  },
};

// Generate dynamic expiration date (3 years in future)
const getFutureExpirationDate = () => {
  const futureDate = new Date();
  futureDate.setFullYear(futureDate.getFullYear() + 3);
  const month = String(futureDate.getMonth() + 1).padStart(2, '0');
  const year = String(futureDate.getFullYear()).slice(-2);
  return `${month}/${year}`;
};

// Payment details for checkout
export const TestPayments = {
  validCard: {
    cardHolderName: 'Jane Smith',
    cardNumber: '4111111111111111',
    expirationDate: getFutureExpirationDate(),
    securityCode: '123',
  },
  invalidCard: {
    cardNumber: '1234567890123456',
    expirationDate: '01/20',
    securityCode: '999',
  },
};

// Products in Sauce Labs Demo App
export const TestProducts = {
  backpack: {
    name: 'Sauce Labs Backpack',
    price: '$29.99',
  },
  bikeLight: {
    name: 'Sauce Labs Bike Light',
    price: '$9.99',
  },
  boltTShirt: {
    name: 'Sauce Labs Bolt T-Shirt',
    price: '$15.99',
  },
  fleeceJacket: {
    name: 'Sauce Labs Fleece Jacket',
    price: '$49.99',
  },
  onesie: {
    name: 'Sauce Labs Onesie',
    price: '$7.99',
  },
  testAllTheThings: {
    name: 'Test.allTheThings() T-Shirt',
    price: '$15.99',
  },
};

// Timeouts (in seconds)
export const Timeouts = {
  short: 1,
  medium: 2,
  long: 5,
  veryLong: 10,
};
