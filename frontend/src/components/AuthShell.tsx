// Shared authentication page shell.
import { ReactNode, useEffect, useState } from "react";
import { Link } from "react-router-dom";

interface AuthShellProps {
  title: string;
  subtitle: string;
  mode: "login" | "register";
  children: ReactNode;
}

const slides = [
  {
    title: "Pipeline clarity, minus the clutter",
    body: "Track new opportunities, qualify intent, and keep sales follow-up moving from one tidy workspace.",
    primary: "New lead captured",
    secondary: "Source tagged",
    tertiary: "Follow-up queued",
    accent: "bg-emerald-300",
  },
  {
    title: "Follow up before warm leads cool down",
    body: "See the next action clearly, assign ownership, and keep every promising conversation on schedule.",
    primary: "Reminder ready",
    secondary: "Owner assigned",
    tertiary: "Demo scheduled",
    accent: "bg-cyan-300",
  },
  {
    title: "Know where every opportunity came from",
    body: "Filter by channel, compare lead sources, and understand which campaigns are creating real pipeline.",
    primary: "Website source",
    secondary: "Referral noted",
    tertiary: "Instagram lead",
    accent: "bg-amber-200",
  },
  {
    title: "Give recruiters something polished to notice",
    body: "A clean, animated dashboard experience that shows product thinking, not just CRUD screens.",
    primary: "Clean UI",
    secondary: "Typed API",
    tertiary: "Role access",
    accent: "bg-rose-300",
  },
];

