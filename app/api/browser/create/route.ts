import { NextResponse } from 'next/server';
import { getBrowser } from '../../../lib/browser-manager';

export async function POST(req) {
  const data = await req.json();

  try {
    const browser = await getBrowser(data.executablePath);
    const pages = await browser.pages();

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