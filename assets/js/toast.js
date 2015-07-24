$(document).ready(function (){  ml.toast.load() });

ml.toast = {
	load: function () {
		ml.toast.show(false);
		ml.toast.new();
	},

	show: function (configs) {
		if(!configs) { return false; }
		
		$.toast({
	 			icon: configs.icon,
			    heading: configs.heading,
			    text: configs.text,
			    position: 'top-right',
			    showHideTransition: 'plain',
			    stack: 7,
			});
		return true;
	},

	new: function (icon, header, content) {
		var toast = {};
		toast.icon = icon;
		toast.heading = header;
		toast.text = content;
		return toast;
	}
};