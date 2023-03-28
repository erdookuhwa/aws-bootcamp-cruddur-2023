# Week 5 — DynamoDB and Serverless Caching

I started off by installing `boto3`, an AWS SDK for Python used to interact with my AWS services/resources. I achieved this by adding `boto3` to my [`requirements.txt`](https://github.com/erdookuhwa/aws-bootcamp-cruddur-2023/blob/main/backend-flask/requirements.txt) file and running the command from terminal:
```py
pip install -r requirements.txt
```
##### Scripts
- I did some cleanup/restructuring for my previous bash scripts using `psql`
  - They all now be found in [`db folder`](https://github.com/erdookuhwa/aws-bootcamp-cruddur-2023/tree/main/backend-flask/bin/db)
    - Also, updated the paths in my [`setup`](https://github.com/erdookuhwa/aws-bootcamp-cruddur-2023/blob/main/backend-flask/bin/db/setup) script to reflect same
- I also created scripts for manipulating DynamoDB (DDB) and granted them executable access (`chmod u+x <name_of_file>`):
  - [`schema-load`](https://github.com/erdookuhwa/aws-bootcamp-cruddur-2023/blob/main/backend-flask/bin/ddb/schema-load): this creates a table in my `dynamodb-local db`
  - ![image](https://github.com/erdookuhwa/aws-bootcamp-cruddur-2023/blob/main/_docs/assets/week5_schemaCreateTableDDBLocal.png)
    - [`list-tables`](https://github.com/erdookuhwa/aws-bootcamp-cruddur-2023/blob/main/backend-flask/bin/ddb/list-tables): after loading my schema, I wrote a script to list my tables
    - ![image](https://github.com/erdookuhwa/aws-bootcamp-cruddur-2023/blob/main/_docs/assets/week5_listTables.png)
  - [`seed`](https://github.com/erdookuhwa/aws-bootcamp-cruddur-2023/blob/main/backend-flask/bin/ddb/seed): add items to ddb table
    - ![image](https://github.com/erdookuhwa/aws-bootcamp-cruddur-2023/blob/main/_docs/assets/week5_seedDDBTable.png)
  - [`drop`](https://github.com/erdookuhwa/aws-bootcamp-cruddur-2023/blob/main/backend-flask/bin/ddb/drop): successfully deletes a ddb table when you provide the file name
    - ![image](https://github.com/erdookuhwa/aws-bootcamp-cruddur-2023/blob/main/_docs/assets/week5_droppingDDBTable.png)
  - [`scan`](https://github.com/erdookuhwa/aws-bootcamp-cruddur-2023/blob/main/backend-flask/bin/ddb/scan): to scan (_return all items in table_) the ddb table
  - [`get-conversations`](https://github.com/erdookuhwa/aws-bootcamp-cruddur-2023/blob/main/backend-flask/bin/ddb/patterns/get-conversations): will show user's conversations
    - ![image](https://github.com/erdookuhwa/aws-bootcamp-cruddur-2023/blob/main/_docs/assets/week5_getConversations.png)
  - [`list-conversations`](https://github.com/erdookuhwa/aws-bootcamp-cruddur-2023/blob/main/backend-flask/bin/ddb/patterns/list-conversations): shows user's conversation
    - ![image](https://github.com/erdookuhwa/aws-bootcamp-cruddur-2023/blob/main/_docs/assets/week5_listConversations.png)
  - 

  #### Patterns
  ###### Pattern A _List all messages in Message Group_
  - I started off by creating a [`ddb.py`](https://github.com/erdookuhwa/aws-bootcamp-cruddur-2023/blob/main/backend-flask/lib/ddb.py) object.
  - [`list_users`](https://github.com/erdookuhwa/aws-bootcamp-cruddur-2023/blob/main/backend-flask/bin/cognito/list-users): this script lists the users in my Cognito User Pool rather than hardcoding the users. 
    - I exported my user_pool_id as an environment variable and updated my [`docker-compose.yml`]() to pick up the value from the env var.
    ```sh
    export AWS_COGNITO_USER_POOL_ID <my_cognito_user_pool_id>
    gp env AWS_COGNITO_USER_POOL_ID <my_cognito_user_pool_id>
    ```
    

























💻 Under Construction... 🚧
