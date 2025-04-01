import { Form, Formik } from 'formik';
import * as Yup from 'yup';
import { TextField, Button, MenuItem, Select, InputLabel, FormControl, FormHelperText } from '@mui/material';
import { apiBaseUrl } from '../../utility/constants';

const CreateMortgage = () => {
  const validationSchema = Yup.object().shape({
    creditScore: Yup.number().required('Credit Score is required').positive().integer(),
    loanAmount: Yup.number().required('Loan Amount is required').positive(),
    propertyValue: Yup.number().required('Property Value is required').positive(),
    annualIncome: Yup.number().required('Annual Income is required').positive(),
    debtAmount: Yup.number().required('Debt Amount is required').positive(),
    loanType: Yup.string().required('Loan Type is required').oneOf(['fixed', 'adjustable']),
    propertyType: Yup.string().required('Property Type is required').oneOf(['single_family', 'condo']),
  });

  return (
    <div className="form-container">
      <h1>Create Mortgage</h1>
      <Formik
        initialValues={{
          creditScore: '',
          loanAmount: '',
          propertyValue: '',
          annualIncome: '',
          debtAmount: '',
          loanType: '',
          propertyType: ''
        }}
        onSubmit={(values) => {
          fetch(`${apiBaseUrl}/mortgages/create`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              credit_score: values.creditScore,
              loan_amount: values.loanAmount,
              property_value: values.propertyValue,
              annual_income: values.annualIncome,
              debt_amount: values.debtAmount,
              loan_type: values.loanType,
              property_type: values.propertyType,
            }),
          })
            .then((response) => response.json())
            .then((data) => {
              console.log('Mortgage created successfully', data);
            })
            .catch((error) => {
              console.error('Error creating mortgage:', error);
            });
        }}
        validationSchema={validationSchema}
      >
        {({ values, handleChange, handleBlur, touched, errors }) => (
          <Form>
            {/* First row */}
            <div className="form-row">
              <div className="form-field">
                <TextField
                  fullWidth
                  label="Credit Score"
                  name="creditScore"
                  value={values.creditScore}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={touched.creditScore && Boolean(errors.creditScore)}
                  helperText={touched.creditScore && errors.creditScore}
                  variant="outlined"
                />
              </div>

              <div className="form-field">
                <TextField
                  fullWidth
                  label="Loan Amount"
                  name="loanAmount"
                  type="number"
                  value={values.loanAmount}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={touched.loanAmount && Boolean(errors.loanAmount)}
                  helperText={touched.loanAmount && errors.loanAmount}
                  variant="outlined"
                />
              </div>
            </div>

            {/* Second row */}
            <div className="form-row">
              <div className="form-field">
                <TextField
                  fullWidth
                  label="Property Value"
                  name="propertyValue"
                  type="number"
                  value={values.propertyValue}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={touched.propertyValue && Boolean(errors.propertyValue)}
                  helperText={touched.propertyValue && errors.propertyValue}
                  variant="outlined"
                />
              </div>

              <div className="form-field">
                <TextField
                  fullWidth
                  label="Annual Income"
                  name="annualIncome"
                  type="number"
                  value={values.annualIncome}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={touched.annualIncome && Boolean(errors.annualIncome)}
                  helperText={touched.annualIncome && errors.annualIncome}
                  variant="outlined"
                />
              </div>
            </div>

            {/* Third row */}
            <div className="form-row">
              <div className="form-field">
                <TextField
                  fullWidth
                  label="Debt Amount"
                  name="debtAmount"
                  type="number"
                  value={values.debtAmount}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={touched.debtAmount && Boolean(errors.debtAmount)}
                  helperText={touched.debtAmount && errors.debtAmount}
                  variant="outlined"
                />
              </div>

              <div className="form-field">
                <FormControl fullWidth error={touched.loanType && Boolean(errors.loanType)}>
                  <InputLabel>Loan Type</InputLabel>
                  <Select
                    name="loanType"
                    value={values.loanType}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    label="Loan Type"
                  >
                    <MenuItem value="fixed">Fixed</MenuItem>
                    <MenuItem value="adjustable">Adjustable</MenuItem>
                  </Select>
                  <FormHelperText>{touched.loanType && errors.loanType}</FormHelperText>
                </FormControl>
              </div>
            </div>

            {/* Fourth row */}
            <div className="form-row">
              <div className="form-field">
                <FormControl fullWidth error={touched.propertyType && Boolean(errors.propertyType)}>
                  <InputLabel>Property Type</InputLabel>
                  <Select
                    name="propertyType"
                    value={values.propertyType}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    label="Property Type"
                  >
                    <MenuItem value="single_family">Single Family</MenuItem>
                    <MenuItem value="condo">Condo</MenuItem>
                  </Select>
                  <FormHelperText>{touched.propertyType && errors.propertyType}</FormHelperText>
                </FormControl>
              </div>

              <div className="form-field">
                <Button type="submit" variant="contained" color="primary" fullWidth>
                  Create Mortgage
                </Button>
              </div>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default CreateMortgage;
