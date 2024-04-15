import { createContext, useContext, useState } from "react";

type Config = {
  account_id: string | null;
  access_key_id: string | null;
  secret_access_key: string | null;
};

type ConfigProviderProps = {
  children: React.ReactNode;
};

type ConfigProviderState = {
  config: Config | null;
  setConfig: (config: Config | null) => void;
};

const initialState: ConfigProviderState = {
  config: {
    account_id: null,
    access_key_id: null,
    secret_access_key: null,
  },
  setConfig: () => null,
};

const ConfigProviderContext = createContext<ConfigProviderState>(initialState);

export function ConfigProvider({ children, ...props }: ConfigProviderProps) {
  const [config, setConfig] = useState<Config | null>(
    // @ts-expect-error Null is required to avoid errors.
    () => JSON.parse(localStorage.getItem("app-configuration")) as Config
  );

  const value = {
    config,
    setConfig: (config: Config | null) => {
      if (config === null) {
        localStorage.removeItem("app-configuration");
        setConfig(null);
        return;
      }
      localStorage.setItem("app-configuration", JSON.stringify(config));
      setConfig(config);
    },
  };

  return (
    <ConfigProviderContext.Provider {...props} value={value}>
      {children}
    </ConfigProviderContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export const useConfig = () => {
  const context = useContext(ConfigProviderContext);

  if (context === undefined)
    throw new Error("useConfig must be used within a ConfigProvider");

  return context;
};
