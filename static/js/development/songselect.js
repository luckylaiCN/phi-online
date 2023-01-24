function produce_mdui_panel(title, actions) {
    return `<div class="mdui-panel mdui-panel-gapless" mdui-panel>
            <div class="mdui-panel-item">
            <div class="mdui-panel-item-header">${title}</div>
            <div class="mdui-panel-item-body">
                ${actions}
            </div>
        </div>
        `;
}

function produce_mdui_card_actions(rankings) {
    result = ''
    rankings.forEach(element => {
        result += `<a class="mdui-btn" target="_blank" href="/play?${element.uri_component}">${element.description}</a>`
    });
    return result;
}

function get_meta(url) {
    var meta = {};
    $.ajax({
        url: url,
        dataType: 'json',
        async: false,
        success: function (data) {
            meta = data;
        }
    })
    return meta;
}

function json2uri(json) {
    return Object.keys(json).map(function (key) {
        return [key, json[key]].map(encodeURIComponent).join("=");
    }).join("&");
}

function display_songs(song_list_json) {
    routes = song_list_json.routes
    routes.forEach(route => {
        meta = song_list_json.meta[route]
        tag = meta.tag
        title = meta.name
        rankings = []
        for (var i = 0 ; i < meta.chartRankings.length ; i++){
            rankings.push({
                description: meta.chartRankings[i],
                uri_component: json2uri({
                    "route" : route,
                    "diff" : i,
                    "tag" : tag
                })
            })
        }
        actions = produce_mdui_card_actions(rankings);
        card = produce_mdui_panel(title, actions);
        $('#song-list').append(card);
    })
}

window.onload = function () {
    song_list_url = `${CHART_HOST}/charts/songlist.json`;
    song_list_json = null;
    song_list_json_loaded = false;
    $("#auto")[0].checked = phi_data.auto
    $("#auto")[0].onchange = function (event) {
        phi_data.auto = event.target.checked
        update_data()
    }
    $("#offset")[0].value = phi_data.offset
    $("#offset")[0].onchange = function (event) {
        phi_data.offset = parseInt(event.target.value)
        update_data()
    }
    $.ajax({
        url: song_list_url,
        dataType: 'json',
        async: false,
        success: function (data) {
            song_list_json = data;
            song_list_json_loaded = true;
            display_songs(song_list_json);
        }
    })
    mdui.mutation();
    mdui.updateSliders();
}