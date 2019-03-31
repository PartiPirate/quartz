Quartz.registerComponent('fancy-anim', {
	QZDOM: function(){
		var html = '';
		for (var i=0;i<40;i++){
			html += '<div style="'
			html += 'animation-duration: '+Quartz.utils.randomInt(18,36)+'s; ';
			html += 'animation-delay: '+Quartz.utils.randomInt(-17,0)+'s; ';
			html += 'margin-left: '+(Quartz.utils.randomInt(0,10)/10)+'vw; ';
			if (Math.random() > 0.5){
				html += 'animation-direction: reverse;';
			}
			html += '"></div>';
		}

		return `<fancy-anim>${html}</fancy-anim>`;
	},
	QZinit: function(){
		this.QZ.onEvent('splash', function(eventName, componentName, data){
			if (componentName == 'splash-screen'){
				if (data.active){
					document.querySelector('fancy-anim').classList.add('splash');
				} else {
					document.querySelector('fancy-anim').classList.remove('splash');
				}
			}
		});


		this.QZ.info('initialized');
	}
});