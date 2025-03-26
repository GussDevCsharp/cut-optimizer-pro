
"use client"

import React from "react"

const MOBILE_BREAKPOINT = 768

export function useIsMobile() {
  // Initialize with false as default value to prevent undefined during initial render
  const [isMobile, setIsMobile] = React.useState(false)

  React.useEffect(() => {
    // Function to check if viewport is mobile width
    const checkIsMobile = () => {
      setIsMobile(window.innerWidth < MOBILE_BREAKPOINT)
    }
    
    // Set initial value
    checkIsMobile()
    
    // Add event listener for resize
    window.addEventListener("resize", checkIsMobile)
    
    // Cleanup
    return () => window.removeEventListener("resize", checkIsMobile)
  }, [])

  return isMobile
}
