import React from 'react';
import { render, act, getByTestId } from '@testing-library/react';
import Calendar from './Calendar';
import { Event } from "../../types/types";

let fetchMock: any = undefined;

beforeEach(() => {
    return fetchMock = jest.spyOn(global, "fetch")
        .mockImplementation(() => Promise.resolve(new Response(JSON.stringify([]))));
});

afterEach(() => {
    jest.restoreAllMocks();
});

it('renders without crashing', async () => {
    await act(async () => {
        render(<Calendar />);
    });
});

it('calls fetch on mount', async () => {
    await act(async () => {
        render(<Calendar />);
    });

    expect(global.fetch).toHaveBeenCalledTimes(1);
    expect(global.fetch).toHaveBeenCalledWith('http://localhost:3001/events');
});

it('displays the current month and year', async () => {
    const { getByText } = render(<Calendar />);
    const currentMonth = new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
    expect(getByText(currentMonth)).toBeInTheDocument();
});

it('changes the month when left arrow is clicked', async () => {
    const { getByText, getByTestId } = render(<Calendar />);
    const currentMonth = new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
    const leftArrow = getByTestId('arrow-left');
    act(() => {
        leftArrow.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    });
    const previousMonth = new Date(new Date().getFullYear(), new Date().getMonth() - 1).toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
    expect(getByText(previousMonth)).toBeInTheDocument();
});

it('changes the month when right arrow is clicked', async () => {
    const { getByText, getByTestId } = render(<Calendar />);
    const currentMonth = new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
    const rightArrow = getByTestId('arrow-right');
    act(() => {
        rightArrow.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    });
    const nextMonth = new Date(new Date().getFullYear(), new Date().getMonth() + 1).toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
    expect(getByText(nextMonth)).toBeInTheDocument();
});