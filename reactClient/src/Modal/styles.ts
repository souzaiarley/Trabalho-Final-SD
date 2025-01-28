import {styled} from 'styled-components'

export const ModalMainDiv = styled.div`
    width: 100%;
    height: 100%;
    background-color:rgba(0, 0, 0, 0.66);
    position: fixed;
    z-index: 100;
    display: flex;
    align-items: center;
    justify-content: center;
`

export const ModalList = styled.div`
    position: relative;
    width: 50%;
    height: 50%;
    background-color: white;
    border-radius: 15px;
    border: 1px solid #f4f5f6;
    color: black;
    display: flex;
    align-items: center;
    justify-content: center;
`
export const CloseButton = styled.button`
    all: unset;
    position: absolute;
    right: 1em;
    top: 1em;
    cursor: pointer;
`
export const ButtonContainer = styled.button`
    all: unset;
    padding: 1em;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: lightgreen;
    border-radius: 10px;
    font-weight: bolder;
    cursor: pointer;
    &:hover{
        background-color:rgb(60, 255, 0);
        transition: background-color 0.3s ease-in-out;
    }
`