import React, { useState, useRef, useEffect } from "react";
import { primaryColor } from "../utils/constants";

interface OtpInputProps {
  length?: number;
  onComplete: (otp: string) => void;
  onChange?: (otp: string) => void;
  error?: string;
  disabled?: boolean;
  autoFocus?: boolean;
}

const OtpInput: React.FC<OtpInputProps> = ({
  length = 4,
  onComplete,
  onChange,
  error,
  disabled = false,
  autoFocus = true,
}) => {
  const [otp, setOtp] = useState<string[]>(new Array(length).fill(""));
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    if (autoFocus && inputRefs.current[0]) {
      inputRefs.current[0].focus();
    }
  }, [autoFocus]);

  const handleChange = (index: number, value: string) => {
    // Only allow digits
    if (!/^\d*$/.test(value)) return;

    const newOtp = [...otp];

    // Handle pasted content
    if (value.length > 1) {
      const digits = value.slice(0, length).split("");
      for (let i = 0; i < length; i++) {
        newOtp[i] = digits[i] || "";
      }
      setOtp(newOtp);

      // Focus on the last filled input or the next empty one
      const lastFilledIndex = Math.min(digits.length - 1, length - 1);
      const nextIndex = Math.min(digits.length, length - 1);
      if (inputRefs.current[nextIndex]) {
        inputRefs.current[nextIndex].focus();
      }

      const otpString = newOtp.join("");
      onChange?.(otpString);
      if (otpString.length === length) {
        onComplete(otpString);
      }
      return;
    }

    // Handle single character input
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto-focus next input
    if (value && index < length - 1) {
      inputRefs.current[index + 1]?.focus();
    }

    const otpString = newOtp.join("");
    onChange?.(otpString);
    if (otpString.length === length) {
      onComplete(otpString);
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace") {
      if (!otp[index] && index > 0) {
        // If current input is empty, focus previous input
        inputRefs.current[index - 1]?.focus();
      } else {
        // Clear current input
        const newOtp = [...otp];
        newOtp[index] = "";
        setOtp(newOtp);
        onChange?.(newOtp.join(""));
      }
    } else if (e.key === "ArrowLeft" && index > 0) {
      inputRefs.current[index - 1]?.focus();
    } else if (e.key === "ArrowRight" && index < length - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleFocus = (index: number) => {
    // Select all text when focusing
    inputRefs.current[index]?.select();
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text").replace(/\D/g, "");

    if (pastedData.length > 0) {
      const digits = pastedData.slice(0, length).split("");
      const newOtp = new Array(length).fill("");

      for (let i = 0; i < digits.length; i++) {
        newOtp[i] = digits[i];
      }

      setOtp(newOtp);

      // Focus on the next empty input or the last input
      const nextIndex = Math.min(digits.length, length - 1);
      inputRefs.current[nextIndex]?.focus();

      const otpString = newOtp.join("");
      onChange?.(otpString);
      if (otpString.length === length) {
        onComplete(otpString);
      }
    }
  };

  return (
    <div className="otp-input-container">
      <div
        className="d-flex justify-content-center align-items-center"
        style={{ gap: "12px", marginBottom: "8px" }}
      >
        {otp.map((digit, index) => (
          <input
            key={index}
            ref={(ref) => (inputRefs.current[index] = ref)}
            type="text"
            inputMode="numeric"
            maxLength={1}
            value={digit}
            onChange={(e) => handleChange(index, e.target.value)}
            onKeyDown={(e) => handleKeyDown(index, e)}
            onFocus={() => handleFocus(index)}
            onPaste={handlePaste}
            disabled={disabled}
            className="form-control text-center"
            style={{
              width: "56px",
              height: "56px",
              fontSize: "24px",
              fontWeight: "700",
              borderRadius: "12px",
              border: error
                ? "2px solid #dc3545"
                : digit
                ? `2px solid ${primaryColor}`
                : "2px solid #e9ecef",
              backgroundColor: digit ? "#f8f9fa" : "white",
              transition: "all 0.3s ease",
              outline: "none",
              boxShadow: digit ? `0 2px 8px ${primaryColor}20` : "none",
            }}
            onFocus={(e) => {
              e.target.style.borderColor = primaryColor;
              e.target.style.boxShadow = `0 0 0 3px ${primaryColor}20`;
              handleFocus(index);
            }}
            onBlur={(e) => {
              e.target.style.borderColor = error
                ? "#dc3545"
                : digit
                ? primaryColor
                : "#e9ecef";
              e.target.style.boxShadow = digit
                ? `0 2px 8px ${primaryColor}20`
                : "none";
            }}
          />
        ))}
      </div>

      {error && (
        <div className="text-center">
          <small className="text-danger" style={{ fontSize: "12px" }}>
            {error}
          </small>
        </div>
      )}

      <div className="text-center mt-2">
        <small className="text-muted" style={{ fontSize: "12px" }}>
          Enter 4-digit verification code
        </small>
      </div>
    </div>
  );
};

export default OtpInput;
