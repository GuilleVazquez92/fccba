import { combineReducers } from './combineReducers';
import { customReducer } from './custom/custom.reducer';
import { userReducer } from './user/user.reducer';

export const initialState: AppState = {
  custom: {
    predio: false
  },
  user: {
    darkMode: false,
    isLoggedin: false,
    loading: false,
    locality: false,
    card: null
  }
};

export const reducers = combineReducers({
  custom: customReducer,
  user: userReducer
});

export type AppState = ReturnType<typeof reducers>;