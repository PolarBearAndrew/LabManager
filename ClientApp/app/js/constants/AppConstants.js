/**
 * TodoConstants
 */

var keyMirror = require('react/lib/keyMirror');

module.exports = keyMirror({

	// SOURCE_VIEW_ACTION: null,
	// SOURCE_SERVER_ACTION: null,
	// SOURCE_ROUTER_ACTION: null,

  	CHANGE_EVENT: null,

    TODO_LOAD: null,
  	TODO_CREATE: null,
  	TODO_REMOVE: null,
  	TODO_UPDATE: null,
  	TODO_SELECT: null,

	JUST_REFRESH: null,
	SWITCH_LOGINBOX: null,
	LOGIN_FAIL: null,
	CHANGE_INPUTID: null,

	//for socket
	SOCKET_CREATE: null,
	SOCKET_UPDATE: null,
	SOCKET_CHECKOUT: null,
	SOCKET_REMOVE: null,

  	noop: null
});

