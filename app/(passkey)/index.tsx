import React from 'react'
import { Redirect } from 'expo-router'

export default function index() {
  return (
    <Redirect href="/(passkey)/create_key" />
  )
}