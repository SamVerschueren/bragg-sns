'use strict';
module.exports = function (opts) {
	opts = opts || {};

	return function (ctx) {
		if (!ctx.path && ctx.req.Records) {
			if (ctx.req.Records.length === 0) {
				ctx.throw(400, 'Could not process SNS event');
			}

			var record = ctx.req.Records[0];
			var topic = record.Sns.TopicArn.split(':').pop();
			var messages = ctx.req.Records.map(function (record) {
				if (topic !== record.Sns.TopicArn.split(':').pop()) {
					ctx.throw(400, 'Can not process different topics');
				}

				try {
					return JSON.parse(record.Sns.Message);
				} catch (err) {
					return record.Sns.Message;
				}
			});

			ctx.request.body = messages.length > 1 ? messages : messages[0];

			Object.defineProperty(ctx, 'path', {enumerable: true, value: 'sns:' + (opts[topic] || topic)});
			Object.defineProperty(ctx, 'method', {enumerable: true, value: 'post'});
		}
	};
};
