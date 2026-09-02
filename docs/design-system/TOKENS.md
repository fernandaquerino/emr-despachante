# EMR Despachante — Design Tokens

> Arquitetura em 3 camadas: **primitive → semantic → component**.
> Componentes **nunca** referenciam primitives. Sempre usar semantic tokens.

---

## 1. Primitive color tokens

Escalas 50→950. Valores hex fixos. Não usar diretamente em componentes.

### Navy (marca)

```
navy-50   #F1F5F9
navy-100  #E2E8F0
navy-200  #CBD5E1
navy-300  #94A3B8
navy-400  #64748B
navy-500  #475569
navy-600  #334155
navy-700  #1E293B
navy-800  #172033
navy-900  #0F172A   ← primary
navy-950  #020617
```

### Slate (neutros)

```
slate-50   #F8FAFC
slate-100  #F1F5F9
slate-200  #E2E8F0
slate-300  #CBD5E1
slate-400  #94A3B8
slate-500  #64748B
slate-600  #475569
slate-700  #334155
slate-800  #1E293B
slate-900  #0F172A
slate-950  #020617
```

### Blue (info / accent secundário)

```
blue-50   #EFF6FF
blue-100  #DBEAFE
blue-200  #BFDBFE
blue-300  #93C5FD
blue-400  #60A5FA
blue-500  #3B82F6
blue-600  #2563EB
blue-700  #1D4ED8
blue-800  #1E40AF
blue-900  #1E3A8A
```

### Cobalt (accent CTA)

```
cobalt-50   #F0F7FE
cobalt-100  #DBEAFE
cobalt-200  #BAD8F5
cobalt-300  #7BBAE9
cobalt-400  #3B94D9
cobalt-500  #0F76BE
cobalt-600  #0369A1   ← accent
cobalt-700  #075985
cobalt-800  #0C4A6E
cobalt-900  #082F49
```

### Emerald (success + Regular + Pago)

```
emerald-50   #ECFDF5
emerald-100  #D1FAE5
emerald-200  #A7F3D0
emerald-300  #6EE7B7
emerald-400  #34D399
emerald-500  #10B981
emerald-600  #16A34A   ← success
emerald-700  #047857
emerald-800  #065F46
emerald-900  #064E3B
```

### Amber (warning + Atenção + Aguardando)

```
amber-50   #FFFBEB
amber-100  #FEF3C7
amber-200  #FDE68A
amber-300  #FCD34D
amber-400  #FBBF24
amber-500  #F59E0B
amber-600  #D97706   ← warning
amber-700  #B45309
amber-800  #92400E
amber-900  #78350F
```

### Red (destructive + Irregular + Failed)

```
red-50   #FEF2F2
red-100  #FEE2E2
red-200  #FECACA
red-300  #FCA5A5
red-400  #F87171
red-500  #EF4444
red-600  #DC2626   ← destructive
red-700  #B91C1C
red-800  #991B1B
red-900  #7F1D1D
```

### Purple (Processing / aguardando externo)

```
purple-50   #F5F3FF
purple-100  #EDE9FE
purple-200  #DDD6FE
purple-300  #C4B5FD
purple-400  #A78BFA
purple-500  #8B5CF6
purple-600  #7C3AED   ← processing
purple-700  #6D28D9
purple-800  #5B21B6
purple-900  #4C1D95
```

## 2. Semantic tokens — Light (default)

