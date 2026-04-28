/* global React, ReactDOM */
const { useState, useRef, useEffect } = React;

const APP_STORE_URL = window.__APP_STORE_URL__ || 'https://apps.apple.com/app/id6747653382';
const API_BASE      = window.__API_BASE_URL__  || '';

// ── Design tokens ────────────────────────────────────────────
const ACCENT      = '#0095FF';
const ACCENT_SOFT = 'rgba(0, 149, 255, 0.12)';   // eslint-disable-line no-unused-vars
const INK         = 'oklch(0.22 0.01 80)';
const INK_DIM     = 'oklch(0.50 0.01 80)';
const INK_FAINT   = 'oklch(0.72 0.005 80)';
const PAPER       = 'oklch(0.99 0.003 80)';
const PAPER_2     = 'oklch(0.97 0.005 80)';
const HAIR        = 'oklch(0.92 0.005 80)';
const OK          = 'oklch(0.72 0.14 150)';
const OK_SOFT     = 'oklch(0.96 0.04 150)';

// ── Atoms ────────────────────────────────────────────────────
function Logo({ size = 14, color = INK }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: size, fontWeight: 600, letterSpacing: '-0.02em', color }}>
      <span style={{
        width: size + 2, height: size + 2, borderRadius: '50%',
        background: ACCENT, display: 'inline-block',
        boxShadow: `inset 0 0 0 ${Math.max(2, size / 4)}px ${PAPER}`,
      }} />
      <span>iknowaplace</span>
    </div>
  );
}

function LockIcon({ size = 11, color = INK_DIM }) {
  return (
    <svg width={size} height={size} viewBox="0 0 12 12" fill="none">
      <rect x="2.5" y="5.5" width="7" height="5" rx="1" stroke={color} strokeWidth="1.2"/>
      <path d="M4 5.5V4a2 2 0 1 1 4 0v1.5" stroke={color} strokeWidth="1.2"/>
    </svg>
  );
}

function CheckDot() {
  return (
    <span style={{ width: 14, height: 14, borderRadius: '50%', background: OK_SOFT, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
      <svg width="8" height="8" viewBox="0 0 8 8" fill="none">
        <path d="M1.5 4.2 L3.2 5.8 L6.5 2.3" stroke={OK} strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    </span>
  );
}

// Status pill — four states with distinct colours
function StatusPill({ label }) {
  const styles = {
    'Open':         { bg: OK_SOFT,                 fg: 'oklch(0.42 0.14 150)', bd: 'oklch(0.86 0.06 150)' },
    'Closing soon': { bg: 'oklch(0.96 0.05 60)',   fg: 'oklch(0.48 0.16 60)',  bd: 'oklch(0.88 0.09 60)'  },
    'Open soon':    { bg: 'oklch(0.95 0.04 230)',  fg: 'oklch(0.48 0.13 230)', bd: 'oklch(0.86 0.07 230)' },
    'Closed':       { bg: PAPER_2,                 fg: INK_DIM,                bd: HAIR                   },
  };
  const s = styles[label] || styles['Closed'];
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 4,
      padding: '3px 8px', borderRadius: 999,
      background: s.bg, color: s.fg, border: `1px solid ${s.bd}`,
      fontSize: 10.5, fontWeight: 500, letterSpacing: '-0.005em', whiteSpace: 'nowrap',
    }}>● {label || 'Closed'}</span>
  );
}

function Pill({ children, tone = 'neutral', size = 'md' }) {
  const tones = {
    neutral: { bg: PAPER_2, fg: INK, bd: HAIR },
    ok:      { bg: OK_SOFT, fg: 'oklch(0.42 0.14 150)', bd: 'oklch(0.86 0.06 150)' },
  };
  const t = tones[tone];
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 4,
      padding: size === 'sm' ? '3px 8px' : '5px 10px', borderRadius: 999,
      background: t.bg, color: t.fg, border: `1px solid ${t.bd}`,
      fontSize: size === 'sm' ? 10.5 : 11.5, fontWeight: 500,
      letterSpacing: '-0.005em', whiteSpace: 'nowrap',
    }}>{children}</span>  // eslint-disable-line no-unused-vars
  );
}

