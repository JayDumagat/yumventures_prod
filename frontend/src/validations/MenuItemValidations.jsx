import * as Yup from "yup";

export const menuItemValidationSchema = Yup.object({
  name: Yup.string()
    .required("Menu item name is required")
    .min(4, "Menu item name must be at least 4 characters"),
  description: Yup.string()
    .optional()
    .max(100, "Description must be at most 100 characters"),
  categoryId: Yup.number()
    .required("Category is required")
    .integer("Category must be a positive integer")
    .positive("Category must be a positive number"),
  price: Yup.number()
    .required("Price is required")
    .positive("Price must be a positive number")
    .min(0.01, "Price must be at least 0.01"),
  image: Yup.mixed()
    .required("Image is required")
    .test(
      "fileType",
      "Unsupported File Format",
      (value) =>
        value &&
        ["image/jpeg", "image/png", "image/jpg", "image/webp"].includes(
          value.type
        )
    )
    ,
  status: Yup.string()
    .required("Status is required")
    .oneOf(
      ["available", "unavailable"],
      "Status must be either available or unavailable"
    ),
});

export const editMenuItemValidationSchema = Yup.object({
  name: Yup.string()
    .required("Menu item name is required")
    .min(4, "Menu item name must be at least 4 characters"),
  description: Yup.string()
    .optional()
    .max(100, "Description must be at most 100 characters"),
  categoryId: Yup.number()
    .required("Category is required")
    .integer("Category must be a positive integer")
    .positive("Category must be a positive number"),
  price: Yup.number()
    .required("Price is required")
    .positive("Price must be a positive number")
    .min(0.01, "Price must be at least 0.01"),
  image: Yup.mixed()
    .nullable(),
  status: Yup.string()
    .required("Status is required")
    .oneOf(
      ["available", "unavailable"],
      "Status must be either available or unavailable"
    ),

 
});


