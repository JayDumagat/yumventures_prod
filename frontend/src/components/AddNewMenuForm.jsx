import { useRef, useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { menuItemValidationSchema } from "../validations/MenuItemValidations";
import { Upload } from "lucide-react";
import useMenuItemStore from "../stores/useMenuItemStore";
import { toast } from "react-toastify";
import useCategoryStore from "../stores/useCategoryStore";
import { Link } from "react-router-dom";

export default function AddNewMenuForm({ closeDialog }) {
  const { addMenuItem } = useMenuItemStore();
  const { categories } = useCategoryStore();

  const fileInputRef = useRef(null);
  const [imagePreview, setImagePreview] = useState(null);

  return (
    <div>
      <Formik
        initialValues={{
          name: "",
          description: "",
          categoryId: 0,
          price: "",
          status: "available",
          image: null,
        }}
        validationSchema={menuItemValidationSchema}
        onSubmit={async (values, { setSubmitting }) => {
          console.log(values);
          try {
            setSubmitting(true);
            const formData = new FormData();
            formData.append("name", values.name);
            formData.append("description", values.description);
            formData.append("categoryId", values.categoryId);
            formData.append("price", values.price);
            formData.append("status", values.status);
            if (values.image) {
              formData.append("image", values.image);
            }

            await addMenuItem(formData);
            //close this
            closeDialog();
            toast.success("Menu item added successfully!");
          } catch (error) {
            toast.error("Failed to add menu item: " + error.message);
          } finally {
            setSubmitting(false);
          }
        }}
      >
        {({
          values,
          setFieldValue,
          touched,
          errors,
          dirty,
          isValid,
          isSubmitting,
        }) => (
          <Form>
            <div className="grid sm:grid-cols-12 gap-2 sm:gap-6">
              {/* Image Upload */}
              <div className="sm:col-span-3">
                <label className="inline-block text-sm text-gray-800 mt-2.5 dark:text-neutral-200">
                  Image
                </label>
              </div>
              <div className="sm:col-span-9">
                <div className="flex items-center gap-5">
                  <img
                    className="inline-block size-16 rounded-lg ring-2 ring-white dark:ring-neutral-900"
                    src={imagePreview || "https://placehold.co/160x160"}
                    alt="Menu Item"
                  />
                  <div className="flex gap-x-2">
                    <button
                      type="button"
                      onClick={() => fileInputRef.current.click()}
                      className={`py-2 px-3 inline-flex items-center gap-x-2 text-sm font-medium rounded-lg border shadow-2xs
    ${
      touched.image && errors.image
        ? "border-red-500 ring-1 ring-red-500"
        : touched.image && !errors.image
        ? "border-teal-500 ring-1 ring-teal-500"
        : "border-gray-200 hover:bg-gray-50 dark:border-neutral-700 dark:hover:bg-neutral-800"
    }
    bg-white text-gray-800 dark:bg-transparent dark:text-neutral-300`}
                    >
                      <Upload className="shrink-0 size-4" />
                      {values.image
                        ? values.image.name.slice(0, 20) + "..."
                        : "Upload Image"}
                    </button>
                    <input
                      type="file"
                      accept="image/*"
                      ref={fileInputRef}
                      className="hidden"
                      onChange={(e) => {
                        const file = e.currentTarget.files[0];
                        if (file) {
                          setFieldValue("image", file);
                          setImagePreview(URL.createObjectURL(file));
                        }
                      }}
                    />
                  </div>
                  {touched.image && errors.image && (
                    <div className="text-red-500 text-sm mt-1">
                      {errors.image}
                    </div>
                  )}
                </div>
              </div>

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

              {/* Category */}
              <div className="sm:col-span-3">
                <label
                  htmlFor="categoryId"
                  className="inline-block text-sm text-gray-800 mt-2.5 dark:text-neutral-200"
                >
                  Category
                </label>
              </div>
              <div className="sm:col-span-9">
                <Field
                  as="select"
                  name="categoryId"
                  id="categoryId"
                  className={`py-1.5 sm:py-2 px-3 block w-full shadow-2xs sm:text-sm rounded-lg
      ${
        touched.categoryId && errors.categoryId
          ? "border-red-500 ring-1 ring-red-500"
          : touched.categoryId && !errors.categoryId
          ? "border-teal-500 ring-1 ring-teal-500"
          : "border-gray-200 focus:border-blue-500 focus:ring-blue-500 dark:border-neutral-700"
      }
      focus:outline-none dark:bg-neutral-800 dark:text-neutral-400`}
                >
                  <option value="" selected>
                    Select category
                  </option>
                  {categories.length > 0 ? (
                    categories.map((category) => (
                      <option key={category.id} value={category.id}>
                        {category.name}
                      </option>
                    ))
                  ) : (
                    <option value="" disabled>
                      No categories found
                    </option>
                  )}
                </Field>
                {categories.length === 0 && (
                  <div className="mt-2 text-sm text-gray-600 dark:text-neutral-400">
                    No categories yet.{" "}
                    <Link
                      to="/client/menu-categories"
                      className="text-blue-500 hover:underline"
                    >
                      Click here to add one
                    </Link>
                  </div>
                )}
                <ErrorMessage
                  name="categoryId"
                  component="div"
                  className="text-red-500 text-sm mt-1"
                />
              </div>

              <div className="sm:col-span-3">
                <label
                  htmlFor="price"
                  className="inline-block text-sm text-gray-800 mt-2.5 dark:text-neutral-200"
                >
                  Price (₱)
                </label>
              </div>
              <div className="sm:col-span-9">
                <Field
                  name="price"
                  type="number"
                  id="price"
                  min="0"
                  placeholder="Enter price"
                  className={`py-1.5 sm:py-2 px-3 pe-11 block w-full shadow-2xs sm:text-sm rounded-lg
                    ${
                      touched.price && errors.price
                        ? "border-red-500 ring-1 ring-red-500"
                        : touched.price && !errors.price
                        ? "border-teal-500 ring-1 ring-teal-500"
                        : "border-gray-200 focus:border-blue-500 focus:ring-blue-500 dark:border-neutral-700"
                    }
                    focus:outline-none dark:bg-neutral-800 dark:text-neutral-400`}
                />
                <ErrorMessage
                  name="price"
                  component="div"
                  className="text-red-500 text-sm mt-1"
                />
              </div>

              {/* Status */}
              <div className="sm:col-span-3">
                <label className="inline-block text-sm text-gray-800 mt-2.5 dark:text-neutral-200">
                  Status
                </label>
              </div>
              <div className="sm:col-span-9">
                <div className="sm:flex">
                  <label className="flex py-2 px-3 w-full border border-gray-200 shadow-2xs sm:rounded-s-lg text-sm relative focus:z-10 focus:border-blue-500 focus:ring-blue-500 dark:bg-neutral-800 dark:border-neutral-700 dark:text-neutral-400">
                    <Field
                      type="radio"
                      name="status"
                      value="available"
                      className="shrink-0 mt-0.5 border-gray-300 rounded-full text-blue-600 focus:ring-blue-500 dark:bg-neutral-800 dark:border-neutral-500 dark:checked:bg-blue-500 dark:checked:border-blue-500 dark:focus:ring-offset-gray-800"
                    />
                    <span className="sm:text-sm text-gray-500 ms-3 dark:text-neutral-400">
                      Available
                    </span>
                  </label>

                  <label className="flex py-2 px-3 w-full border border-gray-200 shadow-2xs sm:rounded-e-lg text-sm relative focus:z-10 focus:border-blue-500 focus:ring-blue-500 dark:bg-neutral-800 dark:border-neutral-700 dark:text-neutral-400">
                    <Field
                      type="radio"
                      name="status"
                      value="unavailable"
                      className="shrink-0 mt-0.5 border-gray-300 rounded-full text-blue-600 focus:ring-blue-500 dark:bg-neutral-800 dark:border-neutral-500 dark:checked:bg-blue-500 dark:checked:border-blue-500 dark:focus:ring-offset-gray-800"
                    />
                    <span className="sm:text-sm text-gray-500 ms-3 dark:text-neutral-400">
                      Unavailable
                    </span>
                  </label>
                </div>
                <ErrorMessage
                  name="status"
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
