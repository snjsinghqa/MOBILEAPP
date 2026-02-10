#!/bin/bash

# Parallel Test Execution Script for Android and iOS
# This script runs tests on both platforms simultaneously

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${GREEN}========================================${NC}"
echo -e "${GREEN}  Mobile Automation - Parallel Execution${NC}"
echo -e "${GREEN}========================================${NC}"

# Check if Appium servers need to be started
START_APPIUM=${START_APPIUM:-false}

if [ "$START_APPIUM" = "true" ]; then
    echo -e "${BLUE}Starting Appium servers...${NC}"
    
    # Start Appium for Android on port 4723
    echo -e "${GREEN}Starting Appium for Android on port 4723...${NC}"
    appium --base-path /wd/hub --port 4723 > ./output/appium-android.log 2>&1 &
    APPIUM_ANDROID_PID=$!
    
    # Start Appium for iOS on port 4724
    echo -e "${BLUE}Starting Appium for iOS on port 4724...${NC}"
    appium --base-path /wd/hub --port 4724 > ./output/appium-ios.log 2>&1 &
    APPIUM_IOS_PID=$!
    
    # Wait for Appium servers to start
    echo "Waiting for Appium servers to start..."
    sleep 5
fi

# Get test filter from arguments
TEST_GREP=${1:-""}

echo ""
echo -e "${GREEN}Running tests in parallel...${NC}"
echo ""

if [ -n "$TEST_GREP" ]; then
    echo -e "Filter: ${BLUE}$TEST_GREP${NC}"
    echo ""
    
    # Run tests with grep filter
    npx concurrently \
        -n "Android,iOS" \
        -c "green,blue" \
        --kill-others-on-fail \
        "PLATFORM=android DEVICE_TYPE=emulator npx codeceptjs run --steps --grep '$TEST_GREP'" \
        "PLATFORM=ios DEVICE_TYPE=simulator npx codeceptjs run --steps --grep '$TEST_GREP'"
else
    # Run all tests
    npx concurrently \
        -n "Android,iOS" \
        -c "green,blue" \
        --kill-others-on-fail \
        "PLATFORM=android DEVICE_TYPE=emulator npx codeceptjs run --steps" \
        "PLATFORM=ios DEVICE_TYPE=simulator npx codeceptjs run --steps"
fi

EXIT_CODE=$?

# Stop Appium servers if we started them
if [ "$START_APPIUM" = "true" ]; then
    echo ""
    echo -e "${BLUE}Stopping Appium servers...${NC}"
    kill $APPIUM_ANDROID_PID 2>/dev/null
    kill $APPIUM_IOS_PID 2>/dev/null
fi

echo ""
if [ $EXIT_CODE -eq 0 ]; then
    echo -e "${GREEN}========================================${NC}"
    echo -e "${GREEN}  All tests passed!${NC}"
    echo -e "${GREEN}========================================${NC}"
else
    echo -e "${RED}========================================${NC}"
    echo -e "${RED}  Some tests failed!${NC}"
    echo -e "${RED}========================================${NC}"
fi

exit $EXIT_CODE
