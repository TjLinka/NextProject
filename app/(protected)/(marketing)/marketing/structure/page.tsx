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
import { classNames } from "primereact/utils";
import Image from "next/image";
import { InputSwitch } from "primereact/inputswitch";
import { InputText } from "primereact/inputtext";
// import { useQuery } from "@tanstack/react-query";
// import { getStructureData } from "@/dbQuery/dbQuerys";

export default function LazyLoadDemo() {
  const [nodes, setNodes] = useState<TreeNode[]>([]);
  const [first, setFirst] = useState<number>(0);
  const [checked, setChecked] = useState<boolean>(false);
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

        const res = await fetch(
          `/api/marketing/structure?root_agent=${event.node.key}&agent_id=105&level_agent=${event.node.key}`,
        );

        const data = await res.json();

        console.log(event.node);

        data.forEach((row) => {
          row.niveau = Number(event.node.data.niveau) + 1;
        });

        const newData = data.map((row: any) => {
          return {
            key: row.id,
            data: row,
            leaf: row.has_child === 0 ? true : false,
          };
        });
        lazyNode.children = [...newData];

        const _nodes = updateNodeInTree(nodes, event.node.key, lazyNode);

        setLoading(false);
        setNodes(_nodes);
      }, 250);
    }
  };

  const updateNodeInTree = (nodes, key, updatedNode) => {
    return nodes.map((node) => {
      if (node.key === key) {
        return updatedNode;
      }
      if (node.children) {
        return {
          ...node,
          children: updateNodeInTree(node.children, key, updatedNode),
        };
      }
      return node;
    });
  };

  const avatarTemplate = (node) => {
    return (
      <div className="flex items-center gap-2">
        <Image
          src={node.data.avatar}
          alt={node.data.name}
          width={200}
          height={200}
          className="w-8 h-8 rounded-full object-cover"
        />
        <span>{node.data.name}</span>
      </div>
    );
  };

  const togglerTemplate = (node, options) => {
    if (!node) {
      return;
    }

    const expanded = options.expanded;
    const iconClassName = classNames("p-treetable-toggler-icon pi pi-fw", {
      "pi-caret-right": !expanded,
      "pi-caret-down": expanded,
    });

    return (
      <button
        type="button"
        className="p-treetable-toggler p-link"
        style={options.buttonStyle}
        tabIndex={-1}
        onClick={options.onClick}
      >
        <span className={iconClassName} aria-hidden="true"></span>
      </button>
    );
  };

  return (
    <div className="card">
      <div className="flex gap-5 items-center">
        <span className="text-lg font-semibold">Дерево</span>
        <InputSwitch checked={checked} onChange={(e) => setChecked(e.value)} />
        <span className="text-lg font-semibold">Список</span>
      </div>
      {checked && (
        <div className="grid grid-cols-4 gap-5 mt-5">
          <Card title="Поиск по ID">
            <InputText className="w-full" />
          </Card>
          <Card title="Поиск по E-mail">
            <InputText className="w-full" />
          </Card>
          <Card title="Поиск по телефону">
            <InputText className="w-full" />
          </Card>
          <Card title="Поиск по ФИО">
            <InputText className="w-full" />
          </Card>
        </div>
      )}
      <Card className="mt-5">
        <TreeTable
          value={nodes}
          lazy
          togglerTemplate={togglerTemplate}
          totalRecords={totalRecords}
          first={first}
          rows={rows}
          scrollable
          scrollHeight="60vh"
          onExpand={onExpand}
          loading={loading}
          tableStyle={{ minWidth: "50rem" }}
        >
          <Column
            field="niveau"
            header="Уровень"
            expander
            style={{ width: "200px" }}
          ></Column>
          <Column field="id" header="ID" style={{ width: "150px" }}></Column>
          <Column field="name" body={avatarTemplate} header="ФИО"></Column>
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
