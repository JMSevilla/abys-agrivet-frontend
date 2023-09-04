import { VerticalTimeline, VerticalTimelineElement }  from 'react-vertical-timeline-component';

import PetsIcon from '@mui/icons-material/Pets';
import moment from 'moment';


export const Timeline = ({children} : React.PropsWithChildren<{}>) => {
    return (
        <VerticalTimeline layout='1-column'>
  <VerticalTimelineElement
   className="vertical-timeline-element--work"
   date={moment().calendar()}
   iconStyle={{ background: 'rgb(33, 150, 243)', color: '#fff' }}
    icon={<PetsIcon />}
  >
    {children}
  </VerticalTimelineElement>
</VerticalTimeline>
    )
}