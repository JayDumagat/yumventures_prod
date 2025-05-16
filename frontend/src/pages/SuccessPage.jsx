import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import axios from "axios";

export default function SuccessPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const [status, setStatus] = useState("verifying"); // verifying | success | failed
  const [reference, setReference] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");

  // Extract sessionId from URL parameters
  const queryParams = new URLSearchParams(location.search);
  const sessionId = queryParams.get("sessionId");

  useEffect(() => {
    // Log for debugging
    console.log("Session ID from URL:", sessionId);
    
    // Handle missing or template session ID
    if (!sessionId) {
      setStatus("failed");
      setErrorMessage("No session ID found in URL");
      return;
    }

    // Check if sessionId is still the template variable (indicates error)
    if (sessionId === "{CHECKOUT_SESSION_ID}") {
      setStatus("failed");
      setErrorMessage("PayMongo didn't properly replace the session ID template");
      return;
    }

    // Make API call to verify the payment
    axios
      .post("/api/transactions/verify-session", { sessionId })
      .then((res) => {
        if (res.data.success) {
          setReference(res.data.reference);
          setStatus("success");
          // Redirect to home after 3s
          setTimeout(() => navigate("/"), 3000);
        } else {
          setStatus("failed");
          setErrorMessage(res.data.message || "Payment verification failed");
        }
      })
      .catch((error) => {
        setStatus("failed");
        setErrorMessage(
          error.response?.data?.message || 
          "Error connecting to server. Please try again."
        );
        console.error("Verification error:", error);
      });
  }, [sessionId, navigate]);

  // Message content based on status
  let title, message, btnText, btnLink;
  
  if (status === "verifying") {
    title = "Verifying Payment…";
    message = "Please wait while we confirm your payment.";
    btnText = null;
    btnLink = null;
  } else if (status === "success") {
    title = "Payment Successful! 🎉";
    message = reference
      ? `Your order reference is ${reference}. You will be redirected shortly.`
      : "Thank you for your purchase! Redirecting…";
    btnText = "Go to Home Now";
    btnLink = "/";
  } else {
    title = "Payment Verification Failed";
    message = errorMessage || "There was a problem confirming your payment. Please contact support.";
    btnText = "Try Again";
    btnLink = "/cart";
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <div className="max-w-3xl flex flex-col mx-auto w-full">
        {/* HEADER */}
        <header className="mb-auto flex justify-center z-50 w-full py-4">
          <nav className="px-4 sm:px-6 lg:px-8">
            <Link
              className="flex-none text-xl font-semibold sm:text-3xl text-gray-800"
              to="/"
            >
              Yumventure
            </Link>
          </nav>
        </header>

        {/* MAIN */}
        <main id="content" className="flex-grow">
          <div className="text-center py-10 px-4 sm:px-6 lg:px-8">
            <h1 className="block text-5xl font-bold text-gray-800 sm:text-6xl">
              {title}
            </h1>
            <p className="mt-4 text-gray-600">{message}</p>
            
            {status === "verifying" && (
              <div className="mt-8 flex justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
              </div>
            )}

            {btnText && btnLink && (
              <div className="mt-6">
                <Link
                  to={btnLink}
                  className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                >
                  {btnText}
                </Link>
              </div>
            )}
          </div>
        </main>

        {/* FOOTER */}
        <footer className="mt-auto text-center py-5">
          <div className="max-w-[85rem] mx-auto px-4 sm:px-6 lg:px-8">
            <p className="text-sm text-gray-500">
              © Yumventure All Rights Reserved. {new Date().getFullYear()}
            </p>
          </div>
        </footer>
      </div>
    </div>
  );
}