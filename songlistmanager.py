from src import utils
import json
import os

ABS_ROOT = os.path.abspath(os.path.dirname(__file__)) 
CHART_ROOT = os.path.join(ABS_ROOT, "charts")

def get_meta(path:str):
    with open(path,"r",encoding="utf-8") as f:
        return json.load(f)

def main():
    result = {
        "routes" : [],
        "meta" : {}
    }
    dirs = utils.get_dirs(CHART_ROOT)
    for dir in dirs:
        try:
            path = os.path.join(CHART_ROOT, dir)
            meta = get_meta(os.path.join(path, "meta.json"))
            codename = meta["codename"]
            name = meta["name"]
            tag = meta["tag"]
            charts = meta["charts"]
            rankings = [chart["ranking"] for chart in charts]
            result["routes"].append(codename)
            result["meta"][codename] = {
                "tag" : tag,
                "chartRankings" : rankings[:],
                "name" : name,
            }

        except Exception :
            print(f"error when processing {dir}")
            continue
    
    with open(os.path.join(CHART_ROOT,"songlist.json"),"w",encoding="utf-8") as f:
        json.dump(result,f,ensure_ascii=False,indent=4)
    
if __name__ == "__main__":
    main()
        
            