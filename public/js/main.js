//list of days so I don't have to type

for(let i=1; i<=31; i++){
    document.getElementById('date').innerHTML += `<option value="${i}">${i}</option>`
}

document.querySelector('button').addEventListener('click', alertBirthdayAdded)


function alertBirthdayAdded(){
    alert('Birthday Added Successfully')
}

// to enable delete: 
// do a querySelectorAll for a class on your delete buttons for each birthday
// add an event listener to each instance by iterating over with a forEach loop
// write a fetch request inside the listener to a route on your server that accepts a birthday by id
// on the server, search your db by birthday id and delete it
// do window.reload here in client js to reload the page
const listedBirthday = document.querySelectorAll('.birthday-info span')
const deleteBtn = document.querySelectorAll('.del')

Array.from(deleteBtn).forEach((el) =>{
    el.addEventListener('click', removeBirthday)
})

async function removeBirthday(){
    const birthdayDelete = this.parentNode.childNodes[1].innerText
    try{
        const response = await fetch('deleteBirthday', {
            method: 'delete',
            headers: {'Content-type': 'application/json'},
            body: JSON.stringify({
                'birthday': info
            })
        })
        const data = await response.json()
        console.log(data)
        location.reload()
    }catch(error){
        console.log(error)
    }
}