"use client"

import "./style.css";
import React, { useEffect, useState } from "react";

export default function Home() {
    const numIcons = 100;
    const [isAddTestFormVisible, setIsFormVisible] = useState(true);

    useEffect(() => {
      const snowContainer = document.querySelector(
        ".snow-container"
      ) as HTMLElement;

      const createSnowflakes = (num: number) => {
        for (let i = 0; i < num; i++) {
          const snowflake = document.createElement("div");
          snowflake.classList.add("snowflake");

          // Устанавливаем случайный размер
          const size = Math.random() * 20 + 10; // размер от 10px до 30px
          snowflake.style.fontSize = `${size}px`;

          // Устанавливаем случайную позицию
          const leftPosition = Math.random() * 100; // случайная горизонтальная позиция
          snowflake.style.left = `${leftPosition}vw`;

          // Устанавливаем случайную продолжительность анимации
          const speed = Math.random() * 10 + 5; // скорость от 5s до 15s
          snowflake.style.animationDuration = `${speed}s`;

          // Устанавливаем случайное горизонтальное движение
          const horizontalMovement = (Math.random() - 0.5) * 50; // случайное горизонтальное движение
          snowflake.style.transform = `translateX(${horizontalMovement}px)`;

          // Устанавливаем символ снежинки
          snowflake.innerHTML = "&#10052;";

          // Устанавливаем случайный цвет для снежинки
          snowflake.style.color = `hsl(${Math.random() * 360}, 100%, 100%)`; // случайный цвет в HSL

          snowContainer.appendChild(snowflake);

          // Удаляем снежинки после окончания анимации
          snowflake.addEventListener("animationend", () => {
            snowflake.remove();
          });
        }
      };

      // Устанавливаем количество снега
      const amountSnow = 20; // количество снега

      // Создаем снег
      createSnowflakes(amountSnow);

      // Создаем новый снег каждую секунду
      const intervalId = setInterval(() => {
        createSnowflakes(1); // Создаем одну снежинку
      }, 2000);

      // Очищаем интервал при размонтировании компонента
      return () => clearInterval(intervalId);
    }, []);

    const getRandomPositionInInvertedTriangle = (
      triangleWidth: number,
      triangleHeight: number
    ) => {
      const centerX = triangleWidth / 2; // Центр по оси X

      // Случайная координата X в пределах треугольника
      const x = Math.random() * triangleWidth;

      // Перевернутая координата Y для треугольника на 180 градусов
      const y =
        triangleHeight -
        Math.random() *
          (triangleHeight - (triangleHeight * Math.abs(x - centerX)) / centerX);

      return { x, y };
    };

    // Функция для получения значений ширины и высоты в зависимости от уровня
    const getTriangleDimensions = (level: number) => {
      switch (level) {
        case 4:
          return { width: 400, height: 390 }; // Уровень 4
        case 3:
          return { width: 330, height: 240 }; // Уровень 3
        case 2:
          return { width: 250, height: 160 }; // Уровень 2
        case 1:
          return { width: 200, height: 80 }; // Уровень 1
        default:
          return { width: 190, height: 80 }; // Значения по умолчанию
      }
    };

    const icons = ["🎄", "❄️", "🎅", "🎁", "⛄"]; // Иконки для выбора
    const iconCount: { [key: string]: number } = {}; // Объект для подсчета иконок

    // Инициализация счетчиков для каждой иконки
    icons.forEach((icon) => {
      iconCount[icon] = 0;
    });

    // Рандомное размещение иконок на елке
    useEffect(() => {
      for (let i = 0; i < numIcons; i++) {
        const randomIcon = icons[Math.floor(Math.random() * icons.length)];
        iconCount[randomIcon]++; // Увеличиваем счетчик для выбранной иконки

        const level = Math.floor(Math.random() * 4) + 1; // Рандомный уровень
        const iconElement = document.createElement("div");
        iconElement.classList.add(`tree-icon-level-${level}`);
        iconElement.textContent = randomIcon;

        // Получение размера треугольника в зависимости от уровня
        const { width, height } = getTriangleDimensions(level);
        const position = getRandomPositionInInvertedTriangle(width, height);

        iconElement.style.position = "absolute";
        iconElement.style.left = `${position.x}px`;
        iconElement.style.top = `${position.y}px`;

        const levelElement = document.createElement("span");
        levelElement.classList.add("tree-icon-level");
        levelElement.style.display = "none";

        // Добавление обработчика события наведения мыши для показа номера уровня
        iconElement.addEventListener("mouseover", () => {
          let displayText = String(i); // Преобразуем индекс в строку

          if (displayText.length > 50) {
            // Разбиение текста на две строки
            const midPoint = Math.floor(displayText.length / 2);
            displayText =
              displayText.slice(0, midPoint) +
              "<br>" +
              displayText.slice(midPoint);
          }

          const h3Element = document.getElementById("congratulation");
          if (h3Element) {
            h3Element.innerHTML = displayText;
          }
        });

        // Обработчик события ухода мыши для скрытия элемента с номером уровня
        iconElement.addEventListener("mouseout", () => {
          levelElement.style.display = "none";
        });

        iconElement.appendChild(levelElement);
        document.getElementById("tree")?.appendChild(iconElement); // Добавляем иконку на елку
      }

      // Вывод количества сгенерированных иконок в контейнер
      const iconContainer = document.querySelector(
        ".icon-container"
      ) as HTMLElement;
      iconContainer.innerHTML = ""; // Очищаем контейнер перед добавлением новых значений

      icons.forEach((icon) => {
        const iconItem = document.createElement("div");
        iconItem.classList.add("icon-item");
        iconItem.innerHTML = `${icon}<span>${iconCount[icon]}</span>`; // Иконка и количество
        iconContainer.appendChild(iconItem); // Добавляем элемент в контейнер
      });
    }, []);

  return (
    <div>
      {isAddTestFormVisible && (
        <div className="add-container">
          <div className="form-box login">
            <form action="#">
              <h1>Add your congratulations</h1>
              <div className="input-box">
                <textarea placeholder="Enter your congratulations..." />
              </div>
              <button type="submit" className="btn btn-orange">
                Send
              </button>
              <button type="submit" className="btn btn-yellow">
                Back
              </button>
            </form>
          </div>

          <div className="toggle-box">
            <div className="toggle-panel toggle-left">
              <h1>Hello, Welcome!</h1>
              <p>Don't have an account?</p>
            </div>
          </div>
        </div>
      )}

      <div className="container">
        <div className="snow-container"></div>
        <div className="icon-container">
          <div className="icon-item">
            🎄<span>1</span>
          </div>
          <div className="icon-item">
            ❄️<span>1</span>
          </div>
          <div className="icon-item">
            🎅<span>1</span>
          </div>
          <div className="icon-item">
            🎁<span>1</span>
          </div>
          <div className="icon-item">
            ⛄<span>1</span>
          </div>
        </div>
        <div className="tree" id="tree">
          <div className="level-1">
            <div className="upper-shadow"></div>
          </div>
          <div className="level-2">
            <div className="details"></div>
            <div className="upper-shadow"></div>
          </div>
          <div className="level-3">
            <div className="details"></div>
            <div className="upper-shadow"></div>
          </div>
          <div className="level-4">
            <div className="details"></div>
            <div className="shadow"></div>
          </div>
          <div className="star"></div>
        </div>
        <div className="gifts">
          <div className="gift-left">
            <div className="gift-top"></div>
            <div className="gift-box"></div>
          </div>

          <div className="gift-right">
            <div className="gift-top"></div>
            <div className="gift-box"></div>
          </div>

          <div className="center-gift"></div>
          <h3 id="congratulation" className="congratulation"></h3>
        </div>
      </div>
    </div>
  );
}
