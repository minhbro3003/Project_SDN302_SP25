import { useState, useEffect, useRef } from 'react';

const STORAGE_KEY = 'bookingNotifications';

export const useNotifications = () => {
    const [notifications, setNotifications] = useState([]);
    const notificationsRef = useRef([]);

    // Load notifications from localStorage on mount
    useEffect(() => {
        const loadNotifications = () => {
            const savedNotifications = localStorage.getItem(STORAGE_KEY);
            if (savedNotifications) {
                const parsedNotifications = JSON.parse(savedNotifications);
                // Filter out expired notifications (older than 1 year)
                const validNotifications = parsedNotifications.filter(noti => {
                    const notificationDate = new Date(noti.timestamp);
                    const oneYearAgo = new Date();
                    oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);
                    return notificationDate > oneYearAgo;
                });
                notificationsRef.current = validNotifications;
                setNotifications(validNotifications);
            }
        };

        loadNotifications();
    }, []);

    // Save notifications to localStorage whenever they change
    useEffect(() => {
        if (notifications.length > 0) {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(notifications));
        }
    }, [notifications]);

    const addNotification = (notification) => {
        const notificationWithTimestamp = {
            ...notification,
            timestamp: new Date().toISOString()
        };
        const updatedNotifications = [...notificationsRef.current, notificationWithTimestamp];
        notificationsRef.current = updatedNotifications;
        setNotifications(updatedNotifications);
    };

    return { notifications, addNotification };
}; 