
import React from 'react';
import type { Product, ProductVariant } from '../types.js';
import { EditIcon, DeleteIcon } from '../constants.js';

interface ProductTableProps {
  products: Product[];
  onEdit: (product: Product) => void;
  onDelete: (productId: string) => void;
}

const getPriceDisplay = (variants: ProductVariant[]): string => {
  if (!variants || variants.length === 0) return 'N/A';
  
  const prices = variants.map(v => v.price);
  const minPrice = Math.min(...prices);
  const maxPrice = Math.max(...prices);

  if (minPrice === maxPrice) {
    return `₦${minPrice.toFixed(2)}`;
  }
  return `₦${minPrice.toFixed(2)} - ₦${maxPrice.toFixed(2)}`;
};

const getTotalStock = (variants: ProductVariant[]): number => {
  if (!variants || variants.length === 0) return 0;
  return variants.reduce((sum, v) => sum + v.stock, 0);
};

const ProductTable: React.FC<ProductTableProps> = ({ products, onEdit, onDelete }) => {
  if (products.length === 0) {
    return <p className="text-neutral-500 dark:text-neutral-400 text-center py-8">No products found. Add some to get started!</p>;
  }

  const headerCellClasses = "px-6 py-3 text-left text-xs font-medium text-neutral-500 dark:text-neutral-400 uppercase tracking-wider";
  const bodyCellClasses = "px-6 py-4 whitespace-nowrap text-sm";

  return (
    <div className="overflow-x-auto bg-cardLight dark:bg-cardDark shadow-lg rounded-lg border border-borderLight dark:border-borderDark">
      <table className="min-w-full divide-y divide-borderLight dark:divide-borderDark">
        <thead className="bg-neutral-50 dark:bg-neutral-700/50">
          <tr>
            <th scope="col" className={headerCellClasses}>Image</th>
            <th scope="col" className={headerCellClasses}>Name</th>
            <th scope="col" className={headerCellClasses}>Category</th>
            <th scope="col" className={headerCellClasses}>Price</th>
            <th scope="col" className={headerCellClasses}>Total Stock</th>
            <th scope="col" className={headerCellClasses}>Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-borderLight dark:divide-borderDark">
          {products.map((product) => (
            <tr key={product.id} className="hover:bg-neutral-50 dark:hover:bg-neutral-700/30 transition-colors">
              <td className={bodyCellClasses}>
                <img 
                  src={(product.imageUrls && product.imageUrls.length > 0) ? product.imageUrls[0] : 'https://picsum.photos/seed/defaultprod/40/40'} 
                  alt={product.name} 
                  className="w-10 h-10 rounded-full object-cover border border-neutral-200 dark:border-neutral-600" 
                  onError={(e) => (e.currentTarget.src = 'https://picsum.photos/seed/errorprod/40/40')}
                />
              </td>
              <td className={`${bodyCellClasses} text-textLight dark:text-textDark`}>
                <div className="font-medium">{product.name}</div>
                {product.variants && product.variants.length > 1 && (
                     <div className="text-xs text-neutral-500 dark:text-neutral-400">{product.variants.length} variants</div>
                )}
                {product.variants && product.variants.length === 1 && (
                     <div className="text-xs text-neutral-500 dark:text-neutral-400">{product.variants[0].name}</div>
                )}
              </td>
              <td className={bodyCellClasses}>
                <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-secondary-light/30 dark:bg-secondary-dark/30 text-secondary-dark dark:text-secondary-light">
                  {product.category}
                </span>
              </td>
              <td className={`${bodyCellClasses} text-neutral-600 dark:text-neutral-300`}>{getPriceDisplay(product.variants)}</td>
              <td className={`${bodyCellClasses} text-neutral-600 dark:text-neutral-300`}>{getTotalStock(product.variants)}</td>
              <td className={`${bodyCellClasses} space-x-2`}>
                <button
                  onClick={() => onEdit(product)}
                  className="text-primary-DEFAULT hover:text-primary-dark dark:text-primary-light dark:hover:text-primary-DEFAULT transition-colors p-1 rounded hover:bg-primary-DEFAULT/10 dark:hover:bg-primary-light/10"
                  title="Edit Product"
                >
                  <EditIcon />
                </button>
                <button
                  onClick={() => onDelete(product.id)}
                  className="text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-500 transition-colors p-1 rounded hover:bg-red-500/10 dark:hover:bg-red-400/10"
                  title="Delete Product"
                >
                  <DeleteIcon />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ProductTable;