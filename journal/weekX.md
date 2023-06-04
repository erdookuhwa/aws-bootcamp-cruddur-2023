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
























🚧 💻
