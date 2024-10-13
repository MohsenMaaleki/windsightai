# app.py
import streamlit as st
from dashboard import create_dashboard
from PIL import Image
import os

# Set page config
st.set_page_config(page_title="Wind Turbine Blade Defect Detection", layout="wide")

# Sidebar
st.sidebar.title("Navigation")
page = st.sidebar.radio("Go to", ["Home", "Dashboard"])

def load_sample_images():
    # Assuming you have a folder named 'sample_results' with your images
    sample_dir = 'train10'
    images = []
    for filename in os.listdir(sample_dir):
        if filename.endswith(('.png', '.jpg', '.jpeg')):
            img_path = os.path.join(sample_dir, filename)
            images.append(Image.open(img_path))
    return images

# Main content
if page == "Home":
    st.title("Wind Turbine Blade Defect Detection")
    st.write("Welcome to the Wind Turbine Blade Defect Detection application. "
             "This app uses a YOLO-based deep learning model to detect defects "
             "in wind turbine blades from drone inspection images.")
    
    st.header("Sample Detection Results")
    sample_images = load_sample_images()
    
    if sample_images:
        cols = st.columns(3)  # Adjust the number of columns as needed
        for idx, img in enumerate(sample_images):
            cols[idx % 3].image(img, use_column_width=True, caption=f"Sample Result {idx+1}")
    else:
        st.write("No sample images found. Please add some images to the 'sample_results' folder.")

elif page == "Dashboard":
    st.title("Detection Dashboard")
    create_dashboard()