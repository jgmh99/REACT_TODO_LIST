import React from 'react'
import '../css/Footer.css'
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
const Footer = () => {

  return (
    <div id='footer'>
        <div className="About_Prj">
            <p className='center_txt'>Using Tool</p>
            <ul>
                <li>-React-</li>
                <li>-Firebase-</li>
                <li>-Mui-</li>
                <li>-Chart.js-</li>
            </ul>
        </div>
        <div className="Contact">
            <p className='center_txt'>Contact</p>
            <ul>
                <li><Link to="https://open.kakao.com/o/seSYbDag" target='_blank'>-카카오톡-</Link></li>
                <li><Link to='https://github.com/jgmh99' target='_blank'>-Github-</Link></li>
            </ul>
        </div>
        <div className="Made_by">
            <p className='center_txt'>제작자</p>
            <ul>
                <li>-제갈민혁-</li>
            </ul>
        </div>
    </div>
  )
}

export default Footer