# declutter-reddit
App to export/search saved or hidden reddit links

# CONTRIBUTING

### Development setup

1. Install nvm if you don't have it already 
    - https://github.com/nvm-sh/nvm/blob/master/README.md
2. Run `nvm use`
3. Run `npm install`
4. You will have to create a `.env` file and set four variables (***DO NOT PUSH THESE VALUES TO YOUR REPOSITORY***)
    - Reddit App Credentials
      - `REDDIT_APP_CLIENT_ID=<value>`
      - `REDDIT_APP_CLIENT_SECRET=<value>`
      - `REDDIT_APP_REDIRECT_URI=<value>`
        - For more information check https://github.com/reddit-archive/reddit/wiki/OAuth2

    - `SESS_SECRET=<value>`
    
5. Run `npm run react-app:watch`  
6. Run `docker compose up` (not a typo - Docker Compose is now in the Docker CLI)