export const AuthShell = ({ title, subtitle, mode, children }: AuthShellProps) => {
  const [activeSlide, setActiveSlide] = useState(0);
  const slide = slides[activeSlide];

  useEffect(() => {
    const intervalId = window.setInterval(() => {
      setActiveSlide((currentSlide) => (currentSlide + 1) % slides.length);
    }, 4200);

    return () => window.clearInterval(intervalId);
  }, []);

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#737b75] px-4 py-8 text-slate-950">
      <div className="grid w-full max-w-5xl overflow-hidden rounded-sm bg-white shadow-[0_32px_90px_rgba(15,23,42,0.28)] lg:min-h-[640px] lg:grid-cols-2">
        <section className="relative hidden overflow-hidden bg-[#acd0c0] px-12 py-12 text-white lg:flex lg:flex-col lg:items-center lg:justify-between">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_24%_18%,rgba(255,255,255,0.32),transparent_18%),radial-gradient(circle_at_78%_82%,rgba(20,83,45,0.12),transparent_26%)]" />

          <div className="relative flex items-center gap-3 self-start">
            <div className="grid h-12 w-12 place-items-center rounded-lg bg-white/22 shadow-sm ring-1 ring-white/30">
              <span className="h-5 w-5 rounded bg-emerald-300" />
            </div>
            <span className="text-sm font-bold tracking-wide text-white">
              SMART LEADS
            </span>
          </div>

          <div className="relative flex flex-1 items-center justify-center">
            <div key={`visual-${activeSlide}`} className="auth-slide-visual relative h-80 w-80">
              {activeSlide === 0 ? (
                <>
                  <div className="auth-float-slow absolute left-8 top-7 h-64 w-64 rounded-[28px] border border-white/30 bg-white/20 shadow-2xl backdrop-blur" />
                  <div className="auth-float absolute left-12 top-12 h-14 w-48 rounded-xl bg-white shadow-lg">
                    <div className="flex h-full items-center gap-3 px-4">
                      <span className="grid h-8 w-8 place-items-center rounded-full bg-emerald-100">
                        <span className={`h-3 w-3 rounded-full ${slide.accent}`} />
                      </span>
                      <div>
                        <p className="text-xs font-semibold text-slate-700">{slide.primary}</p>
                        <p className="mt-0.5 text-[10px] text-slate-400">Website enquiry</p>
                      </div>
                    </div>
                  </div>
                  <div className="auth-float-delay absolute left-10 top-32 h-14 w-44 rounded-xl bg-white shadow-lg">
                    <div className="flex h-full items-center gap-3 px-4">
                      <span className="grid h-8 w-8 place-items-center rounded-full bg-cyan-100">
                        <span className="h-3 w-3 rounded-full bg-cyan-500" />
                      </span>
                      <div>
                        <p className="text-xs font-semibold text-slate-700">{slide.secondary}</p>
                        <p className="mt-0.5 text-[10px] text-slate-400">Instagram campaign</p>
                      </div>
                    </div>
                  </div>
                  <div className="auth-card-lift absolute right-3 top-20 h-44 w-36 rounded-2xl bg-slate-950 p-4 shadow-2xl">
                    <div className="mb-4 flex items-center gap-2">
                      <span className="h-8 w-8 rounded-full bg-emerald-300" />
                      <div>
                        <p className="text-[10px] font-semibold text-white">Lead profile</p>
                        <p className="text-[9px] text-white/45">Qualified</p>
                      </div>
                    </div>
                    <div className="space-y-2 text-[10px]">
                      <div className="flex justify-between rounded-lg bg-white/10 px-2 py-1.5">
                        <span className="text-white/50">Status</span>
                        <span className="font-medium text-emerald-200">Qualified</span>
                      </div>
                      <div className="flex justify-between rounded-lg bg-white/10 px-2 py-1.5">
                        <span className="text-white/50">Source</span>
                        <span className="font-medium text-cyan-200">Referral</span>
                      </div>
                    </div>
                  </div>
                  <div className="auth-slide-up absolute bottom-9 left-24 flex h-16 w-44 items-center gap-3 rounded-2xl bg-white px-4 shadow-xl">
                    <span className="grid h-9 w-9 place-items-center rounded-full bg-[#e9f7ef]">
                      <span className="h-4 w-4 rounded-full bg-emerald-400" />
                    </span>
                    <div className="flex-1">
                      <p className="text-xs font-semibold text-slate-700">Next action</p>
                      <p className="mt-0.5 text-[10px] text-slate-400">Book discovery call</p>
                    </div>
                  </div>
                </>
              ) : null}

              {activeSlide === 1 ? (
                <>
                  <div className="auth-float-slow absolute left-10 top-8 h-64 w-64 rounded-[32px] bg-white/22 shadow-2xl ring-1 ring-white/30" />
                  <div className="auth-card-lift absolute left-16 top-14 h-56 w-48 rounded-3xl bg-white p-5 shadow-2xl">
                    <div className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-cyan-100">
                      <span className="h-8 w-8 rounded-full bg-cyan-400" />
                    </div>
                    <p className="mt-5 text-center text-sm font-semibold text-slate-700">Reminder ready</p>
                    <p className="mt-1 text-center text-xs text-slate-400">Website enquiry</p>
                    <div className="mt-6 space-y-2">
                      <span className="block h-2 rounded-full bg-cyan-100" />
                      <span className="block h-2 w-9/12 rounded-full bg-slate-100" />
                    </div>
                  </div>
                  <div className="auth-slide-up absolute bottom-14 right-8 h-24 w-40 rounded-2xl bg-slate-950 p-4 shadow-xl">
                    <p className="text-xs font-semibold text-white">Today</p>
                    <div className="mt-3 flex items-end gap-2">
                      <span className="auth-pulse h-8 w-7 rounded bg-cyan-300" />
                      <span className="auth-pulse-delay h-12 w-7 rounded bg-emerald-300" />
                      <span className="auth-pulse-slow h-16 w-7 rounded bg-amber-200" />
                    </div>
                  </div>
                  <div className="absolute right-20 top-8 h-4 w-4 rounded-full bg-[#ffe39d]" />
                </>
              ) : null}

              {activeSlide === 2 ? (
                <>
                  <div className="auth-float-slow absolute left-7 top-8 h-64 w-64 rounded-[28px] bg-white/18 shadow-2xl ring-1 ring-white/30" />
                  <div className="auth-card-lift absolute left-14 top-16 h-52 w-56 rounded-3xl bg-white p-5 shadow-2xl">
                    <p className="text-xs font-semibold uppercase tracking-widest text-slate-400">Lead sources</p>
                    <div className="mt-6 flex items-end gap-4">
                      <span className="auth-pulse h-28 w-10 rounded-t-2xl bg-emerald-300" />
                      <span className="auth-pulse-delay h-20 w-10 rounded-t-2xl bg-cyan-300" />
                      <span className="auth-pulse-slow h-14 w-10 rounded-t-2xl bg-amber-200" />
                    </div>
                    <div className="mt-4 grid grid-cols-3 gap-2 text-center text-[9px] font-medium text-slate-400">
                      <span>Web</span>
                      <span>Insta</span>
                      <span>Refer</span>
                    </div>
                  </div>
                  <div className="auth-float absolute bottom-14 right-8 rounded-2xl bg-slate-950 px-5 py-4 shadow-xl">
                    <p className="text-xs font-semibold text-white">Filtered view</p>
                    <p className="mt-1 text-[10px] text-cyan-200">source = Website</p>
                  </div>
                  <div className="absolute left-20 top-5 h-4 w-4 rounded-full bg-white" />
                </>
              ) : null}

              {activeSlide === 3 ? (
                <>
                  <div className="auth-float-slow absolute left-8 top-8 h-64 w-64 rounded-[30px] bg-white/18 shadow-2xl ring-1 ring-white/30" />
                  <div className="auth-card-lift absolute left-16 top-14 h-52 w-52 rounded-3xl bg-slate-950 p-5 shadow-2xl">
                    <div className="flex items-center justify-between">
                      <p className="text-xs font-semibold text-white">Access control</p>
                      <span className="rounded-full bg-emerald-300/20 px-2 py-1 text-[9px] font-semibold text-emerald-100">JWT</span>
                    </div>
                    <div className="mt-6 space-y-3">
                      {["Admin", "Sales", "Export CSV"].map((label, index) => (
                        <div key={label} className="flex items-center justify-between rounded-xl bg-white/10 px-3 py-2">
                          <span className="text-xs text-white/70">{label}</span>
                          <span className={["h-2 w-8 rounded-full", index === 1 ? "bg-cyan-300" : "bg-emerald-300"].join(" ")} />
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="auth-slide-up absolute bottom-12 right-7 h-24 w-40 rounded-2xl bg-white p-4 shadow-xl">
                    <p className="text-xs font-semibold text-slate-700">Recruiter-ready</p>
                    <p className="mt-1 text-[10px] text-slate-400">Typed, polished, responsive</p>
                    <span className="mt-4 block h-2 w-24 rounded-full bg-rose-300" />
                  </div>
                  <div className="absolute right-16 top-10 h-4 w-4 rounded-full bg-rose-300" />
                </>
              ) : null}

              <div className="absolute left-28 top-4 h-4 w-4 rounded-full bg-[#ffe39d]" />
              <div className="absolute right-20 top-12 h-3 w-3 rounded-full bg-white" />
              <div className="absolute bottom-20 right-6 h-4 w-4 rounded-full bg-[#f3a36f]" />
            </div>
          </div>

          <div className="relative text-center">
            <div key={`copy-${activeSlide}`} className="auth-slide-copy min-h-[86px]">
              <h1 className="text-xl font-semibold text-white">{slide.title}</h1>
              <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-white/85">
                {slide.body}
              </p>
            </div>
            <div className="mt-7 flex justify-center gap-2">
              {slides.map((item, index) => (
                <button
                  key={item.title}
                  type="button"
                  aria-label={`Show slide ${index + 1}`}
                  onClick={() => setActiveSlide(index)}
                  className={[
                    "h-2 rounded-full transition-all duration-500",
                    activeSlide === index
                      ? "auth-slide-dot-active w-8 bg-white"
                      : "w-2 bg-white/45 hover:bg-white/70",
                  ].join(" ")}
                />
              ))}
            </div>
          </div>
        </section>

        <section className="flex min-h-[640px] items-center justify-center bg-white px-7 py-10 sm:px-12">
          <div className="w-full max-w-sm">
            <div className="mb-12 text-center">
              <div className="mx-auto mb-7 flex items-center justify-center gap-3 lg:hidden">
                <div className="grid h-11 w-11 place-items-center rounded-lg bg-[#acd0c0]">
                  <span className="h-5 w-5 rounded bg-emerald-400" />
                </div>
                <span className="text-sm font-bold tracking-wide text-slate-700">
                  SMART LEADS
                </span>
              </div>
              <p className="font-serif text-3xl italic text-slate-700">Smart Leads</p>
              <div className="relative mx-auto mt-8 grid h-12 w-64 grid-cols-2 rounded-full bg-slate-100 p-1">
                <span
                  className={[
                    "auth-toggle-pill absolute left-1 top-1 h-10 w-[7.5rem] rounded-full bg-[#666666] shadow-sm transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]",
                    mode === "register" ? "translate-x-[7.5rem]" : "translate-x-0",
                  ].join(" ")}
                />
                <Link
                  to="/login"
                  className={[
                    "relative z-10 grid place-items-center rounded-full text-sm font-semibold transition-colors duration-300",
                    mode === "login" ? "text-white" : "text-slate-500 hover:text-slate-800",
                  ].join(" ")}
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className={[
                    "relative z-10 grid place-items-center rounded-full text-sm font-semibold transition-colors duration-300",
                    mode === "register" ? "text-white" : "text-slate-500 hover:text-slate-800",
                  ].join(" ")}
                >
                  Signup
                </Link>
              </div>
              <div key={mode} className="auth-copy-enter">
                <h2 className="mt-12 text-xl font-medium text-slate-700">{title}</h2>
                <p className="mx-auto mt-3 max-w-xs text-sm leading-6 text-slate-500">
                  {subtitle}
                </p>
              </div>
            </div>
            <div
              key={`${mode}-form`}
              className="auth-form-enter flex h-[280px] items-start"
            >
              {children}
            </div>
          </div>
        </section>
      </div>
    </main>
  );
};
