import React from 'react'

const PageBody = ({children}: {children: React.ReactNode}) => {
  return (
    <div className="flex-1 p-8 overflow-y-auto">
       <div className="max-w-6xl mx-auto space-y-8">
        {children}
       </div>
    </div>
  )
}

export default PageBody
