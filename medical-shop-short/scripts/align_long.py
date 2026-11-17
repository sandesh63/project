"""Align the 64 script sentences to pauses in vo_long.mp3 and write src/long/timeline.ts."""
import re, sys, json
sys.path.insert(0, 'scripts')
from long_script import S
txt = open(sys.argv[1]).read()
starts = [float(x) for x in re.findall(r'silence_start: ([\d.]+)', txt)]
ends = [float(x) for x in re.findall(r'silence_end: ([\d.]+)', txt)]
DUR = 313.18
pauses = list(zip(starts, ends))  # (silence start, silence end)
# candidate boundaries: middle of each pause; weight longer pauses
cands = [((a + b) / 2, a, b) for a, b in pauses]
speech_start = 0.05
speech_end = pauses[-1][0] if pauses[-1][1] > DUR - 0.5 else DUR
def spoken(s):
    # spoken length proxy: Devanagari characters without spaces/punctuation
    return len(re.sub(r'[\s,।?!…\-]', '', s))
w = [spoken(h) for _, h, _ in S]
tot = sum(w)
cum = []
c = 0
for x in w:
    c += x
    cum.append(c / tot)
n = len(S)
# DP: choose n-1 boundary pauses (monotonic) minimising squared deviation from expected times,
# rewarding long pauses (sentence ends are usually longer pauses)
T = speech_end - speech_start
INF = 1e18
m = len(cands)
dp = [[INF] * m for _ in range(n - 1)]
bk = [[-1] * m for _ in range(n - 1)]
for j in range(m):
    exp = speech_start + T * cum[0]
    dp[0][j] = (cands[j][0] - exp) ** 2 - 2.0 * (cands[j][2] - cands[j][1])
for i in range(1, n - 1):
    exp = speech_start + T * cum[i]
    best = INF; bj = -1
    for j in range(m):
        if j > 0 and dp[i - 1][j - 1] < best:
            best = dp[i - 1][j - 1]; bj = j - 1
        if bj >= 0:
            dp[i][j] = best + (cands[j][0] - exp) ** 2 - 2.0 * (cands[j][2] - cands[j][1])
            bk[i][j] = bj
j = min(range(m), key=lambda k: dp[n - 2][k])
bounds = []
for i in range(n - 2, -1, -1):
    bounds.append(j); j = bk[i][j]
bounds = bounds[::-1]
clauses = []
t0 = speech_start
for i in range(n):
    if i < n - 1:
        a, b = cands[bounds[i]][1], cands[bounds[i]][2]
        clauses.append((round(t0, 2), round(a, 2)))
        t0 = b
    else:
        clauses.append((round(t0, 2), round(speech_end, 2)))
for (a, b), (sec, h, e) in zip(clauses, S):
    print(f'{a:7.2f}-{b:7.2f} {sec:9s} {e[:70]}')
json.dump([{'t0': a, 't1': b, 'section': s[0], 'text': s[2]} for (a, b), s in zip(clauses, S)], open('src/long/clauses.json', 'w'), ensure_ascii=False, indent=1)
