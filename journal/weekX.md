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
- After Syncing
  - ![image](https://github.com/erdookuhwa/aws-bootcamp-cruddur-2023/blob/8a5afe4331ed5456ea7d686b3c7ccbc8929c0328/_docs/assets/WeekX_afterSync.png)
nd noticed changes. Also, change is now visible online






















🚧 💻
