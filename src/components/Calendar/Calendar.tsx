import { Calendar, DayPropGetter, EventPropGetter, momentLocalizer } from "react-big-calendar";
import moment from 'moment'
import { useEffect, useState } from "react";
import axios from "axios";
import schedule from "@/utils/config/schedule";
import 'moment-timezone'
const localizer = momentLocalizer(moment)
type CalendarProps = {
  handleSelection: ({start, end} : any) => void;
  appointments: Array<{
    id: number
    title: string
    start: Date
    end: Date
    isHoliday?: boolean
  }>
  views: any
  handleSelectedEvent: (event: any) => void;
}
interface CalendarEvents {
  id: any
  title: string
  start: Date
  end: Date
  isHoliday?: boolean
}

export const SchedulerCalendar = (props: CalendarProps) => {
  const {
    appointments,
    handleSelection,
    views,
    handleSelectedEvent
  } = props;
  const [eventsData, setEventsData] = useState<any>(schedule);
  const [holidayDates, setHolidayDates] = useState<CalendarEvents[]>([
    // {
    //   id:1,
    //   title: 'test',
    //   start: new Date(),
    //   end: new Date(),
    //   isHoliday: false
    // }
  ])
  const handleSelect = ({ start, end } : any) => {
    const eventStartDate = new Date(start)
    if(eventStartDate < new Date() && !moment(start).isSame(moment(), 'day')) {
      return;
    }
    else {
      const title = window.prompt("New Event name");
    if (title)
      setEventsData([
        ...eventsData,
        {
          start,
          end,
          title
        }
      ]);
    }
  };
  const eventPropGetter: EventPropGetter<CalendarEvents> = (event) => {
    
    const eventStartDate = new Date(event.start)
    const isPastDate = eventStartDate < new Date()
    let eventStyle: React.CSSProperties = {}
    if(isPastDate && !moment(event.start).isSame(moment(), 'day')){
      eventStyle = {
        backgroundColor: isPastDate ? 'lightgray' : '',
        color:  isPastDate ? 'gray' : '',
        cursor: isPastDate && 'not-allowed'
      }
    } else if(event.isHoliday){
      eventStyle = {
        backgroundColor: 'red',
        color: 'white',
        cursor: 'not-allowed'
      }
    }
    return {
      className: isPastDate ? 'past-date' : '',
      style: eventStyle
    }
  }
  
  const dayPropGetter: DayPropGetter = (date) => {
    const isHoliday = holidayDates.some((holiday: any) => 
      moment(holiday).isSame(moment(date), 'day')
    );
    const isDisabled = isHoliday
    const isPastDate = date < new Date()
    if(isPastDate && !moment(date).isSame(moment(), 'day')){
      return {
        style: {
          backgroundColor: 'lightgray',
          color: 'gray'
        }
      }
    }
    return {
      className: isHoliday ? 'holiday' : '',
      disabled: isDisabled
    }
  }
  return (
    <>
    <Calendar
        views={views}
        selectable
        localizer={localizer}
        defaultView="month"
        events={appointments}
        style={{ height: "100vh" }}
        onSelectSlot={handleSelection}
        eventPropGetter={eventPropGetter}
        onSelectEvent={(e) => handleSelectedEvent(e)}
        dayPropGetter={dayPropGetter}
        startAccessor="start"
        endAccessor="end"
      />
    </>
  );
}