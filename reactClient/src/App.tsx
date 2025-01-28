import { useState, useEffect } from "react"
import * as S from "./styles.ts"
import { Modal } from "./Modal/Modal.tsx"

interface Task {
    id: number
    tag: string
    title: string
    description: string
    priority: number
    deadline: Date
    completed: boolean
}

function App() {
  const [items, setItems] = useState<Task[]>([])
  const [openModal, setOpenModal] = useState(false)
  const [currentId, setCurrentId] = useState(-1)
  const [optionsModal, setOptionsModal] = useState('')

  const test : Task[] = [
    {
      id: 0,
      tag: 'estudo',
      title: 'Titulo 1',
      description: 'Esta eh uma descriçao',
      priority: 0,
      deadline: new Date(),
      completed: true 
    }
  ]
  useEffect(() => setItems(test),[])

  function handleDelete(id : number){
    setOpenModal(true)
    setCurrentId(id)
    setOptionsModal('delete')
  }

  function handleCreate(){
    setOpenModal(true)
    setOptionsModal('create')
  }

  function handleUpdate(id : number){
    setOpenModal(true)
    setCurrentId(id)
    setOptionsModal('update')
  }

  function handleRead(id : number){
    setOpenModal(true)
    setCurrentId(id)
    setOptionsModal('read')
  }
  return (
    <S.FullBody>
      <Modal setOpenModal={setOpenModal} id={currentId} openModal={openModal} optionModal={optionsModal}/>

      <S.ToDoContainer>
        <S.RowContainer>
          <h1>To do List</h1>
          <S.ButtonContainer onClick={handleCreate}>Adicionar tarefa</S.ButtonContainer>
        </S.RowContainer>
      <S.MainTable>
        <thead>
          <tr>
            <th></th>
            <th></th>
            <th>Tag</th>
            <th>Título</th>
            <th>Descrição</th>
            <th>Prioridade</th>
            <th>Prazo</th>
            <th>Concluído</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {items && items.map((each) => 
             (
              <tr key={each.id}>
                <S.ButtonTd onClick={() => handleRead(each.id)}>🔍</S.ButtonTd>
                <S.ButtonTd onClick={() => handleUpdate(each.id)}>📝</S.ButtonTd>
                <td>{each.tag}</td>
                <td>{each.title}</td>
                <td>{each.description}</td>
                <td>{each.priority}</td>
                <td>{each.deadline.toLocaleDateString()}</td>
                <td>{each.completed ? 'Concluído' : 'Pendente'}</td>
                <S.ButtonTd onClick={() => handleDelete(each.id)}>❌</S.ButtonTd>
              </tr>
            )
          )}
            
        </tbody>
      </S.MainTable>

      </S.ToDoContainer>
    </S.FullBody>
  )
}

export default App
