import { Map } from 'immutable';

const initialState = Map({
  sitetitle: "",
  sitesubtitle: ""
});

export default (state = initialState, action) => {
  switch (action.type) {
  case 'CONFIG':
    state.sitetitle = action.config.sitetitle;
    state.sitesubtitle = action.config.sitesubtitle;
    return state;
  default:
    return state;
  }
};
