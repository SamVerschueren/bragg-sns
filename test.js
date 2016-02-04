import test from 'ava';
import objectAssign from 'object-assign';
import m from './';

import * as fixture1 from './fixtures/multi-source.json';
import * as fixture2 from './fixtures/dynamodb-event.json';
import * as fixture3 from './fixtures/event.json';
import * as fixture4 from './fixtures/json-event.json';

function fn(t, event, opts) {
	const ctx = objectAssign({}, {req: event}, t.context.ctx);
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
	t.throws(fn.bind(undefined, t, fixture1), '400 - Can not process different topics');
});

test('do nothing if it\'s not a SNS event', t => {
	const result = fn(t, fixture2);
	t.notOk(result.request.body);
	t.notOk(result.path);
	t.notOk(result.method);
});

test('result', t => {
	const result = fn(t, fixture3);
	t.is(result.path, 'sns:EXAMPLE');
	t.is(result.method, 'post');
	t.same(result.request.body, ['Hello from SNS!']);
});

test('json result', t => {
	const result = fn(t, fixture4);
	t.same(result.request.body, [{foo: 'bar'}, 'Foo Bar']);
});

test('path mapping', t => {
	t.is(fn(t, fixture3, {EXAMPLE: 'foo'}).path, 'sns:foo');
});
