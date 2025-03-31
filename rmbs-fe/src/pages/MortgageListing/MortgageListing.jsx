import React, { useEffect, useState } from 'react';
import { Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Dialog, DialogContent, DialogTitle, IconButton } from '@mui/material';
import { Link } from 'react-router-dom';
import DeleteIcon from '@mui/icons-material/Delete';
import CloseIcon from '@mui/icons-material/Close';

const MortgageList = () => {
  const [mortgages, setMortgages] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [creditRating, setCreditRating] = useState('');
  const [deleteConfirmationOpen, setDeleteConfirmationOpen] = useState(false);
  const [mortgageToDelete, setMortgageToDelete] = useState(null);

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

  const handleOpenDeleteDialog = (mortgage) => {
    setMortgageToDelete(mortgage);
    setDeleteConfirmationOpen(true);
  };

  const handleCloseDeleteDialog = () => {
    setDeleteConfirmationOpen(false);
    setMortgageToDelete(null);
  };

  const handleDeleteMortgage = () => {
    if (mortgageToDelete) {
      fetch(`http://127.0.0.1:8002/api/mortgages/${mortgageToDelete.id}`, {
        method: 'DELETE',
      })
        .then((response) => {
          if (response.ok) {
            handleCloseDeleteDialog();
            setMortgages(mortgages.filter((mortgage) => mortgage.id !== mortgageToDelete.id));
          }
        })
        .catch((error) => console.error('Error deleting mortgage:', error));
    }
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
            style={{ width: 'fit-content' }}
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
              <TableCell>Actions</TableCell>
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
                  <TableCell>
                    <IconButton onClick={() => handleOpenDeleteDialog(mortgage)}>
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={8} align="center">
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

      <Dialog open={deleteConfirmationOpen} onClose={handleCloseDeleteDialog}>
        <DialogTitle>
          Are you sure you want to delete this mortgage?
          <IconButton
            edge="end"
            onClick={handleCloseDeleteDialog}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <Button
            variant="contained"
            color="primary"
            onClick={handleDeleteMortgage}
            style={{ marginRight: '1rem' }}
          >
            Yes
          </Button>
          <Button variant="contained" onClick={handleCloseDeleteDialog}>
            No
          </Button>
        </DialogContent>
      </Dialog>

      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle>
          Final Credit Rating
          <IconButton
            edge="end"
            onClick={handleCloseDialog}
          >
            <CloseIcon />
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
