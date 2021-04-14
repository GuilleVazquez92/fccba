import React, { useState, useEffect, useContext } from 'react';
import { useHistory } from 'react-router';
import api from '../api';
import { IonModal, IonButton, IonDatetime, IonSelect, IonSelectOption, IonRow } from '@ionic/react';
import hours from '../data/data/hours';
import Slides from './Slides';
import { DataContext } from '../context';
import { Plugins } from "@capacitor/core";
const { App } = Plugins;

const PredioTeaser  = ({ predio }) => {
  const history = useHistory();
  const courtTypes = [
    {
      hash: 'natural',
      label: 'Natural'
    },
    {
      hash: 'sintetico',
      label: 'Sintetico'
    }
  ];
  const [showModal, setShowModal] = useState(false);
  const today = new Date().toLocaleDateString("es-ES", { day: '2-digit', month: '2-digit', year: 'numeric' });
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [fecha, setFecha] = useState(today);
  const [hour, setHour] = useState('21:00');
  const [courtType, setCourtType] = useState('natural');
  const {ads} = useContext(DataContext);

  const changeDate = (e, value) => {
    e.preventDefault();
    const fechaFormat = new Date(value).toLocaleDateString("es-ES", { day: '2-digit', month: '2-digit', year: 'numeric' });
    setFecha(fechaFormat);
    const date = new Date(value);
    const timestamp = date.getTime();

    const startDateSeconds = new Date(timestamp);
    startDateSeconds.setHours(0,0,1,0);
    setStartDate(parseInt(startDateSeconds.getTime() / 1000));

    const endDateSeconds = new Date(timestamp);
    endDateSeconds.setHours(23,59,59,0);
    setEndDate(parseInt(endDateSeconds.getTime() / 1000));
  };

  App.addListener('backButton', () => {
    setShowModal(false)
  });

  return (
    <div className="flex w-full predio-teaser rounded-lg p-1 border mb-2">
      <div className="predio-logo md:h-20 md:w-20 w-1/4 mr-2">
        <img 
          src={`${api.baseS3}/logo/${predio.logo}`} 
          className="rounded-lg"
          onError={(e) => {
            e.target.onerror = null; 
            e.target.src="assets/img/logo_placeholder.png"
          }}
        />
      </div>
      <div className="predio-data w-3/4">
        <h2 className="text-lg">{predio.name}</h2>
        <p>Preferencias: {predio.preferences.join(', ')}</p>
        <div className="predio-description">{predio.description}</div>
        <button 
          className="bg-green-600 py-0 px-2 text-white rounded-sm m-1"
          onClick={() => setShowModal(true)}
        >Ver turnos</button>
      </div>
      
      <IonModal isOpen={showModal}>
        <div id="modal-date-hour">
          <p>Selecciona fecha y hora.</p>
          <div className="field-locality">
            <div className="field-date flex">
              <div className="label w-2/6">Dia: </div>
              <div className="field w-4/6">
                <IonDatetime
                  displayFormat="DD MMMM YYYY"
                  placeholder={today}
                  min="2019"
                  max="2030"
                  cancelText="Cancelar"
                  doneText="Ok"
                  monthNames="Enero, Febrero, Marzo, Abril, Mayo, Junio, Julio, Agosto, Septiembre, Octubre, Noviembre, Diciembre"
                  onIonChange={e => changeDate(e, e.target.value)}
                ></IonDatetime>
              </div>
            </div>
            <div className="field-hours flex">
              <div className="label w-2/4">Hora: </div>
              <div className="field w-2/4">
                <IonSelect
                  value={hour}
                  placeholder="21:00"
                  okText="Ok"
                  cancelText="Cancelar"
                  onIonChange={e => setHour(e.target.value)}
                >
                  {hours.map((hour, hk) => (
                    <IonSelectOption key={hk} value={hour}>{hour}</IonSelectOption>
                  ))}
                </IonSelect>
              </div>
            </div>
            <div className="field-hours">
              <div className="label">Cesped</div>
              <div className="field">
                <IonSelect
                  value={courtType}
                  placeholder="Selecciona el tipo.."
                  okText="Ok"
                  cancelText="Cancelar"
                  onIonChange={e => setCourtType(e.target.value)}
                >
                  {courtTypes && courtTypes.map((option, k) => 
                    <IonSelectOption key={k} value={option.hash}>{option.label}</IonSelectOption>)}
                </IonSelect>
              </div>
            </div>
          </div>
        </div>
        <IonRow className="w-full">
          {ads.length && <Slides ads={ads}/>}
        </IonRow>
        <IonButton onClick={() => {
          setShowModal(false);
          history.push(`/predio/${predio._id}`, {predio, fecha: fecha, hour: hour, courtType: courtType});
        }}>Buscar</IonButton>
      </IonModal>
    </div>
  );
};

export default PredioTeaser;