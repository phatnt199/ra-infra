import React from 'react';

import { ApplicationContext } from '../context';

export const useApplicationContext = () => {
  const rs = React.useContext(ApplicationContext);
  return rs.context;
};

export const useApplicationLogger = () => {
  const rs = React.useContext(ApplicationContext);
  return rs.logger;
};
