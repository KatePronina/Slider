# Slider (jQuery plugin)

[Демо-страница](https://katepronina.github.io/Slider/ "Демо-страница")

### Сборка (development)
`npm run dev`

### Сборка (production)
`npm run build`

### Запуск тестов
`npm test`

## Использование
```javascript
$('.slider').slider()
```
С настройками:
```javascript
$('.slider').slider({
                    minValue: 3,
                    maxValue: 19,
                    step: 5,
                    value: 8,
                    scale: true,
                    configuration: true,
                  })
```
### Настройки
| Опция  | Тип  | Значение по умолчанию | Описание |
| :------------: |:---------------:| :---------:|:--:|
| type     | string | 'range' |  Определяет тип слайдера: с одним значением ('range') или с двумя ('interval') |
| value     | number или number[] | Равно минимальному возможному значению (при типе слайдера 'range') или минимальному и максимальному возможным значениям (при типе слайдера 'interval') |  Задает значение слайдера
| minValue | number | 0 | Минимальное возможное значение |
| maxValue | number | 100 | Максимальное возможное значение |
| step | number | 1 | Шаг значений |
| direction | string | 'horizontal' | Определяет расположение слайдера: горизонтальное ('horizontal' ) или вертикальное ('vertical') |
| hint | boolean | true | Определяет наличие плавающей подсказки над слайдером |
| scale | boolean | false | Определяет наличие шкалы значений
| configuration | boolean | false | Определяет наличие панели конфигурации

### Установка значения слайдера

**Для типа 'range':**
```javascript
$('.slider').slider('setValue', 5);
```
**Для типа 'interval':**
```javascript
$('.slider').slider('setValue', [40, 50]);
```
Установка только начального значения:
```javascript
$('.slider').slider('setValue', 20, 'min');
```
Установка только конечного значения:
```javascript
$('.slider').slider('setValue', 40, 'max');
```
Установка одного значения с автоматическим определением типа значения (начального или конечного):
```javascript
$('.slider').slider('setValue', 60);
```
## Архитектура
### UML-диаграмма
![UML](https://github.com/KatePronina/Slider/raw/master/schemes/UML%20Diagram.jpg)
### Взаимодействие слоёв MVC
![MVC](https://github.com/KatePronina/Slider/raw/master/schemes/MVC%20Diagram.jpg)
### Описание
#### Model
Содержит состояние, связанное с бизнес-логикой (type, minValue, maxValue, number, value, step), и не содержит состояния данных визуального отображения.
#### View
Занимается отрисовкой слайдера. Использует views каждого компонента слайдера: создает необходимые view в соответствии с переданными параметрами, добавляет обработку событий, связывает views каждого компонента между собой.

**RangeSliderView, IntervalSliderView, ScaleView, HintView, ConfigurationView** - компоненты слайдера, каждый компонент отрисовывает и обрабатывает события от своего элемента. Все компоненты объединены наследованием от абстрактного класса *ComponentView*.

**RangeSliderView, IntervalSliderView** - два компонента одной сущности. View выбирает для использования только один из них в зависимости от переданных параметров. Компоненты объединены наследованием от абстрактного класса ComponentSlider.

#### Controller
Создает Model и View, связывает их взаимодействие через определение обработчиков события от каждого.
