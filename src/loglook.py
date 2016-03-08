# coding: utf-8

import re
from collections import Counter

LOGNAME = '../data/201603021414.log'

MOVEREX = re.compile('/move/([rps]+)/([rps]+)', re.I)

MOVES = "rps"

DRAW = 0
HWIN = 1
CWIN = -1

# implementera i JS


def switch_count(s, step=1):
    cnt = Counter()
    trucnt = Counter()
    prev = None
    i = 1.0
    for c in s:
        if prev:
            cnt[prev, c] += i
            trucnt[prev] += 1
        prev = c
        i += step
    return cnt, trucnt


def get_skew(cnt, h):
    rc = cnt[h, 'r']
    pc = cnt[h, 'p']
    sc = cnt[h, 's']
    sm = rc + pc + sc
    
    rscore = sc - pc
    pscore = rc - sc
    sscore = pc - rc

    if rscore > max(pscore, sscore):
        return 'r', rscore / sm
    if pscore > max(sscore, rscore):
        return 'p', pscore / sm
    if sscore > max(rscore, pscore):
        return 's', sscore / sm
    return 'r', 0


def score_switch(hs, cs, limit=3, skew=0.2, base=True):
    good = 0
    for i in range(8, len(hs) - 1):
        cnt, tcnt = switch_count(hs[:i], base)
        if tcnt[hs[i - 1]] >= limit:
            move, moveskew = get_skew(cnt, hs[i - 1])
            if moveskew > skew:
                good += decide(hs[i], cs[i]) - decide(hs[i], move)
    return good

def decide(h, c):
    res = (MOVES.index(h) - MOVES.index(c)) % 3
    if res == 2:
        res = -1
    return res


def score(hs, cs):
    return Counter([decide(h, c) for (h, c) in zip(hs, cs)])


def get_all_positions(fname=LOGNAME):
    with open(fname) as f:
        for x in f:
            m = MOVEREX.search(x)
            if m:
                yield m.group(1).lower(), m.group(2).lower()


def get_matches(fname=LOGNAME):
    matches = {}
    maxlen = 0
    for hs, cs in get_all_positions(fname):
        if len(hs) not in matches:
            matches[len(hs)] = set()
        matches[len(hs)].add((hs, cs))
        maxlen = max(maxlen, len(hs))

    dropped = 0
    uniqueset = set()
    for i in range(maxlen):
        nxt = matches.get(i + 1, [])
        for pos in matches.get(i, []):
            for n in nxt:
                if n[0].startswith(pos[0]) and n[1].startswith(pos[1]):
                    dropped += 1
                else:
                    uniqueset.add(pos)
    print dropped
    return uniqueset

def evalparam(matches, skew, base, verbose=False):
    hwin = cwin = 0
    totg = 0
    for hs, cs in matches:
        if 'r' * 6 in hs or 's' * 6 in hs or 'p' * 6 in hs:
            continue
        s = score(hs, cs)
        sc, tsc = switch_count(hs, base)
        ss = score_switch(hs, cs, skew=skew, base=base)
        totg += ss
        if s[HWIN] == 19:
            hwin += 1
            if verbose:
                print 'h', hs, cs, ss
        if s[CWIN] == 19:
            cwin += 1
            if verbose:
                print 'c', hs, cs, ss
    return totg

if __name__ == '__main__':
    scores = []
    matches = get_matches()
    print len(matches)
    for skew in range(20):
        skew = skew / 20.0
        for base in range(20):
            base = base / 10.0
            good = evalparam(matches, skew, base)
            print skew, base, good
            scores.append((good, skew, base))
    scores.sort(reverse=True)
    print scores[:50]
    
