## Setting up dev env

1) Create docker-compose.override.yml and fill in osuApi env vars
1.1) Get env vars by creating https://osu.ppy.sh/home/account/edit oAuth app, with callback url
`http://localhost:3001/api/oauth/callback`

2) `docker-compose build`
3) `docker-compose -f docker-compose.nginx.yml -f docker-compose.override.yml up backend`
4) cd frontend && npm run dev

5) Only use firefox browser for dev 
6) Go to http://localhost:3001/api/OAuth/auth and authenticate your app
7) If you now go back to localhost:3000 you should be authorized


## Possible errors

1) if you get ERR_SOCKET_RESET during docker build try changing node:16 to node:14 in Dockerfile