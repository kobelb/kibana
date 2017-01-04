import expect from 'expect.js';
import createAgent from '../create_agent';
import https from 'https';
import http from 'http';
import { set } from 'lodash';

describe('plugins/elasticsearch', function () {
  describe('lib/create_agent', function () {

    it(`uses http.Agent when url's protocol is http`, function () {
      const config = {
        url: 'http://localhost:9200'
      };
      
      const agent = createAgent(config);
      expect(agent).to.be.a(http.Agent);
    });

    it(`throws an Error when url's protocol is https and ssl.verificationMode isn't set`, function () {
      const config = {
        url: 'https://localhost:9200'
      };

      expect(createAgent).withArgs(config).to.throwException();
    });

    it(`uses https.Agent when url's protocol is https and ssl.verificationMode is full`, function () {
      const config = {
         url: 'https://localhost:9200',
         ssl: {
           verificationMode: 'full'
         }
      };

      const agent = createAgent(config);
      expect(agent).to.be.a(https.Agent);
    });

    context('ssl', function () {
      let config;

      beforeEach(function () {
        config = {
          url: 'https://localhost:9200',
          ssl: {
            verificationMode: 'full'
          }
        };
      });

      it('sets rejectUnauthorized to false when verificationMode is none', function () {
        config.ssl.verificationMode = 'none';
        const agent = createAgent(config);
        expect(agent.options.rejectUnauthorized).to.be(false);
      });

      it('sets rejectUnauthorized to true when verificationMode is certificate', function () {
        config.ssl.verificationMode = 'certificate';
        const agent = createAgent(config);
        expect(agent.options.rejectUnauthorized).to.be(true);
      });

      it('sets checkServerIdentity to not check hostname when verificationMode is certificate', function () {
        config.ssl.verificationMode = 'certificate';
        const agent = createAgent(config);

        const cert = {
          subject: {
            CN: 'wrong.com'
          }
        };

        expect(agent.options.checkServerIdentity).withArgs('right.com', cert).to.not.throwException();
        const result = agent.options.checkServerIdentity('right.com', cert);
        expect(result).to.be(undefined);
      });

      it('sets rejectUnauthorized to true when verificationMode is full', function () {
        config.ssl.verificationMode = 'full';
        const agent = createAgent(config);

        expect(agent.options.rejectUnauthorized).to.be(true);
      });

      it(`doesn't set checkServerIdentity when verificationMode is full`, function () {
        config.ssl.verificationMode = 'full';
        const agent = createAgent(config);

        expect(agent.options.checkServerIdentity).to.be(undefined);
      });

      it(`sets ca when certificateAuthorities are specified`, function () {
        config.ssl.certificateAuthorities = [__dirname + '/fixtures/ca.crt'];

        const agent = createAgent(config);
        expect(agent.options.ca).to.contain('test ca certificate\n');
      });

      it(`sets cert and key when certificate and key paths are specified`, function () {
        config.ssl.certificate = __dirname + '/fixtures/cert.crt';
        config.ssl.key = __dirname + '/fixtures/cert.key';

        const agent = createAgent(config);
        expect(agent.options.cert).to.be('test certificate\n');
        expect(agent.options.key).to.be('test key\n');
      });

      it(`sets passphrase when certificate, key and keyPassphrase are specified`, function () {
        config.ssl.certificate = __dirname + '/fixtures/cert.crt';
        config.ssl.key = __dirname + '/fixtures/cert.key';
        config.ssl.keyPassphrase = 'secret';

        const agent = createAgent(config);
        expect(agent.options.passphrase).to.be('secret');
      });
    });
  });
});
