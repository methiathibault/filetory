import React from 'react'
import OkModal from '../components/OkModal'
import NotOkModal from '../components/NotOkModal'
import { useState } from 'react'

export default function Menu() {

  const [modal,showModal] = useState(false)
  const [modalErr,showModalErr] = useState(false)
  return (
    <>
    <div>Menu</div>
    <div><button onClick={() =>showModal(true)}>ok modal</button> <button onClick={()=>showModalErr(true)}> not ok modal</button></div>
    <NotOkModal isVisible={modalErr} onClose={() => showModalErr(false)} message={"ce message est un message de pas ok"}/>
    <OkModal isVisible={modal} onClose={() => showModal(false)}  message={"ce message est un message ok"}/>
    </>
  )
}
