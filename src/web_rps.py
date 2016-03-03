import os
from flask import Flask, jsonify, send_from_directory, send_file
import rps_game

app = Flask(__name__, static_url_path='')

@app.route("/")
def index():
    return send_file(os.path.join('static', 'game.html'), 'text/html')

@app.route("/move/<player>/<computer>/")
def get_move(player, computer):
    rg = rps_game.RPSGame()
    assert len(player.strip()) == len(computer.strip())
    return jsonify(move=rg.set_history(player.strip(), computer.strip()))

@app.route("/static/<path:path>")
def send_static(path):
    return send_from_directory('static', path)

if __name__ == '__main__':
    app.run(debug=True)
