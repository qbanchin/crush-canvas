
import { PhotoManagementState } from '../types/photoManagementTypes';

export function handleOpenDialog(
  setState: React.Dispatch<React.SetStateAction<PhotoManagementState>>
) {
  setState(prev => ({
    ...prev,
    isOpen: true
  }));
}

export function handleCloseDialog(
  open: boolean,
  setState: React.Dispatch<React.SetStateAction<PhotoManagementState>>,
  userImages: string[]
) {
  setState(prev => ({
    ...prev,
    isOpen: open,
    editablePhotos: [...userImages],
    selectedFiles: [],
    previewUrls: []
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
