var maxLength = 3

function noop () {}

function error (err) {
	if (err instanceof Error)
		throw err
	else
		throw new Error("Uncaught, unspecified 'error' event.")
}

/**
  events: { name: argumentsLength, ... }
  pros:
  	- very fast at low number of listeners, averages with EventEmitter at around 22 listeners
  		and stays slightly below from there on
  		-> 52k vs 22k req/ms with 1 listener
  		-> 22k vs 5k req/ms with 2 listeners
  	- almost 100% node EventEmitter compatible (listeners scope is not set)
  cons:
  	- `emit()` limited to a max of 3 arguments
  	- about 20% slower than classical emitters when the number of listeners > 22
  	- adding/removing listeners is relatively slow
**/
function EventEmitter (events) {
	events = events || {}

	// Handler removed, emit an event
	events.oldListener = 2
	// New handler added, emit an event
	events.newListener = 2
	// Special case: error event - throw unless at least one listener is attached
	events.error = 1
	
	// Known events
	// Hash <event name>: <handler>
	this._ev_emit = {}
	// List of handlers per event
	// Hash <event name>: array of handlers
	this._ev_cache = {}
	// Number of arguments per event (max=3)
	// Hash <event name>: <number of arguments>
	this._ev_length = {}
	// Flag indicating warning has been issued if listeners > maxListeners
	// Hash <event name>: Boolean
	this._ev_maxWarning = {}

	// setMaxListeners() forces the default value
	this._ev_maxListeners = 10
	this.setMaxListeners()
	// Avoid duplicated listeners
	this.ev_dedupListener = false

	var evs = Object.keys(events), max
	for (var i = 0, n = evs.length; i < n; i++) {
		this.removeAllListeners( evs[i] )
		max = +events[ evs[i] ]
		this._ev_length[ evs[i] ] = isFinite(max) ? Math.min(max, maxLength) : maxLength
	}
}
EventEmitter.prototype.addListener = function (ev, handler) {
	var key = 'emit_' + ev
	// New event not supplied at instanciation
	// Should be avoided to fully get V8 optimizations
	if ( !this.hasOwnProperty(key) ) {
		this.removeAllListeners(ev)
		this._ev_length[ev] = maxLength
	}
	
	if (typeof handler !== 'function')
		throw new Error('Handler not a function: ' + handler)
	
	// Do not add the listener if already there and flag activated
	var cache = this._ev_cache[ev]
	var n = cache.push(handler) - 1

	if (this.ev_dedupListener) {
		for (var i = 0; i < n; i++) {
			if (cache[i] === handler || cache[i].handler === handler) break
		}
		// Handler found
		if (i < n) return this
	}

	// Emit the newListener event
	this.emit_newListener(ev, handler)
	
	if ( this._ev_maxListeners > 0 && n >= this._ev_maxListeners && !this._ev_maxWarning[ev] ) {
		// Straight from node's EventEmitter
    console.error(
			'Warning (EventEmitter): Possible EventEmitter memory ' +
			'leak detected. %d listeners added to event %s. ' +
			'Use emitter.setMaxListeners() to increase limit.'
		, n
		, ev
		)
		console.trace()
    this._ev_maxWarning[ev] = true
  }
  
	var fn = this[key]
	// This is the first listener!
	if (n === 0) {
		this._ev_emit[ev] = this[key] = handler
		return this
	}
	// Additional listener, register it according to its # of arguments
	switch ( this._ev_length[ev] ) {
		case 0:
			this._ev_emit[ev] = this[key] = function () {
				fn()
				handler()
			}
		break
		case 1:
			this._ev_emit[ev] = this[key] = function () {
				fn(arguments[0])
				handler(arguments[0])
			}
		break
		case 2:
			this._ev_emit[ev] = this[key] = function () {
				fn(arguments[0], arguments[1])
				handler(arguments[0], arguments[1])
			}
		break
		case 3:
			this._ev_emit[ev] = this[key] = function () {
				fn(arguments[0], arguments[1], arguments[2])
				handler(arguments[0], arguments[1], arguments[2])
			}
		break
		default:
			// Should never get here unless the max args has been altered
			throw new Error('Invalid number of arguments:' + this._ev_length[ev] + ' for event: ' + ev)
	}
	return this
}
EventEmitter.prototype.removeListener = function (ev, handler) {
	// Remove all if handler is not set
	if (arguments.length === 1)
		return this.removeAllListeners(ev)
	
	var cache = this._ev_cache[ev]
	if (!cache) return this

	for (var i = 0, n = cache.length; i < n; i++) {
		if (cache[i] === handler || cache[i].handler === handler) break
	}
	// Handler not found
	if (i === n) return this
	// Remove the handler
	this.emit_oldListener(ev, handler)
	cache.splice(i, 1)
	// Rebuild the listeners
	this.removeAllListeners(ev)
	for (var i = 0, n = cache.length; i < n; i++) {
		this.addListener(ev, cache[i])
	}
	return this
}
EventEmitter.prototype.removeAllListeners = function (ev) {
	// Remove all handlers
	if (arguments.length === 0) {
		var events = Object.keys(this._ev_emit)

		for (var i = 0, n = events.length; i < n; i++)
			this.removeAllListeners( events[i] )

		return this
	}

	// Only remove the one for the specified event
	if (ev === 'error') {
		this._ev_emit.error = this.emit_error = error
	} else {
		this._ev_emit[ev] = this['emit_' + ev] = noop
	}
	this._ev_cache[ev] = []
	this._ev_maxWarning[ev] = false
	return this
}
EventEmitter.prototype.emit = function () {
	var handler = this._ev_emit[ arguments[0] ]
	if (!handler) return false

	switch (arguments.length) {
		case 1:
			handler()
		break
		case 2:
			handler(arguments[1])
		break
		case 3:
			handler(arguments[1], arguments[2])
		break
		case 4:
			handler(arguments[1], arguments[2], arguments[3])
		break
		default:
			throw new Error('Too many arguments for event ' + arguments[0])
	}
	return true
}
EventEmitter.prototype.once = function (ev, handler) {
	var self = this

	function _handler () {
		self.off(ev, _handler)
		handler()
	}
	_handler.handler = handler

	this.on(ev, _handler)
	return this
} 
EventEmitter.prototype.setMaxListeners = function (max) {
	this._ev_maxListeners = typeof max !== 'number' ? 10 : max
	return this
}
EventEmitter.prototype.listeners = function () {
	return arguments.length === 0
		? this._ev_cache
		: this._ev_cache[ arguments[0] ]
}

// Aliases
EventEmitter.prototype.on = EventEmitter.prototype.addListener
EventEmitter.prototype.addEventListener = EventEmitter.prototype.addListener
EventEmitter.prototype.off = EventEmitter.prototype.removeListener

module.exports = EventEmitter