import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.js';
import { AuthProvider } from './contexts/AuthContext.js';
import { ThemeProvider } from './contexts/ThemeContext.js';

console.log("index.js script started.");

const rootElement = document.getElementById('root');

if (!rootElement) {
  console.error("Fatal Error: Root element #root not found in the DOM. React application cannot be mounted.");
  const errorDiv = document.createElement('div');
  errorDiv.innerHTML = `<div style="color: red; background: white; padding: 20px; border-radius: 8px; margin: 20px auto; text-align: center; font-weight: bold; font-family: sans-serif; max-width: 600px;">Critical Error: Application root element (#root) is missing from the page. The application cannot load.</div>`;
  document.body.prepend(errorDiv); // Prepend to make it visible even if body is styled weirdly
} else {
  try {
    console.log("Attempting to render React application...");
    const root = ReactDOM.createRoot(rootElement);
    root.render(
      <React.StrictMode>
        <ThemeProvider>
          <AuthProvider>
            <App />
          </AuthProvider>
        </ThemeProvider>
      </React.StrictMode>
    );
    console.log("React application render initiated. App should load shortly.");

  } catch (error) {
    console.error("Error during React application rendering:", error);

    const errorDisplay = document.createElement('div');
    errorDisplay.setAttribute('style', `
        position: fixed; 
        top: 10%; 
        left: 50%; 
        transform: translateX(-50%); 
        background-color: #ffebee; 
        color: #c62828; 
        padding: 20px; 
        border: 2px solid #c62828; 
        border-radius: 8px; 
        z-index: 10001; 
        font-family: sans-serif; 
        max-width: 90%;
        width: 500px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.2);
        text-align: left;
    `);
    errorDisplay.innerHTML = `
        <h3 style="margin-top:0; color: #b71c1c; font-size: 1.2em;">Application Initialization Error</h3>
        <p style="font-size: 0.9em; margin-bottom: 10px;">An error occurred while trying to load the application. The page might not work as expected.</p>
        <p style="font-size: 0.8em; background-color: #fce4ec; border: 1px solid #f8bbd0; padding: 8px; border-radius: 4px; word-break: break-all;"><strong>Details:</strong> ${(error as Error).message || 'Unknown error. Check console.'}</p>
        <p style="font-size: 0.8em; margin-top: 15px;">Please check the browser's developer console (press F12) for more technical information and report this issue if it persists.</p>
    `;
    
    if (document.body) {
        document.body.appendChild(errorDisplay);
    } else {
        // Fallback if body isn't available, though unlikely
        rootElement.appendChild(errorDisplay);
    }
  }
}
console.log("index.js script finished processing initial block.");