# Miniflux Notifier Remixed

A fork of the [Miniflux Notifications](https://github.com/skorotkiewicz/miniflux-chrome-notifier) extension
([chrome web store](https://chrome.google.com/webstore/detail/miniflux-notifications/jpeplhckmjlpahnkpblakfligkbfefkg)).

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
* migrate to manifest v3
* clean up the code so that variable names make sense
* probably implement an option to revert to old icon press behaviour
* probably bring back basic http auth as an option
* streamline the options page, it doesn't look as good as I'd like it to

Disclaimer:
I am in no way proficient with JavaScript. Most of the work done involved a lot
of trial and error. I plan to use this extension, therefore expect some sort of
maintenance, but no promises. Pull requests are very much welcome.