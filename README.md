# moneymoney_server

### #System requirements
  - [NodeJS](https://nodejs.org/en/)
  - [MongoDB](https://www.mongodb.com)
  
### #Development
Install package `nodemon`.
```sh
$ npm install -g nodemon
```
  - Config `PORT`, `DB_URI` in `.env` file.
  - Config email in `./app/routes/authentication.js` file.  

Run this command.
```sh
$ nodemon server.js
```

### #API

**Note:** For APIs that require account authentication, you must add Headers Authorization: "JWT <token_string>"

API | Authorization | Method | Params
----|-------------|--------|-------
`/authentication/sign_in`|**NO**|**POST**|`email`, `password`|String, String
`/authentication/register`|**NO**|**POST**|`email`, `password`, `name`, `avatar`
`/authentication/forgot`|**NO**|**POST**|`email`
`/authentication/reset/<session>`|**NO**|**POST**|`newPassword`, `confirmPassword`
`/user/info`|**YES**|**GET**|`id`
`/user/info`|**YES**|**PATCH**|`id`, `name`, `avatar`
`/card/create`|**YES**|**POST**|`id`, `type`, `balance`, `name`, `exp`, `number`, `cvv`
`/cards`|**YES**|**GET**|`id`
`/card/edit`|**YES**|**PATCH**|`id`, `id_user`, `type`, `balance`, `name`, `exp`, `number`, `cvv`
`/card/delete`|**YES**|**DELETE**|`id_user`, `id`
`/record/create`|**YES**|**POST**|`datetime`, `category`, `card`, `value`
`/records`|**YES**|**GET**|`id`
`/records/<mode>/<category>`|**YES**|**GET**|`id`
`/record/delete`|**YES**|**DELETE**|`id`
`/record/edit`|**YES**|**PATCH**|`id`, `datetime`, `category`, `card`, `value`
`/note/create`|**YES**|**POST**|`id`, `title`, `content`
`/notes`|**YES**|**GET**|`id`
`/note/delete`|**YES**|**DELETE**|`id`
`/note/edit`|**YES**|**PATCH**|`id`, `title`, `content`

### #Screenshot
![ScreenShot2017-07-28at1.18.46AM.png](http://sv1.upsieutoc.com/2017/07/28/ScreenShot2017-07-28at1.18.46AM.png)   
![ScreenShot2017-07-28at5.16.58PM.png](http://sv1.upsieutoc.com/2017/07/28/ScreenShot2017-07-28at5.16.58PM.png)  
![ScreenShot2017-07-28at5.17.04PM.png](http://sv1.upsieutoc.com/2017/07/28/ScreenShot2017-07-28at5.17.04PM.png)

## License
[MIT](https://github.com/htdangkhoa/moneymoney_server/blob/master/LICENSE)
