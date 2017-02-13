/* eslint-env browser */
import React from 'react';
import {render} from 'react-dom';
import { Router, Route, Link, IndexRoute, browserHistory } from 'react-router';
import { createStore, applyMiddleware } from 'redux';
import { Provider } from 'react-redux';
import logger from 'redux-logger';
import thunk from 'redux-thunk';

import Posts from './components/Posts';
import EditPostForm from './components/EditPostForm';
import EditAssetForm from './components/EditAssetForm';
import Page from './components/Page';
import Users from './components/Users';
import Assets from './components/Assets';
import reducer from './reducers';
import { getPosts, getAssets, initiateGetConfig } from './actions/AppActions';

const middleware = process.env.NODE_ENV === 'production' ?
  [ thunk ] :
  [ thunk, logger() ];

const store = createStore(
  reducer,
  applyMiddleware(...middleware)
);

store.dispatch(getPosts());
store.dispatch(getAssets());
store.dispatch(initiateGetConfig());

const About = React.createClass({
  render() {
    return <span>about</span>;
  }
});

const NoMatch = React.createClass({
  render() {
    return <span>NoMatch</span>;
  }
});

const Home = React.createClass({
  render() {
    return <span>Home</span>;
  }
});

// Declarative route configuration (could also load this config lazily
// instead, all you really need is a single root route, you don't need to
// colocate the entire config).
render((
   <Provider store={store}>
      <Router history={browserHistory}>
        <Route path="/admin" component={Page}>
          <IndexRoute component={Home} />
          <Route path="about" component={About}/>
          <Route path="users" component={Users}/>
          <Route path="posts" component={Posts}>
            <Route path="post/:postId" component={EditPostForm}/>
            <Route path="add" component={EditPostForm}/>
          </Route>
          <Route path="assets" component={Assets}>
            <Route path="asset/:assetId" component={EditAssetForm}/>
            <Route path="add" component={EditAssetForm}/>
          </Route>
          <Route path="*" component={NoMatch}/>
        </Route>
      </Router>
    </Provider>
), document.getElementById('content'));
