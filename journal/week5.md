# Week 5 — DynamoDB and Serverless Caching

I started off by installing `boto3`, an AWS SDK for Python used to interact with my AWS services/resources. I achieved this by adding `boto3` to my [`requirements.txt`](https://github.com/erdookuhwa/aws-bootcamp-cruddur-2023/blob/main/backend-flask/requirements.txt) file and running the command from terminal:
```py
pip install -r requirements.txt
```
##### Bash Scripts
- I did some cleanup/restructuring for my previous bash scripts using `psql`
  - They all now be found in [`db folder`](https://github.com/erdookuhwa/aws-bootcamp-cruddur-2023/tree/main/backend-flask/bin/db)
    - Also, updated the paths in my [`setup`](https://github.com/erdookuhwa/aws-bootcamp-cruddur-2023/blob/main/backend-flask/bin/db/setup) script to reflect same
- I also created scripts for manipulating DynamoDB (DDB) and granted them executable access (`chmod u+x <name_of_file>`):
  - [`schema-load`](https://github.com/erdookuhwa/aws-bootcamp-cruddur-2023/blob/main/backend-flask/bin/ddb/schema-load)
  - [`seed`](https://github.com/erdookuhwa/aws-bootcamp-cruddur-2023/blob/main/backend-flask/bin/ddb/seed)
  - [`drop`](https://github.com/erdookuhwa/aws-bootcamp-cruddur-2023/blob/main/backend-flask/bin/ddb/drop)


















💻 Under Construction... 🚧
