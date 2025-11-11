import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import { Plus, Filter, Search, MoreVertical } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useData, useToast } from '@/hooks';
import CreateProductDialog from '@/components/products/CreateProductDialog';
import { Badge } from '@/components/ui/badge';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { motion } from 'framer-motion';

const ProductsPage = () => {
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const { data, updateData, addDataItem } = useData();
  const { toast } = useToast();

  const onProductCreated = (product) => {
    addDataItem('products', product);
    setCreateDialogOpen(false);
  };
  
  const handleFilter = () => {
    toast({ title: "Filter", description: "🚧 Not implemented yet!" });
  };
  
  const handleDelete = (productId) => {
      const updatedProducts = data.products.filter(p => p.id !== productId);
      updateData('products', updatedProducts);
      toast({ title: "Product Deleted", description: "The product has been removed."});
  };

  return (
    <>
      <Helmet>
        <title>Products - CloudCRM</title>
        <meta name="description" content="Manage your product catalog" />
      </Helmet>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Products</h1>
            <p className="text-muted-foreground mt-1">Manage your product catalog and pricing</p>
          </div>
          <Button onClick={() => setCreateDialogOpen(true)} className="bg-blue-600 hover:bg-blue-700">
            <Plus className="w-4 h-4 mr-2" />
            New Product
          </Button>
        </div>

        <Card>
          <CardHeader>
            <div className="flex items-center space-x-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input placeholder="Search products..." className="pl-10" />
              </div>
              <Button variant="outline" onClick={handleFilter}>
                <Filter className="w-4 h-4 mr-2" />
                Filters
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
            {data.products.map((product, index) => (
                <motion.div
                    key={product.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                >
                <Card className="p-4 hover:shadow-md transition-shadow">
                    <div className="grid grid-cols-5 items-center">
                        <p className="font-semibold text-foreground col-span-2">{product.name}</p>
                        <p className="text-sm text-muted-foreground">{product.sku}</p>
                        <p className="font-medium text-foreground">${product.price.toFixed(2)}</p>
                        <div className="flex items-center justify-end space-x-2">
                           <Badge variant="secondary">{product.category}</Badge>
                           <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" size="icon"><MoreVertical className="w-4 h-4" /></Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                    <DropdownMenuItem>Edit</DropdownMenuItem>
                                    <DropdownMenuItem onClick={() => handleDelete(product.id)} className="text-red-500">Delete</DropdownMenuItem>
                                </DropdownMenuContent>
                           </DropdownMenu>
                        </div>
                    </div>
                </Card>
                </motion.div>
            ))}
            </div>
          </CardContent>
        </Card>

        <CreateProductDialog open={createDialogOpen} onOpenChange={setCreateDialogOpen} onProductCreated={onProductCreated} />
      </div>
    </>
  );
};

export default ProductsPage;