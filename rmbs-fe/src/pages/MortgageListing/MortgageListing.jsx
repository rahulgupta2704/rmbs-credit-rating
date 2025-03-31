import React, { useEffect, useState } from 'react';
import { Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Dialog, DialogContent, DialogTitle, IconButton } from '@mui/material';
import { Link } from 'react-router-dom';

const MortgageList = () => {
  const [mortgages, setMortgages] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [creditRating, setCreditRating] = useState('');

  useEffect(() => {
    fetch('http://localhost:8002/api/mortgages')
      .then((response) => response.json())
      .then((data) => setMortgages(data.payload.mortgages))
      .catch((error) => console.error('Error fetching mortgages:', error));
  }, []);

  const calculateCreditRating = () => {
    const mortgageData = mortgages.map(mortgage => ({
      credit_score: mortgage.credit_score,
      loan_amount: mortgage.loan_amount,
      property_value: mortgage.property_value,
      annual_income: mortgage.annual_income,
      debt_amount: mortgage.debt_amount,
      loan_type: mortgage.loan_type,
      property_type: mortgage.property_type,
    }));

    fetch('http://127.0.0.1:8002/api/mortgages/final_credit_rating', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(mortgageData),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.success) {
          setCreditRating(data.payload.final_credit_rating);
          setOpenDialog(true);
        }
      })
      .catch((error) => console.error('Error calculating credit rating:', error));
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setCreditRating('');
  };

  return (
    <div style={{ padding: '2rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h1 className='form-field'>Mortgage List</h1>
        <div className='form-field'>
          <Button
            variant="contained"
            color="primary"
            onClick={calculateCreditRating}
          >
            Calculate Credit Rating
          </Button>
        </div>
      </div>

      <TableContainer component={Paper} style={{ marginTop: '2rem' }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Credit Score</TableCell>
              <TableCell>Loan Amount</TableCell>
              <TableCell>Property Value</TableCell>
              <TableCell>Annual Income</TableCell>
              <TableCell>Debt Amount</TableCell>
              <TableCell>Loan Type</TableCell>
              <TableCell>Property Type</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {mortgages.length > 0 ? (
              mortgages.map((mortgage, index) => (
                <TableRow key={index}>
                  <TableCell>{mortgage.credit_score}</TableCell>
                  <TableCell>{mortgage.loan_amount}</TableCell>
                  <TableCell>{mortgage.property_value}</TableCell>
                  <TableCell>{mortgage.annual_income}</TableCell>
                  <TableCell>{mortgage.debt_amount}</TableCell>
                  <TableCell>{mortgage.loan_type}</TableCell>
                  <TableCell>{mortgage.property_type}</TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={7} align="center">
                  No mortgages available.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <Button
        variant="contained"
        color="primary"
        component={Link}
        to="/create"
        style={{ marginTop: '2rem' }}
      >
        Add Mortgage
      </Button>

      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle>
          Final Credit Rating
          <IconButton
            edge="end"
            color="inherit"
            onClick={handleCloseDialog}
            aria-label="close"
            style={{ position: 'absolute', right: 8, top: 8 }}
          >
            X
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <h2>{creditRating}</h2>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default MortgageList;
