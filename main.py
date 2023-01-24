from flask import Flask,render_template,send_file,make_response
from src import utils
import os
import requests
import io

ROOT_DIC = os.path.dirname(os.path.abspath(__file__))
print(ROOT_DIC)
app = Flask(__name__)

def make_cache_response(response, age=86400):
    response = make_response(response)
    response.headers["Cache-Control"] = "public, max-age=" + str(age)
    return response

@app.route("/")
def index(): # selection page
    return render_template("select.html",environment=utils.ENVIRONMENT)

@app.route("/charts/<songname>/<file>")
def songasset(songname,file):
    return make_cache_response(send_file(os.path.join(ROOT_DIC,f"charts/{songname}/{file}")))

@app.route("/charts_online/<tag>/<codename>")
def songzip(tag,codename):
    if utils.ENVIRONMENT == "development":
        response = make_response(send_file(os.path.join(ROOT_DIC,f"charts/{codename}.zip")))
    else:
        url = f"https://github.com/luckylaiCN/phi-online/releases/download/{tag}/{codename}.zip"
        zipfile_binary = requests.get(url).content
        response = make_response()
        response.data = zipfile_binary
    response.headers['Content-Disposition'] = f'attachment; filename={codename}.zip'
    response.headers["Cache-Control"] = "public, max-age=86400"
    response.headers["responseType"] = "arrayBuffer"
    response.mimetype = "application/octet-stream"
    return response


@app.route("/charts/songlist.json")
def chartasset():
    return send_file(os.path.join(ROOT_DIC,f"charts/songlist.json"))

@app.route("/play")
def play():
    return render_template("play.html",environment = utils.ENVIRONMENT)


if __name__ == '__main__':
    app.run(debug=True, port=os.getenv("PORT", default=5000))