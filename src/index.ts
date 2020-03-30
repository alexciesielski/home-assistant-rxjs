import commandLineArgs from 'command-line-args';
import { config as readEnvVars } from 'dotenv';
import { HomeAssistant } from './connection/connection';

interface CommandLineOptions {
  host?: string;
  token?: string;
}

const optionDefinitions = [
  { name: 'host', alias: 'h', type: String },
  { name: 'token', alias: 't', type: String },
];

const options = commandLineArgs(optionDefinitions) as CommandLineOptions;
readEnvVars();

if (!options) {
  throw new Error('No command line arguments passed.');
}

const host = options.host ?? 'http://localhost:8123';
const token = options.token || process.env.TOKEN;

if (!token) {
  throw new Error('Need to provide a long-lived access token!');
}

const ha = new HomeAssistant(host, token);

ha.services$
  .pipe
  /* tap(entities =>
      console.log(`# of entities: ${Object.keys(entities).length}`),
    ), */
  // filter(entities => Object.keys(entities).length > 0),
  // map(entities => JSON.stringify(entities, null, 2)),
  ()
  .subscribe(console.log);
