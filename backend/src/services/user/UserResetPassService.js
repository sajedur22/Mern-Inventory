import jwt from "jsonwebtoken";

export const UserResetPassService = async (req, DataModel, jwtSecret) => {
    try {
        const resetToken = req.cookies.resetToken;
        const { password } = req.body;

        if (!resetToken) {
            return { status: 'fail', data: 'Reset token missing in cookie' };
        }
        if (!password) {
            return { status: 'fail', data: 'Password is required' };
        }

        let payload;
        try {
            payload = jwt.verify(resetToken, jwtSecret);
        } catch (err) {
            if (err.name === 'TokenExpiredError') {
                return { status: 'fail', data: 'Reset token expired' };
            }
            return { status: 'fail', data: 'Invalid reset token' };
        }

        const email = payload.email;

        const updateResult = await DataModel.updateOne({ email }, { password });

        if (updateResult.matchedCount === 0) {
            return { status: 'fail', data: 'User not found' };
        }

        return { status: 'success', data: 'Password reset successful' };

    } catch (error) {
        return { status: 'fail', data: error.toString() };
    }
};
