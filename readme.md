# bragg-sns [![Build Status](https://travis-ci.org/SamVerschueren/bragg-sns.svg?branch=master)](https://travis-ci.org/SamVerschueren/bragg-sns)

> SNS middleware for [bragg](https://github.com/SamVerschueren/bragg).

This little piece of middleware makes it possible to handle SNS events as if they where normal requests.

## Install

```
$ npm install --save bragg-sns
```


## Usage

```js
const app = require('bragg')();
const router = require('bragg-router')();
const sns = require('bragg-sns');

// Listen for events in the `TopicName` topic
router.post('sns:TopicName', ctx => {
    ctx.body = ctx.request.body;
});

app.use(sns());
app.use(router.routes());

exports.handler = app.listen();
```

The `sns:` prefix is attached by this module and is followed by the name of the topic that originated the event. The message of the event is provided in the `body` property of the `request` object.

### Mapping

It's also possible to provide a mapping object or function to transform one topic to another.

With an object, it will look like this.

```js
// Data on the `TopicNameDev` topic will be posted on the `sns:TopicName` handler
app.use(sns({TopicNameDev: 'TopicName'}));
```

With a function, it looks like this.

```js
// Data on the `TopicNameDev` topic will be posted on the `sns:TopicName` handler
app.use(sns(topic => topic.replace(/Dev$/, '')));
```


## API

### sns([map])

#### map

Type: `object` `Function`

Map a topic name to another name with either a map or a function.


## License

MIT © [Sam Verschueren](https://github.com/SamVerschueren)
