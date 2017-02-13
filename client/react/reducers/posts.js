import { List, Map, fromJS } from 'immutable';

export function findPost(posts, postId) {
var intPostId = parseInt(postId);
  return posts.find(function (d) {
      return d.get('id') === intPostId;
  });
}

export default (posts = List(), action) => {
  switch (action.type) {
  case 'ADD_POST':
    var foundPost = findPost(posts, action.post.id);
    if (foundPost) {
      var index = posts.indexOf(foundPost);
      return posts.set(index, fromJS(action.post));
    } else {
      return posts.push(fromJS(action.post));
    }
  case 'DELETE_POST': {
    var foundPost = findPost(posts, action.postId);
    if (foundPost) {
      var index = posts.indexOf(foundPost);
      return posts.delete(index);
    }
    return posts;
  }
  case 'POST_GETALL_RECEIVED': {
    console.log('POST_GETALL_RECEIVED');
    return fromJS(action.posts);
  }
  default:
    return posts;
  }
}
