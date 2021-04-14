import React, { useState, useRef, useEffect, useContext } from 'react';
import { IonHeader, IonToolbar, IonTitle, IonContent, IonPage, IonButtons, IonMenuButton, IonGrid, IonRow, IonCol, IonButton, IonIcon, IonModal, IonItem, IonLabel, IonInput, IonSearchbar, IonSpinner, IonRefresher, IonRefresherContent } from '@ionic/react';
import Predio from '../components/PredioTeaser';
import { options, search } from 'ionicons/icons';
import ListFilter from '../components/ListFilter';
import { connect } from '../data/connect';
import listPlayers from '../data/data/players';
import listServices from '../data/data/services';
import api from '../api';
import Slides from '../components/Slides';
import { DataContext } from '../context';
import { chevronDownCircleOutline } from 'ionicons/icons';

const Predios = ({ user, locality }) => {
  const {setAds, ads, predios, setPredios} = useContext(DataContext);
  const [showSearchbar, setShowSearchbar] = useState(false);
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [filterPlayers, setFilterPlayers] = useState(listPlayers);
  const [filterServices, setFilterServices] = useState(listServices);
  const [filterSearch, setFilterSearch] = useState('');
  // const [loading, setLoading] = useState(true);
  const ios = 'ios';

  useEffect(() => {
    fetchPredios();
  }, []);

  const cleanFilters = () => {
    setShowFilterModal(false);
  };
  
  const pageRef = useRef(null);

  const setDataPlayers = (items) => {
    setFilterPlayers(items);
  };

  const setDataServices = (items) => {
    setFilterServices(items);
  };

  const fetchPredios = async (withFilters = false) => {
    if (withFilters) {
      setFilterPlayers(filterPlayers);
      setFilterServices(filterServices);
    }

    //
    const arrayServices = [];
    filterServices.reduce((a, b) => b.isChecked && arrayServices.push(b.val), []);

    const arrayPlayers = [];
    filterPlayers.reduce((a, b) => b.isChecked && arrayPlayers.push(b.val), []);
    
    // Si arrayServices no esta vacio uso filter services.
    let queryservices = [];
    if (arrayServices.length > 0) {
      queryservices = arrayServices;
    } else { // Si no: Agrego todos los filtros.
      const arrayEmptyServices = [];
      listServices.reduce((a, b) => !b.isChecked && arrayEmptyServices.push(b.val), []);
      queryservices = arrayEmptyServices;
    }
      //trae las publicidades que son premium
     const adsResponse = await api.ads.getByCategory({headers: {'Content-Type': 'application/json'}}, 'premium');
    //  al no encontrar publicidad con el filtro retorna  "basic" o "premium"  pone 0
    //standar si retorna pero debe dar permiso del aws para que puedan acceder a la direccion de la imagen
    //  console.log(adsResponse); 
     if (adsResponse) {
      setAds(adsResponse.data);
     }
    const response = await api.predio.getAll({headers: {'Content-Type': 'application/json'}}, locality, queryservices);
     console.log(response);
    if (response) {
      const listPredios = [];
      response.data.forEach((predioItem) => {
        if (arrayPlayers.length === 0) {
          listPredios.push(predioItem)
        } else if (predioItem.courts.some(item => arrayPlayers.includes(item.players))) {
          listPredios.push(predioItem)
        }
      });
      setPredios(listPredios);
      // setLoading(false);
    }
  };

  const doRefresh = (event) => {  
    fetchPredios();
    setTimeout(() => {
      event.detail.complete();
    }, 1000);
  }

  return (
    <IonPage ref={pageRef} id="predios-page">
      <IonHeader translucent={true}>
        <IonToolbar>
          {!showSearchbar &&
            <IonButtons slot="start">
              <IonMenuButton />
            </IonButtons>
          }

          {!showSearchbar &&
            <IonTitle>Predios</IonTitle>
          }
          {showSearchbar &&
            <IonSearchbar 
              showCancelButton="always" 
              placeholder="Buscar predio..." 
              onIonChange={(e) => setFilterSearch(e.detail.value)} 
              onIonCancel={() => setShowSearchbar(false)}>
            </IonSearchbar>
          }

          <IonButtons slot="end">
            {!showSearchbar &&
              <IonButton onClick={() => setShowSearchbar(true)}>
                <IonIcon slot="icon-only" icon={search}></IonIcon>
              </IonButton>
            }
            {!showSearchbar &&
              <IonButton onClick={() => setShowFilterModal(true)}>
                <IonIcon icon={options} slot="icon-only" />
              </IonButton>
            }
          </IonButtons>
        </IonToolbar>
      </IonHeader>

      <IonContent fullscreen={true}>
        <IonRefresher slot="fixed" onIonRefresh={doRefresh}>
          <IonRefresherContent
            pullingIcon={chevronDownCircleOutline}
            pullingText="Pull to refresh"
            refreshingSpinner="circles"
            refreshingText="Cargando...">
          </IonRefresherContent>
        </IonRefresher>
          <IonGrid>
            <IonRow key="predios-list">
              {predios
                .filter(predioItem => {
                  if (filterSearch !== '') {
                    return predioItem.name.toLowerCase().search(filterSearch.toLowerCase()) !== -1;
                  }
                  return true;
                })
                .map((predioItem, p) => (
                  <>
                    <Predio
                      key={predioItem._id}
                      predio={predioItem}
                    />
                    {p === 1 || p === 4 || p === 7 || p === 10 ? (
                      <IonRow className="w-full">
                        {ads.length && <Slides ads={ads}/>}
                      </IonRow>
                    ) : null }
                  </>
                )
              )}
              {/* {loading ? (
                <IonGrid fixed>
                  <IonRow><IonSpinner name="crescent" /></IonRow>
                </IonGrid>
              ) : null} */}
            </IonRow>
          </IonGrid>
          <IonModal
            isOpen={showFilterModal}
            //onDidDismiss={() => setShowFilterModal(false)}
            swipeToClose={true}
            //presentingElement={pageRef.current!}
            cssClass="session-list-filter"
          >
            <ListFilter
              onDismissModal={() => {
                setShowFilterModal(false);
              }}
              onOkModal={() => {
                setShowFilterModal(false);
                fetchPredios(true);
              }}
              cleanFilters={cleanFilters}
              dataFilterServices={setDataServices}
              dataFilterPlayers={setDataPlayers}
            />
          </IonModal>
      </IonContent>
    </IonPage>
  );
};

export default connect({
  mapStateToProps: (state) => ({
    user: state.user.user,
    locality: state.user.locality
  }),
  component: Predios
});