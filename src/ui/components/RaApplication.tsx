import React from 'react';

import { CoreBindings } from '@/common';
import {
  Admin,
  AuthProvider,
  CustomRoutes,
  DataProvider,
  I18nProvider,
  Resource,
  ResourceProps,
} from 'react-admin';
import { Route } from 'react-router-dom';
import { IApplication } from '../types';

export const RaApplication: React.FC<IApplication> = (props: IApplication) => {
  const { context, resources, customRoutes, ...raProps } = props;

  // -------------------------------------------------------------------------------
  const adminProps = React.useMemo(() => {
    const dataProvider = context?.getSync<DataProvider>(
      CoreBindings.DEFAULT_REST_DATA_PROVIDER,
    );
    const authProvider = context?.getSync<AuthProvider>(
      CoreBindings.DEFAULT_AUTH_PROVIDER,
    );
    const i18nProvider = context?.getSync<I18nProvider>(
      CoreBindings.DEFAULT_I18N_PROVIDER,
    );

    return { dataProvider, authProvider, i18nProvider, ...raProps };
  }, [raProps]);

  // -------------------------------------------------------------------------------
  return (
    <Admin {...adminProps}>
      {resources?.map((resource: ResourceProps) => {
        return <Resource key={resource.name} {...resource} />;
      })}

      <CustomRoutes>
        {customRoutes?.map(resource => {
          return <Route key={resource.path} {...resource} />;
        })}
      </CustomRoutes>
    </Admin>
  );
};
