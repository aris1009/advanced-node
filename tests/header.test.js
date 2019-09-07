const Page = require('./helpers/page');

let page;

beforeEach(async () => {
    page = await Page.build();
    await page.goto('http://localhost:3000/');
});

afterEach(async () => {
    await page.close();
})

test('The header has correct text', async () => {
    const text = await page.$eval('a.brand-logo', el => el.innerHTML);

    expect(text).toEqual('Blogster');
});

test('Clicking log in starts auth flow', async () => {
    await page.click('.right a');
    const url = page.url();

    expect(url).toMatch(new RegExp('//accounts.google.com/'));
});

test('Logged in, must show Logout button', async () => {
    await page.login();

    const anchor = 'a[href="/auth/logout"]';
    await page.waitFor(anchor);
    const text = await page.$eval(anchor, el => el.innerHTML);

    expect(text).toEqual('Logout');
});