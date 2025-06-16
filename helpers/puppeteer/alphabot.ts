import puppeteer from 'puppeteer';

export const alphabotChecker = async ({browserPath}) => {
    console.log(browserPath,'browserPath');
    
    const browser = await puppeteer.launch({executablePath: browserPath});
    const page = await browser.newPage();
    await page.goto('https://example.com');
    await page.screenshot({ path: 'example.png' });
  
    await browser.close();
}


// (async () => {
//     const browser = await puppeteer.launch();
//     const browserWSEndpoint = browser.wsEndpoint();
//     browser.disconnect(); // Disconnect from the browser, but don't close it
//     console.log(browserWSEndpoint); // Communicate the Websocket URL to the client-side
//     // example output: ws://127.0.0.1:55620/devtools/browser/e62ec4c8-1f05-42a1-86ce-7b8dd3403f91
// })();