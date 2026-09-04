import type { Config } from "tailwindcss";

/**
 * EMR Despachante — Tailwind preset (Design System foundation)
 *
 * Fonte da verdade: docs/design-system/TOKENS.md §11.
 * Mapeia os tokens semânticos (CSS custom properties definidas em
 * ./src/styles/tokens.css) para o Tailwind theme. Nenhum hex é declarado
 * aqui — apenas var(--...) — conforme AGENTS.md §14.1.
 *
 * Consumido por apps/web/tailwind.config.ts via `presets: [uiPreset]`.
 */
const uiPreset = {
  theme: {
    extend: {
      colors: {
        bg: {
          DEFAULT: "var(--bg-default)",
          subtle: "var(--bg-subtle)",
          emphasis: "var(--bg-emphasis)",
        },
        surface: {
          DEFAULT: "var(--surface-default)",
          raised: "var(--surface-raised)",
          selected: "var(--surface-selected)",
          inverse: "var(--surface-inverse)",
        },
        text: {
          DEFAULT: "var(--text-primary)",
          secondary: "var(--text-secondary)",
          muted: "var(--text-muted)",
          disabled: "var(--text-disabled)",
          inverse: "var(--text-inverse)",
          link: "var(--text-link)",
          "on-primary": "var(--text-on-primary)",
          "on-accent": "var(--text-on-accent)",
        },
        border: {
          DEFAULT: "var(--border-default)",
          subtle: "var(--border-subtle)",
          strong: "var(--border-strong)",
          focus: "var(--border-focus)",
        },
        action: {
          primary: {
            DEFAULT: "var(--action-primary)",
            hover: "var(--action-primary-hover)",
            active: "var(--action-primary-active)",
            disabled: "var(--action-primary-disabled)",
          },
          secondary: {
            DEFAULT: "var(--action-secondary)",
            hover: "var(--action-secondary-hover)",
            border: "var(--action-secondary-border)",
          },
          accent: {
            DEFAULT: "var(--action-accent)",
            hover: "var(--action-accent-hover)",
            active: "var(--action-accent-active)",
          },
          destructive: {
            DEFAULT: "var(--action-destructive)",
            hover: "var(--action-destructive-hover)",
            active: "var(--action-destructive-active)",
          },
        },
        status: {
          success: {
            DEFAULT: "var(--status-success)",
            bg: "var(--status-success-bg)",
            fg: "var(--status-success-fg)",
            border: "var(--status-success-border)",
          },
          warning: {
            DEFAULT: "var(--status-warning)",
            bg: "var(--status-warning-bg)",
            fg: "var(--status-warning-fg)",
            border: "var(--status-warning-border)",
          },
          error: {
            DEFAULT: "var(--status-error)",
            bg: "var(--status-error-bg)",
            fg: "var(--status-error-fg)",
            border: "var(--status-error-border)",
          },
          info: {
            DEFAULT: "var(--status-info)",
            bg: "var(--status-info-bg)",
            fg: "var(--status-info-fg)",
            border: "var(--status-info-border)",
          },
          processing: {
            DEFAULT: "var(--status-processing)",
            bg: "var(--status-processing-bg)",
            fg: "var(--status-processing-fg)",
            border: "var(--status-processing-border)",
          },
          neutral: {
            DEFAULT: "var(--status-neutral)",
            bg: "var(--status-neutral-bg)",
            fg: "var(--status-neutral-fg)",
            border: "var(--status-neutral-border)",
          },
        },
        priority: {
          critical: "var(--priority-critical)",
          high: "var(--priority-high)",
          medium: "var(--priority-medium)",
          low: "var(--priority-low)",
        },
        data: {
          1: "var(--data-1)",
          2: "var(--data-2)",
          3: "var(--data-3)",
          4: "var(--data-4)",
          5: "var(--data-5)",
          6: "var(--data-6)",
        },
      },
      fontFamily: {
        sans: ["var(--font-sans)"],
        mono: ["var(--font-mono)"],
      },
      fontSize: {
        display: ["2.25rem", { lineHeight: "1.2", letterSpacing: "-0.01em", fontWeight: "700" }],
        h1: ["1.5rem", { lineHeight: "1.3", letterSpacing: "-0.005em", fontWeight: "600" }],
        h2: ["1.25rem", { lineHeight: "1.35", fontWeight: "600" }],
        h3: ["1.125rem", { lineHeight: "1.4", fontWeight: "600" }],
        h4: ["1rem", { lineHeight: "1.4", fontWeight: "600" }],
        body: ["0.875rem", { lineHeight: "1.5" }],
        "body-lg": ["1rem", { lineHeight: "1.5" }],
        "body-sm": ["0.8125rem", { lineHeight: "1.5" }],
        label: ["0.75rem", { lineHeight: "1.35", letterSpacing: "0.01em", fontWeight: "500" }],
        caption: ["0.6875rem", { lineHeight: "1.35", letterSpacing: "0.01em" }],
        kpi: ["1.75rem", { lineHeight: "1.15", letterSpacing: "-0.01em", fontWeight: "600" }],
      },
      spacing: {
        0: "var(--space-0)",
        1: "var(--space-1)",
        2: "var(--space-2)",
        3: "var(--space-3)",
        4: "var(--space-4)",
        5: "var(--space-5)",
        6: "var(--space-6)",
        8: "var(--space-8)",
        10: "var(--space-10)",
        12: "var(--space-12)",
        16: "var(--space-16)",
        20: "var(--space-20)",
        24: "var(--space-24)",
      },
      borderRadius: {
        none: "var(--radius-none)",
        xs: "var(--radius-xs)",
        sm: "var(--radius-sm)",
        md: "var(--radius-md)",
        lg: "var(--radius-lg)",
        xl: "var(--radius-xl)",
        full: "var(--radius-full)",
      },
      boxShadow: {
        elev0: "var(--elev-0)",
        elev1: "var(--elev-1)",
        elev2: "var(--elev-2)",
        elev3: "var(--elev-3)",
      },
      screens: {
        sm: "375px",
        md: "640px",
        lg: "768px",
        xl: "1024px",
        "2xl": "1280px",
        "3xl": "1440px",
      },
      transitionDuration: {
        fast: "120ms",
        normal: "200ms",
        slow: "320ms",
      },
      transitionTimingFunction: {
        standard: "var(--ease-standard)",
        decel: "var(--ease-decel)",
        accel: "var(--ease-accel)",
      },
      zIndex: {
        base: "var(--z-base)",
        sticky: "var(--z-sticky)",
        header: "var(--z-header)",
        dropdown: "var(--z-dropdown)",
        drawer: "var(--z-drawer)",
        modal: "var(--z-modal)",
        toast: "var(--z-toast)",
        tooltip: "var(--z-tooltip)",
      },
    },
  },
} satisfies Partial<Config>;

export default uiPreset;
