
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

function load_online(zipfile_url) {
    return new Promise((resolve, reject) => {
        let xhr = new XMLHttpRequest();
        xhr.open("GET",zipfile_url,true);
        xhr.responseType = "arraybuffer";
        xhr.onload = function(_){
            JSZip.loadAsync(this.response).then((zipData) => {
                loadZip(zipData)
                
            }).catch((e) => {
                console.log("not a zip file.")
                console.log(e)
                reject()
            })
        }
        xhr.send()
        function getFileFormat(filename) {
    		let arr = filename.split('.');
    		return arr[arr.length - 1];
    	}


        async function loadZip(e) {
            const imageFormat = ('jpeg,jpg,gif,png,webp').split(',');
            const audioFormat = ('aac,flac,mp3,ogg,wav,webm').split(',');
            const numPattern = /^(\-|\+)?\d+(e\d)?(\.\d+)?$/;

            let zipFiles = {};

            for (let name in e.files) {
                let file = e.files[name];
                let realName = name.split('/');
                let format = '';
                realName = realName[realName.length - 1];
                format = getFileFormat(realName);
                if (file.dir) continue;
                file.realName = realName;
                file.format = format;
                file.isHidden = realName.indexOf('.') == 0 ? true : false;
                zipFiles[name] = file
            }

            // check if meta.json exists

            if (typeof zipFiles["meta.json"] === typeof undefined) {
                console.log("Not Containing meta.json")
                reject()
            }

            let meta = JSON.parse(await zipFiles["meta.json"].async("text"))
            let param = uri2json()
            let chart_info = meta.charts[param.diff]
            let audio = chart_info.musicFile
            let illustration = chart_info.illustration
            let illustrator = chart_info.illustrator
            let designer = chart_info.chartDesigner
            let ranking = chart_info.ranking
            let chart_entry = chart_info.chart
            let data

            let colorThief = new ColorThief();
            let texture = await PIXI.Texture.fromURL('data:image/' + zipFiles[illustration].format + ';base64,' + (await zipFiles[illustration].async('base64')));
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

            let audio_data = PIXI.sound.Sound.from({
                url: "data:audio/" + zipFiles[audio].format + ';base64,' + (await zipFiles[audio].async('base64')),
                preload: true,
            })

            chart0.audio = audio_data
            chart0.info = {
                name: meta.name,
                level: ranking,
                illustrator: illustrator,
                designer: designer,
            }
            data = await zipFiles[chart_entry].async("text")
            if (zipFiles[chart_entry].format == "pec") {
                data = ConvertPEC2Json(data, meta.name)
            }
            data = ConvertChartVersion(data)
            data = CalculateChartData(data)
            chart0.data = data
            resolve()

        }

    })









}

window.onload = function () {
    chart0 = {}
    param = uri2json()
    load_online(`/charts_online/${param.tag}/${param.route}`).then(() => {
        window._chart = chart0
        function wait() {
            console.log(1)
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