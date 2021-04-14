import React, { useState } from 'react';
import { IonHeader, IonToolbar, IonTitle, IonContent, IonPage, IonButtons, IonMenuButton, IonRow, IonCol, IonButton, IonList, IonItem, IonLabel, IonInput, IonText, IonAlert, IonSelect, IonSelectOption, IonCheckbox } from '@ionic/react';
import { connect } from '../data/connect';
import api from '../api';
import localities from '../data/data/localities';
import players from '../data/data/players';
import services from '../data/data/services';

const AddPredio = ({ user }) => {
  const [showAlert, setShowAlert] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [locality, setLocality] = useState('');
  const [address, setAddress] = useState('');
  const [playersList, setPlayersList] = useState(players);
  const [servicesList, setServicesList] = useState(services);

  // Set values of players or services.
  const setChecked = (check, val, type) => {
    let newItems = null;
    if (type === 'players') {
      newItems = [...playersList];
    } else {
      newItems = [...servicesList];
    }

    newItems.forEach(item => {
      if (item.val === val) {
        item.isChecked = check;
      }
    });
    
    type === 'players' ? setPlayersList(newItems) : setServicesList(newItems);
  }

  const save = async (e) => {
    e.preventDefault();
    setShowAlert(true);

    const players = [];
    playersList.reduce((a, b) => b.isChecked === true ? players.push(b.val) : null, []);

    const services = [];
    servicesList.reduce((a, b) => b.isChecked === true ? services.push(b.val) : null, []);

    const dataModel = {
      name,
      email,
      phone,
      locality,
      address,
      players,
      services
    };
    const response = await api.predio.add(dataModel, {headers: user.headers});
    if (response) {
      console.log(response);
      setShowAlert(false);
    }
  };

  return (
    <IonPage id="login-page">
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonMenuButton></IonMenuButton>
          </IonButtons>
          <IonTitle>Agregar Predio</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>

        <div className="login-logo">
          <img src="assets/img/logo.jpg" alt="Ionic logo" />
        </div>

        <form noValidate onSubmit={save}>
          <IonList>
            <IonItem>
              <IonLabel position="stacked" color="primary">Nombre</IonLabel>
              <IonInput name="name" type="text" value={name} spellCheck={false} autocapitalize="off" onIonChange={e => setName(e.detail.value)}
                required>
              </IonInput>
            </IonItem>
            <IonItem>
              <IonLabel position="stacked" color="primary">Email</IonLabel>
              <IonInput name="email" type="text" value={email} spellCheck={false} autocapitalize="off" onIonChange={e => setEmail(e.detail.value)}
                required>
              </IonInput>
            </IonItem>
            <IonItem>
              <IonLabel position="stacked" color="primary">Telefono</IonLabel>
              <IonInput name="phone" type="text" value={phone} spellCheck={false} autocapitalize="off" onIonChange={e => setPhone(e.detail.value)}
                required>
              </IonInput>
            </IonItem>
            <IonItem>
              <IonLabel position="stacked" color="primary">Localidad</IonLabel>
              <IonSelect
                value={locality}
                placeholder="Selecciona tu localidad!"
                okText="Ok"
                cancelText="Cancelar"
                onIonChange={e => setLocality(e.target.value)}
              >
                {localities && localities.map((option, k) => 
                  <IonSelectOption key={k} value={option.hash}>{option.label}</IonSelectOption>)}
              </IonSelect>
            </IonItem>
            <IonItem>
              <IonLabel position="stacked" color="primary">Direccion</IonLabel>
              <IonInput name="address" type="text" value={address} spellCheck={false} autocapitalize="off" onIonChange={e => setAddress(e.detail.value)}
                required>
              </IonInput>
            </IonItem>
            <IonItem>
              <IonLabel>Canchas disponibles</IonLabel>
            </IonItem>
            {playersList.map(({ val, isChecked }, i) => (
              <IonItem key={i}>
                <IonLabel>{val}</IonLabel>
                <IonCheckbox
                  slot="end"
                  value={val}
                  checked={isChecked}
                  onIonChange={e => setChecked(e.detail.checked, val, 'players')}
                />
              </IonItem>
            ))}
            <IonItem>
              <IonLabel>Servicios</IonLabel>
            </IonItem>
            {servicesList.map(({ val, isChecked }, p) => (
              <IonItem key={p}>
                <IonLabel>{val}</IonLabel>
                <IonCheckbox
                  slot="end" 
                  value={val} 
                  checked={isChecked}
                  onIonChange={e => setChecked(e.detail.checked, val, 'services')}
                />
              </IonItem>
            ))}
          </IonList>

          <IonRow>
            <IonCol>
              <IonButton type="submit" expand="block">Agregar</IonButton>
            </IonCol>
          </IonRow>
        </form>

      </IonContent>
      <IonAlert
        isOpen={showAlert}
        message="Creando..."
        onDidDismiss={() => setShowAlert(false)}
      />
    </IonPage>
  );
};

export default connect({
  mapStateToProps: (state) => ({
    user: state.user.user
  }),
  component: AddPredio
})