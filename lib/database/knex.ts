import Knex from 'knex';
import config from 'config';

import knexConfig from './knexfile';
import app from '../constants/app';

let knex: Knex;

function init() {
  const { DECLUTTER_ENV } = config.get<typeof app>('app');
  knex = Knex(knexConfig[DECLUTTER_ENV as 'local' | 'development' | 'staging' | 'production']);
}

function getInstance(): Knex {
  return knex;
}

export {
  init,
  getInstance,
};
