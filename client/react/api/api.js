import 'isomorphic-fetch';

export const headers = {
  'Accept': 'application/json',
  'Content-Type': 'application/json'
};

// TODO rename this!
export const create = function(post, callback) {
  var uri = '/api/posts/';
  var method = 'POST';
  console.log(post);
  if (post.get('id')) {
    uri = uri + post.get('id');
    method = 'PUT';
  }

  fetch(uri, {
    credentials: 'same-origin',
    body: JSON.stringify(post),
    method: method,
    headers: headers
  })
  .then(response =>
    response.json().then(json => ({ json, response }))
  )
  .then(({ json, response }) => {
    if (!response.ok) {
      return Promise.reject(json);
    }
    return json;
  }).then(json => callback(json));
};

export const getAllPosts = () => get('/api/posts');

export const getAllAssets = () => get('/api/assets');

export const get = function(uri) {
  return fetch(uri, {
    credentials: 'same-origin',
    headers: headers
  })
  .then(response =>
    response.json().then(json => ({ json, response }))
  ).then(({ json, response }) => {
    if (!response.ok) {
      return Promise.reject(json);
    }
    return json;
  });
};

export const delPost = function(id, callback) {
  fetch('/api/posts/' + id, {
    credentials: 'same-origin',
    method: 'DELETE',
    headers
  })
  .then(response =>
    response.json().then(json => ({ json, response }))
  ).then(({ json, response }) => {
    if (!response.ok) {
      return Promise.reject(json);
    }
    return json;
  }).then(callback(id));
};

export const fetchPostData = function(postId) {
  return fetch('/api/posts/' + postId, {
    credentials: 'same-origin',
    headers
  })
  .then(response =>
    response.json().then(json => ({ json, response }))
  )
  .then(({ json, response }) => {
    if (!response.ok) {
      return Promise.reject(json);
    }
    return json;
  });
};

export const getConfig = function() {
  return fetch('/api/app/config', {
    credentials: 'same-origin',
    headers: headers
  })
  .then(response => {
    if (!response.ok) {
      return Promise.reject();
    }
    return response.json();
  });
};

export const uploadAsset = function(asset) {
  return fetch('/api/assets/',
    {
      credentials: 'same-origin',
      body: JSON.stringify(asset),
      method: 'POST',
      headers
    });
};

export const isUnusedPath = (id, path) => {
  return new Promise((resolve, reject) => {
    var url = '/api/posts/path/' + path;

    if (id) {
      url += '?id=' + id;
    }

    return fetch(url, {
      credentials: 'same-origin',
      headers: headers
    }).then(response =>
      response.json().then(json => ({ json, response }))
    ).then(({ json, response }) => {
      if (response.ok && json.isValid) {
        return resolve();
      } else {
        reject({ path: 'That path is taken' });
      }
    });
  });
};
