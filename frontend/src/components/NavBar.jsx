import React from 'react'
import { Link } from "react-router-dom";

export default function NavBar() {
  return (
    <div className='flex gap-2 justify-between'>
        <div>
            <Link to="/">Home</Link>
        </div>
        <div className='flex gap-2 mr-4'>
            <Link to="/login">login</Link>
            <Link to="/subscribe">subscribe</Link>
            <Link to="/files">my files</Link>
        </div>
    </div>
  )
}
