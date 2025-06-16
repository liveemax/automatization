'use client'

import { useState } from "react";
import { Button } from "@mui/material";

import { browserClose, checkBrowserStatus } from "@/helpers/utils/browser/utils";
import { LOCALSTORAGE_PATH } from "@/helpers/constants/constants";

interface IBrowserStatus {}


export default function BrowserStatus ({
}:IBrowserStatus) {
    const [browserStatus, setBrowserStatus] = useState('')
    const [error, setError] = useState('')

    const onBrowserClose  = () => {
      browserClose(setBrowserStatus)
    }

    const onBrowserOpen = () => {
      checkBrowserStatus(setBrowserStatus,setError,localStorage.getItem(LOCALSTORAGE_PATH.chromePath))
    }

  return <div style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto' }}>
      {/* Error Display */}
      {error && (
        <div style={{
          padding: '10px',
          backgroundColor: '#f8d7da',
          color: '#721c24',
          border: '1px solid #f5c6cb',
          borderRadius: '4px',
          marginBottom: '20px'
        }}>
          {error}
        </div>
      )}
  
        {/* Browser Status */}
        <div style={{ 
          marginBottom: '30px', 
          padding: '15px', 
          backgroundColor: browserStatus?.connected ? '#d4edda' : '#f8d7da',
          border: `1px solid ${browserStatus?.connected ? '#c3e6cb' : '#f5c6cb'}`,
          borderRadius: '8px' 
        }}>
          <h3>Browser Status</h3>
          <p>
            Status: <strong>{browserStatus?.connected ? 'Connected' : 'Disconnected'}</strong>
            {browserStatus?.totalTabs && ` | Tabs: ${browserStatus.totalTabs}`}
          </p>
          <p style={{ fontSize: '12px', color: '#666' }}>
            To connect to existing Chrome: <code>chrome --remote-debugging-port=9222</code>
          </p>
          <button 
            onClick={onBrowserOpen}
            style={{ padding: '5px 10px', fontSize: '12px' }}
          >
            Run or refresh browser
          </button>
          <Button 
            onClick={onBrowserClose}
            style={{ padding: '5px 10px', fontSize: '12px' }}
          >
            Close
          </Button>
        </div>
      </div>
};
