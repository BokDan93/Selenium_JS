var webdriver = require('selenium-webdriver'),
    By = webdriver.By,
    until = webdriver.until;

describe('Selectel', function () {
    var driver;

    before(function () {
        driver = new webdriver.Builder()
            .forBrowser('chrome')
            .build();
    })

    it('Тест 1 - Вход на сайт и в панель управления', async function() {
        await driver.manage().window().maximize();

        await driver.get('https://selectel.ru/');
        //await driver.get('https://my.selectel.ru/');
        await driver.findElement(By.className('header__control-panel')).click();

        const handles = await driver.getAllWindowHandles();
        await driver.switchTo().window(handles[1]);

        await driver.wait(until.titleIs('Панель управления · Selectel'),10000);
    });

    it('Тест 2 (Ввод невалидных значений и пустых значений)', async function() {
        //await driver.manage().window().maximize();
        //await driver.get('https://my.selectel.ru/');

        let dataUser = [
            {login: '', pass: ''},
            {login: 'Petya', pass: ''},
            {login: '', pass: 'wre4335t'}]
        for (const inputData of dataUser) {
            await driver.findElement(By.xpath('//input[@name=\'login\']')).sendKeys(inputData.login);
            await driver.findElement(By.xpath('//input[@name=\'password\']')).sendKeys(inputData.pass);
            await driver.findElement(By.xpath('//button[@class=\'m-solid m-brand m-panel-brand m-l md-button\']')).click();
            if (await driver.findElement(By.xpath('//div[@stl=\'password_input__required_err\']')).getText()==='Обязательное поле' || await driver.findElement(By.xpath('//div[@stl=\'login_input__required_err\']')).getText()==='Обязательное поле')  {
                console.log('Для комбинации: LOGIN: ' + '"' + inputData.login + '"' + ' и PASSWORD: ' + '"' + inputData.pass + '"' + ' Ошибка "Необходимо заполнить обязательное поле" существует');
            } else {
                console.log('Для комбинации: LOGIN: ' + '"' + inputData.login + '"' + ' и PASSWORD: ' + '"' + inputData.pass + '"' + ' Не вижу ошибки');
            };
            await driver.findElement(By.xpath('//input[@name=\'login\']')).clear();
            await driver.findElement(By.xpath('//input[@name=\'password\']')).clear();

 }
 });

     it('Тест 3 (Ввод невалидных значений)', async function() {
         let dataUser1 = [
             {login: 'Kolya123', pass: '32553'},
             {login: '138771', pass: '4325'},
             {login: 'Masha24', pass: 'Qwert12345'},]

         for (const inputData of dataUser1) {
         await driver.findElement(By.xpath('//input[@name=\'login\']')).sendKeys(inputData.login);
         await driver.findElement(By.xpath('//input[@name=\'password\']')).sendKeys(inputData.pass);
         await driver.findElement(By.xpath('//button[@class=\'m-solid m-brand m-panel-brand m-l md-button\']')).click();
         await driver.wait(until.elementLocated(By.xpath('//div[@stl=\'err_login\'][text()=\'Неправильный логин или пароль\']'),10000));
         if (await driver.findElement(By.xpath('//div[@stl=\'err_login\'][text()=\'Неправильный логин или пароль\']')).getText()=='Неправильный логин или пароль')  {
             console.log('Для комбинации: LOGIN: ' + '"' + inputData.login + '"' + ' и PASSWORD: ' + '"' + inputData.pass + '"' + ' Ошибка "Неправильный логин или пароль" сушествует');
         } else {
             console.log('Для комбинации: LOGIN: ' + '"' + inputData.login + '"' + ' и PASSWORD: ' + '"' + inputData.pass + '"' + ' Не вижу ошибки');
         }
             await driver.findElement(By.xpath('//input[@name=\'login\']')).clear()
             await driver.findElement(By.xpath('//input[@name=\'password\']')).clear()
         }
 })
    it('Тест 4 (Успешный вход в "Панель управления")', async function() {
        let dataUser = [
            {login: '138771', pass: 'Qwert12345'}]

        for (const inputData of dataUser) {
            await driver.findElement(By.xpath('//input[@name=\'login\']')).sendKeys(inputData.login);
            await driver.findElement(By.xpath('//input[@name=\'password\']')).sendKeys(inputData.pass);
            await driver.findElement(By.xpath('//button[@class=\'m-solid m-brand m-panel-brand m-l md-button\']')).click();
            await driver.wait(until.elementLocated(By.css('div.sp-root.layout-row > div > panel-header > div > div > div'),3000));
            const panelControl = await driver.findElement(By.css('div.sp-root.layout-row > div > panel-header > div > div > div')).getText();

            if (panelControl =='Панель управления') {
                console.log('Вход в "Панель управления" выполнен успешно');
            }
            else {
                console.log('Извини,дружище,но че-то не работает твой тест');
            }
            // Это попытка использовать фраемворк chai, но почему то не отрабатывает он совсем
            //await expect(panelControl).to.equal('Панель управления');
            }
        })

    it('Тест 5 (Разлогиниться)', async function() {
        const profileMenu = await driver.findElement(By.css(' div.user-profile-dropdown-toggle.s-h-base-xxs.s-bdl-base-xs.l-plr.layout-align-space-between-center.layout-row.flex-auto.s-h-bdb-base-xs > md-icon'));
        profileMenu.click()
        const exitButton = await driver.findElement(By.xpath('//a[@class=\'f-base-xl\'] [normalize-space(text()) = \'Выйти\']'));
        exitButton.click()
        await driver.wait(until.elementLocated(By.xpath('//div[@class=\'h2 t-reg l-mb-l\'] [normalize-space(text()) = \'Вход в панель управления\']'),3000));
        const textPanelControl = await driver.findElement(By.xpath('//div[@class=\'h2 t-reg l-mb-l\'] [normalize-space(text()) = \'Вход в панель управления\']')).getText()
        if(textPanelControl==='Вход в панель управления') {
            console.log('Выход из профиля выполнен успешно')
        } else {
            console.log('Что-то пошло не так..Текст не совпадает')
        }
    })

    it('Тест 6 (Переход по ссылке "Восстановить доступ к аккаунту")', async function() {
        const resetButton = await driver.findElement(By.xpath('//a[@class=\'f-base-l f-h-info\'] [normalize-space(text()) = \'Восстановить доступ к аккаунту\']'));
        resetButton.click()
        await driver.wait(until.elementLocated(By.xpath('//div[@class=\'h2 t-reg l-mb-l\']'),3000));
        await driver.findElement(By.xpath('//div[@class=\'h2 t-reg l-mb-l\']'))
    })

    it('Тест 7 (Ввод невалидных и пустых значений для восстановления доступа)', async function() {
        let dataUser = [
            {login: '', email: ''},
            {login: 'Petya', email: ''},
            {login: '', email: 'wre4335t'}]
        for (const inputData of dataUser) {
            await driver.findElement(By.xpath('//input[@id=\'uid\']')).sendKeys(inputData.login);
            await driver.findElement(By.xpath('//input[@id=\'email\']')).sendKeys(inputData.email);
            await driver.findElement(By.xpath('//button[@class=\'m-brand m-panel-brand m-solid m-l md-button\']')).click();
            if (await driver.findElement(By.xpath('//div[@ng-messages=\'remind_form.uid.$error\']')).getText()==='Обязательное поле' || await driver.findElement(By.xpath('//div[@ng-messages=\'remind_form.email.$error\']')).getText()==='Обязательное поле')  {
                console.log('Для комбинации: LOGIN: ' + '"' + inputData.login + '"' + ' и PASSWORD: ' + '"' + inputData.email + '"' + ' Ошибка "Необходимо заполнить обязательное поле" существует');
            } else {
                console.log('Для комбинации: LOGIN: ' + '"' + inputData.login + '"' + ' и PASSWORD: ' + '"' + inputData.email + '"' + ' Не вижу ошибки');
            };
            await driver.findElement(By.xpath('//input[@id=\'uid\']')).clear();
            await driver.findElement(By.xpath('//input[@id=\'email\']')).clear();
        }
    })

    it('Тест 8 (Ввод невалидных значений для восстановления доступа)', async function() {
        let dataUser1 = [
            {login: 'Kolya123', email: '32553'},
            {login: '138771', email: '4325@mail.ru'},
            {login: 'Masha24', email: 'vazovskymike66@gmail.com'},]

        for (const inputData of dataUser1) {
            await driver.findElement(By.xpath('//input[@id=\'uid\']')).sendKeys(inputData.login);
            await driver.findElement(By.xpath('//input[@id=\'email\']')).sendKeys(inputData.email);
            await driver.findElement(By.xpath('//button[@class=\'m-brand m-panel-brand m-solid m-l md-button\']')).click();
            await driver.wait(until.elementLocated(By.xpath('//div[@class=\'f-danger l-mt-l ng-binding ng-scope\']'),10000));
            const errorMessage = await driver.findElement(By.xpath('//div[@class=\'f-danger l-mt-l ng-binding ng-scope\']'))
            if (errorMessage.getText()=='Логин или почта не найдены')  {
                console.log('Для комбинации: LOGIN: ' + '"' + inputData.login + '"' + ' и PASSWORD: ' + '"' + inputData.email + '"' + ' Ошибка "Неправильный логин или пароль" сушествует');
            } else {
                console.log('Для комбинации: LOGIN: ' + '"' + inputData.login + '"' + ' и PASSWORD: ' + '"' + inputData.email + '"' + ' Не вижу ошибки');
            }
            await driver.findElement(By.xpath('//input[@id=\'uid\']')).clear()
            await driver.findElement(By.xpath('//input[@id=\'email\']')).clear()
        }
    })

    it('Тест 9 (Успешный ввод дданых для восстановления доступа)', async function() {
        let dataUser1 = [
            {login: '138771', email: 'vazovskymike66@gmail.com'}]

        for (const inputData of dataUser1) {
            await driver.findElement(By.xpath('//input[@id=\'uid\']')).sendKeys(inputData.login);
            await driver.findElement(By.xpath('//input[@id=\'email\']')).sendKeys(inputData.email);
            await driver.findElement(By.xpath('//button[@class=\'m-brand m-panel-brand m-solid m-l md-button\']')).click();
            await driver.wait(until.elementLocated(By.xpath('//div[@class=\'h3 t-reg l-mb-l\']'),10000));
            const textResetName = await driver.findElement(By.xpath('//div[@class=\'h3 t-reg l-mb-l\']')).getText()

            if (textResetName=='Восстановление доступа')  {
                console.log('Восстановление прошло успешно. Беги скорей в почту');
            } else {
                console.log('Что то тут не сходится');
            }

        }
    })
    })






     /*

 });
 after(function(){
     driver.quit();*/