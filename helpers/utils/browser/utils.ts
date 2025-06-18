import { API } from "@/helpers/constants/constants";

export const checkBrowserStatus = async (setBrowserStatus:any, showError:any, executablePath:string) => {
    try {
      const response = await fetch(API.browserCreate, {
        method: 'POST',
        body: JSON.stringify({executablePath})
      });

      const data = await response.json();
      setBrowserStatus(data);
      
      if (!data.success) {
        showError(data.message);
      }
    } catch (error:any) {
      showError('Failed to check browser status: ' + error.message);
      setBrowserStatus({ success: false, connected: false });
    }
  };

export const browserClose = async (setBrowserStatus:any) => {
      setBrowserStatus({});

        await fetch(API.browserClose, {
          method: 'GET',
        });
  }