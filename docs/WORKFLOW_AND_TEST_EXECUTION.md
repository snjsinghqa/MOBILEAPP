# Mobile Automation Framework - Workflow & Test Execution Guide

**Author:** Sanjay Singh Panwar  
**Last Updated:** February 2026

---

## Table of Contents

1. [Framework Overview](#framework-overview)
2. [Project Structure](#project-structure)
3. [Prerequisites](#prerequisites)
4. [Setup & Installation](#setup--installation)
5. [Test Execution Workflow](#test-execution-workflow)
6. [Available Test Commands](#available-test-commands)
7. [Test Cases Overview](#test-cases-overview)
8. [Parallel Execution](#parallel-execution)
9. [BDD Testing](#bdd-testing)
10. [Reporting](#reporting)
11. [Troubleshooting](#troubleshooting)

---

## Framework Overview

This is a comprehensive mobile automation testing framework built with:

- **CodeceptJS** - BDD-style testing framework
- **Appium** - Mobile automation driver
- **TypeScript** - Type-safe test development
- **WebDriverIO** - WebDriver bindings
- **Allure** - Advanced test reporting
- **Mochawesome** - HTML test reports

### Supported Platforms

| Platform | Device Type | Port |
|----------|-------------|------|
| Android  | Emulator    | 4723 |
| Android  | Real Device | 4723 |
| iOS      | Simulator   | 4724 |
| iOS      | Real Device | 4724 |

---

## Project Structure

```
MobileApp/
├── apps/                          # Application binaries
│   ├── android/                   # Android APK files
│   └── ios/                       # iOS IPA files
├── config/
│   ├── device.config.ts           # Device configurations
│   └── test-data.config.ts        # Test data
├── features/                      # BDD feature files
│   ├── android/                   # Android-specific features
│   └── ios/                       # iOS-specific features
├── fragments/
│   └── navigation.fragment.ts     # Reusable UI components
├── helpers/
│   ├── allure.helper.ts           # Allure reporting helper
│   └── mobile.helper.ts           # Mobile gestures helper
├── pages/                         # Page Object Models
│   ├── base.page.ts               # Base page class
│   ├── home.page.ts               # Home page object
│   └── login.page.ts              # Login page object
├── step_definitions/              # BDD step definitions
│   ├── android_steps.js           # Android-specific steps
│   ├── common_steps.js            # Shared steps
│   └── ios_steps.js               # iOS-specific steps
├── tests/                         # Test files
│   ├── android_installation_launch_test.ts
│   ├── apidemos_test.ts
│   ├── gestures_test.ts
│   ├── home_test.ts
│   ├── ios_installation_launch_test.ts
│   ├── ios_settings_test.ts
│   └── login_test.ts
├── utils/
│   ├── locators.utils.ts          # Locator utilities
│   └── wait.utils.ts              # Wait utilities
├── output/                        # Test outputs
│   ├── allure-report/             # Allure HTML reports
│   ├── reports/                   # Mochawesome reports
│   └── step-screenshots/          # Step-by-step screenshots
├── codecept.conf.ts               # CodeceptJS configuration
├── package.json                   # Project dependencies
└── steps_file.ts                  # Custom actor methods
```

---

## Prerequisites

### Required Software

1. **Node.js** (v18+)
2. **npm** or **yarn**
3. **Appium** (v2.x)
4. **Java JDK** (for Android)
5. **Android Studio** (for Android emulators)
6. **Xcode** (for iOS simulators - macOS only)

### Environment Variables

Create a `.env` file in the project root:

```bash
# Platform Configuration
PLATFORM=android
DEVICE_TYPE=emulator

# Appium Configuration
APPIUM_HOST=127.0.0.1
APPIUM_PORT=4723
APPIUM_PATH=/wd/hub

# Android Emulator
ANDROID_EMU_DEVICE_NAME=Pixel_6_API_33
ANDROID_EMU_PLATFORM_VERSION=13.0
ANDROID_EMU_APP_PATH=./apps/android/app-debug.apk
ANDROID_EMU_APP_PACKAGE=com.example.app
ANDROID_EMU_APP_ACTIVITY=com.example.app.MainActivity

# iOS Simulator
IOS_SIM_DEVICE_NAME=iPhone 15 Pro
IOS_SIM_PLATFORM_VERSION=17.0
IOS_SIM_BUNDLE_ID=com.apple.Preferences

# Test Configuration
IMPLICIT_WAIT=10000
DEFAULT_TIMEOUT=30000
SCREENSHOT_ON_FAILURE=true
```

---

## Setup & Installation

### Step 1: Install Dependencies

```bash
npm install
```

### Step 2: Install Appium Drivers

```bash
# Install UiAutomator2 driver for Android
appium driver install uiautomator2

# Install XCUITest driver for iOS
appium driver install xcuitest
```

### Step 3: Verify Setup

```bash
# Check Appium doctor
npm run appium:doctor
```

### Step 4: Start Devices

**Android Emulator:**
```bash
# List available emulators
emulator -list-avds

# Start emulator
emulator -avd Pixel_6_API_33
```

**iOS Simulator:**
```bash
# Open Simulator app
open -a Simulator

# Or via xcrun
xcrun simctl boot "iPhone 15 Pro"
```

---

## Test Execution Workflow

### Standard Workflow

```
┌─────────────────────────────────────────────────────────────────┐
│                    TEST EXECUTION WORKFLOW                       │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│  1. ENVIRONMENT SETUP                                            │
│     • Start Android Emulator / iOS Simulator                     │
│     • Verify device is connected (adb devices / xcrun simctl)    │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│  2. START APPIUM SERVER                                          │
│     • npm run appium:start (single platform)                     │
│     • npm run appium:start:parallel (both platforms)             │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│  3. EXECUTE TESTS                                                │
│     • npm run test:android:emulator                              │
│     • npm run test:ios:simulator                                 │
│     • npm run test:parallel                                      │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│  4. VIEW REPORTS                                                 │
│     • npm run test:report (Mochawesome HTML)                     │
│     • npm run allure:report (Allure HTML)                        │
└─────────────────────────────────────────────────────────────────┘
```

### Quick Start Commands

```bash
# Single command to run Android tests (auto-starts Appium)
npm run test:android:emulator

# Single command to run iOS tests (auto-starts Appium)
npm run test:ios:simulator

# Run both platforms in parallel (requires manual Appium start)
npm run appium:start:parallel  # Terminal 1
npm run test:parallel          # Terminal 2
```

---

## Available Test Commands

### Platform-Specific Tests

| Command | Description |
|---------|-------------|
| `npm run test:android:emulator` | Run Android tests on emulator |
| `npm run test:android:real` | Run Android tests on real device |
| `npm run test:ios:simulator` | Run iOS tests on simulator |
| `npm run test:ios:real` | Run iOS tests on real device |

### Parallel Execution

| Command | Description |
|---------|-------------|
| `npm run test:parallel` | Run Android & iOS tests simultaneously |
| `npm run test:parallel:specific` | Run specific tests on both platforms |
| `npm run test:android:emulator:parallel` | Run Android tests with 3 workers |
| `npm run test:ios:simulator:parallel` | Run iOS tests with 3 workers |

### BDD Tests

| Command | Description |
|---------|-------------|
| `npm run test:bdd:android` | Run BDD feature files on Android |
| `npm run test:bdd:ios` | Run BDD feature files on iOS |
| `npm run test:bdd:parallel` | Run BDD tests on both platforms |

### Tagged Tests

```bash
# Run tests with specific tags
npm run test:android:tags -- "@smoke"
npm run test:ios:tags -- "@critical"

# Multiple tags
npm run test:android:tags -- "@smoke|@regression"
```

### Appium Server

| Command | Description |
|---------|-------------|
| `npm run appium:start` | Start Appium on default port |
| `npm run appium:start:android` | Start Appium for Android (port 4723) |
| `npm run appium:start:ios` | Start Appium for iOS (port 4724) |
| `npm run appium:start:parallel` | Start both Appium instances |

### Reporting

| Command | Description |
|---------|-------------|
| `npm run test:report` | Open Mochawesome HTML report |
| `npm run allure:generate` | Generate Allure report |
| `npm run allure:open` | Open Allure report |
| `npm run allure:report` | Generate and open Allure report |

---

## Test Cases Overview

### Android Tests

#### 1. Android Installation & Launch Tests
**File:** `tests/android_installation_launch_test.ts`

| Test Case | Tags | Description |
|-----------|------|-------------|
| Fresh Install | @critical @installation @android | Verify app installs successfully |
| App Launch | @critical @launch @android @performance | Verify app launches within acceptable time |
| Launch After Kill | @critical @launch @android @recovery | Verify app recovers after force close |
| Background/Foreground | @critical @launch @android @interruption | Verify app resumes from background |

#### 2. API Demos Tests
**File:** `tests/apidemos_test.ts`

| Test Case | Tags | Description |
|-----------|------|-------------|
| App Navigation | @smoke | Navigate through app sections |
| Element Interactions | @regression | Test element interactions |

### iOS Tests

#### 1. iOS Installation & Launch Tests
**File:** `tests/ios_installation_launch_test.ts`

| Test Case | Tags | Description |
|-----------|------|-------------|
| App Launch | @critical @launch @ios @performance | Verify app launches within acceptable time |
| Launch After Kill | @critical @launch @ios @recovery | Verify app recovers after force close |
| Background/Foreground | @critical @launch @ios @interruption | Verify app resumes from background |
| App Installation Verification | @critical @installation @ios | Verify app is installed |

#### 2. iOS Settings Tests
**File:** `tests/ios_settings_test.ts`

| Test Case | Tags | Description |
|-----------|------|-------------|
| Settings Navigation | @smoke | Navigate through Settings app |
| Settings Verification | @regression | Verify settings elements |

### Cross-Platform Tests

#### 1. Login Tests
**File:** `tests/login_test.ts`

| Test Case | Tags | Description |
|-----------|------|-------------|
| Verify login page elements | @smoke @login | Check login page displays correctly |
| Login with valid credentials | @smoke @login | Successful login flow |
| Login with invalid credentials | @negative @login | Error handling for invalid login |
| Login with empty fields | @negative @login | Validation for empty fields |
| Remember me functionality | @regression @login | Test remember me checkbox |
| Forgot password navigation | @regression @login | Navigate to forgot password |
| Social login buttons | @regression @login | Verify social login options |

#### 2. Home Tests
**File:** `tests/home_test.ts`

| Test Case | Tags | Description |
|-----------|------|-------------|
| Verify home page elements | @smoke @home | Check home page after login |
| Navigation between tabs | @smoke @navigation | Tab navigation functionality |
| Pull to refresh | @regression @home | Refresh content gesture |
| Search functionality | @regression @home | Search feature |
| Menu/drawer navigation | @regression @navigation | Side menu navigation |

#### 3. Gesture Tests
**File:** `tests/gestures_test.ts`

| Test Case | Tags | Description |
|-----------|------|-------------|
| Swipe gestures | @gestures @swipe | Swipe up/down gestures |
| Left and right swipe | @gestures @swipe | Horizontal swipe gestures |
| Long press gesture | @gestures @longpress | Long press functionality |
| Double tap gesture | @gestures @tap | Double tap functionality |
| Scroll to element | @gestures @scroll | Scroll until element visible |
| Pinch and zoom | @gestures @zoom | Zoom in/out gestures |

---

## Parallel Execution

### Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                     PARALLEL EXECUTION                           │
└─────────────────────────────────────────────────────────────────┘

     ┌─────────────────┐         ┌─────────────────┐
     │  Appium Server  │         │  Appium Server  │
     │   Port: 4723    │         │   Port: 4724    │
     │   (Android)     │         │   (iOS)         │
     └────────┬────────┘         └────────┬────────┘
              │                           │
              ▼                           ▼
     ┌─────────────────┐         ┌─────────────────┐
     │ Android Tests   │         │   iOS Tests     │
     │                 │         │                 │
     │ • Installation  │         │ • Installation  │
     │ • Launch        │         │ • Launch        │
     │ • API Demos     │         │ • Settings      │
     └────────┬────────┘         └────────┬────────┘
              │                           │
              └───────────┬───────────────┘
                          ▼
                ┌─────────────────┐
                │  Merged Report  │
                │                 │
                │ • Allure        │
                │ • Mochawesome   │
                └─────────────────┘
```

### Running Parallel Tests

```bash
# Step 1: Start Appium servers for both platforms
npm run appium:start:parallel

# Step 2: In another terminal, run parallel tests
npm run test:parallel
```

### Configuration for Parallel Execution

The framework automatically:
- Assigns port 4723 for Android
- Assigns port 4724 for iOS
- Sets `AUTO_APPIUM=false` to prevent conflicts
- Generates separate reports per platform

---

## BDD Testing

### Feature File Structure

```gherkin
# features/android/app_launch.feature
@android @launch
Feature: Android App Launch
  As a user
  I want to launch the Android app
  So that I can use its features

  Background:
    Given the Android app is installed on the device

  @smoke @critical
  Scenario: App launches successfully
    When I launch the app
    Then I should see the home screen
    And the app should load within 3 seconds

  @regression
  Scenario: App resumes from background
    Given the app is running
    When I send the app to background
    And I bring the app to foreground
    Then the app state should be preserved
```

### Running BDD Tests

```bash
# Run all Android BDD tests
npm run test:bdd:android

# Run with specific tags
npm run test:bdd:android:tags -- "@smoke"

# Run BDD tests on both platforms
npm run test:bdd:parallel
```

---

## Reporting

### Mochawesome Reports

Located at: `output/reports/test-report.html`

```bash
# Open the latest report
npm run test:report
```

### Allure Reports

Located at: `output/allure-report/`

```bash
# Generate and open Allure report
npm run allure:report

# Or separately:
npm run allure:generate  # Generate report
npm run allure:open      # Open in browser
```

### Report Contents

- **Test Summary** - Pass/Fail statistics
- **Test Details** - Step-by-step execution
- **Screenshots** - Captured on failure
- **Execution Time** - Performance metrics
- **Environment Info** - Platform, device details
- **Categories** - Grouped by features/tags

---

## Troubleshooting

### Common Issues

#### 1. "Could not find a connected Android device"

**Solution:**
```bash
# Check connected devices
adb devices

# Start emulator
emulator -avd <AVD_NAME>
```

#### 2. "Request failed with error code UND_ERR_HEADERS_TIMEOUT" (iOS)

**Solution:**
```bash
# Ensure simulator is running
open -a Simulator

# Or boot specific device
xcrun simctl boot "iPhone 15 Pro"
```

#### 3. "Appium server not running"

**Solution:**
```bash
# Start Appium server manually
npm run appium:start

# Or for parallel execution
npm run appium:start:parallel
```

#### 4. "Element not found"

**Solutions:**
- Increase wait timeout in `config/device.config.ts`
- Verify locator using Appium Inspector
- Check if element is within viewport (may need scroll)

#### 5. "Session creation failed"

**Solutions:**
```bash
# Kill existing Appium sessions
pkill -f appium

# Restart Appium
npm run appium:start
```

### Debug Mode

Run tests with verbose output:

```bash
# Enable debug logging
DEBUG=codeceptjs:* npm run test:android:emulator

# Dry run (check test discovery without execution)
npm run test:dry
```

### Useful Commands

```bash
# Check Appium doctor
npm run appium:doctor

# List Android devices
adb devices

# List iOS simulators
xcrun simctl list devices

# Kill Appium processes
pkill -f appium

# Clear Appium logs
rm -rf ~/.appium
```

---

## Best Practices

1. **Always verify device is running** before executing tests
2. **Use tags** to organize and filter tests
3. **Clean app state** between test runs with `fullReset: true`
4. **Take screenshots** at critical steps for debugging
5. **Use Page Object Model** for maintainable locators
6. **Implement waits** instead of hard-coded sleeps
7. **Run parallel tests** for faster execution
8. **Review reports** after each test run

---

## Contact

**Author:** Sanjay Singh Panwar

For issues or questions, please create an issue in the repository.
