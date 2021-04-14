import React, { useState, useEffect } from 'react';
import { IonHeader, IonToolbar, IonTitle, IonContent, IonPage, IonButtons, IonMenuButton } from '@ionic/react';
import api from '../api';
import { connect } from '../data/connect';

const Bookings = () => {
  const [turnos, setTurnos] = useState([]);

  useEffect(() => {
    fetchPredios();
  }, []);

  const fetchPredios = async () => {
    const response = await api.predio.getTurnos({headers: {'Content-Type': 'application/json'}});
    setTurnos(response.data[0].Bookings);
  };

  return (
    <IonPage id="bookings">
      <IonHeader translucent={true}>
        <IonToolbar>
          <IonButtons slot="start">
            <IonMenuButton />
          </IonButtons>
          <IonTitle>Turnos</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent fullscreen={true}>
        <IonHeader collapse="condense">
          <IonToolbar>
            <IonTitle size="large">Turnos</IonTitle>
          </IonToolbar>
        </IonHeader>
      </IonContent>
    </IonPage>
  );
};

export default connect({
  component: Bookings
});