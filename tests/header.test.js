const pup = require('puppeteer');
const sessionFactory = require('./factories/session.factory');
const userFactory = require('./factories/user.factory');

let browser, page;

beforeEach(async () => {
    browser = await pup.launch({});
    page = await browser.newPage();
    await page.goto('http://localhost:3000/');
});

afterEach(async () => {
    await browser.close();
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
    const user = await userFactory();
    const { session, sig } = sessionFactory(user);

    await page.setCookie({ name: 'session', value: session });
    await page.setCookie({ name: 'session.sig', value: sig });
    await page.goto('http://localhost:3000/');

    const anchor = 'a[href="/auth/logout"]';
    await page.waitFor(anchor);

    const text = await page.$eval(anchor, el => el.innerHTML);
    expect(text).toEqual('Logout');
});