function FacilityIcon({ kind, size = 18, color = INK }) {
  const s = { width: size, height: size, stroke: color, strokeWidth: 1.4, fill: 'none', strokeLinecap: 'round', strokeLinejoin: 'round' };
  if (kind === 'wifi') return (
    <svg viewBox="0 0 20 20" {...s}>
      <path d="M3 8c4-3.5 10-3.5 14 0"/><path d="M5.5 11c2.5-2.2 6.5-2.2 9 0"/>
      <path d="M8 13.8c1.2-1 2.8-1 4 0"/>
      <circle cx="10" cy="15.8" r="0.7" fill={color} stroke="none"/>
    </svg>
  );
  if (kind === 'power') return (
    <svg viewBox="0 0 20 20" {...s}>
      <path d="M7 3v3M13 3v3"/>
      <rect x="5" y="6" width="10" height="6" rx="1.5"/>
      <path d="M10 12v3M10 15a2 2 0 0 0 2 2h0"/>
    </svg>
  );
  if (kind === 'water') return (
    <svg viewBox="0 0 20 20" {...s}>
      <path d="M10 3c-3 4-5 6.5-5 9a5 5 0 0 0 10 0c0-2.5-2-5-5-9z"/>
    </svg>
  );
  return null;
}

// ── Hero images ──────────────────────────────────────────────
function HeroPlaceholder({ height = 240 }) {
  return (
    <div style={{ width: '100%', height, position: 'relative', overflow: 'hidden', background: 'repeating-linear-gradient(135deg, oklch(0.86 0.02 60) 0 8px, oklch(0.90 0.02 60) 8px 16px)' }}>
      <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, transparent 55%, rgba(0,0,0,0.35) 100%)' }} />
    </div>
  );
}

function HeroImageSlide({ url, label, height = 240 }) {
  if (!url) return <HeroPlaceholder height={height} />;
  return (
    <div style={{ width: '100%', height, position: 'relative', overflow: 'hidden', background: PAPER_2 }}>
      <img src={url} alt={label || 'cafe photo'} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
      <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, transparent 55%, rgba(0,0,0,0.35) 100%)' }} />
    </div>
  );
}

// ── Hero carousel ────────────────────────────────────────────
function HeroCarousel({ images = [] }) {
  const [idx, setIdx] = useState(0);
  const startX = useRef(null);

  const photoSlides = images.length > 0
    ? images.slice(0, 3).map(img => ({ kind: 'photo', url: img.url, label: img.label }))
    : [{ kind: 'photo', url: null, label: 'cafe interior' }];
  const slides     = [...photoSlides, { kind: 'lock' }];
  const photoCount = photoSlides.length;
  const total      = slides.length;

  const onStart = (e) => { const t = e.touches ? e.touches[0] : e; startX.current = t.clientX; };
  const onEnd   = (e) => {
    if (startX.current == null) return;
    const t  = e.changedTouches ? e.changedTouches[0] : e;
    const dx = t.clientX - startX.current;
    if (Math.abs(dx) > 30) setIdx(i => Math.max(0, Math.min(total - 1, i + (dx < 0 ? 1 : -1))));
    startX.current = null;
  };

  return (
    <div
      style={{ position: 'relative', width: '100%', height: 240, overflow: 'hidden', background: PAPER_2, userSelect: 'none' }}
      onMouseDown={onStart} onMouseUp={onEnd} onTouchStart={onStart} onTouchEnd={onEnd}
    >
      <div style={{
        display: 'flex', height: '100%',
        width: `${total * 100}%`,
        transform: `translateX(-${idx * (100 / total)}%)`,
        transition: 'transform 320ms cubic-bezier(.2,.7,.2,1)',
      }}>
        {slides.map((s, i) => (
          <div key={i} style={{ width: `${100 / total}%`, height: '100%', flexShrink: 0 }}>
            {s.kind === 'photo'
              ? <HeroImageSlide url={s.url} label={s.label} height={240} />
              : <CarouselGetAppPanel onBack={() => setIdx(photoCount - 1)} />}
          </div>
        ))}
      </div>

      {/* Dot indicators */}
      <div style={{ position: 'absolute', bottom: 10, left: 0, right: 0, display: 'flex', justifyContent: 'center', gap: 5, zIndex: 3 }}>
        {slides.map((_, i) => (
          <button key={i} onClick={() => setIdx(i)} style={{
            width: i === idx ? 18 : 6, height: 6, borderRadius: 999,
            background: i === idx ? 'white' : 'rgba(255,255,255,0.55)',
            border: 'none', padding: 0, cursor: 'pointer', transition: 'width 200ms',
          }} />
        ))}
      </div>

      {/* Counter badge */}
      <div style={{
        position: 'absolute', top: 14, left: '50%', transform: 'translateX(-50%)', zIndex: 3,
        padding: '3px 9px', borderRadius: 999,
        background: 'rgba(0,0,0,0.45)', backdropFilter: 'blur(8px)', WebkitBackdropFilter: 'blur(8px)',
        color: 'white', fontSize: 11, fontWeight: 500, letterSpacing: '0.02em',
      }}>
        {idx < photoCount ? `${idx + 1} / ${photoCount}` : '+5 more in app'}
      </div>
    </div>
  );
}

