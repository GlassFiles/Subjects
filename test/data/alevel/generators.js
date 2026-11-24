// Rep Max question generators.
// Each RM.gen call registers one generator. make(r) builds a fresh version of a calculation question
// using only the seeded PRNG r(), and computes the answer in code. tools/test_generators.js recomputes
// every answer independently. Every make() is self-contained (no shared helpers) so it can be read alone.

/* ============================ Computer Science (OCR H446) ============================ */

RM.gen({
  id: "g-cs-den2bin", s: "cs", t: "1.4.1", lv: 1,
  make(r) {
    const ri = (lo, hi) => lo + Math.floor(r() * (hi - lo + 1));
    const pick3 = (ans, pool) => { const o = []; for (const d of pool) if (d != null && d !== ans && o.indexOf(d) < 0) o.push(d); return o.length >= 3 ? o.slice(0, 3) : null; };
    const b8 = n => n.toString(2).padStart(8, "0");
    for (let k = 0; k < 500; k++) {
      const n = ri(20, 250), ans = b8(n);
      const ds = pick3(ans, [
        ans.split("").reverse().join(""),   // remainders read in the wrong order
        n.toString(2).padEnd(8, "0"),       // zeros added on the wrong end
        b8(n ^ (1 << ri(0, 7))),            // one column wrong
        b8(n ^ (1 << ri(0, 7)))
      ]);
      if (!ds) continue;
      const a = ri(0, 3), o = ds.slice(); o.splice(a, 0, ans);
      const parts = []; for (let v = 128; v >= 1; v >>= 1) if (n & v) parts.push(v);
      return {
        q: `What is the denary number ${n} as an 8-bit binary number?`, o, a,
        x: `${n} = ${parts.join(" + ")}. Put a 1 in each of those place-value columns and 0 in the rest: ${ans}. Reading remainders in the wrong order reverses the bits.`,
        p: { n }
      };
    }
    throw new Error("g-cs-den2bin: no valid question");
  }
});

RM.gen({
  id: "g-cs-bin2den", s: "cs", t: "1.4.1", lv: 1,
  make(r) {
    const ri = (lo, hi) => lo + Math.floor(r() * (hi - lo + 1));
    const pick3 = (ans, pool) => { const o = []; for (const d of pool) if (d != null && d !== ans && o.indexOf(d) < 0) o.push(d); return o.length >= 3 ? o.slice(0, 3) : null; };
    const b8 = n => n.toString(2).padStart(8, "0");
    for (let k = 0; k < 500; k++) {
      const n = ri(20, 254), on = [], off = [];
      for (let i = 0; i < 8; i++) ((n >> i) & 1 ? on : off).push(1 << i);
      if (on.length < 3) continue;
      const ans = String(n);
      const ds = pick3(ans, [
        String(parseInt(b8(n).split("").reverse().join(""), 2)), // read from the wrong end
        String(n - on[ri(0, on.length - 1)]),                     // one 1 missed
        String(n + off[ri(0, off.length - 1)]),                   // a 0 counted as 1
        String(2 * n)                                             // place values started at 2
      ]);
      if (!ds) continue;
      const a = ri(0, 3), o = ds.slice(); o.splice(a, 0, ans);
      return {
        q: `What is the 8-bit binary number ${b8(n)} in denary?`, o, a,
        x: `Add the place values of the columns that hold a 1: ${on.slice().reverse().join(" + ")} = ${n}. The rightmost bit is worth 1 and the leftmost 128.`,
        p: { n }
      };
    }
    throw new Error("g-cs-bin2den: no valid question");
  }
});

RM.gen({
  id: "g-cs-den2hex", s: "cs", t: "1.4.1", lv: 1,
  make(r) {
    const ri = (lo, hi) => lo + Math.floor(r() * (hi - lo + 1));
    const pick3 = (ans, pool) => { const o = []; for (const d of pool) if (d != null && d !== ans && o.indexOf(d) < 0) o.push(d); return o.length >= 3 ? o.slice(0, 3) : null; };
    const H = "0123456789ABCDEF", hx = v => H[v >> 4] + H[v & 15];
    for (let k = 0; k < 500; k++) {
      const n = ri(26, 255), hi = n >> 4, lo = n & 15, ans = hx(n);
      const ds = pick3(ans, [
        H[lo] + H[hi],                                                          // digits swapped
        lo >= 10 ? H[hi] + H[lo - 1] : (hi >= 10 ? H[hi - 1] + H[lo] : null),   // letters counted from A = 11
        hx(n + 16 <= 255 ? n + 16 : n - 16),                                    // wrong number of 16s
        H[hi] + H[(lo + 1) % 16]
      ]);
      if (!ds) continue;
      const a = ri(0, 3), o = ds.slice(); o.splice(a, 0, ans);
      const lets = (hi === lo ? [hi] : [hi, lo]).filter(d => d >= 10).map(d => `${d} is ${H[d]}`);
      return {
        q: `What is the denary number ${n} in hexadecimal?`, o, a,
        x: `${n} ÷ 16 = ${hi} remainder ${lo}${lets.length ? ` (${lets.join(", ")})` : ""}, so ${n} = ${ans} in hex. The first digit counts 16s and the second counts 1s.`,
        p: { n }
      };
    }
    throw new Error("g-cs-den2hex: no valid question");
  }
});

RM.gen({
  id: "g-cs-hex2den", s: "cs", t: "1.4.1", lv: 1,
  make(r) {
    const ri = (lo, hi) => lo + Math.floor(r() * (hi - lo + 1));
    const pick3 = (ans, pool) => { const o = []; for (const d of pool) if (d != null && d !== ans && o.indexOf(d) < 0) o.push(d); return o.length >= 3 ? o.slice(0, 3) : null; };
    const H = "0123456789ABCDEF", hx = v => H[v >> 4] + H[v & 15];
    for (let k = 0; k < 500; k++) {
      const n = ri(26, 255), hi = n >> 4, lo = n & 15, ans = String(n);
      const ds = pick3(ans, [
        String(lo * 16 + hi),                                                         // digits read the wrong way round
        String(hi * 10 + lo),                                                         // first digit taken as tens
        lo >= 10 && lo < 15 ? String(n + 1) : (hi >= 10 && hi < 15 ? String(n + 16) : null), // letters counted from A = 11
        String(n + 16 <= 255 ? n + 16 : n - 16)
      ]);
      if (!ds) continue;
      const a = ri(0, 3), o = ds.slice(); o.splice(a, 0, ans);
      const lets = (hi === lo ? [hi] : [hi, lo]).filter(d => d >= 10).map(d => `${H[d]} = ${d}`);
      return {
        q: `What is the hexadecimal number ${hx(n)} in denary?`, o, a,
        x: `${hx(n)} = ${hi} × 16 + ${lo} = ${16 * hi} + ${lo} = ${n}${lets.length ? ` (${lets.join(", ")})` : ""}. The left digit counts 16s, not 10s.`,
        p: { n }
      };
    }
    throw new Error("g-cs-hex2den: no valid question");
  }
});

RM.gen({
  id: "g-cs-hex2bin", s: "cs", t: "1.4.1", lv: 1,
  make(r) {
    const ri = (lo, hi) => lo + Math.floor(r() * (hi - lo + 1));
    const pick3 = (ans, pool) => { const o = []; for (const d of pool) if (d != null && d !== ans && o.indexOf(d) < 0) o.push(d); return o.length >= 3 ? o.slice(0, 3) : null; };
    const H = "0123456789ABCDEF", hx = v => H[v >> 4] + H[v & 15];
    const nib = v => v.toString(2).padStart(4, "0"), rv = s => s.split("").reverse().join("");
    for (let k = 0; k < 500; k++) {
      const n = ri(17, 255), hi = n >> 4, lo = n & 15;
      if (hi === lo) continue;
      const ans = nib(hi) + nib(lo);
      const ds = pick3(ans, [
        nib(lo) + nib(hi),                                                                       // nibbles swapped
        rv(nib(hi)) + rv(nib(lo)),                                                               // bits of each nibble reversed
        lo >= 10 && lo < 15 ? nib(hi) + nib(lo + 1) : (hi >= 10 && hi < 15 ? nib(hi + 1) + nib(lo) : null), // letters counted from A = 11
        nib(hi) + nib(lo ^ (1 << ri(0, 3)))                                                      // one bit wrong
      ]);
      if (!ds) continue;
      const a = ri(0, 3), o = ds.slice(); o.splice(a, 0, ans);
      return {
        q: `What is the hexadecimal number ${hx(n)} in 8-bit binary?`, o, a,
        x: `Convert each hex digit to 4 bits on its own: ${H[hi]} = ${nib(hi)} and ${H[lo]} = ${nib(lo)}, so ${hx(n)} = ${ans}.${hi >= 10 || lo >= 10 ? " Remember A = 10, not 11." : ""}`,
        p: { n }
      };
    }
    throw new Error("g-cs-hex2bin: no valid question");
  }
});

RM.gen({
  id: "g-cs-neg2tc", s: "cs", t: "1.4.1", lv: 2,
  make(r) {
    const ri = (lo, hi) => lo + Math.floor(r() * (hi - lo + 1));
    const pick3 = (ans, pool) => { const o = []; for (const d of pool) if (d != null && d !== ans && o.indexOf(d) < 0) o.push(d); return o.length >= 3 ? o.slice(0, 3) : null; };
    const b8 = n => n.toString(2).padStart(8, "0");
    for (let k = 0; k < 500; k++) {
      const m = ri(2, 127), ans = b8(256 - m);
      const ds = pick3(ans, [b8(128 + m), b8(255 - m), b8(m)]); // sign and magnitude, one's complement, positive
      if (!ds) continue;
      const a = ri(0, 3), o = ds.slice(); o.splice(a, 0, ans);
      return {
        q: `What is -${m} as an 8-bit two's complement binary number?`, o, a,
        x: `+${m} is ${b8(m)}. Invert every bit to get ${b8(255 - m)}, then add 1: ${ans}. Check: -128 + ${128 - m} = -${m}. ${b8(128 + m)} would be sign and magnitude.`,
        p: { m }
      };
    }
    throw new Error("g-cs-neg2tc: no valid question");
  }
});

RM.gen({
  id: "g-cs-tc2den", s: "cs", t: "1.4.1", lv: 2,
  make(r) {
    const ri = (lo, hi) => lo + Math.floor(r() * (hi - lo + 1));
    const pick3 = (ans, pool) => { const o = []; for (const d of pool) if (d != null && d !== ans && o.indexOf(d) < 0) o.push(d); return o.length >= 3 ? o.slice(0, 3) : null; };
    const b8 = n => n.toString(2).padStart(8, "0");
    for (let k = 0; k < 500; k++) {
      const n = ri(129, 254), ans = String(n - 256);
      const ds = pick3(ans, [String(n), String(128 - n), String(n - 255)]); // unsigned, sign and magnitude, forgot the +1
      if (!ds) continue;
      const a = ri(0, 3), o = ds.slice(); o.splice(a, 0, ans);
      return {
        q: `The 8-bit two's complement pattern ${b8(n)} represents which denary number?`, o, a,
        x: `The leftmost bit is worth -128 and the other seven bits give ${n - 128}, so the value is -128 + ${n - 128} = ${n - 256}. ${n} is the unsigned reading.`,
        p: { n }
      };
    }
    throw new Error("g-cs-tc2den: no valid question");
  }
});

