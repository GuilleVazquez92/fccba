import React, { useState, useContext, useEffect } from 'react';
import { IonHeader, IonToolbar, IonTitle, IonContent, IonPage, IonButtons, IonMenuButton, IonRow, IonCol, IonButton, IonList, IonItem, IonLabel, IonInput, IonText, IonAlert, IonToast, IonModal } from '@ionic/react';
import { DataContext } from '../context';
import { useLocation, useHistory } from 'react-router-dom';
import { connect } from '../data/connect';
import api from '../api';
import { Plugins } from '@capacitor/core';
import FacebookIcon from '@material-ui/icons/Facebook';
import { FacebookLoginResponse } from '@rdlabo/capacitor-facebook-login';
import Card from '../components/Card';
const { FacebookLogin } = Plugins;

const SignIn = () => {
  const { setUser, user } = useContext(DataContext);
  const params = useLocation();
  const history = useHistory();
  const [showAlert, setShowAlert] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [usernameError, setUsernameError] = useState(false);
  const [passwordError, setPasswordError] = useState(false);

  useEffect(() => {
    if (user) {
      if (params.state.path === '/booking') {
        history.push(params.state.path);
      } else {
        history.push('/buscar-turno');
      }
    }
  }, [user]);

  const login = async (e) => {
    e.preventDefault();
    setShowAlert(true);
    setFormSubmitted(true);
    if(!email) {
      setUsernameError(true);
    }
    if(!password) {
      setPasswordError(true);
    }

    if(email && password) {
      try {
        const response = await api.auth.login(
          {email, password}, 
          {headers: {'Content-Type': 'application/json'}}
        );
  
        if (response) {
          setUser(response.data);
          setShowAlert(false);

          if (params.state.path === '/booking') {
            history.push(params.state.path);
          } else {
            history.push('/buscar-turno');
          }
        }
      } catch(err) {
        setShowToast(true);
        setShowAlert(false);
      }
    }
  };

  const loginWithFacebook = async (e) => {
    e.preventDefault();
    setShowAlert(true);
    const FACEBOOK_PERMISSIONS = ['email'];
    const result = await FacebookLogin.login({ permissions: FACEBOOK_PERMISSIONS });

    if (result.accessToken) {
      try {
        const params = `access_token=${result.accessToken.token}&fields=email,id,name,birthday,gender`;
        const dataUser = await api.auth.getFaceData(params);
        if (dataUser) {
          const name = dataUser.data.name.split(' ');
          const userData = await api.auth.loginWithFacebook(
            {
              id: dataUser.data.id,
              firstName: name[0], 
              lastName: name[name.length - 1], 
              dni: null, 
              email: dataUser.data.email,
              token: result.accessToken.token
            }, 
            {headers: {'Content-Type': 'application/json'}}
          );

          if (userData) {
            setUser(userData.data);
            setShowAlert(false);
          }
        }
      } catch(err) {
        setShowAlert(false);
      }
    } else {
      // Cancelled by user.
      setShowAlert(false);
      console.log(`Login cancelado por usuario o falla de token.`);
    }
  };

  return (
    <IonPage id="login-page">
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonMenuButton></IonMenuButton>
          </IonButtons>
          <IonTitle>Ingresar</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>

        <div className="login-logo">
          <img 
            src="assets/img/siluete.png"
            width="120"
            className="mx-auto" />
        </div>

        <form noValidate onSubmit={login}>
          <IonList className="form-fields mx-2 py-0">
            <IonItem>
              <IonInput 
                placeholder="Email"
                name="email" type="text" value={email} spellCheck={false} autocapitalize="off" onIonChange={e => setEmail(e.detail.value)}
                required>
              </IonInput>
            </IonItem>

            {formSubmitted && usernameError && <IonText color="danger">
              <p className="ion-padding-start">
                El email es requerido.
              </p>
            </IonText>}

            <IonItem>
              <IonInput 
                placeholder="Password"
                name="password" type="password" value={password} onIonChange={e => setPassword(e.detail.value)}>
              </IonInput>
            </IonItem>

            {formSubmitted && passwordError && <IonText color="danger">
              <p className="ion-padding-start">
                Password requerido.
              </p>
            </IonText>}
          </IonList>

          <IonRow>
            <IonCol>
              <IonButton type="submit" expand="block">Ingresar</IonButton>
            </IonCol>
            <IonCol>
              <IonButton routerLink="/signup" color="light" expand="block">Registrarse</IonButton>
            </IonCol>
          </IonRow>
          {/* <IonRow>
            <IonCol>
              <button onClick={e => loginWithFacebook(e)} className="bg-blue-500 py-2 rounded text-gray-100 border w-full"><FacebookIcon /> con Facebook</button>
            </IonCol>
          </IonRow> */}
        </form>

      </IonContent>
      <IonAlert
        isOpen={showAlert}
        message="Ingresando..."
        onDidDismiss={() => setShowAlert(false)}
      />
      <IonToast
        isOpen={showToast}
        onDidDismiss={() => setShowToast(false)}
        message="Usuario o Password incorrectos"
        position="top"
        buttons={[
          {
            text: 'Ok',
            role: 'cancel',
            handler: () => {}
          }
        ]}
      />
    </IonPage>
  );
};

export default connect({
  component: SignIn
})
