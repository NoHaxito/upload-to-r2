import { Store } from "tauri-plugin-store-api";
import { Button } from "./components/ui/button";
import { useEffect, useState } from "react";

function App() {
  const store = new Store(".config.json");
  const [config, setConfig] = useState<{
    cloudflare_account_id: string | null;
    cloudflare_access_key_id: string | null;
    cloudflare_secret_access_key: string | null;
  } | null>(null);
  useEffect(() => {
    async function getConfig() {
      const cloudflare_account_id: string | null = await store.get(
        "cloudflare_account_id"
      );
      const cloudflare_access_key_id: string | null = await store.get(
        "cloudflare_access_key_id"
      );
      const cloudflare_secret_access_key: string | null = await store.get(
        "cloudflare_secret_access_key"
      );
      setConfig({
        cloudflare_account_id,
        cloudflare_access_key_id,
        cloudflare_secret_access_key,
      });
    }
    getConfig();
  });

  return (
    <>
      {!config ||
      !config.cloudflare_account_id ||
      !config.cloudflare_access_key_id ||
      !config.cloudflare_secret_access_key ? (
        <div className="flex items-center justify-center min-h-screen w-full">
          Configuration Missing
        </div>
      ) : (
        <Button>Click me</Button>
      )}
    </>
  );
}

export default App;
