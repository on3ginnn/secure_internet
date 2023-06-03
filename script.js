windowOnload = true

window.onload = function () {
    document.querySelector('.preloader').classList.add('_un_active');
    document.querySelector('body').classList.remove('_lock');

    // подгрузка размера для card
    function setCardsHeight() {
        const cardFirst = document.querySelector('.card');
        const cardFirstHeight = cardFirst.offsetHeight;
        const cards = document.querySelectorAll('.card');
        cards.forEach((card, index) => {
            if (index !== 0) {
                const CardFirstContent = card.querySelector('.card__text');
                const CardFirstBtn = card.querySelector('.card__arrow');
                card.classList.remove('_active');
                CardFirstContent.style.overflow = 'hidden';
                card.style.height = `${cardFirstHeight}px`;
                CardFirstBtn.classList.remove('_active');
            }
        });
    }
    setCardsHeight();

    window.addEventListener("orientationchange", function () {
        setTimeout(function() {
            setCardsHeight();
        }, 100);
    });
    // навигация

    const navLinks = document.querySelectorAll('.navbar_goto[data-goto]');

    navLinks.forEach((btn) => {
        btn.addEventListener('click', (e) => {
            if (btn.dataset.goto && document.querySelector(btn.dataset.goto)) {
                const gotoBlock = document.querySelector(btn.dataset.goto);
                const gotoBlockValue = gotoBlock.getBoundingClientRect().top + pageYOffset;

                window.scrollTo({
                    top: gotoBlockValue,
                    behavior: 'smooth'
                });
                e.preventDefault();
            }
        })
    });


    // спойлеры

    "use strict"

    const spollersArray = document.querySelectorAll('[data-spollers]');
    if (spollersArray.length > 0) {
        // получение спойлеров
        const spollersRegular = Array.from(spollersArray).filter(function (item, index, self) {
            return !item.dataset.spollers.split(",")[0];
        });
        // инициализация спойлеров
        if (spollersRegular.length > 0) {
            initSpollers(spollersRegular);
        }
        // инициализация
        function initSpollers(spollersArray, matchMedia = false) {
            spollersArray.forEach(spollersBlock => {
                spollersBlock = matchMedia ? spollersBlock.item : spollersBlock;
                if (matchMedia.matches || !matchMedia) {
                    spollersBlock.classList.add('_init');
                    initSpollerBody(spollersBlock);
                    spollersBlock.addEventListener('click', setSpollerAction);
                } else {
                    spollersBlock.classList.remove('_init');
                    initSpollerBody(spollersBlock, false);
                    spollersBlock.removeEventListener('click', setSpollerAction);
                }
            });
        }
        // работа с контентом
        function initSpollerBody(spollersBlock, hideSpollerBody = true) {
            const spollerTitles = spollersBlock.querySelectorAll('[data-spoller]');
            if (spollerTitles.length > 0) {
                spollerTitles.forEach(spollerTitle => {
                    if (hideSpollerBody) {
                        spollerTitle.removeAttribute('tabindex');
                        if (!spollerTitle.classList.contains('_active')) {
                            spollerTitle.parentNode.parentNode.nextElementSibling.hidden = true;
                        }
                    } else {
                        spollerTitle.setAttribute('tabindex', '-1');
                        spollerTitle.parentNode.parentNode.nextElementSibling.hidden = false;
                    }
                });
            }
        }
        // при нажатии, активируется
        function setSpollerAction(e) {
            const el = e.target;
            if (el.hasAttribute('data-spoller') || el.closest('[data-spoller]')) {
                const spollerTitle = el.hasAttribute('data-spoller') ? el : el.closest('[data-spoller]');
                const spollersBlock = spollerTitle.closest('[data-spollers]');
                const oneSpoller = spollersBlock.hasAttribute('data-one-spoller') ? true : false;
                if (!spollersBlock.querySelectorAll('._slide').length) {
                    if (oneSpoller && !spollerTitle.classList.contains('_active')) {
                        hideSpollerBody(spollersBlock);
                    }
                    spollerTitle.parentNode.parentNode.parentNode.parentNode.classList.toggle('_active');
                    spollerTitle.parentNode.parentNode.parentNode.classList.toggle('_active');
                    _slideToggle(spollerTitle.parentNode.parentNode.nextElementSibling, 300);
                }
                e.preventDefault();
            }
        }
        function hideSpollerBody(spollersBlock) {
            const spollerActiveTitle = spollersBlock.querySelector('[data-spoller]._active');
            if (spollerActiveTitle) {
                spollerActiveTitle.classList.remove('_active');
                _slideUp(spollerActiveTitle.parentNode.parentNode.nextElementSibling, 300);
            }
        }
    }


    // SlideToggle
    let _slideUp = (target, duration = 300) => {
        if (!target.classList.contains('_slide')) {
            target.classList.add('_slide');
            target.style.transitionProperty = 'height, margin, padding';
            target.style.transitionDuration = duration + 'ms';
            target.style.height = target.offsetHeight + 'px';
            target.offsetHeight;
            target.style.overflow = 'hidden';
            target.style.height = 0;
            target.style.paddingTop = 0;
            target.style.paddingBottom = 0;
            target.style.marginTop = 0;
            target.style.marginBottom = 0;
            window.setTimeout(() => {
                target.hidden = true;
                target.style.removeProperty('height');
                target.style.removeProperty('padding-top');
                target.style.removeProperty('padding-bottom');
                target.style.removeProperty('margin-top');
                target.style.removeProperty('margin-bottom');
                target.style.removeProperty('overflow');
                target.style.removeProperty('transition-duration');
                target.style.removeProperty('transition-property');
                target.classList.remove('_slide');
            }, duration);
        }
    }
    let _slideDown = (target, duration = 300) => {
        if (!target.classList.contains('_slide')) {
            target.classList.add('_slide');
            if (target.hidden) {
                target.hidden = false;
            }
            // target.style.filter = 'blur(25px)';
            let height = target.offsetHeight;
            target.style.overflow = 'hidden';
            target.style.height = 0;
            target.style.paddingTop = 0;
            target.style.paddingBottom = 0;
            target.style.marginTop = 0;
            target.style.marginBottom = 0;
            target.offsetHeight;
            target.style.transitionProperty = 'height, margin, padding';
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
                // target.style.filter = 'blur(0px)';
                target.classList.remove('_slide');
            }, duration);
        }
    }
    let _slideToggle = (target, duration = 300) => {
        if (target.hidden) {
            return _slideDown(target, duration);
        } else {
            return _slideUp(target, duration);
        }
    }


    // card
    const viewMoreBtns = document.querySelectorAll('.card__arrow');

    viewMoreBtns.forEach((btn) => {
        btn.addEventListener('click', (e) => {
            const card = e.target.closest('.card');
            const cardHeight = card.offsetHeight;
            const CardContent = card.querySelector('.card__text');
            const OldCardContentHeight = CardContent.offsetHeight;
            const isExpanded = card.classList.contains('_active');
            if (isExpanded) {
                // Скрыть текст
                card.classList.remove('_active');
                CardContent.style.overflow = 'hidden';
                const cardFirst = document.querySelector('.card');
                const cardFirstHeight = cardFirst.offsetHeight;
                card.style.height = `${cardFirstHeight}px`;

            } else {
                // Развернуть текст
                CardContent.style.overflow = 'visible'
                const NewCardContentHeight = CardContent.offsetHeight;
                const contentHeight = NewCardContentHeight - OldCardContentHeight;
                // const contentHeight = NewCardContent.offsetHeight;
                const newCardHeight = cardHeight + contentHeight;
                card.classList.add('_active');
                //   card.style.overflow = 'visible';
                card.style.height = `${newCardHeight}px`;
            }

            // Смена состояния кнопки
            btn.classList.toggle('_active');
        });
    });

    // test
    const tests = {
        'Какой из паролей является надёжным?':
            [{ answers: ['Alнx2001', '158468646', '1544513314', 'Vbif20hjvfyjd33'], rightAnswer: 'Vbif20hjvfyjd33' }],
        'Что НЕ следует делать, если ты столкнулся с троллем в Сети?':
            [{ answers: ['Игнорировать выпады тролля', 'Заблокировать тролля', 'Проучить или доказать свою правоту', 'Сообщить модераторам сайта'], rightAnswer: 'Проучить или доказать свою правоту' }],
        'Откуда НЕ стоит брать информацию в Интернете для реферата?':
            [{ answers: ['Сайты средств массовой информации', 'Википедия', 'Электронные библиотеки', 'Сообщества в социальных сетях'], rightAnswer: 'Сообщества в социальных сетях' }],
        'Что является признаком достоверности информации в Сети?':
            [{
                answers: ['Возможность перепроверить эту информацию в других источниках и на официальных сайтах',
                    'Правдоподобность информации', 'Качественное оформление информации', 'Грамотное изложение информации'],
                rightAnswer: 'Возможность перепроверить эту информацию в других источниках и на официальных сайтах'
            }],
        'Как НЕ стоит себя вести, если вы стали жертвой кибербуллинга?':
            [{
                answers: ['Ничего не делать', 'Заблокировать обидчиков', 'Сообщить родителям (взрослым)',
                    'Обратиться на Линию помощи «Дети онлайн»'], rightAnswer: 'Ничего не делать'
            }],
        'Кто может публиковать материалы в Интернете?':
            [{
                answers: ['Любые пользователи Интернета', 'Только государственные органы',
                    'Только организации', 'Только аккредитованные средства массовой информации'], rightAnswer: 'Любые пользователи Интернета'
            }],
        'Какие данные из нижеперечисленных можно сообщать по электронной почте?':
            [{
                answers: ['Номера банковских счетов (кредитных карт)', 'Секретные слова (ответы) на специальные секретные вопросы, используемые при идентификации вашего аккаунта',
                    'PIN-коды', 'Ваши имя и фамилию'], rightAnswer: 'Ваши имя и фамилию'
            }],
        'Как защититься от негативного контента?':
            [{
                answers: ['Использовать безопасный поиск Google и безопасный режим на YouTube',
                    'Установить антивирус', 'Не обращать на него внимания', 'Обратиться к автору негативного контента'],
                rightAnswer: 'Использовать безопасный поиск Google и безопасный режим на YouTube'
            }],
        'Какую информацию о себе можно выкладывать в Интернете в открытом доступе?':
            [{ answers: ['Место работы родителей', 'Номер телефона', 'Домашний адрес', 'О своих интересах'], rightAnswer: 'О своих интересах' }],
        'Что НЕ поможет защитить свою электронную почту от взлома?':
            [{
                answers: ['Создавать разные пароли от разных аккаунтов', 'Периодически менять адрес электронной почты, менять провайдеров',
                    'Не открывать сообщения с незнакомых и подозрительных адресов', 'Никому не сообщать свой пароль'],
                rightAnswer: 'Периодически менять адрес электронной почты, менять провайдеров'
            }]
    }
    let testItems = document.querySelector('.test-item');
    let currentQuestion = 0;
    let correctAnswersCount = 0;

    function renderQuestion() {
        const question = Object.keys(tests)[currentQuestion];
        const answers = tests[question][0].answers;
        const rightAnswer = tests[question][0].rightAnswer;

        const answersHtml = answers.map(answer => `
        <li class="answer__choiceItem"><p class="answer__choice ${answer === rightAnswer ? 'right' : ''}">${answer}</p></li>
        `).join('');
        const testItemHtml = `
            <li class="test-item">
            <h3 class="question">${question}</h3>
            <ul class="answers-choices paragraph">
                ${answersHtml}
            </ul>
            <div class="settbar paragraph">
                <div class="position">
                <span class="accent">${currentQuestion + 1}</span> из ${Object.keys(tests).length}
                </div>
                <div class="next__btn btn">
                дальше
                </div>
            </div>
            </li>
        `;
        testItems.innerHTML = testItemHtml;

        const nextButton = document.querySelector('.next__btn');
        nextButton.addEventListener('click', function () {
            setTimeout(function() {
                handleNextClick();
            }, 200);
        });


        const answerChoices = document.querySelectorAll('.answer__choice');
        answerChoices.forEach(answerChoice => {
            answerChoice.addEventListener('click', handleAnswerClick);
        });
    }

    function handleNextClick() {
        currentQuestion++;
        if (currentQuestion === Object.keys(tests).length) {
            showResult();
        } else {
            renderQuestion();
        }
    }

    // проверка правильности нажатого ответа
    function handleAnswerClick(event) {
        const selectedAnswer = event.target;
        if (!testItems.querySelector(".answer__choice._active")) {
            if (selectedAnswer.classList.contains('right')) {
                correctAnswersCount++;
            }
            selectedAnswer.classList.add('_active');
            selectedAnswer.parentNode.parentNode.classList.add("right_answer");
        }
    }
    // после завершения всех тестов показать форму с указанием верных ответов и результат
    function showResult() {
        let recomendate = '';
        if (correctAnswersCount < 3) {
            recomendate = 'Прочтите информацию на сайте еще раз.'
        } else if (correctAnswersCount < 6) {
            recomendate = 'Посмотрите видео на сайте более подробно.'
        } else {
            recomendate = 'Вы точно не попадетесь на уловку мошенников!'
        }
        const resultHtml = `
            <p>Вы правильно ответили на ${correctAnswersCount} из ${Object.keys(tests).length} вопросов.</p>
            <h2 class="accent paragraph">${recomendate}</h2>
            <div class="repeat__btn btn paragraph">пройти заного</div>
        `;
        testItems.innerHTML = resultHtml;

        const reapetButton = document.querySelector('.repeat__btn');
        if (reapetButton) {
            reapetButton.addEventListener('click', function () {
                setTimeout(function() {
                    currentQuestion = 0;
                    correctAnswersCount = 0;
                    renderQuestion();
                }, 200);
            });
        }
    }

    renderQuestion();

}
