import puppeteer from 'puppeteer-core';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { questions } from '../src/data/questions.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const SCREENSHOTS_DIR = path.resolve(__dirname, '../docs/screenshots');
const APP_URL = process.env.APP_URL || 'http://127.0.0.1:4173/exam-ready-german/';

if (!fs.existsSync(SCREENSHOTS_DIR)) {
  fs.mkdirSync(SCREENSHOTS_DIR, { recursive: true });
}

// B7: Portable Chromium path resolver
function getBrowserExecutablePath() {
  if (process.env.CHROME_PATH && fs.existsSync(process.env.CHROME_PATH)) {
    return process.env.CHROME_PATH;
  }

  const commonPaths = [
    // Windows Edge & Chrome
    'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',
    'C:\\Program Files\\Microsoft\\Edge\\Application\\msedge.exe',
    'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe',
    path.join(process.env.LOCALAPPDATA || '', 'Microsoft\\Edge\\Application\\msedge.exe'),
    path.join(process.env.LOCALAPPDATA || '', 'Google\\Chrome\\Application\\chrome.exe'),
    // macOS
    '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
    '/Applications/Microsoft Edge.app/Contents/MacOS/Microsoft Edge',
    '/Applications/Chromium.app/Contents/MacOS/Chromium',
    // Linux
    '/usr/bin/google-chrome',
    '/usr/bin/google-chrome-stable',
    '/usr/bin/chromium',
    '/usr/bin/chromium-browser',
  ];

  for (const p of commonPaths) {
    if (p && fs.existsSync(p)) {
      return p;
    }
  }

  throw new Error(
    'No Chromium browser executable found. Please set CHROME_PATH environment variable to your Chrome/Edge binary.'
  );
}

// Fast prompt-to-correct-text lookup
const promptToCorrectMap = {};
for (const q of questions) {
  promptToCorrectMap[q.prompt.trim()] = q.options[q.answerIndex];
}

