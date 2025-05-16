import React, { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import useAuthStore from "../stores/useAuthStore";
import { toast } from "react-toastify";

export default function ForgotPassword() {
  const { sendEmail, validateCode, resendCode, resetPassword } = useAuthStore();
  const [step, setStep] = useState("email");
  const [email, setEmail] = useState("");
  const [countdown, setCountdown] = useState(180); // Initial countdown of 180 seconds
  const pinRefs = [useRef(), useRef(), useRef(), useRef(), useRef(), useRef()];

  useEffect(() => {
    let timer;
    if (countdown > 0) {
      timer = setInterval(() => setCountdown((prev) => prev - 1), 1000);
    }
    return () => clearInterval(timer); // Cleanup the timer on unmount
  }, [countdown]);

  const handlePinChange = (e, index) => {
    const value = e.target.value;
    if (value.length === 1 && index < 5) {
      pinRefs[index + 1].current.focus();
    }
  };

  const renderEmailStep = () => (
    <Formik
      initialValues={{ email: "" }}
      validationSchema={Yup.object({
        email: Yup.string().email("Invalid email").required("Required"),
      })}
      onSubmit={async (values, { setSubmitting }) => {
        try {
          const result = await sendEmail(values.email);
          if (result) {
            setEmail(values.email);
            setStep("code");
            toast.success("Verification code sent to your email.");
          }
        } catch (error) {
          console.error(error);
          toast.error("An error occurred. Please try again.");
        } finally {
          setSubmitting(false);
        }
      }}
    >
      {({ errors, touched, isValid, dirty, isSubmitting }) => (
        <Form className="grid gap-y-4">
          <div>
            <label
              htmlFor="email"
              className="block text-sm mb-2 dark:text-white"
            >
              Email address
            </label>
            <Field
              name="email"
              type="email"
              className={`py-2.5 sm:py-3 px-4 block w-full rounded-lg sm:text-sm
              ${
                errors.email && touched.email
                  ? "border-red-500 ring-red-500 focus:ring-red-500 focus:border-red-500"
                  : touched.email && !errors.email
                  ? "border-teal-500 ring-teal-500 focus:ring-teal-500 focus:border-teal-500"
                  : "border-gray-200"
              }
              focus:border-blue-500 focus:ring-blue-500 dark:bg-neutral-900 dark:border-neutral-700 dark:text-neutral-400`}
            />
            <ErrorMessage
              name="email"
              component="div"
              className="text-xs text-red-600 mt-2"
            />
          </div>
          <button
            type="submit"
            disabled={!dirty || !isValid || isSubmitting}
            className="w-full py-3 px-4 inline-flex justify-center items-center gap-x-2 text-sm font-medium rounded-lg border border-transparent bg-blue-600 text-white hover:bg-blue-700 focus:outline-hidden focus:bg-blue-700 disabled:opacity-50 disabled:pointer-events-none"
          >
            {isSubmitting ? "Sending..." : "Send Verification Code"}
          </button>
        </Form>
      )}
    </Formik>
  );

  const renderCodeStep = () => (
    <Formik
      initialValues={{ code: Array(6).fill("") }}
      validationSchema={Yup.object({
        code: Yup.array()
          .of(Yup.string().length(1, "1 digit only").required("Required"))
          .required(),
      })}
      onSubmit={async (values, { isSubmitting }) => {
        try {
          const code = values.code.join("");
          const isValid = await validateCode(code);

          if (isValid) {
            setStep("newPassword");
            toast.success("Code verified. Proceed to reset password.");
          } else {
            toast.error("Invalid verification code. Please try again.");
          }
        } catch (error) {
          console.error(error);
          toast.error("An error occurred. Please try again.");
        }
      }}
    >
      {({
        values,
        setFieldValue,
        errors,
        touched,
        isValid,
        dirty,
        isSubmitting,
      }) => (
        <Form className="grid gap-y-4">
          <div className="flex flex-col gap-y-2">
            <div className="flex justify-evenly items-center gap-x-2">
              {values.code.map((_, i) => (
                <Field
                  key={i}
                  innerRef={pinRefs[i]}
                  name={`code[${i}]`}
                  type="text"
                  maxLength="1"
                  className={`block w-9.5 text-center rounded-md sm:text-sm
                  ${
                    errors.code?.[i] && touched.code?.[i]
                      ? "border-red-500 ring-red-500"
                      : touched.code?.[i]
                      ? "border-green-500"
                      : "border-gray-200"
                  }
                  focus:border-blue-500 focus:ring-blue-500 dark:bg-neutral-900 dark:border-neutral-700 dark:text-neutral-400`}
                  onChange={(e) => {
                    setFieldValue(`code[${i}]`, e.target.value);
                    handlePinChange(e, i);
                  }}
                />
              ))}
            </div>
            <div className="ms-3 text-sm text-gray-600 dark:text-neutral-400">
              {countdown > 0 ? (
                `Resend code in ${countdown}s`
              ) : (
                <button
                  type="button"
                  className="text-blue-600 hover:underline focus:outline-none"
                  onClick={async () => {
                    if (countdown > 0) return;

                    setCountdown(180);
                    try {
                      await resendCode(email);
                      toast.success("Verification code sent again.");
                    } catch (error) {
                      toast.error(
                        "An error occurred while resending the code."
                      );
                    }
                  }}
                >
                  Resend Code
                </button>
              )}
            </div>
          </div>
          <button
            type="submit"
            disabled={!dirty || !isValid || isSubmitting}
            className="w-full py-3 px-4 inline-flex justify-center items-center gap-x-2 text-sm font-medium rounded-lg border border-transparent bg-blue-600 text-white hover:bg-blue-700 focus:outline-hidden focus:bg-blue-700 disabled:opacity-50 disabled:pointer-events-none"
          >
            {isSubmitting ? "Verifying..." : "Verify Code"}
          </button>
        </Form>
      )}
    </Formik>
  );

  const renderNewPasswordStep = () => (
    <Formik
      initialValues={{ password: "", confirmPassword: "" }}
      validationSchema={Yup.object({
        password: Yup.string().min(6, "Min 6 chars").required("Required"),
        confirmPassword: Yup.string()
          .oneOf([Yup.ref("password"), null], "Passwords must match")
          .required("Required"),
      })}
      onSubmit={async (values, { setSubmitting }) => {
        try {
          const success = await resetPassword(email, values.password);
          if (success) {
            toast.success("Password has been reset successfully!");
            setStep("success");
          } else {
            toast.error("Failed to reset password.");
          }
        } catch (error) {
          console.error(error);
          toast.error("An error occurred while resetting the password.");
        } finally {
          setSubmitting(false);
        }
      }}
    >
      {({ errors, touched, isValid, dirty, isSubmitting }) => (
        <Form className="grid gap-y-4">
          <div>
            <label
              htmlFor="password"
              className="block text-sm mb-2 dark:text-white"
            >
              New Password
            </label>
            <Field
              name="password"
              type="password"
              className={`py-2.5 px-4 block w-full rounded-lg sm:text-sm 
            ${
              errors.password && touched.password
                ? "border-red-500 ring-red-500 focus:ring-red-500 focus:border-red-500"
                : touched.password
                ? "border-teal-500 ring-teal-500 focus:ring-teal-500 focus:border-teal-500"
                : "border-gray-200"
            }
            focus:border-blue-500 focus:ring-blue-500 dark:bg-neutral-900 dark:border-neutral-700 dark:text-neutral-400`}
            />
            <ErrorMessage
              name="password"
              component="div"
              className="text-xs text-red-600 mt-2"
            />
          </div>

          <div>
            <label
              htmlFor="confirmPassword"
              className="block text-sm mb-2 dark:text-white"
            >
              Confirm New Password
            </label>
            <Field
              name="confirmPassword"
              type="password"
              className={`py-2.5 px-4 block w-full rounded-lg sm:text-sm 
            ${
              errors.confirmPassword && touched.confirmPassword
                ? "border-red-500 ring-red-500 focus:ring-red-500 focus:border-red-500"
                : touched.confirmPassword
                ? "border-teal-500 ring-teal-500 focus:ring-teal-500 focus:border-teal-500"
                : "border-gray-200"
            }
            focus:border-blue-500 focus:ring-blue-500 dark:bg-neutral-900 dark:border-neutral-700 dark:text-neutral-400`}
            />
            <ErrorMessage
              name="confirmPassword"
              component="div"
              className="text-xs text-red-600 mt-2"
            />
          </div>

          <button
            type="submit"
            disabled={!dirty || !isValid || isSubmitting}
            className="w-full py-3 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:pointer-events-none"
          >
            {isSubmitting ? "Resetting..." : "Reset Password"}
          </button>
        </Form>
      )}
    </Formik>
  );

  const renderSuccessStep = () => (
    <div className="p-4 sm:p-2 text-center overflow-y-auto">
        {/* Icon */}
        <span className="mb-4 inline-flex justify-center items-center size-11 rounded-full border-4 border-green-50 bg-green-100 text-green-500 dark:bg-green-700 dark:border-green-600 dark:text-green-100">
          <svg className="shrink-0 size-5" xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
            <path d="M11.251.068a.5.5 0 0 1 .227.58L9.677 6.5H13a.5.5 0 0 1 .364.843l-8 8.5a.5.5 0 0 1-.842-.49L6.323 9.5H3a.5.5 0 0 1-.364-.843l8-8.5a.5.5 0 0 1 .615-.09z"/>
          </svg>
        </span>
        {/* End Icon */}

        <h3  className="mb-2 text-xl font-bold text-gray-800 dark:text-neutral-200">
          Password successfully changed!
        </h3>
        <p className="text-gray-500 dark:text-neutral-500">
          You can now log in with your new password. If you have any issues, please contact support.
        </p>

        <div className="mt-6 flex justify-center gap-x-4">
          <Link to={"/login"} className="py-2 px-3 inline-flex items-center gap-x-2 text-sm font-medium rounded-lg border border-gray-200 bg-white text-gray-800 shadow-2xs hover:bg-gray-50 disabled:opacity-50 disabled:pointer-events-none focus:outline-hidden focus:bg-gray-50 dark:bg-transparent dark:border-neutral-700 dark:text-neutral-300 dark:hover:bg-neutral-800 dark:focus:bg-neutral-800" >
            Go to Login
          </Link>
        </div>
      </div>
  );

  return (
    <div className="w-full h-screen bg-gray-100 flex flex-row justify-center items-center mx-auto py-12 px-4 sm:px-6 md:py-20 lg:py-12 md:px-8">
      <div className="max-w-md shrink-0 grow bg-white border border-gray-200 rounded-xl shadow-2xs dark:bg-neutral-900 dark:border-neutral-700">
        <div className="p-4 sm:p-7">
          <div className={`text-center ${step === "success" ? "hidden" : ""}`}>
            <h1 className="block text-2xl font-bold text-gray-800 dark:text-neutral-200">
              Forgot password?
            </h1>
            <p className="mt-2 text-sm text-gray-600 dark:text-neutral-400">
              Remember your password?{" "}
              <Link
                className="text-blue-600 decoration-2 hover:underline focus:outline-hidden focus:underline font-medium dark:text-blue-500"
                to={-1}
              >
                Sign in here
              </Link>
            </p>
          </div>
          <div className="mt-5">
            {step === "email" && renderEmailStep()}
            {step === "code" && renderCodeStep()}
            {step === "newPassword" && renderNewPasswordStep()}
            {step === "success" && renderSuccessStep()}
          </div>
        </div>
      </div>
    </div>
  );
}
