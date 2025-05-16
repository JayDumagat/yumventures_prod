import { useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { toast } from "react-toastify";
import useUserStore from "../stores/useUserStore";

export default function ViewStaffAccount({ staff, deleteDialog, closeDialog }) {
  const { editStaff } = useUserStore();
  const [formType, setFormType] = useState("view");

  const handleFormChange = (type) => setFormType(type);

  const handleDelete = () => {
    closeDialog();
    setTimeout(() => deleteDialog(staff), 100);
  };

  return (
    <Formik
      initialValues={{
        firstName: staff.firstName,
        lastName: staff.lastName,
        username: staff.username,
        email: staff.email,
        password: staff.password,
        role: staff.role,
      }}
      onSubmit={async (values, { setSubmitting }) => {
        try {
          setSubmitting(true);
          await editStaff(staff.id, values);
          toast.success("Staff account updated successfully");
          closeDialog();
        } catch (error) {
          toast.error("Failed to update staff: " + error.message);
        } finally {
          setSubmitting(false);
        }
      }}
    >
      {({ touched, errors, isSubmitting, dirty, isValid }) => (
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
                disabled={formType === "view"}
                placeholder="Enter first name"
                className={`py-1.5 sm:py-2 px-3 block w-full shadow-2xs sm:text-sm rounded-lg
                  ${
                    touched.firstName && errors.firstName
                      ? "border-red-500 ring-1 ring-red-500"
                      : touched.firstName
                      ? "border-teal-500 ring-1 ring-teal-500"
                      : "border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                  }
                  focus:outline-none dark:bg-neutral-800 dark:border-neutral-700 dark:text-neutral-400 disabled:bg-gray-50 disabled:text-gray-600 disabled:cursor-not-allowed`}
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
                disabled={formType === "view"}
                placeholder="Enter last name"
                className={`py-1.5 sm:py-2 px-3 block w-full shadow-2xs sm:text-sm rounded-lg
                  ${
                    touched.lastName && errors.lastName
                      ? "border-red-500 ring-1 ring-red-500"
                      : touched.lastName
                      ? "border-teal-500 ring-1 ring-teal-500"
                      : "border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                  }
                  focus:outline-none dark:bg-neutral-800 dark:border-neutral-700 dark:text-neutral-400 disabled:bg-gray-50 disabled:text-gray-600 disabled:cursor-not-allowed`}
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
                disabled={formType === "view"}
                placeholder="Enter email"
                className={`py-1.5 sm:py-2 px-3 block w-full shadow-2xs sm:text-sm rounded-lg
                  ${
                    touched.email && errors.email
                      ? "border-red-500 ring-1 ring-red-500"
                      : touched.email
                      ? "border-teal-500 ring-1 ring-teal-500"
                      : "border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                  }
                  focus:outline-none dark:bg-neutral-800 dark:border-neutral-700 dark:text-neutral-400 disabled:bg-gray-50 disabled:text-gray-600 disabled:cursor-not-allowed`}
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
                disabled={formType === "view"}
                placeholder="Enter username"
                className={`py-1.5 sm:py-2 px-3 block w-full shadow-2xs sm:text-sm rounded-lg
                  ${
                    touched.username && errors.username
                      ? "border-red-500 ring-1 ring-red-500"
                      : touched.username
                      ? "border-teal-500 ring-1 ring-teal-500"
                      : "border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                  }
                  focus:outline-none dark:bg-neutral-800 dark:border-neutral-700 dark:text-neutral-400 disabled:bg-gray-50 disabled:text-gray-600 disabled:cursor-not-allowed`}
              />
              <ErrorMessage name="username" component="div" className="text-red-500 text-sm mt-1" />
            </div>

            {/* Role */}
            <div className="sm:col-span-3">
              <label htmlFor="role" className="inline-block text-sm text-gray-800 mt-2.5 dark:text-neutral-200">
                Role
              </label>
            </div>
            <div className="sm:col-span-9">
              <Field
                as="select"
                name="role"
                id="role"
                disabled={formType === "view"}
                className={`py-1.5 sm:py-2 px-3 block w-full shadow-2xs sm:text-sm rounded-lg
                  ${
                    touched.role && errors.role
                      ? "border-red-500 ring-1 ring-red-500"
                      : touched.role
                      ? "border-teal-500 ring-1 ring-teal-500"
                      : "border-gray-200 focus:border-blue-500 focus:ring-blue-500 dark:border-neutral-700"
                  }
                  focus:outline-none dark:bg-neutral-800 dark:text-neutral-400 disabled:bg-gray-50 disabled:text-gray-600 disabled:cursor-not-allowed`}
              >
                <option value="">Select role</option>
                <option value="admin">Admin</option>
                <option value="staff">Staff</option>
              </Field>
              <ErrorMessage name="role" component="div" className="text-red-500 text-sm mt-1" />
            </div>
          </div>

          {/* Buttons */}
          {formType === "edit" && (
            <div className="mt-5 flex justify-end gap-x-2">
              <button
                type="button"
                onClick={() => handleFormChange("view")}
                className="py-2 px-3 inline-flex items-center gap-x-2 text-sm font-medium rounded-lg border border-gray-200 bg-white text-gray-800 shadow-2xs hover:bg-gray-50 dark:bg-transparent dark:border-neutral-700 dark:text-neutral-300 dark:hover:bg-neutral-800"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={!dirty || !isValid || isSubmitting}
                className="py-2 px-3 inline-flex items-center gap-x-2 text-sm font-medium rounded-lg border border-transparent bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50"
              >
                {isSubmitting ? "Saving Changes..." : "Save Changes"}
              </button>
            </div>
          )}

          {formType === "view" && (
            <div className="mt-5 flex justify-end gap-x-2">
              <button
                type="button"
                onClick={handleDelete}
                className="py-2 px-3 inline-flex items-center gap-x-2 text-sm font-medium rounded-lg border border-gray-200 bg-white text-gray-800 shadow-2xs hover:bg-gray-50 dark:bg-transparent dark:border-neutral-700 dark:text-neutral-300 dark:hover:bg-neutral-800"
              >
                Delete
              </button>
              <button
                type="button"
                onClick={() => handleFormChange("edit")}
                className="py-2 px-3 inline-flex items-center gap-x-2 text-sm font-medium rounded-lg border border-transparent bg-blue-600 text-white hover:bg-blue-700"
              >
                Edit Staff Account
              </button>
            </div>
          )}
        </Form>
      )}
    </Formik>
  );
}