RM.gen({
  id: "g-cs-binadd", s: "cs", t: "1.4.1", lv: 2,
  make(r) {
    const ri = (lo, hi) => lo + Math.floor(r() * (hi - lo + 1));
    const b8 = n => n.toString(2).padStart(8, "0");
    const want = r() < 0.5;
    for (let k = 0; k < 2000; k++) {
      const A = ri(20, 235), B = ri(20, 235), s = A + B;
      if ((s > 255) !== want || (A & B) === 0) continue;
      const res = b8(s & 255), xr = b8(A ^ B), f = v => (v ? "overflow" : "no overflow");
      if (res === xr) continue;
      const ans = `${res}, ${f(want)}`;
      const ds = [`${res}, ${f(!want)}`, `${xr}, ${f(want)}`, `${xr}, ${f(!want)}`]; // XOR = adding without carries
      const a = ri(0, 3), o = ds.slice(); o.splice(a, 0, ans);
      return {
        q: `Add the 8-bit unsigned binary numbers ${b8(A)} and ${b8(B)}. What is the 8-bit result, and does overflow occur?`, o, a,
        x: want
          ? `${A} + ${B} = ${s}, more than 255, so the carry out of the leftmost bit is lost: overflow. The 8 bits left hold ${s} - 256 = ${s - 256}, which is ${res}.`
          : `${A} + ${B} = ${s}, which fits in 8 bits (at most 255), so there is no overflow: ${res}. Carry 1 whenever a column adds up to 2 or 3.`,
        p: { A, B }
      };
    }
    throw new Error("g-cs-binadd: no valid question");
  }
});

RM.gen({
  id: "g-cs-shift", s: "cs", t: "1.4.1", lv: 2,
  make(r) {
    const ri = (lo, hi) => lo + Math.floor(r() * (hi - lo + 1));
    const pick3 = (ans, pool) => { const o = []; for (const d of pool) if (d != null && d !== ans && o.indexOf(d) < 0) o.push(d); return o.length >= 3 ? o.slice(0, 3) : null; };
    const b8 = n => n.toString(2).padStart(8, "0"), fm = v => `${b8(v)} (${v})`;
    const ones = v => v.toString(2).split("1").length - 1;
    for (let k = 0; k < 500; k++) {
      const dir = r() < 0.5 ? "L" : "R", sh = ri(1, 3), f = 2 ** sh, pl = sh > 1 ? "places" : "place";
      let n, res, pool, x;
      if (dir === "L") {
        n = ri(3, (256 >> (sh + 1)) - 1);        // no 1s are lost, even if shifted one place too far
        if (ones(n) < 2) continue;
        res = n << sh;
        pool = [n >> sh, n << (sh + 1), sh > 1 ? n << (sh - 1) : ((n << sh) | (f - 1)) & 255];
        x = `Each place left doubles the value, so ${sh} ${pl} multiplies by ${f}: ${n} × ${f} = ${res}. Zeros fill the vacated bits on the right.`;
      } else {
        n = ri(24, 255);
        if (ones(n) < 2) continue;
        res = n >> sh;
        const msb = n >= 128, arith = (n >> sh) | ((0xFF << (8 - sh)) & 0xFF), rot = ((n >> sh) | (n << (8 - sh))) & 255;
        pool = msb ? [(n << sh) & 255, arith, n >> (sh + 1), rot] : [(n << sh) & 255, n >> (sh + 1), rot, sh > 1 ? n >> (sh - 1) : arith];
        const rem = n % f;
        x = `Each place right halves the value, so ${sh} ${pl} divides by ${f}: ${n} ÷ ${f} = ${res}${rem ? ` remainder ${rem}, which is lost` : ""}. A logical shift fills with 0s${msb ? "; an arithmetic shift would copy the sign bit" : ""}.`;
      }
      const ans = fm(res), ds = pick3(ans, pool.map(fm));
      if (!ds) continue;
      const a = ri(0, 3), o = ds.slice(); o.splice(a, 0, ans);
      return {
        q: `The 8-bit pattern ${b8(n)} (denary ${n}) is given a logical shift ${dir === "L" ? "left" : "right"} by ${sh} ${pl}. What is the result?`, o, a, x,
        p: { n, k: sh, dir }
      };
    }
    throw new Error("g-cs-shift: no valid question");
  }
});

RM.gen({
  id: "g-cs-bitwise", s: "cs", t: "1.4.1", lv: 2,
  make(r) {
    const ri = (lo, hi) => lo + Math.floor(r() * (hi - lo + 1));
    const pick3 = (ans, pool) => { const o = []; for (const d of pool) if (d != null && d !== ans && o.indexOf(d) < 0) o.push(d); return o.length >= 3 ? o.slice(0, 3) : null; };
    const b8 = n => n.toString(2).padStart(8, "0");
    const ops = { AND: (x, y) => x & y, OR: (x, y) => x | y, XOR: (x, y) => x ^ y }, names = ["AND", "OR", "XOR"];
    const rule = { AND: "1 only where both bits are 1", OR: "1 where either bit is 1", XOR: "1 only where the two bits differ" };
    for (let k = 0; k < 500; k++) {
      const op = names[ri(0, 2)], A = ri(1, 254), B = ri(1, 254);
      if (A === B || (A & B) === 0) continue;
      const v = ops[op](A, B), ans = b8(v);
      const ds = pick3(ans, names.filter(m => m !== op).map(m => b8(ops[m](A, B))).concat([b8(~v & 255)]));
      if (!ds) continue;
      const a = ri(0, 3), o = ds.slice(); o.splice(a, 0, ans);
      return {
        q: `What is ${b8(A)} ${op} ${b8(B)}?`, o, a,
        x: `Work column by column. ${op} gives ${rule[op]}, so the result is ${ans}.`,
        p: { A, B, op }
      };
    }
    throw new Error("g-cs-bitwise: no valid question");
  }
});

RM.gen({
  id: "g-cs-binsearch", s: "cs", t: "2.3.1", lv: 2,
  make(r) {
    const ri = (lo, hi) => lo + Math.floor(r() * (hi - lo + 1));
    const pick3 = (ans, pool) => { const o = []; for (const d of pool) if (d != null && d !== ans && o.indexOf(d) < 0) o.push(d); return o.length >= 3 ? o.slice(0, 3) : null; };
    for (let k = 0; k < 500; k++) {
      // powers of two are left out: there, "log2 n" and "floor(log2 n) + 1" disagree
      const n = r() < 0.5 ? [1, 2, 3, 5, 6, 8][ri(0, 5)] * 10 ** ri(1, 4) : ri(10, 5000);
      if ((n & (n - 1)) === 0) continue;
      let c = 0; while (2 ** c <= n) c++;        // c = floor(log2 n) + 1
      const N = String(n).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
      const ans = String(c), ds = pick3(ans, [String(c - 1), String(c + 1), String(r() < 0.5 ? n : Math.ceil(n / 2))]);
      if (!ds) continue;
      const a = ri(0, 3), o = ds.slice(); o.splice(a, 0, ans);
      return {
        q: `A sorted list holds ${N} items. What is the maximum number of comparisons a binary search needs to find an item or show it is not there?`, o, a,
        x: `$2^{${c - 1}}=${2 ** (c - 1)}\\le ${n}<${2 ** c}=2^{${c}}$. Each comparison halves the items still in play, so at most ${c} are needed. A linear search could need ${N}.`,
        p: { n }
      };
    }
    throw new Error("g-cs-binsearch: no valid question");
  }
});

RM.gen({
  id: "g-cs-boolrow", s: "cs", t: "1.4.3", lv: 1,
  make(r) {
    const ri = (lo, hi) => lo + Math.floor(r() * (hi - lo + 1));
    const N = e => ["NOT", e], AND = (x, y) => ["AND", x, y], OR = (x, y) => ["OR", x, y], XOR = (x, y) => ["XOR", x, y];
    const T = [OR(N(AND("A", "B")), "C"), AND(OR("A", "B"), N("C")), AND(N(OR("A", "B")), "C"), AND(XOR("A", "B"), "C"),
      OR(AND("A", N("B")), "C"), AND(N("A"), OR("B", "C")), AND(OR("A", "C"), N(AND("B", "C"))), OR(XOR("A", "C"), AND("A", "B")),
      AND(N(XOR("A", "B")), "C"), AND(OR(N("A"), "B"), "C"), N(AND(OR("A", "B"), "C")), OR(AND("A", "B"), AND(N("A"), "C")),
      AND(OR("A", N("C")), "B"), XOR("A", OR("B", "C"))];
    const ev = (e, v) => typeof e === "string" ? v[e] : e[0] === "NOT" ? 1 - ev(e[1], v) : e[0] === "AND" ? ev(e[1], v) & ev(e[2], v) : e[0] === "OR" ? ev(e[1], v) | ev(e[2], v) : ev(e[1], v) ^ ev(e[2], v);
    // NOT binds to the next letter or bracket; every AND/OR/XOR inside another is bracketed, so precedence never matters
    const pr = (e, top) => { if (typeof e === "string") return e; if (e[0] === "NOT") return "NOT " + (typeof e[1] === "string" ? e[1] : "(" + pr(e[1], true) + ")"); const s = pr(e[1], false) + " " + e[0] + " " + pr(e[2], false); return top ? s : "(" + s + ")"; };
    const steps = (e, v, out) => { if (typeof e === "string") return out; if (e[0] === "NOT") steps(e[1], v, out); else { steps(e[1], v, out); steps(e[2], v, out); } out.push(pr(e, true) + " = " + ev(e, v)); return out; };
    const why = (e, v, nm) => { const s = e[0] === "NOT" ? steps(e[1], v, []) : steps(e[2], v, steps(e[1], v, [])); const last = e[0] === "NOT" ? `NOT ${ev(e[1], v)}` : `${ev(e[1], v)} ${e[0]} ${ev(e[2], v)}`; return (s.length ? s.join(", ") + ", so " : "") + `${nm} = ${last} = ${ev(e, v)}`; };
    const perm = () => { const v = ["A", "B", "C"], o = []; while (v.length) o.push(v.splice(ri(0, v.length - 1), 1)[0]); return o; };
    const rl = (e, pm) => (typeof e === "string" ? pm["ABC".indexOf(e)] : [e[0]].concat(e.slice(1).map(c => rl(c, pm))));
    for (let k = 0; k < 500; k++) {
      const e = rl(T[ri(0, T.length - 1)], perm()), rows = [];
      for (let i = 0; i < 8; i++) rows.push({ A: (i >> 2) & 1, B: (i >> 1) & 1, C: i & 1 });
      const t = ri(0, 1), yes = rows.filter(v => ev(e, v) === t), no = rows.filter(v => ev(e, v) !== t);
      if (yes.length < 1 || no.length < 3) continue;
      const hit = yes[ri(0, yes.length - 1)], rest = no.slice(), ch = [];
      while (ch.length < 3) ch.push(rest.splice(ri(0, rest.length - 1), 1)[0]);
      const fm = v => `A = ${v.A}, B = ${v.B}, C = ${v.C}`;
      const ans = fm(hit), a = ri(0, 3), o = ch.map(fm); o.splice(a, 0, ans);
      return {
        q: `Q = ${pr(e, true)}. For which inputs is Q = ${t}?`, o, a,
        x: `For ${ans}: ${why(e, hit, "Q")}. The other three inputs give Q = ${1 - t}.`,
        p: { expr: pr(e, true), t, A: hit.A, B: hit.B, C: hit.C }
      };
    }
    throw new Error("g-cs-boolrow: no valid question");
  }
});

