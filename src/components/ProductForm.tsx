// src/components/ProductForm.tsx
import React, { useState, useEffect } from 'react';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { InputNumber } from 'primereact/inputnumber';
import { InputTextarea } from 'primereact/inputtextarea';
import { Dropdown } from 'primereact/dropdown';
import { Button } from 'primereact/button';
import { ProgressSpinner } from 'primereact/progressspinner';
import { Product, ProductFormData, ProductFormErrors } from '../types';
import './ProductForm.css';

interface ProductFormProps {
  visible: boolean;
  onHide: () => void;
  onSubmit: (data: ProductFormData) => Promise<boolean>;
  product?: Product | null;
  loading?: boolean;
}

const ProductForm: React.FC<ProductFormProps> = ({
  visible,
  onHide,
  onSubmit,
  product,
  loading = false,
}) => {
  const [formData, setFormData] = useState<ProductFormData>({
    title: '',
    price: 0,
    description: '',
    category: '',
    image: '',
  });

  const [errors, setErrors] = useState<ProductFormErrors>({});

  const categories = [
    { label: 'Electronics', value: 'electronics' },
    { label: 'Jewelery', value: 'jewelery' },
    { label: "Men's Clothing", value: "men's clothing" },
    { label: "Women's Clothing", value: "women's clothing" },
  ];

  useEffect(() => {
    if (product) {
      setFormData({
        title: product.title,
        price: product.price,
        description: product.description,
        category: product.category,
        image: product.image,
      });
    } else {
      setFormData({
        title: '',
        price: 0,
        description: '',
        category: '',
        image: '',
      });
    }
    setErrors({});
  }, [product, visible]);

  const validateForm = (): boolean => {
    const newErrors: ProductFormErrors = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    } else if (formData.title.length < 3) {
      newErrors.title = 'Title must be at least 3 characters';
    }

    if (!formData.price || formData.price <= 0) {
      newErrors.price = 'Price must be greater than 0';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    } else if (formData.description.length < 10) {
      newErrors.description = 'Description must be at least 10 characters';
    }

    if (!formData.category) {
      newErrors.category = 'Category is required';
    }

    if (!formData.image.trim()) {
      newErrors.image = 'Image URL is required';
    } else if (!isValidUrl(formData.image)) {
      newErrors.image = 'Please enter a valid URL';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const isValidUrl = (string: string) => {
    try {
      new URL(string);
      return true;
    } catch (_) {
      return false;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    const success = await onSubmit(formData);
    if (success) {
      onHide();
    }
  };

  const handleFieldChange = (field: keyof ProductFormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Clear field error when user starts typing
    if (errors[field as keyof ProductFormErrors]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  const headerElement = (
    <div className="form-header">
      <i className={`pi ${product ? 'pi-pencil' : 'pi-plus'}`} />
      <span>{product ? 'Edit Product' : 'Add New Product'}</span>
    </div>
  );

  const footerElement = (
    <div className="form-footer">
      <Button
        label="Cancel"
        icon="pi pi-times"
        className="p-button-text"
        onClick={onHide}
        disabled={loading}
      />
      <Button
        label={loading ? undefined : (product ? 'Update' : 'Create')}
        icon={loading ? undefined : (product ? 'pi pi-check' : 'pi pi-plus')}
        className="p-button-primary"
        onClick={handleSubmit}
        disabled={loading}
      >
        {loading && <ProgressSpinner style={{ width: '20px', height: '20px' }} strokeWidth="4" />}
      </Button>
    </div>
  );

  return (
    <Dialog
      visible={visible}
      onHide={onHide}
      header={headerElement}
      footer={footerElement}
      className="product-form-dialog"
      modal
      style={{ width: '90vw', maxWidth: '600px' }}
      breakpoints={{ '960px': '75vw', '641px': '90vw' }}
    >
      <form onSubmit={handleSubmit} className="product-form">
        <div className="form-grid">
          <div className="field">
            <label htmlFor="title" className="field-label">
              Title <span className="required">*</span>
            </label>
            <InputText
              id="title"
              value={formData.title}
              onChange={(e) => handleFieldChange('title', e.target.value)}
              placeholder="Enter product title"
              className={`w-full ${errors.title ? 'p-invalid' : ''}`}
              disabled={loading}
            />
            {errors.title && <small className="p-error">{errors.title}</small>}
          </div>

          <div className="field">
            <label htmlFor="price" className="field-label">
              Price <span className="required">*</span>
            </label>
            <InputNumber
              id="price"
              value={formData.price}
              onValueChange={(e) => handleFieldChange('price', e.value || 0)}
              placeholder="Enter price"
              mode="currency"
              currency="USD"
              locale="en-US"
              className={`w-full ${errors.price ? 'p-invalid' : ''}`}
              disabled={loading}
            />
            {errors.price && <small className="p-error">{errors.price}</small>}
          </div>

          <div className="field full-width">
            <label htmlFor="category" className="field-label">
              Category <span className="required">*</span>
            </label>
            <Dropdown
              id="category"
              value={formData.category}
              onChange={(e) => handleFieldChange('category', e.value)}
              options={categories}
              placeholder="Select a category"
              className={`w-full ${errors.category ? 'p-invalid' : ''}`}
              disabled={loading}
            />
            {errors.category && <small className="p-error">{errors.category}</small>}
          </div>

          <div className="field full-width">
            <label htmlFor="description" className="field-label">
              Description <span className="required">*</span>
            </label>
            <InputTextarea
              id="description"
              value={formData.description}
              onChange={(e) => handleFieldChange('description', e.target.value)}
              placeholder="Enter product description"
              rows={4}
              className={`w-full ${errors.description ? 'p-invalid' : ''}`}
              disabled={loading}
            />
            {errors.description && <small className="p-error">{errors.description}</small>}
          </div>

          <div className="field full-width">
            <label htmlFor="image" className="field-label">
              Image URL <span className="required">*</span>
            </label>
            <InputText
              id="image"
              value={formData.image}
              onChange={(e) => handleFieldChange('image', e.target.value)}
              placeholder="Enter image URL"
              className={`w-full ${errors.image ? 'p-invalid' : ''}`}
              disabled={loading}
            />
            {errors.image && <small className="p-error">{errors.image}</small>}
            {formData.image && isValidUrl(formData.image) && (
              <div className="image-preview">
                <img src={formData.image} alt="Preview" onError={(e) => {
                  e.currentTarget.style.display = 'none';
                }} />
              </div>
            )}
          </div>
        </div>
      </form>
    </Dialog>
  );
};

export default ProductForm;