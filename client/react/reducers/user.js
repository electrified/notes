import { List, Map } from 'immutable';
import {createModelReducer} from 'react-redux-form';

const initialUserState = Map({
  id: null,
  title: '',
  path: '',
  tags: [],
  body: '',
  published: false
});

export default createModelReducer('user', initialUserState);
