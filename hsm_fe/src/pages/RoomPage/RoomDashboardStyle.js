import styled from "styled-components";

export const RoomDashboardContainer = styled.div`
    padding: 20px;
    display: flex;
    flex-direction: column;
`;

/* --- GRID ROOM LIST --- */
export const RoomGrid = styled.div`
    display: flex;
    justify-content: space-around;
`;

export const Rooms = styled.div`
    display: grid;
    grid-template-columns: repeat(6, 2fr);
    gap: 23px;
    padding: 20px;
`;

export const Room = styled.div`
    text-align: center;
    padding: 22px;
    font-size: 14px;
    font-weight: bold;
    color: white;
    border-radius: 5px;
    cursor: pointer;

    &.available {
        background-color: rgb(41, 207, 41);
    }
    &.taken {
        background-color: rgb(240, 98, 98);
    }
    &.booked {
        background-color: rgb(168, 168, 168);
    }
    &.other {
        background-color: rgb(49, 49, 49);
    }
`;

/* --- CALENDAR & FILTER SECTION --- */
export const CalendarSection = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
`;

export const DatePickerStyled = styled.div`
    width: 100%;
    margin-bottom: 15px;
`;

/* --- LEGEND STYLES --- */
export const Legend = styled.div`
    margin-top: 20px;
    padding: 10px;
    background: #fff;
    border-radius: 8px;
    width: 100%;

    .ant-badge {
        display: flex;
        align-items: center;
        margin-bottom: 8px;
    }
`;
