import { SchedulerCalendar } from "@/components/Calendar/Calendar";
import { UncontrolledCard } from "@/components/Card/Card";
import { Typography } from "@mui/material";
import { useAtom } from "jotai";
import { AppointmentSchedulingAtom, AppointmentServicesAtom } from "@/utils/hooks/useAtomic";
import { APSchedulingSchema, AppointmentSchedulingType } from "@/utils/schema/Appointment/AppointmentSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import {
    useForm,
    useFormContext,
    FormProvider
} from 'react-hook-form'
import moment from "moment";
import { SlotInfo } from "react-big-calendar";
import { useToastContext } from "@/utils/context/Toast/ToastContext";
import { useEffect, useState } from "react";
import { BottomButtonGroup } from "@/components/Button/BottomButtonGroup";

import ControlledModal from "@/components/Modal/Modal";
import { MAX_APPOINTMENT_STEPS } from "..";
import { useActiveSteps } from "@/utils/hooks/useActiveStep";
import { useApiCallBack } from "@/utils/hooks/useApi";
import { CreateNewScheduleProps } from "@/utils/types";
import { useMutation, useQuery } from "react-query";
import { useReferences } from "@/utils/hooks/useToken";
import { ControlledBackdrop } from "@/components/Backdrop/Backdrop";
import { ControlledTextField } from "@/components/TextField/TextField";

