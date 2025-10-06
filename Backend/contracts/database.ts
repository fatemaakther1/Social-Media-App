/*
|--------------------------------------------------------------------------
| Database Contracts
|--------------------------------------------------------------------------
|
| This file must be updated every time you add or remove a database
| connection. Also make sure to check the file "config/database.ts".
|
*/

declare module '@ioc:Adonis/Lucid/Database' {
  interface DatabaseConnectionsList {
    mysql: {
      config: MySqlConfig
      implementation: MySqlDriverContract
    }
  }
}