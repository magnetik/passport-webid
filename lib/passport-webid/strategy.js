var passport = require('passport'),
		util = require('util');


function Strategy(options, verify) {
}

/**
 * Inherit from `passport.Strategy`.
 */
util.inherits(Strategy, passport.Strategy);