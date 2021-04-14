import React, { useState, createContext, useEffect } from "react";
import players from './data/data/players';
import services from "./data/data/services";

const DataContext = createContext();

const localUser = JSON.parse(localStorage.getItem('pred_user'));
const localTutorial = localStorage.getItem('pred_has_seen_tutorial');

function InfoProvider(props) {
  const [user, setUser] = useState(localUser || null);
  const [hasSeenTutorial, setHasSeenTutorial] = useState(localTutorial || false);
  const [filterPlayers, setFilterPlayers] = useState(players);
  const [filterServices, setFilterServices] = useState(services);
  const [turno, setTurno] = useState(null);
  const [predio, setPredio] = useState(null);
  const [predios, setPredios] = useState([]);
  const [ads, setAds] = useState([]);

  useEffect(() => {
    if (user) {
      localStorage.setItem('pred_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('pred_user');
    }
  }, [user]);

  useEffect(() => {
    if (hasSeenTutorial) {
      localStorage.setItem('pred_has_seen_tutorial', hasSeenTutorial);
    } else {
      localStorage.removeItem('pred_has_seen_tutorial');
    }
  }, [hasSeenTutorial]);

  return (
    <DataContext.Provider value={{ 
      user, setUser,
      hasSeenTutorial, setHasSeenTutorial,
      // Data.
      filterPlayers, setFilterPlayers,
      filterServices, setFilterServices,
      turno, setTurno,
      predio, setPredio,
      predios, setPredios,
      ads, setAds
    }}>
      {props.children}
    </DataContext.Provider>
  );
}

export { DataContext, InfoProvider };