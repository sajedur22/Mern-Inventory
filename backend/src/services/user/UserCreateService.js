export const UserCreateService = async (req, DataModel) => {
    try {
        let PostBody = req.body;
        let data = await DataModel.create(PostBody);
        return { status: "success", data: data };
    } catch (error) {
        return { status: "fail", data: error.toString() };
    }
};
