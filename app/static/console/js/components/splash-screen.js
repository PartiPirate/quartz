Quartz.registerComponent('splash-screen', {
	QZDOM: function(){
		return `
			<label>
				Toggle: 
			</label>
			<div class="btn-group" role="group" aria-label="Basic example" data-key="toggle">
			  <button type="button" class="btn btn-primary" onclick="Quartz.getComponent('splash-screen').toggleSplash(false);">Off</button>
			  <button type="button" class="btn btn-primary" onclick="Quartz.getComponent('splash-screen').toggleSplash(true);">On</button>
			</div>
			<hr>
			<form class="state">
				<div class="form-group row">

					<label class="col-sm-2 col-form-label">Toggles</label>

					<div class="col-sm-10">
						<div class="form-check form-check-inline">
							<label>
								<input type="checkbox" name="active" value="on">
								Active
							</label>
						</div>
						<div class="form-check form-check-inline">
							<label>
								<input type="checkbox" name="music" value="on">
								Music
							</label>
						</div>
						<div class="form-check form-check-inline">
							<label>
								<input type="checkbox" name="translucid" value="on">
								Translucid
							</label>
						</div>
					</div>

					<label class="col-sm-2 col-form-label">Name</label>
					<div class="col-sm-10">
						<input type="text" name="name" class="form-control">
					</div>

					<label class="col-sm-2 col-form-label">Text</label>
					<div class="col-sm-10">
						<input type="text" name="text" class="form-control">
					</div>

					<label class="col-sm-2 col-form-label">Countdown to</label>
					<div class="col-sm-10">
						<input type="text" name="countdown" class="form-control" placeholder="yyyy-mm-dd hh:mm:ss" maxlength="19">
					</div>
				</div>

				<button type="submit" class="btn btn-primary">Apply</button>
				<button type="button" class="btn btn-outline-secondary" onclick="Quartz.getComponent('splash-screen').requestState();">Cancel changes</button>
			</form>
		`;
	},
	QZinit: function(){
		this.QZ.on('state', function(data){
			this.QZ.log('got state',data);
			this.updateState(data);
		});
		
		this.QZ.on('toggle', function(data){
			this.updateToggleButton(data.active);
		});
	},
	QZonDOMReady: function(){
		this.QZ.getTabDOM().querySelector('form.state').addEventListener('submit', function(){
			Quartz.getComponent('splash-screen').applyForm();
		});

		this.QZ.send('get-state');
	},
	updateToggleButton: function(active){
		var buttons = this.QZ.getTabDOM().querySelectorAll('[data-key=toggle] button');
		if (active){
			buttons[0].classList.remove('active');
			buttons[1].classList.add('active');
		} else {
			buttons[0].classList.add('active');
			buttons[1].classList.remove('active');
		}

		this.QZ.getTabDOM().querySelector('form.state input[name=active]').checked = active;
	},
	toggleSplash: function(active){
		this.QZ.send('toggle_request', {active: active});
	},
	requestState: function(){
		this.QZ.send('get-state');
	},
	updateState: function(state){
		this.updateToggleButton(state.active);

		var formDOM = this.QZ.getTabDOM().querySelector('form.state');
		formDOM.querySelector('input[name=active]').checked = state.active;	
		formDOM.querySelector('input[name=music]').checked = state.music;	
		formDOM.querySelector('input[name=translucid]').checked = state.translucid;	
		formDOM.querySelector('input[name=name]').value = state.name;	
		formDOM.querySelector('input[name=text]').value = state.text;	
		formDOM.querySelector('input[name=countdown]').value = state.countdown;	
	},
	applyForm: function(){
		var form = Quartz.utils.form2dict(this.QZ.getTabDOM().querySelector('form.state').elements);

		this.QZ.info(this.QZ.getTabDOM().querySelector('form.state').elements);

		var newState = {
			"active": form.active.checked,
			"music": form.music.checked,
			"translucid": form.translucid.checked,
			"name": form.name.value,
			"text": form.text.value,
			"countdown": form.countdown.value
		};

		this.QZ.send('set-state', newState);
	},
});