RM.gen({
  id: "g-cs-boolpair", s: "cs", t: "1.4.3", lv: 2,
  make(r) {
    const ri = (lo, hi) => lo + Math.floor(r() * (hi - lo + 1));
    const N = e => ["NOT", e], AND = (x, y) => ["AND", x, y], OR = (x, y) => ["OR", x, y], XOR = (x, y) => ["XOR", x, y];
    const T = [OR(N(AND("A", "B")), "C"), AND(OR("A", "B"), N("C")), AND(N(OR("A", "B")), "C"), AND(XOR("A", "B"), "C"),
      OR(AND("A", N("B")), "C"), AND(N("A"), OR("B", "C")), OR(XOR("A", "C"), AND("A", "B")),
      AND(N(XOR("A", "B")), "C"), AND(OR(N("A"), "B"), "C"), N(AND(OR("A", "B"), "C")),
      AND(OR("A", N("C")), "B"), XOR("A", OR("B", "C"))];
    const ev = (e, v) => typeof e === "string" ? v[e] : e[0] === "NOT" ? 1 - ev(e[1], v) : e[0] === "AND" ? ev(e[1], v) & ev(e[2], v) : e[0] === "OR" ? ev(e[1], v) | ev(e[2], v) : ev(e[1], v) ^ ev(e[2], v);
    const pr = (e, top) => { if (typeof e === "string") return e; if (e[0] === "NOT") return "NOT " + (typeof e[1] === "string" ? e[1] : "(" + pr(e[1], true) + ")"); const s = pr(e[1], false) + " " + e[0] + " " + pr(e[2], false); return top ? s : "(" + s + ")"; };
    const steps = (e, v, out) => { if (typeof e === "string") return out; if (e[0] === "NOT") steps(e[1], v, out); else { steps(e[1], v, out); steps(e[2], v, out); } out.push(pr(e, true) + " = " + ev(e, v)); return out; };
    const why = (e, v, nm) => { const s = e[0] === "NOT" ? steps(e[1], v, []) : steps(e[2], v, steps(e[1], v, [])); const last = e[0] === "NOT" ? `NOT ${ev(e[1], v)}` : `${ev(e[1], v)} ${e[0]} ${ev(e[2], v)}`; return (s.length ? s.join(", ") + ", so " : "") + `${nm} = ${last} = ${ev(e, v)}`; };
    const perm = () => { const w = ["A", "B", "C"], o = []; while (w.length) o.push(w.splice(ri(0, w.length - 1), 1)[0]); return o; };
    const rl = (e, pm) => (typeof e === "string" ? pm["ABC".indexOf(e)] : [e[0]].concat(e.slice(1).map(c => rl(c, pm))));
    const i = ri(0, T.length - 1); let j = ri(0, T.length - 2); if (j >= i) j++;
    const E1 = rl(T[i], perm()), E2 = rl(T[j], perm());
    const v = { A: ri(0, 1), B: ri(0, 1), C: ri(0, 1) }, P = ev(E1, v), Q = ev(E2, v);
    const fm = (x, y) => `P = ${x}, Q = ${y}`, ans = fm(P, Q);
    const o = [[0, 0], [0, 1], [1, 0], [1, 1]].filter(([x, y]) => x !== P || y !== Q).map(([x, y]) => fm(x, y));
    const a = ri(0, 3); o.splice(a, 0, ans);
    return {
      q: `A = ${v.A}, B = ${v.B}, C = ${v.C}. What are the values of P = ${pr(E1, true)} and Q = ${pr(E2, true)}?`, o, a,
      x: `${why(E1, v, "P")}. ${why(E2, v, "Q")}.`,
      p: { A: v.A, B: v.B, C: v.C, P: pr(E1, true), Q: pr(E2, true) }
    };
  }
});

/* ============================ Maths (AQA 7357) ============================ */

RM.gen({
  id: "g-ma-fracindex", s: "maths", t: "p1-01", lv: 1,
  make(r) {
    const ri = (lo, hi) => lo + Math.floor(r() * (hi - lo + 1));
    const pick3 = (ans, pool) => { const o = []; for (const d of pool) if (d != null && d !== ans && o.indexOf(d) < 0) o.push(d); return o.length >= 3 ? o.slice(0, 3) : null; };
    const g = (x, y) => (y ? g(y, x % y) : Math.abs(x));
    const fr = (n, d) => { if (d < 0) { n = -n; d = -d; } const k = g(n, d) || 1; n /= k; d /= k; return d === 1 ? `${n}` : `${n < 0 ? "-" : ""}\\frac{${Math.abs(n)}}{${d}}`; };
    for (let k = 0; k < 500; k++) {
      const n = [2, 2, 3, 3, 4, 5][ri(0, 5)], c = n === 4 ? ri(2, 3) : n === 5 ? 2 : ri(2, 5), b = c ** n, m = ri(1, 4);
      if (g(m, n) !== 1 || c ** m > 256) continue;
      const neg = r() < 0.35, val = c ** m, ans = neg ? fr(1, val) : `${val}`;
      const ds = pick3(ans, neg
        ? [`${val}`, `-${val}`, fr(1, c * m), fr(-1, val)]                                   // ignored the minus, made it negative, multiplied
        : [`${c * m}`, fr(b * m, n), fr(1, val), m > 1 ? `${c}` : `${b}`]);                  // multiplied, index as multiplier, treated as negative index, forgot power/root
      if (!ds) continue;
      const a = ri(0, 3), o = ds.map(z => `$${z}$`); o.splice(a, 0, `$${ans}$`);
      const root = n === 2 ? `\\sqrt{${b}}` : `\\sqrt[${n}]{${b}}`, base = `${b}^{\\frac{${m}}{${n}}}`;
      const step = m === 1 ? `${root}=${c}` : `\\left(${root}\\right)^{${m}}=${c}^{${m}}=${val}`;
      return {
        q: `Evaluate $${b}^{${neg ? "-" : ""}\\frac{${m}}{${n}}}$.`, o, a,
        x: neg
          ? `$${base}=${step}$, and the negative index means the reciprocal, so the answer is $${ans}$. It does not make the number negative.`
          : `$${base}=${step}$. The denominator of the index is the root and the numerator is the power.`,
        p: { b, m, n, neg }
      };
    }
    throw new Error("g-ma-fracindex: no valid question");
  }
});

RM.gen({
  id: "g-ma-indexlaws", s: "maths", t: "p1-01", lv: 1,
  make(r) {
    const ri = (lo, hi) => lo + Math.floor(r() * (hi - lo + 1));
    const pick3 = (ans, pool) => { const o = []; for (const d of pool) if (d != null && d !== ans && o.indexOf(d) < 0) o.push(d); return o.length >= 3 ? o.slice(0, 3) : null; };
    for (let k = 0; k < 500; k++) {
      const v = ["x", "y", "a", "p", "t"][ri(0, 4)], m = ri(-3, 9), n = ri(-4, 8), d = ri(1, 6), e = m + n - d;
      if (m === 0 || n === 0 || e === 0) continue;
      const pw = z => (z === 0 ? "1" : z === 1 ? v : `${v}^{${z}}`);
      const ans = pw(e);
      const ds = pick3(ans, [m + n + d, m * n - d, n < 0 ? m - n - d : null, (m * n) % d === 0 ? m * n / d : null, m + n]
        .map(z => (z == null ? null : pw(z))));            // added the divisor, multiplied indices, sign slip, divided indices
      if (!ds) continue;
      const a = ri(0, 3), o = ds.map(z => `$${z}$`); o.splice(a, 0, `$${ans}$`);
      return {
        q: `Simplify $${pw(m)}\\times ${pw(n)}\\div ${pw(d)}$.`, o, a,
        x: `Add indices when multiplying and subtract when dividing: $${m}+${n < 0 ? `(${n})` : n}-${d}=${e}$, giving $${ans}$. Do not multiply the indices.`,
        p: { v, m, n, d }
      };
    }
    throw new Error("g-ma-indexlaws: no valid question");
  }
});

RM.gen({
  id: "g-ma-surds", s: "maths", t: "p1-01", lv: 2,
  make(r) {
    const ri = (lo, hi) => lo + Math.floor(r() * (hi - lo + 1));
    const pick3 = (ans, pool) => { const o = []; for (const d of pool) if (d != null && d !== ans && o.indexOf(d) < 0) o.push(d); return o.length >= 3 ? o.slice(0, 3) : null; };
    const sq = N => { let k = 1; for (let i = 2; i * i <= N; i++) if (N % (i * i) === 0) k = i; return [k, N / (k * k)]; };
    const sf = (k, m) => (m === 1 ? `${k}` : k === 1 ? `\\sqrt{${m}}` : `${k}\\sqrt{${m}}`);
    for (let k = 0; k < 500; k++) {
      const b = [2, 3, 5, 6, 7, 10][ri(0, 5)], plus = r() < 0.6;
      let a1 = ri(2, 6), c1 = ri(2, 6);
      if (a1 === c1) continue;
      if (!plus && a1 < c1) { const t = a1; a1 = c1; c1 = t; }
      const P = a1 * a1 * b, Q = c1 * c1 * b;
      if (P > 200 || Q > 200) continue;
      const ans = sf(plus ? a1 + c1 : a1 - c1, b), w = sq(plus ? P + Q : P - Q);
      const ds = pick3(ans, [sf(w[0], w[1]), sf(a1 * c1, b), sf(plus ? a1 * a1 + c1 * c1 : a1 * a1 - c1 * c1, b)]); // combined under one root, multiplied, did not root the squares
      if (!ds) continue;
      const a = ri(0, 3), o = ds.map(z => `$${z}$`); o.splice(a, 0, `$${ans}$`);
      return {
        q: `Simplify $\\sqrt{${P}}${plus ? "+" : "-"}\\sqrt{${Q}}$.`, o, a,
        x: `$\\sqrt{${P}}=\\sqrt{${a1 * a1}}\\sqrt{${b}}=${sf(a1, b)}$ and $\\sqrt{${Q}}=${sf(c1, b)}$, so the answer is $${ans}$. You cannot ${plus ? "add" : "subtract"} the numbers under the roots.`,
        p: { P, Q, plus }
      };
    }
    throw new Error("g-ma-surds: no valid question");
  }
});

RM.gen({
  id: "g-ma-discrim", s: "maths", t: "p1-02", lv: 1,
  make(r) {
    const ri = (lo, hi) => lo + Math.floor(r() * (hi - lo + 1));
    const pick3 = (ans, pool) => { const o = []; for (const d of pool) if (d != null && d !== ans && o.indexOf(d) < 0) o.push(d); return o.length >= 3 ? o.slice(0, 3) : null; };
    const sg = (k, s, first) => (k === 0 ? "" : (k < 0 ? "-" : first ? "" : "+") + (Math.abs(k) === 1 && s ? "" : Math.abs(k)) + s);
    const poly = ts => { let out = ""; for (const [k, s] of ts) out += sg(k, s, out === ""); return out || "0"; };
    const ph = d => (d > 0 ? "Two distinct real roots" : d === 0 ? "One repeated real root" : "No real roots");
    const opt = d => `${ph(d)}; $b^2-4ac=${d}$`;
    for (let k = 0; k < 2000; k++) {
      const type = ri(0, 2); let a, b, c;
      if (type === 1) { const p0 = ri(1, 3), q0 = ri(-5, 5), s0 = r() < 0.25 ? -1 : 1; if (q0 === 0) continue; a = s0 * p0 * p0; b = s0 * 2 * p0 * q0; c = s0 * q0 * q0; }
      else { a = ri(1, 4) * (r() < 0.2 ? -1 : 1); b = ri(-9, 9); c = ri(-9, 9); if (c === 0) continue; }
      const D = b * b - 4 * a * c;
      if ((type === 0 && D <= 0) || (type === 2 && D >= 0)) continue;
      const ans = opt(D);
      const ds = pick3(ans, [b * b + 4 * a * c, b * b - 2 * a * c, b !== 0 ? -b * b - 4 * a * c : null, b - 4 * a * c, 4 * a * c - b * b]
        .map(z => (z == null ? null : opt(z))));       // sign slip, 2ac, (-b)^2 taken as negative, b not squared, reversed
      if (!ds) continue;
      const a0 = ri(0, 3), o = ds.slice(); o.splice(a0, 0, ans);
      return {
        q: `Which statement about the roots of $${poly([[a, "x^2"], [b, "x"], [c, ""]])}=0$ is correct?`, o, a: a0,
        x: `$b^2-4ac=(${b})^2-4(${a})(${c})=${b * b}${4 * a * c < 0 ? "+" : "-"}${Math.abs(4 * a * c)}=${D}$, which is ${D > 0 ? "positive" : D === 0 ? "zero" : "negative"}, so: ${ph(D).toLowerCase()}. Take care with the signs.`,
        p: { a, b, c }
      };
    }
    throw new Error("g-ma-discrim: no valid question");
  }
});

