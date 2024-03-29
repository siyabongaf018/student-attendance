import './App.css'
import Attendace from './Components/Attendace'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import AttendaceRegister from './Components/AttendaceRegister'

function App() {
  /*{
  "attendance": [
    { "id": 1, "name": "John", "surname": "Mac", "group":"Samsung", "date": [] },
    { "id": 2, "name": "John 2", "surname": "Mac", "group":"Samsung", "date": [] },
    { "id": 3, "name": "John 3", "surname": "Mac", "group":"Samsung", "date": [] },
    { "id": 4, "name": "John 4", "surname": "Mac", "group":"Samsung", "date": [] },
    { "id": 5, "name": "John 5 ", "surname": "Mac", "group":"Samsung", "date": [] },
    { "id": 6, "name": "John 6", "surname": "Mac", "group":"Samsung", "date": [] },
    { "id": 7, "name": "John 7", "surname": "Mac", "group":"MICSITA", "date": [] },
    { "id": 8, "name": "John 8", "surname": "Mac", "group":"MICSITA", "date": [] },
    { "id": 9, "name": "John 9", "surname": "Mac", "group":"MICSITA", "date": [] },
    { "id": 10, "name": "John 10", "surname": "Mac", "group":"MICSITA", "date": [] },
    { "id": 11, "name": "John 11", "surname": "Mac", "group":"MICSITA", "date": [] },
    { "id": 12, "name": "John 12", "surname": "Mac", "group":"MICSITA", "date": [] }
  ]
}*/
  return ( 
    <>
    
    <BrowserRouter>
    
    <Routes>
    <Route path='/' element={<Attendace/>}></Route>
    <Route path='/register' element={<AttendaceRegister/>}></Route>
    
    </Routes>
    
    </BrowserRouter>
      
    </>
  )
}

export default App
