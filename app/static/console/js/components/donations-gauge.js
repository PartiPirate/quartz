Quartz.registerComponent('donations-gauge', {
	QZDOM: function(){
		return `
			<form class="state">
				<div class="form-group row">

					<label class="col-sm-2 col-form-label">Toggles</label>

					<div class="col-sm-10">
						<div class="form-check form-check-inline">
							<label>
								<input type="checkbox" name="active">
								active
							</label>
						</div>
					</div>

					<label class="col-sm-2 col-form-label">Title</label>
					<div class="col-sm-10">
						<input type="text" name="title" class="form-control">
					</div>

					<label class="col-sm-2 col-form-label">Link</label>
					<div class="col-sm-10">
						<input type="text" name="link" class="form-control">
					</div>

					<label class="col-sm-2 col-form-label">API endpoint</label>
					<div class="col-sm-10">
						<input type="text" name="url" class="form-control">
					</div>

					<label class="col-sm-2 col-form-label">Objectives</label>
					<div class="col-sm-10">
						<input type="text" name="objectives" class="form-control">
					</div>


				</div>

				<button type="submit" class="btn btn-primary">Apply</button>
				<button type="button" class="btn btn-outline-secondary" onclick="Quartz.getComponent('donations-gauge').requestState();">Cancel changes</button>
			</form>
		`;

		/*
		self.QZset_state({
			"active": True,
			"url": "https://don.partipirate.org/api/getGauge.php?from_date=2017-01-01&to_date=2020-01-01&amount_path=project%3EadditionalDonation&search=%22project%22:%7B%22code%22:%22BUD_ELECTION_2019%22",
			"objectives": [
				27000,
				135000,
				270000,
				400000
			],
			"title": "Campagne de dons pour les élections",
			"link": "europeennes.partipirate.org"
		})
		*/
	},
	QZinit: function(){
		this.QZ.on('state', function(data){
			this.updateState(data);
		});
	},
	QZonDOMReady: function(){
		this.QZ.getTabDOM().querySelector('form.state').addEventListener('submit', function(){
			Quartz.getComponent('donations-gauge').applyForm();
		});

		this.QZ.send('get-state');
	},
	requestState: function(){
		this.QZ.send('get-state');
	},
	updateState: function(state){
		var formDOM = this.QZ.getTabDOM().querySelector('form.state');
		formDOM.querySelector('input[name=active]').checked = state.active;	
		formDOM.querySelector('input[name=url]').value = state.url;
		formDOM.querySelector('input[name=title]').value = state.title;
		formDOM.querySelector('input[name=link]').value = state.link;
		formDOM.querySelector('input[name=objectives]').value = state.objectives.join(',');
	},
	applyForm: function(){
		var form = Quartz.utils.form2dict(this.QZ.getTabDOM().querySelector('form.state').elements);

		this.QZ.info(this.QZ.getTabDOM().querySelector('form.state').elements);

		var objectives = [];
		form.objectives.value.split(',').forEach(function(v){
			objectives.push(parseInt(v));
		});

		var newState = {
			"active": form.active.checked,
			"url": form.url.value,
			"title": form.title.value,
			"link": form.link.value,
			"objectives": objectives
		};

		console.log(newState);

		this.QZ.send('set-state', newState);
	},
});