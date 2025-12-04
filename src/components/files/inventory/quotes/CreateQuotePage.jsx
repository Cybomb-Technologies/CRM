// src/pages/files/inventory/quotes/CreateQuotePage.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowBack } from '@mui/icons-material';
import { Button, Box } from '@mui/material';
import CreateQuoteForm from '@/components/files/inventory/quotes/CreateQuoteForm';
import { useData } from '@/hooks';

const CreateQuotePage = () => {
  const navigate = useNavigate();
  const { data, updateData } = useData();

  const handleQuoteCreated = (newQuote) => {
    const updatedQuotes = [...(data.quotes || []), newQuote];
    updateData('quotes', updatedQuotes);
    navigate('/quotes');
  };

  const handleBack = () => {
    navigate('/quotes');
  };

  return (
    <Box>
      <Button
        startIcon={<ArrowBack />}
        onClick={handleBack}
        sx={{ mb: 3 }}
      >
        Back to Quotes
      </Button>
      <CreateQuoteForm onQuoteCreated={handleQuoteCreated} />
    </Box>
  );
};

export default CreateQuotePage;