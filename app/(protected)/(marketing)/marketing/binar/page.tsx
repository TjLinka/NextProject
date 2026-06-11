/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { Caption } from "@/components/UI/Caption";
import { Card } from "@/components/UI/Card";
import { SectionTitle } from "@/components/UI/SectionTitle";
import { getBinarId, getBinarInfo, getBinar } from "@/lib/actions";
import { serverFetch } from "@/lib/auth";
import { localInt } from "@/lib/utils";
import { OrgChart } from "d3-org-chart";
import { AutoComplete } from "primereact/autocomplete";
import { useEffect, useLayoutEffect, useRef, useState } from "react";

export default function Binar() {
  const d3Container = useRef(null);
  const chartRef = useRef<OrgChart | null>(null);
  const dataRef = useRef([]);
  const [agentsList, setAgentList] = useState([]);
  const [nodeInfoLoaded, setnodeInfoLoaded] = useState(false);
  const [binarTreeRoot, setBinarTreeRoot] = useState<number | null>(null);
  const [agentForSearchInBinar, setagentForSearchInBinar] = useState<
    number | null
  >(null);
  const [selectedNode, setSelectedNode] = useState(null);

  const [dataLoaded, setdataLoaded] = useState(true);
  const [searchRootAgent, setsearchRootAgent] = useState<string | null>(null);
  const [searchAgentInTree, setsearchAgentInTree] = useState<string | null>(
    null,
  );

  const [dataa, setDataState] = useState([]);
  const [mainRootId, setmainRootId] = useState<string | number | null>(null);

  const setData = (data) => {
    dataRef.current = data;
    setDataState(data); // оригинальный useState setter
  };

  const renderChart = (data: any) => {
    chartRef.current = new OrgChart();
    setData(data);

    chartRef.current
      .container(d3Container.current)
      .data(data)
      //   .nodeWidth((d) => 200)
      //   .nodeHeight((d) => 120)
      .onExpandOrCollapse(() => {
        document.querySelectorAll(".load_more_node_btn").forEach((elem) => {
          elem.addEventListener("click", (e) => {
            e.stopPropagation();
            loadNodes(e.target.dataset.nodeid);
          });
        });
      })
      .nodeContent(function (d) {
        const color = "#FFFFFF";
        const imageDiffVert = 0;
        return `
                <div style='width:${d.width}px;height:${d.height}px;padding-top:${
                  imageDiffVert - 2
                }px;padding-left:1px;padding-right:1px'>
                        <div style="font-family: 'Inter', sans-serif;background-color:${
                          d.data.num < 1 || d.data.num > 2 ? "#c6c6c6" : color
                        };  margin-left:-1px;width:${d.width - 2}px;height:${
                          d.height - imageDiffVert
                        }px;border-radius:10px;border: ${d.data.is_free ? "1" : "1"}px ${
                          d.data.is_free ? "solid #E4E2E9" : "solid #E4E2E9"
                        } ">
                            <div style="display:${
                              d.data.is_free ? "none" : "flex"
                            };justify-content:flex-end;margin-top:5px;margin-right:8px">ID ${
                              d.data.agent
                            }</div>
                            <div style="display: flex; align-items: center">
                                <div><img src="${
                                  d.data.avatar
                                }" style="margin-left:${20}px;border-radius:100px;width:50px;height:50px;display: ${
                                  d.data.is_free ? "none" : ""
                                }; object-fit: fill;" /></div>
                                <div style="font-size:15px;color:#08011E;margin-left:10px; margin-left: 30px; display: ${
                                  d.data.is_free ? "none" : ""
                                }">${d.data.agent_name}</div>
                            </div>
                            <div style="display: flex; align-items: center; gap: 10px; justify-content: space-around; margin-top: 10px; width: 100%">
                              <div style="border: 1px solid black; padding-top: 2px; padding-bottom: 2px; width: 40%; text-align: center; font-weight: bold;">
                                ${d.data.branches?.b1 || 0}
                              </div>
                              <div style="border: 1px solid black; padding-top: 2px; padding-bottom: 2px; width: 40%; text-align: center; font-weight: bold;">
                                ${d.data.branches?.b2 || 0}
                              </div>
                            </div>
                            <div style="display: flex; align-items: center; gap: 10px; justify-content: space-around; margin-top: 10px; width: 100%">
                              <div style="border: 1px solid black; padding-top: 2px; padding-bottom: 2px; width: 40%; text-align: center; font-weight: bold;">
                                ${d.data.branches?.b3 || 0}
                              </div>
                              <div style="border: 1px solid black; padding-top: 2px; padding-bottom: 2px; width: 40%; text-align: center; font-weight: bold;">
                                ${d.data.branches?.b4 || 0}
                              </div>
                            </div>
                            <div class="addUser" style="display:${d.data.is_free ? "" : "none"}">
                                <div class="addUserImg" >
                                    Свободная
                                </div>
                            </div>
                            <div class="load_more_node_btn" data-nodeId="${
                              d.data.id
                            }" style="display:${
                              d.data.real_children_count > 0 &&
                              d.data.has_child &&
                              !d.data.isLoaded
                                ? "block"
                                : "none"
                            }">
                               +
                            </div>
                        </div>
                    </div>
                            `;
      })
      .onNodeClick((d: any) => {
        getNodeInfo(d.data);
        chartRef.current.clearHighlighting();
        chartRef.current.setHighlighted(d.data.id).render();
      })
      .render();
  };

  const loadNodes = async (id: string | number) => {
    setdataLoaded(false);
    const data = await getBinar(id);

    const branchess: { b1: any; b2: any; b3: any; b4: any }[] = [];

    if (data[0] && data[0].binar_id && data[0].binar_id > 0) {
      const data4 = await getBinarInfo(data[0].binar_id);
      branchess.push({
        b1: data4.branch1,
        b2: data4.branch2,
        b3: data4.branch3,
        b4: data4.branch4,
      });
    }
    if (data[1] && data[1].binar_id && data[1].binar_id > 0) {
      const data4 = await getBinarInfo(data[1].binar_id);
      branchess.push({
        b1: data4.branch1,
        b2: data4.branch2,
        b3: data4.branch3,
        b4: data4.branch4,
      });
    }
    data.forEach(async (node: any, index: any) => {
      node.branches = branchess[index];
      node.parentId = String(id);
      node.id = String(node.binar_id);
    });
    data.forEach((node) => {
      if (!node.is_free) {
        chartRef.current.addNode({ ...node, _centered: true }).render();
      }
    });
    console.log(dataa, id);

    if (dataRef.current.find((node) => node.binar_id === Number(id))) {
      dataRef.current.find((node) => node.binar_id === Number(id)).isLoaded =
        true;
      chartRef.current.render();
    }
    chartRef.current.render();
    setdataLoaded(true);
  };

  const findRootAgent = async (val: string) => {
    const res = await fetch("/api/marketing/find-position", {
      method: "POST",
      body: JSON.stringify({
        root_id: 243,
        find_str: String(val.query),
        offset: 0,
        show_cnt: 20,
      }),
    });
    const data = await res.json();
    setAgentList(data);
  };

  const getNodeInfo = async (node: any) => {
    setdataLoaded(false);
    setnodeInfoLoaded(true);
    const res = await getBinarInfo(node.id);
    console.log(res);

    setSelectedNode({ ...node, ...res });
    chartRef.current.render();
    setdataLoaded(true);
  };

  useEffect(() => {
    async function getData() {
      const data = await getBinarId({ rootId: binarTreeRoot });
      data.agent.id = data.binar_id;
      setmainRootId(data.binar_id);
      data.agent.avatar = data.avatar;
      data.agent.isLoaded = true;
      const data2 = await getBinarInfo(data.binar_id);
      data.agent.branches = {
        b1: data2.branch1,
        b2: data2.branch2,
        b3: data2.branch3,
        b4: data2.branch4,
      };
      const data3 = await getBinar(data.binar_id);

      const branchess: { b1: any; b2: any; b3: any; b4: any }[] = [];

      if (data3[0] && data3[0].binar_id && data3[0].binar_id > 0) {
        const data4 = await getBinarInfo(data3[0].binar_id);
        branchess.push({
          b1: data4.branch1,
          b2: data4.branch2,
          b3: data4.branch3,
          b4: data4.branch4,
        });
      }
      if (data3[1] && data3[1].binar_id && data3[1].binar_id > 0) {
        const data4 = await getBinarInfo(data3[1].binar_id);
        branchess.push({
          b1: data4.branch1,
          b2: data4.branch2,
          b3: data4.branch3,
          b4: data4.branch4,
        });
      }
      data3.forEach(async (node: any, index: any) => {
        node.branches = branchess[index];
        node.parentId = String(data.binar_id);
        node.id = String(node.binar_id);
        node.isLoaded = false;
      });

      setData([data.agent, ...data3]);
      renderChart([data.agent, ...data3]);
    }
    getData();
  }, [binarTreeRoot]);

  useEffect(() => {
    console.log(dataa);

    if (dataLoaded === true) {
      document.querySelectorAll(".load_more_node_btn").forEach((elem) => {
        elem.addEventListener("click", (e) => {
          e.stopPropagation();
          loadNodes(e.target.dataset.nodeid);
        });
      });
    }
  }, [dataa, dataLoaded]);

  const handleSelectBinarRoot = (val: any) => {
    setBinarTreeRoot(val.agent_id);
  };
  const handleFindAgentInBinarTree = async (val: any) => {
    console.log(val);

    setagentForSearchInBinar(val.binar_id);
    chartRef.current.clearHighlighting();
    if (val.binar_id) {
      chartRef.current.clearHighlighting();
      if (!dataRef.current.find((node) => node.id === String(val.agent_id))) {
        // this.isSelectedNode = true;
        const params = {
          root_id: 243,
          binar_id: val.binar_id,
        };

        await fetch("/api/binar/retrieve-track", {
          method: "POST",
          body: JSON.stringify(params),
        })
          .then(async (Response) => {
            return {
              data: await Response.json(),
            };
          })
          .then(async (Response) => {
            Response.data.pop();
            Response.data.reverse();
            for (let i = 0; i < Response.data.length; i++) {
              console.log("0", Response.data[i].track_binar_id);
              if (
                dataRef.current.find(
                  (node) =>
                    String(node.id) === String(Response.data[i].track_binar_id),
                ).isLoaded === true
              ) {
                console.log("1");
                continue;
              }
              const data3 = await getBinar(Response.data[i].track_binar_id);

              const branchess: { b1: any; b2: any; b3: any; b4: any }[] = [];

              if (data3[0] && data3[0].binar_id && data3[0].binar_id > 0) {
                const data4 = await getBinarInfo(data3[0].binar_id);
                branchess.push({
                  b1: data4.branch1,
                  b2: data4.branch2,
                  b3: data4.branch3,
                  b4: data4.branch4,
                });
              }
              if (data3[1] && data3[1].binar_id && data3[1].binar_id > 0) {
                const data4 = await getBinarInfo(data3[1].binar_id);
                branchess.push({
                  b1: data4.branch1,
                  b2: data4.branch2,
                  b3: data4.branch3,
                  b4: data4.branch4,
                });
              }
              data3.forEach(async (node: any, index: any) => {
                node.branches = branchess[index];
                node.parentId = String(Response.data[i].track_binar_id);
                node.id = String(node.binar_id);
                node.isLoaded =
                  String(node.binar_id) ===
                  String(Response.data[i].track_binar_id)
                    ? true
                    : false;
              });

              dataRef.current.find(
                (node) => node.binar_id === Response.data[i].track_binar_id,
              ).isLoaded = true;
              console.log("3");
              dataRef.current.push(...data3);
              chartRef.current
                .setUpToTheRootHighlighted(val.binar_id)
                .setCentered(val.binar_id)
                .render();
              setdataLoaded(true);
            }
          });
      } else {
        chartRef.current
          .setUpToTheRootHighlighted(agentForSearchInBinar)
          .setCentered(agentForSearchInBinar)
          .render();
        setdataLoaded(true);
      }
    }
  };

  return (
    <div className="flex gap-10 h-full">
      <div className="border-2 border-(--main-color) rounded-lg w-3/4">
        <div className="max-h-[60vh]" ref={d3Container}></div>
      </div>
      <div className="flex flex-col gap-5 w-1/4">
        <Card title="Корень дерева">
          <div className="relative">
            <AutoComplete
              inputClassName="w-full pr-8!"
              className="block!"
              field="agent_name"
              value={searchRootAgent}
              suggestions={agentsList}
              onSelect={(e) => handleSelectBinarRoot(e.value)}
              completeMethod={findRootAgent}
              onChange={(e) => setsearchRootAgent(e.value)}
            />
            {searchRootAgent && (
              <button
                className="absolute z-10 right-2 top-7 -translate-y-1/2 cursor-pointer font-semibold"
                onClick={() => setsearchRootAgent(null)}
              >
                <i className="pi pi-times text-black font-bold" />
              </button>
            )}
          </div>
        </Card>
        <Card title="Поиск партнера">
          <div className="relative">
            <AutoComplete
              inputClassName="w-full"
              className="block!"
              field="agent_name"
              value={searchAgentInTree}
              suggestions={agentsList}
              onSelect={(e) => handleFindAgentInBinarTree(e.value)}
              completeMethod={findRootAgent}
              onChange={(e) => setsearchAgentInTree(e.value)}
            />
            {searchAgentInTree && (
              <button
                className="absolute right-2 top-7 -translate-y-1/2 cursor-pointer font-semibold"
                onClick={() => setsearchAgentInTree(null)}
              >
                <i className="pi pi-times text-gray-400" />
              </button>
            )}
          </div>
        </Card>
        {selectedNode && (
          <Card>
            <div className=" relative">
              <SectionTitle>Информация</SectionTitle>
              <span
                className="absolute top-1.5 right-2 font-semibold text-xl cursor-pointer"
                onClick={() => setSelectedNode(null)}
              >
                X
              </span>
              <div className="grid grid-cols-2 mt-5">
                <Caption title="ID партнёра" text={selectedNode.agent_id} />
                <Caption title="ФИО" text={selectedNode.agent_name} />
              </div>
              <div className="grid grid-cols-2  mt-4">
                <Caption title="Пул" text={selectedNode.rank} />
                <Caption title="Пакет" text={selectedNode.status} />
              </div>
              <div className="grid grid-cols-2  mt-4">
                <Caption
                  title="Нога"
                  text={`${selectedNode.num} - ${selectedNode.num_name}`}
                />
                <Caption title="ID позиции" text={selectedNode.num} />
              </div>
              <div className="grid grid-cols-2  mt-4">
                <Caption
                  title="Первичный объём"
                  text={localInt(selectedNode.branch1)}
                />
                <Caption title="&nbsp;" text={selectedNode.branch2} />
              </div>
              <div className="grid grid-cols-2  mt-4">
                <Caption
                  title="Повторный объём"
                  text={selectedNode.branch3 || 0}
                />
                <Caption title="&nbsp;" text={selectedNode.branch4 || 0} />
              </div>
              <div className="row mt-4"></div>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
}
