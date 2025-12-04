// src/components/files/inventory/quotes/QuoteDetails.jsx
import React from 'react';
import {
  Box,
  Typography,
  Paper,
  Grid,
  Button,
  Divider,
  Chip,
  Stack
} from '@mui/material';
import {
  Download,
  Edit,
  Print,
  Email,
  ArrowBack
} from '@mui/icons-material';
import { format } from 'date-fns';

const QuoteDetails = ({ quote, onEdit }) => {
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount || 0);
  };

  return (
    <Box>
      {/* Action Buttons */}
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Button
          startIcon={<ArrowBack />}
          onClick={() => window.history.back()}
        >
          Back
        </Button>
        <Stack direction="row" spacing={1}>
          <Button startIcon={<Email />} variant="outlined">
            Send
          </Button>
          <Button startIcon={<Download />} variant="outlined">
            Download PDF
          </Button>
          <Button startIcon={<Print />} variant="outlined">
            Print
          </Button>
          <Button
            startIcon={<Edit />}
            variant="contained"
            onClick={onEdit}
          >
            Edit
          </Button>
        </Stack>
      </Box>

      {/* Quote Header */}
      <Paper sx={{ p: 3, mb: 3 }}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Typography variant="h4" gutterBottom>
              Quote #{quote.quoteNumber}
            </Typography>
            <Stack direction="row" spacing={2} alignItems="center">
              <Chip 
                label={quote.status || 'Draft'} 
                color={
                  quote.status === 'accepted' ? 'success' :
                  quote.status === 'rejected' ? 'error' :
                  quote.status === 'sent' ? 'info' :
                  'default'
                }
              />
              <Typography variant="body2" color="textSecondary">
                Created: {format(new Date(quote.createdAt || new Date()), 'MMM dd, yyyy')}
              </Typography>
              <Typography variant="body2" color="textSecondary">
                Expires: {format(new Date(quote.expiryDate), 'MMM dd, yyyy')}
              </Typography>
            </Stack>
          </Grid>
          <Grid item xs={12} md={6}>
            <Paper variant="outlined" sx={{ p: 2 }}>
              <Typography variant="subtitle2" gutterBottom>
                Bill To:
              </Typography>
              <Typography variant="body1">{quote.accountName}</Typography>
              {quote.contactName && (
                <Typography variant="body2" color="textSecondary">
                  Contact: {quote.contactName}
                </Typography>
              )}
              {quote.email && (
                <Typography variant="body2" color="textSecondary">
                  Email: {quote.email}
                </Typography>
              )}
            </Paper>
          </Grid>
        </Grid>
      </Paper>

      {/* Items Table */}
      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" gutterBottom mb={2}>
          Items
        </Typography>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Item</TableCell>
                <TableCell>Description</TableCell>
                <TableCell align="right">Quantity</TableCell>
                <TableCell align="right">Price</TableCell>
                <TableCell align="right">Total</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {quote.items?.map((item, index) => (
                <TableRow key={index}>
                  <TableCell>{item.name}</TableCell>
                  <TableCell>{item.description}</TableCell>
                  <TableCell align="right">{item.quantity}</TableCell>
                  <TableCell align="right">{formatCurrency(item.price)}</TableCell>
                  <TableCell align="right">{formatCurrency(item.total || item.quantity * item.price)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      {/* Summary */}
      <Paper sx={{ p: 3 }}>
        <Grid container justifyContent="flex-end">
          <Grid item xs={12} md={4}>
            <Box display="flex" justifyContent="space-between" mb={1}>
              <Typography>Subtotal:</Typography>
              <Typography>{formatCurrency(quote.subtotal)}</Typography>
            </Box>
            <Box display="flex" justifyContent="space-between" mb={1}>
              <Typography>Tax:</Typography>
              <Typography>{formatCurrency(quote.tax)}</Typography>
            </Box>
            <Divider sx={{ my: 2 }} />
            <Box display="flex" justifyContent="space-between">
              <Typography variant="h6">Total:</Typography>
              <Typography variant="h6">{formatCurrency(quote.total)}</Typography>
            </Box>
          </Grid>
        </Grid>
      </Paper>

      {/* Notes */}
      {quote.notes && (
        <Paper sx={{ p: 3, mt: 3 }}>
          <Typography variant="h6" gutterBottom>
            Notes
          </Typography>
          <Typography variant="body2" color="textSecondary">
            {quote.notes}
          </Typography>
        </Paper>
      )}
    </Box>
  );
};

export default QuoteDetails;