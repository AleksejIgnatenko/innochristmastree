"use client";

import "./style.css";
import React, { useEffect, useState } from "react";
import { gql, useQuery, useSubscription, useMutation } from "@apollo/client";

// Определяем интерфейсы для данных
interface CongratulationsItem {
  id: string;
  icon: string;
  congratulationText: string;
}

interface GroupedCongratulations {
  icon: string;
  count: number;
  congratulations: CongratulationsItem[];
}

interface CreatedCongratulation {
  id: string;
  icon: string;
  congratulationText: string;
  count: number;
}

//GraphQL query
const GET_CONGRATULATIONS = gql`
  query {
    readCongratulations {
      groupedCongratulations {
        congratulations {
          id
          icon
          congratulationText
        }
        icon
        count
      }
    }
  }
`;

//GraphQL subscription
const SUBSCRIBE_TO_ADD_CONGRATULATION = gql`
  subscription {
    subscribeToAddCongratulation {
      id
      icon
      congratulationText
      count
    }
  }
`;

//GraphQL mutation
const CREATE_CONGRATULATION = gql`
  mutation CreateCongratulation($icon: String!, $congratulationText: String!) {
    createCongratulation(icon: $icon, congratulationText: $congratulationText) {
      id
      icon
      congratulationText
      count
    }
  }
`;

