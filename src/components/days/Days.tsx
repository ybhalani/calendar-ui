import React, {useEffect, useState} from 'react';
import {DaysProps, Event} from "../../types/types";


// This line defines a functional component named Days that takes props of type DaysProps. This component is responsible for rendering the days of the calendar month.
const Days: React.FC<DaysProps> = (props: DaysProps) => {
    // Stores the currently selected event, including its week index and the event object itself.
    const [selectedEvent, setSelectedEvent] = useState<{ weekIndex: number | string, event: Event } | null>(null);
    // Stores the index of the currently selected week.
    const [selectedWeekIndex, setSelectedWeekIndex] = useState<number | string | null>(null);
    // A function that calculates the number of days in a given month.
    const daysInMonth = (year: number, month: number) => new Date(year, month + 1, 0).getDate();
    // A function that returns the day of the week on which the first day of a month falls.
    const startOfMonth = (date: Date) => new Date(date.getFullYear(), date.getMonth(), 1).getDay();

    const today = new Date();
    const totalDays = daysInMonth(props.currentMonth.getFullYear(), props.currentMonth.getMonth());
    const startDay = startOfMonth(props.currentMonth);

    // Calculate the total number of days to display, including days from previous and next months
    const totalDisplayDays = 35; // 5 rows of 7 days
    // The number of days from the previous month to display in the calendar.
    const previousMonthDays = startDay === 0 ? 6 : startDay; // Days from previous month
    // The number of days from the next month to display in the calendar.
    const nextMonthDays = totalDisplayDays - totalDays - previousMonthDays; // Days from next month

    // Dates from the previous month
    const previousMonth = new Date(props.currentMonth.getFullYear(), props.currentMonth.getMonth() - 1);
    // The number of days in the previous month.
    const previousMonthTotalDays = daysInMonth(previousMonth.getFullYear(), previousMonth.getMonth());
    // The index of the first day from the previous month to display in the calendar.
    const previousMonthStart = previousMonthTotalDays - previousMonthDays + 1;

    // An array of arrays, where each inner array represents a week of the calendar.
    const weeks: { day: number; month: string; }[][] = [];
    let days = [];

    /**
     * This part of the code calculates the number of days from the previous and next months that need to be displayed in the calendar to fill out the current week.
     * It then creates an array of days, where each day object includes its day number and the month it belongs to ("previous", "current", or "next").
     * Finally, it splits the days array into chunks of 7 days to create an array of weeks.
     * */
    // Add days from the previous month
    for (let i = previousMonthStart; i <= previousMonthTotalDays; i++) {
        days.push({ day: i, month: 'previous' });
    }

    // Add days from the current month
    for (let i = 1; i <= totalDays; i++) {
        days.push({ day: i, month: 'current' });
    }

    // Add days from the next month
    for (let i = 1; i <= nextMonthDays; i++) {
        days.push({ day: i, month: 'next' });
    }

    let week: { day: number; month: string; }[] = [];

    days.forEach((item, index) => {
        week.push(item);
        if ((index + 1) % 7 === 0) {
            weeks.push(week);
            week = [];
        }
    });

    /**
     * If the same event is clicked again, it deselects it.
     * If a valid event is clicked, it sets the selected week index and stores the event details in the state.
     * If an empty day is clicked, it clears the selection.
     * */
    const handleDayClick = (event: Event, weekIndex: number | string, id: number | string) => {
        // // Deselect event if the same event is clicked again
        if (selectedEvent && selectedEvent.event.id === id){
            setSelectedEvent(null);
            return;
        }
        // Handle event click if valid event is clicked
        if (event) {
            // Mark the clicked week as selected
            setSelectedWeekIndex(weekIndex);
            // Store the clicked event details
            setSelectedEvent({weekIndex, event});
        } else {
            // Clear selection if an empty day is clicked
            setSelectedWeekIndex(0);
            setSelectedEvent(null);
        }
    };

    /**
     * It iterates over the events for the day and renders each event.
     * If it's the current month, it renders the event details with styling and a background image.
     * If it's not the current month, it only renders the day number.
     * For multiple events on a day, it only shows the day number for the first event.
     * */
    const renderEventsForDay = (eventsForDay: Event[], weekIndex: number | string, day: number | string, isCurrentMonth:boolean) => {
        return eventsForDay.map((event, eventIndex) =>
            {
                return (
                    isCurrentMonth ?
                        <div id={'event-' + weekIndex} key={'event-' + event.id} className="event has-event"
                             style={{backgroundImage: `url(/assets/${event.imageFilenameThumb}.webp)`}}
                             onClick={() => {
                                 handleDayClick(event, weekIndex, event.id);
                             }}
                        >
                            {/* Show day number only for single event or first event in a multi-event day */}
                            {
                                eventsForDay.length === 1
                                    ? <div className="day-number">{day}</div>
                                    : eventIndex === 0
                                        ? <div className="day-number">{day}</div>
                                        : <div className="empty-day-number"></div>
                            }
                        </div>
                        : <div id={'event-' + weekIndex} key={'event-' + event.id} className="event">
                            <div className="day-number">{day}</div>
                        </div>
                )
            }
        );
    };

    /**
     * Renders the details of a single selected event:
     * It displays the event title, summary, and two buttons with links.
     * It uses a background image for the event details section.
     * */
    const renderEvent = (event: Event) => {
        return (
            <div className="event-section">
                <div className="event-detail" style={{backgroundImage: `url(/assets/${event.imageFilenameFull}.webp)`}}>
                    <h2>{event.title}</h2>
                    <p>{event.summary}</p>
                    <a className={'btn btn-primary'} href={event.learnMoreLink} target={'_blank'}>Learn More</a>
                    <a className={'btn btn-secondary'} href={event.purchaseLink} target={'_blank'}>Purchase</a>
                </div>
            </div>
        )
    }

    /**
     * This useEffect hook logs a message to the console whenever the currentMonth prop changes.
     * It also resets the selectedEvent state to null when the month changes.
     * This ensures that the selected event is cleared when the user navigates to a new month.
     * */
    useEffect(() => {
        console.log('render', props.currentMonth);
        setSelectedEvent(null)
    }, [props.currentMonth]);

    return (
        <React.Fragment>
            {
                weeks.map((w, weekIndex) => {
                    return (
                        <React.Fragment key={'week-' + weekIndex}>
                            <div className="days">
                                {w.map((day: { day: number; month: string; }, index: number) => {
                                    const eventsForDay = props.events.filter((event) => {
                                        const eventDate = new Date(event.launchDate);
                                        return eventDate.getDate() === day.day
                                            && eventDate.getMonth() === props.currentMonth.getMonth()
                                            && eventDate.getFullYear() === props.currentMonth.getFullYear();
                                    });
                                    return (
                                        <div key={'day-' + index}
                                            className={`day${day.month !== 'current' ? ' other-month' : ''} ${day.day === today.getDate() ? 'today' : ''}`}>
                                            <div className="events">
                                                {
                                                    eventsForDay.length > 0
                                                        /* If there are events, it calls renderEventsForDay to display them with styling. */
                                                        ? renderEventsForDay(eventsForDay, weekIndex, day.day, day.month === 'current')
                                                        /* Otherwise, it renders a simple day number element. */
                                                        : <div className="event">
                                                            <div className="day-number">{day.day}</div>
                                                        </div>
                                                }
                                            </div>
                                        </div>
                                    )
                                })
                                }
                            </div>
                            {
                                /* This conditionally renders the selected event details below the week if relevant (same week and existing selection). */
                                /* It uses renderEvent to display the event title, summary, and buttons. */
                                selectedWeekIndex === weekIndex && selectedEvent && renderEvent(selectedEvent.event)
                            }
                        </React.Fragment>
                    )
                })
            }
        </React.Fragment>
    );
}

export default Days;