# Natsuki API
> API for the Natsuki Discord bot and web interface.
        
## Installation

1. Run `npm i`
2. Rename the `ormconfig.example.json` to `ormconfig.json` and modify the database settings.
3. Rename the `token.example.json` to `token.json` and generate a **secure** token. Use an online password generator if you don't know how.
3. Run `npm start`

## Usage

In the client application, any request to hit the database will need to include a `token` query string which includes the value of the `secret` you generated earlier.

Example using `axios`:
```ts
axios.post(`${apiRoute}/users?token=${apiToken}`, user).catch(Logger.error)
```
