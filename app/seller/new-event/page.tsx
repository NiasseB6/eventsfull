import React from 'react'
import EventForm from '@/components/EventForm'

export default function NewEventPage() {
  return (
    <div className='max-w-3xl mx-auto p-6'>
      <div className='bg-white rounded-lg overflow-hidden'>
        <div className='bg-gradient-to-r from-blue-600 to-blue-800 px-6 py-8 text-white'>
          <h2 className='text-2xl font-bold'> Créer un évènement</h2>
          <p className='text-blue-100 mt-2'>
            Enumere tes événements et commence à vendre des billets dès aujourd'hui.
          </p>
        </div>

        <div className='p-6'>
          <EventForm mode="create"/>
        </div>
      </div>
      
    </div>
  )
}


