import { expect } from 'chai';
import 'mocha';
import { BehaviorSubject } from 'rxjs';
import { HomeAssistantConnection } from './connection';

describe('HomeAssistantConnection', () => {
  it('should create', () => {
    const connection$ = new HomeAssistantConnection();
    expect(connection$).to.be.instanceOf(BehaviorSubject);
  });
});
