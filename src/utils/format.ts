export const formatPrice = (price: string | number): string => {
  if (!price || price === "0" || price === 0) return "Consulte-nos";
  
  const numericPrice = Number(String(price).replace(/\D/g, '')) / 100;
  if (isNaN(numericPrice) || numericPrice === 0) return "Consulte-nos";
  
  return new Intl.NumberFormat('pt-BR', { 
    style: 'currency', 
    currency: 'BRL', 
    maximumFractionDigits: 2 
  }).format(numericPrice);
};

export const formatDescription = (text: string): string => {
  if (!text) return "";
  
  // 1. Fix literal "rn" to newlines
  // We prioritize rnrn as double newline
  let cleaned = text.replace(/rnrn/g, '\n\n');
  
  // Replace "rn" with newline, but try to avoid breaking words if possible
  // In the context of these property exports, "rn" is almost always a line break
  // We use a regex that looks for "rn" after punctuation or at common break points
  cleaned = cleaned.replace(/([!.:;?,])rn/g, '$1\n');
  cleaned = cleaned.replace(/rn(?=[A-Z0-9📍🏡🏠✨✅])/gu, '\n');
  
  // Final pass for remaining "rn" that are likely separators
  // We skip common words ending in "rn" if needed, but here it's safer to just handle them
  // if they are preceded by a space or followed by a space.
  cleaned = cleaned.replace(/ rn /g, ' \n ');
  
  // If it's still very "rn" heavy, a global replace might be necessary if we trust the data source
  // Given the screenshot, global replace seems intended.
  cleaned = cleaned.replace(/rn/g, '\n');

  // 2. Decode HTML entities
  // Numeric entities like &#128205;
  cleaned = cleaned.replace(/&#(\d+);/g, (match, dec) => {
    try {
      return String.fromCodePoint(parseInt(dec, 10));
    } catch {
      return match;
    }
  });

  // Common named entities
  const namedEntities: Record<string, string> = {
    '&ndash;': '–',
    '&mdash;': '—',
    '&quot;': '"',
    '&amp;': '&',
    '&lt;': '<',
    '&gt;': '>',
    '&nbsp;': ' ',
    '&ordm;': 'º',
    '&orda;': 'ª',
  };

  cleaned = cleaned.replace(/&[a-z0-9]+;/gi, (match) => {
    return namedEntities[match.toLowerCase()] || match;
  });

  return cleaned.trim();
};
