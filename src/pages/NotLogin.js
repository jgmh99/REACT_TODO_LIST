import React, { useState, useEffect } from 'react';
import Container from '@mui/material/Container';
import mainpage from '../img/mainpage.png';
import mainpage2 from '../img/mainpage2.png';
import mainpage3 from '../img/mainpage3.png';
import login from '../img/login.png'
import '../css/NotLogin.css';
import { Translate } from '@mui/icons-material';
import heroimg from '../img/bannerimg2.jpg'
import join_login from '../img/join_login.png'
import write_list from '../img/write_list.png'

const NotLogin = () => {
  const getStartBtn = () => {
    alert('버튼 눌림');
    // 추후 로그인 하는 창으로 이동 ㅇㅇ
  }
  
  return (
    <div >
      {/* hero-img */}
      <Container id='hero_img_con' sx={{display:'flex' , marginTop: '65px', maxWidth: 1100,  padding: '0'}}>
        <img src={heroimg} alt="heroImg" />
        <div id="herotxt"> 
          <p>Write your todolist.</p>
        </div>
        <div className="getStart_btn sign_up_btn">
            <button  onClick={getStartBtn}>Sign Up Now</button>
          </div>
      </Container>
      <Container id="asd" sx={{display:'flex'}}>
        <div className="mainpage_50_L">
          {/* 설명 1 */}
          <div className="small_txt">
            <p>Write down your to-dos</p>
          </div>
          {/* 설명 2 */}
          <div className="big_txt">
            <b>The perfect way of tracking your progress</b>
          </div>
          {/* 시작하기 버튼 */}
          <div className="getStart_btn">
            <button  onClick={getStartBtn}>Get Started!</button>
          </div>
          {/* txt만 있는 ㅇㅇ */}
          <div className="only_txt_box">
          "할 일 목록을 만들고 이를 실행하는 것은 성공의 기본이며, 이 과정에서 우리는 자신의 능력을 향상시키고, 하루하루를 의미있게 만들며, 목표를 향해 한 발짝씩 나아가게 됩니다. 그러나 중요한 것은 단순히 할 일을 나열하는 것이 아니라, 우선순위를 설정하고, 필요한 작업에 집중하며, 각각의 작업을 완료하는 데 필요한 시간과 에너지를 효율적으로 관리하는 것입니다. 이렇게 하면 우리는 자신의 시간을 최대한 활용하고, 생산성을 향상시키며, 목표 달성에 대한 만족감을 느낄 수 있습니다. 따라서 할 일 목록은 단순히 '해야 할 일'을 체크하는 도구가 아니라, 우리의 생활과 업무를 더욱 효과적으로 관리하고, 우리의 성장과 발전을 돕는 중요한 도구입니다."
          <br/>
          <span style={{float:'right'}}>- ChatGPT -</span>
          </div>
        </div>

        <div className="mainpage_50_R">
          
        </div>
      </Container>
      <Container id="how_to_use">
        <h1>How to use?</h1>

        <Container id='wrap_how_to_use'>

          <Container id="first_join">
            <img src={join_login} alt="join or login plz" />
            <div id='join_txt'>
              <div><p>1.Log in with your email and password!</p></div>
              <div><p>2.You can easily sign up and log in using Google, Apple, or Facebook.</p></div>
            </div>
          </Container>

          <Container id='sec_wirte'>
            <img src={write_list} alt="just write your TodoList" />
            <div className="write_txt">
              <div><p>1.Just login and enter Todolsit!</p></div>
              <div><p>2.You can also manage it with Completed, Incomplete, and All tabs.</p></div>
            </div>
          </Container>

        </Container>

      </Container>
    </div >
  );
};

export default NotLogin;

