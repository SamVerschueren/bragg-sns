'use strict';
module.exports = opts => {
	opts = opts || {};

	return ctx => {
		if (!ctx.path && ctx.req.Records && ctx.req.Records.length > 0 && ctx.req.Records[0].EventSource === 'aws:sns') {
			const first = ctx.req.Records[0];
			const topic = first.Sns.TopicArn.split(':').pop();
			const messages = ctx.req.Records.map(record => {
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
			Object.defineProperty(ctx, 'path', {enumerable: true, value: `sns:${(opts[topic] || topic)}`});
			Object.defineProperty(ctx, 'method', {enumerable: true, value: 'post'});
		}
	};
};
