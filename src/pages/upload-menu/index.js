import React from 'react'

export default function uploadFile() {

  function handleSubmit(e) {
    e.preventDefault()
}
  return (
    <div>
      <button type="submit" onClick={handleSubmit}>Upload File</button>
    </div>
  )
}
