var Quartz = {
	components: {},
	_ready: false,
	_intervals: {},
	_timeouts: {},
	_listeners: {},
	registerComponent: function(name, component){
		component._name = name;

		Quartz.components[name] = component
		if (Quartz._ready)
			Quartz.initializeComponents();
		//document.body.appendChild(component.DOM());
	},
	initializeComponents: function(){
		for (var c in Quartz.components){
			var comp = Quartz.components[c];
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
			// TODO send thru websocket
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

	},
	init: function(){
		Quartz.initializeComponents();
		Quartz._ready = true;
	},
};


document.addEventListener('DOMContentLoaded', Quartz.init);