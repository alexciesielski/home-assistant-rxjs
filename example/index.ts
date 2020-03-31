import commandLineArgs from 'command-line-args';
import { config as readEnvVars } from 'dotenv';
import { filter, take } from 'rxjs/operators';
import { HomeAssistantRXJS } from '../lib';

export interface CommandLineOptions {
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

const host = options.host ?? 'http://homeassistant:8123';
const token = options.token || process.env.TOKEN;

if (!token) {
  throw new Error('Need to provide a long-lived access token!');
}

const harxjs = new HomeAssistantRXJS(host, token);
harxjs.services$
  .pipe(
    filter(config => Object.keys(config).length > 0),
    take(1),
  )
  .subscribe(console.log);
