import * as Yup from 'yup';

const categoryValidationSchema = Yup.object().shape({
  name: Yup.string()
    .required('Name is required')
    .min(3, 'Name must be at least 3 characters long')
    .max(50, 'Name must be at most 50 characters long'),
  description: Yup.string()
    .optional()
    .min(10, 'Description must be at least 10 characters long')
    .max(200, 'Description must be at most 200 characters long'),
});

export default categoryValidationSchema;