import { List, Map, fromJS } from 'immutable';

export function findAsset(assets, assetId) {
  var intAssetId = parseInt(assetId);
  return assets.find(function (d) {
    return d.get('id') === intAssetId;
  });
}

export default (assets = List(), action) => {
  switch (action.type) {
  case 'ADD_ASSET': {
    var foundAsset = findAsset(assets, action.post.id);
    if (foundAsset) {
      var index = assets.indexOf(foundAsset);
      return assets.set(index, fromJS(action.asset));
    }
    return posts.push(fromJS(action.asset));
  }
  //  case 'DELETE_POST': {
  //    var foundPost = findPost(posts, action.postId);
  // if (foundPost) {
  //      var index = posts.indexOf(foundPost);
	// return posts.delete(index);
  //    }
  //    return posts;
  //  }
  case 'ASSET_GETALL_RECEIVED': {
    console.log('ASSET_GETALL_RECEIVED');
    return fromJS(action.assets);
  }
  default:
    return assets;
  }
};
