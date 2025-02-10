import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    id: "",
    fullName: "",
    email: "",
    username: "",
    roles: [],
    isDeleted: false,
    access_token: "",
    refreshToken: "",
};

export const accountSlice = createSlice({
    name: "account",
    initialState,
    reducers: {
        updateAccount: (state, action) => {
            console.log("Payload received in Redux:", action.payload);
            const {
                _id = "",
                FullName = "",
                Email = "",
                Username = "",
                roleDetails = [],
                IsDelete = false,
                access_token = "",
                refreshToken = "",
            } = action.payload;

            state.id = _id;
            state.fullName = FullName;
            state.email = Email;
            state.username = Username;
            // Kiểm tra roleDetails trước khi map
            if (Array.isArray(roleDetails)) {
                state.roles = roleDetails.map((p) => p?.RoleName || "Unknown");
            } else {
                console.error("roleDetails is not an array:", roleDetails);
                state.roles = [];
            }
            state.isDeleted = IsDelete;
            state.access_token = access_token;
            state.refreshToken = refreshToken;
        },
        resetAccount: () => initialState,
    },
});

export const { updateAccount, resetAccount } = accountSlice.actions;
export default accountSlice.reducer;
