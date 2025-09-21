import React, { useState, useEffect } from 'react';
import { useApp } from '../../contexts/AppContext';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { X, Upload, Image } from 'lucide-react';
import { Product } from '../../contexts/AppContext';
import { toast } from 'sonner';

interface ProductFormProps {
  productId?: string | null;
  onClose: () => void;
}

export function ProductForm({ productId, onClose }: ProductFormProps) {
  const { state, dispatch } = useApp();
  const { currentUser, products } = state;
  
  const existingProduct = productId ? products.find(p => p.id === productId) : null;
  
  const [formData, setFormData] = useState({
    name: '',
    category: 'produce' as Product['category'],
    price: '',
    unit: '',
    description: '',
    stock: '',
    location: currentUser?.address || '',
    imageFile: null as File | null
  });

  useEffect(() => {
    if (existingProduct) {
      setFormData({
        name: existingProduct.name,
        category: existingProduct.category,
        price: existingProduct.price.toString(),
        unit: existingProduct.unit,
        description: existingProduct.description,
        stock: existingProduct.stock.toString(),
        location: existingProduct.location,
        imageFile: null
      });
    }
  }, [existingProduct]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Check file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast.error('Image size should be less than 5MB');
        return;
      }
      
      // Check file type
      if (!file.type.startsWith('image/')) {
        toast.error('Please select a valid image file');
        return;
      }
      
      setFormData({
        ...formData,
        imageFile: file
      });
      toast.success('Image selected successfully!');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const price = parseFloat(formData.price);
    const stock = parseInt(formData.stock);
    
    if (isNaN(price) || isNaN(stock)) {
      toast.error('Please enter valid numbers for price and stock');
      return;
    }

    const productData: Product = {
      id: existingProduct?.id || `product_${Date.now()}`,
      farmerId: currentUser!.id,
      farmerName: currentUser!.farmName || currentUser!.name,
      name: formData.name,
      category: formData.category,
      price: price,
      unit: formData.unit,
      description: formData.description,
      image: formData.imageFile ? URL.createObjectURL(formData.imageFile) : existingProduct?.image || '',
      stock: stock,
      location: formData.location
    };

    if (existingProduct) {
      dispatch({ type: 'UPDATE_PRODUCT', payload: productData });
      toast.success('Product updated successfully!');
    } else {
      dispatch({ type: 'ADD_PRODUCT', payload: productData });
      toast.success('Product added successfully!');
    }

    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-md max-h-[90vh] overflow-y-auto">
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>
              {existingProduct ? 'Edit Product' : 'Add New Product'}
            </CardTitle>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Product Name</Label>
              <Input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="Enter product name"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <Select
                value={formData.category}
                onValueChange={(value) => handleSelectChange('category', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="produce">Produce</SelectItem>
                  <SelectItem value="dairy">Dairy</SelectItem>
                  <SelectItem value="livestock">Livestock</SelectItem>
                  <SelectItem value="grains">Grains</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="price">Price</Label>
                <Input
                  id="price"
                  name="price"
                  type="number"
                  step="0.01"
                  value={formData.price}
                  onChange={handleInputChange}
                  placeholder="0.00"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="unit">Unit</Label>
                <Select
                  value={formData.unit}
                  onValueChange={(value) => handleSelectChange('unit', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select unit" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="per kg">per kg</SelectItem>
                    <SelectItem value="per lb">per lb</SelectItem>
                    <SelectItem value="per piece">per piece</SelectItem>
                    <SelectItem value="per dozen">per dozen</SelectItem>
                    <SelectItem value="per liter">per liter</SelectItem>
                    <SelectItem value="per gallon">per gallon</SelectItem>
                    <SelectItem value="per bundle">per bundle</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="stock">Stock Quantity</Label>
              <Input
                id="stock"
                name="stock"
                type="number"
                value={formData.stock}
                onChange={handleInputChange}
                placeholder="Enter stock quantity"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="location">Location</Label>
              <Input
                id="location"
                name="location"
                value={formData.location}
                onChange={handleInputChange}
                placeholder="Farm location"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="image">Product Image</Label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                {formData.imageFile ? (
                  <div className="space-y-2">
                    <Image className="h-8 w-8 mx-auto text-green-600" />
                    <p className="text-sm text-green-600">{formData.imageFile.name}</p>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => setFormData({...formData, imageFile: null})}
                    >
                      Remove Image
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <Upload className="h-8 w-8 mx-auto text-gray-400" />
                    <p className="text-sm text-gray-600">
                      Click to upload product image (Max 5MB)
                    </p>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="hidden"
                      id="imageInput"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => document.getElementById('imageInput')?.click()}
                    >
                      Choose Image
                    </Button>
                  </div>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="Describe your product..."
                rows={3}
                required
              />
            </div>

            <div className="flex space-x-2 pt-4">
              <Button type="submit" className="flex-1">
                {existingProduct ? 'Update Product' : 'Add Product'}
              </Button>
              <Button type="button" variant="outline" onClick={onClose}>
                Cancel
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}