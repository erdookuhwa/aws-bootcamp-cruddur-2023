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
  - [`db-create`](https://github.com/erdookuhwa/aws-bootcamp-cruddur-2023/blob/main/backend-flask/bin/db-drop) Creates a database named `cruddur`
    - ![image](https://github.com/erdookuhwa/aws-bootcamp-cruddur-2023/blob/main/_docs/assets/week4_dbCreatedScript.png)
    
  - [`db-drop`](https://github.com/erdookuhwa/aws-bootcamp-cruddur-2023/blob/main/backend-flask/bin/db-create) Drops/deletes database
    - ![image](https://github.com/erdookuhwa/aws-bootcamp-cruddur-2023/blob/main/_docs/assets/week4_dbDroppedScript.png)
    
  - [`db-schema-load`](https://github.com/erdookuhwa/aws-bootcamp-cruddur-2023/blob/main/backend-flask/bin/db-schema-load) Loads in the schema for my database
    - ![image](https://github.com/erdookuhwa/aws-bootcamp-cruddur-2023/blob/main/_docs/assets/week4_dbSchemaLoadScript.png)
    
  - [`db-connect`](https://github.com/erdookuhwa/aws-bootcamp-cruddur-2023/blob/main/backend-flask/bin/db-connect) Establishes a connection to my database
    - ![image](https://github.com/erdookuhwa/aws-bootcamp-cruddur-2023/blob/main/_docs/assets/week4_dbConnectScript.png)
    
  - [`db-seed`](https://github.com/erdookuhwa/aws-bootcamp-cruddur-2023/blob/main/backend-flask/db/seed.sql) Loads in data into schema.
    - ![image](https://github.com/erdookuhwa/aws-bootcamp-cruddur-2023/blob/main/_docs/assets/week4_dbSeed.png)
  - [`db-setup`]() Automate the process of creating database, schema, and loading data into schema.
    - ![image](https://github.com/erdookuhwa/aws-bootcamp-cruddur-2023/blob/main/_docs/assets/week4_dbSetup.png)
    
- I granted executable access to the files using:
  ```sh
  chmod u+x `<name_of_file>`
  ```

##### Table Schema
- I created `users` and `activities` tables using the [`schema.sql`](https://github.com/erdookuhwa/aws-bootcamp-cruddur-2023/blob/main/backend-flask/db/schema.sql) file
  ![image](https://github.com/erdookuhwa/aws-bootcamp-cruddur-2023/blob/main/_docs/assets/week4_schemasql.png)
- I also populated mock data into the created tables from the [`seed.sql`](https://github.com/erdookuhwa/aws-bootcamp-cruddur-2023/blob/main/backend-flask/db/seed.sql).
- I am able to query for and view data in my `cruddur` database:
  ![image](https://github.com/erdookuhwa/aws-bootcamp-cruddur-2023/blob/main/_docs/assets/week4_selectActivities.png)

##### Check Active Connections
- To view the active connections I have to my DB before dropping, I created a script [`db-sessions`](https://github.com/erdookuhwa/aws-bootcamp-cruddur-2023/blob/main/backend-flask/bin/db-sessions):
  ![image](https://github.com/erdookuhwa/aws-bootcamp-cruddur-2023/blob/main/_docs/assets/week4_activeSessions.png)

##### Postgres Client (psycopg)
- I installed the `psycopg` client to enable my backend communicate seamlessly with the `Postgres` DB. I achieved this by adding the libraries `psycopg[binary]` and `psycopg[pool]` to my [`requirements.txt`](https://github.com/erdookuhwa/aws-bootcamp-cruddur-2023/blob/main/backend-flask/requirements.txt) file and running `pip install -r requirements.txt` in terminal. 
- I created a file [`db.py`](https://github.com/erdookuhwa/aws-bootcamp-cruddur-2023/blob/main/backend-flask/lib/db.py), which I specified the connection settings.
- In my [`docker-compose.yml`](https://github.com/erdookuhwa/aws-bootcamp-cruddur-2023/blob/main/docker-compose.yml) file, I added the `CONNECTION_URL` variable.
- In [`home_activities.py`](https://github.com/erdookuhwa/aws-bootcamp-cruddur-2023/blob/main/backend-flask/services/home_activities.py), I made modifications for sql pool connection and querying.

#### Connecting to my RDS instance
- In the SG of my RDS instance, I added an inbound rule to permit my `GitPod IP` to establish a connection with the RDS instance. I achieved this by creating an env var of my GitPod IP by running `export GITPOD_IP=$(curl ifconfig.me)`.
  - ![image](https://github.com/erdookuhwa/aws-bootcamp-cruddur-2023/blob/main/_docs/assets/week4_rdsSG.png)
  - I used the command `psql $PROD_CONNECTION_URL` from terminal to establish the connection.
    - ![image](https://github.com/erdookuhwa/aws-bootcamp-cruddur-2023/blob/main/_docs/assets/week4_psqlProd.png)
##### Script for Updating GitPod's IP
- Since GitPod workspace is a dynamic environment, the `GITPOD_IP` value keeps changing so I created the [`rds-update-sg-rule`]() script which successfully updates my RDS Security Group Inbound Rule with my new GitPod IP address.
- I got my Security Group and Security Group Rule IDs from my AWS Management Console and created env vars.
  ```sh
  export DB_SG_ID="sg-0ff066e1dd6e70069"
  gp env DB_SG_ID="sg-0ff066e1dd6e70069"

  export DB_SG_RULE_ID="sgr-000bfba8baacb2cab"
  gp env DB_SG_RULE_ID="sgr-000bfba8baacb2cab"
  ```

###### Persisting SG Rule on GitPod Workspace Launch
- To persist my SG rule & GitPod IP update whenever I launch a new GitPod workspace, I updated my [`gitpod.yml`](https://github.com/erdookuhwa/aws-bootcamp-cruddur-2023/blob/main/.gitpod.yml) file by adding these lines:
  ```yml
      command: |
      export GITPOD_IP=$(curl ifconfig.me)
      source "THEIA_WORKSPACE_ROOT/backend-flask/bin/rds-update-sg-rule"
  ```
- Restarted my GitPod workspace to test and on launch, the script executes successfully. I verified the new IP was reflected in my Security Group.
  - ![image](https://github.com/erdookuhwa/aws-bootcamp-cruddur-2023/blob/main/_docs/assets/week4_scriptOnLaunch.png)


##### Testing Connection to RDS Instance 
I connected to my instance by adding the `prod` argument when I calling the `db-connect` script. I loaded the schema using the `db-schema-load` file and got a `200` confirming it was successful.
  - ![image](https://github.com/erdookuhwa/aws-bootcamp-cruddur-2023/blob/main/_docs/assets/week4_schemaLoadProd.png)
  - ![image](https://github.com/erdookuhwa/aws-bootcamp-cruddur-2023/blob/main/_docs/assets/week4_sc200.png)
- Identified error in my code on rollbar which I was able to rectify
  - ![image](https://github.com/erdookuhwa/aws-bootcamp-cruddur-2023/blob/main/_docs/assets/week4_rollbarError.png)















🚧 WIP 🚧
