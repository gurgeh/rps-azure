from flask import Flask, jsonify
import rps_game

app = Flask(__name__)


@app.route("/move/<player>/<computer>/")
def get_move(player, computer):
    rg = rps_game.RPSGame()
    assert len(player.strip()) == len(computer.strip())
    return jsonify(move=rg.set_history(player.strip(), computer.strip()))


if __name__ == '__main__':
    app.run(debug=True)
