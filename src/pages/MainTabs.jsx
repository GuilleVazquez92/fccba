import React  from 'react';
import { IonTabs, IonRouterOutlet, IonTabBar, IonTabButton, IonIcon, IonLabel } from '@ionic/react';
import { Route, Redirect } from 'react-router';
import { calendar, location, informationCircle, people, gridOutline } from 'ionicons/icons';
import Predios from './Predios';
import SessionDetail from './SessionDetail';
import MapView from './MapView';
import About from './About';
import Calendar from './Calendar';

const MainTabs = () => {

  return (
    <IonTabs>
      <IonRouterOutlet>
        <Redirect exact path="/" to="/predios" />
        <Route path="/calendar" render={() => <Calendar />} exact={true} />
        <Route path="/predios" render={() => <Predios />} exact={true} />
        <Route path="/schedule/:id" component={SessionDetail} />
        <Route path="/predios/sessions/:id" component={SessionDetail} />
        <Route path="/map" render={() => <MapView />} exact={true} />
        <Route path="/about" render={() => <About />} exact={true} />
      </IonRouterOutlet>
      <IonTabBar slot="bottom">
        <IonTabButton tab="speakers" href="/predios">
          <IonIcon icon={gridOutline} />
          <IonLabel>Predios</IonLabel>
        </IonTabButton>
        <IonTabButton tab="schedule" href="/schedule">
          <IonIcon icon={calendar} />
          <IonLabel>Disponibles</IonLabel>
        </IonTabButton>
        <IonTabButton tab="map" href="/map">
          <IonIcon icon={location} />
          <IonLabel>Mapa</IonLabel>
        </IonTabButton>
        <IonTabButton tab="about" href="/predios/add">
          <IonIcon icon={informationCircle} />
          <IonLabel>Agrega tu predio</IonLabel>
        </IonTabButton>
      </IonTabBar>
    </IonTabs>
  );
};

export default MainTabs;