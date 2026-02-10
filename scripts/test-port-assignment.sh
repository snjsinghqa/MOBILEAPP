#!/bin/bash

# Script to demonstrate platform-specific Appium port assignment
# Author: Sanjay Singh Panwar

echo "======================================================"
echo "  Platform-Specific Appium Port Assignment Demo"
echo "======================================================"
echo ""

echo "Testing Android Configuration..."
echo "Running: PLATFORM=android DEVICE_TYPE=emulator npx codeceptjs dry-run tests/login_test.ts"
echo "Expected Port: 4723"
echo ""
PLATFORM=android DEVICE_TYPE=emulator npx codeceptjs dry-run tests/login_test.ts 2>&1 | grep -A 10 "Mobile Automation Test Session Start" | head -15
echo ""
echo "------------------------------------------------------"
echo ""

echo "Testing iOS Configuration..."
echo "Running: PLATFORM=ios DEVICE_TYPE=simulator npx codeceptjs dry-run tests/login_test.ts"
echo "Expected Port: 4724"
echo ""
PLATFORM=ios DEVICE_TYPE=simulator npx codeceptjs dry-run tests/login_test.ts 2>&1 | grep -A 10 "Mobile Automation Test Session Start" | head -15
echo ""
echo "------------------------------------------------------"
echo ""

echo "   Port Assignment Summary:"
echo "   • Android → Port 4723 (automatic)"
echo "   • iOS → Port 4724 (automatic)"
echo "   • Custom → Set APPIUM_PORT env variable to override"
echo ""
echo "This enables parallel test execution across platforms!"
echo "======================================================"
