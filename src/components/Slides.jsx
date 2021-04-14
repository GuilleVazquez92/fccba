import React, { useState } from "react";
import { IonSlides, IonSlide, IonImg } from "@ionic/react";
import api from "../api";

const slideOpts = {
  initialSlide: 0,
  speed: 400,
  effect: "fade",
  autoplay: {
    delay: 5000
  }
};
 //TIENEN QUE DAR PERMISOS (AWS) A CONSULTAS POR ESO NO MUESTRA LA IMAGEN DE SU PUBLICIDAD 
const Slides = ({ ads }) => {
  return (
    <IonSlides pager={true} options={slideOpts}>
      {ads.map(ad => (
        <IonSlide>
          {
            
        <img src={`${api.baseS3}/ads/${ad.image}`} className="w-full h-48" /> 
            //<img src="https://www.monederosmart.com/wp-content/uploads/2020/06/RzW-bYa-yuriy-chertok-80788693_m-e1591647240577.jpg" className="w-full h-48" />
           
          }

        </IonSlide>
      ))}

      
    </IonSlides>
  );
};

export default Slides;
