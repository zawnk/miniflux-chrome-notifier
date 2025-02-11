import { EMessageType } from "./constants";

let savedUrl: string;
let savedToken: string;
let headers = new Headers();

async function initializeSettings() {
    savedUrl = await chrome.runtime.sendMessage({ message: EMessageType.GetUrl });
    savedToken = await chrome.runtime.sendMessage({ message: EMessageType.GetToken });
    headers.append('X-Auth-Token', savedToken);
}

async function checkAndOpenOptions() {
    await initializeSettings();

    if (!savedUrl) {
        chrome.tabs.create({ url: "options.html" });
        self.close();
    } else {
        openMenu();
    }
}

checkAndOpenOptions();

async function openMenu() {
    chrome.runtime.sendMessage({ message: EMessageType.UpdateUnreadCount })
    const itemList = await getTenUnreadItems();
    fillListWithUnread(itemList);
}

async function getTenUnreadItems() {
    const resp = await fetch(savedUrl + '/v1/entries?status=unread&direction=desc&limit=10', {
        method:'GET',
        headers: headers,
    });

    const itemList = (await resp.json()).entries;

    return itemList;
}

async function fillListWithUnread(itemList: any[]) {
    if (!itemList.length) {
        (document.getElementById('itemList') as HTMLInputElement).innerText = 'Nothing to see here!';
        return;
    }

    let generatedList = '<ul>';

    for (const item of itemList) {
        const resp = await fetch(savedUrl + `/v1/feeds/${item.feed.id}/icon`, {
            method:'GET',
            headers: headers,
        });

        const articleIcon = 'data:' + (await resp.json()).data;

        const entryTitle = item.title.length > 50 ? item.title.substr(0, 47) + '...' : item.title;
        const feedTitle = item.feed.title.length > 70 ? item.feed.title.substr(0,67) + '...' : item.feed.title;

        generatedList += `<li id="li-${item.id}"><div><span id="link-${item.id}" class="listtitle">${entryTitle} <span class="readingtime">(${item.reading_time} min read)</span></span><span class="closebutton" id="close-${item.id}" style="float:right;">x</span></div><div class="listsubtitle"><img src="${articleIcon}" width="16" height="16" />${feedTitle}</div></li>`;
    }
    generatedList += '</ul>';
    (document.getElementById('itemList') as HTMLElement).innerHTML = generatedList;

    itemList.forEach(item => {
        (document.getElementById('link-'+item.id) as HTMLElement).addEventListener('click', () => markAsReadAndOpen(item.id));
        (document.getElementById('close-'+item.id) as HTMLElement).addEventListener('click', () => markAsReadAndRemove(item.id));
    });
}

async function markAsReadAndOpen(id: number) {
    const url = await fetch(savedUrl + `/v1/entries/${id}`, {
        method:'GET',
        headers: headers,
    });

    const entryUrl = (await url.json()).url;

    await fetch(savedUrl + '/v1/entries', {
        method:'PUT',
        headers: headers,
        body: JSON.stringify({
            entry_ids: [id],
            status: 'read'
        })
    });

    chrome.tabs.create({ url: entryUrl });
    chrome.runtime.sendMessage({ message: EMessageType.UpdateUnreadCount })
    self.close();
}

async function markAsReadAndRemove(id: number) {
    await fetch(savedUrl + '/v1/entries', {
        method:'PUT',
        headers: headers,
        body: JSON.stringify({
            entry_ids: [id],
            status: 'read'
        })
    });

    (document.getElementById(`li-${id}`) as HTMLElement).remove();
    chrome.runtime.sendMessage({ message: EMessageType.UpdateUnreadCount })
}

