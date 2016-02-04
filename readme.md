# bragg-sns [![Build Status](https://travis-ci.org/SamVerschueren/bragg-sns.svg?branch=master)](https://travis-ci.org/SamVerschueren/bragg-sns)

> SNS middleware for [bragg](https://github.com/SamVerschueren/bragg).

This little piece of middleware makes it possible to handle SNS events as if they where normal requests.

## Install

```
$ npm install --save bragg-sns
```


## Usage

```js
var app = require('bragg')();
var router = require('bragg-router')();
var sns = require('bragg-sns');

// Listen for events in the `TopicName` and `TopicNameDev` topic
router.post('sns:TopicName', function (ctx) {
    ctx.body = ctx.request.body;
});

app.use(sns({TopicNameDev: 'TopicName'}));
app.use(router.routes());

exports.handler = app.listen();
```

The `sns:` prefix is attached by this module and is followed by the name of the topic that originated the event. The message of the event is
provided in the `body` property of the `request` object.


## API

### sns([options])

#### options

Type: `object`

Map a topic name to another name.


## License

MIT © [Sam Verschueren](https://github.com/SamVerschueren)
