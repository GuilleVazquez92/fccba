import React, { useState, useRef, useContext } from 'react';
import { IonContent, IonPage, IonHeader, IonToolbar, IonButtons, IonButton, IonSlides, IonSlide, IonIcon, IonSelect, IonSelectOption } from '@ionic/react';
import { arrowForward } from 'ionicons/icons';
import { DataContext } from '../context';
import { setLocality } from '../data/user/user.actions';
import { connect } from '../data/connect';
import localities from '../data/data/localities';

const Tutorial = ({ history, locality, setLocality }) => {
  const { setHasSeenTutorial } = useContext(DataContext);
  const [showSkip, setShowSkip] = useState(true);
  const slideRef = useRef(null);
  
  const slideOpts = {
    initialSlide: 0,
    speed: 400,
  };

  const startApp = async () => { 
    await setHasSeenTutorial(true);
    history.push('/predios');
  };

  const handleSlideChangeStart = () => { 
    slideRef.current.isEnd().then(isEnd => setShowSkip(!isEnd));
  };

  return (
    <IonPage id="tutorial-page">
      <IonHeader no-border>
        <IonToolbar>
          <IonButtons slot="end">
            {showSkip && <IonButton color='primary' onClick={startApp}>Omitir</IonButton>}
          </IonButtons>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>

        <IonSlides ref={slideRef} onIonSlideWillChange={handleSlideChangeStart} pager={true} options={slideOpts}>
          <IonSlide>
            <img src="assets/img/app-futbol.png" alt="" className="slide-image" />
            <h2 className="slide-title">
              Predios <b>CBA</b>
            </h2>
            <p>
              La primer <b>applicacion</b> para reservar canchas en la Docta.
            </p>
          </IonSlide>

          <IonSlide>
            <img src="assets/img/ica-slidebox-img-2.png" alt="" className="slide-image" />
            <h2 className="slide-title">Como funciona ?</h2>
            <p>
              Buscas tu predio, elegis tipo de cesped, tamaño , horarios y listo  !
            </p>
          </IonSlide>

          <IonSlide>
            <img src="assets/img/predio-canchas.jpg" alt="" className="slide-image" />
            <h2 className="slide-title">Puedo agregar mi predio ?</h2>
            <p>
              Si este es tu lugar indicado !
            </p>
          </IonSlide>

          <IonSlide>
            <img src="assets/img/player-soccer.jpg" alt="" className="slide-image" />
            <h2 className="slide-title">Elije una localidad para que te brindemos mejores resultados !</h2>
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
            <IonButton fill="clear" onClick={startApp} disabled={!locality}>
              Continuar
              <IonIcon slot="end" icon={arrowForward} />
            </IonButton>
          </IonSlide>
        </IonSlides>
      </IonContent>
    </IonPage>
  );
};

export default connect({
  mapStateToProps: (state) => ({
    locality: state.user.locality
  }),
  mapDispatchToProps: ({
    setLocality
  }),
  component: Tutorial
});