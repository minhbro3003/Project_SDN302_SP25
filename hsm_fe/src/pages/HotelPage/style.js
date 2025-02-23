import styled from "styled-components";

export const FormContainer = styled.div`
//   max-width: 1000px;
//   margin: auto;
  padding: 15px;
  background: #fff;
  border-radius: 8px;
//   box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.1);
`;

export const RowContainer = styled.div`
  display: flex;
  gap: 20px;
  
  > .ant-form-item {
    flex: 1;
  }
`;

export const FullWidthItem = styled.div`
  width: 100%;
  
  > .ant-form-item {
    width: 100%;
  }
`;

export const FormTitle = styled.h2`
    font-size: 24px;
    font-weight: bold;
    margin-bottom: 20px;
`;