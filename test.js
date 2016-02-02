import test from 'ava';
import objectAssign from 'object-assign';
import m from './';

const fixture1 = {req: {Records: []}};
const fixture2 = {req: {Records: [{Sns: {TopicArn: 'foo'}}, {Sns: {TopicArn: 'bar'}}]}};
const fixture3 = {req: {Records: [{Sns: {TopicArn: 'foo', Message: 'bar'}}]}};
const fixture4 = {req: {Records: [{Sns: {TopicArn: 'foo', Message: 'foo'}}, {Sns: {TopicArn: 'foo', Message: 'bar'}}]}};
const fixture5 = {req: {Records: [{Sns: {TopicArn: 'foo', Message: '{\"foo\":\"bar\"}'}}]}};

function fn(t, event, opts) {
	const ctx = objectAssign({}, event, t.context.ctx);

	m(opts)(ctx);

	return ctx;
}

test.beforeEach(t => {
	t.context.ctx = {
		request: {},
		throw: (code, msg) => {
			throw new Error(`${code} - ${msg}`);
		}
	};
});

test('error', t => {
	t.throws(fn.bind(undefined, t, fixture1), '400 - Could not process SNS event');
	t.throws(fn.bind(undefined, t, fixture2), '400 - Can not process different topics');
});

test('result', t => {
	t.same(fn(t, fixture3).request, {body: 'bar'});
	t.same(fn(t, fixture4).request, {body: ['foo', 'bar']});
	t.same(fn(t, fixture5).request, {body: {foo: 'bar'}});
});

test('path', t => {
	t.same(fn(t, fixture3).path, 'sns:foo');
	t.same(fn(t, fixture3, {foo: 'bar'}).path, 'sns:bar');
});

test('method', t => {
	t.same(fn(t, fixture3).method, 'post');
});
