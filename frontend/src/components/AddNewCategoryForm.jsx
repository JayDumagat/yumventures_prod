import { Formik, Form, Field, ErrorMessage } from "formik";
import useCategoryStore from "../stores/useCategoryStore";
import { toast } from "react-toastify";
import  categoryValidationSchema  from "../validations/categoryValidations";

export default function AddNewCategoryForm({ closeDialog, categories }) {
  const { addCategories } = useCategoryStore();


  return (
    <div>
      <Formik
        initialValues={{
          name: "",
          description: "",
        }}
        validationSchema={categoryValidationSchema}
        validate={(values) => {
          const errors = {};
      
          const nameAlreadyExists = categories.some(
            (category) => category.name.toLowerCase().trim() === values.name.toLowerCase().trim()
          );
      
          if (nameAlreadyExists) {
            errors.name = "Category name already exists";
          }
      
          return errors;
        }}
        onSubmit={async (values, { setSubmitting }) => {
          console.log(values);
          try {
            setSubmitting(true);
          
            const formData = new FormData();
            formData.append("name", values.name);
            formData.append("description", values.description);
          
            const response = await addCategories(formData);
          
            if (response) {
              closeDialog();
              toast.success("Category added successfully!");
            } else {
              toast.error("Failed to add category!");
            }
          
          } catch (error) {
            const errorMessage = error.response?.data?.message || error.message || "Unknown error";
            toast.error(errorMessage); 
          } finally {
            setSubmitting(false);
          }
          
        }}
      >
        {({
          touched,
          errors,
          dirty,
          isValid,
          isSubmitting,
        }) => (
          <Form>
            <div className="grid sm:grid-cols-12 gap-2 sm:gap-6">

              {/* Name */}
              <div className="sm:col-span-3">
                <label
                  htmlFor="name"
                  className="inline-block text-sm text-gray-800 mt-2.5 dark:text-neutral-200"
                >
                  Name
                </label>
              </div>
              <div className="sm:col-span-9">
                <Field
                  name="name"
                  type="text"
                  id="name"
                  placeholder="Enter menu item name"
                  className={`py-1.5 sm:py-2 px-3 pe-11 block w-full shadow-2xs sm:text-sm rounded-lg focus:outline-none
    ${
      touched.name && errors.name
        ? "border-red-500 ring-1 ring-red-500"
        : touched.name
        ? "border-teal-500 ring-1 ring-teal-500"
        : "border-gray-200 focus:border-blue-500 focus:ring-blue-500"
    }
    dark:bg-neutral-800 dark:border-neutral-700 dark:text-neutral-400`}
                />

                <ErrorMessage
                  name="name"
                  component="div"
                  className="text-red-500 text-sm mt-1"
                />
              </div>

              {/* Description */}
              <div className="sm:col-span-3">
                <label
                  htmlFor="description"
                  className="inline-block text-sm text-gray-800 mt-2.5 dark:text-neutral-200"
                >
                  Description
                </label>
              </div>
              <div className="sm:col-span-9">
                <Field
                  as="textarea"
                  name="description"
                  id="description"
                  rows="3"
                  placeholder="Enter item description (optional)"
                  className="py-1.5 sm:py-2 px-3 block w-full border-gray-200 shadow-2xs sm:text-sm rounded-lg focus:border-blue-500 focus:ring-blue-500 dark:bg-neutral-800 dark:border-neutral-700 dark:text-neutral-400"
                />
                <ErrorMessage
                  name="description"
                  component="div"
                  className="text-red-500 text-sm mt-1"
                />
              </div>

              </div>
            

            <div className="mt-5 flex justify-end gap-x-2">
              <button
              onClick={closeDialog}
                type="button"
                className="py-2 px-3 inline-flex items-center gap-x-2 text-sm font-medium rounded-lg border border-gray-200 bg-white text-gray-800 shadow-2xs hover:bg-gray-50 dark:bg-transparent dark:border-neutral-700 dark:text-neutral-300 dark:hover:bg-neutral-800 dark:focus:bg-neutral-800"
              >
                Cancel
              </button>
              <button
                disabled={!dirty || !isValid || isSubmitting}
                type="submit"
                className="py-2 px-3 inline-flex items-center gap-x-2 text-sm font-medium rounded-lg border border-transparent bg-blue-600 text-white hover:bg-blue-700 focus:outline-hidden focus:bg-blue-700 disabled:opacity-50 disabled:pointer-events-none"
              >
                {isSubmitting ? "Saving Changes..." : "Save Changes"}
              </button>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
}
