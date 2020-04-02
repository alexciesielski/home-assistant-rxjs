import { expect } from 'chai';
import 'mocha';
import { of } from 'rxjs';
import { observe } from 'rxjs-marbles/mocha';
import { finalize, tap } from 'rxjs/operators';
import { filterNullOrUndefined } from './filter-truthy';

describe('filterNullOrUndefined', () => {
  it(
    'should filter null or undefined',
    observe(() => {
      let haveBeenCalled = false;
      const mock = () => (haveBeenCalled = true);

      return of(null).pipe(
        filterNullOrUndefined(),
        tap(() => mock()),
        finalize(() => expect(haveBeenCalled).to.be.false),
      );
    }),
  );

  it(
    'should let through other values',
    observe(() => {
      let haveBeenCalled = false;
      const mock = () => (haveBeenCalled = true);

      return of('lol').pipe(
        filterNullOrUndefined(),
        tap(() => mock()),
        finalize(() => expect(haveBeenCalled).to.be.true),
      );
    }),
  );
});
