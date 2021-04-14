import React, { useState, useEffect, useContext } from "react";
import {
  IonButton,
  IonHeader,
  IonTitle,
  IonToolbar,
  IonButtons,
  IonAlert,
  IonIcon,
  IonList,
  IonItem,
  IonLabel,
  IonInput
} from "@ionic/react";
import { checkboxOutline, checkmarkCircle } from "ionicons/icons";
//import "react-credit-cards/lib/styles.scss";
import api from "../api";
import { DataContext } from '../context';

const Card = ({ closeModal, turno, amount}) => {
  const { user, predio } = useContext(DataContext);
  const [cardSelected, setCardSelected] = useState(null);
  const [loaded, setLoaded] = useState(false);
  const MP_PUBLIC_KEY = predio.mpPublicKey;
  const publicKey = 'Mercadopago.setPublishableKey("' + MP_PUBLIC_KEY + '");';
  // Cards.
  const [expiry, setExpiry] = useState('');
  const [cardData, setCardData] = useState(null);
  const [showAlert, setShowAlert] = useState(false);
  const [errorMessages, setErrorMessages] = useState([]);

  useEffect(() => {
    let script = document.createElement("script");
    script.onload = function() {
      let newScript = document.createElement("script");
      let inlineScript = document.createTextNode(publicKey);
      newScript.appendChild(inlineScript);
      document.getElementsByTagName("head")[0].appendChild(newScript);
    };

    script.src = "https://secure.mlstatic.com/sdk/javascript/v1/mercadopago.js";
    script.async = true;
    script.setAttribute("id", "mercadopago");

    const onScriptLoad = () => {
      setLoaded(true);
    };
    script.addEventListener("load", onScriptLoad);

    document.getElementsByTagName("head")[0].appendChild(script);
  }, [loaded]);

  const setDateExpiry = e => {
    let newValue = e.target.value;
    if (newValue.length < 6) {
      if (newValue.length === 2) {
        newValue = newValue + "/";
      }

      setExpiry(newValue);
    }
  };

  const onKeyUp = e => {
    let newValue = e.target.value;
    if (newValue.length === 3 && e.keyCode === 8) {
      newValue = newValue.slice(0, 1);
    }
    setExpiry(newValue);
  };

  const addCard = () => {
    if (cardData && expiry && cardData.number && cardData.cvc && cardData.name) {
      const expiryData = cardData.expiry.split("/");
      window.Mercadopago.createToken(
        {
          cardNumber: cardData.number,
          securityCode: cardData.cvc,
          cardExpirationMonth: expiryData[0],
          cardExpirationYear: expiryData[1],
          cardholderName: cardData.name,
          docType: "DNI",
          docNumber: user.profile.dni,
          identificationNumber: user._id,
          installments: 1
        },
        tokenHandler
      );
    } else {
      setShowAlert(true);
    }
  };

  //  Generate token.
  const tokenHandler = async (status, response) => {
    if (status === 400) {
      // @TODO: Show message of error card.
      if (response.error === "bad_request") {
        let errorMessage = [];
        response.cause.forEach(message => {
          switch (message.code) {
            case "E301":
              errorMessage.push("Numero de tarjeta incorrecto.");
              break;
            case "E302":
              errorMessage.push("Codigo de seguridad incorrecto.");
              break;
            case "208":
            case "325":
            case "209":
            case "326":
              errorMessage.push("La fecha que expira es incorrecta.");
              break;
            default:
              break;
          }
        });
        if (errorMessage.length > 0) {
          setErrorMessages(errorMessage);
          setShowAlert(true);
        }
      }
    }

    if (status === 200) {
      const data = {
        user,
        predio,
        date: turno.date,
        hour: turno.hour,
        label: turno.label,
        price: turno.price,
        pricePaid: amount,
        parentId: turno.parentId,
        courtId: turno.id,
        token: response.id,
        firstSix: response.first_six_digits,
        lastFour: response.last_four_digits,
        dateDue: response.date_due,
        payment: true
      };

      try {
        const responsePayment = await api.payment.create(data, user.headers);
        if (responsePayment.status === 200) {
          if (responsePayment.body.status === 'approved') {
            // @TODO: // Close Card component.
            closeModal();
          }
          console.log(responsePayment);
          // @TODO: Add message or alert for advice that is ok.
        }
      } catch (err) {
        console.log(err);
      }
    }
    return;
  };

  return (
    <div className="card-component">
      <IonHeader translucent={true}>
        <IonToolbar>
          <IonTitle className="text-left">Elije tu Tarjeta</IonTitle>
          <IonButtons slot="end">
            <IonButton onClick={closeModal} strong>X</IonButton>
          </IonButtons>
        </IonToolbar>
      </IonHeader>
      <div>
        <div className="list-cards w-full px-4 mt-4">
          {user && user.cards &&
            user.cards.map((cardItem, index) => {
              return (
                <div
                  className={`p-2 mb-1 ${
                    cardSelected === cardItem.token
                      ? "bg-gray-300 rounded"
                      : "bg-gray-100"
                  } flex`}
                  onClick={() => setCardSelected(cardItem.token)}
                >
                  <div className="w1/9 mr-2 align-middle">
                    <img
                      src={`/assets/${cardItem.id}.gif`}
                      width="24"
                      height="24"
                      className="pt-2"
                    />
                  </div>
                  <div className="w6/9">
                    {`${cardItem.label} terminada en **${cardItem.lastFour}`}
                  </div>
                  <div className="w2/9  ml-2 pt-1 text-right">
                    <IonIcon
                      icon={
                        cardSelected === cardItem.token
                          ? checkmarkCircle
                          : checkboxOutline
                      }
                    ></IonIcon>
                  </div>
                </div>
              );
            })}
        </div>
        <div className="p-4">
          <div className="card-fields px-4">
            <div className="flex">
            <IonList>
              <IonItem>
                <IonLabel position="stacked" color="primary">Nombre (como en la tarjeta)</IonLabel>
                <IonInput 
                  id="cardName"
                  name="name" 
                  type="text" 
                  spellCheck={false} 
                  autocapitalize="off" 
                  onIonChange={e => setCardData({ ...cardData, name: e.target.value })}
                  required></IonInput>
              </IonItem>
              <IonItem>
                <IonLabel position="stacked" color="primary">Numero de tarjeta</IonLabel>
                <IonInput 
                  id="cardNumber"
                  name="number" 
                  type="text" 
                  spellCheck={false} 
                  autocapitalize="off" 
                  onIonChange={e => setCardData({ ...cardData, number: e.target.value })}
                  required></IonInput>
              </IonItem>
              <IonItem>
                <IonLabel position="stacked" color="primary">Fecha que expira (Formato: MM/YY.)</IonLabel>
                <IonInput 
                  id="expDate"
                  name="expiry"
                  type="text" 
                  spellCheck={false} 
                  autocapitalize="off"
                  value={expiry}
                  onIonChange={e => setDateExpiry(e)}
                  onKeyUp={onKeyUp}
                  required></IonInput>
              </IonItem>
              <IonItem>
                <IonLabel position="stacked" color="primary">Codigo de seguridad.</IonLabel>
                <IonInput 
                  required
                  id="cvv"
                  name="cvc"
                  type="password"
                  onIonChange={e => setCardData({ ...cardData, cvc: e.target.value })}
                ></IonInput>
              </IonItem>
            </IonList>  
            </div>
            <div className="flex">
            </div>
            <div className="flex">
              <div className="w-1/2 mr-2">
              </div>
              <div className="w-1/2 ml-2">
              </div>
            </div>
            <div className="flex">
              <IonButton
                onClick={() => addCard()}
              >
                Finalizar reserva!
              </IonButton>
            </div>
          </div>
        </div>
      </div>
      <IonAlert
        isOpen={showAlert}
        onDidDismiss={() => setShowAlert(false)}
        cssClass="alert-custom-class"
        message={
          errorMessages.length > 0
            ? errorMessages[0]
            : "Todos los campos son obligatorios."
        }
        buttons={["OK"]}
      />
    </div>
  );
};

export default Card;
