const expect = require('expect');

const { isRealString } = require('./validation');

describe('UTIL validation - isRealString', () => {

  it('Should validate string has a valid value', () => {

    expect(isRealString('abc')).toBe(true);
  });

  it('Should validate string is a real string type', () => {

    expect(isRealString("validString")).toBe(true);
  });

  it('Should validate string has a length > 0 not containg spaces only', () => {

    expect(isRealString('         ')).toBe(false);
  });
});
