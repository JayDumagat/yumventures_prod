
import { Link, useNavigate } from 'react-router-dom';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import  useAuthStore  from '../stores/useAuthStore';
import { toast } from 'react-toastify';
import { LoaderCircle } from 'lucide-react';
const Register = () => {
  const { register } = useAuthStore();
  const navigate = useNavigate();
  const formik = useFormik({
    initialValues: {
      firstName: '',
      lastName: '',
      email: '',
      username: '',
      password: '',
      confirmPassword: '',
    },
    validationSchema: Yup.object({
      firstName: Yup.string().required('First name is required'),
      lastName: Yup.string().required('Last name is required'),
      email: Yup.string().email('Invalid email address').required('Email is required'),
      username: Yup.string().min(3).required('Username is required'),
      password: Yup.string().min(8, '8+ characters required').required('Password is required'),
      confirmPassword: Yup.string()
        .oneOf([Yup.ref('password')], 'Passwords must match')
        .required('Please confirm your password'),
    }),
    onSubmit: async (values, { setSubmitting }) => {
      try {
        setSubmitting(true);
        const isRegistered = await register(values);
        if (isRegistered) {
          toast.success("Registration successful!");
          setTimeout(() => {
            navigate("/login");
          }, 2000);
        } else {
          toast.error("Registration failed");
        }
      } catch (error) {
        toast.error("An error occurred during registration", error.message);
      }
    },
  });

  const getInputClasses = (field) => {
    const hasError = formik.touched[field] && formik.errors[field];
    const isValid = formik.touched[field] && !formik.errors[field];
    return [
      'py-2 px-4 w-full sm:text-sm',
      'dark:bg-neutral-900 dark:border-neutral-700 dark:text-neutral-400 dark:placeholder-neutral-500',
      'focus:outline-none',
      isValid && 'border-teal-500 ring-1 ring-teal-500 focus:ring-teal-500',
      hasError && 'border-red-500 ring-1 ring-red-500 focus:ring-red-500',
      !hasError && !isValid && 'border-gray-200',
      'rounded',
    ]
      .filter(Boolean)
      .join(' ');
  };

  const isButtonDisabled =
    !formik.dirty || // No changes yet
    !formik.isValid || // Still has validation errors
    formik.isSubmitting; // Form is submitting
  return (
    <div className="flex justify-center items-center w-full h-screen overflow-auto bg-gray-100">
      <div className="shrink-0 grow max-w-lg mt-7 bg-white border border-gray-200 rounded-xl shadow-2xs dark:bg-neutral-900 dark:border-neutral-700">
        <div className="p-4 sm:p-7">
          <div className="text-center">
            <h1 className="block text-2xl font-bold text-gray-800 dark:text-white">Sign up</h1>
            <p className="mt-2 text-sm text-gray-600 dark:text-neutral-400">
              Already have an account?{' '}
              <Link to="/login" className="text-blue-600 hover:underline font-medium dark:text-blue-500">
                Sign in here
              </Link>
            </p>
          </div>

          <div className="mt-5">
            <form onSubmit={formik.handleSubmit} noValidate>
              <div className="grid gap-y-4">

                {/* Full Name */}
                <div>
                  <label htmlFor="firstName" className="block text-sm mb-2 dark:text-white">
                    Full Name
                  </label>
                  <div className="sm:flex gap-2">
                    <div className="w-full flex flex-col gap-1">
                      <input
                        type="text"
                        name="firstName"
                        placeholder="First Name"
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        value={formik.values.firstName}
                        className={getInputClasses('firstName')}
                      />
                      {formik.touched.firstName && formik.errors.firstName && (
                        <p className="text-xs text-red-600">{formik.errors.firstName}</p>
                      )}
                    </div>
                    <div className="w-full flex flex-col gap-1">
                      <input
                        type="text"
                        name="lastName"
                        placeholder="Last Name"
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        value={formik.values.lastName}
                        className={getInputClasses('lastName')}
                      />
                      {formik.touched.lastName && formik.errors.lastName && (
                        <p className="text-xs text-red-600">{formik.errors.lastName}</p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Email */}
                <div>
                  <label htmlFor="email" className="block text-sm mb-2 dark:text-white">
                    Email address
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    className={getInputClasses('email')}
                    {...formik.getFieldProps('email')}
                  />
                  {formik.touched.email && formik.errors.email && (
                    <p className="text-xs text-red-600 mt-1">{formik.errors.email}</p>
                  )}
                </div>

                {/* Username */}
                <div>
                  <label htmlFor="username" className="block text-sm mb-2 dark:text-white">
                    Username
                  </label>
                  <input
                    type="text"
                    id="username"
                    name="username"
                    className={getInputClasses('username')}
                    {...formik.getFieldProps('username')}
                  />
                  {formik.touched.username && formik.errors.username && (
                    <p className="text-xs text-red-600 mt-1">{formik.errors.username}</p>
                  )}
                </div>

                {/* Password */}
                <div>
                  <label htmlFor="password" className="block text-sm mb-2 dark:text-white">
                    Password
                  </label>
                  <input
                    type="password"
                    id="password"
                    name="password"
                    className={getInputClasses('password')}
                    {...formik.getFieldProps('password')}
                  />
                  {formik.touched.password && formik.errors.password && (
                    <p className="text-xs text-red-600 mt-1">{formik.errors.password}</p>
                  )}
                </div>

                {/* Confirm Password */}
                <div>
                  <label htmlFor="confirmPassword" className="block text-sm mb-2 dark:text-white">
                    Confirm Password
                  </label>
                  <input
                    type="password"
                    id="confirmPassword"
                    name="confirmPassword"
                    className={getInputClasses('confirmPassword')}
                    {...formik.getFieldProps('confirmPassword')}
                  />
                  {formik.touched.confirmPassword && formik.errors.confirmPassword && (
                    <p className="text-xs text-red-600 mt-1">{formik.errors.confirmPassword}</p>
                  )}
                </div>

                {/* Submit */}
                <button
                  type="submit"
                  className="w-full py-3 px-4 inline-flex justify-center items-center gap-x-2 text-sm font-medium rounded-lg border border-transparent bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50"
                  disabled={isButtonDisabled}
                >
                 {formik.isSubmitting ? (
                  <LoaderCircle className="animate-spin h-5 w-5 text-white" />
                ) : (
                  <p>Create an account</p>
                )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
