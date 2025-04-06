// EDIT THIS FILE TO COMPLETE ASSIGNMENT QUESTION 1
const { test, expect } = require('@playwright/test');

let timestamps = [];

test('validate desc sort of latest 100 Hacker News articles', async ({ page }) => {

  await page.goto('https://news.ycombinator.com/');
  await page.getByText('new', { exact: true }).click();

  while (timestamps.length < 100) {
    console.log('Total so far:', timestamps.length);

    const spans = await page.locator('tr td.subtext span.subline span.age[title]').all();
    for (const span of spans) {
      const title = await span.getAttribute('title');
      if (title) timestamps.push(title);
    }

    // early exit preventing additional click of the "More" button
    if (timestamps.length >= 100) {
      break;
    }

    const moreButton = page.getByText('More', { exact: true });
    await moreButton.waitFor({ state: 'visible' });
    await moreButton.click();
    await page.waitForTimeout(500);
    await page.waitForSelector('tr.athing', { state: 'visible' });
  }

  timestamps = timestamps.slice(0, 100);

  let validation = true; // ideally this would start as false, would rather definitely set to true once validated
  for (let i = 0; i < timestamps.length - 1; i++) {
    // Example value: "2025-04-05T16:25:13 1743870313"
    const currentTimestamp = new Date(timestamps[i].split(' ')[0]).getTime();
    const nextTimestamp = new Date(timestamps[i + 1].split(' ')[0]).getTime();
    
    console.log('Current timestamp:', currentTimestamp);
    if (currentTimestamp < nextTimestamp) {
      validation = false;
      break;
    }
  }
  
  console.log('Final timestamps length:', timestamps.length);
  
  expect(validation).toBe(true);
  await page.close();
});