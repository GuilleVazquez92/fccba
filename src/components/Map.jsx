import React, { useState, useContext } from "react";
import { Map, Marker, GoogleApiWrapper } from "google-maps-react";
import MapInfoWindow from "./MapInfoWindow";
import { useHistory } from 'react-router';
import { IonButton, IonModal, IonDatetime, IonSelect } from "@ionic/react";

const MapContainer = ({places, center, google}) => {
  const history = useHistory();
  const [showingInfoWindow, setShowingInfoWindow] = useState(false);
  const [activeMarker, setActiveMarker] = useState({});
  const [selectedPlace, setSelectedPlace] = useState({});
  const fechaFormat = new Date().toLocaleDateString("es-ES", { day: '2-digit', month: '2-digit', year: 'numeric' });

  const onMarkerClick = (item, marker, e) => {
    setSelectedPlace(item.place_);
    setActiveMarker(marker);
    setShowingInfoWindow(true);
  };

  const showDetails = (place) => {
    history.push(`/predio/${place._id}`, {predio: place, fecha: fechaFormat, hour: '21:00', courtType: 'sintetico'});
  };


  return (
    <div className="map-container">
      <Map
        google={google}
        className={"map"}
        zoom={10}
        initialCenter={center}
      >
        {places.map((place, i) => {
          return (
            <Marker
              onClick={onMarkerClick}
              key={place._id}
              place_={place}
              position={{ lat: place.lat, lng: place.lng }}
            />
          );
        })}
        <MapInfoWindow
          marker={activeMarker}
          visible={showingInfoWindow}
        >
          <div>
            <h3>{selectedPlace.name}</h3>
            <IonButton onClick={() => showDetails(selectedPlace)}>Ver Turnos</IonButton>
          </div>
        </MapInfoWindow>
      </Map>
    </div>
  );
}

export default GoogleApiWrapper({
  apiKey: "AIzaSyCGV20XWpoX9p0AYRvb8Q-GMJ9XsdEe7Zg"
})(MapContainer);