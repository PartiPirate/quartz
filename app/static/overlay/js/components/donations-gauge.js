Quartz.registerComponent('donations-gauge', {
	QZDOM: function(){
		return `<donations-wrap>
			<donations-title>Campagne de dons pour les élections</donations-title>
			<donations-gauge-wrapper-wrap>
				<donations-gauge-wrapper>
					<donations-gauge></donations-gauge>
				</donations-gauge-wrapper>
			</donations-gauge-wrapper-wrap>
			<donations-count>3 680 € <span>/ 27 000 €</span></donations-count>
			<donations-link>europeennes.partipirate.org</donations-link>
		</donations-wrap>`;
	},
	QZinit: function(){
		this._settings = {
			url: 'https://don.partipirate.org/api/getGauge.php?from_date=2017-01-01&to_date=2020-01-01&amount_path=project%3EadditionalDonation&search=%22project%22:%7B%22code%22:%22BUD_ELECTION_2019%22',
			objectives: [
				27000,
				100000
			],
			title: 'Campagne de dons pour les élections',
			link: 'europeennes.partipirate.org'
		};

		this.updateDisplay();


		this.QZ.on('settings', function(data){
			this._settings = data;
			this.updateDisplay();
			this.updateGauge();
		});


		this.QZ.interval('refresh', 120*1000, function(){
			this.updateGauge();
		});

		this.QZ.send('get-settings');

		this.QZ.info('initialized');

		this.QZ.onEvent('splash', function(eventName, componentName, data){
			if (componentName == 'splash-screen'){
				if (data.active){
					document.querySelector('donations-wrap').classList.add('splash');
				} else {
					document.querySelector('donations-wrap').classList.remove('splash');
				}
				this.QZ.log('received ',eventName,' from ',componentName, ' with ',data);
			}
		});

	},
	updateDisplay: function(){
		document.querySelector('donations-wrap donations-title').innerHTML = this._settings.title;
		document.querySelector('donations-wrap donations-link').innerHTML = this._settings.link;
	},
	updateGauge: async function(){
		if (!this._settings.url)
			return;

		var that = this;
		var response = await fetch(this._settings.url);
		var data = await response.json();

		var amount = data.gau_amount;
		var obj = '&infin;';
		var width = 100;
		if (this._settings.objectives){
			for (var i=0;i<this._settings.objectives[i];i++){
				var o = this._settings.objectives[i];
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