// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use aws_sdk_s3 as s3;
use std::sync::Mutex;

struct S3Client {
    client: Mutex<s3::Client>,
}

#[tauri::command]
async fn init_client(
    account_id: String,
    access_key_id: String,
    secret_access_key: String,
) -> Result<(), s3::Error> {
}

fn main() {
    tauri::Builder::default()
        .plugin(tauri_plugin_store::Builder::default().build())
        .manage(S3Client)
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
