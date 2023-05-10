import { EMessageType, IEventMessage } from "./constants";

chrome.runtime.onMessage.addListener((request: IEventMessage, sender, sendResponse) => {
    switch (request.message) {
        case EMessageType.GetToken:
            sendResponse(getToken())
            break;
        case EMessageType.SetToken:
            sendResponse(setToken(request.payload))
            break;
        case EMessageType.GetUrl:
            sendResponse(getUrl())
            break;
        case EMessageType.SetUrl:
            sendResponse(setUrl(request.payload))
            break;
        case EMessageType.GetUpdatePeriod:
            sendResponse(getUpdatePeriod())
            break;
        case EMessageType.SetUpdatePeriod:
            sendResponse(setUpdatePeriod(request.payload))
            break;
        case EMessageType.GetNotificationsEnabled:
            sendResponse(getNotificationEnabled())
            break;
        case EMessageType.SetNotificationsEnabled:
            sendResponse(setNotificationEnabled(request.payload))
            break;
        case EMessageType.UpdateUnreadCount:
            updateUnreadCount()
            sendResponse(true)
            break;
        default:
            break;
    }

})

async function getToken() {
    return (await chrome.storage.local.get(['minifluxtoken'])).minifluxtoken
}

async function setToken(token: string) {
    return await chrome.storage.local.set({minifluxtoken: token})
}

async function getUrl() {
    return (await chrome.storage.local.get(['minifluxurl'])).minifluxurl
}

async function setUrl(url: string) {
    return await chrome.storage.local.set({minifluxurl: url})
}

async function getUpdatePeriod() {
    return (await chrome.storage.local.get(['minifluxupdateperiod'])).minifluxupdateperiod
}

async function setUpdatePeriod(updatePeriod: number) {
    return await chrome.storage.local.set({minifluxupdateperiod: updatePeriod})
}

async function getNotificationEnabled() {
    return (await chrome.storage.local.get(['minifluxnotificationcount'])).minifluxnotificationcount
}

async function setNotificationEnabled(notificationEnabled: boolean) {
    return await chrome.storage.local.set({minifluxnotificationcount: notificationEnabled})
}


async function updateUnreadCount() {
    var headers = new Headers();
    headers.append('X-Auth-Token', await getToken());
    
    fetch(await getUrl() + '/v1/entries?status=unread&direction=desc', {
            method:'GET',
            headers: headers,
        })
        .then(
            r => r.json()
        )
        .then(
            async (obj) => {
                let count: string;
                if (obj.total > 0) {
                    count = obj.total.toString();
                    if (await getNotificationEnabled() == true) {
                        notification(obj.entries[0].feed.title);
                    }
                } else {
                    count = '';
                }
                chrome.action.setBadgeText({ text: count });
            }
        );
}

async function notification(from: string) {
    var linkMap: any = {};
    chrome.notifications.create({
        title: 'I have something new for you from: ',
        type: 'basic',
        iconUrl: '../img/icon.png',
        message: 'From: ' + from,
        contextMessage: await getUrl(),
        isClickable: true
    }, async (notifId) => {
        linkMap[notifId] = await getUrl() + '/unread';
    });

    chrome.notifications.onClicked.addListener(function (notifId) {
        if (linkMap[notifId]) {
            chrome.tabs.create({ url: linkMap[notifId] });
        }
        chrome.action.setBadgeText({ text: '' });
    });
}

async function open_miniflux() {
    chrome.tabs.create({url: await getUrl() + '/unread'});
}

chrome.contextMenus.create({
    id: 'open-miniflux',
    title: 'Open Miniflux',
    contexts: ["browser_action"]
})

chrome.contextMenus.onClicked.addListener(open_miniflux)

async function startupBackground() {
    var update_period = await getUpdatePeriod() || 1;
    chrome.alarms.create("notification", {delayInMinutes: update_period, periodInMinutes: update_period});
    
    chrome.alarms.onAlarm.addListener(function(alarm) {
        if (alarm.name === "notification") {
            updateUnreadCount();
        }
    });
}
updateUnreadCount();
startupBackground();