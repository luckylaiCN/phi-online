const chart_difficulty_short_names = ['EZ', 'HD', 'IN', 'AT'];
const chart_difficulty_ranking_keys = ['ezRanking', 'hdRanking', 'inRanking', 'atRanking'];
const chart_difficulty_keys = ['chartEZ', 'chartHD', 'chartIN', 'chartAT'];
const chart_desinger_keys = ['ezChartDesigner', 'hdChartDesigner', 'inChartDesigner', 'atChartDesigner'];

function uri2json() {
    var uri = window.location.search.substring(1);
    var params = uri.split("&");
    var result = {};
    for (var i = 0; i < params.length; i++) {
        var param = params[i].split("=");
        result[param[0]] = param[1];
    }
    return result;
}

function get_meta(route) {
    meta = {}
    $.ajax({
        url: `/charts/${route}/meta.json`,
        async: false,
        dataType: 'json',
        success: function(data) {
            meta = data
        }
    })
    return meta
}


function load_chart(route, chart_name) {
    data = undefined
    $.ajax({
        url: `/charts/${route}/${chart_name}`,
        async: false,
        success: function(data) {
            ext = chart_name.split('.').pop()
            if (ext == 'pec') {
                data = ConvertPEC2Json(data, chart_name)

            }
            data = ConvertChartVersion(data)
            data = CalculateChartData(data)
            chart0.data = data
        }
    })
}

function load_audio(route, audio) {
    let audio_data = PIXI.sound.Sound.from({
        url: `/charts/${route}/${audio}`,
        preload: true,
    })
    chart0.audio = audio_data
}

function load_image_new(route, image){
    return new Promise((resolve,_)=>{
        let colorThief = new ColorThief();
        PIXI.Texture.fromURL(`/charts/${route}/${image}`).then((texture) => {
            let blur = PIXI.Texture.from(BlurImage(texture.baseTexture, 20));
            for (let color of colorThief.getPalette(texture.baseTexture.resource.source, 10)) {
                if (color[0] * 0.299 + color[1] * 0.587 + color[2] * 0.114 < 192) {
                    textures.baseColor = blur.baseColor = Number('0x' + color[0].toString(16) + color[1].toString(16) + color[2].toString(16));
                    break;
                }
            }
            if (!texture.baseColor) {
                texture.baseColor = colorThief.getColor(texture.baseTexture.resource.source);
                texture.baseColor = blur.baseColor = Number('0x' + texture.baseColor[0].toString(16) + texture.baseColor[1].toString(16) + texture.baseColor[2].toString(16));
            }
            chart0.image = texture
            chart0.imageBlur = blur
            console.log(texture)
            resolve()
        })
    })
    
}



window.onload = function() {
    chart0 = {}
    param = uri2json()
    meta = get_meta(param.route);
    if (meta == undefined || param.diff == undefined) {
        window.location = '/'
    }
    level_chart_info = meta.charts[param.diff]
    ranking = level_chart_info.ranking;
    chart_name = level_chart_info.chart;
    designer = level_chart_info.chartDesigner;
    audio = level_chart_info.musicFile;
    illustration = level_chart_info.illustration
    chart0.info = {
        name: meta.name,
        level: ranking,
        illustrator: level_chart_info.illustrator,
        designer: designer,
    }
    load_chart(param.route, chart_name)
    load_audio(param.route, audio)
    // load_image(param.route, illustration).then(() => {
    //     window._chart = chart0

    //     function wait() {
    //         if (!chart0.audio.isLoaded) {
    //             setTimeout(wait, 100)
    //         } else {
    //             gameInit()
    //             while(fullscreen.type != 2){
    //                 setCanvasFullscreen(true)
    //             }
                
    //         }
    //     }
    //     wait()
    // })
    load_image_new(param.route,illustration).then(()=>{
        console.log(chart0.image,chart0.imageBlur)
        window._chart = chart0
        function wait() {
            if (!(chart0.audio.isLoaded && LoaderCompleted)) {
                setTimeout(wait, 100)
            } else {
                gameInit()
                setCanvasFullscreen(false)
            }
        }
        wait()
    })
    


}