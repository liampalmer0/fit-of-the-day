# Local Database Setup 
**Requires:** All project database scripts

**macOS Requires:** Homebrew
## Installing Postgresql & psql on macOS
Install postgresql
  
    brew install postgresql
    
Verify installation

    psql --version

---  
## Starting the DB server on macOS
    brew services start postgresql
This will start the database engine and let you connect to the server
  
Verify that it's running with 
    
    brew services

You can stop the service once you're done working so it doesn't use system resources with
    
    brew services stop postgresql

## Connecting via command line with psql
Postgres ships with a default database called 'postgres'

To connect just run :
    
    psql postgres

---
## Creating the database

1. Connect to the default database 'postgres'
2. Run the SQL statement `CREATE DATABASE fotd;` to create the empty database
3. Connect to the new database with `\c fotd <your-username>`

## Adding the test data
Run the database script `db/scripts/create_main_tables.sql`
  - For running script with psql
    1. `\! pwd` to see where you are 
    2. `\i <path/to/create_main_tables.sql>` to run it

<mark>The script should return a test result with **11 rows**</mark>

## Creating the test user
Create the db user cher by running
    
    CREATE ROLE cher LOGIN;

    GRANT SELECT ON ALL TABLES IN SCHEMA public TO cher;

---
## Tips and helpful commands
- All SQL statements in psql (command line) MUST end with a semicolon

### psql commands
- `\?` : help
- `\! [COMMAND]` : run a shell command
- `\l` : list databases
- `\dt`: list tables
- `\d` : list tables, views, and sequences
- `\c` : connect to a database
  - `\c [DBNAME|- USER|- HOST|- PORT|-]`
  - Ex: `\c fotd cher` to connect to db `fotd` as database user `cher`
  - When used with no args it shows connection info