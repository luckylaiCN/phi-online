import os
import csv
import re
import json
import traceback
import chardet

ABS_ROOT = os.path.abspath(os.path.dirname(__file__))

# get int from string that contains numbers using re
def get_int_from_string(string:str):
    return int(re.findall(r'\d+)',string)[0])



def get_dirs(dir_path:str):
    result = []           
    for dir in os.listdir(dir_path):
        result.append((os.path.join(dir_path,dir,"info.csv"),os.path.join(dir_path,dir),dir))
    return result


def generate_from_csv(path,dir,codename):
    result = {}
    try:
        # detect encoding first
        with open(path,"rb") as f:
            encoding = chardet.detect(f.read())["encoding"]

        with open(path,encoding=encoding) as f:
            csv_object = csv.reader(f)
            rows = []
            for row in csv_object:
                rows.append(row)
            info = rows[2]
            # 'chart', 'musicFile', 'illustration', 'AspectRatio(useless)', 'ScaleRatio(useless)', 'GlobalAlpha(useless)', 'name', 'ranking', 'illustrator', 'chartDesigner'
            chart = info[0]
            musicFile = info[1]
            illustration = info[2]
            name = info[6]
            ranking = info[7]
            illustrator = info[8]
            chartDesigner = info[9]
            result = {
                "name":name,
                "codename":codename,
                "charts" : [{
                    "chart":chart,
                    "musicFile":musicFile,
                    "illustration":illustration,
                    "ranking":ranking,
                    "illustrator":illustrator,
                    "chartDesigner":chartDesigner,
                }]
            }
            
            
    except FileNotFoundError:
        print(f"{path} is not a csv file")
        return False

    except Exception:
        # show path
        print(f"Error when processing {path}")
        traceback.print_exc()
        return False

    
    # write to meta.json
    with open(os.path.join(dir,"meta.json"),'w',encoding="utf-8") as f:
        json.dump(result,f,ensure_ascii=False)

    # ok message
    print(f"{codename} is ok")

    return True


if __name__ == "__main__":
    # generate from ./csvimport/*
    files = get_dirs(os.path.join(ABS_ROOT,"csvimport"))
    for file in files:
        generate_from_csv(*file)