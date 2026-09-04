import puppeteer from 'puppeteer';

async function testInquiry() {
    const browser = await puppeteer.launch({
        headless: true,
        channel: 'chrome',
        args: ['--no-sandbox', '--disable-gpu']
    });

    const page = await browser.newPage();
    await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36');
    await page.goto('https://www.sepulsa.com/transaction/pln?type=postpaid', { waitUntil: 'domcontentloaded', timeout: 30000 });

    const inputSelector = 'input[type="tel"], input[type="text"]';
    await page.waitForSelector(inputSelector, { timeout: 10000 });
    await page.type(inputSelector, '521030876799', { delay: 30 });

    await page.evaluate(() => {
        const buttons = Array.from(document.querySelectorAll('button'));
        const submitBtn = buttons.find(b => b.innerText.includes('Lanjutkan') && !b.disabled);
        if (submitBtn) submitBtn.click();
    });

    await new Promise(r => setTimeout(r, 4000));

    const text = await page.evaluate(() => document.body.innerText);
    console.log('=== RAW TEXT FROM SEPULSA ===');
    console.log(text);
    console.log('=============================');

    await browser.close();
}

testInquiry().catch(console.error);
