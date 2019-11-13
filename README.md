# Slider (jQuery plugin)

[Демо-страница](https://katepronina.github.io/Slider/dist)

### Clone repository
`git clone https://github.com/KatePronina/Slider`

### Сборка (development)
`npm run dev`

### Сборка (production)
`npm run build`

### Запуск тестов
`npm test`

## Использование
```javascript
const mySliderPlugin = $('.slider-class-name').slider({
  minValue: 3,
  maxValue: 19,
  step: 5,
  value: [8],
  scale: true,
});
```

### Настройки
| Опция  | Тип  | Значение по умолчанию | Описание |
| :------------: |:---------------:| :---------:|:--:|
| type     | string | 'single' |  Определяет тип слайдера: с одним значением ('single') или с двумя ('interval') |
| value     | number[] | Равно минимальному возможному значению (при типе слайдера 'single') или минимальному и максимальному возможным значениям (при типе слайдера 'interval') |  Задает значение слайдера
| minValue | number | 0 | Минимальное возможное значение |
| maxValue | number | 100 | Максимальное возможное значение |
| step | number | 1 | Шаг значений |
| direction | string | 'horizontal' | Определяет расположение слайдера: горизонтальное ('horizontal' ) или вертикальное ('vertical') |
| hint | boolean | true | Определяет наличие плавающей подсказки над слайдером |
| scale | boolean | false | Определяет наличие шкалы значений
| configuration | boolean | false | Определяет наличие панели конфигурации

### Установка значения слайдера

```javascript
const mySliderPlugin = $('.slider-class-name').slider({
  minValue: 10,
  maxValue: 150,
});

mySliderPlugin.setSettings({ value: [20] }); // для типа single
mySliderPlugin.setSettings({ value: [20, 40] }); // для типа interval
```

## Архитектура
### UML-диаграмма
![UML](https://github.com/KatePronina/Slider/raw/master/schemes/UML%20Diagram.png)

### Описание
#### Model
Содержит состояние, связанное с бизнес-логикой (type, minValue, maxValue, number, value, step), и не содержит состояния данных визуального отображения.
#### View
Занимается отрисовкой слайдера. Использует views каждого компонента слайдера: создает необходимые view в соответствии с переданными параметрами, добавляет обработку событий, связывает views каждого компонента между собой.

**SingleSliderView, IntervalSliderView, ScaleView, HintView, ConfigurationView** - компоненты слайдера, каждый компонент отрисовывает и обрабатывает события от своего элемента.

**SingleSliderView, IntervalSliderView** - два компонента одной сущности. View выбирает для использования только один из них в зависимости от переданных параметров. Компоненты объединены наследованием от абстрактного класса ComponentSlider.

#### Controller
Создает Model и View, связывает их взаимодействие через определение обработчиков события от каждого.
