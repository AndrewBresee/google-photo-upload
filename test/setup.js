var jsdom = require('jsdom');

global.document = jsdom.jsdom('<!doctype html><html><body></body></html>');
global.window = document.defaultView;
global.navigator = {userAgent: 'node.js'};
global.localStorage = {getItem(){ return null; }};
global.gapi = { signin2: { render: () => null }, load: () => null };
global.gapi.auth2 = { init: () => null };
