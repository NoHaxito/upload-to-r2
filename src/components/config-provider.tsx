import { createContext, useContext, useState } from "react";

type Config = {
  cloudflare_account_id: null | null;
  cloudflare_access_key_id: string | null;
  cloudflare_secret_access_key: string | null;
};

type ConfigProviderProps = {
  children: React.ReactNode;
};

type ConfigProviderState = {
  config: Config;
  setConfig: (config: Config) => void;
};

const initialState: ConfigProviderState = {
  config: {
    cloudflare_account_id: null,
    cloudflare_access_key_id: null,
    cloudflare_secret_access_key: null,
  },
  setConfig: () => null,
};

const ConfigProviderContext = createContext<ConfigProviderState>(initialState);

export function ConfigProvider({ children, ...props }: ConfigProviderProps) {
  const [config, setConfig] = useState<Config>(
    // @ts-expect-error Null is required to avoid errors.
    () => JSON.parse(localStorage.getItem("app-configuration")) as Config
  );

  const value = {
    config,
    setConfig: (config: Config) => {
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
