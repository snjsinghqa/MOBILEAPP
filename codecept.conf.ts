/**
 * CodeceptJS configuration file for Mobile Automation Framework
 * @author Sanjay Singh Panwar
 */

import * as dotenv from 'dotenv';
import { spawn, ChildProcess, exec } from 'child_process';
import * as path from 'path';
import * as fs from 'fs';
import { getDeviceConfig, getPlatformName, appiumConfig, testConfig } from './config/device.config';

// Import CodeceptJS event system for step tracking
const { event, recorder } = require('codeceptjs');
const addContext = require('mochawesome/addContext');

dotenv.config();

// Get platform and device type from environment variables
const platform = process.env.PLATFORM || 'android';
const deviceType = process.env.DEVICE_TYPE || 'emulator';

// Check if Appium auto-management is disabled (for parallel runs)
const autoManageAppium = process.env.AUTO_APPIUM !== 'false';

// Get appropriate device configuration
const deviceConfig = getDeviceConfig(platform, deviceType);
const platformName = getPlatformName(platform);

// Store Appium process reference for cleanup
let appiumProcess: ChildProcess | null = null;

// Function to check if Appium is running
const isAppiumRunning = (): Promise<boolean> => {
  return new Promise((resolve) => {
    const port = appiumConfig.port;
    exec(`lsof -ti:${port}`, (error, stdout) => {
      resolve(!error && stdout.trim().length > 0);
    });
  });
};

// Function to check if Android emulator is running
const isAndroidEmulatorRunning = (): Promise<boolean> => {
  return new Promise((resolve) => {
    exec('adb devices', (error, stdout) => {
      if (error) {
        resolve(false);
        return;
      }
      const lines = stdout.split('\n').filter(line => line.trim() && !line.includes('List of devices'));
      const runningDevices = lines.filter(line => line.includes('device') && !line.includes('offline'));
      resolve(runningDevices.length > 0);
    });
  });
};

// Function to start Android emulator
const startAndroidEmulator = (): Promise<void> => {
  return new Promise((resolve, reject) => {
    console.log('Starting Android emulator...');
    
    // Try to get the first available AVD
    exec('emulator -list-avds', (error, stdout) => {
      if (error || !stdout.trim()) {
        console.log('⚠ No Android AVDs found. Please create one using Android Studio.');
        console.log('Continuing - assuming device will be available...');
        resolve();
        return;
      }
      
      const avds = stdout.trim().split('\n');
      const avdName = avds[0].trim();
      
      console.log(`Found AVD: ${avdName}`);
      console.log('Starting emulator (this may take 30-60 seconds)...');
      
      // Start emulator in background
      const emulatorPath = process.env.ANDROID_HOME 
        ? `${process.env.ANDROID_HOME}/emulator/emulator`
        : 'emulator';
      
      const emulatorProcess = spawn(emulatorPath, ['-avd', avdName, '-no-snapshot-load', '-no-boot-anim'], {
        detached: true,
        stdio: 'ignore'
      });
      emulatorProcess.unref();
      
      console.log('Waiting for emulator to boot...');
      
      // Wait for device to be online
      let attempts = 0;
      const maxAttempts = 60; // 60 seconds timeout
      
      const checkBoot = setInterval(async () => {
        attempts++;
        
        const isRunning = await isAndroidEmulatorRunning();
        if (isRunning) {
          clearInterval(checkBoot);
          
          // Additional wait for system to be fully ready
          console.log('Emulator detected, waiting for system to be ready...');
          await new Promise(r => setTimeout(r, 10000));
          
          // Wait for boot completion
          exec('adb wait-for-device shell getprop sys.boot_completed', (err, output) => {
            if (output.trim() === '1') {
              console.log('[OK] Emulator is ready');
              resolve();
            } else {
              console.log('Emulator started but still booting...');
              setTimeout(() => resolve(), 5000);
            }
          });
        } else if (attempts >= maxAttempts) {
          clearInterval(checkBoot);
          console.log('⚠ Emulator start timeout. Continuing anyway...');
          resolve();
        }
      }, 1000);
    });
  });
};

