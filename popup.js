import {get_unread} from "./background.js";

if (localStorage["minifluxurl"] != undefined) {
    get_unread();
} else {
    chrome.tabs.create({url: "options.html"});
}
self.close();