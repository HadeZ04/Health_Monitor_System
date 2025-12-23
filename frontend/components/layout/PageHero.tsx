import { type ReactNode } from "react";
import { cn } from "@/lib/utils";

const accentStyles = {
  cyan: "from-slate-950 via-cyan-950/30 to-slate-900",
  purple: "from-slate-950 via-purple-950/40 to-slate-900",
  emerald: "from-slate-950 via-emerald-950/30 to-slate-900",
  amber: "from-slate-950 via-amber-900/25 to-slate-900",
  pink: "from-slate-950 via-pink-900/30 to-slate-900",
  blue: "from-slate-950 via-blue-950/30 to-slate-900"
} as const;

export interface HeroStat {
  label: string;
  value: string;
  helper?: string;
  trend?: string;
  icon?: string;
}

interface PageHeroProps {
  eyebrow?: string;
  title: string;
  description: string;
  icon?: string;
  badges?: string[];
  stats?: HeroStat[];
  actions?: ReactNode;
  accent?: keyof typeof accentStyles;
}

export function PageHero({
  eyebrow,
  title,
  description,
  icon,
  badges,
  stats,
  actions,
  accent = "cyan"
}: PageHeroProps) {
  return (
    <section
      className={cn(
        "relative overflow-hidden rounded-[32px] border border-white/10 bg-gradient-to-r p-8 text-white shadow-[0_35px_120px_rgba(2,6,23,0.65)]",
        accentStyles[accent]
      )}
    >
      <div className="absolute inset-0 grid-pattern opacity-20" />
      <div className="absolute inset-y-0 right-0 w-1/2 holographic opacity-30 blur-3xl" />
      <div className="hero-orbit opacity-30" />
      <div className="absolute -bottom-10 -left-10 h-40 w-40 rounded-full bg-emerald-400/20 blur-3xl" />
      <div className="absolute -top-10 right-0 h-56 w-56 rounded-full bg-cyan-400/20 blur-3xl" />

      <div className="relative flex flex-col gap-8 lg:flex-row lg:items-start lg:justify-between">
        <div className="space-y-5 max-w-3xl">
          {eyebrow && <p className="neon-pill text-[0.65rem] tracking-[0.35em]">{eyebrow}</p>}
          <div className="flex flex-col gap-3">
            <div className="flex flex-wrap items-center gap-3">
              {icon && (
                <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/10 text-3xl shadow-inner">
                  {icon}
                </span>
              )}
              <h1 className="text-3xl font-bold leading-tight tracking-tight sm:text-4xl lg:text-5xl">{title}</h1>
            </div>
            <p className="text-base text-slate-200 lg:text-lg">{description}</p>
          </div>
          {badges && badges.length > 0 && (
            <div className="flex flex-wrap gap-2 text-xs">
              {badges.map((badge) => (
                <span
                  key={badge}
                  className="rounded-full border border-white/20 bg-white/5 px-3 py-1 text-[0.7rem] uppercase tracking-[0.3em] text-slate-200"
                >
                  {badge}
                </span>
              ))}
            </div>
          )}
          {actions && <div className="flex flex-wrap gap-3">{actions}</div>}
        </div>

        {stats && stats.length > 0 && (
          <div className="grid w-full gap-4 sm:grid-cols-2 lg:w-1/2">
            {stats.map((stat) => (
              <div key={stat.label} className="pulse-border rounded-2xl border border-white/15 bg-white/5 p-4 backdrop-blur">
                <p className="text-xs uppercase tracking-[0.4em] text-slate-300">{stat.label}</p>
                <div className="mt-2 flex items-end gap-2">
                  {stat.icon && <span className="text-xl">{stat.icon}</span>}
                  <p className="text-3xl font-bold text-white">{stat.value}</p>
                </div>
                {(stat.helper || stat.trend) && (
                  <p className="mt-1 text-xs text-slate-300">
                    {stat.helper} {stat.trend && <span className="text-emerald-300">{stat.trend}</span>}
                  </p>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

