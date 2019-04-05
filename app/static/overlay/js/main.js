var Quartz = {
	_components: {},
	_ready: false,
	_intervals: {},
	_timeouts: {},
	_listeners: {},
	_eventListeners: {},
	isDevMode: function(){
		return (document.location.href.indexOf('?dev') > -1);
	},
	registerComponent: function(name, component){
		component._name = name;

		Quartz._components[name] = component
		if (Quartz._ready)
			Quartz.initializeComponents();
		//document.body.appendChild(component.DOM());
	},
	initializeComponents: function(){
		for (var c in Quartz._components){
			var comp = Quartz._components[c];
			if (!comp._loaded){
				Quartz.enrichComponent(comp);

				if (comp.QZDOM)
					document.body.innerHTML += (comp.QZDOM());
				
				if (comp.QZinit)
					comp.QZinit();
				
				comp._loaded = true;
			}
		}
	},
	enrichComponent: function(comp){
		comp.QZ = {
			_component: comp,
			_name: comp._name
		};

		comp.QZ.on = function(messageIdentifier, callback){
			this.off(messageIdentifier);
			Quartz._listeners[this._name][messageIdentifier] = callback;
		};

		comp.QZ.off = function(messageIdentifier){
			if  (!Quartz._listeners[this._name]){
				Quartz._listeners[this._name] = {};
			}

			if (Quartz._listeners[this._name][messageIdentifier])
				delete Quartz._listeners[this._name][messageIdentifier];
		}

		comp.QZ.send = function(messageIdentifier, data){
			Quartz._socket.emit('message', {"component_name": this._name, "message_identifier": messageIdentifier, "data": data});
		};

		comp.QZ.interval = function(intervalIdentifier, duration, callback){
			this.clearInterval(intervalIdentifier);
			var that = this;

			Quartz._intervals[this._name][intervalIdentifier] = setInterval(function(){
				callback.call(that._component);
			}, duration);

			callback.call(that._component);
		};

		comp.QZ.clearInterval = function(intervalIdentifier){
			if (!Quartz._intervals[this._name])
				Quartz._intervals[this._name] = {};

			if (Quartz._intervals[this._name][intervalIdentifier])
				clearInterval(Quartz._intervals[this._name][intervalIdentifier]);
		}

		comp.QZ.timeout = function(timeoutIdentifier, duration, callback){
			this.clearTimeout(timeoutIdentifier);
			var that = this;

			Quartz._timeouts[this._name][timeoutIdentifier] = setTimeout(function(){
				callback.call(that._component);
			}, duration);
		};

		comp.QZ.clearTimeout = function(timeoutIdentifier){
			if (!Quartz._timeouts[this._name])
				Quartz._timeouts[this._name] = {};

			if (Quartz._timeouts[this._name][timeoutIdentifier])
				clearTimeout(Quartz._timeouts[this._name][timeoutIdentifier]);
		}

		comp.QZ.log = function(...args){
			args.unshift('['+comp._name+']');
			console.log.apply(this, args);
		};
		comp.QZ.warn = function(...args){
			args.unshift('['+comp._name+']');
			console.warn.apply(this, args);
			console.trace();
		};
		comp.QZ.error = function(...args){
			args.unshift('['+comp._name+']');
			console.error.apply(this, args);
			console.trace();
		};
		comp.QZ.info = function(...args){
			args.unshift('['+comp._name+']');
			console.info.apply(this, args);
		};


		comp.QZ.onEvent = function(eventName, callback){
			this.offEvent(eventName);
			Quartz._eventListeners[this._name][eventName] = callback;
		};

		comp.QZ.offEvent = function(eventName, callback){
			if (!Quartz._eventListeners[this._name]){
				Quartz._eventListeners[this._name] = {};
			}

			if (Quartz._eventListeners[this._name][eventName])
				delete Quartz._eventListeners[this._name][eventName];
		};

		comp.QZ.broadcastEvent = function(eventName, data){
			for (var c in Quartz._eventListeners){
				for (var e in Quartz._eventListeners[c]){
					if (eventName == e){
						Quartz._eventListeners[c][e].call(Quartz._components[c], e, this._name, data);
					}
				}
			}
		};

	},
	init: function(){
		if (Quartz.isDevMode()){
			//document.body.innerHTML += '<video src="img/istockphoto-948295764-640_adpp_is.mp4" autoplay loop muted style="position: absolute; width: 100%; height: 100%;"></video>';
			document.querySelector('html').classList.add('dev');
		}

		Quartz._key = Quartz.utils.getQueryParameter('key');

		Quartz._socket = io.connect(location.protocol+'//' + document.domain + ':' + location.port);
		
		Quartz._socket.on('connect', function(){
			console.log('Socket connected.');
			Quartz._socket.emit('join', {key: Quartz._key});
			Quartz.initializeComponents();
			Quartz._ready = true;

		});

		Quartz._socket.on('message', function(msg){
			if (Quartz._listeners[msg.component_name]){
				if (Quartz._listeners[msg.component_name][msg.message_identifier]){
					Quartz._listeners[msg.component_name][msg.message_identifier].call(Quartz._components[msg.component_name], msg.data);
				}
			}
		});


		// TODO handle disconnect
		/*
	var socket = io.connect('http://' + document.domain + ':' + location.port);
    socket.on('connect', function() {
        socket.emit('my event', {data: 'I\'m connected!'});
    });
		*/

	},
};


document.addEventListener('DOMContentLoaded', Quartz.init);