function CarouselGetAppPanel({ onBack }) {
  return (
    <div style={{ width: '100%', height: '100%', position: 'relative', background: INK, color: PAPER, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '0 28px', textAlign: 'center', gap: 10 }}>
      <div style={{ position: 'absolute', inset: 0, opacity: 0.35, background: 'repeating-linear-gradient(135deg, oklch(0.45 0.05 50) 0 18px, oklch(0.55 0.06 60) 18px 36px)', filter: 'blur(14px)' }} />
      <div style={{ position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10 }}>
        <span style={{ width: 36, height: 36, borderRadius: 10, background: 'rgba(255,255,255,0.12)', border: '1px solid rgba(255,255,255,0.18)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <LockIcon size={14} color={PAPER} />
        </span>
        <div style={{ fontSize: 15, fontWeight: 600, letterSpacing: '-0.01em' }}>5 more photos in the app</div>
        <div style={{ fontSize: 11.5, color: 'rgba(255,255,255,0.7)', maxWidth: 240, lineHeight: 1.45 }}>
          See the full set of cafe photos, plus shots from other regulars.
        </div>
        <div style={{ display: 'flex', gap: 6, marginTop: 4 }}>
          <a href={APP_STORE_URL} style={{ padding: '7px 14px', borderRadius: 999, background: PAPER, color: INK, fontSize: 12, fontWeight: 600, textDecoration: 'none' }}>Get the app</a>
          <button onClick={onBack} style={{ padding: '7px 12px', borderRadius: 999, background: 'rgba(255,255,255,0.12)', color: PAPER, border: '1px solid rgba(255,255,255,0.18)', fontSize: 12, fontWeight: 500, cursor: 'pointer' }}>Back</button>
        </div>
      </div>
    </div>
  );
}

// ── Facility rows ────────────────────────────────────────────
function WifiRow({ hasWifi }) {
  const unavailable = !hasWifi;
  return (
    <div style={{ padding: '12px 14px', borderBottom: `1px solid ${HAIR}`, opacity: unavailable ? 0.55 : 1 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <FacilityIcon kind="wifi" size={17} color={unavailable ? INK_DIM : INK} />
        <div style={{ flex: 1, fontSize: 13.5, fontWeight: 500, textDecoration: unavailable ? 'line-through' : 'none', color: unavailable ? INK_DIM : INK }}>WiFi</div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          {!unavailable && (<><CheckDot /><span style={{ fontSize: 12.5, color: INK_DIM }}>Available</span></>)}
          {unavailable && (
            <><span style={{ width: 14, height: 14, borderRadius: '50%', background: PAPER_2, border: `1px solid ${HAIR}`, display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
              <svg width="7" height="7" viewBox="0 0 8 8" fill="none"><path d="M2 2 L6 6 M6 2 L2 6" stroke={INK_DIM} strokeWidth="1.4" strokeLinecap="round"/></svg>
            </span><span style={{ fontSize: 12.5, color: INK_DIM }}>Unavailable</span></>
          )}
        </div>
      </div>
      {!unavailable && (
        <a href={APP_STORE_URL} style={{ marginTop: 10, display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 10, width: '100%', padding: '10px 12px', borderRadius: 10, background: PAPER_2, border: `1px solid ${HAIR}`, textDecoration: 'none', textAlign: 'left' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 9, minWidth: 0 }}>
            <span style={{ width: 24, height: 24, borderRadius: 7, background: PAPER, border: `1px solid ${HAIR}`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <LockIcon size={11} color={INK_DIM} />
            </span>
            <div style={{ minWidth: 0 }}>
              <div style={{ fontSize: 12.5, fontWeight: 600, color: INK, letterSpacing: '-0.005em', whiteSpace: 'nowrap', lineHeight: 1.25 }}>Connect in one tap</div>
              <div style={{ fontSize: 10.5, color: INK_DIM, marginTop: 2, lineHeight: 1.25 }}>Available in the app</div>
            </div>
          </div>
          <span style={{ fontSize: 11, fontWeight: 600, color: INK, padding: '4px 9px', borderRadius: 999, background: PAPER, border: `1px solid ${HAIR}`, whiteSpace: 'nowrap' }}>Get app</span>
        </a>
      )}
    </div>
  );
}

function FacilityRow({ icon, label, last }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '11px 14px', borderBottom: last ? 'none' : `1px solid ${HAIR}` }}>
      <FacilityIcon kind={icon} size={17} color={INK_DIM} />
      <div style={{ flex: 1, fontSize: 13.5, fontWeight: 500, color: INK }}>{label}</div>
      <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5, fontSize: 11.5, color: INK_DIM, padding: '3px 8px', borderRadius: 999, background: PAPER_2, border: `1px solid ${HAIR}` }}>
        <LockIcon size={9} color={INK_DIM} /> In app
      </span>
    </div>
  );
}

function AppOnlyList({ items }) {
  return (
    <div style={{ borderTop: `1px solid ${HAIR}`, background: PAPER_2, padding: '11px 14px 12px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 10.5, fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase', color: INK_DIM, marginBottom: 8 }}>
        <LockIcon size={9} color={INK_DIM} /> More in the app
      </div>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5 }}>
        {items.map(label => (
          <span key={label} style={{ display: 'inline-flex', alignItems: 'center', padding: '4px 9px', borderRadius: 999, background: PAPER, border: `1px solid ${HAIR}`, fontSize: 11, color: INK, fontWeight: 500, whiteSpace: 'nowrap' }}>{label}</span>
        ))}
      </div>
    </div>
  );
}

// ── Non-Safari iOS deep-link banner ─────────────────────────
const isIOS       = /iPad|iPhone|iPod/.test(navigator.userAgent);
const isSafari    = /Safari/.test(navigator.userAgent) && !/CriOS|FxiOS|OPiOS|EdgiOS|Chrome/.test(navigator.userAgent);
const needsBanner = isIOS && !isSafari;

function DeeplinkBanner() {
  const [dismissed, setDismissed] = useState(false);
  if (!needsBanner || dismissed) return null;

  const m    = window.location.pathname.match(/\/app\/location\/([^\/]+)/);
  const slug = m ? m[1] : null;
  if (!slug) return null;

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 14px', background: PAPER_2, borderBottom: `1px solid ${HAIR}`, flexShrink: 0 }}>
      <div style={{ width: 40, height: 40, borderRadius: 10, background: INK, flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Logo size={10} color={PAPER} />
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 13, fontWeight: 600, color: INK, letterSpacing: '-0.01em' }}>I know a place</div>
        <div style={{ fontSize: 11, color: INK_DIM, marginTop: 1 }}>Free · Open for the full experience</div>
      </div>
      <a href={'iknowaplace://location/' + slug} style={{ padding: '7px 14px', borderRadius: 999, background: ACCENT, color: PAPER, border: 'none', fontSize: 12, fontWeight: 600, cursor: 'pointer', whiteSpace: 'nowrap', flexShrink: 0, textDecoration: 'none' }}>Open</a>
      <button onClick={() => setDismissed(true)} style={{ background: 'none', border: 'none', color: INK_DIM, cursor: 'pointer', fontSize: 18, padding: '0 2px', lineHeight: 1, flexShrink: 0 }}>×</button>
    </div>
  );
}

