
module.exports = {
	getImgUrl: function (email, callback) {
		var gravtar = require('machinepack-gravatar');
	   //Build the URL of a gravatar image for a particular email address.
		gravtar.getImageUrl({
			emailAddress: email,
			gravatarSize: 56,
			defaultImage: '',
			rating: 'g',
			useHttps: true,
		}).exec(function (err, url) {
			if(err){callback(err, null);}
			callback(null, url);
		});
	}
}