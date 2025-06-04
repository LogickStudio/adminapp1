
import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import ProductTable from '../components/ProductTable.js';
import Modal from '../components/Modal.js'; // Keep Modal for delete confirmation
import { PlusIcon } from '../constants.js';
import type { Product } from '../types.js';
import { getProductsFromStorage, saveProductsToStorage } from '../utils/localStorageUtils.js';

const ProductsPage: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [productToDelete, setProductToDelete] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    setProducts(getProductsFromStorage());
  }, []); // Load initially

  // This effect will run if products are updated elsewhere (e.g. ProductEditPage)
  // and this page becomes visible again.
  useEffect(() => {
    const handleFocus = () => {
      setProducts(getProductsFromStorage());
    };
    window.addEventListener('focus', handleFocus);
    return () => {
      window.removeEventListener('focus', handleFocus);
    };
  }, []);


  const handleAddProduct = () => {
    navigate('/products/new');
  };

  const handleEditProduct = (product: Product) => {
    navigate(`/products/edit/${product.id}`);
  };

  const handleDeleteProduct = (productId: string) => {
    setProductToDelete(productId);
    setShowDeleteConfirm(true);
  };
  
  const confirmDeleteProduct = useCallback(() => {
    if (productToDelete) {
      const updatedProducts = products.filter(p => p.id !== productToDelete);
      setProducts(updatedProducts);
      saveProductsToStorage(updatedProducts);
    }
    setShowDeleteConfirm(false);
    setProductToDelete(null);
  }, [productToDelete, products]);


  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
        <div className="relative w-full sm:max-w-xs">
          <input
            type="text"
            placeholder="Search products..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-2 pr-10 text-textLight dark:text-textDark bg-cardLight dark:bg-cardDark border border-borderLight dark:border-borderDark rounded-lg focus:ring-primary-DEFAULT focus:border-primary-DEFAULT placeholder-neutral-500 dark:placeholder-neutral-400"
          />
           <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
            <svg className="h-5 w-5 text-neutral-400 dark:text-neutral-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
              <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
            </svg>
          </div>
        </div>
        <button
          onClick={handleAddProduct}
          className="w-full sm:w-auto flex items-center justify-center px-4 py-2 bg-primary-DEFAULT text-white rounded-lg hover:bg-primary-dark transition-colors shadow-md focus:outline-none focus:ring-2 focus:ring-primary-DEFAULT focus:ring-offset-2 focus:ring-offset-bgLight dark:focus:ring-offset-bgDark"
        >
          <PlusIcon className="w-5 h-5 mr-2" />
          Add Product
        </button>
      </div>

      <ProductTable
        products={filteredProducts}
        onEdit={handleEditProduct}
        onDelete={handleDeleteProduct}
      />

      {/* Modal for Delete Confirmation */}
      <Modal
        isOpen={showDeleteConfirm}
        onClose={() => {
            setShowDeleteConfirm(false);
            setProductToDelete(null);
        }}
        title="Confirm Deletion"
        size="sm"
      >
        <div className="text-textLight dark:text-textDark">
          <p>Are you sure you want to delete this product? This action cannot be undone.</p>
          <div className="mt-6 flex justify-end space-x-3">
            <button
              onClick={() => {
                  setShowDeleteConfirm(false);
                  setProductToDelete(null);
              }}
              className="px-4 py-2 text-sm font-medium text-neutral-700 dark:text-neutral-300 bg-neutral-200 dark:bg-neutral-600 rounded-md hover:bg-neutral-300 dark:hover:bg-neutral-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-cardLight dark:focus:ring-offset-cardDark focus:ring-neutral-500 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={confirmDeleteProduct}
              className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-cardLight dark:focus:ring-offset-cardDark focus:ring-red-500 transition-colors"
            >
              Delete
            </button>
          </div>
        </div>
      </Modal>

    </div>
  );
};

export default ProductsPage;