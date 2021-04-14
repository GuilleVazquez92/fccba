import React, { useState, useEffect } from 'react';
import Map from '../components/Map';
import { IonHeader, IonToolbar, IonButtons, IonMenuButton, IonTitle, IonContent, IonPage } from '@ionic/react';
import api from '../api';

const MapView = () => {
  const [predios, setPredios] = useState([1]);
  const [showMap, setShowMap] = useState(false);

  useEffect(() => {
    fetchPredios();
  }, []);

  const fetchPredios = async () => {
    const response = await api.predio.getAll({headers: {'Content-Type': 'application/json'}}, 'capital', ['buffet', 'vestuario', 'parrilla', 'techada']);
    if (response.data) {
      setPredios(response.data);
      setShowMap(true);
    }
  }

  if (showMap) {
    return (
      <IonPage id="map-view">
        <IonHeader>
          <IonToolbar>
            <IonButtons slot="start">
              <IonMenuButton></IonMenuButton>
            </IonButtons>
            <IonTitle>Mapa</IonTitle>
          </IonToolbar>
        </IonHeader>
  
        <IonContent class="map-page">
          <Map places={predios} center={{ lat: -31.4169769, lng: -64.2118567 }} />
        </IonContent>
      </IonPage>
    )
  } else {
    return (
      <></>
    )
  }
};

export default MapView;