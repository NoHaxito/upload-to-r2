// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use aws_config::Region;
use aws_credential_types::Credentials;
use aws_sdk_s3::{Client, Config};
use std::sync::Mutex;
use tauri::State;

#[derive(serde::Serialize)]
struct CustomResponse {
    message: String,
}
pub struct S3Client(pub Mutex<Option<Client>>);

#[tauri::command]
fn init_client(
    account_id: String,
    access_key_id: String,
    secret_access_key: String,
    client: State<S3Client>,
) -> Result<CustomResponse, String> {
    let credentials = Credentials::from_keys(access_key_id, secret_access_key, None);
    let config = Config::builder()
        .credentials_provider(credentials)
        .region(Region::new("us-east-1"))
        .endpoint_url(format!("https://{account_id}.r2.cloudflarestorage.com"))
        .build();

    let mut client = client.0.lock().unwrap();
    *client = Some(Client::from_conf(config));

    Ok(CustomResponse {
        message: "Client initialized successfully".to_string(),
    })
}

fn main() {
    tauri::Builder::default()
        .manage(S3Client(Mutex::new(None)))
        .invoke_handler(tauri::generate_handler![init_client])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
