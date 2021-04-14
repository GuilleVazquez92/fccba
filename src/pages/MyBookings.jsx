import React, { useState, useEffect, useContext } from 'react';
import { IonHeader, IonToolbar, IonTitle, IonContent, IonPage, IonButtons, IonMenuButton, IonGrid, IonRow, IonCol, IonButton, IonIcon, IonModal } from '@ionic/react';
import api from '../api';
import { DataContext } from '../context';
import TurnoTeaser from '../components/TurnoTeaser';

const MyBookings = () => {
  const { user } = useContext(DataContext);
  const [turnos, setTurnos] = useState([]);

  useEffect(() => {
    fetchMyBookings();
  }, []);

  const fetchMyBookings = async () => {
    if (user) {
      const response = await api.turnos.getMe({headers: {'Content-Type': 'application/json'}}, user._id);
      // console.log(" TURNOS ");
      // console.log(response);
      setTurnos(response.data);
    }
  }

  return (
    <IonPage>
      <IonHeader translucent={true}>
        <IonToolbar>
          <IonButtons slot="start">
            <IonMenuButton />
          </IonButtons>
          <IonTitle>Mis Reservas</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent fullscreen={true}>
        <div className="results">
          {turnos.map((turno, t) => (
            <TurnoTeaser key={t} turno={turno} predio={turno.predio} booking />
          ))}
          {turnos.length === 0 && <div>Aun no tienes reservas.</div>}
        </div>
      </IonContent>
    </IonPage>
  );
};

export default MyBookings;