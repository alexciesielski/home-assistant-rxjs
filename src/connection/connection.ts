// https://github.com/keesschollaart81/vscode-home-assistant/blob/master/src/language-service/src/home-assistant/socket.ts

/*
This is slightly modified version of
https://github.com/home-assistant/home-assistant-js-websocket/blob/master/lib/socket.ts
*/

import * as ha from 'home-assistant-js-websocket';
import { BehaviorSubject, from } from 'rxjs';
import { map, switchMapTo } from 'rxjs/operators';
import WebSocket from 'ws';

const MSG_TYPE_AUTH_REQUIRED = 'auth_required';
const MSG_TYPE_AUTH_INVALID = 'auth_invalid';
const MSG_TYPE_AUTH_OK = 'auth_ok';
const ERR_INVALID_AUTH = 2;

export class HomeAssistant {
  constructor(private host: string, private token: string) {}

  private readonly entities = new BehaviorSubject<ha.HassEntities>({});
  private readonly config = new BehaviorSubject<Partial<ha.HassConfig>>({});
  private readonly services = new BehaviorSubject<Partial<ha.HassServices>>({});

  readonly connection$ = from(this.connectoToHA());
  readonly entities$ = this.getEntities();
  readonly config$ = this.getConfig();
  readonly services$ = this.getServices();

  private getEntities() {
    return this.connection$.pipe(
      map(connection =>
        ha.subscribeEntities(connection, entities =>
          this.entities.next(entities),
        ),
      ),
      switchMapTo(this.entities.asObservable()),
    );
  }

  private getConfig() {
    return this.connection$.pipe(
      map(connection =>
        ha.subscribeConfig(connection, config => this.config.next(config)),
      ),
      switchMapTo(this.config.asObservable()),
    );
  }

  private getServices() {
    return this.connection$.pipe(
      map(connection =>
        ha.subscribeServices(connection, services =>
          this.services.next(services),
        ),
      ),
      switchMapTo(this.services.asObservable()),
    );
  }

  private async connectoToHA() {
    const auth = ha.createLongLivedTokenAuth(this.host, this.token);

    return await ha.createConnection({
      createSocket: () => createSocket(auth, true),
    });
  }
}

export function createSocket(
  auth: ha.Auth,
  ignoreCertificates: boolean,
): Promise<any> {
  // Convert from http:// -> ws://, https:// -> wss://
  const url = auth.wsUrl;

  console.log(
    '[Auth phase] Initializing WebSocket connection to Home Assistant',
    url,
  );

  function connect(
    triesLeft: number,
    promResolve: (socket: any) => void,
    promReject: (err: number) => void,
  ) {
    console.log(
      `[Auth Phase] Connecting to Home Assistant... Tries left: ${triesLeft}`,
      url,
    );

    const socket = new WebSocket(url, {
      rejectUnauthorized: !ignoreCertificates,
    });

    // If invalid auth, we will not try to reconnect.
    let invalidAuth = false;

    const closeMessage = (ev: {
      wasClean: boolean;
      code: number;
      reason: string;
      target: WebSocket;
    }) => {
      let errorMessage;
      if (ev && ev.code && ev.code !== 1000) {
        errorMessage = `WebSocket connection to Home Assistant closed with code ${ev.code} and reason ${ev.reason}`;
      }
      closeOrError(errorMessage);
    };

    const errorMessage = (ev: {
      error: any;
      message: any;
      type: string;
      target: WebSocket;
    }) => {
      // If we are in error handler make sure close handler doesn't also fire.
      socket.removeEventListener('close', closeMessage);
      let errorMessage =
        'Disconnected from Home Assistant with a WebSocket error';
      if (ev.message) {
        errorMessage += ` with message: ${ev.message}`;
      }
      closeOrError(errorMessage);
    };

    const closeOrError = (errorText?: string) => {
      if (errorText) {
        console.log(
          `WebSocket Connection to Home Assistant closed with an error: ${errorText}`,
        );
      }
      if (invalidAuth) {
        promReject(ha.ERR_INVALID_AUTH);
        return;
      }

      // Reject if we no longer have to retry
      if (triesLeft === 0) {
        // We never were connected and will not retry
        promReject(ha.ERR_CANNOT_CONNECT);
        return;
      }

      const newTries = triesLeft === -1 ? -1 : triesLeft - 1;
      // Try again in a second
      setTimeout(() => connect(newTries, promResolve, promReject), 1000);
    };

    // Auth is mandatory, so we can send the auth message right away.
    const handleOpen = async () => {
      try {
        if (auth.expired) {
          await auth.refreshAccessToken();
        }
        socket.send(
          JSON.stringify({
            type: 'auth',
            access_token: auth.accessToken,
          }),
        );
      } catch (err) {
        // Refresh token failed
        invalidAuth = err === ERR_INVALID_AUTH;
        socket.close();
      }
    };

    const handleMessage = async (event: {
      data: any;
      type: string;
      target: WebSocket;
    }) => {
      const message = JSON.parse(event.data);

      console.log(
        `[Auth phase] Received a message of type ${message.type}`,
        message,
      );

      switch (message.type) {
        case MSG_TYPE_AUTH_INVALID:
          invalidAuth = true;
          socket.close();
          break;

        case MSG_TYPE_AUTH_OK:
          socket.removeEventListener('open', handleOpen);
          socket.removeEventListener('message', handleMessage);
          socket.removeEventListener('close', closeMessage);
          socket.removeEventListener('error', errorMessage);
          promResolve(socket);
          break;

        default:
          // We already send this message when socket opens
          if (message.type !== MSG_TYPE_AUTH_REQUIRED) {
            console.log('[Auth phase] Unhandled message', message);
          }
      }
    };

    socket.addEventListener('open', handleOpen);
    socket.addEventListener('message', handleMessage);
    socket.addEventListener('close', closeMessage);
    socket.addEventListener('error', errorMessage);
  }

  return new Promise((resolve, reject) => connect(3, resolve, reject));
}
