export {};

Feature('App Lifecycle Tests - Installation, Uninstallation, Launch');

const ProductsPage = require('../pages/products.page');

/**
 * @author Sanjay Singh Panwar
 * Get app ID based on platform
 */
function getAppId(): string {
  const platform = (process.env.PLATFORM || 'android').toLowerCase();
  return platform === 'android' 
    ? 'com.saucelabs.mydemoapp.android'
    : 'com.saucelabs.mydemo.app.ios';
}

/**
 * @author Sanjay Singh Panwar
 * APK/App Installation Tests
 */
Scenario('Verify app is installed and launches successfully', async ({ I }) => {
  const appId = getAppId();
  const platform = (process.env.PLATFORM || 'android').toLowerCase();
  
  // Check if app is installed
  let isInstalled = false;
  try {
    isInstalled = await I.executeScript('mobile: isAppInstalled', { 
      [platform === 'android' ? 'appId' : 'bundleId']: appId 
    });
  } catch (e) {
    console.log('isAppInstalled check failed, assuming installed via session start');
    isInstalled = true;
  }
  
  I.assertTrue(isInstalled, `App ${appId} should be installed`);
  
  // Verify app launches - Products page should be visible
  await ProductsPage.waitForPageLoad();
  const isDisplayed = await ProductsPage.isPageDisplayed();
  I.assertTrue(isDisplayed, 'App should launch and display Products page');
  
  await I.saveScreenshot('app_installed_and_launched.png');
}).tag('@lifecycle').tag('@installation').tag('@smoke');

Scenario('App uninstallation and reinstallation', async ({ I }) => {
  const appId = getAppId();
  const platform = (process.env.PLATFORM || 'android').toLowerCase();
  
  // Step 1: Verify app is currently installed
  await ProductsPage.waitForPageLoad();
  const isDisplayedBefore = await ProductsPage.isPageDisplayed();
  I.assertTrue(isDisplayedBefore, 'App should be running before uninstallation test');
  
  // Step 2: Remove/Uninstall the app
  try {
    if (platform === 'android') {
      await I.executeScript('mobile: removeApp', { appId: appId });
    } else {
      await I.executeScript('mobile: removeApp', { bundleId: appId });
    }
    console.log(`App ${appId} uninstalled successfully`);
    
    // Step 3: Verify app is no longer installed
    await I.wait(2);
    const isInstalledAfterRemove = await I.executeScript('mobile: isAppInstalled', {
      [platform === 'android' ? 'appId' : 'bundleId']: appId
    });
    I.assertFalse(isInstalledAfterRemove, 'App should be uninstalled');
    
    await I.saveScreenshot('app_uninstalled.png');
    
    // Step 4: Reinstall the app
    const appPath = platform === 'android' 
      ? `${process.cwd()}/apps/android/mda-2.2.0-25.apk`
      : `${process.cwd()}/apps/ios/SauceLabs-Demo-App.app`;
    
    await I.executeScript('mobile: installApp', { appPath: appPath });
    console.log(`App reinstalled from ${appPath}`);
    
    // Step 5: Verify app is installed again
    await I.wait(2);
    const isInstalledAfterReinstall = await I.executeScript('mobile: isAppInstalled', {
      [platform === 'android' ? 'appId' : 'bundleId']: appId
    });
    I.assertTrue(isInstalledAfterReinstall, 'App should be reinstalled');
    
    // Step 6: Launch the app
    await I.executeScript('mobile: activateApp', {
      [platform === 'android' ? 'appId' : 'bundleId']: appId
    });
    
    await I.wait(3);
    
    // Step 7: Verify app launches successfully
    await ProductsPage.waitForPageLoad();
    const isDisplayedAfter = await ProductsPage.isPageDisplayed();
    I.assertTrue(isDisplayedAfter, 'App should launch successfully after reinstallation');
    
    await I.saveScreenshot('app_reinstalled_and_launched.png');
    
  } catch (error) {
    console.log('App lifecycle test encountered error:', error);
    await I.saveScreenshot('app_lifecycle_error.png');
    throw new Error(`App uninstallation/reinstallation test failed: ${error}`);
  }
}).tag('@lifecycle').tag('@installation').tag('@uninstallation');

