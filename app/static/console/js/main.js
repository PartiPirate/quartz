function setView(view){
	document.querySelectorAll('view').forEach(function(elm){
		if (elm.dataset.name == view)
			elm.classList.add('active');
		else	
			elm.classList.remove('active');
	});
};

function setTab(tab){
	document.querySelectorAll('view[data-name=console] tab').forEach(function(elm){
		if (elm.dataset.name == tab)
			elm.classList.add('active');
		else
			elm.classList.remove('active');
	});

	document.querySelectorAll('#navbar-tabs .nav-item').forEach(function(elm){
		if (elm.dataset.name == tab)
			elm.classList.add('active');
		else
			elm.classList.remove('active');
	});
};

var StateManager = {
	importURL: function(url){
		console.log('import url', url);
		Quartz._socket.emit('import_state',{'url': url});
		document.querySelector('tab[data-name=home] .import-status').innerHTML = 'Importing from URL&hellip;';
	},
	importRaw: function(raw){
		console.log('import raw', raw);
		Quartz._socket.emit('import_state',{'raw': raw});
		document.querySelector('tab[data-name=home] .import-status').innerHTML = 'Importing from Raw&hellip;';
	},
};


document.addEventListener('DOMContentLoaded', function(){
	setView('connecting');

	Quartz.init(false);

	Quartz.onReady(function(){
		var components = Quartz.getComponents();

		var tabsHtml = '';
		var navbarTabs = [{"name":"home","priority":-999999}];
		for (var c in components){
			var comp = components[c];
			tabsHtml += `<tab data-name="${c}">${comp.QZDOM()}</tab>`;
			navbarTabs.push({"name": c, "priority": comp.QZtabPriority?comp.QZtabPriority():0});
		};

		document.querySelector('view[data-name=console]').innerHTML += tabsHtml;
		navbarTabs.sort(function(a,b){
			return (a.priority<b.priority?-1:1);
		});

		var navbarHtml = '';
		navbarTabs.forEach(function(tab){
			navbarHtml += `<a class="nav-item nav-link" data-name="${tab.name}" onclick="setTab('${tab.name}');">${tab.name}</a>`;
		});
		document.querySelector('#navbar-tabs').innerHTML = navbarHtml;

		for (var c in components){
			var comp = components[c];
			if (comp.QZonDOMReady){
				comp.QZonDOMReady.apply(comp);
			}
		}


		document.querySelector('tab[data-name=home]').innerHTML = `
			<h1>Welcome to Quartz!</h1>
			<label>Overlay URL <input readonly onclick="this.select();" value="${location.protocol+'//' + document.domain + ':' + location.port}/static/overlay/overlay.html?key=${Quartz._roomInfo.key}"></label>
			<br><label>Room Key <input readonly onclick="this.select();" value="${Quartz._roomInfo.key}"></label>
			<hr>
			<h2>Import/Export</h2>
			<a target="_blank" href="/export_state/${Quartz._roomInfo.key}.json" class="btn btn-secondary">Export current state</a>
			<p class="import-status"></p>
			<form class="import-url">
				<label>Import URL:<input type="text" name="url" class="form-control"></label>
				<button type="submit" class="btn btn-primary">Import</button>
			</form>
			<form class="import-raw">
				<label>Import Raw:</label>
				<textarea name="raw" class="form-control"></textarea>
				<button type="submit" class="btn btn-primary">Import</button>
			</form>
		`;

		document.querySelector('tab[data-name=home] form.import-url').addEventListener('submit', function(){
			var form = document.querySelector('tab[data-name=home] form.import-url').elements;

			StateManager.importURL(form.url.value);
		});
		document.querySelector('tab[data-name=home] form.import-raw').addEventListener('submit', function(){
			var form = document.querySelector('tab[data-name=home] form.import-raw').elements;

			StateManager.importRaw(form.raw.value);
		});

		Quartz._socket.on('import_callback', function(data){
			console.info('import  callback',data);
			document.querySelector('tab[data-name=home] .import-status').innerHTML = (data.success)?'Import successful.':'Import failed!';
		});

		document.querySelectorAll('tab form').forEach(function(elm){
			elm.addEventListener('submit', function(e){
				e.preventDefault();
			});
		});
		//document.querySelector('view[data-name=console]').innerHTML += '&gt;&gt;<a href="/static/overlay/overlay.html?dev&key='+Quartz._roomInfo.key+'">'+Quartz._roomInfo.key+'</a>';

		setTab('home');
	});


	Quartz._socket.on('connect', function() {
		setView('landing-page');
		console.log('connected');
	});

	Quartz._socket.on('new_room', function(data){
		console.log('create success',data);
		Quartz.joinRoom(data.key);
	});

	Quartz._socket.on('room_info', function(data){
		setView('console');
		console.log('room info',data);
		if (history)
			history.replaceState({}, 'Quartz Console', '?key='+data.key);
	});

	Quartz._socket.on('message', function(data){
		console.log('<<recv>>',data);
	});
});


