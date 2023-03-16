# Week 4 — Postgres and RDS

- I began by **Provisioning an RDS instance** by running this command from my terminal:
  ![image](https://github.com/erdookuhwa/aws-bootcamp-cruddur-2023/blob/main/_docs/assets/week4_createRDSInstance.png)
- From within my AWS Console, I am able to confirm the instance is being created in my `us-east-1` region.
  ![image](https://github.com/erdookuhwa/aws-bootcamp-cruddur-2023/blob/main/_docs/assets/week4_rdsInstanceCreating.png)
- Within my terminal, I ran the command to successfully connect with PostgreSQL database:
  ```sql
  psql -Upostgres --host localhost
  ```
#### Creating a Database
- I created a database within my `psql connected` terminal env:
  ```sql
  CREATE DATABASE cruddur;
  ```
  ![image](https://github.com/erdookuhwa/aws-bootcamp-cruddur-2023/blob/main/_docs/assets/week4_creatingDatabase.png)
- I made a new directory within my `backend-flask` folder and added a `schema.sql` file to use Universally Unique IDs within my database instead of regular incremental IDs:
  ```sql
  CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
  ```
- Back in my terminal (in the backend-flask directory), I ran the command: ⏬ to load my schema into my created DB then make a connection to cruddur
  ```sh
  psql cruddur < db/schema.sql -h localhost -U postgres
  ```
  ![image](https://github.com/erdookuhwa/aws-bootcamp-cruddur-2023/blob/main/_docs/assets/week4_schemaLoad.png)


#### Exporting My Environment Variables
- To automate the process of having to manually input password on every connection, I created and exported the env var & persisted for reuse in my `GitPod` env.
  ```sh
  export CONNECTION_URL="postgresql://postgres:password@localhost:5432/cruddur"
  gp env CONNECTION_URL="postgresql://postgres:password@localhost:5432/cruddur"
  ```
- I am now able to make a connection to my DB using: `psql $CONNECTION_URL`


#### Automating Using Bash Scripts
- Still in my `backend-flask` directory, I created a new folder `lib` and added script files for various use cases:
  - [`db-create`](https://github.com/erdookuhwa/aws-bootcamp-cruddur-2023/blob/main/backend-flask/bin/db-drop)
    - ![image](https://github.com/erdookuhwa/aws-bootcamp-cruddur-2023/blob/main/_docs/assets/week4_dbCreatedScript.png)
    
  - [`db-drop`](https://github.com/erdookuhwa/aws-bootcamp-cruddur-2023/blob/main/backend-flask/bin/db-create)
    - ![image](https://github.com/erdookuhwa/aws-bootcamp-cruddur-2023/blob/main/_docs/assets/week4_dbDroppedScript.png)
    
  - [`db-schema-load`](https://github.com/erdookuhwa/aws-bootcamp-cruddur-2023/blob/main/backend-flask/bin/db-schema-load)
    - ![image](https://github.com/erdookuhwa/aws-bootcamp-cruddur-2023/blob/main/_docs/assets/week4_dbSchemaLoadScript.png)
    
  - [`db-connect`](https://github.com/erdookuhwa/aws-bootcamp-cruddur-2023/blob/main/backend-flask/bin/db-connect)
    - ![image](https://github.com/erdookuhwa/aws-bootcamp-cruddur-2023/blob/main/_docs/assets/week4_dbConnectScript.png)
    
  - [`db-seed`](https://github.com/erdookuhwa/aws-bootcamp-cruddur-2023/blob/main/backend-flask/db/seed.sql)
    - ![image](https://github.com/erdookuhwa/aws-bootcamp-cruddur-2023/blob/main/_docs/assets/week4_dbSeed.png)
    
- I granted executable access to the files using:
  ```sh
  chmod u+x `<name_of_file>`
  ```

##### Creating Tables for my Schema
- I created my Schema and tables in the [`schema.sql`](https://github.com/erdookuhwa/aws-bootcamp-cruddur-2023/blob/main/backend-flask/db/schema.sql) file
  ![image](https://github.com/erdookuhwa/aws-bootcamp-cruddur-2023/blob/main/_docs/assets/week4_schemasql.png)
- I also created a [`seed.sql`](https://github.com/erdookuhwa/aws-bootcamp-cruddur-2023/blob/main/backend-flask/db/seed.sql) with some mock data.
  








🚧 WIP 🚧
