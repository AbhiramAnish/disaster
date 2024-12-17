import React, { useEffect, useState } from 'react'
import "./Home.css"
import axios from 'axios'
import LocationScreen from '../Constants/Maps';


function Home() {

  let [loc,SetLoc] = useState('wayanad');
  useEffect(()=>{
    axios.get(`https://api.tomorrow.io/v4/weather/realtime?location=${loc}&apikey=FvWrmQZWwEmpgFCd2BMyJVthCHMpW8rW`).then((response)=>{
      console.log(response.data.location);
    })
  },[loc])
  return (
    <div className='Container'>
        <LocationScreen/>
    </div>
  )
}

export default Home
