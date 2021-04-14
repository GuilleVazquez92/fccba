import React, { useState, useContext } from "react";
import { IonItemSliding, IonItem, IonLabel, IonIcon, IonAlert } from "@ionic/react";
import { useHistory } from "react-router-dom";
import { DataContext } from '../context';
import { football, beer, scan, time } from 'ionicons/icons';
import api from '../api';

const TurnoTeaser = ({ turno, predio, booking }) => {
  const { user, setTurno, setPredio } = useContext(DataContext);
  const [showAlert, setShowAlert] = useState(false);
  const [selectedTurno, setSelectedTurno] = useState(null);
  const history = useHistory();

  const goToBooking = (e) => {
    const path = user ? "/booking" : "/signin";
 
    setTurno(turno);
    setPredio(predio);
   
    history.push(path, { path: "/booking"});
  };

  const cancelBooking = async (id) => {
    const dataModel = {
      id,
      status: true
    }

    //al cancelar en el alert llama al responsepayment y tarda segundos por ende hay que refrescar pasado esos segundos para que muestre las reservas existentes
    const responsePayment = await api.turnos.cancelBooking(dataModel, user.headers, id);
      if (responsePayment.status === 200) {
        console.log('Cancelar turno >>: ', id);
        window.location.reload();
      }
  }

  return (
    <IonItemSliding class={"turno-teaser"}>
      <IonItem onClick={() => !booking && goToBooking()}>
        <IonLabel>
          <h3>{predio && predio.name ? predio.name : turno.predioName}
          {turno.status  ? (
            <button className="bg-green-600 py-0 px-2 text-white rounded-sm m-1">Reservar</button>
          ) : null}</h3>
          <p>
            <IonIcon icon={football} color="primary" className="mr-2"></IonIcon>
            Cancha de: {turno.label} jugadores. {/*predio.courts.includes(courtItem => courtItem.id === turno.court)*/}</p>
          <p>
            <IonIcon icon={scan} color="primary" className="mr-2"></IonIcon>
            Cesped: {turno.type || turno.typeCourt}</p>
          <p>
            <IonIcon icon={beer} color="primary" className="mr-2"></IonIcon>
            Caracteristicas: {predio.preferences ? predio.preferences.join(', ') : turno.preferences.join(', ')}
          </p>
          {booking && 
            <p>
              <IonIcon icon={time} color="primary" className="mr-2"></IonIcon>
              Dia: {turno.date && turno.date} - {turno.hour && turno.hour}
            </p>
          }
          <div>
            {booking &&
            <button 
              className="bg-red-600 py-0 px-2 text-white rounded-sm m-1"
              onClick={() => {
                setSelectedTurno(turno._id);
                setShowAlert(true)
              }}
            >Cancelar</button>}
          </div>
        </IonLabel>
      </IonItem>
      <IonAlert
          isOpen={showAlert}
          onDidDismiss={() => setShowAlert(false)}
          cssClass='my-custom-class'
          header={'Atencion!'}
          message={'Esta seguro de cancelar la reserva?'}
          buttons={[
            {
              text: 'Cancelar',
              role: 'cancel',
              cssClass: 'secondary',
              handler: blah => {
                setShowAlert(false)
              }
            },
            {
              text: 'Confirmar',
              handler: () => {
               
                cancelBooking(selectedTurno)
               
                
              }
           
            }
          ]}
          
        />
      
    </IonItemSliding>
  );
};

export default TurnoTeaser;
