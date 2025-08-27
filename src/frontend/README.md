This is the frontend of the plant waterer app Water.me.

## Getting Started

This is designed to be run as a container as part of the full application. It would normally be started via the docker compose in the root directory `/`, however for testing during development it is useful to be able to run the frontend separately and point the frontend at the api container via the host machine using docker port forwarding. 

Accordingly, you can run the docker compose to generate the necessry containers (database and api) and then run this fronend development server separately as outlined below.

> It's important to remember that in order to work properly, **both** the database **and** api containers must be running.

First setup your local environment variables by creating a file called `.env.local` in the `/src/frontend` directory and adding the following line:

`API_ENDPOINT=<your api endpoint:port>`

e.g.

```c#
// file: /src/frontend/.env.local
API_ENDPOINT='http://localhost:8000'
```


Then, from the same directory, run the development server:

```bash
npx next dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

