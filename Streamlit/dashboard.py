import streamlit as st
import pandas as pd
import plotly.express as px
import plotly.graph_objects as go
import os

def create_dashboard():
    st.title("Wind Turbine Defect Detection Model Training Dashboard")

    # Load data from CSV file
    @st.cache_data
    def load_data():
        file_path = '/teamspace/studios/this_studio/runs/detect/train10/results.csv'  # Replace with your actual file path
        if not os.path.exists(file_path):
            st.error(f"File not found: {file_path}")
            return None
        try:
            data = pd.read_csv(file_path)
            return data
        except Exception as e:
            st.error(f"Error reading CSV file: {str(e)}")
            return None

    data = load_data()

    if data is None:
        st.stop()

    # Display summary statistics
    st.header("Training Summary")
    col1, col2, col3, col4 = st.columns(4)
    col1.metric("Total Epochs", data['epoch'].max())
    col2.metric("Final mAP50-95", f"{data['metrics/mAP50-95(B)'].iloc[-1]:.4f}")
    col3.metric("Best mAP50-95", f"{data['metrics/mAP50-95(B)'].max():.4f}")
    col4.metric("Training Time", f"{data['time'].iloc[-1]/3600:.2f} hours")

    # Create interactive charts
    st.header("Training Progress")

    # Loss curves
    st.subheader("Loss Curves")
    loss_fig = go.Figure()
    loss_fig.add_trace(go.Scatter(x=data['epoch'], y=data['train/box_loss'], mode='lines', name='Train Box Loss'))
    loss_fig.add_trace(go.Scatter(x=data['epoch'], y=data['train/cls_loss'], mode='lines', name='Train Class Loss'))
    loss_fig.add_trace(go.Scatter(x=data['epoch'], y=data['train/dfl_loss'], mode='lines', name='Train DFL Loss'))
    loss_fig.add_trace(go.Scatter(x=data['epoch'], y=data['val/box_loss'], mode='lines', name='Val Box Loss'))
    loss_fig.add_trace(go.Scatter(x=data['epoch'], y=data['val/cls_loss'], mode='lines', name='Val Class Loss'))
    loss_fig.add_trace(go.Scatter(x=data['epoch'], y=data['val/dfl_loss'], mode='lines', name='Val DFL Loss'))
    loss_fig.update_layout(title='Training and Validation Losses', xaxis_title='Epoch', yaxis_title='Loss')
    st.plotly_chart(loss_fig)

    # Metrics
    st.subheader("Performance Metrics")
    metrics_fig = go.Figure()
    metrics_fig.add_trace(go.Scatter(x=data['epoch'], y=data['metrics/precision(B)'], mode='lines', name='Precision'))
    metrics_fig.add_trace(go.Scatter(x=data['epoch'], y=data['metrics/recall(B)'], mode='lines', name='Recall'))
    metrics_fig.add_trace(go.Scatter(x=data['epoch'], y=data['metrics/mAP50(B)'], mode='lines', name='mAP50'))
    metrics_fig.add_trace(go.Scatter(x=data['epoch'], y=data['metrics/mAP50-95(B)'], mode='lines', name='mAP50-95'))
    metrics_fig.update_layout(title='Training Metrics', xaxis_title='Epoch', yaxis_title='Value')
    st.plotly_chart(metrics_fig)

    # Learning Rate
    st.subheader("Learning Rate")
    lr_fig = px.line(data, x='epoch', y=['lr/pg0', 'lr/pg1', 'lr/pg2'], title='Learning Rate Schedule')
    lr_fig.update_layout(xaxis_title='Epoch', yaxis_title='Learning Rate')
    st.plotly_chart(lr_fig)

    # Display raw data
    st.header("Raw Training Data")
    st.dataframe(data)

if __name__ == "__main__":
    create_dashboard()