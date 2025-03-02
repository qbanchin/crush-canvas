
import React, { createContext, useContext, useState, ReactNode } from 'react';

export interface UserProfile {
  name: string;
  age: number;
  bio: string;
  location: string;
  images: string[];
  interests: string[];
}

export interface ProfileContextType {
  user: UserProfile;
  setUser: React.Dispatch<React.SetStateAction<UserProfile>>;
  loading: boolean;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
  currentImageIndex: number;
  setCurrentImageIndex: React.Dispatch<React.SetStateAction<number>>;
  showOnlineStatus: boolean;
  setShowOnlineStatus: React.Dispatch<React.SetStateAction<boolean>>;
  showActivity: boolean;
  setShowActivity: React.Dispatch<React.SetStateAction<boolean>>;
  distanceUnit: string;
  setDistanceUnit: React.Dispatch<React.SetStateAction<string>>;
  isEditProfileOpen: boolean;
  setIsEditProfileOpen: React.Dispatch<React.SetStateAction<boolean>>;
  editForm: {
    name: string;
    age: number;
    location: string;
  };
  setEditForm: React.Dispatch<React.SetStateAction<{
    name: string;
    age: number;
    location: string;
  }>>;
}

export const ProfileContext = createContext<ProfileContextType | undefined>(undefined);

export const useProfileContext = () => {
  const context = useContext(ProfileContext);
  
  if (!context) {
    throw new Error('useProfileContext must be used within a ProfileProvider');
  }
  
  return context;
};

export const ProfileProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile>({
    name: "",
    age: 0,
    bio: "",
    location: "Unknown location",
    images: [
      "/placeholder.svg",
    ],
    interests: []
  });
  
  const [loading, setLoading] = useState(true);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showOnlineStatus, setShowOnlineStatus] = useState(true);
  const [showActivity, setShowActivity] = useState(true);
  const [distanceUnit, setDistanceUnit] = useState("km");
  const [isEditProfileOpen, setIsEditProfileOpen] = useState(false);
  const [editForm, setEditForm] = useState({
    name: user.name,
    age: user.age,
    location: user.location
  });
  
  const value = {
    user,
    setUser,
    loading,
    setLoading,
    currentImageIndex,
    setCurrentImageIndex,
    showOnlineStatus,
    setShowOnlineStatus,
    showActivity,
    setShowActivity,
    distanceUnit,
    setDistanceUnit,
    isEditProfileOpen,
    setIsEditProfileOpen,
    editForm,
    setEditForm
  };
  
  return (
    <ProfileContext.Provider value={value}>
      {children}
    </ProfileContext.Provider>
  );
};
