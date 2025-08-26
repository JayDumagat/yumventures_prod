import * as Yup from "yup";

export const profileValidationSchema = Yup.object().shape({
    password: Yup.string()
        .nullable() // Password can be empty if not changing it
        .min(8, "Password must be at least 8 characters")
        .matches(/[a-z]/, "Password must contain at least one lowercase letter")
        .matches(/[A-Z]/, "Password must contain at least one uppercase letter")
        .matches(/[0-9]/, "Password must contain at least one number")
        .matches(/[@$!%*?&]/, "Password must contain at least one special character"),
    image: Yup.mixed()
        .nullable()
        .test("fileSize", "Image must be less than 2MB", (value) => {
            if (!value) return true; // No file selected, skip validation
            return value.size <= 2 * 1024 * 1024; // 2MB
        })
        .test("fileType", "Only JPEG, PNG, or JPG files are allowed", (value) => {
            if (!value) return true;
            return ["image/jpeg", "image/png", "image/jpg"].includes(value.type);
        }),
});
