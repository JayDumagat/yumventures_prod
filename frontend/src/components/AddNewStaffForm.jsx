import { Formik, Form, Field, ErrorMessage } from "formik";
import { toast } from "react-toastify";
import useUserStore from "../stores/useUserStore"; // Replace with your actual user store
import { userValidationSchema } from "../validations/userValidations";

export default function AddNewUserForm({ closeDialog }) {
  const { addUser } = useUserStore();

  return (
    <div>
      <Formik
        initialValues={{
          firstName: "",
          lastName: "",
          email: "",
          username: "",
          password: "",
          role: "cashier",
        }}
        validationSchema={userValidationSchema}
        onSubmit={async (values, { setSubmitting }) => {
          try {
            setSubmitting(true);
            await addUser(values);
            closeDialog();
            toast.success("User added successfully!");
          } catch (error) {
            toast.error("Failed to add user: " + error.message);
          } finally {
            setSubmitting(false);
          }
        }}
      >
        {({ touched, errors, dirty, isValid, isSubmitting }) => (
          <Form>
            <div className="grid sm:grid-cols-12 gap-2 sm:gap-6">
              {/* First Name */}
              <div className="sm:col-span-3">
                <label htmlFor="firstName" className="inline-block text-sm text-gray-800 mt-2.5 dark:text-neutral-200">
                  First Name
                </label>
              </div>
              <div className="sm:col-span-9">
                <Field
                  name="firstName"
                  type="text"
                  id="firstName"
                  placeholder="Enter first name"
                  className={`py-1.5 px-3 block w-full shadow-2xs rounded-lg sm:text-sm focus:outline-none ${
                    touched.firstName && errors.firstName
                      ? "border-red-500 ring-1 ring-red-500"
                      : "border-gray-200 focus:border-blue-500 focus:ring-blue-500 dark:border-neutral-700"
                  } dark:bg-neutral-800 dark:text-neutral-400`}
                />
                <ErrorMessage name="firstName" component="div" className="text-red-500 text-sm mt-1" />
              </div>

              {/* Last Name */}
              <div className="sm:col-span-3">
                <label htmlFor="lastName" className="inline-block text-sm text-gray-800 mt-2.5 dark:text-neutral-200">
                  Last Name
                </label>
              </div>
              <div className="sm:col-span-9">
                <Field
                  name="lastName"
                  type="text"
                  id="lastName"
                  placeholder="Enter last name"
                  className={`py-1.5 px-3 block w-full shadow-2xs rounded-lg sm:text-sm focus:outline-none ${
                    touched.lastName && errors.lastName
                      ? "border-red-500 ring-1 ring-red-500"
                      : "border-gray-200 focus:border-blue-500 focus:ring-blue-500 dark:border-neutral-700"
                  } dark:bg-neutral-800 dark:text-neutral-400`}
                />
                <ErrorMessage name="lastName" component="div" className="text-red-500 text-sm mt-1" />
              </div>

              {/* Email */}
              <div className="sm:col-span-3">
                <label htmlFor="email" className="inline-block text-sm text-gray-800 mt-2.5 dark:text-neutral-200">
                  Email
                </label>
              </div>
              <div className="sm:col-span-9">
                <Field
                  name="email"
                  type="email"
                  id="email"
                  placeholder="Enter email"
                  className={`py-1.5 px-3 block w-full shadow-2xs rounded-lg sm:text-sm focus:outline-none ${
                    touched.email && errors.email
                      ? "border-red-500 ring-1 ring-red-500"
                      : "border-gray-200 focus:border-blue-500 focus:ring-blue-500 dark:border-neutral-700"
                  } dark:bg-neutral-800 dark:text-neutral-400`}
                />
                <ErrorMessage name="email" component="div" className="text-red-500 text-sm mt-1" />
              </div>

              {/* Username */}
              <div className="sm:col-span-3">
                <label htmlFor="username" className="inline-block text-sm text-gray-800 mt-2.5 dark:text-neutral-200">
                  Username
                </label>
              </div>
              <div className="sm:col-span-9">
                <Field
                  name="username"
                  type="text"
                  id="username"
                  placeholder="Enter username"
                  className={`py-1.5 px-3 block w-full shadow-2xs rounded-lg sm:text-sm focus:outline-none ${
                    touched.username && errors.username
                      ? "border-red-500 ring-1 ring-red-500"
                      : "border-gray-200 focus:border-blue-500 focus:ring-blue-500 dark:border-neutral-700"
                  } dark:bg-neutral-800 dark:text-neutral-400`}
                />
                <ErrorMessage name="username" component="div" className="text-red-500 text-sm mt-1" />
              </div>

              {/* Password */}
              <div className="sm:col-span-3">
                <label htmlFor="password" className="inline-block text-sm text-gray-800 mt-2.5 dark:text-neutral-200">
                  Password
                </label>
              </div>
              <div className="sm:col-span-9">
                <Field
                  name="password"
                  type="password"
                  id="password"
                  placeholder="Enter password"
                  className={`py-1.5 px-3 block w-full shadow-2xs rounded-lg sm:text-sm focus:outline-none ${
                    touched.password && errors.password
                      ? "border-red-500 ring-1 ring-red-500"
                      : "border-gray-200 focus:border-blue-500 focus:ring-blue-500 dark:border-neutral-700"
                  } dark:bg-neutral-800 dark:text-neutral-400`}
                />
                <ErrorMessage name="password" component="div" className="text-red-500 text-sm mt-1" />
              </div>

              {/* Role (Radio) */}
              <div className="sm:col-span-3">
                <label className="inline-block text-sm text-gray-800 mt-2.5 dark:text-neutral-200">
                  Role
                </label>
              </div>
              <div className="sm:col-span-9">
                <div className="sm:flex">
                  {[ "owner", "cashier"].map((role) => (
                    <label
                      key={role}
                      className={`flex py-2 px-3 w-full border border-gray-200 shadow-2xs text-sm relative focus:z-10
                        ${role === "owner" ? "sm:rounded-s-lg" : role === "cashier" ? "sm:rounded-e-lg" : ""}
                        dark:bg-neutral-800 dark:border-neutral-700 dark:text-neutral-400`}
                    >
                      <Field
                        type="radio"
                        name="role"
                        value={role}
                        disabled={role === "owner"}
                        className="shrink-0 mt-0.5 border-gray-300 rounded-full text-blue-600 focus:ring-blue-500 dark:bg-neutral-800 dark:border-neutral-500"
                      />
                      <span className="ms-3 text-gray-500 dark:text-neutral-400 capitalize">
                        {role}
                      </span>
                    </label>
                  ))}
                </div>
                <ErrorMessage name="role" component="div" className="text-red-500 text-sm mt-1" />
              </div>
            </div>

            {/* Buttons */}
            <div className="mt-5 flex justify-end gap-x-2">
              <button
                onClick={closeDialog}
                type="button"
                className="py-2 px-3 inline-flex items-center gap-x-2 text-sm font-medium rounded-lg border border-gray-200 bg-white text-gray-800 shadow-2xs hover:bg-gray-50 dark:bg-transparent dark:border-neutral-700 dark:text-neutral-300 dark:hover:bg-neutral-800"
              >
                Cancel
              </button>
              <button
                disabled={!dirty || !isValid || isSubmitting}
                type="submit"
                className="py-2 px-3 inline-flex items-center gap-x-2 text-sm font-medium rounded-lg border border-transparent bg-blue-600 text-white hover:bg-blue-700 focus:outline-none disabled:opacity-50 disabled:pointer-events-none"
              >
                {isSubmitting ? "Saving..." : "Add User"}
              </button>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
}
