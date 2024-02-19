import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import {BrowserRouter, Route, Routes} from "react-router-dom";

/**
 * Creates a React root element within the DOM element with the ID "root".
 * This root element serves as the starting point for rendering React components.
 * */
const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

root.render(
    // The BrowserRouter enables client-side routing, allowing navigation between different views within the same application without full page reloads.
    <BrowserRouter>
        {/*The Routes component provides a mechanism to define routes and map them to corresponding components to render based on the URL path.*/}
        <Routes>
            {/*The single Route with the wildcard path ("*") ensures that any URL not explicitly defined elsewhere will still match and render the App component. This acts as a catch-all route.*/}
            <Route path="*" element={<App/>}/>
        </Routes>
    </BrowserRouter>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
