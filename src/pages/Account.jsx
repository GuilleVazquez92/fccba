import React, { useState, useContext } from 'react';
import { IonHeader, IonToolbar, IonTitle, IonContent, IonPage, IonButtons, IonMenuButton, IonList, IonItem, IonAlert } from '@ionic/react';
import { DataContext } from '../context';

const Account = () => {
  const { user, setUser, profile } = useContext(DataContext);
  const [showAlert, setShowAlert] = useState(false);

  console.log(user);
  return (
    <IonPage id="account-page">
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonMenuButton></IonMenuButton>
          </IonButtons>
          <IonTitle>Mi cuenta</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        {user &&
          (<div className="ion-padding-top ion-text-center">
            <h2>{`${user.profile && user.profile.firstName} ${user.profile && user.profile.lastName}`}</h2>
            <IonList inset>
              <IonItem routerLink="/support" routerDirection="none">Soporte</IonItem>
              <IonItem routerLink="/logout" routerDirection="none">Salir</IonItem>
            </IonList>
          </div>)
        }
      </IonContent>
      <IonAlert
        isOpen={showAlert}
        header="Change Username"
        buttons={[
          'Cancel',
          {
            text: 'Ok',
            handler: (data) => {
              setUser(data.user);
            }
          }
        ]}
        inputs={[
          {
            type: 'text',
            name: 'username',
            value: user ? user.username : 'demo',
            placeholder: 'username'
          }
        ]}
        onDidDismiss={() => setShowAlert(false)}
      />
    </IonPage>
  );
};

export default Account;