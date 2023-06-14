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
    const { handleOnToast } = useToastContext()
    const [lastId, setLastId] = useState(0)
    const getallscheduleperbranches = () => {
        GetAllSchedulePerBranch.execute(services?.branch_id ?? 0).then((response) => {
            if(response?.data?.length > 0){
                var chk = response?.data?.map((item:any) => {
                    return {
                        id: item?.id,
                        title: item?.title,
                        start: new Date(item?.start),
                        end: new Date(item?.end),
                        isHoliday: item?.isHoliday
                    }
                })
                setFeed(chk)
                setValue('appointmentSchedule', chk)
            } else {
                setFeed([])
            }
        })
        
    }
    useEffect(() => {
        getallscheduleperbranches()
        
    }, [])
    const handleScheduleSelection = ({ start, end } : SlotInfo) => {
        const selectedStart = moment(start).format('YYYY/MM/DD')
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
                return;
            }
            else {
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
                                setFeed((prevState) => [...prevState, ...newSched])
                                setValue('appointmentSchedule', newSched)
                                setLastId(lastId + 1)
                                setRemoveId(id)
                            })
                }
            }
        }
    }
    const handleSelectedEvent = (event : any) => {
        const eventStart = new Date(event?.start)
        const isPastDate = eventStart < new Date()
        if(isPastDate && !moment(event.start).isSame(moment(), 'day')){
            return;
        } else {
            setRemoveId(event?.id)
            setOpenModal(!openModal)
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
                    const update = [...feed.slice(0, index), ...feed.slice(index + 1)]
                    setFeed(update)
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
             views={["day", "agenda", "week", "month"]} 
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