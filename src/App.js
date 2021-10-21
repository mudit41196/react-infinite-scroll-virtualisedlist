import React, {useState, useEffect, useCallback, useRef} from "react";
import "./App.css";
import VirtualizedList from "./components/VirtualizedList";

const PAGE_SIZE = 10;

function App() {
  const [page, changePage] = useState(0);
  const [data, setData] = useState([]);
  const [totalPassengers, setTotalPassengers] = useState(null);
  useEffect(() => {
    fetch(`https://api.instantwebtools.net/v1/passenger?page=${page}&size=${PAGE_SIZE}`,{
      mode: "cors",
      method: "GET",
      headers: {
        "Accept": "application/json"
      }
    }).then((res) => res.json()).then(result => {
      if(!totalPassengers) {
        setTotalPassengers(result.totalPassengers);
      }
      setData([...data, ...result.data]);
    });
  }, [page]);

  const observer = useRef(null);
  const previousRender = useRef(null);
  const lastElement = useCallback((node) => {
    if(observer.current) {
      observer.current.disconnect();
    }
    if(node && node !== previousRender.current) {
      observer.current = new IntersectionObserver((enteries) => {
        if(enteries[0].isIntersecting) {
          changePage(p => p + 1);
          // fetch data if last is intersecting
          return;
        }
      }, {root: document.getElementsByClassName("App")[0], threshold: 0.5});
      observer.current.observe(node);
      previousRender.current = node;
    }
  }, [page]);
  const getData = (eachDataObj, actualIndex) => {
    const isSecondLastElement = actualIndex === ((page+1)*PAGE_SIZE) - 2;
    if(isSecondLastElement) {
      return (
        <div className="passenger" ref={lastElement}>
          <div>
          {eachDataObj.name}
          </div>
          <div>
            {eachDataObj.trips || 0}
          </div>
        </div>
      );
    } else {
      return (
        <div className="passenger">
          <div>
          {eachDataObj.name}
          </div>
          <div>
            {eachDataObj.trips || 0}
          </div>
        </div>
      );
    }
  }
  return (
    data.length ? 
      ( <VirtualizedList 
      height="500"
      data={data}
      elementHeight="80"
      getData={getData}
      />) : null
  );
  // return (
  //   <div className="App">
  //     {data.map((eachData, index) => {
  //       return (
  //         getData(eachData, index)
  //       );
  //     })}
  //   </div>
  // )
}

export default App;