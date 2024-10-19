# upload_detect.py
import streamlit as st
from PIL import Image
import torch
from torchvision import transforms
from utils import visualize_detections

def upload_and_detect(model):
    st.header("Upload an image for defect detection")
    
    uploaded_file = st.file_uploader("Choose an image...", type=["jpg", "jpeg", "png"])
    
    if uploaded_file is not None:
        image = Image.open(uploaded_file)
        st.image(image, caption="Uploaded Image", use_column_width=True)
        
        if st.button("Detect Defects"):
            # Preprocess the image
            preprocess = transforms.Compose([
                transforms.Resize((416, 416)),
                transforms.ToTensor(),
            ])
            input_tensor = preprocess(image).unsqueeze(0)
            
            # Perform detection
            with torch.no_grad():
                detections = model(input_tensor)
            
            # Process and visualize detections
            processed_image = visualize_detections(image, detections)
            st.image(processed_image, caption="Detected Defects", use_column_width=True)
            
            # Display detection results
            st.subheader("Detection Results")
            for det in detections:
                st.write(f"Class: {det['class']}, Confidence: {det['confidence']:.2f}")