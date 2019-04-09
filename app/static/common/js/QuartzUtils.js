Quartz.utils = {
	randomInt: function(min, max) {
		min = Math.ceil(min);
		max = Math.floor(max);
		return Math.floor(Math.random() * (max - min + 1)) + min;
	},
	escapeHTML: function(s){
		if (!s) return s;
		return s.replace(/&/gi, '&amp;').replace(/</gi, '&lt;').replace(/>/gi, '&gt;');
	},
	getQueryParameter(name) {
		var result = null,
			tmp = [];
		location.search
			.substr(1)
			.split("&")
			.forEach(function (item) {
			  tmp = item.split("=");
			  if (tmp[0] === name) result = decodeURIComponent(tmp[1]);
			});
		return result;
	},
	form2dict: function(form){
		var dict = {};
		for (var i = 0; i < form.length; i++){
			if (form[i]['name'])
				dict[form[i]['name']] = {
					checked: form[i]['checked'],
					value: form[i]['value']
				};
			}
		return dict;
	},
	seconds2hms: function(secs){
		secs = Math.floor(secs);

		var mins = Math.floor(secs/60);
		secs = secs-mins*60;
		var hrs = Math.floor(mins/60);
		mins = mins-hrs*60;

		return `${hrs>9?hrs:'0'+hrs}:${mins>9?mins:'0'+mins}:${secs>9?secs:'0'+secs}`;
	},
};