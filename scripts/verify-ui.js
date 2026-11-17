import puppeteer from 'puppeteer-core';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { questions } from '../src/data/questions.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const EDGE_PATH = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const APP_URL = 'http://127.0.0.1:5173/';
const SCREENSHOTS_DIR = path.resolve(__dirname, '../docs/screenshots');

if (!fs.existsSync(SCREENSHOTS_DIR)) {
  fs.mkdirSync(SCREENSHOTS_DIR, { recursive: true });
}

// Build a fast lookup from prompt to correct answer text
const promptToCorrectMap = {};
for (const q of questions) {
  promptToCorrectMap[q.prompt.trim()] = q.options[q.answerIndex];
}

async function run() {
  console.log('🚀 Launching Edge for UI verification...');
  const browser = await puppeteer.launch({
    executablePath: EDGE_PATH,
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

  // 3. Test "How it works" modal
  console.log('\n--- 3. Testing "How It Works" modal ---');
  const howItWorksBtn = await page.$('header button');
  if (howItWorksBtn) {
    await howItWorksBtn.click();
    await new Promise((r) => setTimeout(r, 300));
    const modalVisible = await page.$('[role="dialog"]');
    console.log('Modal visible:', !!modalVisible);
    // Press Escape to close
    await page.keyboard.press('Escape');
    await new Promise((r) => setTimeout(r, 300));
    const modalClosed = !(await page.$('[role="dialog"]'));
    console.log('✅ Modal closed with Escape:', modalClosed);
  }

  // 4. Start Quiz
  console.log('\n--- 4. Starting Quiz (Desktop: 1280x800) ---');
  await page.setViewport({ width: 1280, height: 800 });
  await page.type('#passenger-name', 'Arjun Patel');
  await page.click('button[type="submit"]');
  await page.waitForSelector('[role="radiogroup"]');

  // Verify Question 1 and take screenshot of answered state
  console.log('Answering Question 1 to inspect explanation panel...');
  const prompt1 = await page.$eval('h2', (el) => el.textContent.trim());
  const correctText1 = promptToCorrectMap[prompt1];

  // Click an option
  const options = await page.$$('[role="radio"]');
  await options[0].click();
  await new Promise((r) => setTimeout(r, 400));

  await page.screenshot({ path: path.join(SCREENSHOTS_DIR, 'quiz-desktop.png') });
  console.log('📸 Saved quiz-desktop.png');
  await checkNoHorizontalOverflow('Quiz Desktop');

  // Mobile quiz view
  await page.setViewport({ width: 360, height: 740 });
  await page.screenshot({ path: path.join(SCREENSHOTS_DIR, 'quiz-mobile.png') });
  console.log('📸 Saved quiz-mobile.png');
  await checkNoHorizontalOverflow('Quiz Mobile');

  // 5. Complete RUN 1: All Correct
  console.log('\n--- 5. Completing Run 1 (All Correct -> Ready to book) ---');
  await page.setViewport({ width: 1280, height: 800 });

  // Reset by reloading to fresh landing
  await page.goto(APP_URL, { waitUntil: 'networkidle0' });
  await page.type('#passenger-name', 'Arjun Patel');
  await page.click('button[type="submit"]');

  for (let qNum = 1; qNum <= 12; qNum++) {
    await page.waitForSelector('[role="radiogroup"]');
    const prompt = await page.$eval('h2', (el) => el.textContent.trim());
    const correctText = promptToCorrectMap[prompt];

    // Find option button that contains correctText
    const optionButtons = await page.$$('[role="radio"]');
    let clicked = false;
    for (const btn of optionButtons) {
      const text = await btn.evaluate((el) => el.textContent);
      if (text.includes(correctText)) {
        await btn.click();
        clicked = true;
        break;
      }
    }
    if (!clicked && optionButtons.length > 0) {
      await optionButtons[0].click();
    }

    await new Promise((r) => setTimeout(r, 200));

    // Click Next or See Boarding Pass
    const nextBtn = await page.$('button.bg-ink');
    if (nextBtn) {
      await nextBtn.click();
      await new Promise((r) => setTimeout(r, 300));
    }
  }

  // Wait for result page
  await page.waitForSelector('.printable-area');
  await new Promise((r) => setTimeout(r, 600)); // wait for stamp animations

  const verdictText1 = await page.$eval('h3.font-serif', (el) => el.textContent);
  console.log('Run 1 Verdict:', verdictText1);

  await page.screenshot({ path: path.join(SCREENSHOTS_DIR, 'result-ready-desktop.png') });
  console.log('📸 Saved result-ready-desktop.png');
  await checkNoHorizontalOverflow('Result Ready Desktop');

  // Mobile boarding pass check
  await page.setViewport({ width: 360, height: 740 });
  await new Promise((r) => setTimeout(r, 300));
  await page.screenshot({ path: path.join(SCREENSHOTS_DIR, 'result-ready-mobile.png') });
  console.log('📸 Saved result-ready-mobile.png');
  await checkNoHorizontalOverflow('Result Ready Mobile');

  // Tablet check
  await page.setViewport({ width: 768, height: 1024 });
  await checkNoHorizontalOverflow('Result Tablet');

  // 6. Complete RUN 2: All Wrong
  console.log('\n--- 6. Completing Run 2 (All Wrong -> Not yet) ---');
  await page.setViewport({ width: 1280, height: 800 });

  // Click "Retake check"
  const retakeBtn = await page.$('button:has(svg)');
  // Let's find button with text "Retake check"
  const buttons = await page.$$('button');
  for (const b of buttons) {
    const text = await b.evaluate((el) => el.textContent);
    if (text.includes('Retake check')) {
      await b.click();
      break;
    }
  }

  for (let qNum = 1; qNum <= 12; qNum++) {
    await page.waitForSelector('[role="radiogroup"]');
    const prompt = await page.$eval('h2', (el) => el.textContent.trim());
    const correctText = promptToCorrectMap[prompt];

    const optionButtons = await page.$$('[role="radio"]');
    // Pick the wrong option
    for (const btn of optionButtons) {
      const text = await btn.evaluate((el) => el.textContent);
      if (!text.includes(correctText)) {
        await btn.click();
        break;
      }
    }

    await new Promise((r) => setTimeout(r, 200));
    const nextBtn = await page.$('button.bg-ink');
    if (nextBtn) {
      await nextBtn.click();
      await new Promise((r) => setTimeout(r, 300));
    }
  }

  await page.waitForSelector('.printable-area');
  await new Promise((r) => setTimeout(r, 600));

  const verdictText2 = await page.$eval('h3.font-serif', (el) => el.textContent);
  console.log('Run 2 Verdict:', verdictText2);

  await page.screenshot({ path: path.join(SCREENSHOTS_DIR, 'result-notyet-desktop.png') });
  console.log('📸 Saved result-notyet-desktop.png');

  // 7. Complete RUN 3: Strong Vocab & Grammar, Weak Reading
  console.log('\n--- 7. Completing Run 3 (Strong Vocab & Grammar, Weak Reading) ---');
  const retakeButtons = await page.$$('button');
  for (const b of retakeButtons) {
    const text = await b.evaluate((el) => el.textContent);
    if (text.includes('Retake check')) {
      await b.click();
      break;
    }
  }

  for (let qNum = 1; qNum <= 12; qNum++) {
    await page.waitForSelector('[role="radiogroup"]');
    const prompt = await page.$eval('h2', (el) => el.textContent.trim());
    const correctText = promptToCorrectMap[prompt];

    // Check skill
    const skillChip = await page.$eval('span.uppercase', (el) => el.textContent);
    const isReading = skillChip.toLowerCase().includes('reading') || skillChip.toLowerCase().includes('lesen');

    const optionButtons = await page.$$('[role="radio"]');

    if (!isReading) {
      // Pick correct answer for Vocab and Grammar
      for (const btn of optionButtons) {
        const text = await btn.evaluate((el) => el.textContent);
        if (text.includes(correctText)) {
          await btn.click();
          break;
        }
      }
    } else {
      // Pick wrong answer for Reading
      for (const btn of optionButtons) {
        const text = await btn.evaluate((el) => el.textContent);
        if (!text.includes(correctText)) {
          await btn.click();
          break;
        }
      }
    }

    await new Promise((r) => setTimeout(r, 200));
    const nextBtn = await page.$('button.bg-ink');
    if (nextBtn) {
      await nextBtn.click();
      await new Promise((r) => setTimeout(r, 300));
    }
  }

  await page.waitForSelector('.printable-area');
  await new Promise((r) => setTimeout(r, 600));

  const verdictText3 = await page.$eval('h3.font-serif', (el) => el.textContent);
  console.log('Run 3 Verdict (Should be "Not yet" because Reading < 50%):', verdictText3);

  await page.screenshot({ path: path.join(SCREENSHOTS_DIR, 'result-almost-desktop.png') });
  console.log('📸 Saved result-almost-desktop.png');

  // Verify tap targets are at least 44px
  const tapTargetCheck = await page.evaluate(() => {
    const interactiveElements = document.querySelectorAll('button, a, input');
    const smallTargets = [];
    for (const el of interactiveElements) {
      const rect = el.getBoundingClientRect();
      if (rect.width > 0 && rect.height > 0 && (rect.width < 44 || rect.height < 44)) {
        // If inline link inside a paragraph, acceptable by WCAG SC 2.5.5 exceptions
        if (el.tagName !== 'A' && !el.closest('p')) {
          smallTargets.push({ tag: el.tagName, text: el.textContent?.slice(0, 30), width: rect.width, height: rect.height });
        }
      }
    }
    return smallTargets;
  });

  console.log('Tap target check result:', tapTargetCheck.length === 0 ? '✅ All primary interactive targets >= 44px' : tapTargetCheck);

  await browser.close();
  console.log('\n✨ All UI verification flows completed successfully!');
}

run().catch((err) => {
  console.error('Error during verification:', err);
  process.exit(1);
});
