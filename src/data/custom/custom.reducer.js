export function customReducer(state, action) {
  switch (action.type) {
    case 'set-predio':
      return { ...state, predio: action.predio };
  }
}