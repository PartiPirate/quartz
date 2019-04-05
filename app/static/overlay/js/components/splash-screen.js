Quartz.registerComponent('splash-screen', {
	QZDOM: function(){
		return `<splash-screen class="translucid">
			<div class="bg"></div>

			<div class="music-wrapper">
				<div class="equalizer-icon"><div></div><div></div><div></div><div></div></div>
				<span class="song">WikiLeaks and the Need for Free Speech</span> <span class="artist">&ndash; Dan Bull</span>
			</div>

			<div class="splash-name">
				<span class="thin">parti</span><span class="bold">pirate</span><span class="thin">.org</span>
			</div>

			<div class="splash-text">
				On arrive très vite.<br>
				00:00:00
			</div>
		</splash-screen>`;
	},
	_active: false,
	_state: {
		'translucid': true,
		'music': true,
		'text': 'On arrive très vite.',
		'countdown': 0, //todo date
		'name': '<span class="thin">parti</span><span class="bold">pirate</span><span class="thin">.org</span>'
	},
	QZinit: function(){
		this.QZ.info('initialized');

		this.toggleSplash(false);
		/*
		this.QZ.timeout('flip', 3*1000, function(){
			this.toggleSplash(!this._active);
		});
*/
		this.QZ.on('state', function(data){
			this._state = data;
			this.updateDisplay();
		});

		this.QZ.send('get-state');
		this.updateDisplay();
	},
	updateDisplay: function(){
		var domElm = document.querySelector('splash-screen');
		if (this._state.translucid)
			domElm.classList.add('translucid');
		else
			domElm.classList.remove('translucid');

		if (this._state.music){
			domElm.querySelector('.music-wrapper').classList.add('visible');
		}
		else {
			domElm.querySelector('.music-wrapper').classList.remove('visible');
		}
		// TODO start or stop music if splash is active and depending on settings and current playing state

		domElm.querySelector('.splash-text').innerHTML = `${this._state.text}<br>00:00:00`;
		domElm.querySelector('.splash-name').innerHTML = this._state.name;

		this.toggleSplash(this._state.active);
	},
	toggleSplash: function(active){
		this._active = active;

		if (active){
			document.querySelector('splash-screen').style.display = 'block';
			this.QZ.timeout('css-display', 200, function(){
				document.querySelector('splash-screen').classList.add('active');
			});
		} else {
			document.querySelector('splash-screen').classList.remove('active');
			this.QZ.timeout('css-display', 1000, function(){
				document.querySelector('splash-screen').style.display = 'none';
			});
		}

		this.QZ.broadcastEvent('splash', {'active': active});
	},
});



/*


*/