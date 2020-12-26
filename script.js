document.addEventListener("DOMContentLoaded", onPageLoaded);

function onPageLoaded() {
    const loader = document.querySelector(".loader");
    const content = document.querySelector(".content");
    const input = document.querySelector("#filter");
    const clear = document.querySelector("#clear-filter");
    const tbody = document.querySelector("tbody");
    const template = document.querySelector("#user-row");
    let users = [];

    const URL = "https://randomuser.me/api/?results=15"; 
    let xhr = new XMLHttpRequest();
    xhr.open('GET', URL);
    xhr.responseType = 'json';
    xhr.send();
    xhr.onload = function() {
            if (xhr.status != 200) { // анализируем HTTP-статус ответа, если статус не 200, то произошла ошибка
                alert(`Ошибка ${xhr.status}: ${xhr.statusText}`); // Например, 404: Not Found
            } else { // если всё прошло гладко, выводим результат
                loader.hidden = true;
                content.hidden = false;

                const response = xhr.response;
                users = response.results.map(user=>{ //creating users list with required data only
                    return {
                        name: `${user.name.first} ${user.name.last}`,
                        picture: user.picture,
                        location: `${user.location.state}, ${user.location.city}`,
                        email: user.email,
                        phone:user.phone,
                        registeredDate: user.registered.date
                    }
                });
                users.forEach(user => {
                    createUserRow(user)     
                });


            }
        };

    function createUserRow(user) {
        template.content.querySelector('.name').textContent = user.name;
        template.content.querySelector('.thumbnail').src = user.picture.thumbnail;
        template.content.querySelector('.user-picture').src = user.picture.large;
        template.content.querySelector('.location').textContent = user.location;
        template.content.querySelector('.email').textContent = user.email;
        template.content.querySelector('.phone').textContent = user.phone;
        template.content.querySelector('.registered').textContent = user.registeredDate;
        tbody.appendChild(template.content.cloneNode(true));
    }    

    function filterList() {
        const filter = input.value.toUpperCase();
        const tr = tbody.querySelectorAll('tr');
        users.forEach((user, index)=>{
            tr[index].hidden = !user.name.toUpperCase().includes(filter);  
        })
        
    }   

    input.addEventListener("keyup", debounce(filterList, 300));
    clear.addEventListener("click", ()=>{
        input.value = null;
        filterList();
    })
}

function debounce(func, delay) {
    let timeout;
    return (...args) => {
        const delayedFunc = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(delayedFunc, delay);
    };
};