```css
:root {
  /* Surfaces */
  --bg-default:        #F8FAFC;   /* slate-50 */
  --bg-subtle:         #F1F5F9;   /* slate-100 */
  --bg-emphasis:       #E2E8F0;   /* slate-200 */

  --surface-default:   #FFFFFF;
  --surface-raised:    #FFFFFF;   /* + elev-1 */
  --surface-selected:  #F0F7FE;   /* cobalt-50 */
  --surface-inverse:   #0F172A;   /* navy-900 */

  /* Text */
  --text-primary:      #0F172A;   /* navy-900 */
  --text-secondary:    #475569;   /* slate-600 */
  --text-muted:        #64748B;   /* slate-500 */
  --text-disabled:     #94A3B8;   /* slate-400 */
  --text-inverse:      #FFFFFF;
  --text-link:         #0369A1;   /* cobalt-600 */
  --text-on-primary:   #FFFFFF;
  --text-on-accent:    #FFFFFF;

  /* Borders */
  --border-default:    #E2E8F0;   /* slate-200 */
  --border-subtle:     #F1F5F9;   /* slate-100 */
  --border-strong:     #CBD5E1;   /* slate-300 */
  --border-focus:      #0369A1;   /* cobalt-600 */

  /* Actions */
  --action-primary:            #0F172A;   /* navy-900 */
  --action-primary-hover:      #1E293B;   /* navy-800 */
  --action-primary-active:     #172033;
  --action-primary-disabled:   #CBD5E1;   /* slate-300 */

  --action-secondary:          #FFFFFF;
  --action-secondary-hover:    #F8FAFC;
  --action-secondary-border:   #CBD5E1;

  --action-accent:             #0369A1;   /* cobalt-600 */
  --action-accent-hover:       #075985;
  --action-accent-active:      #0C4A6E;

  --action-destructive:        #DC2626;   /* red-600 */
  --action-destructive-hover:  #B91C1C;
  --action-destructive-active: #991B1B;

  /* Semantic status */
  --status-success:            #16A34A;   /* emerald-600 */
  --status-success-bg:         #ECFDF5;   /* emerald-50 */
  --status-success-fg:         #065F46;   /* emerald-800 */
  --status-success-border:     #A7F3D0;

  --status-warning:            #D97706;   /* amber-600 */
  --status-warning-bg:         #FFFBEB;
  --status-warning-fg:         #92400E;
  --status-warning-border:     #FDE68A;

  --status-error:              #DC2626;   /* red-600 */
  --status-error-bg:           #FEF2F2;
  --status-error-fg:           #991B1B;
  --status-error-border:       #FECACA;

  --status-info:               #2563EB;   /* blue-600 */
  --status-info-bg:            #EFF6FF;
  --status-info-fg:            #1E40AF;
  --status-info-border:        #BFDBFE;

  --status-processing:         #7C3AED;   /* purple-600 */
  --status-processing-bg:      #F5F3FF;
  --status-processing-fg:      #5B21B6;
  --status-processing-border:  #DDD6FE;

  --status-neutral:            #64748B;   /* slate-500 */
  --status-neutral-bg:         #F1F5F9;
  --status-neutral-fg:         #334155;
  --status-neutral-border:     #E2E8F0;

  /* Priority (CasePriority) */
  --priority-critical:  #DC2626;   /* red-600 */
  --priority-high:      #D97706;   /* amber-600 */
  --priority-medium:    #2563EB;   /* blue-600 */
  --priority-low:       #94A3B8;   /* slate-400 */

  /* Data viz — 6 categorical, colorblind-aware order */
  --data-1: #0369A1;   /* cobalt */
  --data-2: #16A34A;   /* emerald */
  --data-3: #D97706;   /* amber */
  --data-4: #7C3AED;   /* purple */
  --data-5: #DC2626;   /* red */
  --data-6: #64748B;   /* slate */
}
```

## 3. Semantic tokens — Dark (opt-in)

Ativa via `[data-theme="dark"]` na raiz, ou `@media (prefers-color-scheme: dark)` quando o usuário não escolheu.

