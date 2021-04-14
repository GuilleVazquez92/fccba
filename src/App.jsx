import React, { useEffect, useContext, Suspense, lazy,  } from 'react';
import { Redirect, Route } from 'react-router-dom';
import { IonApp, IonRouterOutlet, IonSplitPane } from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';
import { DataContext } from './context';

import Menu from './components/Menu';

/* Core CSS required for Ionic components to work properly */
import '@ionic/react/css/core.css';

/* Basic CSS for apps built with Ionic */
import '@ionic/react/css/normalize.css';
import '@ionic/react/css/structure.css';
import '@ionic/react/css/typography.css';

/* Optional CSS utils that can be commented out */
import '@ionic/react/css/padding.css';
import '@ionic/react/css/float-elements.css';
import '@ionic/react/css/text-alignment.css';
import '@ionic/react/css/text-transformation.css';
import '@ionic/react/css/flex-utils.css';
import '@ionic/react/css/display.css';

/* Theme variables */
import './theme/variables.css';
import { connect } from './data/connect';
import { AppContextProvider } from './data/AppContext';
import { loadUserData } from './data/user/user.actions';
import { InfoProvider } from './context';
import AppUrlListener from './pages/AppUrlListener';
import Spinner from './components/Spinner';
import MyBookings from './pages/MyBookings';

const Account = lazy(() => import("./pages/Account"));
const Signin = lazy(() => import("./pages/Signin"));
const Signup = lazy(() => import("./pages/Signup"));
const Support = lazy(() => import("./pages/Support"));
const Tutorial = lazy(() => import("./pages/Tutorial"));
const HomeOrTutorial = lazy(() => import("./components/HomeOrTutorial"));
const AddPredio = lazy(() => import("./pages/AddPredio"));
const Bookings = lazy(() => import("./pages/Bookings"));
const Predios = lazy(async () => {
  await new Promise(resolve => setTimeout(resolve, 2000));
  return import('./pages/Predios');
});
const PredioDetail = lazy(() => import("./pages/PredioDetail"));
const Booking = lazy(() => import("./pages/Booking"));
const MapView = lazy(() => import("./pages/MapView"));
const About = lazy(() => import("./pages/About"));
const BuscarTurno = lazy(() => import("./pages/BuscarTurno"));


const App = () => {
  return (
    <InfoProvider>
      <AppContextProvider>
        <IonicAppConnected />
      </AppContextProvider>
    </InfoProvider>
  );
};

export default App;

const IonicApp = ({ darkMode, loadUserData }) => {
  const { setUser } = useContext(DataContext);
  useEffect(() => {
    loadUserData();
  }, []);

  return (
    <IonApp className={`${darkMode ? 'dark-theme' : ''}`}>
      <Suspense fallback={<Spinner />}>
        <IonReactRouter>
          <AppUrlListener></AppUrlListener>
          <IonSplitPane contentId="main">
            <Menu/>
            <IonRouterOutlet id="main">
              <Route path="/account" component={Account} />
              <Route path="/about" component={About} />
              <Route path="/buscar-turno" component={BuscarTurno} />
              <Route path="/predios" component={Predios} />
              <Route path="/my-bookings" component={MyBookings} />
              <Route path="/map" component={MapView} />
              <Route path="/turnos/:id" component={Bookings} />
              <Route path="/signin" component={Signin} />
              <Route path="/signup" component={Signup} />
              <Route path="/support" component={Support} />
              <Route path="/tutorial" component={Tutorial} />
              <Route exact path="/predios/add" component={AddPredio} />
              <Route path="/predio/:id" component={PredioDetail} />
              <Route path="/booking" component={Booking} />
              <Route path="/logout" render={() => {
                setUser(null);
                return <Redirect to="/predios" />
              }} />
              <Route path="/" component={HomeOrTutorial} exact />
            </IonRouterOutlet>
          </IonSplitPane>
        </IonReactRouter>
      </Suspense>
    </IonApp>
  )
}

const IonicAppConnected = connect({
  mapStateToProps: (state) => ({
    darkMode: state.user.darkMode,
  }),
  mapDispatchToProps: { loadUserData },
  component: IonicApp
});
