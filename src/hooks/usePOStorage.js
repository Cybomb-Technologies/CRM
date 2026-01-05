export const usePOStorage = () => {
    const savePurchaseOrder = (poData) => {
      try {
        const purchaseOrders = JSON.parse(localStorage.getItem('purchaseOrders')) || [];
        
        let savedPO;
        const existingIndex = poData.id ? purchaseOrders.findIndex(p => p.id === poData.id) : -1;

        if (existingIndex >= 0) {
            // Update existing
            savedPO = {
                ...purchaseOrders[existingIndex],
                ...poData,
                updatedAt: new Date().toISOString()
            };
            purchaseOrders[existingIndex] = savedPO;
        } else {
            // Create New
            savedPO = {
                id: poData.id || Date.now().toString(),
                ...poData,
                createdAt: new Date().toISOString(),
                orderNumber: poData.orderNumber || `PO-${String(purchaseOrders.length + 1).padStart(3, '0')}`
            };
            purchaseOrders.unshift(savedPO);
        }
        
        localStorage.setItem('purchaseOrders', JSON.stringify(purchaseOrders));
        
        return { success: true, po: savedPO };
      } catch (error) {
        console.error('Error saving purchase order to localStorage:', error);
        return { success: false, error };
      }
    };
  
    const getPurchaseOrders = () => {
      try {
        return JSON.parse(localStorage.getItem('purchaseOrders')) || [];
      } catch (error) {
        console.error('Error getting purchase orders from localStorage:', error);
        return [];
      }
    };

    const getPurchaseOrder = (poId) => {
        try {
            const purchaseOrders = JSON.parse(localStorage.getItem('purchaseOrders')) || [];
            return purchaseOrders.find(p => p.id === poId) || null;
        } catch (error) {
            console.error('Error getting purchase order from localStorage:', error);
            return null;
        }
    };
  
    const deletePurchaseOrder = (poId) => {
      try {
        const purchaseOrders = JSON.parse(localStorage.getItem('purchaseOrders')) || [];
        const updatedPOs = purchaseOrders.filter(po => po.id !== poId);
        localStorage.setItem('purchaseOrders', JSON.stringify(updatedPOs));
        return { success: true };
      } catch (error) {
        console.error('Error deleting purchase order from localStorage:', error);
        return { success: false, error };
      }
    };
  
    return {
      savePurchaseOrder,
      getPurchaseOrders,
      getPurchaseOrder,
      deletePurchaseOrder
    };
  };