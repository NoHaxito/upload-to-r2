// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use aws_config::Region;
use aws_credential_types::Credentials;
use aws_sdk_s3::{Client, Config};
use serde::{
    ser::{SerializeStruct, Serializer},
    Serialize,
};
use std::sync::Mutex;
use tauri::State;

#[derive(Serialize)]
struct CustomResponse<T> {
    message: String,
    data: Option<T>,
}
#[derive(Serialize)]
struct CustomError {
    error: String,
}
pub struct S3Client(pub Mutex<Option<Client>>);

pub struct BucketWrapper(aws_sdk_s3::types::Bucket);
impl Serialize for BucketWrapper {
    fn serialize<S>(&self, serializer: S) -> Result<S::Ok, S::Error>
    where
        S: Serializer,
    {
        let mut s = serializer.serialize_struct("BucketWapper", 2)?;
        s.serialize_field("name", &self.0.name)?;
        s.serialize_field("creation_date", &self.0.creation_date.unwrap().to_string())?;
        s.end()
    }
}

#[tauri::command]
async fn init_client(
    account_id: String,
    access_key_id: String,
    secret_access_key: String,
    client: State<'_, S3Client>,
) -> Result<CustomResponse<()>, String> {
    let credentials = Credentials::from_keys(
        access_key_id.to_string(),
        secret_access_key.to_string(),
        None,
    );
    let config = Config::builder()
        .credentials_provider(credentials)
        .region(Region::new("auto"))
        .endpoint_url(format!("https://{account_id}.r2.cloudflarestorage.com"))
        .build();

    let s3_client = Client::from_conf(config);
    let resp = s3_client.list_buckets().send().await;

    match resp {
        Ok(_response) => {
            let mut client = client.0.lock().unwrap();
            *client = Some(s3_client);
            Ok(CustomResponse {
                message: "Client initialized successfully".to_string(),
                data: None,
            })
        }
        Err(err) => {
            let custom_error = CustomError {
                error: err.to_string(),
            };
            println!("Error: {:#?}", custom_error.error);
            let serialized_error = serde_json::to_string(&custom_error).unwrap();
            Err(serialized_error)
        }
    }
}

#[tauri::command]
async fn list_buckets(
    client: State<'_, S3Client>,
) -> Result<CustomResponse<Vec<BucketWrapper>>, String> {
    let client_ref = match client.0.lock() {
        Ok(client_guard) => match client_guard.clone() {
            Some(client) => client,
            None => {
                return Err("Client not initialized".to_string());
            }
        },
        Err(poison_err) => {
            return Err(format!("Mutex poisoned: {:?}", poison_err));
        }
    };
    let resp = client_ref.list_buckets().send().await;
    match resp {
        Ok(response) => {
            let buckets: Vec<BucketWrapper> = response
                .buckets()
                .into_iter()
                .map(move |bucket| BucketWrapper(bucket.clone()))
                .collect();
            Ok(CustomResponse {
                message: "Success".to_string(),
                data: Some(buckets),
            })
        }
        Err(err) => {
            let custom_error = CustomError {
                error: err.to_string(),
            };
            let serialized_error = serde_json::to_string(&custom_error).unwrap();
            Err(serialized_error)
        }
    }
}

fn main() {
    tauri::Builder::default()
        .manage(S3Client(Mutex::new(None)))
        .invoke_handler(tauri::generate_handler![init_client, list_buckets])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
