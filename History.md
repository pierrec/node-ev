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