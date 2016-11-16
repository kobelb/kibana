import expect from 'expect.js';
import sinon from 'sinon';
import createTransform from '../create_transform';

describe('deprecation create transform', function () {
  it('calls single deprecation in array', function () {
    const deprecations = [sinon.spy()];
    createTransform(deprecations)({});
    expect(deprecations[0].calledOnce).to.be(true);
  });

  it('calls multiple deprecations in array', function () {
    const deprecations = [sinon.spy(), sinon.spy()];
    createTransform(deprecations)({});
    expect(deprecations[0].calledOnce).to.be(true);
    expect(deprecations[1].calledOnce).to.be(true);
  });
});
