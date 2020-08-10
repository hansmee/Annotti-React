import { combineReducers } from 'redux';
import { connectRouter } from 'connected-react-router';

// eslint-disable-next-line import/no-cycle
export default function createRootReducer(history) {
  return combineReducers({
    router: connectRouter(history),
  });
}