```css
[data-theme="dark"] {
  --bg-default:        #0B1220;
  --bg-subtle:         #111827;
  --bg-emphasis:       #1A2335;

  --surface-default:   #111827;
  --surface-raised:    #1A2335;
  --surface-selected:  #172554;   /* blue-950-ish */
  --surface-inverse:   #F8FAFC;

  --text-primary:      #F8FAFC;
  --text-secondary:    #CBD5E1;
  --text-muted:        #94A3B8;
  --text-disabled:     #64748B;
  --text-inverse:      #0F172A;
  --text-link:         #7BBAE9;   /* cobalt-300 */
  --text-on-primary:   #0F172A;
  --text-on-accent:    #FFFFFF;

  --border-default:    #334155;
  --border-subtle:     #1E293B;
  --border-strong:     #475569;
  --border-focus:      #7BBAE9;

  --action-primary:            #F8FAFC;
  --action-primary-hover:      #E2E8F0;
  --action-primary-active:     #CBD5E1;
  --action-primary-disabled:   #334155;

  --action-secondary:          #1A2335;
  --action-secondary-hover:    #22304A;
  --action-secondary-border:   #334155;

  --action-accent:             #3B94D9;   /* cobalt-400 */
  --action-accent-hover:       #7BBAE9;
  --action-accent-active:      #BAD8F5;

  --action-destructive:        #EF4444;
  --action-destructive-hover:  #F87171;
  --action-destructive-active: #FCA5A5;

  --status-success:            #22C55E;
  --status-success-bg:         #052E16;
  --status-success-fg:         #86EFAC;
  --status-success-border:     #14532D;

  --status-warning:            #F59E0B;
  --status-warning-bg:         #451A03;
  --status-warning-fg:         #FDE68A;
  --status-warning-border:     #78350F;

  --status-error:              #EF4444;
  --status-error-bg:           #450A0A;
  --status-error-fg:           #FECACA;
  --status-error-border:       #7F1D1D;

  --status-info:               #3B82F6;
  --status-info-bg:            #172554;
  --status-info-fg:            #BFDBFE;
  --status-info-border:        #1E40AF;

  --status-processing:         #A78BFA;
  --status-processing-bg:      #2E1065;
  --status-processing-fg:      #DDD6FE;
  --status-processing-border:  #5B21B6;

  --status-neutral:            #94A3B8;
  --status-neutral-bg:         #1E293B;
  --status-neutral-fg:         #CBD5E1;
  --status-neutral-border:     #334155;

  --priority-critical:  #EF4444;
  --priority-high:      #F59E0B;
  --priority-medium:    #3B82F6;
  --priority-low:       #64748B;

  --data-1: #3B94D9;
  --data-2: #22C55E;
  --data-3: #F59E0B;
  --data-4: #A78BFA;
  --data-5: #EF4444;
  --data-6: #94A3B8;
}
```

## 4. Typography

```css
:root {
  --font-sans: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  --font-mono: 'IBM Plex Mono', 'SF Mono', Menlo, Consolas, monospace;

  /* Size scale (rem base 16px) */
  --font-size-display:   2.25rem;   /* 36px */
  --font-size-h1:        1.5rem;    /* 24px */
  --font-size-h2:        1.25rem;   /* 20px */
  --font-size-h3:        1.125rem;  /* 18px */
  --font-size-h4:        1rem;      /* 16px */
  --font-size-body-lg:   1rem;      /* 16px */
  --font-size-body:      0.875rem;  /* 14px */
  --font-size-body-sm:   0.8125rem; /* 13px */
  --font-size-label:     0.75rem;   /* 12px */
  --font-size-caption:   0.6875rem; /* 11px */
  --font-size-kpi:       1.75rem;   /* 28px */

  /* Weight */
  --font-weight-regular: 400;
  --font-weight-medium:  500;
  --font-weight-semibold: 600;
  --font-weight-bold:    700;

  /* Line-height */
  --lh-tight:  1.2;
  --lh-snug:   1.35;
  --lh-normal: 1.5;
  --lh-relaxed: 1.65;

  /* Tracking */
  --tracking-tight:  -0.01em;
  --tracking-normal:  0;
  --tracking-wide:    0.02em;

  /* Numeric variant for KPIs, tables, prices */
  --numeric-tabular: tabular-nums lining-nums;
}
```

Rôles tipográficos:

| Role | Family | Size | Weight | Line-height | Tracking | Numeric |
|---|---|---|---|---|---|---|
| Display | sans | 36px | 700 | 1.2 | -0.01em | — |
| H1 (page title) | sans | 24px | 600 | 1.3 | -0.005em | — |
| H2 (section) | sans | 20px | 600 | 1.35 | 0 | — |
| H3 | sans | 18px | 600 | 1.4 | 0 | — |
| H4 | sans | 16px | 600 | 1.4 | 0 | — |
| Body Large | sans | 16px | 400 | 1.5 | 0 | — |
| Body | sans | 14px | 400 | 1.5 | 0 | — |
| Body Small | sans | 13px | 400 | 1.5 | 0 | — |
| Label (form/status) | sans | 12px | 500 | 1.35 | 0.01em | — |
| Caption | sans | 11px | 400 | 1.35 | 0.01em | — |
| Button | sans | 14px | 500 | 1 | 0 | — |
| Table Header | sans | 12px | 600 | 1.35 | 0.02em uppercase | — |
| Table Cell | sans | 13px | 400 | 1.35 | 0 | tabular quando numérico |
| KPI Value | sans | 28px | 600 | 1.15 | -0.01em | tabular |
| Monetary | sans | inherit | 500 | inherit | 0 | tabular |
| ID Técnico | mono | 12–13px | 400 | 1.35 | 0 | — |

