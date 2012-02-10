# README

## Synopsis

This is yet another event emitter implementation for [node.js](http://nodejs.org). It is nearly fully compatible with the node EventEmitter API (see the differences section). The main purpose for node-ev is to provide very fast event emission when dealing with a relatively low number of listeners. Run the provided benchmarks to see if this is for you.

## Differences with node's EventEmitter

* New methods
	* `off(event[, listener])`: alias to `removeListener()`
	* `addEventListener(event, listener)`: alias to `addListener()`
	* `emit_myevent([ arg1... ])`: alias for `emit('myevent'[, arg1... ])`
* Listeners are triggered without any context whereas EventEmitter applies the emitter's

## API

```javascript
var EV = require('ev')
var ev = new EV({ match: 2 })
function test (a) {
	console.log('received', a)
}
ev.on('match', test)
ev.emit('match', 'standard emit') // received standard emit
ev.emit_match('shortcut emit!') // received shortcut emit!
```

### Methods

* `on(event, listener)`: add a listener for [event]
* `once(event, listener)`: add a listener for [event] and remove it once triggered
* `off(event, listener)`: remove the listener for [event]
* `off(event)`: remove all listeners for [event]
* `removeAllListeners(event)`: remove all listeners for [event]
* `removeAllListeners()`: remove all listeners for all events
* `emit(event[, arguments])`: emit [event] with a list of arguments
* `setMaxListeners(max)`: set the maximum number of listeners after which a warning is issued, but the listeners are still added
* `listeners([event])`: get the list of listeners for [event] or all listeners for all events
