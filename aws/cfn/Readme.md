## Architecture Guide

Before you run any templates, be sure to create an S3 bucket to contain all of our artifacts for CloudFormation.

```sh
aws s3 mk s3://ek-cfn-artifacts
export CFN_BUCKET="ek-cfn-artifacts"
gp env CFN_BUCKET="ek-cfn-artifacts"
```

> remember bucket names are unique...