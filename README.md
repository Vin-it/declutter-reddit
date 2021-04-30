# declutter-reddit
App to export/search saved or hidden reddit links

# Development
1. Install nvm if you don't have it already 
    - https://github.com/nvm-sh/nvm/blob/master/README.md
2. Run `nvm use`
3. Run `npm install`
4. You will have to create a `.env` file and set three variables (***DO NOT PUSH THESE VALUES TO YOUR REPOSITORY***)
    1. `REDDIT_APP_CLIENT_ID=<value>`
    2. `REDDIT_APP_CLIENT_SECRET=<value>`
    3. `REDDIT_APP_REDIRECT_URI=<value>`
    - For more information check https://github.com/reddit-archive/reddit/wiki/OAuth2
5. Run `docker compose up` (not a typo - Docker Compose is now in the Docker CLI)
