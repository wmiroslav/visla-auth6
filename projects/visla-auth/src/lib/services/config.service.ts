import { IConfig } from './../models/Config';
import { Injectable, Inject } from '@angular/core';

@Injectable()
export class ConfigService {

  private _config: IConfig;

  constructor(@Inject('config') private config) {
    // validate baseUrl: at the end must have / character
    try {
      const baseUrl = this.config.baseUrl;
      if (baseUrl.charAt(baseUrl.length - 1) !== '/') {
        this.config.baseUrl += '/';
      }
    } catch (e) {
      console.warn('Make sure you set the valid baseUrl in config object');
    }

    // validate apiEndpoints
    // remove / from beginning
    try {
      const enpoints = this.config.apiEndpoints;
      for (const prop in enpoints) {
        if (enpoints[prop].trim()) {
          if (enpoints[prop].charAt(0) === '/') {
            enpoints[prop] = enpoints[prop].substring(1);
          }
        }
      }
    } catch (e) {
      console.warn('Make sure you set the valid endpoints in config object');
    }

    // validate appRoutes
    // add / to start
    try {
      const routes = this.config.appRoutes;
      for (const prop in routes) {
        if (routes[prop].trim()) {
          if (routes[prop].charAt(0) !== '/') {
            routes[prop] = '/' + routes[prop];
          }
        }
      }
    } catch (e) {
      console.log('Make sure you set the valid routes in config object');
    }

    this._config = this.config;
  }

  get baseUrl(): string {
    return this._config.baseUrl;
  }

  get apiEndpoints(): any {
    return this._config.apiEndpoints;
  }

  get appRoutes(): any {
    return this._config.appRoutes;
  }

}

