import expect from 'expect.js';
import unused from '../unused';

describe('unused deprecation', function () {
  it('should remove unused setting', function () {
    const settings = {
      old: true
    };

    unused('old')(settings);
    expect(settings.old).to.be(undefined);
  });

  it(`shouldn't remove used setting`, function () {
    const value = 'value';
    const settings = {
      new: value
    };

    unused('old')(settings);
    expect(settings.new).to.be(value);
  });

  it('should remove unused setting, even when null', function () {
    const settings = {
      old: null
    };

    unused('old')(settings);
    expect(settings.old).to.be(undefined);
  });

  it('should return a message when removing unused setting', function () {
    const settings = {
      old: true
    };

    const message = unused('old')(settings);
    expect(message).to.match(/old.+deprecated/);
  });

  it(`should return undefined when no setting is unused`, function () {
    const settings = {
      new: true
    };

    const message = unused('old')(settings);
    expect(message).to.be(undefined);
  });
});
