import chai, { expect } from 'chai';
import spies from 'chai-spies';
import 'mocha';
import { Logger, LoggerLevel } from '../util/logger';

describe('Logger', () => {
  let logger: Logger;
  let called: any;

  before(() => {
    chai.use(spies);
    if (!called) {
      called = chai.spy.on(console, 'log');
    }
  });

  after(() => {
    chai.spy.restore(called);
  });

  describe('LoggerLevel DEBUG', () => {
    beforeEach(() => {
      logger = new Logger({ LOG: LoggerLevel.DEBUG });
    });
    it('debug should log', () => {
      logger.debug('msg');
      expect(called).to.have.been.called;
    });

    it('info should not log', () => {
      logger.info('msg');
      expect(called).to.not.have.been.called;
    });
  });

  describe('LoggerLevel INFO', () => {
    beforeEach(() => {
      logger = new Logger({ LOG: LoggerLevel.INFO });
    });
    it('info should log when LoggerLevel INFO', () => {
      logger.info('msg');
      expect(called).to.have.been.called;
    });

    it('debug should log when LoggerLevel INFO', () => {
      logger.debug('msg');
      expect(called).to.have.been.called;
    });
  });
});
