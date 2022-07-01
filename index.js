let div = document.querySelector('.search_div') //search-input
let input = document.querySelector('.input_search') //input
let box_li = document.querySelector('.search_box-li') //autocom-box
let mas = []
let arrayForLi = []
//дебонс функция для корректного отправления данных на сервер
function debounce (func, wait, immediate)
{
    let timeout;
    return function ()
    {
        const context = this, args = arguments;
        const later = function ()
        {
            timeout = null;
            if (!immediate) func.apply(context, args);
        };
        const callNow = immediate && !timeout;
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
        if (callNow) func.apply(context, args);
    }
}




//отрисовка DOM элементов
function clickLi ()
{
    let createDiv = document.createElement('div')
    let createElement
    // for (let i = 0; i < mas.length; i++)
    // {
    //     createElement = '<div class="create-activ">' + '<h3 class="create-activ_h">' + arrayForLi[i][3] + '</h3>' + '<p class="create-activ_p">' + 'id:' + arrayForLi[i][1] + 'stars:' + arrayForLi[i][2] + '</p>' + '</div>'
    // }
    arrayForLi.forEach(function (element, i)
    {
        //console.log(element[0])

        console.log(mas[i])
        createElement = '<div class="create-activ">' + '<h3 class="create-activ_h">' + element[3] + '</h3>' + '<p class="create-activ_p">' + 'id:' + element[1] + 'stars:' + element[2] + '</p>' + '</div>'

    })


    createDiv.innerHTML = createElement
    document.body.appendChild(createDiv)
}





input.addEventListener('keyup', debounce(function (e)
{
    //передаем в переменную name значение инпута, так мы делаем запрос по никнейму пользователя
    name = e.target.value
    //Тут делаем проверки, если name пустой то есть инпут пустой, тогда очищаем массив в который добавляли полученные данные
    //Так же очищаем от списков li страницу
    //Так же удаляем дополнительный класс active чтобы вернуть css стили в прежнее состояние
    if (name === '')
    {
        mas.length = 0
        box_li.innerHTML = ''
        box_li.classList.remove('active')
    }
    //Запрос на сервер по гитхаб апи происходит с помощью переменной name где name является ником пользователя
    let info = fetch(`https://api.github.com/users/${name}/repos`).then(function (response)
    {
        return response.json()
    }).then(function (posts)
    {
        //функциональный перебор элементов полученных с помощью fetch
        return posts.forEach(function (el)
        {
            mas.push(el.name)
            arrayForLi.push([el.name, el.id, el.stargazers_count, name])
            let masLi = mas.map(function (masLi)
            {
                return masLi = '<li class="li-active" onclick="clickLi()">' + masLi + '</li>'
            })

            showLi(masLi)
        })
        //короткая функция написанная для отрисовки названия репозиториев в теге li
        function showLi (list)
        {
            let listArray

            listArray = list.join('')

            box_li.innerHTML = listArray
            if (list)
            {
                box_li.classList.add('active')
            }
        }
    })
}, 500))