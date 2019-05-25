# Taskira
A Jira-like app for task management

#
### How to run on local

- **Step 1**: Clone or download to your machine
- **Step 2**: 
    - In the project directory, run `export taskira_privateKey="whatever_key_you_want"` to set the private key for JWT
    - Run `npm run dev` to start the server on port 5000
- **Step 3**: Open another terminal and run `cd frontend/ && npm start` to start frontend server on port 3000

### What the project can do so far
- Go to Dashboard to see tickets from all users
- Only able to sign in (haven't had time for sign up - but that should be quick)
    - There are 3 accounts available at the moment `khoa@mail.com`, `sample@mail.com` and `test@mail.com`
    - Password is `password`
- Once sign in, users can 
    - Create a ticket
    - Browse specific ticket to see the details as well as the comments
    - Update status of ticket by click on the button next to **Status**
    - If users update it by mistake and want to reverted, they can click and hold the button. A list of statuses will appear
        _(Handle this with RxJS)_
    - Assign the ticket to themselves or to other by click on the email next to **Assignee**
        - After clicking on it, an input will show.
        - User type something, and this will send a request to server to find other users.
        - With RxJS, as user type, nothing happens. After they pause for 250ms, this will fire off an api to fetch other user's emails based on the input value.
