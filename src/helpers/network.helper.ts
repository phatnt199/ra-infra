import { AnyObject, RequestMethods, TRequestMethod } from '../common';
import { stringify } from '../utilities';
import { Logger } from './logger.helper';

const HTTP = 'http';
const HTTPS = 'https';

interface IRequestOptions {
  url: string;
  method: TRequestMethod;
  params?: AnyObject;
  body?: AnyObject;
  headers?: AnyObject;
  configs?: AnyObject;
}

// -------------------------------------------------------------
export class NetworkHelper {
  private name: string;
  private logger?: Logger;

  constructor(opts: { name: string; logger?: any }) {
    const { name, logger } = opts;

    this.name = name;
    this.logger = logger;

    this.logger?.info(
      'Creating new network request worker instance! Name: %s',
      this.name,
    );
  }

  getProtocol(url: string) {
    return url.startsWith('http:') ? HTTP : HTTPS;
  }

  // -------------------------------------------------------------
  // SEND REQUEST
  // -------------------------------------------------------------
  send(opts: IRequestOptions) {
    const t = new Date().getTime();

    const { url, method, params, body, headers = {}, configs = {} } = opts;
    const props = {
      method: method.toString(),
      body: JSON.stringify(body),
      headers,
      ...configs,
    };

    let requestUrl = url;
    if (params) {
      requestUrl = `${url}?${stringify(params)}`;
    }

    return new Promise<Response>((resolve, reject) => {
      this.logger?.info('[send] URL: %s | Props: %o', requestUrl, props);
      fetch(requestUrl, props)
        .then(rs => {
          this.logger?.info('[network]][send] Took: %s(ms)', new Date().getTime() - t);
          resolve(rs);
        })
        .catch(reject);
    });
  }

  // -------------------------------------------------------------
  // GET REQUEST
  // -------------------------------------------------------------
  get(opts: IRequestOptions) {
    const { url, params, configs, ...rest } = opts;
    return this.send({
      ...rest,
      url,
      method: RequestMethods.GET,
      params,
      configs,
    });
  }

  // -------------------------------------------------------------
  // POST REQUEST
  // -------------------------------------------------------------
  post(opts: IRequestOptions) {
    const { url, body, configs, ...rest } = opts;
    return this.send({
      ...rest,
      url,
      method: RequestMethods.POST,
      body,
      configs,
    });
  }

  // -------------------------------------------------------------
  put(opts: IRequestOptions) {
    const { url, body, configs, ...rest } = opts;
    return this.send({
      ...rest,
      url,
      method: RequestMethods.PUT,
      body,
      configs,
    });
  }

  // -------------------------------------------------------------
  patch(opts: IRequestOptions) {
    const { url, body, configs, ...rest } = opts;
    return this.send({
      ...rest,
      url,
      method: RequestMethods.PATCH,
      body,
      configs,
    });
  }

  // -------------------------------------------------------------
  delete(opts: IRequestOptions) {
    const { url, configs, ...rest } = opts;
    return this.send({
      ...rest,
      url,
      method: RequestMethods.DELETE,
      configs,
    });
  }
}
