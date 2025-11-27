export const useQuoteStorage = () => {
    const saveQuote = (quoteData) => {
      try {
        const quotes = JSON.parse(localStorage.getItem('quotes')) || [];
        const newQuote = {
          id: Date.now().toString(),
          ...quoteData,
          createdAt: new Date().toISOString(),
          status: 'Active'
        };
        
        quotes.unshift(newQuote);
        localStorage.setItem('quotes', JSON.stringify(quotes));
        
        return { success: true, quote: newQuote };
      } catch (error) {
        console.error('Error saving quote to localStorage:', error);
        return { success: false, error };
      }
    };
  
    const getQuotes = () => {
      try {
        return JSON.parse(localStorage.getItem('quotes')) || [];
      } catch (error) {
        console.error('Error getting quotes from localStorage:', error);
        return [];
      }
    };
  
    const deleteQuote = (quoteId) => {
      try {
        const quotes = JSON.parse(localStorage.getItem('quotes')) || [];
        const updatedQuotes = quotes.filter(q => q.id !== quoteId);
        localStorage.setItem('quotes', JSON.stringify(updatedQuotes));
        return { success: true };
      } catch (error) {
        console.error('Error deleting quote from localStorage:', error);
        return { success: false, error };
      }
    };
  
    return {
      saveQuote,
      getQuotes,
      deleteQuote
    };
  };