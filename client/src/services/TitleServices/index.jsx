import { useEffect } from 'react';

const useDocumentTitle = (title) => {
  useEffect(() => {
    // Get the base title from the current document title
    const baseTitle = "GYMASSIST";
    
    // Set the new title
    document.title = title ? `${title} | ${baseTitle}` : baseTitle;

    // Cleanup function to reset title when component unmounts
    return () => {
      document.title = baseTitle;
    };
  }, [title]);
};

export default useDocumentTitle; 