# Portfolio design system

A technical shade built from the live site: near-black surfaces, hairlines instead of shadows, one orange signal, Playfair italic for the voice, Instrument Sans for reading and JetBrains Mono for measurements. Scroll-driven motion with a complete static fallback.

Open `index.html` in a browser to see colours, type, shape, motion and every part in its states. `tokens.css` is the drop-in token file: import it first and use only `var(--...)` in components.

Rules in one line each: one orange thing per screen, depth from hairlines and one-step surfaces, motion tied to scroll position, finished state first, reduced motion respected, mono labels lowercase and for data only.

Reviewed with Hallmark and Impeccable; the single remaining Hallmark finding is the word count of this reference page. Not applied to the site yet: this folder sits outside `app/` and `public/`, so it does not ship.
