import { useLayoutEffect, useRef, useState, type CSSProperties, type KeyboardEvent } from "react";
import type { Run } from "./monitoring";
import type { Series } from "./ask";

const series = [
  { key: "matched", label: "Matched" },
  { key: "different", label: "Difference" },
  { key: "missing", label: "Gap" },
] as const;

const HEIGHT = 184;
const PAD = { top: 20, right: 4, bottom: 30, left: 28 };
const BAR = 24;
const SPACER = 2;

type Slot = { kind: "run"; run: Run } | { kind: "delayed"; at: string };

function clock(iso: string) {
  return new Date(iso).toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });
}

function plural(count: number, word: string) {
  return `${count} ${word}${count === 1 ? "" : "s"}`;
}

function describeSlot(slot: Slot) {
  if (slot.kind === "delayed") return `${clock(slot.at)}: receiving records delayed, no check ran`;
  const { run } = slot;
  return `${clock(run.checkedAt)}: ${plural(run.checked, "package")} compared, ${run.matched} matched, ${plural(run.different, "difference")}, ${plural(run.missing, "gap")}`;
}

function topRounded(x: number, y: number, w: number, h: number) {
  const r = Math.min(4, h, w / 2);
  const b = y + h;
  return `M${x},${b}V${y + r}Q${x},${y} ${x + r},${y}H${x + w - r}Q${x + w},${y} ${x + w},${y + r}V${b}Z`;
}

function niceMax(value: number) {
  const step = value > 20 ? 10 : 5;
  return Math.max(step, Math.ceil(value / step) * step);
}