RM.gen({
  id: "g-ma-turnpt", s: "maths", t: "p1-02", lv: 2,
  make(r) {
    const ri = (lo, hi) => lo + Math.floor(r() * (hi - lo + 1));
    const sg = (k, s, first) => (k === 0 ? "" : (k < 0 ? "-" : first ? "" : "+") + (Math.abs(k) === 1 && s ? "" : Math.abs(k)) + s);
    const poly = ts => { let out = ""; for (const [k, s] of ts) out += sg(k, s, out === ""); return out || "0"; };
    for (let k = 0; k < 500; k++) {
      const h = ri(-6, 6), c = ri(-9, 15);
      if (h === 0) continue;
      const q0 = c - h * h, pt = (x, y) => `$(${x}, ${y})$`;
      const ans = pt(-h, q0), ds = [pt(h, q0), pt(-h, c + h * h), pt(h, c + h * h)]; // x sign slip, +h^2 instead of -h^2, both
      const a = ri(0, 3), o = ds.slice(); o.splice(a, 0, ans);
      const br = `(x${h > 0 ? "+" : "-"}${Math.abs(h)})^2`;
      return {
        q: `By completing the square, find the coordinates of the turning point of $y=${poly([[1, "x^2"], [2 * h, "x"], [c, ""]])}$.`, o, a,
        x: `$y=${br}-${h * h}${sg(c, "", false)}=${br}${sg(q0, "", false)}$. The minimum is where the bracket is zero, at $x=${-h}$, so the turning point is $(${-h}, ${q0})$.`,
        p: { h, c }
      };
    }
    throw new Error("g-ma-turnpt: no valid question");
  }
});

RM.gen({
  id: "g-ma-simeq", s: "maths", t: "p1-03", lv: 2,
  make(r) {
    const ri = (lo, hi) => lo + Math.floor(r() * (hi - lo + 1));
    const pick3 = (ans, pool) => { const o = []; for (const d of pool) if (d != null && d !== ans && o.indexOf(d) < 0) o.push(d); return o.length >= 3 ? o.slice(0, 3) : null; };
    const g = (x, y) => (y ? g(y, x % y) : Math.abs(x));
    const sg = (k, s, first) => (k === 0 ? "" : (k < 0 ? "-" : first ? "" : "+") + (Math.abs(k) === 1 && s ? "" : Math.abs(k)) + s);
    const lin = (a, b, c) => sg(a, "x", true) + sg(b, "y", false) + "=" + c;
    const nz = () => { let v = 0; while (v === 0) v = ri(-5, 6); return v; };
    for (let k = 0; k < 500; k++) {
      const x = ri(-4, 8), y = ri(-4, 8);
      if (x === 0 && y === 0) continue;
      const a1 = nz(), b1 = nz(), a2 = nz(), b2 = nz(), det = a1 * b2 - a2 * b1;
      if (det === 0) continue;
      const c1 = a1 * x + b1 * y, c2 = a2 * x + b2 * y;
      const g1 = g(a1, b1), g2 = g(a2, b2), s1 = r() < 0.5 ? 1 : -1, s2 = r() < 0.5 ? 1 : -1;
      const sol = (u, w) => `$x=${u},\\ y=${w}$`, ans = sol(x, y);
      const ds = pick3(ans, [
        sol(x + s1 * b1 / g1, y - s1 * a1 / g1),   // fits the first equation only
        sol(x + s2 * b2 / g2, y - s2 * a2 / g2),   // fits the second equation only
        sol(y, x), sol(-x, -y)
      ]);
      if (!ds) continue;
      const a = ri(0, 3), o = ds.slice(); o.splice(a, 0, ans);
      return {
        q: `Solve the simultaneous equations $${lin(a1, b1, c1)}$ and $${lin(a2, b2, c2)}$.`, o, a,
        x: `Eliminating $y$ gives $${sg(det, "x", true)}=${det * x}$${det === 1 ? "" : `, so $x=${x}$`}; substituting back gives $y=${y}$. Check in both equations: some options fit only one of them.`,
        p: { a1, b1, c1, a2, b2, c2 }
      };
    }
    throw new Error("g-ma-simeq: no valid question");
  }
});

RM.gen({
  id: "g-ma-gradient", s: "maths", t: "p1-05", lv: 1,
  make(r) {
    const ri = (lo, hi) => lo + Math.floor(r() * (hi - lo + 1));
    const pick3 = (ans, pool) => { const o = []; for (const d of pool) if (d != null && d !== ans && o.indexOf(d) < 0) o.push(d); return o.length >= 3 ? o.slice(0, 3) : null; };
    const g = (x, y) => (y ? g(y, x % y) : Math.abs(x));
    const fr = (n, d) => { if (d < 0) { n = -n; d = -d; } const k = g(n, d) || 1; n /= k; d /= k; return d === 1 ? `${n}` : `${n < 0 ? "-" : ""}\\frac{${Math.abs(n)}}{${d}}`; };
    const pa = v => (v < 0 ? `(${v})` : `${v}`);
    for (let k = 0; k < 500; k++) {
      const x1 = ri(-5, 8), y1 = ri(-5, 8), x2 = ri(-5, 8), y2 = ri(-5, 8), dx = x2 - x1, dy = y2 - y1;
      if (dx === 0 || dy === 0 || Math.abs(dx) === Math.abs(dy)) continue;
      const ans = fr(dy, dx), ds = pick3(ans, [fr(-dy, dx), fr(dx, dy), fr(-dx, dy)]); // sign slip, upside down, both
      if (!ds) continue;
      const a = ri(0, 3), o = ds.map(z => `$${z}$`); o.splice(a, 0, `$${ans}$`);
      const raw = `\\frac{${dy}}{${dx}}`;
      return {
        q: `Find the gradient of the line through $(${x1}, ${y1})$ and $(${x2}, ${y2})$.`, o, a,
        x: `$m=\\frac{y_2-y_1}{x_2-x_1}=\\frac{${y2}-${pa(y1)}}{${x2}-${pa(x1)}}=${raw}${raw === ans ? "" : "=" + ans}$. The change in $y$ goes on top.`,
        p: { x1, y1, x2, y2 }
      };
    }
    throw new Error("g-ma-gradient: no valid question");
  }
});

RM.gen({
  id: "g-ma-perpline", s: "maths", t: "p1-05", lv: 2,
  make(r) {
    const ri = (lo, hi) => lo + Math.floor(r() * (hi - lo + 1));
    const pick3 = (ans, pool) => { const o = []; for (const d of pool) if (d != null && d !== ans && o.indexOf(d) < 0) o.push(d); return o.length >= 3 ? o.slice(0, 3) : null; };
    const g = (x, y) => (y ? g(y, x % y) : Math.abs(x));
    const fr = (n, d) => { if (d < 0) { n = -n; d = -d; } const k = g(n, d) || 1; n /= k; d /= k; return d === 1 ? `${n}` : `${n < 0 ? "-" : ""}\\frac{${Math.abs(n)}}{${d}}`; };
    const sg = (k, s, first) => (k === 0 ? "" : (k < 0 ? "-" : first ? "" : "+") + (Math.abs(k) === 1 && s ? "" : Math.abs(k)) + s);
    const GR = [[2, 1], [3, 1], [4, 1], [5, 1], [1, 2], [1, 3], [1, 4], [2, 3], [3, 2], [3, 4], [4, 3], [2, 5], [5, 2]];
    for (let k = 0; k < 500; k++) {
      const G = GR[ri(0, GR.length - 1)], mu = G[0] * (r() < 0.5 ? -1 : 1), mv = G[1];    // given gradient mu/mv
      const k0 = ri(-6, 7), x0 = ri(-4, 6), y0 = ri(-5, 6);
      // line with gradient p/q through (x0, y0): p x - q y + (q y0 - p x0) = 0, scaled to integers with a > 0
      const line = (p, q) => { let A = p, B = -q, C = q * y0 - p * x0; if (A < 0) { A = -A; B = -B; C = -C; } const h = g(g(A, B), C) || 1; A /= h; B /= h; C /= h; return sg(A, "x", true) + sg(B, "y", false) + sg(C, "", false) + "=0"; };
      const ans = line(-mv, mu);
      const ds = pick3(ans, [line(mu, mv), line(mv, mu), line(-mu, mv)]); // parallel, reciprocal without the sign change, sign change without the reciprocal
      if (!ds) continue;
      let given;
      if (r() < 0.5) given = `y=${fr(mu, mv)}x${sg(k0, "", false)}`;
      else { let A = mu, B = -mv, C = mv * k0; if (A < 0) { A = -A; B = -B; C = -C; } given = sg(A, "x", true) + sg(B, "y", false) + sg(C, "", false) + "=0"; }
      const a = ri(0, 3), o = ds.map(z => `$${z}$`); o.splice(a, 0, `$${ans}$`);
      return {
        q: `Find the equation of the line through $(${x0}, ${y0})$ perpendicular to $${given}$, in the form $ax+by+c=0$.`, o, a,
        x: `The given line has gradient $${fr(mu, mv)}$, so the perpendicular gradient is $${fr(-mv, mu)}$ (negative reciprocal). Using $y-y_1=m(x-x_1)$ with $(${x0}, ${y0})$ gives $${ans}$.`,
        p: { mu, mv, k0, x0, y0 }
      };
    }
    throw new Error("g-ma-perpline: no valid question");
  }
});

RM.gen({
  id: "g-ma-mean", s: "maths", t: "s1-02", lv: 1,
  make(r) {
    const ri = (lo, hi) => lo + Math.floor(r() * (hi - lo + 1));
    const pick3 = (ans, pool) => { const o = []; for (const d of pool) if (d != null && d !== ans && o.indexOf(d) < 0) o.push(d); return o.length >= 3 ? o.slice(0, 3) : null; };
    for (let k = 0; k < 2000; k++) {
      const n = ri(5, 8), d = [];
      for (let i = 0; i < n; i++) d.push(ri(1, 30));
      const S = d.reduce((s, v) => s + v, 0);
      if (S % n) continue;
      const M = S / n, sd = d.slice().sort((p, q) => p - q);
      const med = n % 2 ? sd[(n - 1) / 2] : (sd[n / 2 - 1] + sd[n / 2]) / 2, mid = (sd[0] + sd[n - 1]) / 2;
      const f = v => `$${Math.round(v * 10) / 10}$`, ans = f(M);
      const ds = pick3(ans, [f(med), f(mid), f(S / (n - 1)), f(S / (n + 1))]); // median, midrange, miscounted values
      if (!ds) continue;
      const a = ri(0, 3), o = ds.slice(); o.splice(a, 0, ans);
      return {
        q: `Find the mean of: ${d.join(", ")}.`, o, a,
        x: `The total is ${S} and there are ${n} values, so the mean is $${S}\\div ${n}=${M}$. Count the values carefully, and do not confuse the mean with the median.`,
        p: { d }
      };
    }
    throw new Error("g-ma-mean: no valid question");
  }
});

RM.gen({
  id: "g-ma-mediqr", s: "maths", t: "s1-02", lv: 2,
  make(r) {
    const ri = (lo, hi) => lo + Math.floor(r() * (hi - lo + 1));
    const pick3 = (ans, pool) => { const o = []; for (const d of pool) if (d != null && d !== ans && o.indexOf(d) < 0) o.push(d); return o.length >= 3 ? o.slice(0, 3) : null; };
    const ord = k => k + (k === 1 ? "st" : k === 2 ? "nd" : k === 3 ? "rd" : "th");
    for (let k = 0; k < 500; k++) {
      // n = 7 or 11: every common quartile convention picks the same values, so there is no ambiguity
      const n = r() < 0.5 ? 7 : 11, d = [];
      while (d.length < n) { const v = ri(1, 60); if (d.indexOf(v) < 0) d.push(v); }
      d.sort((p, q) => p - q);
      const at = i => d[i - 1], im = (n + 1) / 2, i1 = (n + 1) / 4, i3 = 3 * (n + 1) / 4;
      const M = at(im), Q1 = at(i1), Q3 = at(i3), I = Q3 - Q1, R = d[n - 1] - d[0];
      const Mn = at(im - 1), Ib = at(Math.floor(3 * n / 4)) - at(Math.floor(n / 4));
      const opt = (m, i) => `Median $${m}$, IQR $${i}$`, ans = opt(M, I);
      const ds = pick3(ans, [opt(M, R), opt(Mn, I), opt(M, Ib), opt(Mn, R)]); // range for IQR, median one place early, quartile positions rounded down
      if (!ds) continue;
      const a = ri(0, 3), o = ds.slice(); o.splice(a, 0, ans);
      return {
        q: `Find the median and interquartile range of these ordered data: ${d.join(", ")}.`, o, a,
        x: `There are ${n} values. The median is the ${ord(im)} value, ${M}. $Q_1$ is the ${ord(i1)} value (${Q1}) and $Q_3$ the ${ord(i3)} (${Q3}), so IQR $=${Q3}-${Q1}=${I}$.`,
        p: { d }
      };
    }
    throw new Error("g-ma-mediqr: no valid question");
  }
});

