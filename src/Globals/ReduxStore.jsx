import {
  legacy_createStore as createStore,
  combineReducers,
  applyMiddleware,
} from "redux";
import { UpdateUserReducer, loginReducer } from "./Reducers";
import { thunk } from "redux-thunk";

const rootReducer = combineReducers({
  login: loginReducer,
  user: UpdateUserReducer,
});

export const store = createStore(rootReducer, applyMiddleware(thunk));