export function MonitorChart({ runs, delayedAt, focus = null, onFocus }: {
  runs: Run[];
  delayedAt: string | null;
  focus?: Series | null;
  onFocus?: (series: Series | null) => void;
}) {
  const frame = useRef<HTMLDivElement>(null);
  const [width, setWidth] = useState(0);
  const [active, setActive] = useState<number | null>(null);
  const [keyboard, setKeyboard] = useState(false);

  useLayoutEffect(() => {
    const node = frame.current;
    if (!node) return;
    const measure = () => setWidth(Math.round(node.getBoundingClientRect().width));
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  // Runs present on arrival render still; only checks that arrive later grow in.
  const [initial] = useState(() => new Set(runs.map((run) => run.checkedAt)));

  const slots: Slot[] = [...runs.map((run) => ({ kind: "run" as const, run })), ...(delayedAt ? [{ kind: "delayed" as const, at: delayedAt }] : [])];
  const max = niceMax(Math.max(...runs.map((run) => run.checked), 1));
  const plotW = Math.max(0, width - PAD.left - PAD.right);
  const plotH = HEIGHT - PAD.top - PAD.bottom;
  const band = slots.length ? plotW / slots.length : 0;
  const barW = Math.min(BAR, Math.max(8, band * 0.56));
  const y = (value: number) => PAD.top + plotH - (value / max) * plotH;
  const step = max > 20 ? 10 : 5;
  const ticks = Array.from({ length: max / step + 1 }, (_, index) => index * step);
  const labelEvery = band >= 56 ? 1 : 2;
  const latestRun = runs.length - 1;
  const totals = Object.fromEntries(series.map(({ key }) => [key, runs.reduce((sum, run) => sum + run[key], 0)])) as Record<Series, number>;
  const total = totals.matched + totals.different + totals.missing;
  const shown = active === null ? null : slots[active];

  function move(event: KeyboardEvent<HTMLDivElement>) {
    const last = slots.length - 1;
    const next = event.key === "ArrowLeft" ? Math.max(0, (active ?? last + 1) - 1)
      : event.key === "ArrowRight" ? Math.min(last, (active ?? -1) + 1)
        : event.key === "Home" ? 0 : event.key === "End" ? last : undefined;
    if (event.key === "Escape") { setActive(null); return; }
    if (next === undefined) return;
    event.preventDefault();
    setKeyboard(true);
    setActive(next);
  }

  const tipFlip = active !== null && active >= slots.length / 2;
  const tipX = active === null ? 0 : PAD.left + band * (active + 0.5) + (tipFlip ? -1 : 1) * (barW / 2 + 8);

  return <figure className="monitor-chart" aria-labelledby="monitor-chart-title">
    <figcaption className="chart-head">
      <span className="kicker" id="monitor-chart-title">Sample checks today</span>
      <span className="chart-total"><strong>{total}</strong> packages compared</span>
      <span className="chart-sub">{totals.different + totals.missing} flagged across {plural(runs.length, "check")}</span>
    </figcaption>
    <div className="chart-legend" role="group" aria-label="Focus one result">
      {series.map(({ key, label }) => <button key={key} type="button" aria-pressed={focus === key}
        onClick={() => onFocus?.(focus === key ? null : key)}>
        <span className="chart-swatch" data-series={key} aria-hidden="true" />{label}<b>{totals[key]}</b>
      </button>)}
      {delayedAt && <span className="chart-legend-note"><span className="chart-swatch" data-series="delayed" aria-hidden="true" />Delayed</span>}
    </div>
    <div className="chart-frame" ref={frame} tabIndex={0} role="group"
      aria-label={`Sample receiving checks, ${slots.length} shown. Use the left and right arrow keys to read each check.`}
      data-keyboard={keyboard || undefined}
      onKeyDown={move} onFocus={() => setActive((current) => current ?? slots.length - 1)}
      onBlur={() => { setActive(null); setKeyboard(false); }}
      onPointerLeave={() => { if (!keyboard) setActive(null); }}>
      {width > 0 && <svg width={width} height={HEIGHT} aria-hidden="true" data-active={active !== null || undefined} data-focus={focus ?? undefined}>
        {ticks.map((tick) => <g key={tick} className="chart-tick">
          <line x1={PAD.left} x2={width - PAD.right} y1={y(tick)} y2={y(tick)} />
          <text x={PAD.left - 8} y={y(tick)} dy="0.35em" textAnchor="end">{tick}</text>
        </g>)}
        {slots.map((slot, index) => {
          const cx = PAD.left + band * (index + 0.5);
          const x = cx - barW / 2;
          const showLabel = index === slots.length - 1 || (slots.length - 1 - index) % labelEvery === 0;
          const time = slot.kind === "run" ? slot.run.checkedAt : slot.at;
          return <g key={`${slot.kind}-${time}`} className="chart-slot" data-kind={slot.kind}
            data-current={active === index || undefined}
            data-fresh={slot.kind === "run" && !initial.has(slot.run.checkedAt) ? true : undefined}
            onPointerEnter={() => { setKeyboard(false); setActive(index); }}>
            <rect className="chart-hit" x={PAD.left + band * index} y={PAD.top - 12} width={band} height={plotH + 12} />
            {slot.kind === "run" ? <g className="chart-column" style={{ transformOrigin: `${cx}px ${y(0)}px`, "--i": initial.has(slot.run.checkedAt) ? index : 0 } as CSSProperties}>
              {(() => {
                let base = 0;
                const parts = series.map(({ key }) => ({ key, value: slot.run[key] })).filter((part) => part.value > 0);
                return parts.map((part, partIndex) => {
                  const top = y(base + part.value);
                  const bottom = y(base);
                  base += part.value;
                  const isTop = partIndex === parts.length - 1;
                  const h = Math.max(1, bottom - top - (isTop ? 0 : SPACER));
                  const segY = isTop ? top : top + SPACER;
                  return isTop
                    ? <path key={part.key} data-series={part.key} d={topRounded(x, segY, barW, bottom - segY)} />
                    : <rect key={part.key} data-series={part.key} x={x} y={segY} width={barW} height={h} />;
                });
              })()}
            </g> : <g className="chart-delayed">
              <rect x={x + 0.5} y={y(max * 0.45)} width={barW - 1} height={y(0) - y(max * 0.45) - 0.5} rx={4} />
              <text x={cx} y={y(max * 0.45) - 6} textAnchor="middle">Delayed</text>
            </g>}
            {slot.kind === "run" && index === latestRun && !delayedAt && <text className="chart-cap" x={cx} y={y(slot.run.checked) - 6} textAnchor="middle">{slot.run.checked}</text>}
            {slot.kind === "run" && index === latestRun && !delayedAt && <circle className="chart-latest" cx={cx} cy={HEIGHT - 2} r={3} />}
            {showLabel && <text className="chart-time" x={cx} y={HEIGHT - 10} textAnchor="middle">{clock(time).replace(/\s?[AP]M$/i, "")}</text>}
          </g>;
        })}
        <line className="chart-baseline" x1={PAD.left} x2={width - PAD.right} y1={y(0)} y2={y(0)} />
      </svg>}
      {shown && <div className="chart-tip" key={active} data-flip={tipFlip || undefined} style={{ left: tipX, top: PAD.top }}>
        {shown.kind === "run" ? <>
          <strong>{plural(shown.run.checked, "package")}</strong>
          <span className="chart-tip-time">{clock(shown.run.checkedAt)}</span>
          {series.map(({ key, label }) => <span key={key} className="chart-tip-row"><span className="chart-key" data-series={key} /><b>{shown.run[key]}</b> {label}</span>)}
        </> : <>
          <strong>Delayed</strong>
          <span className="chart-tip-time">{clock(shown.at)}</span>
          <span className="chart-tip-row">No new receiving records to compare</span>
        </>}
      </div>}
    </div>
    <p className="sr-only" aria-live="polite">{keyboard && shown ? describeSlot(shown) : ""}</p>
  </figure>;
}
