import os
import json

# get all directory names
def get_dirs(path):
    dirs = []
    for name in os.listdir(path):
        if os.path.isdir(os.path.join(path, name)):
            dirs.append(name)
    return dirs

def get_song_list_json():
    routes = get_dirs("./charts")
    output_json = {
        "routes": routes
    }
    return json.dumps(output_json)

