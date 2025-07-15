import { useCallback, useEffect, useRef, useState } from "react";
import DashboardCard from "./DashboardCard";
import { EventFormData, EventNode, EventNodeData } from "./placeholder-node";
import {
  addEdge,
  Connection,
  ConnectionLineType,
  Handle,
  Node,
  Position,
  ReactFlow,
  useEdgesState,
  useNodesState,
} from "@xyflow/react";
import InputDesign from "./inputdesgin";
import { useRouter } from "next/navigation";
import Image from "next/image";
import type { FirestoreEventData } from "@/types/event";

// Helper function to format ISO date string to "MM - DD - YYYY"
const formatDate = (isoDate: string): string => {
  try {
    const date = new Date(isoDate);
    if (isNaN(date.getTime())) {
      return "Invalid Date";
    }
    const month = String(date.getMonth() + 1).padStart(2, "0"); // Months are 0-based
    const day = String(date.getDate()).padStart(2, "0");
    const year = date.getFullYear();
    return `${month} - ${day} - ${year}`;
  } catch (error) {
    console.error("Error formatting date:", error);
    return "Invalid Date";
  }
};

interface EventsFlowProps {
  events: (FirestoreEventData & { id: string })[];
  isLoading: boolean;
}

const EventsFlow = ({ events, isLoading }: EventsFlowProps) => {
  const router = useRouter();
  const reactFlowWrapper = useRef<HTMLDivElement>(null);

  const [showCreateEventModal, setShowCreateEventModal] = useState(false);
  const [windowWidth, setWindowWidth] = useState(
    typeof window !== "undefined" ? window.innerWidth : 1024
  );

  useEffect(() => {
    if (typeof window === "undefined") return;

    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const ConnectionPointNode = () => {
    return (
      <div
        style={{
          width: 8,
          height: 8,
          background: "white",
          border: "1px solid #999",
          borderRadius: "50%",
          position: "absolute",
          boxShadow: "0 0 3px rgba(0,0,0,0.2)",
          zIndex: 50,
        }}
      />
    );
  };

  const DashboardNode = ({
    data,
  }: {
    data: {
      showConnection?: boolean;
      locked?: boolean;
      label?: string;
      title?: string;
    };
  }) => {
    const { showConnection = true } = data;

    return (
      <div
        className="bg-white border overflow-hidden pb-6 rounded-3xl border-[rgba(231,231,231,1)] border-solid"
        style={{
          width: "100%",
          maxWidth: "580px",
          boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
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
                { name: "Engagement", color: "cyan" },
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
              boxShadow: "0 0 3px rgba(0,0,0,0.2)",
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
  };

  const initialNodes: Node<EventNodeData>[] = [
    {
      id: "dashboard",
      position: { x: 350, y: 240 },
      data: {
        showConnection: true,
        locked: true,
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
        height: "auto",
      },
    },
    {
      id: "add-event",
      position: { x: 1020, y: 460 },
      data: { label: "Add New Event" },
      type: "eventNode",
      draggable: true,
      targetPosition: Position.Left,
    },
  ];

  const initialEdges = [
    {
      id: "e-dashboard-add",
      source: "dashboard",
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
  ];

  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  const onConnect = useCallback(
    (params: Connection) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  );

  const edgeOptions = {
    animated: true,
    style: {
      stroke: "#ddd",
      strokeWidth: 2,
      strokeDasharray: "5 5",
    },
    zIndex: 5,
  };

  const onNodeDragStart = useCallback(
    (event: React.MouseEvent, node: Node) => {
      setNodes((nds) =>
        nds.map((n) => {
          if (n.id === node.id) {
            return {
              ...n,
              className: "dragging-node",
            };
          }
          return n;
        })
      );
    },
    [setNodes]
  );

  const onNodeDrag = useCallback(() => {}, []);

  const onNodeDragStop = useCallback(
    (event: React.MouseEvent, node: Node) => {
      setNodes((nds) =>
        nds.map((n) => {
          if (n.id === node.id) {
            return {
              ...n,
              className: "",
            };
          }
          return n;
        })
      );
    },
    [setNodes]
  );

  const onNodeClick = useCallback(
    (event: React.MouseEvent, node: Node<EventNodeData>) => {
      if (node.id === "add-event") {
        setShowCreateEventModal(true);
      }
    },
    []
  );

  useEffect(() => {
    if (windowWidth < 768) {
      setNodes((nodes) =>
        nodes.map((node) => {
          if (node.id === "dashboard") {
            return {
              ...node,
              position: { x: 20, y: 20 },
              style: {
                ...node.style,
                width: windowWidth - 40,
              },
            };
          } else if (node.id === "add-event") {
            return {
              ...node,
              position: { x: windowWidth / 2 - 115, y: 680 },
              style: {
                ...node.style,
                width: "230px",
              },
            };
          }
          return node;
        })
      );

      setEdges((edges) =>
        edges.map((edge) => ({
          ...edge,
          type: "smoothstep",
          style: {
            ...edge.style,
            stroke: "#aaa",
            strokeWidth: 2,
            strokeDasharray: "5 5",
          },
        }))
      );
    } else {
      setNodes((nodes) =>
        nodes.map((node) => {
          if (node.id === "dashboard") {
            return {
              ...node,
              position: { x: 285, y: 240 },
              style: {
                ...node.style,
                width: 580,
              },
            };
          } else if (node.id === "add-event") {
            return { ...node, position: { x: 1040, y: 400 } };
          }
          return node;
        })
      );
    }
  }, [windowWidth, setNodes, setEdges]);

  useEffect(() => {
    const flowElement = document.querySelector(".react-flow");
    if (flowElement) {
      (flowElement as HTMLElement).style.height = "100%";
      (flowElement as HTMLElement).style.width = "100%";
      (flowElement as HTMLElement).style.position = "absolute";
      (flowElement as HTMLElement).style.overflow = "visible";
      (flowElement as HTMLElement).style.zIndex = "10";
    }

    const style = document.createElement("style");
    style.innerHTML = `
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@700&family=Inter:wght@600&family=DM+Sans:wght@300&family=Sorts+Mill+Goudy&display=swap');
        
        .font-jakarta { font-family: 'Plus Jakarta Sans', sans-serif; }
        .font-inter { font-family: 'Inter'; }
        .font-dm-sans { font-family: 'DM Sans', sans-serif; }
        .font-sorts-mill { font-family: 'Sorts Mill Goudy', serif; }
        
        .react-flow__node { transition: opacity 0.2s, filter 0.2s; }
        .react-flow__node[data-type="dashboardNode"] { max-width: 580px !important; }
        .react-flow__node[data-type="eventNode"] { max-width: 260px !important; }
        .react-flow__handle {
          width: 8px !important;
          height: 8px !important;
          background: white !important;
          border: 1px solid #999 !important;
          box-shadow: 0 0 3px rgba(0,0,0,0.2) !important;
          z-index: 50 !important;
          pointer-events: all !important;
        }
        .react-flow__edge { z-index: 40 !important; pointer-events: all !important; }
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
          from { stroke-dashoffset: 50; }
          to { stroke-dashoffset: 0; }
        }
        .dragging-node { opacity: 0.7 !important; z-index: 0 !important; }
        .react-flow__node:not(.dragging-node) { z-index: 30 !important; }
        .dashboard-card { z-index: 20 !important; position: relative !important; overflow: visible !important; }
        #connection-point { display: block !important; }
      `;
    document.head.appendChild(style);

    return () => {
      document.head.removeChild(style);
    };
  }, []);

  const handleCloseModal = useCallback(() => {
    setShowCreateEventModal(false);
  }, []);

  const handleCreateEvent = useCallback(
    (formData: any) => {
      const addEventNode = nodes.find((n) => n.id === "add-event");
      if (!addEventNode) return;

      const themeColorMap: Record<number, string> = {
        0: "bg-[rgba(255,251,232,1)]", // Yellow
        1: "bg-[rgba(225,243,252,1)]", // Blue
        2: "bg-[rgba(255,225,246,1)]", // Pink
        3: "bg-[rgba(235,255,236,1)]", // Green
        4: "bg-[rgba(245,235,255,1)]", // Purple
      };

      const eventData = {
        title: formData.eventName || "New Event",
        date: formData.startDateTime
          ? formatDate(formData.startDateTime)
          : "Invalid Date", // Use formData.startDateTime
        attendees:
          parseInt(formData.tables || "0") *
            parseInt(formData.peoplePerTable || "0") || 24,
        bgColor:
          formData.themeColorIndex !== null &&
          formData.themeColorIndex !== undefined
            ? themeColorMap[formData.themeColorIndex]
            : "bg-[rgba(225,243,252,1)]",
      };

      setNodes((nds) =>
        nds.map((n) => {
          if (n.id === "add-event") {
            return {
              ...n,
              data: eventData,
              type: "eventNode",
            };
          }
          return n;
        })
      );

      const newAddEventNode = {
        id: `add-event-${Date.now()}`,
        position: {
          x: addEventNode.position.x,
          y: addEventNode.position.y + 120,
        },
        data: { label: "Add New Event" },
        type: "eventNode",
        draggable: true,
        targetPosition: Position.Left,
        sourcePosition: Position.Right,
      };

      setNodes((nds) => [...nds, newAddEventNode]);

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

      setEdges((eds) => [...eds, newEdge]);

      setShowCreateEventModal(false);
    },
    [nodes, setNodes, setEdges]
  );

  const calculateNodePosition = (index: number) => {
    if (windowWidth < 768) {
      return {
        x: windowWidth / 2 - 115,
        y: 320 + index * 120,
      };
    }

    switch (index) {
      case 0:
        return { x: 720, y: 100 };
      case 1:
        return { x: 720, y: 280 };
      case 2:
        return { x: 720, y: 460 };
      default:
        return { x: 1020, y: 460 + (index - 3) * 120 };
    }
  };

  useEffect(() => {
    if (!isLoading) {
      const baseNodes = [
        {
          id: "dashboard",
          position: { x: 280, y: 240 },
          data: {
            showConnection: true,
            locked: true,
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
            height: "auto",
          },
        },
      ];

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
        },
      ];

      events.slice(0, 3).forEach((event, index) => {
        eventNodes.push({
          id: event.id,
          position: fixedNodes[index].position,
          data: {
            title: event.name.charAt(0).toUpperCase() + event.name.slice(1),
            date: formatDate(event.startDateTime), // Use dynamic date
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
            y: 560 + index * 180,
          },
          data: {
            title: event.name.charAt(0).toUpperCase() + event.name.slice(1),
            date: formatDate(event.startDateTime), // Use dynamic date
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
          x:
            events.length <= 3
              ? 1040
              : eventNodes[eventNodes.length - 1].position.x + 280,
          y:
            events.length <= 3
              ? 510
              : eventNodes[eventNodes.length - 1].position.y,
        },
        data: { label: "Add New Event" },
        type: "eventNode",
        draggable: true,
        targetPosition: Position.Left,
      };

      const allNodes = [...baseNodes, ...eventNodes, addEventNode];

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
        zIndex: 10,
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
        defaultViewport={
          windowWidth < 768
            ? { x: 0, y: 0, zoom: 0.8 }
            : { x: 0, y: 0, zoom: 1 }
        }
        style={{ background: "transparent", zIndex: 10 }}
        nodeOrigin={[0.5, 0.5]}
        elementsSelectable={true}
        onNodeDragStart={onNodeDragStart}
        onNodeDrag={onNodeDrag}
        onNodeDragStop={onNodeDragStop}
        onNodeClick={onNodeClick}
        panOnDrag={windowWidth >= 768}
        autoPanOnNodeDrag={false}
      />
      {showCreateEventModal && (
        <InputDesign
          onClose={handleCloseModal}
          onSubmit={(formData: EventFormData) => handleCreateEvent(formData)}
        />
      )}
    </div>
  );
};

export default EventsFlow;
