Quartz.utils = {
	randomInt: function(min, max) {
		min = Math.ceil(min);
		max = Math.floor(max);
		return Math.floor(Math.random() * (max - min + 1)) + min;
	},
	escapeHTML: function(s){
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
	}
};