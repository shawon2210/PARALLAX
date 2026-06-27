'use client';

import ScrollReveal from './ScrollReveal';

export default function Manifesto() {
  return (
    <section className="manifesto" id="manifesto">
      <div className="wrap">
        <ScrollReveal>
          <p>
            Flat interfaces ask you to choose what matters.<br />
            PARALLAX lets <span className="accent">distance</span> decide —<br />
            what&apos;s close stays <span className="accent2">sharp</span>, what&apos;s far stays quiet.
          </p>
        </ScrollReveal>
      </div>
    </section>
  );
}
