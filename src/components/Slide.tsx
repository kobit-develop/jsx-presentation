import React from 'react'
import { LayoutProps } from "../render"

export const Slide: React.FC<LayoutProps> = ({ children, ...props }) => <slide {...props}>{children}</slide>