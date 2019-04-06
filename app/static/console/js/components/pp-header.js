Quartz.registerComponent('pp-header', {
	QZDOM: function(){
		return `
			<form class="state">
				<div class="form-group row">

					<label class="col-sm-2 col-form-label">Toggles</label>

					<div class="col-sm-10">
						<div class="form-check form-check-inline">
							<label>
								<input type="checkbox" name="showDate">
								show date
							</label>
						</div>
					</div>

					<label class="col-sm-2 col-form-label">Topic</label>
					<div class="col-sm-10">
						<input type="text" name="topic" class="form-control">
					</div>

					<label class="col-sm-2 col-form-label">Location</label>
					<div class="col-sm-10">
						<input type="text" name="location" class="form-control">
					</div>

				</div>

				<button type="submit" class="btn btn-primary">Apply</button>
				<button type="button" class="btn btn-outline-secondary" onclick="Quartz.getComponent('pp-header').requestState();">Cancel changes</button>
			</form>
		`;
	},
	QZinit: function(){
		this.QZ.on('state', function(data){
			this.updateState(data);
		});
	},
	QZonDOMReady: function(){
		this.QZ.getTabDOM().querySelector('form.state').addEventListener('submit', function(){
			Quartz.getComponent('pp-header').applyForm();
		});

		this.QZ.send('get-state');
	},
	requestState: function(){
		this.QZ.send('get-state');
	},
	updateState: function(state){
		var formDOM = this.QZ.getTabDOM().querySelector('form.state');
		formDOM.querySelector('input[name=showDate]').checked = state.showDate;	
		formDOM.querySelector('input[name=topic]').value = state.topic;
		formDOM.querySelector('input[name=location]').value = state.location;
	},
	applyForm: function(){
		var form = Quartz.utils.form2dict(this.QZ.getTabDOM().querySelector('form.state').elements);

		this.QZ.info(this.QZ.getTabDOM().querySelector('form.state').elements);

		var newState = {
			"showDate": form.showDate.checked,
			"topic": form.topic.value,
			"location": form.location.value,
		};

		console.log(newState);

		this.QZ.send('set-state', newState);
	},
});