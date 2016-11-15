import expect from 'expect.js';
import sinon from 'sinon';
import transformDeprecations from '../transform_deprecations';

describe('transform deprecations', function () {
  it('calls single deprecation in array', function () {
    const deprecations = [sinon.spy()];
    transformDeprecations(deprecations)({});
    expect(deprecations[0].calledOnce).to.be(true);
  });

  it('calls multiple deprecations in array', function () {
    const deprecations = [sinon.spy(), sinon.spy()];
    transformDeprecations(deprecations)({});
    expect(deprecations[0].calledOnce).to.be(true);
    expect(deprecations[1].calledOnce).to.be(true);
  });

  it('calls logger function when deprecation returns a string', function () {
    const deprecation = sinon.stub().returns('deprecation message');
    const deprecations = [deprecation];
    const logger = sinon.spy();
    transformDeprecations(deprecations)({}, logger);
    expect(logger.calledOnce).to.be(true);
  });

  it(`doesn't call logger function when deprecation returns undefined`, function () {
    const deprecation = sinon.stub().returns(undefined);
    const deprecations = [deprecation];
    const logger = sinon.spy();
    transformDeprecations(deprecations)({}, logger);
    expect(logger.called).to.be(false);
  });
});
