import React, { useContext } from 'react';
import { withRouter, useLocation, useHistory } from 'react-router';

import { IonContent, IonIcon, IonItem, IonLabel, IonList, IonListHeader, IonMenu, IonMenuToggle, IonToggle } from '@ionic/react';
import { calendarOutline, hammer, moonOutline, help, informationCircleOutline, logIn, logOut, mapOutline, peopleOutline, person, personAdd } from 'ionicons/icons';
import { DataContext } from '../context';
import { setDarkMode } from '../data/user/user.actions';

import './Menu.css'
import { connect } from '../data/connect';

const routes = {
  appPages: [
    { title: 'Buscar Turnos', path: '/buscar-turno', icon: calendarOutline },
    { title: 'Predios', path: '/predios', icon: peopleOutline },
    { title: 'Mapa', path: '/map', icon: mapOutline },
    // { title: 'Tu Predio', path: '/predios/add', icon: informationCircleOutline }
  ],
  loggedInPages: [
    { title: 'Cuenta', path: '/account', icon: person },
    { title: 'Mis reservas', path: '/my-bookings', icon: peopleOutline },
    { title: 'Soporte', path: '/support', icon: help },
    { title: 'Salir', path: '/logout', icon: logOut }
  ],
  loggedOutPages: [
    { title: 'Ingresar', path: '/signin', icon: logIn },
    { title: 'Soporte', path: '/support', icon: help },
    { title: 'Registrarse', path: '/signup', icon: personAdd }
  ]
};


const Menu = ({ darkMode, setDarkMode}) => {
  const { user } = useContext(DataContext);
  const location = useLocation();
  const history = useHistory();

  function renderlistItems(list) {
    return list
      .filter(route => !!route.path)
      .map(p => (
        <IonMenuToggle key={p.title} auto-hide="false">
          <IonItem detail={false} routerLink={p.path} routerDirection="none" className={location.pathname.startsWith(p.path) ? 'selected' : undefined}>
            <IonIcon slot="start" icon={p.icon} />
            <IonLabel>{p.title}</IonLabel>
          </IonItem>
        </IonMenuToggle>
      ));
  }

  return (
    <IonMenu  type="overlay" contentId="main">
      <IonContent forceOverscroll={false}>
        <IonList lines="none py-1">
          <IonListHeader>Menu</IonListHeader>
          {renderlistItems(routes.appPages)}
        </IonList>
        <IonList lines="none">
          <IonListHeader>Mi cuenta</IonListHeader>
          {user ? renderlistItems(routes.loggedInPages) : renderlistItems(routes.loggedOutPages)}
          <IonItem>
            <IonIcon slot="start" icon={moonOutline}></IonIcon>
            <IonLabel>Modo oscuro</IonLabel>
            <IonToggle checked={darkMode} onClick={() => setDarkMode(!darkMode)} />
          </IonItem>
        </IonList>
        <IonList lines="none">
          <IonListHeader>Tutorial</IonListHeader>
          <IonItem button onClick={() => {
            history.push('/tutorial');
          }}>
            <IonIcon slot="start" icon={hammer} />
            Mostrar Tutorial
          </IonItem>
        </IonList>
      </IonContent>
    </IonMenu>
  );
};

export default connect({
  mapStateToProps: (state) => ({
    darkMode: state.user.darkMode,
  }),
  mapDispatchToProps: ({
    setDarkMode
  }),
  component: withRouter(Menu)
});