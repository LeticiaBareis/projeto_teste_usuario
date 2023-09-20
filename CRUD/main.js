'use strict'


const openModal = () => document.getElementById('modal')
    .classList.add('active')

const closeModal = () => {
    clearFields()
    document.getElementById('modal').classList.remove('active')
}

const getLocalStorage = () => JSON.parse(localStorage.getItem('db_user')) ?? []
const setLocalStorage = (dbUser) => localStorage.setItem('db_user', JSON.stringify(dbUser))


////
const createUser = (user) => {
    const dbUser = readUser()
    dbUser.push (user)
    setLocalStorage(dbUser)
}

const readUser = () => getLocalStorage()

const updateUser = (index, user) => {
    const dbUser = readUser()
    dbUser[index] = user
    setLocalStorage(dbUser)
}

const deleteUser = (index) => {
    const dbUser= readUser()
    dbUser.splice(index, 1)
    setLocalStorage(dbUser)
}
////

const isValidFields = () => {
    return document.getElementById('form').reportValidity()
}

const clearFields = () => {
    const fields= document.querySelectorAll('.modal-field')
    fields.forEach(field => field.value='')
    document.getElementById('nome').dataset.index = "new"
    document.querySelector('.modal-header>h2').textContent = 'Novo Usuário'
}

const saveUser = () => {
    if(isValidFields()) {
        const user = {
            nome: document.getElementById('nome').value,
            email: document.getElementById('email').value,
            senha: document.getElementById('senha').value,
            status: document.getElementById('status').value,
        }
        const index = document.getElementById('nome').dataset.index
        if(index == "new") {
            createUser(user)
            updateTable()
            closeModal()
        } else{
            updateUser(index, user)
            updateTable()
            closeModal()
        }
    }
}

const createRow = (user, index) => {
    const newRow = document.createElement('tr')
    newRow.innerHTML=`
                    <td>${user.nome}</td>
                    <td>${user.email}</td>
                    <td>
                        <button type="button" id="edit-${index}" class="button green">editar</button>
                        <button type="button" id="delete-${index}" class="button red">excluir</button>
                    </td>    `
    document.querySelector('#tableUser>tbody').appendChild(newRow)
}

const clearTable = () => {
    const rows = document.querySelectorAll('#tableUser>tbody tr')
    rows.forEach(row => row.parentNode.removeChild(row))
}

const updateTable = () => {
    const dbUser= readUser()
    clearTable()
    dbUser.forEach(createRow)
}

const fillFields = (user) => {
    document.getElementById('nome').value = user.nome
    document.getElementById('email').value = user.email
    document.getElementById('senha').value = user.senha
    document.getElementById('status').value = user.status
    document.getElementById('nome').dataset.index = user.index
}

const editUser = (index) => {
    const user = readUser()[index]
    user.index = index
    fillFields(user)
    document.querySelector('.modal-header>h2').textContent = `Editando ${user.nome}`
    openModal()
}

const editDelete = (event) => {
    if(event.target.type == 'button'){
        const [action, index] = event.target.id.split('-')

        if(action == 'edit') {
            editUser(index)
            
        } else{
            const user = readUser()[index]
            const response = confirm(`Deseja realmente excluir o usuário ${user.nome}?`)
            if(response) {
                deleteUser(index)
                updateTable()
            }
        }
    }
}

updateTable()

document.getElementById('cadastrarUsuario')
    .addEventListener('click', openModal)

document.getElementById('modalClose')
    .addEventListener('click', closeModal)

document.getElementById('salvar')
    .addEventListener('click', saveUser)

document.querySelector('#tableUser>tbody')
    .addEventListener('click', editDelete)

document.getElementById('cancelar')
    .addEventListener('click', closeModal)

