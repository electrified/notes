import { List, Map } from 'immutable';

export default (users = List(), action) => {
  switch (action.type) {
    case 'ADD_USER':
      return [...users, action.user];
    case 'DELETE_USER': {
      var intUserId = parseInt(action.userId);
      var foundUser = users.find(function (d) {
          return d.id === intUserId;
      });

      if (foundUser) {
        var index = users.indexOf(foundUser);
        return users.splice( index, 1 )
      }
    }
    default:
      return users;
  }
}
