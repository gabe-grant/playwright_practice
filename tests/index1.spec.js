const { test } = require('@playwright/test');


/*

  Here I felt I was on the right track, but I realized that I was evaluatimg age based on the how many minutes/hours ago that the articles were posted. But this didn't seem EXACTLY, like the README instructions suggested. 

*/


let articles = [];

test('desc sort of latest 100 Hacker News articles', async ({ page }) => {
  test.setTimeout(60000);

  await page.goto('https://news.ycombinator.com/');
  await page.getByText('new', { exact: true }).click();
  await page.waitForSelector('tr.athing', { state: 'visible' });

  while (articles.length < 100) {
    const newRows = await findSomeMore({ page });
    const uniqueNewRows = newRows.filter(row => {
      const rowId = row.locator('span.rank').innerText(); // Use rank as unique ID
      return !articles.some(existing => 
        existing.locator('span.rank').innerText() === rowId
      );
    });
    console.log('New rows found:', uniqueNewRows.length, 'Total so far:', articles.length);
    articles.push(...uniqueNewRows);
    if (articles.length >= 100) {
      break;
    }
    if (uniqueNewRows.length === 0 && articles.length > 0) {
      console.log('No new unique rows found, stopping');
      break;
    }
    const moreButton = page.getByText('More', { exact: true });
    await moreButton.waitFor({ state: 'visible' });
    await moreButton.click();
    await page.waitForTimeout(1000);
    await page.waitForSelector('tr.athing', { state: 'visible' });
  }

  articles = articles.slice(0, 100);

  const articlesWithTime = await Promise.all(
    articles.map(async row => {
      const time = await row.locator('td.subtext span.age').innerText();
      return { row, time };
    })
  );
  articlesWithTime.sort((a, b) => a.time.localeCompare(b.time));
  articles = articlesWithTime.map(item => item.row);

  console.log('Final articles length:', articles.length);
  console.log('articles', articles);

  await page.close();
});

const findSomeMore = async ({ page }) => {
  return await page.locator('tr.athing').all();
};