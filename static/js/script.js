"use strict"


document.addEventListener('DOMContentLoaded', function (){
    // прелодер
    document.querySelector('body').classList.remove('_lock');
    document.querySelector('.preloader').classList.add('_un_active');

    // lazy load 
    const images = document.querySelectorAll('img[data-src]');
    const videos = document.querySelectorAll('iframe[data-src-video]');
    const windowHeight = document.documentElement.clientHeight;

    // массивы координат картинок (и видео)
    let imagesPosition = [];
    let videosPosition = [];
    
    // итерация всех картинок (и видео), и добавление их координат в imagesPosition (videosPosition)
    if (images.length > 0) {
        images.forEach(img => {
            if (img.dataset.src) {
                imagesPosition.push(img.getBoundingClientRect().top + pageYOffset);
                // т.к экран может уже находится в том месте где надо загрузить картинку
                lazyLoad();
            }
        });
    }
    if (videos.length > 0) {
        videos.forEach(video => {
            if (video.dataset.srcVideo) {
                videosPosition.push(video.getBoundingClientRect().top + pageYOffset);   
                lazyLoad();
            }
        });
    }

    // lazy load (присваиваем src)
    function lazyLoad() {

        // поиск индекса картинки (и видео), которое надо загрузить
        let imgIndex = imagesPosition.findIndex(item => pageYOffset > item - windowHeight);
        let videoIndex = videosPosition.findIndex(item => pageYOffset > item - windowHeight);
        
        if (imgIndex >= 0) {
            if (images[imgIndex].dataset.src) {
                images[imgIndex].src = images[imgIndex].dataset.src;
                images[imgIndex].removeAttribute('data-src');
            }
            delete imagesPosition[imgIndex];
        }
        if (videoIndex >= 0) {
            if (videos[videoIndex].dataset.srcVideo) {
                videos[videoIndex].src = videos[videoIndex].dataset.srcVideo;
                videos[videoIndex].removeAttribute('data-src-video');
            }
            delete videosPosition[videoIndex];
        }
    }

    // итерация всех еще не загруженных каартинок (и видео)
    function lazyLoadChecker() {
        const imagesActual = document.querySelectorAll('img[data-src]');
        const videosActual = document.querySelectorAll('iframe[data-src-video]');
        if (imagesActual.length > 0 || videosActual.length > 0) {
            lazyLoad();
        }
    }

    // scroll event
    window.addEventListener('scroll', lazyLoadChecker);

    // поднятие складывающегося объекта
    function _slideUp(target, ruleItem, duration = 300, cardTextFirst = 0) {
        if (!target.classList.contains('_slide')) {
            target.classList.add('_slide');
            target.style.transitionProperty = 'height, margin, padding, opacity';
            target.style.height = target.offsetHeight + 'px';
            // эта фигня должна быть ОБЯЗАТЕЛЬНО, без нее не будет плавной анимации
            target.offsetHeight;
            target.style.transitionDuration = duration + 'ms';

            target.style.height = cardTextFirst + 'px';
            target.style.paddingTop = 0;
            target.style.paddingBottom = 0;
            target.style.marginTop = 0;
            target.style.marginBottom = 0;
            target.style.overflow = 'hidden';

            window.setTimeout(() => {
                target.style.removeProperty('padding-top');
                target.style.removeProperty('padding-bottom');
                target.style.removeProperty('margin-top');
                target.style.removeProperty('margin-bottom');
                target.style.removeProperty('transition-duration');
                target.style.removeProperty('transition-property');
                target.classList.remove('_slide');
                if (ruleItem.classList.contains('_active')) {
                    console.log('fff');
                    ruleItem.classList.remove('_active');
                }
            }, duration);

        }
    }
    // опускание складывающегося объекта
    function _slideDown(target, ruleItem, duration = 300, cardTextFirst = 0) {
        if (!target.classList.contains('_slide')) {
            target.classList.add('_slide');
            if (!ruleItem.classList.contains('_active')) {
                ruleItem.classList.add('_active');
            }
            // убираем размер с объекта (с html), чтобы применились css стили
            target.style.height = '';
            let height = target.offsetHeight;
            target.style.overflow = 'hidden';
            target.style.height = cardTextFirst + 'px';
            target.style.paddingTop = 0;
            target.style.paddingBottom = 0;
            target.style.marginTop = 0;
            target.style.marginBottom = 0;
            // эта фигня должна быть ОБЯЗАТЕЛЬНО, без нее не будет плавной анимации
            target.offsetHeight;

            target.style.transitionProperty = 'height, margin, padding, opacity';
            target.style.transitionDuration = duration + 'ms';
            target.style.height = height + 'px';
            target.style.removeProperty('padding-top');
            target.style.removeProperty('padding-bottom');
            target.style.removeProperty('margin-top');
            target.style.removeProperty('margin-bottom');
            window.setTimeout(() => {

                target.style.removeProperty('height');
                target.style.removeProperty('overflow');
                target.style.removeProperty('transition-duration');
                target.style.removeProperty('transition-property');
                target.classList.remove('_slide');
            }, duration);
        }
    }

    // lazy load для труднодоступных объектов (spoiler) отдельно
    function lazyLoadOfSpoilers(img) {
        if (img) {
            if (img.dataset.src) {
                img.src = img.dataset.src;
                img.removeAttribute('data-src');
            }
        }
    }

    // итерация карт, которые должны быть изначально закрыты
    let totalCards = document.querySelectorAll('.card__item#card-2, .card__item#card-3');

    totalCards.forEach(cardItem => {
        const cardText = cardItem.querySelector('.card__text_wrapper');
        
        _slideUp(cardText, cardItem, 300, cardTextFirstHeight());
    });

    // открытие и закрытие карт
    function cardOpened(cardItem) {
        console.log(cardItem);
        const cardText = cardItem.querySelector('.card__text_wrapper');
        const isExpanded = cardItem.classList.contains('_active');
        if (isExpanded) {
            // Скрыть текст
            _slideUp(cardText, cardItem, 300, cardTextFirstHeight());
        } else {
            // Показать текст
            _slideDown(cardText, cardItem, 300, cardTextFirstHeight());
        }
    }

    // узнаем размеры перой карты
    function cardTextFirstHeight() {
        let cardTextFirst = document.querySelector('.card .card__text_wrapper');
        let cardBtn = document.querySelector('.card .card__arrow');

        let cardBtnHeightValue = cardBtn.getBoundingClientRect().height + parseInt(getComputedStyle(cardBtn).marginTop);
        
        let cardTextFirstHeightValue = cardTextFirst.getBoundingClientRect().height - cardBtnHeightValue;

        return cardTextFirstHeightValue;
    }

    // test
    const tests = [[
        'Какой из паролей является надёжным?', ['Alнx2001', '158468646', '1544513314', 'Vbif20hjvfyjd33'], 'Vbif20hjvfyjd33' ],
        ['Что НЕ следует делать, если ты столкнулся с троллем в Сети?', ['Игнорировать выпады тролля', 'Заблокировать тролля', 'Проучить или доказать свою правоту', 'Сообщить модераторам сайта'], 'Проучить или доказать свою правоту'],
        ['Откуда НЕ стоит брать информацию в Интернете для реферата?', ['Сайты средств массовой информации', 'Википедия', 'Электронные библиотеки', 'Сообщества в социальных сетях'], 'Сообщества в социальных сетях' ],
        ['Что является признаком достоверности информации в Сети?', ['Возможность перепроверить эту информацию в других источниках и на официальных сайтах',
                    'Правдоподобность информации', 'Качественное оформление информации', 'Грамотное изложение информации'], 'Возможность перепроверить эту информацию в других источниках и на официальных сайтах'
            ],
        ['Как НЕ стоит себя вести, если вы стали жертвой кибербуллинга?', ['Ничего не делать', 'Заблокировать обидчиков', 'Сообщить родителям (взрослым)',
                    'Обратиться на Линию помощи «Дети онлайн»'], 'Ничего не делать'
            ],
        ['Кто может публиковать материалы в Интернете?', ['Любые пользователи Интернета', 'Только государственные органы',
                    'Только организации', 'Только аккредитованные средства массовой информации'], 'Любые пользователи Интернета'
            ],
        ['Какие данные из нижеперечисленных можно сообщать по электронной почте?', ['Номера банковских счетов (кредитных карт)', 'Секретные слова (ответы) на специальные секретные вопросы, используемые при идентификации вашего аккаунта',
                    'PIN-коды', 'Ваши имя и фамилию'], 'Ваши имя и фамилию'],
        ['Как защититься от негативного контента?', ['Использовать безопасный поиск Google и безопасный режим на YouTube',
                    'Установить антивирус', 'Не обращать на него внимания', 'Обратиться к автору негативного контента'], 'Использовать безопасный поиск Google и безопасный режим на YouTube'],
        ['Какую информацию о себе можно выкладывать в Интернете в открытом доступе?', ['Место работы родителей', 'Номер телефона', 'Домашний адрес', 'О своих интересах'], 'О своих интересах'],
        ['Что НЕ поможет защитить свою электронную почту от взлома?', ['Создавать разные пароли от разных аккаунтов', 'Периодически менять адрес электронной почты, менять провайдеров',
                    'Не открывать сообщения с незнакомых и подозрительных адресов', 'Никому не сообщать свой пароль'], 'Периодически менять адрес электронной почты, менять провайдеров']
    ];

    let testItems = document.querySelector('.test-items');
    let currentQuestion = 0;
    let correctAnswersCount = 0;

    function renderQuestion() {
        const question = tests[currentQuestion][0];
        const answers = tests[currentQuestion][1];
        const rightAnswer = tests[currentQuestion][2];

        // map создает массив
        const answersHtml = answers.map(answer => `
        <li class="answer__choice-item ${answer === rightAnswer ? 'right' : ''}">
            <p class="answer__choice">${answer}</p>
        </li>
        `).join('');

        const testItemHtml = `
            <li class="test-item">
            <h3 class="question">${question}</h3>
            <ul class="answers-choices paragraph">
                ${answersHtml}
            </ul>
            <div class="settbar paragraph">
                <div class="position">
                <span class="accent">${currentQuestion + 1}</span> из ${tests.length}
                </div>
                <div class="next__btn btn">
                дальше
                </div>
            </div>
            </li>
        `;
        testItems.innerHTML = testItemHtml;
    }

    // проверка правильности нажатого ответа
    function checkerAnswerClick(answerItem) {
        if (!testItems.querySelector(".answer__choice-item._active")) {
            if (answerItem.classList.contains('right')) {
                correctAnswersCount++;
            }
            answerItem.closest('.test-item').classList.add('right_answer_show');
            answerItem.classList.add('_active');
        }
    }

    // после завершения всех тестов показать форму с указанием верных ответов и результат
    function showResult() {
        let recomendate = '';

        if (correctAnswersCount < 3) {
            recomendate = 'Прочтите информацию на сайте еще раз...'
        } else if (correctAnswersCount < 7) {
            recomendate = 'Посмотрите видео на сайте более подробно.'
        } else {
            recomendate = 'Вы точно не попадетесь на уловку мошенников!'
        }

        const resultHtml = `
            <p>Вы правильно ответили на ${correctAnswersCount} из ${tests.length} вопросов.</p>
            <h3 class="accent paragraph">${recomendate}</h3>
            <div class="repeat__btn btn paragraph">пройти заного</div>
        `;

        testItems.innerHTML = resultHtml;
    }
    
    // только если нашлось поле тестов, генерируются тесты
    if (testItems !== null) renderQuestion();


    // проверка на последний вопрос
    function handleNextClick() {
        currentQuestion++;
        if (currentQuestion >= tests.length) {
            showResult();
        } else {
            renderQuestion();
        }
    }

    let theme = 'light';
    
    // обработка событий клика
    function documentClick(event){
        // меню
        if (event.target.closest('.burger-menu')) {
            let navbar = document.querySelector(".header__navbar");
            let menu = event.target.closest('.burger-menu');
            
            if (menu.classList.contains('_active')){
                navbar.classList.remove('_active');
                menu.classList.remove('_active');
                document.body.classList.remove('_lock');
            } else {
                navbar.classList.add('_active');
                menu.classList.add('_active');
                document.body.classList.add('_lock');
            }
        }
        // тема
        if (event.target.closest('.dark-mode')) {
            if (theme === 'light') {
                event.target.closest('.dark-mode').innerHTML = `
                    <img src="./static/img/sun.png" alt="moon.png">
                `;
                theme = 'dark';
                document.body.classList.add('dark_mode');
            } else {
                event.target.closest('.dark-mode').innerHTML = `
                    <img src="./static/img/moon.png" alt="moon.png">
                `;
                theme = 'light';
                document.body.classList.remove('dark_mode');
            }
            
        }
        // тест заного
        if (event.target.closest('.repeat__btn')) {
            setTimeout(() => {currentQuestion = 0, correctAnswersCount = 0, renderQuestion()}, 200);
        }
        // выбор варианта ответа в тесте
        if (event.target.closest('.answer__choice-item')) {
            let answerItem = event.target.closest('.answer__choice-item');
            checkerAnswerClick(answerItem);
        }
        // кнопка "следующий вопрос"
        if (event.target.closest('.next__btn')) {
            setTimeout(handleNextClick, 200);
        }
        // spoilers click
        if (event.target.closest('.rule-flexbox')) {

            let ruleItem = event.target.closest('.rule_item');

            // lazy load для спойлеров
            lazyLoadOfSpoilers(ruleItem.querySelector('[data-src]'));

            let dataSpoiler = ruleItem.querySelector('.drop-spoiler');
            if (dataSpoiler) {
                if (!ruleItem.classList.contains('_active')) {
                    _slideDown(dataSpoiler, ruleItem, 300);
                } else {
                    _slideUp(dataSpoiler, ruleItem, 300);

                }
            }
        }
        // navagation click
        if (event.target.closest('.navbar_goto[data-goto]')) {
            const gotoItem = event.target.closest('.navbar_goto[data-goto]');
            if (gotoItem.dataset.goto) {
                const gotoBlock = document.querySelector(gotoItem.dataset.goto);
                const gotoBlockValue = gotoBlock.getBoundingClientRect().top + pageYOffset;

                window.scrollTo({
                    top: gotoBlockValue,
                    behavior: 'smooth'
                });
            }
        }
        // cart click
        if (event.target.closest('.card__arrow')) {
            let btn = event.target.closest('.card__arrow');
            const cardItem = btn.closest('.card__item');

            cardOpened(cardItem);
        }
    }

    // обработчик событий клика на странице
    document.addEventListener('click', documentClick);

});

