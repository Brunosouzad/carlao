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