const APSchedulingForm = () => {
    const [services, setServices] = useAtom(AppointmentServicesAtom)
    const [loading, setLoading] = useState(false)
    const [openModal, setOpenModal] = useState(false)
    const [references, setReferences] = useReferences()
    const GetAllSchedulePerBranch = useApiCallBack(
        async (api, branch: number) =>
        await api.abys.findAllSchedulePerBranch(branch)
    )
    const deleteSelectedSchedule = useApiCallBack(async (api, id: number) => await api.abys.handleSelectedSchedule(id))
    const useDeleteSelectedSchedule = () => {
        return useMutation((id: number) => deleteSelectedSchedule.execute(id))
    }
    const checkBeforeRemoving = useApiCallBack(async (api, id: number) => await api.abys.checkBeforeRemovingSchedule(id))
    const getHighestID = useApiCallBack(api => api.abys.getHighestID())
    const { mutate } = useDeleteSelectedSchedule()
    const { control, setValue, getValues, watch } = useFormContext<AppointmentSchedulingType>()
    const [removeId, setRemoveId] = useState(0)
    const [feed, setFeed] = useState<Array<{
        id: number
        title: string
        start: Date
        end: Date
        isHoliday?: boolean | undefined
      }>>([])
    const appointmentSchedules = watch('appointmentSchedule')
    const { handleOnToast } = useToastContext()
    const [lastId, setLastId] = useState(0)
    const checkIfDayPropsIsHoliday = useApiCallBack(async (api, id: number) => await api.abys.CheckIfDayPropIsHoliday(id))
    const getallscheduleperbranches = () => {
        GetAllSchedulePerBranch.execute(services?.branch_id ?? 0).then((response) => {
            if(response?.data?.length > 0){
                var chk = response?.data?.map((item:any) => {
                    return {
                        id: item?.id,
                        title: item?.title,
                        start: item?.start,
                        end: item?.end,
                        isHoliday: item?.isHoliday
                    }
                })
                setFeed(chk)
            } else {
                setFeed([])
            }
        })
        
    }
    useEffect(() => {
        getallscheduleperbranches()
        
    }, [])
    useEffect(() => {}, [appointmentSchedules])
    const [selectedEvent, setSelectedEvent] = useState<any>([]) 
    const handleScheduleSelection = ({ start, end } : SlotInfo) => {
        setLoading(!loading)
        const selectedEvents = feed.filter((event) => {
            const eventStartDate = moment(event.start).add(1, 'day');
            const eventEndDate = moment(event.end).subtract(1, 'day');
      
            return (
              eventStartDate.isSameOrBefore(end) &&
              eventEndDate.isSameOrAfter(start)
            );
        });
        const values = getValues()
        const eventStartDate = new Date(start)
        if(eventStartDate < new Date() && !moment(start).isSame(moment(), 'day')){
            return;
        } else {
            /**@function checkHolidayDates */
            if(values.appointmentSchedule?.length > 0) {
                /**@function handleToast */
                handleOnToast(
                    "You already drop your appointment today. Delete the first one and appoint again.",
                    "top-right",
                    false,
                    true,
                    true,
                    true,
                    undefined,
                    "dark",
                    "error"
                  );
                  setLoading(false)
                return;
            }
            else {
                if(selectedEvents.length > 0) {
                    selectedEvents.map((item) => {
                                checkIfDayPropsIsHoliday.execute(item.id)
                                .then(res => {
                                    if(res?.data == 200) {
                                        handleOnToast(
                                            "Sorry but you cannot drop an appointment for this day because it is holiday.",
                                            "top-right",
                                            false,
                                            true,
                                            true,
                                            true,
                                            undefined,
                                            "dark",
                                            "error"
                                        );
                                        setLoading(false)
                                    } else if(res?.data == 202){
                                        handleOnToast(
                                            "Sorry but the schedule you want is planned to close.",
                                            "top-right",
                                            false,
                                            true,
                                            true,
                                            true,
                                            undefined,
                                            "dark",
                                            "error"
                                        );
                                        setLoading(false)
                                    } else {
                                        const test = window.prompt("Schedule title")
                                                        if(test) {
                                                            getHighestID.execute()
                                                                    .then((re) => {
                                                                        const id = re?.data == null || re?.data == "" ? lastId + 1 : re.data?.id + 1;
                                                                        
                                                                        const title = test;
                                                                        const isHoliday = false
                                                                        const newSched = [
                                                                            {
                                                                                id,
                                                                                start,
                                                                                end,
                                                                                title,
                                                                                isHoliday
                                                                            }
                                                                        ]
                                                                        setLoading(false)
                                                                        setFeed((prevState) => [...prevState, ...newSched])
                                                                        setValue('appointmentSchedule', newSched)
                                                                        setValue('start', moment(start).add(1, 'day').toDate())
                                                                        setValue('end', moment(start).add(1, 'day').toDate())
                                                                        setLastId(lastId + 1)
                                                                        setRemoveId(id)
                                                                    })
                                                        } else {
                                                            setLoading(false)
                                                        }
                                    }
                                                        })
                    })
                } else {
                    const test = window.prompt("Schedule title")
                    if(test) {
                        getHighestID.execute()
                                .then((re) => {
                                    const id = re?.data == null || re?.data == "" ? lastId + 1 : re.data?.id + 1;
                                    
                                    const title = test;
                                    const isHoliday = false
                                    const newSched = [
                                        {
                                            id,
                                            start,
                                            end,
                                            title,
                                            isHoliday
                                        }
                                    ]
                                    setLoading(false)
                                    setFeed((prevState) => [...prevState, ...newSched])
                                    setValue('appointmentSchedule', newSched)
                                    setValue('start', moment(start).add(1, 'day').toDate())
                                    setValue('end', moment(start).add(1, 'day').toDate())
                                    setLastId(lastId + 1)
                                    setRemoveId(id)
                                })
                    } else {
                        setLoading(false)
                    }
                }
            }
        }
    }
    const handleSelectedEvent = (event : any) => {
        const closedCaseSensitive = event.title.toLowerCase()
        const closedIncludes = closedCaseSensitive.includes("closing")
        || closedCaseSensitive.includes("closed") || closedCaseSensitive.includes("store closed")
        || closedCaseSensitive.includes("store closing")
        const eventStart = new Date(event?.start)
        const isPastDate = eventStart < new Date()
        if(isPastDate && !moment(event.start).isSame(moment(), 'day')){
            return;
        } else {
            if(event.isHoliday || closedIncludes) {
                return;
            }else {
                setRemoveId(event?.id)
            setOpenModal(!openModal)
            }
        }
    }
    const handleRemove = () => {
        setOpenModal(false)
        setLoading(!loading)
        checkBeforeRemoving.execute(removeId)
        .then((res) => {
            if(res.data == 200) {
                mutate(removeId, {
                    onSuccess: (response: any) => {
                        console.log(response)
                        if(response?.data == 200) {
                            handleOnToast(
                            "Successfully Removed.",
                            "top-right",
                            false,
                            true,
                            true,
                            true,
                            undefined,
                            "dark",
                            "success"
                        );
                        getallscheduleperbranches()
                        setLoading(false)
                        }
                    }
                })
            } else {
                const index = feed.findIndex((item) => item.id === removeId)
                if(index !== -1) {
                    const values = getValues()
                    const update = [...feed.slice(0, index), ...feed.slice(index + 1)]
                    setFeed(update)
                    setValue('appointmentSchedule', [])
                }
                setLoading(false)
            }
        })
    } 
    return (
        <>
        <UncontrolledCard style={{ marginTop: '10px' }}>
            <SchedulerCalendar appointments={
                feed
            } handleSelection={handleScheduleSelection}
             views={["month", "day"]} 
             handleSelectedEvent={handleSelectedEvent}/>
             <ControlledModal
             open={openModal}
             handleClose={() => setOpenModal(false)}
             handleDecline={() => setOpenModal(false)}
             buttonTextAccept="REMOVE"
             buttonTextDecline="NOTHING"
             color='error'
             handleSubmit={handleRemove}
             >
                <Typography variant='caption'>Appointment</Typography>
                <hr />
                <Typography variant='button'>What do you want to do with this event ?</Typography>
             </ControlledModal>
             <ControlledBackdrop open={loading} />
        </UncontrolledCard>
        </>
    )
}

