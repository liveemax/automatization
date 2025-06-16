import puppeteer from 'puppeteer-core';

let globalBrowser = null;

export async function getBrowser(executablePath) {
  console.log(globalBrowser,'globalBrowserglobalBrowserglobalBrowserglobalBrowser');
  
  if (globalBrowser && globalBrowser.isConnected()) {
    return globalBrowser;
  }

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

    globalBrowser = browser;
    return globalBrowser;
  } catch (error) {
    console.error('Failed to get browser:', error);
    throw new Error('Could not connect to or launch browser');
  }
}

export async function closeBrowser() {
  if (globalBrowser) {
    try {
      await globalBrowser.close();
    } catch (error) {
      console.log('Browser already closed');
    }
    globalBrowser = null;
  }
}