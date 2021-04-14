import { Plugins } from '@capacitor/core';

const { Storage } = Plugins;

const dataUrl = '/assets/data/data.json';
const locationsUrl = '/assets/data/locations.json';

const HAS_LOGGED_IN = 'hasLoggedIn';
const USER = 'user';
const DARK_MODE = 'darkMode';
const LOCALITY = 'locality';

export const getConfData = async () => {
  const response = await Promise.all([
    fetch(dataUrl),
    fetch(locationsUrl)]);
  const responseData = await response[0].json();
  const schedule = responseData.schedule[0];
  const sessions = parseSessions(schedule);
  const speakers = responseData.speakers;
  const locations = await response[1].json();
  const allTracks = sessions
    .reduce((all, session) => all.concat(session.tracks), [])
    .filter((trackName, index, array) => array.indexOf(trackName) === index)
    .sort();
  
  const data = {
    schedule,
    sessions,
    locations,
    speakers,
    allTracks,
    filteredTracks: [...allTracks]
  }
  return data;
}

export const getUserData = async () => {
  const response = await Promise.all([
    Storage.get({ key: HAS_LOGGED_IN }),
    Storage.get({ key: USER }),
    Storage.get({ key: DARK_MODE }),
    Storage.get({ key: LOCALITY })]);
  const isLoggedin = await response[0].value === 'true';
  const user = await JSON.parse(response[1].value) || null;
  const darkMode = await response[2].value === 'true';
  const locality = await response[3].value || null;
  const data = {
    isLoggedin,
    user,
    darkMode,
    locality
  }
  return data;
}

export const setIsLoggedInData = async (isLoggedIn) => {
  await Storage.set({ key: HAS_LOGGED_IN, value: JSON.stringify(isLoggedIn) });
}

export const setDarkModeData = async (darkMode) => {
  await Storage.set({ key: DARK_MODE, value: JSON.stringify(darkMode) });
}

export const setUserData = async (user) => {
  if (!user) {
    await Storage.remove({ key: USER });
  } else {
    await Storage.set({ key: USER, value: JSON.stringify(user) });
  }
}

export const setLocalityData = async (locality) => {
  await Storage.set({ key: LOCALITY, value: locality });
}

function parseSessions(schedule) {
  const sessions = [];
  schedule.groups.forEach(g => {
    g.sessions.forEach(s => sessions.push(s))
  });
  return sessions;
}
