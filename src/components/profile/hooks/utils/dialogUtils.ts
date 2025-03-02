
import { PhotoManagementState } from '../types/photoManagementTypes';

export function handleOpenDialog(
  userImages: string[],
  setState: React.Dispatch<React.SetStateAction<PhotoManagementState>>
) {
  setState(prev => ({
    ...prev,
    editablePhotos: [...userImages],
    selectedFiles: [],
    previewUrls: [],
    activeTab: "edit",
    isOpen: true
  }));
}

export function handleCloseDialog(
  setState: React.Dispatch<React.SetStateAction<PhotoManagementState>>
) {
  setState(prev => ({
    ...prev,
    isOpen: false
  }));
}

export function handleChangeTab(
  tab: string,
  setState: React.Dispatch<React.SetStateAction<PhotoManagementState>>
) {
  setState(prev => ({
    ...prev,
    activeTab: tab
  }));
}
