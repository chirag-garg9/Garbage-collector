import React from "react";
import '../Home/Home.css';

const Footer = () => {
    const year = new Date().getFullYear();
    return (
        <div>
            <div className='footer'>
                <div className='footerContent footerContent-1'>  
                    <h4>Made with ❤️ by Accio Devs</h4>
                    <h2>Team Members</h2>
                    <ul>
                        <a href="https://github.com/chirag-garg9" target="_blank"><li>Chirag Garg</li></a>
                        <a href="https://github.com/codervoder69" target="_blank"><li>Harsh Sharma</li></a>
                        <a href="https://github.com/tusharpaik123" target="_blank"><li>Tushar Paik</li></a>
                    </ul>
                </div>
            </div>
            
        </div>

    )

}

export default Footer;