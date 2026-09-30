#!/usr/bin/env python3
"""
Generate an original soft ambient 'wedding music' loop for the Khmer e-wedding site.
Gentle khim-like (hammered dulcimer) plucks over a warm pad, pentatonic scale.
Pure stdlib — writes a 16-bit mono WAV.
"""
import wave
import math
import array
import random

SR = 32000          # sample rate
DURATION = 96.0     # seconds (loopable 4-bar-ish phrases)
SEED = 20261121     # wedding date :)
random.seed(SEED)

# C major pentatonic (C D E G A) across two octaves
NOTES = {
    "C3": 130.81, "D3": 146.83, "E3": 164.81, "G3": 196.00, "A3": 220.00,
    "C4": 261.63, "D4": 293.66, "E4": 329.63, "G4": 392.00, "A4": 440.00,
    "C5": 523.25, "D5": 587.33, "E5": 659.25, "G5": 783.99, "A5": 880.00,
}

total = int(SR * DURATION)
buf = [0.0] * total


def add_pluck(t0, freq, amp=0.22, decay=1.4, pan_spark=0.0):
    """Soft bell/khim pluck: stacked sine partials with exponential decay."""
    start = int(t0 * SR)
    length = int(decay * SR)
    for n in range(length):
        i = start + n
        if i >= total:
            break
        t = n / SR
        env = math.exp(-t / (decay * 0.38))
        # soft attack (8 ms) to avoid clicks
        att = min(1.0, t / 0.008) if t < 0.008 else 1.0
        w = (
            math.sin(2 * math.pi * freq * t) * 1.0
            + math.sin(2 * math.pi * freq * 2.0 * t) * 0.28 * math.exp(-t / 0.35)
            + math.sin(2 * math.pi * freq * 3.01 * t) * 0.12 * math.exp(-t / 0.22)
            + math.sin(2 * math.pi * freq * 4.98 * t) * 0.05 * math.exp(-t / 0.12)
        )
        # gentle vibrato shimmer
        w *= 1.0 + pan_spark * math.sin(2 * math.pi * 5.2 * t) * 0.02
        buf[i] += w * env * amp * att


def add_pad(t0, freqs, dur, amp=0.05):
    """Warm detuned pad chord with slow attack/release."""
    start = int(t0 * SR)
    length = int(dur * SR)
    for n in range(length):
        i = start + n
        if i >= total:
            break
        t = n / SR
        # attack 25% / release 30%
        a = min(1.0, t / (dur * 0.25))
        r = min(1.0, (dur - t) / (dur * 0.30))
        env = a * r
        w = 0.0
        for f in freqs:
            w += math.sin(2 * math.pi * f * t) * 1.0
            w += math.sin(2 * math.pi * f * 1.003 * t) * 0.7   # detune
            w += math.sin(2 * math.pi * f * 2 * t) * 0.18
        w /= (len(freqs) * 1.9)
        # slow breath
        w *= 1.0 + 0.12 * math.sin(2 * math.pi * 0.09 * t)
        buf[i] += w * env * amp


# --- Harmonic bed: 4-chord cycle (Cmaj7 / Am7 / G6 / Em7-ish), each 8 s ---
chords = [
    (["C3", "G3", "E4"],),   # C
    (["A3", "E4", "C5"],),   # Am
    (["G3", "D4", "A4"],),   # G
    (["E3", "B3" if "B3" in NOTES else "E4", "G4"],),  # Em-ish
]
chord_freqs = [
    [NOTES["C3"], NOTES["G3"], NOTES["E4"]],
    [NOTES["A3"], NOTES["E4"], NOTES["C5"]],
    [NOTES["G3"], NOTES["D4"], NOTES["A4"]],
    [NOTES["E3"], NOTES["E4"], NOTES["G4"]],
]

t = 0.0
ci = 0
while t < DURATION:
    add_pad(t, chord_freqs[ci % len(chord_freqs)], 8.4, amp=0.062)
    ci += 1
    t += 8.0

# --- Melody: flowing pentatonic phrases, phrase every 4 beats (1.9 s) ---
melody_pool = ["C4", "D4", "E4", "G4", "A4", "C5", "D5", "E5", "G4", "A4", "E4", "D4"]
# hand-shaped phrase seeds for musicality (indices into melody_pool)
phrases = [
    [4, 2, 4, 5], [6, 5, 4, 2], [2, 3, 4, 6], [5, 4, 2, 1],
    [0, 2, 3, 4], [5, 6, 5, 4], [3, 2, 0, 2], [4, 5, 6, 7],
]

beat = 0.95   # gentle slow tempo
t = beat * 2  # small intro gap
pi = 0
while t < DURATION - 4:
    phrase = phrases[pi % len(phrases)]
    # main phrase notes
    for k, idx in enumerate(phrase):
        amp = 0.20 if k == 0 else 0.155 + 0.03 * random.random()
        add_pluck(t + k * beat, NOTES[melody_pool[idx]], amp=amp,
                  decay=1.7 + 0.5 * random.random(), pan_spark=1.0)
        # occasional soft echo octave below
        if k == 0 and random.random() < 0.5:
            add_pluck(t + k * beat + 0.02, NOTES[melody_pool[idx]] / 2,
                      amp=0.06, decay=2.4)
    # sparse ornament sparkles between phrases
    if random.random() < 0.65:
        orn = random.choice(["E5", "G5", "A5", "D5"])
        add_pluck(t + beat * 3.35, NOTES[orn], amp=0.075, decay=1.5, pan_spark=1.0)
    t += beat * 4
    pi += 1

# --- Soft delay/reverb-ish tail (simple feedback comb) ---
delay = int(0.28 * SR)
feedback = 0.24
delayed = buf[:]
for i in range(delay, total):
    buf[i] += delayed[i - delay] * feedback
    if i >= delay * 2:
        buf[i] += delayed[i - delay * 2] * (feedback ** 2) * 0.5

# --- Simple one-pole low-pass to warm the mix (skip high fizz) ---
alpha = 0.28
prev = 0.0
for i in range(total):
    prev = prev + alpha * (buf[i] - prev)
    buf[i] = prev

# --- Gentle fade at the seam so loop restart is soft ---
fade = int(1.2 * SR)
for i in range(fade):
    g = i / fade
    buf[i] *= 0.25 + 0.75 * g
    buf[total - 1 - i] *= 0.25 + 0.75 * g

# --- Normalize + soft clip ---
peak = max(abs(x) for x in buf) or 1.0
gain = 0.82 / peak
out = array.array("h")
for x in buf:
    y = x * gain
    y = math.tanh(y * 1.15) * 0.9      # soft saturation for warmth
    out.append(int(max(-1.0, min(1.0, y)) * 32767))

with wave.open("/home/user/khmer-wedding/audio/wedding-music.wav", "w") as w:
    w.setnchannels(1)
    w.setsampwidth(2)
    w.setframerate(SR)
    w.writeframes(out.tobytes())

print("done", total / SR, "s peak was", peak)
