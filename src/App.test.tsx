import React from 'react';
import { render, screen } from '@testing-library/react';
import App from './App';
import { Routes, Route, BrowserRouter } from 'react-router-dom';

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => jest.fn,
}));

test('renders App component', () => {
  render(<BrowserRouter><Routes><Route path="*" element={<App/>}/></Routes></BrowserRouter>);
  const appElement = screen.getByTestId('app-component');
  expect(appElement).toBeInTheDocument();
});

test('renders Calendar component inside App', () => {
  render(<BrowserRouter><Routes><Route path="*" element={<App/>}/></Routes></BrowserRouter>);
  const calendarElement = screen.getByTestId('calendar-component');
  expect(calendarElement).toBeInTheDocument();
});