// ── Top-bar buttons ──────────────────────────────────────────
function CircleBtn({ ico, locked, onClick }) {
  const paths = {
    share:    <><path d="M12 4v10" stroke="white" strokeWidth="1.5" strokeLinecap="round"/><path d="M8 7l4-4 4 4" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/><path d="M5 11v7h14v-7" stroke="white" strokeWidth="1.5" strokeLinecap="round"/></>,
    bookmark: <path d="M7 4h10v16l-5-4-5 4z" stroke="white" strokeWidth="1.5" strokeLinejoin="round" fill="none"/>,
  };
  return (
    <button onClick={onClick} style={{ width: 34, height: 34, borderRadius: '50%', border: 'none', background: 'rgba(0,0,0,0.32)', backdropFilter: 'blur(8px)', WebkitBackdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', position: 'relative' }}>
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none">{paths[ico]}</svg>
      {locked && (
        <span style={{ position: 'absolute', bottom: -2, right: -2, width: 14, height: 14, borderRadius: '50%', background: PAPER, display: 'flex', alignItems: 'center', justifyContent: 'center', border: `1px solid ${HAIR}` }}>
          <LockIcon size={8} color={INK} />
        </span>
      )}
    </button>
  );
}

function SectionTitle({ children }) {
  return (
    <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase', color: INK_DIM, marginBottom: 8 }}>
      {children}
    </div>
  );
}

function StickyCTA() {
  return (
    <div style={{ padding: '12px 16px max(18px, env(safe-area-inset-bottom, 18px))', borderTop: `1px solid ${HAIR}`, background: PAPER, display: 'flex', flexDirection: 'column', gap: 6 }}>
      <a href={APP_STORE_URL} style={{ width: '100%', padding: '13px 16px', borderRadius: 12, background: INK, color: PAPER, border: 'none', fontSize: 14, fontWeight: 600, letterSpacing: '-0.01em', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, textDecoration: 'none' }}>
        Download the app
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
          <path d="M3 7h8M7 3l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </a>
      <div style={{ fontSize: 10.5, color: INK_FAINT, textAlign: 'center' }}>Free · iOS · Android coming soon · Unlock WiFi, reviews & more</div>
    </div>
  );
}

// ── Loading skeleton ─────────────────────────────────────────
function LoadingCard() {
  const Skel = ({ w, h, r = 6, mt = 0 }) => (
    <div style={{ width: w, height: h, borderRadius: r, background: HAIR, marginTop: mt, animation: 'pulse 1.4s ease-in-out infinite' }} />
  );
  return (
    <div style={{ width: '100%', height: '100%', background: PAPER, display: 'flex', flexDirection: 'column', position: 'relative', overflow: 'hidden' }}>
      <div style={{ width: '100%', height: 240, background: HAIR, animation: 'pulse 1.4s ease-in-out infinite' }} />
      <div style={{ padding: '18px 18px 0', display: 'flex', flexDirection: 'column', gap: 16 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Skel w="55%" h={22} r={8} />
          <Skel w={52} h={20} r={999} />
        </div>
        <Skel w="35%" h={13} r={4} />
        <div style={{ display: 'flex', gap: 6 }}>
          <Skel w={90} h={26} r={999} />
          <Skel w={110} h={26} r={999} />
        </div>
        <Skel w="100%" h={130} r={14} mt={4} />
      </div>
    </div>
  );
}

// ── Error state ──────────────────────────────────────────────
function ErrorCard({ message }) {
  return (
    <div style={{ width: '100%', height: '100%', background: PAPER, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 12, padding: '0 32px', textAlign: 'center' }}>
      <div style={{ fontSize: 28 }}>☕</div>
      <div style={{ fontSize: 15, fontWeight: 600, color: INK }}>Can't load this place</div>
      <div style={{ fontSize: 13, color: INK_DIM, lineHeight: 1.5 }}>{message}</div>
      <a href={APP_STORE_URL} style={{ marginTop: 8, padding: '11px 22px', borderRadius: 12, background: INK, color: PAPER, fontSize: 13, fontWeight: 600, textDecoration: 'none' }}>Get the app instead</a>
    </div>
  );
}

// ── Card Stack — driven by API data ──────────────────────────
const APP_ONLY = ['Crowd & seat availability', 'Air conditioning', 'Toilet', 'Opening hours', 'Maximum stay', 'Minimum spending'];

function MobileCard({ data }) {
  const { name, address_district, address_city, status, has_wifi, images = [] } = data;
  const statusLabel = status && status.label ? status.label : (status && status.is_open ? 'Open' : 'Closed');

  const handleShare = () => {
    const url = window.location.href;
    if (navigator.share) {
      navigator.share({ title: name, url });
    } else {
      navigator.clipboard.writeText(url);
    }
  };

  return (
    <div style={{ width: '100%', height: '100%', background: PAPER, color: INK, fontFamily: 'Inter, system-ui, sans-serif', fontSize: 14, display: 'flex', flexDirection: 'column', position: 'relative', overflow: 'hidden' }}>
      {/* Top bar */}
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, zIndex: 5, padding: '14px 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'linear-gradient(180deg, rgba(0,0,0,0.35), transparent)' }}>
        <Logo color="white" size={13} />
        <div style={{ display: 'flex', gap: 8 }}>
          <CircleBtn ico="share" onClick={handleShare} />
          <CircleBtn ico="bookmark" locked />
        </div>
      </div>

      <HeroCarousel images={images} />

      <div style={{ padding: '14px 18px 0', flex: 1, display: 'flex', flexDirection: 'column', gap: 12, overflowY: 'auto' }}>
        {/* Title + status */}
        <div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8 }}>
            <h1 style={{ margin: 0, fontSize: 22, fontWeight: 600, letterSpacing: '-0.02em' }}>{name}</h1>
            <StatusPill label={statusLabel} />
          </div>
          <div style={{ marginTop: 2, fontSize: 12, color: INK_DIM }}>
            {[address_district, address_city].filter(Boolean).join(' · ')}
          </div>
        </div>

        {/* Facilities */}
        <div style={{ marginTop: 2 }}>
          <SectionTitle>Facilities</SectionTitle>
          <div style={{ border: `1px solid ${HAIR}`, borderRadius: 14, overflow: 'hidden', background: PAPER }}>
            <WifiRow hasWifi={has_wifi} />
            <FacilityRow icon="power" label="Power sockets" />
            <FacilityRow icon="water" label="Water refills" last={false} />
            <AppOnlyList items={APP_ONLY} />
          </div>
        </div>
      </div>

      <StickyCTA />
    </div>
  );
}

// ── Social sharing (desktop only) ───────────────────────────
function SocialShare() {
  const [copied, setCopied] = useState(false);
  const url = window.location.href;

  const copyLink = () => {
    navigator.clipboard.writeText(url).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const btn = {
    width: 34, height: 34, borderRadius: '50%', flexShrink: 0,
    background: 'rgba(255,255,255,0.10)', border: '1px solid rgba(255,255,255,0.18)',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    cursor: 'pointer', textDecoration: 'none',
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
      <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.5)' }}>Share this place</div>
      <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
        <a href="https://x.com/iknowaplaceapp" target="_blank" rel="noopener noreferrer" style={btn} title="X (Twitter)">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="white"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.743l7.738-8.835L1.254 2.25H8.08l4.253 5.622 5.91-5.622zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
        </a>
        <a href="https://www.instagram.com/iknowaplace.app/" target="_blank" rel="noopener noreferrer" style={btn} title="Instagram">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="white"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>
        </a>
        <a href="https://www.threads.com/@iknowaplace.app" target="_blank" rel="noopener noreferrer" style={btn} title="Threads">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="white"><path d="M12.186 24h-.007c-3.581-.024-6.334-1.205-8.184-3.509C2.35 18.44 1.5 15.586 1.472 12.01v-.017c.028-3.579.879-6.43 2.525-8.482C5.845 1.205 8.6.024 12.18 0h.014c2.746.02 5.043.725 6.826 2.098 1.677 1.29 2.858 3.13 3.509 5.467l-2.04.569c-1.104-3.96-3.898-5.984-8.304-6.015-2.91.022-5.11.936-6.54 2.717C4.307 6.504 3.616 8.914 3.589 12c.027 3.086.718 5.496 2.057 7.164 1.43 1.783 3.631 2.698 6.54 2.717 2.623-.02 4.358-.631 5.8-2.045 1.647-1.61 1.838-3.518 1.547-4.67-.239-.951-.882-1.79-1.868-2.434-.253 1.738-.86 3.023-1.812 3.82-1.102.925-2.564 1.384-4.341 1.367-1.53-.015-2.834-.493-3.772-1.383-.998-.947-1.502-2.258-1.457-3.682.047-1.42.677-2.657 1.77-3.488 1.05-.8 2.428-1.18 4.098-1.13.951.028 1.79.124 2.512.285-.096-.623-.305-1.105-.625-1.437-.427-.444-1.097-.67-1.99-.676h-.04c-.68 0-1.556.187-2.129.923l-1.653-1.218C9.302 6.145 10.595 5.6 12.168 5.59h.056c1.49.01 2.68.454 3.44 1.283.707.77 1.1 1.897 1.167 3.35.398.194.78.405 1.144.637 1.556.974 2.56 2.288 2.909 3.798.48 1.999.102 4.668-2.17 6.87C16.93 23.213 14.82 23.978 12.186 24zm-1.007-9.173c1.327.012 2.3-.355 2.893-.857.588-.498.97-1.33 1.133-2.47a16.52 16.52 0 0 0-2.719-.373c-1.058-.033-1.912.153-2.544.638-.576.44-.878 1.064-.901 1.85-.027.826.262 1.483.837 1.931.523.41 1.248.634 2.087.687l.214-.406z"/></svg>
        </a>
        <button onClick={copyLink} style={{ ...btn, border: copied ? '1px solid rgba(255,255,255,0.35)' : btn.border }} title="Copy link">
          {copied
            ? <svg width="13" height="13" viewBox="0 0 14 14" fill="none"><path d="M2.5 7.5L5.5 10.5L11.5 3.5" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
            : <svg width="13" height="13" viewBox="0 0 14 14" fill="none"><rect x="4" y="4" width="8" height="8" rx="1.5" stroke="white" strokeWidth="1.3"/><path d="M2 10V2.5A.5.5 0 0 1 2.5 2H10" stroke="white" strokeWidth="1.3" strokeLinecap="round"/></svg>
          }
        </button>
        {copied && <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.65)' }}>Copied!</span>}
      </div>
    </div>
  );
}

// ── Desktop Frame ────────────────────────────────────────────
function QRCode() {
  return <img src="/assets/images/app_store_qr_code.svg" alt="App Store QR code" width="84" height="84" style={{ display: 'block', width: '100%', height: '100%' }} />;
}

function StoreBadge({ label, disabled }) {
  const Tag   = disabled ? 'div' : 'a';
  const props = disabled ? {} : { href: APP_STORE_URL };
  return (
    <Tag {...props} style={{ padding: '8px 14px', borderRadius: 10, background: 'rgba(255,255,255,0.12)', border: '1px solid rgba(255,255,255,0.18)', fontSize: 12, color: 'white', fontWeight: 500, textDecoration: 'none', display: 'block', opacity: disabled ? 0.45 : 1, cursor: disabled ? 'default' : 'pointer' }}>
      <div style={{ fontSize: 9, opacity: 0.7, marginBottom: 1 }}>{disabled ? 'Coming soon' : 'Download on'}</div>
      {label}
    </Tag>
  );
}

function DesktopFrame({ children, data }) {
  return (
    <div style={{ width: '100vw', height: '100vh', position: 'relative', overflow: 'hidden', background: '#001b43', fontFamily: 'Inter, system-ui, sans-serif' }}>
      {/* Blurred bg */}
      <div style={{ position: 'absolute', inset: '-40px', background: 'radial-gradient(at 20% 30%, rgba(0, 149, 255, 0.4) 0%, transparent 55%), radial-gradient(at 80% 70%, rgba(0, 60, 140, 0.55) 0%, transparent 55%)', filter: 'blur(80px)', opacity: 1 }} />
      <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse at center, transparent 30%, rgba(0,0,0,0.45) 100%)' }} />

      {/* Nav */}
      <div style={{ position: 'relative', padding: '22px 32px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', zIndex: 2 }}>
        <Logo color="white" size={15} />
        <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
          <a href="/" style={{ fontSize: 12.5, color: 'rgba(255,255,255,0.75)', textDecoration: 'none' }}>Home</a>
          <a href={APP_STORE_URL} style={{ padding: '7px 16px', borderRadius: 999, background: '#0095FF', color: '#fff', fontSize: 12, fontWeight: 600, textDecoration: 'none' }}>Get the app</a>
        </div>
      </div>

      {/* Phone + copy */}
      <div style={{ position: 'relative', zIndex: 2, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 56, padding: '0 60px', height: 'calc(100% - 80px)', marginTop: -20 }}>
        <div style={{ position: 'relative', flexShrink: 0 }}>
          <div style={{ position: 'absolute', inset: '-14px', background: 'oklch(0.12 0.01 60)', borderRadius: 52, boxShadow: '0 40px 80px rgba(0,0,0,0.45), 0 12px 30px rgba(0,0,0,0.3)' }} />
          <div style={{ position: 'relative', borderRadius: 38, overflow: 'hidden', width: 390, height: 780 }}>{children}</div>
        </div>

        <div style={{ color: 'white', maxWidth: 320, display: 'flex', flexDirection: 'column', gap: 22, alignSelf: 'stretch', justifyContent: 'center', position: 'relative' }}>
          <div>
            <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.6)', marginBottom: 10 }}>Preview</div>
            <h2 style={{ margin: 0, fontSize: 34, fontWeight: 600, letterSpacing: '-0.025em', lineHeight: 1.1 }}>See the place in full, in the app</h2>
            <p style={{ margin: '12px 0 0', fontSize: 14, lineHeight: 1.55, color: 'rgba(255,255,255,0.78)' }}>
              Connect to WiFi in one tap. See real upload speeds, reviews from other regulars, and 5 more photos of this cafe.
            </p>
          </div>
          <div style={{ display: 'flex', gap: 14, alignItems: 'center' }}>
            <div style={{ width: 100, height: 100, background: 'white', borderRadius: 12, padding: 8, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <QRCode />
            </div>
            <div style={{ fontSize: 12, lineHeight: 1.5, color: 'rgba(255,255,255,0.78)' }}>
              <div style={{ color: 'white', fontWeight: 600, marginBottom: 2 }}>Scan to install</div>
              iOS 15+<br/>Free
            </div>
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <StoreBadge label="App Store" />
            <StoreBadge label="Google Play — coming soon" disabled />
          </div>
          {data && <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0 }}><SocialShare /></div>}
        </div>
      </div>
    </div>
  );
}

