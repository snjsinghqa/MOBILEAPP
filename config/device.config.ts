import * as dotenv from 'dotenv';

// Load .env file but don't override existing env vars (cross-env sets them first)
dotenv.config();

/**
 * Environment-specific configuration for mobile automation
 * @author Sanjay Singh Panwar
 */
interface DeviceConfig {
  deviceName: string;
  platformVersion: string;
  udid?: string;
  app?: string;
  appPackage?: string;
  appActivity?: string;
  bundleId?: string;
  automationName: string;
  noReset?: boolean;
  fullReset?: boolean;
  newCommandTimeout?: number;
}

interface AppiumConfig {
  host: string;
  port: number;
  path: string;
}

// Appium Server Config
// For parallel execution, Android uses port 4723 and iOS uses port 4724
// The port is determined at runtime based on PLATFORM or APPIUM_PORT env var
let cachedPort: number | null = null;

const getAppiumPort = (): number => {
  // Return cached port if already calculated
  if (cachedPort !== null) {
    return cachedPort;
  }
  
  // Check explicit APPIUM_PORT first
  if (process.env.APPIUM_PORT) {
    cachedPort = parseInt(process.env.APPIUM_PORT);
    return cachedPort;
  }
  
  // Then check PLATFORM for auto-assignment
  const platform = process.env.PLATFORM;
  
  if (platform && platform.toLowerCase() === 'ios') {
    cachedPort = 4724;
    return 4724;
  }
  
  // Default to Android port
  cachedPort = 4723;
  return 4723;
};

export const appiumConfig: AppiumConfig = {
  host: process.env.APPIUM_HOST || '127.0.0.1',
  get port(): number {
    return getAppiumPort();
  },
  path: process.env.APPIUM_PATH || '/wd/hub',
};

// Android Emulator Configuration
export const androidEmulatorConfig: DeviceConfig = {
  deviceName: process.env.ANDROID_EMU_DEVICE_NAME || 'Medium_Phone_API_36.0',
  platformVersion: process.env.ANDROID_EMU_PLATFORM_VERSION || '16.0',
  app: process.env.ANDROID_EMU_APP_PATH || './apps/android/mda-2.2.0-25.apk',
  appPackage: process.env.ANDROID_EMU_APP_PACKAGE || 'com.saucelabs.mydemoapp.android',
  appActivity: process.env.ANDROID_EMU_APP_ACTIVITY || 'com.saucelabs.mydemoapp.android.view.activities.SplashActivity',
  automationName: 'UiAutomator2',
  noReset: false,
  fullReset: false,
  newCommandTimeout: 300,
};

// Android Real Device Configuration
export const androidRealDeviceConfig: DeviceConfig = {
  deviceName: process.env.ANDROID_REAL_DEVICE_NAME || 'Android Device',
  platformVersion: process.env.ANDROID_REAL_PLATFORM_VERSION || '13.0',
  udid: process.env.ANDROID_REAL_UDID,
  app: process.env.ANDROID_REAL_APP_PATH || './apps/android/mda-2.2.0-25.apk',
  appPackage: process.env.ANDROID_REAL_APP_PACKAGE || 'com.saucelabs.mydemoapp.android',
  appActivity: process.env.ANDROID_REAL_APP_ACTIVITY || 'com.saucelabs.mydemoapp.android.view.activities.SplashActivity',
  automationName: 'UiAutomator2',
  noReset: true,
  newCommandTimeout: 300,
};

// iOS Simulator Configuration
export const iOSSimulatorConfig: DeviceConfig = {
  deviceName: process.env.IOS_SIM_DEVICE_NAME || 'iPhone 15 Pro',
  platformVersion: process.env.IOS_SIM_PLATFORM_VERSION || '17.2',
  app: process.env.IOS_SIM_APP_PATH || './apps/ios/SauceLabs-Demo-App.app',
  bundleId: process.env.IOS_SIM_BUNDLE_ID || 'com.saucelabs.mydemo.app.ios',
  automationName: 'XCUITest',
  noReset: false,
  newCommandTimeout: 300,
};

// iOS Real Device Configuration
export const iOSRealDeviceConfig: DeviceConfig = {
  deviceName: process.env.IOS_REAL_DEVICE_NAME || 'iPhone',
  platformVersion: process.env.IOS_REAL_PLATFORM_VERSION || '17.0',
  udid: process.env.IOS_REAL_UDID,
  app: process.env.IOS_REAL_APP_PATH || './apps/ios/SauceLabs-Demo-App.ipa',
  bundleId: process.env.IOS_REAL_BUNDLE_ID || 'com.saucelabs.mydemo.app.ios',
  automationName: 'XCUITest',
  noReset: true,
  newCommandTimeout: 300,
};

// Test Configuration
export const testConfig = {
  implicitWait: parseInt(process.env.IMPLICIT_WAIT || '10000'),
  defaultTimeout: parseInt(process.env.DEFAULT_TIMEOUT || '30000'),
  screenshotOnFailure: process.env.SCREENSHOT_ON_FAILURE === 'true',
};

/**
 * Get device configuration based on platform and device type
 * @author Sanjay Singh Panwar
 */
export function getDeviceConfig(platform: string, deviceType: string): DeviceConfig {
  const key = `${platform.toLowerCase()}_${deviceType.toLowerCase()}`;
  
  switch (key) {
    case 'android_emulator':
      return androidEmulatorConfig;
    case 'android_real':
      return androidRealDeviceConfig;
    case 'ios_simulator':
      return iOSSimulatorConfig;
    case 'ios_real':
      return iOSRealDeviceConfig;
    default:
      return androidEmulatorConfig;
  }
}

/**
 * Get platform name based on platform type
 * @author Sanjay Singh Panwar
 */
export function getPlatformName(platform: string): string {
  return platform.toLowerCase() === 'ios' ? 'iOS' : 'Android';
}
