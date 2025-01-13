import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { jwtDecode } from 'jwt-decode';
import GoogleLogin from "../components/GoogleLogin";
import LinkedInLogin from "../components/LinkedinLogin";

const API_URL = process.env.REACT_APP_API_URL || '';

const SignupPage = () => {
    const [error, setError] = useState("");
    const [isOAuthLogin, setIsOAuthLogin] = useState(false);
    const [formData, setFormData] = useState({
        email: "",
        password: "",
        firstname: "",
        lastname: "",
        mobile: "",
        dob: "",
        addressInfo: "",
        city: "",
        state: "",
        pincode: "",
    });

    const navigate = useNavigate();

    // Handle LinkedIn callback
    useEffect(() => {
        const oauthData = localStorage.getItem('oauthData');
        if (oauthData) {
            const parsedData = JSON.parse(oauthData);
            setFormData(prev => ({
                ...prev,
                ...parsedData
            }));
            setIsOAuthLogin(true);
            localStorage.removeItem('oauthData');
        }
    }, []);

    const handleChange = (e) => {
        setFormData((prev) => ({
            ...prev,
            [e.target.name]: e.target.value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log(formData);
        const endpoint = "/users/signup";
        try {
            const response = await fetch(API_URL + endpoint, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(formData),
            });

            const data = await response.json();
            if (!response.ok) throw new Error(data.msg || "An error occurred");

            navigate("/verify", { state: { userId: data.email, number: data.number } });

            setError("");
        } catch (err) {
            setError(err.message);
        }
    };

    const handleGoogleResponse = (response) => {
        try {
            const decoded = jwtDecode(response.credential);
            console.log(decoded);
            setFormData((prev) => ({
                ...prev,
                email: decoded.email,
                firstname: decoded.given_name,
                lastname: decoded.family_name,
            }));
            setIsOAuthLogin(true);
        } catch (err) {
            console.error("Error decoding Google token", err);
        }
    };

    return (
        <div style={{ width: "100%", maxWidth: "400px", margin: "auto", padding: "24px" }}>
            {!isOAuthLogin ? (
                <>
                    <h2 style={{ fontSize: "24px", fontWeight: "bold", marginBottom: "24px" }}>Register</h2>
                    <div style={{ marginBottom: "24px"}}>
                        <GoogleLogin callback={handleGoogleResponse} />
                        <LinkedInLogin />
                    </div>
                    {error && <div style={{ color: "red", marginBottom: "16px" }}>{error}</div>}
                    <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                        <input
                            type="email"
                            name="email"
                            placeholder="Email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                            disabled={formData.email !== ""}
                            style={{ width: "100%", padding: "8px", border: "1px solid #ccc", borderRadius: "4px" }}
                        />
                        <input
                            type="password"
                            name="password"
                            placeholder="Password"
                            value={formData.password}
                            onChange={handleChange}
                            required
                            style={{ width: "100%", padding: "8px", border: "1px solid #ccc", borderRadius: "4px" }}
                        />
                        <input
                            type="text"
                            name="firstname"
                            placeholder="First Name"
                            value={formData.firstname}
                            onChange={handleChange}
                            required
                            disabled={formData.firstname !== ""}
                            style={{ width: "100%", padding: "8px", border: "1px solid #ccc", borderRadius: "4px" }}
                        />
                        <input
                            type="text"
                            name="lastname"
                            placeholder="Last Name"
                            value={formData.lastname}
                            onChange={handleChange}
                            required
                            disabled={formData.lastname !== ""}
                            style={{ width: "100%", padding: "8px", border: "1px solid #ccc", borderRadius: "4px" }}
                        />
                        <button
                            type="submit"
                            style={{
                                width: "100%",
                                padding: "12px",
                                backgroundColor: "#007bff",
                                color: "white",
                                border: "none",
                                borderRadius: "4px",
                                cursor: "pointer",
                            }}
                        >
                            Register
                        </button>
                    </form>
                    <button
                        style={{
                            width: "100%",
                            marginTop: "16px",
                            color: "#007bff",
                            backgroundColor: "transparent",
                            border: "none",
                            cursor: "pointer",
                        }}
                        onClick={() => navigate("/login")}
                    >
                        Have an account?
                    </button>
                </>
            ) : (
                <>
                    <div style={{ marginBottom: "24px", padding: "16px", backgroundColor: "#f1f1f1", borderRadius: "4px" }}>
                        <p style={{ fontSize: "18px", margin: "0" }}>
                            Hi, {formData.firstname}!
                        </p>
                        <p style={{ fontSize: "16px", margin: "0" }}>
                            Please fill the rest of the details
                        </p>
                        <p style={{ fontSize: "12px", margin: "0" }}>
                            Logged in as: {formData.email}
                        </p>
                    </div>
                    {error && <div style={{ color: "red", marginBottom: "16px" }}>{error}</div>}
                    <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                        <input
                            type="tel"
                            name="mobile"
                            placeholder="Mobile Number"
                            value={formData.mobile}
                            onChange={handleChange}
                            required
                            style={{ width: "100%", padding: "8px", border: "1px solid #ccc", borderRadius: "4px" }}
                        />
                        <input
                            type="date"
                            name="dob"
                            value={formData.dob}
                            onChange={handleChange}
                            style={{ width: "100%", padding: "8px", border: "1px solid #ccc", borderRadius: "4px" }}
                        />
                        <input
                            type="text"
                            name="addressInfo"
                            placeholder="Address"
                            value={formData.addressInfo}
                            onChange={handleChange}
                            required
                            style={{ width: "100%", padding: "8px", border: "1px solid #ccc", borderRadius: "4px" }}
                        />
                        <input
                            type="text"
                            name="city"
                            placeholder="City"
                            value={formData.city}
                            onChange={handleChange}
                            required
                            style={{ width: "100%", padding: "8px", border: "1px solid #ccc", borderRadius: "4px" }}
                        />
                        <input
                            type="text"
                            name="state"
                            placeholder="State"
                            value={formData.state}
                            onChange={handleChange}
                            required
                            style={{ width: "100%", padding: "8px", border: "1px solid #ccc", borderRadius: "4px" }}
                        />
                        <input
                            type="text"
                            name="pincode"
                            placeholder="Pincode"
                            value={formData.pincode}
                            onChange={handleChange}
                            required
                            style={{ width: "100%", padding: "8px", border: "1px solid #ccc", borderRadius: "4px" }}
                        />
                        <button
                            type="submit"
                            style={{
                                width: "100%",
                                padding: "12px",
                                backgroundColor: "#007bff",
                                color: "white",
                                border: "none",
                                borderRadius: "4px",
                                cursor: "pointer",
                            }}
                        >
                            Complete Registration
                        </button>
                    </form>
                </>
            )}
        </div>
    );
};

export default SignupPage;