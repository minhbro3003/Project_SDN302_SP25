import axios from "axios";
import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";

const API_URL = process.env.REACT_APP_API_URL_BACKEND;

export const verifyPayment = async (queryParams) => {
    console.log("Sending verification request with params:", queryParams); // Log request params

    try {
        const res = await axios.post(`${API_URL}/transactions/verifypayment`, null, {
            params: queryParams, // Pass queryParams directly
        });

        console.log("Payment verification response:", res.data); // Log response
        return res.data;
    } catch (error) {
        console.error("Error verifying payment:", error);
        return { status: "ERR", message: error.response?.data?.message || "Verification failed" };
    }
};

export const usePaymentVerification = () => {
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        console.log("usePaymentVerification triggered. Current location:", location.search);

        const urlParams = new URLSearchParams(location.search);
        const queryParams = Object.fromEntries(urlParams.entries()); // Extract query params

        console.log("Extracted query params:", queryParams);

        // ✅ Ensure transactionID is correctly extracted
        let transactionID = queryParams.transactionID;
        if (transactionID && transactionID.includes("?")) {
            transactionID = transactionID.split("?")[0]; // Fix malformed transactionID
        }

        console.log("Cleaned Transaction ID:", transactionID);

        if (transactionID) {
            verifyPayment({ ...queryParams, transactionID }).then((response) => {
                console.log("Payment verification completed. Response:", response);

                // Disabled navigation for now
                // if (response.status === "OK") {
                //     navigate(`/payment-success/${transactionID}`);
                // } else {
                //     navigate(`/payment-failure/${transactionID}`);
                // }
            });
        } else {
            console.warn("No valid transaction ID found in query params.");
        }
    }, [navigate, location]);
};

const VerificationPage = () => {
    usePaymentVerification(); // <-- Call the hook here
    return <div>Verifying payment...</div>;
};

export default VerificationPage;
