import React from 'react';

export default function Footer() {
  return (
    <footer className="w-full border-t border-ink/10 py-8 px-4 mt-auto text-center text-xs text-ink-muted">
      <div className="max-w-4xl mx-auto space-y-2">
        <p className="font-medium text-ink/75">
          Exam Ready is designed by Globio to support Indian professionals preparing for careers in Germany.
        </p>
        <p className="text-ink-muted/90">
          Unofficial practice check. Not affiliated with the Goethe-Institut.
        </p>
      </div>
    </footer>
  );
}
