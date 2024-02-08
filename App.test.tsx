import React from 'react';
import { render, screen } from '@testing-library/react';
import App from './App';

test('renders App component', () => {
  render(<App />);
  const appElement = screen.getByTestId('app-component');
  expect(appElement).toBeInTheDocument();
});

test('renders Calendar component inside App', () => {
  render(<App />);
  const calendarElement = screen.getByTestId('calendar-component');
  expect(calendarElement).toBeInTheDocument();
});