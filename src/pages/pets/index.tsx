import React from 'react'


import dynamic from 'next/dynamic'

const PetComponent  = dynamic(
  () => import( '~/components/PetsComponent'),
  { ssr: false }
)
function Index() {
  return (
 <>
 
<div className='bg-base-100 w-screen h-[calc(100vh-4rem)] overflow-x-hidden my-10 md:mt-0 md:mb-10'>
<PetComponent />
</div></>
  )
}

export default Index