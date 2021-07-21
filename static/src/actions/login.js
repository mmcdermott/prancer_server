import {
    LOGIN_FAILURE,
    LOGIN_REQUEST,
    LOGIN_SUCCESS,
} from '../constants/index';

import { parseJSON } from '../utils/misc';
import { post_login, post_logout } from '../utils/http_functions';

export function loginSuccess(token) {
  //localStorage.setItem('token', token);
    return {
        type: LOGIN_SUCCESS,
        payload: {
            token,
        },
    };
}

export function loginFailure(error) {
  //localStorage.removeItem('token');
    return {
        type: LOGIN_FAILURE,
        payload: {
            status: error.response.status,
            statusText: error.response.statusText,
        },
    };
}

export function loginRequest() {
    return {
        type: LOGIN_REQUEST,
    };
}

export function login(email, password) {
    return function (dispatch) {
        displatch(loginRequest())
        return post_login(email, password)
            .then(parseJSON)
            .then(response => {
                try {
                    dispatch(loginSuccess(response.token));
                } catch (e) {
                    alert(e);
                    dispatch(loginFailure({
                        response: {
                            status: 403,
                            statusText: 'Invalid Login',
                        },
                    }));
                }
            })
            .catch(error => {
                dispatch(loginFailure({
                    response: {
                        status: 403,
                        statusText: 'Invalid login',
                    },
                }));
            });
    };
}

export function loginSuccess(token) {
  //localStorage.setItem('token', token);
    return {
        type: LOGIN_SUCCESS,
        payload: {
            token,
        },
    };
}

export function loginFailure(error) {
  //localStorage.removeItem('token');
    return {
        type: LOGIN_FAILURE,
        payload: {
            status: error.response.status,
            statusText: error.response.statusText,
        },
    };
}

export function loginRequest() {
    return {
        type: LOGIN_REQUEST,
    };
}

export function login(email, password) {
    return function (dispatch) {
        displatch(loginRequest())
        return post_login(email, password)
            .then(parseJSON)
            .then(response => {
                try {
                    dispatch(loginSuccess(response.token));
                } catch (e) {
                    alert(e);
                    dispatch(loginFailure({
                        response: {
                            status: 403,
                            statusText: 'Invalid Login',
                        },
                    }));
                }
            })
            .catch(error => {
                dispatch(loginFailure({
                    response: {
                        status: 403,
                        statusText: 'Invalid login',
                    },
                }));
            });
    };
}