// Function to check if iOS simulator is running
const isIOSSimulatorRunning = (): Promise<boolean> => {
  return new Promise((resolve) => {
    exec('xcrun simctl list devices | grep "Booted"', (error, stdout) => {
      resolve(!error && stdout.trim().length > 0);
    });
  });
};

// Function to start iOS simulator
const startIOSSimulator = (): Promise<void> => {
  return new Promise((resolve, reject) => {
    console.log('Starting iOS simulator...');
    
    // Get the device name from config
    const deviceName = deviceConfig.deviceName || 'iPhone 17 Pro';
    
    console.log(`Booting simulator: ${deviceName}`);
    
    exec(`xcrun simctl boot "${deviceName}"`, (error, stdout, stderr) => {
      if (error && !stderr.includes('Unable to boot device in current state: Booted')) {
        console.log('⚠ Could not boot simulator:', stderr);
        console.log('Continuing - simulator might already be running...');
        resolve();
        return;
      }
      
      // Open Simulator app
      exec('open -a Simulator', () => {
        console.log('Waiting for simulator to be ready...');
        
        // Wait a bit for simulator to fully boot
        setTimeout(async () => {
          const isRunning = await isIOSSimulatorRunning();
          if (isRunning) {
            console.log('[OK] iOS Simulator is ready');
          } else {
            console.log('⚠ Simulator status unknown, continuing...');
          }
          resolve();
        }, 15000); // Give 15 seconds for simulator to boot
      });
    });
  });
};

// Function to start Appium server
const startAppiumServer = (): Promise<void> => {
  return new Promise((resolve, reject) => {
    const port = appiumConfig.port;
    
    console.log(`Starting Appium server on port ${port} for ${platformName}...`);
    
    appiumProcess = spawn('appium', ['--base-path', '/wd/hub', '--port', port.toString()], {
      stdio: ['ignore', 'pipe', 'pipe'],
      detached: false,
    });
    
    let serverStarted = false;
    
    appiumProcess.stdout?.on('data', (data: Buffer) => {
      const output = data.toString();
      // Check if server has started
      if (output.includes('Appium REST http interface listener started') && !serverStarted) {
        serverStarted = true;
        console.log(`Appium server started successfully on port ${port}`);
        resolve();
      }
    });
    
    appiumProcess.stderr?.on('data', (data: Buffer) => {
      const error = data.toString();
      if (error.includes('EADDRINUSE')) {
        console.log(`Port ${port} already in use, assuming Appium is running`);
        appiumProcess?.kill();
        appiumProcess = null;
        resolve();
      }
    });
    
    appiumProcess.on('error', (err) => {
      console.error('[ERROR] Failed to start Appium:', err.message);
      reject(err);
    });
    
    // Timeout after 30 seconds
    setTimeout(() => {
      if (!serverStarted) {
        console.log(`Appium server should be ready on port ${port}`);
        resolve();
      }
    }, 10000);
  });
};

// Function to stop Appium server
const stopAppiumServer = (): Promise<void> => {
  return new Promise((resolve) => {
    if (appiumProcess) {
      console.log('\nStopping Appium server...');
      
      appiumProcess.on('close', () => {
        console.log('Appium server stopped');
        appiumProcess = null;
        resolve();
      });
      
      // Kill the process
      appiumProcess.kill('SIGTERM');
      
      // Force kill after 5 seconds if still running
      setTimeout(() => {
        if (appiumProcess) {
          appiumProcess.kill('SIGKILL');
          appiumProcess = null;
        }
        resolve();
      }, 5000);
    } else {
      console.log('No Appium process to stop');
      resolve();
    }
  });
};

