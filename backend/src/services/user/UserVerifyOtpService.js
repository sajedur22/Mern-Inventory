import jwt from 'jsonwebtoken';

export const UserVerifyOtpService = async (Request, DataModel, jwtSecret) => {
    try {
        const email = Request.params.email;
        const OTPCode = Request.params.otp;
        const status = 0;        // OTP unused
        const statusUpdate = 1;  // OTP used

        // Check if OTP exists and unused
        const otpDoc = await DataModel.findOne({ email, otp: OTPCode, status });
        if (!otpDoc) {
            return { status: "fail", data: "Invalid OTP Code" };
        }

        // Mark OTP as used
        otpDoc.status = statusUpdate;
        await otpDoc.save();

        // Generate a reset token valid for 15 minutes
        const resetToken = jwt.sign({ email }, jwtSecret, { expiresIn: '15m' });

        return { status: "success", data: { resetToken } };

    } catch (error) {
        return { status: "fail", data: error.toString() };
    }
};
