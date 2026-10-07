const egpFormatter = new Intl.NumberFormat("en-EG", {
  style: "currency",
  currency: "EGP",
});

export const formatPrice = (price: number) => egpFormatter.format(price);
