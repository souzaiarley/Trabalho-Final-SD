import * as S from './styles'

interface ModalProps {
    setOpenModal : (flag : boolean) => void
    id : number
    openModal : boolean
    optionModal : string
}
export function Modal({setOpenModal , id = -1, openModal, optionModal} : ModalProps){

    const DeleteForm = (
        <form>
            <h1>Form de delete</h1>
        </form>
    )
    const ReadView = (
        <form>
            <h1>Form de ler</h1>
        </form>
    )
    const UpdateForm = (
        <form>
            <h1>Form de att</h1>
        </form>
    )
    const CreateForm = (
        <form>
            <h1>Form de criar</h1>
        </form>
    )
    
    if (!openModal) return null
    return (
        <S.ModalMainDiv>
            <S.ModalList>
                <S.CloseButton onClick={() => setOpenModal(false)}>
                    ❌
                </S.CloseButton>
                {optionModal == 'create' && CreateForm}
                {optionModal == 'read' && id !== -1 && ReadView}
                {optionModal == 'update' && id !== -1 && UpdateForm}
                {optionModal == 'delete' && id !== -1 && DeleteForm}
            </S.ModalList>
        </S.ModalMainDiv>
    )
}