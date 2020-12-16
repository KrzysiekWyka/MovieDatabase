# Movie database

## Stack

* [Nest](https://github.com/nestjs/nest)
* [MongoDB](https://www.mongodb.com/)

## TODO

* Pagination to `GET /movies` action
* Pino logger
* More tests!!! (e2e & smoke)

## Set up the app

1. Install packages `$ npm i`
2. Start docker-compose (`$ docker-comose up -d` or `$ docker-compose start`)
3. Make `.env` file in root dir and copy content from `.env.example` (`$ cp .env.example .env`)
4. Insert sample user (Basic Thomas and Premium Jim) using `$ npm run loadSeeds`

## Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Test

```bash
# unit tests
$ npm run test
```
