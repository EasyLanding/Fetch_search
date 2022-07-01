// псевдонимы для встроенных методов DOM API
const [$, $$, $element, $fragment, $append] = [
	document.querySelector,
	document.querySelectorAll,
	document.createElement,
	document.createDocumentFragment,
	document.append
].map(fn => fn.bind(document));

// создаёт элемент с id или указанными классами
const $element_ = (str) => {
	const divider = str.match(/#|\./);
	const [selector, spec] = str.split(divider);
	const elem = $element(selector);
	(divider == '.' && (elem.className = spec)) || (elem.id = spec);
	return elem;
};

let div = $('.search_div') //search-input
let input = $('.input_search') //input
let box_li = $('.search_box-li') //autocom-box

const infos = new Array;

//дебонс функция для корректного отправления данных на сервер
function debounce (func, wait, immediate) {
	let timeout;
	return function () {
		const context = this, args = arguments;
		const later = function () {
			timeout = null;
			if (!immediate) func.apply(context, args);
		};
		clearTimeout(timeout);
		timeout = setTimeout(later, wait);
		immediate && !timeout && func.apply(context, args);
	}
}



//отрисовка DOM элементов
function clickLi(e) {
	const div = $element_('div.create-activ');
	//div.className = 'create-activ';

	const header = $element_('h3.create-activ_h');
	//header.className = 'create-activ_h';
	header.textContent = input.value;

	const p = $element_('p.acreate-activ_p');
	//p.className = 'acreate-activ_p';

	const text = e.target.textContent;
	const idx = infos.findIndex(el => el[0] == text);
	p.textContent = `${text} | id: ${infos[idx][1]}, stars: ${infos[idx][2]}`;

	div.append(header, p);
	document.body.appendChild(div);
}



input.addEventListener('keyup', debounce((e) => {
	//передаем в переменную name значение инпута, так мы делаем запрос по никнейму пользователя
	const nickname = e.target.value;
	//Тут делаем проверки, если name пустой то есть инпут пустой, тогда очищаем массив в который добавляли полученные данные
	//Так же очищаем от списков li страницу
	//Так же удаляем дополнительный класс active чтобы вернуть css стили в прежнее состояние
	if (!nickname.length) {
		mas.length = 0;
		box_li.innerHTML = '';
		box_li.classList.remove('active');
	}
	//Запрос на сервер по гитхаб апи происходит с помощью переменной name где name является ником пользователя
	fetch(`https://api.github.com/users/${nickname}/repos`)
		.then((response) => response.json())
		.then((posts) => {
			// функциональный перебор элементов полученных с помощью fetch
			let list = new Array;
			posts.forEach((el) => {
				list.push(el.name);
				infos.push([el.name, el.id, el.stargazers_count, nickname]);
			});

			list = list.map((str) => {
				const li = $element('li');
				li.className = 'li-active';
				li.textContent = str;
				return li;
			});

			box_li.append(...list);
			box_li.addEventListener('click', clickLi);
			if (list) box_li.classList.add('active');
		});
}, 500));