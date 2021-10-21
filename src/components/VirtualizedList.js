import React, {useState, useEffect} from "react";

function VirtualizedList({data, height, elementHeight, getData}) {
  const [items, setItems] = useState([]);
  useEffect(() => {
    const firstSet = [];
    for(let i=0;i<height / elementHeight;i++) {
      if(i<data.length) {
        firstSet.push({...data[i], actualIndex: i})
      }
    }
    setItems(firstSet);
  }, []);
  function handleScroll(e) {
    const {target} = e;
    const startingIndex = Math.floor((target.scrollTop) / elementHeight);
    const endingIndex = Math.floor((target.scrollTop + Number(height)) / elementHeight);
    const updatedItems = [];
    for(let i=startingIndex;i<=endingIndex;i++) {
      if(i<data.length) {
        updatedItems.push({...data[i], actualIndex: i})
      }
    }
    setItems(updatedItems)
  }
  return (
    <div className="virtualList" style={{height: `${height}px`, overflow: "scroll"}} onScroll={handleScroll}>
      <div className="allData" style={{height: `${elementHeight*data.length}px`, position: "relative"}}>
        {items.map(eachItem => {
          return (
            <div style={{height: elementHeight, position: "absolute", top: `${eachItem.actualIndex * elementHeight}px`}}>
              {getData(eachItem, eachItem.actualIndex)}
            </div>
          );
        })}
      </div>  
    </div>
  );
}

export default VirtualizedList;
