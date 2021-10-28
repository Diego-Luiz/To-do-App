(
  function(){
    'strict'
    const database = new Database()
    const themeBtn = document.querySelector('.theme-btn')
    const checkboxInputNewtodo = document.querySelector('.list__item:first-child .gradient-checkbox')
    const todoList = document.querySelector('.todo-list')
    const filterButtons = document.querySelectorAll('.btns-filter')
    
    console.log(todoList)
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
      const todos = database.loadTodos()

      console.log(todos)
      for(let item of todos){
        todoList.appendChild(createDOMTodo(item))
      }
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

      li.className = "list__item"
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
    }
  }
)()