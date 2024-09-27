import React, {  } from 'react';
import axios from 'axios';


function HarvestsList(){
 

  axios.post('#',{
    harvestId:"h004",
    cropType :"wada",
    harvestDate:"2024-09-06",
    quantity :"10",
    quality :"best",
    unit : "WA-02"
  })
  .then((res) => console.log(res))
  .catch((err) => console.log(err))
  
      

  return (
    <div>
        
    </div>
  );
}

export default HarvestsList;
