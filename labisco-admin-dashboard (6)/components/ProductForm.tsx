
import React, { useState, useEffect, ChangeEvent } from 'react';
import type { Product, ProductVariant } from '../types.js';
import { PRODUCT_CATEGORIES, XCircleIcon, TrashIcon, PlusIcon } from '../constants.js';

interface ProductFormProps {
  product?: Product | null;
  onSubmit: (product: Product) => void;
  onCancel: () => void;
}

const createEmptyVariant = (): ProductVariant => ({
  id: `variant-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
  name: '',
  price: 0,
  stock: 0,
  sku: '',
});

const ProductForm: React.FC<ProductFormProps> = ({ product, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState<Partial<Product> & { variants: ProductVariant[] }>({
    name: '',
    category: PRODUCT_CATEGORIES[0] || '',
    imageUrls: [],
    description: '',
    variants: [createEmptyVariant()],
  });

  useEffect(() => {
    if (product) {
      setFormData({
        id: product.id,
        name: product.name || '',
        category: product.category || PRODUCT_CATEGORIES[0] || '',
        imageUrls: product.imageUrls ? [...product.imageUrls] : [],
        description: product.description || '',
        variants: product.variants && product.variants.length > 0 ? [...product.variants.map(v => ({...v}))] : [createEmptyVariant()],
      });
    } else { // For new product
      setFormData({
        name: '',
        category: PRODUCT_CATEGORIES[0] || '',
        imageUrls: [],
        description: '',
        variants: [createEmptyVariant()],
      });
    }
  }, [product]);

  const handleBaseChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleVariantChange = (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const updatedVariants = [...formData.variants];
    const fieldName = name as keyof Omit<ProductVariant, 'id'>;

    if (fieldName === 'price' || fieldName === 'stock') {
        updatedVariants[index] = { ...updatedVariants[index], [fieldName]: parseFloat(value) || 0 };
    } else {
        updatedVariants[index] = { ...updatedVariants[index], [fieldName]: value };
    }
    setFormData(prev => ({ ...prev, variants: updatedVariants }));
  };

  const addVariant = () => {
    setFormData(prev => ({
      ...prev,
      variants: [...prev.variants, createEmptyVariant()],
    }));
  };

  const removeVariant = (indexToRemove: number) => {
    if (formData.variants.length <= 1) {
        alert("A product must have at least one variant.");
        return;
    }
    setFormData(prev => ({
      ...prev,
      variants: prev.variants.filter((_, index) => index !== indexToRemove),
    }));
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      const newImageUrls: string[] = [];
      let filesProcessed = 0;

      files.forEach(file => {
        const reader = new FileReader();
        reader.onloadend = () => {
          newImageUrls.push(reader.result as string);
          filesProcessed++;
          if (filesProcessed === files.length) {
            setFormData(prev => ({
              ...prev,
              imageUrls: [...(prev.imageUrls || []), ...newImageUrls],
            }));
          }
        };
        reader.readAsDataURL(file);
      });
      e.target.value = ''; 
    }
  };

  const handleRemoveImage = (indexToRemove: number) => {
    setFormData(prev => ({
      ...prev,
      imageUrls: (prev.imageUrls || []).filter((_, index) => index !== indexToRemove),
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.category || formData.variants.some(v => !v.name || v.price == null || v.stock == null)) {
        alert("Please fill in all required fields: Product Name, Category, and for each variant: Name, Price, Stock.");
        return;
    }
    if (formData.variants.length === 0) {
        alert("Product must have at least one variant.");
        return;
    }
    onSubmit({
      id: product?.id || formData.id, // Use existing ID if editing, or one from state (potentially set if new but before submit)
      name: formData.name!,
      category: formData.category!,
      imageUrls: formData.imageUrls || [],
      description: formData.description || '',
      variants: formData.variants,
    } as Product);
  };
  
  const inputClasses = "mt-1 block w-full px-3 py-2 bg-neutral-100 dark:bg-neutral-700 border border-neutral-300 dark:border-neutral-600 rounded-md shadow-sm focus:outline-none focus:ring-primary-DEFAULT focus:border-primary-DEFAULT sm:text-sm text-neutral-900 dark:text-neutral-100 placeholder-neutral-500 dark:placeholder-neutral-400";
  const labelClasses = "block text-sm font-medium text-neutral-700 dark:text-neutral-300";

  return (
    <form onSubmit={handleSubmit} className="space-y-6 md:space-y-8">
      {/* Base Product Info - Grid for larger screens */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-6">
        <div>
          <label htmlFor="name" className={labelClasses}>Product Name</label>
          <input type="text" name="name" id="name" value={formData.name} onChange={handleBaseChange} required className={inputClasses} />
        </div>
        <div>
          <label htmlFor="category" className={labelClasses}>Category</label>
          <select name="category" id="category" value={formData.category} onChange={handleBaseChange} required className={inputClasses}>
            {PRODUCT_CATEGORIES.map(cat => (<option key={cat} value={cat}>{cat}</option>))}
          </select>
        </div>
      </div>

      {/* Image Upload - Full width */}
      <div>
        <label htmlFor="imageUpload" className={labelClasses}>Product Images</label>
        <input
          type="file"
          id="imageUpload"
          multiple
          accept="image/*"
          onChange={handleFileChange}
          className="mt-1 block w-full text-sm text-neutral-500 dark:text-neutral-400
                     file:mr-4 file:py-2 file:px-4
                     file:rounded-md file:border-0
                     file:text-sm file:font-semibold
                     file:bg-primary-light file:text-white
                     hover:file:bg-primary-DEFAULT transition-colors cursor-pointer"
        />
        <p className="mt-1 text-xs text-neutral-500 dark:text-neutral-400">Upload one or more images. Recommended: Square images, less than 1MB each.</p>
        {(formData.imageUrls && formData.imageUrls.length > 0) && (
          <div className="mt-3 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
            {formData.imageUrls.map((url, index) => (
              <div key={index} className="relative group aspect-square">
                <img src={url} alt={`Preview ${index + 1}`} className="w-full h-full object-cover rounded-md shadow-md border border-neutral-200 dark:border-neutral-700" />
                <button
                  type="button"
                  onClick={() => handleRemoveImage(index)}
                  className="absolute top-1 right-1 bg-red-600/80 hover:bg-red-500 text-white rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition-opacity focus:outline-none"
                  aria-label="Remove image"
                >
                  <XCircleIcon className="w-5 h-5" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Description - Full width */}
      <div>
        <label htmlFor="description" className={labelClasses}>Description (Optional)</label>
        <textarea name="description" id="description" value={formData.description} onChange={handleBaseChange} rows={4} className={inputClasses + " min-h-[80px]"} />
      </div>

      {/* Variants Section */}
      <div className="space-y-4 pt-4 border-t border-neutral-300 dark:border-neutral-700">
        <h3 className="text-lg font-medium text-neutral-800 dark:text-neutral-200">Product Variants (Sizes/Weights)</h3>
        {formData.variants.map((variant, index) => (
          <div key={variant.id || index} className="p-4 bg-neutral-50 dark:bg-neutral-700/50 rounded-lg shadow space-y-4 relative border border-neutral-200 dark:border-neutral-600">
            {formData.variants.length > 1 && (
              <button
                type="button"
                onClick={() => removeVariant(index)}
                className="absolute top-2 right-2 text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-500 transition-colors"
                title="Remove Variant"
              >
                <TrashIcon className="w-5 h-5" />
              </button>
            )}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4">
              <div>
                <label htmlFor={`variant-name-${index}`} className={`${labelClasses} text-xs`}>Variant Name (e.g., 100g, Large)</label>
                <input type="text" name="name" id={`variant-name-${index}`} value={variant.name} onChange={(e) => handleVariantChange(index, e)} required className={inputClasses} />
              </div>
              <div>
                <label htmlFor={`variant-sku-${index}`} className={`${labelClasses} text-xs`}>SKU (Optional)</label>
                <input type="text" name="sku" id={`variant-sku-${index}`} value={variant.sku || ''} onChange={(e) => handleVariantChange(index, e)} className={inputClasses} />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-x-6 gap-y-4">
              <div>
                <label htmlFor={`variant-price-${index}`} className={`${labelClasses} text-xs`}>Price (₦)</label>
                <input type="number" name="price" id={`variant-price-${index}`} value={variant.price} onChange={(e) => handleVariantChange(index, e)} required min="0" step="0.01" className={inputClasses} />
              </div>
              <div>
                <label htmlFor={`variant-stock-${index}`} className={`${labelClasses} text-xs`}>Stock</label>
                <input type="number" name="stock" id={`variant-stock-${index}`} value={variant.stock} onChange={(e) => handleVariantChange(index, e)} required min="0" className={inputClasses} />
              </div>
            </div>
          </div>
        ))}
        <button
          type="button"
          onClick={addVariant}
          className="flex items-center px-4 py-2 text-sm font-medium text-primary-DEFAULT dark:text-primary-light bg-primary-DEFAULT/10 dark:bg-primary-light/10 border border-primary-DEFAULT/30 dark:border-primary-light/30 rounded-md hover:bg-primary-DEFAULT/20 dark:hover:bg-primary-light/20 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-cardLight dark:focus:ring-offset-cardDark focus:ring-primary-DEFAULT transition-colors"
        >
          <PlusIcon className="w-4 h-4 mr-2" />
          Add Another Variant
        </button>
      </div>

      {/* Action Buttons */}
      <div className="flex justify-end space-x-3 pt-6 border-t border-neutral-300 dark:border-neutral-700">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 text-sm font-medium text-neutral-700 dark:text-neutral-300 bg-neutral-200 dark:bg-neutral-600 rounded-md hover:bg-neutral-300 dark:hover:bg-neutral-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-cardLight dark:focus:ring-offset-cardDark focus:ring-neutral-500 transition-colors"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-6 py-2 text-sm font-medium text-white bg-primary-DEFAULT rounded-md hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-cardLight dark:focus:ring-offset-cardDark focus:ring-primary-DEFAULT transition-colors"
        >
          {product ? 'Save Changes' : 'Add Product'}
        </button>
      </div>
    </form>
  );
};

export default ProductForm;