let div = document.querySelector('.search_div') //search-input
let input = document.querySelector('.input_search') //input
let box_li = document.querySelector('.search_box-li') //autocom-box
let conteiner_createElDiv = document.querySelector('.create-element')
let createDiv
let createElement;
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
function clickLi (e)
{
    createDiv = document.createElement('div')
    createElement;
    createDiv.classList.add('conteiner-activ')
    for (let i = 0; i < mas.length; i++)
    {
        //console.log(e.textContent, '==', mas[i], '?', arrayForLi[i]);
        if (mas[i] == e.textContent)
        {
            createElement = '<div class="create-activ">' + '<img class="clear-element" src="img/delete-icon.png" alt="альтернативный текст">' + '<h3 class="create-activ_h">' + arrayForLi[i][3] + '</h3>' + '<p class="create-activ_p">' + 'id:' + arrayForLi[i][1] + " " + 'stars:' + arrayForLi[i][2] + '</p>' + '</div>';
            break;
        }
    }

    createDiv.innerHTML = createElement;
    conteiner_createElDiv.appendChild(createDiv);
    conteiner_createElDiv.addEventListener('click', clearElement)
}

function clearElement (e)
{
    if (e.target.className != "clear-element")
    {
        return
    } else
    {
        let clear = e.target.closest('.conteiner-activ')
        clear.remove()
    }
}

function clearElementLi (e)
{
    if (e.target.className != "clear-element")
    {
        return
    } else
    {
        let clear = e.target.closest('.li-active')
        clear.remove()
    }
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
                return masLi = '<li class="li-active" onclick="clickLi(this)">' + masLi + '<img class="clear-element" src="img/delete-icon.png" alt="альтернативный текст">' + '</li>'
            })
            showLi(masLi)
            box_li.addEventListener('click', clearElementLi)
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