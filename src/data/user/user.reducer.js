export function userReducer(state, action) {
  switch (action.type) {
    case 'set-user-loading':
      return { ...state, loading: action.isLoading };
    case 'set-user-data':
      return { ...state, ...action.data };
    case 'set-user':
      return { ...state, user: action.user };
    case 'set-dark-mode':
      return { ...state, darkMode: action.darkMode };
    case 'set-is-loggedin':
      return { ...state, isLoggedin: action.loggedIn };
    case 'set-locality':
      return { ...state, locality: action.locality };
    case 'set-card':
      return { ...state, card: action.card };
  }
}