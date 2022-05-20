## Setting up dev env

1.  Get env vars by creating https://osu.ppy.sh/home/account/edit oAuth app, with callback url
    `http://localhost/api/oauth/callback`

1.  Create docker-compose.override.yml and fill in osuApi env vars

1.  `docker-compose build`
1.  `docker-compose -f docker-compose.nginx.yml -f docker-compose.yml -f docker-compose.override.yml up backend nginx`
1.  cd frontend && npm run dev

1.  go to localhost:3000 (you can also use localhost without ports, but it breaks HMR)

1.  If you click on login button you should be authorized

## Possible errors

1. if you get ERR_SOCKET_RESET during docker build try changing node:16 to node:14 in Dockerfile
