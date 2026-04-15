import { useState, useCallback } from 'react';
import { useGoogleLogin } from '@react-oauth/google';

const FILE_NAME = 'promograd_sync.json';

export const useGoogleDriveSync = (
  onImport: (data: any) => void,
  getExportData: () => any
) => {
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [isSyncing, setIsSyncing] = useState(false);
  const [lastSync, setLastSync] = useState<Date | null>(null);

  const login = useGoogleLogin({
    onSuccess: (tokenResponse) => {
      setAccessToken(tokenResponse.access_token);
      // Perform initial sync after login
      syncWithDrive(tokenResponse.access_token);
    },
    scope: 'https://www.googleapis.com/auth/drive.file',
    onError: (error) => console.error('Login Failed:', error)
  });

  const findSyncFile = async (token: string) => {
    const response = await fetch(`https://www.googleapis.com/drive/v3/files?q=name='${FILE_NAME}' and trashed=false&spaces=drive`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    const data = await response.json();
    return data.files && data.files.length > 0 ? data.files[0] : null;
  };

  const uploadToDrive = async (token: string, fileId: string | null, content: string) => {
    const metadata = {
      name: FILE_NAME,
      mimeType: 'application/json'
    };

    const form = new FormData();
    form.append('metadata', new Blob([JSON.stringify(metadata)], { type: 'application/json' }));
    form.append('file', new Blob([content], { type: 'application/json' }));

    const url = fileId 
      ? `https://www.googleapis.com/upload/drive/v3/files/${fileId}?uploadType=multipart`
      : 'https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart';

    const method = fileId ? 'PATCH' : 'POST';

    await fetch(url, {
      method,
      headers: { Authorization: `Bearer ${token}` },
      body: form
    });
  };

  const downloadFromDrive = async (token: string, fileId: string) => {
    const response = await fetch(`https://www.googleapis.com/drive/v3/files/${fileId}?alt=media`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return await response.json();
  };

  const syncWithDrive = useCallback(async (tokenToUse?: string) => {
    const token = tokenToUse || accessToken;
    if (!token) return;

    setIsSyncing(true);
    try {
      const file = await findSyncFile(token);
      
      if (file) {
        // File exists, download and merge (or just import)
        // For simplicity, we'll download, import, then upload the merged state.
        // In a real app, we'd need conflict resolution. Here we just import.
        const remoteData = await downloadFromDrive(token, file.id);
        if (remoteData) {
          onImport(remoteData);
        }
      }

      // After importing (which updates local state), wait a bit then upload current state
      // Actually, getExportData should return the latest state.
      // Since onImport might be async/trigger re-renders, we might want to upload on the next cycle,
      // but for now we just upload what we have.
      const currentData = getExportData();
      await uploadToDrive(token, file ? file.id : null, JSON.stringify(currentData));
      
      setLastSync(new Date());
    } catch (error) {
      console.error('Sync failed:', error);
      // Token might be expired
      if (error instanceof Error && error.message.includes('401')) {
        setAccessToken(null);
      }
    } finally {
      setIsSyncing(false);
    }
  }, [accessToken, onImport, getExportData]);

  return {
    login,
    logout: () => setAccessToken(null),
    isConnected: !!accessToken,
    isSyncing,
    lastSync,
    syncWithDrive
  };
};
