import React, { useState, useContext } from 'react';
import { IonHeader, IonToolbar, IonTitle, IonContent, IonPage, IonButtons, IonMenuButton, IonRow, IonCol, IonButton, IonList, IonItem, IonLabel, IonText, IonTextarea, IonToast } from '@ionic/react';
import { connect } from '../data/connect';
import { DataContext } from '../context';
import api from '../api';

interface OwnProps { }

interface DispatchProps { }

interface SupportProps extends OwnProps, DispatchProps { }

const Support: React.FC<SupportProps> = () => {
  const { user } = useContext(DataContext);
  const [message, setMessage] = useState('');
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [messageError, setMessageError] = useState(false);
  const [showToast, setShowToast] = useState(false);

  const send = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormSubmitted(true);
    if (!message) {
      setMessageError(true);
    }
    if (message) {
      const dataModel = {
        message,
        uid: user._id
      };

      const response = await api.contact.create({headers: user.headers}, dataModel);
      if (response) {
        console.log(response.data);
        setMessage('');
        setShowToast(true);
      }
    }
  };

  return (
    <IonPage id="support-page">
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonMenuButton></IonMenuButton>
          </IonButtons>
          <IonTitle>Soporte</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>

        <div className="login-logo">
          <img 
            src="assets/img/siluete.png"
            width="120"
            className="mx-auto" 
          />
        </div>

        <form noValidate onSubmit={send}>
          <IonList className="mx-2">
            <IonItem>
              <IonTextarea 
                name="message" 
                value={message} 
                spellCheck={false} 
                autocapitalize="off"
                placeholder="Tu mensaje aqui!"
                rows={6} onIonChange={e => setMessage(e.detail.value!)}
                required>
              </IonTextarea>
            </IonItem>

            {formSubmitted && messageError && <IonText color="danger">
              <p className="ion-padding-start">
                Un mensaje es requerido.
              </p>
            </IonText>}
          </IonList>

          <IonRow>
            <IonCol>
              <IonButton type="submit" expand="block">Enviar</IonButton>
            </IonCol>
          </IonRow>
        </form>
       
      </IonContent>
     
      <IonToast
        isOpen={showToast}
        duration={3000}
        message="Su mensaje fue enviado, pronto nos contactaremos con usted."
        onDidDismiss={() => setShowToast(false)} />
    </IonPage>
  );
};

export default connect<OwnProps, {}, DispatchProps>({
  component: Support
})