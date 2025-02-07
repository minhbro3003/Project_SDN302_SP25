import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    id: "",
    fullName: "",
    email: "",
    username: "",
    permissions: [],
    isDeleted: false,
    access_token: "",
    refreshToken: "",
};

export const accountSlice = createSlice({
    name: "account",  // Change name to "account"
    initialState,
    reducers: {
        updateAccount: (state, action) => {
            const {
                _id = "",
                FullName = "",
                Email = "",
                Username = "",
                permissionDetails = [],  
                IsDelete = false,
                access_token = "",
                refreshToken = "",
            } = action.payload;
        
            state.id = _id;
            state.fullName = FullName;
            state.email = Email;
            state.username = Username;
            state.permissions = permissionDetails.map(p => p.PermissionName); 
            state.isDeleted = IsDelete;
            state.access_token = access_token;
            state.refreshToken = refreshToken;
        },
        resetAccount: () => initialState,  
    },
});

export const { updateAccount, resetAccount } = accountSlice.actions;
export default accountSlice.reducer;
