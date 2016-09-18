# Raw Reader

## Setup
Get the code and run the app once to register the protocol handlers.
```
$ git clone git@github.com:justinmchase/raw-reader.git
$ cd raw-reader
$ npm install
$ npm run app
```

Next in chrome go to chrome://extensions and enable Developer mode. Press the `[Load unpacked extension...]` button and point it at the `./lib/plugin` directory.

You can now right click on links and see the "Send to Raw Reader" menu item, click that to open the given url through the raw reader.
