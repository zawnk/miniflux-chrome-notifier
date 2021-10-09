if (localStorage["minifluxurl"] != undefined) {
    chrome.extension.getBackgroundPage().get_unread();
} else {
    chrome.tabs.create({url: "options.html"});
}
self.close();