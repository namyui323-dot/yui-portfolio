import React from 'react';

export default function Footer() {
  return (
    <footer className="mb-10 px-4 text-center text-gray-500">
      <small className="mb-2 text-xs block">&copy; 2026 Yui. All rights reserved.</small>
      <p className="text-xs">
        Design adapted from{' '}
        <a className="underline" href="https://github.com/vadimkim0203/CV-Website" target="_blank" rel="noreferrer">
          Vadim Kim&apos;s CV-Website
        </a>{' '}
        with permission. Built with Next.js, TypeScript, Tailwind CSS and Framer Motion.
      </p>
    </footer>
  );
}
