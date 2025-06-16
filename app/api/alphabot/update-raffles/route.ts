import { NextResponse } from 'next/server';
import { getBrowser } from '../../../lib/browser-manager';

export const loadMoreClick = async (page:any) => {
  try{
    const button = await page.waitForSelector("::-p-text(Load moreasdf)",{timeout:3000});

    console.log(button,'button');
    if (button) {
        await button.click();
    }
  }
  catch {
    console.log('event selector not found')
  }
}

export async function POST(req) {
  const data = await req.json();

  console.log(data,'data');
  

  try {
    const browser = await getBrowser();
    // Create a new browser context
    const context = await browser.createBrowserContext();
    // Create a new page inside context.
    const page = await context.newPage();
    // ... do stuff with page ...
    await page.goto(data.alphabotProject);

    await page.waitForNavigation({
      waitUntil: 'networkidle0',
    });

    await page.locator('body').scroll({
      scrollTop: 700,
    });

    await loadMoreClick(page)

    


    // Dispose context once it's no longer needed.
    // await context.close();
    
    return NextResponse.json(
      { 
        success: true,
       },
      { status: 200 }
    );
  } catch (error) {
    console.error('Browser status error:', error);

    return NextResponse.json(
      { 
        success: false,
        connected: false,
        message: 'Failed to connect to browser'
       },
      { status: 500 }
    );
  }
}