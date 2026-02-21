"use client";

import type { CSSProperties, MouseEvent } from "react";
import { useEffect, useRef, useState } from "react";

const menuHighlights = [
  {
    title: "旬の握り",
    desc: "その日最良の鮮魚を、温度と口どけまで計算して供します。",
    image:
      "https://images.unsplash.com/photo-1681310483042-64aa6776f112?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w4NDM0ODN8MHwxfHJhbmRvbXx8fHx8fHx8fDE3NzE2NTQ3NTh8&ixlib=rb-4.1.0&q=80&w=1080",
  },
  {
    title: "炭火焼会席",
    desc: "炭の香りをまとった旬菜と肉を、季節の流れで一皿ずつ。",
    image:
      "https://images.unsplash.com/photo-1580679630809-03fd24148ecf?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w4NDM0ODN8MHwxfHJhbmRvbXx8fHx8fHx8fDE3NzE2NTU3NjR8&ixlib=rb-4.1.0&q=80&w=1080",
  },
  {
    title: "甘味と抹茶",
    desc: "食後に静けさを残す、控えめな甘味と香り高い一服。",
    image:
      "https://images.unsplash.com/photo-1734041291024-15273c5a88fa?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w4NDM0ODN8MHwxfHJhbmRvbXx8fHx8fHx8fDE3NzE2NTU3NjV8&ixlib=rb-4.1.0&q=80&w=1080",
  },
];

const navItems = [
  { id: "story", label: "物語" },
  { id: "menu", label: "献立" },
  { id: "reserve", label: "予約" },
];

const theaterFrames = [
  "https://images.unsplash.com/photo-1676474511128-b2e20f267c28?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w4NDM0ODN8MHwxfHJhbmRvbXx8fHx8fHx8fDE3NzE2NTc5MTF8&ixlib=rb-4.1.0&q=80&w=1080",
  "https://images.unsplash.com/photo-1609558546186-46b663a9aff6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w4NDM0ODN8MHwxfHJhbmRvbXx8fHx8fHx8fDE3NzE2NTc5MTF8&ixlib=rb-4.1.0&q=80&w=1080",
  "https://images.unsplash.com/photo-1771030669954-a02e803c68a7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w4NDM0ODN8MHwxfHJhbmRvbXx8fHx8fHx8fDE3NzE2NTc5MTJ8&ixlib=rb-4.1.0&q=80&w=1080",
];

type KitamuraHomeProps = {
  serifClassName: string;
  sansClassName: string;
};

