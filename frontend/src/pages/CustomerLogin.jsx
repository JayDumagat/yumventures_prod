import {
    Eye,
    EyeOff,
    LoaderCircle,
    RectangleEllipsis,
    UserRound,
} from "lucide-react";
import { useFormik } from "formik";
import { loginValidationSchema } from "../validations/LoginValidations";
import useAuthStore from "../stores/useAuthStore";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { toast } from "react-toastify";

export default function CustomerLogin({redirectTo}) {
    const { login } = useAuthStore();
    const [passwordVisible, setPasswordVisible] = useState(false);
    const navigate = useNavigate();

    const togglePasswordVisibility = () => {
        setPasswordVisible((prev) => !prev);
    };

    const formik = useFormik({
        initialValues: {
            username: "",
            password: "",
        },
        validationSchema: loginValidationSchema,
        onSubmit: async (values, { setSubmitting }) => {
            try {
                setSubmitting(true);
                const result = await login(values);
                if (result.success) {
                    toast.success("Login successful!");
                    setTimeout(() => {
                        navigate(redirectTo);
                    }, 2000);
                } else {
                    toast.error("Something went wrong, please try again.");
                }
            } catch (error) {
                toast.error("An error occurred during login", error.message);
            }
        },
    });

    const isButtonDisabled =
        !formik.dirty || // No changes yet
        !formik.isValid || // Still has validation errors
        formik.isSubmitting; // Form is submitting

    return (
        <>
            <div className="w-full h-screen mx-auto py-12 px-4 sm:px-6 md:py-20 lg:py-12 md:px-8">
                <div className="md:pe-8 md:w-1/2 xl:pe-0 xl:w-5/12">
                    {/* Title */}
                    <h1 className="text-3xl text-gray-800 font-bold md:text-4xl md:leading-tight lg:text-5xl lg:leading-tight dark:text-neutral-200">
                        Powering Every {" "}
                        <span className="text-blue-600 dark:text-blue-500">Team</span>
                    </h1>
                    <p className="mt-3 text-base text-gray-500 dark:text-neutral-500">
                        Built for modern restaurants, Yum lets your team manage orders, inventory, and sales—fast, easy, and all in one place.
                    </p>

                    {/* Hide register link and divider if path is /login */}
                    {window.location.pathname !== "/client/login" && (
                        <>
                            <div className={`mt-8 grid `}>
                                <Link
                                    to={"/register"}
                                    className="py-3 px-4 inline-flex justify-center items-center gap-x-2 text-sm font-medium rounded-lg border border-gray-200 bg-white text-gray-800 shadow-2xs hover:bg-gray-50 focus:outline-hidden focus:bg-gray-50 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-900 dark:border-neutral-700 dark:text-white dark:hover:bg-neutral-800 dark:focus:bg-neutral-800"
                                >
                                    Create an account here
                                </Link>
                            </div>


                        </>
                    )}

                    <div className="py-6 flex items-center text-sm text-gray-400 uppercase before:flex-1 before:border-t before:border-gray-200 before:me-6 after:flex-1 after:border-t after:border-gray-200 after:ms-6 dark:text-neutral-500 dark:before:border-neutral-700 dark:after:border-neutral-700">
                        Login as
                    </div>

                    {/* Form */}
                    <form onSubmit={formik.handleSubmit} className="grid gap-4 md:gap-6">
                        <div className="max-w-full space-y-3">
                            <div>
                                <label
                                    htmlFor="username"
                                    className="block text-sm font-medium mb-2 dark:text-white"
                                >
                                    Username
                                </label>
                                <div className="relative">
                                    <input
                                        type="text"
                                        id="username"
                                        name="username"
                                        autoComplete="username"
                                        onFocus={() => formik.setFieldTouched("username", false)}
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                        value={formik.values.username}
                                        className={`py-2.5 sm:py-3 px-4 ps-11 block w-full border-gray-200 rounded-lg sm:text-sm focus:z-10 ${
                                            formik.touched.username && formik.errors.username
                                                ? "border-red-500 ring-1 ring-red-500 focus:ring-red-500 focus:border-red-500"
                                                : formik.touched.username && !formik.errors.username
                                                    ? "border-teal-500 ring-1 ring-teal-500 focus:ring-teal-500 focus:border-teal-500"
                                                    : "focus:border-blue-500 focus:ring-blue-500  "
                                        } disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-900 dark:border-neutral-700 dark:text-neutral-400 dark:placeholder-neutral-500 dark:focus:ring-neutral-600`}
                                        placeholder="Enter your username"
                                    />
                                    <div className="absolute inset-y-0 start-0 flex items-center pointer-events-none z-20 ps-4">
                                        <UserRound className="shrink-0 size-4 text-gray-400 dark:text-neutral-600" />
                                    </div>
                                </div>
                                {/* Error Message */}
                                {formik.touched.username && formik.errors.username && (
                                    <div className="text-sm text-red-600 mt-2">
                                        {formik.errors.username}
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="max-w-full space-y-3">
                            <div>
                                <div className="flex flex-wrap justify-between items-center gap-2">
                                    <label
                                        htmlFor="password"
                                        className="block text-sm font-medium mb-2 dark:text-white"
                                    >
                                        Password

                                    </label>
                                    <Link className="inline-flex items-center gap-x-1 text-sm text-blue-600 decoration-2 hover:underline focus:outline-hidden focus:underline font-medium dark:text-blue-500" to={"/forgot-password"}>Forgot password?</Link>
                                </div>
                                <div className="relative">
                                    <input
                                        type={passwordVisible ? "text" : "password"}
                                        id="password"
                                        name="password"
                                        autoComplete="current-password"
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                        value={formik.values.password}
                                        className={`py-2.5 sm:py-3 px-4 ps-11 pe-9 block w-full border-gray-200 rounded-lg sm:text-sm focus:z-10 ${
                                            formik.touched.password && formik.errors.password
                                                ? "border-red-500 ring-1 ring-red-500"
                                                : formik.touched.password && !formik.errors.password
                                                    ? "border-teal-500 ring-1 ring-teal-500"
                                                    : "focus:border-blue-500 focus:ring-blue-500"
                                        } disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-900 dark:border-neutral-700 dark:text-neutral-400 dark:placeholder-neutral-500 dark:focus:ring-neutral-600`}
                                        placeholder="Enter your password"
                                    />
                                    <button
                                        onClick={togglePasswordVisibility}
                                        type="button"
                                        className="absolute inset-y-0 end-2 flex items-center z-20 px-3 cursor-pointer text-gray-400 rounded-e-md focus:outline-hidden focus:text-blue-600 dark:text-neutral-600 dark:focus:text-blue-500"
                                    >
                                        {passwordVisible ? (
                                            <EyeOff className="shrink-0 size-4" />
                                        ) : (
                                            <Eye className="shrink-0 size-4" />
                                        )}
                                    </button>
                                    <div className="absolute inset-y-0 start-0 flex items-center pointer-events-none z-20 ps-4">
                                        <RectangleEllipsis className="shrink-0 size-4 text-gray-400 dark:text-neutral-600" />
                                    </div>
                                </div>
                                {/* Error Message */}
                                {formik.touched.password && formik.errors.password && (
                                    <div className="text-sm text-red-600 mt-2">
                                        {formik.errors.password}
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="flex items-center">
                            <div className="flex">
                                <input
                                    id="remember-me"
                                    name="remember-me"
                                    type="checkbox"
                                    value={formik.values.rememberMe}
                                    onChange={formik.handleChange}
                                    className="shrink-0 mt-0.5 border-gray-200 rounded-sm text-blue-600 focus:ring-blue-500 dark:bg-neutral-800 dark:border-neutral-700 dark:checked:bg-blue-500 dark:checked:border-blue-500 dark:focus:ring-offset-gray-800"
                                />
                            </div>
                            <div className="ms-3">
                                <label for="remember-me" className="text-sm dark:text-white">
                                    Remember me
                                </label>
                            </div>
                        </div>

                        <div className="grid">
                            <button
                                type="submit"
                                className="py-3 px-4 inline-flex justify-center items-center gap-x-2 text-sm font-medium rounded-lg border border-transparent bg-blue-600 text-white hover:bg-blue-700 focus:outline-hidden focus:bg-blue-700 disabled:opacity-50 disabled:pointer-events-none"
                                disabled={isButtonDisabled}
                            >
                                {formik.isSubmitting ? (
                                    <LoaderCircle className="animate-spin h-5 w-5 text-white" />
                                ) : (
                                    <p>Sign in</p>
                                )}
                            </button>
                        </div>
                    </form>
                    {/* End Form */}
                </div>
            </div>

            <div className="hidden md:block md:absolute md:top-0 md:start-1/2 md:end-0 h-full bg-[url('https://cdn.pixabay.com/photo/2017/10/30/12/56/spices-2902439_1280.jpg')] bg-no-repeat bg-center bg-cover"></div>
        </>
    );
}
