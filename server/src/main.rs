use actix_files::NamedFile;
use actix_web::{get, middleware, HttpRequest, Result, HttpResponse};
use actix_web::http::header::{CACHE_CONTROL, HeaderValue};
use std::env;
use std::path::PathBuf;

static CACHE_CONTROL_IMMUTABLE: &str = "public, max-age=604800, immutable";
static CACHE_CONTROL_CACHE_HOUR: &str = "public, max-age=3600";

#[get("/{filename:.*}")]
async fn index(req: HttpRequest) -> Result<HttpResponse> {
    let host_dir = env::var("HOST_DIR").unwrap_or(".".into());
    let filename_query = req.match_info().query("filename");
    let filename = if filename_query.len() <= 2 {
        "index.html".into()
    } else {
        filename_query
    };
    let path_str: String = format!("{}/{}", host_dir, filename);
    let path: PathBuf = path_str.parse().unwrap();
    let mut res = NamedFile::open(path)?.into_response(&req)?;

    if path_str.contains("/gifs") {
        res.headers_mut().insert(CACHE_CONTROL, HeaderValue::from_static(CACHE_CONTROL_IMMUTABLE));
    } else {
        res.headers_mut().insert(CACHE_CONTROL, HeaderValue::from_static(CACHE_CONTROL_CACHE_HOUR));
    }

    Ok(res)
}

#[actix_web::main]
async fn main() -> std::io::Result<()> {
    env_logger::init();

    use actix_web::{App, HttpServer};
    let host = env::var("HOST").unwrap_or("0.0.0.0:8080".into());

    HttpServer::new(|| {
        App::new()
            .wrap(middleware::Compress::default())
            .wrap(middleware::Logger::default())
            .service(index)
    })
    .bind(host)?
    .run()
    .await
}
