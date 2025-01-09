import { Context } from '@loopback/context';
import { AdminProps, ResourceProps } from 'react-admin';
import { RouteProps } from 'react-router-dom';
import { Store } from 'redux';

export interface IApplication extends Omit<AdminProps, 'children'> {
  context: Context;

  enableDebug?: boolean;
  reduxStore: Store;
  suspense: React.ReactNode;

  resources: Array<ResourceProps>;
  customRoutes?: {
    layout?: React.ReactNode | null;
    routes: Array<RouteProps>;
  };
}
