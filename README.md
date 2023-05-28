# Project Objective DONE
1. Adding free text protect < 100 character
2. fetching users and userprofiles json every time
3. process to check users exist in json to get users detail
4. Check if he/she is child by birthdate
5. save those data in memory cache
6. scheduled sending email for those data
7. clear cache when sending email success
8. adding bgm and player to control the bgm

# TO-DO
If have more time, can better decorate the website with photo and like changing CSS for button,
or adding some visual function like on-mouse hover

Not sure if same child can send more than one message to santa at the same time, but as seen in users JSON
only one of them is child, so I allow the message to store in key of UUID to allow multiple message



# IMPORTANT! READ before starting
By default for anonymous users (non logged in), your code and app will only remain on glitch.com for 5 days.
In order to not lose your challenge, please create a glitch.com account and log in to glitch.com before proceeding.

The following README contains instructions to guide you through the coding challenge, please read them carefully.

# nodejs coding challenge:

## How to create and submit your app using glitch

0. **Login to glitch**: make sure you are logged in to glitch.com

1. **Clone**: Go to this URL: https://glitch.com/~nodejs-santa-app and click the `Remix your own` button to clone the code. This will copy all the code to a new, randomly generated URL (e.g. https://glitch.com/edit/#!/capable-toothpaste). This is your URL to code on, no other candidates will have this URL.

2. **Code**: You can edit the code directly in the Glitch editor or use your editor of choice (VSCode, Sublime, etc) and copy paste the files into Glitch. Git import and export is also available in the Tools menu on the bottom left. How you edit the code is entirely up to you, so long as your finished work is viewable at the URL created in the previous step.

> **NOTE**: Click `Show` in the header to see your app live. Updates to your code will instantly deploy and update live.

4. **Turn in**: When you finish coding, send your URL to us so we can review your code.


## Objectives overview:

The webapp should display a form for children to enter their id and a free text message to santa.

When submitting the form, the server should check:
 1. that the child is registered
 2. that the child is less than 10 years old.
To this purpose, the server can fetch user and profiles data in JSON format from:
- https://raw.githubusercontent.com/alj-devops/santa-data/master/userProfiles.json
- https://raw.githubusercontent.com/alj-devops/santa-data/master/users.json

If the child is not registered (no match for the user id) or more than 10years old, the webapp should display a basic error page with an error message explaining the problem.\
If the child is registered and less than 10 years old, the server should show a page indicating that the request has been received.

Every 15seconds, the server should send an email with information on all pending (not yet sent) requests including:
- child username (eg. charlie.brown)
- child's address (eg. 219-1130, Ikanikeisaiganaibaai, Musashino-shi, Tokyo)
- request free text as was input in the form

Email sender should be set as do_not_reply@northpole.com, and sent to santa@northpole.com

## tips and detailed instructions:

- somebody started to work on the app, but left it unfinished. It is up to you to complete it. You are allowed to restart from scratch if you prefer.
- the look and feel of the application for this challenge is not the priority. The pages/email do not need to look good, as long as they convey the information effectively.
- you should fetch the JSON data at every form submission (consider it as an API)
- for the sake of the challenge, you can keep the requests in-memory only
- you are encouraged to select and use npm packages as needed (you can add packages by editing package.json, or using `npm install` from the glitch console)
- to get an smtp server for emails, go to https://ethereal.email/ and click "Create Ethereal Account".\
This will give you an account (take note of your username and pwd if you need to re-logon later) and smtp server (actual emails do not get delivered).\
Go to https://ethereal.email/messages to see the emails that have been received by the smtp server.



## Some things we will look for in your submission
- Code quality (readability, use of modern syntax...)
- Does the app work as designed (cf. objectives overview)
- App architecture (folder structure, configuration management...)



## tips on usage of glitch

Click `Show` in the header to see your app live. Updates to your code will instantly deploy and update live.
When your app is running, you can access logs and console using the "Tools" button at the bottom left.

Your Project
------------

On the front-end,
- edit `public/client.js`, `public/style.css` and `views/index.html`
- drag in `assets`, like images or music, to add them to your project

On the back-end,
- your app starts at `server.js`
- add frameworks and packages in `package.json`
- safely store app secrets in `.env` (nobody can see this but you and people you invite)
- app uses node8 by default, it is possible to update the version of nodejs used: https://glitch.com/help/node/
