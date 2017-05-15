// [{
//   id: 'sdfsfsdffd',
//   name: 'Hans';
//   rooom: 'The room name'
// }]

// addUser(id, name, room)
// removeeUser(id)
// getUser(id)
// getUserList(room)

class Users {

  constructor() {
    console.log('In Users constructor');
    this.users = [];
  }

  addUser(id, name, room) {
    var user = { id, name, room };
    this.users.push(user);
    return user;
  }

  removeUser(id) {
    var removedUser = this.getUser(id);
    if (removedUser) {
      this.users = this.users.filter((user) => {
        return user.id != id;
      });
    };
    return removedUser;
  }

  getUser(id) {
    var user = this.users.filter((user) => {
      return user.id === id;
    });
    return user[0];
  }

  getUserList(room) {
    var usersInList = this.users.filter((user) => {
      return user.room === room;
    });
    var userNames = usersInList.map((user) => {
      return user.name;
    });
    return userNames;
  }
}

module.exports = { Users };
