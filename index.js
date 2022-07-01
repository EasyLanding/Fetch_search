let div = document.querySelector('.search_div') //div в котором хранится инпут с которым работаем
let input = document.querySelector('.input_search') //input с которым работаем
let conteinerForLi = document.querySelector('.search_box-li') //контейнер для li элементов в которые выводим значения
let conteiner_createElDiv = document.querySelector('.create-element')// переменная контейнер для отрисовки div по клику


let createDiv// вспомогательная переменная для отрисовки дом элемента
let createElement; // вспомогательная перменная для отрисовки дом элемента
let arrNameRepo = [] //массив в котором храним названия репозиториев полученных с помощью fetch
let arrAnotherInfoFromFetch = [] //другие данные полученные с помощью fetch(колличество звезд, имя пользователя и тд)


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
    for (let i = 0; i < arrNameRepo.length; i++)
    {
        if (arrNameRepo[i] == e.textContent)
        {
            createElement = '<div class="create-activ">' + '<img class="clear-element" src="img/delete-icon.png" alt="альтернативный текст">' + '<h3 class="create-activ_h">' + arrAnotherInfoFromFetch[i][3] + '</h3>' + '<p class="create-activ_p">' + 'id:' + arrAnotherInfoFromFetch[i][1] + " " + 'stars:' + arrAnotherInfoFromFetch[i][2] + '</p>' + '</div>';
            break;
        }
    }

    createDiv.innerHTML = createElement;
    conteiner_createElDiv.appendChild(createDiv);
    conteiner_createElDiv.addEventListener('click', clearElement)
}


//Очищение div дом элементов которые отрисовали
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


//реализация удаления элементов Li
function clearElementLi (e)
{
    if (e.target.className != "clear-element")
    {
        event.stopPropagation()
    } else
    {
        let clear = e.target.closest('.li-active')
        clear.remove()
    }
}






//Основная функция которая спрабатывает при начале ввода что то в инпут
input.addEventListener('keyup', debounce(function (e)
{
    //передаем в переменную name значение инпута, так мы делаем запрос по никнейму пользователя
    name = e.target.value
    //Тут делаем проверки, если name пустой, тогда очищаем массив в который добавляли полученные данные
    //Так же очищаем от списков li страницу
    //Так же удаляем дополнительный класс active чтобы вернуть css стили в прежнее состояние
    if (name === '' || name.length > 1)
    {
        arrNameRepo.length = 0
        arrAnotherInfoFromFetch.length = 0
        conteinerForLi.innerHTML = ''
        conteinerForLi.classList.remove('active')
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

            arrNameRepo.push(el.name)
            arrAnotherInfoFromFetch.push([el.name, el.id, el.stargazers_count, name])
            let arrNameRepos = arrNameRepo.map(function (arrNameRepos)
            {
                return arrNameRepos = '<li class="li-active" onclick="clickLi(this)">' + arrNameRepos + '<img class="clear-element" src="img/delete-icon.png" alt="альтернативный текст">' + '</li>'
            })
            showLi(arrNameRepos)
            conteinerForLi.addEventListener('click', clearElementLi)
        })


        //короткая функция написанная для отрисовки названия репозиториев в теге li
        function showLi (list)
        {
            let listArray

            listArray = list.join('')

            conteinerForLi.innerHTML = listArray
            if (list)
            {
                conteinerForLi.classList.add('active')
            }
        }
    }).catch(error =>
    {
        error = 'Вы ввели не верное имя пользователя или произошла ошибка, пожалуйста очистите поисковую строку и повторите запрос'
        throw new Error(error)
    })
}, 500))