import React, {useEffect, useState} from 'react';
import classes from './AvailableMeals.module.css';
import MealItem from "./MealItem/MealItem";
import Card from "../UI/Card";

const AvailableMeals = () => {

  const [meals, setMeals] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMeal = () => {
      fetchMealsHandler().catch(error => {
        console.log(error);
        setError(error.message);
      });
    };
    fetchMeal();
  }, []);

  const fetchMealsHandler = async () => {
    setError(null);
    const response = await fetch("http://localhost:8080/api/v1/getAllMeals");
    const data = await response.json();
    console.log(data);

    const loadedMeals = [];
    for (const key in data) {
      loadedMeals.push({
        id: key,
        name: data[key].name,
        description: data[key].description,
        price: data[key].price,
      });
    }
    setMeals(loadedMeals);
  }

  let content = <p>No meals found</p>;
  if (meals.length > 0) {
    content = meals.map(
        meal => <MealItem
            key={meal.id}
            id={meal.id}
            name={meal.name}
            description={meal.description}
            price={meal.price}/>);
  }
  if (error) {
    content = <p>{error}</p>;
  }

  return (
      <section className={classes.meals}>
        <Card>
          <ul>
            {content}
          </ul>
        </Card>
      </section>
  );
}

export default AvailableMeals;