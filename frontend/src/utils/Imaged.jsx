import React from 'react'
import { SiteName } from './functions'

export default function Imaged(props) {
  return (
    <img {...props} alt={SiteName} />
  )
}
