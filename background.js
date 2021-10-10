function get_unread() {
    var headers = new Headers();
    headers.append('X-Auth-Token', chrome.storage.local.get("minifluxtoken", () => {}));
    
    var miniflux_url = chrome.storage.local.get("minifluxurl", () => {return "https://rss.mechanus.net";}) + '/v1/entries?status=unread&direction=desc';

    fetch(miniflux_url, {
            method:'GET',
            headers: headers,
        })
    //fetch(miniflux_url)
        .then(
            r => r.json()
        )
        .then(
            obj => {
                var count = new String();
                if (obj.total > 0) {
                    count = obj.total.toString();
                    if (chrome.storage.local.get("notifications", () => {}) == 1) {
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
        contextMessage: chrome.storage.local.get("minifluxurl", () => {}),
        isClickable: true
    }, function (notifId) {
        linkMap[notifId] = chrome.storage.local.get("minifluxurl", () => {}) + '/unread';
    });

    chrome.notifications.onClicked.addListener(function (notifId) {
        if (linkMap[notifId]) {
            chrome.tabs.create({ url: linkMap[notifId] });
        }
        chrome.browserAction.setBadgeText({ text: '' });
    });
}

chrome.runtime.onStartup.addListener(function() {
    var update_seconds = 'update_seconds' in chrome.storage.local.get(() => {}) ? parseInt(chrome.storage.local.get("update_seconds", () => {})) : 1;
    chrome.alarms.create("notification", {delayInMinutes: update_seconds, periodInMinutes: update_seconds});
});

chrome.alarms.onAlarm.addListener(function(alarm) {
    if (alarm.name === "notification") {
        get_unread();
    }
});