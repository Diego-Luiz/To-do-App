class Database{
  constructor(){
    let id = localStorage.getItem('id')
    let theme = localStorage.getItem('theme')
    if(id === null){
      localStorage.setItem('id', 0)
    }
    if(theme === null){
      localStorage.setItem('theme', "dark-theme")
    }
  }
  getId(){
    return localStorage.getItem('id')
  }
  getTheme(){
    return localStorage.getItem('theme')
  }
  changeTheme(){
    let theme = this.getTheme()
    let newTheme = theme === "dark-theme" ? "light-theme" : "dark-theme"
    localStorage.setItem('theme', newTheme)
  }
  getNextId(){
    let currentId = parseInt(this.getId())
    return currentId++
  }
  createTodo(text){
    const todoId = this.getNextId()
    return {
      id:  "todo-id-" + todoId,
      content: text,
      completed: false,
      order: todoId
    }
  }
  addNewTodo(object){
    localStorage.setItem(object.id, JSON.stringify(object))
    localStorage.setItem('id', parseInt(this.getId()) + 1) 
  }
  loadTodos(){
    const id = this.getId()
    const todos = []
    for(let i = 0; i < id; i++){
      const item = localStorage.getItem('todo-id-'+i) 
      if(item !== null){
        todos.push(JSON.parse(item))
      }
    }
    return todos
  }
  deleteTodos(ids){
    try{
      ids.forEach(element => {
        localStorage.removeItem(element)
      });
    }
    catch(e){
      alert(e)
    }
  }
  changeStatus(id){
    const todo = JSON.parse(localStorage.getItem(id))
    todo.completed = !todo.completed
    localStorage.setItem(id, JSON.stringify(todo))
  }
  getTodo(id){
    return JSON.parse(localStorage.getItem(id))
  }
  changeOrder(idDraggedElement, idTargetElement){
    const draggedElement = this.getTodo(idDraggedElement)
    const targetElement = this.getTodo(idTargetElement)
    let orderDraggedElement = draggedElement.order
    draggedElement.order = targetElement.order
    targetElement.order = orderDraggedElement

    localStorage.setItem(draggedElement.id, JSON.stringify(draggedElement))
    localStorage.setItem(targetElement.id, JSON.stringify(targetElement))
  }
}