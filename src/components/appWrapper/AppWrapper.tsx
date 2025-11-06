import React from 'react'
import { BrowserRouter } from 'react-router-dom'
import LayoutWrapper from '../layoutWrapper/LayoutWrapper'

interface AppWrapperProps {
  children?: React.ReactNode
}

const AppWrapper = ({ children }: AppWrapperProps) => {
  return (
    <>
      <BrowserRouter>
        <LayoutWrapper>
          {children}
        </LayoutWrapper>
      </BrowserRouter>
    </>
  )
}

export default AppWrapper
