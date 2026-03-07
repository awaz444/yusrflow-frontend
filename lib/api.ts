export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

export async function fetchFromApi(endpoint: string, options: RequestInit = {}) {
    const url = `${API_BASE_URL}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`;

    // Get token from localStorage if available
    const token = typeof window !== 'undefined' ? localStorage.getItem('accessToken') : null;

    const response = await fetch(url, {
        ...options,
        headers: {
            'Content-Type': 'application/json',
            ...(token && { 'Authorization': `Bearer ${token}` }), // Add token if available
            ...options.headers,
        },
    });

    if (!response.ok) {
        if (response.status === 401) {
            console.warn(`[Auth Debug] API ${endpoint} triggered 401. Current Path: ${typeof window !== 'undefined' ? window.location.pathname : 'server'}`);
            // Check if we are already on login page to avoid infinite redirect loops
            const isLoginPage = typeof window !== 'undefined' && window.location.pathname.includes('/auth/login');

            if (typeof window !== 'undefined' && !isLoginPage) {
                // Only clear and redirect if we actually had a token that expired, 
                // or if we're on a protected route without one
                localStorage.removeItem('accessToken');
                localStorage.removeItem('refreshToken');

                // Use a short timeout to allow current render cycle to finish before hard redirect
                setTimeout(() => {
                    window.location.href = '/auth/login';
                }, 100);
            }
            // Stop execution to avoid further errors before redirect happens
            throw new Error('Unauthorized: Redirecting to login...');
        }

        const errorBody = await response.text();
        throw new Error(`API Error: ${response.statusText} - ${errorBody}`);
    }

    // Try to parse as JSON, if it fails, return the text
    const contentType = response.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
        try {
            return await response.json();
        } catch (error) {
            console.error('Failed to parse JSON response:', error);
            throw new Error('Invalid JSON response from server');
        }
    } else {
        // If response is not JSON, throw error with the text
        const text = await response.text();
        throw new Error(`Expected JSON response but got: ${contentType || 'unknown'}. Response: ${text.substring(0, 100)}`);
    }
}

export async function downloadFile(endpoint: string, filename: string) {
    const url = `${API_BASE_URL}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`;
    const token = typeof window !== 'undefined' ? localStorage.getItem('accessToken') : null;

    try {
        const response = await fetch(url, {
            headers: {
                ...(token && { 'Authorization': `Bearer ${token}` }),
            },
        });

        if (!response.ok) {
            throw new Error(`Download failed: ${response.statusText}`);
        }

        const blob = await response.blob();
        const downloadUrl = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = downloadUrl;
        link.setAttribute('download', filename);
        document.body.appendChild(link);
        link.click();
        link.parentNode?.removeChild(link);
        window.URL.revokeObjectURL(downloadUrl);
    } catch (error) {
        console.error('File download error:', error);
        throw error;
    }
}

