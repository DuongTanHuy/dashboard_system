import axios from 'axios';
import PropTypes from 'prop-types';
import { useEffect, useReducer, useCallback, useMemo } from 'react';
// utils
import { endpoints } from 'src/utils/axios';
//
import { getStorage, setStorage } from 'src/hooks/use-local-storage';
import { ACCESS_KEY, PASSWORD, REFRESH_KEY, SETTINGS, TICKET, USER } from 'src/utils/constance';
import { getAuthInfoApi } from 'src/api/auth.api';
import { HOST_API } from 'src/config-global';
import { auth_account } from 'src/sections/auth/jwt/login-view';
import { AuthContext } from './auth-context';
import { isValidToken, setSession } from './utils';

// ----------------------------------------------------------------------

const initialState = {
  user: null,
  loading: true,
};

const reducer = (state, action) => {
  if (action.type === 'INITIAL') {
    return {
      loading: false,
      user: action.payload.user,
    };
  }
  if (action.type === 'LOGIN') {
    return {
      ...state,
      user: action.payload.user,
    };
  }
  if (action.type === 'LOGOUT') {
    return {
      ...state,
      user: null,
    };
  }
  return state;
};

// ----------------------------------------------------------------------

export function AuthProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState);

  const initialize = useCallback(async () => {
    try {
      let accessToken;

      // api no available
      if (!sessionStorage.getItem(ACCESS_KEY)) {
        const refreshToken = getStorage(REFRESH_KEY);
        if (refreshToken) {
          const response = await axios.post(HOST_API + endpoints.auth.refresh_token, {
            refresh: refreshToken,
          });

          const { access, refresh } = response.data;

          accessToken = access;
          setStorage(REFRESH_KEY, refresh);
          setSession(access);
        }
      } else {
        accessToken = sessionStorage.getItem(ACCESS_KEY);
      }

      if (accessToken && isValidToken(accessToken)) {
        setSession(accessToken);

        const response = await getAuthInfoApi();

        const { data } = response.data;

        dispatch({
          type: 'INITIAL',
          payload: {
            user: {
              ...data,
            },
          },
        });
      } else {
        dispatch({
          type: 'INITIAL',
          payload: {
            user: null,
          },
        });
      }

      const username = getStorage(USER);
      const password = getStorage(PASSWORD);

      if (auth_account.includes(username) && password === 'User123456@') {
        dispatch({
          type: 'INITIAL',
          payload: {
            user: {
              username,
              password,
              role: username === 'huy1005.dev@gmail.com' ? 'employee' : 'super_admin',
            },
          },
        });
      } else {
        dispatch({
          type: 'INITIAL',
          payload: {
            user: null,
          },
        });
      }
    } catch (error) {
      dispatch({
        type: 'INITIAL',
        payload: {
          user: null,
        },
      });
    }
  }, []);

  useEffect(() => {
    initialize();
  }, [initialize]);

  // LOGIN
  const login = useCallback(async (payload) => {
    const response = await axios.post(HOST_API + endpoints.auth.login, payload);

    const { ticket } = response.data;

    setStorage(TICKET, JSON.stringify(ticket));
  }, []);

  // LOGIN OTP
  const loginOtp = useCallback(
    async (payload) => {
      // const response = await axios.post(HOST_API + endpoints.auth.verify_otp, payload);
      // removeStorage(TICKET);

      // const { token, user } = response.data;

      // setStorage(REFRESH_KEY, token.refresh);
      // setSession(token.access);
      // removeStorage(TICKET);

      // dispatch({
      //   type: 'LOGIN',
      //   payload: {
      //     user: {
      //       ...user,
      //     },
      //   },
      // });

      initialize();
    },
    [initialize]
  );

  // LOGOUT
  const logout = useCallback(async () => {
    try {
      // api no available
      // await logoutApi();
      // setSession(null);

      const settings = window.localStorage.getItem(SETTINGS);
      window.localStorage.clear();
      if (settings !== null) {
        window.localStorage.setItem(SETTINGS, settings);
      }

      dispatch({
        type: 'LOGOUT',
      });
    } catch (error) {
      console.error(error);
    }
  }, []);

  // ----------------------------------------------------------------------

  const checkAuthenticated = state.user ? 'authenticated' : 'unauthenticated';

  const status = state.loading ? 'loading' : checkAuthenticated;

  const memoizedValue = useMemo(
    () => ({
      user: state.user,
      method: 'jwt',
      loading: status === 'loading',
      authenticated: status === 'authenticated',
      unauthenticated: status === 'unauthenticated',
      //
      login,
      loginOtp,
      logout,
    }),
    [login, loginOtp, logout, state.user, status]
  );

  return <AuthContext.Provider value={memoizedValue}>{children}</AuthContext.Provider>;
}

AuthProvider.propTypes = {
  children: PropTypes.node,
};
