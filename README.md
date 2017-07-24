# moneymoney_server

### #System requirements
  - [NodeJS](https://nodejs.org/en/)
  - [MongoDB](https://www.mongodb.com)
  
### #Development
Install package `nodemon`.
```sh
npm install -g nodemon
```
Config `HOST`, `PORT`, `DB_URI` in `.env` file and run this command.
```sh
nodemon server.js
```

### #API
API | Description | Method | Params | Types
----|-------------|--------|-------|-------
`/register` | | POST | `email`, `password` | String, String
`/sign_in` | | POST | `email`, `password` | String, String
`/sign_out` | | POST | |
`/v1/create_card` | | POST | `type`, `balance`, `name`, `exp`, `number`, `cvv`, `email` | String, String, String, String, String, String, String
