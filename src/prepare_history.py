# coding: utf-8
import csv

"""
+ kön
+ IT/verksamhet-slider (mest på skoj)
+ senaste fem dragen (jag tror inte man kan ha olika kolumner för varje drag, eftersom många klassificierare är dåliga på korskorrelationer, snarare en klass per historik och kolumner för kortare historik.
+ Tre symbol%-kolumner
+ Helhets-klassificering (t.ex hur många dubletter/tripplar eller hur har de tidigare reagerat på att vinna/förlora/remisera med just den senaste symbolen)

openings.txt verkar ha format (både från kod och issue)
history:player history:computer playerplayed: R S P
"""

HEADER_NAMES = ['gender', 'it', 'r_perc', 'p_perc', 's_perc', 'doubles', 'tripples', 'lose_stay', 'lose_copy', 'lose_beat_copy', 'win_stay', 'win_copy', 'win_beat_copy', 'draw_stay', 'draw_copy', 'draw_beat_copy']
HISTORY_NAMES = ['h1', 'c1', 'h2', 'c2', 'h3', 'c3', 'h4', 'c4', 'h5', 'c5', 'label']
EXTRA_HEADERS = [''] * len(HEADER_NAMES)
HISTORY = '../data/openings.txt'
OUTPUT = '../data/history.csv'

def parse_line(s):
    player_hist, computer_hist, R, S, P = s.split()
    R = int(R)
    S = int(S)
    P = int(P)
    return player_hist, computer_hist, R, P, S


def make_features(ph, ch, R, P, S):
    if ph == '0':
        return
    history = [''] * 10
    for n in range(len(ph)):
        history[n * 2] = ph[-(1 + n):]
        history[n * 2 + 1] = ch[-(1 + n):]


    for nr, label in [(R, 0), (P, 1), (S, 2)]:
        for _ in range(nr):
            yield history + [label]

def convert(inname=HISTORY, outname=OUTPUT):
    with open(inname) as inf:
        with open(outname, 'wt') as outf:
            cout = csv.writer(outf)
            cout.writerow(HEADER_NAMES + HISTORY_NAMES)
            for s in inf:
                if s.strip():
                    for row in make_features(*parse_line(s)):
                        cout.writerow(EXTRA_HEADERS + row)

if __name__ == '__main__':
    convert()
