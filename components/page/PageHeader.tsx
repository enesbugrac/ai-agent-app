import React from 'react'

interface PageHeaderProps {
    icon?: React.ReactNode | null;
    title?: string | React.ReactNode | null;
    subTitle?: string | React.ReactNode | null;
}

const PageHeader = ({icon = null, title, subTitle}: PageHeaderProps) => {
  return (
    <div className="z-10 h-16 w-full  border-b border-border  pl-6 pr-[10%] flex items-center justify-between">
    <div className="flex items-center gap-3">

        <div className="rounded bg-background flex items-center justify-center">
          {icon}
        </div>

      <div>
        <h1 className="text-primary font-medium text-sm">{title}</h1>
        <span className="text-secondary text-xs">{subTitle}</span>
      </div>
    </div>
  </div>
  )
}

export default PageHeader
