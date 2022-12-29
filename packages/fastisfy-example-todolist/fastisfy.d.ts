declare module "fastisfy" {
  interface FastisfyRequest {
    db: import("sqlite3").Database;
  }
}
