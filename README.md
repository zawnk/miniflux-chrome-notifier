# Miniflux Notifier Remixed

A fork of the [Miniflux Notifications](https://github.com/skorotkiewicz/miniflux-chrome-notifier) extension.

Sadly the original seems to have been abandoned, while the most requested
feature: ability to disable notifications has never been implemented.

I originally wanted to make a pull request, but my changes have kinda spun out
of control, so I ended up with this. Besides, maintaining this version myself
will probably be more efficient.

Features implemented so far:
* notifications are now optional, off by default
* authentication via [Miniflux API key](https://miniflux.app/docs/api.html#authentication) instead of basic http (login+password)
* a slightly reworked options page (including getting rid of jQuery)
* added context menu option to open Miniflux instance in a new tab
* clicking icon now updates the counter / sends notification

TODO:
* correctly handle unreachable miniflux instance (i.e. display that via icon or a badge) via `GET /healthcheck`
* [x] migrate to manifest v3
* migrate all call functions from popup to background
* verify update period and notification settings are working as intended
* use new `GET /feeds/counter` endpoint to decrease load when updating unread count
* [x] switch options to message bus instead of localstorage
* ~~change all then chains to async await~~
* verify the refresh timer with alarm event api
* clean up the code so that variable names make sense
* streamline the options page, it doesn't look as good as I'd like it to

Disclaimer:
I am in no way proficient with JavaScript. Most of the work done involved a lot
of trial and error. I plan to use this extension, therefore expect some sort of
maintenance, but no promises. Pull requests are very much welcome.
