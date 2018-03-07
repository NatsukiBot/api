# Natsuki API
> API for the Natsuki Discord bot and web interface.

## Documentation
Generated documentation can be found here: https://natsuki.tk/api/docs/
        
## Installation

1. Run `npm i`
2. Rename the `ormconfig.example.json` to `ormconfig.json` and modify the database settings.
3. Rename the `token.example.json` to `token.json` and generate a **secure** secret. Use an online password generator if you don't know how.
3. Run `npm start`

## Usage

In the client application, any request to hit the API will need to include a JWT token generated using the `secret` you made.
Then you can use it as a query string:
```ts
axios.get(`${apiRoute}/users?token=${apiToken}`)
```

