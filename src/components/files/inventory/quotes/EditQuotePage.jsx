// src/pages/files/inventory/quotes/EditQuotePage.jsx
import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowBack } from '@mui/icons-material';
import { Button, Box } from '@mui/material';
import CreateQuote from '@/components/files/inventory/quotes/CreateQuote';
import { useData } from '@/hooks';

const EditQuotePage = () => {
  const { quoteId } = useParams();
  const navigate = useNavigate();
  const { data, updateData } = useData();

  const quote = (data.quotes || []).find(q => q.id === quoteId);

  const handleQuoteUpdated = (updatedQuote) => {
    const updatedQuotes = (data.quotes || []).map(q => 
      q.id === quoteId ? updatedQuote : q
    );
    updateData('quotes', updatedQuotes);
    navigate('/quotes');
  };

  const handleBack = () => {
    navigate('/quotes');
  };

  if (!quote) {
    return (
      <Box>
        <Button
          startIcon={<ArrowBack />}
          onClick={handleBack}
          sx={{ mb: 3 }}
        >
          Back to Quotes
        </Button>
        <div>Quote not found</div>
      </Box>
    );
  }

  return (
    <Box>
      <Button
        startIcon={<ArrowBack />}
        onClick={handleBack}
        sx={{ mb: 3 }}
      >
        Back to Quotes
      </Button>
      <CreateQuote 
        initialData={quote} 
        onQuoteCreated={handleQuoteUpdated} 
      />
    </Box>
  );
};

export default EditQuotePage;