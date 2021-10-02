// to enable delete: 
// do a querySelectorAll for a class on your delete buttons for each birthday
// add an event listener to each instance by iterating over with a forEach loop
// write a fetch request inside the listener to a route on your server that accepts a birthday by id
// on the server, search your db by birthday id and delete it
// do window.reload here in client js to reload the page


// document.querySelector('.delete-button').addEventListener('click', confirmDelete)

// function confirmDelete(){
    
//     let okDelete = confirm('Do you want to delete this person and their birthday permanently?')
    
//     if(okDelete === false){
//         console.log('cancel')
        
//     }else{
//         document.getElementById('delete').addEventListener('click', removeBirthday)
//     }
    
// }

const deleteBtn = document.querySelectorAll('.delete-button')

Array.from(deleteBtn).forEach((el) =>{
    el.addEventListener('click', removeBirthday)
})

async function removeBirthday(event){
    console.log("Event object inside event listener: ", event)
    
    const parentNode = event.target.parentNode;
    console.log("parentNode: ", parentNode)
    const birthdayId = parentNode.dataset.userid

    console.log("Birthday document id from div dataset: ", birthdayId)
    try{
        const response = await fetch('deleteBirthday', {
            method: 'delete',
            headers: {'Content-type': 'application/json'},
            body: JSON.stringify({
                id: birthdayId
            })
        })
        const data = await response.json()
        console.log(data)
        location.reload()
    }catch(error){
        console.log(error)
    }
}



