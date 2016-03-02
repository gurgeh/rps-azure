import requests
import random

from prepare_history import HISTORY_NAMES

URL = 'https://ussouthcentral.services.azureml.net/workspaces/84e2890f7c1a4656bbcac6268054e1b8/services/86ffab0c5e2944b5876080d2300b2528/execute?api-version=2.0'

AZ_KEY = "glBLx+WMjKXrgri66eK6IRVfuvvhdQNpK4NE0AYRKy2D/v2Z4bjZ6E0yMBjj63xEZs0HMXQu6cNhThdt7GenVA=="

MOVES = 'RPS'


def good(prob, m):
    return prob[(m + 2) % 3] - prob[(m + 1) % 3]


class RPSGame:
    def __init__(self):
        self.set_history()

        self.computer_wins = 0
        self.player_wins = 0
        self.draws = 0

    def set_history(self, player_history='', computer_history=''):
        self.player_history = player_history.upper()
        self.computer_history = computer_history.upper()

        return self.get_next_move()

    def move(self, m):
        m = m.upper()
        if m not in MOVES:
            raise KeyError

        self.update_score(MOVES.index(m))

        self.computer_history += MOVES[self.next_move]
        self.player_history += m

        self.get_next_move()

        return self

    def update_score(self, m):
        if m == self.next_move:
            self.draws += 1
        elif (m + 1) % 3 == self.next_move:
            self.computer_wins += 1
        else:
            self.player_wins += 1

    def __repr__(self):
        history = str(zip(self.computer_history, self.player_history))
        result = 'Comp/Human/Draw: %d/%d/%d' % (self.computer_wins,
                                                self.player_wins, self.draws)
        return history + '\n' + result

    def get_next_move(self):
        if not self.player_history:
            self.next_move = random.choice(range(3))
            return self.next_move

        headers = {'Content-Type': 'application/json',
                   'Authorization': ('Bearer ' + AZ_KEY)}
        data = self.make_history()
        res = requests.post(URL, json=data, headers=headers)
        prob = [float(x)
                for x in res.json()['Results']['output1']['value']['Values'][
                    0][-4:-1]]
        goodness = [(good(prob, i), i) for i in range(3)]
        goodness.sort()

        self.next_move = goodness[-1][1]

        return self.next_move

    def make_history(self):
        history = [''] * 10
        for n in range(min(5, len(self.player_history))):
            history[n * 2] = self.player_history[-(1 + n):]
            history[n * 2 + 1] = self.computer_history[-(1 + n):]

        data = {"Inputs": {"input1": {
            "ColumnNames": HISTORY_NAMES,
            "Values": [history + ['']]
        }},
                "GlobalParameters": {}}

        return data