// Build Appium capabilities based on platform
const getCapabilities = () => {
  const baseCapabilities: Record<string, any> = {
    platformName: platformName,
    'appium:deviceName': deviceConfig.deviceName,
    'appium:platformVersion': deviceConfig.platformVersion,
    'appium:automationName': deviceConfig.automationName,
    'appium:noReset': deviceConfig.noReset,
    'appium:newCommandTimeout': deviceConfig.newCommandTimeout,
  };

  // Add UDID for real devices
  if (deviceConfig.udid) {
    baseCapabilities['appium:udid'] = deviceConfig.udid;
  }

  // Platform-specific capabilities
  if (platformName === 'Android') {
    return {
      ...baseCapabilities,
      'appium:app': deviceConfig.app,
      'appium:appPackage': deviceConfig.appPackage,
      'appium:appActivity': deviceConfig.appActivity,
      'appium:autoGrantPermissions': true,
      'appium:ignoreHiddenApiPolicyError': true,
    };
  } else {
    // iOS capabilities - use app path if provided, otherwise use bundleId
    const iosCapabilities: Record<string, any> = {
      ...baseCapabilities,
      'appium:bundleId': deviceConfig.bundleId,
      'appium:showXcodeLog': true,
      'appium:wdaLaunchTimeout': 120000,
      'appium:useNewWDA': false,
    };
    
    // Only add app path if it's provided and not empty
    if (deviceConfig.app && deviceConfig.app.trim() !== '') {
      iosCapabilities['appium:app'] = deviceConfig.app;
    }
    
    return iosCapabilities;
  }
};

