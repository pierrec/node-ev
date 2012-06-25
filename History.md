0.0.7 / 2012-06-11
==================

* Empty arrays of listeners replaced with null when no listener attached to minimize memory usage
* Added second parameter to constructor to avoid warnings
* Incoming event object is now cloned instead of modified

0.0.6 / 2012-03-08
==================

* Added stack trace to the 'Warning: undefined event...' message
* Mitigated performance regression due to scope setting

0.0.5 / 2012-03-07
==================

* Removed the 3 arguments limitation
* Listeners scope set to the emitting object => EV is now _100%_ compatible with nodejs' native EventEmitter!
* Added `version` property to the constructor
* Added warning on undefined event emission

0.0.4 / 2012-02-26
==================

* Fix in handling ev_dedupListener where handler was always added to the cache

0.0.3 / 2012-02-11
==================

* `once()` now passes arguments

0.0.2 / 2012-02-10
==================

* Event [oldListener] triggered upon listener removal
* Added property ev_dedupListener (default=false): if true, will not add a listener more than once to the same event
* Added alias addEventListener === addListener