# TODO

* `once([event1, event2...], listener)`: mutually exclusive listeners: any event will remove the listener to the other ones
* Use linked objects for handlers:
	this.fn
	this.prev
	this.protottype.exec = this.fn(args...); this.prev.exec(args...)
