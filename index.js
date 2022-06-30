let div = document.querySelector('.search_div') //search-input
let input = document.querySelector('.input_search') //input
let box_li = document.querySelector('.search_box-li') //autocom-box
let mas = []

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
        let element
        //функциональный перебор элементов полученных с помощью fetch
        return posts.forEach(function (el)
        {
            element = el.id + ' ' + el.stargazers_count + ' ' + name
            mas.push(el.name)
            let masLi = mas.map(function (masLi)
            {
                return masLi = '<li class="li-active">' + masLi + '</li>'
            })
            showLi(masLi)
            let liAddDiv = document.querySelector('.li-active')

            console.log(liAddDiv)
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