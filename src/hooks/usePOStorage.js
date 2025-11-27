export const usePOStorage = () => {
    const savePurchaseOrder = (poData) => {
      try {
        const purchaseOrders = JSON.parse(localStorage.getItem('purchaseOrders')) || [];
        const newPO = {
          id: Date.now().toString(),
          ...poData,
          createdAt: new Date().toISOString(),
          orderNumber: `PO-${String(purchaseOrders.length + 1).padStart(3, '0')}`
        };
        
        purchaseOrders.unshift(newPO);
        localStorage.setItem('purchaseOrders', JSON.stringify(purchaseOrders));
        
        return { success: true, po: newPO };
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
      deletePurchaseOrder
    };
  };