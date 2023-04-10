import React from 'react';
import { Admin, AdminProps, Resource, ResourceProps } from 'react-admin';
import { ApplicationContext, IApplication } from '../common';
import { getAuthProvider, getDataProvider, getI18nProvider } from '../providers';
import isEmpty from 'lodash/isEmpty';
import { getError } from '../utilities';

export const Application: React.FC<IApplication> = (props: IApplication) => {
  const { resources, ...restProps } = props;

  const { logger } = React.useContext(ApplicationContext);

  const adminProps = React.useMemo(() => {
    const { urls, i18n = {}, ...rest } = restProps;
    const { base: baseUrl, auth = 'login' } = urls;
    const rs: AdminProps = {
      i18nProvider: getI18nProvider({ i18n }),
      ...rest,
    };
    console.log('check auth page', rest.loginPage)

    if (!baseUrl || isEmpty(baseUrl)) {
      throw getError({ message: 'Missing urls.base property' });
    }

    if (baseUrl && !isEmpty(baseUrl)) {
      const dataProvider = getDataProvider({ baseUrl });
      rs.dataProvider = dataProvider;
      rs.authProvider = getAuthProvider({ dataProvider, authPath: auth });
    }

    return rs;
  }, [restProps]);
  console.log('checking admin props... ', adminProps);
   React.useEffect(() => {
    logger.info('Mounted RA application', adminProps);

    return () => {
      logger.info('Unmount RA application');
    };
  }, []); 

  return (
    <Admin {...adminProps}>
      {resources.length > 0 &&resources?.map((resource: ResourceProps) => {
        return <Resource key={resource.name} {...resource} />;
      })}
    </Admin>
  );
};
