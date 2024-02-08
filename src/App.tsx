import React from 'react';
import './App.css';
import Calendar from "./components/calendar/Calendar";

function App() {
  return (
    <div className="App" data-testid="app-component">
        <Calendar />
    </div>
  );
}

export default App;
