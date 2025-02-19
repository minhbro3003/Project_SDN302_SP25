import styled from "styled-components";

export const RoomFormContainer = styled.div`
    padding: 20px;
    background: #fff;
    border-radius: 8px;
`;

export const FormTitle = styled.h2`
    font-size: 24px;
    font-weight: bold;
    margin-bottom: 20px;
`;

export const ImageUploadSection = styled.div`
    text-align: center;
`;

export const MainImagePreview = styled.div`
    width: 100%;
    height: 300px;
    background: #f0f0f0;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 8px;
    margin-bottom: 10px;
`;

export const MainImagePreviewImg = styled.img`
    max-width: 100%;
    max-height: 100%;
    border-radius: 8px;
`;

export const ThumbnailContainer = styled.div`
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
    justify-content: center;
    margin-bottom: 10px;
    padding-bottom: 10px; 
    border-bottom: 2px solid #ccc; 
`;

export const Thumbnail = styled.img`
    width: 60px;
    height: 60px;
    object-fit: cover;
    border-radius: 4px;
    cursor: pointer;
    border: 2px solid transparent;
    &:hover {
        border-color: #1890ff;
    }
`;

export const UploadBtn = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    margin-top: 10px;
`;

export const SubmitBtn = styled.button`
    width: 100%;
    background: #1890ff;
    border: none;
    font-size: 16px;
    padding: 10px;
    color: white;
    cursor: pointer;
    border-radius: 4px;

    &:hover {
        background: #40a9ff;
    }
`;
