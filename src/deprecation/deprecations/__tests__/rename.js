import expect from 'expect.js';
import { noop } from 'lodash';
import rename from '../rename';

describe('rename deprecation', function () {
  it('should rename simple property', function () {
    const value = 'value';
    const settings = {
      before: value
    };

    rename('before', 'after')(settings);
    expect(settings.before).to.be(undefined);
    expect(settings.after).to.be(value);
  });

  it ('should rename nested property', function () {
    const value = 'value';
    const settings = {
      someObject: {
        before: value
      }
    };

    rename('someObject.before', 'someObject.after')(settings);
    expect(settings.someObject.before).to.be(undefined);
    expect(settings.someObject.after).to.be(value);
  });

  it ('should rename property, even when the value is null', function () {
    const value = null;
    const settings = {
      before: value
    };

    rename('before', 'after')(settings);
    expect(settings.before).to.be(undefined);
    expect(settings.after).to.be(null);
  });

  it (`should return undefined, when a rename doesn't occur`, function () {
    const settings = {
      exists: true
    };

    const message = rename('doesntExist', 'alsoDoesntExist')(settings);
    expect(message).to.be(undefined);
  });

  it ('should return a message, when a rename does occur', function () {
    const settings = {
      exists: true
    };

    const message = rename('exists', 'alsoExists')(settings);
    expect(message).to.match(/exists.+deprecated/);
  });
});
