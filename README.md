# Sauce Labs Demo App - Mobile Test Automation Framework

A comprehensive mobile test automation framework built with **CodeceptJS** and **Appium 2.x** for testing the [Sauce Labs My Demo App](https://github.com/saucelabs/my-demo-app-android) on Android and iOS platforms.

**Author:** Sanjay Singh Panwar

---

## Table of Contents

1. [Test Strategy](#test-strategy)F
2. [Project Structure](#project-structure)
3. [Quick Start](#quick-start)
4. [Running Tests](#running-tests)
5. [Test Architecture](#test-architecture)
6. [CI/CD Integration](#cicd-integration)
7. [Reporting](#reporting)
8. [Troubleshooting](#troubleshooting)

---

## Test Strategy

### What Types of Tests Would You Automate?

| Test Type | Priority | Rationale |
|-----------|----------|-----------|
| **Login/Authentication** | Critical | Core user journey gate; blocks all subsequent flows if broken |
| **E2E Shopping Flow** | Critical | Primary business value: Browse → Add to Cart → Checkout |
| **Form Validations** | High | Input validation, error messages, edge cases |
| **Navigation** | High | Tab bar, back navigation, deep links |
| **Cart Operations** | High | Add/remove items, quantity changes, persistence |
| **State Persistence** | Medium | App restart, background/foreground |
| **Accessibility** | Medium | Screen reader support, contrast, touch targets |
| **Performance Smoke** | Low | App launch time, screen transition speed |

### What Would You NOT Automate (and Why)?

| Area | Reason |
|------|--------|
| **Visual/UI Polish** | Manual review better for pixel-perfect design; use visual testing tools like Applitools if needed |
| **Complex Gestures** | 3D touch, force press - highly device specific, low ROI |
| **Hardware Features** | Camera, NFC, Bluetooth - require physical device setup, better for manual testing |
| **Network Edge Cases** | Spotty 3G, packet loss - brittle to automate reliably |
| **Localization (50+ languages)** | Better suited for specialized i18n testing tools |
| **Security Penetration** | Requires specialized security testing tools and expertise |

### Automation Structure for Scale

#### Multiple Platforms
```
┌─────────────────────────────────────────────────────────────┐
│                    Shared Test Logic                        │
│                        (tests/)                             │
├─────────────────────────────────────────────────────────────┤
│     BasePage (Abstract)    │    Platform Detection          │
│   getLocator(android, ios) │    isAndroid / isIOS           │
├─────────────────────────────────────────────────────────────┤
│    Android Locators        │       iOS Locators             │
│    (UiAutomator2)          │       (XCUITest)               │
├─────────────────────────────────────────────────────────────┤
│    Android Device Config   │      iOS Device Config         │
│    (emulator/real)         │      (simulator/real)          │
└─────────────────────────────────────────────────────────────┘
```

#### Multiple Devices
- **Configuration-driven**: Device capabilities in `config/device.config.ts`
- **Environment variables**: Easy switching via `PLATFORM`, `DEVICE_TYPE`
- **Parallel execution**: Separate Appium ports (4723 Android, 4724 iOS)
- **Device matrix**: CI runs on multiple device/OS combinations

#### Long-term Maintainability
1. **Page Object Model**: All locators/actions encapsulated in reusable page classes
2. **Single responsibility**: Each page object handles one screen
3. **DRY principles**: Shared utilities in `BasePage`, helpers
4. **Explicit waits**: No arbitrary `sleep()` - use `waitForElement`, `waitForVisible`
5. **Meaningful assertions**: Clear failure messages
6. **Tagging strategy**: `@smoke`, `@regression`, `@login` for selective runs

### CI/CD Integration Strategy

```
┌──────────────────┐    ┌──────────────────┐    ┌──────────────────┐
│   Build App      │───▶│  Smoke Tests     │───▶│ Regression Tests │
│   (APK/IPA)      │    │  (5-10 min)      │    │  (30-60 min)     │
└──────────────────┘    └──────────────────┘    └──────────────────┘
                                │                        │
                                ▼                        ▼
                        ┌──────────────────┐    ┌──────────────────┐
                        │ Block Merge if   │    │ Nightly on Full  │
                        │ Smoke Fails      │    │ Device Matrix    │
                        └──────────────────┘    └──────────────────┘
```

- **PR Checks**: Run smoke tests on Android emulator + iOS simulator
- **Merge to Main**: Full regression suite
- **Nightly**: Cross-device matrix (multiple OS versions, screen sizes)
- **Reports**: Allure reports archived as CI artifacts

### Biggest Risks in Mobile Automation

| Risk | Mitigation |
|------|------------|
| **Flaky Tests** | Explicit waits, retry mechanisms, stable locators (accessibility IDs) |
| **Emulator/Simulator Instability** | Health checks before test runs, fresh instances |
| **App Version Drift** | Pin app versions in config, defined update cycle |
| **Locator Changes** | Use accessibility IDs, abstract locators in page objects |
| **CI Infrastructure Cost** | Prioritize smoke tests, run full suite nightly only |
| **Platform Divergence** | Platform-specific page object sections, shared test logic |
| **Real Device Management** | Cloud device farms (BrowserStack, Sauce Labs, AWS Device Farm) |

---

## Project Structure

```
MobileApp/
├── apps/                          # Mobile app binaries
│   ├── android/
│   │   └── mda-2.0.1-22.apk      # Sauce Labs Demo App APK
│   └── ios/
│       └── SauceLabs-Demo-App.app # Sauce Labs Demo App
├── config/
│   ├── device.config.ts           # Device & Appium configurations  
│   └── test-data.config.ts        # Test users, products, constants
├── helpers/
│   ├── allure.helper.ts           # Allure reporting integration
│   └── mobile.helper.ts           # Custom gestures (swipe, pinch, etc.)
├── pages/
│   ├── base.page.ts               # Abstract base page class
│   ├── login.page.ts              # Login screen page object
│   ├── products.page.ts           # Product catalog page object
│   ├── product-details.page.ts    # Product detail page object
│   ├── cart.page.ts               # Shopping cart page object
│   └── checkout.page.ts           # Checkout flow page object
├── tests/
│   ├── login_test.ts              # Login scenarios
│   ├── shopping_flow_test.ts      # E2E shopping journey (includes complete checkout)
│   ├── edge_cases_test.ts         # Orientation, background/foreground
│   └── app_lifecycle_test.ts      # App installation & lifecycle
├── output/                        # Test outputs
│   ├── allure-results/
│   ├── reports/
│   └── step-screenshots/
├── .github/workflows/             # CI/CD pipeline definitions
│   └── mobile-tests.yml
├── codecept.conf.ts               # CodeceptJS configuration
├── package.json
└── tsconfig.json
```

---

## Quick Start

### Prerequisites

1. **Node.js** (v18 or higher)
2. **Java JDK** (v11 or higher)
3. **Appium** (v2.x)
4. **Android Studio** (for Android testing)
5. **Xcode** (for iOS testing - macOS only)

### Installation

```bash
# 1. Clone and install dependencies
git clone https://github.com/snjsinghqa/MOBILEAPP.git
cd MobileApp
npm install

# 2. Install Appium and drivers globally
npm install -g appium
appium driver install uiautomator2
appium driver install xcuitest  # macOS only

# 3. Download Sauce Labs Demo App
# Android: https://github.com/saucelabs/my-demo-app-android/releases
# iOS: https://github.com/saucelabs/my-demo-app-ios/releases
# Place APK in: apps/android/
# Place .app in: apps/ios/

# 4. Configure environment (optional)
cp .env.example .env
# Edit .env with your device configurations
```

### Verify Setup

```bash
# Check Appium installation
appium --version

# Verify Android setup
adb devices
emulator -list-avds

# Verify iOS setup (macOS only)
xcrun simctl list devices
```

---

## Automatic Device & Appium Management

### Overview

The framework includes **intelligent auto-start capabilities** that automatically detect and start required components:

[YES] **Android Emulator**: Detects if emulator is running, starts it automatically if needed  
[YES] **iOS Simulator**: Detects if simulator is running, boots it automatically if needed  
[YES] **Appium Server**: Checks if Appium is running on platform-specific port, starts it if needed  
[YES] **Smart Port Assignment**: Android uses port **4723**, iOS uses port **4724** (automatic)  
[YES] **Smart Detection**: Only starts components that aren't already running  
[YES] **Zero Manual Setup**: Just run tests - framework handles the rest

### Platform-Specific Appium Ports

The framework automatically assigns different Appium ports based on the platform:

| Platform | Port | Auto-Assigned |
|----------|------|---------------|
| **Android** | 4723 | Yes |
| **iOS** | 4724 | Yes |
| **Custom** | `$APPIUM_PORT` | Manual override |

**Why Different Ports?**
- Enables **parallel test execution** (run Android + iOS tests simultaneously)
- Prevents port conflicts when testing both platforms
- Follows Appium best practices for multi-platform setups

**Port Selection Logic:**
```bash
# Android tests automatically use port 4723
PLATFORM=android npm run test:android:emulator
# → Appium starts on port 4723

# iOS tests automatically use port 4724
PLATFORM=ios npm run test:ios:simulator
# → Appium starts on port 4724

# Manual override for both platforms
APPIUM_PORT=5000 PLATFORM=android npm run test:android:emulator
# → Appium starts on port 5000
```

### How It Works

**Before Every Test Run:**

1. **Platform Detection**
   - Reads `PLATFORM` environment variable (android/ios)
   - Automatically assigns Appium port: **4723 for Android**, **4724 for iOS**
   - Loads platform-specific device configuration

2. **Device Check Phase**
   - For `DEVICE_TYPE=emulator`: Checks if Android emulator is running via `adb devices`
   - For `DEVICE_TYPE=simulator`: Checks if iOS simulator is booted via `xcrun simctl list`
   - If not running → Automatically finds and starts the first available device
   - If already running → Skips startup and continues
   - For `DEVICE_TYPE=real`: Skips auto-start (assumes device is manually connected)

3. **Appium Check Phase**
   - Checks if Appium server is listening on **platform-specific port**
     - Android: port 4723
     - iOS: port 4724
   - If not running → Starts Appium server on correct port for the platform
   - If already running → Uses existing Appium instance

4. **Ready State**
   - Waits for device to be fully booted (system ready)
   - Android: Checks `sys.boot_completed` property
   - iOS: Waits 15 seconds for simulator stabilization
   - Waits for Appium to accept connections
   - Proceeds with test execution

### Console Output Example

**Android Test Run:**
```
========================================
  Mobile Automation Test Session Start
========================================
Platform: Android
Device Type: emulator
Appium Port: 4723 (Android default)
Auto Appium Management: Enabled

[INFO]  Port Assignment: Android uses 4723, iOS uses 4724 (automatic)

--- Device Check ---
[WARNING] Android emulator not detected
Starting Android emulator...
Found AVD: Medium_Phone_API_36.0
Starting emulator (this may take 30-60 seconds)...
Waiting for emulator to boot...
Emulator detected, waiting for system to be ready...
[OK] Emulator is ready

--- Appium Check ---
[WARNING] Appium server not detected on port 4723
Starting Appium for Android platform...
Starting Appium server on port 4723 for Android...
Appium server started successfully on port 4723
[OK] Appium ready

--- Cleanup ---
Cleaning previous Allure results...
[OK] Cleared 7 files from allure-results
[OK] Cleared previous Allure report

--- Test Environment Ready ---
========================================
```

**iOS Test Run:**
```
========================================
  Mobile Automation Test Session Start
========================================
Platform: iOS
Device Type: simulator
Appium Port: 4724 (iOS default)
Auto Appium Management: Enabled

[INFO]  Port Assignment: Android uses 4723, iOS uses 4724 (automatic)

--- Device Check ---
[OK] iOS simulator is already running

--- Appium Check ---
[WARNING] Appium server not detected on port 4724
Starting Appium for iOS platform...
Starting Appium server on port 4724 for iOS...
Appium server started successfully on port 4724
[OK] Appium ready

--- Test Environment Ready ---
========================================
```

### Manual Control

If you prefer to manage Appium manually (e.g., for custom configuration):

```bash
# Disable auto-start (you must start Appium manually on correct port)
AUTO_APPIUM=false PLATFORM=android npm run test:android:emulator
# Expects Appium running on port 4723

AUTO_APPIUM=false PLATFORM=ios npm run test:ios:simulator
# Expects Appium running on port 4724

# Start Appium manually for Android
appium --base-path /wd/hub --port 4723 --relaxed-security

# Start Appium manually for iOS
appium --base-path /wd/hub --port 4724 --relaxed-security

# Run parallel tests (Android + iOS simultaneously)
# Terminal 1: Start Android Appium
appium --base-path /wd/hub --port 4723 &
# Terminal 2: Start iOS Appium
appium --base-path /wd/hub --port 4724 &
# Terminal 3: Run Android tests
AUTO_APPIUM=false PLATFORM=android npm run test:android:emulator &
# Terminal 4: Run iOS tests
AUTO_APPIUM=false PLATFORM=ios npm run test:ios:simulator &
```

### Benefits

| Feature | Benefit |
|---------|---------|
| **Zero Setup** | No need to remember to start emulator/Appium |
| **Platform-Specific Ports** | Android (4723) and iOS (4724) run without conflicts |
| **Parallel Execution** | Run Android + iOS tests simultaneously |
| **CI/CD Ready** | Tests start all dependencies automatically in CI environments |
| **Developer Friendly** | Just run tests - framework does the heavy lifting |
| **Smart Detection** | Won't create duplicate instances if already running |
| **Cross-Platform** | Same auto-start behavior for Android emulator and iOS simulator |

### Notes

- **Port Assignment**: Automatic based on platform (Android: 4723, iOS: 4724)
- **First Boot Time**: Android emulator first boot can take 60-90 seconds, iOS simulator ~15 seconds
- **Subsequent Runs**: If emulator/simulator stays running, tests start immediately
- **Real Devices**: Auto-start is skipped for `DEVICE_TYPE=real` (manual connection required)
- **Port Conflicts**: If port is in use, framework assumes Appium is running and continues
- **Parallel Testing**: Different ports enable true parallel execution across platforms
- **Custom Ports**: Use `APPIUM_PORT` environment variable to override default port selection

---

## Running Tests

### Quick Test Commands

```bash
# AUTOMATIC MODE (Recommended - auto-starts device and Appium)
# The framework automatically checks and starts:
# 1. Android emulator / iOS simulator (if not running)
# 2. Appium server (if not running)

# Android Emulator - All tests with auto-start
npm run test:android:emulator

# iOS Simulator - All tests with auto-start  
npm run test:ios:simulator

# Run all tests directly - framework handles device/Appium startup
PLATFORM=android DEVICE_TYPE=emulator npx codeceptjs run 'tests/*_test.ts' --steps
PLATFORM=ios DEVICE_TYPE=simulator npx codeceptjs run 'tests/*_test.ts' --steps

# MANUAL MODE (if you prefer to manage device/Appium yourself)
# Start prerequisites (if not already running)
# 1. Start Appium server
appium --base-path /wd/hub --port 4723

# 2a. Start Android emulator (in a new terminal)
$ANDROID_HOME/emulator/emulator -avd Medium_Phone_API_36.0

# 2b. Start iOS simulator (macOS only)
xcrun simctl boot "iPhone 17 Pro" && open -a Simulator

# 3. Verify devices are running
adb devices                                    # For Android
xcrun simctl list devices | grep "Booted"     # For iOS

# Kill devices when done
adb -s emulator-5554 emu kill                  # Kill Android emulator
xcrun simctl shutdown "iPhone 17 Pro"         # Shutdown iOS simulator
xcrun simctl shutdown all                      # Shutdown all iOS simulators

# Run specific test file
PLATFORM=android DEVICE_TYPE=emulator npx codeceptjs run tests/login_test.ts --steps

PLATFORM=ios DEVICE_TYPE=simulator npx codeceptjs run tests/shopping_flow_test.ts --steps

# Run by tag
PLATFORM=android DEVICE_TYPE=emulator npx codeceptjs run 'tests/*_test.ts' --grep @smoke --steps

PLATFORM=ios DEVICE_TYPE=simulator npx codeceptjs run 'tests/*_test.ts' --grep @login --steps

# Run logout tests
PLATFORM=android DEVICE_TYPE=emulator npx codeceptjs run tests/login_test.ts --grep @logout --steps

# Run discovery tests (for locator identification)
PLATFORM=android DEVICE_TYPE=emulator npx codeceptjs run tests/logout_discovery_test.ts --steps

# Run complete E2E test with full checkout flow
PLATFORM=android DEVICE_TYPE=emulator npx codeceptjs run tests/shopping_flow_test.ts --grep @e2e-complete --steps

# Clean reports before running tests (optional - done automatically)
npm run allure:clean && PLATFORM=android DEVICE_TYPE=emulator npx codeceptjs run 'tests/*_test.ts' --steps
```

### Available NPM Scripts

| Command | Description |
|---------|-------------|
| `npm run test:android:emulator` | Run all tests on Android emulator |
| `npm run test:android:real` | Run all tests on Android real device |
| `npm run test:ios:simulator` | Run all tests on iOS simulator |
| `npm run test:ios:real` | Run all tests on iOS real device |
| `npm run test:parallel` | Run Android and iOS tests in parallel |
| `npm run test:login` | Run login tests only |
| `npm run allure:report` | Generate and open Allure report |
| `npm run allure:generate` | Generate Allure report without opening |
| `npm run allure:open` | Open existing Allure report |
| `npm run allure:clean` | Remove old Allure results and reports |
| `npm run clean:reports` | Remove only Mochawesome reports |
| `npm run clean:screenshots` | Remove only step screenshots |
| `npm run clean:all` | Remove all test outputs (reports, screenshots, allure) |
| `npm run appium:start` | Start Appium server on default port (4723) |
| `npm run appium:start:parallel` | Start Appium on ports 4723 and 4724 for parallel tests |
| `npm run test:report` | Open latest Mochawesome HTML report |

### Quick Commands

```bash
# View latest test report
open output/reports/test-report_*.html

# View step screenshots
ls -lh output/*.png

# View Allure report
npm run allure:open

# Check Appium status
lsof -ti:4723

# Stop Appium servers
pkill -f appium
```

### Test Tags

| Tag | Description |
|-----|-------------|
| `@smoke` | Quick sanity tests (run on every PR) |
| `@regression` | Full regression suite |
| `@login` | Login/authentication tests |
| `@logout` | Logout functionality tests |
| `@shopping` | Shopping flow tests |
| `@cart` | Cart operations |
| `@checkout` | Checkout flow |
| `@e2e-complete` | Complete end-to-end test with full checkout |
| `@edge-case` | Edge cases and error scenarios |
| `@negative` | Negative test cases |
| `@discovery` | Locator discovery and debugging tests |
| `@security` | Security validation tests |
| `@lifecycle` | App installation and lifecycle tests |

### Test Coverage Categories

#### 1. Login
- **Successful login**: Valid credentials authenticate user successfully
- **Failed login**: Invalid credentials show appropriate error messages

#### 2. Core User Flow
- **Browse products**: Navigate product catalog and view product details
- **Add product(s) to cart**: Select items and add them to shopping cart
- **Complete checkout**: Fill shipping/payment information and place order
- **Verify success confirmation**: Confirm order placement and completion message

#### 3. Negative and Edge Cases
- **Network interruption**: Handle connectivity issues during transactions
- **App restart during flow**: Preserve cart state and user session
- **Orientation change**: UI adapts correctly to portrait/landscape modes
- **Background/foreground behavior**: App state management when switching apps

### Test Coverage Mapping

Below is the mapping of test coverage categories to actual implemented test scenarios:

#### 1. Login Tests (`tests/login_test.ts`)
**Successful Login:**
- [OK] Login with valid credentials - bob@example.com (`@smoke`, `@login`)
- [OK] Login with visual user credentials - visual@example.com (`@login`)
- [OK] Verify login page elements are displayed correctly (`@login`, `@ui`)

**Failed Login:**
- [OK] SECURITY: App should NOT allow login with random invalid credentials (`@security`, `@negative`, `@critical`)
- [OK] SECURITY: App should NOT allow login with wrong password (`@security`, `@negative`, `@critical`)
- [OK] SECURITY: App should NOT allow login with non-existent user (`@security`, `@negative`, `@critical`)
- [OK] Login with empty username shows validation error (`@login`, `@negative`, `@validation`)
- [OK] Login with empty fields shows validation error (`@login`, `@negative`, `@validation`)

**Logout Tests:**
- [OK] Successful logout after login (`@smoke`, `@login`, `@logout`, `@regression`)
- ○ Verify user session cleared after logout (`@login`, `@logout`, `@session`) - Pending

#### 2. Core User Flow Tests (`tests/shopping_flow_test.ts`)
**Browse Products:**
- [OK] Browse products and sort by price low to high (`@shopping`, `@products`)
- [OK] View product details with all information (`@shopping`, `@products`)

**Add Product(s) to Cart:**
- [OK] Add multiple products to cart and verify total (`@shopping`, `@cart`)
- [OK] Add product with quantity of 3 to cart (`@shopping`, `@cart`)
- [OK] Update item quantity in cart (`@shopping`, `@cart`)

**Complete Checkout:**
- [OK] Complete E2E shopping flow with German address (`@e2e-complete`, `@smoke`, `@shopping`)
- [OK] Complete E2E shopping flow with US address (`@smoke`, `@shopping`, `@e2e`)
- [OK] Remove item from cart (`@shopping`, `@cart`)
- [OK] Cannot checkout with empty cart (`@shopping`, `@cart`, `@negative`)

**Verify Success Confirmation:**
- [OK] Order completion verification included in E2E tests above

#### 3. Negative and Edge Cases Tests (`tests/edge_cases_test.ts`)
**Network Interruption:**
- [OK] App handles airplane mode during browse (`@edge-case`, `@network`, `@offline`)
- [OK] App handles network loss during checkout (`@edge-case`, `@network`, `@checkout`)

**App Restart During Flow:**
- [OK] App restart during product browsing preserves state (`@edge-case`, `@restart`, `@state-persistence`)
- [OK] App restart during checkout flow (`@edge-case`, `@restart`, `@checkout`)
- [OK] Login state persists after app restart (`@edge-case`, `@state-persistence`)

**Orientation Change:**
- [OK] App handles orientation change on Products page (`@edge-case`, `@orientation`)
- [OK] App handles orientation change during checkout form (`@edge-case`, `@orientation`, `@checkout`)

**Background/Foreground Behavior:**
- [OK] Cart persists after app goes to background and returns (`@edge-case`, `@background`)

**Additional Edge Cases:**
- [OK] Back navigation from product details to products (`@edge-case`, `@navigation`)
- [OK] Back navigation from cart to products (`@edge-case`, `@navigation`)
- [OK] Rapid add/remove items does not crash app (`@edge-case`, `@stress`)
- [OK] Checkout form validation with special characters (`@edge-case`, `@validation`)
- [OK] Checkout form validation with very long input (`@edge-case`, `@validation`)
- [OK] Products page scroll behavior (`@edge-case`, `@scroll`)

#### 4. App Lifecycle Tests (`tests/app_lifecycle_test.ts`)
- [OK] Verify app is installed and launches successfully (`@lifecycle`, `@installation`, `@smoke`)
- [OK] App uninstallation and reinstallation (`@lifecycle`, `@installation`)

**Test Coverage Summary:**
- **Total Test Scenarios**: 35+
- **Login Tests**: 8 scenarios (3 positive, 5 negative)
- **Shopping Flow Tests**: 10 scenarios
- **Edge Cases Tests**: 15 scenarios
- **Lifecycle Tests**: 2 scenarios

### Known Limitations and Issues

#### Test Execution Limitations

**1. Orientation Change Tests (Status: Failing)**
- **Issue**: Programmatic orientation changes fail on Android emulator
- **Error**: `Request failed with status code 400` when calling `setOrientation()`
- **Affected Tests**:
  - App handles orientation change on Products page
  - App handles orientation change during checkout form
- **Root Cause**: Emulator may not support runtime orientation changes or requires additional Appium capabilities
- **Workaround**: Manual orientation testing using emulator controls (Ctrl+Left/Right)
- **Recommendation**: Test on real devices where orientation API is fully supported

**2. Login Menu Locator Issues**
- **Issue**: Login menu item locator `~menu item log in` intermittently not found
- **Impact**: Affects tests that require login after opening menu
- **Status**: Under investigation - may be timing-related or locator needs update

**3. Network Manipulation (Android)**
- **Limitation**: Network connectivity toggling requires `--relaxed-security` flag on Appium server
- **Setup Required**: Start Appium with: `appium --base-path /wd/hub --relaxed-security`
- **Platform Support**: Limited on iOS - requires different approach

**4. Background/Foreground State**
- **Limitation**: Cart persistence after backgrounding depends on app implementation
- **Behavior**: May vary between app versions and platforms
- **Note**: Tests capture actual behavior rather than enforcing expected behavior

#### App-Specific Limitations (Sauce Labs Demo App)

**1. Authentication**
- **No Server Validation**: App only performs client-side validation for empty fields
- **Security Note**: Invalid credentials (random username/password) may be accepted in some app versions
- **Test Coverage**: Security tests document this behavior and flag potential bugs

**2. Checkout Flow**
- **Card Validation**: Dummy card details accepted without server-side validation
- **Locator Stability**: Review Order button occasionally requires scrolling to become visible
- **Retry Logic**: Implemented 3-attempt retry mechanism to handle scroll timing issues

**3. Orientation Support**
- **Emulator Limitation**: Programmatic orientation changes not fully supported
- **Test Status**: Orientation tests documented but marked as device-dependent
- **Alternative**: Manual testing or real device execution required

**4. App State Persistence**
- **Cart Data**: May or may not persist after app restart (implementation-dependent)
- **Login Session**: Session persistence varies by platform and app version
- **Test Approach**: Tests document actual behavior rather than assume persistence

#### Testing Environment Requirements

**1. Appium Server Configuration**
- Network tests require: `--relaxed-security` flag
- Default timeout: 300 seconds (configurable in device.config.ts)
- Port requirements: 4723 (Android), 4724 (iOS for parallel runs)

**2. Emulator/Simulator Setup**
- **Android**: API 33+ recommended, x86_64 architecture
- **iOS**: Xcode 15+ with iOS 17.2 simulator
- **Hardware Acceleration**: Required for stable test execution
- **Disk Space**: Minimum 10GB free for emulator images and logs

**3. Platform-Specific Notes**
- **Android**: adb must be in PATH, USB debugging enabled for real devices
- **iOS (macOS only)**: Xcode Command Line Tools required
- **Real Devices**: Additional driver installation and device permissions needed

#### CI/CD Considerations

**1. Execution Time**
- Smoke tests: 5-10 minutes (recommended for PR checks)
- Full regression: 30-60 minutes (nightly builds)
- Orientation tests: Skip in CI due to emulator limitations

**2. Flakiness Factors**
- Network-dependent tests may be unstable in CI environments
- Emulator startup time varies (add health checks)
- Parallel execution requires separate Appium ports and device instances

**3. Recommended CI Strategy**
- **PR Checks**: Smoke tests only (`@smoke` tag)
- **Merge to Main**: Core user flows (`@login`, `@shopping`)
- **Nightly**: Full suite excluding orientation tests
- **Weekly**: Manual orientation testing on real devices

### Key Test Scenarios

#### Complete E2E Shopping Flow (`@e2e-complete`)
A comprehensive end-to-end test covering the entire shopping journey:

1. **Browse** and select a product
2. **Add to cart** and verify cart count
3. **Proceed to checkout** (triggers login prompt)
4. **Login** with valid credentials when prompted
5. **Fill shipping information**:
   - Full Name: Sanjay Singh Panwar
   - Address: EisenStr. 62, Düsseldorf
   - City: Düsseldorf, State: NRW
   - Zip: 40227, Country: Deutschland
6. **Enter payment details** (dummy card)
7. **Review order** page with product verification
8. **Place order** and verify completion
9. **Continue shopping**

```bash
# Run the complete E2E test
PLATFORM=android DEVICE_TYPE=emulator npx codeceptjs run tests/shopping_flow_test.ts --grep @e2e-complete --steps
```

---

## Test Architecture

### Page Object Model

All screen interactions are encapsulated in page objects:

```typescript
// pages/products.page.ts
import { BasePage } from './base.page';

class ProductsPage extends BasePage {
  // Platform-specific locators
  private locators = {
    productItem: {
      android: '~store item',
      ios: '~store item',
    },
    addToCartButton: {
      android: '~Add To Cart button', 
      ios: '~Add To Cart button',
    },
  };

  // Getter with platform detection
  get productItem() {
    return this.getLocator(
      this.locators.productItem.android,
      this.locators.productItem.ios
    );
  }

  // Action methods
  async selectFirstProduct() {
    await this.tap(this.productItem);
  }
}
```

### Locator Strategy (Priority Order)

1. **Accessibility ID** (`~id`) - Most stable, cross-platform
2. **Resource ID** (`#id`) - Android only, reliable
3. **iOS Predicate String** - iOS native, fast
4. **XPath** - Last resort, fragile

### Synchronization

```typescript
// Good - Explicit waits
await this.waitForElement(this.addToCartButton, 10);
await this.waitForVisible(this.successMessage, 5);

// Bad - Arbitrary sleeps
await I.wait(5); // Avoid this
```

---

## CI/CD Integration

### GitHub Actions Example

The framework includes a ready-to-use GitHub Actions workflow at `.github/workflows/mobile-tests.yml`:

```yaml
name: Mobile Tests

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main]

jobs:
  android-tests:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Setup Java
        uses: actions/setup-java@v4
        with:
          java-version: '17'
          distribution: 'temurin'
      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'
      - name: Install dependencies
        run: npm ci
      - name: Start Android emulator
        uses: reactivecircus/android-emulator-runner@v2
        with:
          api-level: 33
          script: npm run test:android:emulator
      - name: Upload Allure results
        uses: actions/upload-artifact@v4
        with:
          name: allure-results
          path: output/allure-results
```

### Device Matrix Proposal

| OS | Version | Device | Use Case |
|----|---------|--------|----------|
| Android | 13 (API 33) | Pixel 6 | Modern flagship |
| Android | 11 (API 30) | Pixel 4 | Market coverage |
| Android | 10 (API 29) | Samsung Galaxy S10 | Samsung-specific |
| iOS | 17.x | iPhone 15 Pro | Latest |
| iOS | 16.x | iPhone 14 | Previous gen |
| iOS | 15.x | iPhone SE | Small screen |

---

## Reporting

### Allure Reports

Allure results are **automatically cleaned** before each test execution to ensure fresh reports.

```bash
# Generate and view report
npm run allure:report

# Just generate
npm run allure:generate

# Serve existing report  
npm run allure:open

# Manual cleanup (optional - done automatically before tests)
npm run allure:clean
```

**Automatic Cleanup:**
- [PASS] Allure results directory cleared before every test run
- [PASS] Previous report directory removed automatically
- [PASS] Only latest test execution results are preserved
- [PASS] No manual cleanup needed between test runs

### Mochawesome Reports

HTML reports are automatically generated in `output/reports/`.

### Screenshots

The framework automatically captures screenshots for comprehensive test documentation:

#### Automatic Step Screenshots
- **Enabled by default**: Screenshots are captured after every test step
- **Location**: `output/*.png` (root output directory)
- **Naming**: `step_<number>_<action>.png` (e.g., `step_5_tap.png`)
- **Purpose**: Visual documentation of each test action for debugging and reporting

#### Failure Screenshots
- **Auto-capture on failure**: Automatically saves screenshot when test fails
- **Format**: `<test_name>.failed.png`
- **Purpose**: Quick identification of failure state

#### Manual Screenshots  
```typescript
// Capture custom screenshot in test
await I.saveScreenshot('custom_screenshot_name.png');
```

#### Screenshot Integration

**Allure Reports**:
- Step screenshots are automatically attached to each test step
- View detailed step-by-step visual flow in timeline view
- Screenshots grouped by test execution

**Mochawesome Reports**:
- Test steps are listed with pass/fail indicators
- Screenshot directory information included in test context
- Screenshots linked in the report for easy access

#### Screenshot Configuration

Control screenshot behavior in [codecept.conf.ts](codecept.conf.ts):

```typescript
stepByStepReport: {
  enabled: true,              // Enable step screenshots
  deleteSuccessful: false,    // Keep screenshots for passed tests
  screenshotsForAllureReport: true,  // Attach to Allure
  output: './output/step-screenshots',
  fullPageScreenshots: false,
  ignoreSteps: [              // Skip screenshots for these steps
    'wait',
    'waitForElement', 
    'waitForVisible',
  ],
}
```

#### Viewing Screenshots

```bash
# View step screenshots directory
ls -lh output/*.png

# Open latest test report with screenshots
open output/reports/test-report_*.html

# View Allure report with step screenshots
npm run allure:report
```

---

## Configuration

### Environment Variables

Create a `.env` file based on `.env.example`:

```env
# Android Emulator
ANDROID_EMU_DEVICE_NAME=Pixel_6_API_33
ANDROID_EMU_PLATFORM_VERSION=13.0
ANDROID_EMU_APP_PATH=./apps/android/mda-2.0.1-22.apk
ANDROID_EMU_APP_PACKAGE=com.saucelabs.mydemoapp.rn
ANDROID_EMU_APP_ACTIVITY=com.saucelabs.mydemoapp.rn.MainActivity

# iOS Simulator  
IOS_SIM_DEVICE_NAME=iPhone 15 Pro
IOS_SIM_PLATFORM_VERSION=17.0
IOS_SIM_APP_PATH=./apps/ios/SauceLabs-Demo-App.app
IOS_SIM_BUNDLE_ID=com.saucelabs.mydemoapp.rn
```

### Test Users (Sauce Labs Demo App)

| Username | Password | Behavior |
|----------|----------|----------|
| `bob@example.com` | `10203040` | Standard user |
| `alice@example.com` | `10203040` | Standard user |
| `locked@example.com` | `10203040` | Locked out user |
| (empty username) | (any) | Shows validation error |
| (any username) | (wrong password) | Shows error message |

---

## Troubleshooting

### Common Issues

**Appium server not starting:**
```bash
# Check if port is in use
lsof -i :4723
# Kill existing process
kill -9 <PID>
```

**Clean old test reports and results:**

> **Note:** Allure results are automatically cleaned before each test run. Manual cleanup is only needed for other report types or when disk space is limited.

```bash
# Allure reports (auto-cleaned, but available manually)
npm run allure:clean

# Remove all test outputs (reports, screenshots, allure)
npm run clean:all

# Remove only Mochawesome reports
npm run clean:reports

# Remove only screenshots
npm run clean:screenshots

# Manual cleanup of everything
rm -rf allure-results/* output/*
```

**Android emulator not found:**
```bash
# List available emulators
$ANDROID_HOME/emulator/emulator -list-avds

# Start an existing emulator (use name from list above)
$ANDROID_HOME/emulator/emulator -avd Medium_Phone_API_36.0

# Create new emulator (if needed)
$ANDROID_HOME/cmdline-tools/latest/bin/avdmanager create avd -n My_Pixel_6_API_33 -k "system-images;android-33;google_apis;x86_64"

# Start the newly created emulator
$ANDROID_HOME/emulator/emulator -avd My_Pixel_6_API_33
```

**Kill Android emulator:**
```bash
# Find emulator device ID
adb devices
# Kill specific emulator
adb -s emulator-5554 emu kill
# Or kill all emulator processes
pkill -9 qemu-system-x86_64
```

**iOS simulator not found:**
```bash
# List available simulators
xcrun simctl list devices available
# Boot a simulator
xcrun simctl boot "iPhone 17 Pro"

# Run the simulator
open -a Simulator
```

**Kill iOS simulator:**
```bash
# Shutdown specific simulator
xcrun simctl shutdown "iPhone 17 Pro"
# Shutdown all simulators
xcrun simctl shutdown all
# Force kill Simulator app
pkill -9 Simulator
```

**Tests timing out:**
- Increase `newCommandTimeout` in device config
- Check network connectivity to Appium server
- Verify app is installed correctly

---

## Resources

- [Sauce Labs Demo App (Android)](https://github.com/saucelabs/my-demo-app-android)
- [Sauce Labs Demo App (iOS)](https://github.com/saucelabs/my-demo-app-ios)
- [CodeceptJS Documentation](https://codecept.io/)
- [Appium 2.x Documentation](https://appium.io/docs/en/2.0/)
- [Allure Reports](https://docs.qameta.io/allure/)

---

## License

ISC

**Created by:** Sanjay Singh Panwar
