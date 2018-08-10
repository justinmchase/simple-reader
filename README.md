# Simple Reader
This tool is a desktop application which allows you to read the summaries of website content without any distractions. It comes with a corresponding chrome plugin which allows you to Right Click on a link and "Send to Simple Reader".

The reader prominently displays article metadata if available and summary statistics, such as an estimate of the time you might have saved by reading the summary.

## Setup
Get the code and run the app once to register the protocol handlers.
```
$ git clone git@github.com:justinmchase/simple-reader.git
$ cd simple-reader
$ npm install
$ npm run app
```

Next in chrome go to chrome://extensions and enable Developer mode. Press the `[Load unpacked extension...]` button and point it at the `simple-reader/lib/plugin` directory.

You can now right click on links and see the "Send to Simple Reader" menu item, click that to open the given url in the simple reader.
