# declutter-reddit
App to export/search saved or hidden reddit links

# Development
1. Install nvm if you don't have it already 
    - https://github.com/nvm-sh/nvm/blob/master/README.md
2. Run `nvm use`
3. Run `npm install`
4. Add `lib/constants/oauth.js` file with proper credentials/constants for your OAuth2 reddit app
    - A template (`oauth_template.js`) is included with this code base. To use it simply add the credentials and rename it to `oauth.js` 
    - For more information check https://github.com/reddit-archive/reddit/wiki/OAuth2
5. Run `docker-compose up`
