import antwerp from "./antwerp.json";
import san_francisco from "./san_francisco.json";
import chicago from "./chicago.json";
import toronto from "./toronto.json";
import { useEffect, useState } from "react";
import { collection, onSnapshot } from "firebase/firestore";
import { db } from "../../../../App";
import { Text } from "../../../components/typography/text.component";

export const mocks = {
  "51.219448,4.402464": antwerp,
  "37.7749295,-122.4194155": san_francisco,
  "41.886065,-87.6208832": chicago,
  "43.6465623,-79.374578": toronto,
};

export const mockImages = [
  "https://www.foodiesfeed.com/wp-content/uploads/2019/06/top-view-for-box-of-2-burgers-home-made-600x899.jpg",
  "https://www.foodiesfeed.com/wp-content/uploads/2019/04/mae-mu-oranges-ice-600x750.jpg",
  "https://www.foodiesfeed.com/wp-content/uploads/2020/08/detail-of-pavlova-strawberry-piece-of-cake-600x800.jpg",
  "https://www.foodiesfeed.com/wp-content/uploads/2019/04/mae-mu-baking-600x750.jpg",
  "https://www.foodiesfeed.com/wp-content/uploads/2019/04/mae-mu-pancakes-600x750.jpg",
  "https://www.foodiesfeed.com/wp-content/uploads/2019/02/messy-pizza-on-a-black-table-600x400.jpg",
  "https://www.foodiesfeed.com/wp-content/uploads/2019/02/pizza-ready-for-baking-600x400.jpg",
];

export const pullCities = () => {
  const [citiesList, setCitiesList] = useState();

  useEffect(() => {
    try {
      onSnapshot(collection(db, "cities"), (snapshot) => {
        // console.log("snapSHOT");

        setCitiesList(snapshot.docs.map((doc) => doc.data()));
        setCitiesList(snapshot.docs.map((doc) => doc.data()));
        // console.log(restList);
      });
    } catch (e) {
      alert("Issue pulling collection list");
      return;
    }
  }, [citiesList]);
};
