import { Calendar, DayPropGetter, EventPropGetter, momentLocalizer } from "react-big-calendar";
import moment from 'moment'
import { useEffect, useState } from "react";
import axios from "axios";
import schedule from "@/utils/config/schedule";
import 'moment-timezone'
import { useApiCallBack } from "@/utils/hooks/useApi";
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
  const eventPropGetter: EventPropGetter<CalendarEvents> = (event) => {
    const closedCaseSensitive = event.title.toLowerCase()
    const closedIncludes = closedCaseSensitive.includes("closing")
    || closedCaseSensitive.includes("closed") || closedCaseSensitive.includes("store closed")
    || closedCaseSensitive.includes("store closing")
    /**@condition do more conditions if necessary. so it will check every title */
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
    } else if(closedIncludes) {
      eventStyle = {
        backgroundColor: 'orange',
        color: 'white',
        cursor: 'not-allowed'
      }
    }
    /**@fires createConditionForTitleClosing */
    return {
      className: isPastDate ? 'past-date' : '',
      style: eventStyle
    }
  }
  
  const dayPropGetter: DayPropGetter = (date) => {
    const dateString = moment(date).format('YYYY-MM-DD');
    const isHoliday = appointments?.some((holiday: any) =>
    moment(holiday.start).format('YYYY-MM-DD') === dateString && holiday.isHoliday
    );
    const isPastDate = date < new Date()
    if(isPastDate && !moment(date).isSame(moment(), 'day')){
      return {
        style: {
          backgroundColor: 'lightgray',
          color: 'gray'
        }
      }
    } else if (isHoliday) {
      return {
        className: 'disabled-day',
      };
    }
    return {}
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