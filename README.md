# paper-pi

This project generates a bitmap image displaying relevant daily infomation such as news, weather and a word of the day.

This image is intended for display on a 7.5" e-paper Screen.

More details can be found here: [E-Ink Display for Daily News, Weather and More](https://www.hackster.io/lukehaas/e-ink-display-for-daily-news-weather-and-more-3dd7b1)

![image](https://raw.githubusercontent.com/lukehaas/paper-pi/master/docs/paper-pi.jpg)

## Setup

To run this project, you'll first need to get API keys from the following places:
- newsapi.org
- twitter.com
- darksky.net
- oxforddictionaries.com

Once you have these, create a `.env` file and add the keys to it in the following format:

```
;Darksky
darksky_key=your_key

;Twitter
twitter_consumer_key=your_consumer_key
twitter_consumer_secret=your_consumer_secret
twitter_access_token=your_access_token
twitter_access_token_secret=your_token_secret

;Oxford Dictionaries
dictionary_app_id=your_app_id
dictionary_app_key=your_app_key

;News API
news_key=your_key

;Mongo
mongo_uri=mongodb://localhost/paper-pi

```

This project uses node-canvas which has some of it's own setup steps that can be found here: https://www.npmjs.com/package/canvas

The Node version used for this project is defined in the `.nvmrc` file.

Building requires MongoDB to be running on the host.

Once everything is in place, run: `npm i`

If everything installed correctly, you should now be able to run `npm run build` and have the bmp file generated in the build directory.
