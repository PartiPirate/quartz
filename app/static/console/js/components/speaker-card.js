Quartz.registerComponent('speaker-card', {
	QZDOM: function(){
		return `
			<pre class="current"></pre>
			<button class="btn btn-primary" onclick="Quartz.getComponent('speaker-card').hide();">Hide</button>
			<hr>
			<table class="table table-sm table-striped">
				<thead>
					<tr>
						<th style="width: 140px;">Show</th>
						<th>Name</th>
						<th>Role</th>
						<th>Type</th>
						<th style="width: 140px;">Edit</th>
					</tr>
				</thead>
				<tbody>
					<tr><td colspan="5" class="text-center">&hellip;</td></tr>
				</tbody>
			</table>
			<hr>
			<h3>Add a preset</h3>
			<form class="add-preset">
				<div class="row">
					<div class="col">
						<input type="text" name="name" class="form-control" placeholder="Name">
					</div>
					<div class="col">
						<input type="text" name="role" class="form-control" placeholder="Role">
					</div>
					<div class="col">
						<select name="type" class="form-control">
							<option value="speaker">speaker</option>
						</select>
					</div>
				</div>
				<div class="row">

				</div>

				<button type="submit" class="btn btn-secondary">Add preset</button>
			</form>
		`;
	},
	_state: {},
	QZinit: function(){
		this.QZ.on('state', function(data){
			this.QZ.log('state',data);
			this._state = data;
			this.updateTable();
			this.updateCurrent();
		});

		this.QZ.on('show', function(data){
			this._state.current = data;
			this.updateCurrent();
		});

		this.QZ.on('hide', function(data){
			this._state.current = {active: false};
			this.updateCurrent();
		});
	},
	QZonDOMReady: function(){
		this.QZ.getTabDOM().querySelector('form.add-preset').addEventListener('submit', function(){
			Quartz.getComponent('speaker-card').addPresetFormSend();
		});

		this.QZ.send('get-state');
	},
	hide: function(){
		this.QZ.send('hide_req');
	},
	showPreset: function(presetIndex){
		this.QZ.send('show_req', this._state.presets[presetIndex]);
	},
	deletePreset: function(presetIndex){
		this._state.presets.splice(presetIndex, 1);
		this.QZ.send('set-state', this._state);
	},
	updateTable: function(){
		var html = '';
		for (var i=0;i<this._state.presets.length;i++){
			var preset = this._state.presets[i];
			html += `
				<tr>
					<td><button class="btn btn-primary" onclick="Quartz.getComponent('speaker-card').showPreset(${i});">Show</button></td>
					<td>${Quartz.utils.escapeHTML(preset.name)}</td>
					<td>${Quartz.utils.escapeHTML(preset.role)}</td>
					<td>${Quartz.utils.escapeHTML(preset.type)}</td>
					<td><button class="btn btn-outline-danger" onclick="Quartz.getComponent('speaker-card').deletePreset(${i});">Delete entry</button></td>
				</tr>
			`;
		}

		if (this._state.presets.length == 0)
			html = '<tr><td colspan="5" class="text-center"><i>(no preset)</i></td></tr>';

		this.QZ.getTabDOM().querySelector('table tbody').innerHTML = html;
	},
	updateCurrent: function(){
		this.QZ.getTabDOM().querySelector('.current').innerHTML = Quartz.utils.escapeHTML(JSON.stringify(this._state.current));
	},
	addPresetFormSend: function(){
		var form = Quartz.utils.form2dict(this.QZ.getTabDOM().querySelector('form.add-preset').elements);

		if (!form.name.value)
			return;


		var preset = {
			type: form.type.value,
			name: form.name.value,
			role: form.role.value,
			refs: []
		};

		this._state.presets.push(preset);

		this.QZ.send('set-state', this._state);

		// Reset form
		this.QZ.getTabDOM().querySelectorAll('form.add-preset input[type=text]').forEach(function(elm){
			elm.value = '';
		});
		this.QZ.getTabDOM().querySelector('form select[name=type]').value = "speaker";
	},
});