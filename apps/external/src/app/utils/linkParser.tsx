import React from 'react';
import Link from 'next/link';

export interface LinkPattern {
  text: string;
  href: string;
}

export const DEFAULT_LINK_PATTERNS: LinkPattern[] = [
  { text: 'Guest List Tool', href: '/admin/guest-list' },
  { text: 'Microsite Builder', href: '/admin/microsite' },
  { text: 'AI Scheduler Tool', href: '/admin/scheduler' },
  { text: 'E-commerce Platform', href: '/admin/shop' },
  { text: 'Photo Album Invite Card Builder', href: '/admin/album' },
  { text: 'Seating Arrangement Tool', href: '/admin/seating' },
  { text: 'Budget Tracking Feature', href: '/admin/dashboard' },
  { text: 'Attendance Taking Tool', href: '/admin/attendance' },
  { text: 'Wedding Gifts Tool', href: '/admin/gifts' },
  { text: 'E-card Tool', href: '/admin/ecard' },

  // Add more patterns as needed
];

export interface ParsedTextPart {
  type: 'text' | 'link';
  content: string;
  href?: string;
  key: string;
}

/**
 * Parses text and identifies link patterns, returning an array of text parts and link parts
 */
export function parseTextWithLinks(
  text: string,
  linkPatterns: LinkPattern[] = DEFAULT_LINK_PATTERNS,
): ParsedTextPart[] {
  if (!text || typeof text !== 'string') {
    return [{ type: 'text', content: text || '', key: '0' }];
  }

  // Find all matches with their positions
  const matches: Array<{ start: number; end: number; text: string; href: string }> = [];

  linkPatterns.forEach(({ text: pattern, href }) => {
    let index = text.indexOf(pattern);
    while (index !== -1) {
      matches.push({
        start: index,
        end: index + pattern.length,
        text: pattern,
        href,
      });
      index = text.indexOf(pattern, index + 1);
    }
  });

  // Sort matches by start position
  matches.sort((a, b) => a.start - b.start);

  // Remove overlapping matches (keep the first one)
  const filteredMatches = matches.filter((match, index) => {
    for (let i = 0; i < index; i++) {
      if (matches[i].end > match.start) {
        return false; // This match overlaps with a previous one
      }
    }
    return true;
  });

  if (filteredMatches.length === 0) {
    return [{ type: 'text', content: text, key: '0' }];
  }

  const parts: ParsedTextPart[] = [];
  let lastIndex = 0;

  filteredMatches.forEach((match, index) => {
    // Add text before the match
    if (match.start > lastIndex) {
      parts.push({
        type: 'text',
        content: text.substring(lastIndex, match.start),
        key: `text-${index}`,
      });
    }

    // Add the link part
    parts.push({
      type: 'link',
      content: match.text,
      href: match.href,
      key: `link-${index}`,
    });

    lastIndex = match.end;
  });

  // Add remaining text
  if (lastIndex < text.length) {
    parts.push({
      type: 'text',
      content: text.substring(lastIndex),
      key: `text-final`,
    });
  }

  return parts;
}

/**
 * Renders parsed text parts as React elements with Link components
 */
export function renderParsedText(
  parts: ParsedTextPart[],
  linkClassName: string = 'text-blue-600 hover:text-blue-800 underline',
): React.ReactNode {
  return parts.map((part) => {
    if (part.type === 'text') {
      return <React.Fragment key={part.key}>{part.content}</React.Fragment>;
    } else if (part.type === 'link' && part.href) {
      return (
        <Link key={part.key} href={part.href} className={linkClassName}>
          {part.content}
        </Link>
      );
    }
    return null;
  });
}

/**
 * Convenience function that combines parsing and rendering
 */
export function parseAndRenderText(
  text: string,
  linkClassName?: string,
  linkPatterns?: LinkPattern[],
): React.ReactNode {
  const parts = parseTextWithLinks(text, linkPatterns);
  return renderParsedText(parts, linkClassName);
}
