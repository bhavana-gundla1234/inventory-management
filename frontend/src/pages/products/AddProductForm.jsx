import { useState, useRef } from "react";
import styles from "./AddProductForm.module.css";
 
export default function AddProductForm({ onSave, onCancel }) {
    const initialFormData = {
        name: "",
        productId: "",
        category: "",
        price: "",
        quantity: "",
        unit: "",
        expiryDate: "",
        threshold: 5
    };
 
    const [formData, setFormData] = useState(initialFormData);
    const [image, setImage] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);
    const fileInputRef = useRef(null);
 
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };
 
    const handleDiscard = () => {
        setFormData(initialFormData);
        setImage(null);
        if (imagePreview) {
            URL.revokeObjectURL(imagePreview);
        }
        setImagePreview(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }
    };
 
    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImage(file);
            setImagePreview(URL.createObjectURL(file));
        }
    };
 
    const handleDrag = (e) => {
        e.preventDefault();
        e.stopPropagation();
    };
 
    const handleDrop = (e) => {
        e.preventDefault();
        e.stopPropagation();
        const file = e.dataTransfer.files[0];
        if (file && file.type.startsWith('image/')) {
            setImage(file);
            setImagePreview(URL.createObjectURL(file));
        }
    };
 
    const handleSubmit = (e) => {
        e.preventDefault();
 
        const formDataToSend = new FormData();
        Object.keys(formData).forEach(key => {
            formDataToSend.append(key, formData[key]);
        });
 
        if (image) {
            formDataToSend.append("image", image);
        }
 
        onSave(formDataToSend);
    };
 
    return (
        <div className={styles.pageWrapper}>
            <div className={styles.breadcrumb}>
                <span className={styles.clickableLink} onClick={onCancel}>Add Product</span> &gt; <span className={styles.activeStep}>Individual Product</span>
            </div>
 
            <div className={styles.formContainer}>
                <h2 className={styles.formHeader}>New Product</h2>
 
                <div className={styles.imageUploadSection}>
                    <div
                        className={styles.imagePlaceholder}
                        onClick={() => fileInputRef.current.click()}
                        onDragOver={handleDrag}
                        onDragEnter={handleDrag}
                        onDragLeave={handleDrag}
                        onDrop={handleDrop}
                        style={{ cursor: 'pointer', overflow: 'hidden' }}
                    >
                        {imagePreview ? (
                            <img src={imagePreview} alt="Preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        ) : (
                            <div className={styles.plusIcon}>+</div>
                        )}
                    </div>
                    <input
                        type="file"
                        ref={fileInputRef}
                        style={{ display: 'none' }}
                        accept="image/*"
                        onChange={handleImageChange}
                    />
                    <div className={styles.uploadText}>
                        Drag image here <br />
                        or <span onClick={() => fileInputRef.current.click()} style={{ cursor: 'pointer', color: '#3b82f6' }}>Browse Image</span>
                    </div>
                </div>
 
                <form onSubmit={handleSubmit} className={styles.formGrid}>
                    <div className={styles.formGroup}>
                        <label>Product Name</label>
                        <input
                            type="text"
                            name="name"
                            placeholder="Enter product name"
                            value={formData.name}
                            onChange={handleChange}
                            required
                        />
                    </div>
 
                    <div className={styles.formGroup}>
                        <label>Product ID</label>
                        <input
                            type="text"
                            name="productId"
                            placeholder="Enter product ID"
                            value={formData.productId}
                            onChange={handleChange}
                            required
                        />
                    </div>
 
                    <div className={styles.formGroup}>
                        <label>Category</label>
                        <input
                            type="text"
                            name="category"
                            placeholder="Select product category"
                            value={formData.category}
                            onChange={handleChange}
                            required
                        />
                    </div>
 
                    <div className={styles.formGroup}>
                        <label>Price</label>
                        <input
                            type="number"
                            name="price"
                            placeholder="Enter price"
                            value={formData.price}
                            onChange={handleChange}
                            required
                        />
                    </div>
 
                    <div className={styles.formGroup}>
                        <label>Quantity</label>
                        <input
                            type="number"
                            name="quantity"
                            placeholder="Enter product quantity (number of products)"
                            value={formData.quantity}
                            onChange={handleChange}
                            required
                        />
                    </div>
 
                    <div className={styles.formGroup}>
                        <label>Unit</label>
                        <input
                            type="text"
                            name="unit"
                            placeholder="Enter product unit of measurement (kg/ltrs/pcs etc)"
                            value={formData.unit}
                            onChange={handleChange}
                            required
                        />
                    </div>
 
                    <div className={styles.formGroup}>
                        <label>Expiry Date</label>
                        <input
                            type="date"
                            name="expiryDate"
                            placeholder="Enter expiry date"
                            value={formData.expiryDate}
                            onChange={handleChange}
                        />
                    </div>
 
                    <div className={styles.formGroup}>
                        <label>Threshold Value</label>
                        <input
                            type="number"
                            name="threshold"
                            placeholder="Enter threshold value"
                            value={formData.threshold}
                            onChange={handleChange}
                            required
                        />
                    </div>
 
                    <div className={styles.formActions}>
                        <button type="button" className={styles.discardBtn} onClick={handleDiscard}>
                            Discard
                        </button>
                        <button type="submit" className={styles.submitBtn}>
                            Add Product
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
 
 