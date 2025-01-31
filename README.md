# Northcoders News (NC-News) API

SUMMARY
NC-News is a web app inspired by Reddit, providing a platform where users can engage in discussions on a wide range of topics, with features for commenting on articles and voting on content.

CLONING REPO
To clone this repo, run in terminal:
'git clone https://github.com/JohnPflug/be-nc-news.git'

INSTALL DEPENDENCIES
To install the necessary dependencies, run:
'npm install'

MINIMUM REQUIREMENTS
To run this project, you will need to have the following minimum versions of the required software:
- Node.js: v23.2.0 or later
- PostgreSQL: 14.13 or later

These versions ensure compatibility and stability with the project's dependencies and configuration.

RUN TESTS
To run Jest tests, execute:
'npm run test'

DATABASES
To connect to the test and development databases, create two .env files:
'.env.development'
'.env.test'

In each of these files, set the environment variable PGDATABASE to specify the PostgreSQL database name. For example:
PGDATABASE=development_database_name
PGDATABASE=test_database_name

To set up and seed the database, run:
'npm run setup-dbs'
'npm run seed'

HOSTED VERSION LINK
The link to the hosted version of the NC-News web app:
https://nc-news-njb6.onrender.com


This portfolio project was created as part of a Digital Skills Bootcamp in Software Engineering provided by [Northcoders](https://northcoders.com/)