"use client";
import { useState, useEffect, useCallback } from "react";
import PickupMap from "./components/PickupMap";

export default function AvatarEditorWidget() {
  const [allPVZ, setPVZ] = useState([]);

  useEffect(() => {
    async function getPvz() {
      const res = await fetch("/api/cart/pvz");
      const data = await res.json();
      console.log(data);
      setPVZ(data);
    }
    getPvz();
  }, []);

  const setDeliveryAddress = useCallback((val: unknown) => {
    console.log(val);
  }, [allPVZ])

  return (
    <PickupMap
      points={allPVZ}
      onSelect={(point) => setDeliveryAddress(point)}
    />
  );
}

const styles = {
  wrapper: {
    display: "flex",
    flexDirection: "column",
    gap: 20,
    padding: "24px",
    maxWidth: 640,
    fontFamily: "sans-serif",
  },
  uploadRow: {
    display: "flex",
    alignItems: "center",
    gap: 12,
  },
  fileName: {
    fontSize: 13,
    color: "#888",
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
    maxWidth: 240,
  },
  editorRow: {
    display: "flex",
    gap: 28,
    alignItems: "flex-start",
    flexWrap: "wrap",
  },
  controls: {
    display: "flex",
    flexDirection: "column",
    gap: 10,
    flex: 1,
    minWidth: 180,
    paddingTop: 4,
  },
  label: {
    fontSize: 13,
    color: "#555",
    fontWeight: 500,
  },
  range: {
    width: "100%",
    accentColor: "#333",
  },
  btn: {
    padding: "8px 16px",
    border: "1px solid #ddd",
    borderRadius: 8,
    background: "#fff",
    cursor: "pointer",
    fontSize: 14,
  },
  primaryBtn: {
    marginTop: 8,
    padding: "9px 16px",
    border: "none",
    borderRadius: 8,
    background: "#111",
    color: "#fff",
    cursor: "pointer",
    fontSize: 14,
    fontWeight: 500,
  },
  previewSection: {
    display: "flex",
    flexDirection: "column",
    gap: 12,
  },
  previewLabel: {
    fontSize: 13,
    color: "#888",
    margin: 0,
  },
  previewImg: {
    width: 160,
    height: 160,
    borderRadius: "50%",
    objectFit: "cover",
    border: "1px solid #eee",
    display: "block",
  },
  downloadLink: {
    fontSize: 13,
    color: "#333",
    textDecoration: "underline",
    width: "fit-content",
  },
};
