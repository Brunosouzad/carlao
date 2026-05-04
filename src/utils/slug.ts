import { Property } from "@/data/properties";

export function generateSlug(property: Property): string {
  if (!property) return "";
  
  const text = `${property.type}-${property.category}-${property.title}-${property.code}`;
  
  return text
    .toString()
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // Remove acentos
    .replace(/[^\w\s-]/g, '') // Remove caracteres especiais
    .replace(/\s+/g, '-') // Substitui espaços por hifens
    .replace(/--+/g, '-') // Remove hifens duplos
    .trim();
}
