# model.py
import torch
import torch.nn as nn

class YOLOModel(nn.Module):
    def __init__(self):
        super(YOLOModel, self).__init__()
        # Implement your YOLO model architecture here
        # This is a simplified example and should be replaced with your actual model
        self.features = nn.Sequential(
            nn.Conv2d(3, 64, kernel_size=3, padding=1),
            nn.ReLU(inplace=True),
            nn.MaxPool2d(kernel_size=2, stride=2),
            nn.Conv2d(64, 128, kernel_size=3, padding=1),
            nn.ReLU(inplace=True),
            nn.MaxPool2d(kernel_size=2, stride=2),
        )
        self.classifier = nn.Sequential(
            nn.Linear(128 * 104 * 104, 4096),
            nn.ReLU(inplace=True),
            nn.Linear(4096, 1000),
            nn.ReLU(inplace=True),
            nn.Linear(1000, 5 * 7 * 7),  # Adjust based on your YOLO grid size and number of classes
        )

    def forward(self, x):
        x = self.features(x)
        x = torch.flatten(x, 1)
        x = self.classifier(x)
        return x

def load_model():
    model = YOLOModel()
    # Load your trained weights here
    # model.load_state_dict(torch.load('path_to_your_weights.pth'))
    model.eval()
    return model