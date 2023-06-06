# Week X - Sync Tool for Static Website Hosting

### Static Building for App
- [static-build](https://github.com/erdookuhwa/aws-bootcamp-cruddur-2023/blob/b6f531940fd9bd74b2b4231cfd24d31e3f3bb9cc/bin/frontend/static-build): used for packaging/building app ready for static hosting.
  - fixed warnings after running the build command
- zip the build directory for upload to S3
  ```sh
  zip -r cruddurBuild.zip build/
  ```
  - ![image](https://github.com/erdookuhwa/aws-bootcamp-cruddur-2023/blob/5fe8eccc37c64acb0ac11334eb8ca2d3adf18a6f/_docs/assets/WeekX_downloadBuildZip.png)
- Uploaded its content to the root S3 bucket in _AWS Management Console_
- Previously the domain was inaccessible
  - ![image](https://github.com/erdookuhwa/aws-bootcamp-cruddur-2023/blob/5fe8eccc37c64acb0ac11334eb8ca2d3adf18a6f/_docs/assets/WeekX_domainInAccessible.png)
- After uploading the build contents, I'm now able to access my cruddur app:
  - ![image](https://github.com/erdookuhwa/aws-bootcamp-cruddur-2023/blob/5fe8eccc37c64acb0ac11334eb8ca2d3adf18a6f/_docs/assets/WeekX_domainAccessible.png)

### Adding Sync Tool
- [sync](https://github.com/erdookuhwa/aws-bootcamp-cruddur-2023/blob/626ba65f5194f2e8fd04565e62ad518c4abf4823/bin/frontend/sync): Created the sync script to automate the process of syncing our static website in S3 with CloudFront
- [generate-env](https://github.com/erdookuhwa/aws-bootcamp-cruddur-2023/blob/626ba65f5194f2e8fd04565e62ad518c4abf4823/bin/frontend/generate-env): Updated the frontend's `generate-env` file to generate env vars for the sync tool.
- In the terminal, install `dotenv` and `aws_s3_website_sync` by running the commands:
  ```ruby
  gem install dotenv
  gem install aws_s3_website_sync
  ```

### Test Syncing
- Made a modification to [DesktopSidebar.js](https://github.com/erdookuhwa/aws-bootcamp-cruddur-2023/blob/626ba65f5194f2e8fd04565e62ad518c4abf4823/frontend-react-js/src/components/DesktopSidebar.js), ran the `static-build` script to build the files, then ran the [sync](https://github.com/erdookuhwa/aws-bootcamp-cruddur-2023/blob/626ba65f5194f2e8fd04565e62ad518c4abf4823/bin/frontend/sync) which sets up the env and triggers a build for the app; after accepting the changes, it redeployed the website showing new changes.
- Planning the `sync`
  - ![image](https://github.com/erdookuhwa/aws-bootcamp-cruddur-2023/blob/8a5afe4331ed5456ea7d686b3c7ccbc8929c0328/_docs/assets/WeekX_runSyncI.png)
- Accepting the "plan", confirms CloudFront Distribution will be invalidated
  - ![image](https://github.com/erdookuhwa/aws-bootcamp-cruddur-2023/blob/8a5afe4331ed5456ea7d686b3c7ccbc8929c0328/_docs/assets/WeekX_syncInvalidate.png)
  - ![image](https://github.com/erdookuhwa/aws-bootcamp-cruddur-2023/blob/8a5afe4331ed5456ea7d686b3c7ccbc8929c0328/_docs/assets/WeekX_CloudFrontInvalidation.png)
- Before Syncing
  - ![image](https://github.com/erdookuhwa/aws-bootcamp-cruddur-2023/blob/8a5afe4331ed5456ea7d686b3c7ccbc8929c0328/_docs/assets/WeekX_beforeSync.png)
- After Syncing, change is now visible online
  - ![image](https://github.com/erdookuhwa/aws-bootcamp-cruddur-2023/blob/8a5afe4331ed5456ea7d686b3c7ccbc8929c0328/_docs/assets/WeekX_afterSync.png)


### Attempting Automation with GitHub Actions...
- Created a [Gemfile](https://github.com/erdookuhwa/aws-bootcamp-cruddur-2023/blob/b5288acf19ee92a84297873ef810bc8110eb8c8e/Gemfile) to install required libraries
- Setup tasks in [Rakefile](https://github.com/erdookuhwa/aws-bootcamp-cruddur-2023/blob/b5288acf19ee92a84297873ef810bc8110eb8c8e/Rakefile)
- Defined github actions in [sync.yaml](https://github.com/erdookuhwa/aws-bootcamp-cruddur-2023/blob/b5288acf19ee92a84297873ef810bc8110eb8c8e/.github/workflows/sync.yaml)

### CFN SYNC
- Created the [template.yaml](https://github.com/erdookuhwa/aws-bootcamp-cruddur-2023/blob/81f042ddbfe6d110ef8f81309a546e8a6092d6d1/aws/cfn/sync/template.yaml) to create the sync resource
- Stored parameters in [config.toml](https://github.com/erdookuhwa/aws-bootcamp-cruddur-2023/blob/81f042ddbfe6d110ef8f81309a546e8a6092d6d1/aws/cfn/sync/config.toml)
- Created the [sync](https://github.com/erdookuhwa/aws-bootcamp-cruddur-2023/blob/81f042ddbfe6d110ef8f81309a546e8a6092d6d1/bin/cfn/sync) script to deploy the template
- From cli, run the commands so the sync script can run. We also updated [gitpod.yml](https://github.com/erdookuhwa/aws-bootcamp-cruddur-2023/blob/8d768c691c3bd0e010f0743469fcaa0beabbea7e/.gitpod.yml) to do this whenever a new workspace is launched:
  ```ruby
    bundle install
    bundle update --bundler
  ```
- Run the sync script to create changeset which provisions the Sync Role and GitHub OpenID Connect (GithubOidc) resources
  - ![image](https://github.com/erdookuhwa/aws-bootcamp-cruddur-2023/blob/e6daf4d7d9088e4953d30ae0ea0eb2778a1a0ddf/_docs/assets/WeekX_cfnSyncResources.png)
  - ![image](https://github.com/erdookuhwa/aws-bootcamp-cruddur-2023/blob/e6daf4d7d9088e4953d30ae0ea0eb2778a1a0ddf/_docs/assets/WeekX_cfnSyncStack.png)
  #### Error Syncing
  - When running the sync script after building, you may get this error.
    - ![image](https://github.com/erdookuhwa/aws-bootcamp-cruddur-2023/blob/e6daf4d7d9088e4953d30ae0ea0eb2778a1a0ddf/_docs/assets/WeekX_errorSyncing.png)
  - This is because in our generated `sync.env`, we specify only the output directory but sync is looking for a file to place the change set in. Fix by appending a placeholder after `/tmp`:
    - ![image](https://github.com/erdookuhwa/aws-bootcamp-cruddur-2023/blob/e6daf4d7d9088e4953d30ae0ea0eb2778a1a0ddf/_docs/assets/WeekX_fixSyncError.png)


















🚧 💻
