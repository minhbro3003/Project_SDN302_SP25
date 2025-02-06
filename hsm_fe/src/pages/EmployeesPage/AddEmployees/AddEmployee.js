import React from 'react';


import {
    AddEmployeesPage,
    Card,
    Label,
    Input,
    RadioGroup,
    RadioGroupItem,
    Textarea,
} from "./style";
// Main component
const AddEmployees = () => {
    return (
        <AddEmployeesPage>
            <Card>
                <div>
                    <Label style={{ fontSize: "20px" }} htmlFor="employeeName">Employee Name</Label>
                    <Input id="employeeName" placeholder="Input" />
                </div>

                <div style={{ marginTop: "30px" }}>
                    <Label style={{ fontSize: "20px" }} htmlFor="address">Address</Label>
                    <Input id="address" placeholder="Input" />
                </div>

                <div style={{ marginTop: "30px", display: "flex", gap: "20px" }}>
                    <div style={{ display: "flex", flexDirection: "column", flex: 1 }}>
                        <Label style={{ fontSize: "20px" }} htmlFor="email">Email</Label>
                        <Input id="email" placeholder="Input" />
                    </div>
                    <div style={{ display: "flex", flexDirection: "column", flex: 1 }}>
                        <Label style={{ fontSize: "20px" }} htmlFor="phone">Phone</Label>
                        <Input id="phone" placeholder="Input" />
                    </div>
                </div>

                <div style={{ marginTop: "30px" }}>
                    <Label style={{ fontSize: "20px" }}>Gender</Label>
                    <RadioGroup>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <RadioGroupItem id="female" type="radio" value="female" name="gender" />
                            <Label htmlFor="female">Female</Label>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <RadioGroupItem id="male" type="radio" value="male" name="gender" />
                            <Label htmlFor="male">Male</Label>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <RadioGroupItem id="notSay" type="radio" value="notSay" name="gender" />
                            <Label htmlFor="notSay">Rather not say</Label>
                        </div>
                    </RadioGroup>
                </div>

                <div style={{ marginTop: "30px" }}>
                    <Label style={{ fontSize: "20px" }}>Employment Type</Label>
                    <RadioGroup>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <RadioGroupItem id="female" type="radio" value="fulltime" name="job" />
                            <Label htmlFor="female">Full Time</Label>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <RadioGroupItem id="male" type="radio" value="parttime" name="job" />
                            <Label htmlFor="male">Part Time</Label>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <RadioGroupItem id="notSay" type="radio" value="contract" name="job" />
                            <Label htmlFor="notSay">Contract</Label>
                        </div>
                    </RadioGroup>
                </div>

                <div>
                    <Label style={{ fontSize: "20px", marginTop: "30px", marginBottom: "10px" }} htmlFor="additionalInfo">Additional Information</Label>
                    <Textarea id="additionalInfo" placeholder="Additional Information" />
                </div>

                <button>Submit</button>
            </Card>
        </AddEmployeesPage>
    );
};

export default AddEmployees;
