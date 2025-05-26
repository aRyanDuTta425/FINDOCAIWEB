// Utility functions for making authenticated API calls

export const getAuthHeaders = (): HeadersInit => {
  const headers: HeadersInit = {
    'Content-Type': 'application/json'
  }
  
  if (typeof document !== 'undefined') {
    const token = document.cookie
      .split('; ')
      .find(row => row.startsWith('token='))
      ?.split('=')[1]
    
    if (token) {
      headers['Authorization'] = `Bearer ${token}`
    }
  }
  
  return headers
}

export const fetchWithAuth = async (url: string, options: RequestInit = {}) => {
  const headers = getAuthHeaders()
  
  return fetch(url, {
    ...options,
    headers: {
      ...headers,
      ...options.headers
    },
    credentials: 'include'
  })
}

// Helper function specifically for API calls that need auth
export const apiCall = async (endpoint: string, options: RequestInit = {}) => {
  try {
    const response = await fetchWithAuth(endpoint, options)
    
    if (!response.ok) {
      if (response.status === 401) {
        // Handle unauthorized access - redirect to login
        if (typeof window !== 'undefined') {
          window.location.href = '/login'
        }
        throw new Error('Session expired. Please log in again.')
      }
      
      // Try to get error message from response
      let errorMessage = `Request failed: ${response.statusText}`
      try {
        const errorData = await response.json()
        errorMessage = errorData.error || errorMessage
      } catch {
        // If can't parse JSON, use default message
      }
      
      throw new Error(errorMessage)
    }
    
    return await response.json()
  } catch (error) {
    console.error(`API call to ${endpoint} failed:`, error)
    throw error
  }
}
