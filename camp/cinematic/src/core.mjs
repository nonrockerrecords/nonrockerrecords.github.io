export const STEP = 1 / 60;
export const COLORS = [0xd9ab4d, 0xc96e43, 0xf6f2ee, 0x2f4936, 0xc3a98e];
export const clamp = (n, min, max) => Math.max(min, Math.min(max, n));
export const ease = t => { t = clamp(t, 0, 1); return t * t * (3 - 2 * t); };
export const mix = (a, b, t) => a + (b - a) * ease(t);

// World positions use +Y up in both renderers. No probability affects a catch.
export function exposedCapsules(capsules) {
  return capsules.filter(c => !c.caught && !capsules.some(o =>
    o.id !== c.id && !o.caught && o.y > c.y + c.r * .75 &&
    Math.hypot(o.x - c.x, (o.z || 0) - (c.z || 0)) < (o.r + c.r) * .72));
}
export function selectCatch(capsules, aim, tolerance = .72) {
  return exposedCapsules(capsules)
    .map(c => ({ c, distance: Math.hypot(c.x - aim.x, (c.z || 0) - (aim.z || 0)) }))
    .filter(({c, distance}) => distance <= c.r * tolerance + 1e-7)
    .sort((a, b) => a.distance - b.distance || b.c.y - a.c.y || a.c.id - b.c.id)[0]?.c || null;
}
export class FixedClock {
  constructor() { this.accumulator = 0; }
  tick(delta, step) {
    this.accumulator += Math.min(.1, Math.max(0, delta));
    while (this.accumulator + 1e-9 >= STEP) { step(STEP); this.accumulator -= STEP; }
  }
  reset() { this.accumulator = 0; }
}
export class Round {
  constructor(onState = () => {}) { this.onState = onState; this.reset(); }
  reset() { this.state = 'aim'; this.time = 0; this.caught = null; this.target = null; this.onState('aim'); }
  drop(aim, capsules) {
    if (this.state !== 'aim') return false;
    this.aim = {...aim};
    this.target = selectCatch(capsules, aim);
    this.set('lower'); return true;
  }
  set(state) { this.state = state; this.time = 0; this.onState(state, this.caught); }
  tick(dt, hooks) {
    this.time += dt;
    const durations = { lower: 1.1, close: .5, lift: 1.1, carry: 1, release: .65 };
    if (!durations[this.state]) return;
    hooks.pose(this.state, clamp(this.time / durations[this.state], 0, 1), this);
    if (this.time < durations[this.state]) return;
    if (this.state === 'lower') this.set('close');
    else if (this.state === 'close') {
      this.caught = hooks.capture(this.aim);
      this.set('lift');
    } else if (this.state === 'lift') this.set(this.caught ? 'carry' : 'miss');
    else if (this.state === 'carry') this.set('release');
    else { hooks.deliver(this.caught); this.set('win'); }
  }
}
