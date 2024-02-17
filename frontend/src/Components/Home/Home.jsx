import React from 'react';
import './Home.css';
import Footer from './Footer';

const Home=()=> {


    return (
      <>
          <div className='topContainer-homepage'>
            <div className='topContainerDark-homepage'>
              <div className='topContainerContent-homepage'>
                <div className='title-homepage'><h1 className='h1-homepage'>Garbage Collection</h1></div>
            </div>
              <div className='topContainerDarker-homepage'></div>
          </div></div>
          <dir className='topContainerVoid-homepage'></dir>
          <div className='container-homepage'>

          
          <div className='mainContainerContent'>
          <div className='mainContainerContent-1 mainContainerCard'><h2>Challenges in Garbage Collection Efficiency:</h2>
          <p>
              <ul>
            
            <li><strong>Poor Infrastructure: </strong> Many Indian cities lack proper waste management infrastructure, including inadequate garbage collection vehicles, insufficient storage facilities, and a lack of designated dumping sites. This results in irregular and incomplete garbage collection services.
            </li>
            <li> <strong>Inadequate Resources:</strong>  Municipalities often face budget constraints, limiting their ability to invest in modern waste collection equipment, personnel training, and maintenance of existing infrastructure. This leads to substandard garbage collection services and delays in addressing community needs.
            </li>
            <li> <strong>Lack of Systematic Approach:</strong>Garbage collection in India is often marred by a lack of systematic planning and coordination among stakeholders. Fragmented approaches to waste management result in overlapping responsibilities, inefficiencies, and gaps in service delivery.
            </li>
            <li> <strong>Informal Sector Dominance: </strong>  The dominance of the informal waste sector, comprising ragpickers and small-scale waste collectors, further complicates garbage collection efforts. While informal workers play a crucial role in recycling, their unregulated activities sometimes impede formal waste management initiatives.
            </li>
            <li> <strong>Cultural and Behavioral Factors:</strong>  Cultural attitudes towards waste disposal and cleanliness also contribute to the inefficiency of garbage collection in India. Improper disposal practices, such as littering and open dumping, remain prevalent due to a lack of awareness and enforcement of regulations.
            </li>   
            
            </ul>
          </p>
          </div>

          {/* <div className='mainContainerContent-2 mainContainerCard'><strong><h2>Reporting Potholes: Be the Change</h2></strong><br/>
          <p>Become an advocate for smoother roads by learning how to report potholes in your community. Potholepedia provides resources and guides on how to effectively communicate with local authorities, ensuring that the necessary repairs are made promptly.
          </p>
          </div> */}
          </div>

          {/* <div className="working">
            <h1>Components & Working</h1>
            <video width="900" controls>
                <source src={working} type="video/mp4" />
                Your browser does not support the video tag.
            </video>
            <img src={detection} alt="" />
            <img src={map} alt="" />
            <img src={pothole_details} alt="" />
          </div> */}
          </div>
          <Footer/>
      </>
    )
  }
  
  export default Home;
  