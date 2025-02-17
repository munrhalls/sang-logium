// import { AnimatePresence, motion } from "framer-motion";
import ProductThumb from "./ProductThumb";
import { ALL_PRODUCTS_QUERYResult } from "@/sanity.types";

const ProductsGrid = ({ products }: { products: ALL_PRODUCTS_QUERYResult }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-4 bg-slate-200">
      {/* <AnimatePresence>
        {products?.map((product) => (
          <motion.div
            key={`${product._id} -animate`}
            layout
            initial={{ opacity: 0.2 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex justify-center"
          >
          </motion.div>
        ))}
      </AnimatePresence> */}

      {products?.map((product) => {
        return (
          <div key={product._id}>
            <ProductThumb product={product} />
          </div>
        );
      })}
    </div>
  );
};

export default ProductsGrid;
