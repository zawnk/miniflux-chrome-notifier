function get_unread() {
    var headers = new Headers();
    headers.append('X-Auth-Token', localStorage["minifluxtoken"]);
    
    fetch(localStorage["minifluxurl"] + '/v1/entries?status=unread&direction=desc', {
            method:'GET',
            headers: headers,
        })
        .then(
            r => r.json()
        )
        .then(
            obj => {
                var count = new String();
                if (obj.total > 0) {
                    count = obj.total.toString();
                    if (localStorage["notifications"] == 1) {
                        notification(obj.entries[0].feed.title);
                    }
                } else {
                    count = '';
                }
                chrome.browserAction.setBadgeText({ text: count });
            }
        );
}

function notification(from) {
    var linkMap = {};
    chrome.notifications.create({
        title: 'I have something new for you from: ',
        type: 'basic',
        iconUrl: '../img/icon.png',
        message: 'From: ' + from,
        contextMessage: localStorage["minifluxurl"],
        isClickable: true
    }, function (notifId) {
        linkMap[notifId] = localStorage["minifluxurl"] + '/unread';
    });

    chrome.notifications.onClicked.addListener(function (notifId) {
        if (linkMap[notifId]) {
            chrome.tabs.create({ url: linkMap[notifId] });
        }
        chrome.browserAction.setBadgeText({ text: '' });
    });
}

function open_miniflux(info, tab) {
    chrome.tabs.create({url: localStorage["minifluxurl"] + '/unread'});
}

chrome.contextMenus.create({
    title: 'Open Miniflux',
    contexts: ["browser_action"],
    onclick: open_miniflux
})

get_unread();

var update_period = "update_seconds" in localStorage ? parseInt(localStorage["update_seconds"]) : 1;
chrome.alarms.create("notification", {delayInMinutes: update_period, periodInMinutes: update_period});

chrome.alarms.onAlarm.addListener(function(alarm) {
    if (alarm.name === "notification") {
        get_unread();
    }
});