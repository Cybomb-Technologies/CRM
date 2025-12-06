// src/pages/files/inventory/quotes/ViewQuotePage.jsx
import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowBack, Edit } from '@mui/icons-material';
import { Button, Box, IconButton, Stack } from '@mui/material';
import { useData } from '@/hooks';
import QuoteDetails from '@/components/files/inventory/quotes/QuoteDetails';

const ViewQuotePage = () => {
  const { quoteId } = useParams();
  const navigate = useNavigate();
  const { data } = useData();

  const quote = (data.quotes || []).find(q => q.id === quoteId);

  const handleBack = () => {
    navigate('/quotes');
  };

  const handleEdit = () => {
    navigate(`/quotes/edit/${quoteId}`);
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
      <Stack direction="row" justifyContent="space-between" alignItems="center" mb={3}>
        <Button
          startIcon={<ArrowBack />}
          onClick={handleBack}
        >
          Back to Quotes
        </Button>
        <IconButton onClick={handleEdit} color="primary">
          <Edit />
        </IconButton>
      </Stack>
      <QuoteDetails quote={quote} />
    </Box>
  );
};

export default ViewQuotePage;