RM.gen({
  id: "g-ma-suvat-v", s: "maths", t: "m1-09", lv: 1,
  make(r) {
    const ri = (lo, hi) => lo + Math.floor(r() * (hi - lo + 1));
    const pick3 = (ans, pool) => { const o = []; for (const d of pool) if (d != null && d !== ans && o.indexOf(d) < 0) o.push(d); return o.length >= 3 ? o.slice(0, 3) : null; };
    const U = "\\text{ m s}^{-1}", A2 = "\\text{ m s}^{-2}", nf = v => `${Math.round(v * 1000) / 1000}`;
    for (let k = 0; k < 2000; k++) {
      if (r() < 0.6) {           // find v from u, a, t
        const u = ri(2, 20), t = ri(2, 10), dec = r() < 0.4, aa = dec ? ri(1, 5) : ri(1, 6), v = u + (dec ? -aa : aa) * t;
        if (v < 0) continue;
        const pool = dec ? [u + aa * t, aa * t, u - aa, u * t - aa] : [aa * t, aa + u * t, u + aa, u - aa * t];
        const fm = z => `$${nf(z)}${U}$`, ans = fm(v), ds = pick3(ans, pool.map(z => (z < 0 ? null : fm(z))));
        if (!ds) continue;
        const a = ri(0, 3), o = ds.slice(); o.splice(a, 0, ans);
        return dec ? {
          q: `A car travelling at $${u}${U}$ decelerates uniformly at $${aa}${A2}$. Find its speed after $${t}$ s.`, o, a,
          x: `Deceleration means $a=-${aa}$, so $v=u+at=${u}+(-${aa})(${t})=${v}${U}$. Using $a=+${aa}$ by mistake gives ${u + aa * t}.`,
          p: { form: "v", u, a: -aa, t }
        } : {
          q: `A particle moving in a straight line has initial speed $${u}${U}$ and constant acceleration $${aa}${A2}$. Find its speed after $${t}$ s.`, o, a,
          x: `$v=u+at=${u}+${aa}\\times ${t}=${v}${U}$. Remember to add the initial speed $u$ to the gain $at$.`,
          p: { form: "v", u, a: aa, t }
        };
      }
      // find a from u, v, t
      const t = [2, 4, 5, 8, 10][ri(0, 4)], dec = r() < 0.35, aa = t % 2 ? ri(1, 6) : ri(1, 12) / 2;
      const u = dec ? ri(12, 30) : ri(0, 15), acc = dec ? -aa : aa, v = u + acc * t;
      if (v < 0 || v === u) continue;
      const fm = z => `$${nf(z)}${A2}$`, ans = fm(acc);
      const ds = pick3(ans, [(v + u) / t, (u - v) / t, u > 0 ? v / t : null, (v - u) * t].map(z => (z == null ? null : fm(z))));
      if (!ds) continue;
      const a = ri(0, 3), o = ds.slice(); o.splice(a, 0, ans);
      return {
        q: `A particle ${dec ? "slows down" : "speeds up"} uniformly from $${u}${U}$ to $${v}${U}$ in $${t}$ s. Find its acceleration.`, o, a,
        x: `$a=\\frac{v-u}{t}=\\frac{${v}-${u}}{${t}}=${nf(acc)}${A2}$.${dec ? " Slowing down gives a negative acceleration." : " Subtract the initial speed before dividing."}`,
        p: { form: "a", u, v, t }
      };
    }
    throw new Error("g-ma-suvat-v: no valid question");
  }
});

RM.gen({
  id: "g-ma-suvat-s", s: "maths", t: "m1-09", lv: 2,
  make(r) {
    const ri = (lo, hi) => lo + Math.floor(r() * (hi - lo + 1));
    const pick3 = (ans, pool) => { const o = []; for (const d of pool) if (d != null && d !== ans && o.indexOf(d) < 0) o.push(d); return o.length >= 3 ? o.slice(0, 3) : null; };
    const U = "\\text{ m s}^{-1}", A2 = "\\text{ m s}^{-2}";
    const sg = v => (v < 0 ? `${v}` : `+${v}`);
    for (let k = 0; k < 2000; k++) {
      const u = ri(1, 12), t = ri(2, 8), dec = r() < 0.4, aa = ri(1, 6);
      if ((aa * t * t) % 2) continue;
      const acc = dec ? -aa : aa;
      if (dec && u + acc * t < 0) continue;        // still moving forwards at the end
      const half = acc * t * t / 2, s = u * t + half;
      const fm = z => `$${z}\\text{ m}$`, ans = fm(s);
      const ds = pick3(ans, [u * t + 2 * half, half, u * t - half, u * t].map(z => (z > 0 ? fm(z) : null))); // forgot the 1/2, forgot ut, sign slip, ignored a
      if (!ds) continue;
      const a = ri(0, 3), o = ds.slice(); o.splice(a, 0, ans);
      return {
        q: dec
          ? `A particle moving in a straight line at $${u}${U}$ decelerates uniformly at $${aa}${A2}$. Find its displacement after $${t}$ s.`
          : `A particle moving in a straight line has initial velocity $${u}${U}$ and constant acceleration $${aa}${A2}$. Find its displacement after $${t}$ s.`,
        o, a,
        x: `$s=ut+\\frac{1}{2}at^2=${u}(${t})+\\frac{1}{2}(${acc})(${t})^2=${u * t}${sg(half)}=${s}\\text{ m}$.${dec ? " Deceleration makes $a$ negative." : " Do not forget the $\\frac{1}{2}$."}`,
        p: { u, a: acc, t }
      };
    }
    throw new Error("g-ma-suvat-s: no valid question");
  }
});

RM.gen({
  id: "g-ma-cubicgrad", s: "maths", t: "p1-12", lv: 2,
  make(r) {
    const ri = (lo, hi) => lo + Math.floor(r() * (hi - lo + 1));
    const pick3 = (ans, pool) => { const o = []; for (const d of pool) if (d != null && d !== ans && o.indexOf(d) < 0) o.push(d); return o.length >= 3 ? o.slice(0, 3) : null; };
    const sg = (k, s, first) => (k === 0 ? "" : (k < 0 ? "-" : first ? "" : "+") + (Math.abs(k) === 1 && s ? "" : Math.abs(k)) + s);
    const poly = ts => { let out = ""; for (const [k, s] of ts) out += sg(k, s, out === ""); return out || "0"; };
    for (let k = 0; k < 500; k++) {
      const a = [1, 2, -1, 3, -2][ri(0, 4)], b = ri(-4, 4), c = ri(-6, 6), d = ri(-5, 9), x0 = ri(-3, 3);
      if (x0 === 0 || d === 0) continue;
      const G = 3 * a * x0 * x0 + 2 * b * x0 + c, Y = a * x0 ** 3 + b * x0 * x0 + c * x0 + d;
      const ans = `${G}`;
      const ds = pick3(ans, [Y, a * x0 * x0 + b * x0 + c, G + d, 3 * a * x0 ** 3 + 2 * b * x0 * x0 + c * x0].map(String)); // y not dy/dx, powers not brought down, kept the constant, kept the powers
      if (!ds) continue;
      const a0 = ri(0, 3), o = ds.map(z => `$${z}$`); o.splice(a0, 0, `$${ans}$`);
      return {
        q: `Find the gradient of the curve $y=${poly([[a, "x^3"], [b, "x^2"], [c, "x"], [d, ""]])}$ at the point where $x=${x0}$.`, o, a: a0,
        x: `$\\frac{dy}{dx}=${poly([[3 * a, "x^2"], [2 * b, "x"], [c, ""]])}$. At $x=${x0}$: $${poly([[3 * a, `(${x0})^2`], [2 * b, `(${x0})`], [c, ""]])}=${G}$. Substituting into $y$ instead gives the $y$-coordinate.`,
        p: { a, b, c, d, x0 }
      };
    }
    throw new Error("g-ma-cubicgrad: no valid question");
  }
});

RM.gen({
  id: "g-ma-defint", s: "maths", t: "p1-13", lv: 2,
  make(r) {
    const ri = (lo, hi) => lo + Math.floor(r() * (hi - lo + 1));
    const pick3 = (ans, pool) => { const o = []; for (const d of pool) if (d != null && d !== ans && o.indexOf(d) < 0) o.push(d); return o.length >= 3 ? o.slice(0, 3) : null; };
    const g = (x, y) => (y ? g(y, x % y) : Math.abs(x));
    const fr = (n, d) => { if (d < 0) { n = -n; d = -d; } const k = g(n, d) || 1; n /= k; d /= k; return d === 1 ? `${n}` : `${n < 0 ? "-" : ""}\\frac{${Math.abs(n)}}{${d}}`; };
    const sg = (k, s, first) => (k === 0 ? "" : (k < 0 ? "-" : first ? "" : "+") + (Math.abs(k) === 1 && s ? "" : Math.abs(k)) + s);
    const poly = ts => { let out = ""; for (const [k, s] of ts) out += sg(k, s, out === ""); return out || "0"; };
    const cq = (nu, de, s, first) => { if (nu === 0) return ""; const v = fr(nu, de), neg = v[0] === "-", body = neg ? v.slice(1) : v; return (neg ? "-" : first ? "" : "+") + (body === "1" ? "" : body) + s; };
    const pa = s => (s[0] === "-" ? `\\left(${s}\\right)` : s);
    for (let k = 0; k < 500; k++) {
      const nice = r() < 0.7;
      const a = nice ? [3, 6, -3][ri(0, 2)] : [1, 2, -1, 4][ri(0, 3)], b = nice ? 2 * ri(-3, 3) : ri(-5, 5), c = ri(-5, 6);
      const m = [-2, -1, 1, 2][ri(0, 3)], n = m + ri(1, 3);
      if (n > 4) continue;
      const F6 = x => 2 * a * x ** 3 + 3 * b * x * x + 6 * c * x;     // 6 times the integral
      const G = x => a * x ** 3 + b * x * x + c * x, f = x => a * x * x + b * x + c;
      const I6 = F6(n) - F6(m), ans = fr(I6, 6);
      const ds = pick3(ans, [fr(-I6, 6), fr(F6(n), 6), `${G(n) - G(m)}`, `${f(n) - f(m)}`]); // limits swapped, lower limit ignored, powers not divided, not integrated
      if (!ds) continue;
      const a0 = ri(0, 3), o = ds.map(z => `$${z}$`); o.splice(a0, 0, `$${ans}$`);
      let Fs = ""; for (const [nu, de, s] of [[a, 3, "x^3"], [b, 2, "x^2"], [c, 1, "x"]]) Fs += cq(nu, de, s, Fs === "");
      return {
        q: `Evaluate $\\int_{${m}}^{${n}}\\left(${poly([[a, "x^2"], [b, "x"], [c, ""]])}\\right)\\,dx$.`, o, a: a0,
        x: `$\\left[${Fs}\\right]_{${m}}^{${n}}=${fr(F6(n), 6)}-${pa(fr(F6(m), 6))}=${ans}$. Raise each power by 1 and divide by the new power, then take (top limit) minus (bottom limit).`,
        p: { a, b, c, m, n }
      };
    }
    throw new Error("g-ma-defint: no valid question");
  }
});

