import React from "react";

const Footer = () => (
  <footer className="bg-background py-10 px-6 sm:px-20 text-center text-foreground/90">
    <p>© {new Date().getFullYear()} Covenent. All rights reserved.</p>
    <div className="flex justify-center gap-6 mt-4">
      <a href="/about" className="hover:underline">
        About
      </a>
      <a href="/contact" className="hover:underline">
        Contact
      </a>
      <a href="/privacy" className="hover:underline">
        Privacy Policy
      </a>
    </div>
  </footer>
);

export default Footer;
