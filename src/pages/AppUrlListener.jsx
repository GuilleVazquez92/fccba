import React, { useEffect } from 'react';
import { useHistory, Redirect } from 'react-router-dom';
import { Plugins } from '@capacitor/core';
const { App: CapApp } = Plugins;

const AppUrlListener = () => {
    let history = useHistory();
    useEffect(() => {
      CapApp.addListener('appUrlOpen', (data) => {
        const slug = data.url.split('.com').pop();
        if (slug) {
          return <Redirect to={slug} />
          // history.push(slug);
        } else {
          history.push('/');
        }
        // If no match, do nothing - let regular routing
        // logic take over
      });
    }, []);
  
    return null;
  };
  
  export default AppUrlListener;