/* ============================ Chemistry (AQA 7405) ============================ */

RM.gen({
  id: "g-ch-moles", s: "chem", t: "3.1.2", lv: 1,
  make(r) {
    const ri = (lo, hi) => lo + Math.floor(r() * (hi - lo + 1));
    const pick3 = (ans, pool) => { const o = []; for (const d of pool) if (d != null && d !== ans && o.indexOf(d) < 0) o.push(d); return o.length >= 3 ? o.slice(0, 3) : null; };
    const AR = { H: 1.0, C: 12.0, N: 14.0, O: 16.0, Na: 23.0, Mg: 24.3, S: 32.1, Cl: 35.5, K: 39.1, Ca: 40.1 };
    const CP = [["water", "H₂O", [["H", 2], ["O", 1]]], ["carbon dioxide", "CO₂", [["C", 1], ["O", 2]]], ["ammonia", "NH₃", [["N", 1], ["H", 3]]],
      ["methane", "CH₄", [["C", 1], ["H", 4]]], ["sodium chloride", "NaCl", [["Na", 1], ["Cl", 1]]], ["sodium hydroxide", "NaOH", [["Na", 1], ["O", 1], ["H", 1]]],
      ["magnesium oxide", "MgO", [["Mg", 1], ["O", 1]]], ["magnesium chloride", "MgCl₂", [["Mg", 1], ["Cl", 2]]], ["magnesium hydroxide", "Mg(OH)₂", [["Mg", 1], ["O", 2], ["H", 2]]],
      ["magnesium sulfate", "MgSO₄", [["Mg", 1], ["S", 1], ["O", 4]]], ["calcium carbonate", "CaCO₃", [["Ca", 1], ["C", 1], ["O", 3]]], ["calcium oxide", "CaO", [["Ca", 1], ["O", 1]]],
      ["calcium chloride", "CaCl₂", [["Ca", 1], ["Cl", 2]]], ["calcium hydroxide", "Ca(OH)₂", [["Ca", 1], ["O", 2], ["H", 2]]], ["potassium chloride", "KCl", [["K", 1], ["Cl", 1]]],
      ["potassium hydroxide", "KOH", [["K", 1], ["O", 1], ["H", 1]]], ["potassium nitrate", "KNO₃", [["K", 1], ["N", 1], ["O", 3]]], ["potassium sulfate", "K₂SO₄", [["K", 2], ["S", 1], ["O", 4]]],
      ["sodium carbonate", "Na₂CO₃", [["Na", 2], ["C", 1], ["O", 3]]], ["sodium hydrogencarbonate", "NaHCO₃", [["Na", 1], ["H", 1], ["C", 1], ["O", 3]]], ["sodium sulfate", "Na₂SO₄", [["Na", 2], ["S", 1], ["O", 4]]],
      ["sodium nitrate", "NaNO₃", [["Na", 1], ["N", 1], ["O", 3]]], ["sulfuric acid", "H₂SO₄", [["H", 2], ["S", 1], ["O", 4]]], ["nitric acid", "HNO₃", [["H", 1], ["N", 1], ["O", 3]]],
      ["hydrogen chloride", "HCl", [["H", 1], ["Cl", 1]]], ["sulfur dioxide", "SO₂", [["S", 1], ["O", 2]]], ["ammonium chloride", "NH₄Cl", [["N", 1], ["H", 4], ["Cl", 1]]],
      ["ammonium nitrate", "NH₄NO₃", [["N", 2], ["H", 4], ["O", 3]]], ["ethanol", "C₂H₅OH", [["C", 2], ["H", 6], ["O", 1]]], ["glucose", "C₆H₁₂O₆", [["C", 6], ["H", 12], ["O", 6]]]];
    const mr = cp => Math.round(cp.reduce((s, [e, n]) => s + AR[e] * n, 0) * 10) / 10;
    const wr = fo => Math.round(fo.replace(/[₀-₉()]/g, "").match(/[A-Z][a-z]?/g).reduce((s, e) => s + AR[e], 0) * 10) / 10; // every subscript ignored
    const s3 = x => { const v = Number(x.toPrecision(3)), pr = v.toExponential(2).split("e"), e = Number(pr[1]); if (e < -2 || e > 3) return `${pr[0]} × 10${e < 0 ? "⁻" : ""}${String(Math.abs(e)).split("").map(c => "⁰¹²³⁴⁵⁶⁷⁸⁹"[c]).join("")}`; return e >= 2 ? String(Math.round(v)) : v.toFixed(2 - e); };
    const half = x => { const e = Math.floor(Math.log10(Math.abs(x))), sc = Math.abs(x) / 10 ** (e - 2); return Math.abs(sc - Math.floor(sc) - 0.5) < 1e-6; };
    for (let k = 0; k < 500; k++) {
      const C = CP[ri(0, CP.length - 1)], fo = C[1], M = mr(C[2]), Mw = wr(fo);
      const mS = s3([0.05, 0.1, 0.125, 0.15, 0.2, 0.25, 0.3, 0.4, 0.5, 0.75, 1.5, 2, 2.5][ri(0, 12)] * M), m = Number(mS), n = m / M;
      if (half(n)) continue;
      const ans = s3(n) + " mol";
      const ds = pick3(ans, [Mw !== M ? s3(m / Mw) : null, s3(m * M), s3(M / m), s3(n * 10)].map(z => z && z + " mol")); // subscripts ignored, multiplied, upside down, decimal slip
      if (!ds) continue;
      const a = ri(0, 3), o = ds.slice(); o.splice(a, 0, ans);
      const expr = C[2].map(([e, c]) => (c === 1 ? AR[e].toFixed(1) : `${c}(${AR[e].toFixed(1)})`)).join(" + ");
      return {
        q: `How many moles are in ${mS} g of ${C[0]}, ${fo}? (${C[2].map(([e]) => `${e} ${AR[e].toFixed(1)}`).join(", ")}) Give your answer to 3 significant figures.`, o, a,
        x: `Mr of ${fo} = ${expr} = ${M.toFixed(1)}. Moles = mass ÷ Mr = ${mS} ÷ ${M.toFixed(1)} = ${s3(n)} mol.`,
        p: { fo, m }
      };
    }
    throw new Error("g-ch-moles: no valid question");
  }
});

RM.gen({
  id: "g-ch-mass", s: "chem", t: "3.1.2", lv: 1,
  make(r) {
    const ri = (lo, hi) => lo + Math.floor(r() * (hi - lo + 1));
    const pick3 = (ans, pool) => { const o = []; for (const d of pool) if (d != null && d !== ans && o.indexOf(d) < 0) o.push(d); return o.length >= 3 ? o.slice(0, 3) : null; };
    const AR = { H: 1.0, C: 12.0, N: 14.0, O: 16.0, Na: 23.0, Mg: 24.3, S: 32.1, Cl: 35.5, K: 39.1, Ca: 40.1 };
    const CP = [["water", "H₂O", [["H", 2], ["O", 1]]], ["carbon dioxide", "CO₂", [["C", 1], ["O", 2]]], ["ammonia", "NH₃", [["N", 1], ["H", 3]]],
      ["methane", "CH₄", [["C", 1], ["H", 4]]], ["sodium chloride", "NaCl", [["Na", 1], ["Cl", 1]]], ["sodium hydroxide", "NaOH", [["Na", 1], ["O", 1], ["H", 1]]],
      ["magnesium oxide", "MgO", [["Mg", 1], ["O", 1]]], ["magnesium chloride", "MgCl₂", [["Mg", 1], ["Cl", 2]]], ["magnesium hydroxide", "Mg(OH)₂", [["Mg", 1], ["O", 2], ["H", 2]]],
      ["magnesium sulfate", "MgSO₄", [["Mg", 1], ["S", 1], ["O", 4]]], ["calcium carbonate", "CaCO₃", [["Ca", 1], ["C", 1], ["O", 3]]], ["calcium oxide", "CaO", [["Ca", 1], ["O", 1]]],
      ["calcium chloride", "CaCl₂", [["Ca", 1], ["Cl", 2]]], ["calcium hydroxide", "Ca(OH)₂", [["Ca", 1], ["O", 2], ["H", 2]]], ["potassium chloride", "KCl", [["K", 1], ["Cl", 1]]],
      ["potassium hydroxide", "KOH", [["K", 1], ["O", 1], ["H", 1]]], ["potassium nitrate", "KNO₃", [["K", 1], ["N", 1], ["O", 3]]], ["potassium sulfate", "K₂SO₄", [["K", 2], ["S", 1], ["O", 4]]],
      ["sodium carbonate", "Na₂CO₃", [["Na", 2], ["C", 1], ["O", 3]]], ["sodium hydrogencarbonate", "NaHCO₃", [["Na", 1], ["H", 1], ["C", 1], ["O", 3]]], ["sodium sulfate", "Na₂SO₄", [["Na", 2], ["S", 1], ["O", 4]]],
      ["sodium nitrate", "NaNO₃", [["Na", 1], ["N", 1], ["O", 3]]], ["sulfuric acid", "H₂SO₄", [["H", 2], ["S", 1], ["O", 4]]], ["nitric acid", "HNO₃", [["H", 1], ["N", 1], ["O", 3]]],
      ["hydrogen chloride", "HCl", [["H", 1], ["Cl", 1]]], ["sulfur dioxide", "SO₂", [["S", 1], ["O", 2]]], ["ammonium chloride", "NH₄Cl", [["N", 1], ["H", 4], ["Cl", 1]]],
      ["ammonium nitrate", "NH₄NO₃", [["N", 2], ["H", 4], ["O", 3]]], ["ethanol", "C₂H₅OH", [["C", 2], ["H", 6], ["O", 1]]], ["glucose", "C₆H₁₂O₆", [["C", 6], ["H", 12], ["O", 6]]]];
    const mr = cp => Math.round(cp.reduce((s, [e, n]) => s + AR[e] * n, 0) * 10) / 10;
    const wr = fo => Math.round(fo.replace(/[₀-₉()]/g, "").match(/[A-Z][a-z]?/g).reduce((s, e) => s + AR[e], 0) * 10) / 10;
    const s3 = x => { const v = Number(x.toPrecision(3)), pr = v.toExponential(2).split("e"), e = Number(pr[1]); if (e < -2 || e > 3) return `${pr[0]} × 10${e < 0 ? "⁻" : ""}${String(Math.abs(e)).split("").map(c => "⁰¹²³⁴⁵⁶⁷⁸⁹"[c]).join("")}`; return e >= 2 ? String(Math.round(v)) : v.toFixed(2 - e); };
    const half = x => { const e = Math.floor(Math.log10(Math.abs(x))), sc = Math.abs(x) / 10 ** (e - 2); return Math.abs(sc - Math.floor(sc) - 0.5) < 1e-6; };
    for (let k = 0; k < 500; k++) {
      const C = CP[ri(0, CP.length - 1)], fo = C[1], M = mr(C[2]), Mw = wr(fo);
      const n = [0.05, 0.1, 0.125, 0.15, 0.2, 0.25, 0.3, 0.4, 0.5, 0.75, 1.5, 2, 2.5][ri(0, 12)], nS = s3(n), m = n * M;
      if (half(m)) continue;
      const ans = s3(m) + " g";
      const ds = pick3(ans, [Mw !== M ? s3(n * Mw) : null, s3(n / M), s3(M / n), s3(m / 10)].map(z => z && z + " g")); // subscripts ignored, divided, upside down, decimal slip
      if (!ds) continue;
      const a = ri(0, 3), o = ds.slice(); o.splice(a, 0, ans);
      const expr = C[2].map(([e, c]) => (c === 1 ? AR[e].toFixed(1) : `${c}(${AR[e].toFixed(1)})`)).join(" + ");
      return {
        q: `What is the mass of ${nS} mol of ${C[0]}, ${fo}? (${C[2].map(([e]) => `${e} ${AR[e].toFixed(1)}`).join(", ")}) Give your answer to 3 significant figures.`, o, a,
        x: `Mr of ${fo} = ${expr} = ${M.toFixed(1)}. Mass = moles × Mr = ${nS} × ${M.toFixed(1)} = ${s3(m)} g.`,
        p: { fo, n }
      };
    }
    throw new Error("g-ch-mass: no valid question");
  }
});

