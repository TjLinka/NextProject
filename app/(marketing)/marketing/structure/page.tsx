'use client'
import React, { useState, useEffect } from "react";
import {
  TreeTable,
  TreeTableEvent,
  TreeTablePageEvent,
} from "primereact/treetable";
import { Column } from "primereact/column";
import { TreeNode } from "primereact/treenode";

export default function LazyLoadDemo() {
  const [nodes, setNodes] = useState<TreeNode[]>([]);
  const [first, setFirst] = useState<number>(0);
  const [rows, setRows] = useState<number>(10);
  const [totalRecords, setTotalRecords] = useState<number>(0);
  const [loading, setLoading] = useState<loading>(true);

    const columns = [
      {
        f: "niveau",
        h: 'Уровень'
      },
      {
        f: "id",
        h: 'ID'
      },
      {
        f: "name",
        h: 'ФИО'
      },
    ];


  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
      setNodes(loadNodes(first, rows));
      setTotalRecords(1000);
    }, 500);
  }, []);

  const loadNodes = (first: number, rows: number) => {
    let nodes = [];

    for (let i = 0; i < rows; i++) {
      let node = {
        key: first + i,
        data: {
          name: "Item " + (first + i),
          size: Math.floor(Math.random() * 1000) + 1 + "kb",
          type: "Type " + (first + i),
        },
        leaf: false,
      };

      nodes.push(node);
    }

    return nodes;
  };

  const onExpand = (event: TreeTableEvent) => {
    if (!event.node.children) {
      setLoading(true);

      setTimeout(() => {
        setLoading(false);
        let lazyNode = { ...event.node };

        lazyNode.children = [
          {
            data: {
              name: lazyNode.data.name + " - 0",
              size: Math.floor(Math.random() * 1000) + 1 + "kb",
              type: "File",
            },
          },
          {
            data: {
              name: lazyNode.data.name + " - 1",
              size: Math.floor(Math.random() * 1000) + 1 + "kb",
              type: "File",
            },
          },
        ];

        let _nodes = nodes.map((node) => {
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

  const onPage = (event: TreeTablePageEvent) => {
    setLoading(true);

    //imitate delay of a backend call
    setTimeout(() => {
      setFirst(event.first);
      setRows(event.rows);
      setNodes(loadNodes(event.first, event.rows));
      setLoading(false);
    }, 500);
  };

  return (
    <div className="card">
      <TreeTable
        value={nodes}
        lazy
        paginator
        totalRecords={totalRecords}
        first={first}
        rows={rows}
        onPage={onPage}
        onExpand={onExpand}
        loading={loading}
        tableStyle={{ minWidth: "50rem" }}
      >
        {columns.map((c) => {
            return (
              <Column
                field={c.f}
                header={c.h}
                expander={c.f === 'niveau'}
                key={c.f}
              ></Column>
            );
        })}
        
      </TreeTable>
    </div>
  );
}
