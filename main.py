from flask import Flask,render_template,send_file,make_response
from src import utils
import os

ROOT_DIC = os.path.dirname(os.path.abspath(__file__))
print(ROOT_DIC)
app = Flask(__name__)

def make_cache_response(response, age=86400):
    response = make_response(response)
    response.headers["Cache-Control"] = "public, max-age=" + str(age)
    return response

@app.route("/")
def index(): # selection page
    return render_template("select.html")

@app.route("/getsongs")
def songlist():
    return utils.get_song_list_json()

@app.route("/charts/<songname>/<file>")
def songasset(songname,file):
    return make_cache_response(send_file(os.path.join(ROOT_DIC,f"charts/{songname}/{file}")))

@app.route("/play")
def play():
    return render_template("play.html")


if __name__ == '__main__':
    app.run(debug=True, port=os.getenv("PORT", default=5000))