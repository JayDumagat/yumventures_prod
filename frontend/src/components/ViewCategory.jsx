import {  useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { toast } from "react-toastify";
import useCategoryStore from "../stores/useCategoryStore";
import categoryValidationSchema from "../validations/categoryValidations";

export default function ViewCategory({ category, deleteDialog, closeDialog, categories }) {
  const { editCategory } = useCategoryStore()
  const [formType, setFormType] = useState("view");

  const handleFormChange = (type) => { 
    setFormType(type);
  };

  const handleDelete = (category) => {
    closeDialog()
   setTimeout(() => {
    deleteDialog(category);
   }, 100);
  }



  return (
    <div>
      <Formik
        initialValues={{
            name: category.name,
            description: category.description || "",
        }}
        validationSchema={categoryValidationSchema}
        validate={(values) => {
            const errors = {};
  
          
            const nameAlreadyExists = categories.some(
              (existingCategory) =>
                existingCategory.name.toLowerCase().trim() === values.name.toLowerCase().trim() &&
                existingCategory.id !== category.id 
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

            await editCategory(category.id, formData)

            
              toast.success("Menu item updated successfully");
              closeDialog()
           
            
          } catch (error) {
            toast.error("Failed to edit category: " + error.message);
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
                  disabled={formType === "view"}
                  placeholder="Enter category name"
                  className={`py-1.5 sm:py-2 px-3 pe-11 block w-full shadow-2xs sm:text-sm rounded-lg focus:outline-none
    ${
      touched.name && errors.name
        ? "border-red-500 ring-1 ring-red-500"
        : touched.name
        ? "border-teal-500 ring-1 ring-teal-500"
        : "border-gray-200 focus:border-blue-500 focus:ring-blue-500"
    }
    dark:bg-neutral-800 dark:border-neutral-700 dark:text-neutral-400 disabled:bg-gray-50 disabled:text-gray-600 disabled:cursor-not-allowed`}
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
                  disabled={formType === "view"}
                  placeholder="Enter category description (optional)"
                  className=" disabled:cursor-not-allowed py-1.5 sm:py-2 px-3 block w-full border-gray-200 shadow-2xs sm:text-sm rounded-lg focus:border-blue-500 focus:ring-blue-500 dark:bg-neutral-800 dark:border-neutral-700 dark:text-neutral-400 disabled:bg-gray-50 disabled:text-gray-600 disabled:cursor-not-allowed`"
                />
                <ErrorMessage
                  name="description"
                  component="div"
                  className="text-red-500 text-sm mt-1"
                />
              </div>
              </div>

             
            {formType === "edit" && (
                <div className="mt-5 flex justify-end gap-x-2">
                <button
                  type="button"
                  onClick={() => handleFormChange("view")}
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
            )}
            { formType === "view" && (
                <div className="mt-5 flex justify-end gap-x-2">
                <button
                onClick={() => handleDelete(category)}
                  type="button"
                  className="py-2 px-3 inline-flex items-center gap-x-2 text-sm font-medium rounded-lg border border-gray-200 bg-white text-gray-800 shadow-2xs hover:bg-gray-50 dark:bg-transparent dark:border-neutral-700 dark:text-neutral-300 dark:hover:bg-neutral-800 dark:focus:bg-neutral-800"
                >
                  Delete
                </button>
                <button
                    onClick={() => handleFormChange("edit")}
                  type="submit"
                  className="py-2 px-3 inline-flex items-center gap-x-2 text-sm font-medium rounded-lg border border-transparent bg-blue-600 text-white hover:bg-blue-700 focus:outline-hidden focus:bg-blue-700 disabled:opacity-50 disabled:pointer-events-none"
                >
                   Edit Category               
                </button>
              </div>
            )}
         
          </Form>
        )}
      </Formik>
    </div>
  );
}
