## Setting up dev env

1.  Create docker-compose.override.yml and fill in osuApi env vars

1.  Get env vars by creating https://osu.ppy.sh/home/account/edit oAuth app, with callback url
    `http://localhost:3001/api/oauth/callback`



1.  `docker-compose build`
1.  `docker-compose -f docker-compose.nginx.yml -f docker-compose.override.yml up backend`
1.  cd frontend && npm run dev

1.  ~~Go to http://localhost:3001/api/OAuth/auth and authenticate your app~~
1. In fact you can now straight up auth from the website. Try pressing the temp login button!!
1.  If you now go back to localhost:3000 you should be authorized

## Possible errors

1. if you get ERR_SOCKET_RESET during docker build try changing node:16 to node:14 in Dockerfile
