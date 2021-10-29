class Database{
  constructor(){
    let id = localStorage.getItem('id')
    if(id === null){
      localStorage.setItem('id', 0)
    }
  }
  getId(){
    return localStorage.getItem('id')
  }
  getNextId(){
    let currentId = parseInt(this.getId())
    return "todo-id-" + currentId++
  }
  createTodo(text){
    return {
      id: this.getNextId(),
      content: text,
      active: true,
      completed: false
    }
  }
  addNewTodo(object){
    localStorage.setItem(object.id, JSON.stringify(object))
    localStorage.setItem('id', parseInt(this.getId()) + 1) 
  }
  loadTodos(){
    let listLength = localStorage.length
    const todos = []
    for(let i = 0; i < listLength; i++){
      const item = localStorage.getItem('todo-id-'+i) 
      if(item !== null){
        todos.push(JSON.parse(item))
      }
    }
    return todos
  }
  deleteTodo(id){
    console.log('here to delete')
  }
  changeStatus(id){
    const todo = JSON.parse(localStorage.getItem(id))
    todo.active = !todo.active
    todo.completed = !todo.completed
    localStorage.setItem(id, JSON.stringify(todo))
  }
}