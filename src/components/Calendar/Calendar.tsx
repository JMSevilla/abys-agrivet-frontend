import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from 'moment'
import { useEffect, useState } from "react";
import schedule from "@/utils/config/schedule";
import 'moment-timezone'
const localizer = momentLocalizer(moment)
const defaultTZ = moment?.tz.guess()
moment.tz.setDefault('Hongkong')
export const SchedulerCalendar = () => {
  const [eventsData, setEventsData] = useState<any>(schedule);
  const handleSelect = ({ start, end } : any) => {
    console.log(start);
    console.log(end);
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
  };
  return (
    <>
    <Calendar
        views={["day", "agenda", "work_week", "month"]}
        selectable
        localizer={localizer}
        defaultDate={new Date()}
        defaultView="month"
        events={eventsData}
        style={{ height: "100vh" }}
        onSelectEvent={(event) => console.log(event)}
        onSelectSlot={handleSelect}
      />
    </>
  );
}