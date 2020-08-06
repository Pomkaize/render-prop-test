## Проверка утверждения о том, что children в renderProp не зарендерятся при SSR, в отличие от базового использования children
Однажды я увидел в коде достаточно странный синтксис: используется renderProps, но не по его основному назначению - как паттерна шаринга кода,
а как механизм оптимизации проивзодительности рендеринга при SSR. Ниже я проверяю это утверждение. Взглянем на примеры:
#### Вариант c renderProps
```javascript
class AppModalRenderPropChildren extends React.PureComponent {
    render() {
        return (
            <Modal>
                {() => <Children />}
            </Modal>
        )
    }
}
```
#### Вариант с children
```javascript
class AppModalChildren extends React.PureComponent {
    render() {
        return (
            <Modal>
                <Children />
            </Modal>
        )
    }
}
```
#### Контрольный вариант, рендерим просто children 
```javascript
class AppChildren extends React.PureComponent {
    render() {
        return (
            <Children />
        )
    }
}
```
#### Транспиляция 
Для удобства чтения можно транспилириовать без commonjs плагина (смотри babelrc).
Для запуска на ноде, плагин все же стоит включить.
```bash
npm i
```
```bash
npx babel src/* --out-dir dist
```
#### Анализ транспилированных Babel-ем вариантов (примеры без транспиляции commonjs модулей для удобства)
#### Вариант c renderProps
```javascript
class AppModalRenderPropChildren extends React.PureComponent {
  render() {
    return /*#__PURE__*/React.createElement(Modal, null, () => /*#__PURE__*/React.createElement(Children, null));
  }
}
```
#### Вариант с children
```javascript
class AppModalChildren extends React.PureComponent {
  render() {
    return /*#__PURE__*/React.createElement(Modal, null, /*#__PURE__*/React.createElement(Children, null));
  }
}
```
#### Контрольный вариант, рендерим просто children 
```javascript
class AppChildren extends React.PureComponent {
  render() {
    return /*#__PURE__*/React.createElement(Children, null);
  }
}
```
Мы действительно видим разницу в транспилированных вариантах, когда рендерим children через renderProp, и когда без него
```javascript
// children через renderProps
React.createElement(Modal, null, () => React.createElement(Children, null));

// children без renderProps
React.createElement(Modal, null, React.createElement(Children, null));
```
Лично я вот что вижу, 3 аргумент будет вызван при любом исходе, однако при renderProp будет создана промежуточная лямбда функция,
что вызывает только обратный эффект - увеличивает RAM, CPU накладки из-за добавления лишнего вызова в стек.
Это было и понятно в самом начале, просто априори введение усложнений в код, в нашем случае renderProps (но такое утверждение правдиво для HOC паттерна) всегда замедляет код,
их используют чисто в архитектурных целях, когда необходиимо разложить одну и ту же логику по разным местам.

#### Пробуем запустить транспилированные (с commonjs плагином) варианты
В подопытном классе-компоненте Children при вызове методов constructor и render выбрасываются сигналы.
```bash
# children как renderProps ничего не выбрасывает
node dist/renderToStringModalRenderPropChildren.js
```
```bash
# children без renderProps ничего не выбрасывает
node dist/renderToStringModalChildren.js
```
```bash
# просто children выбрасывает
node dist/renderToStringChildren.js
                                                                                                              ⬡ 12.15.0 [±master ●●●]
Hello, i am creating now
Hello, i am rendering now
```
Фактически - код имеет схожее поведение, но одну лишнюю запись в стек мы добавили.

Объясняется существущее явление просто:
метод `render` у дочернего реакт компонента может вызвать только родитель в своем методе `render`, но у нас при ssr возвращается null в children, 
следовательно render у дочерних компонентов выполнен не будет.