RM.gen({
  id: "g-ch-titration", s: "chem", t: "3.1.2", lv: 2,
  make(r) {
    const ri = (lo, hi) => lo + Math.floor(r() * (hi - lo + 1));
    const pick3 = (ans, pool) => { const o = []; for (const d of pool) if (d != null && d !== ans && o.indexOf(d) < 0) o.push(d); return o.length >= 3 ? o.slice(0, 3) : null; };
    const s3 = x => { const v = Number(x.toPrecision(3)), pr = v.toExponential(2).split("e"), e = Number(pr[1]); if (e < -2 || e > 3) return `${pr[0]} × 10${e < 0 ? "⁻" : ""}${String(Math.abs(e)).split("").map(c => "⁰¹²³⁴⁵⁶⁷⁸⁹"[c]).join("")}`; return e >= 2 ? String(Math.round(v)) : v.toFixed(2 - e); };
    const half = x => { const e = Math.floor(Math.log10(Math.abs(x))), sc = Math.abs(x) / 10 ** (e - 2); return Math.abs(sc - Math.floor(sc) - 0.5) < 1e-6; };
    const ex = x => String(Number(x.toPrecision(10)));
    const PR = [["NaOH", "HCl", "NaCl"], ["KOH", "HCl", "KCl"], ["NaOH", "HNO₃", "NaNO₃"], ["KOH", "HNO₃", "KNO₃"]];
    for (let k = 0; k < 500; k++) {
      const P = PR[ri(0, 3)], eq = `${P[0]} + ${P[1]} → ${P[2]} + H₂O`, unkBase = r() < 0.5, U = unkBase ? P[0] : P[1], K = unkBase ? P[1] : P[0];
      const Vf = [25, 20, 10][ri(0, 2)], T = ri(48, 120) / 4, c = [0.1, 0.2, 0.05, 0.15, 0.25][ri(0, 4)];
      const inFlask = r() < 0.6, Vu = inFlask ? Vf : T, Vk = inFlask ? T : Vf;   // unknown in the flask, or in the burette
      const cu = c * Vk / Vu, nk = c * Vk / 1000;
      if (half(cu)) continue;
      const unit = " mol dm⁻³", ans = s3(cu) + unit;
      const ds = pick3(ans, [s3(c * Vu / Vk), s3(nk), s3(cu / 1000)].map(z => z + unit)); // volumes upside down, moles given as concentration, one volume left in cm³
      if (!ds) continue;
      const a = ri(0, 3), o = ds.slice(); o.splice(a, 0, ans);
      const VfS = Vf.toFixed(1), TS = T.toFixed(2);
      return {
        q: inFlask
          ? `${VfS} cm³ of ${U}(aq) is titrated with ${s3(c)} mol dm⁻³ ${K}. The mean titre is ${TS} cm³. ${eq}. What is the concentration of the ${U}? Give your answer to 3 significant figures.`
          : `${VfS} cm³ of ${s3(c)} mol dm⁻³ ${K}(aq) is neutralised by ${TS} cm³ of ${U}(aq) from a burette. ${eq}. What is the concentration of the ${U}? Give your answer to 3 significant figures.`,
        o, a,
        x: `n(${K}) = ${s3(c)} × ${inFlask ? TS : VfS} ÷ 1000 = ${ex(nk)} mol. The ratio is 1 : 1, so n(${U}) is the same. Concentration = ${ex(nk)} ÷ ${inFlask ? (Vf / 1000).toFixed(4) : (T / 1000).toFixed(5)} = ${s3(cu)}${unit}.`,
        p: { c, T, Vf, inFlask, U, K }
      };
    }
    throw new Error("g-ch-titration: no valid question");
  }
});

RM.gen({
  id: "g-ch-yield", s: "chem", t: "3.1.2", lv: 2,
  make(r) {
    const ri = (lo, hi) => lo + Math.floor(r() * (hi - lo + 1));
    const pick3 = (ans, pool) => { const o = []; for (const d of pool) if (d != null && d !== ans && o.indexOf(d) < 0) o.push(d); return o.length >= 3 ? o.slice(0, 3) : null; };
    const AR = { H: 1.0, C: 12.0, N: 14.0, O: 16.0, Na: 23.0, Mg: 24.3, S: 32.1, Cl: 35.5, K: 39.1, Ca: 40.1 };
    const mr = cp => Math.round(cp.reduce((s, [e, n]) => s + AR[e] * n, 0) * 10) / 10;
    const s3 = x => { const v = Number(x.toPrecision(3)), pr = v.toExponential(2).split("e"), e = Number(pr[1]); if (e < -2 || e > 3) return `${pr[0]} × 10${e < 0 ? "⁻" : ""}${String(Math.abs(e)).split("").map(c => "⁰¹²³⁴⁵⁶⁷⁸⁹"[c]).join("")}`; return e >= 2 ? String(Math.round(v)) : v.toFixed(2 - e); };
    const half = x => { const e = Math.floor(Math.log10(Math.abs(x))), sc = Math.abs(x) / 10 ** (e - 2); return Math.abs(sc - Math.floor(sc) - 0.5) < 1e-6; };
    const f4 = z => Number(z.toPrecision(4)), s4 = z => z.toPrecision(4);
    // k = moles of product per mole of the named reactant
    const RX = [
      { eq: "CaCO₃ → CaO + CO₂", r: "CaCO₃", rc: [["Ca", 1], ["C", 1], ["O", 3]], p: "CaO", pc: [["Ca", 1], ["O", 1]], k: 1, ex: false },
      { eq: "2Mg + O₂ → 2MgO", r: "Mg", rc: [["Mg", 1]], p: "MgO", pc: [["Mg", 1], ["O", 1]], k: 1, ex: true },
      { eq: "C₂H₄ + H₂O → C₂H₅OH", r: "C₂H₄", rc: [["C", 2], ["H", 4]], p: "C₂H₅OH", pc: [["C", 2], ["H", 6], ["O", 1]], k: 1, ex: true },
      { eq: "2NaHCO₃ → Na₂CO₃ + H₂O + CO₂", r: "NaHCO₃", rc: [["Na", 1], ["H", 1], ["C", 1], ["O", 3]], p: "Na₂CO₃", pc: [["Na", 2], ["C", 1], ["O", 3]], k: 0.5, ex: false },
      { eq: "Na₂CO₃ + 2HCl → 2NaCl + H₂O + CO₂", r: "Na₂CO₃", rc: [["Na", 2], ["C", 1], ["O", 3]], p: "NaCl", pc: [["Na", 1], ["Cl", 1]], k: 2, ex: true },
      { eq: "CaO + H₂O → Ca(OH)₂", r: "CaO", rc: [["Ca", 1], ["O", 1]], p: "Ca(OH)₂", pc: [["Ca", 1], ["O", 2], ["H", 2]], k: 1, ex: true },
      { eq: "Mg + 2HCl → MgCl₂ + H₂", r: "Mg", rc: [["Mg", 1]], p: "MgCl₂", pc: [["Mg", 1], ["Cl", 2]], k: 1, ex: true }
    ];
    for (let k = 0; k < 500; k++) {
      const R = RX[ri(0, RX.length - 1)], Mr = mr(R.rc), Mp = mr(R.pc);
      const mRS = s3([0.1, 0.15, 0.2, 0.25, 0.3, 0.4, 0.5][ri(0, 6)] * Mr), mR = Number(mRS);
      const theo = mR / Mr * R.k * Mp, aS = s3(theo * ri(55, 95) / 100), act = Number(aS), yv = act / theo * 100;
      if (half(yv)) continue;
      const n4 = f4(mR / Mr), np4 = f4(n4 * R.k), t4 = f4(np4 * Mp);
      if (s3(act / t4 * 100) !== s3(yv)) continue;      // the rounded working in the explanation must give the same answer
      const ans = s3(yv) + "%";
      // mole ratio ignored, masses compared directly, upside down, forgot to multiply by 100, percentage lost; at most one above 100%
      let over = 0;
      const cand = [R.k !== 1 ? act / (mR / Mr * Mp) * 100 : null, act / mR * 100, theo / act * 100, yv / 100, 100 - yv]
        .filter(z => z != null && !(z > 100 && over++ > 0));
      const ds = pick3(ans, cand.map(z => s3(z) + "%"));
      if (!ds) continue;
      const a = ri(0, 3), o = ds.slice(); o.splice(a, 0, ans);
      const lab = cp => (cp.length === 1 && cp[0][1] === 1 ? "Ar" : "Mr");
      const rt = R.k === 1 ? "1 : 1" : R.k === 2 ? "1 : 2" : "2 : 1";
      return {
        q: `Reaction: ${R.eq}. ${mRS} g of ${R.r} gave ${aS} g of ${R.p}${R.ex ? ", other reactants in excess" : ""}. What is the percentage yield, to 3 significant figures? (${lab(R.rc)} ${R.r} = ${Mr.toFixed(1)}, ${lab(R.pc)} ${R.p} = ${Mp.toFixed(1)})`, o, a,
        x: `n(${R.r}) = ${mRS} ÷ ${Mr.toFixed(1)} = ${s4(n4)} mol, so at most ${s4(np4)} mol of ${R.p} (ratio ${rt}), which is ${s4(t4)} g. Yield = ${aS} ÷ ${s4(t4)} × 100 = ${ans}.`,
        p: { eq: R.eq, r: R.r, p: R.p, mR, act }
      };
    }
    throw new Error("g-ch-yield: no valid question");
  }
});

RM.gen({
  id: "g-ch-ram", s: "chem", t: "3.1.1", lv: 2,
  make(r) {
    const ri = (lo, hi) => lo + Math.floor(r() * (hi - lo + 1));
    const pick3 = (ans, pool) => { const o = []; for (const d of pool) if (d != null && d !== ans && o.indexOf(d) < 0) o.push(d); return o.length >= 3 ? o.slice(0, 3) : null; };
    const sp = v => String(v).split("").map(c => "⁰¹²³⁴⁵⁶⁷⁸⁹"[c]).join("");
    // exact rounding to 1 d.p. of nm/dn with integers; null if it is exactly half-way
    const r1 = (nm, dn) => { const q10 = 10 * nm, f = Math.floor(q10 / dn), rem = q10 - f * dn; return 2 * rem === dn ? null : ((2 * rem > dn ? f + 1 : f) / 10).toFixed(1); };
    for (let k = 0; k < 500; k++) {
      const m1 = ri(20, 90), m2 = m1 + ri(1, 2), pct = r() < 0.65;
      let a1, a2;
      if (pct) { a1 = ri(51, 95); if (r() < 0.5) a1 = 100 - a1; a2 = 100 - a1; }
      else { const RT = [[3, 1], [1, 3], [4, 1], [1, 4], [3, 2], [2, 3], [2, 1], [1, 2], [5, 3], [3, 5]][ri(0, 9)]; a1 = RT[0]; a2 = RT[1]; }
      const tot = a1 + a2, num = m1 * a1 + m2 * a2, ans = r1(num, tot);
      if (ans === null) continue;
      const sw = r1(m1 * a2 + m2 * a1, tot);
      const ds = pick3(ans, [((m1 + m2) / 2).toFixed(1), sw, (a1 > a2 ? m1 : m2).toFixed(1), (a1 > a2 ? m2 : m1).toFixed(1)]); // plain average, abundances swapped, one isotope only
      if (!ds) continue;
      const a = ri(0, 3), o = ds.slice(); o.splice(a, 0, ans);
      const exact = (num * 1000) % tot === 0, val = exact ? String(num / tot) : (num / tot).toFixed(3);
      return {
        q: pct
          ? `Element X has two isotopes: ${sp(m1)}X (${a1}%) and ${sp(m2)}X (${a2}%). Calculate the relative atomic mass of X to 1 decimal place.`
          : `The mass spectrum of element X shows two peaks, at m/z ${m1} and ${m2}, with relative abundances in the ratio ${a1} : ${a2}. Calculate the relative atomic mass of X to 1 decimal place.`,
        o, a,
        x: `Ar = (${m1} × ${a1} + ${m2} × ${a2}) ÷ ${tot} = ${num} ÷ ${tot} ${exact ? "=" : "≈"} ${val}, so ${ans} to 1 d.p. Weight each mass by its abundance: a plain average of ${m1} and ${m2} ignores them.`,
        p: { m1, m2, a1, a2 }
      };
    }
    throw new Error("g-ch-ram: no valid question");
  }
});

