const pup = require('puppeteer');

const sessionFactory = require('../factories/session.factory');
const userFactory = require('../factories/user.factory');

class ExtendedPage {
    static async build() {
        const browser = await pup.launch({
            headless: true,
        });
        const page = await browser.newPage();
        const extendedPage = new ExtendedPage(page);

        return new Proxy(extendedPage, {
            get: function (target, property) {
                return extendedPage[property]
                    || browser[property]
                    || page[property]
            }
        })
    }

    constructor(page) {
        this.page = page;
    }

    async login() {
        const user = await userFactory();
        const { session, sig } = sessionFactory(user);

        await this.page.setCookie({ name: 'session', value: session });
        await this.page.setCookie({ name: 'session.sig', value: sig });
        await this.page.goto('http://localhost:3000/');
    }
}

module.exports = ExtendedPage;