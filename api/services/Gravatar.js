
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
	},

	getImage: function(url) {
		var defaut = '/images/default_avatar.jpg';
		if(url === undefined) {
		return "<div class='circle-mask'><img id='canvas' src='"+defaut+"' alt='Smiley face' class='circle' width='56' height='56'></image></div>";
		}
		return "<div class='circle-mask'><img id='canvas' src='"+url+"' alt='Smiley face' class='circle' width='56' height='56'></image></div>";
		
	}
}