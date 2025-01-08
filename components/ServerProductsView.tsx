// ServerProductsView.tsx
import { ALL_PRODUCTS_QUERYResult } from "@/sanity.types";
import ClientProductsView from "./ClientProductsView";

interface ServerProductViewProps {
  products: ALL_PRODUCTS_QUERYResult;
}

export default function ServerProductsView({
  products,
}: ServerProductViewProps) {
  const initialProducts = products.slice(0, 20);

  return (
    <ClientProductsView
      initialProducts={initialProducts}
      allProducts={products}
    />
  );
}
