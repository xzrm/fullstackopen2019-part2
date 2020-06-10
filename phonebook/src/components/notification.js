import React from 'react'

const Notification = ({ message, className }) => {
    return (
      <div>
        {message === null
          ? <div></div>
          : <div className={className}>{message}</div>}
      </div>
    )
  }

export default  Notification 

