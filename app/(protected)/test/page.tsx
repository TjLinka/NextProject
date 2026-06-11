'use client'
import React, { useState, useRef } from "react";
import AvatarEditor from "react-avatar-editor";

export default function AvatarEditorWidget() {
  const editorRef = useRef(null);
  const fileRef = useRef(null);

  const [image, setImage] = useState(null);
  const [scale, setScale] = useState(1.2);
  const [rotate, setRotate] = useState(0);
  const [position, setPosition] = useState({ x: 0.5, y: 0.5 });
  const [previewUrl, setPreviewUrl] = useState(null);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setImage(file);
    setPreviewUrl(null);
  };

  const handlePreview = () => {
    if (!editorRef.current) return;

    const canvas = editorRef.current.getImageScaledToCanvas();
    canvas.toBlob(
      (blob) => {
        // Освобождаем предыдущий blob URL
        if (previewUrl) URL.revokeObjectURL(previewUrl);
        const url = URL.createObjectURL(blob);
        setPreviewUrl(url);
      },
      "image/jpeg",
      0.92,
    );
  };

  return (
    <div style={styles.wrapper}>
      {/* Загрузка файла */}
      <input
        type="file"
        accept="image/*"
        ref={fileRef}
        style={{ display: "none" }}
        onChange={handleFileChange}
      />

      <div style={styles.uploadRow}>
        <button style={styles.btn} onClick={() => fileRef.current.click()}>
          {image ? "Сменить фото" : "Загрузить фото"}
        </button>
        {image && (
          <span style={styles.fileName}>
            {typeof image === "string" ? image : image.name}
          </span>
        )}
      </div>

      {/* Редактор + контролы */}
      {image && (
        <div style={styles.editorRow}>
          <AvatarEditor
            ref={editorRef}
            image={image}
            width={280}
            height={280}
            border={40}
            borderRadius={140} // круглая маска, 0 = квадрат
            color={[0, 0, 0, 0.55]} // [r, g, b, прозрачность маски]
            scale={scale}
            rotate={rotate}
            position={position}
            onPositionChange={setPosition}
            style={{ cursor: "grab", borderRadius: 8 }}
          />

          <div style={styles.controls}>
            <label style={styles.label}>Масштаб — {scale.toFixed(2)}×</label>
            <input
              type="range"
              min={1}
              max={3}
              step={0.01}
              value={scale}
              onChange={(e) => setScale(parseFloat(e.target.value))}
              style={styles.range}
            />

            <label style={styles.label}>Поворот — {rotate}°</label>
            <input
              type="range"
              min={0}
              max={360}
              step={1}
              value={rotate}
              onChange={(e) => setRotate(parseInt(e.target.value))}
              style={styles.range}
            />

            <button style={styles.primaryBtn} onClick={handlePreview}>
              Просмотреть
            </button>
          </div>
        </div>
      )}

      {/* Превью результата */}
      {previewUrl && (
        <div style={styles.previewSection}>
          <p style={styles.previewLabel}>Результат</p>
          <img src={previewUrl} alt="Аватар" style={styles.previewImg} />
          <a
            href={previewUrl}
            download="avatar.jpg"
            style={styles.downloadLink}
          >
            Скачать
          </a>
        </div>
      )}
    </div>
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
