import React, { useState, useEffect } from "react";
import { Network } from "vis-network";

function NetworkGraph() {
  const [network, setNetwork] = useState(null);
  const [nodeList, setNodeList] = useState([]);
  const [edgeList, setEdgeList] = useState([]);

  const [start, setStart] = useState([]);
  let output = [];
  const [stringArray, setStringArray] = useState([]);
  const [graphAnimate, setGraphAnimate] = useState([]);

  const stringDisplay = () => {
    setStringArray(output);
  }

  const addNode = () => {
    const nodeName = prompt("Enter node name:");
    if (nodeName) {
      const nodeExists = nodeList.some((node) => node.id === nodeName);
      if (!nodeExists) {
        setNodeList((prevList) => [...prevList, { id: nodeName, label: nodeName }]);
      } else {
        alert("Node already exists.");
      }
    }
  };


  const addEdge = () => {
    const fromNode = prompt("Enter starting node for edge:");
    const toNode = prompt("Enter ending node for edge:");
    const weight = prompt("Enter edge weight:");
  
    // check if both fromNode and toNode exist in nodeList
    const fromNodeExists = nodeList.some((node) => node.id === fromNode);
    const toNodeExists = nodeList.some((node) => node.id === toNode);
  
    if (fromNodeExists && toNodeExists && weight) {
      // check if an edge already exists between the given nodes
      const edgeExists = edgeList.some(
        (edge) => edge.from === fromNode && edge.to === toNode
      );
  
      if (!edgeExists) {
        setEdgeList((prevList) => [
          ...prevList,
          { from: fromNode, to: toNode, label: weight },
        ]);
      } else {
        // edge already exists, show an error message or handle the case in some way
        alert("Edge already exists between the given nodes.");
      }
    } else {
      // either fromNode or toNode does not exist in the nodeList, show an error message or handle the case in some way
      alert("One or both of the nodes do not exist.");
    }
  };

  const deleteEdge = () => {
    const fromNode = prompt("Enter starting node for edge:");
    const toNode = prompt("Enter ending node for edge:");
  
    // check if an edge already exists between the given nodes
    const edgeExists = edgeList.some(
      (edge) =>
        (edge.from === fromNode && edge.to === toNode) ||
        (edge.from === toNode && edge.to === fromNode)
    );
  
    if (edgeExists) {
      // delete edges in both directions
      setEdgeList((prevList) =>
        prevList.filter(
          (edge) =>
            !(
              (edge.from === fromNode && edge.to === toNode) ||
              (edge.from === toNode && edge.to === fromNode)
            )
        )
      );
    } else {
      // edge does not exist, show an error message or handle the case in some way
      alert("Edge does not exist between the given nodes.");
    }
  };

  useEffect(() => {
    drawGraph();
  }, [nodeList, edgeList, start]);

  const loadDefaultGraph = () => {
    setNodeList([
      { id: "U", label: "U" },
      { id: "X", label: "X" },
      { id: "V", label: "V" },
      { id: "W", label: "W" },
      { id: "Y", label: "Y" },
      { id: "Z", label: "Z" },
    ]);
    setEdgeList([
      { from: "U", to: "V" , label: "2"},
      { from: "U", to: "W" , label: "5"},
      { from: "U", to: "X" , label: "1"},
      { from: "V", to: "X" , label: "2"},
      { from: "V", to: "W" , label: "3"},
      { from: "W", to: "Y" , label: "1"},
      { from: "W", to: "Z" , label: "5"},
      { from: "W", to: "X" , label: "3"},
      { from: "X", to: "Y" , label: "1"},
      { from: "Y", to: "Z" , label: "2"},
    ]);
  };

  const getNodeEdges = (nodeList, edgeList) => {
    const edgesByNode = {};
  
    // create an array to store the ids of all nodes
    const nodeIds = nodeList.map((node) => node.id);
  
    // iterate through each node id and get its edges
    nodeIds.forEach((nodeId) => {
      // find all edges where this node is the "from" node
      const fromEdges = edgeList.filter((edge) => edge.from === nodeId);
      // find all edges where this node is the "to" node
      const toEdges = edgeList.filter((edge) => edge.to === nodeId);
  
      // create an array to store this node's edges and weights
      const edgesWithWeights = [];
  
      // add each "from" edge to the array, with its weight
      fromEdges.forEach((edge) => {
        edgesWithWeights.push({ node: edge.to, weight: edge.label });
      });
  
      // add each "to" edge to the array, with its weight
      toEdges.forEach((edge) => {
        edgesWithWeights.push({ node: edge.from, weight: edge.label });
      });
  
      // add this node's edges and weights to the object
      edgesByNode[nodeId] = edgesWithWeights;
    });
  
    return edgesByNode;
  };

  const outputInitdij = () => {
    output = [];
    let tempStr = "";
    output.push("D(v): current estimate of cost of least-cost-path from source to destination v");
    output.push("p(v): predecessor node along path from source to v");
    const nodeIds = nodeList.map((node) => node.id);
    tempStr = tempStr + "Step".toString().padEnd(20) +  "N'".toString().padEnd(20)
     for (let i in nodeIds) {
      const nodeId = nodeIds[i];
      if (nodeId != start){
      tempStr = tempStr + (`D(${nodeId})p(${nodeId})`).toString().padEnd(20);}
      
     }
     output.push(tempStr);
  }

  const calcWeight = (dijEdges, curNode) => {
    let acc = Number(curNode["weight"]);
    let traverseNode = curNode["node"];
    while (traverseNode != start) {
      acc += Number(dijEdges[traverseNode]["weight"]);
      traverseNode = dijEdges[traverseNode]["node"];
    }
    return acc;
  }

  const outputFormater = (distances, visisted, dijEdges, counter) => {
    let tempStr = (`${counter}`).toString().padEnd(20);
    const nodeIds = nodeList.map((node) => node.id);
    const visit = Object.keys(visisted);
    let tempN = "";
    for (let i in visit){
      tempN = tempN + visit[i];
    }
    tempStr += tempN.toString().padEnd(20)
    for (let i in nodeIds) {
      const nodeId = nodeIds[i];
      if (!visit.includes(nodeId)) {
        if (distances[nodeId] === Infinity ){
          tempStr = tempStr + "Inf".toString().padEnd(20);
          
        }
        else{
          if (dijEdges.hasOwnProperty(nodeId)){
            tempStr = tempStr + (dijEdges[nodeId]["node"] + ","+ calcWeight(dijEdges, dijEdges[nodeId])).toString().padEnd(20);
          }
        }
      }
      else if (nodeId != start){
        tempStr += "".toString().padEnd(20);
      }
  }
    output.push(tempStr);
  }

  const dijkstraCaller = () => {
    
    if (nodeList.some(node => node.id === start)) {
      dijkstra();
    }
    else{
      const container = document.getElementById("algorithmGraph");
      container.innerHTML = "<p>Error: Please Select Initial Vertex</p>";
    }
  }

  const stopAnimation = () => {
    document.getElementById("visualizeAlgo").innerHTML = "";
  };

  const bellmanCaller = () => {
    if (nodeList.some((node) => node.id === start)) {
      bellmanFord();
    } else {
      const container = document.getElementById("algorithmGraph");
      container.innerHTML = "<p>Error: Please Select Initial Vertex</p>";
    }
  };

  const dijkstra = () =>{
  
    const graph = getNodeEdges(nodeList, edgeList);
    
    const distances = {};
    const visisted = {};
    const dijEdges = {};
    let unvisited = Object.keys(graph);
    let arr = [];

    unvisited.forEach((node) => {
      distances[node] = Infinity;
    });

    outputInitdij();
    let counter = 0;

    distances[start] = 0;

    while (unvisited.length > 0){
      let currentNode = null;
      let tempEdge = {};
      let curLeastDistance = Infinity;
      unvisited.forEach((node) => {
        if (currentNode === null || distances[node] < distances[currentNode]) {
          currentNode = node;
        }
      });

      const neighbors = graph[currentNode];

      neighbors.forEach((neighbor) => {
        let distance = Number(neighbor.weight);
        let newDistance = distances[currentNode] + distance;
        
        if (newDistance < distances[neighbor.node]){
          distances[neighbor.node] = newDistance;
          dijEdges[neighbor.node] = {node: currentNode, weight: neighbor.weight};
        }
        })
      
      visisted[currentNode] = distances[currentNode];
      unvisited = unvisited.filter((node) => node !== currentNode);
      outputFormater(distances, visisted, dijEdges, counter);
      counter++;

      curLeastDistance = null;
      unvisited.forEach((node) => {
        
        if (curLeastDistance === null || distances[node] < distances[curLeastDistance]) {
          curLeastDistance = node;
        }
      });
      if (dijEdges.hasOwnProperty(curLeastDistance)){
        arr.push({ from: curLeastDistance, to: dijEdges[curLeastDistance].node, label: dijEdges[curLeastDistance].weight })
      }
    }
    
    output.map((str) => console.log(str));
    stringDisplay();
    const data = {
      nodes: nodeList,
      edges: arr,
    };
    const options = {
      edges: {
        labelHighlightBold: false,
        font: { size: 20, color: '#000000' },
      },
      nodes: {
        font: { size: 20, color: '#000000' },
      },layout: {
        hierarchical: false,
        randomSeed: 2,
      },
    };
    const container = document.getElementById("algorithmGraph");
    const network = new Network(container, data, options);
    network.body.nodes[start].setOptions({ color: { background: "red" } });
    setNetwork(network);
    setGraphAnimate(arr);
  }
  
  const addEdges = () => {
    console.log(graphAnimate);
    console.log("yo");
    const container = document.getElementById("visualizeAlgo");
    const options = {
      edges: {
        labelHighlightBold: false,
        font: { size: 20, color: "#000000" },
      },
      nodes: {
        font: { size: 20, color: "#000000" },
      },
      layout: {
        hierarchical: false,
        randomSeed: 2,
      },
      physics: {
        enabled: true,
        barnesHut: {
          gravitationalConstant: -1000,
          springLength: 100,
          springConstant: 0.00,
          avoidOverlap: 0,
        },
        maxVelocity: 0,
        solver: "barnesHut",
        timestep: 0.5,
        adaptiveTimestep: true,
      },
    };
  
    let i = 0;
    const animationLoop = () => {
      const edgesToAdd = graphAnimate.slice(0, i + 1);
      const data = {
        nodes: nodeList,
        edges: edgesToAdd,
      };
  
      // Add fixed node positions to options
      options.layout = {
        improvedLayout: false,
        hierarchical: false,
        randomSeed: 2,
      };
  
      const network = new Network(container, data, options);
      network.body.nodes[start].setOptions({ color: { background: "red" } });
      setNetwork(network);
      i++;
  
      if (i < graphAnimate.length) {
        setTimeout(animationLoop, 1500);
      }
    };
  
    animationLoop();
  };
  

  const startVertex = () => {
    const tempStart = prompt("Enter initial node by name:");
    const nodeExists = nodeList.some((node) => node.id === tempStart);
    
    if (nodeExists) {
      setStart(tempStart);
    } else {
      alert("The entered node does not exist.");
    }
  };

  const bellOutputInit = (dist) => {
    output = [];
    let tempStr = "";
    output.push("D(v): current estimate of cost of least-cost-path from source to destination v");
    output.push("p(v): predecessor node along path from source to v");
    const nodeIds = nodeList.map((node) => node.id);
    tempStr = tempStr + "Step".toString().padEnd(20);
     for (let i in dist) {
      if (i != start){
      tempStr = tempStr + (`D(${i})p(${i})`).toString().padEnd(20);}
      
     }
     output.push(tempStr);
  }

  const outputAppendBell = (dist, prev, counter) => {
    // let tempStr = "";
    // tempStr += ("Step " + counter).toString().padEnd(20);
    // for (let i in dist){
    //   tempStr += (i + ": " + dist[i] + "," +  (prev[i] !== null ? prev[i] : "N/A")).toString().padEnd(20);
     
    // }
    // output.push(tempStr);

    let tempStr = "";
    tempStr += (counter).toString().padEnd(20);
    for (let i in dist){
      if (i != start){
        tempStr += ((dist[i] !== Infinity ? dist[i] : "Inf") +  (prev[i] !== null ? "," + prev[i] : "")).toString().padEnd(20);
      }
    }
    output.push(tempStr);
    return counter+=1;
  }

  const bellmanFord = () => {
    const distances = {};
    const prevNodes = {};
    const nodeIds = nodeList.map((node) => node.id);
    const bestEdge = {};
    let counter = 0;
    
    // Initialize all distances to Infinity and prevNodes to null
    for (let i in nodeIds) {
      const nodeId = nodeIds[i];
      distances[nodeId] = Infinity;
      prevNodes[nodeId] = null;
    }
  
    // Set distance of start node to 0
    distances[start] = 0;
    bellOutputInit(distances);
    counter = outputAppendBell(distances, prevNodes, counter);
    
    // Relax edges |V|-1 times
    for (let i = 0; i < nodeIds.length - 1; i++) {
       // Forward direction
    for (let j = 0; j < edgeList.length; j++) {
      const edge = edgeList[j];
      let fromNode = edge.from;
      let toNode = edge.to;
      const weight = Number(edge.label);
      let newDistance = distances[fromNode] + weight;

      if (newDistance < distances[toNode]) {
        bestEdge[toNode] = { from: fromNode, to: toNode, label: String(weight) };
        distances[toNode] = newDistance;
        prevNodes[toNode] = fromNode;
      }

      // Backward direction
      fromNode = edge.to;
      toNode = edge.from;
      newDistance = distances[fromNode] + weight;
      if (newDistance < distances[toNode]) {
            bestEdge[toNode] = { from: fromNode, to: toNode, label: String(weight) };
            distances[toNode] = newDistance;
            prevNodes[toNode] = fromNode;
          }
    }
    counter = outputAppendBell(distances, prevNodes, counter);
  }
  
    // Check for negative-weight cycles
    for (let i in edgeList) {
      const fromNode = edgeList[i].from;
      const toNode = edgeList[i].to;
      const weight = Number(edgeList[i].label);
  
      if (isFinite(distances[toNode]) && distances[fromNode] + weight < distances[toNode]) {
        throw new Error("Negative-weight cycle detected");
      }
    }
    const data = {
      nodes: nodeList,
      edges: Object.values(bestEdge),
    };
    const options = {
      edges: {
        labelHighlightBold: false,
        font: { size: 20, color: '#000000' },
      },
      nodes: {
        font: { size: 20, color: '#000000' },
      },layout: {
        hierarchical: false,
        randomSeed: 2,
      },
    };
    const container = document.getElementById("algorithmGraph");
    networkConstruct(container, data, options);
    stringDisplay();
  };

  const networkConstruct = (container, data, options) => {
    if (nodeList.some(node => node.id === start)) {
      const network = new Network(container, data, options);
      network.body.nodes[start].setOptions({ color: { background: "red" } });
      setNetwork(network);
    }
    else{
      const network = new Network(container, data, options);
      setNetwork(network);
    }
  }
  

  const drawGraph = () => {
    const data = {
      nodes: nodeList,
      edges: edgeList,
    };
    const options = {
      edges: {
        labelHighlightBold: false,
        font: { size: 20, color: '#000000' },
      },
      nodes: {
        font: { size: 20, color: '#000000' },
      },layout: {
        hierarchical: false,
        randomSeed: 2,
      },
    };
    const container = document.getElementById("network");
    networkConstruct(container, data, options);
  };

  return (
    <div>
      <button onClick={addNode}>Add Node</button>
      <button onClick={addEdge}>Add Edge</button>
      <button onClick={deleteEdge}>Delete Edge</button>
      <button onClick={loadDefaultGraph}>Default Graph</button>
      <button onClick={drawGraph}>Draw Graph</button>
      <button onClick={startVertex} style={{ marginLeft: '25%' }}>Choose Initial Vertex</button>
      <button onClick={dijkstraCaller}>Dijkstra</button>
      <button onClick={bellmanCaller}>DV: Bellman-Ford</button>
      <div style={{display: "flex"}}>
      <div style={{ width: "50%" }}>
        <p>Original graph:</p>
        <div id="network" style={{ width: "100%", height: "500px" }}></div>
      </div>
      <div style={{ width: "50%" }}>
        <p>Algorithm Applied:</p>
        <div id="algorithmGraph" style={{ width: "100%", height: "500px" }}></div>
      </div>
    </div>
      <div id="output">{stringArray.map((string, index) => (
          <pre key={index}>{string}</pre>
        ))}</div>
        <button onClick={addEdges}>Animate Dijkstra</button>
        <button onClick={stopAnimation}>Clear</button>
      <div id="visualizeAlgo" style={{ width: "100%", height: "500px" }}></div>
    </div>
  );
}

export default NetworkGraph;
