import React from 'react';

import { CoreBindings } from '@/common';
import { Logger } from '@/helpers';
import { Context } from '@loopback/context';
import {
  Admin,
  AuthProvider,
  CustomRoutes,
  DataProvider,
  I18nProvider,
  Resource,
} from 'react-admin';
import { Provider as ReduxProvider } from 'react-redux';
import { Route } from 'react-router-dom';
import { Store } from 'redux';
import { ApplicationContext } from '../context';
import { IApplication } from '../types';

const Wrapper: React.FC<{
  context: Context;
  reduxStore: Store;
  suspense: React.ReactNode;
  enableDebug?: boolean;
  children: React.ReactNode;
}> = ({ context, reduxStore, suspense, enableDebug = false, children }) => {
  return (
    <ApplicationContext.Provider
      value={{ context, logger: Logger.getInstance({ enableDebug }) }}
    >
      <ReduxProvider store={reduxStore}>
        <React.Suspense fallback={suspense}>{children}</React.Suspense>
      </ReduxProvider>
    </ApplicationContext.Provider>
  );
};

// -----------------------------------------------------------------
export const RaApplication: React.FC<IApplication> = (props: IApplication) => {
  const {
    context,
    reduxStore,
    suspense,
    enableDebug = false,
    resources,
    customRoutes,
    ...raProps
  } = props;

  const { layout, routes } = customRoutes ?? {};

  // -------------------------------------------------------------------------------
  const adminProps = React.useMemo(() => {
    const dataProvider = context.getSync<DataProvider>(
      CoreBindings.DEFAULT_REST_DATA_PROVIDER,
    );
    const authProvider = context.getSync<AuthProvider>(
      CoreBindings.DEFAULT_AUTH_PROVIDER,
    );
    const i18nProvider = context.getSync<I18nProvider>(
      CoreBindings.DEFAULT_I18N_PROVIDER,
    );

    return { dataProvider, authProvider, i18nProvider, ...raProps };
  }, [context, raProps]);

  // -------------------------------------------------------------------------------
  return (
    <Wrapper
      context={context}
      reduxStore={reduxStore}
      suspense={suspense}
      enableDebug={enableDebug}
    >
      <Admin {...adminProps}>
        {resources.map(resource => {
          return <Resource key={resource.name} {...resource} />;
        })}

        <CustomRoutes>
          <Route element={layout}>
            {routes?.map(resource => {
              return <Route key={resource.id ?? resource.path} {...resource} />;
            })}
          </Route>
        </CustomRoutes>
      </Admin>
    </Wrapper>
  );
};
