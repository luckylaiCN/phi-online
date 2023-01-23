LOCAL_STORAGE_NAME = "phi-online"

let data_default = {
    auto: false,
    offset: 0
}

var phi_data = {}

// check STORAGE
if (typeof localStorage.getItem(LOCAL_STORAGE_NAME) === "undefined" || localStorage.getItem(LOCAL_STORAGE_NAME) === null) {
    localStorage.setItem(LOCAL_STORAGE_NAME, JSON.stringify(data_default))
}

phi_data = JSON.parse(localStorage.getItem(LOCAL_STORAGE_NAME))

function update_data(){
    localStorage.setItem(LOCAL_STORAGE_NAME, JSON.stringify(phi_data))
}