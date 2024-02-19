import React, {useEffect, useState} from 'react';
import './Calendar.css';
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faArrowLeft, faArrowRight} from '@fortawesome/free-solid-svg-icons'
import Days from "../days/Days";
import {Event} from "../../types/types";
import {useNavigate, useParams} from "react-router-dom";

/**
 * Calendar component
 * The component dynamically fetches events from an API.
 * It handles navigation between months, updating the URL and re-rendering the calendar.
 * It adapts the display of weekdays based on window width.
 * It validates year and month parameters from the URL, redirecting to the current date if invalid.
 * It relies on the Days component to render the individual days and events.
 * */
const Calendar = () => {
    // useNavigate: Used for programmatic navigation within the application.
    const navigate = useNavigate();
    // useParams: Extracts the year and month from the URL parameters.
    const searchParams = useParams();
    const [year, setYear] = useState<number>(Number(searchParams.year));
    const [month, setMonth] = useState<number>(Number(searchParams.month));
    const staticDays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

    const [weekDays, setWeekDays] = useState(staticDays);
    const [currentMonth, setCurrentMonth] = useState(new Date(Number(searchParams.year), Number(searchParams.month) - 1));
    const [events, setEvents] = useState<Event[]>([]);

    const [width, setWidth] = useState(window.innerWidth);

    useEffect(() => {
        const handleResize = () => setWidth(window.innerWidth);
        window.addEventListener('resize', handleResize);
        setWeekDays(width <= 768 ? ['S', 'M', 'T', 'W', 'T', 'F', 'S'] : staticDays)
        return () => window.removeEventListener('resize', handleResize);
    }, [window.innerWidth]);

    // Get year and month from parameters
    // The component extracts year and month from URL parameters, validates them, and redirects to the current date if invalid.
    useEffect(() => {
        const initialYear = searchParams.year;
        const initialMonth = Number(searchParams.month);

        if (initialYear && initialMonth) {
            const minYear = 1900;
            const maxYear = 2100;
            if (
                isNaN(Number(initialYear)) ||
                parseInt(initialYear, 10) < minYear ||
                parseInt(initialYear, 10) > maxYear ||
                isNaN(Number(initialMonth)) ||
                parseInt(String(initialMonth), 10) < 1 ||
                parseInt(String(initialMonth), 10) > 12
            ) {
                // Redirect to current date if invalid
                const today = new Date();
                window.location.replace(`/${today.getFullYear()}/${today.getMonth() + 1}`);
                return;
            }

            setYear(parseInt(initialYear, 10));
            setMonth(parseInt(String(initialMonth), 10));
        }
    }, [searchParams]);

    // This useEffect fetches event data from an API and stores it in the events state.
    useEffect(() => {
        fetch('https://amock.io/api/yashbhalani/events')
            .then(async response => await response.json()
                .then(data => typeof data.events !== "undefined"
                    ? setEvents(data.events)
                    : setEvents([])
                )
            )
            .catch((e) => console.log('API failed to fetch event data', e));
    }, []);

    // logic to move to the next month
    const forward = () => {
        const y = currentMonth.getFullYear();
        const m = currentMonth.getMonth();
        if (m === 11) {
            setCurrentMonth(new Date(y + 1, 0))
            navigate(`/${y + 1}/${1}`)
        } else {
            setCurrentMonth(new Date(y, m + 1))
            navigate(`/${y}/${m + 2}`)
        }
    }

    // logic to move to the previous month
    const backward = () => {
        const y = currentMonth.getFullYear();
        const m = currentMonth.getMonth();
        if (m <= 0) {
            setCurrentMonth(new Date(y - 1, 11))
            navigate(`/${y - 1}/${12}`)
        } else {
            setCurrentMonth(new Date(y, m - 1))
            navigate(`/${y}/${m}`)
        }
    }

    return (
        <div className="calendar" data-testid={'calendar-component'}>
            {/* Header with navigation arrows and month/year display */}
            <div className="header">
                <span className={'arrows'} data-testid={'arrow-left'} onClick={() => backward()}><FontAwesomeIcon icon={faArrowLeft}/></span>
                <h1>{currentMonth.toLocaleDateString('en-US', {month: 'long', year: 'numeric'})}</h1>
                <span className={'arrows'} data-testid={'arrow-right'} onClick={() => forward()}><FontAwesomeIcon icon={faArrowRight}/></span>
            </div>
            {/* Render weekdays */}
            <div className="days week-days">{weekDays.map((day, i) => <div key={'week-days-'+ i} className="day">{day}</div>)}</div>
            {/* Render days of the month with events */}
            <Days currentMonth={currentMonth} events={events} />
        </div>
    );
};

export default Calendar;