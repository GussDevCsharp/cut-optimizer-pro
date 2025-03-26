
"use client"

import * as React from "react"

const MOBILE_BREAKPOINT = 768

export function useIsMobile() {
  // Initialize with a default value
  const [isMobile, setIsMobile] = React.useState(false)

  React.useEffect(() => {
    // Function to check if viewport is mobile width
    const checkIsMobile = () => {
      setIsMobile(window.innerWidth < MOBILE_BREAKPOINT)
    }
    
    // Check if window is available (browser environment)
    if (typeof window !== 'undefined') {
      // Set initial value
      checkIsMobile()
      
      // Add event listener for resize
      window.addEventListener("resize", checkIsMobile)
      
      // Cleanup
      return () => window.removeEventListener("resize", checkIsMobile)
    }
    
    return undefined
  }, [])

  return isMobile
}