export const config: CodeceptJS.MainConfig = {
  tests: './tests/**/*_test.ts',
  output: './output',
  
  helpers: {
    Appium: {
      host: appiumConfig.host,
      port: appiumConfig.port,
      path: appiumConfig.path,
      platform: platformName,
      ...(deviceConfig.app && deviceConfig.app.trim() !== '' ? { app: deviceConfig.app } : {}),
      desiredCapabilities: getCapabilities(),
      restart: true,
      timeouts: {
        implicit: testConfig.implicitWait,
        script: testConfig.defaultTimeout,
      },
    },
    
    // Custom helpers for mobile gestures
    MobileHelper: {
      require: './helpers/mobile.helper.ts',
    },
    
    // Allure reporter helper
    AllureHelper: {
      require: './helpers/allure.helper.ts',
    },
  },
  
  include: {
    I: './steps_file',
    // Page Objects
    LoginPage: './pages/login.page.ts',
    ProductsPage: './pages/products.page.ts',
    ProductDetailsPage: './pages/product-details.page.ts',
    CartPage: './pages/cart.page.ts',
    CheckoutPage: './pages/checkout.page.ts',
  },
  
  plugins: {
    allure: {
      enabled: true,
      require: 'allure-codeceptjs',
      outputDir: './output/allure-results',
    },
    screenshotOnFail: {
      enabled: testConfig.screenshotOnFailure,
    },
    retryFailedStep: {
      enabled: true,
      retries: 3,
    },
    tryTo: {
      enabled: true,
    },
    pauseOnFail: {
      enabled: false,
    },
    customLocator: {
      enabled: true,
    },
    stepByStepReport: {
      enabled: true,
      deleteSuccessful: false,
      screenshotsForAllureReport: true,
      output: './output/step-screenshots',
      fullPageScreenshots: false,
      ignoreSteps: [
        'wait',
        'waitForElement',
        'waitForVisible',
      ],
    },
  },
  
  mocha: {
    reporter: 'mochawesome',
    reporterOptions: {
      reportDir: './output/reports',
      reportFilename: 'test-report',
      overwrite: false,
      html: true,
      json: true,
      charts: true,
      code: true,
      showPassed: true,
      showFailed: true,
      showPending: true,
      showSkipped: true,
      showHooks: 'always',
      consoleReporter: 'spec',
      inlineAssets: true,
      enableCode: true,
    },
  },
  
  // Bootstrap - runs before all tests
  bootstrap: async () => {
    console.log('\n========================================');
    console.log('  Mobile Automation Test Session Start');
    console.log('========================================');
    console.log(`Platform: ${platformName}`);
    console.log(`Device Type: ${deviceType}`);
    console.log(`Appium Port: ${appiumConfig.port} (${platformName === 'Android' ? 'Android default' : 'iOS default'})`);
    console.log(`Auto Appium Management: ${autoManageAppium ? 'Enabled' : 'Disabled'}`);
    console.log('\n[INFO] Port Assignment: Android uses 4723, iOS uses 4724 (automatic)');
    
    // Check and start device if needed (only for emulator/simulator)
    if (deviceType === 'emulator' || deviceType === 'simulator') {
      console.log('\n--- Device Check ---');
      
      if (platformName === 'Android') {
        const emulatorRunning = await isAndroidEmulatorRunning();
        if (emulatorRunning) {
          console.log('[OK] Android emulator is already running');
        } else {
          console.log('⚠ Android emulator not detected');
          await startAndroidEmulator();
        }
      } else if (platformName === 'iOS') {
        const simulatorRunning = await isIOSSimulatorRunning();
        if (simulatorRunning) {
          console.log('[OK] iOS simulator is already running');
        } else {
          console.log('⚠ iOS simulator not detected');
          await startIOSSimulator();
        }
      }
    } else {
      console.log('\n--- Real Device Mode ---');
      console.log('Skipping device auto-start (real device expected to be connected)');
    }
    
    // Check and start Appium if needed
    if (autoManageAppium) {
      console.log('\n--- Appium Check ---');
      const appiumRunning = await isAppiumRunning();
      
      if (appiumRunning) {
        console.log(`[OK] Appium server is already running on port ${appiumConfig.port} (${platformName})`);
        console.log('Using existing Appium instance');
      } else {
        console.log(`⚠ Appium server not detected on port ${appiumConfig.port}`);
        console.log(`Starting Appium for ${platformName} platform...`);
        await startAppiumServer();
        // Give extra time for server to be fully ready
        await new Promise(resolve => setTimeout(resolve, 2000));
      }
    } else {
      console.log('\nAppium auto-start disabled - ensure Appium is running externally');
      console.log(`   Expected port for ${platformName}: ${appiumConfig.port}`);
    }
    
    // Clear Allure results before test execution
    const allureResultsDir = path.resolve(__dirname, 'allure-results');
    const allureReportDir = path.resolve(__dirname, 'output/allure-report');
    
    console.log('\n--- Cleanup ---');
    console.log('Cleaning previous Allure results...');
    try {
      if (fs.existsSync(allureResultsDir)) {
        const files = fs.readdirSync(allureResultsDir);
        for (const file of files) {
          const filePath = path.join(allureResultsDir, file);
          if (fs.statSync(filePath).isFile()) {
            fs.unlinkSync(filePath);
          }
        }
        console.log(`[OK] Cleared ${files.length} files from allure-results`);
      } else {
        fs.mkdirSync(allureResultsDir, { recursive: true });
        console.log('[OK] Created allure-results directory');
      }
      
      // Also clean old allure report directory
      if (fs.existsSync(allureReportDir)) {
        fs.rmSync(allureReportDir, { recursive: true, force: true });
        console.log('[OK] Cleared previous Allure report');
      }
    } catch (error) {
      console.log('⚠ Could not clear Allure results:', error);
    }
    
    console.log('\n--- Test Environment Ready ---');
    console.log('\n--- Test Environment Ready ---');
    
    // Setup step tracking for mochawesome reports with screenshots
    let currentTestSteps: string[] = [];
    let stepCounter = 0;
    let currentTest: any = null;
    
    // Listen to step events to capture test steps and screenshots
    event.dispatcher.on(event.step.before, async (step: any) => {
      stepCounter++;
      const stepText = `${stepCounter}. ${step.name}`;
      currentTestSteps.push(stepText);
    });
    
    event.dispatcher.on(event.step.passed, async (step: any) => {
      if (currentTestSteps.length > 0) {
        currentTestSteps[currentTestSteps.length - 1] = `[PASS] ${currentTestSteps[currentTestSteps.length - 1]}`;
      }
      
      // Capture screenshot after step passes
      try {
        const screenshotPath = path.join('output', 'step-screenshots', `step_${stepCounter}_${Date.now()}.png`);
        // Screenshot will be auto-captured by stepByStepReport plugin
      } catch (e) {
        // Screenshot capture might fail
      }
    });
    
    event.dispatcher.on(event.step.failed, async (step: any) => {
      if (currentTestSteps.length > 0) {
        currentTestSteps[currentTestSteps.length - 1] = `[FAIL] ${currentTestSteps[currentTestSteps.length - 1]}`;
      }
    });
    
    event.dispatcher.on(event.test.before, (test: any) => {
      currentTestSteps = [];
      stepCounter = 0;
      currentTest = test;
    });
    
    event.dispatcher.on(event.test.after, (test: any) => {
      if (currentTestSteps.length > 0 && test._runnable) {
        const stepsHtml = '<div style="font-family: monospace; background: #f5f5f5; padding: 10px; border-radius: 5px; margin-top: 10px;"><strong>📋 Test Steps:</strong><br/>' + 
          currentTestSteps.map(s => `&nbsp;&nbsp;${s}`).join('<br/>') + '</div>';
        try {
          addContext({ test: test._runnable }, { title: 'Test Steps', value: stepsHtml });
          
          // Add screenshot directory info to report
          const screenshotDir = path.join('output', 'step-screenshots');
          const screenshotInfo = `<div style="margin-top: 10px; padding: 10px; background: #e3f2fd; border-radius: 5px;">
            <strong>📸 Step Screenshots:</strong><br/>
            Screenshots are automatically captured for each step and available in:<br/>
            <code>${screenshotDir}</code><br/>
            View them in the Allure report for detailed step-by-step visuals.
          </div>`;
          addContext({ test: test._runnable }, { title: 'Screenshots Info', value: screenshotInfo });
        } catch (e) {
          // Context might not be available
        }
      }
    });
    
    console.log('========================================\n');
  },
  
  // Teardown - runs after all tests
  teardown: async () => {
    console.log('\n========================================');
    console.log('  Mobile Automation Test Session End');
    console.log('========================================');
    
    // Stop Appium server only if auto-management is enabled and we started it
    if (autoManageAppium) {
      await stopAppiumServer();
    } else {
      console.log('Appium auto-stop disabled - Appium server left running');
    }
    
    // Generate and open Allure report automatically
    const allureResultsDir = path.resolve(__dirname, 'allure-results');
    const allureReportDir = path.resolve(__dirname, 'output/allure-report');
    
    if (fs.existsSync(allureResultsDir) && fs.readdirSync(allureResultsDir).length > 0) {
      console.log('\nGenerating Allure Report...');
      
      await new Promise<void>((resolve) => {
        exec(`allure generate "${allureResultsDir}" -o "${allureReportDir}" --clean`, (error, stdout, stderr) => {
          if (error) {
            console.log('Could not generate Allure report:', error.message);
            resolve();
          } else {
            console.log('Allure report generated at:', allureReportDir);
            console.log('Opening Allure report in browser...');
            
            // Use allure open to serve the report (starts a local web server)
            const allureOpen = spawn('allure', ['open', allureReportDir], {
              detached: true,
              stdio: 'ignore'
            });
            allureOpen.unref();
            
            console.log('Allure report server started');
            resolve();
          }
        });
      });
    }
    
    // Find and display the latest mochawesome report path
    const reportsDir = path.resolve(__dirname, 'output/reports');
    try {
      const files = fs.readdirSync(reportsDir)
        .filter(f => f.endsWith('.html'))
        .map(f => ({ name: f, time: fs.statSync(path.join(reportsDir, f)).mtime.getTime() }))
        .sort((a, b) => b.time - a.time);
      
      if (files.length > 0) {
        const latestReport = path.join(reportsDir, files[0].name);
        console.log('\nTest Report Generated:');
        console.log(`   ${latestReport}`);
        console.log(`\nOpen in browser: file://${latestReport}`);
      }
    } catch (e) {
      // Reports directory might not exist
    }
    
    console.log('========================================\n');
  },
  
  name: 'MobileApp',
};