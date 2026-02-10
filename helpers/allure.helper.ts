import Helper from '@codeceptjs/helper';
import * as fs from 'fs';
import * as path from 'path';

/**
 * @author Sanjay Singh Panwar
 * Custom Allure Helper for enhanced reporting with step screenshots
 */
class AllureHelper extends Helper {
  
  private stepCounter: number = 0;
  
  /**
   * Hook that runs after each step to capture screenshot
   */
  async _afterStep(step: any) {
    this.stepCounter++;
    
    // Capture screenshot for the step
    try {
      const helper = this.helpers['Appium'];
      if (helper && typeof helper.saveScreenshot === 'function') {
        const screenshotName = `step_${this.stepCounter}_${this._sanitizeFileName(step.name)}.png`;
        const screenshotPath = path.join('output', 'step-screenshots', screenshotName);
        
        // Ensure directory exists
        const dir = path.dirname(screenshotPath);
        if (!fs.existsSync(dir)) {
          fs.mkdirSync(dir, { recursive: true });
        }
        
        // Save screenshot
        await helper.saveScreenshot(screenshotName);
        
        // Attach to Allure report
        if (fs.existsSync(screenshotPath)) {
          const screenshotBuffer = fs.readFileSync(screenshotPath);
          this.addAttachment(`${step.name}`, screenshotBuffer, 'image/png');
        }
      }
    } catch (error) {
      // Screenshot capture might fail, don't break the test
      console.log(`Could not capture step screenshot: ${error}`);
    }
  }
  
  /**
   * Hook that runs before each test
   */
  _before() {
    this.stepCounter = 0;
  }
  
  /**
   * Sanitize filename to remove special characters
   */
  private _sanitizeFileName(name: string): string {
    return name
      .replace(/[^a-zA-Z0-9\s]/g, '_')
      .replace(/\s+/g, '_')
      .substring(0, 50);
  }

  /**
   * @author Sanjay Singh Panwar
   * Add description to current test
   * @param description - Test description
   */
  addDescription(description: string) {
    if (this.helpers['Allure']) {
      this.helpers['Allure'].addDescription(description);
    }
  }

  /**
   * @author Sanjay Singh Panwar
   * Add step to current test
   * @param stepName - Step name
   * @param status - Step status
   */
  addStep(stepName: string, status: 'passed' | 'failed' | 'broken' | 'skipped' = 'passed') {
    if (this.helpers['Allure']) {
      this.helpers['Allure'].addStep(stepName, status);
    }
  }

  /**
   * @author Sanjay Singh Panwar
   * Add attachment to current test
   * @param name - Attachment name
   * @param content - Attachment content
   * @param type - MIME type
   */
  addAttachment(name: string, content: string | Buffer, type: string) {
    if (this.helpers['Allure']) {
      this.helpers['Allure'].addAttachment(name, content, type);
    }
  }

  /**
 * @author Sanjay Singh Panwar
   * Add label to current test
   * @param name - Label name
   * @param value - Label value
   */
  addLabel(name: string, value: string) {
    if (this.helpers['Allure']) {
      this.helpers['Allure'].addLabel(name, value);
    }
  }

  /**
 * @author Sanjay Singh Panwar
   * Add issue link to current test
   * @param issueId - Issue ID
   */
  addIssue(issueId: string) {
    if (this.helpers['Allure']) {
      this.helpers['Allure'].addLabel('issue', issueId);
    }
  }

  /**
 * @author Sanjay Singh Panwar
   * Add feature label to current test
   * @param feature - Feature name
   */
  addFeature(feature: string) {
    if (this.helpers['Allure']) {
      this.helpers['Allure'].addLabel('feature', feature);
    }
  }

  /**
 * @author Sanjay Singh Panwar
   * Add story label to current test
   * @param story - Story name
   */
  addStory(story: string) {
    if (this.helpers['Allure']) {
      this.helpers['Allure'].addLabel('story', story);
    }
  }

  /**
 * @author Sanjay Singh Panwar
   * Add severity to current test
   * @param severity - Severity level
   */
  addSeverity(severity: 'blocker' | 'critical' | 'normal' | 'minor' | 'trivial') {
    if (this.helpers['Allure']) {
      this.helpers['Allure'].addLabel('severity', severity);
    }
  }

  /**
 * @author Sanjay Singh Panwar
   * Add environment info
   * @param name - Environment name
   * @param value - Environment value
   */
  addEnvironment(name: string, value: string) {
    if (this.helpers['Allure']) {
      this.helpers['Allure'].addEnvironment(name, value);
    }
  }

  /**
 * @author Sanjay Singh Panwar
   * Add test ID
   * @param testId - Test ID
   */
  addTestId(testId: string) {
    if (this.helpers['Allure']) {
      this.helpers['Allure'].addLabel('testId', testId);
    }
  }

  /**
 * @author Sanjay Singh Panwar
   * Add owner
   * @param owner - Test owner
   */
  addOwner(owner: string) {
    if (this.helpers['Allure']) {
      this.helpers['Allure'].addLabel('owner', owner);
    }
  }

  /**
 * @author Sanjay Singh Panwar
   * Add epic
   * @param epic - Epic name
   */
  addEpic(epic: string) {
    if (this.helpers['Allure']) {
      this.helpers['Allure'].addLabel('epic', epic);
    }
  }

  /**
 * @author Sanjay Singh Panwar
   * Add parameter to current test
   * @param name - Parameter name
   * @param value - Parameter value
   */
  addParameter(name: string, value: string) {
    if (this.helpers['Allure']) {
      this.helpers['Allure'].addParameter(name, value);
    }
  }
}

module.exports = AllureHelper;
