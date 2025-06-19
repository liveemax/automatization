import { MAX_DELAY, MIN_DELAY } from "../constants/constants";

export const delay = (time:number) => {
    return new Promise(function(resolve) { 
        setTimeout(resolve, time);
    });
};

export const getSelectorLinks = async (page:any) => {
    try{
        const h = await page.evaluate(() => {
            const hrefs:Array<string> = [];
 
            const links = document.querySelectorAll(".MuiPaper-root > .MuiLink-root") as any;
            links.forEach((link:{href:string}) => {
                const href = link?.href;
       
                if(href){
                    hrefs.push(href);
                }
            });
 
            return Promise.resolve(hrefs);
        });
 
        return h;
    } catch (error) {
        console.log(error,"error");
    }
   
};
 
export const loadMoreClick: (page:any)=>Promise<Array<string>> = async (page:any) => {
    const newPage = page;
 
    try{
        await delay(MAX_DELAY);
        const button = await newPage.waitForSelector("::-p-text(Load more)",{timeout:MIN_DELAY});
 
        if (button) {
            await newPage
                .locator("::-p-aria([name=\"Load more\"][role=\"button\"])")
                .click();
        }
 
        return await loadMoreClick(newPage);
    } catch {
        console.log("event selector not found");
 
        return await getSelectorLinks(newPage);
    }
};
 