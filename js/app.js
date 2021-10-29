(
  function(){
    'strict'
    const database = new Database()
    const themeBtn = document.querySelector('.theme-btn')
    const checkboxInputNewtodo = document.querySelector('.default-box:first-child .gradient-checkbox')
    const todoList = document.querySelector('.todo-list')
    const filterButtons = document.querySelectorAll('.btns-filter')
    const clearCompletedBtn = document.querySelector('.clearCompleted-btn')
    
    todoList.addEventListener('click', manageTodo)
    clearCompletedBtn.addEventListener('click', clearCompletedTodos)

    filterButtons.forEach((element)=>{
      element.addEventListener('click', filterTodos)
    })
    filterTodos()

    if(themeBtn !== null && themeBtn !== undefined){
      themeBtn.addEventListener('click', changeTheme)
    }
    if(checkboxInputNewtodo !== null && checkboxInputNewtodo !== undefined){
      checkboxInputNewtodo.addEventListener('click', addNewTodo)
    }
    function filterTodos(event){
      clearTodos()
      const filter = event === undefined ? null : event.target
      if(filter !== null){
        const parentNodeChildren = filter.parentNode.children
        for(let element of parentNodeChildren){
          if(element.classList.contains('active')){
            element.classList.remove('active')
          }
        }
        filter.classList.add('active')
      }
      let filterParam = filter !== null ? filter.textContent.toLowerCase() : "all"
      let todos = database.loadTodos()
      const itemsLeft = document.getElementById('items-left')
      
      if(filterParam !== "all"){
        todos = todos.filter( element=> {
          if(filterParam === "active" && element.active === true){
            return element
          }
          else if(filterParam === "completed" && element.completed === true){
            return element
          }
        })
      }
      itemsLeft.value = todos.length
      for(let item of todos){
        todoList.appendChild(createDOMTodo(item))
      }
      
    }
    function clearTodos(){
      const inputNewtodo = document.querySelector('.todo-list__input.--input-newtodo')
      inputNewtodo.textContent = ""
      const children = todoList.children
      Array.from(children).forEach((element)=>{
        element.remove()
      })
    }
    function createDOMTodo(object){
      let {id, content, completed} = object

      const li = document.createElement('li')
      const input = document.createElement('input')
      const span = document.createElement('span')
      const label = document.createElement('label')
      const button = document.createElement('button')
      const buttonSpan = document.createElement('span')
      const buttonImg = document.createElement('img')

      li.className = "default-box"
      input.type = "checkbox"
      input.value = content
      input.id = id
      input.className = "todo-list__input"

      span.className = "gradient-checkbox"
      span.ariaHidden = "true"
      label.className = "todo-list__label"
      label.for = id
      label.textContent = content
      if(completed){
        span.classList.add('--completed')
        label.classList.add('--completed')
      }

      button.className = "delete-todo-btn default-btn"
      button.type = "button"
      buttonSpan.className = "sr-only"
      buttonSpan.textContent = "Delete this to do"
      buttonImg.className = "delete-todo"
      buttonImg.src = "images/icon-cross.svg"
      buttonImg.ariaHidden = "true"

      button.appendChild(buttonSpan)
      button.appendChild(buttonImg)
      li.appendChild(input)
      li.appendChild(span)
      li.appendChild(label)
      li.appendChild(button)
  
      return li
    }
    function changeTheme(){
      const body = document.querySelector('body')
      const span = themeBtn.querySelector('span')
      const img = themeBtn.querySelector('img')
      let textSpan = ""
      let imgSrc = ""
      if(body.classList.contains('dark-theme')){
        textSpan = "Change to dark theme"
        imgSrc = "images/icon-moon.svg"
        body.classList.remove('dark-theme')
        body.classList.add('light-theme')
      }
      else{
        textSpan = "Change to light theme"
        imgSrc = "images/icon-sun.svg"
        body.classList.remove('light-theme')
        body.classList.add('dark-theme')
      }
      span.textContent = textSpan
      themeBtn.classList.add('--changeTheme')
      setTimeout(()=>{
        img.src = imgSrc
        themeBtn.classList.remove('--changeTheme')
      }, 150)
    }

    function addNewTodo(){
      const inputNewtodo = document.querySelector('.todo-list__input.--input-newtodo')
      const newTodo = database.createTodo(inputNewtodo.value.trim())
      database.addNewTodo(newTodo)
      filterTodos()
    }
    function manageTodo(event){
      const target = event.target || null
      if(target !== null && !target.classList.contains('default-box')){
        let id = ""
        let label = target
        let flagDelete = false
        if(target.classList.contains('todo-list__label')){
          id = label.for
        }
        else{
          label = target.parentNode.querySelector('.todo-list__label')
          if(label === null){
            label = target.parentNode.parentNode.querySelector('.todo-list__label')
          }
          id = label.for
          if(!target.classList.contains('gradient-checkbox')){
            flagDelete = true
          }
        }
        
        if(flagDelete){
          database.deleteTodo(id)
          // filterTodos()
        }
        else{
          database.changeStatus(id)
          const gradient = label.parentNode.querySelector('.gradient-checkbox')
          gradient.classList.toggle('--completed')
          label.classList.toggle('--completed')
        }
      }
    }
    function clearCompletedTodos(){
      console.log('hello')
    }
  }
)()