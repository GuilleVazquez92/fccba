import React, { useState, useContext } from 'react';
import { 
  IonHeader, 
  IonToolbar, 
  IonTitle, 
  IonContent, 
  IonPage, 
  IonButtons, 
  IonMenuButton,
  IonSelect, 
  IonSelectOption,
  IonDatetime,
  IonLabel,
  IonCheckbox,
  IonRadioGroup,
  IonRadio,
  IonButton,
  IonRow,
  IonGrid,
  IonSpinner,
  IonItem
} from '@ionic/react';
import api from '../api';
import localities from '../data/data/localities';
import players from '../data/data/players';
import services from '../data/data/services';
import hours from '../data/data/hours';
import PredioTeaser from '../components/PredioTeaser';
import { DataContext } from '../context';
import TurnoTeaser from '../components/TurnoTeaser';
import Slides from '../components/Slides';


const BuscarTurno = () => {
  const { user, ads, setAds } = useContext(DataContext);
  const courtTypes = [
    {
      hash: 'natural',
      label: 'Natural'
    },
    {
      hash: 'sintetico',
      label: 'Sintetico'
    }
  ];
  const today = new Date().toLocaleDateString("es-ES", { day: '2-digit', month: '2-digit', year: 'numeric' });
  const [locality, setLocality] = useState('capital');
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [fecha, setFecha] = useState(today);
  const [hour, setHour] = useState('21:00');
  const [checkedPlayers, setCheckedPlayers] = useState(players);
  const [selectedPlayer, setSelectedPlayer] = useState(7);
  const [checkedServices, setCheckedServices] = useState(services);
  const [loading, setLoading] = useState(false);
  const [turnos, setTurnos] = useState([]);
  const [predios, setPredios] = useState([]);
  const [courtType, setCourtType] = useState('sintetico');

  const changeDate = (e, value) => {
    e.preventDefault();
    const fechaFormat = new Date(value).toLocaleDateString("es-ES", { day: '2-digit', month: '2-digit', year: 'numeric' });
    setFecha(fechaFormat);
    const date = new Date(value);
    const timestamp = date.getTime();

    const startDateSeconds = new Date(timestamp);
    startDateSeconds.setHours(0,0,1,0);
    setStartDate(parseInt(startDateSeconds.getTime() / 1000));

    const endDateSeconds = new Date(timestamp);
    endDateSeconds.setHours(23,59,59,0);
    setEndDate(parseInt(endDateSeconds.getTime() / 1000));
  };

  const handleServices = (service) => {
    let newArray = [...checkedServices];

    newArray.map(a => {
      if (a.val === service.val) {
        a.isChecked = !a.isChecked;
      }
    })
    setCheckedServices(newArray);
  }

  const loadPredios = async () => {
    setLoading(true);
    const arrayPreferences = [];
    checkedServices.reduce((a, b) => b.isChecked && arrayPreferences.push(b.val), []);
    let preferences = arrayPreferences.join(',');
    if (!preferences) {
      preferences = ['natual'];
    }

    const adsResponse = await api.ads.getByCategory({headers: {'Content-Type': 'application/json'}}, 'standard');
    if (adsResponse) {
      setAds(adsResponse.data);
      //buscar donde setea la informacion del con el nombre de la publicidad 
      // console.log("ads");
      // console.log(adsResponse);

    }

    // Obtener Predios por zona.
    // AGREGAR VALIDACION POR ETIQUETA  NECESITARMOS VER LA BASE DE DATOS
    // AGREGAR UN ALERT EN CASO DE NO ENCONTRAR CIERTO FILTRO
    //VER FUNCION QUE TRAE LOS TURNOS SI TIENE FILTRO POR ESTADO DE RESERVA
    //CONTROLAR QUE SE HAGAN LOS UPDATES DE LAS RESERVAS
    

    // predio response me trae todos los predios con estado activo y filtrado por localidad y preferencia
    const prediosResponse = await api.predio.getAllFiltrered({headers: {'Content-Type': 'application/json'}}, locality, preferences);
    //  console.log(" localidad >  " + locality + " preferencia > " + preferences);
    //  console.log("PREDIO RESPONSE ");
      // console.log( prediosResponse);
    const listTurnos = [];
    //reservados no funciona porque no tiene el dato locality en su schema  por eso no trae los reservados 
    const reservados = await api.turnos.getAll({headers: {'Content-Type': 'application/json'}}, locality, fecha, hour, selectedPlayer);
    console.log("localidad > " + locality + " fecha > " + fecha + " hora > " + hour + " player > " + selectedPlayer);
     console.log("reservados");
     console.log(reservados);
  
 
    const bookingCourts = [];
    reservados.data.map((court) => bookingCourts.push(court.courtId));
    // console.log("aqui");
    // console.log(reservados.data.map((court) => bookingCourts.push(court.courtId)));
    prediosResponse.data.map(predio => {
      // const reservados = await api.turnos.getMe({headers: {'Content-Type': 'application/json'}},predio._id);
      predio.courts.map((court) => {
     
        /*
          
          meter reservados y predio en array recorrer el array preguntar por los "ID DE LOS PREDIOS" si son iguales predios y reservados

          seleccionamos uno de los id de reservados y preguntamos por todos sus hijos 

            si los hijos son todos distintos  quiere decir que la reserva es un padre 
                  entonces no debe mostrar los hijos
            si un hijo es igual a una reserva 
                  entonces debe mostrar solo los hijos disponibles 

        
        */ 
      
        //metodo para filtrar hijos ya usados y mostrar solo los disponibles
       /* if(reservados.length > 0){
         //si coincide la reservacion debo preguntar si algun hijo esta reservado 
          if(reservados.hour === hour && reservados.date === fecha && reservados.locality === locality){

                    // plantear agregar mas estados referente si esta siendo usado o no (reservado, disponible ,pendiente )
                    court.children.map(turnoChildItem => {
                      //pregunta por los id si son distintos
                        if( turnoChildItem.id != reservados.courtId){
                          const turnoChild = {
                            id: court.id,
                            label: turnoChildItem.label,
                            price: turnoChildItem.price,
                            status: turnoChildItem.status,
                            chilId: turnoChildItem.id,
                            type: turnoChildItem.type,
                            predio,
                            date: fecha,
                            hour 
                          };
                          
                      
                          listTurnos.push(turnoChild);
                    
                        }
                    
                    });
            
                  

          }

        }*/

        if (court.players === selectedPlayer) {
            
            // console.log("base de datos local check list >"+court.players);
          if (court.type === courtType) {
                console.log("I D > ");
               
              // console.log("tipo pasto seleccionado > " + courtType);
             
              // console.log("longitud del bookin > " + bookingCourts.length);  
            if (bookingCourts.length) {
              // console.log("longitud del bookin > " + bookingCourts.length);
              bookingCourts.map(itemCourt => {
                if (!court.items.includes(itemCourt)) {
                  const turnoItem = {
                    id: court.id,
                    label: court.label,
                    price: court.price,
                    status: court.status,
                    locality : predio.locality,
                    type: court.type,
                    predio,
                    date: fecha,
                    hour 
                  };
                  // console.log("encontrado");
          
                  listTurnos.push(turnoItem); 
                }
              })
            } else {
                
                      const turnoItem = {
                        id: court.id,
                        label: court.label,
                        price: court.price,
                        status: court.status,
                        locality : predio.locality,
                        type: court.type,
                        predio,
                        date: fecha,
                        hour  
                      };
                      //  console.log("encontrado else");
                      // console.log(listTurnos);
                      // console.log("el estado es > " + turnoItem.status);
                      
                      listTurnos.push(turnoItem); 
                   
                    
            }
          
          }
          //aca recorre por los hijos de player por las etiquetas
          court.children.map(turnoChildItem => {
              // console.log(" por children > "+ turnoChildItem.type);
            if (turnoChildItem.type === courtType) {
                // console.log("entro por children"+ turnoChildItem.type  );

                // console.log(bookingCourts.includes(turnoChildItem.id));
              // if (!bookingCourts.includes(turnoChildItem.id) && court.players !== selectedPlayer) 
              console.log(court.players);
              if (court.players !== selectedPlayer) {

                const turnoChild = {
                  id: court.id,
                  label: turnoChildItem.label,
                  price: turnoChildItem.price,
                  status: turnoChildItem.status,
                  locality : predio.locality,
                  type: turnoChildItem.type,
                  predio,
                  date: fecha,
                  hour 
                };
                console.log("map");
                listTurnos.push(turnoChild);
              }
            }
          })
      }
     else{
        court.children.map(turnoChildItem => {
          // console.log(" por children > "+ turnoChildItem.type);
        if (turnoChildItem.type === courtType) {
            // console.log("entro por children"+ turnoChildItem.type  );

            // console.log(bookingCourts.includes(turnoChildItem.id));
          // if (!bookingCourts.includes(turnoChildItem.id) && court.players !== selectedPlayer) 
          // console.log(court.players);
          var regex = /(\d+)/g;
          if (court.players !== selectedPlayer) {
                    // console.log(parseInt(turnoChildItem.label.match(regex)));
                    // console.log(selectedPlayer);

                    if(parseInt(turnoChildItem.label.match(regex)) === selectedPlayer){
                    const turnoChild = {
                      id: court.id,
                      label: turnoChildItem.label,
                      price: turnoChildItem.price,
                      status: turnoChildItem.status,
                      chilId: turnoChildItem.id,
                      locality : predio.locality,
                      type: turnoChildItem.type,
                      predio,
                      date: fecha,
                      hour 
                    };
                      // console.log("holi");
                
                    listTurnos.push(turnoChild);
                  }
        }
        }
      })
      }

          // igual entra por el else carga 2 veces y luego setea y actualiza

          //entra por varios lados otra vez 
        // else {
          
        //     window.alert("No hay canchas disponibles en ese horario");
          
        // }
     
      });
    });
    setTurnos(listTurnos);
    setLoading(false);    
  }

  return (
    <IonPage id="search-turno">
      <IonHeader translucent={true}>
        <IonToolbar>
          <IonButtons slot="start">
            <IonMenuButton />
          </IonButtons>
          <IonTitle>Buscá turno</IonTitle>
        </IonToolbar>
        
      </IonHeader>

      <IonContent fullscreen={true}>
        <div className="form-search-turno p-2">
          <div className="field-where row pb-2">
            <div className="flex">
              <div className="label w-2/6">Donde:</div>
              <div className="field w-4/6">
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
              </div>
            </div>
          </div>
          <div className="field-locality flex">
            <div className="field-date w-2/4 flex">
              <div className="label w-2/6">Dia: </div>
              <div className="field w-4/6">
                <IonDatetime
                  displayFormat="DD MMMM YYYY"
                  placeholder={today}
                  min="2019"
                  max="2030"
                  cancelText="Cancelar"
                  doneText="Ok"
                  monthNames="Enero, Febrero, Marzo, Abril, Mayo, Junio, Julio, Agosto, Septiembre, Octubre, Noviembre, Diciembre"
                  onIonChange={e => changeDate(e, e.target.value)}
                ></IonDatetime>
              </div>
            </div>
            <div className="field-hours w-2/4 flex">
              <div className="label w-2/4">Hora: </div>
              <div className="field w-2/4">
                <IonSelect
                  value={hour}
                  placeholder="21:00"
                  okText="Ok"
                  cancelText="Cancelar"
                  onIonChange={e => setHour(e.target.value)}
                >
                  {hours.map((hour, hk) => (
                    <IonSelectOption key={hk} value={hour}>{hour}</IonSelectOption>
                  ))}
                </IonSelect>
              </div>
            </div>
          </div>
          <div className="field-players">
            <div className="label">Cantidad de jugadores: </div>
            <div className="field">
              <IonRadioGroup 
                value={selectedPlayer} 
                onIonChange={e => setSelectedPlayer(e.detail.value)}
                className="flex"
              >
                {checkedPlayers.map((player) => (
                  <div class={`w-1/5 ${selectedPlayer === player.val ? 'active' : 'inactive'}`}>
                    <IonLabel>{player.val}</IonLabel>
                    <IonRadio slot="start" value={player.val} />
                  </div>
                ))}
              </IonRadioGroup>
            </div>
          </div>
          <div className="field-preferences pb-2 mx-2">
            <div className="label">Preferencias: </div>
            <div className="field flex flex-wrap">
              {checkedServices.map((service) => {
                return <div class="my-checkbox w-1/3">
                  <IonLabel text-uppercase>{service.val} </IonLabel>
                  <IonCheckbox 
                    name={service.val}
                    onClick={() => handleServices(service)}
                    checked={service.isChecked}
                    color="primary"
                    value={service.val}
                  >
                  </IonCheckbox>
                </div>
              })}
            </div>
          </div>
          <div className="field-players pb-2 mx-2">
            <div className="label">Cesped: </div>
            <div className="field">
              <IonSelect
                value={courtType}
                placeholder="Selecciona el tipo.."
                okText="Ok"
                cancelText="Cancelar"
                onIonChange={e => setCourtType(e.target.value)}
              >
                {courtTypes && courtTypes.map((option, k) => 
                  <IonSelectOption key={k} value={option.hash}>{option.label}</IonSelectOption>)}
              </IonSelect>
            
            </div>
          </div>
          <div className="field-buttons pb-2">
            <IonButton 
              type="submit" 
              expand="block"
              onClick={() => loadPredios()}
            >BUSCAR</IonButton>
          </div>
       
          <div className="results">
            {loading ? (
              <IonGrid fixed>
                <IonRow><IonSpinner name="crescent" /></IonRow>
              </IonGrid>
            ) : null}
             
            {turnos.map((turno, t) => (
              <>
                <TurnoTeaser 
                  key={t} 
                  
                  turno={turno}
                  predio={turno.predio}
                />
                  
                {t == 1 || t === 7 ? (
                   
                  <IonRow>
                    {ads.length >= 0 && <Slides ads={ads}
                      />
                    
                    
                    }
                      
                  </IonRow>
                ) : null }
              </>  
            ))}
          </div>  
        </div>
      </IonContent>
    </IonPage>
  );
};

export default BuscarTurno;