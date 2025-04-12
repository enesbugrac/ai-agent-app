import React from 'react'

const Page = ({children}: {children: React.ReactNode}) => {
  return (
    <div className='flex flex-col h-full bg-background'>
      {children}
    </div>
  )
}

export default Page
