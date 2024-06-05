import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

import ProductVariantsForm from './DynamicForm/ProductVariantsForm'
import DynamicForm2 from './DynamicForm/DynamicForm2'
import DynamicForm from './DynamicForm/DynamicForm'
import Dynamic from './DynamicForm/Dynamic'

import FormNew from "./Form"

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      {/* <FormNew /> */}
      <ProductVariantsForm />
      {/* <DynamicForm2 /> */}
      {/* <DynamicForm /> */}
      {/* <Dynamic /> */}
    </>
  )
}

export default App
