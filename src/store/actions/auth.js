import axios from 'axios';
import { AUTH_SUCCESS, AUTH_LOGOUT, AUTH_NOTIFICATION } from './actionTypes';

export function auth(email, password, base, isLogin) {
  return async (dispatch) => {
    const authData = {
      email,
      password,
      base,
      returnSecureToken: true,
    };

    let url = `${process.env.REACT_APP_URL_SIGNUP}${process.env.REACT_APP_API_KEY}`;

    if (isLogin) {
      url = `${process.env.REACT_APP_URL_SIGNIN}${process.env.REACT_APP_API_KEY}`;
    }
    try {
      const { data } = await axios.post(url, authData);
      const expirationDate = new Date(new Date().getTime() + data.expiresIn * 1000);
      localStorage.setItem('token', data.idToken);
      localStorage.setItem('expirationDate', expirationDate);
      localStorage.setItem('email', data.email);
      localStorage.setItem('base', base);
      dispatch(authSuccess(data.idToken, data.email, base));
      dispatch(autoLogout(data.expiresIn));
      dispatch(authNotification(true, { status: 'success', title: 'Email is correct' }));
    } catch (error) {
      dispatch(authNotification(true, { status: 'error', title: error.message }));
    }
    setTimeout(() => {
      dispatch(authNotification(false, {}));
    }, 1000);
  };
}

export function autoLogout(time) {
  return (dispatch) => {
    setTimeout(() => {
      dispatch(logout());
    }, time * 1000);
  };
}

export function autoLogin() {
  return (dispatch) => {
    const token = localStorage.getItem('token');
    const email = localStorage.getItem('email');
    const base = localStorage.getItem('base');
    if (!token) {
      dispatch(logout());
    } else {
      const expirationDate = new Date(localStorage.getItem('expirationDate'));
      if (expirationDate <= new Date()) {
        dispatch(logout());
      } else {
        dispatch(authSuccess(token, email, base));
        dispatch(autoLogout((expirationDate.getTime() - new Date().getTime()) / 1000));
      }
    }
  };
}

export function logout() {
  for (const key in localStorage) {
    if (!localStorage.hasOwnProperty(key)) {
      continue;
    }
    localStorage.removeItem(key);
  }
  return {
    type: AUTH_LOGOUT,
  };
}

export function authSuccess(token, email, base) {
  return {
    type: AUTH_SUCCESS,
    token,
    email,
    base,
  };
}

export function authNotification(onNotification, notification) {
  return {
    type: AUTH_NOTIFICATION,
    onNotification,
    notification,
  };
}