export default function Home() {
  const [selectedIcon, setSelectedIcon] = useState("");
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [text, setText] = useState("");
  const [groupedCongratulations, setGroupedCongratulations] = useState<
    GroupedCongratulations[]
  >([]);

  const [incomingGroupedCongratulations, setIncomingGroupedCongratulations] =
    useState<CreatedCongratulation>();

  const [createCongratulation] = useMutation(CREATE_CONGRATULATION);

  const { loading, error, data } = useQuery(GET_CONGRATULATIONS);
  // Подписка на новые поздравления
  const { data: subscriptionData } = useSubscription(
    SUBSCRIBE_TO_ADD_CONGRATULATION
  );

  const icons = ["🎄", "🎁", "🎅", "⛄", "❄️"];

  useEffect(() => {
    if (data) {
      setGroupedCongratulations(
        data.readCongratulations.groupedCongratulations
      );
    }
  }, [data]);

  useEffect(() => {
    if (subscriptionData) {
      const newCongratulation = subscriptionData.subscribeToAddCongratulation;
      if (newCongratulation) {
        setIncomingGroupedCongratulations(newCongratulation);
      }
    }
  }, [subscriptionData]);

  // useEffect для создания снежинок
  useEffect(() => {
    const snowContainer = document.querySelector(
      ".snow-container"
    ) as HTMLElement;

    const createSnowflakes = (num: number) => {
      for (let i = 0; i < num; i++) {
        const snowflake = document.createElement("div");
        snowflake.classList.add("snowflake");

        const size = Math.random() * 20 + 10; // размер от 10px до 30px
        snowflake.style.fontSize = `${size}px`;

        const leftPosition = Math.random() * 100; // случайная позиция
        snowflake.style.left = `${leftPosition}vw`;

        const speed = Math.random() * 10 + 5; // скорость от 5s до 15s
        snowflake.style.animationDuration = `${speed}s`;

        const horizontalMovement = (Math.random() - 0.5) * 50; // случайное движение
        snowflake.style.transform = `translateX(${horizontalMovement}px)`;

        snowflake.innerHTML = "&#10052;";
        snowflake.style.color = `hsl(${Math.random() * 360}, 100%, 100%)`;

        snowContainer.appendChild(snowflake);

        snowflake.addEventListener("animationend", () => {
          snowflake.remove();
        });
      }
    };

    const amountSnow = 20; // количество снега
    createSnowflakes(amountSnow);

    const intervalId = setInterval(() => {
      createSnowflakes(1); // Создаем одну снежинку
    }, 2000);

    return () => clearInterval(intervalId); // Очищаем интервал
  }, []);

  useEffect(() => {
    if (groupedCongratulations.length === 0) return;

    // Рандомное размещение иконок на елке
    groupedCongratulations.forEach((group) => {
      // Находим соответствующий <span> для каждой иконки
      let spanElement;

      if (group.icon === "🎄") {
        spanElement = document.getElementById("tree-icon-count");
      } else if (group.icon === "🎁") {
        spanElement = document.getElementById("gift-icon-count");
      } else if (group.icon === "🎅") {
        spanElement = document.getElementById("santa-icon-count");
      } else if (group.icon === "⛄") {
        spanElement = document.getElementById("snowman-icon-count");
      } else if (group.icon === "❄️") {
        spanElement = document.getElementById("snowflake-icon-count");
      }

      // Обновляем значение в <span>, если найден
      if (spanElement) {
        spanElement.textContent = group.count.toString(); // Обновляем текст с количеством
      }

      // Создаем элементы для иконок
      group.congratulations.forEach((item) => {
        const level = Math.floor(Math.random() * 4) + 1; // Рандомный уровень
        const iconElement = document.createElement("div");
        iconElement.classList.add(`tree-icon-level-${level}`);

        const { width, height } = getTriangleDimensions(level);
        const position = getRandomPositionInInvertedTriangle(width, height);

        iconElement.style.position = "absolute";
        iconElement.style.left = `${position.x}px`;
        iconElement.style.top = `${position.y}px`;

        // Устанавливаем иконку из группы
        iconElement.textContent = item.icon;

        const messageElement = document.createElement("span");
        messageElement.classList.add("tree-icon-message");
        messageElement.style.display = "none"; // Скрываем сообщение по умолчанию
        messageElement.textContent = item.congratulationText; // Текст поздравления

        iconElement.addEventListener("mouseover", () => {
          const h3Element = document.getElementById("congratulation");
          if (h3Element) {
            h3Element.innerHTML = item.congratulationText; // Показываем текст поздравления
          }
        });

        iconElement.addEventListener("mouseout", () => {
          const h3Element = document.getElementById("congratulation");
          if (h3Element) {
            h3Element.innerHTML = ""; // Очищаем заголовок
          }
        });

        iconElement.appendChild(messageElement); // Добавляем сообщение к иконке
        document.getElementById("tree")?.appendChild(iconElement); // Добавляем иконку на елку
      });
    });
  }, [groupedCongratulations]);

  useEffect(() => {
    // Check if there are incoming congratulations
    if (!incomingGroupedCongratulations) return;

    const { id, icon, congratulationText, count } =
      incomingGroupedCongratulations;

    // Update the icon count
    let spanElement;
    if (icon === "🎄") {
      spanElement = document.getElementById("tree-icon-count");
    } else if (icon === "🎁") {
      spanElement = document.getElementById("gift-icon-count");
    } else if (icon === "🎅") {
      spanElement = document.getElementById("santa-icon-count");
    } else if (icon === "⛄") {
      spanElement = document.getElementById("snowman-icon-count");
    } else if (icon === "❄️") {
      spanElement = document.getElementById("snowflake-icon-count");
    }

    // Update the count text
    if (spanElement) {
      spanElement.textContent = count.toString(); // Update count
    }

    // Create a unique identifier for the icon
    const uniqueIconClass = `tree-icon-${icon}-${id}`;

    // Always create a new icon element
    const iconElement = document.createElement("div");
    iconElement.classList.add(
      `tree-icon-level-${Math.floor(Math.random() * 4) + 1}`,
      uniqueIconClass
    );
    iconElement.style.position = "absolute";
    const level = Math.floor(Math.random() * 4) + 1;
    const { width, height } = getTriangleDimensions(level);
    const position = getRandomPositionInInvertedTriangle(width, height);
    iconElement.style.left = `${position.x}px`;
    iconElement.style.top = `${position.y}px`;
    iconElement.textContent = icon;

    const messageElement = document.createElement("span");
    messageElement.classList.add("tree-icon-message");
    messageElement.style.display = "none"; // Hide message by default
    messageElement.textContent = congratulationText; // Set congratulation text

    iconElement.addEventListener("mouseover", () => {
      const h3Element = document.getElementById("congratulation");
      if (h3Element) {
        h3Element.innerHTML = congratulationText; // Show congratulation text
      }
    });

    iconElement.addEventListener("mouseout", () => {
      const h3Element = document.getElementById("congratulation");
      if (h3Element) {
        h3Element.innerHTML = ""; // Clear the title
      }
    });

    iconElement.appendChild(messageElement); // Add message to the icon
    document.getElementById("tree")?.appendChild(iconElement); // Add icon to the tree
  }, [incomingGroupedCongratulations]);

  useEffect(() => {
    const treeElement = document.getElementById("tree");

    const handleClick = () => {
      setIsFormVisible(!isFormVisible);
    };

    if (treeElement) {
      treeElement.addEventListener("click", handleClick);
    }

    // Cleanup function to remove the event listener
    return () => {
      if (treeElement) {
        treeElement.removeEventListener("click", handleClick);
      }
    };
  }, []);

  const getRandomPositionInInvertedTriangle = (
    triangleWidth: number,
    triangleHeight: number
  ) => {
    const centerX = triangleWidth / 2; // Центр по оси X
    const x = Math.random() * triangleWidth; // Случайная координата X
    const y =
      triangleHeight -
      Math.random() *
        (triangleHeight - (triangleHeight * Math.abs(x - centerX)) / centerX);
    return { x, y };
  };

  const getTriangleDimensions = (level: number) => {
    switch (level) {
      case 4:
        return { width: 400, height: 390 };
      case 3:
        return { width: 330, height: 240 };
      case 2:
        return { width: 250, height: 160 };
      case 1:
        return { width: 200, height: 80 };
      default:
        return { width: 190, height: 80 };
    }
  };

  const handleIconSelection = (icon: string) => {
    setSelectedIcon(icon);
  };

  const handleSendCongratulation = async () => {
    const textarea = document.querySelector(
      ".input-box textarea"
    ) as HTMLTextAreaElement | null;

    if (textarea) {
      const textareaValue = textarea.value;

      // Check if selectedIcon is not empty or undefined
      if (selectedIcon) {
        try {
          const { data } = await createCongratulation({
            variables: {
              icon: selectedIcon,
              congratulationText: textareaValue,
            },
          });
          // Optionally clear the textarea after sending
          textarea.value = "";
        } catch (error) {
          console.error("Error creating congratulation:", error);
        }
      } else {
        alert("Please choose an icon.");
      }
    }
  };

  const handleFormVisibilityToggle = () => {
    setIsFormVisible(!isFormVisible);
  };

  const handleChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    const { value } = event.target;
    if (value.length <= 128) {
      setText(value);
    }
  };

  return (
    <div>
      {isFormVisible && (
        <div className="add-container">
          <div className="form-box">
            <div>
              <h1>Write your congratulation</h1>
              <div className="input-box">
                <textarea
                  placeholder="Enter your congratulation..."
                  value={text}
                  onChange={handleChange}
                  maxLength={128}
                />
                <p>{text.length}/128</p>
              </div>
              <button
                type="button"
                className="btn btn-orange"
                onClick={handleSendCongratulation}
              >
                Send
              </button>
              <button
                className="btn btn-yellow"
                onClick={handleFormVisibilityToggle}
              >
                Back
              </button>
            </div>
          </div>

          <div className="toggle-box">
            <div className="toggle-panel toggle-left">
              <h1>Hello, Welcome!</h1>
              <p>Сhoose a toy, write a greeting card</p>
              <p>and hang it on the Christmas tree.</p>
              <div className="icons-container">
                {icons.map((icon, index) => (
                  <span
                    key={index}
                    className={`icon ${
                      selectedIcon === icon ? "selected" : ""
                    }`} // Применяем класс при выборе
                    onClick={() => handleIconSelection(icon)}
                  >
                    {icon}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="container">
        <img
          src="https://i.postimg.cc/nLwtZ1dv/sled.png"
          alt="image"
          className="santa"
        />
        <img
          src="https://i.postimg.cc/hvW6PZV7/img-4.png"
          alt="image"
          className="home-img1"
        />
        <img
          src="https://i.postimg.cc/L6Swc7Hc/img-5.png"
          alt="image"
          className="home-img2"
        />
        <img
          src="https://i.postimg.cc/GhMKXS9J/img-12.png"
          alt="image"
          className="home-img3"
        />
        {/* <img src="https://i.postimg.cc/SsBFYxbR/img-1.png" alt="image" className="home-img3"/> */}
        <div className="snow-container"></div>
        <div className="icon-container">
          <div className="icon-item">
            🎄<span id="tree-icon-count">0</span>
          </div>
          <div className="icon-item">
            🎁<span id="gift-icon-count">0</span>
          </div>
          <div className="icon-item">
            🎅<span id="santa-icon-count">0</span>
          </div>
          <div className="icon-item">
            ⛄<span id="snowman-icon-count">0</span>
          </div>
          <div className="icon-item">
            ❄️<span id="snowflake-icon-count">0</span>
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
