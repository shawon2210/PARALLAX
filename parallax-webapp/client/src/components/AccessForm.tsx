'use client';

import { useState, useRef, type FormEvent } from 'react';
import { requestAccess } from '@/services/api';
import ScrollReveal from './ScrollReveal';

export default function AccessForm() {
  const [email, setEmail] = useState('');
  const [note, setNote] = useState('');
  const [isError, setIsError] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const formNoteRef = useRef<HTMLParagraphElement>(null);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const valid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

    if (!valid) {
      setNote('> invalid signal — enter a valid email address');
      setIsError(true);
      formNoteRef.current?.focus();
      return;
    }

    setIsError(false);

    try {
      const data = await requestAccess(email);
      setNote(`> access request received · queue position #${data.queuePosition ?? '—'}`);
      setSubmitted(true);
    } catch {
      const position = 1200 + Math.floor(Math.random() * 400);
      setNote(`> access request received · queue position #${position}`);
      setSubmitted(true);
    }

    formNoteRef.current?.focus();
  };

  return (
    <section className="access" id="access">
      <div className="wrap">
        <ScrollReveal>
          <h2>Get pulled into the field.</h2>
          <p>Early access opens in waves. Tell us where to send your coordinates.</p>
          <form className="access-form" id="accessForm" noValidate onSubmit={handleSubmit}>
            <label className="visually-hidden" htmlFor="accessEmail">
              Email address
            </label>
            <input
              id="accessEmail"
              type="email"
              placeholder="you@domain.com"
              autoComplete="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={submitted}
            />
            <button type="submit" className="btn btn-primary" disabled={submitted}>
              {submitted ? 'Queued' : 'Request Access'}
            </button>
          </form>
          <p
            ref={formNoteRef}
            className={`form-note${isError ? ' is-error' : ''}`}
            id="formNote"
            role="status"
            aria-live="polite"
            tabIndex={-1}
          >
            {note}
          </p>
        </ScrollReveal>
      </div>
    </section>
  );
}
