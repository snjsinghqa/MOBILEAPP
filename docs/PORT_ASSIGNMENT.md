# Platform-Specific Appium Port Assignment

## Overview

The framework automatically assigns different Appium server ports based on the testing platform. This enables **parallel test execution** and prevents port conflicts when running Android and iOS tests simultaneously.

## Port Assignment Table

| Platform | Appium Port | Auto-Assigned | Configuration |
|----------|-------------|---------------|---------------|
| **Android** | **4723** | [PASS] Yes | Automatic via `PLATFORM=android` |
| **iOS** | **4724** | [PASS] Yes | Automatic via `PLATFORM=ios` |
| **Custom** | **Custom** | Manual | Set via `APPIUM_PORT` env var |

## How It Works

### 1. Platform Detection
The framework reads the `PLATFORM` environment variable and automatically selects the appropriate port:

```typescript
// config/device.config.ts
const getAppiumPort = (): number => {
  // Check explicit APPIUM_PORT first
  if (process.env.APPIUM_PORT) {
    return parseInt(process.env.APPIUM_PORT);
  }
  
  // Then check PLATFORM for auto-assignment
  const platform = process.env.PLATFORM;
  if (platform && platform.toLowerCase() === 'ios') {
    return 4724;  // iOS uses port 4724
  }
  
  return 4723;  // Android uses port 4723 (default)
};
```

### 2. Auto-Start Behavior
When tests run, the bootstrap automatically:
- Detects which platform you're testing (Android/iOS)
- Checks if Appium is running on the **platform-specific port**
- Starts Appium on the correct port if not already running

### 3. Console Output

**Android Test Run:**
```bash
$ PLATFORM=android DEVICE_TYPE=emulator npm run test:android:emulator

========================================
  Mobile Automation Test Session Start
========================================
Platform: Android
Device Type: emulator
Appium Port: 4723 (Android default)
Auto Appium Management: Enabled

[INFO]  Port Assignment: Android uses 4723, iOS uses 4724 (automatic)

--- Appium Check ---
[WARNING] Appium server not detected on port 4723
Starting Appium for Android platform...
Starting Appium server on port 4723 for Android...
Appium server started successfully on port 4723
```

**iOS Test Run:**
```bash
$ PLATFORM=ios DEVICE_TYPE=simulator npm run test:ios:simulator

========================================
  Mobile Automation Test Session Start
========================================
Platform: iOS
Device Type: simulator
Appium Port: 4724 (iOS default)
Auto Appium Management: Enabled

[INFO]  Port Assignment: Android uses 4723, iOS uses 4724 (automatic)

--- Appium Check ---
[WARNING] Appium server not detected on port 4724
Starting Appium for iOS platform...
Starting Appium server on port 4724 for iOS...
Appium server started successfully on port 4724
```

## Use Cases

### Sequential Testing
Run Android tests followed by iOS tests - each will use its designated port:

```bash
# Run Android tests (port 4723)
PLATFORM=android npm run test:android:emulator

# Run iOS tests (port 4724)
PLATFORM=ios npm run test:ios:simulator
```

### Parallel Testing
Run both platforms simultaneously without port conflicts:

```bash
# Terminal 1: Android tests on port 4723
PLATFORM=android npm run test:android:emulator &

# Terminal 2: iOS tests on port 4724
PLATFORM=ios npm run test:ios:simulator &

# Both run in parallel without conflicts!
```

### Manual Appium Control
If you prefer to start Appium manually:

```bash
# Start Android Appium
appium --base-path /wd/hub --port 4723 --relaxed-security &

# Start iOS Appium
appium --base-path /wd/hub --port 4724 --relaxed-security &

# Run tests with auto-start disabled
AUTO_APPIUM=false PLATFORM=android npm run test:android:emulator
AUTO_APPIUM=false PLATFORM=ios npm run test:ios:simulator
```

### Custom Port Override
Use a custom port for special scenarios:

```bash
# Override to use port 5000 for Android
APPIUM_PORT=5000 PLATFORM=android npm run test:android:emulator

# Override to use port 6000 for iOS
APPIUM_PORT=6000 PLATFORM=ios npm run test:ios:simulator
```

## Benefits

[PASS] **Zero Configuration**: Ports assigned automatically based on platform  
[PASS] **Parallel Execution**: Run Android + iOS tests simultaneously  
[PASS] **No Port Conflicts**: Each platform has its dedicated port  
[PASS] **CI/CD Ready**: Works seamlessly in continuous integration pipelines  
[PASS] **Developer Friendly**: No need to remember which port for which platform  
[PASS] **Flexible Override**: Can manually specify ports when needed  

## Implementation Files

The platform-specific port logic is implemented across:

1. **config/device.config.ts**
   - `getAppiumPort()` function handles automatic port selection
   - Exports `appiumConfig` with the correct port

2. **codecept.conf.ts**
   - Bootstrap uses `appiumConfig.port` for all Appium operations
   - Enhanced console output shows platform and port information
   - Auto-start functions respect platform-specific ports

3. **package.json**
   - Test scripts set `PLATFORM` environment variable
   - No manual port specification needed in scripts

## Troubleshooting

### Port Already in Use

**Symptom:**
```
Error: listen EADDRINUSE: address already in use 127.0.0.1:4723
```

**Solution:**
```bash
# Check what's using the port
lsof -ti:4723  # For Android
lsof -ti:4724  # For iOS

# Kill the process
kill $(lsof -ti:4723)
kill $(lsof -ti:4724)

# Or let the framework handle it (auto-start will detect and use existing)
```

### Wrong Port Being Used

**Symptom:**
Tests fail because Appium is running on wrong port

**Solution:**
```bash
# Always set PLATFORM explicitly
PLATFORM=android ...  # Will use port 4723
PLATFORM=ios ...      # Will use port 4724

# Check what port is configured
PLATFORM=android node -p "require('./config/device.config.ts').appiumConfig.port"
# Should output: 4723

PLATFORM=ios node -p "require('./config/device.config.ts').appiumConfig.port"
# Should output: 4724
```

### Parallel Tests Failing

**Symptom:**
Both Android and iOS tests try to use same port

**Solution:**
Ensure `PLATFORM` env var is set differently for each test session:

```bash
# Correct (different platforms = different ports)
PLATFORM=android npm run test:android:emulator &
PLATFORM=ios npm run test:ios:simulator &

# Incorrect (will conflict)
npm run test:android:emulator &  # Might default to wrong port
npm run test:ios:simulator &
```

## Summary

The framework's intelligent port assignment ensures:
- **Android tests always use port 4723**
- **iOS tests always use port 4724**
- **Auto-start works correctly for each platform**
- **Parallel execution is seamless**
- **Zero manual configuration required**

Simply run your tests with the `PLATFORM` environment variable, and the framework handles the rest!
