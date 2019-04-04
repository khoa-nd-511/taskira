import * as actions from './actionTypes';

export const checkAuth = (email, password) => {
  const baseUrl = 'http://localhost:5000/graphql';

  const reqBody = {
    query: `
        query {
          signIn(email: "${email}", password: "${password}") {
            userId
            token
          }
        }
      `
  }

  return dispatch => {
    dispatch(checkAuthStart())
    fetch(baseUrl, {
      method: 'POST',
      body: JSON.stringify(reqBody),
      headers: { 'Content-Type': 'application/json' }
    })
      .then(res => res.json())
      .then(data => {
        if (data.errors) {
          dispatch(checkAuthFail(data.errors[0]));
        } else {
          localStorage.setItem('token', data.data.signIn.token)
          localStorage.setItem('userId', data.data.signIn.userId)
          dispatch(checkAuthSuccess(data.data.signIn.token, data.data.signIn.userId, true))
        }
      })
      .catch(err => console.log(err))
  }
}

export const checkAuthStart = () => {
  return {
    type: actions.CHECK_AUTH_START
  }
}

export const checkAuthSuccess = (token, userId, isLoggedIn = false) => {
  return {
    type: actions.CHECK_AUTH_SUCCESS,
    token,
    userId,
    isLoggedIn
  }
}

export const checkAuthFail = (errors) => {
  return {
    type: actions.CHECK_AUTH_FAIL,
    errors
  }
};

export const checkAutoLogin = () => {
  return dispatch => {
    const token = localStorage.getItem('token');
    const userId = localStorage.getItem('userId');
  
    if (!token) return dispatch(logout());

    return dispatch(checkAuthSuccess(token, userId));
  }
}

export const logout = () => {
  localStorage.clear();
  return {
    type: actions.LOG_OUT
  }
}

