import { NextResponse } from "next/server";
import { closeBrowser, getBrowser } from "@/helpers/utils/browser/browser-manager";
import { delay, loadMoreClick } from "@/helpers/utils/utils";

export async function POST(req:any) {
    const {alphabotProject, chromePath} = await req.json();

    try {
        const browser = await getBrowser(JSON.parse(chromePath));
        // Create a new browser context
        const context = await browser.createBrowserContext();
        // Create a new page inside context.
        const page = await context.newPage();
        // ... do stuff with page ...
        await page.goto(alphabotProject);

        await page.waitForNavigation({
            waitUntil: "networkidle0",
        });

        await page.locator("body").scroll({
            scrollTop: 700,
        });
        await delay(100);
    
        await page.locator("body").scroll({
            scrollTop: 700,
        });

        const hr = await loadMoreClick(page);

        await closeBrowser(browser);

        return NextResponse.json(
            { 
                success: true,
                hrefs:hr
            },
            { status: 200 }
        );
    } catch (error) {
        console.error("Browser status error:", error);

        return NextResponse.json(
            { 
                success: false,
                connected: false,
                message: "Failed to connect to browser"
            },
            { status: 500 }
        );
    }
}