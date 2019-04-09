Quartz.registerComponent('video-embed', {
	QZDOM: function(){
		return `<video-embed></video-embed>`;
	},
	QZinit: function(){
		this.QZ.info('initialized');

		this.QZ.on('show', function(data){
			this.show(data.url, data.options);
		});

		this.QZ.on('hide', function(){
			this.hide();
		});

		this.QZ.on('set-volume', function(data){
			this.setVolume(data.vol);
		});

		this.QZ.on('play', function(){
			this.play();
		});
		this.QZ.on('pause', function(){
			this.pause();
		});
	},
	setVolume: function(vol){
		const steps = 30;
		const interval = 20;

		var domVideo = document.querySelector('video-embed video');
		if (!domVideo) return;
		
		var step = (vol-domVideo.volume)/steps;
		var i = 0;

		this.QZ.interval('volumeFade', interval, function(){
			if ((step >= 0 && domVideo.volume >= vol)||(step < 0 && domVideo.volume <= vol)){
				domVideo.volume = vol;
				this.QZ.clearInterval('volumeFade');
				return; 
			}

			domVideo.volume = Math.min(1, Math.max(0, domVideo.volume+step));
		});
	},
	show: function(url, options){
		if (!options) options = {};

		if (!options.timestamp) options.timestamp = 0;
		if (!options.autoHide) options.autoHide = false;
		if (!options.transitionToSplash) options.transitionToSplash = false;
		if (!options.volume && options.volume !== 0) options.volume = 0.8;

		this.QZ.clearTimeout('hide');
		this.QZ.timeout('splashHide', 400, function(){
			this.QZ.broadcastEvent('splash_req', {active: false});
		});


		document.querySelector('video-embed').classList.add('active');
		var html = `<video src="${url}">`;
		if (options.subtitles)
			html += `<track label="Subtitles" kind="subtitles" src="${options.subtitles}" default>`;
		html += '</video>';

		document.querySelector('video-embed').innerHTML = html;

		this.QZ.interval('updateState', 1000, function(){
			this.updateState();
		});

		var that = this;

		var domVideo = document.querySelector('video-embed video');
		domVideo.currentTime = options.timestamp;
		document.querySelector('video-embed video').addEventListener("canplay",function(){

			if (domVideo.textTracks.length > 0){
				domVideo.textTracks[0].mode = 'showing';
			}

			domVideo.volume = 0.0;
			that.setVolume(options.volume);

			domVideo.play();

			that.QZ.timeout('fadeTimeout', 200, function(){
				document.querySelector('video-embed').classList.add('visible');
			});

			if (options.autoHide){
				that.QZ.timeout('autoHide', Math.max(0, ((domVideo.duration-domVideo.currentTime)*1000)-800), function(){
					if (options.transitionToSplash){
						that.QZ.broadcastEvent('splash_req', {active: true});
					};

					that.QZ.timeout('autoHide', 100, function(){
						that.hide();
					});
				});
			} else {
				that.QZ.clearTimeout('autoHide');
			}
		});
	},
	hide: function(){
		this.QZ.clearTimeout('autoHide');

		var domVideo = document.querySelector('video-embed video');
		if (!domVideo) return;
		
		document.querySelector('video-embed').classList.remove('visible');

		this.setVolume(0);

		this.QZ.timeout('fadeTimeout', 1000, function(){
			
			var domVideo = document.querySelector('video-embed video');
			if (!domVideo) return;
			
			this.QZ.clearInterval('volumeFade');

			domVideo.pause();
			document.querySelector('video-embed').classList.remove('active');
			document.querySelector('video-embed').innerHTML = '';

			this.updateState();
		});
	},
	play: function(){
		var domVideo = document.querySelector('video-embed video');
		if (!domVideo) return;
		domVideo.play();
		this.updateState();

	},
	pause: function(){
		var domVideo = document.querySelector('video-embed video');
		if (!domVideo) return;
		domVideo.pause();
		this.updateState();
	},
	updateState: function(){
		var domEmbed = document.querySelector('video-embed');
		var domVideo = document.querySelector('video-embed video');
		var state = {};

		if (!domVideo && !domEmbed.classList.contains('active')){
			this.QZ.clearInterval('updateState');
			state.playing = false;
		} else {
			state.currentTime = domVideo.currentTime;
			state.volume = domVideo.volume;
			state.duration = domVideo.duration;
			state.playing = !domVideo.paused;
		}

		state.visible = domEmbed.classList.contains('active');
		this.QZ.send('set-state', state);
	},
});