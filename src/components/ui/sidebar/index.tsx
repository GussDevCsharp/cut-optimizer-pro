
import { TooltipProvider } from "@/components/ui/tooltip"
import { cn } from "@/lib/utils"
import * as React from "react"

import { SidebarProvider, useSidebar } from "./SidebarContext"
import { SIDEBAR_WIDTH, SIDEBAR_WIDTH_ICON } from "./SidebarConstants"
import { Sidebar } from "./SidebarMain"
import {
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarInput,
  SidebarInset,
  SidebarRail,
  SidebarSeparator,
  SidebarTrigger
} from "./SidebarComponents"
import {
  SidebarGroup,
  SidebarGroupAction,
  SidebarGroupContent,
  SidebarGroupLabel
} from "./SidebarGroupComponents"
import {
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarMenuAction
} from "./SidebarMenuComponents"
import {
  SidebarMenuBadge,
  SidebarMenuSkeleton,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem
} from "./SidebarMenuUtilComponents"

// Wrapper component that provides the context
const SidebarProviderWrapper = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<typeof SidebarProvider>
>((props, ref) => {
  return (
    <SidebarProvider {...props} ref={ref}>
      <TooltipProvider delayDuration={0}>
        <div
          style={
            {
              "--sidebar-width": SIDEBAR_WIDTH,
              "--sidebar-width-icon": SIDEBAR_WIDTH_ICON,
              ...props.style,
            } as React.CSSProperties
          }
          className={cn(
            "group/sidebar-wrapper flex min-h-svh w-full has-[[data-variant=inset]]:bg-sidebar",
            props.className
          )}
        >
          {props.children}
        </div>
      </TooltipProvider>
    </SidebarProvider>
  )
})
SidebarProviderWrapper.displayName = "SidebarProvider"

export {
  SidebarProviderWrapper as SidebarProvider,
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupAction,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInput,
  SidebarInset,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuBadge,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSkeleton,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarRail,
  SidebarSeparator,
  SidebarTrigger,
  useSidebar,
}
