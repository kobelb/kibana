import expect from 'expect.js';
import ngMock from 'ng_mock';
import sinon from 'sinon';

describe('Timefilter service', function () {
  describe('getBounds', function () {

    const now = Date.UTC(2000, 0, 1);

    let timefilter;
    let clock;

    beforeEach(ngMock.module('kibana'));
    beforeEach(ngMock.inject(function (_timefilter_) {
      timefilter = _timefilter_;
      clock = sinon.useFakeTimers(now);
    }));

    afterEach(function () {
      clock.restore();
    });

    describe('without overrideNow', function () {
      it('calculates relative to Date.now', function () {
        timefilter.from = 'now-15m';
        timefilter.to = 'now';

        const bounds = timefilter.getBounds();
        expect(bounds.min.utc().format()).to.be('1999-12-31T23:45:00Z');
        expect(bounds.max.utc().format()).to.be('2000-01-01T00:00:00Z');
      });
    });

    describe('overrideNow', function () {

      let location;

      beforeEach(ngMock.inject(function ($location) {
        location = $location;
      }));


      it(`calculated relative to overrideNow`, function () {
        location.search('overrideNow', '2001-01-01T00:00:00Z');
        timefilter.from = 'now-15m';
        timefilter.to = 'now';

        const bounds = timefilter.getBounds();
        expect(bounds.min.utc().format()).to.be('2000-12-31T23:45:00Z');
        expect(bounds.max.utc().format()).to.be('2001-01-01T00:00:00Z');
      });

    });
  });
});
