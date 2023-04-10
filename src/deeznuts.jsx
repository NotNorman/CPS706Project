const bellmanFord = (startNode) => {
    const distances = {};
    const prevNodes = {};
    const nodeIds = nodeList.map((node) => node.id);
  
    for (let i = 0; i < nodeIds.length; i++) {
      distances[nodeIds[i]] = Infinity;
    }
    distances[startNode] = 0;
  
    for (let i = 0; i < nodeIds.length - 1; i++) {
      for (let j = 0; j < edgeList.length; j++) {
        const edge = edgeList[j];
        const fromNode = edge.from;
        const toNode = edge.to;
        const weight = edge.weight;
        const newDistance = distances[fromNode] + weight;
  
        if (newDistance < distances[toNode]) {
          distances[toNode] = newDistance;
          prevNodes[toNode] = fromNode;
        }
      }
    }
  
    // update network graph
    const edges = edgeList.map((edge) => {
      const fromNode = edge.from;
      const toNode = edge.to;
      const weight = edge.weight;
      const id = `${fromNode}-${toNode}`;
      let color = "#000000";
      if (distances[fromNode] + weight < distances[toNode]) {
        color = "#FF0000";
      }
      return { id, from: fromNode, to: toNode, label: weight.toString(), color };
    });
    const nodes = nodeList.map((node) => {
      const id = node.id;
      let color = "#000000";
      if (id === startNode) {
        color = "#FF0000";
      }
      return { id, label: node.label, color };
    });
    const data = { nodes, edges };
    const container = document.getElementById("network");
    const network = new Network(container, data);
  };
  
  const handleClick = () => {
    const startNode = prompt("Enter start node:");
    if (startNode && nodeList.some((node) => node.id === startNode)) {
      bellmanFord(startNode);
    }
  };