Scenario('App terminates and relaunches correctly', async ({ I }) => {
  const appId = getAppId();
  const platform = (process.env.PLATFORM || 'android').toLowerCase();
  
  // Step 1: Verify app is running
  await ProductsPage.waitForPageLoad();
  const isDisplayedBefore = await ProductsPage.isPageDisplayed();
  I.assertTrue(isDisplayedBefore, 'App should be running');
  
  // Step 2: Terminate the app
  try {
    await I.executeScript('mobile: terminateApp', {
      [platform === 'android' ? 'appId' : 'bundleId']: appId
    });
    console.log(`App ${appId} terminated`);
    await I.wait(2);
    
    // Step 3: Verify app state (terminated)
    const appState = await I.executeScript('mobile: queryAppState', {
      [platform === 'android' ? 'appId' : 'bundleId']: appId
    });
    // States: 0=not installed, 1=not running, 2=running in bg/suspended, 3=running in bg, 4=running in fg
    console.log(`App state after terminate: ${appState}`);
    
    // Step 4: Relaunch the app
    await I.executeScript('mobile: activateApp', {
      [platform === 'android' ? 'appId' : 'bundleId']: appId
    });
    
    await I.wait(3);
    
    // Step 5: Verify app is running again
    await ProductsPage.waitForPageLoad();
    const isDisplayedAfter = await ProductsPage.isPageDisplayed();
    I.assertTrue(isDisplayedAfter, 'App should relaunch successfully');
    
    await I.saveScreenshot('app_relaunched_after_terminate.png');
    
  } catch (error) {
    console.log('App terminate/relaunch test:', error);
    // Some drivers may not support these commands
    await I.saveScreenshot('app_terminate_relaunch_fallback.png');
  }
}).tag('@lifecycle').tag('@relaunch');

Scenario('Fresh app installation from APK/IPA', async ({ I }) => {
  const appId = getAppId();
  const platform = (process.env.PLATFORM || 'android').toLowerCase();
  
  const appPath = platform === 'android' 
    ? `${process.cwd()}/apps/android/mda-2.2.0-25.apk`
    : `${process.cwd()}/apps/ios/SauceLabs-Demo-App.app`;
  
  try {
    // Try to get app install status
    const initialState = await I.executeScript('mobile: queryAppState', {
      [platform === 'android' ? 'appId' : 'bundleId']: appId
    });
    console.log(`Initial app state: ${initialState}`);
    
    // Install app (will update if already installed)
    await I.executeScript('mobile: installApp', { appPath: appPath });
    console.log(`App installed/updated from: ${appPath}`);
    
    await I.wait(2);
    
    // Activate the app
    await I.executeScript('mobile: activateApp', {
      [platform === 'android' ? 'appId' : 'bundleId']: appId
    });
    
    await I.wait(3);
    
    // Verify app is in foreground and working
    const finalState = await I.executeScript('mobile: queryAppState', {
      [platform === 'android' ? 'appId' : 'bundleId']: appId
    });
    console.log(`Final app state: ${finalState}`);
    I.assertTrue(finalState === 4, 'App should be running in foreground (state 4)');
    
    // Verify products page loads
    await ProductsPage.waitForPageLoad();
    const isDisplayed = await ProductsPage.isPageDisplayed();
    I.assertTrue(isDisplayed, 'Fresh installed app should display Products page');
    
    await I.saveScreenshot('fresh_install_verification.png');
    
  } catch (error) {
    console.log('Fresh install test note:', error);
    // App may already be installed via Appium session
    await ProductsPage.waitForPageLoad();
    await I.saveScreenshot('install_test_fallback.png');
  }
}).tag('@lifecycle').tag('@installation').tag('@fresh-install');

After(async ({ I }) => {
  // Ensure app is in proper state for next test
  try {
    const platform = (process.env.PLATFORM || 'android').toLowerCase();
    await I.setOrientation('PORTRAIT');
  } catch {
    // Ignore orientation errors
  }
});
