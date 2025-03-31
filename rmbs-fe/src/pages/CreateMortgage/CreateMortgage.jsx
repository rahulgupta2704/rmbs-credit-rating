import { ErrorMessage, Field, Form, Formik } from 'formik';
import * as Yup from 'yup';

const CreateMortgage = () => {
  const validationSchema = Yup.object().shape({
    creditScore: Yup.number()
      .required('Credit Score is required')
  });
  return (
    <div>
      <h1>Create Mortgage</h1>
      <p>This is the Create Mortgage page.</p>
      <Formik
        initialValues={{}}
        onSubmit={(values) => {
          console.log(values);
        }}
        validationSchema={validationSchema}
      >
        <Form>
          <div>
            <Field name="creditScore" placeholder="Credit Score" />
            <ErrorMessage name="creditScore" component="div" style={{ color: 'red' }} />
          </div>
          <button type="submit">Create Mortgage</button>
        </Form>
      </Formik>
    </div>
  );
}

export default CreateMortgage;