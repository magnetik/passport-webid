var passport = require('passport')
  , util = require('util')
  , webid = require('webid');


function Strategy(options, verify) {
	if (typeof options == 'function') {
		verify = options;
		options = {};
  	}
	passport.Strategy.call(this);
	this.name = 'webid';
	this.verify = verify;
}

/**
 * Inherit from `passport.Strategy`.
 */
util.inherits(Strategy, passport.Strategy);

/**
 * Authentificate with the given certificate
 * 
 */
Strategy.prototype.authenticate = function(req) {
	var self = this;
	if (!req.connection.getPeerCertificate()) {
		self.fail();
	}
	else {
		var certificate = req.connection.getPeerCertificate();

		// Verifying with node-webid
		var verifAgent = new webid.VerificationAgent(certificate);
        verifAgent.verify(function (success, result) {
        	if (success) {
        		var foaf = new webid.Foaf(result);
        		self.verify(foaf, function (err, user) {
        			if (err) { return self.error(err); }
        			if (!user) { return self.fail(); }
        			self.success(user);
        		});
        	}
        	else {
        		self.error(result);
        	}
        });
	}
}

/**
 * Expose `Strategy`.
 */ 
module.exports = Strategy;