import {styled} from 'styled-components'

export const FullBody = styled.main`
    display: flex;
    justify-content: center;
    width: 100%;
    height: 100vh;
    overflow: hidden;
    background-color: lightblue;
`


export const ToDoContainer = styled.section`
    width: 80%;
    display: flex;
    align-items: center;
    flex-direction: column;
    padding: 1em;
    background-color: white;
    border-radius: 50px;
    box-shadow: 2px 0px 50px black;
`

export const ButtonTd = styled.td`
    cursor: pointer;
`

export const MainTable = styled.table`
    border-collapse: collapse;
    width: 80%;
    text-align: center;
    vertical-align: middle;

    th {
        height: 50px;
    }
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

export const RowContainer = styled.span`
    display: flex;
    align-items: center;
    justify-content: space-evenly;
    width: 80%;
`