// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use aws_config::BehaviorVersion;
use aws_credential_types::provider;
use aws_sdk_s3 as s3;
use std::sync::Mutex;
use tauri::State;

// Tu propio credentials
struct MyCredentials {
    account_id: String,        // Account ID de Cloudflare
    access_key_id: String,     // Access Key ID de Cloudflare R2
    secret_access_key: String, // Secret Access Key de Cloudflare R2
}

// Implementacion del trait
impl ProvideCredentials for MyCredentials {
    fn provide_credentials<'a>(&'a self) -> future::ProvideCredentials<'a>
    where
        Self: 'a,
    {
        future::ProvideCredentials::new()
    }
}

// genero el credential
impl MyCrendentials {
    async fn credentials(&self) -> provider::Result {
        Ok(Credentials::from_keys(
            self.access_key_id.clone(),
            self.secret_access_key.clone(),
            None,
        ))
    }
}
pub struct S3Client(pub Option<Mutex<s3::Client>>);

#[tauri::command]
async fn init_client(
    account_id: String,
    access_key_id: String,
    secret_access_key: String,
    client: Option<State<S3Client>>,
) -> Result<(), s3::Error> {
    let config = aws_config::defaults(BehaviorVersion::v2023_11_09())
        .credentials_provider(MyCredentials {
            account_id,
            access_key_id,
            secret_access_key,
        })
        .load()
        .await;
    let client = s3::Client::new(&config);
    let resp = client.list_buckets().send().await?;
    let buckets = resp.buckets();

    return buckets;

    // let mut state_client = client.0.lock().unwrap();
    // *state_client = client;
}

fn main() {
    tauri::Builder::default()
        .plugin(tauri_plugin_store::Builder::default().build())
        .manage(S3Client(Default::default()))
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