/* ============================ Further Maths (AQA 7367) ============================ */

RM.gen({
  id: "g-fm-modulus", s: "further", t: "fp-complex", lv: 1,
  make(r) {
    const ri = (lo, hi) => lo + Math.floor(r() * (hi - lo + 1));
    const pick3 = (ans, pool) => { const o = []; for (const d of pool) if (d != null && d !== ans && o.indexOf(d) < 0) o.push(d); return o.length >= 3 ? o.slice(0, 3) : null; };
    const cx = (x, y) => (x === 0 ? "" : `${x}`) + (y === 0 ? (x === 0 ? "0" : "") : (y < 0 ? "-" : x === 0 ? "" : "+") + (Math.abs(y) === 1 ? "" : Math.abs(y)) + "i");
    const pa = v => (v < 0 ? `(${v})` : `${v}`);
    const TR = [[3, 4, 5], [5, 12, 13], [8, 15, 17], [7, 24, 25], [6, 8, 10], [9, 12, 15], [20, 21, 29], [12, 16, 20], [9, 40, 41], [15, 20, 25]];
    for (let k = 0; k < 500; k++) {
      const T = TR[ri(0, TR.length - 1)], sw = r() < 0.5, p0 = sw ? T[1] : T[0], q0 = sw ? T[0] : T[1], c = T[2];
      const re = p0 * (r() < 0.5 ? -1 : 1), im = q0 * (r() < 0.5 ? -1 : 1), ans = `${c}`;
      const ds = pick3(ans, [`${c * c}`, `${p0 + q0}`, `${re + im}`, `\\sqrt{${Math.abs(im * im - re * re)}}`]); // no square root, added the parts, kept signs, subtracted squares
      if (!ds) continue;
      const a = ri(0, 3), o = ds.map(z => `$${z}$`); o.splice(a, 0, `$${ans}$`);
      return {
        q: `Find $|z|$ for $z=${cx(re, im)}$.`, o, a,
        x: `$|z|=\\sqrt{${pa(re)}^2+${pa(im)}^2}=\\sqrt{${re * re}+${im * im}}=\\sqrt{${c * c}}=${c}$. Squaring removes the signs; then take the square root.`,
        p: { re, im }
      };
    }
    throw new Error("g-fm-modulus: no valid question");
  }
});

RM.gen({
  id: "g-fm-cmult", s: "further", t: "fp-complex", lv: 1,
  make(r) {
    const ri = (lo, hi) => lo + Math.floor(r() * (hi - lo + 1));
    const pick3 = (ans, pool) => { const o = []; for (const d of pool) if (d != null && d !== ans && o.indexOf(d) < 0) o.push(d); return o.length >= 3 ? o.slice(0, 3) : null; };
    const cx = (x, y) => (x === 0 ? "" : `${x}`) + (y === 0 ? (x === 0 ? "0" : "") : (y < 0 ? "-" : x === 0 ? "" : "+") + (Math.abs(y) === 1 ? "" : Math.abs(y)) + "i");
    const ti = (k, s) => (k < 0 ? "-" : "+") + (Math.abs(k) === 1 ? "" : Math.abs(k)) + s;
    const nz = () => { let v = 0; while (v === 0) v = ri(-5, 6); return v; };
    for (let k = 0; k < 500; k++) {
      const a1 = nz(), b1 = nz(), c1 = nz(), d1 = nz(), re = a1 * c1 - b1 * d1, im = a1 * d1 + b1 * c1;
      const ans = cx(re, im);
      const ds = pick3(ans, [cx(a1 * c1 + b1 * d1, im), cx(a1 * c1, b1 * d1), cx(re, a1 * d1 - b1 * c1), cx(re, -im)]); // i^2 taken as +1, parts multiplied separately, sign slips
      if (!ds) continue;
      const a = ri(0, 3), o = ds.map(z => `$${z}$`); o.splice(a, 0, `$${ans}$`);
      return {
        q: `Express $(${cx(a1, b1)})(${cx(c1, d1)})$ in the form $a+bi$.`, o, a,
        x: `Expand: $${a1 * c1}${ti(a1 * d1, "i")}${ti(b1 * c1, "i")}${ti(b1 * d1, "i^2")}$. Since $i^2=-1$, this is $${ans}$.`,
        p: { a: a1, b: b1, c: c1, d: d1 }
      };
    }
    throw new Error("g-fm-cmult: no valid question");
  }
});

RM.gen({
  id: "g-fm-det", s: "further", t: "fp-matrices", lv: 1,
  make(r) {
    const ri = (lo, hi) => lo + Math.floor(r() * (hi - lo + 1));
    const pick3 = (ans, pool) => { const o = []; for (const d of pool) if (d != null && d !== ans && o.indexOf(d) < 0) o.push(d); return o.length >= 3 ? o.slice(0, 3) : null; };
    const pa = v => (v < 0 ? `(${v})` : `${v}`);
    for (let k = 0; k < 500; k++) {
      const a1 = ri(-6, 9), b1 = ri(-6, 9), c1 = ri(-6, 9), d1 = ri(-6, 9), D = a1 * d1 - b1 * c1;
      if (D === 0 || a1 === 0 || d1 === 0) continue;
      const ans = `${D}`, ds = pick3(ans, [a1 * d1 + b1 * c1, b1 * c1 - a1 * d1, a1 * c1 - b1 * d1, a1 * b1 - c1 * d1].map(String)); // added, reversed, wrong pairs
      if (!ds) continue;
      const a = ri(0, 3), o = ds.map(z => `$${z}$`); o.splice(a, 0, `$${ans}$`);
      return {
        q: `Find the determinant of $\\begin{pmatrix}${a1}&${b1}\\\\${c1}&${d1}\\end{pmatrix}$.`, o, a,
        x: `$\\det=ad-bc=(${a1})(${d1})-(${b1})(${c1})=${a1 * d1}-${pa(b1 * c1)}=${D}$. Leading diagonal minus the other diagonal.`,
        p: { a: a1, b: b1, c: c1, d: d1 }
      };
    }
    throw new Error("g-fm-det: no valid question");
  }
});

RM.gen({
  id: "g-fm-inventry", s: "further", t: "fp-matrices", lv: 2,
  make(r) {
    const ri = (lo, hi) => lo + Math.floor(r() * (hi - lo + 1));
    const pick3 = (ans, pool) => { const o = []; for (const d of pool) if (d != null && d !== ans && o.indexOf(d) < 0) o.push(d); return o.length >= 3 ? o.slice(0, 3) : null; };
    const g = (x, y) => (y ? g(y, x % y) : Math.abs(x));
    const fr = (n, d) => { if (d < 0) { n = -n; d = -d; } const k = g(n, d) || 1; n /= k; d /= k; return d === 1 ? `${n}` : `${n < 0 ? "-" : ""}\\frac{${Math.abs(n)}}{${d}}`; };
    for (let k = 0; k < 500; k++) {
      const a1 = ri(-5, 7), b1 = ri(-5, 7), c1 = ri(-5, 7), d1 = ri(-5, 7), D = a1 * d1 - b1 * c1;
      if (Math.abs(D) < 2 || Math.abs(D) > 6) continue;
      const i = ri(0, 1), j = ri(0, 1), M = [[a1, b1], [c1, d1]], adj = [[d1, -b1], [-c1, a1]];
      const ans = fr(adj[i][j], D);
      const ds = pick3(ans, [fr(M[i][j], D), `${adj[i][j]}`, fr(-adj[i][j], D), fr(adj[j][i], D)]); // not swapped/signed, not divided, sign slip, wrong position
      if (!ds) continue;
      const a = ri(0, 3), o = ds.map(z => `$${z}$`); o.splice(a, 0, `$${ans}$`);
      return {
        q: `$\\mathbf{M}=\\begin{pmatrix}${a1}&${b1}\\\\${c1}&${d1}\\end{pmatrix}$. Find the entry in row ${i + 1}, column ${j + 1} of $\\mathbf{M}^{-1}$.`, o, a,
        x: `$\\det\\mathbf{M}=(${a1})(${d1})-(${b1})(${c1})=${D}$, so $\\mathbf{M}^{-1}=${fr(1, D)}\\begin{pmatrix}${d1}&${-b1}\\\\${-c1}&${a1}\\end{pmatrix}$ and the entry is $${ans}$. Swap $a$ and $d$, negate $b$ and $c$, divide by the determinant.`,
        p: { a: a1, b: b1, c: c1, d: d1, i, j }
      };
    }
    throw new Error("g-fm-inventry: no valid question");
  }
});

RM.gen({
  id: "g-fm-coalesce", s: "further", t: "fm-mom", lv: 2,
  make(r) {
    const ri = (lo, hi) => lo + Math.floor(r() * (hi - lo + 1));
    const pick3 = (ans, pool) => { const o = []; for (const d of pool) if (d != null && d !== ans && o.indexOf(d) < 0) o.push(d); return o.length >= 3 ? o.slice(0, 3) : null; };
    const U = "\\text{ m s}^{-1}", nf = v => `${Math.round(v * 1000) / 1000}`;
    for (let k = 0; k < 500; k++) {
      const Mt = [2, 4, 5, 8, 10][ri(0, 4)], m1 = ri(1, Mt - 1), m2 = Mt - m1, u1 = ri(2, 9), opp = r() < 0.65;
      const u2 = opp ? -ri(1, 8) : ri(1, u1 - 1), mom = m1 * u1 + m2 * u2;    // velocities with P's direction positive
      if (mom === 0) continue;
      const v = mom / Mt, fm = z => `$${nf(z)}${U}$`, ans = fm(v);
      const tidy = z => z != null && Math.abs(z * 1000 - Math.round(z * 1000)) < 1e-9;   // no recurring decimals among the distractors
      const ds = pick3(ans, [opp ? (m1 * u1 - m2 * u2) / Mt : null, -v, mom / m1, mom / m2, (u1 + u2) / 2].map(z => (tidy(z) ? fm(z) : null))); // direction ignored, sign flipped, wrong mass, velocities averaged
      if (!ds) continue;
      const a = ri(0, 3), o = ds.slice(); o.splice(a, 0, ans);
      const PQ = `Particles P ($${m1}\\text{ kg}$) and Q ($${m2}\\text{ kg}$) move`, end = "Taking P's direction as positive, find the velocity of the combined particle.";
      return {
        q: opp
          ? `${PQ} towards each other at $${u1}${U}$ and $${-u2}${U}$, collide and coalesce. ${end}`
          : `${PQ} in the same direction at $${u1}${U}$ and $${u2}${U}$. P catches Q and they coalesce. ${end}`,
        o, a,
        x: `Momentum is conserved: $${m1}(${u1})+${m2}(${u2})=${Mt}v$, so $v=\\frac{${mom}}{${Mt}}=${nf(v)}${U}$.${opp ? " Q's velocity is negative because it moves the other way." : ""}${v < 0 ? " The negative answer means the combined particle moves in Q's original direction." : ""}`,
        p: { m1, m2, u1, u2 }
      };
    }
    throw new Error("g-fm-coalesce: no valid question");
  }
});
