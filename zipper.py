from src import utils
import zipfile
import os
import json

ABS_ROOT = os.path.abspath(os.path.dirname(__file__)) 
CHART_ROOT = os.path.join(ABS_ROOT, "charts")

def process(dir,relative_dir,tag):
    meta_path = os.path.join(dir,"meta.json")
    if os.path.exists(meta_path):
        with open(meta_path,"r",encoding="utf-8") as f:
            json_obj : dict = json.load(f)
        if json_obj.get("codename") != relative_dir:
            print(json_obj.get("codename"),"is not vaild, changed to",relative_dir)
            json_obj["codename"] = relative_dir
        elif json_obj.get("tag"):
            print(f"{json_obj['name']} has tag {json_obj['tag']}, skip")
            return json_obj
        
        print(f"make {json_obj['name']} to tag {tag}")
        json_obj["tag"] = tag
        with open(meta_path,"w",encoding="utf-8") as f:
            json.dump(json_obj,f,ensure_ascii=False,indent=4)
        
        # then zip dir to /src

        zip_path = os.path.join(CHART_ROOT,f"{json_obj['codename']}.zip")
        with zipfile.ZipFile(zip_path,"w") as f:
            # zip all 
            for root,dirs,files in os.walk(dir):
                for file in files:
                    f.write(os.path.join(root,file),file)
            
            
            
    else:
        print(f"{dir} has no meta.json")
        return None

def remove_tag(dir):
    meta_path = os.path.join(dir,"meta.json")
    if os.path.exists(meta_path):
        with open(meta_path,"r",encoding="utf-8") as f:
            json_obj : dict = json.load(f)
        if json_obj.get("tag"):
            print(f"{json_obj['name']} has tag {json_obj['tag']}, remove")
            json_obj.pop("tag")
            with open(meta_path,"w",encoding="utf-8") as f:
                json.dump(json_obj,f,ensure_ascii=False,indent=4)
    

if __name__ == "__main__":
    dirs = utils.get_dirs(CHART_ROOT)
    tag = input("tag : ")
    if tag.lower() == "remove":
        print("Are u sure to remove all tags?")
        if not input().lower().startswith("y"):
            print("Aborted.")
            exit()
        for dir in dirs:
            remove_tag(os.path.join(CHART_ROOT,dir))
    else:
        print("Are u sure to make tag",tag,"?")
        if not input().lower().startswith("y"):
            print("Aborted.")
            exit()
        for dir in dirs:
            process(os.path.join(CHART_ROOT,dir),dir,tag)