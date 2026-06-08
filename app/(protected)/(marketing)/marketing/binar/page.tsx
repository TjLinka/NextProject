/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { getBinarId, getBinarInfo, getBinar } from "@/lib/actions";
import { serverFetch } from "@/lib/auth";
import { OrgChart } from "d3-org-chart";
import { useEffect, useLayoutEffect, useRef, useState } from "react";

export default function Binar() {
  const d3Container = useRef(null);
  const chartRef = useRef<OrgChart | null>(null);

  const [dataLoaded, setdataLoaded] = useState(true);

  const [dataa, setData] = useState([]);
  const [mainRootId, setmainRootId] = useState<string | number | null>(null);

  const renderChart = (data: any) => {
    chartRef.current = new OrgChart();
    setData(data)

    chartRef.current
      .container(d3Container.current)
      .data(data)
      //   .nodeWidth((d) => 200)
      //   .nodeHeight((d) => 120)
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
      console.log(node, 1);

      node.branches = branchess[index];
      node.parentId = String(id);
      node.id = String(node.binar_id);
    });
    data.forEach((node) => {
      console.log(node, 2);
      if (!node.is_free) {
        chartRef.current.addNode({ ...node, _centered: true }).render();
      }
    });
    console.log(dataa, id);

    dataa.find((node) => node.binar_id === Number(id)).isLoaded = true;
    setdataLoaded(true);
  };

  useEffect(() => {
    async function getData() {
      const data = await getBinarId();
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
  }, [true]);

  useEffect(() => {
    // document.querySelectorAll(".addUserImg img").forEach((elem) => {
    //   elem.addEventListener("click", (e) => {
    //     e.stopPropagation();
    //     console.log(e.target.dataset);
    //     this.numIdToInsertNewUser = e.target.dataset.numid;
    //     this.parentIdToInsertNewUser = e.target.dataset.parentid;
    //     this.currentIdToInsertNewUser = e.target.dataset.nodeid;
    //     this.addUserToNodeModal = true;
    //   });
    // });

    document.querySelectorAll(".load_more_node_btn").forEach((elem) => {
      elem.addEventListener("click", (e) => {
        e.stopPropagation();
        console.log(e.target.dataset);
        loadNodes(e.target.dataset.nodeid);
      });
    });
  }, [dataa, dataLoaded]);
  // useLayoutEffect(() => {
  //   if (props.data && d3Container.current) {
  //     chartRef.current
  //       .container(d3Container.current)
  //       .data(props.data)
  //       .nodeWidth((d) => 200)
  //       .nodeHeight((d) => 120)
  //       .render();
  //   }
  // }, [props.data, d3Container.current]);

  return (
    <div>
      <div ref={d3Container}></div>
    </div>
  );
}
