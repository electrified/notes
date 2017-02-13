import {getAllPosts, getAllAssets, delPost, create, fetchPostData, getConfig, uploadAsset} from '../api/api';
import {fromJS} from 'immutable';

export const getPostForEditing = function(post) {
  return {
    type: 'GET_POST_FOR_EDITING',
    postId: post
  };
};

export const createPostReceived = function(post) {
  return {
    type: 'ADD_POST',
    post
  };
};

export const receiveAllPosts = function(posts) {
  console.log("receiveAllPosts");
  return {
    type: 'POST_GETALL_RECEIVED',
    posts
  };
};

export const deletePostReceived = function(postId) {
  return {
    type: 'DELETE_POST',
    postId
  };
};

export const createAssetReceived = function(asset) {
  return {
    type: 'ADD_ASSET',
    asset
  };
};


export const configReceived = function(config) {
  return {
    type: 'CONFIG',
    config: config
  };
};

export const receiveAllAssets = function(assets) {
  console.log("receiveAllAssets");
  return {
    type: 'ASSET_GETALL_RECEIVED',
    assets
  };
};


export const getPosts = function() {
  return dispatch => {
    getAllPosts().then(posts => {
      dispatch(receiveAllPosts(posts));
    });
  };
};

export const deletePost = function(id) {
  return dispatch => {
    delPost(id, () => {
      dispatch(deletePostReceived(id));
    });
  };
};

export const createPost = function(post) {
  return dispatch => {
    create(post, returnedPost => {
      dispatch(createPostReceived(returnedPost));
    });
  };
};

export const getPostForEdit = function(postId) {
  return dispatch => {
    fetchPostData(postId).then(returnedPost => {
      dispatch(actions.change('postForm', fromJS(returnedPost)));
    });
  };
};

export const resetEditPostForm = function () {
  return dispatch => {
    dispatch(actions.reset('postForm'));
  };
};

export const getAssets = () => {
  return dispatch => {
    getAllAssets().then(assets => {
      dispatch(receiveAllAssets(assets));
    });
  };
};

export const editAssetFormSubmitted = function(asset) {
  return dispatch => {
    uploadAsset(asset, returnedAsset => {
      dispatch(createAssetReceived(returnedAsset));
    });
  };
};

export const deleteAsset = () => {
};

export const initiateGetConfig = () => {
  return dispatch => {
    getConfig().then(config => {
      dispatch(configReceived(config));
    });
  };
};
