import { getSaleById } from "@/sanity/lib/sales/getSaleById";
import { getAllActiveSales } from "@/sanity/lib/sales/getAllActiveSales";
import ProductThumb from "@/components/features/products/ProductThumb";
import { notFound } from "next/navigation";

interface Props {
  params: { id: string };
}

export default async function SalePage({ params: { id } }: Props) {
  const sale = await getSaleById(id);

  if (!sale) {
    notFound();
  }

  const now = new Date();

  const isValidNow =
    sale.isActive &&
    (!sale.validFrom || new Date(sale.validFrom) <= now) &&
    (!sale.validUntil || new Date(sale.validUntil) >= now);

  if (!isValidNow) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-4">This sale has ended</h1>
        <p>Check our other active sales</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">{sale.title}</h1>
        <div className="flex items-center gap-4 text-lg">
          <span className="text-red-600 font-bold">{sale.discount}% OFF</span>
          {sale.validUntil && (
            <span className="text-gray-600">
              Ends {new Date(sale.validUntil).toLocaleDateString()}
            </span>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {sale.products?.map((product) => (
          <ProductThumb
            key={product._id}
            product={product}
            saleDiscount={sale.discount}
          />
        ))}
      </div>
    </div>
  );
}

export async function generateStaticParams() {
  const sales = await getAllActiveSales();

  return sales.map((sale) => ({
    slug: sale.slug || "",
  }));
}
