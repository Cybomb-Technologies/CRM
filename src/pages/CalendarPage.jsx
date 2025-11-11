import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import { Card, CardContent } from '@/components/ui/card';
import { useData, useToast } from '@/hooks';
import CreateActivityDialog from '@/components/activities/CreateActivityDialog';

const CalendarPage = () => {
  const { data, updateData, addDataItem } = useData();
  const [events, setEvents] = useState([]);
  const { toast } = useToast();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);

  useEffect(() => {
    const dealEvents = Object.values(data.deals).flat().map(deal => ({
      id: `deal-${deal.id}`,
      title: `Close: ${deal.title}`,
      start: deal.closeDate,
      allDay: true,
      backgroundColor: '#f97316',
      borderColor: '#f97316',
      classNames: ['cursor-pointer'],
    }));

    const activityEvents = data.activities.map(activity => ({
      id: `activity-${activity.id}`,
      title: activity.title,
      start: activity.dueDate,
      allDay: activity.type === 'Task',
      backgroundColor: activity.type === 'Meeting' ? '#8b5cf6' : '#3b82f6',
      borderColor: activity.type === 'Meeting' ? '#8b5cf6' : '#3b82f6',
      classNames: ['cursor-pointer'],
      extendedProps: { type: 'activity', originalId: activity.id },
    }));

    setEvents([...dealEvents, ...activityEvents]);
  }, [data]);

  const handleDateSelect = (selectInfo) => {
    setSelectedDate(selectInfo.startStr);
    setDialogOpen(true);
  };
  
  const handleEventClick = (clickInfo) => {
    toast({
        title: "Edit Event",
        description: `Editing "${clickInfo.event.title}" is not implemented yet.`,
    });
  };

  const handleEventDrop = (dropInfo) => {
    const { event } = dropInfo;
    if (event.extendedProps.type === 'activity') {
        const activityId = event.extendedProps.originalId;
        const updatedActivities = data.activities.map(act => {
            if (act.id === activityId) {
                return { ...act, dueDate: dropInfo.event.start.toISOString() };
            }
            return act;
        });
        updateData('activities', updatedActivities);
        toast({ title: "Activity Updated", description: "The due date has been changed." });
    } else {
        dropInfo.revert();
        toast({ title: "Update Failed", description: "Deal close dates cannot be changed from the calendar.", variant: "destructive" });
    }
  };
  
  const onActivityCreated = (activity) => {
      addDataItem('activities', activity);
      setDialogOpen(false);
  }

  return (
    <>
      <Helmet>
        <title>Calendar - CloudCRM</title>
        <meta name="description" content="Manage your schedule, events, and activities" />
      </Helmet>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Calendar</h1>
          <p className="text-muted-foreground mt-1">Manage your schedule and activities</p>
        </div>

        <Card>
          <CardContent className="p-4">
            <FullCalendar
              plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
              initialView="dayGridMonth"
              headerToolbar={{
                left: 'prev,next today',
                center: 'title',
                right: 'dayGridMonth,timeGridWeek,timeGridDay'
              }}
              events={events}
              editable={true}
              selectable={true}
              select={handleDateSelect}
              eventClick={handleEventClick}
              eventDrop={handleEventDrop}
              dayMaxEvents={true}
              weekends={true}
              height="auto"
            />
          </CardContent>
        </Card>
      </div>
      <CreateActivityDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        onActivityCreated={onActivityCreated}
        initialDate={selectedDate}
      />
    </>
  );
};

export default CalendarPage;