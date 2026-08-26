import { createContext, useContext, useEffect, useState } from 'react';
import api from '../api';

const ConfigContext = createContext(null);

export function ConfigProvider({ children }) {
  const [config, setConfig] = useState(null);
  useEffect(() => {
    api
      .getConfig()
      .then(setConfig)
      .catch(() => setConfig({ contact: {}, deliveryCharge: 0, categories: [] }));
  }, []);
  return <ConfigContext.Provider value={config}>{children}</ConfigContext.Provider>;
}

export const useConfig = () => useContext(ConfigContext);
