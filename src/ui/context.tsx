import React from 'react';

import { Context } from '@loopback/context';
import { Logger } from '@/helpers';

export const ApplicationContext = React.createContext<{
  context: Context | null;
  logger: Logger;
}>({
  context: null,
  logger: Logger.getInstance(),
});
