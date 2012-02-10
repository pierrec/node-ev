# README

## Synopsis

This is yet another event emitter implementation for [node.js](http://nodejs.org). It is nearly fully compatible with the node _EventEmitter_ API (see the differences section). The main purpose for node-ev is to provide very fast event emission when dealing with a relatively low number of listeners. Run the provided benchmarks to see if this is for you.

## Differences with node's _EventEmitter_

* New methods
	* `off(event[, listener])`: alias to `removeListener()`
	* `addEventListener(event, listener)`: alias to `addListener()`
	* `emit_myevent([ arg1... ])`: alias for `emit('myevent'[, arg1... ])`
* Listeners are triggered without any context whereas _EventEmitter_ applies the emitter's

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

### Constructor

The constructor takes an options object listing the possible events to be emitted and their corresponding number of arguments. Note that EV *will* emit events even though they may not have been set by the constructor but performance will be affected in highly demanding situations.

```
{
	data: 3
,	end: 1
, drain: 0
}
```

There are 3 events defined by default:

* `error(Error)`: if emitted while no listener attached to it, it will throw as per _EventEmitter_'s behavior
* `newListener(event, listener)`: emitted when a listener is attached to an event
* `oldListener(event, listener)`: emitted when a listener is removed from an event

### Members

* `ev_dedupListener`: will not add a listener more than once to the same event if true

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
