import React, { useState, useRef } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { register as registerUser } from "../api";
import {
  Eye,
  EyeOff,
  User,
  Mail,
  Phone,
  Lock,
  Upload,
  ArrowRight,
  CheckCircle,
} from "lucide-react";

export default function Register() {
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm();

  const [profileImage, setProfileImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [registrationStep, setRegistrationStep] = useState(1);
  const fileInputRef = useRef(null);
  const password = useRef({});
  password.current = watch("password", "");

  const handleImageChange = (e) => {
    const file = e.target.files?.[0] || null;
    if (file) {
      setProfileImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const nextStep = () => {
    setRegistrationStep(2);
  };

  const prevStep = () => {
    setRegistrationStep(1);
  };

  const onSubmit = async (data) => {
    try {
      const formData = new FormData();
      formData.append("name", data.name);
      formData.append("email", data.email);
      formData.append("phone", data.phone);
      formData.append("password", data.password);
      if (profileImage) {
        formData.append("profile_image", profileImage);
      }

      await registerUser(formData);
      navigate("/login");
    } catch (error) {
      console.error("Registration failed:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-6 bg-white p-8 rounded-2xl shadow-xl border border-gray-100">
        <div className="text-center">
          <div className="mx-auto h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center">
            <User className="h-6 w-6 text-blue-600" />
          </div>
          <h2 className="mt-4 text-center text-3xl font-extrabold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
            {registrationStep === 1 ? "Create account" : "Almost there!"}
          </h2>
          <p className="mt-2 text-center text-sm text-gray-500">
            {registrationStep === 1
              ? "Join us today and experience the future of banking"
              : "Just a few more details to complete your profile"}
          </p>
        </div>

        {/* Progress indicator */}
        <div className="relative pt-1">
          <div className="flex mb-2 items-center justify-between">
            <div className="flex items-center">
              <div
                className={`w-8 h-8 flex items-center justify-center rounded-full ${
                  registrationStep >= 1
                    ? "bg-blue-600 text-white"
                    : "bg-gray-200 text-gray-600"
                }`}
              >
                1
              </div>
              <span className="ml-2 text-xs font-medium">Personal</span>
            </div>
            <div className="flex-1 mx-4">
              <div className="h-1 rounded-full overflow-hidden bg-gray-200">
                <div
                  className="h-full bg-blue-600 transition-all duration-300"
                  style={{ width: registrationStep === 1 ? "50%" : "100%" }}
                />
              </div>
            </div>
            <div className="flex items-center">
              <div
                className={`w-8 h-8 flex items-center justify-center rounded-full ${
                  registrationStep >= 2
                    ? "bg-blue-600 text-white"
                    : "bg-gray-200 text-gray-600"
                }`}
              >
                2
              </div>
              <span className="ml-2 text-xs font-medium">Security</span>
            </div>
          </div>
        </div>

        <form className="mt-6 space-y-5" onSubmit={handleSubmit(onSubmit)}>
          {registrationStep === 1 ? (
            <>
              <div>
                <label
                  htmlFor="name"
                  className="block text-sm font-medium text-gray-700"
                >
                  Full Name
                </label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <User className="h-4 w-4 text-gray-400" />
                  </div>
                  <input
                    {...register("name", {
                      required: "Full name is required",
                      minLength: {
                        value: 2,
                        message: "Name must be at least 2 characters",
                      },
                    })}
                    type="text"
                    className={`block w-full pl-10 pr-3 py-3 border ${
                      errors.name ? "border-red-300" : "border-gray-300"
                    } rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm transition duration-150`}
                    placeholder="John Doe"
                  />
                </div>
                {errors.name && (
                  <p className="mt-1 text-xs text-red-600">
                    {errors.name.message}
                  </p>
                )}
              </div>

              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700"
                >
                  Email Address
                </label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail className="h-4 w-4 text-gray-400" />
                  </div>
                  <input
                    {...register("email", {
                      required: "Email is required",
                      pattern: {
                        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                        message: "Invalid email address",
                      },
                    })}
                    type="email"
                    className={`block w-full pl-10 pr-3 py-3 border ${
                      errors.email ? "border-red-300" : "border-gray-300"
                    } rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm transition duration-150`}
                    placeholder="john@example.com"
                  />
                </div>
                {errors.email && (
                  <p className="mt-1 text-xs text-red-600">
                    {errors.email.message}
                  </p>
                )}
              </div>

              <div>
                <label
                  htmlFor="phone"
                  className="block text-sm font-medium text-gray-700"
                >
                  Phone Number
                </label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Phone className="h-4 w-4 text-gray-400" />
                  </div>
                  <input
                    {...register("phone", {
                      required: "Phone number is required",
                      pattern: {
                        value:
                          /^[+]?[(]?[0-9]{3}[)]?[-\s.]?[0-9]{3}[-\s.]?[0-9]{4,6}$/,
                        message: "Invalid phone number format",
                      },
                    })}
                    type="tel"
                    className={`block w-full pl-10 pr-3 py-3 border ${
                      errors.phone ? "border-red-300" : "border-gray-300"
                    } rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm transition duration-150`}
                    placeholder="+1234567890"
                  />
                </div>
                {errors.phone && (
                  <p className="mt-1 text-xs text-red-600">
                    {errors.phone.message}
                  </p>
                )}
              </div>

              <div>
                <button
                  type="button"
                  onClick={nextStep}
                  className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-150 shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
                >
                  Continue
                  <ArrowRight className="ml-2 h-4 w-4" />
                </button>
              </div>
            </>
          ) : (
            <>
              <div>
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-gray-700"
                >
                  Password
                </label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-4 w-4 text-gray-400" />
                  </div>
                  <input
                    {...register("password", {
                      required: "Password is required",
                      minLength: {
                        value: 8,
                        message: "Password must be at least 8 characters",
                      },
                      pattern: {
                        value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/,
                        message:
                          "Password must include uppercase, lowercase, and numbers",
                      },
                    })}
                    type={showPassword ? "text" : "password"}
                    className={`block w-full pl-10 pr-10 py-3 border ${
                      errors.password ? "border-red-300" : "border-gray-300"
                    } rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm transition duration-150`}
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4 text-gray-400" />
                    ) : (
                      <Eye className="h-4 w-4 text-gray-400" />
                    )}
                  </button>
                </div>
                {errors.password && (
                  <p className="mt-1 text-xs text-red-600">
                    {errors.password.message}
                  </p>
                )}
                {password.current && !errors.password && (
                  <div className="mt-2 flex items-center space-x-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <p className="text-xs text-green-500">Strong password</p>
                  </div>
                )}
              </div>

              <div>
                <label
                  htmlFor="profile_image"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Profile Image
                </label>
                <div
                  onClick={triggerFileInput}
                  className={`mt-1 flex flex-col justify-center items-center border-2 border-dashed ${
                    imagePreview
                      ? "border-blue-300 bg-blue-50"
                      : "border-gray-300"
                  } rounded-lg py-6 px-4 cursor-pointer hover:bg-gray-50 transition duration-150`}
                >
                  <input
                    type="file"
                    ref={fileInputRef}
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                  />

                  {imagePreview ? (
                    <div className="flex flex-col items-center">
                      <div className="w-24 h-24 rounded-full overflow-hidden mb-3 border-2 border-blue-500">
                        <img
                          src={imagePreview}
                          alt="Profile preview"
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <p className="text-sm text-blue-600">Change photo</p>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center">
                      <div className="mb-3 bg-gray-100 rounded-full p-3">
                        <Upload className="h-6 w-6 text-gray-500" />
                      </div>
                      <p className="text-sm text-gray-600">
                        Click to upload photo
                      </p>
                      <p className="text-xs text-gray-400 mt-1">
                        JPG, PNG, GIF up to 10MB
                      </p>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex space-x-3">
                <button
                  type="button"
                  onClick={prevStep}
                  className="w-1/3 py-3 px-4 border border-gray-300 text-sm font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-150"
                >
                  Back
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-2/3 flex justify-center items-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-150 shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
                >
                  {isSubmitting ? (
                    <>
                      <svg
                        className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      Creating...
                    </>
                  ) : (
                    "Create Account"
                  )}
                </button>
              </div>
            </>
          )}

          <div className="mt-4 text-center">
            <Link
              to="/login"
              className="text-sm text-blue-600 hover:text-blue-800 font-medium transition duration-150"
            >
              Already have an account? Sign in
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
