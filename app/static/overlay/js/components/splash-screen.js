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
				On arrive très vite.

			</div>
		</splash-screen>`;
	},
	_active: false,
	_state: {},
	QZinit: function(){
		this.audio = new Audio('../../static/common/music/splash.mp3');
		this.audio.loop = true;
		this.audio.pause();
		this.audio.currentTime = 0;
		this.QZ.info('initialized');
		this.toggleSplash(false);
		this.QZ.onEvent('splash_req', function(eventName, componentName, data){
			this.toggleSplash(data.active);
		});

		/*
		this.QZ.timeout('flip', 3*1000, function(){
			this.toggleSplash(!this._active);
		});
*/
		this.QZ.on('toggle', function(data){
			this.toggleSplash(data.active);
			console.log('got toggle');
		});

		this.QZ.on('state', function(data){
			this._state = data;
			this.updateDisplay();
		});

		this.QZ.send('get-state');
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
		this.updateMusic();
		// TODO start or stop music if splash is active and depending on settings and current playing state

		domElm.querySelector('.splash-text').innerHTML = `${this._state.text}<span class="countdown"></span>`;
		domElm.querySelector('.splash-name').innerHTML = this._state.name;

		if (this._active != this._state.active)
			this.toggleSplash(this._state.active);

		this.updateCountdown();
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

		this.updateCountdown();
		this.QZ.broadcastEvent('splash', {'active': active});
	},
	updateMusic: function(){
		let state = this._state.music;
		var music = this.music;
		const step = 0.001;
		if(state){
			if(music.paused){
				music.volume = 0.0;
				music.play();
				var fadeAudioIn = setInterval(function () {
				if (music.volume < 1.0) {
					try{
						music.volume = Math.min(1, music.volume + step)
					}catch(error){
						music.volume = 1.0;
					}
				}else
					clearInterval(fadeAudioIn);
				}, 1);
			}		
		}else{
			if(!music.paused){
				var fadeAudioOut = setInterval(function () {
					if (music.volume > 0.0) {
							music.volume = Math.max(0, music.volume - step);
					}
					else {
						clearInterval(fadeAudioOut);
						music.pause();
						music.currentTime = 0;
					}
				}, 1);
			}
		}
	},
	updateCountdown: function(){
		this.QZ.clearInterval('refreshCountdown');

		if (this._state.countdown && this._active){
			var date = Date.parse(this._state.countdown);
			if (isNaN(date)) return;

			this.QZ.interval('refreshCountdown', 1000, function(){
				var ms = (date-new Date().getTime());
				if (ms < -1000*60)
					document.querySelector('splash-screen .countdown').innerHTML = '';
				else
					document.querySelector('splash-screen .countdown').innerHTML = '<br>'+Quartz.utils.seconds2hms(Math.max(0, ms/1000));
			});
		}
	}
});



