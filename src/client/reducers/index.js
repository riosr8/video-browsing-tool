/* istanbul ignore file */
import { combineReducers } from 'redux';
import auth from './auth';
import dashboard from './dashboard';
import processStatus from './processStatus';

const rootReducer = combineReducers({ auth, dashboard, processStatus });

export default rootReducer;
