import { useRef, useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { editMenuItemValidationSchema } from "../validations/MenuItemValidations";
import { Upload } from "lucide-react";
import useMenuItemStore from "../stores/useMenuItemStore";
import useCategoryStore from "../stores/useCategoryStore";
import { toast } from "react-toastify";
import {Link} from "react-router-dom";

export default function ViewMenuItem({ menuItem, deleteDialog, closeDialog }) {
  const { editMenuItem } = useMenuItemStore();
  const { categories } = useCategoryStore();
  const [formType, setFormType] = useState("view");

  const handleFormChange = (type) => {
    setFormType(type);
  };

  const fileInputRef = useRef(null);
  const [imagePreview, setImagePreview] = useState(null);

  const handleDelete = (menuItem) => {
    closeDialog();
    setTimeout(() => {
      deleteDialog(menuItem);
    }, 100);
  };

  return (
    <div>
      <Formik
        initialValues={{
          name: menuItem.name,
          description: menuItem.description,
          categoryId: menuItem.category?.id,
          price: menuItem.price,
          status: menuItem.status,
          image: imagePreview,
        }}
        validationSchema={editMenuItemValidationSchema}
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

            await editMenuItem(menuItem.id, formData);

            toast.success("Menu item updated successfully");
            setImagePreview(null);
            closeDialog();
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
                    src={
                      imagePreview
                          ? imagePreview
                          : menuItem.image?.startsWith("http")
                              ? menuItem.image
                              : `${menuItem.image || ""}`
                    }
                    alt={`${menuItem.name} image`}
                  />
                  <div className="flex gap-x-2">
                    <button
                      disabled={formType === "view"}
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
    bg-white text-gray-800 dark:bg-transparent dark:text-neutral-300 disabled:bg-gray-100 disabled:text-gray-400 disabled:cursor-not-allowed`}
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
                  disabled={formType === "view"}
                  placeholder="Enter menu item name"
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
                  placeholder="Enter item description (optional)"
                  className=" disabled:cursor-not-allowed py-1.5 sm:py-2 px-3 block w-full border-gray-200 shadow-2xs sm:text-sm rounded-lg focus:border-blue-500 focus:ring-blue-500 dark:bg-neutral-800 dark:border-neutral-700 dark:text-neutral-400 disabled:bg-gray-50 disabled:text-gray-600 disabled:cursor-not-allowed`"
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
                  disabled={formType === "view"}
                  className={`py-1.5 sm:py-2 px-3 block w-full shadow-2xs sm:text-sm rounded-lg
      ${
        touched.categoryId && errors.categoryId
          ? "border-red-500 ring-1 ring-red-500"
          : touched.categoryId && !errors.categoryId
          ? "border-teal-500 ring-1 ring-teal-500"
          : "border-gray-200 focus:border-blue-500 focus:ring-blue-500 dark:border-neutral-700"
      }
      focus:outline-none dark:bg-neutral-800 dark:text-neutral-400 disabled:bg-gray-50 disabled:text-gray-600 disabled:cursor-not-allowed`}
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
                  disabled={formType === "view"}
                  placeholder="Enter price"
                  className={`py-1.5 sm:py-2 px-3 pe-11 block w-full shadow-2xs sm:text-sm rounded-lg
                    ${
                      touched.price && errors.price
                        ? "border-red-500 ring-1 ring-red-500"
                        : touched.price && !errors.price
                        ? "border-teal-500 ring-1 ring-teal-500"
                        : "border-gray-200 focus:border-blue-500 focus:ring-blue-500 dark:border-neutral-700"
                    }
                    focus:outline-none dark:bg-neutral-800 dark:text-neutral-400 disabled:bg-gray-50 disabled:text-gray-600 disabled:cursor-not-allowed`}
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
                      disabled={formType === "view"}
                      value="available"
                      className=" disabled:text-gray-600 disabled:cursor-not-allowed shrink-0 mt-0.5 border-gray-300 rounded-full text-blue-600 focus:ring-blue-500 dark:bg-neutral-800 dark:border-neutral-500 dark:checked:bg-blue-500 dark:checked:border-blue-500 dark:focus:ring-offset-gray-800"
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
                      disabled={formType === "view"}
                      className=" disabled:text-gray-600 disabled:cursor-not-allowed shrink-0 mt-0.5 border-gray-300 rounded-full text-blue-600 focus:ring-blue-500 dark:bg-neutral-800 dark:border-neutral-500 dark:checked:bg-blue-500 dark:checked:border-blue-500 dark:focus:ring-offset-gray-800"
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
            {formType === "view" && (
              <div className="mt-5 flex justify-end gap-x-2">
                <button
                  onClick={() => handleDelete(menuItem)}
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
                  Edit Menu Item
                </button>
              </div>
            )}
          </Form>
        )}
      </Formik>
    </div>
  );
}
