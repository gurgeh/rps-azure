from flask import Flask, jsonify
import rps_game

app = Flask(__name__)


@app.route("/move/<player>/<computer>")
def get_move(player, computer):
    rg = rps_game()
    return jsonify(move=rg.set_history(player, computer))
