const deleteBtn = document.querySelectorAll('.del')
const todoItem = document.querySelectorAll('.todoItem span')//class then span inside it
const todoItemComplete = document.querySelectorAll('.todoItem span.completed')//class then span inside it with completed


Array.from(deleteBtn).forEach((el) =>{//grab everything from the class delete
    el.addEventListener('click', deleteTodo)//array adds eventListener onto every single delete (i++ bc how else will we know how many there are?)
})

Array.from(todoItem).forEach((el) =>{
    el.addEventListener('click', markComplete)//same as before but mark complete
})

Array.from(todoItem).forEach((el) =>{
    el.addEventListener('click', undo)//same as before but undo mark complete
})

async function deleteTodo(){
    const todoText = this.parentNode.childNodes[1].innerText//the thing I just clicked on aka delete span, go up to the parentNode which is the li, take the first child node which is the span, it's [1] bc [0] is the space. This is old school, but we will probably run into this in legacy code.
    try{
        const response = await fetch('deleteTodo', {//sending extra info with our fetch
            method: 'delete',//type of method
            headers: {'Content-type': 'application/json'},//type of info to get(formatted), in this case JSON
            body: JSON.stringify({//we can send a request body like we did with the form. JSON.stringify takes in an object
                'rainbowUnicorn': todoText//property can name it anything, in this case 'rainbowUnicorn' to be obvious
            })//Leon would copy/paste this all day long lol
        })
        const data = await response.json()//we don't really need to do anything with what we fetch
        console.log(data)
        location.reload()
    }catch(error){
        console.log(error)
    }
}

//CROSS OUT TO DO PUT section
async function markComplete(){//this is copy/paste from above to save time with changes noted in comments
    const todoText = this.parentNode.childNodes[1].innerText
    try{
        const response = await fetch('markComplete', {
            method: 'put',//put bc we are changing it
            headers: {'Content-type': 'application/json'},
            body: JSON.stringify({
                'rainbowUnicorn': todoText
            })
        })
        const data = await response.json()
        console.log(data)
        location.reload()
    }catch(error){
        console.log(error)
    }
}

//UNDO function (technically also a put)
async function undo(){//this is copy/paste from above to save time with changes noted in comments
    const todoText = this.parentNode.childNodes[1].innerText
    try{
        const response = await fetch('undo', {//only need to change fetch to differentiate between our put functions
            method: 'put',//put bc we are changing it
            headers: {'Content-type': 'application/json'},
            body: JSON.stringify({
                'rainbowUnicorn': todoText
            })
        })
        const data = await response.json()
        console.log(data)
        location.reload()
    }catch(error){
        console.log(error)
    }
}