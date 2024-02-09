import React from 'react';
import { render, act } from '@testing-library/react';
import Calendar from './Calendar';

let fetchMock: any = undefined;

jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useNavigate: () => jest.fn,
    useParams: () => ({ year: '2024', month: '02' }),
}));

jest.mock('../days/Days', () => {
    return function Days() {
        return (<><div className="days"></div></>);
    };
});

beforeEach(() => {
    return fetchMock = jest.spyOn(global, "fetch")
        .mockImplementation(() => Promise.resolve(new Response(JSON.stringify({ events: [] }))));
});

afterEach(() => {
    jest.restoreAllMocks();
});

it('renders without crashing', () => {
    const { getByText } = render(<Calendar />);
    const currentMonth = new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
    expect(getByText(currentMonth)).toBeInTheDocument();
});

it('calls fetch on mount', () => {
    render(<Calendar />);
    expect(global.fetch).toHaveBeenCalledTimes(1);
    expect(global.fetch).toHaveBeenCalledWith('https://amock.io/api/yashbhalani/events');
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