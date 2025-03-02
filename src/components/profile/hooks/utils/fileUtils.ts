
import { PhotoManagementState } from '../types/photoManagementTypes';
import { useToast } from "@/hooks/use-toast";

export function handleFileSelect(
  e: React.ChangeEvent<HTMLInputElement>,
  setState: React.Dispatch<React.SetStateAction<PhotoManagementState>>
) {
  if (e.target.files && e.target.files.length > 0) {
    const newFiles = Array.from(e.target.files);
    
    setState(prev => {
      const updatedFiles = [...prev.selectedFiles, ...newFiles];
      const newPreviewUrls = newFiles.map(file => URL.createObjectURL(file));
      const updatedPreviewUrls = [...prev.previewUrls, ...newPreviewUrls];
      
      return {
        ...prev,
        selectedFiles: updatedFiles,
        previewUrls: updatedPreviewUrls
      };
    });
  }
}

export function handleRemovePhoto(
  index: number,
  setState: React.Dispatch<React.SetStateAction<PhotoManagementState>>
) {
  setState(prev => {
    // Revoke object URL to prevent memory leaks
    if (prev.previewUrls[index]) {
      URL.revokeObjectURL(prev.previewUrls[index]);
    }
    
    const newPreviewUrls = [...prev.previewUrls];
    newPreviewUrls.splice(index, 1);
    
    const newSelectedFiles = [...prev.selectedFiles];
    newSelectedFiles.splice(index, 1);
    
    return {
      ...prev,
      previewUrls: newPreviewUrls,
      selectedFiles: newSelectedFiles
    };
  });
}
