function save_settings() {
    localStorage["minifluxurl"] = document.getElementById('minifluxurl').value;
    localStorage["minifluxtoken"] = document.getElementById('minifluxtoken').value;
    localStorage["update_seconds"] = document.getElementById('update_seconds').value;
    localStorage["notifications"] = document.getElementById('notifications').checked ? 1 : 0;
}

function load_settings() {
    document.getElementById('minifluxurl').value = localStorage["minifluxurl"];
    document.getElementById('minifluxtoken').value = localStorage["minifluxtoken"];
    document.getElementById('update_seconds').value = localStorage["update_seconds"];
    document.getElementById('notifications').checked = localStorage["notifications"] == 1 ? true : false;
}

function update_status(cls, txt) {
    document.getElementById('status').innerHTML =
        '<div class="' + cls + '">' + txt + '</div>';
}

if (localStorage["minifluxurl"] == undefined && localStorage["minifluxtoken"] == undefined) {
    update_status('info', 'enter your token to authenticate');

    document.getElementById('minifluxurl').value = '';
    document.getElementById('minifluxtoken').value = '';

    //$('#check_update').hide();
} else {
    load_settings();
}

document.getElementById('signupForm').addEventListener('submit', save_settings);

if (localStorage["minifluxurl"] != undefined && localStorage["minifluxtoken"] != undefined) {
    if (document.getElementById('minifluxurl').value.endsWith('/')) {
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
                update_status("error", "could not reach miniflux instance")
            );
    }
}