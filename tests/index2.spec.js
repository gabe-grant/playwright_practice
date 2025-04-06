const { test } = require('@playwright/test');

/*

  Realizing that the timestamps are acutally what we are evaluating and sorting.
  Also, seeing  what functions were necessary, as I was haviing a lot of trouble getting the script to stop running once it reached 100 articles.

*/

let timestamps = [];

test('desc sort of latest 100 Hacker News articles', async ({ page }) => {
  test.setTimeout(90000);

  await page.goto('https://news.ycombinator.com/');
  await page.getByText('new', { exact: true }).click();
  // await page.waitForSelector('tr.athing', { state: 'visible' });

  while (timestamps.length < 100) {
    // const newRows = await findSomeMore({ page });
    // const uniqueNewRows = newRows.filter(row => {
    //   const rowId = row.locator('span.rank').innerText();
    //   return !timestamps.some(existing => 
    //     existing.locator('span.rank').innerText() === rowId
    //   );
    // });
    // console.log('New rows found:', uniqueNewRows.length, 'Total so far:', timestamps.length);
    console.log('Total so far:', timestamps.length);
    // timestamps.push(...newRows);

    const spans = await page.locator('tr td.subtext span.subline span.age[title]').all();

    for (const span of spans) {
      const title = await span.getAttribute('title');
      if (title) timestamps.push(title);
    }

    if (timestamps.length >= 100) {
      break;
    }
    // if (uniqueNewRows.length === 0 && timestamps.length > 0) {
    //   console.log('No new unique rows found, stopping');
    //   break;
    // }
    const moreButton = page.getByText('More', { exact: true });
    await moreButton.waitFor({ state: 'visible' });
    await moreButton.click();
    await page.waitForTimeout(500);
    await page.waitForSelector('tr.athing', { state: 'visible' });
  }

  timestamps = timestamps.slice(0, 100);

  // const ageOfArticles = await Promise.all(
  //   // console.log('timestamps', timestamps),
  //   timestamps.map(async row => {
  //     const timeElement = row.locator('td.subtext span.age');
  //     const time = (await timeElement.count() > 0) 
  //       ? await timeElement.innerText() 
  //       : 'unknown'; // Fallback for missing time
  //     return { row, time };
  //   })
  // );

  // // Sort with fallback for invalid times
  // ageOfArticles.sort((a, b) => (a.time || '').localeCompare(b.time || ''));
  // timestamps = ageOfArticles.map(item => item.row);

  console.log('Final timestamps length:', timestamps.length);
  
  // console.log('timestamps', timestamps);

  await page.close();
});

const findSomeMore = async ({ page }) => {
  // return await page.locator('tr.athing.submission').all();
  // return await page.locator('tr td.subtext span.subline span.age[title]').all();
  const spans = await page.locator('tr td.subtext span.subline span.age[title]').all();

  for (const span of spans) {
    const title = await span.getAttribute('title');
    if (title) timestamps.push(title);
  }
};