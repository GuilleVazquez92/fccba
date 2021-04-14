import React, { useState, useEffect, useContext } from 'react';
import { IonHeader, IonToolbar, IonTitle, IonContent, IonPage, IonButtons, IonGrid, IonRow, IonSpinner, IonBackButton, IonImg} from '@ionic/react';
import { useHistory } from "react-router-dom";
import TurnoTeaser from '../components/TurnoTeaser';
import {DataContext} from '../context';
import api from '../api';

const PredioDetail = ({ location }) => {
  const history = useHistory();
  const { predio, setPredio } = useContext(DataContext);
  const [turnos, setTurnos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [date, setDate] = useState(null);
  const [hour, setHour] = useState(null);
  const [courtType, setCourtType] = useState(null);

  useEffect(() => {
    if (location.state && location.state.predio) {
      setPredio(location.state.predio);
      getTurnos(location.state.predio.courts);
      setDate(location.state.fecha);
      setHour(location.state.hour);
      setCourtType(location.state.courtType);
    }
  }, [location]);

  const getTurnos = async (courts) => {
    const listTurnos = [];
    const reservados = await api.turnos.getReservados({headers: {'Content-Type': 'application/json'}}, location.state.fecha, location.state.hour, location.state.predio._id, location.state.courtType);
    const bookingCourts = [];
    reservados.data.map((court) => bookingCourts.push(court.courtId));
    courts.map((court) => {
      if (court.type === location.state.courtType) {
        if (bookingCourts.length) {
          bookingCourts.map(itemCourt => {
            console.log(court.items);
            console.log(itemCourt);
            if (!court.items.includes(itemCourt) && court.id != itemCourt) {
              const turnoItem = {
                parentId: null,
                id: court.id,
                label: court.label,
                price: court.price,
                status: court.status,
                type: court.type,
                date: location.state.fecha,
                hour: location.state.hour 
              };
              listTurnos.push(turnoItem); 
            }
          })
        } else {
          const turnoItem = {
            parentId: null,
            id: court.id,
            label: court.label,
            price: court.price,
            status: court.status,
            type: court.type,
            date: location.state.fecha,
            hour: location.state.hour
          };
          listTurnos.push(turnoItem); 
        }
      }

      court.children && court.children.map(turnoChildItem => {
        if (turnoChildItem.type === location.state.courtType) {
          if (!bookingCourts.includes(turnoChildItem.id)) {
            const turnoChild = {
              parentId: court.id,
              id: turnoChildItem.id,
              label: turnoChildItem.label,
              price: turnoChildItem.price,
              status: turnoChildItem.status,
              type: turnoChildItem.type,
              date: location.state.fecha,
              hour: location.state.hour
            };
            listTurnos.push(turnoChild);
          }
        }
      })
    });
    setTurnos(listTurnos);
    setLoading(false);
  };

  const goBack = () => {
    return history.push('/predios');
  }

  return (
    <IonPage id="predio-page">
      <IonHeader translucent={true}>
        <IonToolbar>
          <IonButtons slot="start">
            <IonBackButton text="" onClick={() => goBack()}></IonBackButton>
          </IonButtons>
          <IonTitle>Predios</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent fullscreen={true} className="p-0">
        {predio ? (
          <IonGrid className="p-0">
            <div className="">
              <img 
                src={`${api.baseS3}/image/${predio.logo}`} 
                className="w-full h-32"
                onError={(e) => {
                  e.target.onerror = null; 
                  e.target.src="assets/img/image_placeholder.jpg"
                }}
              />
              <div className="flex justify-center -mt-10 w-24 h-24 mx-auto">
                <img 
                  src={`${api.baseS3}/logo/${predio.logo}`} 
                  className="rounded-full bg-white border-solid border-white border-4 -mt-3"
                  onError={(e) => {
                    e.target.onerror = null; 
                    e.target.src="assets/img/logo_placeholder.png"
                  }}
                />
              </div>
              <div className="text-center px-3 pb-2 pt-2 px-1">
                <h3 className="text-sm bold font-sans">{predio.name} - {predio.address}</h3>
              </div>
              <div className="flex justify-center pb-1 text-grey-dark px-1">
                <div className="text-center mr-3 border-r pr-3">
                  <h2>Canchas</h2>
                  <span>{turnos && turnos.length}</span>
                </div>
                <div className="text-center mr-3 border-r pr-3">
                  <h2>Dia</h2>
                  <span>{date}</span>
                </div>
                <div className="text-center">
                  <h2>Hora</h2>
                  <span>{hour}</span>
                </div>
              </div>
            </div>
            {/* <IonRow>Telefono: {predio.phone}</IonRow>
            <IonRow>Email: {predio.email}</IonRow> */}
            {turnos && turnos.length ? (
              <IonRow className="bg-green-500 faja">Turnos disponibles</IonRow>
            ) : (
              <IonRow className="bg-red-500 faja">No hay turnos disponibles.</IonRow>
            )}
            <IonRow>
              {turnos.map((turno, t) => (
                <TurnoTeaser 
                  key={t} 
                  turno={turno} 
                  predio={predio}
                />
              ))}
              
            </IonRow>
          </IonGrid>
        ) : null}
        {loading ? (
          <IonGrid fixed>
            <IonRow><IonSpinner name="crescent" /></IonRow>
          </IonGrid>
        ) : null}
      </IonContent>
    </IonPage>
  );
};

export default PredioDetail;