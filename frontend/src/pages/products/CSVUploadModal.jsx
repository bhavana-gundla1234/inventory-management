import React, { useState, useRef } from "react";
import styles from "./CSVUploadModal.module.css";
import uploadIcon from "../../assets/upload.png";
import { apiRequest } from "../../services/api";
 
export default function CSVUploadModal({ onClose, onUploadSuccess }) {
    const [selectedFile, setSelectedFile] = useState(null);
    const [isDragging, setIsDragging] = useState(false);
    const [isUploading, setIsUploading] = useState(false);
    const fileInputRef = useRef(null);
 
    const handleDragEnter = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(true);
    };
 
    const handleDragLeave = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);
    };
 
    const handleDragOver = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(true);
    };
 
    const handleDrop = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);
 
        const files = e.dataTransfer.files;
        if (files && files.length > 0) {
            const file = files[0];
            if (file.name.endsWith(".csv")) {
                setSelectedFile(file);
            } else {
                alert("Please upload a CSV file.");
            }
        }
    };
 
    const handleFileSelect = (e) => {
        const file = e.target.files[0];
        if (file) {
            setSelectedFile(file);
        }
    };
 
    const formatFileSize = (bytes) => {
        if (bytes === 0) return "0 Bytes";
        const k = 1024;
        const sizes = ["Bytes", "KB", "MB", "GB"];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + " " + sizes[i];
    };
 
    const handleUpload = async () => {
        if (!selectedFile) return;
 
        setIsUploading(true);
        const formData = new FormData();
        formData.append("file", selectedFile);
 
        try {
            const res = await apiRequest("/products/upload-csv", "POST", formData);
 
            if (res.success) {
                onUploadSuccess();
            } else {
                alert(res.message || "CSV Upload failed");
            }
        } catch (error) {
            console.error("Upload error:", error);
            alert("An error occurred during upload.");
        } finally {
            setIsUploading(false);
        }
    };
 
    return (
        <div className={styles.modalOverlay} onClick={onClose}>
            <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
                <button className={styles.closeBtn} onClick={onClose}>
                    ✕
                </button>
 
                <div className={styles.header}>
                    <h2>CSV Upload</h2>
                    <p>Add your documents here</p>
                </div>
 
                <div
                    className={`${styles.dropArea} ${isDragging ? styles.dropAreaActive : ""} ${selectedFile ? styles.dropAreaWithFile : ""}`}
                    onDragEnter={handleDragEnter}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                >
                    <div className={styles.uploadIconContainer}>
                        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#1e1e2e" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"></path>
                            <polyline points="12 11 12 17 12 11"></polyline>
                            <polyline points="9 14 12 11 15 14"></polyline>
                        </svg>
                    </div>
                    <p>Drag your file(s) to start uploading</p>
 
                    <div className={styles.orSeparator}>
                        <div className={styles.line}></div>
                        <span className={styles.orText}>OR</span>
                        <div className={styles.line}></div>
                    </div>
 
                    <button
                        className={styles.browseBtn}
                        type="button"
                        onClick={() => fileInputRef.current.click()}
                    >
                        Browse files
                    </button>
 
                    <input
                        type="file"
                        accept=".csv"
                        className={styles.hiddenInput}
                        ref={fileInputRef}
                        onChange={handleFileSelect}
                    />
                </div>
 
                {selectedFile && (
                    <div className={styles.fileList}>
                        <div className={styles.fileItem}>
                            <div className={styles.fileIcon}>
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#1e1e2e" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                                    <polyline points="14 2 14 8 20 8"></polyline>
                                    <line x1="16" y1="13" x2="8" y2="13"></line>
                                    <line x1="16" y1="17" x2="8" y2="17"></line>
                                    <polyline points="10 9 9 9 8 9"></polyline>
                                </svg>
                            </div>
                            <div className={styles.fileInfo}>
                                <span className={styles.fileName}>{selectedFile.name}</span>
                                <span className={styles.fileSize}>{formatFileSize(selectedFile.size)}</span>
                            </div>
                            <button className={styles.removeFileBtn} onClick={() => setSelectedFile(null)}>
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <circle cx="12" cy="12" r="10"></circle>
                                    <line x1="15" y1="9" x2="9" y2="15"></line>
                                    <line x1="9" y1="9" x2="15" y2="15"></line>
                                </svg>
                            </button>
                        </div>
                    </div>
                )}
 
                <div className={styles.actions}>
                    <button className={styles.cancelBtn} onClick={onClose} disabled={isUploading}>
                        Cancel
                    </button>
                    {!selectedFile ? (
                        <button className={styles.nextBtn} onClick={() => fileInputRef.current.click()}>
                            Next <span className={styles.arrow}>&gt;</span>
                        </button>
                    ) : (
                        <button
                            className={styles.uploadBtn}
                            onClick={handleUpload}
                            disabled={isUploading}
                        >
                            {isUploading ? "Uploading..." : "Upload"}
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}
 
 