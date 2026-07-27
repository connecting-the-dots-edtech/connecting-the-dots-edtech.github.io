import type { TimelineEvent } from '../data/types';

/**
 * Minimal frontmatter parser for our event Markdown files. Not a general
 * YAML parser — just `key: value` lines between `---` fences, followed by
 * a Markdown body. Good enough for the flat, non-nested fields an event
 * needs, without pulling in a YAML dependency for a static build.
 */
function parseFrontmatter(raw: string): { fields: Record<string, string>; body: string } {
  const match = /^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/.exec(raw.trim());
  if (!match) throw new Error('Event markdown file is missing a --- frontmatter block');
  const [, frontmatter, body] = match;

  const fields: Record<string, string> = {};
  for (const line of frontmatter.split('\n')) {
    if (!line.trim()) continue;
    const idx = line.indexOf(':');
    if (idx === -1) continue;
    const key = line.slice(0, idx).trim();
    let value = line.slice(idx + 1).trim();
    if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
      value = value.slice(1, -1);
    }
    fields[key] = value;
  }

  return { fields, body: body.trim() };
}

export function parseEventMarkdown(raw: string): TimelineEvent {
  const { fields, body } = parseFrontmatter(raw);

  const required = ['id', 'era', 'year', 'title', 'titleEn', 'up', 'thumb'] as const;
  for (const key of required) {
    if (!(key in fields)) throw new Error(`Event markdown is missing required field "${key}"`);
  }

  const event: TimelineEvent = {
    id: Number(fields.id),
    era: fields.era,
    year: fields.year,
    title: fields.title,
    titleEn: fields.titleEn,
    up: fields.up === 'true',
    thumb: fields.thumb,
    body,
  };
  if (fields.arabic) event.arabic = fields.arabic;

  return event;
}
