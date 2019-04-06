Quartz.registerComponent('donations-gauge', {
	QZDOM: function(){
		return `<donations-wrap>
			<donations-title></donations-title>
			<donations-gauge-wrapper-wrap>
				<donations-gauge-wrapper>
					<donations-gauge></donations-gauge>
				</donations-gauge-wrapper>
			</donations-gauge-wrapper-wrap>
			<donations-count> € <span>/ €</span></donations-count>
			<donations-link></donations-link>
		</donations-wrap>`;
	},
	QZinit: function(){
		this._state = {};

		this.updateDisplay();

		this.QZ.on('state', function(data){
			this._state = data;
			this.updateDisplay();
			this.updateGauge();
		});


		this.QZ.interval('refresh', 120*1000, function(){
			this.updateGauge();
		});

		this.QZ.send('get-state');

		this.QZ.info('initialized');

		this.QZ.onEvent('splash', function(eventName, componentName, data){
			if (componentName == 'splash-screen'){
				if (data.active){
					document.querySelector('donations-wrap').classList.add('splash');
				} else {
					document.querySelector('donations-wrap').classList.remove('splash');
				}
			}
		});
	},
	updateDisplay: function(){
		document.querySelector('donations-wrap donations-title').innerHTML = this._state.title;
		document.querySelector('donations-wrap donations-link').innerHTML = this._state.link;
		document.querySelector('donations-wrap').style.display = this._state.active ? 'block':'none';
	},
	updateGauge: async function(){
		if (!this._state.url || !this._state.active)
			return;

		var that = this;
		var response = await fetch(this._state.url);
		var data = await response.json();

		var amount = data.gau_amount;
		var obj = '&infin;';
		var width = 100;
		if (this._state.objectives){
			for (var i=0;i<this._state.objectives[i];i++){
				var o = this._state.objectives[i];
				if (o >= amount){
					obj = o;
					width = (amount/o)*100;
					break;
				}
			}
		}

		document.querySelector('donations-wrap donations-gauge').style.width = width+'%';
		document.querySelector('donations-wrap donations-count').innerHTML = `${amount.toLocaleString('fr-FR')} € <span>/ ${obj.toLocaleString('fr-FR')} €</span>`;
	},
});