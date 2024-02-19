import React from 'react';
import Calendar from "./components/calendar/Calendar";
import {Navigate, Route, Routes} from "react-router-dom";

/**
 * App Component
 * The component ensures that users are always redirected to a path with the current year and month when they visit the root path.
 * It uses dynamic routing to display the Calendar component for specific year and month combinations.
 * It relies on React Router to handle navigation and component rendering based on the URL.
 * */
function App() {
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();
    const currentMonth = currentDate.getMonth() + 1;

  return (
      <div className="App">
          <Routes>
              {/*path="/": Matches the root path of the application.*/}
              {/*element={<Navigate to={/currentYear/{currentMonth}} replace />}: Redirects the user to the path constructed using the current year and month (e.g., /2024/2 for February 2024). */}
              {/*The replace prop ensures that the current history entry is replaced, preventing a back button from returning to the root path.*/}
              <Route path="/" element={<Navigate to={`/${currentYear}/${currentMonth}`} replace />} />
              {/*path="/:year/:month": Matches dynamic paths with a year and month segment (e.g., /2024/2).*/}
              {/*element={<Calendar />}: Renders the Calendar component, passing the captured year and month values as props.*/}
              <Route path="/:year/:month" element={<Calendar />} />
          </Routes>
      </div>
  );
}

export default App;
