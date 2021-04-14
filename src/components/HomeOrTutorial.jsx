import React, { useContext } from 'react';
import { DataContext } from '../context';
import { Redirect } from 'react-router';

const HomeOrTutorial = () => {
  const { hasSeenTutorial } = useContext(DataContext);
  return hasSeenTutorial ? <Redirect to="/predios" /> : <Redirect to="/tutorial" />
};

export default HomeOrTutorial;