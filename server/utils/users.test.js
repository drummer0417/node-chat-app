const expect = require('expect');

const { Users } = require('./users');

describe('UTILS users', () => {

  var users;

  beforeEach(() => {
    users = new Users();
    users.users = [
      { id: '123', name: 'Hans', room: 'room 1' },
      { id: '234', name: 'Jacky', room: 'room 2' },
      { id: '345', name: 'Cas', room: 'room 1' },
      { id: '456', name: 'Anouk', room: 'room 2' }
    ]
  });

  it('Shoould creeate a user instance', () => {

    var user = {
      id: '123',
      name: 'Hans',
      room: 'the room'
    }
    var newUser = users.addUser(user.id, user.name, user.room);

    expect(newUser).toEqual(user);
    expect(users.users[4]).toEqual(user);

  })

  it('Should return users for specified roomm', () => {

    expect(users.getUserList('room 1')).toEqual(['Hans', 'Cas']);
    expect(users.getUserList('room 2')).toEqual(['Jacky', 'Anouk']);
  });

  it('Should return the user with specified id', () => {

    expect(users.getUser('123')).toEqual(users.users[0]);
  });

  it('Should not return a user', () => {

    expect(users.getUser('000')).toNotExist();
  });

  it('Should remove the user with specified id', () => {

    expect(users.removeUser('123')).toEqual({ id: '123', name: 'Hans', room: 'room 1' });
    expect(users.users.length).toBe(3);
  });

  it('Should not remove the user with specified id', () => {

    expect(users.removeUser('000')).toNotExist();
    expect(users.users.length).toBe(4);
  });


});
