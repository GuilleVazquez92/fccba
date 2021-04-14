import React, { useState, useContext } from 'react';
import { getMode } from '@ionic/core';
import { IonHeader, IonToolbar, IonButtons, IonButton, IonTitle, IonContent, IonList, IonListHeader, IonItem, IonLabel, IonCheckbox, IonFooter } from '@ionic/react';
import { DataContext } from '../context';
import './ListFilter.css';

const ListFilter = ({ onDismissModal, onOkModal, cleanFilters, dataFilterPlayers, dataFilterServices }) => {
  const { 
    filterPlayers, 
    setFilterPlayers, 
    filterServices, 
    setFilterServices 
  } = useContext(DataContext);
  const ios = getMode() === 'ios';

  const handleDeselectAll = () => {
    cleanFilters([]);
  };

  const handleSelectAll = () => {
    //updateFilteredTracks([...allTracks]);
  };

  const changeStatus = (filterItem) => {  
    let newArray = filterPlayers.map(a => {
      const returnValue = {...a};
    
      if (a.val === filterItem.val) {
        returnValue.isChecked = !a.isChecked;
      }
      return returnValue
    })
    setFilterPlayers(newArray);
    dataFilterPlayers(newArray);
  };

  const changeFilterServices = (filterItem) => {  
    let newArray = filterServices.map(a => {
      const returnValue = {...a};
    
      if (a.val === filterItem.val) {
        returnValue.isChecked = !a.isChecked;
      }
      return returnValue
    })
    setFilterServices(newArray);
    dataFilterServices(newArray);
  };

  return (
    <>
      <IonHeader translucent={true}>
        <IonToolbar>
          <IonButtons slot="start">
            <IonButton onClick={onDismissModal}>Cancelar</IonButton>
          </IonButtons>

          <IonTitle class="ion-text-center">
            Preferencias
          </IonTitle>

          <IonButtons slot="end">
            <IonButton onClick={onOkModal} strong>Filtrar</IonButton>
          </IonButtons>
        </IonToolbar>
      </IonHeader>

      <IonContent>
        <IonList lines={ ios ? 'inset' : 'full'}>
          <IonListHeader>Cantidad de Jugadores</IonListHeader>

          {filterPlayers.map((filter, f) => (
            <IonItem key={`players${f}`}>
              <IonLabel>{filter.label}</IonLabel>
              <IonCheckbox
                onClick={() => changeStatus(filter)}
                checked={filter.isChecked}
                color="primary"
                value={filter.val}
              ></IonCheckbox>
            </IonItem>
          ))}
        </IonList>
        <IonList lines={ ios ? 'inset' : 'full'}>
          <IonListHeader>Preferencias</IonListHeader>

          {filterServices.map((filter, fp) => (
            <IonItem key={`predios${fp}`}>
              <IonLabel>{filter.label}</IonLabel>
              <IonCheckbox
                onClick={() => changeFilterServices(filter)}
                checked={filter.isChecked}
                color="primary"
                value={filter.val}
              ></IonCheckbox>
            </IonItem>
          ))}
        </IonList>
      </IonContent>
    </>
  );
};

export default ListFilter;