## 5. Spacing

Base 4px.

```css
:root {
  --space-0:  0;
  --space-1:  0.25rem;  /* 4  */
  --space-2:  0.5rem;   /* 8  */
  --space-3:  0.75rem;  /* 12 */
  --space-4:  1rem;     /* 16 */
  --space-5:  1.25rem;  /* 20 */
  --space-6:  1.5rem;   /* 24 */
  --space-8:  2rem;     /* 32 */
  --space-10: 2.5rem;   /* 40 */
  --space-12: 3rem;     /* 48 */
  --space-16: 4rem;     /* 64 */
  --space-20: 5rem;     /* 80 */
  --space-24: 6rem;     /* 96 */
}
```

Uso por contexto:

- Dense (dashboards `/ops`, `/admin`): gap 8, card padding 12–16, section gap 24.
- Confortável (proprietário `/app`): gap 16, card padding 20–24, section gap 32.

## 6. Radius

```css
:root {
  --radius-none: 0;
  --radius-xs:   4px;   /* checkbox */
  --radius-sm:   6px;   /* input, button, tooltip */
  --radius-md:   8px;   /* select, popover */
  --radius-lg:   10px;  /* card, KPI */
  --radius-xl:   12px;  /* modal, drawer */
  --radius-full: 9999px; /* badge, avatar */
}
```

## 7. Elevation

```css
:root {
  --elev-0: none;
  --elev-1: 0 1px 2px rgba(15, 23, 42, 0.06),
            0 1px 3px rgba(15, 23, 42, 0.04);
  --elev-2: 0 4px 12px rgba(15, 23, 42, 0.08),
            0 2px 4px rgba(15, 23, 42, 0.04);
  --elev-3: 0 12px 32px rgba(15, 23, 42, 0.12),
            0 4px 8px rgba(15, 23, 42, 0.06);
}

[data-theme="dark"] {
  --elev-1: 0 1px 2px rgba(0, 0, 0, 0.4);
  --elev-2: 0 4px 12px rgba(0, 0, 0, 0.5);
  --elev-3: 0 12px 32px rgba(0, 0, 0, 0.6);
}
```

## 8. Motion

```css
:root {
  --motion-fast:   120ms;
  --motion-normal: 200ms;
  --motion-slow:   320ms;

  --ease-standard: cubic-bezier(0.2, 0, 0, 1);
  --ease-decel:    cubic-bezier(0, 0, 0, 1);
  --ease-accel:    cubic-bezier(0.4, 0, 1, 1);
}

@media (prefers-reduced-motion: reduce) {
  :root {
    --motion-fast: 0ms;
    --motion-normal: 0ms;
    --motion-slow: 0ms;
  }
  * { animation-duration: 0.001ms !important; transition-duration: 0.001ms !important; }
}
```

## 9. Breakpoints

```css
:root {
  --bp-sm:  375px;   /* mobile floor */
  --bp-md:  640px;   /* larger phone */
  --bp-lg:  768px;   /* tablet */
  --bp-xl:  1024px;  /* laptop / desktop entry */
  --bp-2xl: 1280px;
  --bp-3xl: 1440px;
}
```

Regras:

- Sidebar visível `>=1024px`; drawer em telas menores.
- Content max-width interno `1440px`; app do proprietário `1024px`.

## 10. Z-index

```css
:root {
  --z-base:      0;
  --z-sticky:    100;   /* sticky headers */
  --z-header:    200;
  --z-dropdown:  300;
  --z-drawer:    400;
  --z-modal:     500;
  --z-toast:     600;
  --z-tooltip:   700;
}
```

## 11. Tailwind mapping (referência)

Se a stack usar Tailwind, mapear em `tailwind.config.ts`:

