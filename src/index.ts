import 'reflect-metadata';
import { Api } from './api';

const debug = require('debug')('express:server');

export const server = Api.start();
