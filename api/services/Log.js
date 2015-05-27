module.exports = {
	info: function(message) {
		sails.log.info(message);
	},

	warn: function(message) {
		sails.log.warn(message);
	},

	error: function(message) {
		sails.log.error(message);
	},

	debug: function(message) {
		sails.log(message);
	},

	json: function(object_json) {
		sails.log.info("JSON OBJECT: "+JSON.stringify(object_json));
	}
}