// ── Responsive root with API fetch ───────────────────────────
function App() {
  const [isDesktop, setIsDesktop] = useState(() => window.innerWidth >= 800);
  const [data,      setData]      = useState(null);
  const [loading,   setLoading]   = useState(true);
  const [error,     setError]     = useState(null);

  useEffect(() => {
    const mq      = window.matchMedia('(min-width: 800px)');
    const handler = (e) => setIsDesktop(e.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);

  useEffect(() => {
    const pathMatch = window.location.pathname.match(/\/app\/location\/([^\/]+)\/?/);
    const slug = pathMatch
      ? pathMatch[1]
      : new URLSearchParams(window.location.search).get('slug');
    if (slug && !pathMatch) {
      history.replaceState(null, '', '/app/location/' + slug);
    }
    if (!slug) {
      setError('No cafe specified.');
      setLoading(false);
      return;
    }
    fetch(`${API_BASE}/api/v1/location/${encodeURIComponent(slug)}/webapp`)
      .then(r => {
        if (r.status === 404) throw new Error("This place couldn't be found.");
        if (!r.ok)            throw new Error('Something went wrong. Please try again.');
        return r.json();
      })
      .then(json => { setData(json);        setLoading(false); })
      .catch(err => { setError(err.message); setLoading(false); });
  }, []);

  const card = loading    ? <LoadingCard />
             : error      ? <ErrorCard message={error} />
             :               <MobileCard data={data} />;

  if (isDesktop) return <DesktopFrame data={data}>{card}</DesktopFrame>;
  return (
    <div style={{ position: 'fixed', inset: 0, display: 'flex', flexDirection: 'column' }}>
      <DeeplinkBanner />
      <div style={{ flex: 1, minHeight: 0, overflow: 'hidden' }}>
        {card}
      </div>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<App />);
