import { filter, switchMap, take, tap } from 'rxjs/operators';
import { HomeAssistantRXJS } from '../lib';

const harxjs = new HomeAssistantRXJS();

harxjs.services$
  .pipe(
    filter(x => !!x),
    take(1),
    tap(x => console.log('connected')),
    switchMap(() => harxjs.destroy()),
  )
  .subscribe();
