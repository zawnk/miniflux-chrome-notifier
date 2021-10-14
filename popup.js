if (localStorage["minifluxurl"] === undefined) {
    chrome.tabs.create({url: "options.html"});
    self.close();
}

var headers = new Headers();
headers.append('X-Auth-Token', localStorage["minifluxtoken"]);

async function getTenUnreadItems() {
    const resp = await fetch(localStorage["minifluxurl"] + '/v1/entries?status=unread&direction=desc&limit=10', {
        method:'GET',
        headers: headers,
    });

    const itemList = (await resp.json()).entries;

    return itemList;
}

async function fillListWithUnread(itemList) {
    if (!itemList.length) {
        document.getElementById('itemList').innerText = 'Nothing to see here!';
        return;
    }

    let generatedList = '<ul>';

    for (item of itemList) {
        const resp = await fetch(localStorage["minifluxurl"] + `/v1/feeds/${item.feed.id}/icon`, {
            method:'GET',
            headers: headers,
        });

        const articleIcon = 'data:' + (await resp.json()).data;

        const entryTitle = item.title.length > 50 ? item.title.substr(0, 47) + '...' : item.title;
        const feedTitle = item.feed.title.length > 70 ? item.feed.title.substr(0,67) + '...' : item.feed.title;

        generatedList += `<li id="li-${item.id}"><div><span id="link-${item.id}" class="listtitle">${entryTitle} <span class="readingtime">(${item.reading_time} min read)</span></span><span class="closebutton" id="close-${item.id}" style="float:right;">x</span></div><div class="listsubtitle"><img src="${articleIcon}" width="16" height="16" />${feedTitle}</div></li>`;
    }
    generatedList += '</ul>';
    document.getElementById('itemList').innerHTML = generatedList;

    itemList.forEach(item => {
        document.getElementById('link-'+item.id).addEventListener('click', () => markAsReadAndOpen(item.id));
        document.getElementById('close-'+item.id).addEventListener('click', () => markAsReadAndRemove(item.id));
    });
}

async function markAsReadAndOpen(id) {
    const url = await fetch(localStorage["minifluxurl"] + `/v1/entries/${id}`, {
        method:'GET',
        headers: headers,
    });

    entryUrl = (await url.json()).url;

    await fetch(localStorage["minifluxurl"] + '/v1/entries', {
        method:'PUT',
        headers: headers,
        body: JSON.stringify({
            entry_ids: [id],
            status: 'read'
        })
    });

    chrome.tabs.create({ url: entryUrl });
    chrome.extension.getBackgroundPage().get_unread();
    self.close();
}

async function markAsReadAndRemove(id) {
    await fetch(localStorage["minifluxurl"] + '/v1/entries', {
        method:'PUT',
        headers: headers,
        body: JSON.stringify({
            entry_ids: [id],
            status: 'read'
        })
    });

    document.getElementById(`li-${id}`).remove();
    chrome.extension.getBackgroundPage().get_unread();
}

async function openMenu() {
    chrome.extension.getBackgroundPage().get_unread();
    const itemList = await getTenUnreadItems();
    fillListWithUnread(itemList);
} 

openMenu();
