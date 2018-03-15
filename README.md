# Natsuki API

> Realtime API for the Natsuki Discord bot and web interface. Secure, fast, and developer-friendly!

[![Conventional Commits](https://img.shields.io/badge/Conventional%20Commits-1.0.0-yellow.svg)](https://conventionalcommits.org)

## Documentation

Generated documentation can be found here: https://natsuki.tk/api/docs/

## Security

This API does not store any personal information, but it is designed to be as secure as an API that does.

To authenticate requests and only allow trusted client applications to modify data, the API uses JWT.

The API is designed to various attacks (e.g. DOS, Brute-force, etc.) using rate-limiting and the production API is secured behind HTTPS to protect all the things!

### JWT
The API uses JWTs, or JSON Web Tokens, to authenticate requests. They are used to only allow certain applications to use the API.

HTTPS is used by production API and client applications to prevent XSS and CSRF attacks to hijack the token.

JWTs are generated using a secure `secret` which must only be available to the trusted client applications.

This API uses JWTs to authenticate PUT, POST, and DELETE requests. Anyone can make GET requests to this API and use the JSON. Example: https://natsuki.tk/api/users

### Rate Limiting
Although most access to the API is restricted, everyone has access to make GET requests for any data the API stores.

To prevent brute-force attacks, DOS attacks, and to prevent spam, the API uses IP-based request limits.

The current limit is 100 requests per hour. Client applications running on the same IP as the API bypass the limits and have unrestricted access to the API.

The API will cache data, and only request new data at intervals. It is recommended that anyone that uses the API caches the data on their end to reduce the number of requests made.

## Installation

1. Clone the repo: `git clone https://github.com/NatsukiBot/api.git`
2. Run `npm i`
3. Rename the `ormconfig.example.json` to `ormconfig.json` and modify the database settings.
4. Rename the `api.example.json` to `api.json` and generate a **secure** secret. Use an online password generator if you don't know how. Also fill in the `apiServerIp` with the IP of the server the API is running on, which will be used to prevent local requests from using the API request limit.
5. Run `npm start` to start the API on port 5000. You can do `npm run prod` to start the API in production mode on port 3001.

## Usage

In the client application, any request to hit the API will need to include a JWT token generated using the `secret` you made.

There are two ways you can send the token to the API:
 * The token can be included in the request's query string:
```ts
axios.get(`${apiRoute}/users?token=${apiToken}`)
```
 * The token can be included in the request's **Authorization** header using the **Bearer** schema.

To view the available endpoints for the API, view the generated documentation. See **Documentation**.

## Realtime Updates

If you use the API (whether it be my production instance, or your local instance) to make a website/dashboard/etc., you can connect to it with Socket.io to get live updates every time a CREATE, POST, or PUT endpoint is hit.

This is perfect for a Discord bot that updates the API, and you want to use the new data immediately in a web interface without having to send another request to the API. The API will just send you the data automatically.

## Data Policy

All data stored by the API is publicly available and accesible under reasonable limit.

Any person has the ability to view the data, but can not modify, create, or delete data from the server.

Data used from the API can be used to create websites, analytics, metrics, etc.

The API itself complies with the Discord TOS; usage of the data must also comply. 

Rate limits do apply. See **Security > Rate Limiting** for more information.


If you access data from the production API, at https://natsuki.tk/api, you agree that:
 * Your usage of the data will be compliant with the [Discord Developer Terms of Service](https://discordapp.com/developers/docs/legal).
 * You will not use the data for commercial purposes.
 * The application or service that uses this API's data must be provided free of charge and the implementation of the API and/or API data must be open-source.
 * Credit will be given to the Natsuki API project. The project's GitHub and production API URL must be linked where the API data is used.
    - GitHub: https://github.com/NatsukiBot/api
    - Production API: https://natsuki.tk/api
 * You will not exceed the given request rate limit. Request limit packages can be purchased to increase the request rate limits if needed.
    - It is recommended to cache the data you receive to reduce the number of requests made.
    - The API caches most data automatically, but certain request limit packages can be purchased to always get the latest data.

## Contribute

 Any developer is allowed to contribute. Fork the repo, make some changes (e.g. add features, fix bugs, etc.) and make a Pull Request to the **develop** branch.
 If approved, we will merge your changes, and you will be added as a contributor! 
 
 We are open for suggestions, and want the end-product to be awesome. If you have an idea, please share it.

## Support

 If there are any questions or issues, please make a ticket in GitHub and we will respond as soon as we can. https://github.com/NatsukiBot/api/issues

## Donate

 This API costs money to host. If you would like to support the development of the API, and allow the production API to be publicly available, consider becoming a patron on [Patreon](https://www.patreon.com/natsukibot).
