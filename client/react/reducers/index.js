// import { List, Map } from 'immutable';
import {combineReducers} from 'redux';
import posts from './posts';
import users from './users';
import assets from './assets';
import config from './config';
import form from './forms';

export default combineReducers({
  posts,
  users,
  assets,
  config,
  form
});
