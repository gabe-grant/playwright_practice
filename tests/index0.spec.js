// EDIT THIS FILE TO COMPLETE ASSIGNMENT QUESTION 1
const { test, expect } = require('@playwright/test');
const { json } = require('stream/consumers');

/*

  Here I was trying to find the value of the rank to act as some sort of counter

*/

let rank100 = [];

test('desc sort of latest 100 Hacker News articles', async ({ page }) => {
  await page.goto('https://news.ycombinator.com/');
  await page.getByText('new', { exact:true }).click();

  // const rowLocator = page.locator('tr');
  // const tr = await page.locator('.subtext').locator('subline').getAttribute('id');
  
  while (rank100.length < 100) {
    const newRows = await findSomeMore({ page });
    rank100 = rank100.concat(newRows);
    if (rank100.length < 100) await page.getByText('More', { exact: true }).click();
    else break;
  }
  
  // need to get time values of title with getAttribute
  rank100 = rank100.slice(0, 100);
  console.log('rank100 length', rank100.length);
  console.log('rank100', rank100);
  
  // console.log('tr', tr);
  
  await page.close();
});

const findSomeMore =  async ({ page }) => {
  return rank100 = await page.locator('.athing.submission').locator('span.rank').all();
}