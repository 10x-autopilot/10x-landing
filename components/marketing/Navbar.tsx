"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Menu, X } from "lucide-react";
import { navLinks, salesMailto, sectionIds, siteConfig } from "@/lib/site-config";
import { useActiveChapter } from "@/lib/hooks/useActiveChapter";
import { useFocusTrap } from "@/lib/hooks/useFocusTrap";
import { scrollToId } from "@/lib/scroll";
import { cn } from "@/lib/utils";
import { CtaLink } from "@/components/ui/CtaLink";
import { Logo } from "@/components/ui/Logo";

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);
  const close = useCallback(() => setOpen(false), []);
  const activeChapter = useActiveChapter();
  useFocusTrap(panelRef, open, close);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    panelRef.current?.querySelector<HTMLElement>("a")?.focus();
    const onResize = () => window.innerWidth >= 1024 && setOpen(false);
    window.addEventListener("resize", onResize);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("resize", onResize);
    };
  }, [open]);

  const onNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    setOpen(false);
    if (e.metaKey || e.ctrlKey) return;
    e.preventDefault();
    // Let the menu close before scrolling so focus lands on the section.
    requestAnimationFrame(() => {
      if (!scrollToId(href.slice(1))) window.location.hash = href;
    });
  };

  // Security lives inside the pricing chapter, so it shares that chapter's highlight.
  const isActive = (href: string) => {
    const id = href.slice(1);
    return id === activeChapter && id !== sectionIds.security;
  };

  const solid = scrolled || open;

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 border-b transition-[background-color,border-color] duration-300",
        solid ? "border-border bg-bg/85 backdrop-blur-md" : "border-transparent bg-transparent",
      )}
    >
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-3 focus:z-10 focus:rounded-md focus:bg-elevated focus:px-3 focus:py-2 focus:text-sm"
      >
        Skip to content
      </a>
      <nav aria-label="Primary" className="container-x flex h-16 items-center gap-8">
        <a href="#top" aria-label="10X home" className="-ml-1 rounded-md px-1 text-[20px]">
          <Logo />
        </a>

        <ul className="hidden items-center gap-1 lg:flex">
          {navLinks.map((l) => {
            const active = isActive(l.href);
            return (
              <li key={l.href}>
                <a
                  href={l.href}
                  onClick={(e) => onNavClick(e, l.href)}
                  aria-current={active ? "location" : undefined}
                  className={cn(
                    "relative rounded-full px-3 py-2 text-[14px] transition-colors duration-300",
                    active ? "text-fg" : "text-secondary hover:text-fg",
                  )}
                >
                  {l.label}
                  <span
                    aria-hidden
                    className={cn(
                      "absolute inset-x-3 -bottom-px h-px rounded-full bg-accent transition-opacity duration-300",
                      active ? "opacity-100 shadow-[0_0_10px_rgb(37_99_235/0.9)]" : "opacity-0",
                    )}
                  />
                </a>
              </li>
            );
          })}
        </ul>

        <div className="ml-auto flex items-center gap-2">
          <a
            href={siteConfig.appUrl}
            className="hidden px-2 py-2 text-[14px] text-secondary transition-colors hover:text-fg lg:inline-block"
          >
            {siteConfig.cta.app}
          </a>
          <a
            href={siteConfig.signInUrl}
            className="inline-flex h-9 items-center rounded-full border border-white/25 px-4 text-[14px] font-medium text-fg transition-colors hover:border-white/50 hover:bg-white/[0.06]"
          >
            {siteConfig.cta.signIn}
          </a>
          <CtaLink
            href={siteConfig.signupUrl}
            event="nav_cta_clicked"
            eventProps={{ location: "nav" }}
            variant="primary"
            size="sm"
            className="max-sm:hidden"
          >
            {siteConfig.cta.primary}
          </CtaLink>
          <button
            type="button"
            className="-mr-2 inline-flex size-10 items-center justify-center rounded-full text-fg lg:hidden"
            aria-expanded={open}
            aria-controls="mobile-menu"
            aria-label={open ? "Close menu" : "Open menu"}
            onClick={() => setOpen((o) => !o)}
          >
            {open ? <X className="size-5" aria-hidden /> : <Menu className="size-5" aria-hidden />}
          </button>
        </div>
      </nav>

      {open ? (
        <div
          ref={panelRef}
          id="mobile-menu"
          role="dialog"
          aria-modal="true"
          aria-label="Menu"
          className="h-[calc(100dvh-64px)] overflow-y-auto border-t border-border bg-bg lg:hidden"
        >
          <ul className="container-x flex flex-col py-4">
            {navLinks.map((l) => (
              <li key={l.href}>
                <a
                  href={l.href}
                  onClick={(e) => onNavClick(e, l.href)}
                  className="flex items-center justify-between border-b border-border py-4 text-[20px] font-medium tracking-[-0.02em]"
                >
                  {l.label}
                  <span aria-hidden className="text-subtle">
                    →
                  </span>
                </a>
              </li>
            ))}
          </ul>
          <div className="container-x space-y-3 pb-10 pt-2">
            <a
              href={siteConfig.signInUrl}
              onClick={close}
              className="flex h-12 items-center justify-center rounded-full border border-white/25 text-[16px] font-medium text-fg"
            >
              {siteConfig.cta.signIn}
            </a>
            <a href={siteConfig.appUrl} onClick={close} className="block py-2 text-[18px] text-secondary">
              {siteConfig.cta.app}
            </a>
            <CtaLink
              href={siteConfig.signupUrl}
              event="nav_cta_clicked"
              eventProps={{ location: "mobile_menu" }}
              variant="link"
              size="inline"
              className="py-2 text-[18px]"
              onNavigate={close}
            >
              {siteConfig.cta.primary}
            </CtaLink>
            <p className="pt-2 text-center text-[14px] text-secondary">
              {siteConfig.contact.label} ·{" "}
              <a href={salesMailto} className="text-fg underline decoration-white/30 underline-offset-4">
                {siteConfig.contact.email}
              </a>
            </p>
          </div>
        </div>
      ) : null}
    </header>
  );
}
