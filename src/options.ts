async function save_settings() {
    localStorage["minifluxurl"] = (document.getElementById('minifluxurl') as HTMLInputElement).value
    localStorage["minifluxtoken"] = (document.getElementById('minifluxtoken') as HTMLInputElement).value;
    localStorage["update_seconds"] = (document.getElementById('update_seconds') as HTMLInputElement).value;
    localStorage["notifications"] = (document.getElementById('notifications') as HTMLInputElement).checked ? 1 : 0;
}

async function load_settings() {
    (document.getElementById('minifluxurl') as HTMLInputElement).value = localStorage["minifluxurl"];
    (document.getElementById('minifluxtoken') as HTMLInputElement).value = localStorage["minifluxtoken"];
    (document.getElementById('update_seconds') as HTMLInputElement).value = localStorage["update_seconds"];
    (document.getElementById('notifications') as HTMLInputElement).checked = localStorage["notifications"] == 1 ? true : false;
}

function update_status(cls: string, txt: string) {
    (document.getElementById('status') as HTMLElement).innerHTML =
        '<div class="' + cls + '">' + txt + '</div>';
}

async function startup() {
    if (localStorage["minifluxurl"] == undefined && localStorage["minifluxtoken"] == undefined) {
        update_status('info', 'enter your token to authenticate');
    
        (document.getElementById('minifluxurl') as HTMLInputElement).value = '';
        (document.getElementById('minifluxtoken') as HTMLInputElement).value = '';
    
        //$('#check_update').hide();
    } else {
        load_settings();
    }
    
    document.getElementById('signupForm')?.addEventListener('submit', save_settings);
    
    if (localStorage["minifluxurl"] != undefined && localStorage["minifluxtoken"] != undefined) {
        if ((document.getElementById('minifluxurl') as HTMLInputElement).value.endsWith('/')) {
            update_status('error', 'URL can\'t end in trailing slash');
        } else {
            var headers = new Headers();
            headers.append('X-Auth-Token', localStorage["minifluxtoken"]);
        
            fetch(localStorage["minifluxurl"] + '/v1/me', {
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