export const APScheduling = () => {
    const [loading, setLoading] = useState(false)
    const [scheduling, setScheduling] = useAtom(AppointmentSchedulingAtom)
    const [services, setServices] = useAtom(AppointmentServicesAtom)
    const [references, setReferences] = useReferences()
    const form = useForm<AppointmentSchedulingType>({
        mode: 'all',
        resolver: zodResolver(APSchedulingSchema),
        defaultValues: scheduling
    })
    const createNewSchedule = useApiCallBack(
        async (api, args : CreateNewScheduleProps) =>
        await api.abys.createNewSchedule(args)
    )
    const useCreateNewSchedule = () => {
        return useMutation((data: CreateNewScheduleProps) => createNewSchedule.execute(data))
    }
    const { mutate } = useCreateNewSchedule()
    const { next } = useActiveSteps(MAX_APPOINTMENT_STEPS)
    const { handleOnToast } = useToastContext()
    const { formState : { isDirty }, handleSubmit, getValues } = form;
    const handleContinue = () => {
        const values = getValues()
        if(values.appointmentSchedule?.length > 0) {
            values.appointmentSchedule.map((item) => {
                const obj: any = {
                    userid: references?.id,
                    branch: services?.branch_id,
                    mockSchedule: JSON.stringify(values),
                    status: 1,
                    isHoliday: item.isHoliday ? 1: 0,
                    start: item.start,
                    title: item.title,
                    end: item.start
                }
                setLoading(!loading)
                mutate(obj, {
                    onSuccess: (response) => {
                        if(response?.data == 200){
                            handleOnToast(
                                "Successfully drop a schedule.",
                                "top-right",
                                false,
                                true,
                                true,
                                true,
                                undefined,
                                "dark",
                                "success"
                            );
                            setScheduling(values)
                            next()
                            setLoading(false)
                        }
                    }
                })
                
            })
        } else {
            handleOnToast(
                "Kindly drop your appointment schedule.",
                "top-right",
                false,
                true,
                true,
                true,
                undefined,
                "dark",
                "error"
              );
        }
    }
    return (
        <FormProvider {...form}>
            <APSchedulingForm />
            <BottomButtonGroup 
            max_array_length={MAX_APPOINTMENT_STEPS}
            onContinue={handleContinue}
            />
            <ControlledBackdrop open={loading} />
        </FormProvider>
    )
}