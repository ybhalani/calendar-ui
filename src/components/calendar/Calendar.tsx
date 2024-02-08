import React, {useEffect, useState} from 'react';
import './Calendar.css';
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faArrowLeft, faArrowRight} from '@fortawesome/free-solid-svg-icons'
import Days from "../days/Days";
import {Event} from "../../types/types";

const Calendar = () => {
    const staticDays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const [currentMonth, setCurrentMonth] = useState(new Date());
    const [events, setEvents] = useState<Event[]>([]);

    useEffect(() => {
        fetch('http://localhost:3001/events')
            .then(async response => setEvents(await response.json()));
    }, []);

    return (
        <div className="calendar" data-testid={'calendar-component'}>
            <div className="header">
                <span className={'arrows'} data-testid={'arrow-left'}
                    onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1))}>
                    <FontAwesomeIcon icon={faArrowLeft}/>
                </span>
                <h1>{currentMonth.toLocaleDateString('en-US', {month: 'long', year: 'numeric'})}</h1>
                <span className={'arrows'} data-testid={'arrow-right'}
                    onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1))}>
                    <FontAwesomeIcon icon={faArrowRight}/>
                </span>
            </div>
            <div className="days week-days">{staticDays.map((day, i) => <div key={'week-days-'+ i} className="day">{day}</div>)}</div>
            <Days currentMonth={currentMonth} events={events} />
        </div>
    );
};

export default Calendar;