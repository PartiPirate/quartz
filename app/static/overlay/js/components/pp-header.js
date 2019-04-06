Quartz.registerComponent('pp-header', {
	QZDOM: function(){
		return `<header-wrap>
			<header-topic></header-topic>
			<header-date></header-date>
		</header-wrap>`;
	},
	QZinit: function(){
		this._state = {};

		this.QZ.on('state', function(data){
			this._state = data;
			this.updateDisplay();
		});
		this.QZ.send('get-state');

		this.QZ.onEvent('splash', function(eventName, componentName, data){
			if (data.active){
				document.querySelector('header-wrap').classList.add('splash');
			} else {
				document.querySelector('header-wrap').classList.remove('splash');
			}
		});

		this.QZ.info('initialized');
	},
	updateDisplay: function(){
		document.querySelector('header-wrap header-topic').innerHTML = this._state.topic;
		if (!this._state.showDate)
			document.querySelector('header-wrap header-date').innerHTML = '';
		else {
			var d = new Date();

			function monthIntToFull(month){
				switch (month){
					case 0: return 'Janvier';
					case 1: return 'Février';
					case 2: return 'Mars';
					case 3: return 'Avril';
					case 4: return 'Mai';
					case 5: return 'Juin';
					case 6: return 'Juillet';
					case 7: return 'Août';
					case 8: return 'Septembre';
					case 9: return 'Octobre';
					case 10: return 'Novembre';
					case 11: return 'Décembre';
				}
			}

			document.querySelector('header-wrap header-date').innerHTML = d.getDate() + ' ' + monthIntToFull(d.getMonth()) + ' ' + d.getFullYear();
		}
	}
});