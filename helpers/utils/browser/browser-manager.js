import puppeteer from 'puppeteer-core';

export async function getBrowser(executablePath) {
  try {
    // If no existing browser found, launch with puppeteer
    
    const browser = await puppeteer.launch({
      headless: false, // Set to true if you want headless
      defaultViewport: null,
      executablePath:JSON.parse(executablePath),
      args: [
        '--remote-debugging-port=9222',
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage'
      ]
    });

    return browser;
  } catch (error) {
    console.error('Failed to get browser:', error);
    throw new Error('Could not connect to or launch browser');
  }
}

export async function closeBrowser(browser) {
  if (browser) {
    try {
      await browser.close();
    } catch (error) {
      console.log('Browser already closed');
    }
  }
}