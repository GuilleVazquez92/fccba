export const setPredio = (predio) => async (dispatch) => {
  return ({
    type: 'set-predio',
    predio
  });
};