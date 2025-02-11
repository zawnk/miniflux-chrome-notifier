import { EMessageType } from "./constants";

async function save_settings() {
    chrome.runtime.sendMessage({ message: EMessageType.SetUrl, payload: (document.getElementById('minifluxurl') as HTMLInputElement).value })
    chrome.runtime.sendMessage({ message: EMessageType.SetToken, payload: (document.getElementById('minifluxtoken') as HTMLInputElement).value })
    chrome.runtime.sendMessage({ message: EMessageType.SetUpdatePeriod, payload: (document.getElementById('update_seconds') as HTMLInputElement).value})
    chrome.runtime.sendMessage({ message: EMessageType.SetNotificationsEnabled, payload: (document.getElementById('notifications') as HTMLInputElement).checked })
}

async function load_settings() {
    (document.getElementById('minifluxurl') as HTMLInputElement).value = await chrome.runtime.sendMessage({ message: EMessageType.GetUrl });
    (document.getElementById('minifluxtoken') as HTMLInputElement).value = await chrome.runtime.sendMessage({ message: EMessageType.GetToken });
    (document.getElementById('update_seconds') as HTMLInputElement).value = await chrome.runtime.sendMessage({ message: EMessageType.GetUpdatePeriod });
    (document.getElementById('notifications') as HTMLInputElement).checked = await chrome.runtime.sendMessage({ message: EMessageType.GetNotificationsEnabled });
}

function update_status(cls: string, txt: string) {
    (document.getElementById('status') as HTMLElement).innerHTML =
        '<div class="' + cls + '">' + txt + '</div>';
}

async function startup() {
    const currentUrl = await chrome.runtime.sendMessage({ message: EMessageType.GetUrl })
    const currentToken = await chrome.runtime.sendMessage({ message: EMessageType.GetToken })

    if (currentUrl == undefined && currentToken == undefined) {
        update_status('info', 'enter your token to authenticate');
    
        (document.getElementById('minifluxurl') as HTMLInputElement).value = '';
        (document.getElementById('minifluxtoken') as HTMLInputElement).value = '';
    
        //$('#check_update').hide();
    } else {
        load_settings();
    }
    
    document.getElementById('signupForm')?.addEventListener('submit', save_settings);
    
    if (currentUrl != undefined && currentToken != undefined) {
        if ((document.getElementById('minifluxurl') as HTMLInputElement).value.endsWith('/')) {
            update_status('error', 'URL can\'t end in trailing slash');
        } else {
            var headers = new Headers();
            headers.append('X-Auth-Token', currentToken);
        
            fetch(currentUrl + '/v1/me', {
                    method:'GET',
                    headers: headers,
                })
                .then(
                    response => {
                        if (!response.ok) {
                            update_status('error', 'could not authenticate');
                        } else {
                            update_status('success', 'connected to miniflux instance');
                        }
                    }
                )
                .catch(
                    err => update_status('error', 'could not reach miniflux instance')
                );
        }
    }
}

startup()