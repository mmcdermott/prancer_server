import {
    LOGIN_FAILURE,
    LOGIN_REQUEST,
    LOGIN_SUCCESS,
} from '../constants/index.js';

import { parseJSON } from '../utils/misc.js';
import { post_login, post_logout } from '../utils/http_functions.js';

export function loginSuccess(response) {
    return {
        type: LOGIN_SUCCESS,
        payload: {
        },
    };
}

export function loginFailure(response) {
    return {
        type: LOGIN_FAILURE,
        payload: {
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
        dispatch(loginRequest())
        return post_login(email, password)
            .then(parseJSON)
            .then(response => {
                try {
                    const out = response.success ? loginSuccess(response) : loginFailure(response);
                    dispatch(out);
                    return out;
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
