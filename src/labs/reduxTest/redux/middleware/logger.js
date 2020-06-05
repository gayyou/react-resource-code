export const logger = (store) => (next) => (action) => {
  console.log('before renew', store.getState())
  let result = next(action);
  console.log('after renew', result, store.getState());
  return result;
}