import React, { useState, useRef } from 'react';
import { IonHeader, IonToolbar, IonTitle, IonContent, IonPage, IonButtons, IonMenuButton, IonGrid, IonRow, IonCol, IonButton, IonIcon, IonModal } from '@ionic/react';
import Predio from '../components/PredioTeaser';
import { options, search } from 'ionicons/icons';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import myEventsList from '../data/data/events';
import 'react-big-calendar/lib/css/react-big-calendar.css';

const localizer = momentLocalizer(moment);

const CalendarPage = () => {
  const [showFilterModal, setShowFilterModal] = useState(false);

  
  const pageRef = useRef(null);
  const mode = 'ios';

  return (
    <IonPage ref={pageRef} id="speaker-list">
      <IonHeader translucent={true}>
        <IonToolbar>
          <IonButtons slot="start">
            <IonMenuButton />
          </IonButtons>
          <IonTitle>Calendario</IonTitle>
          <IonButtons slot="end">
            <IonButton onClick={() => setShowFilterModal(true)}>
              {mode === 'ios' ? 'Filtros' : <IonIcon icon={options} slot="icon-only" />}
            </IonButton>
          </IonButtons>
        </IonToolbar>
      </IonHeader>

      <IonContent fullscreen={true}>
        <Calendar
          localizer={localizer}
          events={myEventsList}
          startAccessor="start"
          endAccessor="end"
          onSelectEvent={event => console.log(event)}
        />
      </IonContent>
    </IonPage>
  );
};

export default CalendarPage;