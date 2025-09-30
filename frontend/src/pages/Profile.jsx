import { useNavigate } from "react-router-dom";
import {ErrorMessage, Field, Form, Formik} from "formik";
import {useRef, useState} from "react";
import {Upload} from "lucide-react";
import {toast} from "react-toastify";
import {Link} from "react-router-dom";
import useAuthStore from "../stores/useAuthStore";
import {profileValidationSchema} from "../validations/ProfileValidation";

export default function Profile() {
    const {user, updateProfile} = useAuthStore();
    const fileInputRef = useRef(null);
    const navigate = useNavigate();
    const [imagePreview, setImagePreview] = useState(null);

    if (!user) {
        return <div>Loading profile...</div>;
    }
    return (
        <>
            {/* Card Section */}
            <div className="max-w-4xl px-4 py-10 sm:px-6 lg:px-8 mx-auto">{/* Card */}
                <div className="bg-white rounded-xl shadow-xs p-4 sm:p-7 dark:bg-neutral-800">
                    <div className="mb-8">
                        <h2 className="text-xl font-bold text-gray-800 dark:text-neutral-200">
                            Profile
                        </h2>
                        <p className="text-sm text-gray-600 dark:text-neutral-400">
                            Manage your name, password and account settings.
                        </p>
                    </div>

                    <Formik
                        initialValues={{
                            image: null,
                            password: "",
                        }}
                        validationSchema={profileValidationSchema}
                        onSubmit={async (values, {setSubmitting, resetForm}) => {
                            console.log('Profile form values:', values); // Same debug as menu item
                            try {
                                setSubmitting(true); // Same pattern as menu item

                                const formData = new FormData();

                                // Add image first (same order as menu item)
                                if (values.image) {
                                    formData.append("profileImage", values.image);
                                }

                                // Add password if provided
                                if (values.password && values.password.trim() !== '') {
                                    formData.append("newPassword", values.password.trim());
                                }

                                // Debug FormData contents (same as menu item)
                                console.log('=== FORMDATA DEBUG ===');
                                for (let [key, value] of formData.entries()) {
                                    if (value instanceof File) {
                                        console.log(`${key}: FILE - ${value.name} (${value.type}, ${value.size} bytes)`);
                                    } else {
                                        console.log(`${key}: ${value}`);
                                    }
                                }
                                console.log('=== END FORMDATA DEBUG ===');

                                await updateProfile(formData);

                                toast.success("Profile updated successfully!");
                                resetForm();
                                if (values.image) {
                                    setImagePreview(URL.createObjectURL(values.image));
                                }
                            } catch (error) {
                                toast.error("Failed to update profile: " + error.message);
                            } finally {
                                setSubmitting(false);
                            }
                        }}
                    >
                        {({setFieldValue, isSubmitting}) => (
                            <Form>
                                {/* Grid */}
                                <div className="grid sm:grid-cols-12 gap-2 sm:gap-6">
                                    <div className="sm:col-span-3">
                                        <label
                                            className="inline-block text-sm text-gray-800 mt-2.5 dark:text-neutral-200">
                                            Profile photo
                                        </label>
                                    </div>
                                    {/* End Col */}

                                    <div className="sm:col-span-9">
                                        <div className="flex items-center gap-5">
                                            <img
                                                className="inline-block size-16 rounded-full ring-2 ring-white dark:ring-neutral-900"
                                                src={
                                                    imagePreview
                                                        ? imagePreview
                                                        : user?.profileImage
                                                            ? `${user.profileImage}`
                                                            : "https://preline.co/assets/img/160x160/img1.jpg"
                                                } alt="Profile"/>
                                            <div className="flex gap-x-2">
                                                <div>
                                                    <button type="button" onClick={() => fileInputRef.current.click()}
                                                            className="py-2 px-3 inline-flex items-center gap-x-2 text-sm font-medium rounded-lg border border-gray-200 bg-white text-gray-800 shadow-2xs hover:bg-gray-50 disabled:opacity-50 disabled:pointer-events-none focus:outline-hidden focus:bg-gray-50 dark:bg-transparent dark:border-neutral-700 dark:text-neutral-300 dark:hover:bg-neutral-800 dark:focus:bg-neutral-800">
                                                        <Upload className="shrink-0 size-4"/>
                                                        Upload photo
                                                        <input
                                                            type="file"
                                                            ref={fileInputRef}
                                                            accept="image/*"
                                                            className="hidden"
                                                            onChange={(e) => {
                                                                const file = e.target.files[0];
                                                                if (file) {
                                                                    setFieldValue("image", file);
                                                                    setImagePreview(URL.createObjectURL(file));
                                                                }
                                                            }}
                                                        />
                                                    </button>
                                                    <ErrorMessage
                                                        name="image"
                                                        component="div"
                                                        className="text-red-500 text-sm mt-1"
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    {/* End Col */}

                                    <div className="sm:col-span-3">
                                        <label htmlFor="fullName"
                                               className="inline-block text-sm text-gray-800 mt-2.5 dark:text-neutral-200">
                                            Full name
                                        </label>

                                    </div>
                                    {/* End Col */}

                                    <div className="sm:col-span-9">
                                        <div className="sm:flex">
                                            <input id="firstName" type="text"
                                                   className="py-1.5 sm:py-2 px-3 pe-11 block w-full border-gray-200 shadow-2xs -mt-px -ms-px first:rounded-t-lg last:rounded-b-lg sm:first:rounded-s-lg sm:mt-0 sm:first:ms-0 sm:first:rounded-se-none sm:last:rounded-es-none sm:last:rounded-e-lg sm:text-sm relative focus:z-10 focus:border-blue-500 focus:ring-blue-500 checked:border-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-800 dark:border-neutral-700 dark:text-neutral-400 dark:placeholder-neutral-500 dark:focus:ring-neutral-600"
                                                   value={user.firstName} readOnly={true} disabled/>
                                            <input id="lastName" type="text"
                                                   className="py-1.5 sm:py-2 px-3 pe-11 block w-full border-gray-200 shadow-2xs -mt-px -ms-px first:rounded-t-lg last:rounded-b-lg sm:first:rounded-s-lg sm:mt-0 sm:first:ms-0 sm:first:rounded-se-none sm:last:rounded-es-none sm:last:rounded-e-lg sm:text-sm relative focus:z-10 focus:border-blue-500 focus:ring-blue-500 checked:border-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-800 dark:border-neutral-700 dark:text-neutral-400 dark:placeholder-neutral-500 dark:focus:ring-neutral-600"
                                                   value={user.lastName} readOnly={true} disabled/>
                                        </div>
                                    </div>
                                    {/* End Col */}

                                    <div className="sm:col-span-3">
                                        <label htmlFor="af-account-email"
                                               className="inline-block text-sm text-gray-800 mt-2.5 dark:text-neutral-200">
                                            Email
                                        </label>
                                    </div>
                                    {/* End Col */}

                                    <div className="sm:col-span-9">
                                        <input id="af-account-email" type="email"
                                               className="py-1.5 sm:py-2 px-3 pe-11 block w-full border-gray-200 shadow-2xs sm:text-sm rounded-lg focus:border-blue-500 focus:ring-blue-500 checked:border-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-800 dark:border-neutral-700 dark:text-neutral-400 dark:placeholder-neutral-500 dark:focus:ring-neutral-600"
                                               value={user.email} readOnly={true} disabled/>
                                    </div>
                                    {/* End Col */}

                                    <div className="sm:col-span-3">
                                        <label htmlFor="af-account-password"
                                               className="inline-block text-sm text-gray-800 mt-2.5 dark:text-neutral-200">
                                            Password
                                        </label>
                                    </div>
                                    {/* End Col */}

                                    <div className="sm:col-span-9">
                                        <div className="space-y-2">
                                            <Field
                                                name="password"
                                                type="password"
                                                placeholder="Enter new password"
                                                className="py-1.5 sm:py-2 px-3 pe-11 block w-full border-gray-200 shadow-2xs rounded-lg sm:text-sm focus:border-blue-500 focus:ring-blue-500 checked:border-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-800 dark:border-neutral-700 dark:text-neutral-400 dark:placeholder-neutral-500 dark:focus:ring-neutral-600"
                                            />
                                            <ErrorMessage
                                                name="password"
                                                component="div"
                                                className="text-red-500 text-sm mt-1"
                                            />
                                        </div>
                                    </div>
                                    {/* End Col */}


                                </div>
                                {/* End Grid */}

                                <div className="mt-5 flex justify-end gap-x-2">
                                    <button onClick={() => navigate(-1)}
                                          className=" py-2 px-3 inline-flex items-center gap-x-2 text-sm font-medium rounded-lg border border-gray-200 bg-white text-gray-800 shadow-2xs hover:bg-gray-50 disabled:opacity-50 disabled:pointer-events-none focus:outline-hidden focus:bg-gray-50 dark:bg-transparent dark:border-neutral-700 dark:text-neutral-300 dark:hover:bg-neutral-800 dark:focus:bg-neutral-800">
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={isSubmitting}
                                        className="py-2 px-3 inline-flex items-center gap-x-2 text-sm font-medium rounded-lg border border-transparent bg-blue-600 text-white hover:bg-blue-700 focus:outline-hidden focus:bg-blue-700 disabled:opacity-50 disabled:pointer-events-none"
                                    >
                                        {isSubmitting ? "Saving..." : "Save Changes"}
                                    </button>
                                </div>
                            </Form>
                        )}
                    </Formik>
                </div>
                {/* End Card */}
            </div>
            {/* End Card Section */}
        </>
    );
};
