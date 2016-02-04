'use strict';
module.exports = function (opts) {
	opts = opts || {};

	return function (ctx) {
		if (!ctx.path && ctx.req.Records && ctx.req.Records.length > 0 && ctx.req.Records[0].EventSource === 'aws:sns') {
			var first = ctx.req.Records[0];
			var topic = first.Sns.TopicArn.split(':').pop();
			var messages = ctx.req.Records.map(function (record) {
				if (first.Sns.TopicArn !== record.Sns.TopicArn) {
					ctx.throw(400, 'Can not process different topics');
				}

				try {
					return JSON.parse(record.Sns.Message);
				} catch (err) {
					return record.Sns.Message;
				}
			});

			ctx.request.body = messages;
			Object.defineProperty(ctx, 'path', {enumerable: true, value: 'sns:' + (opts[topic] || topic)});
			Object.defineProperty(ctx, 'method', {enumerable: true, value: 'post'});
		}
	};
};
