Quartz.registerComponent('pp-logo', {
	QZDOM: function(){
		return `<pp-logo></pp-logo>`;
	},
	QZinit: function(){
		this.QZ.onEvent('splash', function(eventName, componentName, data){
			if (data.active){
				document.querySelector('pp-logo').classList.add('splash');
			} else {
				document.querySelector('pp-logo').classList.remove('splash');
			}
		});

		this.QZ.info('initialized');
	}
});