import { NextResponse } from 'next/server';
import { closeBrowser, getBrowser } from '@/helpers/utils/browser/browser-manager';
import { MAX_DELAY, MIN_DELAY } from '@/helpers/constants/constants';
import { delay } from '@/helpers/utils/utils';

export const getSelectorLinks = async (page:any) => {
  try{
  const h = await page.evaluate((rest:any) => {
    const hrefs:Array<string> = []

    const links = document.querySelectorAll('.MuiPaper-root > .MuiLink-root') as any;
    links.forEach((link:{href:string})=>{
      const href = link?.href
      
      if(href){
        hrefs.push(href)
      }
    })

    return Promise.resolve(hrefs);
  });

  return h
}
catch (error) {
  console.log(error,'error');
}
  
}

export const loadMoreClick: (page:any)=>Promise<Array<string>> = async (page:any) => {
  const newPage = page;

  try{
    await delay(MAX_DELAY)
    const button = await newPage.waitForSelector("::-p-text(Load more)",{timeout:MIN_DELAY});

    if (button) {
      await newPage
      .locator('::-p-aria([name="Load more"][role="button"])')
      .click();
    }

   return await loadMoreClick(newPage)
  }
  catch {
    console.log('event selector not found')

    return await getSelectorLinks(newPage)
  }
}

export async function POST(req:any) {
  const {alphabotProject, chromePath} = await req.json();

  try {
    const browser = await getBrowser(chromePath);
    // Create a new browser context
    const context = await browser.createBrowserContext();
    // Create a new page inside context.
    const page = await context.newPage();
    // ... do stuff with page ...
    await page.goto(alphabotProject);

    await page.waitForNavigation({
      waitUntil: 'networkidle0',
    });

    await page.locator('body').scroll({
      scrollTop: 700,
    });
    await delay(100)
    
    await page.locator('body').scroll({
      scrollTop: 700,
    });

    const hr = await loadMoreClick(page)

    await closeBrowser(browser);

    return NextResponse.json(
      { 
        success: true,
        hrefs:hr
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