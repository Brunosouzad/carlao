export const formatPrice = (price: string | number): string => {
  const numericPrice = Number(String(price).replace(/\D/g, ''));
  if (isNaN(numericPrice) || numericPrice === 0) return String(price);
  return new Intl.NumberFormat('pt-BR', { 
    style: 'currency', 
    currency: 'BRL', 
    maximumFractionDigits: 0 
  }).format(numericPrice);
};
