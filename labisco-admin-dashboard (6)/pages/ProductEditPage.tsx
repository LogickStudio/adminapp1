
import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import ProductForm from '../components/ProductForm.js';
import type { Product } from '../types.js';
import { getProductsFromStorage, saveProductsToStorage, getProductByIdFromStorage } from '../utils/localStorageUtils.js'; // Assuming a utility for localStorage

const ProductEditPage: React.FC = () => {
  const { productId } = useParams<{ productId: string }>();
  const navigate = useNavigate();
  const [productToEdit, setProductToEdit] = useState<Product | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (productId) {
      const product = getProductByIdFromStorage(productId);
      if (product) {
        setProductToEdit(product);
      } else {
        // Product not found, maybe redirect or show error
        console.error(`Product with ID ${productId} not found.`);
        // Optionally navigate to a 404 or back to products list
        // navigate('/products', { replace: true }); 
      }
    }
    setIsLoading(false);
  }, [productId, navigate]);

  const handleFormSubmit = useCallback((productData: Product) => {
    const currentProducts = getProductsFromStorage();
    let updatedProducts: Product[];

    if (productId) { // Editing existing product
      updatedProducts = currentProducts.map(p => 
        p.id === productId ? { ...p, ...productData, id: productId } : p // Ensure ID remains consistent
      );
    } else { // Adding new product
      const newProduct = { 
        ...productData, 
        id: productData.id || `prod-${Date.now()}-${Math.random().toString(36).substring(2, 9)}` // Ensure new ID if not provided
      };
      updatedProducts = [...currentProducts, newProduct];
    }
    saveProductsToStorage(updatedProducts);
    navigate('/products');
  }, [productId, navigate]);

  if (isLoading && productId) { // Only show loading if trying to fetch a product for editing
    return <div className="text-center p-10">Loading product details...</div>;
  }
  
  if (!productToEdit && productId && !isLoading) {
    return (
      <div className="text-center p-10 bg-cardLight dark:bg-cardDark shadow-lg rounded-lg">
        <h2 className="text-2xl font-semibold text-red-600 dark:text-red-400 mb-4">Product Not Found</h2>
        <p className="text-neutral-600 dark:text-neutral-400 mb-6">
          The product you are trying to edit (ID: {productId}) could not be found. It might have been deleted.
        </p>
        <Link
          to="/products"
          className="px-6 py-2 bg-primary-DEFAULT text-white rounded-md hover:bg-primary-dark transition-colors"
        >
          Back to Products List
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-cardLight dark:bg-cardDark p-4 sm:p-6 lg:p-8 rounded-xl shadow-xl">
      <ProductForm
        product={productToEdit}
        onSubmit={handleFormSubmit}
        onCancel={() => navigate('/products')}
      />
    </div>
  );
};

export default ProductEditPage;