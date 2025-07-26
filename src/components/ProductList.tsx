// src/components/ProductList.tsx
import React, { useState } from 'react';
import { Card } from 'primereact/card';
import { Button } from 'primereact/button';
import { ProgressSpinner } from 'primereact/progressspinner';
import { ConfirmDialog, confirmDialog } from 'primereact/confirmdialog';
import { Toast } from 'primereact/toast';
import { Badge } from 'primereact/badge';
import { Skeleton } from 'primereact/skeleton';
import { useRef } from 'react';
import { Product } from '../types';
import { useProducts } from '../hooks/useProducts';
import ProductForm from './ProductForm';
import './ProductList.css';

interface ProductListProps {
  showAddForm: boolean;
  onHideAddForm: () => void;
  onResetData: (resetFn: () => void) => void;
}

const ProductList: React.FC<ProductListProps> = ({ showAddForm, onHideAddForm, onResetData }) => {
  const {
    products,
    loading,
    error,
    pagination,
    addProduct,
    updateProduct,
    deleteProduct,
    loadMore,
    clearLocalData,
  } = useProducts();

  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [formLoading, setFormLoading] = useState(false);
  const toast = useRef<Toast>(null);

  // Pass reset function to parent if provided
  React.useEffect(() => {
    onResetData(() => {
      clearLocalData();
      toast.current?.show({
        severity: 'info',
        summary: 'Data Reset',
        detail: 'All local changes have been cleared',
        life: 3000,
      });
    });
  }, [onResetData, clearLocalData]);

  const handleAddProduct = async (productData: any) => {
    setFormLoading(true);
    const success = await addProduct(productData);
    
    if (success) {
      toast.current?.show({
        severity: 'success',
        summary: 'Success',
        detail: 'Product added successfully!',
        life: 3000,
      });
    } else {
      toast.current?.show({
        severity: 'error',
        summary: 'Error',
        detail: 'Failed to add product',
        life: 5000,
      });
    }
    
    setFormLoading(false);
    return success;
  };

  const handleUpdateProduct = async (productData: any) => {
    if (!editingProduct) return false;
    
    setFormLoading(true);
    const success = await updateProduct(editingProduct.id, productData);
    
    if (success) {
      toast.current?.show({
        severity: 'success',
        summary: 'Success',
        detail: 'Product updated successfully!',
        life: 3000,
      });
      setEditingProduct(null);
    } else {
      toast.current?.show({
        severity: 'error',
        summary: 'Error',
        detail: 'Failed to update product',
        life: 5000,
      });
    }
    
    setFormLoading(false);
    return success;
  };

  const handleEditClick = (product: Product) => {
    // Use requestAnimationFrame to ensure clean execution
    requestAnimationFrame(() => {
      setEditingProduct(product);
    });
  };

  const handleDeleteClick = (product: Product) => {
    // Use requestAnimationFrame to prevent scroll jumping
    requestAnimationFrame(() => {
      confirmDialog({
        message: `Are you sure you want to delete "${product.title}"?`,
        header: 'Delete Confirmation',
        icon: 'pi pi-exclamation-triangle',
        blockScroll: false,
        accept: async () => {
          const success = await deleteProduct(product.id);
          
          if (success) {
            toast.current?.show({
              severity: 'success',
              summary: 'Success',
              detail: 'Product deleted successfully!',
              life: 3000,
            });
          } else {
            toast.current?.show({
              severity: 'error',
              summary: 'Error',
              detail: 'Failed to delete product',
              life: 5000,
            });
          }
        },
        acceptClassName: 'p-button-danger',
        acceptLabel: 'Yes, Delete',
        rejectLabel: 'Cancel',
      });
    });
  };

  const ProductCard = ({ product }: { product: Product }) => {
    const cardHeader = (
      <div className="product-image-container">
        <img
          src={product.image}
          alt={product.title}
          className="product-image"
          onError={(e) => {
            e.currentTarget.src = 'https://via.placeholder.com/300x200?text=No+Image';
          }}
        />
        <Badge
          value={product.category}
          className="category-badge"
        />
      </div>
    );

    const cardFooter = (
      <div className="product-actions">
        <Button
          icon="pi pi-pencil"
          label="Edit"
          className="p-button-outlined p-button-info product-edit-btn"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            handleEditClick(product);
          }}
          disabled={loading}
          type="button"
          unstyled={false}
        />
        <Button
          icon="pi pi-trash"
          label="Delete"
          className="p-button-outlined p-button-danger product-delete-btn"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            handleDeleteClick(product);
          }}
          disabled={loading}
          type="button"
          unstyled={false}
        />
      </div>
    );

    return (
      <Card
        header={cardHeader}
        footer={cardFooter}
        className="product-card"
      >
        <div className="product-content">
          <h3 className="product-title">{product.title}</h3>
          <p className="product-description">
            {product.description.length > 100
              ? `${product.description.substring(0, 100)}...`
              : product.description}
          </p>
          <div className="product-price">
            <span className="price-label">Price:</span>
            <span className="price-value">${product.price.toFixed(2)}</span>
          </div>
          {product.rating && (
            <div className="product-rating">
              <i className="pi pi-star-fill" />
              <span>{product.rating.rate.toFixed(1)} ({product.rating.count} reviews)</span>
            </div>
          )}
        </div>
      </Card>
    );
  };

  const LoadingSkeleton = () => (
    <Card className="product-card">
      <div className="product-image-container">
        <Skeleton width="100%" height="200px" />
      </div>
      <div className="product-content">
        <Skeleton width="80%" height="1.5rem" className="mb-2" />
        <Skeleton width="100%" height="4rem" className="mb-3" />
        <Skeleton width="60%" height="1.2rem" className="mb-2" />
        <div className="product-actions">
          <Skeleton width="80px" height="2.5rem" />
          <Skeleton width="80px" height="2.5rem" />
        </div>
      </div>
    </Card>
  );

  if (error) {
    return (
      <div className="error-container">
        <div className="error-content">
          <i className="pi pi-exclamation-triangle error-icon" />
          <h3>Error Loading Products</h3>
          <p>{error}</p>
          <Button
            label="Retry"
            icon="pi pi-refresh"
            onClick={() => window.location.reload()}
            className="p-button-outlined"
          />
        </div>
      </div>
    );
  }

  return (
    <div className="product-list-container">
      <Toast ref={toast} />
      <ConfirmDialog />

      {/* Products Grid */}
      <div className="products-grid">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
        
        {/* Loading Skeletons */}
        {loading && products.length === 0 && (
          <>
            {Array.from({ length: 6 }).map((_, index) => (
              <LoadingSkeleton key={index} />
            ))}
          </>
        )}
      </div>

      {/* Empty State */}
      {!loading && products.length === 0 && (
        <div className="empty-state">
          <i className="pi pi-shopping-bag empty-icon" />
          <h3>No Products Found</h3>
          <p>Start by adding your first product</p>
        </div>
      )}

      {/* Load More Button */}
      {pagination.hasMore && products.length > 0 && (
        <div className="load-more-container">
          <Button
            label={loading ? undefined : "Load More Products"}
            icon={loading ? undefined : "pi pi-plus"}
            className="load-more-button"
            onClick={loadMore}
            disabled={loading}
          >
            {loading && <ProgressSpinner style={{ width: '20px', height: '20px' }} strokeWidth="4" />}
          </Button>
        </div>
      )}

      {/* Add Product Form */}
      <ProductForm
        visible={showAddForm}
        onHide={onHideAddForm}
        onSubmit={handleAddProduct}
        loading={formLoading}
      />

      {/* Edit Product Form */}
      <ProductForm
        visible={!!editingProduct}
        onHide={() => setEditingProduct(null)}
        onSubmit={handleUpdateProduct}
        product={editingProduct}
        loading={formLoading}
      />
    </div>
  );
};

export default ProductList;