import React from 'react';
import { getByTestId, render } from '@testing-library/react';
import Days from './Days';
import { DaysProps } from '../../types/types';

const mockProps: DaysProps = {
    currentMonth: new Date(2022, 0, 1),
    events: []
};

it('renders without crashing', () => {
  render(<Days {...mockProps} />);
});

it('renders the correct number of days for January 2022', () => {
  const { getAllByTestId } = render(<Days {...mockProps} />);

  const day = getAllByTestId('day');
  expect(day.length).toBe(35);
});