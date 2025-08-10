export const UserLoginService = async (email, password, DataModel) => {
    try {
        const matchStage = {
            $match: {
                email: email,
                password: password, // Note: Plain text password check is insecure; hash comparison recommended
            },
        };

        const projectStage = {
            $project: {
                _id: 0,
                email: 1,
                firstName: 1,
                lastName: 1,
                mobile: 1,
                photo: 1,
            },
        };

        const data = await DataModel.aggregate([matchStage, projectStage]);

        if (data.length > 0) {
            return data[0];
        } else {
            return null; // no user found
        }
    } catch (error) {
        throw error; // throw error to be caught in controller
    }
};
