import { NextResponse } from 'next/server';
import { getBrowser } from '../../../helpers/utils/browser/browser-manager';

const browser = await getBrowser();

// export default async function handler(req, res) {
//   // Set CORS headers
//   res.setHeader('Access-Control-Allow-Origin', '*');
//   res.setHeader('Access-Control-Allow-Methods', 'GET, POST, DELETE, OPTIONS');
//   res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

//   // Handle preflight request
//   if (req.method === 'OPTIONS') {
//     res.status(200).end();
//     return;
//   }

//   try {
//     const browser = await getBrowser();

//     switch (req.method) {
//       case 'GET':
//         // List all tabs
//         const pages = await browser.pages();
//         const tabs = await Promise.all(
//           pages.map(async (page, index) => {
//             try {
//               return {
//                 id: index,
//                 url: page.url(),
//                 title: await page.title(),
//                 active: !page.isClosed()
//               };
//             } catch (error) {
//               return {
//                 id: index,
//                 url: 'about:blank',
//                 title: 'Unknown',
//                 active: false
//               };
//             }
//           })
//         );
        
//         return res.status(200).json({ success: true, tabs });

//       case 'POST':
//         // Create new tab
//         const { url } = req.body;
        
//         if (!url) {
//           return res.status(400).json({ 
//             success: false, 
//             message: 'URL is required' 
//           });
//         }

//         const newPage = await browser.newPage();
//         await newPage.setViewport({ width: 1920, height: 1080 });
        
//         try {
//           await newPage.goto(url, { 
//             waitUntil: 'networkidle0',
//             timeout: 30000 
//           });
          
//           const title = await newPage.title();
//           return res.status(200).json({
//             success: true,
//             message: 'Tab created successfully',
//             tab: {
//               url: newPage.url(),
//               title
//             }
//           });
//         } catch (error) {
//           await newPage.close();
//           throw error;
//         }

//       case 'DELETE':
//         // Close tab
//         const { tabIndex } = req.body;
        
//         if (typeof tabIndex !== 'number') {
//           return res.status(400).json({ 
//             success: false, 
//             message: 'Tab index is required and must be a number' 
//           });
//         }

//         const allPages = await browser.pages();
        
//         if (tabIndex >= 0 && tabIndex < allPages.length) {
//           await allPages[tabIndex].close();
//           return res.status(200).json({ 
//             success: true, 
//             message: 'Tab closed successfully' 
//           });
//         } else {
//           return res.status(400).json({ 
//             success: false, 
//             message: 'Invalid tab index' 
//           });
//         }

//       default:
//         res.setHeader('Allow', ['GET', 'POST', 'DELETE']);
//         return res.status(405).json({ 
//           error: 'Method Not Allowed',
//           message: `Method ${req.method} is not allowed for this endpoint`
//         });
//     }
//   } catch (error) {
//     console.error('Tab management error:', error);
//     return res.status(500).json({
//       success: false,
//       error: 'Internal Server Error',
//       message: error.message || 'Failed to manage tabs'
//     });
//   }
// }


export async function GET() {
    const pages = await browser.pages();
    const tabs = await Promise.all(
      pages.map(async (page, index) => {
        try {
          return {
            id: index,
            url: page.url(),
            title: await page.title(),
            active: !page.isClosed()
          };
        } catch (error) {
          return {
            id: index,
            url: 'about:blank',
            title: 'Unknown',
            active: false
          };
        }
      })
    );
    
    
    return NextResponse.json(
          { 
            success: true,
            tabs
           },
          { status: 200 }
    );
}