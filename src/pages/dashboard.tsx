import React from 'react'


import dynamic from 'next/dynamic'

const DashboardComponent  = dynamic(
  () => import( '~/components/Dashboard'),
  { ssr: false }
)
function Dashboard() {
  return (
 <DashboardComponent />
  )
}

export default Dashboard