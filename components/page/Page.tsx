import React from 'react'

const Page = ({children}: {children: React.ReactNode}) => {
  return (
    <div className='w-full flex flex-col items-center h-full bg-background relative'>
      {children}
    </div>
  )
}

export default Page
