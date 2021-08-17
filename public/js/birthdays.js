//list of days so I don't have to type

for(let i=1; i<=31; i++){
    document.getElementById('date').innerHTML += `<option value="${i}">${i}</option>`
}

document.querySelector('button').addEventListener('click', alertBirthdayAdded)


function alertBirthdayAdded(){
    alert('Birthday Added Successfully')
}