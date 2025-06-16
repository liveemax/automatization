import { NextResponse } from 'next/server';
import { closeBrowser, getBrowser } from '../../../lib/browser-manager';

export async function GET(req) {
  try {
    const browser = await closeBrowser();

    return NextResponse.json(
      { 
        success: true,
        connected: browser.isConnected(),
        totalTabs: pages.length,
        browserVersion: await browser.version(),
        message: 'Browser is connected and ready'
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