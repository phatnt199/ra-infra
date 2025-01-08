import { Context } from '@loopback/context';
import { AdminProps, ResourceProps } from 'react-admin';

export interface IApplication extends AdminProps {
  context: Context;
  resources: Array<ResourceProps>;
  customRoutes?: Array<{ name: string; path: string; element: React.ReactElement }>;
}
