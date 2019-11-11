import React from 'react'
import { LayoutProps } from '../buildTree'

export const Fragment: React.FC<
  Partial<LayoutProps>
> = ({ children, ...props }) => <fragment {...props}>{children}</fragment>