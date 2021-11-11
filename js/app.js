(
  function(){
    'strict'
    const database = new Database()
    const themeBtn = document.querySelector('.theme-btn')
    const inputNewtodo = document.querySelector('.todo-list__input.--input-newtodo')
    const todoList = document.querySelector('.todo-list')
    const filterButtons = document.querySelectorAll('.btns-filter')
    const clearCompletedBtn = document.querySelector('.clearCompleted-btn')
    const itemsLeft = document.getElementById('items-left')
    var draggedElementDropzone = null

    todoList.addEventListener('click', manageTodo)
    clearCompletedBtn.addEventListener('click', clearCompletedTodos)
    
    inputNewtodo.addEventListener('keyup', addNewTodo)

    filterButtons.forEach( (element) => {
      element.addEventListener('click', filterTodos)
    })

    filterTodos()

    if(themeBtn !== null && themeBtn !== undefined){
      themeBtn.addEventListener('click', changeTheme)
    }
    function filterTodos(event){
      let todos = database.loadTodos()
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
      
      
      if(filterParam !== "all"){
        todos = todos.filter( element=> {
          if(filterParam === "active" && element.completed === false){
            return element
          }
          else if(filterParam === "completed" && element.completed === true){
            return element
          }
        })
      }
      itemsLeft.textContent = todos.length
      todos.sort((a, b) => a.order - b.order)

      for(let item of todos){
        todoList.appendChild(createDOMTodo(item))
      }
      
    }
    
    function clearTodos(){
      inputNewtodo.value = ""
      const children = todoList.children
      Array.from(children).forEach((element)=>{
        element.remove()
      })
    }
    function createDOMTodo(object){
      let {id, content, completed, order} = object
      
      const div = document.createElement('div')
      const li = document.createElement('li')
      const input = document.createElement('input')
      const span = document.createElement('span')
      const label = document.createElement('label')
      const button = document.createElement('button')
      const buttonSpan = document.createElement('span')
      const buttonImg = document.createElement('img')
      
      div.id = "order-" + order
      div.className = "draggable-item"
      div.draggable = true
      
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
      div.appendChild(input)
      div.appendChild(span)
      div.appendChild(label)
      div.appendChild(button)
      li.appendChild(div)

      div.addEventListener('dragstart', dragStartTodo)
      li.addEventListener('dragover', dragOverDropzone)
      li.addEventListener('dragleave', dragLeaveDropzone)
      li.addEventListener('drop', dragDropDropzone)

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

    function addNewTodo(event){
      if(event.keyCode === 13){
        const newTodo = database.createTodo(inputNewtodo.value.trim())
        database.addNewTodo(newTodo)
        todoList.appendChild(createDOMTodo(newTodo))
        inputNewtodo.value = ""
        itemsLeft.textContent = parseInt(itemsLeft.textContent) + 1
      }
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
          if(target.classList.contains('delete-todo')){
            flagDelete = true
          }
        }
        
        if(flagDelete){
          const todo = document.getElementById(id).parentNode.parentNode
          database.deleteTodos([id])
          todo.style.animation = "deleteTodoAnimation .5s linear"
          todo.style.animationFillMode = "forwards"
          setTimeout(() => todo.remove(), 600)
          itemsLeft.textContent = parseInt(itemsLeft.textContent) - 1
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
      let todos = database.loadTodos()
      todos = todos.filter( element => element.completed)
      let ids = []
      for({id} of todos){
        ids.push(id)
      }
      database.deleteTodos(ids)
      filterTodos()
    }

    function dragStartTodo(event){
      const target = event.target
      event.dataTransfer.setData('Text',target.id)
      draggedElementDropzone = target.parentNode
      const draggableItems = document.querySelectorAll('.draggable-item')
      draggableItems.forEach(element => element.classList.add('not-droppable'))
    }
    function dragOverDropzone(event){
      event.preventDefault()
      event.target.style.outline = "dashed 2px white"
      event.target.style.outlineOffset = "-2px"
    }
    function dragLeaveDropzone(event){
      event.target.style.outline = ""
    }
    function dragDropDropzone(event){
      event.preventDefault()
      let draggedElementId = event.dataTransfer.getData('Text')
      const draggedElement = document.getElementById(draggedElementId)
      const dropzone = event.target
      const dropzoneDraggableItem = dropzone.querySelector('.draggable-item')

      //Replacing node elements
      dropzone.replaceChild(draggedElement, dropzoneDraggableItem)
      draggedElementDropzone.appendChild(dropzoneDraggableItem)

      //Changing orders
      const idDraggedElement = draggedElement.querySelector('.todo-list__input').id
      const idTargetElement = dropzoneDraggableItem.querySelector('.todo-list__input').id
      database.changeOrder(idDraggedElement, idTargetElement)

      //Unlocking pointer-events
      const draggableItems = document.querySelectorAll('.draggable-item')
      draggableItems.forEach(element => element.classList.remove('not-droppable'))

      dropzone.style.outline = ""
    }
  }
)()