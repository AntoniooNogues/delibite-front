"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';
import axiosClient from '../lib/axiosClient';
import { interfazUsuario } from '@/interfaces/users';

interface UserProfileContextType {
    user: interfazUsuario | null;
    setUser: React.Dispatch<React.SetStateAction<interfazUsuario | null>>;
    hasSubscription: boolean;
    setHasSubscription: React.Dispatch<React.SetStateAction<boolean>>;
}

const UserProfileContext = createContext<UserProfileContextType | undefined>(undefined);

export const UserProfileProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<interfazUsuario | null>(null);
    const [hasSubscription, setHasSubscription] = useState(false);

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const response = await axiosClient.get('/registro/getUsuario');
                setUser(response.data);
            } catch (error) {
                console.error('Error fetching user data:', error);
            }
        };

        const fetchSubscription = async () => {
            try {
                const response = await axiosClient.get('/suscripcion/validar');
                if (response) {
                    setHasSubscription(true);
                }
            } catch (error) {
                console.error('Error fetching subscription:', error);
            }
        };

        fetchUserData();
        fetchSubscription();
    }, []);

    return (
        <UserProfileContext.Provider value={{ user, setUser, hasSubscription, setHasSubscription }}>
            {children}
        </UserProfileContext.Provider>
    );
};

export const useUserProfile = () => {
    const context = useContext(UserProfileContext);
    if (!context) {
        throw new Error('useUserProfile must be used within a UserProfileProvider');
    }
    return context;
};