export function KitamuraHome({ serifClassName, sansClassName }: KitamuraHomeProps) {
  const pageRef = useRef<HTMLDivElement>(null);
  const theaterRef = useRef<HTMLElement>(null);
  const theaterCanvasRef = useRef<HTMLCanvasElement>(null);
  const theaterImagesRef = useRef<HTMLImageElement[]>([]);
  const theaterStepRef = useRef(-1);
  const [activeSection, setActiveSection] = useState("story");

  useEffect(() => {
    const root = pageRef.current;
    if (!root) return;

    let ticking = false;
    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        const heroProgress = Math.min(root.scrollTop / (root.clientHeight * 0.9), 1);
        root.style.setProperty("--hero-progress", heroProgress.toFixed(4));

        const theater = theaterRef.current;
        if (theater) {
          const start = theater.offsetTop - root.clientHeight * 0.12;
          const end = theater.offsetTop + theater.offsetHeight - root.clientHeight;
          const raw = (root.scrollTop - start) / Math.max(end - start, 1);
          const theaterProgress = Math.min(Math.max(raw, 0), 1);
          root.style.setProperty("--theater-progress", theaterProgress.toFixed(4));

          let layer1 = 0;
          let layer2 = 0;
          let layer3 = 0;
          if (theaterProgress <= 0.5) {
            layer1 = 1 - theaterProgress * 2;
            layer2 = theaterProgress * 2;
          } else {
            layer2 = 1 - (theaterProgress - 0.5) * 2;
            layer3 = (theaterProgress - 0.5) * 2;
          }

          root.style.setProperty("--theater-layer-1", layer1.toFixed(4));
          root.style.setProperty("--theater-layer-2", layer2.toFixed(4));
          root.style.setProperty("--theater-layer-3", layer3.toFixed(4));

          const stepProgress = theaterProgress * 3;
          const step = Math.min(2, Math.max(0, Math.floor(stepProgress)));
          const localStepProgress = Math.min(Math.max(stepProgress - step, 0), 1);
          root.style.setProperty("--theater-step-progress", localStepProgress.toFixed(4));
          if (theaterStepRef.current !== step) {
            theaterStepRef.current = step;
            root.dataset.theaterStep = String(step);
          }

          const canvas = theaterCanvasRef.current;
          const images = theaterImagesRef.current;
          if (canvas && images.length > 1) {
            const rect = canvas.getBoundingClientRect();
            const dpr = window.devicePixelRatio || 1;
            const width = Math.max(Math.floor(rect.width * dpr), 1);
            const height = Math.max(Math.floor(rect.height * dpr), 1);
            if (canvas.width !== width || canvas.height !== height) {
              canvas.width = width;
              canvas.height = height;
            }

            const context = canvas.getContext("2d");
            if (context) {
              const segmentCount = images.length - 1;
              const frameProgress = theaterProgress * segmentCount;
              const baseIndex = Math.min(
                Math.max(0, Math.floor(frameProgress)),
                segmentCount - 1,
              );
              const mix = frameProgress - baseIndex;
              const fromImage = images[baseIndex];
              const toImage = images[Math.min(baseIndex + 1, segmentCount)];

              const drawImageCover = (image: HTMLImageElement, alpha: number, zoom: number) => {
                if (!image.complete) return;
                const cw = canvas.width;
                const ch = canvas.height;
                const iw = image.naturalWidth || image.width;
                const ih = image.naturalHeight || image.height;
                if (!iw || !ih) return;

                const scale = Math.max(cw / iw, ch / ih) * zoom;
                const sw = cw / scale;
                const sh = ch / scale;
                const sx = Math.max((iw - sw) * (0.2 + theaterProgress * 0.6), 0);
                const sy = Math.max((ih - sh) * (0.25 + theaterProgress * 0.5), 0);

                context.globalAlpha = alpha;
                context.drawImage(image, sx, sy, sw, sh, 0, 0, cw, ch);
              };

              context.clearRect(0, 0, canvas.width, canvas.height);
              drawImageCover(fromImage, 1, 1.03 + theaterProgress * 0.05);
              drawImageCover(toImage, mix, 1.08 + theaterProgress * 0.04);

              const gradient = context.createLinearGradient(0, 0, 0, canvas.height);
              gradient.addColorStop(0, "rgba(8, 6, 5, 0.15)");
              gradient.addColorStop(0.62, "rgba(8, 6, 5, 0.05)");
              gradient.addColorStop(1, "rgba(8, 6, 5, 0.72)");
              context.globalAlpha = 1;
              context.fillStyle = gradient;
              context.fillRect(0, 0, canvas.width, canvas.height);
            }
          }
        }

        ticking = false;
      });
    };

    const sections = Array.from(
      root.querySelectorAll<HTMLElement>("section[data-section]"),
    );

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

        if (visible?.target instanceof HTMLElement && visible.target.dataset.section) {
          setActiveSection(visible.target.dataset.section);
        }
      },
      {
        root,
        threshold: [0.25, 0.45, 0.65],
      },
    );

    sections.forEach((section) => observer.observe(section));
    root.dataset.theaterStep = "0";
    root.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    onScroll();

    return () => {
      observer.disconnect();
      root.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  useEffect(() => {
    let canceled = false;
    const loadImage = (src: string) =>
      new Promise<HTMLImageElement>((resolve, reject) => {
        const image = new Image();
        image.crossOrigin = "anonymous";
        image.onload = () => resolve(image);
        image.onerror = reject;
        image.src = src;
      });

    Promise.all(theaterFrames.map(loadImage))
      .then((images) => {
        if (canceled) return;
        theaterImagesRef.current = images;
        pageRef.current?.dispatchEvent(new Event("scroll"));
      })
      .catch(() => {
        theaterImagesRef.current = [];
      });

    return () => {
      canceled = true;
    };
  }, []);

  const handleNavClick = (event: MouseEvent<HTMLAnchorElement>, id: string) => {
    event.preventDefault();
    const target = document.getElementById(id);
    target?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const pageStyle = {
    "--hero-progress": 0,
    "--theater-progress": 0,
    "--theater-step-progress": 0,
    "--theater-layer-1": 1,
    "--theater-layer-2": 0,
    "--theater-layer-3": 0,
  } as CSSProperties;

  return (
    <div
      ref={pageRef}
      style={pageStyle}
      className={`${sansClassName} kitamura-page`}
    >
      <header className="kitamura-header">
        <p className={`${serifClassName} kitamura-brand`}>北村 1923</p>
        <nav aria-label="main navigation" className="kitamura-nav">
          {navItems.map((item) => (
            <a
              key={item.id}
              href={`#${item.id}`}
              onClick={(event) => handleNavClick(event, item.id)}
              className={activeSection === item.id ? "is-active" : ""}
              aria-current={activeSection === item.id ? "page" : undefined}
            >
              {item.label}
            </a>
          ))}
        </nav>
      </header>

      <main className="kitamura-main">
        <section id="hero" data-section="hero" className="kitamura-hero snap-panel">
          <div className="kitamura-hero-bg" aria-hidden />
          <div className="kitamura-hero-overlay" aria-hidden />
          <div className="kitamura-hero-inner">
            <p className="kitamura-kicker reveal">創業 1923</p>
            <h1 className={`${serifClassName} kitamura-title reveal`}>
              伝統と革新が織りなす
              <br />
              和の美食体験
            </h1>
            <p className="kitamura-lead reveal">
              百年の技と現代の感性を重ね、静けさの中で味わう一皿へ。
            </p>
            <a href="#reserve" className={`${sansClassName} kitamura-cta reveal`}>
              ご予約はこちら
            </a>
            <p className={`${serifClassName} kitamura-vertical reveal`}>
              北村
              <span>創業一九二三</span>
            </p>
          </div>
        </section>

        <section
          id="story"
          data-section="story"
          className="kitamura-story section-shell reveal snap-panel"
        >
          <div>
            <p className="kitamura-kicker">物語</p>
            <h2 className={`${serifClassName} section-title`}>百年の技が息づく一皿</h2>
            <p className="section-copy">
              産地と旬に向き合い、最小限の手数で素材の力を引き出す。
              北村は1923年から続く日本料理の思想を受け継ぎながら、
              今の時代にふさわしい軽やかさと余韻を追求しています。
            </p>
          </div>
          <div
            className="story-photo"
            role="img"
            aria-label="Japanese cuisine plating"
          />
        </section>

        <section ref={theaterRef} className="theater-shell" aria-label="scroll story">
          <div className="theater-sticky">
            <aside className="theater-side">
              <p className="kitamura-kicker">SCROLL STORY</p>
              <h2 className={`${serifClassName} theater-title`}>中段滾動劇場</h2>
              <p className="theater-copy">
                以固定舞台承接滾動，影像與文案逐段切換，模擬參考站中段的敘事節奏。
              </p>
            </aside>

            <div className="theater-stage" aria-hidden>
              <canvas ref={theaterCanvasRef} className="theater-canvas" />
              <div className="theater-shade" />
            </div>

            <div className="theater-notes">
              <article className="theater-note" data-step="0">
                <p>01</p>
                <h3 className={serifClassName}>職人の手仕事</h3>
                <p>針目、綿、重心。見えない精度を積み重ねる。</p>
              </article>
              <article className="theater-note" data-step="1">
                <p>02</p>
                <h3 className={serifClassName}>素材との対話</h3>
                <p>素材の個性を見極め、最小限の介入で最適化する。</p>
              </article>
              <article className="theater-note" data-step="2">
                <p>03</p>
                <h3 className={serifClassName}>余韻としての眠り</h3>
                <p>体を預けた瞬間に、静かに整う感覚へ。</p>
              </article>
            </div>
          </div>
        </section>

        <section id="menu" data-section="menu" className="section-shell reveal snap-panel">
          <p className="kitamura-kicker">季節の献立</p>
          <h2 className={`${serifClassName} section-title`}>今宵のハイライト</h2>
          <div className="menu-grid">
            {menuHighlights.map((item) => (
              <article className="menu-card" key={item.title}>
                <div
                  className="menu-image"
                  style={{ backgroundImage: `url(${item.image})` }}
                  role="img"
                  aria-label={item.title}
                />
                <div className="menu-card-body">
                  <h3 className={serifClassName}>{item.title}</h3>
                  <p>{item.desc}</p>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section
          id="reserve"
          data-section="reserve"
          className="section-shell reserve-box reveal snap-panel"
        >
          <p className="kitamura-kicker">ご予約</p>
          <h2 className={`${serifClassName} section-title`}>静かな夜を、北村で</h2>
          <p className="section-copy">
            2名様からのコース予約を承っております。特別な会食、記念日、
            海外からのお客様のおもてなしにも対応いたします。
          </p>
          <div className="reserve-actions">
            <a href="#" className={`${sansClassName} kitamura-cta reserve-cta`}>
              オンライン予約
            </a>{" "}
            <a href="#" className="reserve-link">
              お問い合わせ
            </a>
          </div>
        </section>
      </main>

      <footer className="kitamura-footer">
        <p>東京都中央区 / 17:30 - 22:30</p>
        <p className={serifClassName}>KITAMURA SINCE 1923</p>
      </footer>
    </div>
  );
}
