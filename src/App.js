import './App.css';
import { LiveProvider, LiveEditor, LiveError, LivePreview } from "react-live";
import logo from './assets/codezilla.png';
import gptImgLogo from './assets/chatgptLogo.svg';
import { useEffect, useRef, useState } from 'react';
import { sendMessageToOpenAI } from './openai';
import sendBtn from './assets/send.svg';
import userIcon from './assets/user-icon.jpg';


function App() {
  const msgEnd = useRef(null);

  const [animation, setAnimation] = useState(false); //animation des 3 points
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([
    {
      text: "Hey ! Je suis Codezilla, ton assistant d'apprentissage au langages de programmation web. Alors n'hésite pas à me solliciter, je suis là pour toi !",
      isBot: true
    }
  ]);

  useEffect(() => {
    msgEnd.current.scrollIntoView();
  }, [messages])

  const handleSend = async() => {
    const text = input;
    setInput('');
    setMessages([
      ...messages,
      {text, isBot: false}
    ])
    setAnimation(true);
    const res = await sendMessageToOpenAI(input);
    setMessages([
      ...messages,  
      { text, isBot: false},
      { text: res, isBot: true}
    ])
    setAnimation(false);
  }

  const handleEnter = async(e) => {
    if(e.key === 'Enter') await handleSend();
  }
  
  return (
    <div className="App">
      <div className="navbar">
        <div className="navbarLeftSide">
          <h1 className='title'>&lt;CodeZilla</h1>
          <img src={logo} className="logo" alt="" />
          <h1>&gt;</h1>
        </div>
        <div className="navbarRightSide">
          <ul>
            <li><a href="#">Accueil</a></li>
            <li><a href="#">Cours</a></li>
            <li><a href="#">Exercices</a></li>
          </ul>
        </div>
      </div>
      <div className="main">
        <div className="mainLeftSide">
          <div className="code">
            <LiveProvider code="<h3 style={{
  background: 'darkslateblue',
  color: 'white',
  padding: 8,
  borderRadius: 4
}}>
  Hello World! 👋
</h3>">
              <div className="userCode">
                <h2>Code ici :</h2>
                <LiveEditor />
              </div>
              <div className="result">
                <h2>Résultat :</h2>
                <LiveError />
                <LivePreview />
              </div>
            </LiveProvider>
          </div>
        </div>
        <div className="mainRightSide">
          <div className="chats">
            {messages.map((message, i) => 
              <div key={i} className={message.isBot?"chat bot":"chat"}>
                <img className='chatImg' src={message.isBot?gptImgLogo:userIcon} alt="" /><p className="txt">{ message.text }</p>
              </div>
            )}
            <div ref={msgEnd}/>
          </div>
          <div className="chatFooter">
            <div className={animation?"loader loaderDisplay":"loader"}>
              <span className="firstDot">.</span>
              <span className="secondDot">.</span>
              <span className="thirdDot">.</span>
            </div>
            <div className="inp">
              <input type="text" placeholder='Envoyer un message...' value={input} onKeyDown={handleEnter} onChange={(e)=>{setInput(e.target.value)}}/><button className='send' onClick={handleSend}><img src={sendBtn} alt="Send" /></button>
            </div>
            <p>CodeZilla utilise ChatGPT qui peut produire des informations incorrectes.</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
