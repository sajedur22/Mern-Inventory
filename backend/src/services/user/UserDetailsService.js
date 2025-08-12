import jwt from "jsonwebtoken";

export const UserDetailsService = async (req, DataModel) => {
    try {

        const token = req.cookies?.token;
        if (!token) {
            return { status: "fail", data: "Token not found in cookies" };
        }


        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const email = decoded.data;

        if (!email) {
            return { status: "fail", data: "Email not found in token" };
        }


        const data = await DataModel.findOne(
            { email },
            { _id: 0, firstName: 1, lastName: 1, email: 1 }
        );

        if (!data) {
            return { status: "fail", data: "User not found" };
        }

        return { status: "success", data };
    } catch (error) {
        return { status: "fail", data: error.message };
    }
};
