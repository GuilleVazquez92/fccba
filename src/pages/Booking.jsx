import React, { useState, useEffect, useContext } from 'react';
import { IonHeader, IonToolbar, IonTitle, IonContent, IonPage, IonButtons, IonGrid, IonRow, IonSpinner, IonBackButton, IonModal, IonSelect, IonSelectOption, IonButton, IonList, IonRadioGroup, IonListHeader, IonLabel, IonItem, IonRadio, IonItemDivider, IonMenuButton} from '@ionic/react';
import api from '../api';
import { useHistory } from "react-router-dom";
import Card from '../components/Card';
import { DataContext } from '../context';
import Status from '../components/Status';
import Swal from 'sweetalert2';
import 'sweetalert2/src/sweetalert2.scss'


const Booking = () => {
  const history = useHistory();
  const { user, turno, predio } = useContext(DataContext);
  console.log("turno",turno);
  const [showCard, setShowCard] = useState(false);
  const [bookingSelected, setBookingSelected] = useState(0);
  const [showStatus, setShowStatus] = useState(false);

  const onCloseModal = () => {
    setShowCard(false);
    history.push('my-bookings');
  }

  const reservar = async () => {
    const dataCheck = {
      date: turno.date.replaceAll('/', '-'), 
      hour: turno.hour.replaceAll(':', '-'), 
      predioId: predio._id,
      turnoId: turno.id
    };

      // Reservar sin pagar
    const data = {
      user,
      predio,
      date: turno.date,
      hour: turno.hour,
      label: turno.label,
      price: turno.price,
      pricePaid: bookingSelected,
      parentId: turno.parentId,
      courtId: turno.chilId,
      predioName: predio.name,
      preferences: predio.preferences,
      typeCourt: turno.type,
      token: false,
      firstSix: false,
      lastFour: false,
      dateDue: false,
      payment: false,
      feePaid: false,  locality: turno.locality
    };

    try {
      const checkTurno = await api.turnos.checkTurno({headers: {'Content-Type': 'application/json'}}, dataCheck);

      if (checkTurno.data.length) {
        Swal.fire({
          icon: 'error',
          title: 'Lo sentimos...',
          text: 'Este turno fue reservado hace unos minutos!',
        })
      } else {
        const responsePayment = await api.payment.create(data, user.headers);
        if (responsePayment.data) {
          setShowStatus(true);
        }
      }
    } catch (err) {
      console.log(err);
    }
  }

  const onDismissModal = () => {
    setShowStatus(false);
    history.push('my-bookings');
  }
  
  return (
    <IonPage id="booking">
      <IonHeader translucent={true}>
        <IonToolbar>
          <IonButtons slot="start">
            <IonMenuButton></IonMenuButton>
            {/* <IonBackButton text=""></IonBackButton> */}
          </IonButtons>
          <IonTitle>{predio && predio.name}</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent>
        {turno ? (
          <div className="p-2">
            <div className="p-2">Reserva tu turno para el dia: {turno.date}</div>
            <div className="p-2">a las {turno.hour}hs</div>
            <div className="p-2">Cancha de {turno.label} {turno.type}.</div>
            <div className="p-2">Caracteristicas: {predio.preferences.join(', ')}</div>
            <div className="p-2">Direccion: {predio.address}</div>
            <div className="p-2">Costo: {turno.price}$</div>
          </div>
        ) : null}
        <div className="bookings">
          <IonList>
            <IonRadioGroup value={bookingSelected} onIonChange={e => setBookingSelected(e.detail.value)}>
              <IonListHeader>
                <IonLabel>Tipo de reserva</IonLabel>
              </IonListHeader>

              <IonItem>
                <IonLabel>Efectivo (se abona en el predio)</IonLabel>
                <IonRadio slot="start" value={0} />
              </IonItem>

              {predio && predio.mpPublicKey &&
                <>
                  <IonItem>
                    <IonLabel>$200 (reserva asegurada)</IonLabel>
                    <IonRadio slot="start" value={200} />
                  </IonItem>

                  <IonItem>
                    <IonLabel>${turno.price} (Pago completo)</IonLabel>
                    <IonRadio slot="start" value={turno.price} />
                  </IonItem>
                </>
              }
            </IonRadioGroup>
          </IonList>
        </div>
        <div className="p-2">
          <div className="field">
            {bookingSelected > 0 && predio.mpPublicKey ? (
              <button 
                className="bg-green-600 py-1 px-6 text-white rounded-sm my-2"
                onClick={(e) => setShowCard(true)}
              >Pagar</button>
            ) : (
              <button 
                className="bg-green-600 py-1 px-6 text-white rounded-sm my-2"
                onClick={() => reservar()}
              >Reservar</button>
            )}
          </div>
        </div>
        <IonModal isOpen={showCard}>
          <Card 
            turno={turno} 
            amount={bookingSelected}
            closeModal={() => onCloseModal()}
          />
        </IonModal>
        <IonModal
          isOpen={showStatus}
          onDidDismiss={() => setShowStatus(false)}
          swipeToClose={true}
          cssClass="session-list-filter"
        >
          <Status onDismissModal={() => onDismissModal()} />
        </IonModal>
      </IonContent>
    </IonPage>
  );
};

export default Booking;