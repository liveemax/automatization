import puppeteer from "puppeteer";
import chromium from "@sparticuz/chromium";

export async function getBrowser(executableP) {
    try {
    // If no existing browser found, launch with puppeteer

        const chrom = await chromium.executablePath();

        console.log(chrom,"chrom");
    
        const browser = await puppeteer.launch({
            headless: false, // Set to true if you want headless
            defaultViewport: null,
            args: [
                "--remote-debugging-port=9222",
                "--no-sandbox",
                "--disable-setuid-sandbox",
                "--disable-dev-shm-usage"
            ],
            ...executableP?{executablePath:executableP}:{}
        });

        return browser;
    } catch (error) {
        console.error("Failed to get browser:", error);
        throw new Error("Could not connect to or launch browser");
    }
}

export async function closeBrowser(browser) {
    if (browser) {
        try {
            await browser.close();
        } catch (error) {
            console.log("Browser already closed");
        }
    }
}