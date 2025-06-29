import React from 'react'

function Spinner() {
  return (
    // forme loading 
    <div className='flex justify-center items-center min-h-[200px]'>
      <div className='w-8 h-8 border-4 border-[#F37021] border-t-transparent rounded-full animate-spin'/>
    </div>
  )
}

export default Spinner
