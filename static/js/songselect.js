function produce_mdui_panel(imageUrl, title, actions) {
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
        result += `<a class="mdui-btn" href="/play?${element.url}">${element.description}</a>`
    });
    return result;
}

function get_meta(url) {
    var meta = {};
    $.ajax({
        url: url,
        dataType: 'json',
        async: false,
        success: function(data) {
            meta = data;
        }
    })
    return meta;
}

function json2uri(json) {
    return Object.keys(json).map(function(key) {
        return [key, json[key]].map(encodeURIComponent).join("=");
    }).join("&");
}

function display_songs(routes) {
    routes.forEach(element => {
        meta = get_meta(`/charts/${element}/meta.json`);
        charts = meta.charts
        illustration = charts[0].illustration;
        illustration_url = `/charts/${element}/${illustration}`;
        title = meta.name;
        rankings = [];
        for (var i = 0; i < charts.length; i++) {
            rankings.push({
                description: `LV. ${charts[i].ranking}`,
                url: json2uri({
                    "route": element,
                    "diff": i
                })
            });
            
        }
        actions = produce_mdui_card_actions(rankings);
        card = produce_mdui_panel(illustration_url, title, actions);
        $('#song-list').append(card);
    });
}

window.onload = function() {
    song_list_url = '/getsongs';
    song_list_json = null;
    song_list_json_loaded = false;
    $.ajax({
        url: song_list_url,
        dataType: 'json',
        async: false,
        success: function(data) {
            song_list_json = data;
            song_list_json_loaded = true;
            routes = data.routes
            display_songs(routes);
        }
    })
    mdui.mutation();
}