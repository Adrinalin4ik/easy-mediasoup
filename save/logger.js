import debug from 'debug';

const APP_NAME = 'mediasoup-demo';

export default class Logger
{
	constructor(prefix)
	{	

		if (prefix)
		{
			this._debug = debug(`${APP_NAME}:${prefix}`);
			this._warn = debug(`${APP_NAME}:WARN:${prefix}`);
			this._error = debug(`${APP_NAME}:ERROR:${prefix}`);
		}
		else
		{
			this._debug = debug(APP_NAME);
			this._warn = debug(`${APP_NAME}:WARN`);
			this._error = debug(`${APP_NAME}:ERROR`);
		}

		/* eslint-disable no-console */
		// console.info.bind(this._debug.log);
		// console.warn.bind(this._warn.log);
		// console.error.bind(this._error.log);
		/* eslint-enable no-console */
		this._debug.enabled = true
	}

	get debug()
	{
		return this._debug;
	}

	get warn()
	{
		return this._warn;
	}

	get error()
	{
		return this._error;
	}
}
