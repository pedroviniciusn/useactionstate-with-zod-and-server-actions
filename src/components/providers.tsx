'use client'
import { Fragment } from "react"
import { Toaster } from "react-hot-toast"

const Providers = ({ children }: { children: React.ReactNode }) => {
  return (
    <Fragment>
      {children}
      <Toaster position="bottom-right" />
    </Fragment>
  )
}

export default Providers