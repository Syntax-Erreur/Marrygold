import { useCallback, useEffect, useRef, useState } from "react";
import DashboardCard from "./DashboardCard";
import { EventFormData, EventNode, EventNodeData } from "./placeholder-node";
import { addEdge, Connection, ConnectionLineType, Handle, Node, Position, ReactFlow, useEdgesState, useNodesState } from "@xyflow/react";
import InputDesign from "./inputdesgin";
import { useRouter } from "next/navigation";
import Image from "next/image";
import type { FirestoreEventData } from "@/types/event";



interface EventsFlowProps {
  events: (FirestoreEventData & { id: string })[]
  isLoading: boolean
}

const EventsFlow = ({ events, isLoading }: EventsFlowProps) => {
  const router = useRouter();
  const reactFlowWrapper = useRef<HTMLDivElement>(null)

  const [showCreateEventModal, setShowCreateEventModal] = useState(false)

  // Add a state to track viewport width
  const [windowWidth, setWindowWidth] = useState(
    typeof window !== 'undefined' ? window.innerWidth : 1024
  );

  // Update window width on resize
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const ConnectionPointNode = () => {
    return <div
      style={{
        width: 8,
        height: 8,
        background: "white",
        border: "1px solid #999",
        borderRadius: "50%",
        position: "absolute",
        boxShadow: '0 0 3px rgba(0,0,0,0.2)',
        zIndex: 50
      }}
    />
  }

  const DashboardNode = ({ data }: { data: { showConnection?: boolean; locked?: boolean; label?: string; title?: string } }) => {

    const { showConnection = true } = data;

    return (
      <div
        className="bg-white border overflow-hidden pb-6 rounded-3xl border-[rgba(231,231,231,1)] border-solid"
        style={{
          width: '100%',
          maxWidth: '580px',
          boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
        }}
      >
        <Image
          width={580}
          height={390}
          src="https://res.cloudinary.com/dvfk4g3wh/image/upload/v1743220659/Frame_1000004030_wkgt87.png"
          className="aspect-[3.77] object-cover w-full"
          alt="Dashboard background"
        />
        <div className="z-20 flex mt-[-17px] items-center px-[1.125em]">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-5 w-full">
            <DashboardCard
              title="Global Guest Lists"
              subtitle="All the Guests who are participate event."
              avatars={true}
              onClick={() => router.push("/guest-list")}

            />
            <DashboardCard
              title="Total Budget List"
              subtitle="Total Budget for all events."
              tags={[
                { name: "Haldi", color: "yellow" },
                { name: "Sangeet", color: "indigo" },
                { name: "Engagement", color: "cyan" }
              ]}
              onClick={() => router.push("/budget")}
            />
          </div>
        </div>
        {showConnection && (
          <Handle
            type="source"
            position={Position.Right}
            style={{
              top: "30%",
              right: 0,
              zIndex: 50,
              background: "#fff",
              border: "1px solid #999",
              width: "8px",
              height: "8px",
              visibility: "visible",
              boxShadow: '0 0 3px rgba(0,0,0,0.2)'
            }}
          />
        )}
      </div>
    );
  };

  const nodeTypes = {
    eventNode: EventNode,
    connectionPoint: ConnectionPointNode,
    dashboardNode: DashboardNode,
  }

  const initialNodes: Node<EventNodeData>[] = [
    {
      id: "dashboard",
      position: { x: 350, y: 240 },
      data: {
        showConnection: true,
        locked: true
      },
      type: "dashboardNode",
      draggable: false,
      deletable: false,
      connectable: true,
      selectable: false,
      sourcePosition: Position.Right,
      zIndex: 40,
      style: {
        width: 580,
        height: 'auto',
      },
    },
    {
      id: "haldi",
      position: { x: 720, y: 100 },
      data: {
        title: "Haldi Event",
        date: "06 - 01 - 2024",
        attendees: 24,
        bgColor: "bg-[rgba(255,251,232,1)]",
      },
      sourcePosition: Position.Right,
      targetPosition: Position.Left,
      type: "eventNode",
      draggable: true,
      zIndex: 30,
    },
    {
      id: "sangeet",
      position: { x: 720, y: 280 },
      data: {
        title: "Sangeet Ceremony",
        date: "06 - 01 - 2024",
        attendees: 24,
        bgColor: "bg-[rgba(255,225,246,1)]",
      },
      sourcePosition: Position.Right,
      targetPosition: Position.Left,
      type: "eventNode",
      draggable: true,
    },
    {
      id: "engagement",
      position: { x: 720, y: 460 },
      data: {
        title: "Engagement Ceremony",
        date: "06 - 01 - 2024",
        attendees: 24,
        bgColor: "bg-[rgba(225,243,252,1)]",
      },
      sourcePosition: Position.Right,
      targetPosition: Position.Left,
      type: "eventNode",
      draggable: true,
    },
    {
      id: "add-event",
      position: { x: 1020, y: 460 },
      data: { label: "Add New Event" },
      type: "eventNode",
      draggable: true,
      targetPosition: Position.Left,
    },
  ]

  const initialEdges = [
    {
      id: "e-dashboard-haldi",
      source: "dashboard",
      target: "haldi",
      sourceHandle: null,
      targetHandle: null,
      animated: true,
      type: "smoothstep",
      style: {
        stroke: "#aaa",
        strokeWidth: 2,
        strokeDasharray: "5 5",
        zIndex: 40,
      },
    },
    {
      id: "e-haldi-sangeet",
      source: "haldi",
      target: "sangeet",
      sourceHandle: null,
      targetHandle: null,
      animated: true,
      type: "smoothstep",
      style: {
        stroke: "#aaa",
        strokeWidth: 2,
        strokeDasharray: "5 5",
        zIndex: 40,
      },
    },
    {
      id: "e-sangeet-engagement",
      source: "sangeet",
      target: "engagement",
      sourceHandle: null,
      targetHandle: null,
      animated: true,
      type: "smoothstep",
      style: {
        stroke: "#aaa",
        strokeWidth: 2,
        strokeDasharray: "5 5",
        zIndex: 40,
      },
    },
    {
      id: "e-engagement-add",
      source: "engagement",
      target: "add-event",
      sourceHandle: null,
      targetHandle: null,
      animated: true,
      type: "smoothstep",
      style: {
        stroke: "#aaa",
        strokeWidth: 2,
        strokeDasharray: "5 5",
        zIndex: 40,
      },
    },
  ]

  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes)
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges)

  const onConnect = useCallback((params: Connection) => setEdges((eds) => addEdge(params, eds)), [setEdges])

  // Custom edge styling
  const edgeOptions = {
    animated: true,
    style: {
      stroke: "#ddd",
      strokeWidth: 2,
      strokeDasharray: "5 5",
    },
    zIndex: 5,
  }

  // Handle node drag events - simplified to allow free movement
  const onNodeDragStart = useCallback(
    (event: React.MouseEvent, node: Node) => {
      // Only mark this specific node as dragging
      setNodes((nds) =>
        nds.map((n) => {
          if (n.id === node.id) {
            return {
              ...n,
              className: "dragging-node",
            }
          }
          return n
        }),
      )
    },
    [setNodes],
  )

  // Allow nodes to be dragged anywhere without restrictions
  const onNodeDrag = useCallback(() => {
    // No restrictions or processing - let nodes move freely
  }, [])

  const onNodeDragStop = useCallback(
    (event: React.MouseEvent, node: Node) => {
      // Reset the dragging state for this specific node
      setNodes((nds) =>
        nds.map((n) => {
          if (n.id === node.id) {
            return {
              ...n,
              className: "",
            }
          }
          return n
        }),
      )
    },
    [setNodes],
  )

  // Add this handler for node click
  const onNodeClick = useCallback((event: React.MouseEvent, node: Node<EventNodeData>) => {
    // Check if the clicked node is the "add-event" node
    if (node.id === "add-event") {
      setShowCreateEventModal(true);
    }
  }, []);

  // Adjust node positions based on viewport width
  useEffect(() => {
    if (windowWidth < 768) {
      // Mobile layout - stack nodes vertically with better spacing
      setNodes(nodes => nodes.map(node => {
        if (node.id === "dashboard") {
          return {
            ...node,
            position: { x: 20, y: 20 },
            style: {
              ...node.style,
              width: windowWidth - 40, // Full width minus margins
            }
          };
        } else if (node.id === "haldi") {
          return {
            ...node,
            position: { x: windowWidth / 2 - 115, y: 320 },
            style: {
              ...node.style,
              width: '230px',
            }
          };
        } else if (node.id === "sangeet") {
          return {
            ...node,
            position: { x: windowWidth / 2 - 115, y: 440 },
            style: {
              ...node.style,
              width: '230px',
            }
          };
        } else if (node.id === "engagement") {
          return {
            ...node,
            position: { x: windowWidth / 2 - 115, y: 560 },
            style: {
              ...node.style,
              width: '230px',
            }
          };
        } else if (node.id === "add-event") {
          return {
            ...node,
            position: { x: windowWidth / 2 - 115, y: 680 },
            style: {
              ...node.style,
              width: '230px',
            }
          };
        }
        return node;
      }));

      // Also update the edges for mobile view
      setEdges(edges => edges.map(edge => {
        return {
          ...edge,
          type: "smoothstep",
          style: {
            ...edge.style,
            stroke: "#aaa",
            strokeWidth: 2,
            strokeDasharray: "5 5",
          }
        };
      }));
    } else {
      // Original desktop layout
      setNodes(nodes => nodes.map(node => {
        if (node.id === "dashboard") {
          return {
            ...node,
            position: { x: 285, y: 240 },
            style: {
              ...node.style,
              width: 580,
            }
          };
        } else if (node.id === "haldi") {
          return { ...node, position: { x: 890, y: 40 } };
        } else if (node.id === "sangeet") {
          return { ...node, position: { x: 890, y: 220 } };
        } else if (node.id === "engagement") {
          return { ...node, position: { x: 740, y: 400 } };
        } else if (node.id === "add-event") {
          return { ...node, position: { x: 1040, y: 400 } };
        }
        return node;
      }));
    }
  }, [windowWidth, setNodes, setEdges]);

  // Improve the useEffect to ensure proper positioning and visibility
  useEffect(() => {
    const flowElement = document.querySelector(".react-flow");
    if (flowElement) {
      (flowElement as HTMLElement).style.height = "100%";
      (flowElement as HTMLElement).style.width = "100%";
      (flowElement as HTMLElement).style.position = "absolute";
      (flowElement as HTMLElement).style.overflow = "visible";
      (flowElement as HTMLElement).style.zIndex = "10";
    }

    // Let's simplify this by using fixed node positions instead of dynamic calculations

    // Add custom styles for better visibility
    const style = document.createElement("style");
    style.innerHTML = `
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@700&family=Inter:wght@600&family=DM+Sans:wght@300&family=Sorts+Mill+Goudy&display=swap');
        
        .font-jakarta {
          font-family: 'Plus Jakarta Sans', sans-serif;
        }
        
        .font-inter {
          font-family: 'Inter';
        }
        
        .font-dm-sans {
          font-family: 'DM Sans', sans-serif;
        }
        
        .font-sorts-mill {
          font-family: 'Sorts Mill Goudy', serif;
        }
        
        .react-flow__node {
          transition: opacity 0.2s, filter 0.2s;
        }
        
        .react-flow__node[data-type="dashboardNode"] {
          max-width: 580px !important;
        }
        
        .react-flow__node[data-type="eventNode"] {
          max-width: 260px !important;
        }
        
        .react-flow__handle {
          width: 8px !important;
          height: 8px !important;
          background: white !important;
          border: 1px solid #999 !important;
          box-shadow: 0 0 3px rgba(0,0,0,0.2) !important;
          z-index: 50 !important;
          pointer-events: all !important;
        }
        
        .react-flow__edge {
          z-index: 40 !important;
          pointer-events: all !important;
        }
        
        .react-flow__edge-path {
          stroke: #aaa !important;
          stroke-width: 2 !important;
          stroke-dasharray: 5 5 !important;
        }
        
        .react-flow__edge.animated .react-flow__edge-path {
          stroke-dashoffset: 0;
          animation: dashdraw 10s linear infinite;
        }
        
        @keyframes dashdraw {
          from {
            stroke-dashoffset: 50;
          }
          to {
            stroke-dashoffset: 0;
          }
        }
        
        .dragging-node {
          opacity: 0.7 !important;
          z-index: 0 !important;
        }
        
        .react-flow__node:not(.dragging-node) {
          z-index: 30 !important;
        }
        
        .dashboard-card {
          z-index: 20 !important;
          position: relative !important;
          overflow: visible !important;
        }
        
        #connection-point {
          display: block !important;
        }
      `;
    document.head.appendChild(style);

    // Cleanup
    return () => {
      document.head.removeChild(style);
    };
  }, []);

  // Handle closing the modal
  const handleCloseModal = useCallback(() => {
    setShowCreateEventModal(false);
  }, []);

  // Create new event node with form data
  const handleCreateEvent = useCallback((formData: EventFormData) => {
    // Find the "add-event" node to get its position
    const addEventNode = nodes.find(n => n.id === "add-event");
    if (!addEventNode) return;

    // Map color index to background color
    const themeColorMap: Record<number, string> = {
      0: "bg-[rgba(255,251,232,1)]", // Yellow
      1: "bg-[rgba(225,243,252,1)]", // Blue
      2: "bg-[rgba(255,225,246,1)]", // Pink
      3: "bg-[rgba(235,255,236,1)]", // Green
      4: "bg-[rgba(245,235,255,1)]", // Purple
    };

    // Create event data from form
    const eventData = {
      title: formData.eventName || "New Event",
      date: "06 - 01 - 2024",
      attendees: parseInt(formData.tables || "0") * parseInt(formData.peoplePerTable || "0") || 24,
      bgColor: formData.themeColorIndex !== null && formData.themeColorIndex !== undefined
        ? themeColorMap[formData.themeColorIndex]
        : "bg-[rgba(225,243,252,1)]",
    };

    // Update the "add-event" node with the new event data
    setNodes((nds) =>
      nds.map((n) => {
        if (n.id === "add-event") {
          return {
            ...n,
            data: eventData,
            // Keep the same position, but update the node type
            type: "eventNode",
          };
        }
        return n;
      })
    );

    // Create a new "Add New Event" node that will always appear below
    const newAddEventNode = {
      id: `add-event-${Date.now()}`, // New unique ID
      position: {
        x: addEventNode.position.x,
        y: addEventNode.position.y + 120
      },
      data: { label: "Add New Event" },
      type: "eventNode",
      draggable: true,
      targetPosition: Position.Left,
      sourcePosition: Position.Right,
    };

    // Add the new node
    setNodes((nds) => [...nds, newAddEventNode]);

    // Add an edge connecting the transformed node to the new "Add New Event" node
    const newEdge = {
      id: `e-${addEventNode.id}-${newAddEventNode.id}`,
      source: addEventNode.id,
      target: newAddEventNode.id,
      sourceHandle: null,
      targetHandle: null,
      animated: true,
      type: "smoothstep",
      style: {
        stroke: "#aaa",
        strokeWidth: 2,
        strokeDasharray: "5 5",
        zIndex: 40,
      },
    };

    // Add the new edge
    setEdges((eds) => [...eds, newEdge]);

    // Close the modal
    setShowCreateEventModal(false);
  }, [nodes, setNodes, setEdges]);

  // Add this function inside the EventsFlow component, before the useEffect hooks
  const calculateNodePosition = (index: number) => {
    if (windowWidth < 768) {
      // Mobile layout - stack nodes vertically with better spacing
      return {
        x: windowWidth / 2 - 115,
        y: 320 + (index * 120) // 120px spacing between nodes
      }
    }

    // Desktop layout - curved pattern
    switch (index) {
      case 0: // First event (Haldi)
        return { x: 720, y: 100 };
      case 1: // Second event (Sangeet)
        return { x: 720, y: 280 };
      case 2: // Third event (Engagement)
        return { x: 720, y: 460 };
      default: // Additional events
        return { x: 1020, y: 460 + ((index - 3) * 120) };
    }
  }

  useEffect(() => {
    if (!isLoading) {
      const baseNodes = [{
        id: "dashboard",
        position: { x: 280, y: 240 },
        data: {
          showConnection: true,
          locked: true
        },
        type: "dashboardNode",
        draggable: false,
        deletable: false,
        connectable: true,
        selectable: false,
        sourcePosition: Position.Right,
        zIndex: 40,
        style: {
          width: 580,
          height: 'auto',
        },
      }];

      const eventNodes: Node<EventNodeData>[] = [];

      const fixedNodes = [
        {
          position: { x: 920, y: 50 },
          bgColor: "bg-[rgba(255,251,232,1)]",
        },
        {
          position: { x: 920, y: 280 },
          bgColor: "bg-[rgba(255,225,246,1)]",
        },
        {
          position: { x: 750, y: 510 },
          bgColor: "bg-[rgba(225,243,252,1)]",
        }
      ];

      events.slice(0, 3).forEach((event, index) => {
        eventNodes.push({
          id: event.id,
          position: fixedNodes[index].position,
          data: {
            title: event.name.charAt(0).toUpperCase() + event.name.slice(1),
            date: "06 - 01 - 2024",
            attendees: event.totalCapacity,
            bgColor: fixedNodes[index].bgColor,
          },
          sourcePosition: Position.Right,
          targetPosition: Position.Left,
          type: "eventNode",
          draggable: true,
          zIndex: 30,
        });
      });

      events.slice(3).forEach((event, index) => {
        eventNodes.push({
          id: event.id,
          position: {
            x: 1020,
            y: 560 + (index * 180)
          },
          data: {
            title: event.name.charAt(0).toUpperCase() + event.name.slice(1),
            date: "06 - 01 - 2024",
            attendees: event.totalCapacity,
            bgColor: getEventBackgroundColor(event.themeColorIndex),
          },
          sourcePosition: Position.Right,
          targetPosition: Position.Left,
          type: "eventNode",
          draggable: true,
          zIndex: 30,
        });
      });

      const addEventNode = {
        id: "add-event",
        position: {
          x: events.length <= 3
            ? 1040  // If only default events, position after engagement
            : eventNodes[eventNodes.length - 1].position.x + 280, // Add 280px spacing from last event
          y: events.length <= 3
            ? 510  // Match the y-coordinate of engagement event
            : eventNodes[eventNodes.length - 1].position.y // Match the y-coordinate of last event
        },
        data: { label: "Add New Event" },
        type: "eventNode",
        draggable: true,
        targetPosition: Position.Left,
      };

      // Combine all nodes
      const allNodes = [...baseNodes, ...eventNodes, addEventNode];

      // Create edges between nodes
      const newEdges = [];
      for (let i = 0; i < allNodes.length - 1; i++) {
        newEdges.push({
          id: `e-${allNodes[i].id}-${allNodes[i + 1].id}`,
          source: allNodes[i].id,
          target: allNodes[i + 1].id,
          sourceHandle: null,
          targetHandle: null,
          animated: true,
          type: "smoothstep",
          style: {
            stroke: "#aaa",
            strokeWidth: 2,
            strokeDasharray: "5 5",
            zIndex: 40,
          },
        });
      }

      setNodes(allNodes);
      setEdges(newEdges);
    }
  }, [events, isLoading, setNodes, setEdges]);

  // Helper function to get background color based on theme index
  const getEventBackgroundColor = (themeIndex: number): string => {
    switch (themeIndex) {
      case 1:
        return "bg-[rgba(255,251,232,1)]"; // Yellow for Haldi
      case 2:
        return "bg-[rgba(255,225,246,1)]"; // Pink for Sangeet
      case 3:
        return "bg-[rgba(225,243,252,1)]"; // Blue for Engagement
      case 4:
        return "bg-[rgba(235,255,236,1)]"; // Green
      case 5:
        return "bg-[rgba(245,235,255,1)]"; // Purple
      default:
        return "bg-[rgba(255,251,232,1)]"; // Default to Haldi color
    }
  };

  return (
    <div
      ref={reactFlowWrapper}
      className="w-full h-full relative react-flow-wrapper"
      style={{
        minHeight: windowWidth < 768 ? "600px" : "100vh",
        overflow: "visible",
        position: "relative",
        zIndex: 10
      }}
    >
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        nodeTypes={nodeTypes}
        defaultEdgeOptions={edgeOptions}
        connectionLineType={ConnectionLineType.SmoothStep}
        fitView={false}
        proOptions={{ hideAttribution: true }}
        nodesDraggable={true}
        zoomOnScroll={false}
        panOnScroll={false}
        nodeClickDistance={30}
        zoomOnDoubleClick={false}
        maxZoom={windowWidth < 768 ? 1.5 : 1}
        minZoom={windowWidth < 768 ? 0.5 : 1}
        defaultViewport={windowWidth < 768 ? { x: 0, y: 0, zoom: 0.8 } : { x: 0, y: 0, zoom: 1 }}
        style={{ background: "transparent", zIndex: 10 }}
        nodeOrigin={[0.5, 0.5]}
        elementsSelectable={true}
        onNodeDragStart={onNodeDragStart}
        onNodeDrag={onNodeDrag}
        onNodeDragStop={onNodeDragStop}
        onNodeClick={onNodeClick}
        panOnDrag={windowWidth >= 768}
        autoPanOnNodeDrag={false}
      >
      </ReactFlow>

      {showCreateEventModal && (
        <InputDesign onClose={handleCloseModal} onSubmit={(formData: EventFormData) => handleCreateEvent(formData)} />
      )}
    </div>
  )
}

export default EventsFlow