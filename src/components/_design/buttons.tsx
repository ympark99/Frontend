import styled from "@emotion/styled";
import { Colors } from "./colors"
import Loader from "react-loader-spinner";
import React, {useState} from 'react';

interface IButtonProps{
    type?: string;
}
export const Button: React.FC<IButtonProps> = ({ children, type }) => {

    const [buttonText, setButtonText] = useState(children);

    const loader = <Loader type="TailSpin" color = {type === "login" ? Colors.black : Colors.white} 
    height={30} width={30} timeout={0} radius={3}/>

    function loading() {
      setButtonText(loader);
    }

    const tagType = type==='login' ? 'login' : 'start';
    const styles = {
      'login': { weight : 'bold' , background: Colors.white, color: Colors.loginHover , 
      hoverBack : Colors.loginHover, hoverColor : Colors.white, disabledBack : Colors.loginDisabled,
      pressedBack : Colors.loginPressed },

      'start': { weight : 'normal', background: Colors.primary , color: Colors.white,
      hoverBack : Colors.white, hoverColor : Colors.primary, disabledBack : Colors.primarySemiLight,
      pressedBack : Colors.primaryDark}
    }

    const Button = styled.button`
      cursor : pointer;
      height: 52px;
      width: 160px;
      left: 289px;
      top: 1626px;
      border-radius: 20px;
      background-color: ${styles[tagType].background};
      color : ${styles[tagType].color};

      font-family: Spoqa Han Sans Neo;
      font-size: 16px;
      font-style: normal;
      font-weight: ${styles[tagType].weight};
      line-height: 19px;
      letter-spacing: 0em;
      text-align: center; 

      &:hover{
        background-color: ${styles[tagType].hoverBack};
        color: ${styles[tagType].hoverColor};
      }    

      &:active{
          background-color: ${styles[tagType].pressedBack};
          color: ${styles[tagType].color};
      }

      &:disabled{
        cursor : default;
        background-color: ${styles[tagType].disabledBack};
        color: ${Colors.white};
    }
    `;
    return (
      <Button onClick={loading}>{buttonText}</Button>
    )
  }