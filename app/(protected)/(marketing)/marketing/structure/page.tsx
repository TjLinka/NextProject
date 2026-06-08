/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import React, { useState, useEffect } from "react";
import {
  TreeTable,
  TreeTableEvent,
  TreeTablePageEvent,
} from "primereact/treetable";
import { Column } from "primereact/column";
import { TreeNode } from "primereact/treenode";
import { body } from "framer-motion/client";
import { Card } from "@/components/UI/Card";
// import { useQuery } from "@tanstack/react-query";
// import { getStructureData } from "@/dbQuery/dbQuerys";

export default function LazyLoadDemo() {
  const [nodes, setNodes] = useState<TreeNode[]>([]);
  const [first, setFirst] = useState<number>(0);
  const [rows, setRows] = useState<number>(10);
  const [totalRecords, setTotalRecords] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);

  const loadNodes = async () => {
    const res = await fetch(
      "/api/marketing/structure?root_agent=105&agent_id=105&level_agent=105",
    );

    const data = await res.json();

    const newData = data.map((row: any) => {
      return {
        key: row.id,
        data: row,
        leaf: row.has_child === 0 ? true : false,
      };
    });
    return newData;
  };

  useEffect(() => {
    setTimeout(async () => {
      setLoading(false);
      setNodes(await loadNodes());
      setTotalRecords(1000);
    }, 500);
  }, []);

  const onExpand = async (event: TreeTableEvent) => {
    if (!event.node.children) {
      setLoading(true);

      setTimeout(async () => {
        setLoading(false);
        const lazyNode = { ...event.node };

        // lazyNode.children = [
        //   {
        //     data: {
        //       name: lazyNode.data.name + " - 0",
        //       size: Math.floor(Math.random() * 1000) + 1 + "kb",
        //       type: "File",
        //     },
        //   },
        //   {
        //     data: {
        //       name: lazyNode.data.name + " - 1",
        //       size: Math.floor(Math.random() * 1000) + 1 + "kb",
        //       type: "File",
        //     },
        //   },
        // ];

        const res = await fetch(
          `/api/marketing/structure?root_agent=${event.node.key}&agent_id=105&level_agent=${event.node.key}`,
        );

        const data = await res.json();

        const newData = data.map((row: any) => {
          return {
            key: row.id,
            data: row,
            leaf: row.has_child === 0 ? true : false,
          };
        });
        lazyNode.children = [...newData];

        const _nodes = nodes.map((node) => {
          if (node.key === event.node.key) {
            node = lazyNode;
          }

          return node;
        });

        setLoading(false);
        setNodes(_nodes);
      }, 250);
    }
  };

  // const { data } = useQuery({
  //   queryKey: ["stucture_data"],
  //   queryFn: async () => {
  //     return await getStructureData(105,105,105,105);
  //   },
  // });

  const avatarTemplate = (node) => {
    return (
      <div className="flex items-center gap-2">
        <img
          src={node.data.avatar}
          alt={node.data.name}
          className="w-8 h-8 rounded-full object-cover"
        />
        <span>{node.data.name}</span>
      </div>
    );
  };

  return (
    <div className="card">
      <Card>
        <TreeTable
          value={nodes}
          lazy
          totalRecords={totalRecords}
          first={first}
          rows={rows}
          scrollable
          scrollHeight="60vh"
          onExpand={onExpand}
          loading={loading}
          tableStyle={{ minWidth: "50rem" }}
        >
          <Column field="id" header="ID" expander></Column>
          <Column field="name" body={avatarTemplate} header="Name"></Column>
          {/* <Column field="lo" header="ЛО"></Column>
        <Column field="go" header="ГО"></Column>
        <Column field="so" header="CO"></Column>
        <Column field="oo" header="OO"></Column> */}
          <Column field="email" header="E-mail"></Column>
          <Column field="phone" header="Телефон"></Column>
        </TreeTable>
      </Card>
    </div>
  );
}
