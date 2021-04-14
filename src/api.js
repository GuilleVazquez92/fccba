import React from 'react';
import axios from 'axios';

const baseUrl = 'https://api.fc-cba.com';
const baseS3 = 'https://fccba.s3.amazonaws.com';

const auth = {
  login: (dataModel, headers) => axios.post(`${baseUrl}/auth/login`, dataModel, headers),
  register: (dataModel, headers) => axios.post(`${baseUrl}/auth/register`, dataModel, headers),
  getFaceData: (params) => axios.get(`https://graph.facebook.com/me?${params}`),
  loginWithFacebook: (dataModel, headers) => axios.post(`${baseUrl}/auth/login-social`, dataModel, headers)
};

const predio = {
  add: (dataModel, headers) => axios.post(`${baseUrl}/predios/create`, dataModel, headers),
  getAll: (
    headers, 
    locality, 
    preferences) => axios.get(`${baseUrl}/predios?locality=${locality}&preferences=${preferences}`, headers),
  getAllFiltrered: (
    headers, 
    locality, 
    preferences) => axios.get(`${baseUrl}/predios/filtrered?locality=${locality}&preferences=${preferences}`, headers),
  getTurnos: (headers, id) => axios.get(`${baseUrl}/predios/turnos/${id}/16-06-2020`, headers),
};

const turnos = {
  getAll: (
    headers, 
    locality,
    date,
    hour,
    players, 
    preferences) => axios.get(`${baseUrl}/predios/turnos?locality=${locality}&date=${date}&hour=${hour}&players=${players}`, headers),
  getReservados: (headers, date, hour, predioId) => axios.get(`${baseUrl}/predios/turnos-reservados?date=${date}&hour=${hour}&predioId=${predioId}`, headers),
  checkTurno: (headers, data) => axios.get(`${baseUrl}/turnos/check-turno?date=${data.date}&hour=${data.hour}&predioId=${data.predioId}&turnoId=${data.turnoId}`, headers),
  getTurnosByPredio: (headers, id) => axios.get(`${baseUrl}/predios/turnos/${id}`, headers),
  getMe: (headers, uid) => axios.get(`${baseUrl}/predios/turnos/me/${uid}`, headers),
  cancelBooking: (dataModel, headers, id) => axios.put(`${baseUrl}/turnos/${id}`, dataModel, {headers}),
};

const payment = {
  create: (dataModel, headers) => axios.post(`${baseUrl}/payment/create`, dataModel, {headers})
};

const ads = {
  get: (headers) => axios.get(`${baseUrl}/ads`, headers),
  getByCategory: (headers, category) => axios.get(`${baseUrl}/ads/${category}`, headers)
};

const contact = {
  create: (headers, dataModel) => axios.post(`${baseUrl}/contact/create`, dataModel, headers)
};

export default {
  auth,
  predio,
  turnos,
  payment,
  ads,
  contact,
  baseS3
}