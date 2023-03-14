# Week 3 — Decentralized Authentication

#### AWS Amplify + Amazon Cognito
- Within my AWS Management Console, I created a Cognito User Pool following the Wizard.
  ![image](https://github.com/erdookuhwa/aws-bootcamp-cruddur-2023/blob/main/_docs/assets/week3_cognito_userpool.png)
- In my app (GitPod env), I installed AWS Amplify using `npm install aws-amplify --save`. This was successful and added the amplify package to the [`package.json`](https://github.com/erdookuhwa/aws-bootcamp-cruddur-2023/blob/main/frontend-react-js/package.json) file. 
- Next, I configured Amplify to hook up to my already created Cognito user pool. I achieved this by updating the code in [`App.js`](https://github.com/erdookuhwa/aws-bootcamp-cruddur-2023/blob/main/frontend-react-js/src/App.js), _see Amplify.configure code block_
- Configuring Amplify requires use of some environment variables which I set up in my `docker-compose.yml` file.
  ```yml
  REACT_APP_AWS_PROJECT_REGION: "${AWS_DEFAULT_REGION}"
  REACT_APP_AWS_COGNITO_REGION: "${AWS_DEFAULT_REGION}"
  REACT_APP_AWS_USER_POOLS_ID: "<your_user_pool_ID>"
  REACT_APP_CLIENT_ID: "<your_app_client_id>"  #check under App Integration tab in your User Pool
  ```
  
#### Display Components Based on Logged In State
- In my `HomeFeedPage.js` file, I used [instruction's provided](https://github.com/omenking/aws-bootcamp-cruddur-2023/blob/week-3/journal/week3.md) to update the Authorization check, previously just mocked to use cookies.
- I updated the code in [`ProfileInfo.js`](https://github.com/erdookuhwa/aws-bootcamp-cruddur-2023/blob/main/frontend-react-js/src/components/ProfileInfo.js), Signout function to check using the authorization rather than the cookies.
  ```js
    import { Auth } from 'aws-amplify';

    const signOut = async () => {
      try {
          await Auth.signOut({ global: true });   //this global: true signs out every instance currently signed in. i.e. from every device or browser tab.
          window.location.href = "/"
      } catch (error) {
          console.log('error signing out: ', error);
      }
    }
  ```

##### I updated the `SigninPage.js` file.
  ```js
  // ... existing code
  // ... removed previous onsubmit function and updated to ⬇️
  
  const onsubmit = async (event) => {
    setErrors('')
    event.preventDefault();
    Auth.signIn(email, password)
      .then(user => {
        localStorage.setItem("access_token", user.signInUserSession.accessToken.jwtToken)
        window.location.href = "/"
      })
      .catch(error => {
        if (error.code == 'UserNotConfirmedException') {
          window.location.href = "/confirm"
        }
      setErrors(error.message)
    });
    return false
  }
  ```
- Tested by hitting the frontend URL, and attempting to sign in generated an error:
  ![image](https://github.com/erdookuhwa/aws-bootcamp-cruddur-2023/blob/main/_docs/assets/week3_signinerror.png)
  
- To resolve, I went into my AWS Management Console and created a user in my Cognito user pool
  ![image](https://github.com/erdookuhwa/aws-bootcamp-cruddur-2023/blob/main/_docs/assets/week3_cognito_user.png)
  
- Got the verification email: 
- ![image](https://github.com/erdookuhwa/aws-bootcamp-cruddur-2023/blob/main/_docs/assets/week3_cognitoUserEmailConfirmation.png)
- To get the Signin component working correctly, I ran this command from terminal:
```sh
aws cognito-idp admin-set-user-password --username <your_username> --password <your_password> --user-pool-id <your_user_pool-id> --permanent
```
The user is now verified!
  ![image](https://github.com/erdookuhwa/aws-bootcamp-cruddur-2023/blob/main/_docs/assets/week3_userVerified.png)


##### SignUp Page
After disabling then deleting the user in my User Pool, I updated the onsubmit function in [`SignupPage.js`](https://github.com/erdookuhwa/aws-bootcamp-cruddur-2023/blob/main/frontend-react-js/src/pages/SignupPage.js)
```js
// ... existing code ...
// Add import { Auth } from 'aws-amplify'; to imports

const onsubmit = async (event) => {
    event.preventDefault();
    setErrors('')
    try {
        const { user } = await Auth.signUp({
          username: email,
          password: password,
          attributes: {
              name: name,
              email: email,
              preferred_username: username,
          },
          autoSignIn: { // optional - enables auto sign in after user is confirmed
              enabled: true,
          }
        });
        console.log(user);
        window.location.href = `/confirm?email=${email}`
    } catch (error) {
        console.log(error);
        setErrors(error.message)
    }
    return false
  }
```
##### Confirmation Page
- I updated the `resend_code` and `onsubmit` functions after importing { Auth } from the 'aws-amplify' library. Here's a snippet of what those functions now look like.
```js
// --- some code ---
const resend_code = async (event) => {
    setErrors('')
    try {
      await Auth.resendSignUp(email);
      console.log('code resent successfully');
      setCodeSent(true)
    } catch (err) {
      // does not return a code
      console.log(err)
      if (err.message == 'Username cannot be empty'){
        setErrors("You need to provide an email in order to send Resend Activiation Code")   
      } else if (err.message == "Username/client id combination not found."){
        setErrors("Email is invalid or cannot be found.")   
      }
    }
  }

const onsubmit = async (event) => {
    event.preventDefault();
    setErrors('')
    try {
      await Auth.confirmSignUp(email, code);
      window.location.href = "/"
    } catch (error) {
      setErrors(error.message)
    }
    return false
  }

```
###### Testing
- At the app's frontend url, I am able to sign up a new user, get the verification code, and then after user is created, I can sign in with the newly created user details. 
- In my AWS management console, I'm able to see the user in my user pool.
  ![image](https://github.com/erdookuhwa/aws-bootcamp-cruddur-2023/blob/main/_docs/assets/week3_userCreatedInCognito.png)


##### Password Recovery
Say a user forgets their password, I updated the code in [`RecoveryPage.js`](https://github.com/erdookuhwa/aws-bootcamp-cruddur-2023/blob/main/frontend-react-js/src/pages/RecoverPage.js) file to handle it.
- User recovery works as expected and I received the verification code.
  ![image](https://github.com/erdookuhwa/aws-bootcamp-cruddur-2023/blob/main/_docs/assets/week3_userVerifyCodes.png)
- I am now able to use the verification code to reset password
  ![image](https://github.com/erdookuhwa/aws-bootcamp-cruddur-2023/blob/main/_docs/assets/week3_recoveryPage.png)
- Reset was successful
  ![image](https://github.com/erdookuhwa/aws-bootcamp-cruddur-2023/blob/main/_docs/assets/week3_successfulReset.png)


Still WIP 🚧 





