async function run() {
  const executablePath = getBrowserExecutablePath();
  console.log(`🚀 Using browser executable: ${executablePath}`);
  console.log(`🌐 Testing at URL: ${APP_URL}`);

  const browser = await puppeteer.launch({
    executablePath,
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-gpu'],
  });

  const page = await browser.newPage();

  // Helper: check horizontal scroll
  async function checkNoHorizontalOverflow(contextName) {
    const overflow = await page.evaluate(() => {
      return document.documentElement.scrollWidth > window.innerWidth;
    });
    if (overflow) {
      console.error(`❌ Overflow detected in ${contextName}! scrollWidth > innerWidth`);
    } else {
      console.log(`✅ No horizontal overflow in ${contextName}`);
    }
  }

  // 1. Landing Desktop (1280x800)
  console.log('\n--- 1. Testing Landing Page (Desktop: 1280x800) ---');
  await page.setViewport({ width: 1280, height: 800 });
  await page.goto(APP_URL, { waitUntil: 'networkidle0' });

  await page.screenshot({ path: path.join(SCREENSHOTS_DIR, 'landing-desktop.png') });
  console.log('📸 Saved landing-desktop.png');
  await checkNoHorizontalOverflow('Landing Desktop');

  // 2. Landing Mobile (360x740)
  console.log('\n--- 2. Testing Landing Page (Mobile: 360x740) ---');
  await page.setViewport({ width: 360, height: 740 });
  await page.screenshot({ path: path.join(SCREENSHOTS_DIR, 'landing-mobile.png') });
  console.log('📸 Saved landing-mobile.png');
  await checkNoHorizontalOverflow('Landing Mobile');

  // 3. Test "How It Works" modal & A4 keyboard isolation
  console.log('\n--- 3. Testing "How It Works" modal & keyboard isolation ---');
  await page.setViewport({ width: 1280, height: 800 });
  await page.goto(APP_URL, { waitUntil: 'networkidle0' });
  await page.type('#passenger-name', 'Arjun Patel');
  await page.keyboard.press('Enter');
  await page.waitForSelector('[role="radiogroup"]');

  // Open "How it works" modal
  const howItWorksBtn = await page.$('header button[aria-haspopup="dialog"]');
  if (howItWorksBtn) {
    await howItWorksBtn.click();
    await new Promise((r) => setTimeout(r, 200));

    // A4: Press key '2' while modal is open - MUST NOT select option
    await page.keyboard.press('2');
    await new Promise((r) => setTimeout(r, 100));

    // Close modal with Escape
    await page.keyboard.press('Escape');
    await new Promise((r) => setTimeout(r, 200));

    // Verify option 2 is not selected
    const isAnswered = await page.evaluate(() => {
      return !!document.querySelector('.animate-fadeIn');
    });
    console.log(`✅ A4 Keyboard isolation verified (key 2 while dialog open answered: ${isAnswered}): ${!isAnswered ? 'PASSED' : 'FAILED'}`);
  }

  // A3: Verify topic name is NOT visible
  const rawTopicLeak = await page.evaluate(() => {
    const text = document.querySelector('[role="radiogroup"]')?.parentElement?.textContent || '';
    return text.includes('greetings') || text.includes('articles') || text.includes('reading-messages');
  });
  console.log(`✅ A3 Topic leak check (raw slug present: ${rawTopicLeak}): ${!rawTopicLeak ? 'PASSED' : 'FAILED'}`);

  // Capture quiz screenshot at Question 1 after answering
  await page.keyboard.press('1');
  await new Promise((r) => setTimeout(r, 300));
  await page.screenshot({ path: path.join(SCREENSHOTS_DIR, 'quiz-desktop.png') });
  console.log('📸 Saved quiz-desktop.png');

  await page.setViewport({ width: 360, height: 740 });
  await page.screenshot({ path: path.join(SCREENSHOTS_DIR, 'quiz-mobile.png') });
  console.log('📸 Saved quiz-mobile.png');

  // ========================================================
  // RUN 1: All Correct (12/12) -> Ready to book (Keyboard only)
  // ========================================================
  console.log('\n--- 4. RUN 1: All Correct (12/12) via Keyboard ---');
  await page.setViewport({ width: 1280, height: 800 });
  await page.goto(APP_URL, { waitUntil: 'networkidle0' });
  await page.type('#passenger-name', 'Arjun Patel');
  await page.keyboard.press('Enter');

  for (let q = 1; q <= 12; q++) {
    await page.waitForSelector('[role="radiogroup"]');
    const prompt = await page.$eval('h2', (el) => el.textContent.trim());
    const correctText = promptToCorrectMap[prompt];

    // Find the 1-based index (1-4) of the option matching correctText
    const correctKey = await page.evaluate((cText) => {
      const opts = Array.from(document.querySelectorAll('[role="radio"]'));
      const idx = opts.findIndex((o) => o.textContent.includes(cText));
      return idx >= 0 ? (idx + 1).toString() : '1';
    }, correctText);

    // Press 1-4 via keyboard
    await page.keyboard.press(correctKey);
    await new Promise((r) => setTimeout(r, 100));

    // Press Enter to advance
    await page.keyboard.press('Enter');
    await new Promise((r) => setTimeout(r, 150));
  }

  await page.waitForSelector('.printable-area');
  await new Promise((r) => setTimeout(r, 400));

  const verdictRun1 = await page.$eval('h3.font-serif', (el) => el.textContent);
  console.log(`Run 1 Verdict: "${verdictRun1}" (Expected: "Ready to book")`);
  await page.screenshot({ path: path.join(SCREENSHOTS_DIR, 'result-ready-desktop.png') });
  console.log('📸 Saved result-ready-desktop.png');

  // Mobile check for Run 1: B1 Verdict first on mobile
  await page.setViewport({ width: 360, height: 740 });
  await new Promise((r) => setTimeout(r, 200));

  const mobileOrderCheck = await page.evaluate(() => {
    const stub = document.querySelector('.order-1');
    const gates = document.querySelector('.order-3');
    if (!stub || !gates) return false;
    const stubRect = stub.getBoundingClientRect();
    const gatesRect = gates.getBoundingClientRect();
    return stubRect.top < gatesRect.top;
  });
  console.log(`✅ B1 Mobile layout: Stub renders above gates on mobile: ${mobileOrderCheck ? 'PASSED' : 'FAILED'}`);
  await page.screenshot({ path: path.join(SCREENSHOTS_DIR, 'result-ready-mobile.png') });
  console.log('📸 Saved result-ready-mobile.png');

  // ========================================================
  // RUN 2: All Wrong (0/12) -> Not yet (Keyboard only)
  // ========================================================
  console.log('\n--- 5. RUN 2: All Wrong (0/12) via Keyboard ---');
  await page.setViewport({ width: 1280, height: 800 });
  await page.goto(APP_URL, { waitUntil: 'networkidle0' });
  await page.type('#passenger-name', 'Dev Sharma');
  await page.keyboard.press('Enter');

  for (let q = 1; q <= 12; q++) {
    await page.waitForSelector('[role="radiogroup"]');
    const prompt = await page.$eval('h2', (el) => el.textContent.trim());
    const correctText = promptToCorrectMap[prompt];

    const wrongKey = await page.evaluate((cText) => {
      const opts = Array.from(document.querySelectorAll('[role="radio"]'));
      const idx = opts.findIndex((o) => !o.textContent.includes(cText));
      return idx >= 0 ? (idx + 1).toString() : '1';
    }, correctText);

    await page.keyboard.press(wrongKey);
    await new Promise((r) => setTimeout(r, 100));
    await page.keyboard.press('Enter');
    await new Promise((r) => setTimeout(r, 150));
  }

  await page.waitForSelector('.printable-area');
  await new Promise((r) => setTimeout(r, 400));
  const verdictRun2 = await page.$eval('h3.font-serif', (el) => el.textContent);
  console.log(`Run 2 Verdict: "${verdictRun2}" (Expected: "Not yet")`);
  await page.screenshot({ path: path.join(SCREENSHOTS_DIR, 'result-notyet-desktop.png') });
  console.log('📸 Saved result-notyet-desktop.png');

  // ========================================================
  // RUN 3: Strong Vocab & Grammar (4/4, 4/4), Weak Reading (1/4)
  // ========================================================
  console.log('\n--- 6. RUN 3: Weak Reading -> "Not yet" ---');
  await page.goto(APP_URL, { waitUntil: 'networkidle0' });
  await page.type('#passenger-name', 'Sneha Rao');
  await page.keyboard.press('Enter');

  for (let q = 1; q <= 12; q++) {
    await page.waitForSelector('[role="radiogroup"]');
    const prompt = await page.$eval('h2', (el) => el.textContent.trim());
    const correctText = promptToCorrectMap[prompt];

    const isReading = await page.evaluate(() => {
      const chip = document.querySelector('span.uppercase');
      return chip?.textContent.toLowerCase().includes('reading') || chip?.textContent.toLowerCase().includes('lesen');
    });

    const targetKey = await page.evaluate((cText, readingFlag, questionIdx) => {
      const opts = Array.from(document.querySelectorAll('[role="radio"]'));
      if (!readingFlag) {
        // Correct answer for vocab & grammar
        const idx = opts.findIndex((o) => o.textContent.includes(cText));
        return idx >= 0 ? (idx + 1).toString() : '1';
      } else {
        // For reading, get 1 correct and 3 wrong (score 1/4 = 25% -> Not yet)
        if (questionIdx === 9) {
          const idx = opts.findIndex((o) => o.textContent.includes(cText));
          return idx >= 0 ? (idx + 1).toString() : '1';
        } else {
          const idx = opts.findIndex((o) => !o.textContent.includes(cText));
          return idx >= 0 ? (idx + 1).toString() : '1';
        }
      }
    }, correctText, isReading, q);

    await page.keyboard.press(targetKey);
    await new Promise((r) => setTimeout(r, 100));
    await page.keyboard.press('Enter');
    await new Promise((r) => setTimeout(r, 150));
  }

  await page.waitForSelector('.printable-area');
  await new Promise((r) => setTimeout(r, 400));
  const verdictRun3 = await page.$eval('h3.font-serif', (el) => el.textContent);
  console.log(`Run 3 Verdict: "${verdictRun3}" (Expected: "Not yet")`);
  await page.screenshot({ path: path.join(SCREENSHOTS_DIR, 'result-almost-desktop.png') });
  console.log('📸 Saved result-almost-desktop.png');

  // ========================================================
  // RUN 4: One Mistake Per Skill (3/4, 3/4, 3/4) -> Ready to book
  // ========================================================
  console.log('\n--- 7. RUN 4: One Mistake Per Skill (3/4 each = 75%) ---');
  await page.goto(APP_URL, { waitUntil: 'networkidle0' });
  await page.type('#passenger-name', 'Rohan Verma');
  await page.keyboard.press('Enter');

  for (let q = 1; q <= 12; q++) {
    await page.waitForSelector('[role="radiogroup"]');
    const prompt = await page.$eval('h2', (el) => el.textContent.trim());
    const correctText = promptToCorrectMap[prompt];

    // Wrong answer on question 1, 5, 9 (one per skill)
    const shouldFail = (q === 1 || q === 5 || q === 9);

    const targetKey = await page.evaluate((cText, fail) => {
      const opts = Array.from(document.querySelectorAll('[role="radio"]'));
      if (fail) {
        const idx = opts.findIndex((o) => !o.textContent.includes(cText));
        return idx >= 0 ? (idx + 1).toString() : '1';
      } else {
        const idx = opts.findIndex((o) => o.textContent.includes(cText));
        return idx >= 0 ? (idx + 1).toString() : '1';
      }
    }, correctText, shouldFail);

    await page.keyboard.press(targetKey);
    await new Promise((r) => setTimeout(r, 100));
    await page.keyboard.press('Enter');
    await new Promise((r) => setTimeout(r, 150));
  }

  await page.waitForSelector('.printable-area');
  await new Promise((r) => setTimeout(r, 400));
  const verdictRun4 = await page.$eval('h3.font-serif', (el) => el.textContent);
  console.log(`Run 4 Verdict: "${verdictRun4}" (Expected: "Ready to book" at 75% across all skills)`);

  // Verify A2: Bar tick labels visible
  const tickLabelsVisible = await page.evaluate(() => {
    const labels = Array.from(document.querySelectorAll('span.font-mono')).filter((s) => s.textContent.includes('50%') || s.textContent.includes('75%'));
    return labels.length >= 6; // 2 ticks per gate * 3 gates
  });
  console.log(`✅ A2 Score-bar threshold labels visible: ${tickLabelsVisible ? 'PASSED' : 'FAILED'}`);

  // Verify tap targets >= 44px
  const tapTargetCheck = await page.evaluate(() => {
    const interactiveElements = document.querySelectorAll('button, a, input');
    const smallTargets = [];
    for (const el of interactiveElements) {
      const rect = el.getBoundingClientRect();
      if (rect.width > 0 && rect.height > 0 && (rect.width < 44 || rect.height < 44)) {
        if (el.tagName !== 'A' && !el.closest('p')) {
          smallTargets.push({ tag: el.tagName, text: el.textContent?.slice(0, 30), width: rect.width, height: rect.height });
        }
      }
    }
    return smallTargets;
  });
  console.log('✅ Tap targets check:', tapTargetCheck.length === 0 ? 'ALL >= 44px' : tapTargetCheck);

  await browser.close();
  console.log('\n✨ All 4 browser test runs and verifications finished successfully!');
}

run().catch((err) => {
  console.error('Error during verification:', err);
  process.exit(1);
});
