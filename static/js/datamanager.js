const LOCAL_STORAGE_NAME = "phi-online"
const version = 0

let data_default = {
    auto: false,
    challenge : false,
    musicVolume : 1.0,
    hitsoundVolume : 0.75,
    offset: 0,
    noteScale: 1.0,
    version: version,
    chartHosts: {
        "/charts_online/": "Main Host (limited , cachad)",
        "https://gh.api.99988866.xyz/https://github.com/luckylaiCN/phi-online/releases/download/": "Mirror 1 (stable)",
        "https://github.moeyy.xyz/https://github.com/luckylaiCN/phi-online/releases/download/": "Mirror 2 (fast)",
        "https://github.com/luckylaiCN/phi-online/releases/download/": "GitHub (unstable)"
    },
    chartHost: "/charts_online/"
}

var phi_data = {}

// check STORAGE
if (typeof localStorage.getItem(LOCAL_STORAGE_NAME) === "undefined" || localStorage.getItem(LOCAL_STORAGE_NAME) === null) {
    localStorage.setItem(LOCAL_STORAGE_NAME, JSON.stringify(data_default))
}

phi_data = JSON.parse(localStorage.getItem(LOCAL_STORAGE_NAME))

// check version
if (phi_data.version !== version) {
    localStorage.setItem(LOCAL_STORAGE_NAME, JSON.stringify(data_default))
    phi_data = JSON.parse(localStorage.getItem(LOCAL_STORAGE_NAME))
}

function update_data() {
    localStorage.setItem(LOCAL_STORAGE_NAME, JSON.stringify(phi_data))
}

phi_data.reset = function(){
    localStorage.setItem(LOCAL_STORAGE_NAME, JSON.stringify(data_default))
    phi_data = JSON.parse(localStorage.getItem(LOCAL_STORAGE_NAME))
}