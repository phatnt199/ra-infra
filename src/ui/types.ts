import { Context } from '@loopback/context';
import { AdminProps, ResourceProps } from 'react-admin';
import { Store } from 'redux';

export interface IApplication extends AdminProps {
  context: Context;

  debug?: boolean;
  reduxStore: Store;
  suspense: React.ReactNode;

  resources: Array<ResourceProps>;
  customRoutes?: Array<{ name: string; path: string; element: React.ReactElement }>;
}
