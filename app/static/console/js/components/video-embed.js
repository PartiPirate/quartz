Quartz.registerComponent('video-embed', {
	QZDOM: function(){
		return `
			<div class="state" style="font-family: monospace;">

			</div>
			<hr>
			<h2>Controls</h2>
			<button class="btn btn-primary btn-play" onclick="Quartz.getComponent('video-embed').play();">Play</button>
			<button class="btn btn-primary btn-pause" onclick="Quartz.getComponent('video-embed').pause();">Pause</button>
			<button class="btn btn-primary" onclick="Quartz.getComponent('video-embed').hide();">Stop/hide</button>
			<form class="form-inline set-volume" style="margin-top: 1em;">
				<label class="my-1 mr-2">Set volume</label>
				<input type="number" class="form-control" name="volume" placeholder="Volume" style="width: 8em;" value="1" step="0.05" min="0" max="1">
				<button type="submit" class="btn btn-primary my-1">Set</button>
			</form>

			<hr>
			<h2>Play video</h2>
			<form class="video-options">
				<div class="form-group row">

					<label class="col-sm-2 col-form-label">Toggles</label>

					<div class="col-sm-10">
						<div class="form-check form-check-inline">
							<label>
								<input type="checkbox" name="autoHide" checked>
								autoHide
							</label>
							<label>
								<input type="checkbox" name="transitionToSplash">
								transitionToSplash
							</label>
						</div>
					</div>

					<label class="col-sm-2 col-form-label">Video URL</label>
					<div class="col-sm-10">
						<input type="text" name="url" class="form-control">
					</div>

					<label class="col-sm-2 col-form-label">Subtitles URL</label>
					<div class="col-sm-10">
						<input type="text" name="subtitles" class="form-control">
					</div>	
				</div>
				<div class="form-row">
					<div class="form-group col-md-2">
						
					</div>
					<div class="form-group col-md-2">
						<label>Start timestamp (seconds)</label>
						<input type="number" class="form-control" name="timestamp" value="0" min="0">
					</div>
					<div class="form-group col-md-2">
						<label>Volume (0 to 1)</label>
						<input type="number" class="form-control" name="volume" value="1" step="0.05" min="0" max="1">
					</div>
				</div>

				<button type="submit" class="btn btn-primary">Play</button>
			</form>
		`;
	},
	QZinit: function(){
		this.QZ.on('state', function(data){
			this.updateState(data);
		});
	},
	QZonDOMReady: function(){
		this.QZ.getTabDOM().querySelector('form.video-options').addEventListener('submit', function(){
			Quartz.getComponent('video-embed').applyForm();
		});

		this.QZ.getTabDOM().querySelector('form.set-volume').addEventListener('submit', function(){
			var comp = Quartz.getComponent('video-embed');
			var form = Quartz.utils.form2dict(comp.QZ.getTabDOM().querySelector('form.set-volume').elements);

			comp.QZ.send('set-volume', {vol: form.volume.value});
		});

		this.requestState();
	},
	requestState: function(){
		this.QZ.send('get-state');
	},
	updateState: function(state){
		this.QZ.log('state',state);
		var html = `
			visible: ${state.visible}<br>
			playing: ${state.playing}<br>
			time: ${state.currentTime?Quartz.utils.seconds2hms(state.currentTime):"--"} / ${state.duration?Quartz.utils.seconds2hms(state.duration):"--"}<br>
			volume: ${state.volume?state.volume:"--"}
		`;

		this.QZ.getTabDOM().querySelector('.state').innerHTML = html;
		this.QZ.getTabDOM().querySelector('.btn-play').disabled = (!state.visible || state.playing);
		this.QZ.getTabDOM().querySelector('.btn-pause').disabled = (!state.visible || !state.playing);
	},
	applyForm: function(){
		var form = Quartz.utils.form2dict(this.QZ.getTabDOM().querySelector('form.video-options').elements);
		console.log(form);
		var data = {
			url: form.url.value,
			options: {
				subtitles: form.subtitles.value,
				timestamp: form.timestamp.value,
				autoHide: form.autoHide.value,
				transitionToSplash: form.transitionToSplash.value,
				volume: form.volume.value
			}
		};

		this.QZ.send('show', data);
	},
	hide: function(){
		this.QZ.send('hide');
	},
	play: function(){
		this.QZ.send('play');
	},
	pause: function(){
		this.QZ.send('pause');
	}
});