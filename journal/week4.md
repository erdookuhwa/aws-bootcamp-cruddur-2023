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
- Since GitPod workspace is a dynamic environment, the `GITPOD_IP` value keeps changing so I created the [`rds-update-sg-rule`](https://github.com/erdookuhwa/aws-bootcamp-cruddur-2023/blob/main/backend-flask/bin/rds-update-sg-rule) script which successfully updates my RDS Security Group Inbound Rule with my new GitPod IP address.
- I got my Security Group and Security Group Rule IDs from my AWS Management Console and created env vars.
  ```sh
  export DB_SG_ID=<my_sg_id>
  gp env DB_SG_ID=<my_sg_id>

  export DB_SG_RULE_ID=<my_sgr_id>
  gp env DB_SG_RULE_ID=<my_sgr_id>
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


#### Cognito User Authentication Lambda
When a user signs up, we'd like to do a post confirmation lambda.
- In my AWS Management Console, I created a Lambda function ([`cruddur-post-confirmation`](https://github.com/erdookuhwa/aws-bootcamp-cruddur-2023/blob/main/aws/lambdas/cruddur-post-confirmation.py)). In the function tab.
- I added an the env var for CONNECTION_URL in the lambda since this is referenced in my lambda function.
  - ![image](https://github.com/erdookuhwa/aws-bootcamp-cruddur-2023/blob/main/_docs/assets/week4_lambdaEnvVar.png)
- I added a lambda Layer to my function and specified the `ARN`; I used the ARN and Python version specific to my use case as provided in JetBridge's [`Readme for the psycopg2-lambda-layer`](https://github.com/jetbridge/psycopg2-lambda-layer#psycopg2-lambda-layer)
  - ![image](https://github.com/erdookuhwa/aws-bootcamp-cruddur-2023/blob/main/_docs/assets/week4_addLambdaARN.png)
- In my Cognito User Pool > User Pool Properties, I added a lambda trigger
  - ![image](https://github.com/erdookuhwa/aws-bootcamp-cruddur-2023/blob/main/_docs/assets/week4_addLambdaTrigger.png)
- I added a policy to my lambda execution role already created at the time the function was created.
  ```json
  {
      "Version": "2012-10-17",
      "Statement": [{
          "Effect": "Allow",
          "Action": [
              "ec2:CreateNetworkInterface",
              "ec2:DeleteNetworkInterface",
              "ec2:DescribeNetworkInterfaces"
              ],
              "Resource": "*"
      }]
  }
  ```
  - My lambda function now has 2 policies attached.
    - ![image](https://github.com/erdookuhwa/aws-bootcamp-cruddur-2023/blob/main/_docs/assets/week4_lambdaPolicyAttached.png)
    - ![image](https://github.com/erdookuhwa/aws-bootcamp-cruddur-2023/blob/main/_docs/assets/week4_lambdaPolicyInFunction.png)
- I added a VPC to my lambda fxn
  - ![image](https://github.com/erdookuhwa/aws-bootcamp-cruddur-2023/blob/main/_docs/assets/week4_lambdaVPC.png)

**Testing**
- I loaded the new [`schema`](https://github.com/erdookuhwa/aws-bootcamp-cruddur-2023/blob/main/backend-flask/db/schema.sql) (which now has an `email` field) into my prod DB
- Then signed up and confirmed my user which shows up in Cognito.
- From my GitPod terminal, I connected to my prod db, and confirmed that my data was inputted into the `users` table.
  - ![image](https://github.com/erdookuhwa/aws-bootcamp-cruddur-2023/blob/main/_docs/assets/week4_usersInputtedProd.png)


#### Creating Activities
When a user posts a "crud", we'll like this activity to be pushed to the `activities` table in our database. To achieve this, I made some changes to my:
- [`home_activities.py`](https://github.com/erdookuhwa/aws-bootcamp-cruddur-2023/blob/main/backend-flask/services/home_activities.py) basically queries and displays the results from the [`home.sql`](https://github.com/erdookuhwa/aws-bootcamp-cruddur-2023/blob/main/backend-flask/db/sql/activities/home.sql) file
- [`create_activity.py`](https://github.com/erdookuhwa/aws-bootcamp-cruddur-2023/blob/main/backend-flask/services/create_activity.py) runs the query from the [`create.sql`](https://github.com/erdookuhwa/aws-bootcamp-cruddur-2023/blob/main/backend-flask/db/sql/activities/create.sql) file and then using the [`object.sql`](https://github.com/erdookuhwa/aws-bootcamp-cruddur-2023/blob/main/backend-flask/db/sql/activities/object.sql) template to display activity object
- [`seed.sql`](https://github.com/erdookuhwa/aws-bootcamp-cruddur-2023/blob/main/backend-flask/db/seed.sql) file; initially manually inserting my user into the db so I can then make manipulations with this user. _For an activity to be posted, I require a `user_uuid` hence this tweak._
- Also, refactored and created new `sql` files to handle specific `sql` manipulations:
  - [`create.sql`](https://github.com/erdookuhwa/aws-bootcamp-cruddur-2023/blob/main/backend-flask/db/sql/activities/create.sql) handling the action of inserting an activity into the `activities table`
  - [`home.sql`](https://github.com/erdookuhwa/aws-bootcamp-cruddur-2023/blob/main/backend-flask/db/sql/activities/home.sql) which makes a selection of all activities in relation to the user querying them hence the `JOIN` on `users table` on `user_uuid`
  - [`object.sql`](https://github.com/erdookuhwa/aws-bootcamp-cruddur-2023/blob/main/backend-flask/db/sql/activities/object.sql) which selects activities where activities and users `uuid` match
- On the frontend in [`HomePageFeed.js`](https://github.com/erdookuhwa/aws-bootcamp-cruddur-2023/blob/main/frontend-react-js/src/pages/HomeFeedPage.js) passing the `user_handle` as a prop to the `ActivityForm` component.
- Also on the frontend, in the [`ActivityForm.js`](https://github.com/erdookuhwa/aws-bootcamp-cruddur-2023/blob/main/frontend-react-js/src/components/ActivityForm.js) component, within the `onsubmit` function, modified the JSON data being received in the body to receive the `user_handle`

##### Testing Creating Activities
- Logging into my app @ the frontend URL, I was able to successfully post a crud:
  - ![image](https://github.com/erdookuhwa/aws-bootcamp-cruddur-2023/blob/main/_docs/assets/week4_activitiesPosted.png)
- From within my terminal, I established a connection to my prod DB and when I queried my `activities` table, I was able to view my posts:
  - ![image](https://github.com/erdookuhwa/aws-bootcamp-cruddur-2023/blob/main/_docs/assets/week4_createdActivitiesInRDSDB.png)
