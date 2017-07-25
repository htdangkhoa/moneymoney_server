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
`/register` | To register, you must enter email, password and name. | **POST** | `email`, `password`, `name` | String, String, String
`/sign_in` | To sign in, you must enter email and password. | **POST** | `email`, `password` | String, String
`/sign_out` | To sign out, you don't need to post any data. | **POST** | |
`/v1/card/create` | To create card,  you must **sign in** and enter type, balance, name, expiration, card number, cvv and email. | **POST** | `type`, `balance`, `name`, `exp`, `number`, `cvv`, `email` | String, Number, String, Number, Number, Number, String
`/v1/cards` | To get all info of user's card, you must **sign in** and enter id. | **GET** | `id` | String
`/v1/record/create` | To create new record, you must **sign in** and enter datetime (timestamp), category, card's id and value. | **POST** | `datetime`, `category`, `card`, `value` | Number, String, String, Number
`/v1/records` | To get total of each category, you must **sign in** and enter card's id. | **GET** | `id` | String
`/v1/records` | To get record by category, you must **sign in** and enter card's id and category. | **GET** | `id`, `category` | String, String
`/v1/record/delete` | To delete a record, you must **sign in** and enter record's id. | **DELETE** | `id` | String
