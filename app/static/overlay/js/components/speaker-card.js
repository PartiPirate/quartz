Quartz.registerComponent('speaker-card', {
	QZDOM: function(){
		return `<speaker-card class=" " style="display: none;">
			<speaker-name>
			</speaker-name>
			<speaker-role>
			</speaker-role>
			<div class="frame">
				<div></div>
				<div></div>
				<div></div>
				<div></div>
			</div>
		</speaker-card>`;
	},
	QZinit: function(){
		this.QZ.onEvent('splash', function(eventName, componentName, data){
			if (componentName == 'splash-screen' && !data.active){
				this.hide();
			}
		});

		this.QZ.info('initialized');

		/*this.QZ.interval('aaa', 3000, function(){
			this.show({
				'name': "Cédric <span>Levieux</span>",
				'refs': [
					{'type':'twitter','value':'farlistener'}
				],
				'role': "N°2 sur la liste &laquo; Piratons l'Europe ! &raquo;"
			});
		});*/
		this.QZ.timeout('aafra', 4000, function(){
			/*this.show({
				'name': "Florie <span>Marie</span>",
				'refs': [
					{'type':'twitter','value':'florielvm'}
				],
				'role': "Tête de liste &laquo; Piratons l'Europe ! &raquo;"
			});*/
			this.hide();
		});
	},
	_visible: false,
	show: function(data){
		var v = this._visible;
		if (v){
			this.hide();
		}
		this._visible = true;

		this.QZ.timeout('show', v?500:10, function(){
			// TODO populate dom
			var nameHtml = `<div class="name">${data.name}</div>`;
			if (data.refs)
				for (var i=0;i<data.refs.length;i++){
					nameHtml += `<div class="ref ${data.refs[i].type}">${data.refs[i].value}</div>`;
				}
			document.querySelector('speaker-card speaker-name').innerHTML = nameHtml;
			document.querySelector('speaker-card speaker-role').innerHTML = data.role;
			
			this.QZ.timeout('display-toggle', 10, function(){
				document.querySelector('speaker-card').classList.remove('hiding');
				document.querySelector('speaker-card').style.display = 'block';
			});
		});

	},
	hide: function(){
		this._visible = false;
		document.querySelector('speaker-card').classList.add('hiding');
		this.QZ.timeout('display-toggle', 450, function(){
			document.querySelector('speaker-card').style.display = 'none';
		});
	},
});