```ts
export default {
  theme: {
    extend: {
      colors: {
        // semantic
        bg:      { DEFAULT: 'var(--bg-default)', subtle: 'var(--bg-subtle)', emphasis: 'var(--bg-emphasis)' },
        surface: { DEFAULT: 'var(--surface-default)', raised: 'var(--surface-raised)', selected: 'var(--surface-selected)' },
        text:    { DEFAULT: 'var(--text-primary)', secondary: 'var(--text-secondary)', muted: 'var(--text-muted)', disabled: 'var(--text-disabled)', inverse: 'var(--text-inverse)', link: 'var(--text-link)' },
        border:  { DEFAULT: 'var(--border-default)', subtle: 'var(--border-subtle)', strong: 'var(--border-strong)', focus: 'var(--border-focus)' },
        action: {
          primary:   { DEFAULT: 'var(--action-primary)', hover: 'var(--action-primary-hover)' },
          accent:    { DEFAULT: 'var(--action-accent)',  hover: 'var(--action-accent-hover)'  },
          destructive:{ DEFAULT: 'var(--action-destructive)', hover: 'var(--action-destructive-hover)' },
        },
        status: {
          success:    { DEFAULT: 'var(--status-success)',    bg: 'var(--status-success-bg)',    fg: 'var(--status-success-fg)',    border: 'var(--status-success-border)' },
          warning:    { DEFAULT: 'var(--status-warning)',    bg: 'var(--status-warning-bg)',    fg: 'var(--status-warning-fg)',    border: 'var(--status-warning-border)' },
          error:      { DEFAULT: 'var(--status-error)',      bg: 'var(--status-error-bg)',      fg: 'var(--status-error-fg)',      border: 'var(--status-error-border)' },
          info:       { DEFAULT: 'var(--status-info)',       bg: 'var(--status-info-bg)',       fg: 'var(--status-info-fg)',       border: 'var(--status-info-border)' },
          processing: { DEFAULT: 'var(--status-processing)', bg: 'var(--status-processing-bg)', fg: 'var(--status-processing-fg)', border: 'var(--status-processing-border)' },
          neutral:    { DEFAULT: 'var(--status-neutral)',    bg: 'var(--status-neutral-bg)',    fg: 'var(--status-neutral-fg)',    border: 'var(--status-neutral-border)' },
        },
        priority: {
          critical: 'var(--priority-critical)',
          high:     'var(--priority-high)',
          medium:   'var(--priority-medium)',
          low:      'var(--priority-low)',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['IBM Plex Mono', 'ui-monospace', 'monospace'],
      },
      fontSize: {
        display: ['2.25rem', { lineHeight: '1.2',  letterSpacing: '-0.01em', fontWeight: 700 }],
        h1:      ['1.5rem',  { lineHeight: '1.3',  letterSpacing: '-0.005em', fontWeight: 600 }],
        h2:      ['1.25rem', { lineHeight: '1.35', fontWeight: 600 }],
        h3:      ['1.125rem',{ lineHeight: '1.4',  fontWeight: 600 }],
        h4:      ['1rem',    { lineHeight: '1.4',  fontWeight: 600 }],
        body:    ['0.875rem',{ lineHeight: '1.5' }],
        'body-sm':['0.8125rem',{ lineHeight: '1.5' }],
        label:   ['0.75rem', { lineHeight: '1.35', letterSpacing: '0.01em', fontWeight: 500 }],
        caption: ['0.6875rem',{ lineHeight: '1.35', letterSpacing: '0.01em' }],
        kpi:     ['1.75rem', { lineHeight: '1.15', letterSpacing: '-0.01em', fontWeight: 600 }],
      },
      spacing: {
        // já mapeado via --space-N via Tailwind arbitrary values ou plugin
      },
      borderRadius: {
        xs: '4px', sm: '6px', md: '8px', lg: '10px', xl: '12px', full: '9999px',
      },
      boxShadow: {
        elev1: 'var(--elev-1)',
        elev2: 'var(--elev-2)',
        elev3: 'var(--elev-3)',
      },
      screens: {
        sm: '375px', md: '640px', lg: '768px', xl: '1024px', '2xl': '1280px', '3xl': '1440px',
      },
      transitionDuration: {
        fast: '120ms', normal: '200ms', slow: '320ms',
      },
    },
  },
} satisfies Config;
```

## 12. Font loading

Next.js `app/layout.tsx`:

```ts
import { Inter, IBM_Plex_Mono } from 'next/font/google';

const inter = Inter({
  subsets: ['latin', 'latin-ext'],
  variable: '--font-sans',
  display: 'swap',
});

const plexMono = IBM_Plex_Mono({
  weight: ['400', '500'],
  subsets: ['latin'],
  variable: '--font-mono',
  display: 'swap',
});
```
