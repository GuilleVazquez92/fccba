import React, { useState, useEffect } from 'react';
import { IonButton, IonHeader, IonToolbar, IonButtons, IonIcon, IonImg, IonRow } from '@ionic/react';
import { close } from 'ionicons/icons';
import image from '../theme/assets/images/order_finished.png';
import Slides from './Slides';
import api from '../api';

const Status = ({ onDismissModal }) => {
  const [ads, setAds] = useState([]);

  useEffect(() => {
    fetchAds();
  }, [])

  const fetchAds = async () => {
    const adsResponse = await api.ads.getByCategory({headers: {'Content-Type': 'application/json'}}, 'basic');
    if (adsResponse) {
      setAds(adsResponse.data);
    }
  }
  const finishCheckout = () => {
    onDismissModal('finished')
  };

  return (
    <div className="page-status-order">
      <IonHeader translucent={true} className="ion-no-border">
        <IonToolbar>
          <IonButtons slot="end">
            <IonButton onClick={() => onDismissModal('finished')}>
              <IonIcon icon={close} size="large" />
            </IonButton>
          </IonButtons>
        </IonToolbar>
      </IonHeader>
      <div className="p-4">
        <div className="image-header">
          <IonImg src={image} />
        </div>
        <h2>Reserva finalizada !!</h2>
        <p>Gracias por elegirnos en breve le llegará la confirmación de su pedido.</p>
        <button 
          className="bg-green-600 py-1 px-6 text-white rounded-sm my-2"
          onClick={() => finishCheckout()}
        >Mis reservas</button>
        <IonRow className="w-full">
          {ads.length && <Slides ads={ads}/>}
        </IonRow>
      </div>
    </div>
  )
}

export default Status;