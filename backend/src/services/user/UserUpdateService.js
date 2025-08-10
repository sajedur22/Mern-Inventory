import jwt from "jsonwebtoken";

export const UserUpdateService = async (Request, DataModel) => {
    try {
        // decode email from JWT cookie
        const token = Request.cookies.token;
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const email = decoded.data; // 'data' contains the email in your token

        let data = await DataModel.updateOne(
            { email: email },
            { $set: Request.body }
        );

        return { status: "success", data: data };
    } catch (error) {
        return { status: "fail", data: error.toString() };
    }
};
